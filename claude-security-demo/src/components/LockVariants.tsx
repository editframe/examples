import React from "react";

/**
 * Four lock variants for the deck-of-cards reveal. Each is a serious-looking
 * metal/iron lock — no PNG-flat icons. Gradients, beveled edges, screws,
 * hatching, drop shadows. Solid SVG primitives, no external assets.
 *
 *   variant="padlock"     classic body + shackle
 *   variant="deadbolt"    vertical bar lock w/ housing
 *   variant="combination" round dial lock w/ numbers
 *   variant="cylinder"    keyed cylinder lock w/ keyhole
 *
 * `state` toggles red/green theming.
 */

export type LockVariant = "padlock" | "deadbolt" | "combination" | "cylinder";

interface Props {
  variant: LockVariant;
  size?: number;
  state?: "locked" | "unlocked";
  id?: string;
  style?: React.CSSProperties;
}

const colors = (locked: boolean) => ({
  body: locked ? "#C42626" : "#2C8A4A",
  bodyLight: locked ? "#FF6E6E" : "#7FD49A",
  bodyDark: locked ? "#5A0F0F" : "#0F4520",
  metal: "#8A8E94",
  metalLight: "#D6DAE0",
  metalDark: "#3A3E45",
  ink: "#0E0F11",
});

