import React, { useEffect, useRef } from "react";
import { Timegroup, Image } from "@editframe/react";
import { SCENES, W, H, BLACK, WHITE, GREY, SILVER, SILVER_GRAD, MONT, PRICE } from "../constants";
import { RegMark } from "../components/RegMark";
import { Reveal } from "@shared/components/Reveal";
import { clamp, lerp, track, easeOutCubic, easeInOutQuad, outBack } from "@shared/utils/animation";

const TEX_PAPER = "/fashionnova-the-edit-demo/src/assets/tex-paper.png";

interface TimegroupElement extends HTMLElement {
  initializer?: (instance: TimegroupElement) => (() => void) | void;
  addFrameTask: (callback: (info: { ownCurrentTimeMs: number }) => void) => () => void;
}

const CARD_W = 360;
const CARD_H = 540;
type Look = { src: string; no: string; name: string; objPos: string; off: string };
const LOOKS: Look[] = [
  { src: "/fashionnova-the-edit-demo/src/assets/dress-2.jpg", no: "01", name: "MIDNIGHT MAXI", objPos: "50% 18%", off: "50" },
  { src: "/fashionnova-the-edit-demo/src/assets/ed01.jpg", no: "02", name: "PLUM BODYCON", objPos: "50% 30%", off: "60" },
  { src: "/fashionnova-the-edit-demo/src/assets/ed11.jpg", no: "03", name: "IVORY GOWN", objPos: "50% 22%", off: "40" },
  { src: "/fashionnova-the-edit-demo/src/assets/ed07.jpg", no: "04", name: "LUXE BLAZER", objPos: "50% 38%", off: "70" },
  { src: "/fashionnova-the-edit-demo/src/assets/ed10.jpg", no: "05", name: "CREAM COWL", objPos: "50% 40%", off: "55" },
  { src: "/fashionnova-the-edit-demo/src/assets/dress-3.jpg", no: "06", name: "NOIR EDITION", objPos: "50% 20%", off: "65" },
];
// fly-in origins (offscreen), relative to scene centre (W/2, H/2)
const FLYIN = [
  { x: -820, y: -1100, r: -28 }, { x: 820, y: -1180, r: 26 },
  { x: -900, y: 1180, r: 22 }, { x: 900, y: 1120, r: -24 },
  { x: -1050, y: -120, r: -14 }, { x: 1050, y: 120, r: 16 },
];
const DECK = [
  { x: -16, y: -22, r: -7 }, { x: 14, y: -10, r: 5 }, { x: -8, y: 4, r: -3 },
  { x: 10, y: 16, r: 4 }, { x: -4, y: 28, r: -2 }, { x: 6, y: 40, r: 6 },
];
const FAN = [
  { x: -360, y: 70, r: -34 }, { x: -212, y: 4, r: -20 }, { x: -70, y: -28, r: -7 },
  { x: 70, y: -28, r: 7 }, { x: 212, y: 4, r: 20 }, { x: 360, y: 70, r: 34 },
];
const GRID = [
  { x: -250, y: -470, r: 0 }, { x: 250, y: -470, r: 0 },
  { x: -250, y: 0, r: 0 }, { x: 250, y: 0, r: 0 },
  { x: -250, y: 470, r: 0 }, { x: 250, y: 470, r: 0 },
];

// Local clock cues (already shifted +OVERLAP_MS from the old master-ms design, see
// constants.ts SCENES doc). Cards start flying in just before this scene's own t=0 —
// negative-looking in the old master clock, but here it's simply an early delay so the
// deck is already moving the instant the cut lands (no dead frame).
const FLY0 = 40; // cards fly in & stack
const FAN0 = 1800; // deck → fan
const DEAL0 = 3200; // fan → grid
const STAMP0 = 4000; // %OFF chips slam onto the grid cards

