import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { Reveal } from "../components/Reveal";
import { knitTexture } from "../components/texture";
import { SCENES, OAT, SAND, COOL_OAT, INK, LINE, STONE, SAGE, TAUPE, DUSTY_BLUE, GEOGRAPH, MONO } from "../constants";

const TREE_TOP = "/assets/tree-top.png";
const MAT_MERINO_TEE = "/assets/mat-merino-tee.png";

const eyebrow: React.CSSProperties = {
  fontFamily: GEOGRAPH, fontWeight: 500, textTransform: "uppercase",
  color: STONE, letterSpacing: "3px",
};

const MATERIALS = [
  { tone: SAGE, name: "ZQ Merino Wool", desc: "soft, breathable, temperature-regulating", img: MAT_MERINO_TEE },
  { tone: TAUPE, name: "Tree Fiber", desc: "FSC eucalyptus knit — cool & light", img: TREE_TOP },
  { tone: DUSTY_BLUE, name: "Sugarcane", desc: "SweetFoam™ carbon-negative sole", img: null },
];

/**
 * FEAT (materials) — MERINO WOOL · TREE FIBER · SUGARCANE + carbon-footprint badge.
 * 4100ms local. Opens with a circular tree-fiber knit wipe that erases WELL_A (its own
 * transition-in); closes by fading everything out together as WELL_B takes over.
 */
export const Feat: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.feat.duration}ms`} className="absolute inset-0">
    {/* knit-reveal wipe backdrop — grows to erase WELL_A, then fades as this scene hands off */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: knitTexture(SAND, TAUPE),
        animation: [
          "knit-wipe-in 650ms 100ms cubic-bezier(0.45,0,0.55,1) backwards",
          "reveal-out var(--ef-transition-duration) var(--ef-transition-out-start) cubic-bezier(0.45,0,0.55,1) forwards",
        ].join(", "),
      }}
    >
      {/* warm wash so type stays readable but the tree-fiber weave still reads */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(135% 110% at 50% 36%, rgba(236,233,226,0.30) 0%, rgba(236,233,226,0.74) 72%)" }}
      />
    </div>

    <div className="absolute left-0 right-0 text-center" style={{ top: 250 }}>
      <Reveal enter={[750, 1400]} exit="transition" exitY={-24} easeOut="in-out-quad" y={22}>
        <div style={{ ...eyebrow, fontSize: 15 }}>Made from</div>
        <div style={{ fontFamily: GEOGRAPH, fontWeight: 500, fontSize: 56, color: INK, marginTop: 14 }}>Natural materials</div>
      </Reveal>
    </div>

    {/* three material chips on chalky tiles, staggered in */}
    <div className="absolute flex flex-col" style={{ left: 90, right: 90, top: 470, gap: 30 }}>
      {MATERIALS.map((m, i) => (
        <Reveal
          key={m.name}
          enter={[1100 + i * 360, 1700 + i * 360]}
          exit="transition"
          exitY={-28}
          y={34}
          style={{
            display: "flex", alignItems: "center", gap: 26,
            background: COOL_OAT, borderRadius: 22, border: `1px solid ${LINE}`, padding: "22px 26px",
            boxShadow: "0 18px 44px rgba(33,33,33,0.06)",
          }}
        >
          {/* material swatch */}
          <div
            className="relative overflow-hidden flex-shrink-0"
            style={{ width: 132, height: 132, borderRadius: 18, background: m.img ? OAT : knitTexture(m.tone, COOL_OAT), border: `1px solid ${LINE}` }}
          >
            {m.img && (
              <Image
                src={m.img}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", mixBlendMode: "multiply" }}
              />
            )}
            {!m.img && <div className="absolute inset-0" style={{ background: knitTexture(m.tone, OAT), opacity: 0.55 }} />}
          </div>
          <div className="text-left">
            <div style={{ ...eyebrow, fontSize: 13, letterSpacing: "2px", color: m.tone === DUSTY_BLUE ? "#6E8C95" : STONE }}>{`0${i + 1}`}</div>
            <div style={{ fontFamily: GEOGRAPH, fontWeight: 500, fontSize: 34, color: INK, marginTop: 4 }}>{m.name}</div>
            <div style={{ fontFamily: GEOGRAPH, fontWeight: 400, fontSize: 21, color: STONE, marginTop: 4 }}>{m.desc}</div>
          </div>
        </Reveal>
      ))}
    </div>

    {/* carbon footprint badge (mono) */}
    <Reveal
      enter={[2250, 2950]}
      exit="transition"
      exitY={-20}
      easeOut="in-out-quad"
      y={20}
      style={{ position: "absolute", left: 90, right: 90, top: 1620, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, border: `1px solid ${LINE}`, borderRadius: 999, padding: "16px 28px", background: OAT }}>
        <div style={{ fontFamily: MONO, fontSize: 30, color: INK, letterSpacing: "0.04em" }}>7.1 KG CO₂E</div>
        <div style={{ width: 1, height: 26, background: LINE }} />
        <div style={{ ...eyebrow, fontSize: 14, letterSpacing: "2px" }}>per pair · B Corp since 2016</div>
      </div>
    </Reveal>
  </Timegroup>
);
