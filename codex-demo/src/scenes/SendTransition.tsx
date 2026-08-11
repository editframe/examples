/**
 * Scene 3 — Send button click + fade-to-white transition
 * Duration: 1500ms (t=4500–6000ms)
 *
 * FIX A (Round 6): The card stays FULL-SCREEN white the entire time.
 * - Send button click pulse at t=200–500ms
 * - CONTENTS (headline + chat input + chips) FADE OUT in place → blank white slate
 * - NO sliding, NO shrinking, NO desktop bg reveal — that happens in PanelZoomOut
 * - By end: full-screen blank white, ready for PanelZoomOut to zoom out from
 */

import React from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { Sfx } from "../components/Sfx";

const SCENE_DURATION = 1500;
const SCENE_START_MS = 4500;
const CLICK_START = 200;

export const SendTransition: React.FC = () => {
  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE_DURATION}ms` as any}
      style={{
        position: "relative",
        width: 1920,
        height: 1080,
        overflow: "hidden",
      }}
    >
      <TraceLayer sceneStartMs={SCENE_START_MS} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* Send button click SFX, synced to the click pulse */}
      <Sfx cue="click" at={CLICK_START / 1000} dur={0.3} volume={1} sourceIn={0.6} />

      {/* Full-screen white card — NEVER moves, NEVER shrinks, NEVER reveals desktop */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1920,
          height: 1080,
          background: "#FFFFFF",
          zIndex: 2,
        }}
      >
        {/* Contents wrapper — fades out in place after click.
            Layout is PIXEL-IDENTICAL to PromptType's final frame (same absolute positions)
            so there is no snap or position shift at the PromptType→SendTransition boundary. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            animation: "s3-contents-out 600ms 500ms cubic-bezier(0.33,1,0.68,1) forwards",
          }}
        >
          {/* Headline — same position as PromptType: top:160, centered */}
          <div style={{
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
            whiteSpace: "nowrap",
          }}>
            What will you build in CloudTicTacToe?
          </div>

          {/* Chat input — same position as PromptType: top:310 */}
          <div
            style={{
              position: "absolute",
              top: 310,
              left: 285,
              width: 1350,
              border: "1.5px solid #D0D0D0",
              borderRadius: 16,
              padding: "22px 24px 0 24px",
              background: "#FFFFFF",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ fontSize: 22, color: "#0D0D0D", fontFamily: "'SF Pro Text', sans-serif", lineHeight: 1.45, display: "flex", flexWrap: "wrap", alignItems: "center", paddingBottom: 8 }}>
              <span>Run this app in </span>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                background: "#EFF3FF", border: "1px solid #C7D3FF", borderRadius: 6,
                padding: "1px 8px", fontSize: 20, color: "#3B5FE0", fontWeight: 500, margin: "0 2px"
              }}>
                <span style={{ fontSize: 16 }}>📄</span> Xcode
              </span>
              <span> , test it by playing a game, and fix any bugs you find</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0 14px 0", borderTop: "1px solid #EBEBEB", marginTop: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 20, color: "#666" }}>+</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 15, color: "#555", background: "#F5F5F5", borderRadius: 8, padding: "5px 12px" }}>
                  <span>✋</span><span>Default permissions</span><span style={{ fontSize: 12, color: "#888" }}>▾</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 15, background: "#F5F5F5", borderRadius: 8, padding: "5px 12px", color: "#444" }}>
                  <span>GPT-5.3-Codex-Spark</span><span style={{ fontSize: 12 }}>▾</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 15, background: "#F5F5F5", borderRadius: 8, padding: "5px 12px", color: "#444" }}>
                  <span>Medium</span><span style={{ fontSize: 12 }}>▾</span>
                </div>
                <span style={{ fontSize: 18, color: "#666" }}>🎤</span>
                {/* Send button with click pulse */}
                <div
                  style={{
                    width: 42, height: 42, borderRadius: "50%",
                    background: "#111111",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transformOrigin: "center center",
                    boxShadow: "0 0 16px rgba(0,0,0,0.4)",
                    animation: "s3-send-click 300ms 200ms linear both",
                  }}
                >
                  <span style={{ color: "#FFF", fontSize: 18, marginTop: -2 }}>↑</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter chips — same position as PromptType: top:560, left:285.
              borderRadius:8 to match PromptType exactly (NOT rounded pill). */}
          <div style={{
            position: "absolute",
            top: 560,
            left: 285,
            display: "flex",
            gap: 8,
          }}>
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

          {/* Suggestion pills — same position as PromptType: top:630, left:285 */}
          <div style={{
            position: "absolute",
            top: 630,
            left: 285,
            width: 1350,
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 4px", borderTop: "1px solid #F0F0F0", fontSize: 17, color: "#333", fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif" }}>
              <span style={{ fontSize: 15, color: "#999", borderRadius: "50%", border: "1.5px solid #CCC", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>○</span>
              <span>Make the build fix commit-ready</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 4px", borderTop: "1px solid #F0F0F0", fontSize: 17, color: "#333", fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif" }}>
              <span style={{ fontSize: 18, color: "#999" }}>+</span>
              <span>Connect your favorite apps to Codex</span>
            </div>
          </div>
        </div>
      </div>
    </Timegroup>
  );
};

(SendTransition as any).duration = SCENE_DURATION;
