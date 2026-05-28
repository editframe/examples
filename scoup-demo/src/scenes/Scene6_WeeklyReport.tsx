import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import { PaperBackground } from "../components/PaperBackground";
import { Sfx } from "../components/Sfx";

/**
 * Scene 6 — The Weekly Report (5s) — DECK-MATCHED real content
 *
 * The real Scoup weekly report layout — authored in CSS with verbatim
 * findings from the deck. No skeleton bars. Real headlines, real numbers.
 *
 * Animation libs:
 *   AnimeJS easings — outQuart for entrance, finding rows stagger in
 *   Advanced CSS — paper card, classic editorial typography,
 *                  gold underline emphasis, "STAR OF THE SHOW" badge tilt
 *
 * Beat (ms):
 *   0–700        Title fades in
 *   400–1400     Report paper card slides up
 *   1200–2000    Title + executive summary intro fade in
 *   2000–4500    Three findings reveal in sequence
 *   3500–4200    ★ STAR OF THE SHOW badge enters with rotation
 */

const FINDINGS = [
  {
    n: "01",
    headline: "Unprecedented Internal Criticism",
    detail:
      "Military action against Iran triggered public criticism from significant voices within the administration's own coalition, including figures like Tucker Carlson.",
    metric: "110,464 engagements",
  },
  {
    n: "02",
    headline: "Significant Legal & Economic Setback",
    detail:
      "Supreme Court's Feb 20 ruling striking down use of emergency powers for global tariffs invalidated tariffs across 100+ countries.",
    metric: "$175B in revenue at risk",
  },
  {
    n: "03",
    headline: "Successfully Reframed Policy Decision",
    detail:
      "Federal ban on Anthropic AI technology executed within 48 hours — but the narrative was effectively reframed by opponents.",
    metric: "157,000 views",
  },
];

