import React from "react";
import {
  outlookIconPng,
  wordIconPng,
  excelIconPng,
  powerpointIconPng,
} from "../assets/inlined";

/**
 * MS365Icon — renders any MS365 product icon via inlined base64 PNG (3D Fluent).
 *
 * BITMAP ALLOWLIST: these are official Microsoft 365 brand 3D Fluent PNGs from
 * public/extracted/icons/{outlook,word,excel,powerpoint}.png — treated as
 * "logo lockup" allowance per scene-build-brief.md §2.
 *
 * Props:
 *   which     — which icon to render
 *   cx / cy   — absolute center position in 1920×1080 space
 *   width     — rendered pixel width (height = width, icons are square)
 *   scale     — multiplicative scale on top of width
 *   opacity   — element opacity
 */
export type MS365IconKind = "outlook" | "word" | "excel" | "powerpoint";

interface MS365IconProps {
  which: MS365IconKind;
  cx: number;
  cy: number;
  width: number;
  scale?: number;
  opacity?: number;
  style?: React.CSSProperties;
}

const ICON_SRC: Record<MS365IconKind, string> = {
  outlook: outlookIconPng,
  word: wordIconPng,
  excel: excelIconPng,
  powerpoint: powerpointIconPng,
};

const ICON_LABEL: Record<MS365IconKind, string> = {
  outlook: "Outlook",
  word: "Word",
  excel: "Excel",
  powerpoint: "PowerPoint",
};

export function MS365Icon({
  which,
  cx,
  cy,
  width,
  scale = 1,
  opacity = 1,
  style,
}: MS365IconProps) {
  const src = ICON_SRC[which];
  const label = ICON_LABEL[which];
  const scaledWidth = width * scale;

  return (
    <div
      style={{
        position: "absolute",
        left: cx,
        top: cy,
        width: scaledWidth,
        height: scaledWidth, // SVG icons are square
        transform: "translate(-50%, -50%)",
        opacity,
        ...style,
      }}
    >
      {/* allowlist: official MS365 ${label} 3D Fluent PNG from public/extracted/icons/${which}.png */}
      <img
        src={src}
        alt={label}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
