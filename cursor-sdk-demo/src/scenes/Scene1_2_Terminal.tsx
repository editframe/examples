/**
 * Scene 1+2 — Terminal Install (0–5500ms)
 *
 * FIX 1 (round-5):
 *   - Font size bumped from 52px → 60px
 *   - LEFT-ALIGN: all lines share the same left edge.
 *     The block of text is centered in the frame, but within the block
 *     every line is left-justified (flex-start), so the left edge of each
 *     line aligns to a common X coordinate. Right edges vary by line length.
 *     This matches the reference video layout.
 *
 * STACK-UP ANIMATION (preserved, now CSS):
 *   Each new output line spawns at ANCHOR_Y and existing lines push upward.
 *   The block container is centered horizontally (left:50% + transform translateX(-50%))
 *   but internal flex direction is column with align-items: flex-start.
 *
 *   Every line's resting Y only ever changes at another line's fixed `spawnAt`, so the
 *   whole stack-up is a deterministic step function — precomputed once (see the
 *   `term-prompt-shift` / `term-lineN-stack` keyframes in styles.css, derived from
 *   OUTPUT_LINES + LINE_HEIGHT) instead of read from a ref every frame.
 *
 * TYPEWRITER (now CSS): JetBrains Mono is a real monospace font, so the "$ uv add
 * cursor-sdk" command reveals via a `width: 0 → 18ch` clip in `steps(18, end)` — exact,
 * no per-character textContent mutation needed.
 *
 * LINES:
 *   1. $ uv add cursor-sdk (white)
 *   2. Resolved 9 packages in 0.3s (dim gray)
 *   3. Prepared 7 packages in 1.8s  (dim gray)
 *   4. Installed 8 packages in 0.1s (slightly brighter gray)
 *   5.   + cursor-sdk==0.5.0         (orange #D87757)
 */

import React from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";

// ─── Timing ───────────────────────────────────────────────────────
const SCENE_START = 0;
const SCENE_DUR = 5500;

const TYPE_START = 200;
const COMMAND_FULL = "uv add cursor-sdk";
const MS_PER_CHAR = 70;
const TYPE_END = TYPE_START + COMMAND_FULL.length * MS_PER_CHAR; // ~1530ms

// Output lines — spawn sequentially, push prior lines up. `stackKeyframe` is the
// precomputed CSS keyframe (see styles.css) for this line's own step-function Y offset;
// the last line never gets pushed, so it has none (stays at translateY(0)).
const OUTPUT_LINES = [
  { text: "Resolved 9 packages in 0.3s", color: "#888888", spawnAt: 1700, stackKeyframe: "term-line0-stack" },
  { text: "Prepared 7 packages in 1.8s",  color: "#888888", spawnAt: 2400, stackKeyframe: "term-line1-stack" },
  { text: "Installed 8 packages in 0.1s", color: "#AAAAAA", spawnAt: 3100, stackKeyframe: "term-line2-stack" },
  { text: " + cursor-sdk==0.5.0",         color: "#D87757", spawnAt: 3800, stackKeyframe: null },
] as const;

const FONT_FAMILY = '"JetBrains Mono", "SF Mono", "Menlo", "Consolas", monospace';
const FONT_SIZE = 60; // FIX 1: bumped from 52px
const LINE_HEIGHT = Math.round(FONT_SIZE * 1.45); // ~87px

// Vertical anchor — the "current line" Y position (all lines start here and push up)
const ANCHOR_Y = 490;

// Width of the block container — wide enough for the longest line
// "Resolved 9 packages in 0.3s" at 60px monospace ≈ 28 chars * ~36px/char ≈ 1010px
// Give it 1100px to be safe; block will be centered in 1920px frame
const BLOCK_WIDTH = 1100;

// Cursor: solid while typing, blinks after, disappears for good once real output starts.
const CURSOR_BLINK_START = TYPE_END + 200;
const CURSOR_VANISH_AT = OUTPUT_LINES[0].spawnAt + 300;

export function Scene1_2_Terminal() {
  // ─── Styles ───────────────────────────────────────────────────────
  // Outer container: full-frame absolute, used to center the block horizontally
  const outerStyle: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: ANCHOR_Y,
    transform: "translateX(-50%)",
    width: BLOCK_WIDTH,
    // Each row inside is positioned absolutely so they can overlap at the anchor
    pointerEvents: "none",
  };

  // Each row inside the block is absolutely positioned so the stack-up translateY works
  const rowWrapStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start", // LEFT ALIGN — all lines share same left edge
  };

  const textBaseStyle: React.CSSProperties = {
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZE,
    lineHeight: `${LINE_HEIGHT}px`,
    letterSpacing: 0,
    whiteSpace: "nowrap",
    willChange: "transform, opacity",
  };

  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE_DUR}ms`}
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

      {/* BLOCK CONTAINER — centered in frame, left-aligned internally */}
      <div style={outerStyle}>

        {/* Command row */}
        <div style={rowWrapStyle}>
          <div
            style={{
              ...textBaseStyle,
              display: "flex",
              alignItems: "baseline",
              zIndex: 2,
              animation: `term-prompt-shift ${SCENE_DUR}ms linear both`,
            }}
          >
            <span style={{ color: "#888888", marginRight: 14 }}>$</span>
            <span
              style={{
                display: "inline-block",
                overflow: "hidden",
                verticalAlign: "bottom",
                whiteSpace: "nowrap",
                width: `${COMMAND_FULL.length}ch`,
                animation: `typewriter-reveal ${COMMAND_FULL.length * MS_PER_CHAR}ms steps(${COMMAND_FULL.length}, end) ${TYPE_START}ms both`,
              }}
            >
              <span style={{ color: "#F0F0F0", fontWeight: 400 }}>{COMMAND_FULL}</span>
            </span>
            <span
              style={{
                display: "inline-block",
                width: Math.round(FONT_SIZE * 0.55),
                height: FONT_SIZE + 4,
                background: "#F0F0F0",
                marginLeft: 3,
                verticalAlign: "text-bottom",
                animation: [
                  `cursor-blink 1000ms step-end infinite ${CURSOR_BLINK_START}ms backwards`,
                  `cursor-vanish 1ms ${CURSOR_VANISH_AT}ms steps(1, end) forwards`,
                ].join(", "),
              }}
            />
          </div>
        </div>

        {/* Output lines */}
        {OUTPUT_LINES.map((line, i) => (
          <div key={i} style={rowWrapStyle}>
            <div
              style={{
                ...textBaseStyle,
                color: line.color,
                fontWeight: line.color === "#D87757" ? 500 : 400,
                zIndex: 1,
                animation: [
                  `term-fade-in 250ms ${line.spawnAt}ms cubic-bezier(0.33,1,0.68,1) both`,
                  ...(line.stackKeyframe ? [`${line.stackKeyframe} ${SCENE_DUR - line.spawnAt}ms ${line.spawnAt}ms linear both`] : []),
                ].join(", "),
              }}
            >
              {line.text}
            </div>
          </div>
        ))}

      </div>
    </Timegroup>
  );
}

Scene1_2_Terminal.duration = 5500;
