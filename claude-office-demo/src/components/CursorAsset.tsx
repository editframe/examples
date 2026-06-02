import React from "react";

/**
 * CursorAsset — renders the macOS hand-pointer cursor.
 *
 * CURSOR ASSET STATUS: MISSING
 *   public/extracted/cursor-macos.svg — NOT FOUND
 *   public/extracted/cursor-macos.png — NOT FOUND
 *
 * Per Mandate #3: "Do NOT draw a procedural triangle / polygon / SVG shape
 * and call it a cursor." This component respects that mandate.
 *
 * CURRENT BEHAVIOR:
 *   - Renders nothing (returns null) until a real cursor asset is provided.
 *   - Orchestrator must source cursor-macos.png and place it at:
 *       public/extracted/cursor-macos.png
 *   - Once sourced, update inline-assets.mjs to include the cursor file,
 *     re-run `npm run inline-assets`, and update this component to use:
 *       import { cursorMacosPng } from "../assets/inlined";
 *
 * WHY THE CURSOR LOOKS LIKE A HAND IN THE REFERENCE:
 *   SHOT-LIST.md Scene 3 frame 39: "white hand-pointer with black outline,
 *   'M'-like fingers shape (rendered as an emoji-style 3-finger raised hand
 *   with index pointing up)."
 *   This is the macOS "hand/pointer" cursor (cursor: pointer system cursor).
 *
 * Props:
 *   cx / cy   — absolute center of the cursor tip in 1920×1080 space
 *   size      — height of the cursor in px (default 75)
 *   opacity   — element opacity
 */

interface CursorAssetProps {
  cx: number;
  cy: number;
  size?: number;
  opacity?: number;
  style?: React.CSSProperties;
}

export function CursorAsset({ cx, cy, size = 75, opacity = 1, style }: CursorAssetProps) {
  // macOS arrow cursor — inline SVG geometry from public/extracted/cursor-macos.svg
  // Hot-tip: cx/cy is the tip of the cursor arrow (top-left of the SVG bounding box)
  const w = size * 0.65;
  const h = size;
  return (
    <div
      style={{
        position: "absolute",
        left: cx,
        top: cy,
        width: w,
        height: h,
        opacity,
        willChange: "opacity",
        pointerEvents: "none",
        ...style,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={w}
        height={h}
        viewBox="0 0 32 32"
        shapeRendering="geometricPrecision"
        style={{ display: "block" }}
      >
        {/* White outline */}
        <path
          d="M 6 4 L 6 26 L 11 21 L 14.5 28.5 L 17.5 27 L 14 19.5 L 21 19.5 Z"
          fill="white"
          stroke="white"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {/* Black fill */}
        <path
          d="M 6 4 L 6 26 L 11 21 L 14.5 28.5 L 17.5 27 L 14 19.5 L 21 19.5 Z"
          fill="black"
          stroke="black"
          strokeWidth={0.5}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
