/**
 * Scene 3 — "Agents are only as useful / as their environment." tagline
 * Duration: 2000ms
 * FIX 4: Text reduced to ~86px (was 120px) — still 2 lines, centered, weight 400
 * White background, black text
 */
import React, { useRef, useCallback } from "react";
import { Timegroup } from "@editframe/react";
import { track, lerp } from "../components/helpers";
import { TraceLayer } from "../components/TraceLayer";
import { TRACE_MODE } from "../constants";

const DURATION = 2000;
const START_MASTER = 4500;

export function Scene3_Tagline() {
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    const fadeT = track(ms, 0, 300);
    const translateY = lerp(16, 0, fadeT);

    if (line1Ref.current) {
      line1Ref.current.style.opacity = String(lerp(0, 1, fadeT));
      line1Ref.current.style.transform = `translateY(${translateY}px)`;
    }
    if (line2Ref.current) {
      line2Ref.current.style.opacity = String(lerp(0, 1, fadeT));
      line2Ref.current.style.transform = `translateY(${translateY}px)`;
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration="2s"
      onFrame={onFrame as any}
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0, width: 1920, height: 1080 }}
    >
      {/* Pure white background */}
      {!TRACE_MODE && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#FFFFFF",
            zIndex: 1,
          }}
        />
      )}

      {/* Centered text block */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          fontFamily: "system-ui, -apple-system, 'SF Pro Display', 'Inter', sans-serif",
        }}
      >
        {/* FIX 4: Reduced to ~86px (was 120px) */}
        <div
          ref={line1Ref}
          style={{
            fontSize: 86,
            fontWeight: 400,
            color: "#0A0A0A",
            lineHeight: 1.22,
            textAlign: "center",
            letterSpacing: "-0.02em",
            opacity: 0,
            whiteSpace: "nowrap",
          }}
        >
          Agents are only as useful
        </div>
        <div
          ref={line2Ref}
          style={{
            fontSize: 86,
            fontWeight: 400,
            color: "#0A0A0A",
            lineHeight: 1.22,
            textAlign: "center",
            letterSpacing: "-0.02em",
            opacity: 0,
            whiteSpace: "nowrap",
          }}
        >
          as their environment.
        </div>
      </div>

      <TraceLayer sceneStartMs={START_MASTER} enabled={TRACE_MODE} opacity={0.4} />
    </Timegroup>
  );
}

Scene3_Tagline.duration = DURATION;
