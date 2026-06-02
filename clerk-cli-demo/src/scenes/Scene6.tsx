/**
 * Scene 6 — "Put your agent / in control." tagline
 * Master time: 10000–12000ms (duration 2000ms) — shifted -1500ms per FIX 2
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
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { track } from "../components/helpers";

const SCENE_START = 10000;
const DURATION = 2000;

const LINE1_START = 200;
const LINE1_END = 500;
const LINE2_START = 400;
const LINE2_END = 700;

export function Scene6() {
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    if (line1Ref.current) {
      const t = track(ms, LINE1_START, LINE1_END);
      line1Ref.current.style.opacity = `${t}`;
      line1Ref.current.style.transform = `translateY(${(1 - t) * 16}px)`;
    }
    if (line2Ref.current) {
      const t = track(ms, LINE2_START, LINE2_END);
      line2Ref.current.style.opacity = `${t}`;
      line2Ref.current.style.transform = `translateY(${(1 - t) * 16}px)`;
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration={`${DURATION}ms`}
      onFrame={onFrame as any}
      style={{
        position: "relative",
        width: 1920,
        height: 1080,
        overflow: "hidden",
        background: "#000000",
      }}
    >
      <TraceLayer sceneStartMs={SCENE_START} enabled={TRACE_MODE} opacity={0.5} />

      {/* Tagline block — left-aligned starting around x=240 (matches reference) */}
      <div
        style={{
          position: "absolute",
          left: 240,
          top: 380,
        }}
      >
        <div
          ref={line1Ref}
          style={{
            fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
            fontSize: 96,
            fontWeight: 600,
            color: "#FFFFFF",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            opacity: 0,
            transform: "translateY(16px)",
          }}
        >
          Put your agent
        </div>
        <div
          ref={line2Ref}
          style={{
            fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
            fontSize: 96,
            fontWeight: 500,
            color: "#888888",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            opacity: 0,
            transform: "translateY(16px)",
          }}
        >
          in control.
        </div>
      </div>
    </Timegroup>
  );
}

Scene6.duration = DURATION;
