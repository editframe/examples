/**
 * Scene 2 — "Introducing new agent templates for financial services" (6500–10000ms)
 *
 * FIX 2 (Round 5): WORD-BY-WORD FADE-IN (not typing, not pop)
 *   - Each word fades in independently, left→right, staggered ~160ms
 *   - Words: ["Introducing", "new", "agent", "templates", "for", "financial", "services"]
 *   - Total word fade-in completes by ~1800ms scene-local
 *   - Hold until ~2200ms
 *   - SLIDES UP: translateY 0→-200px + opacity 1→0 over 800ms
 *   - As text slides up, Scene 3 pills rise from below
 *
 * Duration: 3500ms  (master 6500–10000ms)
 * Serif, font-weight 400, dark #1A1410, size 68px, centered
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TraceLayer } from "../components/TraceLayer";
import { track, lerp } from "../components/helpers";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { eases } from "animejs";

export const SCENE2_START = 6500;
export const SCENE2_DURATION = 3500;

// Words split for individual reveal
const WORDS_LINE1 = ["Introducing", "new", "agent", "templates"];
const WORDS_LINE2 = ["for", "financial", "services"];
const ALL_WORDS = [...WORDS_LINE1, ...WORDS_LINE2];
const WORD_STAGGER_MS = 160;
const WORD_FADE_DUR_MS = 180;

export function Scene2_IntroHeadline(): React.ReactElement {
  // One ref per word span
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // ─── Word-by-word fade in (0 → ~1800ms) ───
    ALL_WORDS.forEach((_, i) => {
      const el = wordRefs.current[i];
      if (!el) return;
      const wordStart = i * WORD_STAGGER_MS;
      const wordEnd   = wordStart + WORD_FADE_DUR_MS;
      const p = track(ms, wordStart, wordEnd, eases.outCubic);
      el.style.opacity = String(p);
    });

    // ─── Slide UP exit (2700–3500ms) ───
    if (containerRef.current) {
      const slideT = track(ms, 2700, 3500, eases.inCubic);
      const ty = lerp(0, -220, slideT);
      const opacity = Math.max(0, 1 - slideT * 1.2);
      containerRef.current.style.transform = `translateY(${ty}px)`;
      containerRef.current.style.opacity = String(opacity);
    }
  }, []);

  let wordIdx = 0;

  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE2_DURATION}ms`}
      onFrame={onFrame as any}
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0, width: 1920, height: 1080, overflow: "hidden" }}
    >
      <TraceLayer sceneStartMs={SCENE2_START} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* Background */}
      {!TRACE_MODE && (
        <div style={{ position: "absolute", inset: 0, background: "#EAE8DE", zIndex: 1 }} />
      )}

      {/* Headline container — animated as a whole for slide-up exit */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          willChange: "transform, opacity",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontFamily: "'Newsreader', 'EB Garamond', Georgia, serif",
            fontWeight: 400,
            fontSize: 68,
            lineHeight: 1.4,
            color: "#1A1410",
            letterSpacing: "-0.01em",
          }}
        >
          {/* Line 1 */}
          <div style={{ display: "flex", justifyContent: "center", gap: "0.3em", flexWrap: "nowrap" }}>
            {WORDS_LINE1.map((word) => {
              const idx = wordIdx++;
              return (
                <span
                  key={`w1-${idx}`}
                  ref={el => { wordRefs.current[idx] = el; }}
                  style={{ opacity: 0, display: "inline-block" }}
                >
                  {word}
                </span>
              );
            })}
          </div>
          {/* Line 2 */}
          <div style={{ display: "flex", justifyContent: "center", gap: "0.3em", flexWrap: "nowrap" }}>
            {WORDS_LINE2.map((word) => {
              const idx = wordIdx++;
              return (
                <span
                  key={`w2-${idx}`}
                  ref={el => { wordRefs.current[idx] = el; }}
                  style={{ opacity: 0, display: "inline-block" }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </Timegroup>
  );
}

Scene2_IntroHeadline.duration = SCENE2_DURATION;

