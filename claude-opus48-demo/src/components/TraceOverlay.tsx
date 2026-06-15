import React from "react";
import { TRACE_FRAMES } from "../traceFrames";

/**
 * Trace ("tracing paper") overlay — renders ALL sparse reference frames stacked,
 * and the scene's onFrame toggles which one is visible by ms. Cheaper than
 * swapping src per frame (avoids decode hitches in the renderer).
 *
 * Only mounted when TRACE_MODE is true (see Video.tsx). Default OFF.
 *
 * Exposes refs via the provided array so the scene can set opacity per frame.
 */
interface Props {
  imgRefs: React.RefObject<(HTMLImageElement | null)[]>;
}

const TraceOverlay: React.FC<Props> = ({ imgRefs }) => (
  <div style={{ position: "absolute", inset: 0, zIndex: 9999, pointerEvents: "none" }}>
    {TRACE_FRAMES.map((f, i) => (
      <img
        key={i}
        ref={(el) => {
          if (imgRefs.current) imgRefs.current[i] = el;
        }}
        src={f.src}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "fill",
          opacity: 0,
        }}
      />
    ))}
  </div>
);

export default TraceOverlay;
