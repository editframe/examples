import React from "react";
import { Timegroup } from "@editframe/react";
import { PaperBackground } from "../components/PaperBackground";
import { Sfx } from "../components/Sfx";
import { Reveal } from "@shared/components/Reveal";
import { claude } from "../brand";

/**
 * Scene 4 — PR Patch (5s) — REBUILT v5
 *
 * Reference: jeremy-refs f-35.png — "[Security Scan] Fix command_injection:
 * app/services/notifiers/script_runner.py" title row + secure code block
 * with `# SECURE CODE (after)` comment header.
 *
 * Layout: centered card containing PR title + "The Fix" subhead +
 * secure code block. Coral underline draws under "secure subprocess
 * execution" — the single coral accent for this scene.
 *
 * Timing (scene-local — this scene's own `<Timegroup>` resets to 0):
 *   0.0–1.0s   Title row fades + slides
 *   0.8–1.8s   "The Fix" headline + body fade
 *   1.4–3.2s   Code block clip-path reveal (`code-reveal` keyframe)
 *   3.0–3.6s   Coral underline draws under "secure subprocess execution"
 *              (`underline-draw` keyframe on the SVG path's stroke-dashoffset)
 *   3.6–5.0s   Hold — no fade-out. Scene5 hard-cuts in on top of this
 *              (its own background is drawn immediately), so there's no
 *              cream-gap at the Scene4→Scene5 boundary.
 */

const CODE_LINES = [
  { text: "# SECURE CODE (after)", color: "comment" },
  { text: "result = subprocess.Popen(", color: "code" },
  { text: "    [script_path],          # Direct execution, no shell", color: "code" },
  { text: "    stdin=subprocess.PIPE,  # Enable stdin communication", color: "code" },
  { text: "    stdout=subprocess.PIPE,", color: "code" },
  { text: "    stderr=subprocess.PIPE,", color: "code" },
  { text: ")", color: "code" },
  { text: "stdout, stderr = result.communicate(input=message.encode(\"utf-8\"),", color: "code" },
  { text: "                                    timeout=30)", color: "code" },
];

// v8 FIX 4: shorter underline matches "secure subprocess execution" text width.
// Space Grotesk 22px, 27 chars (incl 2 spaces) → ~298px text width.
// Underline is 298px so it ends right under the "n" of execution.
const UNDERLINE_LENGTH = 298;

export const PRPatch: React.FC = () => (
  <Timegroup mode="fixed" duration="5s" className="absolute inset-0">
    <PaperBackground />
    <Sfx cue="plop" at={0.2} dur={0.4} volume={0.05} />
    <Sfx cue="reveal" at={1.4} dur={1.6} volume={0.06} />
    <Sfx cue="twinkle" at={3.0} dur={0.6} volume={0.04} />

    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 1380,
          background: claude.bg.card,
          border: `1px solid ${claude.fg.rule}`,
          borderRadius: 14,
          padding: "38px 46px 42px 46px",
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        {/* PR title row */}
        <Reveal
          enter={[0, 1000]}
          y={12}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: claude.fonts.body,
            fontSize: 28,
            fontWeight: 500,
            color: claude.fg.primary,
            paddingBottom: 18,
            borderBottom: `1px solid ${claude.fg.rule}`,
          }}
        >
          {/* Claude security cloud icon */}
          <svg width={32} height={32} viewBox="0 0 32 32" fill="none">
            <path
              d="M9 22a5 5 0 1 1 1-9.9A6.5 6.5 0 0 1 22.6 13 5 5 0 0 1 22 22H9Z"
              stroke={claude.fg.primary}
              strokeWidth={1.8}
              strokeLinejoin="round"
            />
            <circle cx="20.5" cy="22" r="3.2" fill={claude.accent.blue} />
          </svg>
          <span>[Security Scan] Fix command_injection: app/services/notifiers/script_runner.py</span>
        </Reveal>

        {/* The Fix subhead */}
        <Reveal enter={[800, 1800]} y={10} style={{ position: "relative" }}>
          <div
            style={{
              fontFamily: claude.fonts.body,
              fontSize: 24,
              fontWeight: 600,
              color: claude.fg.primary,
              marginBottom: 12,
            }}
          >
            The Fix
          </div>
          <div
            style={{
              fontFamily: claude.fonts.body,
              fontSize: 22,
              color: claude.fg.primary,
              lineHeight: 1.5,
              position: "relative",
              display: "inline-block",
            }}
          >
            I replaced the vulnerable code with{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              secure subprocess execution
              {/*
                v6 FIX 7 — STRAIGHT clean minimal underline.
                Client: "the 3rd reference image shows a weird and uneven
                line it should be straight clean minimal."
                Per REGRESSION-LEDGER rule #12: minimalist = precise,
                strict measurements, straight lines, true centers.
              */}
              <svg
                width={302}
                height={10}
                viewBox="0 0 302 10"
                style={{
                  position: "absolute",
                  left: -2,
                  bottom: -8,
                  pointerEvents: "none",
                }}
              >
                <path
                  d="M2 5 L300 5"
                  stroke={claude.accent.coral}
                  strokeWidth={3}
                  fill="none"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: `${UNDERLINE_LENGTH}`,
                    animation: "underline-draw 600ms 3000ms cubic-bezier(0.33,1,0.68,1) backwards",
                  }}
                />
              </svg>
            </span>
            .
          </div>
        </Reveal>

        {/* Code block */}
        <div
          style={{
            background: "#F3EFE3",
            border: `1px solid ${claude.fg.rule}`,
            borderRadius: 10,
            padding: "22px 28px",
            marginTop: 6,
            animation: "code-reveal 1800ms 1400ms cubic-bezier(0.33,1,0.68,1) both",
          }}
        >
          {CODE_LINES.map((l, i) => (
            <div
              key={i}
              style={{
                fontFamily: claude.fonts.mono,
                fontSize: 20,
                lineHeight: 1.55,
                color: l.color === "comment" ? claude.accent.green : claude.fg.primary,
                whiteSpace: "pre",
              }}
            >
              {l.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  </Timegroup>
);

export default PRPatch;
