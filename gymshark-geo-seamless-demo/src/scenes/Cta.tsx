import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { Reveal } from "../components/Reveal";
import { Fin } from "../components/Fin";
import { camoBg, facetedCamo } from "../components/camo";
import { SCENES, OVERLAP_MS, W, H, NEAR_BLACK, WHITE, OFF_WHITE, DISPLAY, HEAVY } from "../constants";

const GYMSHARK_LOGO = "/assets/gymshark-logo.png";
const POSTER_FABRIC = "/assets/poster-fabric.jpg";
const MODEL_0030 = "/assets/model-0030.jpg";

// 8-tile grid mirroring the colorway selector's layout, used only by the T6 converge —
// cx/cy is each tile's displacement from the frame center, computed once at module scope.
const CELL_W = W / 4;
const CELL_H = 360;
const CTA_TILES = Array.from({ length: 8 }, (_, i) => {
  const col = i % 4;
  const row = Math.floor(i / 4);
  const left = col * CELL_W;
  const top = 700 + row * CELL_H;
  return { left, top, cx: left + CELL_W / 2 - W / 2, cy: top + CELL_H / 2 - H / 2 };
});

/**
 * CTA — CTA / OUTRO. 2550ms local (nominal 2100ms solo + OVERLAP_MS, abs 16450–19000).
 * The final beat. Real logo lockup on a dark fabric-texture bg → "SHOP GEO SEAMLESS" →
 * off-white "SHOP NOW" pill (camo accent bar + specular sheen) → "FROM $36" → GYMSHARK.COM.
 * Everything enters and holds — nothing exits (last scene in the sequence).
 *
 * OWN entrance (T6 · HALFTONE CONVERGE, the only bespoke transition tied to this beat):
 * 8 tiles — echoing the colorway grid just seen — collapse inward to a single point,
 * which blooms into this scene. No exit — this is the end of the composition.
 */
