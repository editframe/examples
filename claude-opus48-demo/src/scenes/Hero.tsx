import React from "react";
import { Timegroup } from "@editframe/react";
import { Reveal } from "../components/Reveal";
import TerminalWindow, { AppSection, type AppRow } from "../components/TerminalWindow";
import { SCENES, HERO_TERM_W, HERO_TERM_H, HERO_TERM_CX, HERO_TERM_CY } from "../constants";

// Status-line strings (instant swaps, no fade — matches the original textContent swap)
const STATUS_0 = "0 awaiting input · 0 working · 0 completed";
const STATUS_1 = "0 awaiting input · 1 working · 0 completed";
const STATUS_2 = "1 awaiting input · 4 working · 0 completed";
const STATUS_FINAL = "3 awaiting input · 1 working · 0 completed";

const NEEDS_INPUT_ROWS: AppRow[] = [
  { glyph: "✱", name: "apps/web", msg: "Ready to implement this change?", count: "1s", selected: true },
  { glyph: "✱", name: "apps/admin", msg: "New admin toggle is ready for review.", count: "1s" },
  { glyph: "✱", name: "apps/docs", msg: "Done. Docs are refreshed with the latest.", count: "1s" },
];
const WORKING_ROWS: AppRow[] = [
  { glyph: "✦", name: "apps/storefront", msg: "Reading routes…", count: "1s" },
];

/**
 * HERO — 0 → 8000ms local (8000ms total; the last 700ms cross-fades into Headlines).
 * Terminal window scales+fades in, the status line steps through 3 states as work
 * comes in, the "Working" line briefly appears then is replaced by the full
 * "Needs input" list. The terminal shrinks + fades away in the last 700ms
 * (7300–8000ms), handing off to the Headlines scene.
 *
 * The creature perching/walking and the kites popping in over this scene are
 * NOT rendered here — they're `<CreatureAndKites>`, a sibling of the whole scene
 * sequence in Video.tsx, because they stay on screen continuously through the
 * Headlines scene too (see that component's doc comment).
 */
export const Hero: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.hero.duration}ms`} className="absolute inset-0">
    <div
      className="absolute"
      style={{
        left: HERO_TERM_CX,
        top: HERO_TERM_CY,
        transform: "translate(-50%, -50%)",
        zIndex: 5,
      }}
    >
      {/* exits (shrink + fade) in the scene's last 700ms as Headlines crosses in */}
      <div style={{ animation: "hero-wrap-out 700ms 7300ms cubic-bezier(0.32,0,0.67,0) forwards" }}>
        <TerminalWindow
          width={HERO_TERM_W}
          height={HERO_TERM_H}
          headerTitle="Claude Code"
          subtitle="Opus 4.7 · ~/acme"
          style={{
            transformOrigin: "center center",
            animation: [
              "hero-term-in 300ms linear backwards",
              "hero-term-scale-in 600ms cubic-bezier(0.34,1.56,0.64,1) backwards",
            ].join(", "),
          }}
        >
          {/* Status line — instant swap between 4 states, no fade (matches the
              original textContent swap). Fixed height so the stack doesn't reflow. */}
          <div style={{ position: "relative", height: 32, marginTop: -10, marginBottom: 10 }}>
            <div className="term-status" style={{ animation: "instant-show 1ms 0ms steps(1) both, instant-hide 1ms 917ms steps(1) forwards" }}>{STATUS_0}</div>
            <div
              className="term-status"
              style={{ animation: "instant-show 1ms 917ms steps(1) both, instant-hide 1ms 1917ms steps(1) forwards" }}
            >
              {STATUS_1}
            </div>
            <div
              className="term-status"
              style={{ animation: "instant-show 1ms 1917ms steps(1) both, instant-hide 1ms 3083ms steps(1) forwards" }}
            >
              {STATUS_2}
            </div>
            <div className="term-status" style={{ animation: "instant-show 1ms 3083ms steps(1) both" }}>
              {STATUS_FINAL}
            </div>
          </div>

          {/* "Working" line — appears at 917ms, replaced by the needs-input list at 1917ms */}
          <Reveal enter={[917, 1167]} exit={[1917, 2117]} y={0}>
            <div style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: 27 }}>Working</div>
            <div style={{ color: "var(--text-secondary)", fontSize: 27 }}>
              <span style={{ color: "var(--text-secondary)", marginRight: 8 }}>✦</span>
              apps/web&nbsp;&nbsp;&nbsp;&nbsp;Reading routes…
            </div>
          </Reveal>

          {/* Needs-input list — appears at 1917ms, stays through the rest of the scene */}
          <Reveal enter={[1917, 2217]} y={0} style={{ position: "absolute", left: 22, right: 22, top: 130 }}>
            <AppSection label="Needs input" rows={NEEDS_INPUT_ROWS} />
            <AppSection label="Working" rows={WORKING_ROWS} />
          </Reveal>

          <div style={{ marginTop: "auto", borderTop: "1px solid var(--terminal-border)", paddingTop: 8 }}>
            <div style={{ color: "var(--text-dim)", fontSize: 24 }}>
              <span style={{ color: "var(--text-secondary)", marginRight: 8 }}>❯</span>describe a task for a new session
            </div>
          </div>
        </TerminalWindow>
      </div>
    </div>
  </Timegroup>
);

export default Hero;
