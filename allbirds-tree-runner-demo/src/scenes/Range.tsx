import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { Reveal } from "../components/Reveal";
import { SCENES, OAT, COOL_OAT, SAND, INK, LINE, GEOGRAPH, STONE } from "../constants";

const eyebrow: React.CSSProperties = {
  fontFamily: GEOGRAPH, fontWeight: 500, textTransform: "uppercase",
  color: STONE, letterSpacing: "3px",
};

const COLORWAYS = [
  { img: "/assets/cw-mushroom.png", name: "Mushroom" },
  { img: "/assets/cw-navy.png", name: "Navy" },
  { img: "/assets/cw-lightgrey.png", name: "Light Grey" },
  { img: "/assets/cw-anthracite.png", name: "Anthracite" },
  { img: "/assets/cw-seaspray.png", name: "Seaspray" },
  { img: "/assets/cw-port.png", name: "Port" },
  { img: "/assets/cw-gold.png", name: "Gold" },
  { img: "/assets/cw-black.png", name: "Black" },
  { img: "/assets/cw-auburn.png", name: "Auburn" },
];

/**
 * RANGE — the colorway grid drifts up across the muted palette.
 * 4100ms local. Tiles stagger in one-by-one; the whole grid lifts and fades together
 * during the transition-out into CTA.
 */
export const Range: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.range.duration}ms`} className="absolute inset-0">
    <div className="absolute left-0 right-0 text-center" style={{ top: 210 }}>
      <Reveal enter={[750, 1400]} exit="transition" exitY={-22} easeOut="in-out-quad" y={20} style={{ fontFamily: GEOGRAPH, fontWeight: 500, fontSize: 64, color: INK }}>
        The Range
      </Reveal>
      <Reveal enter={[950, 1600]} exit="transition" easeOut="in-out-quad" y={16} style={{ ...eyebrow, fontSize: 16, marginTop: 18 }}>
        Find your pair · in nature's palette
      </Reveal>
    </div>

    {/* 3x3 calm float grid of colorways on soft tiles */}
    <div className="absolute grid grid-cols-3" style={{ left: 90, right: 90, top: 430, gap: 26 }}>
      {COLORWAYS.map((cw, i) => (
        <Reveal
          key={cw.name}
          enter={[650 + i * 130, 1270 + i * 130]}
          exit="transition"
          exitY={-36 - (i % 3) * 14}
          easeOut="in-out-quad"
          y={40}
          style={{
            background: i % 3 === 0 ? OAT : i % 3 === 1 ? COOL_OAT : SAND,
            borderRadius: 20, border: `1px solid ${LINE}`, padding: "16px 12px 14px",
            boxShadow: "0 16px 38px rgba(33,33,33,0.06)", textAlign: "center",
          }}
        >
          <div className="relative w-full" style={{ height: 200 }}>
            <Image src={cw.img} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "multiply" }} />
          </div>
          <div style={{ ...eyebrow, fontSize: 13, letterSpacing: "1.6px", marginTop: 6 }}>{cw.name}</div>
        </Reveal>
      ))}
    </div>
  </Timegroup>
);
