/**
 * Scene 4 — "Create a New Environment" popup
 * Duration: 2500ms
 *
 * REFERENCE _ref_08s.jpg:
 *   - Gradient background (same as Scene 1)
 *   - White modal — "Create New Environment" title
 *   - Two repo rows with "Edit" buttons (anysphere/frontend, anysphere/backend)
 *   - Bottom-right: black "Start Agent ↗" button (rounded rectangle)
 *   - Cursor (hand pointer) sitting ON the Start Agent button
 *
 * GEOMETRY (no zoom — simpler, cursor can land precisely):
 *   Popup: 880×auto px centered
 *   The camera zooms in toward the Start Agent button
 *   Cursor is OUTSIDE the zoom wrapper so it stays in screen space
 *
 * POPUP dimensions:
 *   Width: 880px, centered → left = (1920-880)/2 = 520
 *   Header: padding-top 30, title 32px lineHeight, margin-bottom 20 → header bottom = 82
 *   HR at y=82, padding-top 24 for body
 *   Label row: 20px + mb 12 → y=138
 *   Row 1 (52px height): y=138→190, mb=10
 *   Row 2 (52px height): y=200→252, mb=30
 *   Footer: y=282, height ~52px → footer center y = 308
 *   Footer in canvas: POPUP_TOP + 282 + 26 = POPUP_TOP + 308
 *   POPUP_TOP = (1080 - total_popup_height)/2
 *   Total popup height ≈ 30+32+20+1+24+20+12+52+10+52+30+52+30 = ~365px
 *   POPUP_TOP ≈ (1080-365)/2 = 357
 *   BTN_CENTER_Y in canvas ≈ 357 + 308 = 665 → actually let's use POPUP_TOP=340 for nice centering
 *
 * Computed with POPUP_TOP=340:
 *   BTN_CENTER_Y = 340 + 308 = 648
 *   BTN_CENTER_X = right side: 520+880-36 = 1364, btn width ~190, center = 1364-95 = 1269
 */
import React from "react";
import { Timegroup, Image, Audio } from "@editframe/react";
import { TraceLayer } from "../components/TraceLayer";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";

const DURATION = 2500;
const START_MASTER = 6500;

const POPUP_W = 880;

// Button geometry (must match JSX below precisely)
// Popup centered at (960, 540), width 880
// Body left-right padding: 36px
// Button: right-aligned, width ~200px, height ~46px
// Popup body right edge in canvas: 960 + 440 - 36 = 1364
// Button center x: 1364 - 100 = 1264
const BTN_CENTER_X = 1264;
// Popup height ≈ 356px → popup top ≈ 540 - 178 = 362
// Vertical stack to button center:
//   header padding-top: 28
//   title lineHeight ~33: 33
//   header margin-bottom: 20
//   HR: 1
//   body padding-top: 24
//   label 18px + mb 10: 28
//   row1 52px + mb 10: 62
//   row2 52px + mb 32: 84
//   footer btn half-height ~23: 23
//   total: 28+33+20+1+24+28+62+84+23 = 303
const BTN_CENTER_Y = 362 + 303;  // ≈ 665

// Zoom origin — starts zooming toward the button
const ZOOM_ORIGIN_X = BTN_CENTER_X;
const ZOOM_ORIGIN_Y = BTN_CENTER_Y;

// Cursor: starts at bottom-right (1600,980), moves to button tip in SCREEN space
// (button sits at the zoom origin, so its screen position is fixed regardless of scale).
// Cursor tip (top-left of arrow SVG) lands at button centre minus (6,8) = (1258,657).
// These are baked directly into the `scene4-cursor-move` @keyframes (styles.css).

