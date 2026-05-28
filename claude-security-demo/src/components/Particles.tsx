import React, { useMemo } from "react";

/**
 * ParticleField — N circles scattered in a region, each with deterministic
 * polar-coord offsets. The parent's onFrame controls a `progress` value
 * passed via CSS variables to animate radius / opacity collectively.
 *
 * Used for orange "burst" effects when buttons click, text materializes, etc.
 */

interface ParticleFieldProps {
  count?: number;
  color?: string;
  /** Spread radius in px */
  spread?: number;
  /** Initial radius (cluster) */
  innerRadius?: number;
  size?: number;
  refList: React.MutableRefObject<(SVGCircleElement | null)[]>;
  /** Per-particle phase offset seed */
  seed?: number;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 28,
  color = "#D87B5C",
  spread = 320,
  innerRadius = 6,
  size = 3.5,
  refList,
  seed = 1,
}) => {
  const particles = useMemo(() => {
    const ps: { angle: number; dist: number; sz: number; delay: number }[] = [];
    let s = seed * 9301 + 49297;
    const rnd = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    for (let i = 0; i < count; i++) {
      ps.push({
        angle: rnd() * Math.PI * 2,
        dist: innerRadius + rnd() * spread,
        sz: size * (0.6 + rnd() * 0.9),
        delay: rnd() * 0.4,
      });
    }
    return ps;
  }, [count, spread, innerRadius, size, seed]);

  return (
    <svg
      width={spread * 2.4}
      height={spread * 2.4}
      viewBox={`-${spread * 1.2} -${spread * 1.2} ${spread * 2.4} ${spread * 2.4}`}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      {particles.map((p, i) => {
        const x = Math.cos(p.angle) * p.dist;
        const y = Math.sin(p.angle) * p.dist;
        return (
          <circle
            key={i}
            ref={(el) => (refList.current[i] = el)}
            cx={x}
            cy={y}
            r={p.sz}
            fill={color}
            opacity={0}
            data-angle={p.angle}
            data-dist={p.dist}
            data-delay={p.delay}
            data-sz={p.sz}
          />
        );
      })}
    </svg>
  );
};
