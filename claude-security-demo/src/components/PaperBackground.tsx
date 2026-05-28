import React from "react";

/**
 * Anthropic editorial paper background — FLAT warm off-white #FAF9F5.
 * NO radial gradient (Jeremy: "the background is flat colors and there's no
 * surrounding shadow"). NO vignette darkening at edges.
 *
 * Optional very-low-opacity paper grain — kept under 0.04 so the background
 * READS as flat color, not as a textured / shadowy frame.
 */
export const PaperBackground: React.FC<{ tone?: "primary" | "cream"; grain?: boolean }> = ({
  tone = "primary",
  grain = true,
}) => (
  <div
    className="absolute inset-0"
    style={{
      background: tone === "cream" ? "#E5DECC" : "#DEDCD2",
    }}
  >
    {grain && (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.035,
          mixBlendMode: "multiply",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.6' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />
    )}
  </div>
);
