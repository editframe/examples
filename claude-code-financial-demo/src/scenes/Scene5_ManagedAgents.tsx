/**
 * Scene 5 — "Or deploy them as Managed Agents" (19500–23000ms)
 *
 * FIX 5 (Round 5):
 *   - Background: #D87757 coral — PERSISTS through entire scene
 *   - NO beige, NO cream, NO #EAE8DE anywhere in this scene
 *   - Text fades in centered on coral bg
 *   - Scene ends by fading text out; coral bg hands off to Scene 6 which ALSO uses coral bg
 *
 * Duration: 3500ms  (master 19500–23000ms)
 * NOTE: Scene3_PillScroll ends at 10000+9500=19500ms
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TraceLayer } from "../components/TraceLayer";
import { track, lerp } from "../components/helpers";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { eases } from "animejs";

export const SCENE5_START    = 19500;
export const SCENE5_DURATION = 3500;

export function Scene5_ManagedAgents(): React.ReactElement {
  const textRef = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    if (!textRef.current) return;

    // Fade in: 0–700ms
    const inT = track(ms, 0, 700, eases.outCubic);
    // Fade out: 2800–3500ms
    const outT = track(ms, 2800, 3500, eases.inCubic);
    const opacity = Math.max(0, inT * (1 - outT));
    const ty = lerp(20, 0, inT);

    textRef.current.style.opacity   = String(opacity);
    textRef.current.style.transform = `translateY(${ty}px)`;
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE5_DURATION}ms`}
      onFrame={onFrame as any}
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0, width: 1920, height: 1080, overflow: "hidden" }}
    >
      <TraceLayer sceneStartMs={SCENE5_START} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* FIX 5: CORAL background — DO NOT change to beige/cream */}
      {!TRACE_MODE && (
        <div style={{ position: "absolute", inset: 0, background: "#D87757", zIndex: 1 }} />
      )}

      {/* Text — static position, single transform on textRef only */}
      <div
        ref={textRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0,
          willChange: "transform, opacity",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "0 160px",
          }}
        >
          <div
            style={{
              fontFamily: "'Newsreader', 'EB Garamond', Georgia, serif",
              fontWeight: 400,
              fontSize: 64,
              lineHeight: 1.35,
              color: "#1A1A1A",
              letterSpacing: "-0.01em",
            }}
          >
            <div>Or deploy them as Managed Agents:</div>
            <div>hosted, governed, production-ready on day one</div>
          </div>
        </div>
      </div>
    </Timegroup>
  );
}

Scene5_ManagedAgents.duration = SCENE5_DURATION;
