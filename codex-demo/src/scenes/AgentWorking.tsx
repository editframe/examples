/**
 * Scene 5 — More agent steps appear, "Working for Xs" continues
 * Duration: 4500ms (t=8500–13000ms)
 *
 * Reference: ref-frames/frame_0011.jpg, frame_0012.jpg, frame_0013.jpg
 * - Same dual-panel layout as PanelZoomOut but camera is still 1.4x zoomed (static, no animation)
 * - More agent response lines appear progressively (CSS reveals, staggered per line)
 * - Tool call rows with proper icon style
 *
 * The "Working for Xs" counter is kept as a small scene-scoped `onFrame` (text content
 * can't be expressed as a CSS keyframe); every reveal below it is plain CSS.
 */

import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { Reveal } from "@shared/components/Reveal";
// Clean macOS desktop gradient (no circles/grid artifacts)
const DESKTOP_BG = "linear-gradient(135deg, #8B9EC8 0%, #6B7FA8 20%, #4A5F9E 40%, #2E4590 60%, #1A2E7A 80%, #0D1B5E 100%)";
import {
  XcodeWindow,
  CodexTitleBar,
  UserMessageBubble,
  ToolCallRow,
  CodexBottomBar,
} from "../components/panels";

const SCENE_DURATION = 4500;
const SCENE_START_MS = 8500;

const CAMERA_SCALE = 1.4;

const CODEX_W = 640; // FIX 3: widened from 540 to 640
const CODEX_H = 620;
const XCODE_W = 860;
const XCODE_H = 680;
const CODEX_LEFT = 50;
const CODEX_TOP = 50;
const XCODE_LEFT = 500;
const XCODE_TOP = 20;

export const AgentWorking: React.FC = () => {
  const workingTimerRef = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    if (workingTimerRef.current) {
      const masterMs = SCENE_START_MS + ms;
      const secs = Math.max(3, Math.floor((masterMs - 6000) / 1000) + 1);
      workingTimerRef.current.textContent = `Working for ${secs}s`;
    }
  }, []);

  const BOTTOM_H = 110;
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

      {/* Camera-zoomed container — steady 1.4x hold, continuation of PanelZoomOut's zoom-out */}
      <div style={{
        position: "absolute",
        top: 28, left: 0,
        width: 1920,
        height: 1080 - 28,
        zIndex: 2,
        transform: `scale(${CAMERA_SCALE})`,
        transformOrigin: "top left",
      }}>
        {/* XCODE PANEL (z=3) */}
        <div style={{ position: "absolute", left: XCODE_LEFT, top: XCODE_TOP, zIndex: 3 }}>
          <XcodeWindow
            style={{ width: XCODE_W, height: XCODE_H }}
            navWidth={210}
            fontSize={13}
            lineCount={20}
            showStatusBar={true}
          />
        </div>

        {/* CODEX CHAT PANEL (z=4) */}
        <div style={{
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
        }}>
          <CodexTitleBar taskTitle="Playtest app ..." />

          <div style={{ padding: "14px 16px", height: CHAT_H, overflowY: "hidden", position: "relative" }}>
            <UserMessageBubble />

            <div ref={workingTimerRef} style={{ fontSize: 12, color: "#999", marginBottom: 6 }}>
              Working for 3s
            </div>
            <div style={{ height: 1, background: "#EBEBEB", marginBottom: 10 }} />

            {/* Initial response (already visible) */}
            <div style={{ fontSize: 12, color: "#1A1A1A", lineHeight: 1.55, marginBottom: 8 }}>
              Understood. I'll first use the Xcode workflow directly as requested: open the project, run it, and play through a game in the simulator/device to surface issues. After reproduction, I'll inspect and patch the relevant app code paths only where needed.
            </div>

            <div style={{ fontSize: 12, color: "#AAAAAA", fontStyle: "italic", marginBottom: 8 }}>
              I have the Xcode control toolset available. I'll check that Xcode is present, open it, run the project, and then play through a full game to observe real behavior.
            </div>

            {/* Progressive lines */}
            <Reveal enter={[400, 750]} y={6} style={{ fontSize: 11, color: "#BBBBBB", marginBottom: 6 }}>
              Called 2 tools
            </Reveal>

            <Reveal enter={[900, 1250]} y={6} style={{ fontSize: 12, color: "#1A1A1A", marginBottom: 8, lineHeight: 1.55 }}>
              I found Xcode already open on the project and located the Run control. I'm clicking Run now and will immediately drive the running app to play a full game and spot behavior regressions.
            </Reveal>

            <Reveal enter={[1600, 1950]} y={6} style={{ fontSize: 11, color: "#BBBBBB", marginBottom: 6 }}>
              Called 4 tools
            </Reveal>

            <Reveal enter={[2200, 2550]} y={6} style={{ fontSize: 12, color: "#1A1A1A", marginBottom: 8, lineHeight: 1.55 }}>
              Build is running and now reports "Running CloudTicTacToe." Next I'm locating the app window and driving a real game flow through the UI to validate gameplay and detect behavioral issues.
            </Reveal>

            <Reveal enter={[3000, 3350]} y={6} style={{ fontSize: 11, color: "#BBBBBB", marginBottom: 5 }}>
              Used Codex
            </Reveal>

            <Reveal enter={[3400, 3750]} y={6}>
              <ToolCallRow label="List MCP resources" />
            </Reveal>

            <Reveal enter={[3800, 4150]} y={6}>
              <ToolCallRow label="List Mac apps" />
            </Reveal>

            <Reveal enter={[4100, 4450]} y={6}>
              <ToolCallRow label="Looked at Xcode" italic />
            </Reveal>
          </div>

          <CodexBottomBar height={BOTTOM_H} />
        </div>
      </div>
    </Timegroup>
  );
};

(AgentWorking as any).duration = SCENE_DURATION;
