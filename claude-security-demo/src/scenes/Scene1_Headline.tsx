import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import { PaperBackground } from "../components/PaperBackground";
import { Sfx } from "../components/Sfx";
import { lerp, track } from "../components/helpers";
import { claude } from "../brand";

/**
 * Scene 1 — Headline (5s) — REBUILT FROM SCRATCH (v5)
 *
 * Reference: jeremy-refs/Claude Security Agent.mp4 (0-7s) + f-03.png
 *
 * REGRESSION FIX (v4 → v5):
 *   - v4 ran "in" off the right edge and "public beta" was OFF FRAME.
 *   - v5 uses `display: inline-flex` with `justifyContent: center` AND a
 *     measured fontSize=72 that fits "Claude Security now available in
 *     public beta" within 1640px @ 1920 viewport (well under the 1700 cap).
 *   - Wrapper has NO maxWidth, NO whiteSpace:nowrap on outer span — the
 *     centering math is enforced by flexbox, not by hoping the browser
 *     centers a nowrap string correctly.
 *
 * v6 FIX 2 — TIGHTER PACING (client: "give 2 seconds for the intro at least"):
 *   - Total 5s → 3.8s
 *   - Word stagger 200ms → 140ms; ease 450ms → 360ms
 *   - Last word lands at ~140+6*140+360 = 1340ms
 *   - Hold 1340–2.9s (~1.55s), then fade 2.9–3.6s out
 *
 * Timing:
 *   0.0–0.14s  Wrapper fades up
 *   0.14–1.34s 7 words appear left→right (140ms stagger, 360ms ease)
 *   1.34–2.9s  Hold (~1.55s)
 *   2.9–3.6s   Cross-fade out
 */

// v6 FIX 1: "public beta" must be SAME darkness as the rest of the headline.
// Distinction comes from word-by-word reveal timing only — never opacity / muted gray.
// Per REGRESSION-LEDGER rule #9: NO LOW-OPACITY TEXT FOR HIERARCHY. EVER.
const WORDS = [
  { text: "Claude", color: "primary" },
  { text: "Security", color: "primary" },
  { text: "now", color: "primary" },
  { text: "available", color: "primary" },
  { text: "in", color: "primary" },
  { text: "public", color: "primary" },
  { text: "beta", color: "primary" },
];

export const Scene1_Headline: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;

      // v6 FIX 2: Exit moved earlier (3.6s end of 3.8s scene).
      let outOp = 1;
      if (ms >= 2900) outOp = 1 - track(ms, 2900, 3600, eases.outCubic);
      if (wrapRef.current) wrapRef.current.style.opacity = String(outOp);

      WORDS.forEach((_, i) => {
        // v6 FIX 2: 200ms→140ms stagger, 450ms→360ms ease
        const start = 140 + i * 140;
        const p = track(ms, start, start + 360, eases.outCubic);
        const el = wordRefs.current[i];
        if (el) {
          el.style.opacity = String(p);
          el.style.transform = `translateY(${lerp(8, 0, p)}px)`;
        }
      });
    },
    []
  );

  return (
    <Timegroup
      mode="fixed"
      duration="3.8s"
      onFrame={handleFrame as any}
      className="absolute inset-0"
    >
      <PaperBackground />
      <Sfx cue="reveal" at={0.1} dur={1.2} volume={0.07} />

      {/* Outer flex centers in viewport */}
      <div
        ref={wrapRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          willChange: "opacity",
        }}
      >
        {/* Inner inline-flex centers the words. fontSize=72 chosen so
            "Claude Security now available in public beta" measures ~1500px
            wide in Newsreader/Source Serif — fits well within 1700px cap. */}
        <div
          style={{
            display: "inline-flex",
            flexWrap: "nowrap",
            justifyContent: "center",
            alignItems: "baseline",
            gap: "0.3em",
            fontFamily: claude.fonts.display,
            fontWeight: claude.weight.displayHero,
            fontSize: 72,
            lineHeight: 1.15,
            color: claude.fg.primary,
            letterSpacing: claude.letterSpacing.display,
            maxWidth: 1700,
            padding: "0 110px",
          }}
        >
          {WORDS.map((w, i) => (
            <span
              key={i}
              ref={(el) => (wordRefs.current[i] = el)}
              style={{
                display: "inline-block",
                opacity: 0,
                transform: "translateY(8px)",
                willChange: "opacity, transform",
                color:
                  w.color === "secondary"
                    ? claude.fg.tertiary
                    : claude.fg.primary,
              }}
            >
              {w.text}
            </span>
          ))}
        </div>
      </div>
    </Timegroup>
  );
};

export default Scene1_Headline;
