/**
 * Scene 6 — "Put your agent / in control." tagline
 * Local time: 0–2000ms (scene-local; was master 10000–12000ms)
 *
 * USER SAID: "I have no comments on the 'put your agent in control' scene.
 * I think that one's really well done, so don't change that."
 *
 * KEEP EXACTLY:
 * - Dark bg (#1A1A1F)
 * - Line 1: "Put your agent" — white, bold, ~96px, Inter
 * - Line 2: "in control." — #888, slightly smaller ~80px
 * - Slightly left-of-center horizontal position (matches reference frame_12)
 * - Quick fade-in ~300ms, hold ~1500ms
 *
 * Converted from a per-frame onFrame/useRef opacity+translateY mutation to
 * the declarative `Reveal` component (REFACTOR-PATTERNS.md Part 2b, priority
 * 1) — same [delay,end] windows, same ease-out-cubic curve, now driven by a
 * CSS `@keyframes` instead of JS.
 */
import React from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { fonts } from "../lib/colors";
import { Reveal } from "@shared/components/Reveal";

const SCENE_START = 10000;
const DURATION = 2000;

const LINE1_START = 200;
const LINE1_END = 500;
const LINE2_START = 400;
const LINE2_END = 700;

export function Tagline() {
  return (
    <Timegroup
      mode="fixed"
      duration={`${DURATION}ms`}
      style={{
        position: "relative",
        width: 1920,
        height: 1080,
        overflow: "hidden",
        background: "#000000",
      }}
    >
      <TraceLayer sceneStartMs={SCENE_START} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* Tagline block — left-aligned starting around x=240 (matches reference) */}
      <div style={{ position: "absolute", left: 240, top: 380 }}>
        <Reveal
          enter={[LINE1_START, LINE1_END]}
          y={16}
          style={{
            fontFamily: fonts.sans,
            fontSize: 96,
            fontWeight: 600,
            color: "#FFFFFF",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          Put your agent
        </Reveal>
        <Reveal
          enter={[LINE2_START, LINE2_END]}
          y={16}
          style={{
            fontFamily: fonts.sans,
            fontSize: 96,
            fontWeight: 500,
            color: "#888888",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          in control.
        </Reveal>
      </div>
    </Timegroup>
  );
}

Tagline.duration = DURATION;
