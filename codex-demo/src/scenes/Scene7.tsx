/**
 * Scene 7 — 3-window layout fully visible: Codex (left) + Xcode (center) + TicTacToe (right)
 * Duration: 3000ms (t=14500–17500ms)
 *
 * Reference: ref-frames/frame_0017.jpg, frame_0018.jpg, frame_0019.jpg, frame_0020.jpg
 */

import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
// Clean macOS desktop gradient (no circles/grid artifacts)
const DESKTOP_BG = "linear-gradient(135deg, #8B9EC8 0%, #6B7FA8 20%, #4A5F9E 40%, #2E4590 60%, #1A2E7A 80%, #0D1B5E 100%)";
import { track, lerp } from "../components/helpers";
import {
  XcodeWindow,
  CodexTitleBar,
  UserMessageBubble,
  ToolCallRow,
  CodexBottomBar,
  TicTacToeWindow,
} from "../components/panels";
import { eases } from "animejs";

const SCENE_DURATION = 3000;
const SCENE_START_MS = 14500;

// Scene6 ends at scale(1.0) with windows already at their S7 positions.
// No scale settle — just hold 1.0. The TicTacToe app "launches" in with a
// smoother, slightly slower fade + rise + scale so the popup doesn't feel
// abrupt (ROUND-7: "Run-click → popup is abrupt").
const TTT_FADE_START = 80;
const TTT_FADE_END = 780;

// Layout — screen coordinates at 1.0x
// Reference-derived positions scaled to 1920×1080
const CODEX_LEFT = 68;
const CODEX_TOP = 195;
const CODEX_W = 590;
const CODEX_H = 660;

const XCODE_LEFT = 490;
const XCODE_TOP = 52;
const XCODE_W = 930;
const XCODE_H = 640;

// TicTacToe overlaps Xcode center-right
const TTT_LEFT = 745;
const TTT_TOP = 52;
const TTT_W = 390;
const TTT_H = 570;

const LINE_CLICKED_START = 1400;

const BOTTOM_H = 100;

export const Scene7: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineClickingRef = useRef<HTMLDivElement>(null);
  const workingTimerRef = useRef<HTMLDivElement>(null);
  const tttRef = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // Scene6 already ends at scale(1.0) with windows in S7 positions — hold steady
    if (containerRef.current) {
      containerRef.current.style.transform = "scale(1.0)";
    }

    // TicTacToe "launches" in: fade + gentle rise + scale (smoother, ~700ms)
    if (tttRef.current) {
      const t = track(ms, TTT_FADE_START, TTT_FADE_END, eases.outCubic);
      tttRef.current.style.opacity = String(Math.min(1, t * 1.25));
      tttRef.current.style.transform = `translateY(${lerp(16, 0, t)}px) scale(${lerp(0.82, 1.0, t)})`;
    }

    if (workingTimerRef.current) {
      const masterMs = SCENE_START_MS + ms;
      const secs = Math.max(8, Math.floor((masterMs - 6000) / 1000) + 1);
      workingTimerRef.current.textContent = `Working for ${secs}s`;
    }

    if (lineClickingRef.current) {
      const t = track(ms, LINE_CLICKED_START, LINE_CLICKED_START + 350, eases.outCubic);
      lineClickingRef.current.style.opacity = String(t);
      lineClickingRef.current.style.transform = `translateY(${lerp(5, 0, t)}px)`;
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

      {/* Main content container — starts at scale(1.0), Scene6 already eased out */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          transformOrigin: "center center",
          transform: "scale(1.0)",
        }}
      >
        {/* XCODE WINDOW (z=3, behind TicTacToe) */}
        <div style={{ position: "absolute", left: XCODE_LEFT, top: XCODE_TOP, zIndex: 3 }}>
          <XcodeWindow
            style={{ width: XCODE_W, height: XCODE_H }}
            navWidth={220}
            fontSize={12}
            lineCount={18}
            showStatusBar={true}
          />
        </div>

        {/* CLOUD TIC TAC TOE APP (z=5, overlaps Xcode) — fades + scales in over first 400ms */}
        <div
          ref={tttRef}
          style={{
            position: "absolute",
            left: TTT_LEFT,
            top: TTT_TOP,
            zIndex: 5,
            opacity: 0,
            transformOrigin: "center center",
            transform: "scale(0.88)",
          }}
        >
          <TicTacToeWindow style={{ width: TTT_W, height: TTT_H }} cellSize={96} />
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
          boxShadow: "0 12px 40px rgba(0,0,0,0.40)",
          overflow: "hidden",
          zIndex: 4,
          fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
        }}>
          <CodexTitleBar taskTitle="Playtest app ..." />

          <div style={{ padding: "12px 16px", height: CHAT_H, overflowY: "hidden" }}>
            <UserMessageBubble />

            <div ref={workingTimerRef} style={{ fontSize: 12, color: "#999", marginBottom: 6 }}>
              Working for 8s
            </div>
            <div style={{ height: 1, background: "#EBEBEB", marginBottom: 10 }} />

            <div style={{ fontSize: 12, color: "#1A1A1A", marginBottom: 8, lineHeight: 1.55 }}>
              Understood. I'll first use the Xcode workflow directly as requested: open the project, run it, and play through a game in the simulator/device to surface issues. After reproduction, I'll inspect and patch the relevant app code paths only where needed.
            </div>

            <div style={{ fontSize: 12, color: "#888", marginBottom: 8, lineHeight: 1.55 }}>
              I have the Xcode control toolset available. I'll check that Xcode is present, open it, run the project, and then play through a full game to observe real behavior.
            </div>

            <div style={{ fontSize: 11, color: "#BBBBBB", marginBottom: 6 }}>Called 2 tools</div>

            <div style={{ fontSize: 12, color: "#1A1A1A", marginBottom: 8, lineHeight: 1.55 }}>
              I found Xcode already open on the project and located the Run control. I'm clicking Run now and will immediately drive the running app to play a full game and spot behavior regressions.
            </div>

            <div style={{ fontSize: 11, color: "#BBBBBB", marginBottom: 6 }}>Called 4 tools</div>

            <div style={{ fontSize: 12, color: "#1A1A1A", marginBottom: 8, lineHeight: 1.55 }}>
              Build is running and now reports "Running CloudTicTacToe." Next I'm locating the app window.
            </div>

            <div style={{ fontSize: 11, color: "#BBBBBB", marginBottom: 5 }}>Used Codex</div>
            <ToolCallRow label="List MCP resources" />
            <ToolCallRow label="List Mac apps" />
            <ToolCallRow label="Looked at App" />

            <div ref={lineClickingRef} style={{ opacity: 0 }}>
              <ToolCallRow label="Clicking · App" italic />
            </div>
          </div>

          <CodexBottomBar height={BOTTOM_H} />
        </div>
      </div>
    </Timegroup>
  );
};

(Scene7 as any).duration = SCENE_DURATION;
