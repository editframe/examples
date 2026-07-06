import React from "react";
import { Timegroup } from "@editframe/react";
import TerminalWindow, { AppSection, type AppRow } from "../components/TerminalWindow";
import CodeBlock from "../components/CodeBlock";
import { SCENES, HERO_TERM_CX, RET_TERM_W, RET_TERM_H, RET_TERM_CY, COMMAND_TEXT, TYPE_CPS } from "../constants";

const STATUS_RETURN = "0 awaiting input · 4 working · 0 completed";
const WORKING_ROWS_RETURN: AppRow[] = [
  { glyph: "✦", name: "apps/web", msg: "Reading routes…" },
  { glyph: "✦", name: "apps/admin", msg: "Reading routes…" },
  { glyph: "✦", name: "apps/docs", msg: "Reading routes…" },
  { glyph: "✦", name: "apps/storefront", msg: "Reading routes…" },
];

// Command-scene-local ms (converted from the original absolute cues — see
// constants.ts SCENES doc; this scene's own absolute start is 12900 - 700 = 12200).
const TYPE_START = 2350; // types character-by-character from here
const CMD_SUBMIT = 5280; // command submits -> chip + code stream take over

// Per-character reveal delay, computed once from each character's index (not
// per-frame) — replaces the old `typewriterCps` slice-by-elapsed-time helper.
// Non-space characters get their own `instant-show`-animated span (so the text
// still wraps naturally across lines); spaces are plain text nodes.
const MS_PER_CHAR = 1000 / TYPE_CPS;
const TYPED_CHARS = COMMAND_TEXT.split("").map((ch, i) => ({
  ch,
  delay: Math.round(TYPE_START + i * MS_PER_CHAR),
}));

/**
 * COMMAND — 0 → 12800ms local (own abs start = 12900 - 700 = 12200; the first
 * 700ms cross-fades in from Headlines). Covers the original beats 4 + 5: the
 * terminal returns, the command types on, the camera pushes in then back out,
 * and the AI's code output streams in — all inside the SAME terminal instance,
 * which is why this is one scene rather than two.
 *
 * The camera "zoom" only ever matters while this returned terminal is on
 * screen (14600–18020ms absolute, i.e. fully inside this scene), so unlike the
 * original it's scoped to a wrapper around just this terminal instead of a
 * global camera rig over the whole canvas — the other scenes never coincide
 * with the zoom window, so the rig was doing nothing for them anyway.
 *
 * The notification cards that grow in over the second half of this scene are
 * NOT rendered here — see `NotificationStack` (a sibling of the whole scene
 * sequence in Video.tsx), since their small→centered→scrolled lifecycle runs
 * past this scene's own end, all the way to the end of the video.
 */