/**
 * FAN → THE EDIT — a fanned card-deck flies in, "THE EDIT" title rises while fanned,
 * then the deck deals into a gridded layout with header/rule/footer chrome.
 * 5800ms local: first 300ms is the tail of SwingRack's crossfade.
 *
 * The 6-card fly-in → fan → deal choreography is this composition's ONE deliberate
 * `addFrameTask` exception: each card chains three overlapping lerps (deck position →
 * fan position → grid position) across three DIFFERENT per-index stagger rates
 * (i*90 for fly/deal, i*40 for fan) plus a z-depth term and a %OFF-chip slam — that
 * combination has no shared closed-form CSS keyframe without either duplicating six
 * near-identical `@keyframes` blocks (one per card, since the stagger rates diverge) or
 * losing the per-phase stagger nuance. It stays imperative, but scoped to exactly this
 * scene — nothing else here uses a frame task.
 */
export const FanToEdit: React.FC = () => {
  const tgRef = useRef<TimegroupElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stampRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const tg = tgRef.current;
    if (!tg) return;
    tg.initializer = (instance) =>
      instance.addFrameTask((info) => {
        const ms = info.ownCurrentTimeMs;
        for (let i = 0; i < 6; i++) {
          const card = cardRefs.current[i];
          if (!card) continue;
          const flyP = track(ms, FLY0 + i * 90, FLY0 + 600 + i * 90, easeOutCubic);
          const fanP = track(ms, FAN0 + i * 40, FAN0 + 700 + i * 40, easeInOutQuad);
          const dealP = track(ms, DEAL0 + i * 90, DEAL0 + 700 + i * 90, outBack(1.7));
          const from = FLYIN[i], deck = DECK[i], fan = FAN[i], grid = GRID[i];
          let x = lerp(from.x, deck.x, flyP);
          let y = lerp(from.y, deck.y, flyP);
          let r = lerp(from.r, deck.r, flyP);
          x = lerp(x, fan.x, fanP); y = lerp(y, fan.y, fanP); r = lerp(r, fan.r, fanP);
          x = lerp(x, grid.x, dealP); y = lerp(y, grid.y, dealP); r = lerp(r, grid.r, dealP);
          const deckZ = lerp(0, (5 - i) * 26, flyP) * (1 - fanP) * (1 - dealP);
          const scale = lerp(1, 0.8, dealP);
          card.style.opacity = flyP > 0.001 ? "1" : "0";
          card.style.transform = `translate3d(${x}px, ${y}px, ${deckZ}px) rotate(${r}deg) scale(${scale})`;
          const tag = tagRefs.current[i];
          if (tag) {
            const swing = Math.sin((ms + i * 230) / 360) * (3 + 3 * dealP);
            tag.style.transform = `rotate(${swing}deg)`;
          }
          const stamp = stampRefs.current[i];
          if (stamp) {
            const sp = track(ms, STAMP0 + i * 90, STAMP0 + 300 + i * 90, outBack(1.7));
            stamp.style.opacity = String(clamp(sp));
            stamp.style.transform = `rotate(-9deg) scale(${lerp(1.5, 1, clamp(sp))})`;
          }
        }
      });
    return () => {
      tg.initializer = undefined;
    };
  }, []);

  return (
    <Timegroup ref={tgRef} mode="fixed" duration={`${SCENES.fanToEdit.duration}ms`} className="absolute inset-0" style={{ fontFamily: MONT, color: BLACK, background: "#0d0d0f" }}>
      <Image src={TEX_PAPER} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.07, mixBlendMode: "screen" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(120% 90% at 50% 42%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)" }} />
      <RegMark style={{ top: 40, left: 40 }} />
      <RegMark style={{ top: 40, right: 40 }} />

      {/* stage — ambient breathe/drift, CSS infinite (was a per-frame double-sine wobble) */}
      <div className="absolute inset-0" style={{ perspective: 1700, animation: "fan-stage-drift 4800ms ease-in-out infinite alternate" }}>
        <div className="absolute inset-0" style={{ animation: "fan-stage-breathe 3200ms ease-in-out infinite alternate" }}>
          {/* FAN title */}
          <Reveal enter={[FAN0 + 100, FAN0 + 600]} exit={[DEAL0 - 200, DEAL0 + 150]} easeIn="out-back" easeOut="in-cubic" y={0} className="absolute left-0 right-0 text-center" style={{ top: 250 }}>
            <div style={{ fontWeight: 900, fontSize: 150, letterSpacing: "-0.02em", color: WHITE, textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>THE EDIT</div>
          </Reveal>
          <Reveal enter={[FAN0 + 400, FAN0 + 800]} exit={[DEAL0 - 200, DEAL0 + 150]} y={0} className="absolute left-0 right-0 text-center" style={{ top: 430, fontWeight: 700, fontSize: 34, letterSpacing: "0.34em", color: SILVER }}>
            SIX LOOKS · ONE DROP
          </Reveal>

          {/* THE EDIT grid chrome */}
          <Reveal enter={[DEAL0 + 100, DEAL0 + 600]} exit="transition" className="absolute flex justify-between items-center" style={{ left: 70, right: 70, top: 110 }}>
            <div style={{ fontWeight: 900, fontSize: 64, letterSpacing: "0.02em", color: WHITE }}>THE EDIT</div>
            <div style={{ fontWeight: 700, fontSize: 28, letterSpacing: "0.24em", color: WHITE }}>VOL.01</div>
          </Reveal>
          <div
            className="absolute"
            style={{
              left: 70, right: 70, top: 190, height: 4, background: WHITE, transformOrigin: "left center",
              animation: [
                "fan-rule-in 500ms " + (DEAL0 + 100) + "ms cubic-bezier(0.33,1,0.68,1) both",
                "reveal-out var(--ef-transition-duration) var(--ef-transition-out-start) cubic-bezier(0.32,0,0.67,0) forwards",
              ].join(", "),
            }}
          />
          <Reveal enter={[DEAL0 + 100, DEAL0 + 600]} exit="transition" className="absolute flex justify-between items-center" style={{ left: 70, right: 70, bottom: 96 }}>
            <div style={{ fontWeight: 700, fontSize: 26, letterSpacing: "0.22em", color: WHITE }}>FASHIONNOVA.COM</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 40 }}>
              {[3, 2, 5, 2, 3, 6, 2, 4, 2, 5, 3, 2, 6, 3, 2].map((w, k) => (
                <div key={k} style={{ width: w, height: 40, background: WHITE }} />
              ))}
            </div>
            <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: "0.1em", color: WHITE }}>P.01</div>
          </Reveal>

          {/* THE CARDS — driven by the addFrameTask above */}
          {LOOKS.map((look, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              style={{
                position: "absolute", left: W / 2 - CARD_W / 2, top: H / 2 - CARD_H / 2,
                width: CARD_W, height: CARD_H, background: WHITE, padding: 14, paddingBottom: 46,
                boxShadow: "0 30px 60px rgba(0,0,0,0.45), 0 4px 14px rgba(0,0,0,0.3)",
                willChange: "transform, opacity", transformStyle: "preserve-3d", opacity: 0,
                zIndex: 20 + (6 - i),
              }}
            >
              <div className="relative w-full h-full overflow-hidden" style={{ background: "#F6F4F1" }}>
                <Image src={look.src} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: look.objPos, display: "block" }} />
                <div style={{ position: "absolute", left: 0, top: 0, background: BLACK, color: WHITE, fontWeight: 900, fontSize: 30, padding: "6px 14px", letterSpacing: "0.04em" }}>{look.no}</div>
                <div
                  ref={(el) => { stampRefs.current[i] = el; }}
                  style={{ position: "absolute", right: 10, top: 12, background: SILVER_GRAD, color: BLACK, fontWeight: 900, fontSize: 26, padding: "6px 10px", lineHeight: 0.95, textAlign: "center", border: `2px solid ${BLACK}`, opacity: 0, boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}
                >{look.off}%<br />OFF</div>
              </div>
              <div className="absolute flex justify-between items-center" style={{ left: 14, right: 14, bottom: 12 }}>
                <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "0.14em", color: BLACK }}>{look.name}</span>
                <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "0.06em", color: GREY }}>{PRICE}</span>
              </div>
              <div
                ref={(el) => { tagRefs.current[i] = el; }}
                style={{ position: "absolute", right: -6, top: 8, transformOrigin: "top center", width: 30, height: 60, pointerEvents: "none" }}
              >
                <div style={{ width: 2, height: 16, background: BLACK, margin: "0 auto" }} />
                <div style={{ width: 30, height: 44, background: BLACK, color: SILVER, fontWeight: 900, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 3 }}>NEW</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Timegroup>
  );
};
