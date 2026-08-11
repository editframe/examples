/**
 * Terminal — ONE continuous terminal that accumulates all CLI output
 * Local time: 0–11500ms (scene-local; was master 0–11500ms — this is the
 * first scene, so its own clock always equalled the master clock)
 *
 * Architecture: a single tall terminal container with ALL lines rendered at
 * full natural size. A camera wrapper applies scale(S) + translateX/Y with
 * transformOrigin:"0 0" (top-left anchor). The camera choreographs 5 stages:
 *
 * STAGE A — PANNED OUT (0–3000ms): scale≈1.0, whole window + purple bg visible.
 *   The terminal window floats centered on the purple gradient, purple margin on
 *   all sides. Holds while clerk login + login output types.
 *
 * STAGE B — ZOOM IN on "clerk init" (3000–3700ms): scale≈2.1, focus on
 *   the clerk-init region. Smooth 700ms zoom-in triggered when clerk init types.
 *
 * STAGE C — RAPID GENERATION (3700–5000ms, ~1.3s): hold at Stage-B zoom.
 *   The 24 clerk init output lines stream in rapidly (65ms per line).
 *
 * STAGE D — ZOOM BACK OUT (5000–6200ms): smooth 1.2s zoom back to Stage-A
 *   panned-out framing (scale=1.0, centered windowed view).
 *
 * STAGE E — ZOOM INTO BOTTOM-LEFT (7800–9000ms → hold): scale≈2.2, camera
 *   pans to bottom-left corner framing the final ✓ Clerk has been set up / Done
 *   lines in the lower-left. Matches reference end framing.
 *
 * Camera math: transformOrigin "0 0" + translateX(tx) translateY(ty) scale(S).
 *   screen_x = tx + element_x * S
 *   screen_y = ty + element_y * S
 *
 * Lines 9–32: timings compressed to 3500–5000ms (~1.5s rapid burst). All other
 * lines (0–8) unchanged.
 *
 * NOTHING after 11500ms is touched (Tagline + LogoCard stay as-is).
 *
 * --- REFACTOR-PATTERNS.md Part 2b conversion ---
 * Every one of these behaviors used to be computed per-frame in a single
 * `onFrame` callback and written to refs. All of it is a fixed, deterministic
 * function of this scene's own local time, so all of it converts cleanly to
 * CSS driven purely by `<Timegroup>`'s own clock:
 *  - Window fade-in, per-line fade+float-in, the one-line purple glow ->
 *    `Reveal` (priority 1) / a small one-shot `term-line-glow` keyframe.
 *  - The 33 lines' staggered entrances -> per-item `animation-delay` computed
 *    once from each line's own `ms` field (priority 2).
 *  - The two commands' char-by-char typing -> `Typewriter` (priority 4, a
 *    `steps()` width reveal — see components/Typewriter.tsx).
 *  - The two commands' blinking cursors -> `Cursor` (priority 3, an infinite
 *    loop + a one-shot cutoff — see components/Cursor.tsx).
 *  - The window height expansion and the 5-stage camera pan/zoom -> bespoke
 *    `@keyframes` (priority 4 — shape morphs / multi-stage transitions). Both
 *    are single fixed-duration timelines with keyframe stops at known
 *    percentages of this scene's own 11500ms duration (see the derivation
 *    comments below and in styles.css) — no per-frame lerp/track composition
 *    needed once every stage boundary is expressed as a keyframe percentage.
 */
import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { cc, fonts } from "../lib/colors";
import { Reveal } from "@shared/components/Reveal";
import { Typewriter } from "../components/Typewriter";
import { Cursor } from "../components/Cursor";

const SCENE_START = 0;
const DURATION = 11500;

// ─── Terminal dimensions ────────────────────────────────────────────────────
const TERMINAL_W = 1300;
const FONT_SIZE = 26;
const LINE_H = 40;
const PADDING_TOP = 28;
const PADDING_LEFT = 36;
const TITLEBAR_H = 44;
const PADDING_BOTTOM = 60;

