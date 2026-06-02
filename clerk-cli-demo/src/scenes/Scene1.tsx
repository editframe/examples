/**
 * Scene 1 — Terminal prompt appears
 * Master time: 0–2000ms
 * - Purple gradient background (2 corner halos)
 * - macOS terminal window CENTERED both axes
 * - Prompt fades in, cursor blinks
 * - Window fades in at 200ms
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { cc, fonts } from "../lib/colors";
import { track, blinkCursor } from "../components/helpers";

const SCENE_START = 0;
const DURATION = 2000;

// Window appears at 200ms, prompt fades in by 800ms
const WIN_FADE_START = 200;
const WIN_FADE_END = 700;
const PROMPT_FADE_START = 500;
const PROMPT_FADE_END = 900;

const TERMINAL_W = 1300;
const TERMINAL_H = 760;

export function Scene1() {
  const winRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    if (winRef.current) {
      const winOpacity = track(ms, WIN_FADE_START, WIN_FADE_END);
      winRef.current.style.opacity = `${winOpacity}`;
    }
    if (promptRef.current) {
      const pOpacity = track(ms, PROMPT_FADE_START, PROMPT_FADE_END);
      promptRef.current.style.opacity = `${pOpacity}`;
    }
    if (cursorRef.current) {
      cursorRef.current.style.opacity = blinkCursor(ms) ? "1" : "0";
    }
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

      {/* Purple radial gradient backdrop */}
      {!TRACE_MODE && (
        <>
          {/* Bottom-left halo */}
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
          {/* Bottom-right halo */}
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
          {/* Top center subtle bloom */}
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

      {/* Terminal window — absolute centered */}
      <div
        ref={winRef}
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
          opacity: 0,
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
          {/* Traffic lights */}
          <div style={{ display: "flex", gap: 8, marginLeft: 16 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: cc.dotRed, opacity: 0.85 }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: cc.dotYellow, opacity: 0.85 }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: cc.dotGreen, opacity: 0.85 }} />
          </div>
          {/* Centered title */}
          <div style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 13,
            color: cc.fgMuted,
            fontFamily: fonts.mono,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
            <span>~/Dev/taskflow-web</span>
          </div>
        </div>

        {/* Terminal body */}
        <div style={{
          width: "100%",
          flex: 1,
          height: TERMINAL_H - 44,
          background: "#131316",
          padding: "28px 36px",
          boxSizing: "border-box",
          fontFamily: fonts.mono,
          fontSize: 32,
          lineHeight: "48px",
        }}>
          <div ref={promptRef} style={{ display: "flex", alignItems: "center", opacity: 0 }}>
            <span style={{ color: cc.fgMuted }}>steve@MacBook-Pro taskflow-web % </span>
            <span ref={cursorRef} style={{
              display: "inline-block",
              width: 18,
              height: 34,
              background: cc.fg,
              verticalAlign: "middle",
              marginLeft: 2,
            }} />
          </div>
        </div>
      </div>
    </Timegroup>
  );
}

Scene1.duration = DURATION;
