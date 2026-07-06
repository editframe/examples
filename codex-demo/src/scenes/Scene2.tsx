/**
 * Scene 2 — CloudTicTacToe headline + chat input + typing
 * Duration: 2000ms (t=2500–4500ms)
 *
 * Reference: ref-frames/frame_0005.jpg, frame_0006.jpg, frame_0007.jpg
 * - Pure white #FFFFFF background
 * - "What will you build in CloudTicTacToe?" headline centered ~64px
 * - Chat input box: "Run this app in [Xcode] , test it by playing a game, and fix any bugs you find"
 * - Below input: toolbar row, chips row, suggestion pills
 * - Typing starts immediately (faster than v4)
 *
 * FIX 2: Compressed from 5500ms to 2000ms. Typing faster (25ms/char).
 *
 * The char-by-char typewriter effect (with the "Xcode" chip swapped in mid-string) is the
 * one genuinely irreducible per-frame effect in this scene — it's kept as a small
 * scene-scoped `onFrame`. Everything else (background/headline/panel/chips/pills fades,
 * caret blink) is plain CSS. Note: at 22ms/char the 76-char message needs 2472ms to fully
 * type, longer than this scene's own 2000ms duration — so the "typing complete" send-button
 * pulse in the original never actually fires within this scene. Preserved as-is (the send
 * button renders in its static "not done" state) rather than silently changing the timing.
 */

import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { Reveal } from "../components/Reveal";
import { Sfx } from "../components/Sfx";

const SCENE_DURATION = 2000;
const SCENE_START_MS = 2500;

const PANEL_W = 1350;
const PANEL_LEFT = (1920 - PANEL_W) / 2; // 285

// Typing starts at t=800ms to let UI appear first
const TYPE_START = 800;
const FULL_MSG = "Run this app in Xcode , test it by playing a game, and fix any bugs you find";
const XCODE_END_IDX = 21; // "Run this app in Xcode" = 21 chars
const MS_PER_CHAR = 22; // faster to finish within 2s

export const Scene2: React.FC = () => {
  const typedRef = useRef<HTMLSpanElement>(null);
  const xcodeChipRef = useRef<HTMLSpanElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // Typewriter reveal + mid-string Xcode chip swap — see file header for why this stays JS.
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

      {/* Keyboard typing SFX, synced to TYPE_START */}
      <Sfx cue="keyboard" at={TYPE_START / 1000} dur={1.2} volume={0.7} />

      {!TRACE_MODE && (
        <Reveal enter={[0, 300]} y={0} style={{ position: "absolute", inset: 0, background: "#FFFFFF", zIndex: 1 }} />
      )}

      {/* Headline */}
      <Reveal
        enter={[100, 500]}
        y={20}
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
          zIndex: 2,
          whiteSpace: "nowrap",
        }}
      >
        What will you build in CloudTicTacToe?
      </Reveal>

      {/* Chat input panel */}
      <Reveal
        enter={[300, 600]}
        y={16}
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
            style={{
              display: "inline-block",
              width: 2,
              height: 22,
              background: "#0D0D0D",
              marginLeft: 1,
              verticalAlign: "middle",
              animation: "s2-caret-blink 1000ms steps(1) 800ms infinite backwards",
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
            {/* Static "not done" state — see file header: typing never completes within this scene */}
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "#111111",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#FFF", fontSize: 18, marginTop: -2 }}>↑</span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Filter chips row */}
      <Reveal
        enter={[500, 800]}
        y={12}
        style={{
          position: "absolute",
          top: 560,
          left: PANEL_LEFT,
          width: PANEL_W,
          display: "flex",
          gap: 8,
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
      </Reveal>

      {/* Suggestion pills */}
      <Reveal
        enter={[700, 1000]}
        y={12}
        style={{
          position: "absolute",
          top: 630,
          left: PANEL_LEFT,
          width: PANEL_W,
          display: "flex",
          flexDirection: "column",
          gap: 0,
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
      </Reveal>
    </Timegroup>
  );
};

(Scene2 as any).duration = SCENE_DURATION;
