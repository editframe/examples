import React from "react";

/** Reusable Figma-UI cursors. Position via left/top on the wrapper. */

export const ArrowCursor: React.FC<{ x: number; y: number; size?: number; white?: boolean }> = ({ x, y, size = 96, white }) => (
  // chunky Figma multiplayer pointer — LARGE bold black arrow w/ thick white border.
  // Tight viewBox so the arrow FILLS the SVG (size prop ≈ rendered arrow height); bold white stroke.
  <svg width={size} height={size} viewBox="3.4 1.4 18 21.2" style={{ position: "absolute", left: x, top: y, filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.5))", overflow: "visible" }}>
    {/* tight viewBox → arrow fills the SVG so size≈rendered height. thin white outline so the BLACK fill dominates (thick stroke paints over fill in EF → reads white). */}
    <path d="M4 2 L20.5 13 L12 14.3 L8 22 Z"
      fill={white ? "#fff" : "#000"} stroke={white ? "#000" : "#fff"} strokeWidth={1.2} strokeLinejoin="round" />
  </svg>
);

export const GrabCursor: React.FC<{ x: number; y: number; size?: number }> = ({ x, y, size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ position: "absolute", left: x, top: y, filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.35))" }}>
    <path d="M10 16 V9 a2 2 0 0 1 4 0 v6 V8 a2 2 0 0 1 4 0 v7 V9 a2 2 0 0 1 4 0 v6 V11 a2 2 0 0 1 4 0 v9 a7 7 0 0 1-7 7 h-2 a7 7 0 0 1-6-3.5 l-4-6 a2 2 0 0 1 3.2-2.4 z"
      fill="#fff" stroke="#000" strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);

/** Blue 4-point sparkle / smart-animate resize cursor */
export const SparkleCursor: React.FC<{ x: number; y: number; size?: number }> = ({ x, y, size = 46 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: "absolute", left: x, top: y }}>
    <path d="M12 2 C12.8 8 16 11.2 22 12 C16 12.8 12.8 16 12 22 C11.2 16 8 12.8 2 12 C8 11.2 11.2 8 12 2 Z" fill="#0D99FF" />
  </svg>
);
