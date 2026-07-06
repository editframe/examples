/**
 * Scene 1 — cursor.com/agents chatbox window on gradient bg
 * Duration: 2500ms
 *
 * REFERENCE _ref_01s.jpg:
 *   - Soft teal/olive/peach gradient background
 *   - Centered white window (~1180×680px), rounded corners, shadow
 *   - Title bar: macOS dots + centered "cursor.com/agents" url pill
 *   - Left sidebar: narrow column (~220px) with two icons (sidebar toggle, search)
 *     at top, then "New Agent" highlighted item below, then bottom "Maya Gao / anysphere"
 *   - Main content area: EMPTY white space with chat input positioned ~55% down
 *   - Chat input area at vertical center: chips row + large input box
 *   - Chips row: "anysphere/core-ui ▾"  "main ▾"  "cloud ▾" pills (left-aligned in input area)
 *   - Input box below chips: placeholder "Build, fix, explore your codebase..."
 *     with "+ Composer 2" button bottom-left and black circular send button bottom-right
 */
import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { TraceLayer } from "../components/TraceLayer";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";

const DURATION = 2500;

// Window geometry — bigger window matching ref_1s.jpg
const WIN_W = 1420;
const WIN_H = 820;
const WIN_LEFT = (1920 - WIN_W) / 2; // 250
const WIN_TOP  = (1080 - WIN_H) / 2; // 130

// ── HELD camera framing (ROUND-8d). A slight static zoom so the window fills
// the frame and the chatbox reads centred / slightly middle-left (matching the
// reference). The camera NEVER moves in Scene1 — and Scene2 starts at THIS
// EXACT transform, so the zoom-in continues smoothly with NO snap at the 2.5s
// boundary. (chatbox input centre ≈ layout (1070,545) → screen ≈ (900,540).)
// ROUND-8f: zoom up so the window FILLS the frame (symmetric ~50px margins) like
// the reference — this also re-centres the composition (chatbox sits just right
// of centre, sidebar on the left), instead of the old left-weighted framing.
// Window native (250,130,1420,820) → centred & frame-filling at Z=1.28.
const CAM_Z  = 1.28;
const CAM_TX = -210;
const CAM_TY = -118;

