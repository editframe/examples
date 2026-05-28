import React from "react";

/**
 * Film-grain noise overlay. Drop into a scene above PaperBackground.
 * Static — relies on parent's `onFrame` to randomize backgroundPosition if needed.
 */
export const GrainOverlay: React.FC<{ opacity?: number; seed?: number }> = ({
  opacity = 0.08,
  seed = 0,
}) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      opacity,
      mixBlendMode: "multiply",
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><filter id='n${seed}'><feTurbulence type='fractalNoise' baseFrequency='2.2' numOctaves='2' stitchTiles='stitch' seed='${seed}'/></filter><rect width='100%25' height='100%25' filter='url(%23n${seed})'/></svg>")`,
      backgroundSize: "240px 240px",
      zIndex: 50,
    }}
  />
);

/**
 * Vignette overlay — subtle warm-brown corner darkening.
 * Default is OFF (strength=0). Use sparingly; the brand calls for FLAT
 * backgrounds, so a vignette should only nudge the eye toward center on
 * busy product-screen scenes, never darken edges into a "shadow surround"
 * (which is the exact thing the client called out).
 */
export const Vignette: React.FC<{ strength?: number }> = ({
  strength = 0,
}) => {
  if (strength <= 0) return null;
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `radial-gradient(ellipse at center, transparent 60%, rgba(20,20,19,${Math.min(strength, 0.18)}) 100%)`,
        mixBlendMode: "multiply",
        zIndex: 51,
      }}
    />
  );
};
