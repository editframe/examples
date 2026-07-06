import React from "react";
import { Timegroup } from "@editframe/react";
import { Reveal } from "../components/Reveal";
import {
  SCENES,
  WELL_X,
  WELL_Y,
  WELL_W,
  WELL_H,
  WELL_R,
  FRAME_PAD,
  DUSTY_ROSE,
  OAT,
  BROWN,
  ESPRESSO,
  COCOA,
  SERIF,
  SANS,
} from "../constants";

/**
 * APPLICATION — video-in-frame. 5150ms local (200ms cross-fades in from Hero, 200ms
 * cross-fades out as the Dewy Texture bridge / Result take over — see
 * `components/DewyBridge.tsx` for why that handoff isn't a plain sequenced scene).
 *
 * The well rect (WELL_X/Y/W/H) never transforms — a cream-wash veil covers it before
 * the beat starts and after it ends (`app-veil-in`/`app-veil-out`) so the frame can stay
 * perfectly stationary in between. Real application footage is composited into this well
 * outside this composition (flat cream `#EDE6DA` placeholder here); see the README.
 */
export const Application: React.FC = () => (
  <Timegroup
    mode="fixed"
    duration={`${SCENES.application.duration}ms`}
    className="absolute inset-0"
    style={{
      background: `linear-gradient(160deg, ${DUSTY_ROSE} 0%, ${OAT} 52%, ${OAT} 100%)`,
      animation: "app-bg-in 350ms cubic-bezier(0.33,1,0.68,1) backwards",
    }}
  >
    {/* faint editorial corner marks for density */}
    <div style={{ position: "absolute", top: 60, right: 64, width: 48, height: 48, borderRight: `2px solid ${BROWN}40`, borderTop: `2px solid ${BROWN}40` }} />
    <div style={{ position: "absolute", bottom: 60, right: 64, width: 48, height: 48, borderRight: `2px solid ${BROWN}40`, borderBottom: `2px solid ${BROWN}40` }} />

    {/* warm drop shadow under the frame card (held static in window) */}
    <div
      className="absolute"
      style={{
        left: WELL_X - FRAME_PAD,
        top: WELL_Y - FRAME_PAD + 30,
        width: WELL_W + FRAME_PAD * 2,
        height: WELL_H + FRAME_PAD * 2,
        borderRadius: WELL_R + FRAME_PAD,
        boxShadow: "0 70px 140px rgba(42,35,32,0.30), 0 28px 60px rgba(42,35,32,0.18)",
        animation: [
          "app-shade-in 350ms cubic-bezier(0.33,1,0.68,1) both",
          "reveal-out var(--ef-transition-duration) var(--ef-transition-out-start) cubic-bezier(0.45,0,0.55,1) forwards",
        ].join(", "),
      }}
    />

    {/* PREMIUM FRAME CARD — soft off-white rounded card, ~22px padding OUTSIDE the well. Static: never transformed. */}
    <div
      className="absolute"
      style={{
        left: WELL_X - FRAME_PAD,
        top: WELL_Y - FRAME_PAD,
        width: WELL_W + FRAME_PAD * 2,
        height: WELL_H + FRAME_PAD * 2,
        borderRadius: WELL_R + FRAME_PAD,
        background: "#F0EADF",
        boxShadow: "inset 0 1px 0 rgba(240,234,223,0.8), inset 0 0 0 1px rgba(74,53,40,0.10)",
      }}
    >
      {/* THE WELL — exact rect, flat cream placeholder. Static. */}
      <div className="absolute overflow-hidden" style={{ left: FRAME_PAD, top: FRAME_PAD, width: WELL_W, height: WELL_H, borderRadius: WELL_R, background: OAT }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(110% 90% at 50% 35%, rgba(237,230,218,0.5) 0%, rgba(74,53,40,0.08) 100%)" }} />
        <div className="absolute flex items-center" style={{ left: 22, top: 22, gap: 10 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#C96B6B",
              animation: [
                "tick-fade-in 400ms 100ms both",
                "tick-pulse 440ms ease-in-out infinite",
                "reveal-out var(--ef-transition-duration) var(--ef-transition-out-start) forwards",
              ].join(", "),
            }}
          />
          <span style={{ fontFamily: SANS, fontSize: 18, letterSpacing: 3, color: BROWN, textTransform: "uppercase" }}>applying</span>
        </div>
      </div>
    </div>

    {/* ENTRANCE/EXIT VEIL — cream wash over the frame, only outside the window */}
    <div
      className="absolute pointer-events-none"
      style={{
        left: WELL_X - FRAME_PAD - 6,
        top: WELL_Y - FRAME_PAD - 6,
        width: WELL_W + FRAME_PAD * 2 + 12,
        height: WELL_H + FRAME_PAD * 2 + 12,
        borderRadius: WELL_R + FRAME_PAD,
        background: `linear-gradient(160deg, ${DUSTY_ROSE} 0%, ${OAT} 80%)`,
        animation: [
          "app-veil-in 350ms both",
          "app-veil-out var(--ef-transition-duration) var(--ef-transition-out-start) forwards",
        ].join(", "),
      }}
    />

    {/* editorial copy AROUND the well */}
    <div style={{ position: "absolute", left: WELL_X, top: 150, fontFamily: SANS, fontWeight: 500, fontSize: 24, letterSpacing: 8, textTransform: "uppercase", color: BROWN }}>
      <Reveal enter={[100, 550]} exit="transition" y={0} style={{ display: "inline-block" }}>
        how it&rsquo;s applied
      </Reveal>
    </div>
    <div style={{ position: "absolute", left: WELL_X, top: 196, fontFamily: SANS, fontWeight: 300, fontSize: 96, lineHeight: 0.92, letterSpacing: -1, color: ESPRESSO }}>
      <Reveal enter={[200, 750]} exit="transition" y={34} style={{ display: "block" }}>
        the dewy look
      </Reveal>
    </div>

    {/* right-gutter editorial stack — shared left axis + width so both items align against the card's right edge */}
    <div style={{ position: "absolute", left: 906, top: 720, width: 154, textAlign: "left", fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 40, lineHeight: 1.08, color: COCOA }}>
      <Reveal enter={[1250, 1750]} exit="transition" y={26} style={{ display: "block" }}>
        peptide
        <br />
        lip tint
      </Reveal>
    </div>
    <div style={{ position: "absolute", left: 912, top: 1300, width: 148, textAlign: "left", fontFamily: SANS, fontWeight: 500, fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: BROWN, lineHeight: 1.55 }}>
      <Reveal enter={[2450, 2950]} exit="transition" y={22} style={{ display: "block" }}>
        skin first,
        <br />
        makeup
        <br />
        second
      </Reveal>
    </div>
  </Timegroup>
);
