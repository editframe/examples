import React, { useMemo } from "react";

/**
 * A stream of glowing orange particles flowing along a curved path
 * from `from` (a sub-terminal position) toward `to` (hero terminal).
 *
 * Renders an SVG <path> for the trail (drawn via stroke-dasharray reveal)
 * and N circle particles whose positions are computed in the parent's
 * onFrame loop. Parent passes a ref array; each circle has an id we
 * can grab via querySelector if needed, but easier: parent passes
 * particleRefs in via props.
 */

interface Props {
  from: { x: number; y: number };
  to: { x: number; y: number };
  ctrl?: { x: number; y: number };
  particleCount?: number;
  trailRef?: React.RefObject<SVGPathElement | null>;
  particleRefs?: React.RefObject<SVGCircleElement | null>[];
}

const ParticleStream: React.FC<Props> = ({
  from,
  to,
  ctrl,
  particleCount = 6,
  trailRef,
  particleRefs,
}) => {
  // Default control point: midpoint nudged toward center for arcing curve
  const cp = ctrl ?? {
    x: (from.x + to.x) / 2,
    y: (from.y + to.y) / 2 - 80,
  };

  const pathD = `M${from.x},${from.y} Q${cp.x},${cp.y} ${to.x},${to.y}`;

  // Generate path length approximation for stroke-dasharray
  const pathLen = useMemo(() => {
    // Approximate quadratic bezier length
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    return Math.sqrt(dx * dx + dy * dy) * 1.15;
  }, [from, to]);

  return (
    <svg
      width={1920}
      height={1080}
      viewBox="0 0 1920 1080"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      {/* Trail */}
      <path
        ref={trailRef}
        d={pathD}
        stroke="var(--claude)"
        strokeWidth={2}
        fill="none"
        opacity={0.55}
        strokeDasharray={pathLen}
        strokeDashoffset={pathLen}
        style={{
          filter: "drop-shadow(0 0 6px var(--claude))",
        }}
      />
      {/* Particles — initial positions at `from`, parent updates via ref */}
      {Array.from({ length: particleCount }).map((_, i) => (
        <circle
          key={i}
          ref={particleRefs?.[i]}
          cx={from.x}
          cy={from.y}
          r={5}
          fill="var(--claude-soft)"
          opacity={0}
          style={{
            filter: "drop-shadow(0 0 10px var(--claude))",
            willChange: "cx, cy, opacity",
          }}
        />
      ))}
    </svg>
  );
};

/**
 * Compute a point on the quadratic bezier curve at parameter t∈[0,1].
 */
export function bezierPoint(
  from: { x: number; y: number },
  ctrl: { x: number; y: number },
  to: { x: number; y: number },
  t: number
): { x: number; y: number } {
  const x =
    (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * ctrl.x + t * t * to.x;
  const y =
    (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * ctrl.y + t * t * to.y;
  return { x, y };
}

export default ParticleStream;
