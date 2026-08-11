import React, { useCallback, useRef } from "react";
import { Timegroup, Audio } from "@editframe/react";
import PaperBackground from "../components/PaperBackground";
import Terminal from "../components/Terminal";
import Mascot from "../components/Mascot";
import { Reveal } from "@shared/components/Reveal";
import { track, typewriter } from "@shared/utils/animation";

/**
 * Scene 4 — Compiled task list + 2nd prompt with camera zoom-ins (7s)
 *
 *   0–700      Hero terminal rises
 *   300–800    Corner mascot avatar fades in
 *   1500–2500  Compiled task list rows stream in (Needs input / Working / Completed)
 *   2500–4000  CAMERA ZOOMS IN on the input bar at the bottom; 2nd prompt types in
 *   4000–5500  CAMERA ZOOMS IN FURTHER on the response area as Claude responds
 *   5500–7000  Hold zoomed-in (we cut to Scene 5 from here)
 *
 * Everything positional/opacity here is plain CSS. The only things that stay JS are
 * text-content mutation with no CSS equivalent: the "awaiting/working/completed"
 * counters, the second-prompt typewriter, the one live-typed chat reply, and the
 * load-test row's live-updating icon/description/background (a small discrete state
 * machine keyed to specific ms thresholds, not a continuous animation).
 */

type Row = { icon: string; iconColor: string; name: string; desc: string; dur: string; nameColor?: string };

const NEEDS_INPUT: Row[] = [
  { icon: "✻", iconColor: "var(--claude-soft)", name: "dark-mode",     desc: "system theme vs explicit toggle — your call", dur: "4m" },
  { icon: "✻", iconColor: "var(--claude-soft)", name: "release-notes", desc: "draft ready — which feature leads?",         dur: "11m" },
];
const WORKING: Row[] = [
  { icon: "·", iconColor: "var(--text-dim)",    name: "pr-review",        desc: "→ to return",                                            dur: "5s" },
  { icon: "·", iconColor: "var(--text-dim)",    name: "perf-audit",       desc: "events_org_ts index live — p95 38ms",                    dur: "7m" },
  { icon: "✻", iconColor: "var(--claude-soft)", name: "payment-migration",desc: "porting billing to the new processor — 12/14",           dur: "2m" },
  { icon: "·", iconColor: "var(--text-dim)",    name: "onboarding-copy",  desc: "rewriting empty-state copy across 6 screens",            dur: "1m" },
  { icon: "·", iconColor: "var(--text-dim)",    name: "load-test",        desc: "→ to return",                                            dur: "3m", nameColor: "var(--text-primary)" },
];

// Stages the load-test row text passes through during the second zoom
const LOAD_TEST_STAGES = [
  { t: 4000, desc: "→ to return",                       icon: "·",  iconColor: "var(--text-dim)" },
  { t: 4800, desc: "rerunning with new index…",         icon: "·",  iconColor: "var(--claude-soft)" },
  { t: 5300, desc: "running — p95 measuring…",          icon: "·",  iconColor: "var(--claude-soft)" },
  { t: 5700, desc: "✓ p95 = 41ms (was 612ms)",          icon: "✻",  iconColor: "var(--light-green)" },
];
const COMPLETED: Row[] = [
  { icon: "✻", iconColor: "var(--claude-soft)", name: "test-coverage", desc: "billing/ from 61% → 92% — PR #408 merged", dur: "9m" },
];

const SECOND_PROMPT = "now optimize the slowest one";

interface ChatMsg { type: "user" | "claude" | "bash"; text: string; reveal: number; }

const SECOND_CHAT: ChatMsg[] = [
  { type: "user",   text: SECOND_PROMPT,                                              reveal: 4000 },
  // "claude" message text is typed in live — see handleFrame; `text` here is just the final value.
  { type: "claude", text: "Reading load-test results then applying the index fix.",   reveal: 4250 },
  { type: "bash",   text: "⏺  Bash(npm run db:migrate)",                              reveal: 4750 },
  { type: "bash",   text: "⎿  applying migration 047_events_idx.sql",                 reveal: 5050 },
  { type: "bash",   text: "⎿  + CREATE INDEX events_org_ts",                          reveal: 5300 },
  { type: "bash",   text: "⎿  ✓ composite index live in 1.2s",                        reveal: 5550 },
  { type: "bash",   text: "⏺  Bash(npm run perf-audit)",                              reveal: 5800 },
  { type: "bash",   text: "⎿  p95 dropped to 41ms  (was 612ms)",                      reveal: 6100 },
];

