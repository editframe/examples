import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { Reveal } from "../components/Reveal";
import { Sunburst, Rings } from "../components/retro";
import { SCENES, CANVAS_H, CORAL, CORAL_DEEP, CREAM_LT, SEAFOAM } from "../constants";

const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";
const SANS = "'Archivo', -apple-system, 'Helvetica Neue', Arial, sans-serif";

const H = CANVAS_H;

const CAN_TROPICAL = "/assets/opt/tropical-can.webp";

const trackedCaps: React.CSSProperties = {
  fontFamily: SANS, fontWeight: 700, letterSpacing: 5, color: CREAM_LT, textTransform: "uppercase",
};

// 8 rising bubbles — speed/phase/x computed once at module scope (never per-frame).
// `delay` is negative so CSS starts each bubble's infinite loop partway through its own
// cycle, replacing the old `(ms/speed + i*0.37) % 1` phase math.
const BUBBLES = [
  { x: -300, s: 30, speed: 1700, delay: 0 },
  { x: -160, s: 18, speed: 2060, delay: -762 },
  { x: 220, s: 26, speed: 2420, delay: -1791 },
  { x: 320, s: 40, speed: 2780, delay: -306 },
  { x: -360, s: 16, speed: 3140, delay: -1507 },
  { x: 140, s: 22, speed: 3500, delay: -2975 },
  { x: -60, s: 34, speed: 3860, delay: -849 },
  { x: 380, s: 14, speed: 4220, delay: -2490 },
];

/**
 * HERO — Tropical Punch can push-in on a coral sunburst + rising bubbles.
 * 3850ms local: first 850ms cross-fades in from Hook, last 850ms morphs into the
 * (already-settling) video-well frame as the well beat takes over.
 */
export const Hero: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.hero.duration}ms`} className="absolute inset-0" style={{ background: CORAL, overflow: "hidden" }}>
    {/* coral sunburst — one-shot pop-in wrapper, continuous slow counter-rotation, inner breathing scale */}
    <div className="absolute" style={{ left: "50%", top: 820, width: 1, height: 1, transform: "translate(-50%,-50%)" }}>
      <div style={{ animation: "hero-burst-in 600ms 890ms cubic-bezier(0.33,1,0.68,1) both" }}>
        <div style={{ animation: "spin-ccw 40000ms linear infinite" }}>
          <div style={{ animation: "hero-burst-breathe 5655ms ease-in-out infinite" }}>
            <svg width={2800} height={2800} viewBox="-1400 -1400 2800 2800" style={{ position: "absolute", left: -1400, top: -1400 }}>
              <Sunburst rays={32} colorA={CORAL_DEEP} colorB={CORAL} r={1500} />
            </svg>
          </div>
        </div>
      </div>
    </div>

    {/* concentric rings — one-shot pop-in wrapper, continuous pulse */}
    <div className="absolute" style={{ left: "50%", top: 820, width: 1, height: 1, transform: "translate(-50%,-50%)" }}>
      <div style={{ animation: "hero-rings-in 500ms 2250ms cubic-bezier(0.33,1,0.68,1) both" }}>
        <div style={{ animation: "hero-rings-pulse 4398ms ease-in-out infinite" }}>
          <svg width={1700} height={1700} viewBox="-850 -850 1700 1700" style={{ position: "absolute", left: -850, top: -850 }}>
            <Rings count={6} gap={86} stroke={CREAM_LT} sw={5} start={300} />
          </svg>
        </div>
      </div>
    </div>

    {/* rising bubbles */}
    <div className="absolute" style={{ left: "50%", top: 0, width: 1, height: H }}>
      {BUBBLES.map((b, i) => (
        <div
          key={i}
          className="absolute"
          style={
            {
              left: 0, top: 0, width: b.s, height: b.s, borderRadius: "50%",
              background: `radial-gradient(circle at 32% 30%, rgba(255,255,255,0.9), ${CREAM_LT} 70%)`,
              boxShadow: `0 0 ${b.s * 0.5}px ${CREAM_LT}66`,
              "--bubble-x": `${b.x}px`,
              animation: `bubble-rise ${b.speed}ms linear ${b.delay}ms infinite`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>

    {/* grounded shadow — enter with the can push, then a subtle continuous breathe */}
    <div
      className="absolute"
      style={{
        left: "50%", top: 1330, width: 460, height: 70, marginLeft: -230, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(15,40,36,0.55), transparent 70%)",
        animation: "hero-shadow-in 720ms 1030ms cubic-bezier(0.33,1,0.68,1) both",
      }}
    >
      <div className="absolute inset-0" style={{ animation: "hero-shadow-breathe 4775ms ease-in-out 1750ms infinite backwards" }} />
    </div>

    {/* HERO CAN — push-in wrapper, continuous weightless bob starting exactly as the push settles */}
    <div className="absolute" style={{ left: "50%", top: 760, width: 540, height: 710, transform: "translate(-50%,-50%)" }}>
      <div style={{ animation: "hero-can-push-in 720ms 1030ms cubic-bezier(0.33,1,0.68,1) both" }}>
        <div style={{ animation: "hero-can-bob 4775ms ease-in-out 1750ms infinite backwards" }}>
          <Image src={CAN_TROPICAL} style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 24px 40px rgba(15,40,36,0.4))" }} />
          {/* condensation specular sweep — one-time fade-in wrapping a continuous sweep */}
          <div style={{ position: "absolute", left: 120, top: 60, width: 90, height: 600, animation: "hero-spec-fade-in 300ms 1750ms both" }}>
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
                filter: "blur(8px)", mixBlendMode: "screen",
                animation: "hero-spec-sweep 2800ms ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>
    </div>

    {/* copy */}
    <div className="absolute text-center" style={{ left: "50%", top: 1380, transform: "translateX(-50%)", whiteSpace: "nowrap" }}>
      <Reveal enter={[1610, 2170]} easeIn="out-back" style={{ fontFamily: SERIF, fontWeight: 800, fontStyle: "italic", fontSize: 132, color: CREAM_LT, lineHeight: 0.9, textShadow: "0 6px 0 rgba(199,58,40,0.5)" }}>
        tropical<br />punch
      </Reveal>
    </div>
    <div className="absolute" style={{ left: "50%", top: 1700, transform: "translateX(-50%)", whiteSpace: "nowrap" }}>
      <Reveal enter={[2010, 2430]} style={{ ...trackedCaps, fontSize: 30 }}>
        prebiotics&nbsp;·&nbsp;botanicals&nbsp;·&nbsp;plant&nbsp;fiber
      </Reveal>
    </div>

    {/* seafoam wipe-out — aligned to the scene boundary's shared crossfade window */}
    <div
      className="absolute inset-0"
      style={{
        background: SEAFOAM, zIndex: 90, transform: "translateX(100%)",
        animation: "hero-wipe-out var(--ef-transition-duration) var(--ef-transition-out-start) cubic-bezier(0.45,0,0.55,1) both",
      }}
    />
  </Timegroup>
);
