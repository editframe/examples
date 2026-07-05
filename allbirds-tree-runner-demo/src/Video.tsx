import React, { useCallback, useRef } from "react";
import { Timegroup, Audio, Image, Video as Clip } from "@editframe/react";
import { clamp, lerp, track, easeOutCubic, easeInCubic, easeInOutQuad } from "./components/helpers";
import { Reveal } from "./components/Reveal";
import {
  DURATION_MS, W, H, OAT, SAND, COOL_OAT, INK, STONE, LINE,
  SAGE, DUSTY_BLUE, TAUPE, GEOGRAPH, MONO, PRICE,
  WELL_A, WELL_B, BEATS,
} from "./constants";

const MUSIC = "/assets/music-bed.mp3";
// Product, colorway, material and poster imagery — real files served from src/assets/ (no base64).
const POSTER_PORTRAIT = "/assets/poster-portrait.jpg";
const POSTER_LANDSCAPE = "/assets/poster-landscape.jpg";
const TREE_LEFT = "/assets/tree-left.png";
const TREE_TOP = "/assets/tree-top.png";
const MAT_MERINO_TEE = "/assets/mat-merino-tee.png";
const CW_ANTHRACITE = "/assets/cw-anthracite.png";
const CW_AUBURN = "/assets/cw-auburn.png";
const CW_BLACK = "/assets/cw-black.png";
const CW_GOLD = "/assets/cw-gold.png";
const CW_LIGHTGREY = "/assets/cw-lightgrey.png";
const CW_MUSHROOM = "/assets/cw-mushroom.png";
const CW_NAVY = "/assets/cw-navy.png";
const CW_PORT = "/assets/cw-port.png";
const CW_SEASPRAY = "/assets/cw-seaspray.png";

/**
 * ALLBIRDS — Tree Runner NZ · 9:16 · "Natural Materials" cut
 * 1080×1920 @ 30fps. ONE fixed Timegroup clock — all times = MASTER ms.
 *
 * LEAN: motion EMERGES FROM THE MATERIALS. Wool fibers, the tree-fiber knit weave and
 * sugarcane drift and settle into shapes, frames and type. Transitions are soft MATERIAL
 * MORPHS — one texture gently knits/dissolves into the next scene's backdrop. The float
 * reads as fibers settling. Tactile, warm, organic. Strictly on-brand: oat canvas, soft
 * black ink, muted desaturated palette, weightless float, Geograph tiny letter-spaced caps.
 *
 * BEATS (master ms):
 *   HOOK    0      → 2000   wordmark + EFFORTLESS BY NATURE, fibers settle on oat
 *   HERO    2000   → 6000   Tree Runner NZ floats weightless on a soft sand tile, $100
 *   WELL_A  6000   → 11000  portrait lifestyle well (poster inside) + WEAR ALL DAY COMFORT
 *   FEAT    11000  → 14500  MERINO · TREE FIBER · SUGARCANE + carbon number (mono)
 *   WELL_B  14500  → 19000  landscape well (poster inside) + TREAD LIGHTER
 *   RANGE   19000  → 22500  the family across the muted palette + main preview
 *   CTA     22500  → 25000  wordmark + SHOP NOW + B Corp + allbirds.com on oat
 *
 * TRANSITIONS (each distinct, material-morph / calm-float):
 *   T1 2.0s  weave densifies + light-bloom; wordmark dissolves to fibers, hero descends in
 *   T2 6.0s  hero floats up & out; sand tile grows behind it and crops into WELL_A frame
 *   T3 11.0s circular knit-reveal wipes the well into a tree-fiber knit macro backdrop
 *   T4 14.5s material chips drift up; sugarcane landscape mat parallax-drifts into WELL_B
 *   T5 19.0s WELL_B contracts & multiplies into the floating colorway grid
 *   T6 22.5s grid recedes as fibers; preview shrinks; wordmark + SHOP NOW bloom on oat
 */

// product photos sit on a near-white cream; we seat them on soft tiles / multiply-blend so no white box shows on oat.

