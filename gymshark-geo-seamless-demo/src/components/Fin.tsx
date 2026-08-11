import React from "react";
import { Image } from "@editframe/react";

const GYMSHARK_FIN = "/gymshark-geo-seamless-demo/src/assets/gymshark-fin.png";

/**
 * The Gymshark fin mark, cropped from the official logo lockup. One real asset used at
 * every fin instance (well tags, swatch lockup, CTA) so every fin is pixel-identical to
 * the brand mark. White by default; a non-white `color` tints via a brightness filter.
 */
export function Fin({ size = 1, color = "#FFFFFF" }: { size?: number; color?: string }) {
  const w = 132 * size;
  const tint =
    color === "#FFFFFF"
      ? "none"
      : color.startsWith("rgba")
        ? `brightness(${color === "rgba(255,255,255,0.92)" ? 0.96 : 0.6})`
        : "none";
  const opacity = color.startsWith("rgba") ? Number(color.split(",")[3]?.replace(")", "") || 1) : 1;
  return (
    <Image
      src={GYMSHARK_FIN}
      style={{ width: w, height: "auto", display: "block", filter: tint, opacity }}
    />
  );
}
