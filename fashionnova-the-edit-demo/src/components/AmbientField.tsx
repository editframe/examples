import React from "react";

/**
 * Whole-video film-grain overlay. A direct sibling of the scene sequence (not nested in
 * any one scene) so it never needs to know which beat is playing. Fully CSS — the old
 * `0.05 + 0.03*sin(ms/90)` per-frame flicker becomes a single infinite `grain-flicker`
 * keyframe loop (period ≈ 565ms, matching the original sine period) with no JS at all.
 */
export const AmbientField: React.FC = () => (
  <div
    className="absolute pointer-events-none"
    style={{
      inset: -40,
      opacity: 0.05,
      mixBlendMode: "overlay",
      backgroundImage:
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      animation: "grain-flicker 565ms ease-in-out infinite alternate",
    }}
  />
);
