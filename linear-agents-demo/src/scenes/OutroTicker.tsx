import React from "react";
import { Timegroup } from "@editframe/react";
import { SCENES, FONT } from "../constants";

const WORDS = ["Coding", "Triage", "Planning"];
const SLOT_HEIGHT = 100;

/**
 * OUTRO TICKER — slot-machine word swap: "Agents for Coding → Triage → Planning".
 * 1920ms local. The three words are pre-rendered stacked inside an `overflow:hidden`
 * window; the stack's own `translateY` slides up one slot at each transition — this
 * replaces the original's `textContent`-swapping (CSS can't change text content, but a
 * pre-rendered stack + a single sliding transform reproduces the same slot-machine look
 * with no per-frame JS at all). The secondary "motion-blur" `scaleY` stretch mid-transition
 * from the original is dropped as a minor simplification — the slide + fade is preserved
 * exactly, the extra blur embellishment isn't.
 */
export const OutroTicker: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.outroTicker.duration}ms`} className="absolute inset-0 flex items-center justify-center">
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      <span style={{ color: "#FFFFFF", fontSize: 84, fontWeight: 500, fontFamily: FONT, letterSpacing: "-2px" }}>Agents for&nbsp;</span>
      <div style={{ position: "relative", height: SLOT_HEIGHT, minWidth: 400, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute", left: 0, top: 0,
            animation: [
              "ticker-fade-in 200ms 0ms cubic-bezier(0.33,1,0.68,1) both",
              "ticker-slide-1 167ms 370ms cubic-bezier(0.45,0,0.55,1) both",
              "ticker-slide-2 200ms 1070ms cubic-bezier(0.45,0,0.55,1) both",
              "ticker-fade-out 150ms 1770ms cubic-bezier(0.32,0,0.67,0) both",
            ].join(", "),
          }}
        >
          {WORDS.map((word) => (
            <span
              key={word}
              style={{
                display: "block", height: SLOT_HEIGHT, lineHeight: `${SLOT_HEIGHT}px`,
                color: "#FFFFFF", fontSize: 84, fontWeight: 500, fontFamily: FONT,
                letterSpacing: "-2px", whiteSpace: "nowrap",
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  </Timegroup>
);
