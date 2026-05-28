import React, { forwardRef } from "react";

/**
 * Concentric pulsing energy ring emanating from a point.
 * Parent drives `transform: scale(N)` and opacity imperatively via ref.
 */

interface Props {
  size?: number;          // base ring diameter (px)
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

const EnergyRing = forwardRef<HTMLDivElement, Props>(
  ({ size = 200, color = "var(--claude)", strokeWidth = 3, style }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          position: "absolute",
          width: size,
          height: size,
          left: -size / 2,
          top: -size / 2,
          borderRadius: "50%",
          border: `${strokeWidth}px solid ${color}`,
          boxShadow: `0 0 28px ${color}, inset 0 0 14px ${color}`,
          opacity: 0,
          willChange: "transform, opacity",
          pointerEvents: "none",
          ...style,
        }}
      />
    );
  }
);
EnergyRing.displayName = "EnergyRing";
export default EnergyRing;
