import React from "react";

/**
 * Burst of spark/metal particles. Parent drives motion via onFrame using
 * the refs passed back through `refList`. Particles are SVG circles + line
 * streaks for that "metal cracking" feel.
 */

interface Props {
  count?: number;
  spread?: number;
  refList: React.MutableRefObject<(SVGGElement | null)[]>;
  seed?: number;
  colors?: string[];
  size?: [number, number];
  style?: React.CSSProperties;
}

export const Sparks: React.FC<Props> = ({
  count = 36,
  spread = 320,
  refList,
  seed = 0,
  colors = ["#FFD27A", "#FF8A3D", "#FFFFFF", "#D63B3B"],
  size = [2, 5],
  style,
}) => {
  // deterministic pseudo-random
  const rnd = (i: number) => {
    const x = Math.sin((i + 1) * 12.9898 + seed * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };

  const items = Array.from({ length: count }).map((_, i) => {
    const angle = (i / count) * Math.PI * 2 + rnd(i) * 0.6;
    const dist = spread * (0.5 + rnd(i + 1) * 0.6);
    const sz = size[0] + rnd(i + 2) * (size[1] - size[0]);
    const color = colors[i % colors.length];
    const isStreak = i % 4 === 0;
    return { angle, dist, sz, color, isStreak, delay: rnd(i + 3) };
  });

  return (
    <svg
      width={spread * 2.4}
      height={spread * 2.4}
      viewBox={`${-spread * 1.2} ${-spread * 1.2} ${spread * 2.4} ${spread * 2.4}`}
      style={{ overflow: "visible", pointerEvents: "none", ...style }}
    >
      {items.map((p, i) => (
        <g
          key={i}
          ref={(el) => (refList.current[i] = el)}
          data-angle={p.angle}
          data-dist={p.dist}
          data-sz={p.sz}
          data-delay={p.delay}
          data-streak={p.isStreak ? 1 : 0}
          opacity={0}
        >
          {p.isStreak ? (
            <line
              x1={0}
              y1={0}
              x2={Math.cos(p.angle) * 14}
              y2={Math.sin(p.angle) * 14}
              stroke={p.color}
              strokeWidth={p.sz * 0.7}
              strokeLinecap="round"
            />
          ) : (
            <circle cx={0} cy={0} r={p.sz} fill={p.color} />
          )}
        </g>
      ))}
    </svg>
  );
};
