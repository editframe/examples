import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { SCENES, OAT, ESPRESSO, ESPRESSO_BG, BROWN, COCOA, WARM_WHITE, DUSTY_ROSE, SOFT_PINK, SANS, SERIF } from "../constants";

const HIGHLIGHT_MILK = "/assets/flat/highlight-milk.png";
const SIP = "/assets/flat/sip.png";
const MACADAMIA = "/assets/flat/macadamia-butter.png";
const SUMMER_KIT = "/assets/flat/summer-kit.png";

const BEST_SELLERS = [
  { img: HIGHLIGHT_MILK, name: "highlight milk", price: "$28" },
  { img: SIP, name: "pocket blush", price: "$22" },
  { img: MACADAMIA, name: "lip tint · macadamia", price: "$20" },
  { img: SUMMER_KIT, name: "the summer kit", price: "$100" },
];

/**
 * CTA / OUTRO — stylized rhode site-scroll. 2750ms local, final beat (nothing plays
 * after it, so the whole-video "final resolve" vignette lives here instead of as a
 * top-level layer). Four discrete stages, each riding in on the last:
 *   1. the page scrolls (`cta-scroll`)
 *   2. an espresso plate wipes up to cover it (`cta-plate-in`, wordmark riding the plate)
 *   3. a cream overlay wipes up over the plate with its content already formed
 *      (`cta-overlay-in`)
 *   4. the lockup resolves in its own ~130ms-beat stagger: pill → "rhode" → url.
 */
export const Cta: React.FC = () => (
  <Timegroup
    mode="fixed"
    duration={`${SCENES.cta.duration}ms`}
    className="absolute inset-0 overflow-hidden"
    style={{ background: OAT, animation: "cta-scene-in 350ms 250ms both" }}
  >
    <div className="absolute top-0 left-0 right-0 flex items-center justify-center" style={{ height: 110, background: `${OAT}F2`, borderBottom: `1px solid ${BROWN}33`, zIndex: 3, backdropFilter: "blur(6px)" }}>
      <span style={{ fontFamily: SANS, fontWeight: 300, fontSize: 46, letterSpacing: 6, color: ESPRESSO }}>rhode</span>
      <span className="absolute" style={{ left: 50, fontFamily: SANS, fontSize: 26, color: BROWN, letterSpacing: 2 }}>☰</span>
      <span className="absolute" style={{ right: 50, fontFamily: SANS, fontWeight: 500, fontSize: 24, color: COCOA, letterSpacing: 2 }}>bag (3)</span>
    </div>

    <div className="absolute top-0 left-0 right-0" style={{ top: 110, animation: "cta-scroll 1100ms 400ms cubic-bezier(0.45,0,0.55,1) both" }}>
      <div style={{ height: 760, background: `linear-gradient(160deg, ${DUSTY_ROSE}, ${SOFT_PINK})`, position: "relative" }}>
        <div style={{ position: "absolute", left: 60, top: 130, fontFamily: SANS, fontWeight: 300, fontSize: 110, lineHeight: 0.96, color: ESPRESSO, letterSpacing: -1 }}>
          summer &rsquo;26
          <br />
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400 }}>has landed.</span>
        </div>
        <div style={{ position: "absolute", left: 64, top: 470, fontFamily: SANS, fontSize: 30, letterSpacing: 3, color: BROWN }}>warm-weather essentials, dropping now</div>
        <div style={{ position: "absolute", left: 64, top: 560, display: "inline-block", padding: "26px 56px", background: ESPRESSO, color: OAT, fontFamily: SANS, fontSize: 26, letterSpacing: 5, borderRadius: 999, textTransform: "uppercase", whiteSpace: "nowrap" }}>
          shop the collection
        </div>
      </div>
      <div style={{ padding: "70px 60px 90px", background: OAT }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 8, textTransform: "uppercase", color: COCOA, marginBottom: 40 }}>best sellers</div>
        <div className="grid grid-cols-2" style={{ gap: 36 }}>
          {BEST_SELLERS.map((p) => (
            <div key={p.name} style={{ background: "#E9E1D3", borderRadius: 28, overflow: "hidden", border: `1px solid ${COCOA}22`, boxShadow: "0 24px 54px rgba(42,35,32,0.18)" }}>
              <div style={{ height: 420, background: "radial-gradient(80% 70% at 50% 42%, #E4D9C3 0%, #D8CAB1 100%)", position: "relative" }}>
                <Image src={p.img} style={{ position: "absolute", inset: 24, width: "calc(100% - 48px)", height: "calc(100% - 48px)", objectFit: "contain", filter: "saturate(1.06) contrast(1.05)" }} />
              </div>
              <div style={{ padding: "22px 26px 30px" }}>
                <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 30, color: COCOA, letterSpacing: 0.5 }}>{p.name}</div>
                <div style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 34, color: COCOA, marginTop: 8 }}>{p.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* espresso color-block wipe — sweeps up over the scroll, wordmark riding the plate
        so no single frame is a flat solid espresso block */}
    <div className="absolute inset-0" style={{ zIndex: 4, background: ESPRESSO_BG, animation: "cta-plate-in 280ms 1300ms cubic-bezier(0.45,0,0.55,1) both" }}>
      <div
        className="absolute text-center"
        style={{
          left: "50%",
          top: "50%",
          fontFamily: SANS,
          fontWeight: 300,
          fontSize: 150,
          letterSpacing: 14,
          color: OAT,
          whiteSpace: "nowrap",
          animation: [
            "cta-plate-word-in 300ms 1350ms cubic-bezier(0.33,1,0.68,1) both",
            "cta-plate-word-out 150ms 1650ms cubic-bezier(0.45,0,0.55,1) forwards",
          ].join(", "),
        }}
      >
        rhode
      </div>
    </div>

    {/* cream CTA overlay — wipes up with its content already fully formed */}
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{
        zIndex: 5,
        background: `radial-gradient(120% 90% at 50% 50%, ${WARM_WHITE} 0%, ${OAT} 72%)`,
        animation: "cta-overlay-in 440ms 1370ms cubic-bezier(0.17,0.67,0.3,1.33) both",
      }}
    >
      <div
        style={{
          padding: "30px 78px",
          background: "#241D19",
          color: WARM_WHITE,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 48,
          letterSpacing: 10,
          textTransform: "uppercase",
          borderRadius: 999,
          animation: [
            "cta-shop-fade-in 240ms 1370ms cubic-bezier(0.33,1,0.68,1) both",
            "cta-shop-press 380ms 1370ms cubic-bezier(0.33,1,0.68,1) both",
            "cta-shop-bloom 520ms 1430ms cubic-bezier(0.33,1,0.68,1) both",
          ].join(", "),
        }}
      >
        shop rhode
      </div>
      <div style={{ marginTop: 70, fontFamily: SANS, fontWeight: 300, fontSize: 150, color: ESPRESSO, animation: "cta-word-in 390ms 1880ms cubic-bezier(0.33,1,0.68,1) both" }}>
        rhode
      </div>
      <div style={{ marginTop: 24, fontFamily: SANS, fontWeight: 400, fontSize: 34, letterSpacing: 8, color: BROWN, animation: "cta-fade-in 390ms 2080ms both" }}>
        rhodeskin.com
      </div>
    </div>

    {/* very subtle end resolve only — the final frame keeps the crisp espresso lockup */}
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 6, background: OAT, animation: "cta-final-resolve 150ms 2600ms both" }} />
  </Timegroup>
);
