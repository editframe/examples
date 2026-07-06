/**
 * TraceLayer — tracing-paper overlay for build-time JSX alignment.
 *
 * STRUCTURAL CONTRACT:
 *  - This component renders the reference clip at z-index 0 (the BOTTOM of
 *    the stack). It is the visual blueprint underneath the JSX.
 *  - JSX layers in the parent scene render ABOVE it at z-index 1+.
 *  - **DO NOT MOVE THIS TO A HIGHER Z-INDEX.** If you do, the ghost will cover
 *    your JSX and "alignment verification" becomes self-referential.
 *
 * `<Video>` scrubs itself against its enclosing `Timegroup`'s own clock automatically
 * (no `onFrame`/ref needed) — `sourceIn` just offsets into the reference clip so the
 * frame shown at this scene's local time 0 matches this scene's own absolute start in
 * the master reference video.
 *
 * When TRACE_MODE is off, this component returns null.
 *
 * Usage in a scene:
 *   <TraceLayer sceneStartMs={7500} enabled={TRACE_MODE} opacity={0.5} />
 */
import React from "react";
import { Video } from "@editframe/react";

interface TraceLayerProps {
  /** This scene's own absolute start time (master-ms) in the reference video. */
  sceneStartMs: number;
  enabled?: boolean;
  opacity?: number;
}

export function TraceLayer({ sceneStartMs, enabled = false, opacity = 0.5 }: TraceLayerProps) {
  if (!enabled) return null;

  return (
    <Video
      src="/assets/reference-trace.mp4"
      sourceIn={`${sceneStartMs}ms`}
      mute
      className="absolute inset-0"
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
  );
}
