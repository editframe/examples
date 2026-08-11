import React from "react";
import { Timegroup } from "@editframe/react";
import { Reveal } from "@shared/components/Reveal";
import { SCENES, GEOGRAPH, INK, LINE, STONE } from "../constants";

const eyebrow: React.CSSProperties = {
  fontFamily: GEOGRAPH, fontWeight: 500, textTransform: "uppercase",
  color: STONE, letterSpacing: "3px",
};

/**
 * HOOK — 0 → 2000ms local (2000ms total; the last 600ms cross-fades into Hero).
 * Wordmark "allbirds" float-in on oat, then a hairline rule, then the subhead.
 */
export const Hook: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.hook.duration}ms`} className="absolute inset-0">
    <div className="absolute left-0 right-0 text-center" style={{ top: "44%" }}>
      <div
        style={{
          fontFamily: GEOGRAPH, fontWeight: 500, fontSize: 96, color: INK, lineHeight: 1,
          animation: [
            "hook-mark-in 780ms 120ms cubic-bezier(0.33,1,0.68,1) both",
            "hook-mark-out var(--ef-transition-duration) var(--ef-transition-out-start) cubic-bezier(0.32,0,0.67,0) forwards",
          ].join(", "),
        }}
      >
        allbirds
      </div>
      <div
        style={{
          width: 64, height: 1, background: LINE, margin: "30px auto 0", transformOrigin: "center",
          animation: [
            "hook-rule-in 740ms 560ms cubic-bezier(0.33,1,0.68,1) both",
            "reveal-out var(--ef-transition-duration) var(--ef-transition-out-start) cubic-bezier(0.32,0,0.67,0) forwards",
          ].join(", "),
        }}
      />
      <Reveal enter={[760, 1500]} exit="transition" easeOut="in-cubic" style={{ ...eyebrow, fontSize: 19, marginTop: 26 }}>
        Effortless by Nature
      </Reveal>
    </div>
  </Timegroup>
);
