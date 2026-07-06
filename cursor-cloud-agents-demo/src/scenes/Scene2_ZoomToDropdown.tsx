/**
 * Scene 2 — Camera zooms INTO chatbox → Search Repository dropdown
 * Duration: 2000ms
 *
 * REFERENCE _ref_03s.jpg: After the zoom, we see the chips row enlarged
 * with a dropdown below "anysphere/core-ui" showing:
 *   - Search field: "Search repository, environment..."
 *   - "Recent" header
 *   - anysphere/frontend (folder icon)
 *   - anysphere/backend (folder icon)
 *   - separator
 *   - Add Repository
 *   - Add Environment (highlighted)
 *
 * WINDOW GEOMETRY (must match Scene1 new layout):
 *   WIN_W = 1190, WIN_H = 690, centered at (960, 540)
 *   WIN_LEFT = 365, WIN_TOP = 195
 *   Sidebar = 220px
 *   Main area left: 365+220 = 585
 *   Chips padding-left: 48px → chips start x = 633
 *   "anysphere/core-ui" chip ~140px wide → chip center x ≈ 703
 *   Chips center y ≈ 195+690-177 = 708
 */
import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { Reveal } from "../components/Reveal";
import { TraceLayer } from "../components/TraceLayer";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";

const DURATION = 2000;
const START_MASTER = 2500;

// Window geometry — must match Scene1 new layout exactly
const WIN_W = 1420;
const WIN_H = 820;
const WIN_LEFT = (1920 - WIN_W) / 2;  // 250
const WIN_TOP = (1080 - WIN_H) / 2;   // 130
const SIDEBAR_W = 220;

