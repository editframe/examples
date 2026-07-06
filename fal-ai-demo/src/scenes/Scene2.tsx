/**
 * Scene 2 — "Introducing fal Assets" Reveal (8000–11200ms master)
 * Scene-local duration: 3200ms
 *
 * Reference-faithful:
 *  - Background: solid deep violet — NO drifting thumbnail tiles.
 *  - Text is CRISP — no transform/blur on text layers; opacity + translateY only.
 *  - "fal Assets" builds in: "fal" visible first, then "Assets" slides in from the right.
 *  - Subline: typewriter reveal "Beta" → "Beta now" → "Beta now available", done as a
 *    3-step `clip-path` reveal (`steps(3, jump-end)`) instead of swapping `textContent`
 *    every frame — the full string is always in the DOM, so it stays crisp/selectable.
 *  - Pixel squares: sparse corner-hugging squares, each twinkling on its own cycle —
 *    declarative infinite `@keyframes` with a per-particle negative `animation-delay`
 *    (same technique as `AmbientField`'s fiber drift in the allbirds reference), computed
 *    once at module load. No `onFrame`, no refs, no per-frame math anywhere in this scene.
 *
 * Beat breakdown (scene-local):
 *  0ms:    deep violet bg; corner pixel squares twinkling
 *  150ms:  "Introducing" pill fades in (no transform — crisp)
 *  500ms:  "fal" part of headline fades up — crisp
 *  900ms:  "Assets" part slides in from right (outBack overshoot)
 *  1200ms: typewriter starts on "Beta now available"
 *  3200ms: end → Scene 3
 */
import React from "react";
import { Timegroup } from "@editframe/react";
import { TraceLayer } from "../components/TraceLayer";
import { TRACE_MODE, TRACE_OPACITY, SCENES, SCENE2_START_MS } from "../constants";

const SCENE_DURATION = SCENES.scene2.duration;

// ─── Pixel config — small, sparse, corner-hugging (matches reference) ────────
function lcg(s: number) {
  let state = s;
  return () => {
    state = (1664525 * state + 1013904223) & 0xffffffff;
    return (state >>> 0) / 0xffffffff;
  };
}

interface PixelCfg {
  x: number;
  y: number;
  w: number;
  h: number;
  cycleDuration: number;
  offset: number;
}

function buildPixels(count: number, seed: number): PixelCfg[] {
  const rand = lcg(seed * 31337 + 7919);
  const cfgs: PixelCfg[] = [];
  // Denser scatter across all quadrants — reference has pixel shards throughout
  const clusterCenters = [
    { cx: 60, cy: 80 }, // top-left
    { cx: 1820, cy: 60 }, // top-right
    { cx: 1780, cy: 980 }, // bottom-right
    { cx: 40, cy: 500 }, // left-middle
    { cx: 500, cy: 30 }, // top-center-left
    { cx: 1400, cy: 50 }, // top-center-right
    { cx: 60, cy: 880 }, // bottom-left
    { cx: 960, cy: 80 }, // top-center
    { cx: 1820, cy: 500 }, // right-middle
    { cx: 300, cy: 400 }, // left-upper-mid
    { cx: 1600, cy: 700 }, // right-lower-mid
    { cx: 700, cy: 150 }, // upper spread
    { cx: 1200, cy: 200 }, // upper-right spread
  ];
  for (let i = 0; i < count; i++) {
    const cluster = clusterCenters[i % clusterCenters.length];
    const x = cluster.cx + (rand() - 0.5) * 160;
    const y = cluster.cy + (rand() - 0.5) * 120;
    // Small pixel squares (4–10px) — reference has tiny squares
    const baseSize = 4 + Math.floor(rand() * 7);
    const w = rand() > 0.65 ? baseSize * 2 : baseSize;
    const h = baseSize;
    cfgs.push({
      x: Math.round(x),
      y: Math.round(y),
      w,
      h,
      cycleDuration: 700 + Math.floor(rand() * 1000),
      offset: Math.floor(rand() * 2000),
    });
  }
  return cfgs;
}

