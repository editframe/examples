import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import PaperBackground from "../components/PaperBackground";
import Terminal from "../components/Terminal";
import Mascot from "../components/Mascot";
import { clamp, lerp, track, typewriter } from "../components/helpers";

/**
 * Scene 4 — Compiled task list + 2nd prompt with camera zoom-ins (6.5s)
 *
 *   0–700      Hero terminal rises, 4 corner sub-terminals fade out
 *   700–1500   Mascot (no hat) travels from center to hero terminal's corner avatar slot
 *   1500–2500  Compiled task list rows stream in (Needs input / Working / Completed)
 *   2500–4000  CAMERA ZOOMS IN on the input bar at the bottom; 2nd prompt types in
 *   4000–5500  CAMERA ZOOMS IN FURTHER on the response area as Claude responds
 *   5500–6500  Hold zoomed-in (we cut to Scene 5 from here)
 */

type Row = { icon: string; iconColor: string; name: string; desc: string; dur: string; nameColor?: string };

const NEEDS_INPUT: Row[] = [
  { icon: "✻", iconColor: "var(--claude-soft)", name: "dark-mode",     desc: "system theme vs explicit toggle — your call", dur: "4m" },
  { icon: "✻", iconColor: "var(--claude-soft)", name: "release-notes", desc: "draft ready — which feature leads?",         dur: "11m" },
];
// load-test row's description text changes during the second zoom — set imperatively
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

interface ChatMsg { type: "user" | "claude" | "bash"; text: string; reveal: number; type_dur?: number; }

const SECOND_CHAT: ChatMsg[] = [
  { type: "user",   text: SECOND_PROMPT,                                              reveal: 4000 },
  { type: "claude", text: "Reading load-test results then applying the index fix.",   reveal: 4250, type_dur: 380 },
  { type: "bash",   text: "⏺  Bash(npm run db:migrate)",                              reveal: 4750 },
  { type: "bash",   text: "⎿  applying migration 047_events_idx.sql",                 reveal: 5050 },
  { type: "bash",   text: "⎿  + CREATE INDEX events_org_ts",                          reveal: 5300 },
  { type: "bash",   text: "⎿  ✓ composite index live in 1.2s",                        reveal: 5550 },
  { type: "bash",   text: "⏺  Bash(npm run perf-audit)",                              reveal: 5800 },
  { type: "bash",   text: "⎿  p95 dropped to 41ms  (was 612ms)",                      reveal: 6100 },
];

