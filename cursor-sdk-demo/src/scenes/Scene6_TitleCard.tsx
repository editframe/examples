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
 */

import React, { useRef, useCallback } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { clamp } from "../components/helpers";

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
  const cursorRef = useRef<HTMLSpanElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // Typewriter
    if (textRef.current) {
      const elapsed = ms - TYPE_START;
      const charCount = elapsed < 0 ? 0 : Math.min(
        FULL_TEXT.length,
        Math.floor(elapsed / CHAR_DELAY)
      );
      textRef.current.textContent = FULL_TEXT.slice(0, charCount);
    }

    // Blinking cursor
    if (cursorRef.current) {
      const isTyping = ms < TYPE_END + 100;
      if (isTyping) {
        cursorRef.current.style.opacity = "1";
      } else {
        // Blink at ~1Hz
        const blinkCycle = Math.floor((ms - TYPE_END) / 500) % 2;
        cursorRef.current.style.opacity = blinkCycle === 0 ? "1" : "0";
      }
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
          {/* Block cursor */}
          <span
            ref={cursorRef}
            style={{
              display: "inline-block",
              width: 8,
              height: FONT_SIZE * 0.85,
              background: "#111111",
              marginLeft: 4,
              verticalAlign: "text-bottom",
              opacity: 0,
            }}
          />
        </div>
      </div>
    </Timegroup>
  );
}

Scene6_TitleCard.duration = SCENE_DUR;
