import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { Reveal } from "@shared/components/Reveal";
import { Fin } from "../components/Fin";
import { camoBg, facetedCamo } from "../components/camo";
import { SCENES, OVERLAP_MS, NEAR_BLACK, WHITE, OFF_WHITE, GREY_MID, GREY_LINE, DISPLAY, HEAVY } from "../constants";

// 8 REAL colorways — model-a is the black/charcoal Geo Camo, then 7 tonal product shots.
// `obj` = objectPosition tuned per shot so the chest/torso (where the colorway reads) is
// framed in both the swatch + the main preview.
const COLORWAYS = [
  { name: "ONYX BLACK", sub: "GEO SEAMLESS", src: "/gymshark-geo-seamless-demo/src/assets/model-a.jpg", obj: "50% 30%" },
  { name: "TEAL", sub: "GEO SEAMLESS", src: "/gymshark-geo-seamless-demo/src/assets/cw-blue.jpg", obj: "50% 42%" },
  { name: "SAGE GREEN", sub: "GEO SEAMLESS", src: "/gymshark-geo-seamless-demo/src/assets/cw-green.jpg", obj: "50% 42%" },
  { name: "EARTH BROWN", sub: "GEO SEAMLESS", src: "/gymshark-geo-seamless-demo/src/assets/cw-brown.jpg", obj: "50% 42%" },
  { name: "BONE WHITE", sub: "GEO SEAMLESS", src: "/gymshark-geo-seamless-demo/src/assets/cw-white.jpg", obj: "50% 44%" },
  { name: "SMOKE BLUE", sub: "SEAMLESS PLAIN", src: "/gymshark-geo-seamless-demo/src/assets/cw-smokeblue.jpg", obj: "50% 42%" },
  { name: "LINEN BROWN", sub: "GEO SEAMLESS", src: "/gymshark-geo-seamless-demo/src/assets/cw-linenbrown.jpg", obj: "50% 42%" },
  { name: "LIGHT GREY", sub: "GEO SEAMLESS", src: "/gymshark-geo-seamless-demo/src/assets/cw-lightgrey.jpg", obj: "50% 42%" },
];

// selection schedule: colorway 0 shows as soon as the preview pops in (530ms local); the
// cycle through all 8 then runs in lockstep with the original CW_SELECT_START/STEP
// (1070ms / 280ms), each computed once from its index — not re-derived per frame.
const STARTS = [530, 1350, 1630, 1910, 2190, 2470, 2750, 3030];
const ENDS = [1350, 1630, 1910, 2190, 2470, 2750, 3030, 3350];
const CROSS = 90; // soft hard-cut crossfade width

/**
 * COLORWAYS — COLORWAY SELECTOR. 3350ms local (nominal 2900ms solo + OVERLAP_MS, abs
 * 13550–16900). A real selector: header "8 COLORWAYS / FIND YOURS", a big main preview
 * showing the selected colorway's real product shot + name, and a row of 8 real
 * product-shot swatches — the selection cycles through all 8, holding on the last.
 *
 * OWN entrance (T5 · RACK SPLIT, the only bespoke transition tied to this beat, and the
 * one carried over unchanged from the original brief): 6 vertical camo slabs rack in from
 * alternating directions with staggered momentum, then clear — the slabs become the
 * swatch columns. No exit of its own — Cta's own entrance (T6, see scenes/Cta.tsx) is
 * what erases this scene.
 */
