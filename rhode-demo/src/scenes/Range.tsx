import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { Reveal } from "../components/Reveal";
import { SCENES, LEFT_COL, WARM_WHITE, OAT, CARD_CREAM, ESPRESSO, BROWN, COCOA, SANS, SERIF } from "../constants";

const SIP = "/assets/flat/sip.png";
const MACADAMIA = "/assets/flat/macadamia-butter.png";
const SUMMER_KIT = "/assets/flat/summer-kit.png";

const TILES = [
  { img: SIP, name: "pocket blush", price: "$22", left: 70, imgInset: 40 },
  { img: MACADAMIA, name: "tint · macadamia", price: "$20", left: 562, imgInset: 44 },
];

/**
 * RANGE — kinetic montage. 2870ms local (200ms cross-fades in — the wipe reveals the
 * three tiles progressively as it sweeps — 200ms cross-fades out into Offer).
 * The two smaller product tiles stagger in by array index; the wide summer-kit tile
 * follows as the third stagger step.
 */
export const Range: React.FC = () => (
  <Timegroup
    mode="fixed"
    duration={`${SCENES.range.duration}ms`}
    className="absolute inset-0"
    style={{
      background: `linear-gradient(165deg, ${WARM_WHITE} 0%, ${OAT} 100%)`,
      animation: [
        "wipe-x-in 500ms 220ms cubic-bezier(0.33,1,0.68,1) backwards",
        "wipe-x-out var(--ef-transition-duration) var(--ef-transition-out-start) cubic-bezier(0.45,0,0.55,1) forwards",
      ].join(", "),
    }}
  >
    <div style={{ position: "absolute", left: LEFT_COL + 3, top: 150, fontFamily: SANS, fontWeight: 600, fontSize: 26, letterSpacing: 9, textTransform: "uppercase", color: BROWN, whiteSpace: "nowrap" }}>
      <Reveal enter={[370, 770]} exit="transition" y={0} style={{ display: "inline-block" }}>
        the range
      </Reveal>
    </div>
    <div style={{ position: "absolute", left: LEFT_COL, top: 224, fontFamily: SANS, fontWeight: 300, fontSize: 100, lineHeight: 0.94, letterSpacing: -1, color: ESPRESSO }}>
      warm-weather
      <br />
      essentials
    </div>

    {/* balanced 2-column bento: two equal product tiles (top row), staggered in by index */}
    {TILES.map((t, i) => (
      <Reveal
        key={t.name}
        enter={[470 + i * 100, 990 + i * 100]}
        exit="transition"
        easeIn="out-back"
        y={64}
        style={{ position: "absolute", left: t.left, top: 540, width: 448 }}
      >
        {/* inner wrapper: continuous ambient bob (index-phased), separate from Reveal's own enter/exit transform */}
        <div style={{ animation: `range-tile-bob ${5200 + i * 700}ms ease-in-out ${-i * 900}ms infinite` }}>
          <div style={{ width: 448, height: 540, borderRadius: 30, background: CARD_CREAM, boxShadow: "0 36px 70px rgba(42,35,32,0.20)", overflow: "hidden", position: "relative" }}>
            <div className="absolute" style={{ inset: 26, borderRadius: 20, background: "radial-gradient(80% 70% at 50% 42%, #E3D8C2 0%, #D6C8AE 100%)" }} />
            <Image src={t.img} style={{ position: "absolute", inset: t.imgInset, width: `calc(100% - ${t.imgInset * 2}px)`, height: `calc(100% - ${t.imgInset * 2}px)`, objectFit: "contain" }} />
          </div>
          <div style={{ marginTop: 18, fontFamily: SANS, fontWeight: 500, fontSize: 32, letterSpacing: 0.3, color: ESPRESSO }}>{t.name}</div>
          <div style={{ marginTop: 2, fontFamily: SERIF, fontSize: 38, color: COCOA }}>{t.price}</div>
        </div>
      </Reveal>
    ))}

    {/* tile 3 — summer kit (wide, bottom), third stagger step */}
    <Reveal enter={[670, 1190]} exit="transition" easeIn="out-back" y={64} style={{ position: "absolute", left: 70, top: 1210, width: 940 }}>
      <div style={{ animation: "range-tile-bob 6600ms ease-in-out -1800ms infinite" }}>
        <div style={{ width: 940, height: 470, borderRadius: 30, background: CARD_CREAM, boxShadow: "0 40px 80px rgba(42,35,32,0.22)", overflow: "hidden", position: "relative", display: "flex", alignItems: "center" }}>
          <div className="absolute" style={{ inset: 24, borderRadius: 22, background: "radial-gradient(80% 80% at 42% 50%, #E3D8C2 0%, #D6C8AE 100%)" }} />
          <Image
            src={SUMMER_KIT}
            style={{ position: "absolute", left: 30, top: 24, width: 540, height: "calc(100% - 48px)", objectFit: "contain", filter: "sepia(0.18) saturate(1.14) hue-rotate(-6deg) contrast(1.03)" }}
          />
          <div className="absolute text-right" style={{ right: 56, top: "50%", transform: "translateY(-50%)" }}>
            <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 24, letterSpacing: 6, textTransform: "uppercase", color: BROWN }}>limited edition</div>
            <div style={{ marginTop: 8, fontFamily: SANS, fontWeight: 300, fontSize: 52, color: ESPRESSO, letterSpacing: -0.5 }}>the summer kit</div>
            <div style={{ marginTop: 2, fontFamily: SERIF, fontSize: 56, color: ESPRESSO }}>$100</div>
          </div>
        </div>
      </div>
    </Reveal>
  </Timegroup>
);
