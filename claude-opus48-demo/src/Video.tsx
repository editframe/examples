import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import Background from "./components/Background";
import MenuBar from "./components/MenuBar";
import TerminalWindow, { AppSection, type AppRow } from "./components/TerminalWindow";
import PixelCreature from "./components/PixelCreature";
import Kite from "./components/Kite";
import Headline from "./components/Headline";
import NotifCard from "./components/NotifCard";
import CodeBlock, { CODE_LINES } from "./components/CodeBlock";
import TraceOverlay from "./components/TraceOverlay";
import { TRACE_FRAMES } from "./traceFrames";
import { clamp, lerp, track, outBack, typewriterCps } from "./components/helpers";
import * as C from "./constants";

/**
 * Opus 4.8 ad — 1:1 reproduction, 0–25s (SHARED BASE / "tracing paper").
 * 1920×1080 @ 30fps. ONE fixed Timegroup => ownCurrentTimeMs == master ms.
 *
 * 10 beats (see _opus_run/00-OBSERVATIONS.md + 02-timemap-pro.json):
 *   1  0.0–1.9   Terminal scales in; creature perches; status populates
 *   2  1.9–8.0   Kites pop (orange→pink→purple); "Needs input" list fills;
 *                creature walks right; kites float up
 *   3  8.0–12.5  Headlines: "Long-running tasks / shouldn't run your life"
 *                then "Introducing Opus 4.8" (creature + kites roam)
 *   4  12.5–18   Terminal returns (Working/4 apps); Issue 781 card slides in;
 *                "auto mode on"; command types char-by-char; camera pushes in
 *   5  18–21.2   AI code output (syntax-highlighted) streams in
 *   6  21.2–25   Notification cards stack (calendar, kite-crew)
 *
 * Builders: timing lives in src/constants.ts (named master-ms constants).
 * Set TRACE_MODE=true in constants.ts to overlay reference frames.
 */

// Status-line strings per the time-map
const STATUS_0 = "0 awaiting input · 0 working · 0 completed";
const STATUS_1 = "0 awaiting input · 1 working · 0 completed";
const STATUS_FINAL = "3 awaiting input · 1 working · 0 completed";
const STATUS_RETURN = "0 awaiting input · 4 working · 0 completed";

// Needs-input + working rows (beat 2 final state)
const NEEDS_INPUT_ROWS: AppRow[] = [
  { glyph: "✱", name: "apps/web", msg: "Ready to implement this change?", count: "1s", selected: true },
  { glyph: "✱", name: "apps/admin", msg: "New admin toggle is ready for review.", count: "1s" },
  { glyph: "✱", name: "apps/docs", msg: "Done. Docs are refreshed with the latest.", count: "1s" },
];
const WORKING_ROWS_B2: AppRow[] = [
  { glyph: "✦", name: "apps/storefront", msg: "Reading routes…", count: "1s" },
];

// Working rows when terminal returns (beat 4)
const WORKING_ROWS_RETURN: AppRow[] = [
  { glyph: "✦", name: "apps/web", msg: "Reading routes…" },
  { glyph: "✦", name: "apps/admin", msg: "Reading routes…" },
  { glyph: "✦", name: "apps/docs", msg: "Reading routes…" },
  { glyph: "✦", name: "apps/storefront", msg: "Reading routes…" },
];

