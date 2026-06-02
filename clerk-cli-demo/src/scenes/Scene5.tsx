/**
 * Scene 5 — Zoom to BOTTOM-LEFT corner (FIX 3 + FIX 4)
 * Master time: 7500–10000ms (duration 2500ms) — shifted -1500ms per FIX 2
 *
 * FIX 3: Zoom target = bottom-left of terminal where "✓ Clerk has been set up" streams.
 *   Terminal positioned at left:310px, top:160px (hardcoded center, same as Scene 3).
 *   transformOrigin: "150px 350px" — left-side pivot, lower in the terminal.
 *   This keeps the bottom-left content area visible and in frame.
 *
 * FIX 4: Peak zoom reduced from 3.8× → 2.5× (less close, more context visible).
 *
 * Beat plan:
 * 0–700ms:  Camera zooms to bottom-left (scale 1.0 → 2.5)
 * 0ms+:     Final lines stream in WHILE camera is zooming:
 *   400ms:  "✓ Clerk has been set up in your project" appears
 *   800ms:  "Pulling env vars from development instance"
 *   1200ms: "Environment variables written to .env.local"
 *   1600ms: "Done"
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { cc, fonts } from "../lib/colors";
import { track } from "../components/helpers";
import { eases } from "animejs";

const SCENE_START = 7500;
const DURATION = 2500;

const TERMINAL_W = 1300;
const TERMINAL_H = 760;

// Hardcoded center position: (1920-1300)/2=310, (1080-760)/2=160
const TERMINAL_LEFT = 310;
const TERMINAL_TOP = 160;

// FIX 4: Peak zoom reduced to 2.5× (down from 3.8×)
const ZOOM_START = 0;
const ZOOM_END = 700;
const ZOOM_SCALE = 2.5;

// FIX 3: Bottom-left transform-origin — CORRECTED.
// Reference _ref_08s.jpg shows content in TOP-LEFT of frame, terminal left border visible at ~x=231px.
// Math (scale=2.5):
//   screen_x_left_edge = 310 - 1.5 * ORIGIN_X  →  set to ~231  →  ORIGIN_X = 53
//   screen_y_CREATE    = 160 - 1.5 * ORIGIN_Y + 2.5 * 124  →  ~80px  →  ORIGIN_Y = 260
// This keeps the CREATE/MODIFY block near the top of frame and "Clerk has been set up" at ~760px.
// The left terminal border is visible, content fills from top-left — matches reference exactly.
const ORIGIN_X = 53;
const ORIGIN_Y = 260;

// The final streaming lines — appear DURING and after zoom
type CliLine = {
  ms: number;
  symbol: string;
  symColor: string;
  text: string;
  textColor: string;
  glow?: boolean;
};

const FINAL_LINES: CliLine[] = [
  { ms: 400,  symbol: "|",  symColor: cc.fgDim,      text: "  ✓ Clerk has been set up in your project",  textColor: cc.fg, glow: true },
  { ms: 800,  symbol: "◇",  symColor: cc.purpleSoft,  text: "  Pulling env vars from development instance", textColor: cc.fgMuted },
  { ms: 1200, symbol: "|",  symColor: cc.fgDim,      text: "  Environment variables written to .env.local", textColor: cc.fgMuted },
  { ms: 1600, symbol: "L",  symColor: cc.fgDim,      text: "  Done",                                      textColor: cc.fgMuted },
];

export function Scene5() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // FIX 3 + FIX 4: Zoom to bottom-left. Terminal positioned at fixed pixel coords.
    // transformOrigin baked in; only scale changes here.
    if (terminalRef.current) {
      const zoomT = eases.inOutCubic(Math.min(1, Math.max(0, (ms - ZOOM_START) / (ZOOM_END - ZOOM_START))));
      const scale = 1.0 + (ZOOM_SCALE - 1.0) * zoomT;
      terminalRef.current.style.transform = `scale(${scale})`;
    }

    // Final streaming lines — appear WHILE camera is zooming
    FINAL_LINES.forEach((line, i) => {
      const el = lineRefs.current[i];
      if (!el) return;
      const lt = track(ms, line.ms, line.ms + 200);
      el.style.opacity = `${lt}`;
      el.style.transform = `translateY(${(1 - lt) * 6}px)`;
      // Glow pulse on success line
      if (line.glow && lt > 0.5) {
        const glowT = track(ms, line.ms + 200, line.ms + 600);
        el.style.textShadow = `0 0 ${8 * glowT}px rgba(124,58,237,0.6)`;
      }
    });
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration={`${DURATION}ms`}
      onFrame={onFrame as any}
      style={{
        position: "relative",
        width: 1920,
        height: 1080,
        overflow: "hidden",
        background: "#1A0B33",
      }}
    >
      <TraceLayer sceneStartMs={SCENE_START} enabled={TRACE_MODE} opacity={0.5} />

      {/* Purple gradient backdrop */}
      {!TRACE_MODE && (
        <>
          <div style={{
            position: "absolute",
            left: -200, bottom: -200,
            width: 900, height: 900,
            borderRadius: "50%",
            background: "radial-gradient(circle at center, rgba(124,58,237,0.72) 0%, rgba(124,58,237,0.35) 30%, rgba(88,28,235,0.12) 60%, transparent 80%)",
            filter: "blur(40px)",
            mixBlendMode: "screen",
            zIndex: 1,
          }} />
          <div style={{
            position: "absolute",
            right: -200, bottom: -200,
            width: 850, height: 850,
            borderRadius: "50%",
            background: "radial-gradient(circle at center, rgba(124,58,237,0.65) 0%, rgba(124,58,237,0.3) 30%, rgba(88,28,235,0.10) 60%, transparent 80%)",
            filter: "blur(45px)",
            mixBlendMode: "screen",
            zIndex: 1,
          }} />
          <div style={{
            position: "absolute",
            left: "50%",
            top: -300,
            transform: "translateX(-50%)",
            width: 700, height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle at center, rgba(107,63,204,0.25) 0%, transparent 70%)",
            filter: "blur(60px)",
            mixBlendMode: "screen",
            zIndex: 1,
          }} />
        </>
      )}

      {/* Terminal window — FIX 3: positioned at fixed pixel coords.
          transformOrigin set to bottom-left content area (ORIGIN_X, ORIGIN_Y).
          At scale 2.5×, the bottom-left streaming lines are visible in the left portion of frame. */}
      <div
        ref={terminalRef}
        style={{
          position: "absolute",
          left: TERMINAL_LEFT,
          top: TERMINAL_TOP,
          // FIX 3: transform-origin anchored to bottom-left content area
          // Screen position of origin = (310+150, 160+350) = (460, 510) — left-center of frame
          transformOrigin: `${ORIGIN_X}px ${ORIGIN_Y}px`,
          transform: "scale(1.0)",
          width: TERMINAL_W,
          height: TERMINAL_H,
          borderRadius: 12,
          border: `1px solid ${cc.border}`,
          boxShadow: "0 24px 80px rgba(0,0,0,0.65)",
          overflow: "hidden",
          zIndex: 10,
        }}
      >
        {/* Title bar */}
        <div style={{
          width: "100%",
          height: 44,
          background: "#1C1C1C",
          borderBottom: `1px solid ${cc.border}`,
          display: "flex",
          alignItems: "center",
          position: "relative",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", gap: 8, marginLeft: 16 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: cc.dotRed, opacity: 0.85 }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: cc.dotYellow, opacity: 0.85 }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: cc.dotGreen, opacity: 0.85 }} />
          </div>
          <div style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 13,
            color: cc.fgMuted,
            fontFamily: fonts.mono,
          }}>
            ~/Dev/taskflow-web
          </div>
        </div>

        {/* Terminal body — all accumulated lines + final streaming */}
        <div style={{
          width: "100%",
          height: TERMINAL_H - 44,
          background: "#131316",
          padding: "12px 36px",
          boxSizing: "border-box",
          fontFamily: fonts.mono,
          fontSize: 22,
          lineHeight: "34px",
          overflow: "hidden",
        }}>
          {/* All previous lines */}
          {[
            { symbol: "|",  symColor: cc.fgDim,  text: "  clerk init will make the following changes:", textColor: cc.fgMuted },
            { symbol: "|",  symColor: cc.fgDim,  text: "",                                           textColor: cc.fgMuted },
            { symbol: "|",  symColor: cc.fgDim,  text: "    CREATE  proxy.ts",                       textColor: cc.fg,    isAction: "CREATE" as const },
            { symbol: "|",  symColor: cc.fgDim,  text: "    MODIFY  app/layout.tsx",                  textColor: cc.fg,    isAction: "MODIFY" as const },
            { symbol: "|",  symColor: cc.fgDim,  text: "    CREATE  app/sign-in/[[...sign-in]]/page.tsx", textColor: cc.fg, isAction: "CREATE" as const },
            { symbol: "|",  symColor: cc.fgDim,  text: "    CREATE  app/sign-up/[[...sign-up]]/page.tsx", textColor: cc.fg, isAction: "CREATE" as const },
            { symbol: "|",  symColor: cc.fgDim,  text: "    MODIFY  .env.local",                      textColor: cc.fg,    isAction: "MODIFY" as const },
            { symbol: "✓",  symColor: cc.purple, text: "  Proceed? Yes",                             textColor: cc.fg },
            { symbol: "◇",  symColor: cc.purpleSoft, text: "  Writing files",                        textColor: cc.fgMuted },
            { symbol: "◇",  symColor: cc.purpleSoft, text: "  Scanning for issues",                   textColor: cc.fgMuted },
          ].map((line, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ color: line.symColor, minWidth: 20, textAlign: "center" }}>{line.symbol}</span>
              <span style={{ color: line.textColor }}>
                {(line as any).isAction ? (
                  <>
                    <span style={{ color: cc.purpleHi, fontWeight: 700 }}>{(line as any).isAction}</span>
                    {(line as any).isAction === "CREATE" ? line.text.replace("    CREATE", "") : line.text.replace("    MODIFY", "")}
                  </>
                ) : line.text}
              </span>
            </div>
          ))}

          {/* Final streaming lines — animate in DURING camera zoom to bottom-left */}
          {FINAL_LINES.map((line, i) => (
            <div
              key={i}
              ref={el => { lineRefs.current[i] = el; }}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                opacity: 0,
                transform: "translateY(6px)",
              }}
            >
              <span style={{ color: line.symColor, minWidth: 20, textAlign: "center" }}>{line.symbol}</span>
              <span style={{ color: line.textColor }}>{line.text}</span>
            </div>
          ))}
        </div>
      </div>
    </Timegroup>
  );
}

Scene5.duration = DURATION;
