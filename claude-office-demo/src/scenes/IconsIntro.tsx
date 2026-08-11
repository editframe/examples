/**
 * IconsIntro — 4200ms  (master 0–4200ms)
 *
 * Verbatim user spec (comments #9, #10, #11, #12, #13):
 *  - MODERN fluid-gradient MS365 icons (officeIcons2025), NOT old flat icons.
 *  - Icons BIGGER + WIDER equal spacing, no "bigger" logo, no overlap.
 *  - Logos START centered; when the headline appears it PUSHES the logos UP (#9).
 *  - Headline "Claude now works across / Microsoft 365" = TWO LINES, bigger,
 *    with a larger gap between the logos and the text (#13).
 *  - Transition: Word/Excel/PowerPoint slide OFF to the RIGHT; Outlook slides
 *    from its left start position to the CENTER (#10). Smooth (~1.1s, not
 *    instantaneous #4). Equal spacing preserved, Outlook never overlaps Word (#11,#12).
 */
import React, { useCallback, useRef } from "react";
import { Timegroup, Image } from "@editframe/react";
import { CreamBackdrop } from "../components/CreamBackdrop";
import { track, lerp, clamp } from "@shared/utils/animation";
import { eases } from "animejs";

// Outlook icon fully settles at SLIDE_END (2900ms); trimmed the dead hold so the
// Scene2 phrase ("Focus your attention in Outlook with Claude") appears ~1.5s sooner.
// Handoff to Scene2 is still seamless (icon is centered/settled well before 3500ms).
const DURATION_MS = 3500;

// ── Layout: 4 icons, bigger + wider gap, centered in 1920 ──
const ICON_SIZE = 264;
const GAP = 104;
const ROW_WIDTH = 4 * ICON_SIZE + 3 * GAP;  // 1056 + 312 = 1368
const ROW_LEFT  = (1920 - ROW_WIDTH) / 2;   // 276

const OUTLOOK_LEFT = ROW_LEFT;                       // 276
const WORD_LEFT    = ROW_LEFT + (ICON_SIZE + GAP);   // 644
const EXCEL_LEFT   = ROW_LEFT + 2 * (ICON_SIZE + GAP); // 1012
const PP_LEFT      = ROW_LEFT + 3 * (ICON_SIZE + GAP); // 1380

// Vertical: icons START centered (cy 540), then RISE when headline appears (#9)
const ICON_CY_START = 540;
const ICON_CY_UP    = 430;

// Outlook center: start 276+132=408 → target center 960
const OUTLOOK_CENTER_START = OUTLOOK_LEFT + ICON_SIZE / 2; // 408
const OUTLOOK_TARGET_CX    = 960;
const OUTLOOK_SLIDE_DX      = OUTLOOK_TARGET_CX - OUTLOOK_CENTER_START; // 552

// Beats
const FADE_IN_START     = 80;
const FADE_IN_END       = 700;
// "Text pushes logos up": headline appears + icons rise together
const RISE_START        = 480;
const RISE_END          = 1280;
const HEADLINE_IN_START = 560;
const HEADLINE_IN_END   = 1320;

// Slide-out transition — ROUND-8 (reference scene-01 frames 38→45):
// ONE continuous motion. The whole row slides RIGHT so Outlook lands dead-
// centre; Word/Excel/PowerPoint FADE OUT as they drift further right ("the
// more to the right it slides, the more faded" — fade is coupled to drift).
// Tight right-to-left stagger (PP→Excel→Word, ~80ms) reads as one continuous
// stream. The old build decelerated to a stop (PHASE A) then re-accelerated
// (PHASE B) = the "abrupt pause", and slid at FULL opacity with no fade.
const SLIDE_START   = 2050;
const SLIDE_END     = 2900;   // Outlook reaches centre (~850ms — fast)
const EXIT_EXTRA_DX = 340;    // extra rightward drift for the 3 exiters as they fade
const FADE_DUR      = 430;
const PP_FADE_START    = 2120; // rightmost fades first
const EXCEL_FADE_START = 2200;
const WORD_FADE_START  = 2280;

