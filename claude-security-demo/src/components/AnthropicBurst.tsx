import React from "react";

/**
 * Anthropic asterisk/burst mark — 14 spokes radiating from a center point.
 * Color and size configurable; opacity/scale driven from parent via style.
 */

interface Props {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

const AnthropicBurst: React.FC<Props> = ({ size = 96, color = "var(--outro-burst)", style }) => {
  const spokes = 14;
  const inner = 0;
  const outer = size * 0.46;
  const width = size * 0.075;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={style}
    >
      {Array.from({ length: spokes }).map((_, i) => {
        const angle = (i * 360) / spokes;
        return (
          <rect
            key={i}
            x={size / 2 - width / 2}
            y={size / 2 - outer}
            width={width}
            height={outer - inner}
            rx={width / 2}
            fill={color}
            transform={`rotate(${angle} ${size / 2} ${size / 2})`}
          />
        );
      })}
    </svg>
  );
};

export default AnthropicBurst;
