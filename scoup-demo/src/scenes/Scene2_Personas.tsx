import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import gsap from "gsap";
import { eases } from "animejs";
import { PaperBackground } from "../components/PaperBackground";
import { Sfx } from "../components/Sfx";

// Persona marks generated via fal.ai. 400×400 PNG, ?inline as base64.
import researcher from "../assets/personas/researcher.png?inline";
import analyst from "../assets/personas/analyst.png?inline";
import journalist from "../assets/personas/journalist.png?inline";
import strategist from "../assets/personas/strategist.png?inline";
import editor from "../assets/personas/editor.png?inline";

/**
 * Scene 2 — Meet the bureau (6s) — MAGAZINE editorial layout
 *
 * Newspaper-style "Meet the contributors" spread. Five portrait cards laid
 * out in a horizontal row with byline + role + a one-line description of
 * each persona's job in the AI newsroom. Each card materializes in turn,
 * and as it does a yellow underline draws under its role label — so the
 * eye actually lands on one persona at a time.
 *
 * Animation libs:
 *   GSAP — gsap.utils.interpolate for smooth header progress
 *   AnimeJS easings — outQuart for card entrance + underline draws
 *   Advanced CSS — magazine card layout, hairline rules, drop-cap byline
 *
 * Beat (ms):
 *   0–800        Title + section header fade in
 *   600–1300     Bureau title + intro line
 *   1100–6000    Each persona card pops in (staggered ~900ms apart)
 *   2200–6000    Yellow byline-underline draws under each role in sequence
 */