export const LockVariant: React.FC<Props> = ({
  variant,
  size = 200,
  state = "locked",
  id = "lv",
  style,
}) => {
  const c = colors(state === "locked");
  const W = size;
  const H = size * 1.32;

  if (variant === "padlock") {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible", ...style }}>
        <defs>
          <linearGradient id={`${id}-body`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={c.bodyLight} />
            <stop offset="35%" stopColor={c.body} />
            <stop offset="100%" stopColor={c.bodyDark} />
          </linearGradient>
          <linearGradient id={`${id}-shackle`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={c.metalDark} />
            <stop offset="35%" stopColor={c.metalLight} />
            <stop offset="65%" stopColor={c.metal} />
            <stop offset="100%" stopColor={c.metalDark} />
          </linearGradient>
        </defs>
        {/* Shackle */}
        <path
          d={`M ${W * 0.28} ${H * 0.52} V ${H * 0.28}
              a ${W * 0.22} ${W * 0.22} 0 0 1 ${W * 0.44} 0
              V ${H * 0.52}
              h -${W * 0.12}
              V ${H * 0.32}
              a ${W * 0.16} ${W * 0.16} 0 0 0 -${W * 0.32} 0
              V ${H * 0.52}
              Z`}
          fill={`url(#${id}-shackle)`}
          stroke={c.ink}
          strokeWidth={2}
        />
        {/* Body */}
        <rect
          x={W * 0.1}
          y={H * 0.48}
          width={W * 0.8}
          height={H * 0.48}
          rx={W * 0.08}
          fill={`url(#${id}-body)`}
          stroke={c.ink}
          strokeWidth={2.4}
        />
        {/* Top reflection */}
        <rect
          x={W * 0.14}
          y={H * 0.51}
          width={W * 0.72}
          height={H * 0.1}
          rx={W * 0.06}
          fill={c.bodyLight}
          opacity={0.4}
        />
        {/* Screws */}
        {[
          [W * 0.18, H * 0.55],
          [W * 0.82, H * 0.55],
          [W * 0.18, H * 0.91],
          [W * 0.82, H * 0.91],
        ].map(([sx, sy], i) => (
          <g key={i}>
            <circle cx={sx} cy={sy} r={W * 0.03} fill={c.metalDark} stroke={c.ink} strokeWidth={1.2} />
            <path d={`M ${sx - W * 0.018} ${sy} L ${sx + W * 0.018} ${sy}`} stroke={c.metalLight} strokeWidth={1.2} />
          </g>
        ))}
        {/* Keyhole */}
        <circle cx={W * 0.5} cy={H * 0.72} r={W * 0.07} fill={c.ink} stroke={c.bodyDark} strokeWidth={2} />
        <path
          d={`M ${W * 0.5 - W * 0.025} ${H * 0.78} L ${W * 0.5 - W * 0.04} ${H * 0.92} L ${W * 0.5 + W * 0.04} ${H * 0.92} L ${W * 0.5 + W * 0.025} ${H * 0.78} Z`}
          fill={c.ink}
        />
      </svg>
    );
  }

  if (variant === "deadbolt") {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible", ...style }}>
        <defs>
          <linearGradient id={`${id}-housing`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={c.metalDark} />
            <stop offset="50%" stopColor={c.metalLight} />
            <stop offset="100%" stopColor={c.metalDark} />
          </linearGradient>
          <linearGradient id={`${id}-bar`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={c.bodyLight} />
            <stop offset="50%" stopColor={c.body} />
            <stop offset="100%" stopColor={c.bodyDark} />
          </linearGradient>
        </defs>
        {/* Housing */}
        <rect
          x={W * 0.18}
          y={H * 0.18}
          width={W * 0.64}
          height={H * 0.7}
          rx={W * 0.06}
          fill={`url(#${id}-housing)`}
          stroke={c.ink}
          strokeWidth={2.5}
        />
        {/* Inner panel */}
        <rect
          x={W * 0.24}
          y={H * 0.24}
          width={W * 0.52}
          height={H * 0.58}
          rx={W * 0.04}
          fill={c.metalDark}
          stroke={c.ink}
          strokeWidth={1.4}
        />
        {/* Vertical bolt bar (the deadbolt) */}
        <rect
          x={W * 0.42}
          y={H * 0.04}
          width={W * 0.16}
          height={H * 0.92}
          rx={W * 0.03}
          fill={`url(#${id}-bar)`}
          stroke={c.ink}
          strokeWidth={2}
        />
        {/* Highlight on bar */}
        <rect x={W * 0.43} y={H * 0.06} width={W * 0.04} height={H * 0.88} fill={c.bodyLight} opacity={0.4} />
        {/* Bolt head top */}
        <rect x={W * 0.38} y={H * 0.02} width={W * 0.24} height={H * 0.06} rx={W * 0.02} fill={c.metalDark} stroke={c.ink} strokeWidth={2} />
        {/* Indicator LED */}
        <circle cx={W * 0.5} cy={H * 0.36} r={W * 0.05} fill={c.body} stroke={c.ink} strokeWidth={1.5} />
        <circle cx={W * 0.5} cy={H * 0.36} r={W * 0.025} fill={c.bodyLight} />
        {/* Status bar segments */}
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={W * 0.28 + i * W * 0.12}
            y={H * 0.62}
            width={W * 0.08}
            height={H * 0.06}
            fill={i < 3 ? c.body : c.metalDark}
            stroke={c.ink}
            strokeWidth={1}
          />
        ))}
        {/* Screws */}
        {[
          [W * 0.24, H * 0.24],
          [W * 0.76, H * 0.24],
          [W * 0.24, H * 0.82],
          [W * 0.76, H * 0.82],
        ].map(([sx, sy], i) => (
          <circle key={i} cx={sx} cy={sy} r={W * 0.022} fill={c.ink} />
        ))}
      </svg>
    );
  }

  if (variant === "combination") {
    return (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible", ...style }}>
        <defs>
          <radialGradient id={`${id}-dial`} cx="40%" cy="40%" r="70%">
            <stop offset="0%" stopColor={c.bodyLight} />
            <stop offset="55%" stopColor={c.body} />
            <stop offset="100%" stopColor={c.bodyDark} />
          </radialGradient>
          <linearGradient id={`${id}-rim`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={c.metalLight} />
            <stop offset="100%" stopColor={c.metalDark} />
          </linearGradient>
        </defs>
        {/* Outer body block */}
        <rect
          x={W * 0.08}
          y={H * 0.16}
          width={W * 0.84}
          height={H * 0.76}
          rx={W * 0.06}
          fill={c.metalDark}
          stroke={c.ink}
          strokeWidth={2.4}
        />
        {/* Outer dial rim */}
        <circle cx={W * 0.5} cy={H * 0.54} r={W * 0.38} fill={`url(#${id}-rim)`} stroke={c.ink} strokeWidth={2.4} />
        {/* Notches around rim */}
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * Math.PI * 2;
          const r1 = W * 0.36;
          const r2 = W * 0.39;
          return (
            <line
              key={i}
              x1={W * 0.5 + Math.cos(a) * r1}
              y1={H * 0.54 + Math.sin(a) * r1}
              x2={W * 0.5 + Math.cos(a) * r2}
              y2={H * 0.54 + Math.sin(a) * r2}
              stroke={c.ink}
              strokeWidth={i % 5 === 0 ? 2 : 1}
            />
          );
        })}
        {/* Dial face */}
        <circle cx={W * 0.5} cy={H * 0.54} r={W * 0.3} fill={`url(#${id}-dial)`} stroke={c.ink} strokeWidth={2} />
        {/* Numbers */}
        {[0, 10, 20, 30].map((n, i) => {
          const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
          return (
            <text
              key={i}
              x={W * 0.5 + Math.cos(a) * W * 0.22}
              y={H * 0.54 + Math.sin(a) * W * 0.22 + 4}
              textAnchor="middle"
              fontSize={W * 0.08}
              fontWeight={700}
              fontFamily="'JetBrains Mono', monospace"
              fill={c.bodyLight}
            >
              {n}
            </text>
          );
        })}
        {/* Center hub */}
        <circle cx={W * 0.5} cy={H * 0.54} r={W * 0.06} fill={c.ink} stroke={c.metalLight} strokeWidth={1.5} />
        {/* Pointer tick at top */}
        <path
          d={`M ${W * 0.5 - 6} ${H * 0.14} L ${W * 0.5 + 6} ${H * 0.14} L ${W * 0.5} ${H * 0.22} Z`}
          fill={c.bodyLight}
          stroke={c.ink}
          strokeWidth={1.4}
        />
      </svg>
    );
  }

  // cylinder
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible", ...style }}>
      <defs>
        <linearGradient id={`${id}-cyl`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={c.bodyDark} />
          <stop offset="40%" stopColor={c.body} />
          <stop offset="55%" stopColor={c.bodyLight} />
          <stop offset="70%" stopColor={c.body} />
          <stop offset="100%" stopColor={c.bodyDark} />
        </linearGradient>
        <linearGradient id={`${id}-plate`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={c.metalLight} />
          <stop offset="100%" stopColor={c.metalDark} />
        </linearGradient>
      </defs>
      {/* Plate behind */}
      <rect
        x={W * 0.1}
        y={H * 0.14}
        width={W * 0.8}
        height={H * 0.74}
        rx={W * 0.04}
        fill={`url(#${id}-plate)`}
        stroke={c.ink}
        strokeWidth={2.4}
      />
      {/* Brushed metal hatch */}
      {Array.from({ length: 14 }).map((_, i) => (
        <line
          key={i}
          x1={W * 0.12}
          y1={H * 0.16 + i * (H * 0.72) / 14}
          x2={W * 0.88}
          y2={H * 0.16 + i * (H * 0.72) / 14}
          stroke={c.metalDark}
          strokeWidth={0.5}
          opacity={0.4}
        />
      ))}
      {/* Cylinder cap (the round lock face) */}
      <ellipse cx={W * 0.5} cy={H * 0.5} rx={W * 0.32} ry={W * 0.32} fill={`url(#${id}-cyl)`} stroke={c.ink} strokeWidth={2.4} />
      {/* Inner rim */}
      <ellipse cx={W * 0.5} cy={H * 0.5} rx={W * 0.26} ry={W * 0.26} fill="none" stroke={c.bodyDark} strokeWidth={1.6} />
      {/* Keyhole — classic teardrop */}
      <circle cx={W * 0.5} cy={H * 0.42} r={W * 0.06} fill={c.ink} />
      <path
        d={`M ${W * 0.5 - W * 0.024} ${H * 0.46}
            L ${W * 0.5 - W * 0.04} ${H * 0.66}
            L ${W * 0.5 + W * 0.04} ${H * 0.66}
            L ${W * 0.5 + W * 0.024} ${H * 0.46} Z`}
        fill={c.ink}
      />
      {/* Screws */}
      {[
        [W * 0.16, H * 0.2],
        [W * 0.84, H * 0.2],
        [W * 0.16, H * 0.82],
        [W * 0.84, H * 0.82],
      ].map(([sx, sy], i) => (
        <g key={i}>
          <circle cx={sx} cy={sy} r={W * 0.03} fill={c.metalDark} stroke={c.ink} strokeWidth={1.2} />
          <line
            x1={sx - W * 0.02}
            y1={sy - W * 0.02}
            x2={sx + W * 0.02}
            y2={sy + W * 0.02}
            stroke={c.metalLight}
            strokeWidth={1.2}
          />
        </g>
      ))}
    </svg>
  );
};
