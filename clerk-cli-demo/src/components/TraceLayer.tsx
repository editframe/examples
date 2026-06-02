/**
 * TraceLayer — tracing-paper overlay for build-time JSX alignment.
 *
 * STRUCTURAL CONTRACT:
 *  - This component renders the reference frame at z-index 0 (the BOTTOM of
 *    the stack). It is the visual blueprint underneath the JSX.
 *  - JSX layers in the parent scene render ABOVE it at z-index 1+.
 *  - **DO NOT MOVE THIS TO A HIGHER Z-INDEX.** If you do, the ghost will cover
 *    your JSX and "alignment verification" becomes self-referential.
 *
 * When TRACE_MODE is on, frames swap based on the current MASTER timestamp.
 * When TRACE_MODE is off, this component returns null.
 *
 * Usage in a scene:
 *   <TraceLayer sceneStartMs={7500} enabled={TRACE_MODE} opacity={0.5} />
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { getTraceFrameForMs, TRACE_FRAMES } from "../assets/trace-frames";

interface TraceLayerProps {
  sceneStartMs: number;
  enabled?: boolean;
  opacity?: number;
}

export function TraceLayer({ sceneStartMs, enabled = false, opacity = 0.5 }: TraceLayerProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  const onFrame = useCallback(
    ({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
      if (!enabled || !imgRef.current) return;
      const masterMs = sceneStartMs + ms;
      const targetSrc = getTraceFrameForMs(masterMs);
      if (imgRef.current.src !== targetSrc) {
        imgRef.current.src = targetSrc;
      }
    },
    [enabled, sceneStartMs]
  );

  if (!enabled) return null;

  return (
    <Timegroup
      mode="fixed"
      duration="60s"
      onFrame={onFrame as any}
      className="absolute inset-0"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <img
        ref={imgRef}
        src={TRACE_FRAMES[0]}
        alt="reference trace blueprint"
        style={{
          position: "absolute",
          inset: 0,
          width: 1920,
          height: 1080,
          opacity,
          pointerEvents: "none",
          objectFit: "cover",
          zIndex: 0,
        }}
      />
    </Timegroup>
  );
}
