import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { Reveal } from "@shared/components/Reveal";
import { SCENES, W, H, SAND, COOL_OAT, INK, STONE, GEOGRAPH, PRICE } from "../constants";

const TREE_LEFT = "/allbirds-tree-runner-demo/src/assets/tree-left.png";

const eyebrow: React.CSSProperties = {
  fontFamily: GEOGRAPH, fontWeight: 500, textTransform: "uppercase",
  color: STONE, letterSpacing: "3px",
};

/**
 * HERO — Tree Runner NZ floats in weightless on a soft sand tile.
 * 4600ms local: first 600ms cross-fades in from Hook, last 600ms morphs the tile
 * into the WELL_A frame as the well takes over.
 */
export const Hero: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.hero.duration}ms`} className="absolute inset-0">
    {/* light-bloom flash left over from the Hook→Hero cut */}
    <div
      className="absolute pointer-events-none"
      style={{
        left: W / 2 - 520, top: H * 0.46 - 520, width: 1040, height: 1040, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,253,248,0.9) 0%, rgba(255,253,248,0.0) 62%)",
        animation: "hero-bloom 1700ms 100ms cubic-bezier(0.45,0,0.55,1) both",
      }}
    />

    {/* soft sand tile — grows in, then morphs into the WELL_A frame as the scene hands off */}
    <div
      className="absolute"
      style={{
        background: `linear-gradient(160deg, ${SAND} 0%, ${COOL_OAT} 100%)`,
        animation: [
          "hero-tile-grow 950ms 550ms cubic-bezier(0.33,1,0.68,1) both",
          "hero-tile-to-well var(--ef-transition-duration) var(--ef-transition-out-start) cubic-bezier(0.45,0,0.55,1) forwards",
        ].join(", "),
      }}
    />

    {/* contact shadow */}
    <div
      className="absolute"
      style={{
        left: W / 2, top: H * 0.46 + 250, width: 420, height: 60, borderRadius: "50%",
        background: `radial-gradient(ellipse, ${STONE} 0%, transparent 70%)`,
        transform: "translate(-50%,-50%)", filter: "blur(6px)",
        animation: [
          "hero-shadow-in 850ms 450ms cubic-bezier(0.33,1,0.68,1) both",
          "reveal-out var(--ef-transition-duration) var(--ef-transition-out-start) cubic-bezier(0.45,0,0.55,1) forwards",
        ].join(", "),
      }}
    />

    {/* the hero shoe — outer wrapper handles enter/exit, inner Image handles the perpetual weightless bob */}
    <div
      className="absolute"
      style={{
        left: W / 2, top: H * 0.46, width: 760,
        animation: [
          "hero-shoe-wrap-in 850ms 450ms cubic-bezier(0.33,1,0.68,1) both",
          "hero-shoe-wrap-out var(--ef-transition-duration) calc(var(--ef-transition-out-start) + 200ms) cubic-bezier(0.45,0,0.55,1) forwards",
        ].join(", "),
      }}
    >
      <Image
        src={TREE_LEFT}
        style={{ width: "100%", height: "auto", mixBlendMode: "multiply", animation: "shoe-bob 2800ms ease-in-out infinite" }}
      />
    </div>

    {/* copy */}
    <div className="absolute left-0 right-0 text-center" style={{ top: H * 0.46 + 360 }}>
      <Reveal enter={[450, 1000]} exit="transition" easeOut="in-cubic" y={16} style={{ ...eyebrow, fontSize: 16 }}>
        Tree Runner NZ
      </Reveal>
      <Reveal
        enter={[650, 1300]}
        exit="transition"
        easeOut="in-cubic"
        y={20}
        style={{ fontFamily: GEOGRAPH, fontWeight: 500, fontSize: 64, color: INK, marginTop: 16 }}
      >
        Tread lightly
      </Reveal>
      <Reveal
        enter={[950, 1600]}
        exit="transition"
        easeOut="in-cubic"
        y={18}
        style={{ fontFamily: GEOGRAPH, fontWeight: 400, fontSize: 30, color: STONE, marginTop: 18, letterSpacing: "0.04em" }}
      >
        {PRICE}
      </Reveal>
    </div>
  </Timegroup>
);