const personas = [
  {
    src: researcher,
    name: "Researcher",
    role: "Surveyor",
    desc: "Scans social, news, and forums. Picks up emerging signal before it surfaces.",
  },
  {
    src: analyst,
    name: "Analyst",
    role: "Sentiment Lead",
    desc: "Tracks shifts in tone. Calls out when sustainability claims aren't landing.",
  },
  {
    src: journalist,
    name: "Journalist",
    role: "Drafter",
    desc: "Writes the first narrative draft. Frames the gap between promise and reality.",
  },
  {
    src: editor,
    name: "Editor",
    role: "Reframer",
    desc: "Defensive becomes proactive. Edits the angle, not just the prose.",
  },
  {
    src: strategist,
    name: "Strategist",
    role: "Timing",
    desc: "Decides when the brief drops. Maps to the Monday news cycle.",
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

export const Scene2_Personas: React.FC = () => {
  const labelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const underRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;

      // Section label
      const lP = track(ms, 0, 700, eases.outQuart);
      if (labelRef.current) {
        labelRef.current.style.opacity = String(lP);
        labelRef.current.style.transform = `translateY(${lerp(-14, 0, lP)}px)`;
      }

      // Headline
      const hP = track(ms, 200, 900, eases.outQuart);
      if (headerRef.current) {
        headerRef.current.style.opacity = String(hP);
        headerRef.current.style.transform = `translateY(${lerp(-16, 0, hP)}px)`;
      }

      // Subtitle
      const sP = track(ms, 500, 1200, eases.outQuart);
      if (subRef.current) {
        subRef.current.style.opacity = String(sP);
        subRef.current.style.transform = `translateY(${lerp(-12, 0, sP)}px)`;
      }

      // Cards stagger in
      personas.forEach((_, i) => {
        const card = cardRefs.current[i];
        const under = underRefs.current[i];
        if (!card) return;

        const cardStart = 1100 + i * 700;
        const cardEnd = cardStart + 700;
        const p = track(ms, cardStart, cardEnd, eases.outCubic);
        card.style.opacity = String(p);
        card.style.transform = `translateY(${lerp(28, 0, p)}px)`;

        if (under) {
          const uStart = cardStart + 350;
          const uEnd = uStart + 600;
          const up = gsap.utils.interpolate(0, 1, track(ms, uStart, uEnd, eases.outQuart));
          under.style.transform = `scaleX(${up})`;
          under.style.opacity = String(up);
        }
      });
    },
    []
  );

  return (
    <Timegroup
      mode="fixed"
      duration="6s"
      onFrame={handleFrame as any}
      className="absolute inset-0 flex flex-col items-center"
    >
      <PaperBackground />

      {/* SFX cues — one pop per card entrance (5), staggered with the visual stagger of 700ms */}
      <Sfx cue="pop" at={1.10} dur={0.35} volume={0.55} />
      <Sfx cue="pop" at={1.80} dur={0.35} volume={0.55} />
      <Sfx cue="pop" at={2.50} dur={0.35} volume={0.55} />
      <Sfx cue="pop" at={3.20} dur={0.35} volume={0.55} />
      <Sfx cue="pop" at={3.90} dur={0.35} volume={0.55} />

      {/* HEADER */}
      <div
        style={{
          marginTop: 60,
          textAlign: "center",
          width: 1640,
          padding: "0 60px",
          position: "relative",
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
          Part 02 · The Bureau
        </div>
        <div
          ref={headerRef}
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 78,
            fontWeight: 900,
            letterSpacing: "-0.028em",
            color: "#191918",
            lineHeight: 1.0,
            opacity: 0,
          }}
        >
          Meet the <span className="yellow-underline">bureau.</span>
        </div>
        <div
          ref={subRef}
          style={{
            marginTop: 14,
            fontFamily: "Inter, sans-serif",
            fontSize: 22,
            fontWeight: 400,
            color: "rgba(25,25,24,0.6)",
            letterSpacing: "0.01em",
            opacity: 0,
          }}
        >
          Five contributors. One newsroom that runs whether you're reading or not.
        </div>

        {/* hairline rule under header */}
        <div
          style={{
            marginTop: 24,
            width: "100%",
            height: 1,
            background: "rgba(25,25,24,0.18)",
          }}
        />
      </div>

      {/* PORTRAIT ROW — magazine columns */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 14,
          width: 1640,
          padding: "0 60px",
          marginTop: 42,
          position: "relative",
          zIndex: 10,
        }}
      >
        {personas.map((p, i) => (
          <div
            key={p.name}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            style={{
              flex: 1,
              opacity: 0,
              transform: "translateY(28px)",
              willChange: "transform, opacity",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
            }}
          >
            {/* portrait — newspaper-style stamped frame */}
            <div
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                background: "#0E0E0D",
                border: "1.5px solid #191918",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={p.src}
                alt={p.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              {/* small column label */}
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: "0.28em",
                  color: "rgba(245,242,234,0.7)",
                  textTransform: "uppercase",
                }}
              >
                No. 0{i + 1}
              </div>
            </div>

            {/* role chip with animated underline */}
            <div
              style={{
                marginTop: 14,
                position: "relative",
                display: "inline-block",
                paddingBottom: 6,
              }}
            >
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.24em",
                  color: "rgba(25,25,24,0.6)",
                  textTransform: "uppercase",
                }}
              >
                The {p.role}
              </div>
              <div
                ref={(el) => {
                  underRefs.current[i] = el;
                }}
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  width: "70%",
                  height: 3,
                  background: "#F5C518",
                  transformOrigin: "left center",
                  transform: "scaleX(0)",
                  opacity: 0,
                }}
              />
            </div>

            {/* name */}
            <div
              style={{
                marginTop: 8,
                fontFamily: "Inter, sans-serif",
                fontSize: 30,
                fontWeight: 900,
                letterSpacing: "-0.02em",
                color: "#191918",
                lineHeight: 1.05,
              }}
            >
              {p.name}
            </div>

            {/* description */}
            <div
              style={{
                marginTop: 10,
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                fontWeight: 400,
                color: "rgba(25,25,24,0.66)",
                lineHeight: 1.4,
              }}
            >
              {p.desc}
            </div>
          </div>
        ))}
      </div>

      {/* footer hairline + caption */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          bottom: 30,
          display: "flex",
          alignItems: "center",
          gap: 14,
          opacity: 0.45,
          color: "#191918",
        }}
      >
        <div style={{ flex: 1, height: 1, background: "currentColor" }} />
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
          }}
        >
          A roundtable of agents · published weekly
        </div>
        <div style={{ flex: 1, height: 1, background: "currentColor" }} />
      </div>
    </Timegroup>
  );
};
