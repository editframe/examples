/**
 * Scene 4 — "Add them with easy-to-install plugins" (13500–17500ms)
 * REBUILT FROM SCRATCH — single smooth entrance, no double-open.
 * Cream bg. One clean fade-up entrance. Holds. Fades out cleanly at end.
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TraceLayer } from "../components/TraceLayer";
import { track, lerp } from "../components/helpers";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { eases } from "animejs";

export const SCENE4_START = 13500;
export const SCENE4_DURATION = 4000;

export function Scene4_Plugins(): React.ReactElement {
  const textRef = useRef<HTMLDivElement>(null);

  // Single state variable — no secondary opacity layers or transforms
  // that could produce the double-open glitch
  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    if (!textRef.current) return;

    // SINGLE entrance: opacity 0→1 + translateY 30→0 over 600ms
    const inT = track(ms, 100, 700, eases.outCubic);
    // Hold 700ms–3400ms
    // Fade out: 3400ms–4000ms
    const outT = track(ms, 3400, 4000, eases.inCubic);

    const opacity = Math.max(0, inT * (1 - outT));
    const ty = lerp(30, 0, inT);

    textRef.current.style.opacity = String(opacity);
    textRef.current.style.transform = `translateY(${ty}px)`;
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE4_DURATION}ms`}
      onFrame={onFrame as any}
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0, width: 1920, height: 1080, overflow: "hidden" }}
    >
      <TraceLayer sceneStartMs={SCENE4_START} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {!TRACE_MODE && (
        <div style={{ position: "absolute", inset: 0, background: "#EAE8DE", zIndex: 1 }} />
      )}

      {/* Single text element — no wrapping containers with their own transforms */}
      <div
        ref={textRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: 280,
          opacity: 0,
        }}
      >
        <div
          style={{
            fontFamily: "'Newsreader', 'EB Garamond', Georgia, serif",
            fontWeight: 400,
            fontSize: 68,
            lineHeight: 1.2,
            color: "#2A2825",
            letterSpacing: "-0.01em",
          }}
        >
          Add them with easy-to-install plugins
        </div>
      </div>
    </Timegroup>
  );
}

Scene4_Plugins.duration = SCENE4_DURATION;
