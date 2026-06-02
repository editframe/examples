/**
 * Scene 3 — Pill scroll (10000–17500ms)
 *
 * FIX 3 (Round 5):
 *   - Variable-width pills (auto-width per text, NOT equal-width)
 *   - Bigger pills: 88px tall, padding 20px 52px, font 40px
 *   - Scroll runs through ALL 11 pills, each gets ~550ms at center
 *   - Total scroll ~6000ms (10 transitions × 600ms each)
 *   - Pills EXIT: when scroll completes (all pills shown), visible pills FADE-UP
 *     (translateY → -300px + opacity 1→0) over 800ms — pills FULLY GONE before plugins headline
 *
 * FIX 4 (Round 5) — GATE: plugins headline MUST NOT appear while pills are on screen.
 *   - Pills exit COMPLETELY at ~8000ms scene-local
 *   - Plugin headline starts fading in at 8100ms (100ms after pills gone)
 *   - Plugin headline: translateY +200→0 + opacity 0→1 over 700ms (easeOutCubic)
 *   - Plugin headline CENTERED, serif, 56px, dark #1A1A1A
 *
 * Timeline (scene-local ms):
 *   0–6000ms      — MAIN SCROLL: pills scroll immediately from ms=0, 11 positions over 6000ms
 *                   Active index goes 0→10 (no initial delay — synchronized with Scene2 exit)
 *   6000–6500ms   — last pill HOLDS at center
 *   6500–7300ms   — ALL visible pills FADE-UP exit (translateY -300 + opacity→0)
 *   7300ms        — Pills COMPLETELY GONE from frame
 *   7400–8100ms   — Plugins headline RISES in (gate: pills cleared)
 *   8100–9500ms   — Plugins headline holds
 *   9500ms        — scene end (next scene)
 *
 * TOTAL DURATION: 9500ms
 * Master: starts at 10000ms, ends at 19500ms
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TraceLayer } from "../components/TraceLayer";
import { track, lerp, clamp } from "../components/helpers";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { eases } from "animejs";

export const SCENE3_START    = 10000;
export const SCENE3_DURATION = 9500;

// All pills — variable text length means variable rendered width (CSS auto)
const PILLS = [
  "Pitch builder",         // shorter
  "Meeting preparer",      // wider
  "Earnings reviewer",     // wider
  "Model builder",         // shorter
  "Valuation reviewer",    // wider  ← peak active (index 4)
  "Market researcher",     // wider
  "GL Reconciler",         // shorter
  "Month-end Closer",      // wider
  "Statement Auditor",     // wider
  "Portfolio monitor",     // wider
  "Risk analyst",          // shorter
];

const ACTIVE_PEAK = 4;  // "Valuation reviewer" is the active one we hold on

// Pill dimensions (height fixed, width is auto per content)
const PILL_H      = 88;
const PILL_GAP    = 22;
const PILL_STRIDE = PILL_H + PILL_GAP;
const CENTER_Y    = 1080 / 2;

// FIX 2 (Round 6): pills START SCROLLING IMMEDIATELY at ms=0 — no delay.
// Scene2 slides up at scene2-local 2700ms (master ~9200ms); Scene3 begins at 10000ms.
// By having scroll start at ms=0, the pills are already in motion the instant Scene3 appears.
const SCROLL_START = 0;
const SCROLL_END   = 6000;  // 6000ms for full scroll through all 11 pills
const HOLD_END     = 6500;  // hold last pill
const PILLS_EXIT_START = 6500;
const PILLS_EXIT_END   = 7300;  // pills fade-up exit
// FIX 4 gate: plugins headline starts ONLY after pills_exit_end + 100ms
const HEADLINE_START = 7400;
const HEADLINE_END   = 8100;

export function Scene3_PillScroll(): React.ReactElement {
  const pillRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const trackRef     = useRef<HTMLDivElement>(null);
  const headlineRef  = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // === MAIN SCROLL: active index goes 0 → ACTIVE_PEAK → continues through remaining pills ===
    // Scroll goes from index 0 all the way to the LAST pill (index 10)
    const scrollT     = track(ms, SCROLL_START, SCROLL_END, eases.inOutQuart);
    const scrollIndex = lerp(0, PILLS.length - 1, scrollT);

    // After scroll ends, hold at ACTIVE_PEAK conceptually but just stop scroll
    // (scrollIndex is now at PILLS.length-1 which is fine for display)
    const currentIndex = scrollIndex;

    // === PILLS EXIT (fadeup) ===
    const exitT = track(ms, PILLS_EXIT_START, PILLS_EXIT_END, eases.inCubic);
    const exitTy = lerp(0, -300, exitT);
    const exitOpacity = 1 - exitT;

    // === Pill track Y ===
    const trackY = CENTER_Y - currentIndex * PILL_STRIDE - PILL_H / 2;
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-50%) translateY(${trackY + exitTy}px)`;
      trackRef.current.style.opacity = String(exitOpacity);
    }

    // === Style each pill (active/inactive appearance) ===
    pillRefs.current.forEach((el, i) => {
      if (!el) return;
      const dist = Math.abs(i - currentIndex);
      const isActive = dist < 0.6;

      if (isActive) {
        el.style.background   = "#D87757";
        el.style.color        = "#FFFFFF";
        el.style.fontWeight   = "600";
        el.style.fontSize     = "40px";
        el.style.border       = "none";
      } else {
        const nearness = clamp(1 - (dist - 0.6) * 0.4, 0, 1);
        el.style.background = `rgba(238, 209, 193, ${lerp(0.2, 0.9, clamp(nearness * 2, 0, 1))})`;
        el.style.color = `rgba(42, 40, 37, ${lerp(0.25, 0.8, nearness)})`;
        el.style.fontWeight   = "400";
        el.style.fontSize     = "38px";
        el.style.border       = "1.5px solid rgba(216, 119, 87, 0.15)";
      }

      // Far pills fade out
      const farFade = dist > 3.0 ? clamp(1 - (dist - 3.0) * 0.6, 0, 1) : 1;
      el.style.opacity = String(farFade);
    });

    // === FIX 4: Plugin headline ONLY after pills are FULLY GONE ===
    // Gate: HEADLINE_START = 7900ms (pills exit completes at 7800ms)
    if (headlineRef.current) {
      const headT = track(ms, HEADLINE_START, HEADLINE_END, eases.outCubic);
      const headTy = lerp(200, 0, headT);
      headlineRef.current.style.opacity   = String(headT);
      headlineRef.current.style.transform = `translateY(${headTy}px)`;
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE3_DURATION}ms`}
      onFrame={onFrame as any}
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0, width: 1920, height: 1080, overflow: "hidden" }}
    >
      <TraceLayer sceneStartMs={SCENE3_START} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* Background */}
      {!TRACE_MODE && (
        <div style={{ position: "absolute", inset: 0, background: "#EAE8DE", zIndex: 1 }} />
      )}

      {/* Top + bottom fade gradients to mask pills entering/exiting frame */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 360,
        background: "linear-gradient(to bottom, #EAE8DE 0%, transparent 100%)",
        zIndex: 10, pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 360,
        background: "linear-gradient(to top, #EAE8DE 0%, transparent 100%)",
        zIndex: 10, pointerEvents: "none",
      }} />

      {/* Pill track — centered horizontally, scrolls vertically */}
      <div
        ref={trackRef}
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          transform: `translateX(-50%) translateY(${CENTER_Y - PILL_H / 2}px)`,
          display: "flex",
          flexDirection: "column",
          // FIX 3: align items center so auto-width pills center
          alignItems: "center",
          gap: PILL_GAP,
          zIndex: 5,
          willChange: "transform, opacity",
        }}
      >
        {PILLS.map((pill, i) => (
          <div
            key={pill}
            ref={el => { pillRefs.current[i] = el; }}
            style={{
              // FIX 3: auto width — pill expands per text content
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: PILL_H,
              // FIX 3: variable width via padding (no fixed width!)
              paddingLeft: 52,
              paddingRight: 52,
              borderRadius: 16,
              background: "#EED1C1",
              fontFamily: "'Newsreader', 'EB Garamond', Georgia, serif",
              fontWeight: 400,
              fontSize: 38,
              color: "#2A2A2A",
              letterSpacing: "-0.01em",
              // FIX 3: no fixed width — auto (whiteSpace nowrap forces true content width)
              whiteSpace: "nowrap",
              transition: "none",
              willChange: "opacity, background, color",
              border: "1.5px solid rgba(216, 119, 87, 0.2)",
            }}
          >
            {pill}
          </div>
        ))}
      </div>

      {/*
        FIX 4: Plugin headline — GATED behind pills exit.
        Starts fading in at 7900ms (pills exit at 7800ms).
        CENTERED. Rises from below.
      */}
      <div
        ref={headlineRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0,
          willChange: "transform, opacity",
        }}
      >
        <div
          style={{
            fontFamily: "'Newsreader', 'EB Garamond', Georgia, serif",
            fontWeight: 400,
            fontSize: 56,
            lineHeight: 1.25,
            color: "#1A1A1A",
            letterSpacing: "-0.01em",
            textAlign: "center",
          }}
        >
          Add them with easy-to-install plugins
        </div>
      </div>
    </Timegroup>
  );
}

Scene3_PillScroll.duration = SCENE3_DURATION;
