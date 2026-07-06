/**
 * Scene 4 — Code Block: Prompt-Then-Generate
 *
 * FIX 3 (round-6) — Camera + length rework per user feedback:
 *
 * - Zoom is MILD (1.5×) throughout Phase 1, matching the reference where
 *   ~4 lines of code fill the top half of the frame comfortably readable.
 *   NO aggressive 2.6× that makes it impossible to read context.
 * - Phase 2 (Enter beat): very short flash, NO zoom-out.
 *   Camera stays at the same mild zoom so the transition into Phase 3 is seamless.
 * - Phase 3 (AI generation): code generates rapidly; camera CHASES downward
 *   as new lines overflow the viewport, rinse and repeat — multiple "lurches"
 *   as the camera lag makes the code run ahead before the camera catches up.
 * - SCENE EXTENDED: was 5000ms, now 10000ms so there's enough time to generate
 *   a long block of code and have multiple camera-scroll moments.
 * - Added more AI-generated code lines to match a "long generation" scenario.
 *
 * KEEP:
 *   - Cream background #E8E4D4
 *   - No panel chrome — code directly on bg
 *   - JetBrains Mono, 48px
 *   - Syntax colors: blue keywords, green classes, orange methods, pink strings, dim line nums
 *
 * DELIBERATELY KEPT AS A SCOPED `addFrameTask` (not converted to CSS):
 * This scene compounds two irreducible things at once — (1) per-token, multi-line
 * `textContent` reveal across 40+ syntax-colored spans (CSS cannot mutate DOM text, and
 * unlike the monospace terminal scenes this isn't a single flat string so the `ch`-unit
 * clip trick doesn't apply per-line either), and (2) a camera chase whose speed itself
 * *ramps* over time — both `frameFraction` (0.72→0.56) and `lerpSpeed` (0.34→0.72) vary
 * continuously with `phase3T`, on top of exponential smoothing toward a target that
 * depends on which token was most recently typed. There is no reasonable static-keyframe
 * equivalent for an accelerating, content-dependent camera chase layered on token-level
 * text mutation — this is the "genuinely irreducible" case referred to in
 * REFACTOR-PATTERNS.md 2b, kept scoped to this one scene only.
 */

import React, { useRef, useCallback } from "react";
import { Timegroup, Audio } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { clamp, lerp } from "../components/helpers";

const SCENE_START = 7500;
// ROUND-8d: the code+camera-chase fully settles by ~scene-local 5900ms, but the
// scene used to run to 7500ms → ~1.6s of FROZEN frame before Scene5 hard-cut in
// (the "abrupt pause at 14s" the user flagged). Trim to 6500ms: full code shows
// (~5900ms) + a short ~600ms read beat, then flows straight into Scene5.
const SCENE_DUR = 6500;

const FONT_SIZE = 48;
const LINE_HEIGHT = Math.round(FONT_SIZE * 1.35); // ~65px
const FONT_FAMILY = '"JetBrains Mono", "SF Mono", "Menlo", "Consolas", monospace';

// Colors
const C_BLUE   = "#2D6FAD";
const C_GREEN  = "#3A7D44";
const C_ORANGE = "#C75B39";
const C_PINK   = "#B5689A";
const C_DARK   = "#2C2C2C";
const C_DIM    = "#9BA0A8";

// Approximate monospace char width at FONT_SIZE 48px
const CHAR_W = Math.round(FONT_SIZE * 0.60);
// Code content starts at: paddingLeft(100) + lineNumWidth(80) + paddingRight(32) + paddingLeft(8) = 220
const CODE_X_ORIGIN = 220;

// ─── Phase timings (scene-local ms) ─────────────────────────────────────
const PHASE1_START = 0;
const PHASE1_END   = 2200; // user finishes typing model= line
const PHASE2_START = 2200;
const PHASE2_END   = 2400; // brief flash beat
const PHASE3_START = 2400; // AI generation begins
const PHASE3_END   = SCENE_DUR; // 10000ms

