/**
 * Scene 6 — Title Card "Cursor SDK" (20000–22000ms)
 *
 * Reference (frame_21s, frame_22s):
 *   - White background (#FFFFFF)
 *   - Text: "Cursor SDK" (two words) in black (#111111)
 *   - Font: Inter / system-ui, font-weight 400 (NOT bold)
 *   - Font size: ~100px
 *   - Animation: typed out character-by-character (~70ms per char),
 *     with a blinking block cursor that persists at end
 *   - Centered both horizontally and vertically
 *   - The bg transitions from dark (coming from Scene 5's fade-out) to white instantly at start
 *
 * The cursor is now the shared CSS `cursor-blink` keyframe (see styles.css): a
 * `backwards`-filled infinite blink whose delay covers the "solid while typing" window
 * for free (see that keyframe's own comment). The character reveal itself stays a scoped
 * `addFrameTask` — Inter is a proportional font, so a `ch`-unit CSS clip (safe for the
 * monospace terminal scenes) would risk clipping mid-glyph here.
 */

import React, { useRef, useCallback } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";

const SCENE_START = 18500; // FIX 1: shifted -1500ms
const SCENE_DUR = 2000;

const FULL_TEXT = "Cursor SDK";
const CHAR_DELAY = 70; // ms per character
const TYPE_START = 200;
const TYPE_END = TYPE_START + FULL_TEXT.length * CHAR_DELAY; // ~900ms

const FONT_FAMILY = '"Inter", system-ui, -apple-system, "Helvetica Neue", sans-serif';
const FONT_SIZE = 100;

export function Scene6_TitleCard() {
  const textRef = useRef<HTMLSpanElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    if (textRef.current) {
      const elapsed = ms - TYPE_START;
      const charCount = elapsed < 0 ? 0 : Math.min(FULL_TEXT.length, Math.floor(elapsed / CHAR_DELAY));
      textRef.current.textContent = FULL_TEXT.slice(0, charCount);
    }
  }, []);

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
        background: TRACE_MODE ? "transparent" : "#FFFFFF",
        overflow: "hidden",
      }}
    >
      <TraceLayer sceneStartMs={SCENE_START} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* Centered text */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontFamily: FONT_FAMILY,
            fontSize: FONT_SIZE,
            fontWeight: 400,
            color: "#111111",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          <span ref={textRef} />
          {/* Block cursor — solid during the delay (backwards fill), blinks after */}
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: FONT_SIZE * 0.85,
              background: "#111111",
              marginLeft: 4,
              verticalAlign: "text-bottom",
              animation: `cursor-blink 1000ms step-end infinite ${TYPE_END}ms backwards`,
            }}
          />
        </div>
      </div>
    </Timegroup>
  );
}

Scene6_TitleCard.duration = SCENE_DUR;
