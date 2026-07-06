import React from "react";
import { Timegroup } from "@editframe/react";
import { Reveal } from "../components/Reveal";
import { Sunburst, Star, PalmEmblem } from "../components/retro";
import { SCENES, CORAL, SOFT_PINK, CREAM, CREAM_LT, TEAL_INK, SUNSET_GOLD } from "../constants";

const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";
const SANS = "'Archivo', -apple-system, 'Helvetica Neue', Arial, sans-serif";

const trackedCaps: React.CSSProperties = {
  fontFamily: SANS, fontWeight: 700, letterSpacing: 6, color: CORAL, textTransform: "uppercase",
};

/**
 * HOOK — 0 → 2000ms local (first scene; the last 850ms cross-fades into Hero).
 * Rotating coral sunburst + twinkle stars behind a cream sticker-badge: the OLIPOP
 * wordmark mask-wipes up, the palm emblem sits static, the tagline bounce-settles, then
 * a coral color-block wipes the whole beat out.
 */
export const Hook: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.hook.duration}ms`} className="absolute inset-0" style={{ background: CREAM, overflow: "hidden" }}>
    {/* rotating sunburst — one-shot pop-in wrapper around a continuous spin */}
    <div className="absolute" style={{ left: "50%", top: 760, width: 1, height: 1, transform: "translate(-50%,-50%)" }}>
      <div style={{ animation: "hook-burst-in 520ms 60ms cubic-bezier(0.34,1.56,0.64,1) both" }}>
        <div style={{ animation: "spin-cw 30000ms linear infinite" }}>
          <svg width={2800} height={2800} viewBox="-1400 -1400 2800 2800" style={{ position: "absolute", left: -1400, top: -1400 }}>
            <Sunburst rays={28} colorA={CORAL} colorB={SOFT_PINK} r={1500} />
          </svg>
        </div>
      </div>
    </div>

    {/* twinkle stars — continuous ambient, whole group pulses together */}
    <div className="absolute inset-0" style={{ animation: "hook-stars-twinkle 750ms ease-in-out infinite alternate" }}>
      <div style={{ position: "absolute", left: 150, top: 360 }}><Star size={58} fill={CREAM_LT} /></div>
      <div style={{ position: "absolute", left: 880, top: 480 }}><Star size={44} fill={SUNSET_GOLD} /></div>
      <div style={{ position: "absolute", left: 200, top: 1180 }}><Star size={50} fill={SUNSET_GOLD} /></div>
      <div style={{ position: "absolute", left: 860, top: 1080 }}><Star size={64} fill={CREAM_LT} /></div>
      <div style={{ position: "absolute", left: 540, top: 300 }}><Star size={36} fill={CREAM_LT} /></div>
    </div>

    {/* center stack on a clean cream sticker-badge */}
    <div
      className="absolute flex flex-col items-center"
      style={{
        left: 90, right: 90, top: 470, background: CREAM_LT, borderRadius: 60,
        padding: "70px 50px 64px", boxShadow: "0 30px 70px rgba(15,40,36,0.3)", border: `8px solid ${TEAL_INK}`,
      }}
    >
      <div className="absolute pointer-events-none" style={{ inset: 16, borderRadius: 46, border: `3px solid ${CORAL}` }} />

      {/* wordmark mask-wipe up, then scale-pop */}
      <div style={{ overflow: "hidden", padding: "0 10px" }}>
        <div style={{ animation: "hook-mask-wipe 460ms 360ms cubic-bezier(0.33,1,0.68,1) both" }}>
          <div
            style={{
              animation: "hook-logo-pop 520ms 360ms cubic-bezier(0.34,1.56,0.64,1) both",
              fontFamily: SERIF, fontWeight: 800, fontSize: 168, letterSpacing: 168 * 0.02,
              color: CORAL, lineHeight: 0.9, WebkitTextStroke: `${168 * 0.012}px ${CORAL}`,
            }}
          >
            OLIPOP
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <PalmEmblem size={150} ink={TEAL_INK} sun={CORAL} />
      </div>

      {/* tagline bounce-settle — final rotate(-2deg) is a resting offset, so both fill-modes are needed */}
      <div
        style={{
          marginTop: 22, animation: "hook-tag-bounce 560ms 760ms cubic-bezier(0.34,1.56,0.64,1) both",
          fontFamily: SERIF, fontWeight: 800, fontStyle: "italic", fontSize: 100, color: TEAL_INK, textAlign: "center", lineHeight: 0.96,
        }}
      >
        a new kind<br />of soda
      </div>

      <Reveal enter={[1120, 1480]} style={{ marginTop: 30, ...trackedCaps, fontSize: 27 }}>
        prebiotic&nbsp;·&nbsp;deliciously&nbsp;healthy
      </Reveal>
    </div>

    {/* coral color-block wipe-out — aligned to the scene boundary's shared crossfade window */}
    <div
      className="absolute inset-0"
      style={{
        background: CORAL, zIndex: 80, transform: "translateY(-100%)",
        animation: "hook-wipe-out var(--ef-transition-duration) var(--ef-transition-out-start) cubic-bezier(0.32,0,0.67,0) both",
      }}
    />
  </Timegroup>
);
