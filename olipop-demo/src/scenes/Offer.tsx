import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { Sunburst } from "../components/retro";
import { SCENES, SEAFOAM, SEAFOAM_LT, TEAL_INK, CORAL } from "../constants";

const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";
const SANS = "'Archivo', -apple-system, 'Helvetica Neue', Arial, sans-serif";

const PACK_12 = "/olipop-demo/src/assets/opt/tropical-12pack.webp";

/**
 * OFFER — the 12-pack pushes in, "build your variety pack" drops, the supporting line
 * clip-wipes in. 2850ms local.
 */
export const Offer: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.offer.duration}ms`} className="absolute inset-0" style={{ background: SEAFOAM, overflow: "hidden" }}>
    <div className="absolute" style={{ left: "50%", top: 880, width: 1, height: 1, transform: "translate(-50%,-50%)", animation: "offer-burst-fade-in 360ms 850ms both" }}>
      <div style={{ animation: "spin-cw 45000ms linear infinite" }}>
        <svg width={2800} height={2800} viewBox="-1400 -1400 2800 2800" style={{ position: "absolute", left: -1400, top: -1400 }}>
          <Sunburst rays={32} colorA={SEAFOAM_LT} colorB="#A9D9D4" r={1500} />
        </svg>
      </div>
    </div>

    {/* title — translateX(-50%) centering is baked into the offer-title-in keyframe itself
        (a static `transform` here would be replaced entirely while the animation runs) */}
    <div className="absolute text-center" style={{ left: "50%", top: 240, animation: "offer-title-in 420ms 1370ms cubic-bezier(0.34,1.56,0.64,1) both" }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 32, letterSpacing: 8, color: CORAL, textTransform: "uppercase" }}>stock&nbsp;up</div>
      <div style={{ fontFamily: SERIF, fontWeight: 800, fontStyle: "italic", fontSize: 104, color: TEAL_INK, lineHeight: 0.94, marginTop: 14 }}>
        build your<br />variety pack
      </div>
    </div>

    {/* shadow — enters with the pack's push-in */}
    <div
      className="absolute"
      style={{
        left: "50%", top: 1430, width: 700, height: 80, marginLeft: -350, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(15,40,36,0.4), transparent 70%)",
        animation: "offer-shadow-in 560ms 1070ms cubic-bezier(0.33,1,0.68,1) both",
      }}
    />

    {/* 12-pack — push-in wrapper, continuous weightless bob. translate(-50%,-50%) centering is
        baked into the offer-pack-in keyframe itself for the same reason as the title above. */}
    <div className="absolute" style={{ left: "50%", top: 1000, width: 900, height: 900, animation: "offer-pack-in 560ms 1070ms cubic-bezier(0.33,1,0.68,1) both" }}>
      <div style={{ animation: "offer-pack-bob 4775ms ease-in-out infinite" }}>
        <Image src={PACK_12} style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 28px 44px rgba(15,40,36,0.35))" }} />
      </div>
    </div>

    {/* inline supporting line — clip-wipe reveal (left→right), then hold */}
    <div className="absolute text-center" style={{ left: 0, right: 0, top: 1640, animation: "offer-sub-fade-in 240ms 1670ms both" }}>
      <span
        style={{
          fontFamily: SANS, fontWeight: 700, fontSize: 38, letterSpacing: 6, color: TEAL_INK, textTransform: "uppercase",
          display: "inline-block", animation: "offer-sub-wipe 500ms 1670ms cubic-bezier(0.33,1,0.68,1) both",
        }}
      >
        9g&nbsp;fiber&nbsp;·&nbsp;12&nbsp;pack&nbsp;·&nbsp;mix&nbsp;&amp;&nbsp;match
      </span>
    </div>
  </Timegroup>
);
