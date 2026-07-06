import React from "react";
import { Timegroup } from "@editframe/react";
import { Reveal } from "../components/Reveal";
import { SCENES, WARM_WHITE, OAT, ESPRESSO, BROWN, SOFT_PINK, SERIF, SANS } from "../constants";

/**
 * HOOK — 0 → 1950ms local (the last 200ms cross-fades into Hero).
 * Oat-cream ground; the lowercase "rhode" wordmark is already on-screen (partially
 * resolved) at frame 0 — no blank lead — then draws in fully, followed by a hairline
 * rule, "limited edition", and "summer '26".
 */
export const Hook: React.FC = () => (
  <Timegroup
    mode="fixed"
    duration={`${SCENES.hook.duration}ms`}
    className="absolute inset-0"
    style={{ background: `radial-gradient(130% 100% at 50% 38%, ${WARM_WHITE} 0%, ${OAT} 70%)` }}
  >
    <div style={{ position: "absolute", top: 70, left: 70, width: 54, height: 54, borderLeft: `2px solid ${BROWN}55`, borderTop: `2px solid ${BROWN}55` }} />
    <div style={{ position: "absolute", top: 70, right: 70, width: 54, height: 54, borderRight: `2px solid ${BROWN}55`, borderTop: `2px solid ${BROWN}55` }} />
    <div style={{ position: "absolute", bottom: 70, left: 70, width: 54, height: 54, borderLeft: `2px solid ${BROWN}55`, borderBottom: `2px solid ${BROWN}55` }} />
    <div style={{ position: "absolute", bottom: 70, right: 70, width: 54, height: 54, borderRight: `2px solid ${BROWN}55`, borderBottom: `2px solid ${BROWN}55` }} />

    <div className="absolute left-0 right-0 text-center" style={{ top: 770 }}>
      <Reveal
        enter={[350, 850]}
        exit="transition"
        y={16}
        exitY={-24}
        style={{ fontFamily: SANS, fontWeight: 500, fontSize: 30, letterSpacing: 12, textTransform: "uppercase", color: BROWN }}
      >
        limited edition
      </Reveal>
    </div>

    {/* text-align centers horizontally; the keyframes below carry their own translateY(-50%)
        so this vertically re-centers on "top: 50%" without needing a translateX */}
    <div
      className="absolute left-0 right-0 text-center"
      style={{
        top: "50%",
        fontFamily: SANS,
        fontWeight: 300,
        fontSize: 196,
        color: ESPRESSO,
        lineHeight: 1,
        animation: [
          "hook-mark-in 900ms cubic-bezier(0.33,1,0.68,1) both",
          "hook-mark-out var(--ef-transition-duration) var(--ef-transition-out-start) cubic-bezier(0.32,0,0.67,0) forwards",
        ].join(", "),
      }}
    >
      rhode
    </div>

    <div
      className="absolute"
      style={{
        left: "50%",
        top: 1075,
        width: 280,
        height: 2,
        background: BROWN,
        transformOrigin: "center",
        animation: [
          "hook-rule-in 600ms 450ms cubic-bezier(0.33,1,0.68,1) both",
          "hook-rule-out var(--ef-transition-duration) var(--ef-transition-out-start) forwards",
        ].join(", "),
      }}
    />

    <div className="absolute left-0 right-0 text-center" style={{ top: 1110 }}>
      <Reveal
        enter={[650, 1200]}
        exit="transition"
        y={22}
        exitY={-24}
        style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 60, color: BROWN }}
      >
        summer &rsquo;26
      </Reveal>
    </div>

    {/* small pulsing dot above "limited edition" — outer div fades with the kicker,
        inner div runs its own continuous pulse (split per the continuous-motion pattern) */}
    <div className="absolute left-0 right-0 text-center" style={{ top: 740 }}>
      <div
        style={{
          display: "inline-block",
          width: 9,
          height: 9,
          borderRadius: "50%",
          background: SOFT_PINK,
          animation: [
            "dot-fade-in 500ms 350ms both",
            "dot-pulse 520ms ease-in-out infinite",
            "dot-fade-out var(--ef-transition-duration) var(--ef-transition-out-start) forwards",
          ].join(", "),
        }}
      />
    </div>
  </Timegroup>
);