export const Colorways: React.FC = () => (
  <Timegroup
    mode="fixed"
    duration={`${SCENES.colorways.duration}ms`}
    className="absolute inset-0"
    style={{ background: NEAR_BLACK, transformOrigin: "50% 42%", animation: `cw-punch-in 200ms ${OVERLAP_MS}ms cubic-bezier(0.16,1,0.3,1) both` }}
  >
    <div className="absolute" style={{ inset: -40, ...camoBg, opacity: 0.12, animation: "camo-drift 6000ms linear infinite" }} />
    <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 42%, transparent 34%, rgba(0,0,0,0.78) 94%)" }} />

    {/* header */}
    <div className="absolute" style={{ top: 96, left: 70, right: 70 }}>
      <Reveal enter={[450, 690]} y={28} className="flex items-baseline" style={{ gap: 20 }}>
        <span style={{ color: WHITE, fontFamily: DISPLAY, fontSize: 132, lineHeight: 0.78 }}>8</span>
        <span style={{ color: WHITE, fontFamily: DISPLAY, fontSize: 60, lineHeight: 0.9, letterSpacing: 1 }}>COLORWAYS</span>
      </Reveal>
      <Reveal enter={[590, 830]} y={24} className="flex items-center" style={{ marginTop: 12, gap: 16 }}>
        <div style={{ width: 56, height: 3, background: WHITE }} />
        <span style={{ color: GREY_MID, fontFamily: HEAVY, fontWeight: 800, fontSize: 28, letterSpacing: 8 }}>FIND YOURS</span>
      </Reveal>
    </div>

    {/* main preview panel */}
    <div
      className="absolute overflow-hidden"
      style={{
        left: 130, top: 360, width: 820, height: 940, borderRadius: 6, transformOrigin: "50% 50%",
        opacity: 0, transform: "scale(0.92)", animation: "cw-preview-pop 320ms 530ms cubic-bezier(0.16,1,0.3,1) both",
      }}
    >
      {COLORWAYS.map((c, i) => (
        <Reveal
          key={c.name}
          enter={[STARTS[i], STARTS[i] + CROSS]}
          exit={i < 7 ? [ENDS[i] - CROSS, ENDS[i]] : undefined}
          y={0}
          className="absolute inset-0"
          style={{ transformOrigin: "50% 42%" }}
        >
          <Image src={c.src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: c.obj, filter: "contrast(1.12) brightness(0.7) saturate(0.7)" }} />
        </Reveal>
      ))}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(18,18,20,0.5)", mixBlendMode: "multiply" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 58% 60% at 50% 40%, transparent 30%, rgba(8,8,9,0.78) 92%)" }} />
      <div className="absolute pointer-events-none" style={{ left: 0, right: 0, top: "12%", height: "52%", background: "radial-gradient(ellipse 46% 60% at 50% 42%, rgba(255,255,255,0.16) 0%, transparent 72%)", mixBlendMode: "screen" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(8,8,8,0.5) 0%, transparent 26%, transparent 50%, rgba(8,8,8,0.94) 100%)" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ borderRadius: 6, border: `2px solid rgba(255,255,255,0.6)` }} />
      {[[0, 0, 1, 1], [1, 0, -1, 1], [0, 1, 1, -1], [1, 1, -1, -1]].map((c, i) => (
        <div key={i} className="absolute pointer-events-none" style={{ [c[0] ? "right" : "left"]: -2, [c[1] ? "bottom" : "top"]: -2, width: 44, height: 44, borderTop: c[1] ? "none" : `4px solid ${WHITE}`, borderBottom: c[1] ? `4px solid ${WHITE}` : "none", borderLeft: c[0] ? "none" : `4px solid ${WHITE}`, borderRight: c[0] ? `4px solid ${WHITE}` : "none" } as React.CSSProperties} />
      ))}
      <div className="absolute" style={{ top: 18, left: 18, padding: "6px 12px", background: "rgba(8,8,8,0.6)", border: "1px solid rgba(255,255,255,0.22)" }}>
        {COLORWAYS.map((_, i) => (
          <Reveal key={i} enter={[STARTS[i], STARTS[i] + CROSS]} exit={i < 7 ? [ENDS[i] - CROSS, ENDS[i]] : undefined} y={0} className="absolute inset-0 flex items-center justify-center">
            <span style={{ color: WHITE, fontFamily: HEAVY, fontWeight: 900, fontSize: 18, letterSpacing: 3 }}>{`${String(i + 1).padStart(2, "0")} / 08`}</span>
          </Reveal>
        ))}
        <span style={{ visibility: "hidden", color: WHITE, fontFamily: HEAVY, fontWeight: 900, fontSize: 18, letterSpacing: 3 }}>00 / 08</span>
      </div>
      <div className="absolute" style={{ left: 28, bottom: 26, right: 28 }}>
        <div className="flex items-baseline" style={{ gap: 14, marginBottom: 6 }}>
          <Fin size={0.3} color={WHITE} />
          <span style={{ position: "relative", display: "inline-block" }}>
            {COLORWAYS.map((c, i) => (
              <Reveal key={i} enter={[STARTS[i], STARTS[i] + CROSS]} exit={i < 7 ? [ENDS[i] - CROSS, ENDS[i]] : undefined} y={0} className={i === 0 ? "" : "absolute inset-0"} style={{ color: OFF_WHITE, fontFamily: HEAVY, fontWeight: 800, fontSize: 22, letterSpacing: 6, whiteSpace: "nowrap" }}>
                {c.sub}
              </Reveal>
            ))}
          </span>
        </div>
        <div style={{ position: "relative", height: 68 }}>
          {COLORWAYS.map((c, i) => (
            <Reveal key={i} enter={[STARTS[i], STARTS[i] + CROSS]} exit={i < 7 ? [ENDS[i] - CROSS, ENDS[i]] : undefined} y={0} className="absolute inset-0" style={{ color: WHITE, fontFamily: DISPLAY, fontSize: 72, lineHeight: 0.9 }}>
              {c.name}
            </Reveal>
          ))}
        </div>
      </div>
    </div>

    {/* 8 real swatch thumbnails — cascade in once, staggered by index */}
    <div className="absolute flex items-center" style={{ left: 60, right: 60, bottom: 270, gap: 16 }}>
      <span style={{ color: GREY_MID, fontFamily: HEAVY, fontWeight: 800, fontSize: 16, letterSpacing: 6 }}>THE RANGE</span>
      <div style={{ flex: 1, height: 2, background: "rgba(255,255,255,0.18)" }} />
    </div>
    <div className="absolute grid" style={{ left: 60, right: 60, bottom: 70, gridTemplateColumns: "repeat(8, 1fr)", gap: 12 }}>
      {COLORWAYS.map((c, i) => (
        <div
          key={c.name}
          className="relative overflow-hidden"
          style={{
            height: 172, borderRadius: 8, border: `2px solid ${GREY_LINE}`, opacity: 0, transform: "translateY(36px) scale(0.84)",
            clipPath: "inset(0 0 100% 0)", animation: `cw-swatch-in 240ms ${600 + i * 55}ms cubic-bezier(0.16,1,0.3,1) both`,
          }}
        >
          <Image src={c.src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%", filter: "contrast(1.05) brightness(0.62) saturate(0.45)" }} />
          <div className="absolute left-0 right-0 bottom-0 flex items-center justify-center" style={{ height: 40, background: "rgba(8,8,8,0.84)" }}>
            <span style={{ color: OFF_WHITE, fontFamily: HEAVY, fontWeight: 800, fontSize: 13, letterSpacing: 1, whiteSpace: "nowrap" }}>{c.name}</span>
          </div>
          <Reveal
            enter={[STARTS[i], STARTS[i] + CROSS]}
            exit={i < 7 ? [ENDS[i] - CROSS, ENDS[i]] : undefined}
            y={0}
            className="absolute inset-0 pointer-events-none"
            style={{ border: `4px solid ${WHITE}`, borderRadius: 8, boxShadow: "0 0 26px rgba(255,255,255,0.7), inset 0 0 22px rgba(255,255,255,0.28)" }}
          />
        </div>
      ))}
    </div>

    {/* T5 · RACK SPLIT — 6 vertical slabs rack in with staggered momentum, then clear */}
    <div className="absolute inset-0 pointer-events-none flex" style={{ zIndex: 60 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="relative"
          style={
            {
              flex: 1, height: "100%", ...facetedCamo, borderRight: i < 5 ? "2px solid rgba(255,255,255,0.16)" : "none",
              "--slab-y": `${(i % 2 ? 1 : -1) * 2000}px`,
              animation: `cw-slab-rack-in ${OVERLAP_MS}ms ${i * 40}ms cubic-bezier(0.32,0,0.67,0) both`,
            } as React.CSSProperties
          }
        >
          <div className="absolute top-0 bottom-0 left-0" style={{ width: 4, background: "rgba(255,255,255,0.5)" }} />
        </div>
      ))}
    </div>
  </Timegroup>
);
