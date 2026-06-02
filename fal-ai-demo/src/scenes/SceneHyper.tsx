/**
 * SceneHyper — fal "Hyper Generation Grid" (8000–9400ms master)
 * Scene-local duration: 1400ms
 *
 * Restyled to violet/lavender world — matches the dashboard act palette.
 * Deep violet (#3B0764) bg with radial violet glow, NOT near-black.
 * This makes the grid read as part of the same visual world.
 * Shortcut "and here's the speed" flourish after the dashboard reveal.
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { track, lerp, clamp, outBack } from "../components/helpers";
import {
  tile_grid_portrait, tile_grid_boy, tile_grid_heroine, tile_grid_creature, tile_grid_cyber2,
  tile_grid_junior, tile_grid_pigslow, tile_grid_cyber, tile_grid_neon, tile_grid_knot,
  tile_recent_portrait, tile_recent_boy, tile_recent_cyber, tile_recent_creature, tile_recent_cyber2,
  tile_col_knot,
} from "../assets/tile-bitmaps";

const SCENE_DURATION = 1400;

// ─── 4×4 grid tile definitions — real AI-generated media (base64 inlined) ──────────
const TILE_IMGS = [
  tile_grid_portrait,
  tile_grid_boy,
  tile_grid_heroine,
  tile_grid_creature,
  tile_grid_cyber2,
  tile_grid_junior,
  tile_grid_pigslow,
  tile_grid_cyber,
  tile_grid_neon,
  tile_grid_knot,
  tile_recent_portrait,
  tile_recent_boy,
  tile_recent_cyber,
  tile_recent_creature,
  tile_recent_cyber2,
  tile_col_knot,
];

// Fallback gradient per tile (shown if img fails to load)
const TILE_GRADIENTS = [
  "linear-gradient(135deg, #3a2a2a, #5a3a3a)",
  "linear-gradient(145deg, #6c4020, #9c6040)",
  "linear-gradient(125deg, #1a2838, #2a3848)",
  "linear-gradient(155deg, #3a2a4a, #6a4a7a)",
  "linear-gradient(135deg, #2d3748, #3a4a5a)",
  "linear-gradient(145deg, #2a3020, #4a5030)",
  "linear-gradient(125deg, #3a2050, #6a4080)",
  "linear-gradient(155deg, #1a3040, #2a5060)",
  "linear-gradient(135deg, #3a3020, #6a5030)",
  "linear-gradient(145deg, #1a2a3a, #2a4050)",
  "linear-gradient(125deg, #3a2a3a, #5a3a5a)",
  "linear-gradient(155deg, #2a3a20, #4a6030)",
  "linear-gradient(135deg, #2a1a3a, #4a2a5a)",
  "linear-gradient(145deg, #3a2020, #5a3030)",
  "linear-gradient(125deg, #1a2a4a, #2a4060)",
  "linear-gradient(155deg, #3a1a2a, #5a2a4a)",
];

// Shimmer overlay: diagonal light sweep per tile
// We track per-tile shimmer via transform on shimmerRefs

// ─── Model ticker names ────────────────────────────────────────────────────────
const MODEL_NAMES = [
  "FLUX.1 [schnell]",
  "Kling 2.0",
  "Veo 3",
  "Sora 2",
  "Nano Banana",
  "Recraft V4",
];
const MODEL_SWAP_MS = 180; // each name shown for 180ms

// ─── Layout constants ─────────────────────────────────────────────────────────
const GRID_COLS = 4;
const GRID_ROWS = 4;
const TILE_W = 380;
const TILE_H = 195;
const TILE_GAP = 10;
const GRID_TOTAL_W = GRID_COLS * TILE_W + (GRID_COLS - 1) * TILE_GAP; // 1550
const GRID_TOTAL_H = GRID_ROWS * TILE_H + (GRID_ROWS - 1) * TILE_GAP; // 810
const GRID_LEFT = (1920 - GRID_TOTAL_W) / 2; // 185
const GRID_TOP  = 60;

// Stagger: 40ms per tile (row-major)
const STAGGER_MS = 40;
const TILE_REVEAL_DUR = 320; // each tile's blur-up + scale-in

// Tile cascade starts at scene-local 100ms
const CASCADE_START = 100;
// Per-tile: starts at CASCADE_START + index * STAGGER_MS
// Last tile (index 15): starts at 100 + 15*40 = 700ms, ends at 700+320 = 1020ms ✓

// Latency badge: starts counting at 350ms (well after first tiles appear)
const BADGE_COUNT_START = 350;
const BADGE_COUNT_END   = 850; // counts 0.00 → 0.42 over 500ms
const BADGE_CHECK_MS    = 900; // checkmark appears

// Model ticker: starts at 600ms (when most tiles are visible)
const TICKER_START = 600;

// outExpo easing for snappy resolve
const outExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * clamp(t));

export function SceneHyper() {
  const tileRefs    = useRef<Array<HTMLDivElement | null>>(Array(16).fill(null));
  const shimmerRefs = useRef<Array<HTMLDivElement | null>>(Array(16).fill(null));
  const badgeNumRef = useRef<HTMLSpanElement>(null);
  const badgeCheckRef = useRef<HTMLSpanElement>(null);
  const badgeWrapRef  = useRef<HTMLDivElement>(null);
  const tickerRef     = useRef<HTMLDivElement>(null);
  const tickerTextRef = useRef<HTMLSpanElement>(null);
  const statChipRef   = useRef<HTMLDivElement>(null);
  const headlineRef   = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {

    // ── Tile cascade ──
    for (let i = 0; i < 16; i++) {
      const tile = tileRefs.current[i];
      const shimmer = shimmerRefs.current[i];
      if (!tile) continue;

      const tileStart = CASCADE_START + i * STAGGER_MS;
      const tileEnd   = tileStart + TILE_REVEAL_DUR;
      const t = outExpo(clamp((ms - tileStart) / TILE_REVEAL_DUR));

      if (ms < tileStart) {
        tile.style.opacity = "0";
        tile.style.transform = "scale(0.88)";
        tile.style.filter = "blur(14px)";
        if (shimmer) shimmer.style.transform = "translateX(-120%)";
      } else {
        tile.style.opacity = String(t);
        tile.style.transform = `scale(${lerp(0.88, 1, t)})`;
        tile.style.filter = `blur(${lerp(14, 0, t)}px)`;

        // Shimmer sweep: runs during reveal window
        if (shimmer) {
          const shimT = clamp((ms - tileStart) / (TILE_REVEAL_DUR * 0.9));
          shimmer.style.transform = `translateX(${lerp(-120, 120, shimT)}%)`;
          shimmer.style.opacity = String(ms < tileEnd ? lerp(0, 1, shimT) * (1 - shimT) * 1.8 : 0);
        }
      }
    }

    // ── Latency badge ──
    const badgeNum   = badgeNumRef.current;
    const badgeCheck = badgeCheckRef.current;
    const badgeWrap  = badgeWrapRef.current;

    if (badgeWrap) {
      const wrapT = outExpo(clamp((ms - 300) / 200));
      badgeWrap.style.opacity = String(wrapT);
      badgeWrap.style.transform = `scale(${lerp(0.85, 1, wrapT)})`;
    }

    if (badgeNum) {
      if (ms < BADGE_COUNT_START) {
        badgeNum.textContent = "0.00s";
      } else if (ms < BADGE_COUNT_END) {
        const countT = clamp((ms - BADGE_COUNT_START) / (BADGE_COUNT_END - BADGE_COUNT_START));
        const val = lerp(0, 0.42, countT);
        badgeNum.textContent = val.toFixed(2) + "s";
      } else {
        badgeNum.textContent = "0.42s";
      }
    }

    if (badgeCheck) {
      badgeCheck.style.opacity = String(ms >= BADGE_CHECK_MS ? outExpo(clamp((ms - BADGE_CHECK_MS) / 150)) : "0");
      badgeCheck.style.transform = `scale(${ms >= BADGE_CHECK_MS ? lerp(0.5, 1, outExpo(clamp((ms - BADGE_CHECK_MS) / 150))) : 0.5})`;
    }

    // ── Model ticker ──
    const tickerText = tickerTextRef.current;
    const ticker     = tickerRef.current;

    if (ticker) {
      const tickerT = outExpo(clamp((ms - (TICKER_START - 100)) / 200));
      ticker.style.opacity = String(ms >= TICKER_START - 100 ? tickerT : 0);
    }

    if (tickerText && ms >= TICKER_START) {
      const elapsed = ms - TICKER_START;
      const rawIdx  = Math.floor(elapsed / MODEL_SWAP_MS);
      const modelIdx = rawIdx % MODEL_NAMES.length;
      const swapProgress = (elapsed % MODEL_SWAP_MS) / MODEL_SWAP_MS;

      // translateY flick + blur on swap transition (first 20% = fly in, last 10% = fly out)
      let ty = 0;
      let blur = 0;
      let opacity = 1;
      if (swapProgress < 0.15) {
        // enter from below
        const entT = outExpo(swapProgress / 0.15);
        ty = lerp(8, 0, entT);
        blur = lerp(4, 0, entT);
        opacity = lerp(0, 1, entT);
      } else if (swapProgress > 0.85) {
        // exit upward
        const exitT = (swapProgress - 0.85) / 0.15;
        ty = lerp(0, -8, exitT);
        blur = lerp(0, 4, exitT);
        opacity = lerp(1, 0, exitT);
      }

      tickerText.style.transform = `translateY(${ty}px)`;
      tickerText.style.filter = `blur(${blur}px)`;
      tickerText.style.opacity = String(opacity);
      tickerText.textContent = MODEL_NAMES[modelIdx];
    }

    // ── Stat chip ──
    const statChip = statChipRef.current;
    if (statChip) {
      const chipT = outExpo(clamp((ms - 700) / 250));
      statChip.style.opacity = String(ms >= 700 ? chipT : 0);
    }

    // ── Headline fade-in ──
    const headline = headlineRef.current;
    if (headline) {
      const ht = outExpo(clamp((ms - 50) / 300));
      headline.style.opacity = String(ht);
    }

  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE_DURATION}ms`}
      style={{
        position: "absolute",
        inset: 0,
        background: "#3B0764",
        overflow: "hidden",
      }}
    >
      {/* Violet radial glow — brighter on violet bg to create depth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(167,108,245,0.35) 0%, rgba(89,28,135,0.15) 50%, transparent 75%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── 4×4 Tile Grid ── */}
      <div
        style={{
          position: "absolute",
          left: GRID_LEFT,
          top: GRID_TOP,
          width: GRID_TOTAL_W,
          height: GRID_TOTAL_H,
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_COLS}, ${TILE_W}px)`,
          gridTemplateRows: `repeat(${GRID_ROWS}, ${TILE_H}px)`,
          gap: TILE_GAP,
          zIndex: 1,
        }}
      >
        {TILE_IMGS.map((imgSrc, i) => (
          <div
            key={i}
            ref={(el) => { tileRefs.current[i] = el; }}
            style={{
              borderRadius: 10,
              background: TILE_GRADIENTS[i],
              overflow: "hidden",
              position: "relative",
              opacity: 0,
              transformOrigin: "center center",
              willChange: "opacity, transform, filter",
              border: "1px solid rgba(167,108,245,0.25)",
            }}
          >
            {/* Real AI-generated media thumbnail */}
            <img
              src={imgSrc}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              draggable={false}
            />
            {/* Shimmer overlay */}
            <div
              ref={(el) => { shimmerRefs.current[i] = el; }}
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.22) 50%, transparent 80%)",
                transform: "translateX(-120%)",
                opacity: 0,
                pointerEvents: "none",
                borderRadius: 10,
              }}
            />
            {/* Model tag in corner */}
            <div
              style={{
                position: "absolute",
                top: 7,
                left: 8,
                fontSize: 10,
                fontWeight: 700,
                color: "rgba(255,255,255,0.85)",
                fontFamily: "'Inter', system-ui, sans-serif",
                letterSpacing: "0.3px",
                background: "rgba(0,0,0,0.55)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              {["FLUX", "Kling", "Veo", "Sora", "FLUX", "Kling", "Nano", "Rec", "Veo", "Sora", "FLUX", "Kling", "Nano", "Veo", "fal", "Sora"][i]}
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom bar: latency badge + model ticker + stat chip ── */}
      <div
        style={{
          position: "absolute",
          left: GRID_LEFT,
          top: GRID_TOP + GRID_TOTAL_H + 22,
          width: GRID_TOTAL_W,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 2,
        }}
      >
        {/* Latency badge — brand violet #7C3AED with glow */}
        <div
          ref={badgeWrapRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(167,108,245,0.30)",
            border: "1.5px solid rgba(167,108,245,0.70)",
            borderRadius: 24,
            padding: "7px 16px",
            opacity: 0,
            transformOrigin: "left center",
            boxShadow: "0 0 18px rgba(167,108,245,0.45)",
          }}
        >
          <span style={{ fontSize: 14, color: "#ffffff" }}>⚡</span>
          <span
            ref={badgeNumRef}
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "'Courier New', monospace",
              letterSpacing: "0.5px",
              minWidth: 60,
            }}
          >
            0.00s
          </span>
          <span
            ref={badgeCheckRef}
            style={{
              fontSize: 18,
              color: "#4ade80",
              opacity: 0,
              transformOrigin: "center",
              display: "inline-block",
            }}
          >
            ✓
          </span>
        </div>

        {/* Model ticker — bigger + brighter for legibility at speed */}
        <div
          ref={tickerRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: 0,
          }}
        >
          <span style={{ fontSize: 17, color: "#b0a8d0", fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 500 }}>
            generating with
          </span>
          <span
            ref={tickerTextRef}
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#f0e8ff",
              fontFamily: "'Inter', system-ui, sans-serif",
              letterSpacing: "-0.3px",
              display: "inline-block",
              minWidth: 200,
            }}
          >
            FLUX.1 [schnell]
          </span>
        </div>

        {/* Stat chip: "600+ models · one API" — larger, higher contrast */}
        <div
          ref={statChipRef}
          style={{
            background: "rgba(167,108,245,0.25)",
            border: "1.5px solid rgba(167,108,245,0.55)",
            borderRadius: 24,
            padding: "8px 22px",
            fontSize: 16,
            fontWeight: 700,
            color: "#e8d8ff",
            fontFamily: "'Inter', system-ui, sans-serif",
            letterSpacing: "0.2px",
            opacity: 0,
          }}
        >
          600+ models · one API
        </div>
      </div>

      {/* ── Scene headline (top, above grid) — larger + higher contrast ── */}
      <div
        ref={headlineRef}
        style={{
          position: "absolute",
          left: GRID_LEFT,
          top: 12,
          fontSize: 16,
          fontWeight: 700,
          color: "rgba(230,215,255,0.95)",
          fontFamily: "'Inter', system-ui, sans-serif",
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          opacity: 0,
          zIndex: 3,
          background: "rgba(167,108,245,0.18)",
          border: "1px solid rgba(167,108,245,0.35)",
          padding: "5px 14px",
          borderRadius: 8,
        }}
      >
        fal inference engine™ · up to 50× faster
      </div>

      {/* onFrame driver */}
      <Timegroup
        mode="fixed"
        duration={`${SCENE_DURATION}ms`}
        onFrame={onFrame as any}
        style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none" }}
      />
    </Timegroup>
  );
}

SceneHyper.duration = SCENE_DURATION;
