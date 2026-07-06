import React from "react";

// retro print-grain data-URI (subtle, baked, no per-frame cost — tiny generative noise
// texture, not product/lifestyle imagery, so it stays inline rather than becoming a file).
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

/**
 * Whole-video ambient layer: retro print grain + a soft vignette. Rendered as a sibling
 * of the scene sequence (not inside any single scene, and outside the camera-drift
 * wrapper) so it never moves and never needs to know which beat is currently playing.
 * Fully static — no `onFrame`, no refs, no per-frame math.
 */
export const AmbientField: React.FC = () => (
  <>
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 200, backgroundImage: GRAIN, backgroundSize: "200px 200px", opacity: 0.06, mixBlendMode: "multiply" }}
    />
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 201, background: "radial-gradient(ellipse at center, transparent 55%, rgba(14,51,46,0.22) 100%)" }}
    />
  </>
);
