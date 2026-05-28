import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import PaperBackground from "../components/PaperBackground";
import Terminal from "../components/Terminal";
import Mascot from "../components/Mascot";
import { clamp, lerp, track, typewriter, outBack } from "../components/helpers";

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
 */

const USER_PROMPT = "the dashboard's slow — find what's actually slow";

// Chat timeline — matches Claude Code's actual response format
interface ChatMsg {
  type: "user" | "claude" | "bash-cmd" | "bash-out" | "tool-cmd" | "tool-out";
  text: string;
  reveal: number;
  type_dur?: number;
}

const CHAT: ChatMsg[] = [
  { type: "user",      text: USER_PROMPT,                                              reveal: 2000 },
  { type: "claude",    text: "I'll check the perf-audit telemetry to find the bottleneck.", reveal: 2200, type_dur: 350 },
  { type: "bash-cmd",  text: "⏺  Bash(npm run perf-audit)",                            reveal: 2600 },
  { type: "bash-out",  text: "⎿  events_org_ts index live — p95 38ms",                 reveal: 3000 },
  { type: "bash-out",  text: "   checks: 96.4% (4922 reqs)",                           reveal: 3200 },
  { type: "bash-out",  text: "   ⚠ http_req_duration p95 = 612ms",                     reveal: 3400 },
  { type: "tool-cmd",  text: "⏺  Read(src/api/export.ts)",                             reveal: 3700 },
  { type: "tool-out",  text: "⎿  Read 142 lines",                                      reveal: 4000 },
  { type: "claude",    text: "Bottleneck is the /export endpoint — missing composite index. Spawning sub-agents.", reveal: 4250, type_dur: 500 },
  { type: "bash-cmd",  text: "⏺  Task(spawn 4 parallel agents)",                       reveal: 4750 },
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

export const Scene1_Demo: React.FC = () => {
  const paperRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroWrapRef = useRef<HTMLDivElement>(null);

  const inputTextRef = useRef<HTMLSpanElement>(null);
  const inputCursorRef = useRef<HTMLSpanElement>(null);
  const inputBarRef = useRef<HTMLDivElement>(null);
  const msgRefs = useRef<(HTMLDivElement | null)[]>([]);

  const sub1Ref = useRef<HTMLDivElement>(null);
  const sub2Ref = useRef<HTMLDivElement>(null);
  const sub3Ref = useRef<HTMLDivElement>(null);
  const sub4Ref = useRef<HTMLDivElement>(null);

  const sub1Lines = useRef<(HTMLDivElement | null)[]>([]);
  const sub2Lines = useRef<(HTMLDivElement | null)[]>([]);
  const sub3Lines = useRef<(HTMLDivElement | null)[]>([]);
  const sub4Lines = useRef<(HTMLDivElement | null)[]>([]);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;

      // Paper drift
      if (paperRef.current) {
        const p = clamp(ms / 8500);
        paperRef.current.style.transform = `translateX(${lerp(-15, 15, p)}px)`;
      }

      // Hero terminal entrance — very fast
      const heroP = outBack(clamp(ms / 500), 1.3);
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${lerp(700, 0, heroP)}px)`;
        heroRef.current.style.opacity = String(clamp(ms / 250));
      }

      // Input bar typewriter — 28ms/char ≈ 47 chars * 28 = 1316ms duration
      const typeStart = 800;
      const typeDur = 1200;
      if (ms < 2000) {
        if (inputTextRef.current) {
          inputTextRef.current.textContent = typewriter(ms, typeStart, typeDur, USER_PROMPT);
        }
      } else {
        // Message lifts into chat — clear input
        if (inputTextRef.current) {
          inputTextRef.current.textContent = "";
        }
        if (inputBarRef.current) {
          const pulseP = track(ms, 2000, 2150, eases.outCubic);
          inputBarRef.current.style.opacity = String(0.7 + 0.3 * (1 - pulseP));
        }
      }

      // Cursor blink in input bar (only before message sent)
      if (inputCursorRef.current) {
        const visible = ms > 700 && Math.floor(ms / 450) % 2 === 0;
        inputCursorRef.current.style.opacity = ms < 2100 ? (visible ? "1" : "0") : "0";
      }

      // Chat message reveals
      CHAT.forEach((msg, i) => {
        const el = msgRefs.current[i];
        if (!el) return;
        const start = msg.reveal;
        const p = track(ms, start, start + 220, eases.outCubic);
        if (msg.type_dur) {
          el.textContent = typewriter(ms, start, msg.type_dur, msg.text);
        }
        el.style.opacity = String(p);
        el.style.transform = `translateY(${lerp(14, 0, p)}px)`;
      });

      // Sub-terminal entrances — FLAT 2D paper-card slide-in (per Claude brand: no 3D).
      // Each card slides in from off-screen along the direction of its corner
      // and settles flat with a tiny 2D rotate(±n deg) for "tossed onto desk" feel.
      // This matches the reference video where terminals overlap as flat paper.
      const subs: [
        React.RefObject<HTMLDivElement | null>,
        number,
        number, // 2D rotate deg (tiny, "tossed paper" feel — NOT 3D)
        number, // slide-in dx (px)
        number, // slide-in dy (px)
        React.RefObject<(HTMLDivElement | null)[]>,
        { t: number; text: string }[]
      ][] = [
        [sub1Ref, 4800, 0,  -240, -160, sub1Lines, SUB1_LINES],  // top-left enters from upper-left — FULLY FLAT, no rotation
        [sub2Ref, 5050, 0,   240, -160, sub2Lines, SUB2_LINES],  // top-right
        [sub3Ref, 5300, 0,  -240,  160, sub3Lines, SUB3_LINES],  // bottom-left
        [sub4Ref, 5550, 0,   240,  160, sub4Lines, SUB4_LINES],  // bottom-right
      ];

      for (const [ref, t0, rot2D, dx, dy, lineRefs, lines] of subs) {
        if (!ref.current) continue;
        const p = outBack(clamp((ms - t0) / 700), 1.15);
        ref.current.style.opacity = String(clamp((ms - t0) / 250));

        // Sub-terminals settle at full 1.0x — Jeremy's REGRESSION-LEDGER rule:
        // "TERMINALS ARE BIG. Sub-terms ≥ 0.85. When in doubt, BIGGER."
        // v4's 0.48 was a regression. Reverting + bumping per current round.
        const scale = lerp(0.92, 1.0, p);
        const tx = lerp(dx, 0, p);
        const ty = lerp(dy, 0, p);
        ref.current.style.transform =
          `translate(${tx}px, ${ty}px) rotate(${rot2D * p}deg) scale(${scale})`;

        // Reveal sub-term lines at their individual times
        lines.forEach((line, i) => {
          const lEl = lineRefs.current[i];
          if (!lEl) return;
          const lp = track(ms, line.t, line.t + 220, eases.outCubic);
          lEl.style.opacity = String(lp);
          lEl.style.transform = `translateX(${lerp(-6, 0, lp)}px)`;
        });
      }
    },
    []
  );

  return (
    <Timegroup
      mode="fixed"
      duration="8.5s"
      onFrame={handleFrame as any}
      className="absolute inset-0"
    >
      <PaperBackground ref={paperRef} />

      <div className="scene-3d" style={{ position: "absolute", inset: 0 }}>
        {/* Sub-terminal 1 — top-left, BIG 640×400 */}
        <SubTerm
          innerRef={sub1Ref}
          lineRefs={sub1Lines}
          lines={SUB1_LINES}
          title="agent-1 · perf-audit"
          style={{ top: 20, left: 20 }}
          transformOrigin="top left"
        />
        <SubTerm
          innerRef={sub2Ref}
          lineRefs={sub2Lines}
          lines={SUB2_LINES}
          title="agent-2 · grep"
          style={{ top: 20, right: 20 }}
          transformOrigin="top right"
        />
        <SubTerm
          innerRef={sub3Ref}
          lineRefs={sub3Lines}
          lines={SUB3_LINES}
          title="agent-3 · load-test"
          style={{ bottom: 20, left: 20 }}
          transformOrigin="bottom left"
        />
        <SubTerm
          innerRef={sub4Ref}
          lineRefs={sub4Lines}
          lines={SUB4_LINES}
          title="agent-4 · migration"
          style={{ bottom: 20, right: 20 }}
          transformOrigin="bottom right"
        />

        {/* HERO TERMINAL */}
        <div
          ref={heroWrapRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
            willChange: "transform",
          }}
        >
          <Terminal
            ref={heroRef}
            width={1480}
            height={860}
            title="acme — claude — 92×28"
            style={{ opacity: 0 }}
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
                const inner =
                  msg.type === "user" ? (
                    <span style={{
                      display: "inline-block",
                      background: "rgba(204,120,92,0.20)",
                      borderLeft: "3px solid var(--claude)",
                      padding: "3px 14px",
                      borderRadius: "0 6px 6px 0",
                      color: "var(--text-primary)",
                    }}>{msg.text}</span>
                  ) : (
                    msg.text
                  );

                let color = "var(--text-primary)";
                if (msg.type === "claude") color = "var(--text-primary)";
                else if (msg.type === "bash-cmd" || msg.type === "tool-cmd") color = "var(--claude-soft)";
                else if (msg.type === "bash-out" || msg.type === "tool-out") color = "var(--text-dim)";

                return (
                  <div
                    key={i}
                    ref={(el) => { msgRefs.current[i] = el; }}
                    style={{ opacity: 0, color, willChange: "transform, opacity" }}
                  >
                    {inner}
                  </div>
                );
              })}
            </div>

            {/* Input bar */}
            <div ref={inputBarRef} className="input-bar">
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
    </Timegroup>
  );
};

const SubTerm: React.FC<{
  innerRef: React.RefObject<HTMLDivElement | null>;
  lineRefs: React.RefObject<(HTMLDivElement | null)[]>;
  lines: { t: number; text: string }[];
  title: string;
  style: React.CSSProperties;
  transformOrigin: string;
}> = ({ innerRef, lineRefs, lines, title, style, transformOrigin }) => (
  <div
    ref={innerRef}
    style={{
      position: "absolute",
      width: 700,
      height: 460,
      opacity: 0,
      transformOrigin,
      willChange: "transform, opacity",
      zIndex: 4,  // ON TOP of hero terminal
      ...style,
    }}
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
              ref={(el) => { lineRefs.current[i] = el; }}
              style={{ opacity: 0, color, willChange: "transform, opacity" }}
            >
              {line.text}
            </div>
          );
        })}
      </div>
    </Terminal>
  </div>
);

export default Scene1_Demo;
