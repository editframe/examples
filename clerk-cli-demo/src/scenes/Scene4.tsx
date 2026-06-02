/**
 * Scene 4 — Zoom OUT back to centered framing
 * Master time: 6000–7500ms (duration 1500ms) — shifted -1500ms per FIX 2
 *
 * Beat plan:
 * 0–800ms:  Camera zooms OUT from 1.42→1.0 (eases.inOutCubic)
 * 0–1200ms: More init lines continue streaming: ✓ Proceed? Yes, ◇ Writing files, ◇ Scanning for issues
 * The code is still "running" — not done yet
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { cc, fonts } from "../lib/colors";
import { track } from "../components/helpers";
import { eases } from "animejs";

const SCENE_START = 6000;
const DURATION = 1500;

const TERMINAL_W = 1300;
const TERMINAL_H = 760;

// Zoom out timing
const ZOOM_OUT_START = 0;
const ZOOM_OUT_END = 800;
const ZOOM_SCALE_FROM = 1.42;
const ZOOM_SCALE_TO = 1.0;

// Lines that continue streaming during the zoom-out
type CliLine = {
  ms: number;
  symbol: string;
  symColor: string;
  text: string;
  textColor: string;
};

const CONTINUE_LINES: CliLine[] = [
  { ms: 100,  symbol: "✓",  symColor: cc.purple,     text: "  Proceed? Yes",           textColor: cc.fg },
  { ms: 450,  symbol: "◇",  symColor: cc.purpleSoft,  text: "  Writing files",           textColor: cc.fgMuted },
  { ms: 850,  symbol: "◇",  symColor: cc.purpleSoft,  text: "  Scanning for issues",     textColor: cc.fgMuted },
];

export function Scene4() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // Camera zoom out
    if (terminalRef.current) {
      const t = eases.inOutCubic(Math.min(1, Math.max(0, (ms - ZOOM_OUT_START) / (ZOOM_OUT_END - ZOOM_OUT_START))));
      const scale = ZOOM_SCALE_FROM + (ZOOM_SCALE_TO - ZOOM_SCALE_FROM) * t;
      terminalRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }

    // Continue streaming lines
    CONTINUE_LINES.forEach((line, i) => {
      const el = lineRefs.current[i];
      if (!el) return;
      const lt = track(ms, line.ms, line.ms + 180);
      el.style.opacity = `${lt}`;
      el.style.transform = `translateY(${(1 - lt) * 6}px)`;
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

      {/* Terminal window */}
      <div
        ref={terminalRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${ZOOM_SCALE_FROM})`,
          transformOrigin: "top center",
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

        {/* Terminal body — all lines accumulated (continuity from Scene 3) */}
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
          {/* All previous lines visible */}
          {[
            { symbol: "r",  symColor: cc.fgDim,      text: "  clerk init",                               textColor: cc.fgMuted },
            { symbol: "◇",  symColor: cc.purpleSoft,  text: "  Detecting framework",                      textColor: cc.fgMuted },
            { symbol: "|",  symColor: cc.fgDim,      text: "  Logged in as steve@clerk.dev",             textColor: cc.fg },
            { symbol: "◇",  symColor: cc.purpleSoft,  text: "  Installing packages",                     textColor: cc.fgMuted },
            { symbol: "|",  symColor: cc.fgDim,      text: "  added 13 packages in 3s",                  textColor: cc.fgMuted },
            { symbol: "|",  symColor: cc.fgDim,      text: "  clerk init will make the following changes:", textColor: cc.fgMuted },
            { symbol: "|",  symColor: cc.fgDim,      text: "",                                           textColor: cc.fgMuted },
            { symbol: "|",  symColor: cc.fgDim,      text: "    CREATE  proxy.ts",                       textColor: cc.fg,    isAction: true },
            { symbol: "|",  symColor: cc.fgDim,      text: "    MODIFY  app/layout.tsx",                  textColor: cc.fg,    isAction: true },
            { symbol: "|",  symColor: cc.fgDim,      text: "    CREATE  app/sign-in/[[...sign-in]]/page.tsx", textColor: cc.fg, isAction: true },
            { symbol: "|",  symColor: cc.fgDim,      text: "    CREATE  app/sign-up/[[...sign-up]]/page.tsx", textColor: cc.fg, isAction: true },
            { symbol: "|",  symColor: cc.fgDim,      text: "    MODIFY  .env.local",                      textColor: cc.fg,    isAction: true },
          ].map((line, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ color: line.symColor, minWidth: 20, textAlign: "center" }}>{line.symbol}</span>
              <span style={{ color: line.textColor }}>
                {(line as any).isAction ? (
                  <>
                    <span style={{ color: cc.purpleHi, fontWeight: 700 }}>
                      {line.text.includes("CREATE") ? "CREATE" : "MODIFY"}
                    </span>
                    {line.text.includes("CREATE") ? line.text.replace("    CREATE", "") : line.text.replace("    MODIFY", "")}
                  </>
                ) : line.text}
              </span>
            </div>
          ))}

          {/* Continue lines (animate in) */}
          {CONTINUE_LINES.map((line, i) => (
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

Scene4.duration = DURATION;