// Window height animation: starts compact (Stage A), expands as lines pour in.
// VISIBLE_HEIGHT_MIN = titlebar + top-padding + 12 lines + bottom-padding (compact initial)
const VISIBLE_HEIGHT_MIN = TITLEBAR_H + PADDING_TOP + 12 * LINE_H + PADDING_BOTTOM; // 612px
// VISIBLE_HEIGHT_MAX = titlebar + top-padding + 33 lines + bottom-padding (fully expanded)
const VISIBLE_HEIGHT_MAX = TITLEBAR_H + PADDING_TOP + 33 * LINE_H + PADDING_BOTTOM;  // 1452px
// Height expands during the rapid-generation burst (Stage C).
// Expressed below as % of DURATION for the `terminal-window-expand` keyframes in styles.css:
//   HEIGHT_EXPAND_START 3500 / 11500 = 30.4348%
//   HEIGHT_EXPAND_END   5200 / 11500 = 45.2174%

// ─── Camera stage parameters ────────────────────────────────────────────────
// All camera states: (tx, ty, S) for each stage.
// Formula: screen_x = tx + element_x * S  |  screen_y = ty + element_y * S
// where element coords are within the camera wrapper (origin at its top-left).

// Stage A: panned out — compact terminal window floats centered on purple gradient.
// At S_A=0.78, the compact (612px-tall) window on screen:
//   screen_width  = 1300 * 0.78 = 1014px → centered: TX_A = (1920-1014)/2 = 453
//   screen_height = 612  * 0.78 = 477px  → centered: TY_A = (1080-477)/2  = 302
const TX_A = 453;
const TY_A = 302;
const S_A = 0.78;

// Stage B/C: zoomed in on clerk init region (line index 8).
// Anchor line 3 (login tail, element_y=212) at screen y≈0; symbols start ~46px from left.
const TX_B = -30;
const TY_B = -445;
const S_B = 2.1;

// Stage D: zoom back out — window is now FULLY EXPANDED (1452px tall).
// Fit the full window on screen at S_D=0.70:
//   screen_width  = 1300 * 0.70 = 910px  → centered: TX_D = (1920-910)/2  = 505
//   screen_height = 1452 * 0.70 = 1016px → centered: TY_D = (1080-1016)/2 = 32
const TX_D = 505;
const TY_D = 32;
const S_D = 0.7;

// Stage E: bottom-left zoom — frames bottom-left CORNER of the window with the
// final lines (✓ Clerk... / Pulling env vars / Env vars written / └ Done) above it.
// Window bottom-left corner at element (x=0, y=VISIBLE_HEIGHT_MAX=1452).
// Target: corner at screen (x=130, y=810).
const TX_E = 130;
const TY_E = -2239; // 810 - 1452*2.1
const S_E = 2.1;

// ─── Camera stage transitions ───────────────────────────────────────────────
// Expressed below as % of DURATION for the `terminal-camera` keyframes in styles.css:
//   ZOOM_IN_START  3100 / 11500 = 26.9565%  (A -> B starts)
//   ZOOM_IN_END    3800 / 11500 = 33.0435%  (B settled)
//   ZOOM_OUT_START 5000 / 11500 = 43.4783%  (B -> D starts)
//   ZOOM_OUT_END   6200 / 11500 = 53.9130%  (D settled)
//   ZOOM_BL_START  7800 / 11500 = 67.8261%  (D -> E starts)
//   ZOOM_BL_END    9100 / 11500 = 79.1304%  (E settled)

// ─── All CLI lines ──────────────────────────────────────────────────────────
type LineType = "prompt" | "out" | "spacer";

interface TermLine {
  ms: number;
  type: LineType;
  symbol?: string;
  symColor?: string;
  text: string;
  textColor: string;
  isCmd?: boolean;
  cmdDuration?: number;
  isAction?: "CREATE" | "MODIFY";
  glow?: boolean;
}