// Slow typing speed for Phase 1 (human) — 55ms gives 200 + 30*55 = 1850ms (finishes before PHASE1_END=2200ms)
const SLOW_MS_PER_CHAR = 55;

// Keyboard SFX cue for the human-typed `model="composer-2.5-fast"` line — scene-local
// 200ms (global 7700ms, since Scene4 starts at SCENE_START=7500), ~1.65s duration.
const PROMPT_SFX_OFFSET = 200;
const PROMPT_SFX_DURATION = 1650;
// Fast typing speed for Phase 3 (AI) — code outpaces camera to create chase effect
const FAST_MS_PER_CHAR = 3;

// Mild zoom that matches reference: lines fill the frame top-portion comfortably
const ZOOM_SCALE = 1.5;

// ─── Code content ────────────────────────────────────────────────────────
type Token = { text: string; color: string };
type CodeLine = { lineNum: number; tokens: Token[] };

// Lines 1-5 are pre-visible. Line 6 is the PROMPT line typed in Phase 1.
// Lines 7+ get generated rapidly in Phase 3.
const LINES: CodeLine[] = [
  // 1 — pre-visible
  { lineNum: 1, tokens: [
    { text: "from", color: C_BLUE }, { text: " cursor_sdk ", color: C_DARK },
    { text: "import", color: C_BLUE }, { text: " ", color: C_DARK },
    { text: "Agent", color: C_GREEN }, { text: ", ", color: C_DARK },
    { text: "LocalAgentOptions", color: C_GREEN },
  ]},
  // 2 blank — pre-visible
  { lineNum: 2, tokens: [] },
  // 3 — pre-visible
  { lineNum: 3, tokens: [
    { text: "with", color: C_BLUE }, { text: " ", color: C_DARK },
    { text: "Agent", color: C_GREEN }, { text: ".", color: C_DARK },
    { text: "create", color: C_ORANGE }, { text: "(", color: C_DARK },
  ]},
  // 4 — THE PROMPT LINE — typed slowly in Phase 1
  { lineNum: 4, tokens: [
    { text: "    model=", color: C_DARK }, { text: '"composer-2.5-fast"', color: C_PINK },
    { text: ",", color: C_DARK },
  ]},
  // 5+ — AI-generated in Phase 3
  { lineNum: 5, tokens: [
    { text: "    local=", color: C_DARK }, { text: "LocalAgentOptions", color: C_GREEN },
    { text: "(cwd=", color: C_DARK }, { text: '"."', color: C_PINK },
    { text: "),", color: C_DARK },
  ]},
  { lineNum: 6, tokens: [
    { text: ") ", color: C_DARK }, { text: "as", color: C_BLUE },
    { text: " agent:", color: C_DARK },
  ]},
  { lineNum: 7, tokens: [] },
  { lineNum: 8, tokens: [
    { text: "    run = agent.", color: C_DARK }, { text: "send", color: C_ORANGE },
    { text: "(", color: C_DARK },
  ]},
  { lineNum: 9, tokens: [{ text: '        """', color: C_PINK }] },
  { lineNum: 10, tokens: [
    { text: "        ", color: C_DARK },
    { text: "Explore this repository and write", color: C_PINK },
  ]},
  { lineNum: 11, tokens: [
    { text: "        ", color: C_DARK },
    { text: "a catalog entry for our data pipeline.", color: C_PINK },
  ]},
  { lineNum: 12, tokens: [
    { text: "        ", color: C_DARK },
    { text: "Use exactly 3 bullets:", color: C_PINK },
  ]},
  { lineNum: 13, tokens: [
    { text: "        ", color: C_DARK },
    { text: "purpose, components, tooling.", color: C_PINK },
  ]},
  { lineNum: 14, tokens: [{ text: '        """', color: C_PINK }] },
  { lineNum: 15, tokens: [{ text: "    )", color: C_DARK }] },
  { lineNum: 16, tokens: [] },
  { lineNum: 17, tokens: [
    { text: "    ", color: C_DARK }, { text: "for", color: C_BLUE },
    { text: " event ", color: C_DARK }, { text: "in", color: C_BLUE },
    { text: " run.", color: C_DARK }, { text: "events", color: C_ORANGE },
    { text: "():", color: C_DARK },
  ]},
  { lineNum: 18, tokens: [
    { text: "        ", color: C_DARK }, { text: "if", color: C_BLUE },
    { text: " event.type == ", color: C_DARK }, { text: '"thinking"', color: C_PINK },
    { text: ":", color: C_DARK },
  ]},
  { lineNum: 19, tokens: [
    { text: "            ", color: C_DARK }, { text: "print", color: C_BLUE },
    { text: "(event.text)", color: C_DARK },
  ]},
  { lineNum: 20, tokens: [
    { text: "        ", color: C_DARK }, { text: "elif", color: C_BLUE },
    { text: " event.type == ", color: C_DARK }, { text: '"tool_use"', color: C_PINK },
    { text: ":", color: C_DARK },
  ]},
  { lineNum: 21, tokens: [
    { text: "            ", color: C_DARK }, { text: "print", color: C_BLUE },
    { text: `(f"→ {event.tool}: {event.args}")`, color: C_DARK },
  ]},
  { lineNum: 22, tokens: [
    { text: "        ", color: C_DARK }, { text: "elif", color: C_BLUE },
    { text: " event.type == ", color: C_DARK }, { text: '"message"', color: C_PINK },
    { text: ":", color: C_DARK },
  ]},
  { lineNum: 23, tokens: [
    { text: "            ", color: C_DARK }, { text: "print", color: C_BLUE },
    { text: "(event.text)", color: C_DARK },
  ]},
  { lineNum: 24, tokens: [
    { text: "        ", color: C_DARK }, { text: "elif", color: C_BLUE },
    { text: " event.type == ", color: C_DARK }, { text: '"completed"', color: C_PINK },
    { text: ":", color: C_DARK },
  ]},
  { lineNum: 25, tokens: [
    { text: "            ", color: C_DARK }, { text: "break", color: C_BLUE },
  ]},
  { lineNum: 26, tokens: [] },
  { lineNum: 27, tokens: [
    { text: "    # Save the structured response", color: C_DIM },
  ]},
  { lineNum: 28, tokens: [
    { text: "    result = run.", color: C_DARK }, { text: "final_message", color: C_ORANGE },
    { text: "()", color: C_DARK },
  ]},
  { lineNum: 29, tokens: [
    { text: "    ", color: C_DARK }, { text: "Path", color: C_GREEN },
    { text: `("catalog_entry.md")`, color: C_DARK }, { text: ".", color: C_DARK },
    { text: "write_text", color: C_ORANGE }, { text: "(result.content)", color: C_DARK },
  ]},
  { lineNum: 30, tokens: [
    { text: "    ", color: C_DARK }, { text: "print", color: C_BLUE },
    { text: `(f"Wrote catalog_entry.md (`, color: C_DARK },
    { text: `{len(result.content)}`, color: C_ORANGE }, { text: ` chars)")`, color: C_DARK },
  ]},
  { lineNum: 31, tokens: [] },
  { lineNum: 32, tokens: [
    { text: "    # Log run metadata", color: C_DIM },
  ]},
  { lineNum: 33, tokens: [
    { text: "    metadata = {", color: C_DARK },
  ]},
  { lineNum: 34, tokens: [
    { text: '        "model": ', color: C_DARK }, { text: "run.model", color: C_ORANGE },
    { text: ",", color: C_DARK },
  ]},
  { lineNum: 35, tokens: [
    { text: '        "tool_calls": ', color: C_DARK }, { text: "run.tool_call_count", color: C_ORANGE },
    { text: ",", color: C_DARK },
  ]},
  { lineNum: 36, tokens: [
    { text: '        "tokens_used": ', color: C_DARK }, { text: "run.usage.total_tokens", color: C_ORANGE },
    { text: ",", color: C_DARK },
  ]},
  { lineNum: 37, tokens: [
    { text: "    }", color: C_DARK },
  ]},
  { lineNum: 38, tokens: [
    { text: "    ", color: C_DARK }, { text: "Path", color: C_GREEN },
    { text: `("run_log.json")`, color: C_DARK }, { text: ".", color: C_DARK },
    { text: "write_text", color: C_ORANGE },
    { text: "(json.dumps(metadata, indent=2))", color: C_DARK },
  ]},
  { lineNum: 39, tokens: [] },
  { lineNum: 40, tokens: [
    { text: "if", color: C_BLUE }, { text: " __name__ == ", color: C_DARK },
    { text: '"__main__"', color: C_PINK }, { text: ":", color: C_DARK },
  ]},
  { lineNum: 41, tokens: [
    { text: "    import", color: C_BLUE }, { text: " asyncio", color: C_DARK },
  ]},
  { lineNum: 42, tokens: [
    { text: "    asyncio.", color: C_DARK }, { text: "run", color: C_ORANGE },
    { text: "(main())", color: C_DARK },
  ]},
];

