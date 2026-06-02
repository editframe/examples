/**
 * Scene 3 — "Build your own agents with Composer 2.5" (7000–9000ms)
 *
 * FIX 3: Add char-by-char typewriter animation.
 * KEEP: font-weight 400, left-aligned ~x=120, serif/sans size, color #EEEADA
 * KEEP: two-line layout — "Build your own agents with" + "Composer 2.5"
 *
 * Typewriter: Line 1 types out first, then Line 2 starts immediately after
 * Line 1 finishes (no gap). Blinking cursor on the active typing line.
 */

import React, { useRef, useCallback } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { clamp } from "../components/helpers";

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

export function Scene3_ComposerText() {
  const text1Ref  = useRef<HTMLSpanElement>(null);
  const text2Ref  = useRef<HTMLSpanElement>(null);
  const cursor1Ref = useRef<HTMLSpanElement>(null);
  const cursor2Ref = useRef<HTMLSpanElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // ── Line 1 typewriter ──
    if (text1Ref.current) {
      const elapsed = ms - TYPE_START;
      const count = elapsed < 0 ? 0 : Math.min(LINE1_TEXT.length, Math.floor(elapsed / MS_PER_CHAR));
      text1Ref.current.textContent = LINE1_TEXT.slice(0, count);
    }

    // ── Line 1 cursor: visible while typing line 1, hidden once line 2 starts ──
    if (cursor1Ref.current) {
      const typingLine1 = ms >= TYPE_START && ms < LINE1_TYPE_END;
      cursor1Ref.current.style.opacity = typingLine1 ? "1" : "0";
    }

    // ── Line 2 typewriter ──
    if (text2Ref.current) {
      const elapsed = ms - LINE2_TYPE_START;
      const count = elapsed < 0 ? 0 : Math.min(LINE2_TEXT.length, Math.floor(elapsed / MS_PER_CHAR));
      text2Ref.current.textContent = LINE2_TEXT.slice(0, count);
    }

    // ── Line 2 cursor: visible while typing line 2, blinks after done ──
    if (cursor2Ref.current) {
      if (ms < LINE2_TYPE_START) {
        cursor2Ref.current.style.opacity = "0";
      } else if (ms < LINE2_TYPE_END + 100) {
        cursor2Ref.current.style.opacity = "1";
      } else {
        const blinkCycle = Math.floor((ms - LINE2_TYPE_END) / 500) % 2;
        cursor2Ref.current.style.opacity = blinkCycle === 0 ? "1" : "0";
      }
    }
  }, []);

  const cursorStyle: React.CSSProperties = {
    display: "inline-block",
    width: Math.round(FONT_SIZE * 0.55),
    height: Math.round(FONT_SIZE * 0.9),
    background: "#EEEADA",
    marginLeft: 4,
    verticalAlign: "text-bottom",
    opacity: 0,
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

      {/* Line 1 */}
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
        <span ref={cursor1Ref} style={cursorStyle} />
      </div>

      {/* Line 2 */}
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
        <span ref={cursor2Ref} style={cursorStyle} />
      </div>
    </Timegroup>
  );
}

Scene3_ComposerText.duration = 2000;
