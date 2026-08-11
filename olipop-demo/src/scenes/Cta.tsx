import React from "react";
import { Timegroup } from "@editframe/react";
import { Reveal } from "@shared/components/Reveal";
import { Sunburst, Rings, Star } from "../components/retro";
import { SCENES, CORAL, CREAM, CREAM_LT, TEAL_INK, SUNSET_GOLD } from "../constants";

const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";
const SANS = "'Archivo', -apple-system, 'Helvetica Neue', Arial, sans-serif";

// 5 sparkle stars — position + a static per-star rotation offset (so they don't spin in
// lockstep) + a negative animation-delay for twinkle phase variance, all computed once.
const STARS = [
  { x: 130, y: 360, size: 92, rotOffset: 0, twinkleDelay: 0 },
  { x: 870, y: 440, size: 70, rotOffset: 60, twinkleDelay: -300 },
  { x: 160, y: 1520, size: 92, rotOffset: 120, twinkleDelay: -600 },
  { x: 880, y: 1480, size: 70, rotOffset: 180, twinkleDelay: -900 },
  { x: 520, y: 300, size: 92, rotOffset: 240, twinkleDelay: -1200 },
];

/**
 * CTA — outro coral sunburst + concentric rings open the beat, the "drink olipop"
 * lockup pops + bobs, sparkle stars twinkle, drinkolipop.com rises in. 2650ms local —
 * final beat, everything enters and holds, nothing exits.
 */
export const Cta: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.cta.duration}ms`} className="absolute inset-0" style={{ background: CORAL, overflow: "hidden" }}>
    {/* radiating coral sunburst — fades in on resolve, one-shot settle, continuous spin */}
    <div className="absolute" style={{ left: "50%", top: 960, width: 1, height: 1, transform: "translate(-50%,-50%)", animation: "cta-resolve-fade-in 300ms 910ms both" }}>
      <div style={{ animation: "cta-burst-settle 700ms 910ms cubic-bezier(0.33,1,0.68,1) both" }}>
        <div style={{ animation: "spin-cw 30000ms linear infinite" }}>
          <svg width={2800} height={2800} viewBox="-1400 -1400 2800 2800" style={{ position: "absolute", left: -1400, top: -1400 }}>
            <Sunburst rays={30} colorA={CORAL} colorB="#F2856C" r={1500} />
          </svg>
        </div>
      </div>
    </div>

    {/* concentric cream rings — opacity target tops out at 0.78 (not 1), so its fade+grow
        is its own dedicated keyframe rather than sharing cta-resolve-fade-in with the burst */}
    <div className="absolute" style={{ left: "50%", top: 960, width: 1, height: 1, transform: "translate(-50%,-50%)" }}>
      <div style={{ animation: "cta-rings-in 900ms 910ms cubic-bezier(0.33,1,0.68,1) both" }}>
        <div style={{ animation: "cta-rings-pulse 5027ms ease-in-out infinite" }}>
          <svg width={1700} height={1700} viewBox="-850 -850 1700 1700" style={{ position: "absolute", left: -850, top: -850 }}>
            <Rings count={7} gap={108} stroke={CREAM} sw={6} start={150} />
          </svg>
        </div>
      </div>
    </div>

    {/* center sun glow so the radiating reads as centered (static, no animation) */}
    <div
      className="absolute pointer-events-none"
      style={{
        left: "50%", top: 960, width: 920, height: 920, marginLeft: -460, marginTop: -460, borderRadius: "50%",
        background: `radial-gradient(closest-side, ${CORAL} 40%, rgba(232,80,58,0) 72%)`,
      }}
    />

    {/* sparkle stars — static per-star rotation offset (outer) + continuous spin (mid) + twinkle (inner) */}
    {STARS.map((s, i) => (
      <div key={i} className="absolute" style={{ left: s.x, top: s.y, animation: `cta-star-pop 320ms ${1210 + i * 110}ms cubic-bezier(0.34,1.56,0.64,1) both` }}>
        <div style={{ transform: `rotate(${s.rotOffset}deg)` }}>
          <div style={{ animation: "spin-cw 8640ms linear infinite" }}>
            <div style={{ animation: `cta-star-twinkle 1885ms ease-in-out ${s.twinkleDelay}ms infinite alternate` }}>
              <Star size={s.size} fill={SUNSET_GOLD} />
            </div>
          </div>
        </div>
      </div>
    ))}

    {/* "drink" (small cream) + "OLIPOP" (big yellow, teal outline) — pop-in wrapper, continuous bob.
        Centering (translate(-50%,-50%)) is baked into the cta-logo-in keyframe itself, since a
        static `transform` on this element would be entirely replaced while the animation runs. */}
    <div className="absolute text-center" style={{ left: "50%", top: 860, animation: "cta-logo-in 560ms 1010ms cubic-bezier(0.34,1.56,0.64,1) both" }}>
      <div style={{ animation: "cta-logo-bob 3519ms ease-in-out 1570ms infinite backwards" }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 130, color: CREAM_LT, lineHeight: 0.85, textShadow: `0 8px 0 ${TEAL_INK}` }}>drink</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 200, color: SUNSET_GOLD, lineHeight: 0.85, WebkitTextStroke: `5px ${TEAL_INK}`, textShadow: `0 9px 0 ${TEAL_INK}` }}>OLIPOP</div>
      </div>
    </div>

    {/* drinkolipop.com cream pill */}
    <div className="absolute text-center" style={{ left: 0, right: 0, top: 1240 }}>
      <Reveal enter={[1350, 1810]}>
        <span style={{ display: "inline-block", fontFamily: SANS, fontWeight: 700, fontSize: 50, color: TEAL_INK, background: CREAM_LT, padding: "18px 50px", borderRadius: 100, letterSpacing: 2, border: `6px solid ${TEAL_INK}` }}>
          drinkolipop.com
        </span>
      </Reveal>
    </div>
  </Timegroup>
);
