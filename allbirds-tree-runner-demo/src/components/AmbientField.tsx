import React from "react";
import { W, STONE, TAUPE, LINE } from "../constants";

/**
 * Ambient background layer: matte grain, wool-fiber particles, and the oat weave
 * texture. Rendered as a sibling of the scene sequence (not inside any single scene)
 * so it never needs to know which beat is currently playing.
 *
 * Fully CSS-driven — no `onFrame`, no refs, no per-frame math. Each particle's loop
 * period/phase/x-position is computed once (module load), then expressed as a
 * `fiber-drift` keyframe animation with a per-particle negative delay (which is how
 * CSS starts an infinite loop partway through its cycle).
 *
 * The weave texture is the one effect here that isn't purely ambient: it fades in once
 * (during the Hook→Hero cut) and then holds at its settled opacity for the rest of the
 * video — a single `animation-delay`, still no JS. Because this component is a direct
 * sibling of the root sequence (not nested in any scene), its own local time equals the
 * whole composition's time, so a fixed delay here is equivalent to an absolute-ms cue.
 */

const FIBER_COUNT = 18;

const fibers = Array.from({ length: FIBER_COUNT }, (_, i) => {
  const seed = i * 137.5;
  const duration = 9000 + (i % 4) * 2600; // loop period, ms
  const baseX = (seed * 7.3) % W;
  const delay = -(seed * 30 % duration); // negative delay = start mid-cycle (replaces the old `% speed` phase math)
  const size = i % 3 === 0 ? 5 : 3;
  const color = i % 2 ? STONE : TAUPE;
  return { key: `f${i}`, baseX, duration, delay, size, color };
});

export const AmbientField: React.FC = () => (
  <>
    {/* oat weave — densifies once during the Hook→Hero cut, then holds for the rest of the video */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `radial-gradient(circle at 0 0, ${LINE} 1px, transparent 1.5px) 0 0/26px 26px`,
        mixBlendMode: "multiply",
        animation: "weave-settle 1450ms 1450ms cubic-bezier(0.45,0,0.55,1) both",
      }}
    />

    {/* wool fibers drifting upward forever */}
    {fibers.map((f) => (
      <div
        key={f.key}
        className="absolute top-0"
        style={{
          left: f.baseX,
          width: f.size,
          height: f.size,
          borderRadius: "50%",
          background: f.color,
          animation: `fiber-drift ${f.duration}ms linear ${f.delay}ms infinite`,
        }}
      />
    ))}

    {/* matte grain, always on, very subtle (constant — no animation needed) */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity: 0.05,
        mixBlendMode: "multiply",
        backgroundImage: "radial-gradient(rgba(33,33,33,0.5) 0.5px, transparent 0.6px)",
        backgroundSize: "3px 3px",
      }}
    />
  </>
);
