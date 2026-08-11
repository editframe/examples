/**
 * Scene 1 — "Computer Use / in Codex on Mac" title
 * Duration: 2500ms (t=0–2500ms)
 *
 * Reference: ref-frames/frame_0001.jpg – frame_0003.jpg
 * - Background: codex-gradient.png (purple-blue blurred floral gradient)
 * - "Computer Use" huge white text, left-biased upper area
 * - "in Codex on Mac" huge white text, lower third
 * - macOS cursor drifts on right side
 */

import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { Reveal } from "@shared/components/Reveal";
import { codexGradientSrc, cursorMacosSrc } from "../scenes/scene-assets";

const SCENE_DURATION = 2500;
const SCENE_START_MS = 0;

// Text fade in at t=200ms, fully in by t=700ms
const TEXT_IN_START = 200;
const TEXT_IN_END = 700;

export const TitleCard: React.FC = () => {
  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE_DURATION}ms` as any}
      style={{
        position: "relative",
        width: 1920,
        height: 1080,
        overflow: "hidden",
      }}
    >
      <TraceLayer sceneStartMs={SCENE_START_MS} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* Background — codex-gradient.png, full frame (FIX 1) */}
      {!TRACE_MODE && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${codexGradientSrc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 1,
          }}
        />
      )}

      {/* "Computer Use" — huge white text, left-biased per reference */}
      <Reveal
        enter={[TEXT_IN_START, TEXT_IN_END]}
        y={30}
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
          zIndex: 2,
          whiteSpace: "nowrap",
        }}
      >
        Computer Use
      </Reveal>

      {/* "in Codex on Mac" — huge white text, lower third (staggered 120ms after line 1) */}
      <Reveal
        enter={[TEXT_IN_START + 120, TEXT_IN_END + 120]}
        y={30}
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
          zIndex: 2,
          whiteSpace: "nowrap",
        }}
      >
        in Codex on Mac
      </Reveal>

      {/* macOS cursor — drifts slowly from right edge inward over the whole scene */}
      <Image
        src={cursorMacosSrc}
        style={{
          position: "absolute",
          width: 32,
          height: 32,
          zIndex: 3,
          pointerEvents: "none",
          animation: `s1-cursor-drift ${SCENE_DURATION}ms linear both`,
        }}
      />
    </Timegroup>
  );
};

(TitleCard as any).duration = SCENE_DURATION;
