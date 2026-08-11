/**
 * Scene 3 — "Build your own agents with Composer 2.5" (7000–9000ms)
 *
 * FIX 3: Add char-by-char typewriter animation.
 * KEEP: font-weight 400, left-aligned ~x=120, serif/sans size, color #EEEADA
 * KEEP: two-line layout — "Build your own agents with" + "Composer 2.5"
 *
 * Typewriter: Line 1 types out first, then Line 2 starts immediately after
 * Line 1 finishes (no gap). Blinking cursor on the active typing line.
 *
 * The blinking-cursor opacity is now the shared CSS `cursor-blink`/`cursor-appear`/
 * `cursor-vanish` keyframes (see styles.css) instead of a per-frame ref mutation.
 *
 * The character reveal itself is kept as a small scoped `addFrameTask` (textContent
 * slicing), NOT converted to the `ch`-unit CSS clip trick used in the monospace scenes:
 * Inter is a proportional font, so each character has a different width. A CSS
 * `width: 0 → Nch` clip would not align to glyph boundaries and risks clipping
 * mid-character — a real visual-regression risk, not just JS-aversion. Setting
 * textContent is also something CSS categorically cannot do.
 */

import React, { useRef, useCallback } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";

const SCENE_START = 5500; // FIX 1: shifted -1500ms
const SCENE_DUR = 2000; // FIX 2: same 2000ms, but faster typing so "2.5" fits

const LINE1_TEXT = "Build your own agents with";
const LINE2_TEXT = "Composer 2.5";

// Typing starts 100ms into the scene
const TYPE_START = 100;
// FIX 2: 38ms/char — Line1 (26 chars) = 988ms, Line2 (12 chars) = 456ms
// Total typing = 1444ms + TYPE_START(100) = 1544ms → hold ~456ms of completed text
const MS_PER_CHAR = 38;

const LINE1_TYPE_END = TYPE_START + LINE1_TEXT.length * MS_PER_CHAR;
// Line 2 starts right after line 1 finishes
const LINE2_TYPE_START = LINE1_TYPE_END;
const LINE2_TYPE_END = LINE2_TYPE_START + LINE2_TEXT.length * MS_PER_CHAR;

const FONT_FAMILY = '"Inter", system-ui, -apple-system, sans-serif';
const FONT_SIZE = 80;
const LINE_HEIGHT = Math.round(FONT_SIZE * 1.25);

// Position — left-aligned at x=120, vertically centered around y=430
const LEFT = 120;
const TOP = 430;

export function ComposerText() {
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // ── Line 1 typewriter ──
    if (text1Ref.current) {
      const elapsed = ms - TYPE_START;
      const count = elapsed < 0 ? 0 : Math.min(LINE1_TEXT.length, Math.floor(elapsed / MS_PER_CHAR));
      text1Ref.current.textContent = LINE1_TEXT.slice(0, count);
    }

    // ── Line 2 typewriter ──
    if (text2Ref.current) {
      const elapsed = ms - LINE2_TYPE_START;
      const count = elapsed < 0 ? 0 : Math.min(LINE2_TEXT.length, Math.floor(elapsed / MS_PER_CHAR));
      text2Ref.current.textContent = LINE2_TEXT.slice(0, count);
    }
  }, []);

  const cursorStyle: React.CSSProperties = {
    display: "inline-block",
    width: Math.round(FONT_SIZE * 0.55),
    height: Math.round(FONT_SIZE * 0.9),
    background: "#EEEADA",
    marginLeft: 4,
    verticalAlign: "text-bottom",
  };

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
        background: TRACE_MODE ? "transparent" : "#0A0A0A",
        overflow: "hidden",
      }}
    >
      <TraceLayer sceneStartMs={SCENE_START} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* Line 1 — cursor visible only while typing line 1, then vanishes for good */}
      <div
        style={{
          position: "absolute",
          left: LEFT,
          top: TOP,
          fontFamily: FONT_FAMILY,
          fontSize: FONT_SIZE,
          fontWeight: 400,
          lineHeight: `${LINE_HEIGHT}px`,
          color: "#EEEADA",
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
          zIndex: 1,
          display: "flex",
          alignItems: "baseline",
        }}
      >
        <span ref={text1Ref} />
        <span
          style={{
            ...cursorStyle,
            animation: [
              `cursor-appear 1ms ${TYPE_START}ms steps(1, end) both`,
              `cursor-vanish 1ms ${LINE1_TYPE_END}ms steps(1, end) forwards`,
            ].join(", "),
          }}
        />
      </div>

      {/* Line 2 — cursor appears when line 2 starts, blinks once typing settles */}
      <div
        style={{
          position: "absolute",
          left: LEFT,
          top: TOP + LINE_HEIGHT,
          fontFamily: FONT_FAMILY,
          fontSize: FONT_SIZE,
          fontWeight: 400,
          lineHeight: `${LINE_HEIGHT}px`,
          color: "#EEEADA",
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
          zIndex: 1,
          display: "flex",
          alignItems: "baseline",
        }}
      >
        <span ref={text2Ref} />
        <span
          style={{
            ...cursorStyle,
            animation: [
              `cursor-appear 1ms ${LINE2_TYPE_START}ms steps(1, end) both`,
              `cursor-blink 1000ms step-end infinite ${LINE2_TYPE_END + 100}ms`,
            ].join(", "),
          }}
        />
      </div>
    </Timegroup>
  );
}

ComposerText.duration = 2000;