export const SecondPrompt: React.FC = () => {
  // Counters
  const cntA = useRef<HTMLSpanElement>(null);
  const cntW = useRef<HTMLSpanElement>(null);
  const cntC = useRef<HTMLSpanElement>(null);

  // Load-test row mutable parts (text + icon + background)
  const loadTestIconRef = useRef<HTMLSpanElement>(null);
  const loadTestDescRef = useRef<HTMLSpanElement>(null);
  const loadTestRowBgRef = useRef<HTMLDivElement>(null);

  // Second prompt
  const inputTextRef = useRef<HTMLSpanElement>(null);
  const inputCursorRef = useRef<HTMLSpanElement>(null);
  const claudeReplyRef = useRef<HTMLSpanElement>(null);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;

      // Counters
      const cP = track(ms, 1500, 2200);
      if (cntA.current) cntA.current.textContent = String(Math.round(cP * 2));
      if (cntW.current) cntW.current.textContent = String(Math.round(cP * 5));
      if (cntC.current) cntC.current.textContent = String(Math.round(cP * 2));

      // Second prompt typewriter (2700-3800, then clears)
      if (ms < 4000) {
        if (inputTextRef.current) inputTextRef.current.textContent = typewriter(ms, 2700, 1100, SECOND_PROMPT);
        if (inputCursorRef.current) inputCursorRef.current.style.opacity = Math.floor(ms / 450) % 2 === 0 ? "1" : "0";
      } else {
        if (inputTextRef.current) inputTextRef.current.textContent = "";
        if (inputCursorRef.current) inputCursorRef.current.style.opacity = "0";
      }

      // The one chat reply that types in live.
      if (claudeReplyRef.current) {
        claudeReplyRef.current.textContent = typewriter(ms, 4250, 380, "Reading load-test results then applying the index fix.");
      }

      // Load-test row — discrete text/icon/background state machine, not a continuous animation.
      let activeStage = LOAD_TEST_STAGES[0];
      for (const stage of LOAD_TEST_STAGES) {
        if (ms >= stage.t) activeStage = stage;
      }
      if (loadTestIconRef.current) {
        loadTestIconRef.current.textContent = activeStage.icon;
        loadTestIconRef.current.style.color = activeStage.iconColor;
      }
      if (loadTestDescRef.current) loadTestDescRef.current.textContent = activeStage.desc;
      if (loadTestRowBgRef.current) {
        if (ms >= 5700) {
          const flashP = track(ms, 5700, 6100);
          const bgIntensity = 0.08 + 0.2 * flashP * (1 - flashP);
          loadTestRowBgRef.current.style.background = `rgba(95,183,110,${bgIntensity})`;
        } else if (ms >= 4800) {
          loadTestRowBgRef.current.style.background = "rgba(204,120,92,0.12)";
        } else {
          loadTestRowBgRef.current.style.background = "rgba(255,255,255,0.08)";
        }
      }
    },
    []
  );

  return (
    <Timegroup mode="fixed" duration="7s" onFrame={handleFrame as any} className="absolute inset-0">
      <PaperBackground driftFrom={45} driftTo={60} durationMs={6500} />

      {/* Camera wrapper — scales the entire content for zoom-in */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "50% 50%",
          animation: "camera-zoom 7000ms both",
        }}
      >
        {/* Hero terminal */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 1100,
            height: 680,
            zIndex: 3,
            animation: "hero-term-in-scale 700ms cubic-bezier(0.33,1,0.68,1) both",
          }}
        >
          <Terminal width={1100} height={680} title="acme — claude — 92×28">
            {/* Header with corner-mascot (without hat) */}
            <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 12 }}>
              <Reveal enter={[300, 800]} y={0}>
                <Mascot variant="standard" pixel={6} />
              </Reveal>
              <div>
                <div style={{ color: "var(--text-primary)", fontSize: 28, lineHeight: 1 }}>Claude Code</div>
                <div style={{ color: "var(--text-secondary)", fontSize: 24, marginTop: 2 }}>Opus (1M context) · ~/acme</div>
                <div style={{ color: "var(--text-secondary)", fontSize: 24, marginTop: 2 }}>
                  <span ref={cntA}>0</span> awaiting input · <span ref={cntW}>0</span> working · <span ref={cntC}>0</span> completed
                </div>
              </div>
            </div>

            {/* Task list */}
            <Reveal enter={[1500, 1680]} y={0} style={{ color: "var(--text-primary)", fontSize: 26, fontWeight: 700, marginTop: 6, marginBottom: 4 }}>
              Needs input
            </Reveal>
            {NEEDS_INPUT.map((row, i) => (
              <TaskRow key={`n${i}`} row={row} delay={1600 + i * 80} />
            ))}
            <Reveal enter={[1850, 2030]} y={0} style={{ color: "var(--text-primary)", fontSize: 26, fontWeight: 700, marginTop: 10, marginBottom: 4 }}>
              Working
            </Reveal>
            {WORKING.map((row, i) => {
              if (row.name === "load-test") {
                return (
                  <div
                    key={`w${i}`}
                    ref={loadTestRowBgRef}
                    style={{
                      opacity: 0,
                      display: "grid",
                      gridTemplateColumns: "26px 280px 1fr 70px",
                      gap: 12,
                      alignItems: "center",
                      padding: "2px 8px",
                      fontSize: 24,
                      lineHeight: 1.2,
                      borderRadius: 3,
                      whiteSpace: "nowrap",
                      animation: `row-in 180ms ${1950 + i * 80}ms cubic-bezier(0.33,1,0.68,1) forwards`,
                    }}
                  >
                    <span ref={loadTestIconRef} style={{ color: row.iconColor, fontSize: 22 }}>{row.icon}</span>
                    <span style={{ color: row.nameColor ?? "var(--text-primary)" }}>{row.name}</span>
                    <span ref={loadTestDescRef} style={{ color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis" }}>{row.desc}</span>
                    <span style={{ color: "var(--text-dim)", textAlign: "right" }}>{row.dur}</span>
                  </div>
                );
              }
              return <TaskRow key={`w${i}`} row={row} delay={1950 + i * 80} />;
            })}
            <Reveal enter={[2350, 2530]} y={0} style={{ color: "var(--text-primary)", fontSize: 26, fontWeight: 700, marginTop: 10, marginBottom: 4 }}>
              Completed
            </Reveal>
            {COMPLETED.map((row, i) => (
              <TaskRow key={`c${i}`} row={row} delay={2450 + i * 80} />
            ))}

            {/* Second-prompt chat (appears after the task list) */}
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              {SECOND_CHAT.map((msg, i) => {
                let color = "var(--text-primary)";
                if (msg.type === "bash") color = "var(--text-dim)";
                const inner =
                  msg.type === "user" ? (
                    <span
                      style={{
                        display: "inline-block",
                        background: "rgba(204,120,92,0.20)",
                        borderLeft: "3px solid var(--claude)",
                        padding: "3px 14px",
                        borderRadius: "0 6px 6px 0",
                      }}
                    >
                      {msg.text}
                    </span>
                  ) : i === 1 ? (
                    <span ref={claudeReplyRef} />
                  ) : msg.type === "bash" ? (
                    <span style={{ color: msg.text.startsWith("⏺") ? "var(--claude-soft)" : "var(--text-dim)" }}>{msg.text}</span>
                  ) : (
                    msg.text
                  );
                return (
                  <Reveal key={i} enter={[msg.reveal, msg.reveal + 200]} y={10} style={{ color }}>
                    {inner}
                  </Reveal>
                );
              })}
            </div>

            {/* Input bar */}
            <div className="input-bar">
              <span style={{ color: "var(--text-dim)", marginRight: 10 }}>{">"}</span>
              <span ref={inputTextRef}></span>
              <span ref={inputCursorRef} className="input-cursor" />
              <div style={{ color: "var(--text-dim)", fontSize: 18, marginTop: 4 }}>
                enter to open · space to reply · ctrl+x to delete
              </div>
            </div>
          </Terminal>
        </div>
      </div>

      {/* Second-prompt typewriter keystrokes (master 22.7s → local 4.2s) */}
      <Audio src="/claude-code-demo/src/assets/sfx/claude-code-demo-keyboard.wav" offset="4200ms" duration="1.1s" volume={0.35} />
    </Timegroup>
  );
};

const TaskRow: React.FC<{ row: Row; delay: number }> = ({ row, delay }) => (
  <div
    style={{
      opacity: 0,
      display: "grid",
      gridTemplateColumns: "26px 280px 1fr 70px",
      gap: 12,
      alignItems: "center",
      padding: "2px 8px",
      fontSize: 24,
      lineHeight: 1.2,
      borderRadius: 3,
      whiteSpace: "nowrap",
      animation: `row-in 180ms ${delay}ms cubic-bezier(0.33,1,0.68,1) forwards`,
    }}
  >
    <span style={{ color: row.iconColor, fontSize: 22 }}>{row.icon}</span>
    <span style={{ color: row.nameColor ?? "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis" }}>{row.name}</span>
    <span style={{ color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis" }}>{row.desc}</span>
    <span style={{ color: "var(--text-dim)", textAlign: "right" }}>{row.dur}</span>
  </div>
);

export default SecondPrompt;
