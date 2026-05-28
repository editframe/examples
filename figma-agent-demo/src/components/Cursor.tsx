import React from "react";

/**
 * Figma-style cursor: arrow SVG + colored name label below-right.
 * Position via parent transform; click pulse via the `pulse` prop (0..1).
 *
 * Variants:
 *   labelSide  "right" (default) — label sits below-right of arrow tip
 *              "left" — label sits below-left (for cursors at right edge)
 */
export const Cursor: React.FC<{
  name: string;
  color: string;
  labelSide?: "left" | "right";
}> = ({ name, color, labelSide = "right" }) => {
  return (
    <div style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
      {/* Arrow */}
      <svg
        width="26"
        height="30"
        viewBox="0 0 22 26"
        style={{ display: "block", filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.30))" }}
      >
        <path
          d="M3 2 L3 20 L8 16 L11 22 L14 21 L11 15 L18 15 Z"
          fill={color}
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      {/* Name label */}
      <div
        style={{
          position: "absolute",
          left: labelSide === "right" ? 22 : -8,
          top: 26,
          transform: labelSide === "left" ? "translateX(-100%)" : "none",
          background: color,
          color: "#FFFFFF",
          fontFamily: "Inter, sans-serif",
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: "-0.005em",
          padding: "5px 11px",
          borderRadius: 8,
          whiteSpace: "nowrap",
          boxShadow: "0 3px 8px rgba(0,0,0,0.28)",
        }}
      >
        {name}
      </div>
    </div>
  );
};