const clamp = (n: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const track = (
  ms: number,
  startMs: number,
  endMs: number,
  easeFn: (t: number) => number = eases.outCubic
) => easeFn(clamp((ms - startMs) / (endMs - startMs)));

export const Scene6_WeeklyReport: React.FC = () => {
  const labelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const reportTitleRef = useRef<HTMLDivElement>(null);
  const reportSubRef = useRef<HTMLDivElement>(null);
  const execLabelRef = useRef<HTMLDivElement>(null);
  const execBodyRef = useRef<HTMLDivElement>(null);
  const findingRefs = useRef<(HTMLDivElement | null)[]>([]);
  const badgeRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;

      // Title
      const lP = track(ms, 0, 700, eases.outQuart);
      if (labelRef.current) {
        labelRef.current.style.opacity = String(lP);
        labelRef.current.style.transform = `translateY(${lerp(-12, 0, lP)}px)`;
      }
      const tP = track(ms, 150, 850, eases.outQuart);
      if (titleRef.current) {
        titleRef.current.style.opacity = String(tP);
        titleRef.current.style.transform = `translateY(${lerp(-16, 0, tP)}px)`;
      }

      // Card slides up
      const cP = track(ms, 400, 1400, eases.outCubic);
      if (cardRef.current) {
        cardRef.current.style.opacity = String(cP);
        cardRef.current.style.transform = `translate(-50%, 0) translateY(${lerp(40, 0, cP)}px)`;
      }

      // Report title + sub
      const rtP = track(ms, 1100, 1700, eases.outQuart);
      if (reportTitleRef.current) {
        reportTitleRef.current.style.opacity = String(rtP);
      }
      if (reportSubRef.current) {
        const rsP = track(ms, 1250, 1850, eases.outQuart);
        reportSubRef.current.style.opacity = String(rsP);
      }

      // Executive summary block
      const eP = track(ms, 1500, 2100, eases.outQuart);
      if (execLabelRef.current) execLabelRef.current.style.opacity = String(eP);
      if (execBodyRef.current) execBodyRef.current.style.opacity = String(eP);

      // Findings stagger
      FINDINGS.forEach((_, i) => {
        const el = findingRefs.current[i];
        if (!el) return;
        const start = 2000 + i * 500;
        const p = track(ms, start, start + 700, eases.outCubic);
        el.style.opacity = String(p);
        el.style.transform = `translateY(${lerp(20, 0, p)}px)`;
      });

      // Badge — enter with rotation flick
      const bP = track(ms, 3500, 4100, eases.outQuart);
      if (badgeRef.current) {
        badgeRef.current.style.opacity = String(bP);
        badgeRef.current.style.transform = `translate(50%, -50%) scale(${lerp(0.55, 1, bP)}) rotate(${lerp(-25, -8, bP)}deg)`;
      }
    },
    []
  );

  return (
    <Timegroup
      mode="fixed"
      duration="5s"
      onFrame={handleFrame as any}
      className="absolute inset-0 flex items-center justify-center"
    >
      <PaperBackground />

      {/* SFX — paper slides up, findings pop one by one, then STAR twinkle finale */}
      <Sfx cue="confirm" at={0.45} dur={1.0} volume={0.50} />
      <Sfx cue="pop" at={2.05} dur={0.35} volume={0.55} />
      <Sfx cue="pop" at={2.55} dur={0.35} volume={0.55} />
      <Sfx cue="pop" at={3.05} dur={0.35} volume={0.55} />
      <Sfx cue="twinkle" at={3.55} dur={1.45} volume={0.55} />

      {/* TITLE */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 80px",
          zIndex: 10,
        }}
      >
        <div
          className="scene-label"
          ref={labelRef}
          style={{
            color: "#191918",
            opacity: 0,
            marginBottom: 10,
          }}
        >
          Part 06 · The Weekly Report
        </div>
        <div
          ref={titleRef}
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 56,
            fontWeight: 900,
            letterSpacing: "-0.028em",
            color: "#191918",
            lineHeight: 1.05,
            opacity: 0,
          }}
        >
          Written <span className="yellow-underline">through your eyes.</span>
        </div>
      </div>

      {/* REPORT CARD */}
      <div
        ref={cardRef}
        className="editorial-card"
        style={{
          position: "absolute",
          left: "50%",
          top: 220,
          transform: "translate(-50%, 40px)",
          width: 1100,
          height: 750,
          padding: "32px 44px",
          borderRadius: 10,
          opacity: 0,
          overflow: "hidden",
        }}
      >
        {/* Browser dots header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            paddingBottom: 14,
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            marginBottom: 18,
          }}
        >
          <span style={{ width: 11, height: 11, borderRadius: 999, background: "#EE6F60" }} />
          <span style={{ width: 11, height: 11, borderRadius: 999, background: "#F5C518" }} />
          <span style={{ width: 11, height: 11, borderRadius: 999, background: "#7ED48F" }} />
          <div
            style={{
              flex: 1,
              textAlign: "center",
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              color: "rgba(0,0,0,0.4)",
              letterSpacing: "0.04em",
            }}
          >
            scoup.ai · weekly report · Trump Administration · march 7, 2026
          </div>
        </div>

        {/* Star of the show badge */}
        <div
          ref={badgeRef}
          style={{
            position: "absolute",
            right: -10,
            top: 28,
            padding: "8px 16px",
            background: "linear-gradient(135deg, #FFE066 0%, #F5C518 100%)",
            color: "#191918",
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            borderRadius: 999,
            boxShadow: "0 8px 22px rgba(245,197,24,0.4)",
            transform: "translate(50%, -50%) scale(0.55) rotate(-25deg)",
            opacity: 0,
            whiteSpace: "nowrap",
          }}
        >
          ★ Star of the show
        </div>

        {/* Report title */}
        <div
          ref={reportTitleRef}
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 32,
            fontWeight: 900,
            color: "#191918",
            letterSpacing: "-0.025em",
            lineHeight: 1.2,
            opacity: 0,
            marginBottom: 6,
          }}
        >
          Communications Landscape Analysis: <em style={{ fontStyle: "normal", color: "rgba(0,0,0,0.66)" }}>Early March 2026</em>
        </div>
        <div
          ref={reportSubRef}
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            color: "rgba(0,0,0,0.55)",
            letterSpacing: "0.02em",
            opacity: 0,
            marginBottom: 22,
          }}
        >
          Analysis period: <strong style={{ color: "#191918" }}>Feb 28 — Mar 6, 2026</strong> · Date of analysis: Mar 7, 2026
        </div>

        {/* Executive Summary section */}
        <div
          ref={execLabelRef}
          className="scene-label"
          style={{
            color: "rgba(0,0,0,0.55)",
            fontSize: 11,
            letterSpacing: "0.32em",
            opacity: 0,
            marginBottom: 8,
          }}
        >
          Executive Summary
        </div>
        <div
          ref={execBodyRef}
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 17,
            lineHeight: 1.5,
            color: "#191918",
            opacity: 0,
            marginBottom: 24,
            maxWidth: 920,
          }}
        >
          The administration operated with a posture of assertive executive action across foreign policy, domestic law, and technology governance — generating novel pushback and creating a <strong>compound strategic communications challenge.</strong>
        </div>

        {/* Findings */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {FINDINGS.map((f, i) => (
            <div
              key={f.n}
              ref={(el) => {
                findingRefs.current[i] = el;
              }}
              style={{
                display: "flex",
                gap: 16,
                opacity: 0,
                transform: "translateY(20px)",
                padding: "14px 18px",
                background: "rgba(0,0,0,0.025)",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 34,
                  height: 34,
                  borderRadius: 999,
                  background: "#F5C518",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  fontWeight: 900,
                  color: "#191918",
                  letterSpacing: "-0.01em",
                }}
              >
                {f.n}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#191918",
                    letterSpacing: "-0.01em",
                    marginBottom: 3,
                  }}
                >
                  {f.headline}
                </div>
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 14,
                    lineHeight: 1.45,
                    color: "rgba(0,0,0,0.66)",
                    marginBottom: 6,
                  }}
                >
                  {f.detail}
                </div>
                <div
                  style={{
                    display: "inline-block",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 12,
                    fontWeight: 800,
                    color: "#191918",
                    background: "rgba(245,197,24,0.22)",
                    padding: "3px 9px",
                    borderRadius: 999,
                    letterSpacing: "0.04em",
                  }}
                >
                  {f.metric}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Timegroup>
  );
};