const PIXEL_CFGS = buildPixels(32, 88); // denser — 32 pixels
// Reference pixel color: slightly lighter purple (lavender-ish, desaturated)
const PIXEL_COLOR = "#C8A0FF";

export function Scene2() {
  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE_DURATION}ms`}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        // Reference: solid deep violet, no gradient tiles
        background: "#5B21B6",
      }}
    >
      <TraceLayer sceneStartMs={SCENE2_START_MS} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* Scattered pixel squares — twinkle via infinite CSS keyframes, own cycle+phase each */}
      {PIXEL_CFGS.map((cfg, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: cfg.x,
            top: cfg.y,
            width: cfg.w,
            height: cfg.h,
            background: PIXEL_COLOR,
            borderRadius: 1,
            pointerEvents: "none",
            zIndex: 1,
            animation: `pixel-twinkle ${cfg.cycleDuration}ms linear ${-cfg.offset}ms infinite`,
            ["--twinkle-peak" as string]: 0.75,
          }}
        />
      ))}

      {/* Text content — lower-left positioned, NO overflow/transform on container */}
      <div
        style={{
          position: "absolute",
          left: 100,
          bottom: 90,
          zIndex: 3,
          // CRITICAL: NO transform, NO filter, NO will-change on the text container
          // Text must render at pixel-perfect native resolution
        }}
      >
        {/* "Introducing" pill — compact, salmon, crisp */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "#FF7A8A",
            borderRadius: 6,
            padding: "5px 14px",
            marginBottom: 18,
            animation: "pill-in 300ms 150ms cubic-bezier(0.33,1,0.68,1) both",
            // NO transform on this element — avoids sub-pixel blur
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#ffffff",
              fontFamily: "'Inter', system-ui, sans-serif",
              letterSpacing: "0.2px",
              WebkitFontSmoothing: "antialiased",
            } as React.CSSProperties}
          >
            Introducing
          </span>
        </div>

        {/* "fal Assets" headline — rendered as flex row for word-by-word reveal */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 0,
            marginBottom: 24,
            // CRITICAL: NO filter, NO blur, NO will-change on headline container
            // Large text at 1920×1080 must be razor-sharp
            lineHeight: 0.88,
          }}
        >
          <span
            style={{
              fontSize: 260,
              fontWeight: 800,
              color: "#EEDDFF",
              fontFamily: "'Inter', system-ui, sans-serif",
              letterSpacing: "-8px",
              WebkitFontSmoothing: "antialiased",
              animation: "fal-word-in 350ms 500ms cubic-bezier(0.33,1,0.68,1) both",
            } as React.CSSProperties}
          >
            fal&nbsp;
          </span>
          <span
            style={{
              fontSize: 260,
              fontWeight: 800,
              color: "#EEDDFF",
              fontFamily: "'Inter', system-ui, sans-serif",
              letterSpacing: "-8px",
              WebkitFontSmoothing: "antialiased",
              animation: [
                "assets-word-fade 200ms 900ms cubic-bezier(0.33,1,0.68,1) both",
                "assets-word-slide 250ms 900ms cubic-bezier(0.34,1.56,0.64,1) both",
              ].join(", "),
            } as React.CSSProperties}
          >
            Assets
          </span>
        </div>

        {/* Subtitle — typewriter, monospace, crisp — white for legibility on violet.
            Full string is always in the DOM; the "typewriter" look is a 3-step clip-path
            reveal (steps(3, jump-end)) matching the original's 3 word-group jumps
            (Beta / Beta now / Beta now available) instead of mutating textContent. */}
        <div
          style={{
            fontSize: 26,
            fontWeight: 600,
            color: "rgba(255, 255, 255, 0.92)",
            fontFamily: "'Courier New', Courier, monospace",
            letterSpacing: "2px",
            WebkitFontSmoothing: "antialiased",
            minHeight: 36, // prevent layout shift during typewriter
            animation: [
              "subtitle-fade 200ms 1200ms both",
              "subtitle-type 600ms steps(3, jump-end) 1200ms both",
            ].join(", "),
          } as React.CSSProperties}
        >
          Beta now available
        </div>
      </div>
    </Timegroup>
  );
}

Scene2.duration = SCENE_DURATION;