export const Video: React.FC = () => {
  const TRACE = C.TRACE_MODE;

  // ── refs ──
  const bgRef = useRef<HTMLDivElement>(null);
  const camRef = useRef<HTMLDivElement>(null);

  // Beat 1-2 terminal (hero)
  const heroWrapRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const status0Ref = useRef<HTMLDivElement>(null);
  const workingB1Ref = useRef<HTMLDivElement>(null);
  const needsInputRef = useRef<HTMLDivElement>(null);

  // Creature
  const creatureWrapRef = useRef<HTMLDivElement>(null);
  const creatureSvgRef = useRef<SVGSVGElement>(null);
  const leg1 = useRef<SVGGElement>(null);
  const leg2 = useRef<SVGGElement>(null);
  const leg3 = useRef<SVGGElement>(null);
  const leg4 = useRef<SVGGElement>(null);

  // Kites
  const kiteOrangeRef = useRef<SVGSVGElement>(null);
  const kitePinkRef = useRef<SVGSVGElement>(null);
  const kitePurpleRef = useRef<SVGSVGElement>(null);

  // Headlines
  const hl1Wrap = useRef<HTMLDivElement>(null);
  const hl1Line1 = useRef<HTMLDivElement>(null);
  const hl1Line2 = useRef<HTMLDivElement>(null);
  const hl2Wrap = useRef<HTMLDivElement>(null);
  const hl2Line1 = useRef<HTMLDivElement>(null);

  // Beat 4 returned terminal + command
  const term2WrapRef = useRef<HTMLDivElement>(null);
  const cmdTextRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const autoModeRef = useRef<HTMLDivElement>(null);
  const promptRowRef = useRef<HTMLDivElement>(null);
  const hintRowRef = useRef<HTMLDivElement>(null);
  const chipRowRef = useRef<HTMLDivElement>(null);
  const workingReturnRef = useRef<HTMLDivElement>(null);
  const thoughtRef = useRef<HTMLDivElement>(null);
  const logScrollRef = useRef<HTMLDivElement>(null);
  const retHeaderRef = useRef<HTMLDivElement>(null);

  // Code block
  const codeLineRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Cards
  const cardIssueRef = useRef<HTMLDivElement>(null);
  const cardCalRef = useRef<HTMLDivElement>(null);
  const cardMsgRef = useRef<HTMLDivElement>(null);

  // Trace
  const traceRefs = useRef<(HTMLImageElement | null)[]>([]);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;

      // ── Background drift ──
      if (bgRef.current) {
        const p = clamp(ms / 25000);
        bgRef.current.style.transform = `translate(${lerp(-18, 18, p)}px, ${lerp(-10, 8, p)}px)`;
      }

      // ── CAMERA: zoom IN (14.6→15.05s) → HOLD → zoom OUT (17.48→18.02s) ──
      // Frame-verified track. scale 1.0→1.75 centered on the terminal so the dark
      // terminal FILLS the frame during typing, then back to 1.0 for code+cards.
      if (camRef.current) {
        const zin = track(ms, C.CAM_IN_START, C.CAM_IN_END, eases.inOutQuad);
        const zout = track(ms, C.CAM_OUT_START, C.CAM_OUT_END, eases.inOutQuad);
        const scale = lerp(1, C.CAM_SCALE, zin) - (C.CAM_SCALE - 1) * zout;
        const ox = (C.CAM_FOCUS_X / 1920) * 100;
        const oy = (C.CAM_FOCUS_Y / 1080) * 100;
        camRef.current.style.transformOrigin = `${ox}% ${oy}%`;
        camRef.current.style.transform = `scale(${scale})`;
      }

      // ════ BEAT 1: terminal in + creature perch + status ════
      const heroIn = outBack(clamp(ms / C.TERM_IN_END), 1.25);
      if (heroRef.current) {
        heroRef.current.style.opacity = String(clamp(ms / 300));
        heroRef.current.style.transform = `scale(${lerp(0.8, 1, heroIn)})`;
      }
      if (heroWrapRef.current) {
        const exit = track(ms, C.TERM_EXIT_START, C.TERM_EXIT_END, eases.inCubic);
        const enter = track(ms, 0, 250, eases.outCubic);
        heroWrapRef.current.style.opacity = String(enter * (1 - exit));
        heroWrapRef.current.style.transform =
          `translate(-50%, -50%) translateY(${lerp(0, -40, exit)}px) scale(${lerp(1, 0.86, exit)})`;
      }

      if (status0Ref.current) {
        let s = STATUS_0;
        if (ms >= C.STATUS_UPDATE_5) s = STATUS_FINAL;
        else if (ms >= C.STATUS_UPDATE_2) s = "1 awaiting input · 4 working · 0 completed";
        else if (ms >= C.STATUS_UPDATE_1) s = STATUS_1;
        status0Ref.current.textContent = s;
      }
      if (workingB1Ref.current) {
        const p = track(ms, C.STATUS_UPDATE_1, C.STATUS_UPDATE_1 + 250, eases.outCubic);
        const out = track(ms, C.STATUS_UPDATE_2, C.STATUS_UPDATE_2 + 200, eases.inCubic);
        workingB1Ref.current.style.opacity = String(p * (1 - out));
      }

      // ════ BEAT 2: needs-input list ════
      if (needsInputRef.current) {
        needsInputRef.current.style.opacity = String(track(ms, C.STATUS_UPDATE_2, C.STATUS_UPDATE_2 + 300, eases.outCubic));
      }

      // Kites: pop-in, INDEPENDENT sway/float, trail walking creature, float up.
      const walk = track(ms, C.CREATURE_WALK_START, C.CREATURE_WALK_END, eases.inOutCubic);
      const floatUp = track(ms, C.KITES_FLOAT_UP, C.KITES_FLOAT_UP + 1400, eases.inCubic);
      // Creature + kites exit (fade up & out) ~12.6→13.2s as terminal returns.
      const roamExit = track(ms, 12600, 13200, eases.inCubic);
      const driveKite = (
        el: SVGSVGElement | null, inMs: number, baseX: number, baseY: number,
        swayPeriod: number, swayAmp: number, phase: number, bobPeriod: number, bobAmp: number
      ) => {
        if (!el) return;
        const pop = outBack(clamp((ms - inMs) / 500), 1.6);
        const opa = clamp((ms - inMs) / 250);
        // each kite sways & bobs on its own phase/period so they drift independently
        const sway = Math.sin(ms / swayPeriod + phase) * swayAmp;
        const bob = Math.cos(ms / bobPeriod + phase * 1.7) * bobAmp;
        const tilt = Math.sin(ms / (swayPeriod * 1.25) + phase) * 7;
        const x = baseX + sway + lerp(0, 200, walk);
        const y = baseY + bob - lerp(0, 240, floatUp) - lerp(0, 120, roamExit);
        el.style.opacity = String(opa * (1 - roamExit));
        el.style.transform = `translate(${x}px, ${y}px) scale(${lerp(0.2, 1, pop)}) rotate(${tilt}deg)`;
      };
      driveKite(kiteOrangeRef.current, C.KITE_ORANGE_IN, 720, 150, 1900, 18, 0.0, 1400, 10);
      driveKite(kitePinkRef.current, C.KITE_PINK_IN, 600, 50, 2300, 22, 2.1, 1700, 14);
      driveKite(kitePurpleRef.current, C.KITE_PURPLE_IN, 660, 110, 1600, 15, 4.0, 1200, 8);

      // ════ CREATURE: perch → walk → roam ════
      if (creatureWrapRef.current) {
        const opa = clamp(ms / C.CREATURE_IN_END) * (1 - roamExit);
        const roam = ms > C.HL1_LINE1_IN ? Math.sin((ms - C.HL1_LINE1_IN) / 1600) * 40 : 0;
        const bob = Math.sin(ms / 220) * (walk > 0 && walk < 1 ? 5 : 1.5);
        creatureWrapRef.current.style.opacity = String(opa);
        creatureWrapRef.current.style.transform =
          `translate(${820 + lerp(0, 200, walk) + roam}px, ${250 + bob - lerp(0, 120, roamExit)}px)`;
      }
      const walking = ms >= C.CREATURE_WALK_START && ms <= C.CREATURE_WALK_END;
      const legPhase = ms / 130;
      [leg1, leg2, leg3, leg4].forEach((legRef, i) => {
        if (!legRef.current) return;
        const lift = walking ? Math.max(0, Math.sin(legPhase + (i % 2) * Math.PI)) * 7 : 0;
        legRef.current.style.transform = `translateY(${-lift}px)`;
      });

      // ════ BEAT 3: headlines ════
      if (hl1Line1.current && hl1Line2.current) {
        const out = track(ms, C.HL1_OUT - 350, C.HL1_OUT, eases.inCubic);
        const l1 = track(ms, C.HL1_LINE1_IN, C.HL1_LINE1_IN + 600, eases.outCubic);
        const l2 = track(ms, C.HL1_LINE2_IN, C.HL1_LINE2_IN + 600, eases.outCubic);
        hl1Line1.current.style.opacity = String(l1 * (1 - out));
        hl1Line1.current.style.transform = `translateY(${lerp(28, 0, l1)}px)`;
        hl1Line2.current.style.opacity = String(l2 * (1 - out));
        hl1Line2.current.style.transform = `translateY(${lerp(28, 0, l2)}px)`;
      }
      if (hl2Line1.current) {
        const inP = track(ms, C.HL2_IN, C.HL2_IN + 600, eases.outCubic);
        const out = track(ms, C.HL2_OUT, C.HL2_OUT + 300, eases.inCubic);
        hl2Line1.current.style.opacity = String(inP * (1 - out));
        hl2Line1.current.style.transform = `translateY(${lerp(28, 0, inP)}px)`;
      }

      // ════ BEAT 4: returned terminal + command type-on + auto mode ════
      // Returned terminal fades in ~12.9s, fades out ~21.9s (cards take over center).
      if (term2WrapRef.current) {
        const tin = track(ms, C.TERM_RETURN, C.TERM_RETURN + 250, eases.outCubic);
        const tout = track(ms, C.TERM_FADE_OUT, C.TERM_FADE_OUT + 500, eases.inCubic);
        term2WrapRef.current.style.opacity = String(tin * (1 - tout));
      }
      if (autoModeRef.current) {
        autoModeRef.current.style.opacity = String(clamp((ms - C.AUTO_MODE_IN) / 200));
      }

      const submitted = ms >= C.CMD_SUBMIT;
      // Live typing row (prompt + typed text + block caret) — visible until submit
      if (promptRowRef.current) {
        promptRowRef.current.style.display = submitted ? "none" : "block";
      }
      if (hintRowRef.current) {
        hintRowRef.current.style.display = submitted ? "block" : "none";
      }
      if (cmdTextRef.current) {
        cmdTextRef.current.textContent = typewriterCps(ms, C.TYPE_START, C.TYPE_CPS, C.COMMAND_TEXT);
      }
      if (caretRef.current) {
        const active = ms >= C.TYPE_START && ms < C.CMD_SUBMIT;
        caretRef.current.style.opacity = active ? "1" : "0";
      }
      // Submitted state: grey chip with the command + "Try refactor" hint
      if (chipRowRef.current) {
        const p = track(ms, C.CMD_SUBMIT, C.CMD_SUBMIT + 200, eases.outCubic);
        chipRowRef.current.style.display = submitted ? "block" : "none";
        chipRowRef.current.style.opacity = String(p);
      }
      // Pre-submit: header + working list visible. Post-submit: they collapse and
      // the log scrolls UP so the streaming code stays in view (header off the top).
      if (workingReturnRef.current) {
        workingReturnRef.current.style.display = submitted ? "none" : "block";
      }
      if (retHeaderRef.current) {
        retHeaderRef.current.style.display = submitted ? "none" : "block";
      }
      if (thoughtRef.current) {
        thoughtRef.current.style.opacity = String(clamp((ms - C.AI_THOUGHT_IN) / 200));
      }
      // Scroll the log so the latest revealed code line sits near the bottom.
      if (logScrollRef.current) {
        // count revealed lines after submit; scroll up proportionally.
        const revealed = CODE_LINES.filter((l) => ms >= l.reveal).length;
        const visibleRows = 13; // rows that fit in the scroll viewport
        const lineH = 24;
        const scroll = Math.max(0, (revealed - visibleRows)) * lineH;
        logScrollRef.current.style.transform = `translateY(${-scroll}px)`;
      }

      // ════ BEAT 5: code output streams in (small terminal, post zoom-out) ════
      CODE_LINES.forEach((line, i) => {
        const el = codeLineRefs.current[i];
        if (!el) return;
        const p = track(ms, line.reveal, line.reveal + 150, eases.outCubic);
        el.style.opacity = String(p);
        el.style.transform = `translateY(${lerp(6, 0, p)}px)`;
      });

      // ════ BEAT 6: notification cards (frame-verified two-mode model) ════
      // Mode A (small, top-right): Issue card from 13s, ~326px wide, right edge ~1880.
      // Mode B (large, centered): cards ~1000px wide, centered x=960, ~314px pitch.
      // Transition: exp 0→1 over 20.9→22.6s (cards grow + migrate to center, term fades).
      // Then at 23.7s the whole stack scrolls UP by one pitch (Issue leaves top).
      const SMALL_SCALE = 0.326;     // 1000px → 326px
      const SMALL_LEFT = 1554;       // small Issue card left (right edge 1880)
      const SMALL_TOP = 73;
      const PITCH = 314;             // centered card vertical pitch (height+gap)
      const CENTER_LEFT = 460;       // 960 - 1000/2
      const CENTER_X_FOR_SCALE = (s: number) => 960 - (1000 * s) / 2;

      const exp = track(ms, C.CARDS_CENTER_START, C.CARDS_CENTER_END, eases.inOutCubic);
      const scale = lerp(SMALL_SCALE, 1, exp);
      const scrollUp = track(ms, C.CARDS_SCROLL_UP, C.CARDS_SCROLL_UP + 700, eases.inOutCubic);

      // Centered-stack base: when 3 cards present, top card at ~y55; each below +PITCH.
      // Scroll-up shifts the whole stack up by PITCH (Issue exits top, Kite enters bottom view).
      const stackTop = 55 - PITCH * scrollUp;

      // ISSUE — slot 0. Small top-right until exp, then centered slot 0.
      if (cardIssueRef.current) {
        const inP = clamp((ms - C.CARD_ISSUE_IN) / 300);
        const left = lerp(SMALL_LEFT, CENTER_X_FOR_SCALE(scale), exp);
        const top = lerp(SMALL_TOP, stackTop, exp);
        // fade out as it scrolls off the top at the end
        const fadeOff = scrollUp;
        cardIssueRef.current.style.opacity = String(inP * (1 - fadeOff));
        cardIssueRef.current.style.transform = `translate(${left}px, ${top}px) scale(${scale})`;
      }
      // CALENDAR — slot 1. Slides in from right ~20.9s, then centers below Issue.
      if (cardCalRef.current) {
        const inP = track(ms, C.CARD_CALENDAR_IN, C.CARD_CALENDAR_IN + 450, eases.outCubic);
        const slideInX = lerp(1980, SMALL_LEFT, inP); // slide from off-right to small slot
        const smallTop = SMALL_TOP + 326 + 16;        // below the small Issue card
        const left = lerp(slideInX, CENTER_X_FOR_SCALE(scale), exp);
        const top = lerp(smallTop, stackTop + PITCH, exp);
        cardCalRef.current.style.opacity = String(inP);
        cardCalRef.current.style.transform = `translate(${left}px, ${top}px) scale(${scale})`;
      }
      // KITE CREW — slot 2. Arrives ~22.8s, only in centered mode (slides up from below).
      if (cardMsgRef.current) {
        const inP = track(ms, C.CARD_MESSAGE_IN, C.CARD_MESSAGE_IN + 450, eases.outCubic);
        const top = (stackTop + PITCH * 2) + lerp(60, 0, inP);
        cardMsgRef.current.style.opacity = String(inP);
        cardMsgRef.current.style.transform = `translate(${CENTER_LEFT}px, ${top}px) scale(1)`;
      }

      // ── TRACE overlay ──
      if (TRACE) {
        traceRefs.current.forEach((img, i) => {
          if (!img) return;
          const fMs = TRACE_FRAMES[i].ms;
          const next = TRACE_FRAMES[i + 1]?.ms ?? Infinity;
          const prev = TRACE_FRAMES[i - 1]?.ms ?? -Infinity;
          const visible = ms >= (prev + fMs) / 2 && ms < (fMs + next) / 2;
          img.style.opacity = visible ? String(C.TRACE_OPACITY) : "0";
        });
      }
    },
    [TRACE]
  );

  return (
    <Timegroup
      mode="fixed"
      duration={`${C.DURATION_MS}ms`}
      onFrame={handleFrame as any}
      workbench
      className="w-[1920px] h-[1080px] relative overflow-hidden"
      style={{ background: "var(--paper)" }}
    >
      <Background ref={bgRef} />
      <MenuBar />

      {/* CAMERA RIG */}
      <div ref={camRef} style={{ position: "absolute", inset: 0, willChange: "transform" }}>
        {/* HERO terminal (beats 1-2) */}
        <div
          ref={heroWrapRef}
          style={{
            position: "absolute",
            left: C.HERO_TERM_CX,
            top: C.HERO_TERM_CY,
            transform: "translate(-50%, -50%)",
            zIndex: 5,
            willChange: "transform, opacity",
          }}
        >
          <TerminalWindow
            ref={heroRef}
            width={C.HERO_TERM_W}
            height={C.HERO_TERM_H}
            headerTitle="Claude Code"
            subtitle="Opus 4.7 · ~/acme"
            style={{ opacity: 0, transformOrigin: "center center" }}
          >
            <div ref={status0Ref} style={{ color: "var(--text-secondary)", fontSize: 27, marginTop: -10, marginBottom: 10 }}>
              {STATUS_0}
            </div>

            {/* Beat 1 working line (absolute so it doesn't reserve space) */}
            <div ref={workingB1Ref} style={{ opacity: 0 }}>
              <div style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: 27 }}>Working</div>
              <div style={{ color: "var(--text-secondary)", fontSize: 27 }}>
                <span style={{ color: "var(--text-secondary)", marginRight: 8 }}>✦</span>
                apps/web&nbsp;&nbsp;&nbsp;&nbsp;Reading routes…
              </div>
            </div>

            {/* Beat 2 needs-input list */}
            <div ref={needsInputRef} style={{ opacity: 0, position: "absolute", left: 22, right: 22, top: 130 }}>
              <AppSection label="Needs input" rows={NEEDS_INPUT_ROWS} />
              <AppSection label="Working" rows={WORKING_ROWS_B2} />
            </div>

            <div style={{ marginTop: "auto", borderTop: "1px solid var(--terminal-border)", paddingTop: 8 }}>
              <div style={{ color: "var(--text-dim)", fontSize: 24 }}>
                <span style={{ color: "var(--text-secondary)", marginRight: 8 }}>❯</span>describe a task for a new session
              </div>
            </div>
          </TerminalWindow>
        </div>

        {/* CREATURE */}
        <div ref={creatureWrapRef} style={{ position: "absolute", left: 0, top: 0, zIndex: 6, willChange: "transform, opacity", opacity: 0 }}>
          <PixelCreature ref={creatureSvgRef} pixel={12} leg1Ref={leg1} leg2Ref={leg2} leg3Ref={leg3} leg4Ref={leg4} />
        </div>

        {/* KITES */}
        <div style={{ position: "absolute", left: 0, top: 0, zIndex: 4 }}>
          <Kite ref={kiteOrangeRef} variant="orange" pixel={9} style={{ position: "absolute", left: 0, top: 0, opacity: 0 }} />
          <Kite ref={kitePinkRef} variant="pink" pixel={9} style={{ position: "absolute", left: 0, top: 0, opacity: 0 }} />
          <Kite ref={kitePurpleRef} variant="purple" pixel={9} style={{ position: "absolute", left: 0, top: 0, opacity: 0 }} />
        </div>

        {/* HEADLINES */}
        <Headline ref={hl1Wrap} lines={["Long-running tasks", "shouldn't run your life"]} fontSize={96} lineRefs={[hl1Line1, hl1Line2]} />
        <Headline ref={hl2Wrap} lines={["Introducing Opus 4.8"]} fontSize={104} lineRefs={[hl2Line1]} />

        {/* BEAT 4-5 returned terminal */}
        <div
          ref={term2WrapRef}
          style={{
            position: "absolute",
            left: C.HERO_TERM_CX,
            top: C.RET_TERM_CY,
            transform: "translate(-50%, -50%)",
            zIndex: 3,
            opacity: 0,
            willChange: "opacity",
          }}
        >
          <TerminalWindow
            width={C.RET_TERM_W}
            height={C.RET_TERM_H}
            title="Migrate dashboard to App Router"
          >
            {/* Scrolling log: header + working list (pre-submit), then chip + thought
                + code (post-submit). Whole log translates UP after submit so the
                latest output stays in view and the header scrolls off the top. */}
            <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
              <div ref={logScrollRef} style={{ position: "absolute", left: 0, right: 0, top: 0, willChange: "transform" }}>
                {/* Header block (scrolls away after submit) */}
                <div ref={retHeaderRef} style={{ marginBottom: 12 }}>
                  <div style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: 28, lineHeight: 1.1 }}>Claude Code</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: 25, marginTop: 2 }}>Opus 4.8 · ~/acme</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: 25, marginTop: 2 }}>{STATUS_RETURN}</div>
                </div>

                {/* Pre-submit working list */}
                <div ref={workingReturnRef} style={{ marginBottom: 10 }}>
                  <AppSection label="Working" rows={WORKING_ROWS_RETURN} />
                </div>

                {/* Post-submit: grey command chip + thought + streaming code */}
                <div ref={chipRowRef} style={{ display: "none", opacity: 0 }}>
                  <div style={{
                    background: "var(--term-sel-row)", borderRadius: 8, padding: "8px 12px",
                    color: "var(--text-primary)", fontSize: 19, lineHeight: 1.34, whiteSpace: "pre-wrap",
                    marginBottom: 10,
                  }}>
                    {C.COMMAND_TEXT}
                  </div>
                  <div ref={thoughtRef} style={{ color: "var(--text-secondary)", fontSize: 18, marginBottom: 8, opacity: 0 }}>
                    Thought for 2s (ctrl+o to expand)
                  </div>
                  <CodeBlock lineRefs={codeLineRefs} fontSize={18} />
                </div>
              </div>
            </div>

            {/* Bottom prompt bar (fixed) */}
            <div style={{ borderTop: "1px solid var(--terminal-border)", paddingTop: 8, flexShrink: 0 }}>
              {/* Typing prompt (hidden after submit) */}
              <div ref={promptRowRef} style={{ color: "var(--text-primary)", fontSize: 22, whiteSpace: "pre-wrap" }}>
                <span style={{ color: "var(--text-secondary)", marginRight: 8 }}>❯</span>
                <span ref={cmdTextRef} />
                <span ref={caretRef} className="block-caret" style={{ opacity: 0 }} />
              </div>
              {/* Submitted hint (shown after submit) */}
              <div ref={hintRowRef} style={{ color: "var(--text-dim)", fontSize: 20, display: "none" }}>
                <span style={{ color: "var(--text-secondary)", marginRight: 8 }}>❯</span>Try "refactor &lt;filepath&gt;"
              </div>
              <div ref={autoModeRef} style={{ color: "var(--term-accent)", fontSize: 20, marginTop: 6, opacity: 0 }}>
                <span style={{ marginRight: 8 }}>▶▶</span>auto mode on
              </div>
            </div>
          </TerminalWindow>
        </div>
      </div>

      {/* NOTIFICATION CARDS (screen space, outside camera). Rendered at LARGE
          native width (1000px); the small top-right state is a CSS transform scale.
          transform-origin top-left so translate() math is exact. */}
      <div style={{ position: "absolute", inset: 0, zIndex: 30, pointerEvents: "none" }}>
        <NotifCard
          ref={cardIssueRef}
          icon="issue"
          width={1000}
          title="Issue 781: App Router migration"
          body={<>Dashboard monorepo needs all 4 apps converted from Pages → App Router</>}
          style={{ position: "absolute", left: 0, top: 0, opacity: 0, transformOrigin: "top left" }}
        />
        <NotifCard
          ref={cardCalRef}
          icon="calendar"
          width={1000}
          title="Afternoon at the park"
          timestamp="in 10 min"
          body={<>12:00 – 3:00 PM<br />*Bring kites</>}
          style={{ position: "absolute", left: 0, top: 0, opacity: 0, transformOrigin: "top left" }}
        />
        <NotifCard
          ref={cardMsgRef}
          icon="kite"
          width={1000}
          title="Kite crew"
          timestamp="now"
          body={<>We're on the west side of the park. Can you still make it?</>}
          style={{ position: "absolute", left: 0, top: 0, opacity: 0, transformOrigin: "top left" }}
        />
      </div>

      {/* TRACE overlay (off by default) */}
      {TRACE && <TraceOverlay imgRefs={traceRefs} />}
    </Timegroup>
  );
};

export default Video;