// CENTERED ZOOM ORIGIN — fix: the dropdown is absolutely positioned relative to
// the chip which is inside padding-left:48px in the main content area.
// Main area left edge: WIN_LEFT + SIDEBAR_W = 250 + 220 = 470
// Chips padding-left = 48px → first chip starts at x = 518
// Dropdown is 460px wide, left=0 → dropdown spans x=518..978
// Dropdown horizontal center ≈ 518 + 230 = 748
// But reference shows the FULL UI centered at frame center ~960.
// The issue: our window is 1420px wide, main area is 1420-220=1200px.
// The content (chips + dropdown) sits with padding 48px from the main area edge.
// To center the dropdown horizontally at frame center (960):
//   ORIGIN_X = center of dropdown = 748 is off-center left.
//   The reference shows NO sidebar — just chips + dropdown centered.
//   We need to zoom on the FRAME CENTER (960) but the dropdown center is at ~748.
//   We can fix by changing the zoom target to be centered in the main area:
//   Main area center x: 470 + 1200/2 = 1070 (too far right)
//   Actual: the chip "anysphere/core-ui" is 140px wide, starts at 518 → chip center = 588
//   Dropdown 460px wide, starts at chip left (518) → dropdown center = 518 + 230 = 748
//   To make the dropdown appear CENTERED in the 1920 frame at the zoomed scale,
//   we set ORIGIN_X = 748 (actual dropdown center) and let transform-origin do its job.
//   At scale 2.0 the frame appears as a 960px viewport centered on ORIGIN_X.
//   So the dropdown center (748) would be at screen position 960 - offset from center.
//   The viewport left edge at scale 2.0 = ORIGIN_X - 960/2 = 748 - 480 = 268
//   Dropdown center in screen: (748 - 268) * 2 = 960 ✓  (exactly frame center!)
//   We need a moderate zoom (1.8–2.0) so the full dropdown (350px tall) fits in frame.
//   At scale 2.0, viewport height = 1080/2 = 540px → dropdown 350px fits with breathing room.
//   Chips are at y≈486 (above dropdown), so total chips+dropdown span ≈ 486..860 = 374px
//   At scale 2.0 viewport top = ORIGIN_Y - 540/2 = ORIGIN_Y - 270
//   We want chips (at 486) and bottom of dropdown (at ~860) visible:
//   ORIGIN_Y = (486 + 860) / 2 = 673 → viewport 403..943, chips at (486-403)*2=166 from top
//   Bottom of dropdown at (860-403)*2=914 from top — fits within 1080! ✓
// At scale 2.0: viewport_left = ORIGIN_X - 960/2
// For sidebar (ends at 470) to be off-screen left: ORIGIN_X - 480 >= 470 → ORIGIN_X >= 950
// Dropdown center at 748: screen position = (748 - viewport_left) * 2 = (748 - 470) * 2 = 556
// But we want it centered (960). So offset the ORIGIN a bit left from 950 while keeping sidebar off.
// At ORIGIN_X=900: viewport_left=420, sidebar partially in. At ORIGIN_X=960: viewport_left=480.
// Best compromise: ORIGIN_X=960 → viewport_left=480, sidebar fully hidden (ends at 470).
// Dropdown center at 748: screen_x = (748-480)*2 = 536, slightly left of center (960).
// Dropdown center: empirical back-calculation from rendered frames.
// At scale=1.5 (reduced from 2.0 to match reference "not so zoomed"):
//   The translate math: screen_x = (layout_x + tx) * scale, tx = 960/scale - ORIGIN_X
//   We measured that at scale=1.8 with ORIGIN_X=654, content center ≈ 862 (should be 960).
//   Since the formula IS correct, the issue is the render environment offset.
//   Observed offset: center is consistently ~100px left of where math predicts.
//   Correction: add ~100px to ORIGIN_X to account for this. So use ORIGIN_X = 960/1.5 = 640.
//   At scale=1.5 centering: ORIGIN_X should = actual_dropdown_center_layout.
//   From observation: actual center ≈ 683 layout units when theory says 748.
//   Difference = 65px. So at scale=1.5: to get screen_x=960, ORIGIN_X = 683.
//   Additional observed leftward bias: add +50 correction → ORIGIN_X = 733.
// ORIGIN_Y: at scale=1.5, chip top ≈ screen 350, dropdown bottom ≈ 760. Center = 555.
// ROUND-8c CENTERING — the transform math (screen = (layout + t)*s) is exact,
// so ORIGIN_{X,Y} are simply the LAYOUT coordinates of the point that must land
// at frame centre (960,540). The reference _ref_03s shows the dropdown dead-
// centre with the chips at the top and the white window interior filling the
// whole frame (no gradient bleed).
//   • Dropdown is 460px wide, left-aligned to the core-ui chip (chip left = 518)
//     → dropdown horizontal centre = 518 + 230 = 748.
//   • Chips row centre ≈ native y 500; dropdown bottom ≈ native y 812; the whole
//     chips+dropdown group centres at ≈ (500 + 812)/2 ≈ 649.
// ── CONTINUOUS camera (ROUND-8d). Scene2 must START at EXACTLY Scene1's held
// framing (chatbox centred-left, scale 1.12) so there is NO snap at the 2.5s
// boundary, then zoom IN to the dropdown centred at ~2.0 (slightly more than
// before). The horizontal translate barely changes (the chatbox column ≈ the
// dropdown column), so the camera "stays put" horizontally and just pushes in
// + pans down to follow the dropdown — exactly what the reference does.
// DROPDOWN_CX/CY = 748/649 (dropdown + chips-group centre, layout coords).
// Scene1 held framing (MUST equal Scene1_Chatbox's camera constants):
//   CAM_Z_START=1.28 CAM_TX_START=-210 CAM_TY_START=-118
// End framing — dropdown dead-centre, slightly more zoomed:
//   CAM_Z_END=2.0 CAM_TX_END=960/2-748=-268 CAM_TY_END=540/2-649=-379
// These are baked directly into the `scene2d-camera-zoom` @keyframes (styles.css) —
// see that rule for the literal values this derivation produces.

