import React from "react";

/**
 * Vercel triangle logo — pure SVG. Defaults to white-on-dark.
 * Size = total width in px.
 */
export const VercelLogo: React.FC<{ size?: number; fill?: string }> = ({
  size = 100,
  fill = "#FFFFFF",
}) => (
  <svg
    width={size}
    height={size * 0.866}
    viewBox="0 0 76 65"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="geometricPrecision"
    style={{ display: "block", shapeRendering: "geometricPrecision" as const }}
  >
    <path
      d="M37.5274 0L75.0548 65H0L37.5274 0Z"
      fill={fill}
      shapeRendering="geometricPrecision"
    />
  </svg>
);
