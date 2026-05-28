import React, { useCallback, useEffect, useRef } from "react";
import { Timegroup } from "@editframe/react";
import * as THREE from "three";
import { eases } from "animejs";
import { PaperBackground } from "../components/PaperBackground";
import { Sfx } from "../components/Sfx";

/**
 * Scene 5 — The Newsroom at Scale (6s) — REBUILT as cubicle zoom-out
 *
 * Opens close on ONE cubicle (desk, partition walls, paper stack, lamp pool).
 * Camera dollies way back to reveal a vast grid of identical cubicles —
 * communicating "a newsroom at scale, every role an AI agent."
 *
 * Animation libs:
 *   Three.js — full 3D scene, low-poly cubicles, instanced grid, camera dolly
 *              driven by Editframe's onFrame clock (no requestAnimationFrame)
 *   AnimeJS easings — outQuart shapes the camera dolly curve
 *   Advanced CSS — title overlay on top of the canvas
 *
 * Beat (ms):
 *   0–700        Title fades in
 *   500–6000     Camera dollies from close-in to wide-shot reveal
 *   3000–6000    Yellow desk lamps light up across the grid
 */

const clamp = (n: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const track = (
  ms: number,
  startMs: number,
  endMs: number,
  easeFn: (t: number) => number = eases.outCubic
) => easeFn(clamp((ms - startMs) / (endMs - startMs)));

const GRID_W = 8;
const GRID_D = 5;
const CUB_SPACING = 3.0;

export const Scene5_Pipeline: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const lampsRef = useRef<THREE.Mesh[]>([]);

  const titleRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = 1920, H = 1080;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(W, H, false);
    renderer.setPixelRatio(1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = false;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0E0E0D, 12, 50);

    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 200);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(6, 12, 8);
    scene.add(key);
    // Foreground fill — close to the hero cubicle so we can read its detail at the close-up
    const fill = new THREE.SpotLight(0xfff0d0, 1.4, 12, Math.PI / 4, 0.6, 1.2);
    fill.position.set(2, 4, 4);
    scene.add(fill);

    // Material palette — newsroom monochrome with warm wood touch
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x111110, roughness: 0.95 });
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1a1a18, roughness: 0.85 });
    const wallTopMat = new THREE.MeshStandardMaterial({ color: 0x2b2b27, roughness: 0.7 });
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x6e5d3f, roughness: 0.65 });
    const paperMat = new THREE.MeshStandardMaterial({ color: 0xece6d5, roughness: 0.9 });
    const paperColMat = new THREE.MeshStandardMaterial({ color: 0xf5f0e0, roughness: 0.9 });
    const screenLitMat = new THREE.MeshStandardMaterial({
      color: 0xfffae0,
      emissive: 0xfff0bb,
      emissiveIntensity: 0.55,
      roughness: 0.25,
    });
    const monitorMat = new THREE.MeshStandardMaterial({
      color: 0x050505,
      roughness: 0.18,
      metalness: 0.55,
    });
    const ceramicMat = new THREE.MeshStandardMaterial({ color: 0xe8e6dc, roughness: 0.4 });
    const darkCeramicMat = new THREE.MeshStandardMaterial({ color: 0x1a1a18, roughness: 0.3 });
    const lampShadeMat = new THREE.MeshStandardMaterial({
      color: 0xF5C518,
      emissive: 0xF5C518,
      emissiveIntensity: 1.6,
      roughness: 0.4,
    });

    // Floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor);

    // Build a cubicle as a reusable function
    const lamps: THREE.Mesh[] = [];
    const screens: THREE.Mesh[] = [];

    const buildCubicle = (x: number, z: number, isFirst: boolean): THREE.Group => {
      const g = new THREE.Group();
      g.position.set(x, 0, z);

      // Three partition walls
      const wallH = 1.45;
      const wallT = 0.06;
      const wallW = 2.4;

      const backWall = new THREE.Mesh(new THREE.BoxGeometry(wallW, wallH, wallT), wallMat);
      backWall.position.set(0, wallH / 2, -1.0);
      g.add(backWall);
      // top cap on back wall for definition
      const backCap = new THREE.Mesh(new THREE.BoxGeometry(wallW + 0.04, 0.03, wallT + 0.04), wallTopMat);
      backCap.position.set(0, wallH + 0.015, -1.0);
      g.add(backCap);

      const leftWall = new THREE.Mesh(new THREE.BoxGeometry(wallT, wallH, 2.0), wallMat);
      leftWall.position.set(-wallW / 2, wallH / 2, 0);
      g.add(leftWall);
      const leftCap = new THREE.Mesh(new THREE.BoxGeometry(wallT + 0.04, 0.03, 2.04), wallTopMat);
      leftCap.position.set(-wallW / 2, wallH + 0.015, 0);
      g.add(leftCap);

      const rightWall = new THREE.Mesh(new THREE.BoxGeometry(wallT, wallH, 2.0), wallMat);
      rightWall.position.set(wallW / 2, wallH / 2, 0);
      g.add(rightWall);
      const rightCap = new THREE.Mesh(new THREE.BoxGeometry(wallT + 0.04, 0.03, 2.04), wallTopMat);
      rightCap.position.set(wallW / 2, wallH + 0.015, 0);
      g.add(rightCap);

      // Pinned papers on the back wall (3 small cards)
      for (let i = 0; i < 3; i++) {
        const pin = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 0.005), paperColMat);
        pin.position.set(-0.65 + i * 0.55, 1.05, -0.97);
        g.add(pin);
      }

      // Desk slab (wider, longer)
      const desk = new THREE.Mesh(new THREE.BoxGeometry(wallW - 0.1, 0.05, 0.92), deskMat);
      desk.position.set(0, 0.72, -0.55);
      g.add(desk);

      // Desk apron/front
      const apron = new THREE.Mesh(new THREE.BoxGeometry(wallW - 0.1, 0.4, 0.02), deskMat);
      apron.position.set(0, 0.5, -0.11);
      g.add(apron);

      // Keyboard
      const keyboard = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.025, 0.18),
        new THREE.MeshStandardMaterial({ color: 0x1a1a18, roughness: 0.4 })
      );
      keyboard.position.set(0.15, 0.76, -0.32);
      g.add(keyboard);

      // Stack of newspapers (real columns visible from the side)
      for (let s = 0; s < 4; s++) {
        const sheet = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 0.012, 0.32),
          paperMat
        );
        sheet.position.set(-0.62, 0.755 + s * 0.014, -0.7);
        sheet.rotation.y = (s % 2 === 0 ? 0.02 : -0.025);
        g.add(sheet);
      }

      // Folded newspaper headline strip (thin yellow band)
      const headlineStrip = new THREE.Mesh(
        new THREE.BoxGeometry(0.46, 0.001, 0.04),
        new THREE.MeshStandardMaterial({ color: 0xF5C518, emissive: 0xF5C518, emissiveIntensity: 0.2 })
      );
      headlineStrip.position.set(-0.62, 0.81, -0.79);
      g.add(headlineStrip);

      // Coffee mug
      const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.10, 16), ceramicMat);
      mug.position.set(0.85, 0.795, -0.4);
      g.add(mug);
      const mugLiquid = new THREE.Mesh(
        new THREE.CylinderGeometry(0.052, 0.052, 0.005, 12),
        new THREE.MeshStandardMaterial({ color: 0x3b2818, roughness: 0.4 })
      );
      mugLiquid.position.set(0.85, 0.848, -0.4);
      g.add(mugLiquid);
      const mugHandle = new THREE.Mesh(
        new THREE.TorusGeometry(0.05, 0.013, 8, 14, Math.PI),
        ceramicMat
      );
      mugHandle.position.set(0.92, 0.795, -0.4);
      mugHandle.rotation.y = Math.PI / 2;
      g.add(mugHandle);

      // Monitor — slimmer bezel + lit screen
      const monitorBack = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.46, 0.035), monitorMat);
      monitorBack.position.set(0.18, 1.04, -0.6);
      g.add(monitorBack);
      // Lit screen face (slightly inset)
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.66, 0.40), screenLitMat.clone());
      screen.position.set(0.18, 1.04, -0.581);
      g.add(screen);
      screens.push(screen);
      // Stand
      const stand = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.20, 0.09),
        new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.5 })
      );
      stand.position.set(0.18, 0.84, -0.6);
      g.add(stand);
      // Stand base
      const standBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.26, 0.018, 0.18),
        new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.5 })
      );
      standBase.position.set(0.18, 0.745, -0.6);
      g.add(standBase);

      // Notebook open on the desk (small open book to the left of keyboard)
      const notebookBase = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.012, 0.24), paperColMat);
      notebookBase.position.set(-0.34, 0.753, -0.32);
      notebookBase.rotation.y = -0.08;
      g.add(notebookBase);
      // open page (lighter)
      const notebookPage = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.001, 0.22),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 })
      );
      notebookPage.position.set(-0.42, 0.761, -0.32);
      notebookPage.rotation.y = -0.08;
      g.add(notebookPage);

      // Pen on notebook
      const pen = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005, 0.005, 0.14, 8),
        darkCeramicMat
      );
      pen.position.set(-0.34, 0.764, -0.28);
      pen.rotation.z = Math.PI / 2;
      pen.rotation.y = 0.4;
      g.add(pen);

      // Desk lamp — arm + bulb shade
      const lampBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.02, 12),
        darkCeramicMat
      );
      lampBase.position.set(0.92, 0.755, -0.78);
      g.add(lampBase);
      const lampArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.28, 8),
        darkCeramicMat
      );
      lampArm.position.set(0.92, 0.91, -0.78);
      g.add(lampArm);
      const lamp = new THREE.Mesh(
        new THREE.SphereGeometry(0.085, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2),
        lampShadeMat.clone()
      );
      lamp.position.set(0.92, 1.05, -0.78);
      lamp.rotation.x = Math.PI;
      g.add(lamp);
      lamps.push(lamp);
      // Real light cast — only for the foreground hero cubicle (perf)
      if (isFirst) {
        const pl = new THREE.PointLight(0xffe066, 2.0, 5.5, 2);
        pl.position.set(0.85, 0.95, -0.5);
        g.add(pl);
        // Plus a secondary fill so the chair/back wall reads
        const pl2 = new THREE.PointLight(0xfff0c0, 0.9, 3.2, 2);
        pl2.position.set(0, 1.2, 0);
        g.add(pl2);
      }

      // Chair — rounded backing + seat + stem
      const chairBack = new THREE.Mesh(
        new THREE.BoxGeometry(0.62, 0.7, 0.06),
        new THREE.MeshStandardMaterial({ color: 0x1a1a18, roughness: 0.7 })
      );
      chairBack.position.set(0, 0.78, 0.42);
      chairBack.rotation.x = -0.05;
      g.add(chairBack);
      const chairSeat = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.08, 0.5),
        new THREE.MeshStandardMaterial({ color: 0x1a1a18, roughness: 0.7 })
      );
      chairSeat.position.set(0, 0.42, 0.35);
      g.add(chairSeat);
      const chairStem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.32, 8),
        new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.5 })
      );
      chairStem.position.set(0, 0.22, 0.35);
      g.add(chairStem);
      const chairBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.32, 0.04, 16),
        new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.5 })
      );
      chairBase.position.set(0, 0.04, 0.35);
      g.add(chairBase);

      return g;
    };

    // Spawn the grid
    const startX = -((GRID_W - 1) * CUB_SPACING) / 2;
    const startZ = -((GRID_D - 1) * CUB_SPACING) / 2;
    for (let i = 0; i < GRID_W; i++) {
      for (let j = 0; j < GRID_D; j++) {
        const isFirst = i === Math.floor(GRID_W / 2) && j === GRID_D - 1;
        const cub = buildCubicle(startX + i * CUB_SPACING, startZ + j * CUB_SPACING, isFirst);
        scene.add(cub);
      }
    }

    // Hero cubicle location — the foreground center cubicle
    const heroZ = startZ + (GRID_D - 1) * CUB_SPACING;
    // Open with an editorial 3/4 magazine shot of the hero cubicle interior
    // — slightly off-center so we see the monitor, lamp, and chair together
    camera.position.set(0.9, 2.0, heroZ + 2.4);
    camera.lookAt(0.2, 1.0, heroZ - 0.6);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    lampsRef.current = lamps;

    // Initial render
    renderer.render(scene, camera);

    return () => {
      renderer.dispose();
      scene.traverse((o) => {
        if ((o as any).geometry) (o as any).geometry.dispose();
        if ((o as any).material) {
          const m = (o as any).material;
          if (Array.isArray(m)) m.forEach((mm) => mm.dispose());
          else m.dispose();
        }
      });
    };
  }, []);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;
      const t = ms / 1000;

      // Title
      const tP = track(ms, 200, 1000, eases.outQuart);
      if (titleRef.current) {
        titleRef.current.style.opacity = String(tP);
        titleRef.current.style.transform = `translateY(${lerp(-18, 0, tP)}px)`;
      }
      const sP = track(ms, 400, 1300, eases.outQuart);
      if (subRef.current) {
        subRef.current.style.opacity = String(sP);
        subRef.current.style.transform = `translateY(${lerp(-12, 0, sP)}px)`;
      }

      // Camera dolly — hero close-up → wide reveal
      // Linger ~1.4s on the close-up so the cubicle detail can read,
      // then pull back to the full-grid scale shot.
      const camera = cameraRef.current;
      if (camera) {
        const heroZ = -((GRID_D - 1) * CUB_SPACING) / 2 + (GRID_D - 1) * CUB_SPACING;
        const dollyP = track(ms, 1400, 6000, eases.outQuart);
        const camX = lerp(0.9, 0, dollyP);
        const camY = lerp(2.0, 14, dollyP);
        const camZ = lerp(heroZ + 2.4, heroZ + 28, dollyP);
        camera.position.set(camX, camY, camZ);
        camera.lookAt(
          lerp(0.2, 0, dollyP),
          lerp(1.0, 1, dollyP),
          lerp(heroZ - 0.6, -2, dollyP)
        );
        camera.updateProjectionMatrix();
      }

      // Lamps stagger-light across grid (visual pulse)
      lampsRef.current.forEach((lamp, idx) => {
        const cellStart = 1500 + idx * 90;
        const lampP = track(ms, cellStart, cellStart + 400, eases.outQuart);
        const mat = lamp.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = lerp(0.0, 1.6, lampP);
      });

      // Count tick — number of "agents" indicated as we pan back
      if (countRef.current) {
        const cP = track(ms, 2500, 5800, eases.outQuart);
        const val = Math.floor(lerp(1, GRID_W * GRID_D, cP));
        countRef.current.textContent = String(val);
      }

      // Render the 3D scene
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      if (renderer && scene && camera) renderer.render(scene, camera);
    },
    []
  );

  return (
    <Timegroup
      mode="fixed"
      duration="6s"
      onFrame={handleFrame as any}
      className="absolute inset-0 flex items-center justify-center"
    >
      {/* Solid dark base (newsroom interior shouldn't be cream) */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #050505 0%, #0E0E0D 100%)" }}
      />

      {/* SFX — camera pulls back glitch, then ascending pings as cubicles light up */}
      <Sfx cue="glitch" at={1.40} dur={1.8} volume={0.35} />
      <Sfx cue="ping" at={3.10} dur={0.7} volume={0.30} />
      <Sfx cue="ping" at={4.10} dur={0.7} volume={0.30} />
      <Sfx cue="success" at={5.20} dur={1.0} volume={0.50} />

      {/* Title — top */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 80px",
          zIndex: 10,
        }}
      >
        <div
          className="scene-label"
          ref={titleRef}
          style={{
            color: "rgba(245,242,234,0.55)",
            opacity: 0,
            marginBottom: 12,
          }}
        >
          Part 05 · The Newsroom Floor
        </div>
        <div
          ref={subRef}
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 64,
            fontWeight: 900,
            letterSpacing: "-0.028em",
            color: "#F5F2EA",
            lineHeight: 1.05,
            opacity: 0,
          }}
        >
          Every role, <span style={{ color: "#F5C518" }}>at scale.</span>
        </div>
      </div>

      {/* 3D canvas */}
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

      {/* Bottom right: agent count tick — appears as camera reveals scale */}
      <div
        style={{
          position: "absolute",
          right: 60,
          bottom: 60,
          zIndex: 10,
          color: "#F5F2EA",
          fontFamily: "Inter, sans-serif",
          textAlign: "right",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.32em",
            color: "rgba(245,242,234,0.5)",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Agents active
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: "#F5C518",
            lineHeight: 1,
          }}
        >
          <span ref={countRef}>1</span>
        </div>
      </div>
    </Timegroup>
  );
};
