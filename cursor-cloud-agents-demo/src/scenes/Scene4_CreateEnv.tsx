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
import React, { useRef, useCallback } from "react";
import { Timegroup } from "@editframe/react";
import { lerp, clamp } from "../components/helpers";
import { TraceLayer } from "../components/TraceLayer";
import { TRACE_MODE } from "../constants";
import { gradientBgV5 } from "../assets/gradient-bg-v5";

const DURATION = 2500;
const START_MASTER = 6500;

const POPUP_W = 880;
// We'll let the popup height be auto, just set a generous initial top
const POPUP_LEFT = (1920 - POPUP_W) / 2;   // 520
const POPUP_TOP = 280; // slightly above center to make room for button near center

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

// Cursor: starts at bottom-right, moves to button center in SCREEN space
// Since button is at zoom origin, its screen position = (BTN_CENTER_X, BTN_CENTER_Y) regardless of scale
const CURSOR_START_X = 1600;
const CURSOR_START_Y = 980;
// Cursor tip (top-left of arrow SVG) should land at button center
const BTN_TIP_X = BTN_CENTER_X - 6;   // tip slightly left of center
const BTN_TIP_Y = BTN_CENTER_Y - 8;   // tip slightly above center

export function Scene4_CreateEnv() {
  const panelRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const startBtnRef = useRef<HTMLDivElement>(null);
  const clickRippleRef = useRef<HTMLDivElement>(null);
  const zoomWrapRef = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // Panel fades + slides up: 0–450ms
    const panelT = clamp(ms / 450);
    const panelE = 1 - Math.pow(1 - panelT, 3);
    if (panelRef.current) {
      panelRef.current.style.opacity = String(lerp(0, 1, panelE));
      panelRef.current.style.transform = `translate(-50%, calc(-50% + ${lerp(20, 0, panelE)}px))`;
    }

    // Camera zoom: 600ms → 1350ms (scale 1 → 2.4), origin on button
    const zoomT = clamp((ms - 600) / 750);
    const zoomE = zoomT < 0.5 ? 4 * zoomT * zoomT * zoomT : 1 - Math.pow(-2 * zoomT + 2, 3) / 2;
    const zoomScale = lerp(1, 2.4, zoomE);
    if (zoomWrapRef.current) {
      zoomWrapRef.current.style.transformOrigin = `${ZOOM_ORIGIN_X}px ${ZOOM_ORIGIN_Y}px`;
      zoomWrapRef.current.style.transform = `scale(${zoomScale})`;
    }

    // Cursor fades in: 500–700ms (appears BEFORE camera finishes zooming)
    const cursorFadeT = clamp((ms - 500) / 200);
    // Cursor moves: 700ms → 1400ms toward button tip position (in screen coords)
    const cursorMoveT = clamp((ms - 700) / 700);
    const cursorMoveE = 1 - Math.pow(1 - cursorMoveT, 3);
    const cx = lerp(CURSOR_START_X, BTN_TIP_X, cursorMoveE);
    const cy = lerp(CURSOR_START_Y, BTN_TIP_Y, cursorMoveE);

    if (cursorRef.current) {
      cursorRef.current.style.opacity = String(lerp(0, 1, cursorFadeT));
      cursorRef.current.style.left = `${cx}px`;
      cursorRef.current.style.top = `${cy}px`;
    }

    // Click at 1500ms — cursor squeeze
    if (cursorRef.current) {
      if (ms >= 1500 && ms < 1620) {
        cursorRef.current.style.transform = `scale(0.86)`;
      } else {
        cursorRef.current.style.transform = `scale(1)`;
      }
    }

    // Button click animation
    let btnScale = 1;
    if (ms >= 1500 && ms < 1580) {
      btnScale = lerp(1, 0.93, clamp((ms - 1500) / 80));
    } else if (ms >= 1580 && ms < 1780) {
      const t = clamp((ms - 1580) / 200);
      btnScale = lerp(0.93, 1.04, 1 - Math.pow(1 - t, 3));
    } else if (ms >= 1780) {
      btnScale = lerp(1.04, 1, clamp((ms - 1780) / 160));
    }

    if (startBtnRef.current) {
      startBtnRef.current.style.transform = `scale(${btnScale})`;
      if (ms >= 1500 && ms < 1720) {
        startBtnRef.current.style.background = "#1C1C1C";
      } else {
        startBtnRef.current.style.background = "#000000";
      }
    }

    // Click ripple: 1500ms → 1900ms
    const rippleT = clamp((ms - 1500) / 400);
    if (clickRippleRef.current) {
      const rippleScale = lerp(0, 2.2, rippleT);
      const rippleOpacity = ms >= 1500 ? lerp(0.5, 0, rippleT) : 0;
      clickRippleRef.current.style.transform = `translate(-50%, -50%) scale(${rippleScale})`;
      clickRippleRef.current.style.opacity = String(rippleOpacity);
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration="2.5s"
      onFrame={onFrame as any}
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0, width: 1920, height: 1080 }}
    >
      {/* Gradient bg */}
      {!TRACE_MODE && (
        <img
          src={gradientBgV5}
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

      {/* Zoom wrapper — contains only the popup, NOT the cursor */}
      <div
        ref={zoomWrapRef}
        style={{
          position: "absolute",
          inset: 0,
          width: 1920,
          height: 1080,
          zIndex: 10,
          transformOrigin: `${ZOOM_ORIGIN_X}px ${ZOOM_ORIGIN_Y}px`,
        }}
      >
        {/* Create New Environment popup */}
        <div
          ref={panelRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: POPUP_W,
            background: "#FFFFFF",
            borderRadius: 20,
            boxShadow: "0 24px 72px rgba(0,0,0,0.22), 0 6px 20px rgba(0,0,0,0.10)",
            zIndex: 10,
            overflow: "visible",
            opacity: 0,
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

              {/* START AGENT button */}
              <div
                ref={startBtnRef}
                style={{
                  background: "#000000",
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
                }}
              >
                Start Agent
                <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                  <path d="M3 11L11 3M11 3H5M11 3v6" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                {/* Click ripple */}
                <div
                  ref={clickRippleRef}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.36)",
                    transform: "translate(-50%, -50%) scale(0)",
                    opacity: 0,
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CURSOR — OUTSIDE zoom wrapper, moves in screen space */}
      <div
        ref={cursorRef}
        style={{
          position: "absolute",
          left: CURSOR_START_X,
          top: CURSOR_START_Y,
          zIndex: 100,
          opacity: 0,
          pointerEvents: "none",
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
          transformOrigin: "top left",
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

      <TraceLayer sceneStartMs={START_MASTER} enabled={TRACE_MODE} opacity={0.4} />
    </Timegroup>
  );
}

Scene4_CreateEnv.duration = DURATION;
