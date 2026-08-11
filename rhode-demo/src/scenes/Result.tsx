import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { Reveal } from "@shared/components/Reveal";
import { SCENES, LEFT_COL, W2_X, W2_Y, W2_W, W2_H, W2_R, W2_PAD, COCOA, ESPRESSO, ESPRESSO_BG_LO, WARM_WHITE, SOFT_PINK, SANS, SERIF, BROWN } from "../constants";

const GEM_SKIN_MACRO = "/rhode-demo/src/assets/gem-skin-macro.jpg";
const LIFE_GRID1 = "/rhode-demo/src/assets/life-grid1.jpg";

/**
 * RESULT / LIFESTYLE — 3680ms local (200ms cross-fades in — timed to land just after
 * `DewyBridge` starts peeling away, 200ms cross-fades out as Range's kinetic montage
 * wipes in). Lit-from-within glowing-skin macro Ken-Burns backdrop + WELL 2
 * (founder/model clip, real footage composited outside this composition — see
 * README) + a glossy lip-swatch grid.
 */
export const Result: React.FC = () => (
  <Timegroup
    mode="fixed"
    duration={`${SCENES.result.duration}ms`}
    className="absolute inset-0"
    style={{
      background: `linear-gradient(to bottom, ${COCOA} 0%, ${ESPRESSO} 46%, ${ESPRESSO_BG_LO} 100%)`,
      animation: [
        "wipe-y-in 350ms 250ms cubic-bezier(0.33,1,0.68,1) backwards",
        "wipe-y-out var(--ef-transition-duration) var(--ef-transition-out-start) cubic-bezier(0.45,0,0.55,1) forwards",
      ].join(", "),
    }}
  >
    {/* glowing-skin macro backdrop (top band) with a slow continuous Ken-Burns drift */}
    <div className="absolute overflow-hidden" style={{ top: 0, left: 0, width: "100%", height: 760 }}>
      <Image
        src={GEM_SKIN_MACRO}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "50% 44%",
          filter: "saturate(1.08) sepia(0.06) hue-rotate(-4deg) brightness(1.05) contrast(1.03)",
          animation: "result-skin-kenburns 3680ms linear both",
        }}
      />
      <div className="absolute inset-0" style={{ background: COCOA, mixBlendMode: "soft-light", opacity: 0.42 }} />
      <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(42,35,32,0) 44%, rgba(42,35,32,0.6) 84%, ${ESPRESSO} 100%)` }} />
      <div style={{ position: "absolute", left: LEFT_COL, top: 80, fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 9, textTransform: "uppercase", color: WARM_WHITE, textShadow: "0 2px 16px rgba(42,35,32,0.55)" }}>
        <Reveal enter={[1250, 1650]} exit="transition" y={0} style={{ display: "inline-block" }}>
          the result
        </Reveal>
      </div>
    </div>

    <div style={{ position: "absolute", left: LEFT_COL, top: 800, width: 900, fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 80, lineHeight: 1.14, color: WARM_WHITE, textShadow: "0 2px 24px rgba(0,0,0,0.4)" }}>
      <Reveal enter={[1400, 1950]} exit="transition" y={34} style={{ display: "block" }}>
        glassy,
        <br />
        lit-from-within
      </Reveal>
    </div>
    <div style={{ position: "absolute", left: LEFT_COL + 2, top: 1108, fontFamily: SANS, fontWeight: 500, fontSize: 28, letterSpacing: 5, color: SOFT_PINK }}>
      <Reveal enter={[2000, 2450]} exit="transition" y={20} style={{ display: "inline-block" }}>
        real glow, real skin
      </Reveal>
    </div>

    {/* WELL 2 — founder/model clip, exact rect, premium off-white frame + warm shadow.
        Fast ~150ms fade landing right after the reveal, so the frame never sits empty. */}
    <div
      className="absolute"
      style={{
        left: W2_X - W2_PAD,
        top: W2_Y - W2_PAD + 26,
        width: W2_W + W2_PAD * 2,
        height: W2_H + W2_PAD * 2,
        borderRadius: W2_R + W2_PAD,
        boxShadow: "0 60px 120px rgba(0,0,0,0.5), 0 24px 50px rgba(0,0,0,0.35)",
        animation: [
          "well2-shade-in 150ms 550ms cubic-bezier(0.33,1,0.68,1) both",
          "reveal-out var(--ef-transition-duration) var(--ef-transition-out-start) forwards",
        ].join(", "),
      }}
    />
    <div
      className="absolute"
      style={{
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        animation: [
          "well2-in 150ms 550ms cubic-bezier(0.33,1,0.68,1) both",
          "reveal-out var(--ef-transition-duration) var(--ef-transition-out-start) forwards",
        ].join(", "),
      }}
    >
      <div style={{ position: "absolute", left: W2_X - W2_PAD, top: W2_Y - W2_PAD, width: W2_W + W2_PAD * 2, height: W2_H + W2_PAD * 2, borderRadius: W2_R + W2_PAD, background: "#F0EADF", boxShadow: "inset 0 1px 0 rgba(240,234,223,0.9), inset 0 0 0 1px rgba(74,53,40,0.10)" }}>
        <div className="absolute overflow-hidden" style={{ left: W2_PAD, top: W2_PAD, width: W2_W, height: W2_H, borderRadius: W2_R, background: "#EDE6DA" }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(110% 90% at 50% 36%, rgba(237,230,218,0.45) 0%, rgba(74,53,40,0.10) 100%)" }} />
          <div className="absolute flex items-center" style={{ left: 20, top: 20, gap: 9 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#C96B6B" }} />
            <span style={{ fontFamily: SANS, fontSize: 16, letterSpacing: 3, color: BROWN, textTransform: "uppercase" }}>founder</span>
          </div>
        </div>
      </div>
    </div>

    {/* glossy lip-swatch grid — right of WELL 2, own subtle Ken-Burns */}
    <div
      className="absolute overflow-hidden"
      style={{
        left: 600,
        top: W2_Y,
        width: 420,
        borderRadius: 26,
        boxShadow: "0 40px 80px rgba(0,0,0,0.45)",
        border: `1px solid ${WARM_WHITE}55`,
        animation: [
          "well2-swatch-in 550ms 900ms cubic-bezier(0.33,1,0.68,1) both",
          "reveal-out var(--ef-transition-duration) var(--ef-transition-out-start) forwards",
        ].join(", "),
      }}
    >
      <div className="relative overflow-hidden" style={{ width: "100%", height: 540 }}>
        <Image
          src={LIFE_GRID1}
          style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", animation: "result-swatch-kenburns 3680ms linear both" }}
        />
        <div className="absolute" style={{ left: 0, right: 0, top: "50%", height: 3, transform: "translateY(-50%)", background: WARM_WHITE, opacity: 0.9 }} />
        <div className="absolute" style={{ top: 0, bottom: 0, left: "50%", width: 3, transform: "translateX(-50%)", background: WARM_WHITE, opacity: 0.9 }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 600, top: 1750, width: 420, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 5, textTransform: "uppercase", color: SOFT_PINK, whiteSpace: "nowrap" }}>
      <Reveal enter={[1900, 2400]} exit="transition" y={24} style={{ display: "inline-block" }}>
        eight glossy shades
      </Reveal>
    </div>
  </Timegroup>
);
