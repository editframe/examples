/**
 * Scene 7 — "Now available in Python and TypeScript" (22000–24000ms)
 *
 * Reference (frame_24s):
 *   - White background (#FFFFFF)
 *   - Text: "Now available in Python and TypeScript"
 *   - Font: Inter / system-ui, font-weight 400 (NOT bold)
 *   - Font size: ~72px
 *   - Animation: typed out character-by-character (~45ms per char),
 *     blinking cursor at end
 *   - Centered horizontally and vertically
 *
 * Same cursor/text split as Scene6_TitleCard — see that file's comment for why the
 * cursor is CSS (`cursor-blink`) but the character reveal stays a scoped `addFrameTask`
 * (proportional Inter font).
 */

import React, { useRef, useCallback } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";

const SCENE_START = 20500; // FIX 1: shifted -1500ms
const SCENE_DUR = 2000;

const FULL_TEXT = "Now available in Python and TypeScript";
const CHAR_DELAY = 45; // ms per character
const TYPE_START = 150;
const TYPE_END = TYPE_START + FULL_TEXT.length * CHAR_DELAY; // ~1860ms

const FONT_FAMILY = '"Inter", system-ui, -apple-system, "Helvetica Neue", sans-serif';
const FONT_SIZE = 72;

export function Scene7_NowAvailable() {
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
            letterSpacing: "-0.01em",
            lineHeight: 1,
          }}
        >
          <span ref={textRef} />
          <span
            style={{
              display: "inline-block",
              width: 6,
              height: FONT_SIZE * 0.85,
              background: "#111111",
              marginLeft: 3,
              verticalAlign: "text-bottom",
              animation: `cursor-blink 1000ms step-end infinite ${TYPE_END}ms backwards`,
            }}
          />
        </div>
      </div>
    </Timegroup>
  );
}

Scene7_NowAvailable.duration = SCENE_DUR;
