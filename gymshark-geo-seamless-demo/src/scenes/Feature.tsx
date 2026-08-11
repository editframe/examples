import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { facetedCamo } from "../components/camo";
import { SCENES, OVERLAP_MS, NEAR_BLACK, WHITE, OFF_WHITE, GREY_MID, GREY_LINE, COOL_ACCENT_DIM, DISPLAY, HEAVY } from "../constants";

const MODEL_0049 = "/gymshark-geo-seamless-demo/src/assets/model-0049.jpg";

const CALLOUTS = [
  { k: "01", t: "SEAMLESS KNIT", delay: 850 },
  { k: "02", t: "4-WAY STRETCH", delay: 1350 },
  { k: "03", t: "SWEAT-WICKING", delay: 1850 },
];

/**
 * FEATURE — SEAMLESS FEATURE. 2800ms local (nominal 2350ms solo + OVERLAP_MS, abs
 * 8050–10850). Detail-crop push with staggered callouts: "SEAMLESS KNIT" · "4-WAY
 * STRETCH" · "SWEAT-WICKING".
 *
 * OWN entrance (T3 · SPEC-PANEL SHATTER, the only bespoke transition tied to this beat):
 * 6 rectangular UI panels (the spec-chrome language) fly in on staggered vectors,
 * assemble into a covering grid over the well, then clear — erasing Athlete. No exit of
 * its own — Fabric's own entrance (T4, see scenes/Fabric.tsx) is what erases this scene.
 */
export const Feature: React.FC = () => (
  <Timegroup
    mode="fixed"
    duration={`${SCENES.feature.duration}ms`}
    className="absolute inset-0"
    style={{ background: NEAR_BLACK, transformOrigin: "50% 42%", animation: `feature-punch-in 200ms ${OVERLAP_MS}ms cubic-bezier(0.16,1,0.3,1) both` }}
  >
    <div
      className="absolute inset-0"
      style={{
        transformOrigin: "40% 40%", opacity: 0, transform: "scale(1.1,1.1) translateX(0)",
        animation: `feature-push-in ${SCENES.feature.duration - OVERLAP_MS}ms ${OVERLAP_MS}ms cubic-bezier(0.33,1,0.68,1) both`,
      }}
    >
      <Image
        src={MODEL_0049}
        style={{
          position: "absolute", inset: 0, width: 1080, height: 1920, objectFit: "cover", objectPosition: "42% 30%",
          filter: "grayscale(0.34) brightness(0.92) contrast(1.2)", animation: "feature-breathe 3900ms ease-in-out infinite",
        }}
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,10,10,0.5) 0%, transparent 38%, rgba(10,10,10,0.92) 100%)" }} />
    </div>

    {/* top scrim so the header never fights the bright camo behind */}
    <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: 420, background: "linear-gradient(180deg, rgba(8,8,8,0.85) 0%, rgba(8,8,8,0.45) 55%, transparent 100%)" }} />
    <div className="absolute" style={{ top: 110, left: 70, right: 70 }}>
      <div className="flex items-baseline" style={{ gap: 12 }}>
        <span style={{ color: COOL_ACCENT_DIM, fontFamily: HEAVY, fontWeight: 900, fontSize: 24, letterSpacing: 1 }}>//</span>
        <span style={{ color: OFF_WHITE, fontFamily: HEAVY, fontWeight: 800, fontSize: 24, letterSpacing: 6 }}>THE FEEL</span>
      </div>
      <div style={{ color: WHITE, fontFamily: DISPLAY, fontSize: 84, lineHeight: 0.86, marginTop: 10, letterSpacing: -2 }}>MOVES<br />LIKE SKIN</div>
    </div>

    {/* callout rows — staggered slide-in, delay computed once per index */}
    <div className="absolute flex flex-col" style={{ bottom: 200, left: 70, right: 70, gap: 22 }}>
      {CALLOUTS.map((c) => (
        <div
          key={c.k}
          className="flex items-center"
          style={{
            gap: 22, borderBottom: `2px solid ${GREY_LINE}`, paddingBottom: 14, opacity: 0, transform: "translateX(64px)",
            animation: `feature-callout-in 220ms ${c.delay}ms cubic-bezier(0.16,1,0.3,1) both`,
          }}
        >
          <span style={{ color: GREY_MID, fontFamily: DISPLAY, fontSize: 34, minWidth: 60 }}>{c.k}</span>
          <span style={{ color: WHITE, fontFamily: DISPLAY, fontSize: 50, letterSpacing: 1 }}>{c.t}</span>
        </div>
      ))}
    </div>

    {/* T3 · SPEC-PANEL SHATTER — 6 panels fly in on staggered vectors, assemble, clear */}
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 60, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gridTemplateRows: "repeat(2,1fr)" }}>
      {Array.from({ length: 6 }).map((_, i) => {
        const dirX = (i % 3) - 1;
        const dirY = i < 3 ? -1 : 1;
        const rot = (dirX || 1) * 8;
        return (
          <div
            key={i}
            className="relative"
            style={
              {
                ...facetedCamo,
                border: "1px solid rgba(255,255,255,0.14)",
                "--panel-x": `${dirX * 760}px`,
                "--panel-y": `${dirY * 620}px`,
                "--panel-rot": `${rot}deg`,
                animation: `feature-panel-in ${OVERLAP_MS}ms ${i * 40}ms cubic-bezier(0.45,0,0.55,1) both`,
              } as React.CSSProperties
            }
          >
            <div className="absolute" style={{ top: 18, left: 18, right: 18, height: 2, background: "rgba(255,255,255,0.35)" }} />
            <div className="absolute" style={{ top: 30, left: 18, width: 40, height: 2, background: "rgba(255,255,255,0.6)" }} />
            <div className="absolute" style={{ bottom: 18, right: 18, width: 22, height: 22, borderRight: "3px solid rgba(255,255,255,0.5)", borderBottom: "3px solid rgba(255,255,255,0.5)" }} />
          </div>
        );
      })}
    </div>
  </Timegroup>
);
