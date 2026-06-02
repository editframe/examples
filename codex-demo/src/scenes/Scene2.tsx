/**
 * Scene 2 — CloudTicTacToe headline + chat input + typing
 * Duration: 2000ms (t=2500–4500ms)
 *
 * Reference: ref-frames/frame_0005.jpg, frame_0006.jpg, frame_0007.jpg
 * - Pure white #FFFFFF background
 * - "What will you build in CloudTicTacToe?" headline centered ~64px
 * - Chat input box: "Run this app in [Xcode] , test it by playing a game, and fix any bugs you find"
 * - Below input: toolbar row, chips row, suggestion pills
 * - Typing starts immediately (faster than v4), completes by ~1600ms
 * - Send button highlights when typing done
 *
 * FIX 2: Compressed from 5500ms to 2000ms. Typing faster (25ms/char).
 */

import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { track, lerp } from "../components/helpers";
import { eases } from "animejs";

const SCENE_DURATION = 2000;
const SCENE_START_MS = 2500;

const PANEL_W = 1350;
const PANEL_LEFT = (1920 - PANEL_W) / 2; // 285

const FADE_IN_START = 0;
const FADE_IN_END = 300;
const HEADLINE_IN_START = 100;
const HEADLINE_IN_END = 500;
const INPUT_IN_START = 300;
const INPUT_IN_END = 600;
const CHIPS_IN_START = 500;
const CHIPS_IN_END = 800;
const PILLS_IN_START = 700;
const PILLS_IN_END = 1000;

// Typing starts at t=800ms to let UI appear first
const TYPE_START = 800;
const FULL_MSG = "Run this app in Xcode , test it by playing a game, and fix any bugs you find";
const XCODE_END_IDX = 21; // "Run this app in Xcode" = 21 chars
const MS_PER_CHAR = 22; // faster to finish within 2s

let blinkTick = 0;

