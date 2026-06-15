/**
 * OLIPOP retro motion-graphics primitives — pure SVG/CSS, no per-frame logic inside.
 * Animation is driven from Video.tsx by mutating refs/transforms on the wrappers.
 * These render the *static art*; Video.tsx makes it ALIVE.
 */
import React from "react";

// ── SUNBURST ── alternating wedge rays from center (the OLIPOP signature motif)
export const Sunburst: React.FC<{
  rays?: number;
  colorA: string;
  colorB: string;
  r?: number;
  cx?: number;
  cy?: number;
}> = ({ rays = 24, colorA, colorB, r = 1400, cx = 0, cy = 0 }) => {
  const wedges = [];
  const step = 360 / rays;
  for (let i = 0; i < rays; i++) {
    const a0 = (i * step - 90) * (Math.PI / 180);
    const a1 = ((i + 1) * step - 90) * (Math.PI / 180);
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    wedges.push(
      <path
        key={i}
        d={`M ${cx} ${cy} L ${x0} ${y0} L ${x1} ${y1} Z`}
        fill={i % 2 === 0 ? colorA : colorB}
      />
    );
  }
  return <g>{wedges}</g>;
};

// ── CONCENTRIC RINGS ── pulsing outline circles
export const Rings: React.FC<{
  count?: number;
  gap?: number;
  stroke: string;
  sw?: number;
  cx?: number;
  cy?: number;
  start?: number;
}> = ({ count = 6, gap = 70, stroke, sw = 6, cx = 0, cy = 0, start = 80 }) => (
  <g>
    {Array.from({ length: count }).map((_, i) => (
      <circle
        key={i}
        cx={cx}
        cy={cy}
        r={start + i * gap}
        fill="none"
        stroke={stroke}
        strokeWidth={sw}
        opacity={0.9 - i * 0.1}
      />
    ))}
  </g>
);

// ── UNDULATING WAVE BAND ── stacked sine ribbons (retro water/landscape)
export const WaveBand: React.FC<{
  width: number;
  colors: string[];
  amp?: number;
  baseY?: number;
  bandH?: number;
}> = ({ width, colors, amp = 26, baseY = 0, bandH = 46 }) => {
  const path = (y: number) => {
    const seg = width / 4;
    return (
      `M -40 ${y} ` +
      `C ${seg * 0.5} ${y - amp}, ${seg * 1.5} ${y + amp}, ${seg * 2} ${y} ` +
      `C ${seg * 2.5} ${y - amp}, ${seg * 3.5} ${y + amp}, ${seg * 4 + 40} ${y} ` +
      `L ${width + 40} 2200 L -40 2200 Z`
    );
  };
  return (
    <g>
      {colors.map((c, i) => (
        <path key={i} d={path(baseY + i * bandH)} fill={c} />
      ))}
    </g>
  );
};

// ── SCALLOP EDGE ── a row of half-circles (retro card / awning edge)
export const Scallop: React.FC<{
  width: number;
  fill: string;
  r?: number;
  y?: number;
  flip?: boolean;
}> = ({ width, fill, r = 26, y = 0, flip = false }) => {
  const n = Math.ceil(width / (r * 2)) + 1;
  let d = `M 0 ${flip ? y : y + r} `;
  for (let i = 0; i < n; i++) {
    const cx = i * r * 2 + r;
    d += `A ${r} ${r} 0 0 ${flip ? 0 : 1} ${cx + r} ${flip ? y : y + r} `;
  }
  d += flip ? `L ${width} ${y - r} L 0 ${y - r} Z` : `L ${width} ${y + r + 40} L 0 ${y + r + 40} Z`;
  return <path d={d} fill={fill} />;
};

// ── STAR (4-point sparkle / twinkle) ──
export const Star: React.FC<{ size?: number; fill: string }> = ({ size = 40, fill }) => {
  const h = size / 2;
  const w = size * 0.16;
  return (
    <svg width={size} height={size} viewBox={`-${h} -${h} ${size} ${size}`} style={{ overflow: "visible" }}>
      <path
        d={`M 0 ${-h} C ${w} ${-w} ${w} ${-w} ${h} 0 C ${w} ${w} ${w} ${w} 0 ${h} C ${-w} ${w} ${-w} ${w} ${-h} 0 C ${-w} ${-w} ${-w} ${-w} 0 ${-h} Z`}
        fill={fill}
      />
    </svg>
  );
};

// ── PALM + SUNSET emblem (mini version of the can art, for flourishes) ──
export const PalmEmblem: React.FC<{ size?: number; ink: string; sun: string }> = ({
  size = 120,
  ink,
  sun,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    {/* sun */}
    <path d="M 30 64 A 20 20 0 0 1 70 64 Z" fill={sun} />
    {/* sun stripes */}
    <path d="M 32 64 A 18 18 0 0 1 68 64" fill="none" stroke={ink} strokeWidth="2.4" />
    <path d="M 36 58 L 64 58" stroke={ink} strokeWidth="2" />
    <path d="M 40 53 L 60 53" stroke={ink} strokeWidth="2" />
    {/* palm trunks */}
    <path d="M 44 64 Q 40 44 36 30" fill="none" stroke={ink} strokeWidth="3.4" strokeLinecap="round" />
    <path d="M 56 64 Q 60 44 64 30" fill="none" stroke={ink} strokeWidth="3.4" strokeLinecap="round" />
    {/* fronds */}
    {[36, 64].map((tx) => (
      <g key={tx}>
        <path d={`M ${tx} 30 Q ${tx - 14} 22 ${tx - 22} 28`} fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
        <path d={`M ${tx} 30 Q ${tx + 14} 22 ${tx + 22} 28`} fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
        <path d={`M ${tx} 30 Q ${tx - 8} 18 ${tx - 12} 14`} fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
        <path d={`M ${tx} 30 Q ${tx + 8} 18 ${tx + 12} 14`} fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
      </g>
    ))}
  </svg>
);

// ── single rising BUBBLE (positioned + animated by parent) ──
export const Bubble: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle at 32% 30%, rgba(255,255,255,0.9), ${color} 70%)`,
      boxShadow: `0 0 ${size * 0.5}px ${color}66`,
    }}
  />
);