export function IconsIntro() {
  const outlookRef  = useRef<HTMLDivElement>(null);
  const wordRef     = useRef<HTMLDivElement>(null);
  const excelRef    = useRef<HTMLDivElement>(null);
  const ppRef       = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    const fadeP = track(ms, FADE_IN_START, FADE_IN_END, eases.outQuart);
    const riseP = track(ms, RISE_START, RISE_END, eases.outCubic);
    const iconCY = lerp(ICON_CY_START, ICON_CY_UP, riseP);
    const iconTop = iconCY - ICON_SIZE / 2;

    // ONE continuous rightward slide — the whole row shifts right so Outlook
    // lands dead-centre. (No PHASE-A→B decel/accel hitch.)
    const slideP   = track(ms, SLIDE_START, SLIDE_END, eases.outCubic);
    const sharedTX = lerp(0, OUTLOOK_SLIDE_DX, slideP);

    // Exiter fade — coupled to extra rightward drift, so "more right = more
    // faded". Tight right-to-left stagger = one continuous stream.
    const ppFade    = track(ms, PP_FADE_START,    PP_FADE_START + FADE_DUR);
    const excelFade = track(ms, EXCEL_FADE_START, EXCEL_FADE_START + FADE_DUR);
    const wordFade  = track(ms, WORD_FADE_START,  WORD_FADE_START + FADE_DUR);

    // Headline exits as the slide begins
    const headExitP = track(ms, SLIDE_START - 150, SLIDE_START + 450, eases.inCubic);

    if (outlookRef.current) {
      // Outlook stays fully opaque and only slides to centre
      outlookRef.current.style.opacity = String(fadeP);
      outlookRef.current.style.top = `${iconTop}px`;
      outlookRef.current.style.transform = `translateX(${sharedTX}px)`;
    }
    if (wordRef.current) {
      wordRef.current.style.opacity = String(clamp(fadeP) * (1 - wordFade));
      wordRef.current.style.top = `${iconTop}px`;
      wordRef.current.style.transform = `translateX(${sharedTX + lerp(0, EXIT_EXTRA_DX, wordFade)}px)`;
    }
    if (excelRef.current) {
      excelRef.current.style.opacity = String(clamp(fadeP) * (1 - excelFade));
      excelRef.current.style.top = `${iconTop}px`;
      excelRef.current.style.transform = `translateX(${sharedTX + lerp(0, EXIT_EXTRA_DX, excelFade)}px)`;
    }
    if (ppRef.current) {
      ppRef.current.style.opacity = String(clamp(fadeP) * (1 - ppFade));
      ppRef.current.style.top = `${iconTop}px`;
      ppRef.current.style.transform = `translateX(${sharedTX + lerp(0, EXIT_EXTRA_DX, ppFade)}px)`;
    }

    if (headlineRef.current) {
      const headInP = track(ms, HEADLINE_IN_START, HEADLINE_IN_END, eases.outQuart);
      const op = clamp(headInP * (1 - headExitP));
      const ty = lerp(24, 0, headInP) + lerp(0, -28, headExitP);
      // headline sits below the icons' risen position
      headlineRef.current.style.top = `${ICON_CY_UP + ICON_SIZE / 2 + 82}px`;
      headlineRef.current.style.opacity = String(op);
      headlineRef.current.style.transform = `translateY(${ty}px)`;
    }
  }, []);

  const iconWrap = (left: number): React.CSSProperties => ({
    position: "absolute", left, top: ICON_CY_START - ICON_SIZE / 2,
    width: ICON_SIZE, height: ICON_SIZE, opacity: 0,
    willChange: "transform, opacity, top", zIndex: 5,
    display: "flex", alignItems: "center", justifyContent: "center",
  });
  const imgStyle: React.CSSProperties = { width: ICON_SIZE, height: ICON_SIZE, objectFit: "contain", display: "block" };

  return (
    <Timegroup
      mode="fixed"
      duration={`${DURATION_MS}ms`}
      onFrame={onFrame as any}
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0, width: 1920, height: 1080, overflow: "hidden" }}
    >
      <CreamBackdrop variant="dark" />

      <div ref={outlookRef} style={iconWrap(OUTLOOK_LEFT)}>
        <Image src="/claude-office-demo/src/assets/outlook-icon.png" style={imgStyle} />
      </div>
      <div ref={wordRef} style={iconWrap(WORD_LEFT)}>
        <Image src="/claude-office-demo/src/assets/word-icon.png" style={imgStyle} />
      </div>
      <div ref={excelRef} style={iconWrap(EXCEL_LEFT)}>
        <Image src="/claude-office-demo/src/assets/excel-icon.png" style={imgStyle} />
      </div>
      <div ref={ppRef} style={iconWrap(PP_LEFT)}>
        <Image src="/claude-office-demo/src/assets/powerpoint-icon.png" style={imgStyle} />
      </div>

      {/* Headline — TWO LINES, bigger, more gap below icons (#13) */}
      <div ref={headlineRef} style={{
        position: "absolute", left: 0, right: 0, top: ICON_CY_UP + ICON_SIZE / 2 + 82,
        textAlign: "center", opacity: 0,
        willChange: "transform, opacity, top", zIndex: 5, pointerEvents: "none",
      }}>
        <span style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: 78, fontWeight: 400, color: "#1A1410",
          letterSpacing: "-0.5px", lineHeight: 1.18, display: "block",
        }}>
          Claude now works across<br />Microsoft 365
        </span>
      </div>
    </Timegroup>
  );
}
