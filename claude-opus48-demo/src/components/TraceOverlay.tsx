import React from "react";
import { Image } from "@editframe/react";
import { TRACE_OPACITY } from "../constants";

/**
 * Trace ("tracing paper") overlay — sparse reference frames (one per second,
 * `src/assets/trace/frame-<ms>ms.jpg`), each visible only for the window around
 * its own timestamp (an instant on/off toggle, no fade), so a builder can align
 * the composition against the original reference at any point in the video.
 *
 * Only mounted when TRACE_MODE is true (see Video.tsx). Default OFF.
 *
 * A sibling of the scene sequence — its own local time equals the composition's
 * absolute time, so each frame's on/off window is still keyed off its original
 * master-ms timestamp. Visibility is a `steps(1)` instant show/hide pair
 * (`instant-show`/`instant-hide`, styles.css), computed once per frame at module
 * scope from TRACE_FRAMES — no per-frame ms comparison.
 */
const TRACE_FRAMES: { ms: number; src: string }[] = Array.from({ length: 25 }, (_, i) => ({
  ms: i * 1000,
  src: `/claude-opus48-demo/src/assets/trace/frame-${String(i * 1000).padStart(6, "0")}ms.jpg`,
}));

const FRAME_WINDOWS = TRACE_FRAMES.map((f, i) => {
  const prev = TRACE_FRAMES[i - 1]?.ms ?? -Infinity;
  const next = TRACE_FRAMES[i + 1]?.ms ?? Infinity;
  const start = prev === -Infinity ? 0 : (prev + f.ms) / 2;
  const end = next === Infinity ? undefined : (f.ms + next) / 2;
  return { ...f, start, end };
});

const TraceOverlay: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
    {FRAME_WINDOWS.map((f) => {
      const animations = [`instant-show 1ms ${f.start}ms steps(1) both`];
      if (f.end !== undefined) animations.push(`instant-hide 1ms ${f.end}ms steps(1) forwards`);
      return (
        <Image
          key={f.ms}
          src={f.src}
          style={
            {
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "fill",
              opacity: 0,
              "--instant-opacity": TRACE_OPACITY,
              animation: animations.join(", "),
            } as React.CSSProperties
          }
        />
      );
    })}
  </div>
);

export default TraceOverlay;