export const Scene4_SecondPrompt: React.FC = () => {
  const paperRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null); // zoom container

  // Sub-terminals fading out (from previous scene's positions)
  const sub1Ref = useRef<HTMLDivElement>(null);
  const sub2Ref = useRef<HTMLDivElement>(null);
  const sub3Ref = useRef<HTMLDivElement>(null);
  const sub4Ref = useRef<HTMLDivElement>(null);

  // Hero terminal + chrome
  const heroRef = useRef<HTMLDivElement>(null);

  // Mascot traveling
  const mascotWrapRef = useRef<HTMLDivElement>(null);
  const cornerMascotRef = useRef<HTMLDivElement>(null); // appears in terminal corner

  // Task list rows
  const headerNRef = useRef<HTMLDivElement>(null);
  const headerWRef = useRef<HTMLDivElement>(null);
  const headerCRef = useRef<HTMLDivElement>(null);
  const needsRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const workingRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const completedRowRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Counters
  const cntA = useRef<HTMLSpanElement>(null);
  const cntW = useRef<HTMLSpanElement>(null);
  const cntC = useRef<HTMLSpanElement>(null);

  // Load-test row mutable parts (text + icon)
  const loadTestIconRef = useRef<HTMLSpanElement>(null);
  const loadTestDescRef = useRef<HTMLSpanElement>(null);
  const loadTestRowBgRef = useRef<HTMLDivElement>(null);

  // Second prompt
  const inputTextRef = useRef<HTMLSpanElement>(null);
  const inputCursorRef = useRef<HTMLSpanElement>(null);
  const promptMsgRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;

      // Paper drift
      if (paperRef.current) {
        const p = clamp(ms / 6500);
        paperRef.current.style.transform = `translateX(${lerp(45, 60, p)}px)`;
      }

      // Camera (whole scene zoom)
      // 0-2500: scale 1.0
      // 2500-4000: zoom in to scale 1.6, centered on input bar area
      // 4000-5500: continue zoom or hold (zoom even further on response area: scale 2.0)
      // 5500-6500: hold zoom 2.0
      let camScale = 1;
      let camX = 0;
      let camY = 0;
      if (ms < 2500) {
        camScale = 1;
        camX = 0;
        camY = 0;
      } else if (ms < 4000) {
        const p = track(ms, 2500, 4000, eases.inOutCubic);
        camScale = lerp(1.0, 1.6, p);
        // Pan camera to focus on bottom of terminal (input bar area is at y=540+220 = 760 in screen coords)
        // Bring that focus to center: pan UP by (760 - 540) * (scale - 1) ≈ 132
        camY = lerp(0, -180, p);
      } else if (ms < 5500) {
        const p = track(ms, 4000, 5500, eases.inOutCubic);
        camScale = lerp(1.6, 2.1, p);
        // Focus shifts UP slightly to show response above input
        camY = lerp(-180, -100, p);
      } else {
        // Hold
        camScale = 2.1;
        camY = -100;
      }
      if (cameraRef.current) {
        cameraRef.current.style.transformOrigin = `50% 50%`;
        cameraRef.current.style.transform = `translate(${camX}px, ${camY}px) scale(${camScale})`;
      }

      // Sub-terminals were ALREADY absorbed by the mascot in Scene 3,
      // so Scene 4 should NOT show them at corners. Keep them hidden.
      [sub1Ref, sub2Ref, sub3Ref, sub4Ref].forEach((ref) => {
        if (ref.current) {
          ref.current.style.opacity = "0";
          ref.current.style.display = "none";
        }
      });

      // Hero terminal entrance 0-700
      const heroP = track(ms, 0, 700, eases.outCubic);
      if (heroRef.current) {
        const scale = lerp(0.85, 1.0, heroP);
        heroRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
        heroRef.current.style.opacity = String(heroP);
      }

      // No traveling mascot in Scene 4 — the hero terminal already has the corner
      // avatar mascot visible. Corner mascot fades in with the terminal.
      if (mascotWrapRef.current) {
        mascotWrapRef.current.style.opacity = "0"; // hidden
      }
      if (cornerMascotRef.current) {
        const cP = track(ms, 300, 800, eases.outCubic);
        cornerMascotRef.current.style.opacity = String(cP);
      }

      // Task list reveals
      const revealRow = (el: HTMLDivElement | null, startMs: number) => {
        if (!el) return;
        const p = track(ms, startMs, startMs + 180, eases.outCubic);
        el.style.opacity = String(p);
        el.style.transform = `translateX(${lerp(-10, 0, p)}px)`;
      };
      revealRow(headerNRef.current, 1500);
      NEEDS_INPUT.forEach((_, i) => revealRow(needsRowRefs.current[i] ?? null, 1600 + i * 80));
      revealRow(headerWRef.current, 1850);
      WORKING.forEach((_, i) => revealRow(workingRowRefs.current[i] ?? null, 1950 + i * 80));
      revealRow(headerCRef.current, 2350);
      COMPLETED.forEach((_, i) => revealRow(completedRowRefs.current[i] ?? null, 2450 + i * 80));

      // Counters
      const cP = track(ms, 1500, 2200, eases.outCubic);
      if (cntA.current) cntA.current.textContent = String(Math.round(lerp(0, 2, cP)));
      if (cntW.current) cntW.current.textContent = String(Math.round(lerp(0, 5, cP)));
      if (cntC.current) cntC.current.textContent = String(Math.round(lerp(0, 2, cP)));

      // Second prompt typewriter (2500-3850, 32ms/char)
      const typeStart = 2700;
      const typeDur = 1100;
      if (ms < 4000) {
        if (inputTextRef.current) {
          inputTextRef.current.textContent = typewriter(ms, typeStart, typeDur, SECOND_PROMPT);
        }
        if (inputCursorRef.current) {
          inputCursorRef.current.style.opacity = Math.floor(ms / 450) % 2 === 0 ? "1" : "0";
        }
      } else {
        if (inputTextRef.current) inputTextRef.current.textContent = "";
        if (inputCursorRef.current) inputCursorRef.current.style.opacity = "0";
      }

      // ── Load-test row imperative update during second zoom ──
      // Pick the latest stage whose t has passed
      let activeStage = LOAD_TEST_STAGES[0];
      for (const stage of LOAD_TEST_STAGES) {
        if (ms >= stage.t) activeStage = stage;
      }
      if (loadTestIconRef.current) {
        loadTestIconRef.current.textContent = activeStage.icon;
        loadTestIconRef.current.style.color = activeStage.iconColor;
      }
      if (loadTestDescRef.current) {
        loadTestDescRef.current.textContent = activeStage.desc;
      }
      // Subtle background pulse when stage updates
      if (loadTestRowBgRef.current) {
        let bgIntensity = 0.08;
        if (ms >= 5700) {
          // Final "✓ p95 = 41ms" — green flash
          const flashP = track(ms, 5700, 6100, eases.outCubic);
          bgIntensity = 0.08 + 0.20 * flashP * (1 - flashP);  // peak then settle
          loadTestRowBgRef.current.style.background = `rgba(95,183,110,${bgIntensity})`;
        } else if (ms >= 4800) {
          loadTestRowBgRef.current.style.background = `rgba(204,120,92,${0.12})`;
        } else {
          loadTestRowBgRef.current.style.background = `rgba(255,255,255,${bgIntensity})`;
        }
      }

      // Second prompt chat reveals
      SECOND_CHAT.forEach((msg, i) => {
        const el = promptMsgRefs.current[i];
        if (!el) return;
        const start = msg.reveal;
        const p = track(ms, start, start + 200, eases.outCubic);
        if (msg.type_dur) {
          el.textContent = typewriter(ms, start, msg.type_dur, msg.text);
        }
        el.style.opacity = String(p);
        el.style.transform = `translateY(${lerp(10, 0, p)}px)`;
      });
    },
    []
  );

  return (
    <Timegroup
      mode="fixed"
      duration="7s"
      onFrame={handleFrame as any}
      className="absolute inset-0"
    >
      <PaperBackground ref={paperRef} />

      {/* Camera wrapper — scales the entire content for zoom-in */}
      <div
        ref={cameraRef}
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "50% 50%",
          willChange: "transform",
        }}
      >
        {/* Corner sub-terminals from previous scene fading out */}
        <div ref={sub1Ref} style={{ position: "absolute", left: 360 - 350, top: 240 - 220, width: 700, height: 440, opacity: 1, willChange: "opacity" }}>
          <Terminal width={700} height={440} title="agent-1" bodyStyle={{ fontSize: 22, padding: "14px 20px" }}>
            <div style={{ color: "var(--claude-soft)" }}>⏺  ✓ findings ready</div>
          </Terminal>
        </div>
        <div ref={sub2Ref} style={{ position: "absolute", left: 1560 - 350, top: 240 - 220, width: 700, height: 440, opacity: 1, willChange: "opacity" }}>
          <Terminal width={700} height={440} title="agent-2" bodyStyle={{ fontSize: 22, padding: "14px 20px" }}>
            <div style={{ color: "var(--claude-soft)" }}>⏺  ✓ findings ready</div>
          </Terminal>
        </div>
        <div ref={sub3Ref} style={{ position: "absolute", left: 360 - 350, top: 840 - 220, width: 700, height: 440, opacity: 1, willChange: "opacity" }}>
          <Terminal width={700} height={440} title="agent-3" bodyStyle={{ fontSize: 22, padding: "14px 20px" }}>
            <div style={{ color: "var(--claude-soft)" }}>⏺  ✓ findings ready</div>
          </Terminal>
        </div>
        <div ref={sub4Ref} style={{ position: "absolute", left: 1560 - 350, top: 840 - 220, width: 700, height: 440, opacity: 1, willChange: "opacity" }}>
          <Terminal width={700} height={440} title="agent-4" bodyStyle={{ fontSize: 22, padding: "14px 20px" }}>
            <div style={{ color: "var(--claude-soft)" }}>⏺  ✓ findings ready</div>
          </Terminal>
        </div>

        {/* Hero terminal */}
        <div
          ref={heroRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%) scale(0.85)",
            opacity: 0,
            width: 1100,
            height: 680,
            zIndex: 3,
            willChange: "transform, opacity",
          }}
        >
          <Terminal width={1100} height={680} title="acme — claude — 92×28">
            {/* Header with corner-mascot (without hat) */}
            <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 12 }}>
              <div ref={cornerMascotRef} style={{ opacity: 0, willChange: "opacity" }}>
                <Mascot variant="standard" pixel={6} />
              </div>
              <div>
                <div style={{ color: "var(--text-primary)", fontSize: 28, lineHeight: 1 }}>Claude Code</div>
                <div style={{ color: "var(--text-secondary)", fontSize: 24, marginTop: 2 }}>Opus (1M context) · ~/acme</div>
                <div style={{ color: "var(--text-secondary)", fontSize: 24, marginTop: 2 }}>
                  <span ref={cntA}>0</span> awaiting input · <span ref={cntW}>0</span> working · <span ref={cntC}>0</span> completed
                </div>
              </div>
            </div>

            {/* Task list */}
            <div ref={headerNRef} style={{ opacity: 0, color: "var(--text-primary)", fontSize: 26, fontWeight: 700, marginTop: 6, marginBottom: 4, willChange: "transform, opacity" }}>
              Needs input
            </div>
            {NEEDS_INPUT.map((row, i) => (
              <TaskRow key={`n${i}`} row={row} innerRef={(el) => { needsRowRefs.current[i] = el; }} />
            ))}
            <div ref={headerWRef} style={{ opacity: 0, color: "var(--text-primary)", fontSize: 26, fontWeight: 700, marginTop: 10, marginBottom: 4, willChange: "transform, opacity" }}>
              Working
            </div>
            {WORKING.map((row, i) => {
              const isLoadTest = row.name === "load-test";
              if (isLoadTest) {
                return (
                  <div
                    key={`w${i}`}
                    ref={(el) => {
                      workingRowRefs.current[i] = el;
                      loadTestRowBgRef.current = el;
                    }}
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
                      willChange: "transform, opacity, background",
                    }}
                  >
                    <span ref={loadTestIconRef} style={{ color: row.iconColor, fontSize: 22 }}>{row.icon}</span>
                    <span style={{ color: row.nameColor ?? "var(--text-primary)" }}>{row.name}</span>
                    <span ref={loadTestDescRef} style={{ color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis" }}>{row.desc}</span>
                    <span style={{ color: "var(--text-dim)", textAlign: "right" }}>{row.dur}</span>
                  </div>
                );
              }
              return <TaskRow key={`w${i}`} row={row} innerRef={(el) => { workingRowRefs.current[i] = el; }} />;
            })}
            <div ref={headerCRef} style={{ opacity: 0, color: "var(--text-primary)", fontSize: 26, fontWeight: 700, marginTop: 10, marginBottom: 4, willChange: "transform, opacity" }}>
              Completed
            </div>
            {COMPLETED.map((row, i) => (
              <TaskRow key={`c${i}`} row={row} innerRef={(el) => { completedRowRefs.current[i] = el; }} />
            ))}

            {/* Second-prompt chat (appears after the task list) */}
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              {SECOND_CHAT.map((msg, i) => {
                let color = "var(--text-primary)";
                if (msg.type === "user") color = "var(--text-primary)";
                else if (msg.type === "claude") color = "var(--text-primary)";
                else color = "var(--text-dim)";
                const isUser = msg.type === "user";
                return (
                  <div
                    key={i}
                    ref={(el) => { promptMsgRefs.current[i] = el; }}
                    style={{ opacity: 0, color, willChange: "transform, opacity" }}
                  >
                    {isUser ? (
                      <span style={{
                        display: "inline-block",
                        background: "rgba(204,120,92,0.20)",
                        borderLeft: "3px solid var(--claude)",
                        padding: "3px 14px",
                        borderRadius: "0 6px 6px 0",
                      }}>{msg.text}</span>
                    ) : msg.type === "claude" ? msg.text : (
                      <span style={{ color: msg.text.startsWith("⏺") ? "var(--claude-soft)" : "var(--text-dim)" }}>{msg.text}</span>
                    )}
                  </div>
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

        {/* Mascot traveling from center (Scene 3 continuation) → terminal corner */}
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 540,
            transform: "translate(-50%, -50%)",
            zIndex: 6,
          }}
        >
          <div ref={mascotWrapRef} style={{ willChange: "transform, opacity" }}>
            {/* Variant standard (no hat) since hat was removed in Scene 3 */}
            <Mascot variant="standard" pixel={14} />
          </div>
        </div>
      </div>
    </Timegroup>
  );
};

const TaskRow: React.FC<{ row: Row; innerRef: (el: HTMLDivElement | null) => void }> = ({ row, innerRef }) => (
  <div
    ref={innerRef}
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
      willChange: "transform, opacity",
    }}
  >
    <span style={{ color: row.iconColor, fontSize: 22 }}>{row.icon}</span>
    <span style={{ color: row.nameColor ?? "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis" }}>{row.name}</span>
    <span style={{ color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis" }}>{row.desc}</span>
    <span style={{ color: "var(--text-dim)", textAlign: "right" }}>{row.dur}</span>
  </div>
);

export default Scene4_SecondPrompt;