export const Cta: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.cta.duration}ms`} className="absolute inset-0" style={{ background: NEAR_BLACK }}>
    {/* drifting fabric-texture bg (the seamless macro, graded dark mono) */}
    <div
      className="absolute inset-0"
      style={{
        opacity: 0.55, transformOrigin: "50% 50%", transform: "scale(1.04) translateY(0)",
        animation: [
          `cta-bg-drift ${SCENES.cta.duration - OVERLAP_MS}ms ${OVERLAP_MS}ms linear forwards`,
          "cta-bg-bloom 4400ms ease-in-out infinite",
        ].join(", "),
      }}
    >
      <Image src={POSTER_FABRIC} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "78% 64%", filter: "grayscale(1) contrast(1.42) brightness(0.62)" }} />
    </div>
    {/* slower parallax model ghost behind, opposite direction, for depth */}
    <div
      className="absolute inset-0"
      style={{
        opacity: 0.16, transformOrigin: "50% 30%", mixBlendMode: "screen", transform: "scale(1.12) translateY(-10px)",
        animation: `cta-bg2-drift ${SCENES.cta.duration - OVERLAP_MS}ms ${OVERLAP_MS}ms linear forwards`,
      }}
    >
      <Image src={MODEL_0030} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 24%", filter: "grayscale(1) contrast(1.3) brightness(0.7)" }} />
    </div>
    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,10,10,0.46) 0%, rgba(10,10,10,0.68) 100%)" }} />
    <div className="absolute pointer-events-none" style={{ inset: -60, ...camoBg, opacity: 0.2, transform: "rotate(-10deg) scale(1.5)", animation: "camo-drift 6000ms linear infinite" }} />
    <div className="absolute inset-0" style={{ background: "radial-gradient(58% 40% at 50% 42%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 38%, transparent 72%)" }} />
    <div className="absolute inset-0" style={{ background: "radial-gradient(120% 80% at 50% 50%, transparent 52%, rgba(0,0,0,0.6) 100%)" }} />

    <div className="absolute inset-0 flex flex-col items-center justify-center">
      {/* real logo lockup — punches in slightly oversized and settles */}
      <div
        style={{
          marginBottom: 40, transformOrigin: "50% 50%", opacity: 0, transform: "scale(1.16)",
          animation: "cta-logo-in 420ms 520ms cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <Image src={GYMSHARK_LOGO} style={{ width: 560, height: "auto", display: "block" }} />
      </div>
      {/* SHOP GEO SEAMLESS — line-by-line reveal + slide */}
      <div
        style={{
          fontFamily: DISPLAY, fontSize: 100, lineHeight: 0.9, letterSpacing: -2, textAlign: "center", color: WHITE,
          opacity: 0, transform: "translateY(34px)", clipPath: "inset(0 0 102% 0)",
          animation: "cta-title-in 400ms 700ms cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        SHOP GEO<br />SEAMLESS
      </div>
      {/* SHOP NOW pill — premium branded fill, hard scale-pop then a breathing pulse */}
      <div
        className="relative flex items-center overflow-hidden"
        style={{
          marginTop: 50, padding: "30px 80px 30px 96px", background: "#FFFFFF", gap: 20,
          boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.25), 0 22px 56px rgba(0,0,0,0.6)",
          opacity: 0, transform: "scale(0.7)",
          animation: ["cta-btn-pop 410ms 950ms cubic-bezier(0.17,2,0.3,1) both", "cta-btn-pulse 1500ms 1360ms ease-in-out infinite"].join(", "),
        }}
      >
        <div className="absolute top-0 bottom-0 left-0" style={{ width: 34, background: NEAR_BLACK, zIndex: 3 }} />
        <div className="absolute top-0 bottom-0 left-0 pointer-events-none" style={{ width: 34, ...camoBg, opacity: 0.95, zIndex: 3 }} />
        <span style={{ position: "relative", zIndex: 2, fontFamily: HEAVY, fontWeight: 900, fontSize: 44, letterSpacing: 5, color: "#080808" }}>SHOP NOW</span>
        <span style={{ position: "relative", zIndex: 2, fontFamily: DISPLAY, fontSize: 40, color: "#080808", lineHeight: 1, transform: "translateY(-2px)" }}>→</span>
        {/* specular sheen — one entry sweep, then a slow repeating shimmer */}
        <div
          className="absolute top-0 bottom-0 left-0 pointer-events-none"
          style={{
            width: "55%", background: "linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(170,170,170,0.55) 48%, rgba(170,170,170,0.55) 52%, rgba(255,255,255,0) 100%)",
            zIndex: 1, mixBlendMode: "multiply", transform: "translateX(-160%) skewX(-18deg)",
            animation: "cta-sheen-sweep 2200ms 1020ms ease-in-out infinite",
          }}
        />
        {/* 1-frame land flash */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "#fff", zIndex: 4, mixBlendMode: "screen", opacity: 0, animation: "cta-btn-flash 180ms 1080ms linear" }} />
      </div>
      {/* FROM $36 anchor */}
      <Reveal enter={[1150, 1490]} y={14} easeIn="out-expo" className="inline-flex items-center" style={{ marginTop: 28, gap: 14 }}>
        <Fin size={0.22} color={WHITE} />
        <span style={{ fontFamily: HEAVY, fontWeight: 900, fontSize: 38, letterSpacing: 5, color: WHITE }}>FROM $36</span>
      </Reveal>
      {/* GYMSHARK.COM */}
      <Reveal enter={[1290, 1630]} y={12} easeIn="out-expo" style={{ marginTop: 26, fontFamily: HEAVY, fontWeight: 800, fontSize: 32, letterSpacing: 8, color: OFF_WHITE }}>
        GYMSHARK.COM
      </Reveal>
    </div>

    {/* T6 · HALFTONE CONVERGE — 8 tiles (echoing the colorway grid) collapse to a point,
        which blooms into this scene. */}
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 60, background: NEAR_BLACK, animation: `reveal-out ${OVERLAP_MS}ms linear forwards` }}>
      {CTA_TILES.map((t, i) => (
        <div
          key={i}
          className="absolute"
          style={
            {
              left: t.left, top: t.top, width: CELL_W - 8, height: CELL_H - 8, ...facetedCamo,
              border: "1px solid rgba(255,255,255,0.18)",
              "--tile-ncx": `${-t.cx}px`,
              "--tile-ncy": `${-t.cy}px`,
              animation: `cta-tiles-converge ${OVERLAP_MS}ms cubic-bezier(0.32,0,0.67,0) forwards`,
            } as React.CSSProperties
          }
        />
      ))}
      <div
        className="absolute rounded-full"
        style={{
          left: "50%", top: "50%", width: 360, height: 360, marginLeft: -180, marginTop: -180,
          background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 38%, transparent 70%)",
          opacity: 0, animation: `cta-bloom-core ${OVERLAP_MS}ms cubic-bezier(0.45,0,0.55,1) both`,
        }}
      />
    </div>
  </Timegroup>
);