export function Scene4_CreateEnv() {
  return (
    <Timegroup
      mode="fixed"
      duration="2.5s"
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0, width: 1920, height: 1080 }}
    >
      {/* Gradient bg */}
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

      {/* Zoom wrapper — contains only the popup, NOT the cursor. Camera zoom: 600ms -> 1350ms, scale 1 -> 2.4, origin on button */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: 1920,
          height: 1080,
          zIndex: 10,
          transformOrigin: `${ZOOM_ORIGIN_X}px ${ZOOM_ORIGIN_Y}px`,
          animation: "scene4-camera-zoom 750ms 600ms cubic-bezier(0.65,0,0.35,1) both",
        }}
      >
        {/* Create New Environment popup — fades + slides up 0-450ms */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: POPUP_W,
            animation: "scene4-panel-in 450ms cubic-bezier(0.33,1,0.68,1) both",
            background: "#FFFFFF",
            borderRadius: 20,
            boxShadow: "0 24px 72px rgba(0,0,0,0.22), 0 6px 20px rgba(0,0,0,0.10)",
            zIndex: 10,
            overflow: "visible",
            fontFamily: "system-ui, -apple-system, 'SF Pro Display', 'Inter', sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "28px 36px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.01em" }}>
              Create New Environment
            </div>
            <div style={{ color: "#AAAAAA", fontSize: 18, cursor: "pointer", lineHeight: 1 }}>✕</div>
          </div>

          <div style={{ height: 1, background: "#F0F0F0" }} />

          {/* Body */}
          <div style={{ padding: "24px 36px 30px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
              Repository
            </div>

            {/* anysphere/frontend row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                background: "#F9F9F9",
                borderRadius: 10,
                border: "1px solid #EFEFEF",
                marginBottom: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#1A1A1A", fontSize: 15 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1.5 3.5h5l1.5 1.5h6.5v9h-13V3.5z" stroke="#666" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
                </svg>
                anysphere/frontend
              </div>
              <button
                style={{
                  background: "transparent",
                  border: "1px solid #D0D0D0",
                  borderRadius: 7,
                  padding: "6px 18px",
                  fontSize: 14,
                  color: "#666",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Edit
              </button>
            </div>

            {/* anysphere/backend row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                background: "#F9F9F9",
                borderRadius: 10,
                border: "1px solid #EFEFEF",
                marginBottom: 32,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#1A1A1A", fontSize: 15 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1.5 3.5h5l1.5 1.5h6.5v9h-13V3.5z" stroke="#666" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
                </svg>
                anysphere/backend
              </div>
              <button
                style={{
                  background: "transparent",
                  border: "1px solid #D0D0D0",
                  borderRadius: 7,
                  padding: "6px 18px",
                  fontSize: 14,
                  color: "#666",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Edit
              </button>
            </div>

            {/* Footer row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, color: "#999", textDecoration: "underline", cursor: "pointer" }}>
                Set up manually
              </span>

              {/* START AGENT button — click-squeeze scale + darken at 1500-1940ms */}
              <div
                style={{
                  color: "#FFFFFF",
                  borderRadius: 12,
                  padding: "15px 38px",
                  fontSize: 16,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                  userSelect: "none",
                  position: "relative",
                  transformOrigin: "center center",
                  boxShadow: "0 4px 18px rgba(0,0,0,0.30)",
                  minWidth: 200,
                  justifyContent: "center",
                  letterSpacing: "-0.01em",
                  animation: [
                    "scene4-btn-scale 2500ms linear both",
                    "scene4-btn-bg 2500ms linear both",
                  ].join(", "),
                }}
              >
                Start Agent
                <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                  <path d="M3 11L11 3M11 3H5M11 3v6" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                {/* Click ripple: 1500ms -> 1900ms */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.36)",
                    pointerEvents: "none",
                    animation: "scene4-ripple 400ms 1500ms linear both",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CURSOR — OUTSIDE zoom wrapper, moves in screen space */}
      <div
        style={{
          position: "absolute",
          left: 1600,
          top: 980,
          zIndex: 100,
          pointerEvents: "none",
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
          transformOrigin: "top left",
          animation: [
            "fade-in 200ms 500ms linear both",
            "scene4-cursor-move 700ms 700ms cubic-bezier(0.33,1,0.68,1) both",
            "scene4-cursor-squeeze 2500ms linear both",
          ].join(", "),
        }}
      >
        {/* macOS pointer cursor (hand) — matches reference which shows a hand cursor */}
        <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
          {/* Palm */}
          <path
            d="M8 18V8a2 2 0 014 0v6M12 14V7a2 2 0 014 0v7M16 14V8a2 2 0 014 0v6M20 16V10a2 2 0 014 0v12c0 5.5-3.6 10-8 10S4 27.5 4 22v-8a2 2 0 014 0v4"
            fill="white"
            stroke="#111"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <TraceLayer sceneStartMs={START_MASTER} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* "Start Agent" button click — global 8000ms (this scene starts at 6500ms master) */}
      <Audio src="/assets/sfx/click.mp3" offset="1500ms" sourceIn="0.6s" duration="0.3s" volume={1} />
    </Timegroup>
  );
}

Scene4_CreateEnv.duration = DURATION;
