/**
 * TraceLayer — tracing-paper overlay for build-time JSX alignment against a reference
 * capture. Authoring/QA tool only: every project's `TRACE_MODE` constant defaults to
 * `false`, so this renders `null` in any real render.
 *
 * STRUCTURAL CONTRACT (preserved from every per-example original):
 *  - Renders the reference frame/clip at z-index 0 (the BOTTOM of the stack) — the visual
 *    blueprint underneath the JSX. JSX layers in the parent scene render ABOVE it.
 *  - **DO NOT MOVE THIS TO A HIGHER Z-INDEX** — the ghost would cover the JSX and
 *    "alignment verification" becomes self-referential.
 *
 * Two mechanisms, sharing this one component's contract:
 *  - `createFramesTraceLayer` — swaps a `<img>`'s `src` across a JPG sequence via
 *    `onFrame`, driven by the scene's own local clock + `sceneStartMs`.
 *  - `createVideoTraceLayer` — a `<Video sourceIn=...>`, which scrubs itself against its
 *    enclosing `Timegroup`'s clock automatically (no `onFrame` needed).
 *
 * Each project owns its own reference asset (a frame sequence or a video file) — that's
 * the one thing that varies between the 7 near-identical per-example originals this was
 * consolidated from — so it's supplied to the factory, not hardcoded here.
 */
import React, { useCallback, useRef } from "react";
import { Timegroup, Video } from "@editframe/react";

export interface TraceLayerProps {
  /** This scene's own absolute start time (master-ms) in the reference capture. */
  sceneStartMs: number;
  enabled?: boolean;
  opacity?: number;
}

const traceLayerStyle = (opacity: number): React.CSSProperties => ({
  position: "absolute",
  inset: 0,
  width: 1920,
  height: 1080,
  opacity,
  pointerEvents: "none",
  objectFit: "cover",
  zIndex: 0,
});

/** Reference is a JPG frame sequence — swapped via `onFrame`. */
export function createFramesTraceLayer(opts: {
  frames: string[];
  getFrameForMs: (masterMs: number) => string;
}) {
  const { frames, getFrameForMs } = opts;
  return function TraceLayer({ sceneStartMs, enabled = false, opacity = 0.5 }: TraceLayerProps) {
    const imgRef = useRef<HTMLImageElement>(null);

    const onFrame = useCallback(
      ({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
        if (!enabled || !imgRef.current) return;
        const targetSrc = getFrameForMs(sceneStartMs + ms);
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
        style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}
      >
        <img
          ref={imgRef}
          src={frames[0]}
          alt="reference trace blueprint"
          style={traceLayerStyle(opacity)}
        />
      </Timegroup>
    );
  };
}

/** Reference is a video clip — `<Video sourceIn>` scrubs itself, no `onFrame` needed. */
export function createVideoTraceLayer(src: string) {
  return function TraceLayer({ sceneStartMs, enabled = false, opacity = 0.5 }: TraceLayerProps) {
    if (!enabled) return null;
    return (
      <Video
        src={src}
        sourceIn={`${sceneStartMs}ms`}
        mute
        className="absolute inset-0"
        style={traceLayerStyle(opacity)}
      />
    );
  };
}