export const Scene2: React.FC = () => {
  const bgRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const inputPanelRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);
  const xcodeChipRef = useRef<HTMLSpanElement>(null);
  const sendBtnRef = useRef<HTMLButtonElement>(null);
  const cursorBlinkRef = useRef<HTMLSpanElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    if (bgRef.current) {
      const t = track(ms, FADE_IN_START, FADE_IN_END, eases.outCubic);
      bgRef.current.style.opacity = String(t);
    }
    if (headlineRef.current) {
      const t = track(ms, HEADLINE_IN_START, HEADLINE_IN_END, eases.outCubic);
      headlineRef.current.style.opacity = String(t);
      headlineRef.current.style.transform = `translateY(${lerp(20, 0, t)}px)`;
    }
    if (inputPanelRef.current) {
      const t = track(ms, INPUT_IN_START, INPUT_IN_END, eases.outCubic);
      inputPanelRef.current.style.opacity = String(t);
      inputPanelRef.current.style.transform = `translateY(${lerp(16, 0, t)}px)`;
    }
    if (chipsRef.current) {
      const t = track(ms, CHIPS_IN_START, CHIPS_IN_END, eases.outCubic);
      chipsRef.current.style.opacity = String(t);
      chipsRef.current.style.transform = `translateY(${lerp(12, 0, t)}px)`;
    }
    if (pillsRef.current) {
      const t = track(ms, PILLS_IN_START, PILLS_IN_END, eases.outCubic);
      pillsRef.current.style.opacity = String(t);
      pillsRef.current.style.transform = `translateY(${lerp(12, 0, t)}px)`;
    }

    // Typing animation
    if (ms >= TYPE_START && typedRef.current) {
      const elapsed = ms - TYPE_START;
      const charCount = Math.min(FULL_MSG.length, Math.floor(elapsed / MS_PER_CHAR));
      const typed = FULL_MSG.slice(0, charCount);

      if (xcodeChipRef.current && typedRef.current) {
        if (charCount <= XCODE_END_IDX) {
          typedRef.current.textContent = typed;
          xcodeChipRef.current.style.display = "none";
        } else {
          typedRef.current.textContent = "Run this app in ";
          xcodeChipRef.current.style.display = "inline-flex";
          const afterSpan = typedRef.current.parentElement?.querySelector(".after-xcode") as HTMLSpanElement | null;
          if (afterSpan) {
            afterSpan.textContent = typed.slice(XCODE_END_IDX);
          }
        }
      }

      blinkTick = Math.floor(ms / 500);
      if (cursorBlinkRef.current) {
        cursorBlinkRef.current.style.opacity = blinkTick % 2 === 0 ? "1" : "0";
      }

      if (sendBtnRef.current) {
        const typingDone = charCount >= FULL_MSG.length;
        sendBtnRef.current.style.transform = typingDone ? "scale(1.08)" : "scale(1)";
        sendBtnRef.current.style.boxShadow = typingDone ? "0 0 16px rgba(0,0,0,0.4)" : "none";
      }
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE_DURATION}ms` as any}
      onFrame={onFrame as any}
      style={{
        position: "relative",
        width: 1920,
        height: 1080,
        overflow: "hidden",
      }}
    >
      <TraceLayer sceneStartMs={SCENE_START_MS} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {!TRACE_MODE && (
        <div
          ref={bgRef}
          style={{
            position: "absolute",
            inset: 0,
            background: "#FFFFFF",
            zIndex: 1,
            opacity: 0,
          }}
        />
      )}

      {/* Headline */}
      <div
        ref={headlineRef}
        style={{
          position: "absolute",
          top: 160,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 64,
          fontWeight: 700,
          color: "#0D0D0D",
          fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          opacity: 0,
          zIndex: 2,
          whiteSpace: "nowrap",
        }}
      >
        What will you build in CloudTicTacToe?
      </div>

      {/* Chat input panel */}
      <div
        ref={inputPanelRef}
        style={{
          position: "absolute",
          top: 310,
          left: PANEL_LEFT,
          width: PANEL_W,
          background: "#FFFFFF",
          border: "1.5px solid #D0D0D0",
          borderRadius: 16,
          padding: "22px 24px 0 24px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          opacity: 0,
          zIndex: 2,
        }}
      >
        <div
          style={{
            minHeight: 54,
            fontSize: 22,
            color: "#0D0D0D",
            fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
            lineHeight: 1.45,
            display: "flex",
            alignItems: "flex-start",
            flexWrap: "wrap",
            paddingBottom: 8,
          }}
        >
          <span ref={typedRef} style={{ display: "inline" }}></span>
          <span
            ref={xcodeChipRef}
            style={{
              display: "none",
              alignItems: "center",
              gap: 4,
              background: "#EFF3FF",
              border: "1px solid #C7D3FF",
              borderRadius: 6,
              padding: "1px 8px",
              fontSize: 20,
              color: "#3B5FE0",
              fontWeight: 500,
              margin: "0 2px",
              verticalAlign: "baseline",
            }}
          >
            <span style={{ fontSize: 16 }}>📄</span> Xcode
          </span>
          <span className="after-xcode" style={{ display: "inline" }}></span>
          <span
            ref={cursorBlinkRef}
            style={{
              display: "inline-block",
              width: 2,
              height: 22,
              background: "#0D0D0D",
              marginLeft: 1,
              verticalAlign: "middle",
              opacity: 1,
            }}
          />
        </div>

        {/* Toolbar row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 0 14px 0",
            borderTop: "1px solid #EBEBEB",
            marginTop: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 20, color: "#666" }}>+</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 15, color: "#555", background: "#F5F5F5", borderRadius: 8, padding: "5px 12px" }}>
              <span>✋</span>
              <span>Default permissions</span>
              <span style={{ fontSize: 12, color: "#888" }}>▾</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 15, color: "#444", background: "#F5F5F5", borderRadius: 8, padding: "5px 12px" }}>
              <span>GPT-5.3-Codex-Spark</span>
              <span style={{ fontSize: 12 }}>▾</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 15, color: "#444", background: "#F5F5F5", borderRadius: 8, padding: "5px 12px" }}>
              <span>Medium</span>
              <span style={{ fontSize: 12 }}>▾</span>
            </div>
            <span style={{ fontSize: 18, color: "#666" }}>🎤</span>
            <button
              ref={sendBtnRef}
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "#111111",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              <span style={{ color: "#FFF", fontSize: 18, marginTop: -2 }}>↑</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter chips row */}
      <div
        ref={chipsRef}
        style={{
          position: "absolute",
          top: 560,
          left: PANEL_LEFT,
          width: PANEL_W,
          display: "flex",
          gap: 8,
          opacity: 0,
          zIndex: 2,
        }}
      >
        {[
          { icon: "📁", label: "CloudTicTacToe" },
          { icon: "💻", label: "Work locally" },
          { icon: "🌿", label: "main" },
        ].map((chip) => (
          <div
            key={chip.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#F5F5F5",
              border: "1px solid #E0E0E0",
              borderRadius: 8,
              padding: "7px 14px",
              fontSize: 15,
              color: "#444",
              fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
            }}
          >
            <span style={{ fontSize: 14 }}>{chip.icon}</span>
            <span>{chip.label}</span>
            <span style={{ fontSize: 11, color: "#888" }}>▾</span>
          </div>
        ))}
      </div>

      {/* Suggestion pills */}
      <div
        ref={pillsRef}
        style={{
          position: "absolute",
          top: 630,
          left: PANEL_LEFT,
          width: PANEL_W,
          display: "flex",
          flexDirection: "column",
          gap: 0,
          opacity: 0,
          zIndex: 2,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 4px", borderTop: "1px solid #F0F0F0", fontSize: 17, color: "#333", fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif" }}>
          <span style={{ fontSize: 15, color: "#999", borderRadius: "50%", border: "1.5px solid #CCC", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>○</span>
          <span>Make the build fix commit-ready</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 4px", borderTop: "1px solid #F0F0F0", fontSize: 17, color: "#333", fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif" }}>
          <span style={{ fontSize: 18, color: "#999" }}>+</span>
          <span>Connect your favorite apps to Codex</span>
        </div>
      </div>
    </Timegroup>
  );
};

(Scene2 as any).duration = SCENE_DURATION;
