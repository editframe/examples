/**
 * Scene 6 — Camera zooms in hard on Xcode RUN button, cursor clicks it,
 *           camera pans BACK OUT. TicTacToe is NOT visible here (FIX 5).
 *           App only reveals when camera has fully panned back out (Scene7).
 * Duration: 1500ms (t=13000–14500ms)
 *
 * FIX B (Round 6): transformOrigin set to Run button position so zoom
 *   centers on the Xcode toolbar, NOT the Codex chat (left side).
 *   Run button container coords: x=648, y=42
 *   transformOrigin as % of container (1920 × 1052):
 *     x% = 648/1920 = 33.75%
 *     y% = 42/1052  = 3.99% ≈ 4%
 *   At this origin, zooming in keeps the Run button centered on screen.
 */

import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
// Clean macOS desktop gradient (no circles/grid artifacts)
const DESKTOP_BG = "linear-gradient(135deg, #8B9EC8 0%, #6B7FA8 20%, #4A5F9E 40%, #2E4590 60%, #1A2E7A 80%, #0D1B5E 100%)";
import { cursorMacosDataUri } from "../scenes/scene-assets";
import { track, lerp } from "../components/helpers";
import {
  XcodeWindow,
  CodexTitleBar,
  UserMessageBubble,
  ToolCallRow,
  CodexBottomBar,
} from "../components/panels";
import { eases } from "animejs";

const SCENE_DURATION = 1500;
const SCENE_START_MS = 13000;

const CAMERA_SCALE = 1.4;

const CODEX_W = 640;  // FIX 3: widened from 540 to 640
const CODEX_H = 620;
const XCODE_W = 860;
const XCODE_H = 680;
const CODEX_LEFT = 50;
const CODEX_TOP = 50;
const XCODE_LEFT = 500;
const XCODE_TOP = 20;

// CONTINUOUS camera (ROUND-7 jump-cut fix). Scene6 must start EXACTLY where
// Scene5 ends — scale 1.4, origin "top left", same panel positions — so there
// is NO snap at the 13s boundary. Then it pushes in GENTLY (to ~1.62, not a
// 2.6 slam — the slam shoved the Codex chat off-screen = "assets disappear"),
// holds for the Run click, then eases back to 1.0 for Scene7. The old build
// also jumped transformOrigin "top left" → "33.75% 4%" at the same scale,
// which teleported the whole layout ("version shifted down / snap cut").
// ROUND-8e: the 1.62 push read as "too minimal" — the run-button click wasn't a
// clear focal point. Deepen to 1.95 AND pan toward the Run button (translate, not
// an origin change → still continuous from Scene5, no jump) so the camera fixates
// on the coding panel with the cursor/Run button at upper-centre as the focal point.
// At peak: run button (native 648,42) → screen ≈ (960, 150).
//   tx = 960 - 648*1.95 = -304 ;  ty = 150 - (28 + 42*1.95) = 40
const PEAK_SCALE = 1.95;
const PEAK_TX = -304;
const PEAK_TY = 40;
const ZOOM_IN_START = 0;
const ZOOM_IN_END = 550;     // gentle push-in (no slam)
const ZOOM_HOLD_END = 900;   // hold while the cursor clicks Run
const ZOOM_OUT_START = 900;
const ZOOM_OUT_END = 1500;   // ease back to 1.0x for Scene7

// FIX 6: Cursor and click-ring are now rendered INSIDE the zoomed container,
// in the same coordinate space as the Xcode panel. No zoom math needed.
//
// Run button layout position inside XcodeWindow (XcodeTitleBar flex row):
//   padding-left: 12
//   traffic-lights group: 3×12px dots + 2×6px gaps = 48px wide
//   gap: 8
//   hamburger group (~22px wide)
//   gap: 8
//   stop button: 26px wide
//   gap: 8
//   Run button: 32px wide → center at +16
//   Total left edge: 12 + 48 + 8 + 22 + 8 + 26 + 8 = 132 → center = 148px
//
// In container-space (XCODE_LEFT=500, XCODE_TOP=20, titlebar height=44):
//   RUN_BTN_CONTAINER.x = 500 + 148 = 648
//   RUN_BTN_CONTAINER.y = 20 + 22  = 42  (center of 44px title bar)
const RUN_BTN_CONTAINER = { x: 648, y: 42 };

