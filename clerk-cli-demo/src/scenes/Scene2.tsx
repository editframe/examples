/**
 * Scene 2 — `clerk login` typed + auth flow streams in
 * Master time: 2000–4500ms (duration 2500ms)
 * - Same centered terminal panel
 * - "clerk login" types char-by-char starting at local 0ms
 * - After typing done (~500ms), auth flow lines stream in one by one
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { cc, fonts } from "../lib/colors";
import { track, blinkCursor, typewriter } from "../components/helpers";

const SCENE_START = 2000;
const DURATION = 2500;

const TERMINAL_W = 1300;
const TERMINAL_H = 760;

// clerk login typing: 0ms → ~600ms (50ms/char, 11 chars = 550ms)
const CMD_TYPE_START = 0;
const CMD = "clerk login";
const MS_PER_CHAR = 55;
const CMD_TYPE_END = CMD_TYPE_START + CMD.length * MS_PER_CHAR; // ~605ms
const CMD_SUBMIT = CMD_TYPE_END + 200; // 805ms — command "submitted"

// Auth flow lines — stagger from 1000ms
// Each line fades in over 180ms
const AUTH_LINES: { ms: number; symbol: string; symColor: string; text: string; textColor: string }[] = [
  { ms: 900,  symbol: "r",  symColor: cc.fgDim,     text: "  clerk login",              textColor: cc.fgMuted },
  { ms: 1100, symbol: "◇",  symColor: cc.purpleSoft, text: "  Opening browser...",        textColor: cc.fgMuted },
  { ms: 1350, symbol: "|",  symColor: cc.fgDim,     text: "  Waiting for authentication (timeout in 2m)...", textColor: cc.fgMuted },
  { ms: 1650, symbol: "◇",  symColor: cc.purpleSoft, text: "  Completing authentication", textColor: cc.fgMuted },
  { ms: 1850, symbol: "|",  symColor: cc.fgDim,     text: "",                            textColor: cc.fgMuted },
  { ms: 2000, symbol: "|",  symColor: cc.fgDim,     text: "  Logged in as steve@clerk.dev", textColor: cc.fg },
  { ms: 2200, symbol: "L",  symColor: cc.fgDim,     text: "  Done",                     textColor: cc.fgMuted },
];

export function Scene2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cmdRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // Command typewriter
    if (cmdRef.current) {
      const typed = typewriter(ms, CMD_TYPE_START, CMD_TYPE_END - CMD_TYPE_START, CMD);
      cmdRef.current.textContent = typed;
    }
    // Cursor blinks until submit, then hidden
    if (cursorRef.current) {
      const submitted = ms > CMD_SUBMIT;
      if (submitted) {
        cursorRef.current.style.opacity = "0";
      } else {
        cursorRef.current.style.opacity = blinkCursor(ms) ? "1" : "0";
      }
    }
    // Auth flow lines
    AUTH_LINES.forEach((line, i) => {
      const el = lineRefs.current[i];
      if (!el) return;
      const t = track(ms, line.ms, line.ms + 180);
      el.style.opacity = `${t}`;
      el.style.transform = `translateY(${(1 - t) * 6}px)`;
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

      {/* Terminal window — centered */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
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

        {/* Terminal body */}
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: TERMINAL_H - 44,
            background: "#131316",
            padding: "28px 36px",
            boxSizing: "border-box",
            fontFamily: fonts.mono,
            fontSize: 28,
            lineHeight: "44px",
            overflow: "hidden",
          }}
        >
          {/* Command line */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ color: cc.fgMuted }}>steve@MacBook-Pro taskflow-web % </span>
            <span ref={cmdRef} style={{ color: cc.fg, fontWeight: 600 }}></span>
            <span
              ref={cursorRef}
              style={{
                display: "inline-block",
                width: 16,
                height: 30,
                background: cc.fg,
                verticalAlign: "middle",
                marginLeft: 2,
              }}
            />
          </div>

          {/* Auth flow lines */}
          {AUTH_LINES.map((line, i) => (
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

Scene2.duration = DURATION;
