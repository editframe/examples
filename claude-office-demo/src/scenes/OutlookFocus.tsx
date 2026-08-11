/**
 * OutlookFocus — 3000ms
 * Master timeline: [after Scene1] → [after Scene1 + 3000ms]
 *
 * FIX 2 (Round 6): Replace downward slide + nudge with clean fade/settle.
 *   - 0–700ms:    Outlook icon fades + settles up 8px (clean entrance)
 *   - 700–1600ms: Phrase fades + settles up 8px (clean entrance, no downward drop)
 *   - 2000ms+:    Hold — static composition, logo above, two-line text below
 *   - 2300–2700ms: Press-and-pop on logo (keep subtle)
 */
import React, { useCallback, useRef } from "react";
import { Timegroup, Image, Audio } from "@editframe/react";
import { CreamBackdrop } from "../components/CreamBackdrop";
import { track, lerp, clamp, outBack } from "@shared/utils/animation";
import { eases } from "animejs";

const DURATION_MS = 3000;

const ICON_SIZE = 264;
const ICON_START_CX = 960;
// ROUND-7 FIX (comment #1 — logo blank flash at 5s): Scene1 ENDS with the Outlook
// icon centered at (960, 430), opacity 1, scale 1. Scene2 must CONTINUE from that
// EXACT state — no fade-in-from-0, no position hop — or the logo blanks for a frame
// at the boundary. So: cy = 430 (match Scene1 end), icon opacity stays 1 throughout.
const ICON_START_CY = 430;

// ROUND-7 FIX: NO fade-in, NO settle on the icon — it's already on screen from Scene1.
const ICON_FADE_IN_START = 0;
const ICON_FADE_IN_END   = 1;
const ICON_SETTLE_DY     = 0; // no settle — seamless continuation

// FIX 2: Phrase fades + settles up (no downward slide)
// USER (audio round): the phrase took too long (~2s) to appear — make it pop in
// fast right at the start of the scene (60ms delay + 300ms snappy fade).
const PHRASE_FADE_START = 60;
const PHRASE_FADE_END   = 360;
const PHRASE_SETTLE_DY  = 8; // settles UP 8px

// Phrase final Y: below icon (static composition)
const PHRASE_FINAL_Y = ICON_START_CY + ICON_SIZE / 2 + 60;

// FIX 4: Press-and-pop timing
const POP_PRESS_START  = 2300; // scale 1.0 → 0.88
const POP_PRESS_END    = 2450; // 150ms press
const POP_UP_START     = 2450; // scale 0.88 → 1.05
const POP_UP_END       = 2650; // 200ms pop
const POP_SETTLE_START = 2650; // scale 1.05 → 1.0
const POP_SETTLE_END   = 2800; // 150ms settle

const easeOutBackPop = outBack(2.2);

export function OutlookFocus() {
  const outlookRef = useRef<HTMLDivElement>(null);
  const phraseRef  = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // FIX 2: Icon fades + settles UP (no downward nudge)
    const iconFadeP = track(ms, ICON_FADE_IN_START, ICON_FADE_IN_END, eases.outQuart);
    const iconSettleTY = lerp(ICON_SETTLE_DY, 0, iconFadeP); // settles from +8 → 0

    // Press-and-pop — three-phase scale
    const pressP  = track(ms, POP_PRESS_START, POP_PRESS_END, eases.inCubic);
    const popP    = track(ms, POP_UP_START, POP_UP_END, easeOutBackPop);
    const settleP = track(ms, POP_SETTLE_START, POP_SETTLE_END, eases.outCubic);

    // Combined scale: before pop phase it's 1.0, then compress, then pop
    let popScale = 1.0;
    if (ms < POP_PRESS_START) {
      popScale = 1.0;
    } else if (ms < POP_UP_START) {
      popScale = lerp(1.0, 0.88, pressP);
    } else if (ms < POP_SETTLE_START) {
      popScale = lerp(0.88, 1.05, popP);
    } else {
      popScale = lerp(1.05, 1.0, settleP);
    }

    if (outlookRef.current) {
      // ROUND-7 FIX (comment #1): icon opacity is ALWAYS 1 — seamless handoff from
      // Scene1 (no blank flash). Only the later press-pop scale animates.
      outlookRef.current.style.opacity = "1";
      outlookRef.current.style.transform = `translate(-50%, -50%) translateY(${iconSettleTY}px) scale(${popScale})`;
    }

    // FIX 2: Phrase fades + settles UP (no downward slide)
    if (phraseRef.current) {
      const phraseP = track(ms, PHRASE_FADE_START, PHRASE_FADE_END, eases.outQuart);
      const phraseTY = lerp(PHRASE_SETTLE_DY, 0, phraseP); // settles from +8 → 0
      phraseRef.current.style.opacity = String(clamp(phraseP));
      phraseRef.current.style.transform = `translate(-50%, 0) translateY(${phraseTY}px)`;
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration={`${DURATION_MS}ms`}
      onFrame={onFrame as any}
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0, width: 1920, height: 1080, overflow: "hidden" }}
    >
      <CreamBackdrop variant="dark" />

      {/* Warm radial glow */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "radial-gradient(ellipse 800px 600px at 960px 460px, rgba(255,185,130,0.15) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* Outlook icon — FIX 2: fades in with upward settle, no downward nudge */}
      <div ref={outlookRef} style={{
        position: "absolute",
        left: ICON_START_CX,
        top: ICON_START_CY,
        width: ICON_SIZE,
        height: ICON_SIZE,
        transform: `translate(-50%, -50%) translateY(${ICON_SETTLE_DY}px)`,
        opacity: 1,
        willChange: "transform, opacity",
        zIndex: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Image
          src="/claude-office-demo/src/assets/outlook-icon.png"
          alt="Outlook"
          style={{ width: ICON_SIZE, height: ICON_SIZE, objectFit: "contain", display: "block" }}
        />
      </div>

      {/*
        FIX 2: Phrase — "Focus your attention in" / "Outlook with Claude"
        TWO LINES, 86px serif, centered at x=960, fades + settles up (no downward drop).
      */}
      <div ref={phraseRef} style={{
        position: "absolute",
        left: 960,
        top: PHRASE_FINAL_Y,
        transform: `translate(-50%, 0) translateY(${PHRASE_SETTLE_DY}px)`,
        opacity: 0,
        willChange: "transform, opacity",
        zIndex: 5,
        pointerEvents: "none",
        textAlign: "center",
        whiteSpace: "nowrap",
      }}>
        <div style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: 86,
          fontWeight: 400,
          color: "#1A1A1A",
          letterSpacing: "-0.5px",
          lineHeight: 1.25,
          display: "block",
          textAlign: "center",
        }}>
          Focus your attention in
        </div>
        <div style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: 86,
          fontWeight: 400,
          color: "#1A1A1A",
          letterSpacing: "-0.5px",
          lineHeight: 1.25,
          display: "block",
          textAlign: "center",
        }}>
          Outlook with Claude
        </div>
      </div>

      {/* Logo press-pop click (local 2300ms / master 5800ms) — explicit exception,
          the Outlook logo "gets clicked" here even though there's no cursor. */}
      <Audio
        src="/claude-office-demo/src/assets/sfx/claude-office-demo-click.mp3"
        offset={`${POP_PRESS_START}ms`}
        sourceIn="0.6s"
        duration="0.3s"
        volume={1}
      />
    </Timegroup>
  );
}
