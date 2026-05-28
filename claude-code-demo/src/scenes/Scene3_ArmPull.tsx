import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import PaperBackground from "../components/PaperBackground";
import Terminal from "../components/Terminal";
import Mascot from "../components/Mascot";
import { clamp, lerp, track, outBack } from "../components/helpers";

/**
 * Scene 3 — Arm-Pull (8s)
 *
 * Mascot stands centered. One-by-one, he looks in a direction, extends
 * an arm OFF-SCREEN, and PULLS a terminal back into frame from that
 * direction. The arm visually connects from the mascot's body to a
 * "hand" that grabs the terminal corner.
 *
 * Sequence (target, source-direction, eye look direction):
 *   pull 1: top-right    (terminal slides in from upper-right off-screen, right arm)
 *   pull 2: top-left     (terminal from upper-left, left arm)
 *   pull 3: bottom-right (terminal from lower-right, right arm)
 *   pull 4: bottom-left  (terminal from lower-left, left arm)
 *
 * Beats (ms, each pull ≈ 1.6s):
 *   0–200     Mascot raises both arms slightly, eyes glow claude-orange
 *   200–1800  Pull 1 (top-right)
 *   1800–3400 Pull 2 (top-left)
 *   3400–5000 Pull 3 (bottom-right)
 *   5000–6600 Pull 4 (bottom-left)
 *   6600–7200 All 4 terminals placed; mascot lowers arms
 *   7200–8000 Mascot takes off hat — hat lifts, shrinks, moves to "pocket"
 *             and disappears (preparing for entry into terminal next scene)
 */

const MASCOT_CX = 960;
const MASCOT_CY = 540;

// Shoulder anchor points = the OUTER edge of each arm stub (the "nub")
// Mascot at 960,540 with pixel=14, grid 15×16 → 210×224 px
// SVG top-left at screen (960-105, 540-112) = (855, 428)
// Left arm at cols 0-1, outer edge x = 855 + 0 = 855
// Right arm at cols 13-14, outer edge x = 855 + 15*14 = 1065
// Arm rows 10-11, center y = 428 + 10.5*14 = 575 → use 582 for visual centering
const LEFT_SHOULDER = { x: 855, y: 582 };
const RIGHT_SHOULDER = { x: 1065, y: 582 };

// Sub-terminal final positions (where they land after being pulled in).
// rot2D is a tiny 2D rotation for "tossed paper card" feel — NOT 3D.
// Per Claude brand flat-only mandate, rotateX/rotateY/perspective are forbidden.
const PULL_TARGETS = [
  { name: "tr", finalX: 1560, finalY: 240,  startX: 2400, startY: -200, rot2D:  3, arm: "right" as const, look: { dx: 1, dy: -1 } },
  { name: "tl", finalX: 360,  finalY: 240,  startX: -480, startY: -200, rot2D: -3, arm: "left"  as const, look: { dx: -1, dy: -1 } },
  { name: "br", finalX: 1560, finalY: 840,  startX: 2400, startY: 1280, rot2D: -3, arm: "right" as const, look: { dx: 1, dy: 1 } },
  { name: "bl", finalX: 360,  finalY: 840,  startX: -480, startY: 1280, rot2D:  3, arm: "left"  as const, look: { dx: -1, dy: 1 } },
];

// Each pull starts at staggered ms. Each pull is 1100ms.
// Arm extends 0-450, terminal slides 250-850, arm retracts 700-1100.
const PULL_START = [100, 1100, 2100, 3100];
const PULL_DUR = 1100;

