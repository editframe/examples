/**
 * Scene 1 — "Computer Use / in Codex on Mac" title
 * Duration: 2500ms (t=0–2500ms)
 *
 * Reference: ref-frames/frame_0001.jpg – frame_0003.jpg
 * - Background: codex-gradient-reference.png (purple-blue blurred floral gradient)
 * - "Computer Use" huge white text, left-biased upper area
 * - "in Codex on Mac" huge white text, lower third
 * - macOS cursor drifts on right side
 */

import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { codexGradientDataUri } from "../scenes/scene-assets";
import { cursorMacosDataUri } from "../scenes/scene-assets";
import { track, lerp, clamp } from "../components/helpers";
import { eases } from "animejs";

const SCENE_DURATION = 2500;
const SCENE_START_MS = 0;

// Text fade in at t=200ms, fully in by t=700ms
const TEXT_IN_START = 200;
const TEXT_IN_END = 700;

// Cursor drifts from right edge inward (matches ref frame)
const CURSOR_START_X = 1480;
const CURSOR_START_Y = 480;
const CURSOR_END_X = 1380;
const CURSOR_END_Y = 490;

export const Scene1: React.FC = () => {
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLImageElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // Line 1: "Computer Use"
    if (line1Ref.current) {
      const t = track(ms, TEXT_IN_START, TEXT_IN_END, eases.outCubic);
      line1Ref.current.style.opacity = String(t);
      line1Ref.current.style.transform = `translateY(${lerp(30, 0, t)}px)`;
    }

    // Line 2: "in Codex on Mac" (staggered 120ms)
    if (line2Ref.current) {
      const t2 = track(ms, TEXT_IN_START + 120, TEXT_IN_END + 120, eases.outCubic);
      line2Ref.current.style.opacity = String(t2);
      line2Ref.current.style.transform = `translateY(${lerp(30, 0, t2)}px)`;
    }

    // Cursor drifts slowly from right edge inward
    if (cursorRef.current) {
      const driftT = clamp(ms / SCENE_DURATION);
      const cx = lerp(CURSOR_START_X, CURSOR_END_X, driftT);
      const cy = lerp(CURSOR_START_Y, CURSOR_END_Y, driftT);
      cursorRef.current.style.left = cx + "px";
      cursorRef.current.style.top = cy + "px";
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE_DURATION}ms` as any}
      onFrame={onFrame as any}
      style={{
        position: "relative",
        width: 1920,
        height: 1080,
        overflow: "hidden",
      }}
    >
      <TraceLayer sceneStartMs={SCENE_START_MS} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* Background — codex-gradient-reference.png, full frame (FIX 1) */}
      {!TRACE_MODE && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${codexGradientDataUri})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 1,
          }}
        />
      )}

      {/* "Computer Use" — huge white text, left-biased per reference */}
      <div
        ref={line1Ref}
        style={{
          position: "absolute",
          top: 110,
          left: 190,
          fontSize: 196,
          fontWeight: 700,
          color: "#FFFFFF",
          fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
          letterSpacing: "-0.02em",
          lineHeight: 1,
          opacity: 0,
          zIndex: 2,
          whiteSpace: "nowrap",
        }}
      >
        Computer Use
      </div>

      {/* "in Codex on Mac" — huge white text, lower third */}
      <div
        ref={line2Ref}
        style={{
          position: "absolute",
          top: 650,
          left: 190,
          fontSize: 196,
          fontWeight: 700,
          color: "#FFFFFF",
          fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
          letterSpacing: "-0.02em",
          lineHeight: 1,
          opacity: 0,
          zIndex: 2,
          whiteSpace: "nowrap",
        }}
      >
        in Codex on Mac
      </div>

      {/* macOS cursor — right side of frame */}
      <img
        ref={cursorRef}
        src={cursorMacosDataUri}
        alt=""
        style={{
          position: "absolute",
          left: CURSOR_START_X,
          top: CURSOR_START_Y,
          width: 32,
          height: 32,
          zIndex: 3,
          pointerEvents: "none",
        }}
      />
    </Timegroup>
  );
};

(Scene1 as any).duration = SCENE_DURATION;
