/**
 * Scene 3 — fal Logo Outro (11200–14400ms master)
 * Scene-local duration: 3200ms
 *
 * Frame 0 opens on a dense violet pixel cloud clustered around the logo center (never a
 * blank white frame), which collapses inward and dissolves as the logo resolves out of it
 * ("generated out of noise" — on-brand for fal). Logo emerges fast (icon by ~150ms,
 * wordmark by ~330ms) so the lockup is solid early and holds for the rest of the scene. A
 * few corner pixels keep twinkling after the collapse so the hold isn't dead. NO tagline
 * (reference outro is logo-only).
 *
 * Every element here is a one-shot `@keyframes` reveal or an infinite ambient loop — no
 * `onFrame`, no refs. The 44 converging pixels each get their own CSS custom properties
 * (`--dx`/`--dy`, the distance from that pixel's start position to the logo center) fed
 * into one shared `converge-in` keyframe, and their own `animation-delay`/`duration` pair
 * (computed once at module load) so they finish exactly at the same collapse instant
 * regardless of their individual stagger — the direct CSS equivalent of the original
 * per-frame `clamp((ms - c.delay) / (COLLAPSE_MS - c.delay))` window.
 */
import React from "react";
import { Timegroup } from "@editframe/react";
import { TraceLayer } from "../components/TraceLayer";
import { TRACE_MODE, TRACE_OPACITY, SCENES, SCENE3_START_MS } from "../constants";

const SCENE_DURATION = SCENES.scene3.duration;

const LOGO_COLOR = "#7C3AED";
const PIXEL_COLOR = "#9B6BFE";
const CENTER_X = 960;
const CENTER_Y = 475; // logo sits at top:44% ≈ y475

const FAL_ICON_PATH =
  "M22.2216 6.72391C22.4793 6.4114 22.4826 5.94892 22.1962 5.66248L17.4071 0.873394C17.1206 0.586946 16.6582 0.590275 16.3457 0.848007C13.5582 3.14694 9.5102 3.14679 6.72259 0.847662C6.41008 0.589907 5.94759 0.586546 5.66116 0.872975L0.872362 5.66178C0.585934 5.94821 0.589293 6.41069 0.847048 6.72321C3.14617 9.51082 3.14633 13.5588 0.847397 16.3463C0.589663 16.6588 0.586337 17.1212 0.872784 17.4077L5.66187 22.1968C5.94831 22.4832 6.41079 22.4799 6.7233 22.2222C9.51075 19.9232 13.5587 19.9234 16.3464 22.2225C16.6589 22.4803 17.1214 22.4836 17.4078 22.1972L22.1966 17.4084C22.483 17.122 22.4797 16.6595 22.2219 16.347C19.9228 13.5594 19.9226 9.51136 22.2216 6.72391Z";

const FalIconBig = ({ size = 120, color = LOGO_COLOR }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 23 23" fill={color} style={{ transform: "rotate(-45deg)", display: "block" }}>
    <path d={FAL_ICON_PATH} />
    <circle cx="11.5" cy="11.5" r="7.8" fill="#ffffff" />
  </svg>
);

function lcg(s: number) {
  let state = s;
  return () => {
    state = (1664525 * state + 1013904223) & 0xffffffff;
    return (state >>> 0) / 0xffffffff;
  };
}

interface ConvergePix { sx: number; sy: number; w: number; h: number; delay: number; }
interface TwinklePix { x: number; y: number; w: number; h: number; cycle: number; offset: number; }

// Dense cloud clustered in a ring around the logo center — present at frame 0,
// collapses INTO the center as the logo resolves.
function buildConverge(count: number, seed: number): ConvergePix[] {
  const rand = lcg(seed * 31337 + 7919);
  const out: ConvergePix[] = [];
  for (let i = 0; i < count; i++) {
    const ang = rand() * Math.PI * 2;
    const rad = 130 + rand() * 360; // 130–490px ring around center
    const base = 5 + Math.floor(rand() * 8);
    out.push({
      sx: Math.round(CENTER_X + Math.cos(ang) * rad * 1.35), // wider horizontally
      sy: Math.round(CENTER_Y + Math.sin(ang) * rad),
      w: rand() > 0.5 ? base * 2 : base,
      h: base,
      delay: Math.floor(rand() * 140), // slight stagger of the collapse
    });
  }
  return out;
}

