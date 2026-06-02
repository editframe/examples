/**
 * Scene 7 — "Agents that work like developers do" tagline
 * Duration: 2000ms
 * FIX 7: WHITE background + BLACK text (NOT gradient bg + white text as in prior version)
 * ONE LINE, ~90px, centered, quick fade-in 300ms
 */
import React, { useRef, useCallback } from "react";
import { Timegroup } from "@editframe/react";
import { track, lerp } from "../components/helpers";
import { TraceLayer } from "../components/TraceLayer";
import { TRACE_MODE } from "../constants";

const DURATION = 2000;
const START_MASTER = 21000; // Scene6 now ends at 16000+5000=21000ms

export function Scene7_DevTagline() {
  const textRef = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    const fadeT = track(ms, 0, 300);
    const ty = lerp(14, 0, fadeT);
    if (textRef.current) {
      textRef.current.style.opacity = String(lerp(0, 1, fadeT));
      textRef.current.style.transform = `translateY(${ty}px)`;
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
      {/* FIX 7: Pure WHITE background — NOT gradient */}
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

      {/* FIX 7: Centered BLACK text on white bg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <div
          ref={textRef}
          style={{
            fontSize: 90,
            fontWeight: 500,
            color: "#0A0A0A",
            fontFamily: "system-ui, -apple-system, 'Inter', sans-serif",
            letterSpacing: "-0.025em",
            textAlign: "center",
            opacity: 0,
            whiteSpace: "nowrap",
          }}
        >
          Agents that work like developers do
        </div>
      </div>

      <TraceLayer sceneStartMs={START_MASTER} enabled={TRACE_MODE} opacity={0.4} />
    </Timegroup>
  );
}

Scene7_DevTagline.duration = DURATION;
