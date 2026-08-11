import React, { useCallback, useRef } from "react";
import { Timegroup, Audio } from "@editframe/react";
import PaperBackground from "../components/PaperBackground";
import Terminal from "../components/Terminal";
import Mascot from "../components/Mascot";
import { Reveal } from "@shared/components/Reveal";
import { typewriter } from "@shared/utils/animation";

/**
 * Scene 1 — Demo + 3D agent spawn (8.5s, faster than v2)
 *
 * Beats (ms):
 *  0–500     Paper + hero terminal flies up (big 1100×680)
 *  500–800   Header + mascot fade in
 *  800–2000  User types prompt at 28ms/char (slightly slower than v2)
 *  2000–2200 Message lifts into chat history; input clears
 *  2200–2600 Claude reply types in (⏺ I'll check the perf-audit telemetry.)
 *  2600–3000 ⏺ Bash(npm run perf-audit) appears
 *  3000–3600 ⎿  output streams: 3 lines
 *  3600–4000 ⏺ Read(src/api/export.ts)
 *  4000–4400 ⎿  output: Read 142 lines
 *  4400–4800 ⏺ Spawning 4 parallel agents…
 *  4800–6500 Sub-terminals spawn in 3D corners (stagger 250ms) with live content streaming
 *  6500–8500 Sub-terminals working — content keeps streaming
 *
 * Everything below is a plain CSS `@keyframes` / <Reveal> reveal driven by this scene's
 * own local clock, EXCEPT the input-bar typewriter + cursor blink and the one Claude
 * reply that types in mid-chat — text-content mutation has no CSS equivalent, so those
 * stay a small scene-scoped `onFrame` (see `handleFrame` below).
 */

const USER_PROMPT = "the dashboard's slow — find what's actually slow";
const CLAUDE_REPLY = "I'll check the perf-audit telemetry to find the bottleneck.";

// Chat timeline — matches Claude Code's actual response format
interface ChatMsg {
  type: "user" | "claude" | "bash-cmd" | "bash-out" | "tool-cmd" | "tool-out";
  text: string;
  reveal: number;
}

const CHAT: ChatMsg[] = [
  { type: "user",      text: USER_PROMPT,                                    reveal: 2000 },
  // "claude" message text is typed in live — see handleFrame; `text` here is just the final value.
  { type: "claude",    text: CLAUDE_REPLY,                                   reveal: 2200 },
  { type: "bash-cmd",  text: "⏺  Bash(npm run perf-audit)",                  reveal: 2600 },
  { type: "bash-out",  text: "⎿  events_org_ts index live — p95 38ms",       reveal: 3000 },
  { type: "bash-out",  text: "   checks: 96.4% (4922 reqs)",                 reveal: 3200 },
  { type: "bash-out",  text: "   ⚠ http_req_duration p95 = 612ms",           reveal: 3400 },
  { type: "tool-cmd",  text: "⏺  Read(src/api/export.ts)",                   reveal: 3700 },
  { type: "tool-out",  text: "⎿  Read 142 lines",                           reveal: 4000 },
  { type: "claude",    text: "Bottleneck is the /export endpoint — missing composite index. Spawning sub-agents.", reveal: 4250 },
  { type: "bash-cmd",  text: "⏺  Task(spawn 4 parallel agents)",             reveal: 4750 },
];

// Sub-terminal content (each line is "reveal_ms text") — streams in as the sub-term lives
const SUB1_LINES = [
  { t: 4900, text: "⏺  Bash(perf-audit --deep)" },
  { t: 5400, text: "⎿  index events_org_ts live" },
  { t: 5800, text: "   p95 38ms — within budget" },
  { t: 6300, text: "⏺  ✓ regression resolved" },
];
const SUB2_LINES = [
  { t: 5050, text: "⏺  Grep(slow endpoints in /api)" },
  { t: 5500, text: "⎿  Found 3 patterns:" },
  { t: 5900, text: "   /api/export/csv  (p95 612ms)" },
  { t: 6300, text: "   /api/billing/sync (p95 488ms)" },
  { t: 6700, text: "⏺  ✓ patterns flagged" },
];
const SUB3_LINES = [
  { t: 5200, text: "⏺  Bash(k6 run launch-load.js)" },
  { t: 5700, text: "⎿  http_req avg 180ms" },
  { t: 6100, text: "   checks 96.40% of 4922" },
  { t: 6500, text: "⏺  ✓ load profile captured" },
];
const SUB4_LINES = [
  { t: 5350, text: "⏺  Edit(db/migrations/047.sql)" },
  { t: 5900, text: "⎿  + CREATE INDEX events_org_ts" },
  { t: 6300, text: "⎿  + Composite (org_id, ts DESC)" },
  { t: 6700, text: "⏺  ✓ migration ready" },
];

