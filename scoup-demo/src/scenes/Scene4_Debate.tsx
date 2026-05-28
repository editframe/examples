import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import { PaperBackground } from "../components/PaperBackground";
import { Sfx } from "../components/Sfx";

/**
 * Scene 4 — The Debate (7s) — DECK-MATCHED dark slide
 *
 * Uses the deck's actual debate dialogue verbatim (Pro-Trump vs Anti-Trump,
 * "Has the presidency been good for America?"). Matches deck colors:
 *   Pro-Trump red:  #EF6B5B
 *   Anti-Trump blue: #5B8DEF
 *
 * Animation libs:
 *   AnimeJS easings — outQuart for message row entrance, linear typewriter
 *   Advanced CSS — chat dock dark card, side-aligned bubbles, typing dots,
 *                  gold accent line
 *
 * Beat (ms):
 *   0–700        Header materializes
 *   700–1900     Message 1 (Pro-Trump) — typing → text
 *   1900–3100    Message 2 (Anti-Trump) — typing → text
 *   3100–4400    Message 3 (Pro-Trump) — typing → text
 *   4400–5800    Message 4 (Anti-Trump) — typing → text
 *   5800–7000    Hold + final typing indicator
 */

const THREAD = [
  {
    side: "red" as const,
    name: "Pro-Trump",
    initials: "PT",
    time: "4:01 PM",
    text: "Every president inherits something. What matters is what you do with it. He was the first president in decades to actually confront China.",
  },
  {
    side: "blue" as const,
    name: "Anti-Trump",
    initials: "AT",
    time: "4:02 PM",
    text: "Started a trade war that cost American farmers billions and raised consumer prices. The Phase One deal? China didn't meet half its commitments.",
  },
  {
    side: "blue" as const,
    name: "Anti-Trump",
    initials: "AT",
    time: "4:04 PM",
    text: "Sixty courts looked at it. His own attorney general said no fraud. His own cybersecurity chief called it the most secure election in history.",
  },
  {
    side: "red" as const,
    name: "Pro-Trump",
    initials: "PT",
    time: "4:05 PM",
    text: "He exposed how broken the system was. He was a stress test — and the system failed.",
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

const COLORS: Record<"red" | "blue", { fill: string; border: string; name: string }> = {
  red: { fill: "rgba(239,107,91,0.12)", border: "rgba(239,107,91,0.32)", name: "#EF6B5B" },
  blue: { fill: "rgba(91,141,239,0.12)", border: "rgba(91,141,239,0.32)", name: "#5B8DEF" },
};

function typewriter(ms: number, start: number, dur: number, text: string) {
  const p = clamp((ms - start) / dur);
  return text.slice(0, Math.floor(p * text.length));
}

export const Scene4_Debate: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Each message: typing for 200ms, then text types in over 900ms, then hold
  // Spacing between messages: 1.3s start-to-start
  const MSG_START = 800; // first message starts
  const MSG_GAP = 1350; // spacing
  const TYPE_DUR = 900;

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;

      // Header
      const hP = track(ms, 0, 700, eases.outQuart);
      if (headerRef.current) {
        headerRef.current.style.opacity = String(hP);
        headerRef.current.style.transform = `translateY(${lerp(-14, 0, hP)}px)`;
      }
      const tP = track(ms, 200, 900, eases.outQuart);
      if (titleRef.current) {
        titleRef.current.style.opacity = String(tP);
        titleRef.current.style.transform = `translateY(${lerp(-14, 0, tP)}px)`;
      }
      const dP = track(ms, 350, 1100, eases.outQuart);
      if (dockRef.current) {
        dockRef.current.style.opacity = String(dP);
        dockRef.current.style.transform = `translate(-50%, 0) translateY(${lerp(30, 0, dP)}px) scale(${lerp(0.97, 1, dP)})`;
      }

      // Each row: appears in with slide-in, then typewriter populates text
      THREAD.forEach((m, i) => {
        const row = rowRefs.current[i];
        const txt = textRefs.current[i];
        if (!row || !txt) return;
        const start = MSG_START + i * MSG_GAP;
        const popIn = track(ms, start, start + 250, eases.outQuart);
        row.style.opacity = String(popIn);
        const tx = lerp(m.side === "red" ? 40 : -40, 0, popIn);
        row.style.transform = `translateX(${tx}px)`;
        // Typewriter
        txt.textContent = typewriter(ms, start + 200, TYPE_DUR, m.text);
      });
    },
    []
  );

  return (
    <Timegroup
      mode="fixed"
      duration="7s"
      onFrame={handleFrame as any}
      className="absolute inset-0 flex items-center justify-center"
    >
      <PaperBackground variant="ink" />

      {/* SFX — chime per message (notify) at 0.8/2.15/3.5/4.85s lines up with MSG_START + i * MSG_GAP */}
      <Sfx cue="notify" at={0.80} dur={0.85} volume={0.45} />
      <Sfx cue="notify" at={2.15} dur={0.85} volume={0.45} />
      <Sfx cue="notify" at={3.50} dur={0.85} volume={0.45} />
      <Sfx cue="notify" at={4.85} dur={0.85} volume={0.45} />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 80px",
          zIndex: 20,
        }}
      >
        <div
          className="scene-label"
          ref={headerRef}
          style={{
            color: "rgba(245,242,234,0.55)",
            opacity: 0,
            marginBottom: 12,
          }}
        >
          Part 04 · The Debate
        </div>
        <div
          ref={titleRef}
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 60,
            fontWeight: 900,
            letterSpacing: "-0.028em",
            color: "#F5F2EA",
            lineHeight: 1.05,
            opacity: 0,
          }}
        >
          Same facts. <span style={{ color: "#F5C518" }}>Opposite verdicts.</span>
        </div>
      </div>

      {/* Chat dock */}
      <div
        ref={dockRef}
        style={{
          position: "absolute",
          left: "50%",
          bottom: 70,
          transform: "translate(-50%, 30px) scale(0.97)",
          width: 1340,
          height: 700,
          borderRadius: 24,
          padding: "26px 36px",
          opacity: 0,
          background: "#111110",
          border: "1px solid rgba(245,197,24,0.18)",
          boxShadow: "0 30px 80px -16px rgba(0,0,0,0.6)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* Dock header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: 12,
            borderBottom: "1px solid rgba(245,242,234,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: 17,
                color: "#F5F2EA",
                letterSpacing: "-0.01em",
              }}
            >
              Pro · vs · Anti
            </div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                color: "rgba(245,242,234,0.5)",
              }}
            >
              Has the presidency been good for America?
            </div>
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "5px 12px",
              borderRadius: 999,
              background: "rgba(245,197,24,0.18)",
              border: "1px solid rgba(245,197,24,0.5)",
              fontFamily: "Inter, sans-serif",
              fontSize: 11,
              fontWeight: 800,
              color: "#F5C518",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "#F5C518",
                boxShadow: "0 0 8px #F5C518",
              }}
            />
            Live
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, paddingTop: 6 }}>
          {THREAD.map((m, i) => (
            <div
              key={i}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              style={{
                display: "flex",
                flexDirection: m.side === "red" ? "row-reverse" : "row",
                alignItems: "flex-end",
                gap: 12,
                opacity: 0,
                maxWidth: "78%",
                alignSelf: m.side === "red" ? "flex-end" : "flex-start",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  background: COLORS[m.side].name,
                  color: "#111110",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 800,
                  fontSize: 13,
                  letterSpacing: "0.04em",
                  flexShrink: 0,
                }}
              >
                {m.initials}
              </div>
              {/* Content */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: m.side === "red" ? "flex-end" : "flex-start",
                  gap: 4,
                  maxWidth: 720,
                }}
              >
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 12,
                    fontWeight: 800,
                    color: COLORS[m.side].name,
                    letterSpacing: "0.04em",
                  }}
                >
                  {m.name} · <span style={{ color: "rgba(245,242,234,0.3)" }}>{m.time}</span>
                </div>
                <div
                  style={{
                    padding: "14px 18px",
                    background: COLORS[m.side].fill,
                    border: `1px solid ${COLORS[m.side].border}`,
                    borderRadius: 14,
                    borderTopLeftRadius: m.side === "blue" ? 4 : 14,
                    borderTopRightRadius: m.side === "red" ? 4 : 14,
                    color: "#F5F2EA",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 17,
                    lineHeight: 1.45,
                    letterSpacing: "-0.005em",
                  }}
                >
                  <span ref={(el) => { textRefs.current[i] = el; }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Timegroup>
  );
};
