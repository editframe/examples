import React from "react";
import { Timegroup } from "@editframe/react";
import { Sunburst } from "../components/retro";
import { SCENES, SEAFOAM, SEAFOAM_LT, CREAM, CREAM_LT, TEAL_INK, CORAL } from "../constants";

const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";
const SANS = "'Archivo', -apple-system, 'Helvetica Neue', Arial, sans-serif";

const trackedCaps = (color: string, size: number, ls: number): React.CSSProperties => ({
  fontFamily: SANS, fontWeight: 700, fontSize: size, letterSpacing: ls, color, textTransform: "uppercase",
});

/**
 * THE SWAP — the sugar-swap health story. 4050ms local: the first 950ms is silent
 * hold-over from Well's own crossfade tail, so nothing here animates until local 950ms
 * (matching the original's SWAP_IN offset). Everything fades out together over the
 * closing 850ms shared with the Rainbow beat.
 */
export const Swap: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.swap.duration}ms`} className="absolute inset-0" style={{ background: CREAM, overflow: "hidden" }}>
    <div style={{ animation: "swap-exit-fade var(--ef-transition-duration) var(--ef-transition-out-start) both" }}>
      <div className="absolute" style={{ left: "50%", top: 960, width: 1, height: 1, transform: "translate(-50%,-50%)", animation: "swap-burst-fade-in 400ms 950ms both" }}>
        <div style={{ animation: "spin-cw 51429ms linear infinite" }}>
          <svg width={2800} height={2800} viewBox="-1400 -1400 2800 2800" style={{ position: "absolute", left: -1400, top: -1400 }}>
            <Sunburst rays={28} colorA={SEAFOAM_LT} colorB={CREAM_LT} r={1500} />
          </svg>
        </div>
      </div>

      {/* title — translateX(-50%) centering is baked into the swap-title-in keyframe itself
          (a static `transform` here would be replaced entirely while the animation runs) */}
      <div className="absolute text-center" style={{ left: "50%", top: 170, animation: "swap-title-in 380ms 950ms cubic-bezier(0.33,1,0.68,1) both" }}>
        <div style={trackedCaps(CORAL, 34, 8)}>the&nbsp;swap</div>
        <div style={{ fontFamily: SERIF, fontWeight: 800, fontStyle: "italic", fontSize: 104, color: TEAL_INK, lineHeight: 0.94, marginTop: 12 }}>
          ditch the<br />sugar bomb
        </div>
      </div>

      {/* OLD soda card — slides in, then dims + desaturates once the strike-through lands */}
      <div
        className="absolute"
        style={{
          left: 90, top: 580, width: 900,
          animation: [
            "swap-old-in 460ms 1150ms cubic-bezier(0.34,1.56,0.64,1) both",
            "swap-old-dim 500ms 1970ms linear both",
          ].join(", "),
        }}
      >
        <div style={{ background: "#3A3A3A", borderRadius: 28, padding: "40px 44px", boxShadow: "0 18px 40px rgba(0,0,0,0.25)", position: "relative", border: "4px solid #2A2A2A" }}>
          <div style={trackedCaps("#C9C9C9", 28, 5)}>regular&nbsp;soda</div>
          <div className="relative flex items-baseline" style={{ gap: 8, marginTop: 6 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 168, color: "#FFFFFF", lineHeight: 0.9 }}>39g</div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: "#FF6B5A" }}>sugar</div>
            <svg className="absolute" style={{ left: -10, top: 80, overflow: "visible" }} width={420} height={20}>
              <line
                x1={0} y1={10} x2={400} y2={10} stroke="#FF3B2F" strokeWidth={16} strokeLinecap="round"
                strokeDasharray={420} strokeDashoffset={420}
                style={{ animation: "strike-draw 340ms 1770ms cubic-bezier(0.33,1,0.68,1) both" }}
              />
            </svg>
          </div>
          <div style={trackedCaps("#9A9A9A", 24, 3)}>spikes&nbsp;·&nbsp;crashes&nbsp;·&nbsp;no&nbsp;fiber</div>
        </div>
      </div>

      {/* vs arrow — one-shot pop wrapping a continuous pulse */}
      <div className="absolute" style={{ left: "50%", top: 935, width: 1, height: 1, animation: "swap-arrow-in 360ms 2110ms cubic-bezier(0.34,1.56,0.64,1) both" }}>
        <div
          className="flex items-center justify-center"
          style={{
            width: 150, height: 150, marginLeft: -75, marginTop: -75, borderRadius: "50%", background: CORAL,
            boxShadow: "0 12px 30px rgba(232,80,58,0.5)", border: `6px solid ${CREAM_LT}`,
            animation: "swap-arrow-pulse 1131ms ease-in-out infinite alternate",
          }}
        >
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontStyle: "italic", fontSize: 64, color: CREAM_LT }}>vs</div>
        </div>
      </div>

      {/* NEW OLIPOP card — slams in from the right */}
      <div className="absolute" style={{ left: 90, top: 1040, width: 900, animation: "swap-new-in 420ms 2310ms cubic-bezier(0.34,1.56,0.64,1) both" }}>
        <div style={{ background: TEAL_INK, borderRadius: 28, padding: "40px 44px", boxShadow: "0 18px 40px rgba(20,67,61,0.4)", position: "relative", border: `4px solid ${CORAL}` }}>
          <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 56, letterSpacing: 56 * 0.02, color: CORAL, lineHeight: 0.9, WebkitTextStroke: `${56 * 0.012}px ${CORAL}` }}>
            OLIPOP
          </div>
          <div className="flex" style={{ gap: 18, marginTop: 24 }}>
            <div className="flex-1 text-center" style={{ background: CREAM_LT, borderRadius: 18, padding: "20px 0", animation: "stat-chip-in 320ms 2610ms cubic-bezier(0.34,1.56,0.64,1) both" }}>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: CORAL, lineHeight: 0.9 }}>4g</div>
              <div style={trackedCaps(TEAL_INK, 22, 3)}>sugar</div>
            </div>
            <div className="flex-1 text-center" style={{ background: CORAL, borderRadius: 18, padding: "20px 0", animation: "stat-chip-in 320ms 2810ms cubic-bezier(0.34,1.56,0.64,1) both" }}>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: CREAM_LT, lineHeight: 0.9 }}>9g</div>
              <div style={trackedCaps(CREAM_LT, 22, 3)}>fiber</div>
            </div>
            <div className="flex flex-col justify-center text-center" style={{ flex: 1.3, background: SEAFOAM, borderRadius: 18, padding: "20px 6px", animation: "stat-chip-in 320ms 3010ms cubic-bezier(0.34,1.56,0.64,1) both" }}>
              <div style={{ fontFamily: SERIF, fontWeight: 800, fontStyle: "italic", fontSize: 46, color: TEAL_INK, lineHeight: 0.95 }}>gut-<br />healthy</div>
              <div style={trackedCaps(TEAL_INK, 18, 2)}>prebiotics</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Timegroup>
);
