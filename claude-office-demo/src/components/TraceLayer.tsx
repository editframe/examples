/**
 * TraceLayer — tracing-paper overlay for build-time JSX alignment.
 *
 * STRUCTURAL CONTRACT:
 *  - This component renders the reference frame at z-index 0 (the BOTTOM of
 *    the stack). It is the visual blueprint underneath the JSX.
 *  - JSX layers in the parent scene render ABOVE it at z-index 1+.
 *  - **DO NOT MOVE THIS TO A HIGHER Z-INDEX.** If you do, the ghost will cover
 *    your JSX and "alignment verification" becomes self-referential (you'd be
 *    comparing the ghost to itself). The whole tracing-paper unlock relies on
 *    JSX being visible OVER the ghost so a frame-by-frame comparison is possible.
 *
 * When enabled, frames swap based on the current MASTER timestamp.
 * When disabled, this component returns null and contributes nothing to the DOM.
 *
 * Usage in a scene:
 *   <TraceLayer sceneStartMs={7500} enabled={TRACE_MODE} opacity={0.5} />
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { getTraceFrameForMs, TRACE_FRAMES } from "../assets/trace-frames";

interface TraceLayerProps {
  /** Master-timeline ms where this scene begins. The trace picks the frame
   *  corresponding to (sceneStartMs + currentSceneLocalMs). */
  sceneStartMs: number;
  /** Toggle: when false the layer is invisible (null returned). */
  enabled?: boolean;
  /** Visual opacity of the ghost reference. 0.5 default — visible enough to align to,
   *  transparent enough that JSX on top is fully readable. */
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
      duration="30s"
      onFrame={onFrame as any}
      className="absolute inset-0"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,  // BOTTOM. Do not change.
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
