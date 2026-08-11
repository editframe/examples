import React from "react";
import { Timegroup } from "@editframe/react";
import { FigmaLogo } from "../components/FigmaLogo";
import { Reveal } from "@shared/components/Reveal";
import { Sfx } from "../components/Sfx";

/**
 * SceneD — Figma logo card (3.5s).
 *
 * Off-black #1E1E1E canvas (Figma's actual canvas color), 5-color F mark
 * centered above the wordmark. The reference video closes on the same
 * card. No peg shows this exact frame, but the 5 brand colors + dark canvas
 * are an explicit project rule.
 *
 *   0–650     Logo scale 0.85 → 1, opacity 0 → 1
 *   400–950   Wordmark fades in below (translateY 12 → 0)
 *   650–2900  Hold
 *   2900–3500 Gentle fade out
 *
 * Fully declarative — no `onFrame`/refs. The card also has a perpetual, very
 * subtle vertical "breathe" (± 1.2px, ~8.8s period) via an infinite CSS
 * keyframe (`scened-wrap-bob`), replacing the old per-frame `Math.sin(ms/1400)`.
 */
export const SceneD_LogoCard: React.FC = () => (
  <Timegroup mode="fixed" duration="3.5s" className="absolute inset-0">
    <div style={{ position: "absolute", inset: 0, background: "#1E1E1E" }} />

    <Sfx cue="reveal" at={0.0} dur={1.2} volume={0.42} />
    <Sfx cue="confirm" at={0.55} dur={0.5} volume={0.32} />

    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        animation: "scened-wrap-bob 8796ms ease-in-out infinite",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 56,
        }}
      >
        <Reveal enter={[0, 650]} exit={[2900, 3500]} y={0} scaleFrom={0.85} easeIn="out-quart" easeOut="out-cubic">
          <FigmaLogo size={200} />
        </Reveal>
        <Reveal
          enter={[400, 950]}
          exit={[2900, 3500]}
          y={12}
          easeIn="out-cubic"
          easeOut="out-cubic"
          style={{
            color: "#FFFFFF",
            fontFamily: "'Inter', 'Plus Jakarta Sans', -apple-system, system-ui, sans-serif",
            fontFeatureSettings: "'cv11', 'ss01', 'ss03'",
            fontSize: 108,
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          Figma
        </Reveal>
      </div>
    </div>
  </Timegroup>
);

export default SceneD_LogoCard;
