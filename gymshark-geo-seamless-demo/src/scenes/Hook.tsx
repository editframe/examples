import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { Reveal } from "../components/Reveal";
import { camoBg } from "../components/camo";
import { SCENES, NEAR_BLACK, OFF_WHITE } from "../constants";

const GYMSHARK_LOGO = "/assets/gymshark-logo.png";
const HEAVY = "'Archivo', Inter, sans-serif";

/**
 * HOOK — 0 → 1250ms local (first scene, keeps its nominal duration unchanged). A calm,
 * premium opener on near-black: a faint geo-camo drift, the REAL GYMSHARK logo (white
 * wordmark + fin lockup) revealed by one confident left→right wipe, and one quiet kicker
 * line. No exit of its own — Hero's own entrance (T1, see scenes/Hero.tsx) is what
 * dissolves this scene away, so Hook just holds until the cut.
 */
export const Hook: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.hook.duration}ms`} className="absolute inset-0" style={{ background: NEAR_BLACK }}>
    {/* faint geo-camo drift — restrained, sets brand texture without busy-ness */}
    <div
      className="absolute pointer-events-none"
      style={
        {
          inset: -40,
          ...camoBg,
          opacity: 0.16,
          "--reveal-y": "0px",
          animation: ["camo-drift 6000ms linear infinite", "reveal-in 500ms 0ms linear backwards"].join(", "),
        } as React.CSSProperties
      }
    />
    {/* soft center vignette so the logo sits in a confident pool of light */}
    <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 46%, rgba(40,40,44,0.5) 0%, transparent 70%)" }} />
    <div className="absolute inset-0" style={{ background: "radial-gradient(120% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.6) 100%)" }} />

    {/* CENTERED REAL LOGO — revealed by a single sharp left→right wipe */}
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <Reveal enter={[120, 380]} y={10} style={{ position: "relative", width: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* the real white GYMSHARK wordmark + fin lockup, revealed left→right by a clipPath
            inset CONTAINED to the lockup box — a slab can never sit beside the fin. */}
        <div style={{ width: 700, animation: "hook-logo-wipe 640ms 120ms cubic-bezier(0.16,1,0.3,1) both" }}>
          <Image src={GYMSHARK_LOGO} style={{ width: 700, height: "auto", display: "block" }} />
        </div>
        {/* hairline leading edge of the wipe — a single crisp white tick riding the front */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "8%", bottom: "8%", width: 3, background: "rgba(255,255,255,0.9)",
            animation: "hook-wipe-edge 640ms 120ms linear both",
          }}
        />
      </Reveal>
      {/* one quiet kicker line under the logo — calm, single line */}
      <Reveal enter={[560, 900]} y={14} style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 40, height: 2, background: "rgba(255,255,255,0.4)" }} />
        <span style={{ color: OFF_WHITE, fontFamily: HEAVY, fontWeight: 800, fontSize: 26, letterSpacing: 10 }}>GEO SEAMLESS</span>
        <div style={{ width: 40, height: 2, background: "rgba(255,255,255,0.4)" }} />
      </Reveal>
    </div>
  </Timegroup>
);
