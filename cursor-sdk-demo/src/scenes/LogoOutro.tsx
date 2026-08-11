/**
 * Scene 8 — Cursor Logo Outro (22500–23763ms)
 *
 * FIX 4 (round-5):
 *   - REMOVE the "Cursor" wordmark text — cube logo ONLY
 *   - Cube SLIGHTLY SMALLER: ~250px (was 310px)
 *   - Smooth entrance: opacity 0→1 + scale 0.85→1.0 over 600ms, easeOutCubic (preserved)
 *   - Centered both axes on white background
 *
 * One-shot fade + scale entrance, nothing exits — a plain `logo-outro-in` CSS keyframe
 * (see styles.css) replaces the old per-frame `track()`/ref-mutation entirely.
 */

import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";

const SCENE_START = 22500;
const SCENE_DUR = 1263;

const ENTRANCE_DURATION = 600;

// Logo render size — smaller than before (was 200px SVG) per user: "make it
// smaller so it matches the box size, not too big not too huge."
const LOGO_SIZE = 168;

export function LogoOutro() {
  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE_DUR}ms`}
      style={{
        position: "absolute",
        inset: 0,
        width: 1920,
        height: 1080,
        background: TRACE_MODE ? "transparent" : "#FFFFFF",
        overflow: "hidden",
      }}
    >
      <TraceLayer sceneStartMs={SCENE_START} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* Centered cube — no wordmark */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <div style={{ animation: `logo-outro-in ${ENTRANCE_DURATION}ms cubic-bezier(0.33,1,0.68,1) both` }}>
          <Image
            src="/cursor-sdk-demo/src/assets/cursor-sdk-demo-cursor-logo.png"
            alt="Cursor"
            style={{ width: LOGO_SIZE, height: LOGO_SIZE, display: "block", objectFit: "contain" }}
          />
        </div>
      </div>
    </Timegroup>
  );
}

LogoOutro.duration = SCENE_DUR;
