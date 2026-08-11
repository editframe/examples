import React from "react";
import { Timegroup } from "@editframe/react";
import { Reveal } from "@shared/components/Reveal";
import { vc, fonts } from "../lib/colors";
import { SCENES } from "../constants";

/**
 * Scene 1 — Opener (3.0s local + 0.5s crossfade tail)  ‖ Delba canon rebuild
 *
 * NOTE: this scene is no longer a terminal push, despite the component name.
 * Delba's videos don't open on a deploy — they open on a question, framed
 * as a code snippet or a title card. We're doing the question.
 *
 * Reference: Delba's "use client visually explained" opens with the title
 * set in Geist Sans on off-black with a small tagged eyebrow (the video
 * category) above it.
 *
 * Frame:
 *   - Eyebrow tag (mono, gray600, ALL CAPS, tracked +6%) types in
 *   - Title (Geist Sans 88px / 500 weight) fades up beneath
 *   - One thin horizontal rule slides in from left to right under the title
 *   - Tiny mono signature ("Vercel · Next.js") appears bottom-right
 *
 * Beats (local ms, this scene's own clock):
 *   0–550       Eyebrow tag types in: "RENDERING — EP. 03"
 *   600–1200    Title fades up: "Partial Prerendering"
 *   1300–1800   Subtitle in gray400: "the static-dynamic split, explained"
 *   1800–2150   Rule draws under
 *   2000–2400   Signature appears
 *   2500–3000   Crossfade out (--ef-transition-out-start, shared with Scene2's in).
 *
 * Brand checks (pause-test):
 *   - Bg #0A0A0A ✓
 *   - Geist Sans 500 (title), Geist Mono (eyebrow + signature) ✓
 *   - ZERO accents — opener is pure type ✓
 *   - >65% negative space ✓
 */

const EYEBROW_TEXT = "RENDERING — EP. 03";

export const TerminalPush: React.FC = () => {
  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENES.terminalPush.duration}ms`}
      className="absolute inset-0 overflow-hidden"
    >
      <div style={{ position: "absolute", inset: 0, background: vc.bg }} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          animation: "scene-fade-out var(--ef-transition-duration) var(--ef-transition-out-start) cubic-bezier(0.32,0,0.67,0) forwards",
        }}
      >
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
          {/* Eyebrow — CSS-only typewriter via width + steps() */}
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 16,
              color: vc.gray500,
              letterSpacing: "0.18em",
              marginBottom: 28,
              minHeight: 22,
              whiteSpace: "pre",
              overflow: "hidden",
              display: "inline-block",
              ["--tw-width" as any]: `${EYEBROW_TEXT.length}ch`,
              animation: `typewriter-reveal 550ms 0ms steps(${EYEBROW_TEXT.length}, end) both`,
            }}
          >
            {EYEBROW_TEXT}
          </div>

          {/* Title */}
          <Reveal
            enter={[600, 1200]}
            y={14}
            style={{
              fontFamily: fonts.sans,
              fontSize: 96,
              fontWeight: 500,
              color: vc.fg,
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
            }}
          >
            Partial Prerendering
          </Reveal>

          {/* Subtitle */}
          <Reveal
            enter={[1300, 1800]}
            y={8}
            style={{
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 400,
              color: vc.textMuted,
              letterSpacing: "-0.015em",
              marginTop: 18,
            }}
          >
            the static–dynamic split, explained
          </Reveal>

          {/* Thin rule */}
          <div
            style={{
              marginTop: 36,
              width: 280,
              height: 1,
              background: vc.gray700,
              transformOrigin: "left center",
              animation: "rule-draw-in 350ms 1800ms cubic-bezier(0.33,1,0.68,1) backwards",
            }}
          />
        </div>

        {/* Signature — bottom-right */}
        <Reveal
          enter={[2000, 2400]}
          y={0}
          style={{
            position: "absolute",
            right: 48,
            bottom: 36,
            fontFamily: fonts.mono,
            fontSize: 14,
            color: vc.gray600,
            letterSpacing: "0.08em",
          }}
        >
          VERCEL · NEXT.JS
        </Reveal>
      </div>
    </Timegroup>
  );
};

export default TerminalPush;
