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
 * STACK-UP ANIMATION (preserved):
 *   Each new output line spawns at ANCHOR_Y and existing lines push upward.
 *   The block container is centered horizontally (left:50% + transform translateX(-50%))
 *   but internal flex direction is column with align-items: flex-start.
 *
 * LINES:
 *   1. $ uv add cursor-sdk (white)
 *   2. Resolved 9 packages in 0.3s (dim gray)
 *   3. Prepared 7 packages in 1.8s  (dim gray)
 *   4. Installed 8 packages in 0.1s (slightly brighter gray)
 *   5.   + cursor-sdk==0.5.0         (orange #D87757)
 */

import React, { useRef, useCallback } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { track, clamp } from "../components/helpers";
import { eases } from "animejs";

// ─── Timing ───────────────────────────────────────────────────────
const SCENE_START = 0;
const SCENE_DUR = 5500;

const TYPE_START = 200;
const COMMAND_FULL = "uv add cursor-sdk";
const MS_PER_CHAR = 70;
const TYPE_END = TYPE_START + COMMAND_FULL.length * MS_PER_CHAR; // ~1530ms

// Output lines — spawn sequentially, push prior lines up
const OUTPUT_LINES = [
  { text: "Resolved 9 packages in 0.3s", color: "#888888", spawnAt: 1700 },
  { text: "Prepared 7 packages in 1.8s",  color: "#888888", spawnAt: 2400 },
  { text: "Installed 8 packages in 0.1s", color: "#AAAAAA", spawnAt: 3100 },
  { text: " + cursor-sdk==0.5.0",         color: "#D87757", spawnAt: 3800 },
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

export function Scene1_2_Terminal() {
  // Ref for the prompt-line inner div (gets Y translate)
  const promptInnerRef = useRef<HTMLDivElement>(null);
  // Refs for each output line inner div (gets Y translate + opacity)
  const lineInnerRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  // Ref for the typed command text
  const commandRef = useRef<HTMLSpanElement>(null);
  // Ref for the block cursor
  const cursorRef = useRef<HTMLSpanElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // ── Typing animation ──
    if (commandRef.current) {
      const elapsed = ms - TYPE_START;
      const charCount = elapsed < 0 ? 0 : Math.min(COMMAND_FULL.length, Math.floor(elapsed / MS_PER_CHAR));
      commandRef.current.textContent = COMMAND_FULL.slice(0, charCount);
    }

    // ── Cursor blink ──
    if (cursorRef.current) {
      const afterOutput = ms > OUTPUT_LINES[0].spawnAt + 300;
      const isTyping = ms >= TYPE_START && ms < TYPE_END + 200;
      if (afterOutput) {
        cursorRef.current.style.opacity = "0";
      } else if (isTyping) {
        cursorRef.current.style.opacity = "1";
      } else {
        const blinkCycle = Math.floor((ms - TYPE_END) / 500) % 2;
        cursorRef.current.style.opacity = blinkCycle === 0 ? "1" : "0";
      }
    }

    // ── Stack-up logic ──
    const spawnedCount = OUTPUT_LINES.filter(l => ms >= l.spawnAt).length;

    // Command row shifts up by spawnedCount * LINE_HEIGHT
    if (promptInnerRef.current) {
      promptInnerRef.current.style.transform = `translateY(${-spawnedCount * LINE_HEIGHT}px)`;
    }

    OUTPUT_LINES.forEach((line, i) => {
      const el = lineInnerRefs[i].current;
      if (!el) return;

      if (ms < line.spawnAt) {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        return;
      }

      // depth = how far above the "anchor" (newest = 0, oldest pushed highest)
      const depth = spawnedCount - 1 - i;
      const targetY = -depth * LINE_HEIGHT;

      const fadeP = track(ms, line.spawnAt, line.spawnAt + 250, eases.outCubic);
      el.style.opacity = String(fadeP);
      el.style.transform = `translateY(${targetY}px)`;
    });
  }, []);

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

      {/* BLOCK CONTAINER — centered in frame, left-aligned internally */}
      <div style={outerStyle}>

        {/* Command row */}
        <div style={rowWrapStyle}>
          <div
            ref={promptInnerRef}
            style={{
              ...textBaseStyle,
              display: "flex",
              alignItems: "baseline",
              zIndex: 2,
            }}
          >
            <span style={{ color: "#888888", marginRight: 14 }}>$</span>
            <span ref={commandRef} style={{ color: "#F0F0F0", fontWeight: 400 }} />
            <span
              ref={cursorRef}
              style={{
                display: "inline-block",
                width: Math.round(FONT_SIZE * 0.55),
                height: FONT_SIZE + 4,
                background: "#F0F0F0",
                marginLeft: 3,
                verticalAlign: "text-bottom",
                opacity: 0,
              }}
            />
          </div>
        </div>

        {/* Output lines */}
        {OUTPUT_LINES.map((line, i) => (
          <div key={i} style={rowWrapStyle}>
            <div
              ref={lineInnerRefs[i]}
              style={{
                ...textBaseStyle,
                color: line.color,
                fontWeight: line.color === "#D87757" ? 500 : 400,
                opacity: 0,
                transform: "translateY(20px)",
                zIndex: 1,
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
