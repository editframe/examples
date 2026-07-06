import React from "react";
import { Timegroup } from "@editframe/react";
import { SCENES, BLACK, MONT, SILVER_GRAD } from "../constants";
import { imgFill, textWindow } from "../components/textStyles";

const TEX_PAPER = "/assets/tex-paper.png";
const TEX_INK = "/assets/tex-ink.png";

/**
 * COVER — 0 → 4000ms local (4000ms total; the last 300ms cross-fades into SwingRack).
 * See-through FASHION/NOVA wordmark (type-as-window over `TEX_INK`), centered, then a
 * hairline rule + subline, then a silver "UP TO 80% OFF" swing tag flicks in.
 * First scene — no incoming crossfade, so no cut-flash and no enter-transition wiring.
 */
export const Cover: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.cover.duration}ms`} className="absolute inset-0" style={{ fontFamily: MONT, color: BLACK }}>
    <div className="absolute inset-5" style={{ animation: "cover-exit var(--ef-transition-duration) var(--ef-transition-out-start) cubic-bezier(0.32,0,0.67,0) forwards" }}>
      {/* paper bg */}
      <div className="absolute inset-0" style={imgFill(TEX_PAPER, "center", "cover")} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(246,244,241,0.30), rgba(246,244,241,0.0) 30%, rgba(246,244,241,0.0) 72%, rgba(246,244,241,0.55))" }} />

      {/* masthead */}
      <div
        className="absolute flex justify-between items-center"
        style={{ top: 54, left: 56, right: 56, borderBottom: `2px solid ${BLACK}`, paddingBottom: 14, animation: "cover-mast-in 320ms 0ms cubic-bezier(0.33,1,0.68,1) both" }}
      >
        <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: 3 }}>THE FALL EDIT</div>
        <div style={{ fontWeight: 600, fontSize: 24, letterSpacing: 2 }}>ISSUE Nº 07</div>
      </div>

      {/* FASHION — ink-filled letters (TEX_INK, not a photo) */}
      <div
        className="absolute left-0 right-0 text-center"
        style={{
          top: 560, fontWeight: 900, fontSize: 250, lineHeight: 0.86, letterSpacing: "-0.02em",
          ...textWindow(TEX_INK, "center 60%", "460%"),
          animation: [
            "cover-fash-fade 120ms 0ms cubic-bezier(0.33,1,0.68,1) both",
            "cover-fash-slam 560ms 0ms cubic-bezier(0.34,1.56,0.64,1) both",
            "cover-fash-pan 4000ms 0ms cubic-bezier(0.45,0,0.55,1) both",
          ].join(", "),
        }}
      >
        FASHION
      </div>

      {/* thin separator line of type */}
      <div
        className="absolute left-0 right-0 text-center"
        style={{ top: 850, fontWeight: 700, fontSize: 30, letterSpacing: 12, animation: "cover-ion-in 400ms 420ms cubic-bezier(0.33,1,0.68,1) both" }}
      >
        AUTUMN / WINTER · 2026
      </div>

      {/* NOVA — ink-filled letters */}
      <div
        className="absolute left-0 right-0 text-center"
        style={{
          top: 930, fontWeight: 900, fontSize: 360, lineHeight: 0.82, letterSpacing: "-0.03em",
          ...textWindow(TEX_INK, "center 55%", "460%"),
          animation: [
            "cover-nova-fade 140ms 300ms cubic-bezier(0.33,1,0.68,1) both",
            "cover-nova-slam 600ms 300ms cubic-bezier(0.34,1.56,0.64,1) both",
            "cover-nova-pan 4000ms 0ms cubic-bezier(0.45,0,0.55,1) both",
          ].join(", "),
        }}
      >
        NOVA
      </div>

      {/* subline */}
      <div
        className="absolute left-0 right-0 text-center"
        style={{ top: 1350, fontWeight: 700, fontSize: 38, letterSpacing: 8, animation: "cover-sub-in 440ms 980ms cubic-bezier(0.33,1,0.68,1) both" }}
      >
        NEW ARRIVALS · ON MODEL · NOW
      </div>

      {/* silver swing tag */}
      <div
        className="absolute"
        style={{
          top: 1460, right: 90, transform: "rotate(-8deg)",
          animation: [
            "cover-tag-fade 120ms 1180ms cubic-bezier(0.33,1,0.68,1) both",
            "cover-tag-slam 380ms 1180ms cubic-bezier(0.34,1.56,0.64,1) both",
          ].join(", "),
        }}
      >
        <div style={{ background: SILVER_GRAD, color: BLACK, fontWeight: 900, fontSize: 42, padding: "16px 26px", letterSpacing: 1, border: `2px solid ${BLACK}`, boxShadow: "0 14px 30px rgba(0,0,0,0.25)" }}>
          UP TO 80% OFF
        </div>
        <div style={{ width: 14, height: 14, borderRadius: "50%", border: `3px solid ${BLACK}`, background: "#F6F4F1", position: "absolute", top: -7, left: 18 }} />
      </div>

      {/* bottom rule */}
      <div className="absolute" style={{ bottom: 120, left: 56, right: 56, height: 6, background: BLACK, transformOrigin: "left", animation: "cover-bar-in 600ms 700ms cubic-bezier(0.33,1,0.68,1) both" }} />
      <div className="absolute" style={{ bottom: 70, left: 56, fontWeight: 700, fontSize: 24, letterSpacing: 3 }}>FASHIONNOVA.COM</div>
      <div className="absolute" style={{ bottom: 70, right: 56, fontWeight: 600, fontSize: 24, letterSpacing: 2 }}>VOL. 01</div>
    </div>
  </Timegroup>
);