export function Scene1_Chatbox() {
  return (
    <Timegroup
      mode="fixed"
      duration="2.5s"
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0, width: 1920, height: 1080 }}
    >
      {/* Gradient background */}
      {!TRACE_MODE && (
        <Image
          src="/assets/gradient-bg-v5.png"
          style={{
            position: "absolute",
            inset: 0,
            width: 1920,
            height: 1080,
            objectFit: "cover",
            zIndex: 1,
          }}
        />
      )}

      {/* Camera rig — held framing (chatbox centred / slightly middle-left,
          slight zoom). Scene2 continues from this EXACT transform → no snap. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: 1920,
          height: 1080,
          zIndex: 10,
          transformOrigin: "0px 0px",
          transform: `scale(${CAM_Z}) translate(${CAM_TX}px, ${CAM_TY}px)`,
        }}
      >
      {/* Chat window — absolute at (WIN_LEFT, WIN_TOP) = centred in 1920×1080 */}
      <div
        style={{
          position: "absolute",
          left: WIN_LEFT,
          top: WIN_TOP,
          transformOrigin: "top center",
          width: WIN_W,
          height: WIN_H,
          background: "#FFFFFF",
          borderRadius: 14,
          boxShadow: "0 32px 80px rgba(0,0,0,0.28), 0 8px 24px rgba(0,0,0,0.12)",
          zIndex: 10,
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, 'SF Pro Display', 'Inter', sans-serif",
          display: "flex",
          flexDirection: "column",
          animation: [
            "scene1-panel-fold-in 600ms cubic-bezier(0.33,1,0.68,1) both",
            "fade-in 400ms linear both",
          ].join(", "),
        }}
      >
        {/* Web app title bar — NO traffic-light dots */}
        <div
          style={{
            height: 44,
            background: "#F5F5F5",
            borderBottom: "1px solid #E5E5E5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              background: "#EBEBEB",
              borderRadius: 7,
              padding: "5px 28px",
              fontSize: 14,
              color: "#666",
              letterSpacing: "-0.01em",
            }}
          >
            cursor.com/agents
          </div>
        </div>

        {/* Window body: sidebar + main content */}
        <div
          style={{
            display: "flex",
            flex: 1,
            overflow: "hidden",
            animation: "fade-in 500ms 450ms linear both",
          }}
        >
          {/* LEFT SIDEBAR — narrow, ~220px */}
          <div
            style={{
              width: 220,
              borderRight: "1px solid #EBEBEB",
              background: "#F9F9F9",
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
            }}
          >
            {/* Top icons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 16px 12px",
                borderBottom: "1px solid #EBEBEB",
              }}
            >
              {/* Sidebar toggle icon */}
              <div style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="1" y="1" width="16" height="16" rx="3.5" stroke="#AAAAAA" strokeWidth="1.4"/>
                  <line x1="6" y1="1" x2="6" y2="17" stroke="#AAAAAA" strokeWidth="1.4"/>
                </svg>
              </div>
              {/* Search icon */}
              <div style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="7" cy="7" r="4.5" stroke="#AAAAAA" strokeWidth="1.4"/>
                  <path d="M10.5 10.5L14 14" stroke="#AAAAAA" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            {/* New Agent item */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 16px",
                background: "#EFEFEF",
                margin: "8px",
                borderRadius: 8,
              }}
            >
              {/* Cursor icon */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 2l10 6-5.5 1L5 15 3 2z" fill="#0A0A0A"/>
              </svg>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A" }}>New Agent</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: "#999", letterSpacing: "0.02em" }}>⌘N</span>
            </div>

            {/* Spacer pushes user to bottom */}
            <div style={{ flex: 1 }} />

            {/* Bottom: user info */}
            <div
              style={{
                padding: "12px 16px",
                borderTop: "1px solid #EBEBEB",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "#D4D4D4",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#666",
                }}
              >
                M
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.3 }}>Maya Gao</div>
                <div style={{ fontSize: 11, color: "#999", lineHeight: 1.3 }}>anysphere</div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="3" r="1.2" fill="#AAA"/>
                  <circle cx="7" cy="7" r="1.2" fill="#AAA"/>
                  <circle cx="7" cy="11" r="1.2" fill="#AAA"/>
                </svg>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5.5" stroke="#AAA" strokeWidth="1.2"/>
                  <path d="M5 7.5l2 2 4-4" stroke="#AAA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT AREA — large empty area with input centered vertically */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              background: "#FFFFFF",
              position: "relative",
              justifyContent: "center",
            }}
          >
            {/* Input container — CENTERED vertically */}
            <div style={{ padding: "0 48px" }}>
              {/* Chips row */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                {/* Repo chip */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    background: "#F5F5F5",
                    border: "1px solid #E0E0E0",
                    borderRadius: 8,
                    padding: "7px 14px",
                    fontSize: 13,
                    color: "#1A1A1A",
                    fontWeight: 500,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M1.5 3.5h5l1.5 1.5h6.5v9h-13V3.5z" stroke="#777" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
                  </svg>
                  anysphere/core-ui
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4l4 4 4-4" stroke="#999" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Branch chip */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    background: "#F5F5F5",
                    border: "1px solid #E0E0E0",
                    borderRadius: 8,
                    padding: "7px 12px",
                    fontSize: 13,
                    color: "#1A1A1A",
                  }}
                >
                  main
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4l4 4 4-4" stroke="#999" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Cloud chip */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "#F5F5F5",
                    border: "1px solid #E0E0E0",
                    borderRadius: 8,
                    padding: "7px 11px",
                    fontSize: 13,
                    color: "#1A1A1A",
                  }}
                >
                  <svg width="16" height="12" viewBox="0 0 18 14" fill="none">
                    <path d="M4 12a3.5 3.5 0 010-7c.15 0 .3.01.45.03A5 5 0 0114.5 8H15a2.5 2.5 0 010 5H4z" stroke="#888" strokeWidth="1.2" fill="none"/>
                  </svg>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4l4 4 4-4" stroke="#999" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Input box */}
              <div
                style={{
                  background: "#FAFAFA",
                  border: "1px solid #E8E8E8",
                  borderRadius: 14,
                  padding: "18px 20px 14px",
                }}
              >
                {/* Placeholder */}
                <div
                  style={{
                    fontSize: 16,
                    color: "#B8B8B8",
                    fontWeight: 400,
                    marginBottom: 48,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Build, fix, explore your codebase...
                </div>

                {/* Bottom row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {/* Composer 2 button */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      background: "#FFFFFF",
                      border: "1px solid #DEDEDE",
                      borderRadius: 8,
                      padding: "6px 14px",
                      fontSize: 13,
                      color: "#444",
                      fontWeight: 500,
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <rect x="1" y="1" width="12" height="12" rx="3" fill="#0A0A0A"/>
                      <path d="M4 7h6M7 4v6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                    + Composer 2
                  </div>

                  {/* Send button */}
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: "#0A0A0A",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M8 13V3M4 7l4-4 4 4" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>{/* camera rig */}

      <TraceLayer sceneStartMs={0} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />
    </Timegroup>
  );
}

Scene1_Chatbox.duration = DURATION;