// Lines 0–8: UNCHANGED timings
// Lines 9–32: COMPRESSED to 3500–5000ms (~65ms per line) — Stage C rapid burst
const LINES: TermLine[] = [
  // ── clerk login command (index 0–7, timings unchanged) ──
  { ms: 300,  type: "prompt", text: "clerk login",  textColor: cc.fg, isCmd: true, cmdDuration: 500 },
  { ms: 1200, type: "out", symbol: "┌", symColor: cc.fgDim,      text: " clerk auth login",                            textColor: cc.fgMuted },
  { ms: 1400, type: "out", symbol: "◇", symColor: cc.purpleSoft,  text: " Checking session",                            textColor: cc.fgMuted },
  { ms: 1600, type: "out", symbol: "│", symColor: cc.fgDim,      text: " Waiting for authentication (timeout in 2m)...", textColor: cc.fgMuted },
  { ms: 1900, type: "out", symbol: "◇", symColor: cc.purpleSoft,  text: " Completing authentication",                   textColor: cc.fgMuted },
  { ms: 2100, type: "out", symbol: "│", symColor: cc.fgDim,      text: "",                                              textColor: cc.fgMuted },
  { ms: 2300, type: "out", symbol: "│", symColor: cc.fgDim,      text: " Logged in as steve@clerk.dev",                 textColor: cc.fg },
  { ms: 2550, type: "out", symbol: "└", symColor: cc.fgDim,      text: " Done",                                         textColor: cc.fgMuted },

  // ── clerk init command (index 8, timing unchanged) ──
  { ms: 2900, type: "prompt", text: "clerk init",   textColor: cc.fg, isCmd: true, cmdDuration: 500 },

  // ── clerk init output (indices 9–32, COMPRESSED to 3500–5000ms, ~65ms apart) ──
  { ms: 3500, type: "out", symbol: "┌", symColor: cc.fgDim,      text: " clerk init",                                  textColor: cc.fgMuted },
  { ms: 3565, type: "out", symbol: "◇", symColor: cc.purpleSoft,  text: " Detecting framework",                         textColor: cc.fgMuted },
  { ms: 3630, type: "out", symbol: "│", symColor: cc.fgDim,      text: " Logged in as steve@clerk.dev",                 textColor: cc.fg },
  { ms: 3695, type: "out", symbol: "┌", symColor: cc.fgDim,      text: " clerk link",                                   textColor: cc.fgMuted },
  { ms: 3760, type: "out", symbol: "◇", symColor: cc.purpleSoft,  text: " Fetching applications",                       textColor: cc.fgMuted },
  { ms: 3825, type: "out", symbol: "✔", symColor: cc.purpleSoft,  text: " Select a Clerk application to link (repo: taskflow-web) TaskFlow", textColor: cc.fg },
  { ms: 3890, type: "out", symbol: "│", symColor: cc.fgDim,      text: " Linked to TaskFlow in ~/Dev/taskflow-web",     textColor: cc.fgMuted },
  { ms: 3955, type: "out", symbol: "│", symColor: cc.fgDim,      text: " Detected Next.js (app-router)",                textColor: cc.fgMuted },
  { ms: 4020, type: "out", symbol: "│", symColor: cc.fgDim,      text: " Installing @clerk/nextjs for Next.js...",      textColor: cc.fgMuted },
  { ms: 4085, type: "out", symbol: " ", symColor: cc.fgDim,      text: "  added 13 packages in 3s",                    textColor: cc.fgMuted },
  { ms: 4150, type: "out", symbol: "│", symColor: cc.fgDim,      text: " clerk init will make the following changes:",  textColor: cc.fgMuted },
  { ms: 4215, type: "out", symbol: "│", symColor: cc.fgDim,      text: "",                                              textColor: cc.fgMuted },
  { ms: 4280, type: "out", symbol: "│", symColor: cc.fgDim,      text: "   proxy.ts",                                   textColor: cc.fg, isAction: "CREATE" },
  { ms: 4345, type: "out", symbol: "│", symColor: cc.fgDim,      text: "   app/layout.tsx",                             textColor: cc.fg, isAction: "MODIFY" },
  { ms: 4410, type: "out", symbol: "│", symColor: cc.fgDim,      text: "   app/sign-in/[[...sign-in]]/page.tsx",        textColor: cc.fg, isAction: "CREATE" },
  { ms: 4475, type: "out", symbol: "│", symColor: cc.fgDim,      text: "   app/sign-up/[[...sign-up]]/page.tsx",        textColor: cc.fg, isAction: "CREATE" },
  { ms: 4540, type: "out", symbol: "│", symColor: cc.fgDim,      text: "   .env.local",                                 textColor: cc.fg, isAction: "MODIFY" },
  { ms: 4605, type: "out", symbol: "✔", symColor: cc.purpleSoft,  text: " Proceed? Yes",                                textColor: cc.fg },
  { ms: 4670, type: "out", symbol: "◇", symColor: cc.purpleSoft,  text: " Writing files",                               textColor: cc.fgMuted },
  { ms: 4735, type: "out", symbol: "◇", symColor: cc.purpleSoft,  text: " Scanning for issues",                         textColor: cc.fgMuted },
  { ms: 4800, type: "out", symbol: "│", symColor: cc.fgDim,      text: " ✓ Clerk has been set up in your project",     textColor: cc.fg, glow: true },
  { ms: 4865, type: "out", symbol: "◇", symColor: cc.purpleSoft,  text: " Pulling env vars from development instance",  textColor: cc.fgMuted },
  { ms: 4930, type: "out", symbol: "│", symColor: cc.fgDim,      text: " Environment variables written to .env.local",  textColor: cc.fgMuted },
  { ms: 5000, type: "out", symbol: "└", symColor: cc.fgDim,      text: " Done",                                         textColor: cc.fgMuted },
];

