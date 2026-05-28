import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import { PaperBackground } from "../components/PaperBackground";
import { Sfx } from "../components/Sfx";
import { lerp, track } from "../components/helpers";
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
 * Timing:
 *   0.0–1.0s   Title row fades + slides
 *   0.8–1.8s   "The Fix" headline + body fade
 *   1.4–3.2s   Code block lines reveal (clip-path expand)
 *   3.0–3.6s   Coral underline draws under "secure subprocess execution"
 *   3.6–4.4s   Hold
 *   4.4–5.0s   Cross-fade out
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

export const Scene4_PRPatch: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subheadRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;

      const tp = track(ms, 0, 1000, eases.outCubic);
      if (titleRef.current) {
        titleRef.current.style.opacity = String(tp);
        titleRef.current.style.transform = `translateY(${lerp(12, 0, tp)}px)`;
      }

      const sp = track(ms, 800, 1800, eases.outCubic);
      if (subheadRef.current) {
        subheadRef.current.style.opacity = String(sp);
        subheadRef.current.style.transform = `translateY(${lerp(10, 0, sp)}px)`;
      }

      const cp = track(ms, 1400, 3200, eases.outCubic);
      if (codeRef.current) {
        codeRef.current.style.opacity = String(Math.min(1, cp * 1.5));
        codeRef.current.style.clipPath = `inset(0 0 ${lerp(100, 0, cp)}% 0)`;
      }

      // v8 FIX 4: shorter underline matches "secure subprocess execution" text width.
      // Space Grotesk 22px, 27 chars (incl 2 spaces) → ~298px text width.
      // Underline now 298px (was 336px) so it ends right under the "n" of execution.
      const up = track(ms, 3000, 3600, eases.outCubic);
      if (underlineRef.current) {
        const total = 298;
        underlineRef.current.style.strokeDasharray = String(total);
        underlineRef.current.style.strokeDashoffset = String(total * (1 - up));
      }

      // No fade-out — Timegroup hard-cuts to Scene5 which has its own dark bg.
      // This prevents the cream-gap at the Scene4→Scene5 boundary.
      if (wrapRef.current) wrapRef.current.style.opacity = "1";
    },
    []
  );

  return (
    <Timegroup
      mode="fixed"
      duration="5s"
      onFrame={handleFrame as any}
      className="absolute inset-0"
    >
      <PaperBackground />
      <Sfx cue="plop" at={0.2} dur={0.4} volume={0.05} />
      <Sfx cue="reveal" at={1.4} dur={1.6} volume={0.06} />
      <Sfx cue="twinkle" at={3.0} dur={0.6} volume={0.04} />

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
          <div
            ref={titleRef}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontFamily: claude.fonts.body,
              fontSize: 28,
              fontWeight: 500,
              color: claude.fg.primary,
              opacity: 0,
              willChange: "opacity, transform",
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
          </div>

          {/* The Fix subhead */}
          <div
            ref={subheadRef}
            style={{
              opacity: 0,
              willChange: "opacity, transform",
              position: "relative",
            }}
          >
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
                    ref={underlineRef}
                    d="M2 5 L300 5"
                    stroke={claude.accent.coral}
                    strokeWidth={3}
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </div>
          </div>

          {/* Code block */}
          <div
            ref={codeRef}
            style={{
              background: "#F3EFE3",
              border: `1px solid ${claude.fg.rule}`,
              borderRadius: 10,
              padding: "22px 28px",
              opacity: 0,
              clipPath: "inset(0 0 100% 0)",
              willChange: "opacity, clip-path",
              marginTop: 6,
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
};

export default Scene4_PRPatch;
