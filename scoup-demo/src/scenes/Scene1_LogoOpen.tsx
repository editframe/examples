import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import { ScoupLogo } from "../components/ScoupLogo";
import { PaperBackground } from "../components/PaperBackground";
import { Sfx } from "../components/Sfx";

/**
 * Scene 1 — Logo Cold Open (4s) — EDITORIAL palette
 *
 * Newspaper-cream paper. Black wordmark. Yellow Scoup mark. Old-money typography.
 * Slow, measured entrance — like ink hitting paper.
 *
 * Beat 1 (200–1100ms) — Logo mask reveals from bottom + scales up
 * Beat 2 (1100–1700ms) — Wordmark types in
 * Beat 3 (1750–2550ms) — Tagline fades up
 * Beat 4 (2550–4000ms) — Hold
 */

const TAGLINE = "Persona-driven intelligence for PR & communications teams.";
const WORDMARK = "Scoup";

const clamp = (n: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const track = (
  ms: number,
  startMs: number,
  endMs: number,
  easeFn: (t: number) => number = eases.outCubic
) => easeFn(clamp((ms - startMs) / (endMs - startMs)));

export const Scene1_LogoOpen: React.FC = () => {
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;
      const logoWrap = logoWrapRef.current;
      const wm = wordmarkRef.current;
      const tag = taglineRef.current;
      const rule = ruleRef.current;
      if (!logoWrap || !wm || !tag || !rule) return;

      // Logo reveal
      const logoP = track(ms, 200, 1100, eases.outCubic);
      logoWrap.style.opacity = String(logoP);
      logoWrap.style.transform = `scale(${lerp(0.85, 1, logoP)})`;
      logoWrap.style.clipPath = `inset(0 0 ${lerp(100, 0, logoP)}% 0)`;

      // Wordmark typewriter
      const wmP = clamp((ms - 1100) / 500);
      const wmChars = Math.floor(wmP * WORDMARK.length);
      const wmText = WORDMARK.slice(0, wmChars);
      if (wm.textContent !== wmText) wm.textContent = wmText;
      wm.style.opacity = wmChars > 0 ? "1" : "0";

      // Hairline rule draws across (from center)
      const ruleP = track(ms, 1600, 2400, eases.outQuart);
      rule.style.transform = `scaleX(${ruleP})`;
      rule.style.opacity = String(ruleP * 0.55);

      // Tagline fade-up
      const tagP = track(ms, 1900, 2700, eases.outQuart);
      tag.style.opacity = String(tagP);
      tag.style.transform = `translateY(${lerp(14, 0, tagP)}px)`;
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

      {/* SFX cues — timed to visual beats */}
      <Sfx cue="reveal" at={0.3} dur={1.2} volume={0.55} />
      <Sfx cue="plop" at={1.1} dur={0.55} volume={0.45} />
      <Sfx cue="ping" at={1.95} dur={1.0} volume={0.4} />

      <div className="relative flex flex-col items-center z-10" style={{ width: 1100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            ref={logoWrapRef}
            style={{
              opacity: 0,
              transform: "scale(0.85)",
              clipPath: "inset(0 0 100% 0)",
              willChange: "clip-path, transform, opacity",
            }}
          >
            <ScoupLogo size={140} />
          </div>
          <span
            ref={wordmarkRef}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 168,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: "#191918",
              opacity: 0,
              minWidth: 1,
            }}
          />
        </div>

        {/* Hairline rule */}
        <div
          ref={ruleRef}
          style={{
            width: 560,
            height: 1,
            background: "#191918",
            marginTop: 36,
            transformOrigin: "center center",
            transform: "scaleX(0)",
            opacity: 0,
          }}
        />

        <div
          ref={taglineRef}
          style={{
            marginTop: 28,
            color: "rgba(25,25,24,0.62)",
            fontFamily: "Inter, sans-serif",
            fontSize: 24,
            fontWeight: 400,
            letterSpacing: "0.01em",
            opacity: 0,
            textAlign: "center",
          }}
        >
          {TAGLINE}
        </div>

        {/* Small classifier hint */}
        <div
          style={{
            marginTop: 80,
            opacity: 0.4,
            fontFamily: "Inter, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.32em",
            color: "#191918",
            textTransform: "uppercase",
          }}
        >
          VOL. 1 · ISSUE 01 · 2026
        </div>
      </div>
    </Timegroup>
  );
};