const CLICK_T = 760; // cursor clicks during the hold phase (550–900ms)

// Cursor starts from roughly center of the container (below the panels)
const CURSOR_START = { x: 820, y: 380 };

const BOTTOM_H = 110;

// Scene7 target positions — window positions must match these exactly when Scene6 ends
// so Scene7's opening frame is continuous with Scene6's last frame.
const S7_CODEX_LEFT = 68;
const S7_CODEX_TOP  = 195;
const S7_CODEX_W    = 590;
const S7_CODEX_H    = 660;
const S7_XCODE_LEFT = 490;
const S7_XCODE_TOP  = 52;
const S7_XCODE_W    = 930;
const S7_XCODE_H    = 640;

export const Scene6: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLImageElement>(null);
  const runBtnRef = useRef<HTMLDivElement>(null);
  const clickRingRef = useRef<HTMLDivElement>(null);
  const codexPanelRef = useRef<HTMLDivElement>(null);
  const xcodePanelRef = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // Camera zoom in → hold → pan back out (FIX 4: explicit strong zoom)
    // During zoom-out: smoothly transition transformOrigin from Run-button focus
    // to center-center so Scene7 picks up seamlessly.
    if (containerRef.current) {
      // SAME origin as Scene5 ("top left") for the whole scene → seamless 13s
      // boundary. Cursor + click-ring + Run button all live inside this scaled
      // container, so they stay glued together through the push-in/out.
      containerRef.current.style.transformOrigin = "top left";
      let scale: number, tx: number, ty: number;
      if (ms <= ZOOM_IN_END) {
        const t = track(ms, ZOOM_IN_START, ZOOM_IN_END, eases.inOutCubic);
        scale = lerp(CAMERA_SCALE, PEAK_SCALE, t);
        tx = lerp(0, PEAK_TX, t);
        ty = lerp(0, PEAK_TY, t);
      } else if (ms <= ZOOM_HOLD_END) {
        scale = PEAK_SCALE; tx = PEAK_TX; ty = PEAK_TY;
      } else {
        const t = track(ms, ZOOM_OUT_START, ZOOM_OUT_END, eases.inOutCubic);
        scale = lerp(PEAK_SCALE, 1.0, t);
        tx = lerp(PEAK_TX, 0, t);
        ty = lerp(PEAK_TY, 0, t);
      }
      containerRef.current.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    }

    // During zoom-out: slide Codex + Xcode panels to their Scene7 positions
    // so there's no jump at the Scene6→Scene7 boundary.
    if (codexPanelRef.current) {
      if (ms >= ZOOM_OUT_START) {
        const t = track(ms, ZOOM_OUT_START, ZOOM_OUT_END, eases.inOutCubic);
        const left = lerp(CODEX_LEFT, S7_CODEX_LEFT, t);
        const top  = lerp(CODEX_TOP,  S7_CODEX_TOP,  t);
        const w    = lerp(CODEX_W,    S7_CODEX_W,    t);
        const h    = lerp(CODEX_H,    S7_CODEX_H,    t);
        codexPanelRef.current.style.left   = left + "px";
        codexPanelRef.current.style.top    = top  + "px";
        codexPanelRef.current.style.width  = w    + "px";
        codexPanelRef.current.style.height = h    + "px";
      }
    }
    if (xcodePanelRef.current) {
      if (ms >= ZOOM_OUT_START) {
        const t = track(ms, ZOOM_OUT_START, ZOOM_OUT_END, eases.inOutCubic);
        const left = lerp(XCODE_LEFT, S7_XCODE_LEFT, t);
        const top  = lerp(XCODE_TOP,  S7_XCODE_TOP,  t);
        const w    = lerp(XCODE_W,    S7_XCODE_W,    t);
        const h    = lerp(XCODE_H,    S7_XCODE_H,    t);
        xcodePanelRef.current.style.left   = left + "px";
        xcodePanelRef.current.style.top    = top  + "px";
        xcodePanelRef.current.style.width  = w    + "px";
        xcodePanelRef.current.style.height = h    + "px";
      }
    }

    // Cursor moves to RUN button (FIX 6: container-space coords — no zoom math)
    if (cursorRef.current) {
      const moveT = track(ms, 100, CLICK_T - 80, eases.outCubic);
      const cx = lerp(CURSOR_START.x, RUN_BTN_CONTAINER.x, moveT);
      const cy = lerp(CURSOR_START.y, RUN_BTN_CONTAINER.y, moveT);
      cursorRef.current.style.left = cx + "px";
      cursorRef.current.style.top = cy + "px";

      // Click pulse at CLICK_T
      if (ms >= CLICK_T - 60 && ms <= CLICK_T + 160) {
        const progress = (ms - (CLICK_T - 60)) / 220;
        const scaleV = progress < 0.5
          ? lerp(1.0, 0.75, progress * 2)
          : lerp(0.75, 1.0, (progress - 0.5) * 2);
        cursorRef.current.style.transform = `scale(${scaleV})`;
      } else {
        cursorRef.current.style.transform = "scale(1)";
      }

      // Fade in at the start (so the cursor doesn't pop at the 13s cut), then
      // fade out as the camera eases back (so it doesn't drag into Scene7).
      if (ms > ZOOM_OUT_START + 300) {
        const fadeT = track(ms, ZOOM_OUT_START + 300, ZOOM_OUT_END, eases.outCubic);
        cursorRef.current.style.opacity = String(lerp(1, 0, fadeT));
      } else if (ms < 250) {
        cursorRef.current.style.opacity = String(track(ms, 0, 250, eases.outCubic));
      } else {
        cursorRef.current.style.opacity = "1";
      }
    }

    // Click ring burst at RUN button screen position
    if (clickRingRef.current) {
      if (ms >= CLICK_T && ms <= CLICK_T + 500) {
        const t = (ms - CLICK_T) / 500;
        clickRingRef.current.style.opacity = String(1 - t);
        clickRingRef.current.style.transform = `translate(-50%, -50%) scale(${lerp(0.4, 3.0, t)})`;
      } else {
        clickRingRef.current.style.opacity = "0";
      }
    }
  }, []);

  const CHAT_H = CODEX_H - 44 - BOTTOM_H;

  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE_DURATION}ms` as any}
      onFrame={onFrame as any}
      style={{ position: "relative", width: 1920, height: 1080, overflow: "hidden" }}
    >
      <TraceLayer sceneStartMs={SCENE_START_MS} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {!TRACE_MODE && (
        <div style={{
          position: "absolute",
          inset: 0,
          background: DESKTOP_BG,
          zIndex: 1,
        }} />
      )}

      {/* macOS menu bar */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 28,
        background: "rgba(18,18,24,0.92)",
        backdropFilter: "blur(10px)",
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        paddingLeft: 16, paddingRight: 16,
        gap: 20,
        fontSize: 13, fontWeight: 600, color: "#FFFFFF",
        fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
      }}>
        <span style={{ fontSize: 14 }}>🍎</span>
        <span>Codex</span>
        <span style={{ fontWeight: 400, opacity: 0.85 }}>File</span>
        <span style={{ fontWeight: 400, opacity: 0.85 }}>Edit</span>
        <span style={{ fontWeight: 400, opacity: 0.85 }}>View</span>
        <span style={{ fontWeight: 400, opacity: 0.85 }}>Window</span>
        <span style={{ fontWeight: 400, opacity: 0.85 }}>Help</span>
        <div style={{ flex: 1 }} />
        <span style={{ opacity: 0.7, fontSize: 12 }}>Wed Apr 16  8:16 PM</span>
      </div>

      {/* Camera container — zoom-in centered on Run button + pan-out */}
      {/* FIX B: transformOrigin targets the Xcode Run button coords (33.75% 4%)
          so the zoom CENTERS on the Run button area, not Codex/left-side */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: 28, left: 0,
          width: 1920,
          height: 1080 - 28,
          zIndex: 2,
          transform: `scale(${CAMERA_SCALE})`,
          transformOrigin: "top left",
        }}
      >
        {/* XCODE PANEL (z=3) — wrapper holds position+size, animated to S7 targets on zoom-out */}
        <div
          ref={xcodePanelRef}
          style={{
            position: "absolute",
            left: XCODE_LEFT,
            top: XCODE_TOP,
            width: XCODE_W,
            height: XCODE_H,
            zIndex: 3,
          }}
        >
          <XcodeWindow
            style={{ width: "100%", height: "100%" }}
            runBtnRef={runBtnRef}
            navWidth={220}
            fontSize={12}
            lineCount={18}
            showStatusBar={true}
          />
        </div>

        {/* CODEX CHAT PANEL (z=4) — left/top/width/height animated to S7 targets during zoom-out */}
        <div
          ref={codexPanelRef}
          style={{
            position: "absolute",
            left: CODEX_LEFT,
            top: CODEX_TOP,
            width: CODEX_W,
            height: CODEX_H,
            background: "#FFFFFF",
            borderRadius: 12,
            boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
            overflow: "hidden",
            zIndex: 4,
            fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
          }}
        >
          <CodexTitleBar taskTitle="Playtest app ..." />

          <div style={{ padding: "12px 16px", height: CHAT_H, overflowY: "hidden" }}>
            <UserMessageBubble />

            <div style={{ fontSize: 12, color: "#999", marginBottom: 6 }}>Working for 8s</div>
            <div style={{ height: 1, background: "#EBEBEB", marginBottom: 10 }} />

            <div style={{ fontSize: 12, color: "#1A1A1A", marginBottom: 7, lineHeight: 1.5 }}>
              Understood. I'll first use the Xcode workflow directly as requested: open the project, run it, and play through a game.
            </div>
            <div style={{ fontSize: 11, color: "#BBBBBB", marginBottom: 6 }}>Called 2 tools</div>
            <div style={{ fontSize: 12, color: "#1A1A1A", marginBottom: 7, lineHeight: 1.5 }}>
              I found Xcode already open on the project and located the Run control. I'm clicking Run now.
            </div>
            <div style={{ fontSize: 11, color: "#BBBBBB", marginBottom: 6 }}>Called 4 tools</div>
            <div style={{ fontSize: 12, color: "#1A1A1A", marginBottom: 7, lineHeight: 1.5 }}>
              Build is running and now reports "Running CloudTicTacToe." Next I'm locating the app window and driving a real game flow.
            </div>
            <div style={{ fontSize: 11, color: "#BBBBBB", marginBottom: 5 }}>Used Codex</div>
            <ToolCallRow label="List MCP resources" />
            <ToolCallRow label="List Mac apps" />
            <ToolCallRow label="Clicked in Xcode" italic />
          </div>

          <CodexBottomBar height={BOTTOM_H} />
        </div>

        {/* NOTE: TicTacToe is NOT rendered here (FIX 5).
            It appears in Scene7 as if it was already open when camera panned back. */}

        {/* Click ring — container-space, centered on RUN button (FIX 6: no zoom math) */}
        <div
          ref={clickRingRef}
          style={{
            position: "absolute",
            left: RUN_BTN_CONTAINER.x,
            top: RUN_BTN_CONTAINER.y,
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "2.5px solid rgba(90,155,245,0.9)",
            transform: "translate(-50%, -50%) scale(0.4)",
            opacity: 0,
            zIndex: 25,
            pointerEvents: "none",
          }}
        />

        {/* macOS cursor — container-space, travels to RUN button (FIX 6: no zoom math) */}
        <img
          ref={cursorRef}
          src={cursorMacosDataUri}
          alt=""
          style={{
            position: "absolute",
            left: CURSOR_START.x,
            top: CURSOR_START.y,
            width: 32,
            height: 32,
            zIndex: 26,
            pointerEvents: "none",
            transformOrigin: "top left",
          }}
        />
      </div>
    </Timegroup>
  );
};

(Scene6 as any).duration = SCENE_DURATION;
