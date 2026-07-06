import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { Reveal } from "../components/Reveal";
import { Sunburst, Star } from "../components/retro";
import { SCENES, CANVAS_W, CANVAS_H, WELL_X, WELL_Y, WELL_W, WELL_H, WELL_R, SEAFOAM, SEAFOAM_LT, TEAL_INK, TEAL_DEEP, CREAM_LT, CORAL, SUNSET_GOLD } from "../constants";

const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";
const SANS = "'Archivo', -apple-system, 'Helvetica Neue', Arial, sans-serif";

const W = CANVAS_W;
const H = CANVAS_H;

const VID_POSTER = "/assets/opt/vid-poster.jpg";

const trackedCaps: React.CSSProperties = {
  fontFamily: SANS, fontWeight: 700, letterSpacing: 3, color: CREAM_LT, textTransform: "uppercase",
};

/**
 * VIDEO WELL — a chunky retro-TV badge holds perfectly stationary around the fixed well
 * (x=180 y=640 w=720 h=720 r=36 — matches `composite-well.sh`, which overlays the real
 * OLIPOP retro-animation clip into this exact rect during this beat).
 * 4850ms local: frame settles in over the first 410ms (finishing well inside the shared
 * 850ms crossfade with Hero), holds perfectly still through local 410–4000, then eases
 * back out over the closing 850ms shared with the Swap beat.
 */
export const Well: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.well.duration}ms`} className="absolute inset-0" style={{ background: SEAFOAM, overflow: "hidden" }}>
    {/* ambient spinning sunburst behind everything (not the well itself) */}
    <div className="absolute" style={{ left: "50%", top: 1000, width: 1, height: 1, opacity: 0.5, transform: "translate(-50%,-50%)" }}>
      <div style={{ animation: "spin-cw 60000ms linear infinite" }}>
        <svg width={2800} height={2800} viewBox="-1400 -1400 2800 2800" style={{ position: "absolute", left: -1400, top: -1400 }}>
          <Sunburst rays={36} colorA={SEAFOAM_LT} colorB="#A9D9D4" r={1500} />
        </svg>
      </div>
    </div>

    {/* top editorial copy */}
    <div className="absolute text-center" style={{ left: 0, right: 0, top: 250 }}>
      <Reveal enter={[1010, 1430]} y={-24} style={{ fontFamily: SERIF, fontWeight: 800, fontStyle: "italic", fontSize: 104, color: TEAL_INK, lineHeight: 0.92 }}>
        a new kind<br />of soda
      </Reveal>
    </div>

    {/* ─── THE WELL FRAME GROUP — settles in, holds stationary, eases back out ─── */}
    <div
      className="absolute"
      style={{
        left: 0, top: 0, width: W, height: H,
        // well-frame-out deliberately uses `forwards` only (no `backwards`) — with `both` it
        // would win the transform/opacity contest against well-frame-in for the entire time
        // *before* its own late delay too (a later animation's backwards-fill still counts as
        // "in effect"), which would freeze the frame at its exit pose from frame 0 instead of
        // ever settling in. `forwards`-only has no effect until its own delay elapses.
        animation: [
          "well-frame-in 410ms 0ms cubic-bezier(0.33,1,0.68,1) both",
          "well-frame-out var(--ef-transition-duration) var(--ef-transition-out-start) cubic-bezier(0.32,0,0.67,0) forwards",
        ].join(", "),
      }}
    >
      <div style={{ position: "absolute", left: WELL_X - 34, top: WELL_Y - 34, width: WELL_W + 68, height: WELL_H + 68, borderRadius: WELL_R + 30, background: CREAM_LT, boxShadow: "0 40px 80px rgba(15,40,36,0.45)" }} />
      <div style={{ position: "absolute", left: WELL_X - 16, top: WELL_Y - 16, width: WELL_W + 32, height: WELL_H + 32, borderRadius: WELL_R + 14, background: CORAL, border: `6px solid ${TEAL_INK}` }} />
      {/* ── THE EXACT WELL: x=180 y=640 w=720 h=720 r=36 ── */}
      <div style={{ position: "absolute", left: WELL_X, top: WELL_Y, width: WELL_W, height: WELL_H, borderRadius: WELL_R, overflow: "hidden", background: TEAL_DEEP, border: `4px solid ${TEAL_INK}` }}>
        <Image src={VID_POSTER} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 4px)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 40%)" }} />
        <div className="absolute flex items-center justify-center" style={{ left: "50%", top: "50%", width: 108, height: 108, marginLeft: -54, marginTop: -54, borderRadius: "50%", background: "rgba(243,236,221,0.92)", boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }}>
          <div style={{ width: 0, height: 0, marginLeft: 10, borderTop: "26px solid transparent", borderBottom: "26px solid transparent", borderLeft: `40px solid ${CORAL}` }} />
        </div>
      </div>
      {/* STAR top-left of the badge — continuous slow spin + inner twinkle pulse */}
      <div className="absolute" style={{ left: WELL_X - 54, top: WELL_Y - 54, zIndex: 2, animation: "spin-cw 4320ms linear infinite" }}>
        <div style={{ animation: "well-star-twinkle 1131ms ease-in-out infinite alternate" }}>
          <Star size={120} fill={SUNSET_GOLD} />
        </div>
      </div>
      {/* NOW PLAYING pill top-right of the badge — blinking REC dot */}
      <div className="absolute flex items-center" style={{ left: WELL_X + WELL_W - 230, top: WELL_Y - 56, gap: 12, background: TEAL_INK, padding: "12px 22px", borderRadius: 100, border: `4px solid ${CREAM_LT}`, zIndex: 2 }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: CORAL, animation: "rec-blink 1000ms steps(1,end) infinite" }} />
        <div style={trackedCaps}>now&nbsp;playing</div>
      </div>
    </div>

    {/* bottom editorial copy */}
    <div className="absolute text-center" style={{ left: 0, right: 0, top: 1500 }}>
      <Reveal enter={[1210, 1630]} y={24} style={{ fontFamily: SERIF, fontWeight: 800, fontStyle: "italic", fontSize: 88, color: CORAL, lineHeight: 0.92 }}>
        tropical punch
      </Reveal>
      <div style={{ marginTop: 18 }}>
        <Reveal enter={[1210, 1630]} y={24} style={{ ...trackedCaps, color: TEAL_INK, fontSize: 26 }}>
          prebiotics&nbsp;·&nbsp;botanicals&nbsp;·&nbsp;fiber
        </Reveal>
      </div>
    </div>
  </Timegroup>
);
