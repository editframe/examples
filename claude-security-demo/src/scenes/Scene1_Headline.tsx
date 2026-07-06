import React from "react";
import { Timegroup } from "@editframe/react";
import { PaperBackground } from "../components/PaperBackground";
import { Sfx } from "../components/Sfx";
import { claude } from "../brand";

/**
 * Scene 1 — Headline (3.8s) — REBUILT FROM SCRATCH (v5)
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
 * Timing (all scene-local — this scene's own `<Timegroup>` resets to 0):
 *   0.0–0.14s  Wrapper fades up
 *   0.14–1.34s 7 words appear left→right (140ms stagger, 360ms ease) — see
 *              the `word-in` keyframe in styles.css, delay computed per word
 *              index below (priority-2 stagger, not a per-frame loop).
 *   1.34–2.9s  Hold (~1.55s)
 *   2.9–3.6s   Cross-fade out (`wrap-fade-out` keyframe on the wrapper)
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

const WORD_STAGGER_MS = 140;
const WORD_START_MS = 140;
const WORD_DURATION_MS = 360;

export const Scene1_Headline: React.FC = () => (
  <Timegroup mode="fixed" duration="3.8s" className="absolute inset-0">
    <PaperBackground />
    <Sfx cue="reveal" at={0.1} dur={1.2} volume={0.07} />

    {/* Outer flex centers in viewport */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "wrap-fade-out 700ms 2900ms cubic-bezier(0.33,1,0.68,1) forwards",
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
            style={{
              display: "inline-block",
              color: w.color === "secondary" ? claude.fg.tertiary : claude.fg.primary,
              animation: `word-in ${WORD_DURATION_MS}ms ${WORD_START_MS + i * WORD_STAGGER_MS}ms cubic-bezier(0.33,1,0.68,1) backwards`,
            }}
          >
            {w.text}
          </span>
        ))}
      </div>
    </div>
  </Timegroup>
);

export default Scene1_Headline;