// Pre-visible lines: indices 0-2 (lines 1-3)
const PRE_VISIBLE_COUNT = 3;
// Prompt line index: 3 (line 4)
const PROMPT_LINE_IDX = 3;
// AI-generated lines: indices 4+ (lines 5-42)
const AI_LINES_START = 4;

// Compute total chars on the prompt line
const PROMPT_LINE_CHARS = LINES[PROMPT_LINE_IDX].tokens.reduce((s, t) => s + t.text.length, 0);

function buildFlatCharsForLine(lineIdx: number): Array<{ tokenIdx: number; charIdx: number }> {
  const chars: Array<{ tokenIdx: number; charIdx: number }> = [];
  LINES[lineIdx].tokens.forEach((token, ti) => {
    for (let ci = 0; ci < token.text.length; ci++) {
      chars.push({ tokenIdx: ti, charIdx: ci });
    }
  });
  return chars;
}
const PROMPT_FLAT = buildFlatCharsForLine(PROMPT_LINE_IDX);

function buildAIFlatChars(): Array<{ lineIdx: number; tokenIdx: number; charIdx: number }> {
  const chars: Array<{ lineIdx: number; tokenIdx: number; charIdx: number }> = [];
  for (let li = AI_LINES_START; li < LINES.length; li++) {
    LINES[li].tokens.forEach((token, ti) => {
      for (let ci = 0; ci < token.text.length; ci++) {
        chars.push({ lineIdx: li, tokenIdx: ti, charIdx: ci });
      }
    });
    chars.push({ lineIdx: li, tokenIdx: -1, charIdx: -1 }); // newline sentinel
  }
  return chars;
}
const AI_FLAT = buildAIFlatChars();
const AI_TOTAL_CHARS = AI_FLAT.length;