export function Terminal() {
  return (
    <Timegroup
      mode="fixed"
      duration={`${DURATION}ms`}
      style={{
        position: "relative",
        width: 1920,
        height: 1080,
        overflow: "hidden",
        background: "#1A0B33",
      }}
    >
      <TraceLayer sceneStartMs={SCENE_START} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* Keyboard SFX — fires on each typed command submit. Scene-local offsets
          equal global time since this is the first scene in the sequence.
          `duration="500ms"` trims the 2.2s source .wav down to just the transient,
          matching the old mux script's `atrim=duration=0.5`. */}
      <Audio src="/clerk-cli-demo/src/assets/sfx/clerk-cli-demo-keyboard.wav" offset="300ms" duration="500ms" volume={0.7} />
      <Audio src="/clerk-cli-demo/src/assets/sfx/clerk-cli-demo-keyboard.wav" offset="2900ms" duration="500ms" volume={0.7} />

      {/* Purple radial gradient backdrop */}
      {!TRACE_MODE && (
        <>
          <div style={{
            position: "absolute",
            left: -200, bottom: -200,
            width: 900, height: 900,
            borderRadius: "50%",
            background: "radial-gradient(circle at center, rgba(124,58,237,0.72) 0%, rgba(124,58,237,0.35) 30%, rgba(88,28,235,0.12) 60%, transparent 80%)",
            filter: "blur(40px)",
            mixBlendMode: "screen",
            zIndex: 1,
          }} />
          <div style={{
            position: "absolute",
            right: -200, bottom: -200,
            width: 850, height: 850,
            borderRadius: "50%",
            background: "radial-gradient(circle at center, rgba(124,58,237,0.65) 0%, rgba(124,58,237,0.3) 30%, rgba(88,28,235,0.10) 60%, transparent 80%)",
            filter: "blur(45px)",
            mixBlendMode: "screen",
            zIndex: 1,
          }} />
          <div style={{
            position: "absolute",
            left: "50%",
            top: -300,
            transform: "translateX(-50%)",
            width: 700, height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle at center, rgba(107,63,204,0.25) 0%, transparent 70%)",
            filter: "blur(60px)",
            mixBlendMode: "screen",
            zIndex: 1,
          }} />
        </>
      )}

      {/* Camera wrapper — applies zoom + pan via the `terminal-camera` keyframes.
          The --cam-(a|b|d|e)-(x|y|s) custom properties feed the TX/TY/S constants
          derived above into the CSS keyframes in styles.css. */}
      <div
        style={
          {
            position: "absolute",
            left: 0,
            top: 0,
            transformOrigin: "0 0",
            zIndex: 10,
            "--cam-a-x": `${TX_A}px`, "--cam-a-y": `${TY_A}px`, "--cam-a-s": S_A,
            "--cam-b-x": `${TX_B}px`, "--cam-b-y": `${TY_B}px`, "--cam-b-s": S_B,
            "--cam-d-x": `${TX_D}px`, "--cam-d-y": `${TY_D}px`, "--cam-d-s": S_D,
            "--cam-e-x": `${TX_E}px`, "--cam-e-y": `${TY_E}px`, "--cam-e-s": S_E,
            animation: `terminal-camera ${DURATION}ms both`,
          } as React.CSSProperties
        }
      >
        {/* Terminal window — starts compact, expands as lines stream in */}
        <div
          style={
            {
              width: TERMINAL_W,
              height: VISIBLE_HEIGHT_MIN,
              borderRadius: 12,
              border: `1px solid ${cc.border}`,
              boxShadow: "0 24px 80px rgba(0,0,0,0.65)",
              overflow: "hidden",
              "--win-h-min": `${VISIBLE_HEIGHT_MIN}px`,
              "--win-h-max": `${VISIBLE_HEIGHT_MAX}px`,
              animation: [
                "term-win-fade-in 260ms 60ms cubic-bezier(0.33,1,0.68,1) backwards",
                `terminal-window-expand ${DURATION}ms both`,
              ].join(", "),
            } as React.CSSProperties
          }
        >
          {/* Title bar — NO traffic light dots, centered label only */}
          <div style={{
            width: "100%",
            height: TITLEBAR_H,
            background: "#1C1C1C",
            borderBottom: `1px solid ${cc.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            position: "relative",
          }}>
            <span style={{
              fontSize: 13,
              color: cc.fgMuted,
              fontFamily: fonts.mono,
            }}>~/Dev/taskflow-web</span>
          </div>

          {/* Terminal body — full content height; parent window clips it */}
          <div
            style={{
              width: "100%",
              height: VISIBLE_HEIGHT_MAX - TITLEBAR_H,
              background: "#131316",
              paddingTop: PADDING_TOP,
              paddingBottom: PADDING_BOTTOM,
              paddingLeft: PADDING_LEFT,
              paddingRight: PADDING_LEFT,
              boxSizing: "border-box",
              fontFamily: fonts.mono,
              fontSize: FONT_SIZE,
              lineHeight: `${LINE_H}px`,
              overflow: "visible",
            }}
          >
            {LINES.map((line, i) => {
              if (line.isCmd) {
                const typingEndMs = line.ms + (line.cmdDuration ?? 0);
                return (
                  <Reveal
                    key={i}
                    enter={[line.ms - 100, line.ms + 100]}
                    y={0}
                    style={{ display: "flex", alignItems: "center", height: LINE_H }}
                  >
                    <span style={{ color: cc.fgMuted }}>steve@MacBook-Pro taskflow-web % </span>
                    <Typewriter charCount={line.text.length} delay={line.ms} duration={line.cmdDuration ?? 0}>
                      <span style={{ color: cc.fg, fontWeight: 600 }}>{line.text}</span>
                    </Typewriter>
                    <Cursor showAt={line.ms} hideAt={typingEndMs + 300} />
                  </Reveal>
                );
              }
              return (
                <Reveal
                  key={i}
                  enter={[line.ms, line.ms + 200]}
                  y={6}
                  style={{ display: "flex", alignItems: "baseline", height: LINE_H, gap: 6 }}
                >
                  <span style={{
                    color: line.symColor ?? cc.fgDim,
                    minWidth: 20,
                    textAlign: "center",
                    flexShrink: 0,
                  }}>
                    {line.symbol}
                  </span>
                  <span
                    style={{
                      color: line.textColor,
                      ...(line.glow ? { animation: `term-line-glow 500ms ${line.ms + 200}ms forwards` } : {}),
                    }}
                  >
                    {line.isAction ? (
                      <>
                        <span style={{ color: cc.purpleHi, fontWeight: 700 }}>{line.isAction}</span>
                        {line.text}
                      </>
                    ) : line.text}
                  </span>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </Timegroup>
  );
}

Terminal.duration = DURATION;
