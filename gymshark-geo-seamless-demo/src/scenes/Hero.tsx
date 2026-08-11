import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { Reveal } from "@shared/components/Reveal";
import { SCENES, OVERLAP_MS, NEAR_BLACK, WHITE, OFF_WHITE, DISPLAY, HEAVY } from "../constants";

const MODEL_A = "/gymshark-geo-seamless-demo/src/assets/model-a.jpg";

/**
 * HERO — PRODUCT HERO. 3550ms local (nominal 3100ms solo + OVERLAP_MS, abs 800–4350).
 * The Geo Seamless tee presents clean: a very subtle settle + slow ambient breathe, then
 * "GEO SEAMLESS / T-SHIRT" + "$36" snap in tight succession.
 *
 * OWN entrance (T1 · HALFTONE DOT-DISSOLVE, the only bespoke transition tied to this
 * beat): for its first `OVERLAP_MS`, the whole scene is revealed through a growing
 * circular mask aperture — punching a hole in itself that widens to uncover Hook
 * underneath — while two dense dot fields scatter apart and fade. Hook needs no matching
 * exit of its own; it is simply uncovered as this mask opens.
 */
export const Hero: React.FC = () => (
  <Timegroup
    mode="fixed"
    duration={`${SCENES.hero.duration}ms`}
    className="absolute inset-0"
    style={{
      background: NEAR_BLACK,
      animation: `hero-reveal-mask ${OVERLAP_MS}ms 0ms cubic-bezier(0.45,0,0.55,1) forwards`,
    }}
  >
    {/* two dense dot fields scattering apart as the aperture opens (decorative flourish) */}
    <div
      className="absolute pointer-events-none"
      style={{
        inset: -240,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.85) 2px, transparent 2.6px)",
        backgroundSize: "16px 16px",
        backgroundPosition: "0 0",
        animation: `reveal-dots-scatter-a ${OVERLAP_MS}ms 0ms cubic-bezier(0.45,0,0.55,1) forwards`,
      }}
    />
    <div
      className="absolute pointer-events-none"
      style={{
        inset: -240,
        backgroundImage: "radial-gradient(circle, rgba(200,200,200,0.7) 2px, transparent 2.6px)",
        backgroundSize: "16px 16px",
        backgroundPosition: "8px 8px",
        animation: `reveal-dots-scatter-b ${OVERLAP_MS}ms 0ms cubic-bezier(0.45,0,0.55,1) forwards`,
      }}
    />

    {/* graded model image — torso KEY-LIT so the geo camo reads, bg kept engineered-dark.
        Outer wrapper handles the one-shot settle; the inner <Image> carries the perpetual
        weightless breathing so the two motions don't fight inside a single keyframe. */}
    <div className="absolute inset-0" style={{ transformOrigin: "50% 38%", animation: "hero-settle 900ms cubic-bezier(0.33,1,0.68,1) forwards" }}>
      <Image
        src={MODEL_A}
        style={{
          position: "absolute", left: "50%", top: 0, width: 1080, height: 1920, objectFit: "cover",
          objectPosition: "50% 24%", filter: "grayscale(0.45) brightness(0.92) contrast(1.18)",
          transform: "translateX(-50%)", animation: "hero-breathe 5700ms ease-in-out infinite",
        }}
      />
      {/* KEY/RIM: warm-white key glow ON THE TORSO only — lifts the camo ~1.5 stops locally */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 42% 26% at 50% 40%, rgba(255,255,255,0.30) 0%, transparent 72%)", mixBlendMode: "screen" }} />
      {/* RE-DARKEN the studio bg → engineered dark, leaving the lit torso readable */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 44% at 50% 40%, transparent 42%, rgba(8,8,8,0.97) 88%)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,8,8,0.62) 0%, transparent 30%, rgba(8,8,8,0.2) 58%, rgba(8,8,8,0.96) 100%)" }} />
    </div>

    {/* bottom title block — balanced full-width bar. GEO / SEAMLESS stacked tight,
        T-SHIRT kicker under SEAMLESS on the same left edge, $36 baseline-aligned. */}
    <div className="absolute" style={{ left: 64, bottom: 130, right: 64 }}>
      <div style={{ width: "100%", height: 2, background: "rgba(255,255,255,0.28)", marginBottom: 24 }} />
      <Reveal enter={[540, 900]} y={14} style={{ color: WHITE, fontFamily: DISPLAY, fontSize: 110, lineHeight: 0.86, letterSpacing: 0 }}>
        GEO<br />SEAMLESS
      </Reveal>
      <div className="flex items-baseline justify-between" style={{ marginTop: 18 }}>
        <Reveal enter={[780, 1120]} y={12} style={{ color: OFF_WHITE, fontFamily: HEAVY, fontWeight: 900, fontSize: 38, letterSpacing: 10 }}>
          T-SHIRT
        </Reveal>
        {/* $36 chip — optically centered, four identical corner ticks (spec-sheet language) */}
        <Reveal
          enter={[1060, 1420]}
          y={12}
          style={{
            transformOrigin: "100% 100%", position: "relative", width: 132, height: 84, display: "flex",
            alignItems: "center", justifyContent: "center", background: "rgba(10,10,10,0.6)", border: "2px solid rgba(255,255,255,0.5)",
          }}
        >
          <span style={{ color: WHITE, fontFamily: DISPLAY, fontSize: 52, lineHeight: 1, display: "block", transform: "translateY(-3px)" }}>$36</span>
          {[[0, 0], [1, 0], [0, 1], [1, 1]].map((c, i) => (
            <div
              key={i}
              style={{
                position: "absolute", [c[0] ? "right" : "left"]: -3, [c[1] ? "bottom" : "top"]: -3, width: 18, height: 18,
                borderTop: c[1] ? "none" : `4px solid ${WHITE}`, borderBottom: c[1] ? `4px solid ${WHITE}` : "none",
                borderLeft: c[0] ? "none" : `4px solid ${WHITE}`, borderRight: c[0] ? `4px solid ${WHITE}` : "none",
              } as React.CSSProperties}
            />
          ))}
        </Reveal>
      </div>
    </div>
  </Timegroup>
);
