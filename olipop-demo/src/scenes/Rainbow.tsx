import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { Reveal } from "@shared/components/Reveal";
import { Sunburst } from "../components/retro";
import { SCENES, CREAM_LT, FL_TROPICAL } from "../constants";

const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";
const SANS = "'Archivo', -apple-system, 'Helvetica Neue', Arial, sans-serif";

// Each flavor's own on-stage window is 540ms; card i's cycle (enter+hold+exit) starts at
// this delay, computed once from its index — never per-frame.
const RAINBOW_CAN0 = 970;
const PER_CAN = 540;

const FLAVORS = [
  { src: "/olipop-demo/src/assets/opt/tropical-can.webp", name: "tropical punch" },
  { src: "/olipop-demo/src/assets/opt/flavor-pineapple.webp", name: "pineapple paradise" },
  { src: "/olipop-demo/src/assets/opt/flavor-gingerale.webp", name: "ginger ale" },
  { src: "/olipop-demo/src/assets/opt/flavor-crispapple.webp", name: "crisp apple" },
  { src: "/olipop-demo/src/assets/opt/flavor-shirley.webp", name: "shirley temple" },
  { src: "/olipop-demo/src/assets/opt/flavor-vintagecola.webp", name: "vintage cola" },
].map((f, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  return {
    ...f,
    t0: RAINBOW_CAN0 + i * PER_CAN,
    gridX: (col - 1) * 264,
    gridY: 70 + row * 360,
    gridRot: (col - 1) * 5,
  };
});

/**
 * FLAVOR RAINBOW — six flavor cans montage one at a time on a single stage (color-block
 * background flips per flavor), then all six collapse into a 3×2 grid under the title.
 * 4850ms local.
 */
export const Rainbow: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.rainbow.duration}ms`} className="absolute inset-0" style={{ overflow: "hidden" }}>
    <div className="absolute inset-0" style={{ background: FL_TROPICAL, animation: `rainbow-bg-cycle ${SCENES.rainbow.duration}ms linear both` }} />
    <div className="absolute" style={{ left: "50%", top: 960, width: 1, height: 1, opacity: 0.4, transform: "translate(-50%,-50%)" }}>
      <div style={{ animation: "spin-ccw 36000ms linear infinite" }}>
        <svg width={2800} height={2800} viewBox="-1400 -1400 2800 2800" style={{ position: "absolute", left: -1400, top: -1400 }}>
          <Sunburst rays={40} colorA="rgba(255,255,255,0.22)" colorB="rgba(255,255,255,0.05)" r={1500} />
        </svg>
      </div>
    </div>

    {/* the 6 flavor cans — one shared stage; each cycles on/off, then all 6 collapse into a grid */}
    {FLAVORS.map((f, i) => (
      <React.Fragment key={f.name}>
        <div
          className="absolute"
          style={
            {
              left: "50%", top: 850, width: 540, height: 710,
              "--grid-x": `${f.gridX}px`, "--grid-y": `${f.gridY}px`, "--grid-rot": `${f.gridRot}deg`,
              // flavor-grid-in deliberately uses `forwards` only (no `backwards`) — with
              // `both` it would win the transform/opacity tug-of-war against flavor-cycle
              // for the entire time *before* its own 3730ms delay too (a later animation's
              // backwards-fill still counts as "in effect"), silently freezing every card
              // at the grid's rest pose from frame 0. `forwards`-only has no effect until
              // its delay elapses, so flavor-cycle plays untouched, then grid-in takes over.
              animation: [
                `flavor-cycle 800ms ${f.t0}ms both`,
                `flavor-grid-in 460ms 3730ms cubic-bezier(0.33,1,0.68,1) forwards`,
              ].join(", "),
            } as React.CSSProperties
          }
        >
          <Image src={f.src} style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 24px 36px rgba(0,0,0,0.32))" }} />
        </div>
        <div
          className="absolute text-center"
          style={{
            left: "50%", top: 1430,
            // same `forwards`-only reasoning as flavor-grid-in above.
            animation: [
              `flavor-label-cycle 550ms ${f.t0 + 90}ms both`,
              "flavor-label-hide 30ms 3730ms forwards",
            ].join(", "),
          }}
        >
          <div style={{ fontFamily: SERIF, fontWeight: 800, fontStyle: "italic", fontSize: 92, color: CREAM_LT, lineHeight: 0.92, textShadow: "0 5px 0 rgba(0,0,0,0.25)" }}>
            {f.name}
          </div>
        </div>
      </React.Fragment>
    ))}

    {/* "find your flavor" final title */}
    <div className="absolute text-center" style={{ left: "50%", top: 300, transform: "translateX(-50%)" }}>
      <Reveal enter={[3930, 4350]} easeIn="out-back" exit="transition" style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: 8, color: CREAM_LT, textTransform: "uppercase" }}>
        13&nbsp;flavors
      </Reveal>
      <Reveal
        enter={[3930, 4350]}
        easeIn="out-back"
        exit="transition"
        style={{ fontFamily: SERIF, fontWeight: 800, fontStyle: "italic", fontSize: 120, color: CREAM_LT, lineHeight: 0.9, marginTop: 14, textShadow: "0 6px 0 rgba(0,0,0,0.2)" }}
      >
        find your<br />flavor
      </Reveal>
    </div>
  </Timegroup>
);
