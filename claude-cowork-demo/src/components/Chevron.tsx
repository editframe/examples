import React from "react";

export const Chevron = ({
  size = 26,
  color = "#A9A69E",
  rot = 0,
  sw = 2.6,
}: {
  size?: number;
  color?: string;
  rot?: number;
  sw?: number;
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ transform: `rotate(${rot}deg)` }}>
    <path
      d="M5 9 L12 16 L19 9"
      stroke={color}
      strokeWidth={sw}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