export const Video: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  // shared ambient
  const grainRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const weaveRef = useRef<HTMLDivElement>(null);
  // floating wool-fiber particles (ambient, all beats)
  const fiberRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ── HOOK ──
  const hookRef = useRef<HTMLDivElement>(null);
  const hookMarkRef = useRef<HTMLDivElement>(null);
  const hookSubRef = useRef<HTMLDivElement>(null);
  const hookRuleRef = useRef<HTMLDivElement>(null);

  // ── HERO ──
  const heroRef = useRef<HTMLDivElement>(null);
  const heroTileRef = useRef<HTMLDivElement>(null);
  const heroShoeRef = useRef<HTMLElement>(null);
  const heroShadowRef = useRef<HTMLDivElement>(null);
  const heroNameRef = useRef<HTMLDivElement>(null); // letter-spacing tween — stays imperative

  // ── WELL_A ──
  const wellARef = useRef<HTMLDivElement>(null);
  const wellAFrameRef = useRef<HTMLDivElement>(null);
  const wellAPosterRef = useRef<HTMLDivElement>(null);
  const wellACornersRef = useRef<(HTMLDivElement | null)[]>([]);

  // ── FEAT (materials) ──
  const featRef = useRef<HTMLDivElement>(null);
  const knitMacroRef = useRef<HTMLDivElement>(null);
  const featChipRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ── WELL_B ──
  const wellBRef = useRef<HTMLDivElement>(null);
  const wellBFrameRef = useRef<HTMLDivElement>(null);
  const wellBPosterRef = useRef<HTMLDivElement>(null);
  const wellBCornersRef = useRef<(HTMLDivElement | null)[]>([]);

  // ── RANGE ──
  const rangeRef = useRef<HTMLDivElement>(null);
  const rangeTileRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ── CTA ──
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaMarkRef = useRef<HTMLDivElement>(null);
  const ctaShopRef = useRef<HTMLDivElement>(null);
  const ctaProofRef = useRef<HTMLDivElement>(null);
  const ctaDomainRef = useRef<HTMLDivElement>(null);
  const ctaMiniShoeRef = useRef<HTMLElement>(null);

  const RANGE = [
    { img: CW_MUSHROOM, name: "Mushroom" },
    { img: CW_NAVY, name: "Navy" },
    { img: CW_LIGHTGREY, name: "Light Grey" },
    { img: CW_ANTHRACITE, name: "Anthracite" },
    { img: CW_SEASPRAY, name: "Seaspray" },
    { img: CW_PORT, name: "Port" },
    { img: CW_GOLD, name: "Gold" },
    { img: CW_BLACK, name: "Black" },
    { img: CW_AUBURN, name: "Auburn" },
  ];

  const handleFrame = useCallback((arg: any) => {
    const ms = arg?.ownCurrentTimeMs ?? -1;
    if (ms < 0) return;

    // ════════════════════ AMBIENT (all beats) ════════════════════
    // grain — always on, very subtle (matte linen feel)
    if (grainRef.current) {
      grainRef.current.style.opacity = "0.05";
    }
    // ambient wool-fiber drift — slow upward float, never stops (the "float" as fibers settling)
    fiberRefs.current.forEach((el, i) => {
      if (!el) return;
      const seed = i * 137.5;
      const speed = 9000 + (i % 4) * 2600;
      const phase = ((ms + seed * 30) % speed) / speed; // 0..1 loop
      const baseX = (seed * 7.3) % W;
      const drift = Math.sin((ms / 1700) + i) * 26;
      const y = lerp(H + 40, -60, phase);
      const fade = Math.sin(phase * Math.PI); // fade in/out across the loop
      el.style.transform = `translate(${baseX + drift}px, ${y}px)`;
      el.style.opacity = String(0.14 * fade);
    });

    // ════════════════════ T1 weave + bloom (1500-2000) ════════════════════
    // densify the oat weave then bloom a soft light from center as the hero arrives.
    if (weaveRef.current) {
      const dens = track(ms, 1450, 2050, easeInOutQuad);
      const settle = track(ms, 2050, 2900, easeOutCubic);
      weaveRef.current.style.opacity = String(lerp(0.0, 0.5, dens) * (1 - settle * 0.55));
    }
    if (bloomRef.current) {
      const up = track(ms, 1500, 2050, easeOutCubic);
      const down = track(ms, 2050, 3100, easeInOutQuad);
      bloomRef.current.style.opacity = String(lerp(0, 0.85, up) * (1 - down));
    }

    // ════════════════════ HOOK 0–2000 ════════════════════
    {
      const exit = track(ms, 1500, 2050, easeInCubic); // dissolve into fibers/bloom (T1)
      const vis = 1 - exit;
      if (hookRef.current) {
        hookRef.current.style.opacity = String(clamp(vis));
        hookRef.current.style.pointerEvents = "none";
        hookRef.current.style.visibility = ms < 2150 ? "visible" : "hidden";
      }
      if (hookMarkRef.current) {
        const inP = track(ms, 120, 900, easeOutCubic);
        // on exit the wordmark lifts up & lets go (fibers releasing)
        const lift = lerp(0, -34, exit);
        hookMarkRef.current.style.opacity = String(clamp(track(ms, 120, 760) * vis));
        hookMarkRef.current.style.transform = `translateY(${lerp(34, 0, inP) + lift}px)`;
        hookMarkRef.current.style.letterSpacing = `${lerp(0.06, -0.02, inP)}em`;
        hookMarkRef.current.style.filter = `blur(${lerp(0, 4, exit)}px)`;
      }
      if (hookRuleRef.current) {
        const inP = track(ms, 560, 1300, easeOutCubic);
        hookRuleRef.current.style.opacity = String(clamp(inP * vis * 0.9));
        hookRuleRef.current.style.transform = `scaleX(${lerp(0, 1, inP)})`;
      }
      if (hookSubRef.current) {
        const inP = track(ms, 760, 1500, easeOutCubic);
        const lift = lerp(0, -22, exit);
        hookSubRef.current.style.opacity = String(clamp(track(ms, 760, 1300) * vis));
        hookSubRef.current.style.transform = `translateY(${lerp(20, 0, inP) + lift}px)`;
        hookSubRef.current.style.filter = `blur(${lerp(0, 3, exit)}px)`;
      }
    }

    // ════════════════════ HERO 2000–6000 ════════════════════
    {
      // enter via T1 (descend in as light settles), exit via T2 (float up & out)
      const enter = track(ms, 1850, 2700, easeOutCubic);
      const t2 = track(ms, 5450, 6050, easeInOutQuad); // float-up handoff to WELL_A
      if (heroRef.current) {
        const vis = clamp(enter) * (1 - t2);
        heroRef.current.style.opacity = String(vis);
        heroRef.current.style.visibility = (ms > 1700 && ms < 6150) ? "visible" : "hidden";
      }
      // the soft sand TILE: grows from a seed at center as hero arrives; in T2 it KEEPS growing
      // and re-crops into the portrait WELL_A frame (carry-through surface).
      if (heroTileRef.current) {
        const grow = track(ms, 1950, 2900, easeOutCubic);
        // base tile rect (centered, portrait-ish)
        const baseW = lerp(120, 720, grow), baseH = lerp(120, 980, grow);
        // T2: morph tile toward WELL_A rect (it becomes the well surface)
        const tw = lerp(baseW, WELL_A.w, t2);
        const th = lerp(baseH, WELL_A.h, t2);
        const cx = lerp(W / 2, WELL_A.x + WELL_A.w / 2, t2);
        const cy = lerp(H * 0.46, WELL_A.y + WELL_A.h / 2, t2);
        heroTileRef.current.style.width = `${tw}px`;
        heroTileRef.current.style.height = `${th}px`;
        heroTileRef.current.style.left = `${cx - tw / 2}px`;
        heroTileRef.current.style.top = `${cy - th / 2}px`;
        heroTileRef.current.style.borderRadius = `${lerp(40, WELL_A.r, t2)}px`;
        heroTileRef.current.style.opacity = String(clamp(grow) * (1 - track(ms, 6000, 6120)));
        // gently fade the sand tile's warmth toward the well as it morphs
        heroTileRef.current.style.background = t2 > 0.02
          ? `linear-gradient(160deg, ${SAND} 0%, ${COOL_OAT} 100%)`
          : `radial-gradient(120% 120% at 50% 38%, ${SAND} 0%, ${COOL_OAT} 100%)`;
      }
      if (heroShoeRef.current) {
        const float = Math.sin(ms / 1400) * 12; // weightless bob
        const ty = lerp(70, 0, enter) + float - lerp(0, 240, t2); // T2 floats up & out
        const sc = lerp(0.86, 1, enter) * lerp(1, 0.78, t2);
        const rot = lerp(-3, 0, enter) + Math.sin(ms / 2000) * 0.8;
        heroShoeRef.current.style.transform = `translate(-50%, -50%) translateY(${ty}px) scale(${sc}) rotate(${rot}deg)`;
        heroShoeRef.current.style.opacity = String(clamp(enter) * (1 - track(ms, 5650, 6000)));
      }
      if (heroShadowRef.current) {
        const float = Math.sin(ms / 1400) * 12;
        const sh = clamp(enter) * (1 - t2);
        heroShadowRef.current.style.opacity = String(0.16 * sh * (1 - Math.abs(float) / 28));
        heroShadowRef.current.style.transform = `translate(-50%, -50%) scaleX(${lerp(0.8, 1, enter) - Math.abs(float) / 200})`;
      }
      // heroEyebrowRef / heroPriceRef: declarative <Reveal> in JSX (see below).
      // heroNameRef keeps its letter-spacing tween here — <Reveal> only handles opacity + translateY.
      if (heroNameRef.current) {
        const p = track(ms, 2850, 3600, easeOutCubic);
        const e = track(ms, 5450, 5900, easeInCubic);
        heroNameRef.current.style.opacity = String(clamp(p) * (1 - e));
        heroNameRef.current.style.transform = `translateY(${lerp(20, 0, p)}px)`;
        heroNameRef.current.style.letterSpacing = `${lerp(0.04, 0.005, p)}em`;
      }
    }

    // ════════════════════ WELL_A 6000–11000 ════════════════════
    {
      // frame assembles during T2 (tile already morphed into rect). Corners draw on, copy floats.
      const frameIn = track(ms, 5950, 6500, easeOutCubic);
      const t3 = track(ms, 10550, 11050, easeInOutQuad); // knit-reveal handoff
      if (wellARef.current) {
        const vis = clamp(track(ms, 5900, 6300)) * (1 - track(ms, 10850, 11080));
        wellARef.current.style.opacity = String(vis);
        wellARef.current.style.visibility = (ms > 5850 && ms < 11150) ? "visible" : "hidden";
      }
      if (wellAFrameRef.current) {
        wellAFrameRef.current.style.opacity = String(clamp(frameIn));
      }
      // well footage reveals as it fills (base64 image-seq below)
      if (wellAPosterRef.current) {
        wellAPosterRef.current.style.opacity = String(clamp(track(ms, 6050, 6650)));
      }
      wellACornersRef.current.forEach((el, i) => {
        if (!el) return;
        const p = track(ms, 6250 + i * 80, 6650 + i * 80, easeOutCubic);
        el.style.opacity = String(clamp(p));
        el.style.transform = `scale(${lerp(0.4, 1, p)})`;
      });
      // wellAEyebrowRef / wellACopyRef: declarative <Reveal> in JSX (see below).
    }

    // ════════════════════ T3 knit-reveal (10550-11050) ════════════════════
    // a circular tree-fiber knit macro wipes outward, dissolving WELL_A into the materials backdrop.
    if (knitMacroRef.current) {
      const wipe = track(ms, 10550, 11200, easeInOutQuad);      // grow circular reveal
      const hold = 1 - track(ms, 13900, 14550, easeInOutQuad);  // fade as FEAT exits (T4)
      const r = lerp(0, 130, wipe); // % radius
      knitMacroRef.current.style.clipPath = `circle(${r}% at 50% 42%)`;
      knitMacroRef.current.style.opacity = String((wipe > 0 ? 1 : 0) * hold);
    }

    // ════════════════════ FEAT (materials) 11000–14500 ════════════════════
    {
      const enter = track(ms, 10750, 11400, easeOutCubic);
      const t4 = track(ms, 13950, 14550, easeInOutQuad);
      if (featRef.current) {
        const vis = clamp(enter) * (1 - track(ms, 14300, 14550));
        featRef.current.style.opacity = String(vis);
        featRef.current.style.visibility = (ms > 10650 && ms < 14600) ? "visible" : "hidden";
      }
      // featTitleRef: declarative <Reveal> in JSX (see below).
      // material chips stagger in (merino · tree fiber · sugarcane); each on its chalky tile
      featChipRefs.current.forEach((el, i) => {
        if (!el) return;
        const start = 11500 + i * 360;
        const p = track(ms, start, start + 600, easeOutCubic);
        const lift = lerp(0, -28, t4);
        el.style.opacity = String(clamp(p) * (1 - t4));
        el.style.transform = `translateY(${lerp(34, 0, p) + lift}px)`;
      });
      // carbonRef: declarative <Reveal> in JSX (see below).
    }

    // ════════════════════ WELL_B 14500–19000 ════════════════════
    {
      // T4: a sugarcane-tone landscape mat parallax-drifts down into the WELL_B frame surface.
      const matIn = track(ms, 14050, 14750, easeOutCubic);  // mat drifts in (starts during T4)
      const frameIn = track(ms, 14450, 15050, easeOutCubic);
      const t5 = track(ms, 18450, 19050, easeInOutQuad);    // contract & multiply handoff
      if (wellBRef.current) {
        const vis = clamp(track(ms, 14100, 14700)) * (1 - track(ms, 18800, 19080));
        wellBRef.current.style.opacity = String(vis);
        wellBRef.current.style.visibility = (ms > 14000 && ms < 19150) ? "visible" : "hidden";
      }
      if (wellBFrameRef.current) {
        // parallax drift-in from above, settling onto the well rect
        const ty = lerp(-60, 0, matIn);
        wellBFrameRef.current.style.opacity = String(clamp(frameIn));
        wellBFrameRef.current.style.transform = `translateY(${ty - lerp(0, 30, t5)}px) scale(${lerp(1, 0.84, t5)})`;
        wellBFrameRef.current.style.filter = `blur(${lerp(6, 0, matIn)}px)`; // rack-focus resolve
      }
      if (wellBPosterRef.current) {
        wellBPosterRef.current.style.opacity = String(clamp(track(ms, 14350, 15050)));
      }
      wellBCornersRef.current.forEach((el, i) => {
        if (!el) return;
        const p = track(ms, 14750 + i * 80, 15150 + i * 80, easeOutCubic);
        el.style.opacity = String(clamp(p) * (1 - t5));
        el.style.transform = `scale(${lerp(0.4, 1, p)})`;
      });
      // wellBCopyRef / wellBProofRef: declarative <Reveal> in JSX (see below).
    }

    // ════════════════════ RANGE 19000–22500 ════════════════════
    {
      const enter = track(ms, 18750, 19500, easeOutCubic);
      const t6 = track(ms, 21950, 22550, easeInOutQuad);
      if (rangeRef.current) {
        const vis = clamp(track(ms, 18700, 19200)) * (1 - track(ms, 22300, 22550));
        rangeRef.current.style.opacity = String(vis);
        rangeRef.current.style.visibility = (ms > 18650 && ms < 22600) ? "visible" : "hidden";
      }
      // rangeTitleRef / rangeSubRef: declarative <Reveal> in JSX (see below).
      // tiles float in (multiplied from WELL_B in T5); calm float settle; T6 they drift up away
      rangeTileRefs.current.forEach((el, i) => {
        if (!el) return;
        const start = 19050 + i * 130;
        const p = track(ms, start, start + 620, easeOutCubic);
        const bob = Math.sin((ms / 1500) + i * 0.6) * 5;
        const liftAway = lerp(0, -36 - (i % 3) * 14, t6);
        el.style.opacity = String(clamp(p) * (1 - t6));
        el.style.transform = `translateY(${lerp(40, 0, p) + bob + liftAway}px) scale(${lerp(0.82, 1, p)})`;
      });
    }

    // ════════════════════ CTA 22500–25000 ════════════════════
    {
      const enter = track(ms, 22150, 22900, easeOutCubic); // blooms in during/after T6
      if (ctaRef.current) {
        ctaRef.current.style.opacity = String(clamp(track(ms, 22150, 22650)));
        ctaRef.current.style.visibility = ms > 22050 ? "visible" : "hidden";
      }
      if (ctaMiniShoeRef.current) {
        // the range main-preview shrinks into a small floating mark above the wordmark
        const p = track(ms, 22250, 23050, easeOutCubic);
        const float = Math.sin(ms / 1500) * 6;
        ctaMiniShoeRef.current.style.opacity = String(clamp(p));
        ctaMiniShoeRef.current.style.transform = `translate(-50%, -50%) translateY(${lerp(40, 0, p) + float}px) scale(${lerp(1.25, 1, p)})`;
      }
      if (ctaMarkRef.current) {
        const p = track(ms, 22500, 23250, easeOutCubic);
        ctaMarkRef.current.style.opacity = String(clamp(p));
        ctaMarkRef.current.style.transform = `translateY(${lerp(24, 0, p)}px)`;
        ctaMarkRef.current.style.letterSpacing = `${lerp(0.05, -0.015, p)}em`;
      }
      if (ctaShopRef.current) {
        const p = track(ms, 22850, 23600, easeOutCubic);
        ctaShopRef.current.style.opacity = String(clamp(p));
        ctaShopRef.current.style.transform = `translateY(${lerp(18, 0, p)}px)`;
        // gentle breathing on the button
        ctaShopRef.current.style.setProperty("--pulse", String(1 + Math.sin(ms / 600) * 0.012));
      }
      if (ctaProofRef.current) {
        const p = track(ms, 23200, 23900, easeOutCubic);
        ctaProofRef.current.style.opacity = String(clamp(p));
        ctaProofRef.current.style.transform = `translateY(${lerp(16, 0, p)}px)`;
      }
      if (ctaDomainRef.current) {
        const p = track(ms, 23550, 24250, easeOutCubic);
        ctaDomainRef.current.style.opacity = String(clamp(p));
        ctaDomainRef.current.style.transform = `translateY(${lerp(14, 0, p)}px)`;
      }
    }
  }, []);

  // ── style helpers ──
  const eyebrow: React.CSSProperties = {
    fontFamily: GEOGRAPH, fontWeight: 500, textTransform: "uppercase",
    color: STONE, letterSpacing: "3px",
  };
  const wellFrameBase = (well: typeof WELL_A): React.CSSProperties => ({
    position: "absolute", left: well.x, top: well.y, width: well.w, height: well.h,
    borderRadius: well.r, overflow: "hidden", background: COOL_OAT,
  });
  const cornerMark = (corner: string): React.CSSProperties => {
    const s: React.CSSProperties = { position: "absolute", width: 26, height: 26, opacity: 0, willChange: "transform,opacity" };
    const b = `2px solid ${INK}`;
    if (corner.includes("t")) s.top = -1; else s.bottom = -1;
    if (corner.includes("l")) s.left = -1; else s.right = -1;
    if (corner === "tl") { s.borderTop = b; s.borderLeft = b; s.transformOrigin = "top left"; }
    if (corner === "tr") { s.borderTop = b; s.borderRight = b; s.transformOrigin = "top right"; }
    if (corner === "bl") { s.borderBottom = b; s.borderLeft = b; s.transformOrigin = "bottom left"; }
    if (corner === "br") { s.borderBottom = b; s.borderRight = b; s.transformOrigin = "bottom right"; }
    return s;
  };

  // a procedural tree-fiber KNIT weave texture (layered dotted gradients) — used as macro backdrop
  const knitTexture = (tone: string, alt: string): string =>
    `radial-gradient(circle at 0 0, ${alt} 18%, transparent 19%) 0 0/22px 22px,
     radial-gradient(circle at 11px 11px, ${alt} 18%, transparent 19%) 0 0/22px 22px,
     linear-gradient(135deg, ${tone} 0%, ${alt} 100%)`;

  return (
    <Timegroup
      mode="fixed"
      duration={`${DURATION_MS}ms`}
      workbench
      onFrame={handleFrame as any}
      className="w-[1080px] h-[1920px] relative overflow-hidden"
      style={{ background: OAT }}
    >
      {/* Music bed on the composition timeline. */}
      <Audio src={MUSIC} volume={1} />
      <div ref={rootRef} style={{ position: "absolute", inset: 0, background: OAT, fontFamily: GEOGRAPH, color: INK }}>

        {/* ambient oat weave (densifies in T1) */}
        <div ref={weaveRef} style={{
          position: "absolute", inset: 0, opacity: 0, pointerEvents: "none",
          background: `radial-gradient(circle at 0 0, ${LINE} 1px, transparent 1.5px) 0 0/26px 26px`,
          mixBlendMode: "multiply",
        }} />

        {/* ambient wool fibers (drift up forever) */}
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={`f${i}`} ref={(el) => { fiberRefs.current[i] = el; }} style={{
            position: "absolute", top: 0, left: 0, width: i % 3 === 0 ? 5 : 3, height: i % 3 === 0 ? 5 : 3,
            borderRadius: "50%", background: i % 2 ? STONE : TAUPE, opacity: 0, willChange: "transform,opacity",
          }} />
        ))}

        {/* ───────────── HOOK ───────────── */}
        <div ref={hookRef} style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: "44%", textAlign: "center" }}>
            <div ref={hookMarkRef} style={{
              fontFamily: GEOGRAPH, fontWeight: 500, fontSize: 96, color: INK,
              lineHeight: 1, willChange: "transform,opacity,filter",
            }}>allbirds</div>
            <div ref={hookRuleRef} style={{
              width: 64, height: 1, background: LINE, margin: "30px auto 0",
              transformOrigin: "center", willChange: "transform,opacity",
            }} />
            <div ref={hookSubRef} style={{
              ...eyebrow, fontSize: 19, marginTop: 26, willChange: "transform,opacity,filter",
            }}>Effortless by Nature</div>
          </div>
        </div>

        {/* center light-bloom (T1) */}
        <div ref={bloomRef} style={{
          position: "absolute", left: W / 2 - 520, top: H * 0.46 - 520, width: 1040, height: 1040,
          borderRadius: "50%", opacity: 0, pointerEvents: "none",
          background: `radial-gradient(circle, rgba(255,253,248,0.9) 0%, rgba(255,253,248,0.0) 62%)`,
        }} />

        {/* ───────────── HERO ───────────── */}
        <div ref={heroRef} style={{ position: "absolute", inset: 0, visibility: "hidden" }}>
          {/* soft sand tile (grows in T1, morphs to WELL_A in T2) */}
          <div ref={heroTileRef} style={{
            position: "absolute", left: W / 2 - 360, top: H * 0.46 - 490, width: 720, height: 980,
            borderRadius: 40, background: `radial-gradient(120% 120% at 50% 38%, ${SAND} 0%, ${COOL_OAT} 100%)`,
            willChange: "transform,width,height,left,top,opacity",
          }} />
          {/* contact shadow */}
          <div ref={heroShadowRef} style={{
            position: "absolute", left: W / 2, top: H * 0.46 + 250, width: 420, height: 60,
            borderRadius: "50%", background: `radial-gradient(ellipse, ${STONE} 0%, transparent 70%)`,
            transform: "translate(-50%,-50%)", opacity: 0, filter: "blur(6px)",
          }} />
          {/* the hero shoe (seated on tile so its cream photo bg reads as the tile, no white box) */}
          <Image ref={heroShoeRef} src={TREE_LEFT} style={{
            position: "absolute", left: W / 2, top: H * 0.46, width: 760, height: "auto",
            transform: "translate(-50%,-50%)", opacity: 0, willChange: "transform,opacity",
            mixBlendMode: "multiply",
          }} />
          {/* copy */}
          <div style={{ position: "absolute", left: 0, right: 0, top: H * 0.46 + 360, textAlign: "center" }}>
            <Reveal enter={[2650, 3300]} exit={[5450, 5900]} y={16} style={{ ...eyebrow, fontSize: 16, letterSpacing: "3px" }}>Tree Runner NZ</Reveal>
            <div ref={heroNameRef} style={{
              fontFamily: GEOGRAPH, fontWeight: 500, fontSize: 64, color: INK, marginTop: 16,
              opacity: 0, willChange: "transform,opacity",
            }}>Tread lightly</div>
            <Reveal enter={[3150, 3850]} exit={[5450, 5900]} y={18} style={{
              fontFamily: GEOGRAPH, fontWeight: 400, fontSize: 30, color: STONE, marginTop: 18, letterSpacing: "0.04em",
            }}>{PRICE}</Reveal>
          </div>
        </div>

        {/* ───────────── WELL_A (portrait) ───────────── */}
        <div ref={wellARef} style={{ position: "absolute", inset: 0, visibility: "hidden" }}>
          <div ref={wellAFrameRef} style={{ ...wellFrameBase(WELL_A), opacity: 0, willChange: "opacity",
            boxShadow: "0 30px 80px rgba(33,33,33,0.10)", border: `1px solid ${LINE}` }}>
            {/* WELL_A footage — poster + Video on the timeline (offset to 6–11s) */}
            <div ref={wellAPosterRef} style={{ position: "absolute", inset: 0, opacity: 0 }}>
              <Image src={POSTER_PORTRAIT} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <Clip src="/assets/well-a-people-walk.mp4" offset={`${BEATS.wellA.in}ms`} duration={`${BEATS.wellA.out - BEATS.wellA.in}ms`} sourcein="0.5s" mute style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            {/* thin inner mat line */}
            <div style={{ position: "absolute", inset: 10, border: `1px solid rgba(255,255,255,0.5)`, borderRadius: WELL_A.r - 8, pointerEvents: "none" }} />
          </div>
          {/* corner marks just outside the frame */}
          {["tl", "tr", "bl", "br"].map((c, i) => (
            <div key={c} ref={(el) => { wellACornersRef.current[i] = el; }}
              style={{ ...cornerMark(c), left: c.includes("l") ? WELL_A.x - 13 : undefined, right: c.includes("r") ? W - (WELL_A.x + WELL_A.w) - 13 : undefined, top: c.includes("t") ? WELL_A.y - 13 : undefined, bottom: c.includes("b") ? H - (WELL_A.y + WELL_A.h) - 13 : undefined }} />
          ))}
          {/* copy block above the well */}
          <div style={{ position: "absolute", left: WELL_A.x, top: WELL_A.y - 170, width: WELL_A.w }}>
            <Reveal enter={[6550, 7100]} exit={[10450, 10850]} y={18} style={{ ...eyebrow, fontSize: 15 }}>Comfort, naturally</Reveal>
            <Reveal enter={[6800, 7500]} exit={[10450, 10850]} y={22} style={{
              fontFamily: GEOGRAPH, fontWeight: 500, fontSize: 54, color: INK, marginTop: 14, lineHeight: 1.05,
            }}>Wear-all-day<br />comfort</Reveal>
          </div>
        </div>

        {/* ───────────── KNIT MACRO (T3 reveal → FEAT backdrop) ───────────── */}
        <div ref={knitMacroRef} style={{
          position: "absolute", inset: 0, opacity: 0, clipPath: "circle(0% at 50% 42%)",
          background: knitTexture(SAND, TAUPE), pointerEvents: "none",
        }}>
          {/* warm wash over the knit so type stays readable but the tree-fiber weave still reads */}
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(135% 110% at 50% 36%, rgba(236,233,226,0.30) 0%, rgba(236,233,226,0.74) 72%)` }} />
        </div>

        {/* ───────────── FEAT (materials) ───────────── */}
        <div ref={featRef} style={{ position: "absolute", inset: 0, visibility: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center" }}>
            <Reveal enter={[11150, 11800]} exit={[13950, 14550]} y={22} exitY={-24} easeOut="in-out-quad">
              <div style={{ ...eyebrow, fontSize: 15 }}>Made from</div>
              <div style={{ fontFamily: GEOGRAPH, fontWeight: 500, fontSize: 56, color: INK, marginTop: 14 }}>Natural materials</div>
            </Reveal>
          </div>
          {/* three material chips on chalky tiles */}
          <div style={{ position: "absolute", left: 90, right: 90, top: 470, display: "flex", flexDirection: "column", gap: 30 }}>
            {[
              { tone: SAGE, name: "ZQ Merino Wool", desc: "soft, breathable, temperature-regulating", img: MAT_MERINO_TEE },
              { tone: TAUPE, name: "Tree Fiber", desc: "FSC eucalyptus knit — cool & light", img: TREE_TOP },
              { tone: DUSTY_BLUE, name: "Sugarcane", desc: "SweetFoam™ carbon-negative sole", img: null },
            ].map((m, i) => (
              <div key={m.name} ref={(el) => { featChipRefs.current[i] = el; }} style={{
                display: "flex", alignItems: "center", gap: 26, opacity: 0, willChange: "transform,opacity",
                background: COOL_OAT, borderRadius: 22, border: `1px solid ${LINE}`, padding: "22px 26px",
                boxShadow: "0 18px 44px rgba(33,33,33,0.06)",
              }}>
                {/* material swatch */}
                <div style={{
                  width: 132, height: 132, borderRadius: 18, flexShrink: 0, overflow: "hidden",
                  background: m.img ? OAT : knitTexture(m.tone, COOL_OAT),
                  position: "relative", border: `1px solid ${LINE}`,
                }}>
                  {m.img && <Image src={m.img} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply" }} />}
                  {!m.img && <div style={{ position: "absolute", inset: 0, background: knitTexture(m.tone, OAT), opacity: 0.55 }} />}
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ ...eyebrow, fontSize: 13, letterSpacing: "2px", color: m.tone === DUSTY_BLUE ? "#6E8C95" : STONE }}>{`0${i + 1}`}</div>
                  <div style={{ fontFamily: GEOGRAPH, fontWeight: 500, fontSize: 34, color: INK, marginTop: 4 }}>{m.name}</div>
                  <div style={{ fontFamily: GEOGRAPH, fontWeight: 400, fontSize: 21, color: STONE, marginTop: 4 }}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
          {/* carbon footprint badge (mono) */}
          <Reveal enter={[12650, 13350]} exit={[13950, 14550]} y={20} exitY={-20} easeOut="in-out-quad" style={{
            position: "absolute", left: 90, right: 90, top: 1620, display: "flex", justifyContent: "center", alignItems: "center", gap: 18,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, border: `1px solid ${LINE}`, borderRadius: 999, padding: "16px 28px", background: OAT }}>
              <div style={{ fontFamily: MONO, fontSize: 30, color: INK, letterSpacing: "0.04em" }}>7.1 KG CO₂E</div>
              <div style={{ width: 1, height: 26, background: LINE }} />
              <div style={{ ...eyebrow, fontSize: 14, letterSpacing: "2px" }}>per pair · B Corp since 2016</div>
            </div>
          </Reveal>
        </div>

        {/* ───────────── WELL_B (landscape) ───────────── */}
        <div ref={wellBRef} style={{ position: "absolute", inset: 0, visibility: "hidden" }}>
          {/* copy above */}
          <div style={{ position: "absolute", left: WELL_B.x, top: WELL_B.y - 230, width: WELL_B.w }}>
            <Reveal enter={[15150, 15850]} exit={[18450, 18850]} y={22} style={{
              fontFamily: GEOGRAPH, fontWeight: 500, fontSize: 92, color: INK, lineHeight: 1,
            }}>Tread Lighter</Reveal>
            <Reveal enter={[15500, 16200]} exit={[18450, 18850]} y={18} style={{ ...eyebrow, fontSize: 16, marginTop: 22 }}>
              Give light. Tread lighter. · Carbon-negative sole
            </Reveal>
          </div>
          <div ref={wellBFrameRef} style={{ ...wellFrameBase(WELL_B), opacity: 0, willChange: "transform,opacity,filter",
            boxShadow: "0 30px 80px rgba(33,33,33,0.10)", border: `1px solid ${LINE}` }}>
            {/* WELL_B footage — poster + Video on the timeline (offset to 14.5–19s) */}
            <div ref={wellBPosterRef} style={{ position: "absolute", inset: 0, opacity: 0 }}>
              <Image src={POSTER_LANDSCAPE} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <Clip src="/assets/well-b-material-macro.mp4" offset={`${BEATS.wellB.in}ms`} duration={`${BEATS.wellB.out - BEATS.wellB.in}ms`} sourcein="0.5s" mute style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ position: "absolute", inset: 10, border: `1px solid rgba(255,255,255,0.5)`, borderRadius: WELL_B.r - 8, pointerEvents: "none" }} />
          </div>
          {["tl", "tr", "bl", "br"].map((c, i) => (
            <div key={c} ref={(el) => { wellBCornersRef.current[i] = el; }}
              style={{ ...cornerMark(c), left: c.includes("l") ? WELL_B.x - 13 : undefined, right: c.includes("r") ? W - (WELL_B.x + WELL_B.w) - 13 : undefined, top: c.includes("t") ? WELL_B.y - 13 : undefined, bottom: c.includes("b") ? H - (WELL_B.y + WELL_B.h) - 13 : undefined }} />
          ))}
        </div>

        {/* ───────────── RANGE ───────────── */}
        <div ref={rangeRef} style={{ position: "absolute", inset: 0, visibility: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center" }}>
            <Reveal enter={[19150, 19800]} exit={[21950, 22550]} y={20} exitY={-22} easeOut="in-out-quad" style={{ fontFamily: GEOGRAPH, fontWeight: 500, fontSize: 64, color: INK }}>The Range</Reveal>
            <Reveal enter={[19350, 20000]} exit={[21950, 22550]} y={16} easeOut="in-out-quad" style={{ ...eyebrow, fontSize: 16, marginTop: 18 }}>Find your pair · in nature's palette</Reveal>
          </div>
          {/* 3x3 calm float grid of colorways on soft tiles */}
          <div style={{ position: "absolute", left: 90, right: 90, top: 430, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26 }}>
            {RANGE.map((cw, i) => (
              <div key={cw.name} ref={(el) => { rangeTileRefs.current[i] = el; }} style={{
                opacity: 0, willChange: "transform,opacity",
                background: i % 3 === 0 ? OAT : (i % 3 === 1 ? COOL_OAT : SAND),
                borderRadius: 20, border: `1px solid ${LINE}`, padding: "16px 12px 14px",
                boxShadow: "0 16px 38px rgba(33,33,33,0.06)", textAlign: "center",
              }}>
                <div style={{ width: "100%", height: 200, position: "relative" }}>
                  <Image src={cw.img} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "multiply" }} />
                </div>
                <div style={{ ...eyebrow, fontSize: 13, letterSpacing: "1.6px", marginTop: 6 }}>{cw.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ───────────── CTA ───────────── */}
        <div ref={ctaRef} style={{ position: "absolute", inset: 0, visibility: "hidden" }}>
          {/* mini floating preview shoe above the wordmark */}
          <Image ref={ctaMiniShoeRef} src={TREE_LEFT} style={{
            position: "absolute", left: W / 2, top: "33%", width: 360, height: "auto",
            transform: "translate(-50%,-50%)", opacity: 0, willChange: "transform,opacity", mixBlendMode: "multiply",
          }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: "49%", textAlign: "center" }}>
            <div ref={ctaMarkRef} style={{ fontFamily: GEOGRAPH, fontWeight: 500, fontSize: 92, color: INK, lineHeight: 1, opacity: 0, willChange: "transform,opacity" }}>allbirds</div>
            <div ref={ctaShopRef} style={{
              display: "inline-flex", marginTop: 40, opacity: 0, willChange: "transform,opacity",
              transform: "scale(var(--pulse,1))",
            }}>
              <div style={{
                background: INK, color: OAT, borderRadius: 999, padding: "22px 64px",
                fontFamily: GEOGRAPH, fontWeight: 500, fontSize: 26, letterSpacing: "1.5px", textTransform: "uppercase",
              }}>Shop Now</div>
            </div>
            <div ref={ctaProofRef} style={{ ...eyebrow, fontSize: 15, marginTop: 44, opacity: 0, willChange: "transform,opacity" }}>
              B Corp since 2016 · carbon-negative
            </div>
            <div ref={ctaDomainRef} style={{ fontFamily: GEOGRAPH, fontWeight: 400, fontSize: 24, color: STONE, marginTop: 16, letterSpacing: "0.06em", opacity: 0, willChange: "transform,opacity" }}>
              allbirds.com
            </div>
          </div>
        </div>

        {/* matte grain (always on, very subtle) */}
        <div ref={grainRef} style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.05, mixBlendMode: "multiply",
          backgroundImage: `radial-gradient(rgba(33,33,33,0.5) 0.5px, transparent 0.6px)`,
          backgroundSize: "3px 3px",
        }} />
      </div>
    </Timegroup>
  );
};
