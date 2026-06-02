/**
 * Scene 4 — Zoom-out from blank white → dual-panel: Codex chat LEFT + Xcode RIGHT
 * Duration: 2500ms (t=6000–8500ms)
 *
 * FIX A (Round 6): Starts from full-screen white (continuation of Scene3's fade-to-white).
 * Camera zooms OUT from ~3.0x (white fills frame = Codex panel zoomed all the way in)
 * down to 1.4x (the "zoomed in on dual panel" state), revealing the desktop bg and
 * Xcode window as the camera pulls back. This is ONE seamless transition from Scene3.
 *
 * Mental model: the white was the Codex chat panel zoomed 100%. Zooming out reveals
 * it's actually one of two windows sitting on a macOS desktop.
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
} from "../components/panels";
import { eases } from "animejs";

const SCENE_DURATION = 2500;
const SCENE_START_MS = 6000;

const CAMERA_SCALE_END = 1.4;   // final resting zoom (dual-panel view)
const CAMERA_SCALE_START = 3.2; // start zoomed in so Codex panel fills the frame (= white)

// Panel dimensions and positions in 1.0x layout space
const CODEX_W = 640;
const CODEX_H = 620;
const XCODE_W = 860;
const XCODE_H = 680;
const CODEX_LEFT = 50;
const CODEX_TOP = 50;
const XCODE_LEFT = 500;
const XCODE_TOP = 20;

// Zoom-out timing: 0–700ms camera pulls back from white to dual-panel view
const ZOOM_OUT_START = 0;
const ZOOM_OUT_END = 700;

// Desktop bg fades in as camera pulls back (concurrent with zoom)
const BG_FADE_START = 0;
const BG_FADE_END = 600;

// Xcode slides in from right as camera reveals it
const XCODE_IN_START = 150;
const XCODE_IN_END = 700;

const AGENT_LINE_1_START = 700;
const AGENT_LINE_2_START = 1200;
const AGENT_LINE_3_START = 1700;
const AGENT_LINE_4_START = 2100;

export const Scene4: React.FC = () => {
  const bgRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const codexRef = useRef<HTMLDivElement>(null);
  const xcodeRef = useRef<HTMLDivElement>(null);
  const agentLine1Ref = useRef<HTMLDivElement>(null);
  const agentLine2Ref = useRef<HTMLDivElement>(null);
  const agentLine3Ref = useRef<HTMLDivElement>(null);
  const agentLine4Ref = useRef<HTMLDivElement>(null);
  const workingTimerRef = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // Camera zooms out: from full-screen-white (zoomed in on Codex) → dual-panel view
    if (containerRef.current) {
      const t = track(ms, ZOOM_OUT_START, ZOOM_OUT_END, eases.outCubic);
      const scale = lerp(CAMERA_SCALE_START, CAMERA_SCALE_END, t);
      containerRef.current.style.transform = `scale(${scale})`;
    }

    // Desktop bg fades in as we zoom out (concurrent)
    if (bgRef.current) {
      const t = track(ms, BG_FADE_START, BG_FADE_END, eases.outCubic);
      bgRef.current.style.opacity = String(t);
    }

    // Codex panel is fully visible from frame 0 (it WAS the white — always there)
    if (codexRef.current) {
      codexRef.current.style.opacity = "1";
      codexRef.current.style.transform = "translateX(0px)";
    }

    // Xcode slides in from right as camera reveals it
    if (xcodeRef.current) {
      const t = track(ms, XCODE_IN_START, XCODE_IN_END, eases.outCubic);
      xcodeRef.current.style.opacity = String(t);
      xcodeRef.current.style.transform = `translateX(${lerp(60, 0, t)}px)`;
    }

    const revealLine = (ref: React.RefObject<HTMLDivElement>, startMs: number) => {
      if (ref.current) {
        const t = track(ms, startMs, startMs + 400, eases.outCubic);
        ref.current.style.opacity = String(t);
        ref.current.style.transform = `translateY(${lerp(8, 0, t)}px)`;
      }
    };
    revealLine(agentLine1Ref, AGENT_LINE_1_START);
    revealLine(agentLine2Ref, AGENT_LINE_2_START);
    revealLine(agentLine3Ref, AGENT_LINE_3_START);
    revealLine(agentLine4Ref, AGENT_LINE_4_START);

    // Working timer
    if (workingTimerRef.current) {
      const masterMs = SCENE_START_MS + ms;
      const secs = Math.max(1, Math.floor((masterMs - 6000) / 1000) + 1);
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
        <div
          ref={bgRef}
          style={{
            position: "absolute",
            inset: 0,
            background: DESKTOP_BG,
            zIndex: 1,
            opacity: 0,
          }}
        />
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
        paddingLeft: 16,
        paddingRight: 16,
        gap: 20,
        fontSize: 13,
        fontWeight: 600,
        color: "#FFFFFF",
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

      {/* Camera-zoomed container — starts zoomed in (white fills frame), pulls back to 1.4x */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: 28, left: 0,
          width: 1920,
          height: 1080 - 28,
          zIndex: 2,
          transform: `scale(${CAMERA_SCALE_START})`,
          transformOrigin: "top left",
        }}
      >
        {/* XCODE PANEL (z=3, behind Codex) */}
        <div ref={xcodeRef} style={{ position: "absolute", left: XCODE_LEFT, top: XCODE_TOP, opacity: 0, zIndex: 3 }}>
          <XcodeWindow
            style={{ width: XCODE_W, height: XCODE_H }}
            navWidth={210}
            fontSize={13}
            lineCount={20}
            showStatusBar={true}
          />
        </div>

        {/* CODEX CHAT PANEL (z=4, on top) */}
        <div
          ref={codexRef}
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
            opacity: 0,
            fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
          }}
        >
          <CodexTitleBar taskTitle="Run this app i..." />

          {/* Chat body */}
          <div style={{
            padding: "14px 16px",
            height: CHAT_H,
            overflowY: "hidden",
            position: "relative",
          }}>
            <UserMessageBubble />

            {/* Working timer + separator */}
            <div ref={workingTimerRef} style={{ fontSize: 12, color: "#999", marginBottom: 6 }}>
              Working for 1s
            </div>
            <div style={{ height: 1, background: "#EBEBEB", marginBottom: 12 }} />

            {/* Agent response */}
            <div
              ref={agentLine1Ref}
              style={{ fontSize: 13, color: "#1A1A1A", lineHeight: 1.6, marginBottom: 12, opacity: 0 }}
            >
              Understood. I'll first use the Xcode workflow directly as requested: open the project, run it, and play through a game in the simulator/device to surface issues. After reproduction, I'll inspect and patch the relevant app code paths only where needed.
            </div>

            <div
              ref={agentLine2Ref}
              style={{ fontSize: 12, color: "#AAAAAA", fontStyle: "italic", marginBottom: 10, opacity: 0 }}
            >
              Thinking
            </div>

            <div
              ref={agentLine3Ref}
              style={{ fontSize: 12, color: "#888", lineHeight: 1.55, marginBottom: 10, opacity: 0 }}
            >
              I have the Xcode control toolset available. I'll check that Xcode is present, open it, run the project, and then play through a full game to observe real behavior.
            </div>

            <div ref={agentLine4Ref} style={{ opacity: 0 }}>
              <ToolCallRow label="List Mac apps" />
            </div>
          </div>

          {/* Bottom bar */}
          <CodexBottomBar height={BOTTOM_H} />
        </div>
      </div>
    </Timegroup>
  );
};

(Scene4 as any).duration = SCENE_DURATION;
