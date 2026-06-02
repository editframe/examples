/**
 * Scene 3 — fal Logo Outro (11400–14600ms master)
 * Scene-local duration: 3200ms
 *
 * REWORK v4 — kill the blank pre-logo beat:
 *  - Frame 0 opens on a DENSE violet pixel cloud clustered around the logo center
 *    (never a blank white frame), which COLLAPSES inward and dissolves as the logo
 *    resolves out of it ("generated out of noise" — on-brand for fal). No empty gap.
 *  - Logo emerges fast (icon by ~280ms, wordmark by ~430ms), so the lockup is solid
 *    early and holds (reference outro is nearly static for ~3s, white bg, logo only).
 *  - A few corner pixels keep twinkling after the collapse so the hold isn't dead.
 *  - NO tagline (reference outro is logo-only — confirmed against the real fal ad).
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { lerp, clamp, outBack } from "../components/helpers";
import { TraceLayer } from "../components/TraceLayer";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";

const SCENE_START_MS = 12600;
const SCENE_DURATION = 3200;

const LOGO_COLOR = "#7C3AED";
const PIXEL_COLOR = "#9B6BFE";
const CENTER_X = 960;
const CENTER_Y = 475; // logo sits at top:44% ≈ y475

const FAL_ICON_PATH = "M22.2216 6.72391C22.4793 6.4114 22.4826 5.94892 22.1962 5.66248L17.4071 0.873394C17.1206 0.586946 16.6582 0.590275 16.3457 0.848007C13.5582 3.14694 9.5102 3.14679 6.72259 0.847662C6.41008 0.589907 5.94759 0.586546 5.66116 0.872975L0.872362 5.66178C0.585934 5.94821 0.589293 6.41069 0.847048 6.72321C3.14617 9.51082 3.14633 13.5588 0.847397 16.3463C0.589663 16.6588 0.586337 17.1212 0.872784 17.4077L5.66187 22.1968C5.94831 22.4832 6.41079 22.4799 6.7233 22.2222C9.51075 19.9232 13.5587 19.9234 16.3464 22.2225C16.6589 22.4803 17.1214 22.4836 17.4078 22.1972L22.1966 17.4084C22.483 17.122 22.4797 16.6595 22.2219 16.347C19.9228 13.5594 19.9226 9.51136 22.2216 6.72391Z";

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
    const rad = 130 + rand() * 360;              // 130–490px ring around center
    const base = 5 + Math.floor(rand() * 8);
    out.push({
      sx: Math.round(CENTER_X + Math.cos(ang) * rad * 1.35), // wider horizontally
      sy: Math.round(CENTER_Y + Math.sin(ang) * rad),
      w: rand() > 0.5 ? base * 2 : base,
      h: base,
      delay: Math.floor(rand() * 140),           // slight stagger of the collapse
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
  const iconRef     = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const convRefs    = useRef<Array<HTMLDivElement | null>>(Array(CONVERGE.length).fill(null));
  const twRefs      = useRef<Array<HTMLDivElement | null>>(Array(TWINKLE.length).fill(null));

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // ── Converging cloud: dense at frame 0, collapses to center + fades ──
    for (let i = 0; i < CONVERGE.length; i++) {
      const el = convRefs.current[i];
      if (!el) continue;
      const c = CONVERGE[i];
      const p = clamp((ms - c.delay) / (COLLAPSE_MS - c.delay));
      const e = p * p; // ease-in: drift then rush into center
      const dx = (CENTER_X - c.sx) * e;
      const dy = (CENTER_Y - c.sy) * e;
      // visible immediately (frame 0 = full cloud), fade out as it collapses
      const op = (1 - p) * 0.9;
      el.style.transform = `translate(${dx}px, ${dy}px) scale(${lerp(1, 0.4, e)})`;
      el.style.opacity = String(Math.max(0, op));
    }

    // ── Logo icon: resolves out of the cloud fast (opacity by 150ms, scale by 320ms) ──
    if (iconRef.current) {
      const op = clamp(ms / 150);
      const sc = outBack(clamp(ms / 320));
      iconRef.current.style.opacity = String(op);
      iconRef.current.style.transform = `scale(${sc})`;
    }
    // ── Wordmark slides in from left, lands by ~430ms ──
    if (wordmarkRef.current) {
      const op = clamp((ms - 150) / 180);
      const t = outBack(clamp((ms - 150) / 280));
      wordmarkRef.current.style.opacity = String(op);
      wordmarkRef.current.style.transform = `translateX(${lerp(-25, 0, t)}px)`;
    }
    // ── Almost-imperceptible breathing drift on the hold ──
    if (logoWrapRef.current) {
      const ds = Math.min(1, Math.max(0, (ms - 600) / 400));
      const dy = Math.sin(ms * 0.0012) * 2.5 * ds;
      logoWrapRef.current.style.transform = `translate(-50%, -50%) translateY(${dy}px)`;
    }

    // ── Corner twinkle (keeps the long hold alive) ──
    for (let i = 0; i < TWINKLE.length; i++) {
      const el = twRefs.current[i];
      if (!el) continue;
      const t = TWINKLE[i];
      const f = (((ms + t.offset) % t.cycle) + t.cycle) % t.cycle / t.cycle;
      let o = 0;
      if (f < 0.12) o = f / 0.12;
      else if (f < 0.5) o = 1;
      else if (f < 0.65) o = 1 - (f - 0.5) / 0.15;
      el.style.opacity = String(Math.max(0, Math.min(1, o * 0.8)));
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE_DURATION}ms`}
      style={{ position: "absolute", inset: 0, background: "#FFFFFF", overflow: "hidden" }}
    >
      <TraceLayer sceneStartMs={SCENE_START_MS} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* Converging cloud */}
      {CONVERGE.map((c, i) => (
        <div
          key={`c${i}`}
          ref={(el) => { convRefs.current[i] = el; }}
          style={{
            position: "absolute", left: c.sx, top: c.sy, width: c.w, height: c.h,
            background: PIXEL_COLOR, borderRadius: 1, opacity: 0.9, pointerEvents: "none", zIndex: 1,
          }}
        />
      ))}

      {/* Corner twinkle */}
      {TWINKLE.map((t, i) => (
        <div
          key={`t${i}`}
          ref={(el) => { twRefs.current[i] = el; }}
          style={{
            position: "absolute", left: t.x, top: t.y, width: t.w, height: t.h,
            background: PIXEL_COLOR, borderRadius: 1, opacity: 0, pointerEvents: "none", zIndex: 1,
          }}
        />
      ))}

      {/* Logo lockup */}
      <div
        ref={logoWrapRef}
        style={{
          position: "absolute", left: "50%", top: "44%", transform: "translate(-50%, -50%)",
          display: "flex", flexDirection: "row", alignItems: "center", gap: 18, zIndex: 2,
        }}
      >
        <div ref={iconRef} style={{ opacity: 0, transformOrigin: "center center", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <FalIconBig size={120} color={LOGO_COLOR} />
        </div>
        <div
          ref={wordmarkRef}
          style={{
            fontSize: 120, fontWeight: 800, color: LOGO_COLOR,
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            letterSpacing: "-4px", lineHeight: 1, opacity: 0, WebkitFontSmoothing: "antialiased",
          } as React.CSSProperties}
        >
          fal
        </div>
      </div>

      {/* onFrame driver */}
      <Timegroup
        mode="fixed"
        duration={`${SCENE_DURATION}ms`}
        onFrame={onFrame as any}
        style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }}
      />
    </Timegroup>
  );
}

Scene3.duration = SCENE_DURATION;