export const Scene3_ArmPull: React.FC = () => {
  const paperRef = useRef<HTMLDivElement>(null);

  const mascotWrapRef = useRef<HTMLDivElement>(null);
  const hatRef = useRef<SVGGElement>(null);
  const leftEyeRef = useRef<SVGRectElement>(null);
  const rightEyeRef = useRef<SVGRectElement>(null);
  const leftArmRef = useRef<SVGGElement>(null);
  const rightArmRef = useRef<SVGGElement>(null);

  // Each pull has its own arm path + hand + terminal
  const armPathRefs = [
    useRef<SVGPathElement>(null), useRef<SVGPathElement>(null),
    useRef<SVGPathElement>(null), useRef<SVGPathElement>(null),
  ];
  const handRefs = [
    useRef<SVGRectElement>(null), useRef<SVGRectElement>(null),
    useRef<SVGRectElement>(null), useRef<SVGRectElement>(null),
  ];
  const termRefs = [
    useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null),
  ];

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;

      // Paper drift
      if (paperRef.current) {
        const p = clamp(ms / 6500);
        paperRef.current.style.transform = `translateX(${lerp(30, 45, p)}px)`;
      }

      // Eyes stay BLACK throughout — no orange glow. They just shift position
      // to indicate the mascot's gaze direction during each pull.
      if (leftEyeRef.current) {
        leftEyeRef.current.setAttribute("fill", "#000000");
        leftEyeRef.current.style.filter = "";
      }
      if (rightEyeRef.current) {
        rightEyeRef.current.setAttribute("fill", "#000000");
        rightEyeRef.current.style.filter = "";
      }

      // ──────── Per-pull animation ────────
      for (let i = 0; i < 4; i++) {
        const target = PULL_TARGETS[i];
        const ts = PULL_START[i];
        const t = ms - ts;
        const armPath = armPathRefs[i].current;
        const hand = handRefs[i].current;
        const term = termRefs[i].current;
        if (!armPath || !hand || !term) continue;

        // Shoulder position depending on arm side
        const shoulder = target.arm === "right" ? RIGHT_SHOULDER : LEFT_SHOULDER;

        // Compute arm tip (hand) position over time:
        // Phase 1 (0-700): tip moves from shoulder OUTWARD past the screen edge toward (startX, startY)
        // Phase 2 (700-1300): tip follows terminal as it slides in
        // Phase 3 (1000-1500): arm retracts back to shoulder
        let tipX = shoulder.x;
        let tipY = shoulder.y;
        let armOpacity = 0;
        let termX = target.startX;
        let termY = target.startY;
        let termOpacity = 0;

        // Terminal scale stays 1.0 throughout — no more shrinking into mascot.
        // After landing in corner, terminal slides OUT horizontally off-screen
        // (left 2 slide LEFT, right 2 slide RIGHT) at scene-local 4100-4700ms.
        // Terminals reach their corner at scene-local: PULL_START[i] + 1000
        //   pull 1 lands at 1100, pull 2 at 2100, pull 3 at 3100, pull 4 at 4100
        // All slide out together starting at scene-local 4200ms so the 4th pull
        // gets a brief moment to settle.
        let termScale = 1;

        if (t >= 0) {
          if (t < 450) {
            // Arm reaches out to off-screen start position
            const reachP = eases.outCubic(t / 450);
            tipX = lerp(shoulder.x, target.startX, reachP);
            tipY = lerp(shoulder.y, target.startY, reachP);
            armOpacity = clamp(t / 80);
          } else if (t < 1000) {
            // Sub-terminal pulled FROM off-screen INTO its CORNER position
            // (not into the mascot). Scale stays 1.0 throughout the pull —
            // the terminal slides directly to its corner at full size.
            const pullP = eases.outCubic((t - 350) / 700);
            termX = lerp(target.startX, target.finalX, pullP);
            termY = lerp(target.startY, target.finalY, pullP);
            termOpacity = 1;

            // Arm tip = terminal's near corner (constant offset since scale=1).
            const armSide = target.arm === "right" ? 1 : -1;
            const cornerXOff = 260;
            const cornerYOff = 170;
            tipX = termX + (armSide > 0 ? -cornerXOff : cornerXOff);
            tipY = termY + (target.startY < MASCOT_CY ? cornerYOff : -cornerYOff);
            armOpacity = 1;
          } else if (t < 1100) {
            // Arm retracts back to shoulder; terminal sits in its corner.
            const retractP = (t - 1000) / 100;
            const armSide = target.arm === "right" ? 1 : -1;
            const cornerXOff = 260;
            const cornerYOff = 170;
            const cornerTipX = target.finalX + (armSide > 0 ? -cornerXOff : cornerXOff);
            const cornerTipY = target.finalY + (target.startY < MASCOT_CY ? cornerYOff : -cornerYOff);
            tipX = lerp(cornerTipX, shoulder.x, retractP);
            tipY = lerp(cornerTipY, shoulder.y, retractP);
            armOpacity = 1 - retractP;
            termX = target.finalX;
            termY = target.finalY;
            termOpacity = 1;
          } else {
            // After arm retracts: terminal holds in its corner at full scale.
            tipX = shoulder.x;
            tipY = shoulder.y;
            armOpacity = 0;
            termX = target.finalX;
            termY = target.finalY;
            termOpacity = 1;
          }
        }

        // ── SLIDE-OUT (all 4 terminals, scene-local 4200-4900ms) ──
        // Left 2 (tl, bl) slide off-screen LEFT; right 2 (tr, br) slide RIGHT.
        // Per Jeremy v9 feedback: no more "sucked into background" effect.
        const slideOutP = track(ms, 4200, 4900, eases.inOutCubic);
        if (slideOutP > 0 && t >= 0) {
          const slideDir = target.finalX > 960 ? 1 : -1; // right → +, left → -
          const slideOffset = slideDir * 1700 * slideOutP;
          termX = target.finalX + slideOffset;
          termY = target.finalY;
          termOpacity = 1; // opacity stays 1.0 throughout slide
          armOpacity = 0;
        }

        armPath.setAttribute("d", `M${shoulder.x},${shoulder.y} L${tipX},${tipY}`);
        armPath.style.opacity = String(armOpacity);
        hand.setAttribute("x", String(tipX - 15));
        hand.setAttribute("y", String(tipY - 15));
        hand.style.opacity = String(armOpacity);

        // Terminal position — FLAT 2D only. translate + rotate, scale stays 1.0.
        term.style.transform = `translate(${termX - 350}px, ${termY - 220}px) rotate(${target.rot2D}deg) scale(${termScale})`;
        term.style.opacity = String(termOpacity);

        // Eye direction: subtle 2-pixel shift to indicate gaze. Always black eyes.
        if (t >= 0 && t < 1100) {
          const lookProgress = t < 150 ? t / 150 : (t < 900 ? 1 : 1 - (t - 900) / 200);
          const lookDX = target.look.dx * 2 * clamp(lookProgress);
          const lookDY = target.look.dy * 2 * clamp(lookProgress);
          if (leftEyeRef.current) leftEyeRef.current.style.transform = `translate(${Math.round(lookDX)}px, ${Math.round(lookDY)}px)`;
          if (rightEyeRef.current) rightEyeRef.current.style.transform = `translate(${Math.round(lookDX)}px, ${Math.round(lookDY)}px)`;
        }
      }

      // After all pulls (t >= 4200), eyes return to neutral
      if (ms >= 4200) {
        if (leftEyeRef.current) leftEyeRef.current.style.transform = `translate(0, 0)`;
        if (rightEyeRef.current) rightEyeRef.current.style.transform = `translate(0, 0)`;
      }

      // Mascot arms — the actual SVG arm groups inside the mascot pivot
      // Default: arms hang slightly. During pulls: the active arm "side"
      // is hidden because we're drawing the ArmExtension. We use the in-mascot arms
      // mostly for the resting state.
      if (leftArmRef.current) {
        leftArmRef.current.style.transform = `rotate(0deg)`;
      }
      if (rightArmRef.current) {
        rightArmRef.current.style.transform = `rotate(0deg)`;
      }

      // ──────── Hat removal (4400-5100) ────────
      if (hatRef.current) {
        const hatP = clamp((ms - 4400) / 700);
        if (hatP < 0.4) {
          const pp = hatP / 0.4;
          const liftY = lerp(0, -40, eases.outCubic(pp));
          hatRef.current.style.transform = `translate(0, ${liftY}px)`;
          hatRef.current.style.opacity = "1";
        } else if (hatP < 0.7) {
          const pp = (hatP - 0.4) / 0.3;
          const liftY = lerp(-40, 100, eases.inCubic(pp));
          const sc = lerp(1, 0.6, pp);
          hatRef.current.style.transform = `translate(0, ${liftY}px) scale(${sc})`;
          hatRef.current.style.opacity = "1";
        } else {
          const pp = (hatP - 0.7) / 0.3;
          const sc = lerp(0.6, 0.2, eases.inCubic(pp));
          const op = 1 - pp;
          hatRef.current.style.transform = `translate(0, 100px) scale(${sc})`;
          hatRef.current.style.opacity = String(op);
        }
      }

      // ──────── Mascot fades out (5300-6500) ────────
      // The mascot stays at center (he doesn't fly anywhere). He simply fades out
      // as Scene 4 takes over — Scene 4 starts with the hero terminal framed
      // and the mascot already in its corner avatar position.
      if (mascotWrapRef.current) {
        const fadeP = track(ms, 5500, 6300, eases.outCubic);
        mascotWrapRef.current.style.opacity = String(1 - fadeP);
      }
    },
    []
  );

  return (
    <Timegroup
      mode="fixed"
      duration="6.5s"
      onFrame={handleFrame as any}
      className="absolute inset-0"
    >
      <PaperBackground ref={paperRef} />

      <div className="scene-3d" style={{ position: "absolute", inset: 0 }}>
        {/* Pulled-in terminals — each starts off-screen, animated in */}
        {PULL_TARGETS.map((target, i) => (
          <div
            key={i}
            ref={termRefs[i]}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 700,
              height: 440,
              opacity: 0,
              transformOrigin: "center center",
              willChange: "transform, opacity",
              zIndex: 4,
            }}
          >
            <Terminal width={700} height={440} title={`agent-${i + 1}`} bodyStyle={{ fontSize: 22, padding: "14px 20px" }}>
              <div style={{ color: "var(--claude-soft)" }}>⏺  ✓ findings ready</div>
              <div style={{ color: "var(--text-dim)", marginTop: 6 }}>⎿  reporting back to main session</div>
            </Terminal>
          </div>
        ))}

        {/* ARM EXTENSIONS — one per pull, drawn as SVG paths */}
        <svg
          width={1920}
          height={1080}
          viewBox="0 0 1920 1080"
          style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 7 }}
        >
          {armPathRefs.map((ref, i) => (
            <path
              key={`p${i}`}
              ref={ref}
              d=""
              stroke="var(--claude)"
              strokeWidth={22}
              strokeLinecap="square"
              fill="none"
              opacity={0}
              /* No drop-shadow — flat coral stroke per Claude brand rules. */
            />
          ))}
          {handRefs.map((ref, i) => (
            <rect
              key={`h${i}`}
              ref={ref}
              x={0}
              y={0}
              width={30}
              height={30}
              fill="var(--claude)"
              opacity={0}
            />
          ))}
        </svg>

        {/* Mascot wrapper */}
        <div
          style={{
            position: "absolute",
            left: MASCOT_CX,
            top: MASCOT_CY,
            transform: "translate(-50%, -50%)",
            zIndex: 8,
          }}
        >
          <div ref={mascotWrapRef} style={{ willChange: "transform" }}>
            <Mascot
              variant="cowboy"
              pixel={14}
              hatRef={hatRef}
              leftEyeRef={leftEyeRef}
              rightEyeRef={rightEyeRef}
              leftArmRef={leftArmRef}
              rightArmRef={rightArmRef}
            />
          </div>
        </div>
      </div>
    </Timegroup>
  );
};

export default Scene3_ArmPull;
