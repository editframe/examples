import React from "react";
import { Timegroup } from "@editframe/react";
import { PaperBackground } from "../components/PaperBackground";
import { Sfx } from "../components/Sfx";
import { Reveal } from "@shared/components/Reveal";
import { claude } from "../brand";

/**
 * Scene 3 — Findings Card (5s) — REBUILT v5
 *
 * Reference: jeremy-refs frame f-15.png
 *
 * Two centered editorial cards: top "acme-corp/hookrelay · Completed",
 * bottom "4 findings" list with severity pills + file paths + category.
 *
 * Layout: both cards stacked, group is centered vertically and horizontally
 * in the 1920×1080 viewport via outer flex.
 *
 * Timing (scene-local — this scene's own `<Timegroup>` resets to 0):
 *   0.0–1.0s   Header card fades + slides
 *   0.6–1.6s   Findings card fades
 *   1.4–2.75s  Each of 4 finding rows cascades in (300ms stagger, 450ms ease
 *              — see the per-row `enter` window computed from array index
 *              below)
 *   2.75–5.0s  Hold — Scene4's own incoming fade covers the hand-off, so
 *              this scene hard-cuts with no exit animation of its own
 *              (matches the original: its exit-fade window was declared
 *              starting at 6400ms, past this scene's actual 5000ms
 *              duration, so it never actually ran).
 */

type Severity = "Critical" | "High";
interface Finding {
  severity: Severity;
  title: string;
  path: string;
  category: string;
}

const FINDINGS: Finding[] = [
  {
    severity: "Critical",
    title: "Shell command injection via webhook payload",
    path: "app/services/notifiers/script_runner.py:21",
    category: "Command injection",
  },
  {
    severity: "Critical",
    title: "JWT authentication bypass via “none” algorithm",
    path: "app/auth/jwt_handler.py:28",
    category: "Auth bypass",
  },
  {
    severity: "Critical",
    title: "Path traversal in export file download endpoint",
    path: "app/routes/exports.py:39",
    category: "Path traversal",
  },
  {
    severity: "High",
    title: "Server-Side Request Forgery in destination URL validation",
    path: "app/services/validator.py:36",
    category: "Server-side request forgery (SSRF)",
  },
];

const SeverityPill: React.FC<{ severity: Severity }> = ({ severity }) => {
  const isCritical = severity === "Critical";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "5px 13px",
        borderRadius: 8,
        border: `1px solid ${isCritical ? "#E8C9C5" : "#E8DBC5"}`,
        background: isCritical ? "#FBEFEC" : "#FBF3E5",
        color: isCritical ? claude.state.alert : "#9A7220",
        fontFamily: claude.fonts.body,
        fontSize: 18,
        fontWeight: 400,
        minWidth: 76,
        textAlign: "center",
      }}
    >
      {severity}
    </span>
  );
};

const ROW_STAGGER_START_MS = 1400;
const ROW_STAGGER_MS = 300;
const ROW_DURATION_MS = 450;

export const Findings: React.FC = () => (
  <Timegroup mode="fixed" duration="5s" className="absolute inset-0">
    <PaperBackground />
    <Sfx cue="plop" at={0.3} dur={0.4} volume={0.06} />
    <Sfx cue="plop" at={0.9} dur={0.4} volume={0.05} />
    {[0, 1, 2, 3].map((i) => (
      <Sfx key={i} cue="pop" at={1.5 + i * 0.3} dur={0.25} volume={0.04} />
    ))}

    {/* Outer centering frame */}
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
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {/* Header card: acme-corp/hookrelay · Completed */}
        <Reveal
          enter={[0, 1000]}
          y={14}
          style={{
            background: claude.bg.card,
            border: `1px solid ${claude.fg.rule}`,
            borderRadius: 14,
            padding: "26px 36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: claude.fonts.body,
                fontSize: 26,
                fontWeight: 500,
                color: claude.fg.primary,
                marginBottom: 6,
              }}
            >
              acme-corp/hookrelay
            </div>
            <div
              style={{
                fontFamily: claude.fonts.body,
                fontSize: 18,
                color: claude.fg.tertiary,
              }}
            >
              1 minute ago &middot; 4 findings
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: claude.fonts.body,
              fontSize: 22,
              fontWeight: 500,
              color: claude.accent.green,
            }}
          >
            <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke={claude.accent.green} strokeWidth={1.8} />
              <path d="m7.5 12.2 3 3 6-6.2" stroke={claude.accent.green} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Completed
          </div>
        </Reveal>

        {/* Findings card */}
        <Reveal
          enter={[600, 1600]}
          y={14}
          style={{
            background: claude.bg.card,
            border: `1px solid ${claude.fg.rule}`,
            borderRadius: 14,
            padding: "30px 38px 36px 38px",
          }}
        >
          <div
            style={{
              fontFamily: claude.fonts.body,
              fontSize: 24,
              fontWeight: 500,
              color: claude.fg.primary,
              marginBottom: 22,
            }}
          >
            4 findings
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {FINDINGS.map((f, i) => (
              <Reveal
                key={i}
                enter={[
                  ROW_STAGGER_START_MS + i * ROW_STAGGER_MS,
                  ROW_STAGGER_START_MS + i * ROW_STAGGER_MS + ROW_DURATION_MS,
                ]}
                y={8}
                style={{ display: "flex", alignItems: "flex-start", gap: 22 }}
              >
                <div style={{ paddingTop: 2, minWidth: 110 }}>
                  <SeverityPill severity={f.severity} />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: claude.fonts.body,
                      fontSize: 22,
                      fontWeight: 500,
                      color: claude.fg.primary,
                      marginBottom: 6,
                      lineHeight: 1.25,
                    }}
                  >
                    {f.title}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      fontFamily: claude.fonts.mono,
                      fontSize: 17,
                      color: claude.fg.secondary,
                    }}
                  >
                    <span>{f.path}</span>
                    <span style={{ color: claude.fg.tertiary }}>&middot;</span>
                    <span style={{ fontFamily: claude.fonts.body, color: claude.fg.secondary }}>
                      {f.category}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  </Timegroup>
);

export default Findings;
