import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import { lerp, track, typewriter } from "../components/helpers";
import { vc, fonts } from "../lib/colors";

/**
 * Scene 1 — Opener (4.0s)  ‖ Delba canon rebuild
 *
 * NOTE: filename kept as Scene1_TerminalPush.tsx for git-history continuity;
 * the scene is no longer a terminal push. Delba's videos don't open on a
 * deploy — they open on a question, framed as a code snippet or a title
 * card. We're doing the question.
 *
 * Reference: Delba's "use client visually explained: What, Why, How" opens
 * with the title set in Geist Sans on off-black with a small tagged eyebrow
 * (the video category) above it.
 *
 * Frame:
 *   - Eyebrow tag (mono, gray600, ALL CAPS, tracked +6%) types/fades in
 *   - Title (Geist Sans 88px / 500 weight) fades up beneath
 *   - One thin horizontal rule slides in from left to right under the title
 *   - Tiny mono signature ("Vercel · Next.js") appears bottom-right
 *
 * Beats:
 *   0–500       Cross-dissolve in.
 *   500–1300    Eyebrow tag types in: "RENDERING — EP. 03"
 *   1300–2300   Title fades up: "Partial Prerendering"
 *   2300–2900   Subtitle in gray400: "the static-dynamic split, explained"
 *   2900–3300   Rule draws under (200ms), signature appears (320ms).
 *   3300–4000   Hold, then cross-dissolve out.
 *
 * Brand checks (pause-test):
 *   - Bg #0A0A0A ✓
 *   - Geist Sans 500 (title), Geist Mono (eyebrow + signature) ✓
 *   - ZERO accents — opener is pure type ✓
 *   - >65% negative space ✓
 */

const EYEBROW_TEXT = "RENDERING — EP. 03";
const EYEBROW_START = 0;
const EYEBROW_DUR = 550;

export const Scene1_TerminalPush: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
    const ms = ownCurrentTimeMs;

    if (wrapperRef.current) {
      // No scene-level fade — inner elements own their own animation. This
      // prevents the "black seam" between sequential Timegroup scenes (each
      // scene is mode="fixed", they don't overlap temporally, so any scene-
      // level fade-out lands the next scene at opacity 0 too).
      wrapperRef.current.style.opacity = "1";
    }

    if (eyebrowRef.current) {
      eyebrowRef.current.textContent = typewriter(
        ms,
        EYEBROW_START,
        EYEBROW_DUR,
        EYEBROW_TEXT
      );
    }

    if (titleRef.current) {
      const p = track(ms, 600, 1200, eases.outCubic);
      titleRef.current.style.opacity = String(p);
      titleRef.current.style.transform = `translateY(${lerp(14, 0, p)}px)`;
    }

    if (subtitleRef.current) {
      const p = track(ms, 1300, 1800, eases.outCubic);
      subtitleRef.current.style.opacity = String(p);
      subtitleRef.current.style.transform = `translateY(${lerp(8, 0, p)}px)`;
    }

    if (ruleRef.current) {
      const p = track(ms, 1800, 2150, eases.outCubic);
      ruleRef.current.style.transform = `scaleX(${p})`;
      ruleRef.current.style.opacity = String(p);
    }

    if (signatureRef.current) {
      const p = track(ms, 2000, 2400, eases.outCubic);
      signatureRef.current.style.opacity = String(p);
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration="3s"
      onFrame={handleFrame as any}
      className="absolute inset-0 overflow-hidden"
    >
      <div style={{ position: "absolute", inset: 0, background: vc.bg }} />

      <div ref={wrapperRef} style={{ position: "absolute", inset: 0, opacity: 0 }}>
        {/* Centered title stack */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "left",
            width: 1080,
          }}
        >
          {/* Eyebrow */}
          <div
            ref={eyebrowRef}
            style={{
              fontFamily: fonts.mono,
              fontSize: 16,
              color: vc.gray500,
              letterSpacing: "0.18em",
              marginBottom: 28,
              minHeight: 22,
              whiteSpace: "pre",
            }}
          />

          {/* Title */}
          <div
            ref={titleRef}
            style={{
              fontFamily: fonts.sans,
              fontSize: 96,
              fontWeight: 500,
              color: vc.fg,
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
              opacity: 0,
              willChange: "transform, opacity",
            }}
          >
            Partial Prerendering
          </div>

          {/* Subtitle */}
          <div
            ref={subtitleRef}
            style={{
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 400,
              color: vc.textMuted,
              letterSpacing: "-0.015em",
              marginTop: 18,
              opacity: 0,
              willChange: "transform, opacity",
            }}
          >
            the static–dynamic split, explained
          </div>

          {/* Thin rule */}
          <div
            ref={ruleRef}
            style={{
              marginTop: 36,
              width: 280,
              height: 1,
              background: vc.gray700,
              opacity: 0,
              transformOrigin: "left center",
              transform: "scaleX(0)",
              willChange: "transform, opacity",
            }}
          />
        </div>

        {/* Signature — bottom-right */}
        <div
          ref={signatureRef}
          style={{
            position: "absolute",
            right: 48,
            bottom: 36,
            fontFamily: fonts.mono,
            fontSize: 14,
            color: vc.gray600,
            letterSpacing: "0.08em",
            opacity: 0,
          }}
        >
          VERCEL · NEXT.JS
        </div>
      </div>
    </Timegroup>
  );
};

export default Scene1_TerminalPush;