export const Command: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.command.duration}ms`} className="absolute inset-0">
    <div
      className="absolute"
      style={{
        left: HERO_TERM_CX,
        top: RET_TERM_CY,
        transform: "translate(-50%, -50%)",
        zIndex: 3,
      }}
    >
      {/* Camera push-in — a separate wrapper from the static centering transform
          above, so the `cmd-camera-zoom` animation (which writes its own
          `transform: scale(...)`) doesn't clobber the translate(-50%,-50%) centering. */}
      <div
        style={{
          // 960/1920, 1090/1080 — origin near the terminal's bottom so the
          // zoomed-in view keeps the prompt + command in frame (header crops off above).
          transformOrigin: "50% 100.926%",
          animation: "cmd-camera-zoom 12800ms cubic-bezier(0.45,0,0.55,1) both",
        }}
      >
        <div style={{ animation: "cmd-term-in 250ms 700ms cubic-bezier(0.33,1,0.68,1) backwards, cmd-term-out 500ms 8850ms cubic-bezier(0.32,0,0.67,0) forwards" }}>
          <TerminalWindow width={RET_TERM_W} height={RET_TERM_H} title="Migrate dashboard to App Router">
            {/* Scrolling log: header + working list (pre-submit) OVERLAPS chip + thought
                + code (post-submit) at the same position — only one is ever visible,
                matching the original's display:none swap without reserving layout
                space for the hidden half. The whole stack translates UP after submit
                so the latest revealed code line stays in view. */}
            <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
              <div
                className="absolute left-0 right-0 top-0"
                style={{ animation: "cmd-log-scroll 12800ms steps(1) both" }}
              >
                <div className="relative" style={{ animation: `instant-hide 1ms ${CMD_SUBMIT}ms steps(1) forwards` }}>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: 28, lineHeight: 1.1 }}>Claude Code</div>
                    <div style={{ color: "var(--text-secondary)", fontSize: 25, marginTop: 2 }}>Opus 4.8 · ~/acme</div>
                    <div style={{ color: "var(--text-secondary)", fontSize: 25, marginTop: 2 }}>{STATUS_RETURN}</div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <AppSection label="Working" rows={WORKING_ROWS_RETURN} />
                  </div>
                </div>

                <div
                  className="absolute left-0 right-0 top-0"
                  style={{ opacity: 0, animation: `instant-show 1ms ${CMD_SUBMIT}ms steps(1) both` }}
                >
                  <div
                    style={{
                      background: "var(--term-sel-row)", borderRadius: 8, padding: "8px 12px",
                      color: "var(--text-primary)", fontSize: 19, lineHeight: 1.34, whiteSpace: "pre-wrap",
                      marginBottom: 10,
                      animation: `chip-fade-in 200ms ${CMD_SUBMIT}ms cubic-bezier(0.33,1,0.68,1) backwards`,
                    }}
                  >
                    {COMMAND_TEXT}
                  </div>
                  <div style={{ color: "var(--text-secondary)", fontSize: 18, marginBottom: 8, animation: "linear-fade-in 200ms 5600ms linear backwards" }}>
                    Thought for 2s (ctrl+o to expand)
                  </div>
                  <CodeBlock fontSize={18} />
                </div>
              </div>
            </div>

            {/* Bottom prompt bar (fixed) */}
            <div style={{ borderTop: "1px solid var(--terminal-border)", paddingTop: 8, flexShrink: 0, position: "relative" }}>
              {/* Typing prompt (pre-submit) overlaps the submitted hint (post-submit) */}
              <div
                className="absolute left-0 right-0"
                style={{ color: "var(--text-primary)", fontSize: 22, whiteSpace: "pre-wrap", animation: `instant-hide 1ms ${CMD_SUBMIT}ms steps(1) forwards` }}
              >
                <span style={{ color: "var(--text-secondary)", marginRight: 8 }}>❯</span>
                {TYPED_CHARS.map((c, i) =>
                  c.ch === " " ? (
                    " "
                  ) : (
                    <span key={i} style={{ display: "inline-block", opacity: 0, animation: `instant-show 1ms ${c.delay}ms steps(1) both` }}>
                      {c.ch}
                    </span>
                  )
                )}
                <span className="block-caret" style={{ opacity: 0, animation: `instant-show 1ms ${TYPE_START}ms steps(1) both, instant-hide 1ms ${CMD_SUBMIT}ms steps(1) forwards` }} />
              </div>
              <div
                className="relative"
                style={{ color: "var(--text-dim)", fontSize: 20, opacity: 0, animation: `instant-show 1ms ${CMD_SUBMIT}ms steps(1) both` }}
              >
                <span style={{ color: "var(--text-secondary)", marginRight: 8 }}>❯</span>Try "refactor &lt;filepath&gt;"
              </div>
              <div style={{ color: "var(--term-accent)", fontSize: 20, marginTop: 6, animation: "linear-fade-in 200ms 1400ms linear backwards" }}>
                <span style={{ marginRight: 8 }}>▶▶</span>auto mode on
              </div>
            </div>
          </TerminalWindow>
        </div>
      </div>
    </div>
  </Timegroup>
);

export default Command;
