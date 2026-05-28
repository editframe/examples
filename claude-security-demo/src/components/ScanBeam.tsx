import React from "react";

/**
 * Vertical glowing red scanner beam — sweeps left to right.
 * `position` 0..1 — horizontal position across width.
 * `intensity` 0..1 — alpha multiplier.
 */

interface Props {
  width: number;
  height: number;
  position?: number;
  intensity?: number;
  color?: string;
  thickness?: number;
  style?: React.CSSProperties;
}

export const ScanBeam: React.FC<Props> = ({
  width,
  height,
  position = 0,
  intensity = 1,
  color = "#FF3030",
  thickness = 4,
  style,
}) => {
  const x = position * width;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: "visible", pointerEvents: "none", ...style }}
    >
      <defs>
        <linearGradient id="beam-glow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity={0} />
          <stop offset="48%" stopColor={color} stopOpacity={0.35} />
          <stop offset="50%" stopColor={color} stopOpacity={1} />
          <stop offset="52%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* outer glow band */}
      <rect
        x={x - 60}
        y={0}
        width={120}
        height={height}
        fill="url(#beam-glow)"
        opacity={intensity}
      />
      {/* core line */}
      <rect
        x={x - thickness / 2}
        y={0}
        width={thickness}
        height={height}
        fill={color}
        opacity={intensity * 0.95}
        style={{ filter: "drop-shadow(0 0 8px " + color + ")" }}
      />
      {/* scanline interlace - little ticks */}
      {Array.from({ length: 14 }).map((_, i) => (
        <rect
          key={i}
          x={x - 30}
          y={(i / 14) * height + (position * 80) % (height / 14)}
          width={60}
          height={2}
          fill={color}
          opacity={intensity * 0.18}
        />
      ))}
    </svg>
  );
};