export function Scene2_ZoomToDropdown() {
  return (
    <Timegroup
      mode="fixed"
      duration="2s"
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

      {/* Zoom wrapper — ONE continuous zoom from Scene1's held framing → dropdown
          dead-centre (no snap at the 2.5s boundary: starts at Scene1's exact transform). */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1920,
          height: 1080,
          zIndex: 10,
          transformOrigin: `0px 0px`,
          animation: "scene2d-camera-zoom 1500ms cubic-bezier(0.65,0,0.35,1) both",
        }}
      >
        {/* Chat window — same structure as Scene1 (updated dimensions, no traffic lights) */}
        <div
          style={{
            position: "absolute",
            left: WIN_LEFT,
            top: WIN_TOP,
            width: WIN_W,
            height: WIN_H,
            background: "#FFFFFF",
            borderRadius: 14,
            boxShadow: "0 32px 80px rgba(0,0,0,0.28), 0 8px 24px rgba(0,0,0,0.12)",
            overflow: "visible",
            fontFamily: "system-ui, -apple-system, 'SF Pro Display', 'Inter', sans-serif",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Title bar — web app, NO traffic-light dots */}
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
              borderRadius: "14px 14px 0 0",
            }}
          >
            <div style={{ background: "#EBEBEB", borderRadius: 7, padding: "5px 28px", fontSize: 14, color: "#666" }}>
              cursor.com/agents
            </div>
          </div>

          {/* Window body: sidebar + main content */}
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            {/* SIDEBAR — fades out during zoom (ref: reference video has no sidebar during zoom) */}
            <div
              style={{
                width: SIDEBAR_W,
                borderRight: "1px solid #EBEBEB",
                background: "#F9F9F9",
                display: "flex",
                flexDirection: "column",
                flexShrink: 0,
                animation: "scene2d-sidebar-fade-out 500ms cubic-bezier(0.11,0,0.5,0) both",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px 12px", borderBottom: "1px solid #EBEBEB" }}>
                <div style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="1" y="1" width="16" height="16" rx="3.5" stroke="#AAAAAA" strokeWidth="1.4"/>
                    <line x1="6" y1="1" x2="6" y2="17" stroke="#AAAAAA" strokeWidth="1.4"/>
                  </svg>
                </div>
                <div style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="7" cy="7" r="4.5" stroke="#AAAAAA" strokeWidth="1.4"/>
                    <path d="M10.5 10.5L14 14" stroke="#AAAAAA" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "#EFEFEF", margin: "8px", borderRadius: 8 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 2l10 6-5.5 1L5 15 3 2z" fill="#0A0A0A"/>
                </svg>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A" }}>New Agent</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "#999" }}>⌘N</span>
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ padding: "12px 16px", borderTop: "1px solid #EBEBEB", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#D4D4D4", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#666" }}>M</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.3 }}>Maya Gao</div>
                  <div style={{ fontSize: 11, color: "#999", lineHeight: 1.3 }}>anysphere</div>
                </div>
              </div>
            </div>

            {/* MAIN CONTENT */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FFFFFF", justifyContent: "center" }}>
              <div style={{ padding: "0 48px", position: "relative" }}>
                {/* Chips row — THE ZOOM TARGET */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, position: "relative" }}>
                  {/* anysphere/core-ui chip */}
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
                      position: "relative",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M1.5 3.5h5l1.5 1.5h6.5v9h-13V3.5z" stroke="#777" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
                    </svg>
                    anysphere/core-ui
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 4l4 4 4-4" stroke="#999" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>

                    {/* DROPDOWN — absolute positioned below this chip, fades in 650-950ms */}
                    <Reveal
                      enter={[650, 950]}
                      y={-6}
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "calc(100% + 6px)",
                        width: 460,
                        background: "#FFFFFF",
                        borderRadius: 13,
                        boxShadow: "0 10px 36px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)",
                        border: "1px solid #E8E8E8",
                        zIndex: 50,
                        overflow: "hidden",
                        transformOrigin: "top left",
                      }}
                    >
                      {/* Search input */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "13px 16px",
                          borderBottom: "1px solid #F0F0F0",
                          background: "#FAFAFA",
                        }}
                      >
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                          <circle cx="7" cy="7" r="4.5" stroke="#AAAAAA" strokeWidth="1.4"/>
                          <path d="M10.5 10.5L14 14" stroke="#AAAAAA" strokeWidth="1.4" strokeLinecap="round"/>
                        </svg>
                        <span style={{ fontSize: 14, color: "#AAAAAA", fontFamily: "system-ui, sans-serif" }}>
                          Search repository, environment...
                        </span>
                      </div>

                      {/* Recent header */}
                      <div style={{ padding: "9px 16px 5px", fontSize: 11, fontWeight: 600, color: "#AAAAAA", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "system-ui, sans-serif" }}>
                        Recent
                      </div>

                      {/* anysphere/frontend */}
                      <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 16px", fontSize: 14, color: "#1A1A1A", fontFamily: "system-ui, sans-serif" }}>
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                          <path d="M1.5 3.5h5l1.5 1.5h6.5v9h-13V3.5z" stroke="#666" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
                        </svg>
                        anysphere/frontend
                      </div>

                      {/* anysphere/backend */}
                      <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 16px", fontSize: 14, color: "#1A1A1A", fontFamily: "system-ui, sans-serif" }}>
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                          <path d="M1.5 3.5h5l1.5 1.5h6.5v9h-13V3.5z" stroke="#666" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
                        </svg>
                        anysphere/backend
                      </div>

                      {/* Separator */}
                      <div style={{ height: 1, background: "#EEEEEE", margin: "4px 0" }} />

                      {/* Add Repository */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", fontSize: 14, color: "#555", fontFamily: "system-ui, sans-serif" }}>
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                          <path d="M1.5 3.5h5l1.5 1.5h6.5v9h-13V3.5z" stroke="#888" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
                          <path d="M8 7v4M6 9h4" stroke="#888" strokeWidth="1.3" strokeLinecap="round"/>
                        </svg>
                        Add Repository
                      </div>

                      {/* Add Environment */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px 13px", fontSize: 14, color: "#555", fontFamily: "system-ui, sans-serif", background: "#F5F5F5" }}>
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                          <rect x="2" y="2" width="12" height="12" rx="3" stroke="#888" strokeWidth="1.2"/>
                          <path d="M8 5v6M5 8h6" stroke="#888" strokeWidth="1.3" strokeLinecap="round"/>
                        </svg>
                        Add Environment
                      </div>
                    </Reveal>
                  </div>

                  {/* main chip */}
                  <div style={{ display: "flex", alignItems: "center", gap: 7, background: "#F5F5F5", border: "1px solid #E0E0E0", borderRadius: 8, padding: "7px 12px", fontSize: 13, color: "#1A1A1A" }}>
                    main
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 4l4 4 4-4" stroke="#999" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  {/* cloud chip */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#F5F5F5", border: "1px solid #E0E0E0", borderRadius: 8, padding: "7px 11px", fontSize: 13, color: "#1A1A1A" }}>
                    <svg width="16" height="12" viewBox="0 0 18 14" fill="none">
                      <path d="M4 12a3.5 3.5 0 010-7c.15 0 .3.01.45.03A5 5 0 0114.5 8H15a2.5 2.5 0 010 5H4z" stroke="#888" strokeWidth="1.2" fill="none"/>
                    </svg>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 4l4 4 4-4" stroke="#999" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                {/* Input box */}
                <div style={{ background: "#FAFAFA", border: "1px solid #E8E8E8", borderRadius: 14, padding: "18px 20px 14px" }}>
                  <div style={{ fontSize: 16, color: "#B8B8B8", fontWeight: 400, marginBottom: 48, letterSpacing: "-0.01em" }}>
                    Build, fix, explore your codebase...
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, background: "#FFFFFF", border: "1px solid #DEDEDE", borderRadius: 8, padding: "6px 14px", fontSize: 13, color: "#444", fontWeight: 500 }}>
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                        <rect x="1" y="1" width="12" height="12" rx="3" fill="#0A0A0A"/>
                        <path d="M4 7h6M7 4v6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
                      </svg>
                      + Composer 2
                    </div>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
      </div>

      {/* White overlay — transition to Scene 3 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#FFFFFF",
          zIndex: 100,
          pointerEvents: "none",
          animation: "fade-in 300ms 1700ms linear both",
        }}
      />

      <TraceLayer sceneStartMs={START_MASTER} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />
    </Timegroup>
  );
}

Scene2_ZoomToDropdown.duration = DURATION;
