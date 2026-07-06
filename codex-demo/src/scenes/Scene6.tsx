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
 *
 * A multi-stage shape morph (camera push-in → hold → pull-out, plus the Codex/Xcode
 * panels resizing toward their Scene7 targets during the pull-out) — converted to a
 * bespoke pair of percentage-keyframe `@keyframes` per element (see styles.css) rather
 * than a per-frame `onFrame`. Percentage stops line up exactly with this scene's own
 * 1500ms duration: 0–550ms push-in (0–36.67%), 550–900ms hold (36.67–60%), 900–1500ms
 * pull-out (60–100%).
 */

import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { Sfx } from "../components/Sfx";
import { cursorMacosSrc } from "../scenes/scene-assets";
import {
  XcodeWindow,
  CodexTitleBar,
  UserMessageBubble,
  ToolCallRow,
  CodexBottomBar,
} from "../components/panels";
// Clean macOS desktop gradient (no circles/grid artifacts)
const DESKTOP_BG = "linear-gradient(135deg, #8B9EC8 0%, #6B7FA8 20%, #4A5F9E 40%, #2E4590 60%, #1A2E7A 80%, #0D1B5E 100%)";

const SCENE_DURATION = 1500;
const SCENE_START_MS = 13000;
const CLICK_T = 760; // RUN button click — matches the click-ring animation delay below

const CODEX_W = 640; // FIX 3: widened from 540 to 640
const CODEX_H = 620;
const XCODE_W = 860;
const XCODE_H = 680;
const CODEX_LEFT = 50;
const CODEX_TOP = 50;
const XCODE_LEFT = 500;
const XCODE_TOP = 20;

// Run button layout position inside XcodeWindow (XcodeTitleBar flex row) — see FIX 6:
// cursor + click-ring live in the same container-space coordinates as the Xcode panel.
const RUN_BTN_CONTAINER = { x: 648, y: 42 };
const CURSOR_START = { x: 820, y: 380 };

const BOTTOM_H = 110;
const CHAT_H = CODEX_H - 44 - BOTTOM_H;

export const Scene6: React.FC = () => {
  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE_DURATION}ms` as any}
      style={{ position: "relative", width: 1920, height: 1080, overflow: "hidden" }}
    >
      <TraceLayer sceneStartMs={SCENE_START_MS} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* RUN button click SFX, synced to the click-ring pulse */}
      <Sfx cue="click" at={CLICK_T / 1000} dur={0.3} volume={1} sourceIn={0.6} />

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

      {/* Camera container — SAME origin as Scene5 ("top left") for the whole scene so
          there is no snap at the 13s boundary. Push-in → hold (Run click) → pull-out. */}
      <div
        style={{
          position: "absolute",
          top: 28, left: 0,
          width: 1920,
          height: 1080 - 28,
          zIndex: 2,
          transformOrigin: "top left",
          animation: "s6-camera 1500ms linear both",
        }}
      >
        {/* XCODE PANEL (z=3) — wrapper holds position+size, animated to S7 targets on zoom-out */}
        <div
          style={{
            position: "absolute",
            left: XCODE_LEFT,
            top: XCODE_TOP,
            width: XCODE_W,
            height: XCODE_H,
            zIndex: 3,
            animation: "s6-xcode-panel 1500ms linear both",
          }}
        >
          <XcodeWindow
            style={{ width: "100%", height: "100%" }}
            navWidth={220}
            fontSize={12}
            lineCount={18}
            showStatusBar={true}
          />
        </div>

        {/* CODEX CHAT PANEL (z=4) — left/top/width/height animated to S7 targets during zoom-out */}
        <div
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
            animation: "s6-codex-panel 1500ms linear both",
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
            animation: "s6-click-ring 500ms 760ms linear forwards",
          }}
        />

        {/* macOS cursor — container-space, travels to RUN button (FIX 6: no zoom math).
            Position, click-pulse scale, and fade are independent properties, so they're
            layered as three separate keyframe animations on the same element. */}
        <Image
          src={cursorMacosSrc}
          style={{
            position: "absolute",
            left: CURSOR_START.x,
            top: CURSOR_START.y,
            width: 32,
            height: 32,
            zIndex: 26,
            pointerEvents: "none",
            transformOrigin: "top left",
            animation: [
              "s6-cursor-move 1500ms linear both",
              "s6-cursor-click 1500ms linear both",
              "s6-cursor-opacity 1500ms linear both",
            ].join(", "),
          }}
        />
      </div>
    </Timegroup>
  );
};

(Scene6 as any).duration = SCENE_DURATION;