// Camera: mild zoom that matches reference — lines fill the top-half of the frame
// At ZOOM_SCALE 1.5, the visible viewport covers 1080/1.5 = 720px of content height.
// We want to show code starting from the top — place top of content near top of frame.
// translateY: small top padding so line 1 isn't flush against frame top
const ZOOM_TOP_PAD = 60; // px from top of content to top of viewport in content-coords
const ZOOM_LEFT_PAD = 0; // no horizontal shift needed

export function Scene4_CodeBlock() {
  const containerRef   = useRef<HTMLDivElement>(null); // gets scale transform
  const highlightRef   = useRef<HTMLDivElement>(null);
  // Inline caret: one per line — positioned right after the last typed char in text flow
  const caretRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
  const setCaretRef = useCallback((lineIdx: number) => (el: HTMLSpanElement | null) => {
    if (el) caretRefs.current.set(lineIdx, el);
  }, []);

  const tokenRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const setTokenRef = useCallback((key: string) => (el: HTMLSpanElement | null) => {
    if (el) tokenRefs.current.set(key, el);
  }, []);

  const smoothScrollRef = useRef<number>(0);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    if (!containerRef.current) return;

    // ── Camera: mild consistent zoom matching reference ───────────────────────
    // In Phase 1 and 2: fixed zoom, anchored to top of content
    // In Phase 3: same zoom but scrollY increases to chase new lines
    const scale = ZOOM_SCALE;

    // ─── PHASE 1: Slow typing of line 4, mild zoom ───────────────────────────
    if (ms <= PHASE1_END) {
      // Fixed zoom — top of content aligned to top of viewport with padding
      const translateY = ZOOM_TOP_PAD;
      const translateX = 0;
      containerRef.current.style.transform =
        `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
      containerRef.current.style.transformOrigin = "0 0";
      smoothScrollRef.current = 0;

      // Phase 1 slow typing: line 4 only
      const typingElapsed = ms - 200; // start typing after 200ms
      const visibleChars = typingElapsed <= 0 ? 0 :
        Math.min(PROMPT_LINE_CHARS, Math.floor(typingElapsed / SLOW_MS_PER_CHAR));

      // Build per-token char map for the prompt line
      const tokenChars = new Map<string, number>();
      let remaining = visibleChars;
      for (const { tokenIdx } of PROMPT_FLAT) {
        if (remaining <= 0) break;
        const key = `${PROMPT_LINE_IDX}_${tokenIdx}`;
        tokenChars.set(key, (tokenChars.get(key) ?? 0) + 1);
        remaining--;
      }

      LINES[PROMPT_LINE_IDX].tokens.forEach((token, ti) => {
        const key = `${PROMPT_LINE_IDX}_${ti}`;
        const el = tokenRefs.current.get(key);
        if (!el) return;
        el.textContent = token.text.slice(0, tokenChars.get(key) ?? 0);
      });

      // Show inline caret on the prompt line; hide all AI-line carets
      const promptCaret = caretRefs.current.get(PROMPT_LINE_IDX);
      if (promptCaret) promptCaret.style.display = "inline-block";
      // Hide AI line carets
      for (let li = AI_LINES_START; li < LINES.length; li++) {
        const c = caretRefs.current.get(li);
        if (c) c.style.display = "none";
      }

      if (highlightRef.current) {
        highlightRef.current.style.opacity = "0";
      }
    }

    // ─── PHASE 2: Enter beat flash ────────────────────────────────────────────
    else if (ms <= PHASE2_END) {
      const phaseT = clamp((ms - PHASE2_START) / (PHASE2_END - PHASE2_START));

      // Same zoom, same position
      const translateY = ZOOM_TOP_PAD;
      containerRef.current.style.transform =
        `scale(${scale}) translate(0px, ${translateY}px)`;
      containerRef.current.style.transformOrigin = "0 0";
      smoothScrollRef.current = 0;

      // Flash highlight on line 4
      if (highlightRef.current) {
        const flashOpacity = phaseT < 0.4 ? phaseT / 0.4 : 1 - (phaseT - 0.4) / 0.6;
        highlightRef.current.style.opacity = String(flashOpacity * 0.3);
      }

      // Keep prompt caret visible at end of line during flash
      const promptCaret = caretRefs.current.get(PROMPT_LINE_IDX);
      if (promptCaret) promptCaret.style.display = "inline-block";
      for (let li = AI_LINES_START; li < LINES.length; li++) {
        const c = caretRefs.current.get(li);
        if (c) c.style.display = "none";
      }
    }

    // ─── PHASE 3: Rapid AI generation + camera chases down ───────────────────
    else {
      // Hide highlight
      if (highlightRef.current) {
        highlightRef.current.style.opacity = "0";
      }

      // AI typing progress
      const phase3Elapsed = ms - PHASE3_START;
      const aiVisibleChars = Math.min(AI_TOTAL_CHARS, Math.floor(phase3Elapsed / FAST_MS_PER_CHAR));

      // Build per-(lineIdx,tokenIdx) visible char count for AI lines
      const tokenChars = new Map<string, number>();
      let remaining = aiVisibleChars;
      let activeLineIdx = AI_LINES_START;
      let activeLineTypedChars = 0;

      for (let i = 0; i < AI_FLAT.length && remaining > 0; i++) {
        const { lineIdx, tokenIdx } = AI_FLAT[i];
        if (tokenIdx < 0) { remaining--; continue; }
        const key = `${lineIdx}_${tokenIdx}`;
        tokenChars.set(key, (tokenChars.get(key) ?? 0) + 1);
        remaining--;
      }

      // Figure out active line
      if (aiVisibleChars > 0 && aiVisibleChars <= AI_FLAT.length) {
        const lastIdx = Math.min(aiVisibleChars - 1, AI_FLAT.length - 1);
        const lastFlat = AI_FLAT[lastIdx];
        if (lastFlat.tokenIdx < 0) {
          activeLineIdx = Math.min(lastFlat.lineIdx + 1, LINES.length - 1);
          activeLineTypedChars = 0;
        } else {
          activeLineIdx = lastFlat.lineIdx;
          LINES[activeLineIdx].tokens.forEach((_, ti) => {
            const key = `${activeLineIdx}_${ti}`;
            activeLineTypedChars += tokenChars.get(key) ?? 0;
          });
        }
      }

      // Apply to AI token spans
      for (let li = AI_LINES_START; li < LINES.length; li++) {
        LINES[li].tokens.forEach((token, ti) => {
          const key = `${li}_${ti}`;
          const el = tokenRefs.current.get(key);
          if (!el) return;
          el.textContent = token.text.slice(0, tokenChars.get(key) ?? 0);
        });
      }

      // Camera chase. ROUND-7 FIX (comment #1): the slide-down is FASTER and RAMPS
      // UP over time. Previously a constant lerp 0.25 + fixed 65% framing made it
      // "take its sweet time". The CODE generation speed is unchanged — only the
      // camera accelerates. Two ramping levers, both keyed to phase3T (0→1):
      //   (a) frameFraction drops 0.72→0.56 → the camera LEADS the front more over
      //       time → it scrolls further for the same progress → accelerating slide.
      //   (b) lerpSpeed rises 0.34→0.72 → the chase gets snappier → less lag.
      // Net: gentle at first, visibly faster as it goes (≈1.2×→≈1.7× feel).
      const visibleContentH = 1080 / scale;
      const activeLineY = activeLineIdx * LINE_HEIGHT;

      const phase3T = clamp(phase3Elapsed / (PHASE3_END - PHASE3_START));
      const frameFraction = lerp(0.72, 0.56, phase3T);
      const rawTarget = activeLineY - visibleContentH * frameFraction + ZOOM_TOP_PAD;
      // Never scroll past the end of the content (no blank tail)
      const maxScroll = Math.max(0, LINES.length * LINE_HEIGHT - visibleContentH + 40);
      const targetScrollY = Math.max(0, Math.min(maxScroll, rawTarget - ZOOM_TOP_PAD));

      const lerpSpeed = lerp(0.34, 0.72, phase3T); // ramps up → slide accelerates
      smoothScrollRef.current = smoothScrollRef.current + (targetScrollY - smoothScrollRef.current) * lerpSpeed;

      // Apply: scale + translate, where translateY = ZOOM_TOP_PAD - smoothScrollRef.current
      const translateY = ZOOM_TOP_PAD - smoothScrollRef.current;
      containerRef.current.style.transform =
        `scale(${scale}) translate(0px, ${translateY}px)`;
      containerRef.current.style.transformOrigin = "0 0";

      // Inline caret: hide prompt caret, show on the active AI line only
      const promptCaret = caretRefs.current.get(PROMPT_LINE_IDX);
      if (promptCaret) promptCaret.style.display = "none";

      const isGenerating = aiVisibleChars < AI_TOTAL_CHARS;
      for (let li = AI_LINES_START; li < LINES.length; li++) {
        const c = caretRefs.current.get(li);
        if (!c) continue;
        c.style.display = (isGenerating && li === activeLineIdx) ? "inline-block" : "none";
      }
    }
  }, []);

  const CURSOR_W = Math.round(FONT_SIZE * 0.50); // inline caret width
  const CURSOR_H = FONT_SIZE;                    // inline caret height

  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE_DUR}ms`}
      onFrame={onFrame as any}
      style={{
        position: "absolute",
        inset: 0,
        width: 1920,
        height: 1080,
        background: TRACE_MODE ? "transparent" : "#E8E4D4",
        overflow: "hidden",
      }}
    >
      <TraceLayer sceneStartMs={SCENE_START} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      <Audio
        src="/assets/sfx/keyboard.wav"
        offset={`${PROMPT_SFX_OFFSET}ms`}
        duration={`${PROMPT_SFX_DURATION}ms`}
        volume={0.7}
      />

      {/* Container that gets scale + translate transforms */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1920,
          willChange: "transform",
        }}
      >
        {/* Code lines */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1920,
            fontFamily: FONT_FAMILY,
            fontSize: FONT_SIZE,
            lineHeight: `${LINE_HEIGHT}px`,
            letterSpacing: 0,
            zIndex: 1,
          }}
        >
          {LINES.map((line, li) => {
            const isPreVisible = li < PRE_VISIBLE_COUNT;

            return (
              <div
                key={line.lineNum}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  minHeight: LINE_HEIGHT,
                  paddingLeft: 100,
                  position: "relative",
                }}
              >
                {/* Line number */}
                <span
                  style={{
                    display: "inline-block",
                    width: 80,
                    textAlign: "right",
                    paddingRight: 32,
                    color: C_DIM,
                    fontSize: FONT_SIZE,
                    userSelect: "none",
                    flexShrink: 0,
                  }}
                >
                  {line.lineNum}
                </span>

                {/* Code tokens */}
                <span style={{ paddingLeft: 8, display: "inline" }}>
                  {isPreVisible ? (
                    line.tokens.map((token, ti) => (
                      <span key={ti} style={{ color: token.color }}>
                        {token.text}
                      </span>
                    ))
                  ) : (
                    <>
                      {line.tokens.map((token, ti) => (
                        <span
                          key={ti}
                          ref={setTokenRef(`${li}_${ti}`)}
                          style={{ color: token.color }}
                        />
                      ))}
                      {/* Inline caret: sits immediately after last typed char in text flow */}
                      <span
                        ref={setCaretRef(li)}
                        style={{
                          display: "none",
                          width: CURSOR_W,
                          height: CURSOR_H,
                          background: C_DARK,
                          verticalAlign: "text-bottom",
                          marginLeft: 1,
                        }}
                      />
                    </>
                  )}
                </span>
              </div>
            );
          })}

          {/* Highlight flash for the prompt line */}
          <div
            ref={highlightRef}
            style={{
              position: "absolute",
              left: 0,
              top: PROMPT_LINE_IDX * LINE_HEIGHT,
              width: "100%",
              height: LINE_HEIGHT,
              background: "#FFD700",
              opacity: 0,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* Inline carets are rendered per-line inside the token spans above */}
        </div>
      </div>
    </Timegroup>
  );
}

Scene4_CodeBlock.duration = SCENE_DUR;
