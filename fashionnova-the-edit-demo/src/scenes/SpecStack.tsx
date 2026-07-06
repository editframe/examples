import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { SCENES, BLACK, WHITE, SILVER, SILVER_GRAD, MONT } from "../constants";
import { Barcode } from "../components/Barcode";
import { Reveal } from "../components/Reveal";
import { CutFlash } from "../components/CutFlash";

const TEX_PAPER = "/assets/tex-paper.png";

const cover = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...extra,
});

const BANDS = [
  { src: "/assets/dress-3.jpg", no: "01", name: "MIDNIGHT MAXI", objPos: "50% 16%", specs: ["FLOOR-LENGTH MAXI", "RIBBED KNIT · COWL BACK", "SIZES XS–XL"] },
  { src: "/assets/ed01.jpg", no: "02", name: "PLUM BODYCON", objPos: "50% 26%", specs: ["RUCHED MINI", "STRETCH MESH · SQUARE NECK", "SIZES XS–L"] },
  { src: "/assets/ed07.jpg", no: "04", name: "LUXE BLAZER", objPos: "50% 30%", specs: ["OVERSIZED BLAZER DRESS", "TAILORED SUITING · DOUBLE-BREASTED", "SIZES S–XL"] },
  { src: "/assets/ed11.jpg", no: "07", name: "IVORY GOWN", objPos: "50% 18%", specs: ["SATIN SLIP GOWN", "BIAS-CUT · OPEN BACK", "SIZES XS–XL"] },
];

/**
 * SPEC STACK — full-frame dress-spec infographic: header + 4 full-width spec bands +
 * footer, mono/silver, no ink. 5300ms local; first 300ms is the tail of FanToEdit's
 * crossfade. Bands stagger top-to-bottom (priority-2 staggered array — one shared pair
 * of `@keyframes`, per-index `animation-delay`).
 */
export const SpecStack: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.specStack.duration}ms`} className="absolute inset-0" style={{ fontFamily: MONT, color: BLACK, background: "linear-gradient(180deg, #17171B 0%, #0C0C0E 100%)" }}>
    <CutFlash />
    <Image src={TEX_PAPER} style={cover({ opacity: 0.05, mixBlendMode: "screen" })} />
    <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(90% 60% at 50% 30%, rgba(255,255,255,0.06), rgba(0,0,0,0) 72%)" }} />

    <div className="absolute inset-0 flex flex-col">
      {/* header band */}
      <Reveal enter={[380, 820]} className="flex flex-col justify-center" style={{ flex: "0 0 226px", padding: "0 60px", borderBottom: `3px solid ${WHITE}` }}>
        <div className="flex justify-between items-baseline">
          <div style={{ fontWeight: 900, fontSize: 88, letterSpacing: "-0.01em", color: WHITE, fontFamily: MONT, lineHeight: 0.9 }}>THE EDIT</div>
          <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: "0.22em", color: SILVER, fontFamily: MONT }}>VOL.01</div>
        </div>
        <div className="flex items-center" style={{ marginTop: 18, gap: 16 }}>
          <div style={{ background: SILVER_GRAD, color: BLACK, fontWeight: 900, fontSize: 26, padding: "6px 16px", letterSpacing: "0.06em", fontFamily: MONT, border: `2px solid ${WHITE}` }}>FINAL HOURS</div>
          <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: "0.30em", color: "rgba(255,255,255,0.78)", fontFamily: MONT }}>FOUR LOOKS · UP TO 80% OFF</div>
        </div>
      </Reveal>

      {/* 4 full-width spec bands */}
      {BANDS.map((band, i) => {
        const t0 = 660 + i * 360;
        return (
          <div
            key={i}
            className="flex items-center"
            style={{
              flex: "1 1 0", minHeight: 0, gap: 36, padding: "0 56px",
              borderBottom: i < 3 ? "1.5px solid rgba(255,255,255,0.16)" : "none",
              background: i % 2 === 0 ? "rgba(255,255,255,0.022)" : "transparent",
              animation: [
                `spec-band-fade 300ms ${t0}ms cubic-bezier(0.33,1,0.68,1) both`,
                `spec-band-rise 620ms ${t0}ms cubic-bezier(0.34,1.56,0.64,1) both`,
              ].join(", "),
            }}
          >
            <div className="relative flex-shrink-0" style={{ width: 250, height: 330, overflow: "hidden", background: BLACK, border: "2px solid rgba(255,255,255,0.85)", boxShadow: "0 18px 40px rgba(0,0,0,0.55)" }}>
              <Image src={band.src} style={cover({ objectPosition: band.objPos })} />
              <div style={{ position: "absolute", left: 0, top: 0, background: BLACK, color: WHITE, fontWeight: 900, fontSize: 26, padding: "4px 12px", letterSpacing: "0.04em", fontFamily: MONT }}>{band.no}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: "0.30em", color: SILVER, fontFamily: MONT, marginBottom: 6 }}>LOOK {band.no}</div>
              <div style={{ fontWeight: 900, fontSize: 60, letterSpacing: "-0.01em", color: WHITE, fontFamily: MONT, lineHeight: 0.92 }}>{band.name}</div>
              <div style={{ marginTop: 16, height: 2, width: 120, background: SILVER }} />
              {band.specs.map((s, k) => (
                <div key={k} style={{ marginTop: k === 0 ? 16 : 8, fontWeight: 700, fontSize: 21, letterSpacing: "0.20em", color: "rgba(255,255,255,0.82)", fontFamily: MONT }}>{s}</div>
              ))}
            </div>
            <div className="flex-shrink-0 flex flex-col items-end" style={{ gap: 8 }}>
              <div style={{ fontWeight: 900, fontSize: 34, color: "rgba(255,255,255,0.5)", textDecoration: "line-through", fontFamily: MONT }}>$59</div>
              <div style={{ background: SILVER_GRAD, color: BLACK, fontWeight: 900, fontSize: 48, padding: "10px 22px", fontFamily: MONT, border: `2px solid ${WHITE}`, boxShadow: "0 10px 24px rgba(0,0,0,0.4)", lineHeight: 1 }}>$39.99</div>
            </div>
          </div>
        );
      })}

      {/* footer band */}
      <Reveal enter={[2200, 2700]} className="flex items-center justify-between" style={{ flex: "0 0 78px", padding: "0 60px", borderTop: `3px solid ${WHITE}` }}>
        <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: "0.26em", color: WHITE, fontFamily: MONT }}>FASHIONNOVA.COM</div>
        <Barcode w={220} h={34} color={WHITE} />
        <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: "0.1em", color: SILVER, fontFamily: MONT }}>$39.99 EACH</div>
      </Reveal>
    </div>
  </Timegroup>
);
