import React from "react";
import { CARD_CREAM } from "../constants";

/**
 * Product on a warm-cream studio card (depth via ground shadow + gloss + cream feather).
 * Purely presentational shell — every scene that uses this (Hero, Offer) supplies its own
 * bespoke `@keyframes` via the `*Style.animation` props, since the two beats' physics
 * (3D perspective tilt vs. a flat settle-rotate) are different enough that a single shared
 * animation would be a worse fit than two small per-scene keyframe sets.
 */
export function ProductCard({
  src,
  cardW,
  cardH,
  imgPad,
  cardStyle,
  imgStyle,
  groundStyle,
  glossStyle,
}: {
  src: string;
  cardW: number;
  cardH: number;
  imgPad: number;
  cardStyle?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
  groundStyle?: React.CSSProperties;
  glossStyle?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute",
        width: cardW,
        height: cardH,
        borderRadius: 36,
        background: CARD_CREAM,
        boxShadow: "0 60px 110px rgba(42,35,32,0.20), 0 18px 38px rgba(42,35,32,0.12)",
        overflow: "hidden",
        ...cardStyle,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: imgPad,
          left: imgPad,
          width: cardW - imgPad * 2,
          height: cardH - imgPad * 2,
          borderRadius: 22,
          // warmed: no near-white center — warm oat #E3D8C2 → deeper oat so the glow behind
          // the bottle reads as warm studio light, never a near-white hotspot.
          background: "radial-gradient(82% 74% at 50% 42%, #E3D8C2 0%, #D9CCB3 62%, #CFC0A6 100%)",
          boxShadow: "inset 0 2px 12px rgba(42,35,32,0.08)",
          filter: "blur(1.2px)", // soft studio backdrop so the product reads as the sharpest element
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: cardH * 0.16,
          width: cardW * 0.46,
          height: cardW * 0.13,
          transform: "translateX(-50%)",
          background:
            "radial-gradient(60% 100% at 50% 50%, rgba(42,35,32,0.16) 0%, rgba(42,35,32,0.07) 45%, rgba(42,35,32,0) 78%)",
          filter: "blur(12px)",
          pointerEvents: "none",
          ...groundStyle,
        }}
      />
      <img
        src={src}
        alt=""
        style={{
          position: "absolute",
          left: imgPad,
          top: imgPad,
          width: cardW - imgPad * 2,
          height: cardH - imgPad * 2,
          objectFit: "contain",
          ...imgStyle,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "-20%",
          background:
            // warmed to oat #EDE6DA (237,230,218) — no near-white hotspot/halo behind the bottle
            "linear-gradient(125deg, rgba(237,230,218,0) 44%, rgba(237,230,218,0.55) 50%, rgba(237,230,218,0) 56%)",
          filter: "blur(3px)",
          pointerEvents: "none",
          opacity: 0.8,
          ...glossStyle,
        }}
      />
      {/* CREAM EDGE-FEATHER ON TOP — swallows the PNG's studio-white bounding box so there
          is no second white rectangle inside the card (works in headless render). */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(62% 66% at 50% 47%, rgba(231,221,204,0) 40%, rgba(228,216,196,0.6) 66%, #E3D5BE 84%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(120% 100% at 50% 35%, rgba(0,0,0,0) 62%, rgba(42,35,32,0.08) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