export const AgentSpawn: React.FC = () => {
  const inputTextRef = useRef<HTMLSpanElement>(null);
  const inputCursorRef = useRef<HTMLSpanElement>(null);
  const claudeReplyRef = useRef<HTMLSpanElement>(null);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;

      // Input bar typewriter — 28ms/char, then clears once the message "lifts" into chat.
      if (ms < 2000) {
        if (inputTextRef.current) {
          inputTextRef.current.textContent = typewriter(ms, 800, 1200, USER_PROMPT);
        }
      } else if (inputTextRef.current) {
        inputTextRef.current.textContent = "";
      }

      // Cursor blink in input bar (only before the message is sent).
      if (inputCursorRef.current) {
        const visible = ms > 700 && Math.floor(ms / 450) % 2 === 0;
        inputCursorRef.current.style.opacity = ms < 2100 ? (visible ? "1" : "0") : "0";
      }

      // The one chat reply that types in live (the rest reveal already-complete).
      if (claudeReplyRef.current) {
        claudeReplyRef.current.textContent = typewriter(ms, 2200, 350, CLAUDE_REPLY);
      }
    },
    []
  );

  return (
    <Timegroup mode="fixed" duration="8.5s" onFrame={handleFrame as any} className="absolute inset-0">
      <PaperBackground driftFrom={-15} driftTo={15} durationMs={8500} />

      <div className="scene-3d" style={{ position: "absolute", inset: 0 }}>
        <SubTerm delay={4800} dx={-240} dy={-160} lines={SUB1_LINES} title="agent-1 · perf-audit" style={{ top: 20, left: 20 }} />
        <SubTerm delay={5050} dx={240} dy={-160} lines={SUB2_LINES} title="agent-2 · grep" style={{ top: 20, right: 20 }} />
        <SubTerm delay={5300} dx={-240} dy={160} lines={SUB3_LINES} title="agent-3 · load-test" style={{ bottom: 20, left: 20 }} />
        <SubTerm delay={5550} dx={240} dy={160} lines={SUB4_LINES} title="agent-4 · migration" style={{ bottom: 20, right: 20 }} />

        {/* HERO TERMINAL */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }}
        >
          <Terminal
            width={1480}
            height={860}
            title="acme — claude — 92×28"
            style={{ animation: "hero-term-in 500ms cubic-bezier(0.34,1.56,0.64,1) both" }}
          >
            <div style={{ display: "flex", gap: 22, alignItems: "flex-start", marginBottom: 18 }}>
              <Mascot variant="standard" pixel={7} />
              <div>
                <div style={{ color: "var(--text-primary)", fontSize: 34, lineHeight: 1 }}>Claude Code</div>
                <div style={{ color: "var(--text-secondary)", fontSize: 28, marginTop: 4 }}>Opus (1M context) · ~/acme</div>
                <div style={{ color: "var(--text-secondary)", fontSize: 28, marginTop: 2 }}>1 awaiting input · 0 working · 0 completed</div>
              </div>
            </div>

            {/* Chat stack — newest at bottom */}
            <div className="chat-stack">
              {CHAT.map((msg, i) => {
                let color = "var(--text-primary)";
                if (msg.type === "bash-cmd" || msg.type === "tool-cmd") color = "var(--claude-soft)";
                else if (msg.type === "bash-out" || msg.type === "tool-out") color = "var(--text-dim)";

                const inner =
                  msg.type === "user" ? (
                    <span
                      style={{
                        display: "inline-block",
                        background: "rgba(204,120,92,0.20)",
                        borderLeft: "3px solid var(--claude)",
                        padding: "3px 14px",
                        borderRadius: "0 6px 6px 0",
                        color: "var(--text-primary)",
                      }}
                    >
                      {msg.text}
                    </span>
                  ) : i === 1 ? (
                    // The one live-typed reply — Reveal handles the fade, handleFrame fills the text.
                    <span ref={claudeReplyRef} />
                  ) : (
                    msg.text
                  );

                return (
                  <Reveal key={i} enter={[msg.reveal, msg.reveal + 220]} y={14} style={{ color }}>
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

      {/* Hero-prompt typewriter keystrokes */}
      <Audio src="/claude-code-demo/src/assets/sfx/claude-code-demo-keyboard.wav" offset="800ms" duration="1.2s" volume={0.35} />
    </Timegroup>
  );
};

const SubTerm: React.FC<{
  delay: number;
  dx: number;
  dy: number;
  lines: { t: number; text: string }[];
  title: string;
  style: React.CSSProperties;
}> = ({ delay, dx, dy, lines, title, style }) => (
  <div
    style={
      {
        position: "absolute",
        width: 700,
        height: 460,
        zIndex: 4, // ON TOP of hero terminal
        "--dx": `${dx}px`,
        "--dy": `${dy}px`,
        animation: `sub-term-in 700ms ${delay}ms cubic-bezier(0.34,1.56,0.64,1) both`,
        ...style,
      } as React.CSSProperties
    }
  >
    <Terminal width={700} height={460} title={title} bodyStyle={{ fontSize: 22, padding: "14px 20px" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: 6 }}>
        {lines.map((line, i) => {
          let color = "var(--text-primary)";
          if (line.text.startsWith("⏺")) color = "var(--claude-soft)";
          else if (line.text.startsWith("⎿")) color = "var(--text-dim)";
          else color = "var(--text-secondary)";
          if (line.text.includes("✓")) color = "var(--light-green)";
          return (
            <div
              key={i}
              style={{
                color,
                animation: `subline-in 220ms ${line.t}ms cubic-bezier(0.33,1,0.68,1) backwards`,
              }}
            >
              {line.text}
            </div>
          );
        })}
      </div>
    </Terminal>
  </div>
);

export default AgentSpawn;
