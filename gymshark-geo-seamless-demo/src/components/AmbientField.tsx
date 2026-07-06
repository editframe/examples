import React from "react";

/**
 * Whole-video ambient layer: a subtle breathing film-grain overlay. Rendered as a sibling
 * of the scene sequence (not inside any single scene) so it never needs to know which
 * beat is currently playing. Fully CSS-driven — an infinite keyframe, no JS.
 */
export const AmbientField: React.FC = () => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      zIndex: 70,
      mixBlendMode: "overlay",
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      animation: "grain-breathe 524ms ease-in-out infinite",
    }}
  />
);