// Sparse corner twinkle that keeps the long hold alive (subtle).
function buildTwinkle(): TwinklePix[] {
  const spots = [
    { x: 60, y: 70 }, { x: 1840, y: 55 }, { x: 1820, y: 1000 }, { x: 55, y: 970 },
    { x: 480, y: 30 }, { x: 1440, y: 38 }, { x: 240, y: 880 }, { x: 1680, y: 870 },
    { x: 120, y: 480 }, { x: 1800, y: 520 },
  ];
  const rand = lcg(99173);
  return spots.map((s) => ({
    x: s.x, y: s.y,
    w: rand() > 0.5 ? 14 : 8, h: 7 + Math.floor(rand() * 5),
    cycle: 800 + Math.floor(rand() * 900),
    offset: Math.floor(rand() * 2000),
  }));
}

const CONVERGE = buildConverge(44, 421);
const TWINKLE = buildTwinkle();
const COLLAPSE_MS = 520; // cloud fully collapsed/dissolved by here

export function Scene3() {
  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE_DURATION}ms`}
      style={{ position: "absolute", inset: 0, background: "#FFFFFF", overflow: "hidden" }}
    >
      <TraceLayer sceneStartMs={SCENE3_START_MS} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* Converging cloud — each pixel collapses into the logo center on its own stagger */}
      {CONVERGE.map((c, i) => {
        const duration = COLLAPSE_MS - c.delay;
        return (
          <div
            key={`c${i}`}
            style={{
              position: "absolute", left: c.sx, top: c.sy, width: c.w, height: c.h,
              background: PIXEL_COLOR, borderRadius: 1, pointerEvents: "none", zIndex: 1,
              animation: `converge-in ${duration}ms cubic-bezier(0.11,0,0.5,0) ${c.delay}ms both`,
              ["--dx" as string]: `${CENTER_X - c.sx}px`,
              ["--dy" as string]: `${CENTER_Y - c.sy}px`,
            }}
          />
        );
      })}

      {/* Corner twinkle — reuses the same infinite-loop pattern as Scene2's pixels
          (shared `pixel-twinkle` keyframe; fade fractions collapsed to match Scene2's
          for simplicity — the two profiles were already nearly identical). */}
      {TWINKLE.map((t, i) => (
        <div
          key={`t${i}`}
          style={{
            position: "absolute", left: t.x, top: t.y, width: t.w, height: t.h,
            background: PIXEL_COLOR, borderRadius: 1, pointerEvents: "none", zIndex: 1,
            animation: `pixel-twinkle ${t.cycle}ms linear ${-t.offset}ms infinite`,
            ["--twinkle-peak" as string]: 0.8,
          }}
        />
      ))}

      {/* Logo lockup — outer div: static position; middle div: infinite breathing bob;
          inner divs: one-shot icon/wordmark reveal. */}
      <div
        style={{
          position: "absolute", left: "50%", top: "44%", transform: "translate(-50%, -50%)",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "flex", flexDirection: "row", alignItems: "center", gap: 18,
            animation: "logo-bob 5236ms ease-in-out infinite",
          }}
        >
          <div
            style={{
              transformOrigin: "center center", display: "flex", alignItems: "center", justifyContent: "center",
              animation: [
                "logo-icon-fade 150ms linear both",
                "logo-icon-scale 320ms cubic-bezier(0.34,1.56,0.64,1) both",
              ].join(", "),
            }}
          >
            <FalIconBig size={120} color={LOGO_COLOR} />
          </div>
          <div
            style={{
              fontSize: 120, fontWeight: 800, color: LOGO_COLOR,
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              letterSpacing: "-4px", lineHeight: 1, WebkitFontSmoothing: "antialiased",
              animation: [
                "logo-wordmark-fade 180ms 150ms linear both",
                "logo-wordmark-slide 280ms 150ms cubic-bezier(0.34,1.56,0.64,1) both",
              ].join(", "),
            } as React.CSSProperties}
          >
            fal
          </div>
        </div>
      </div>
    </Timegroup>
  );
}

Scene3.duration = SCENE_DURATION;
