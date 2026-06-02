/**
 * Scene 8 — Cursor Logo Outro (22500–23763ms)
 *
 * FIX 4 (round-5):
 *   - REMOVE the "Cursor" wordmark text — cube logo ONLY
 *   - Cube SLIGHTLY SMALLER: ~250px (was 310px)
 *   - Smooth entrance: opacity 0→1 + scale 0.85→1.0 over 600ms, easeOutCubic (preserved)
 *   - Centered both axes on white background
 */

import React, { useRef, useCallback } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { track } from "../components/helpers";
import { eases } from "animejs";
// ROUND-7 FIX (comment #2): use the REAL downloaded Cursor logo PNG instead of
// a hand-built SVG cube. Sized smaller so it matches the box (not too big).
import { cursorLogoPng } from "../assets/cursorLogo";

const SCENE_START = 22500;
const SCENE_DUR = 1263;

const ENTRANCE_DURATION = 600;

// Logo render size — smaller than before (was 200px SVG) per user: "make it
// smaller so it matches the box size, not too big not too huge."
const LOGO_SIZE = 168;

export function Scene8_LogoOutro() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    if (!wrapperRef.current) return;

    const p = track(ms, 0, ENTRANCE_DURATION, eases.outCubic);
    const opacity = p;
    const scale = 0.85 + 0.15 * p;

    wrapperRef.current.style.opacity = String(opacity);
    wrapperRef.current.style.transform = `scale(${scale})`;
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE_DUR}ms`}
      onFrame={onFrame as any}
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
        <div
          ref={wrapperRef}
          style={{
            opacity: 0,
            transform: "scale(0.85)",
          }}
        >
          <img
            src={cursorLogoPng}
            alt="Cursor"
            width={LOGO_SIZE}
            height={LOGO_SIZE}
            style={{ display: "block", objectFit: "contain" }}
          />
        </div>
      </div>
    </Timegroup>
  );
}

Scene8_LogoOutro.duration = SCENE_DUR;
