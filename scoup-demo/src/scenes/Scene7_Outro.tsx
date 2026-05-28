import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import { ScoupLogo } from "../components/ScoupLogo";
import { PaperBackground } from "../components/PaperBackground";
import { Sfx } from "../components/Sfx";

/**
 * Scene 7 — Outro (4s) — NOVEL ending, not a logo echo
 *
 * The "front page" closes. A large pull-quote sits as the headline, the
 * Scoup mark settles as the byline, the gold rule draws across, and a small
 * publication signature finishes the page. Feels like the back-of-the-front-
 * page of a real newspaper — old-money, editorial finish.
 *
 * Animation libs:
 *   AnimeJS easings — outQuart for entrance + line draw
 *   Advanced CSS — paper, hairline rule, drop-cap typography, scoup-yellow
 *                  underline draw
 *
 * Beat (ms):
 *   0–800        Pull quote types in (drop-cap + first line)
 *   800–1600     Pull quote second line
 *   1600–2200    Yellow rule draws across
 *   2000–2800    Scoup byline + publication metadata fades in
 *   2800–4000    Hold + ink-darkens vignette finish
 */

const PULLQUOTE_A = "Every newsroom asks the same question.";
const PULLQUOTE_B = "Scoup asks it five different ways.";

const clamp = (n: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const track = (
  ms: number,
  startMs: number,
  endMs: number,
  easeFn: (t: number) => number = eases.outCubic
) => easeFn(clamp((ms - startMs) / (endMs - startMs)));

function typewriter(ms: number, start: number, dur: number, text: string) {
  const p = clamp((ms - start) / dur);
  return text.slice(0, Math.floor(p * text.length));
}

export const Scene7_Outro: React.FC = () => {
  const labelRef = useRef<HTMLDivElement>(null);
  const lineARef = useRef<HTMLDivElement>(null);
  const lineBRef = useRef<HTMLDivElement>(null);
  const lineBUnderRef = useRef<HTMLSpanElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const bylineRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;

      // Section label
      const lP = track(ms, 0, 500, eases.outQuart);
      if (labelRef.current) {
        labelRef.current.style.opacity = String(lP);
        labelRef.current.style.transform = `translateY(${lerp(-10, 0, lP)}px)`;
      }

      // Line A type-on
      if (lineARef.current) {
        lineARef.current.textContent = typewriter(ms, 200, 700, PULLQUOTE_A);
      }

      // Line B type-on
      if (lineBRef.current) {
        const text = typewriter(ms, 900, 700, PULLQUOTE_B);
        // Split: keep "Scoup asks it" plain, underline the rest dynamically with span
        // Easiest: render plain text, drive an underline div under the whole line
        lineBRef.current.textContent = text;
      }
      // Underline on line B
      const uP = track(ms, 1500, 2200, eases.outQuart);
      if (lineBUnderRef.current) {
        lineBUnderRef.current.style.transform = `scaleX(${uP})`;
        lineBUnderRef.current.style.opacity = String(uP);
      }

      // Rule draws across
      const rP = track(ms, 1700, 2400, eases.outQuart);
      if (ruleRef.current) {
        ruleRef.current.style.transform = `scaleX(${rP})`;
        ruleRef.current.style.opacity = String(rP * 0.55);
      }

      // Byline + meta
      const bP = track(ms, 2000, 2800, eases.outQuart);
      if (bylineRef.current) {
        bylineRef.current.style.opacity = String(bP);
        bylineRef.current.style.transform = `translateY(${lerp(10, 0, bP)}px)`;
      }
      const mP = track(ms, 2200, 3000, eases.outQuart);
      if (metaRef.current) {
        metaRef.current.style.opacity = String(mP);
      }

      // Vignette ink-darkens at the end
      const vP = track(ms, 3000, 4000, eases.outQuart);
      if (vignetteRef.current) {
        vignetteRef.current.style.opacity = String(vP * 0.5);
      }
    },
    []
  );

  return (
    <Timegroup
      mode="fixed"
      duration="4s"
      onFrame={handleFrame as any}
      className="absolute inset-0 flex items-center justify-center"
    >
      <PaperBackground />

      {/* SFX — soft tones as text types, ping when underline draws, gentle success at byline */}
      <Sfx cue="plop" at={0.30} dur={0.55} volume={0.40} />
      <Sfx cue="plop" at={1.00} dur={0.55} volume={0.40} />
      <Sfx cue="reveal" at={1.50} dur={1.3} volume={0.45} />
      <Sfx cue="success" at={2.10} dur={1.0} volume={0.45} />

      <div
        style={{
          position: "relative",
          width: 1300,
          padding: "0 80px",
          zIndex: 10,
        }}
      >
        {/* Section label */}
        <div
          className="scene-label"
          ref={labelRef}
          style={{
            color: "rgba(25,25,24,0.55)",
            opacity: 0,
            marginBottom: 28,
            textAlign: "left",
          }}
        >
          The Edition · End Page
        </div>

        {/* Pull quote line A */}
        <div
          ref={lineARef}
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 84,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "#191918",
            marginBottom: 4,
          }}
        />

        {/* Pull quote line B with underline */}
        <div style={{ position: "relative", display: "inline-block", paddingBottom: 22 }}>
          <div
            ref={lineBRef}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 84,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "#191918",
              position: "relative",
              zIndex: 1,
            }}
          />
          {/* Yellow bar sits BELOW the descender baseline of the text — clean stripe under the text */}
          <span
            ref={lineBUnderRef}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 12,
              background: "#F5C518",
              zIndex: 0,
              transformOrigin: "left center",
              transform: "scaleX(0)",
              opacity: 0,
              display: "block",
            }}
          />
        </div>

        {/* Hairline rule — separated from the pullquote by ample whitespace */}
        <div
          ref={ruleRef}
          style={{
            marginTop: 90,
            width: "100%",
            height: 1,
            background: "#191918",
            transformOrigin: "left center",
            transform: "scaleX(0)",
            opacity: 0,
          }}
        />

        {/* Byline */}
        <div
          ref={bylineRef}
          style={{
            marginTop: 28,
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: 0,
          }}
        >
          <ScoupLogo size={64} />
          <div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 28,
                fontWeight: 900,
                letterSpacing: "-0.02em",
                color: "#191918",
                lineHeight: 1,
              }}
            >
              Scoup
            </div>
            <div
              style={{
                marginTop: 4,
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                color: "rgba(25,25,24,0.55)",
                letterSpacing: "0.01em",
              }}
            >
              Persona-driven intelligence for PR & communications teams.
            </div>
          </div>
        </div>

        {/* Publication meta footer */}
        <div
          ref={metaRef}
          style={{
            marginTop: 60,
            display: "flex",
            justifyContent: "space-between",
            opacity: 0,
            fontFamily: "Inter, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.32em",
            color: "rgba(25,25,24,0.5)",
            textTransform: "uppercase",
          }}
        >
          <span>scoup.ai</span>
          <span>VOL. 1 · ISSUE 01 · 2026</span>
          <span>End of edition</span>
        </div>
      </div>

      {/* Vignette closer */}
      <div
        ref={vignetteRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0,
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </Timegroup>
  );
};
