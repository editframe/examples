/**
 * SceneTerminal — ONE continuous terminal that accumulates all CLI output
 * Master time: 0–11500ms (duration 11500ms)
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
 * NOTHING after 11500ms is touched (Scene6 + Scene7 stay as-is).
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { cc, fonts } from "../lib/colors";
import { track, blinkCursor, lerp, clamp, typewriter } from "../components/helpers";

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
// VISIBLE_HEIGHT_MIN = titlebar + top-padding + 10 lines + bottom-padding (compact initial)
const VISIBLE_HEIGHT_MIN = TITLEBAR_H + PADDING_TOP + 12 * LINE_H + PADDING_BOTTOM; // 612px (ROUND-8f: slightly taller, ~2.1:1 h:w — was too short/wide at 10 lines)
// VISIBLE_HEIGHT_MAX = titlebar + top-padding + 33 lines + bottom-padding (fully expanded)
const VISIBLE_HEIGHT_MAX = TITLEBAR_H + PADDING_TOP + 33 * LINE_H + PADDING_BOTTOM;  // 1452px
// Height expands during the rapid-generation burst (Stage C)
const HEIGHT_EXPAND_START = 3500; // first rapid line appears
const HEIGHT_EXPAND_END   = 5200; // last line (5000ms) + 200ms buffer

// ─── Camera stage parameters ────────────────────────────────────────────────
// All camera states: (tx, ty, S) for each stage.
// Formula: screen_x = tx + element_x * S  |  screen_y = ty + element_y * S
// where element coords are within the cameraRef (origin at its top-left).

// Stage A: panned out — compact terminal window floats centered on purple gradient.
// The window starts at VISIBLE_HEIGHT_MIN (compact: titlebar + ~10 lines + padding).
// At S_A=0.78, the compact window on screen:
//   screen_width  = 1300 * 0.78 = 1014px → centered: TX_A = (1920-1014)/2 = 453
//   screen_height = 532  * 0.78 = 415px  → centered: TY_A = (1080-415)/2  = 332
// Purple margin: ~332px top/bottom, ~453px left/right — matches reference compact look.
const TX_A = 453;
const TY_A = 302;   // ROUND-8f: re-centred for the taller 612px window (×0.78=477px → (1080-477)/2)
const S_A  = 0.78;

// Stage B/C: zoomed in on clerk init region (line index 8)
// Line 8 (clerk init prompt) center in element space:
//   y = TITLEBAR_H + PADDING_TOP + 8*LINE_H + LINE_H/2 = 44+28+320+20 = 412px
// We want lines 3–8 visible (login tail + clerk init prompt).
// Line 3 (index 3) y_element = 44+28+3*40+20 = 212px
// Anchor line 3 at screen y≈0 → ty_B = 0 - 212*S_B
// Use tx such that symbols start at ~46px from left
const S_B  = 2.1;
const TX_B = -30;    // screen_x of text left edge = -30 + 36*2.1 = 45.6 ≈ 46
const TY_B = -445;   // line 3 at screen y = -445 + 212*2.1 = 0; clerk init (line 8) at y = -445 + 412*2.1 = 420

// Stage D: zoom back out — but now the window is FULLY EXPANDED (1452px tall).
// Fit the full window on screen at S_D=0.70:
//   screen_width  = 1300 * 0.70 = 910px  → centered: TX_D = (1920-910)/2  = 505
//   screen_height = 1452 * 0.70 = 1016px → centered: TY_D = (1080-1016)/2 = 32
// This is the "all-output visible" panned-out view after rapid generation.
const TX_D = 505;
const TY_D = 32;
const S_D  = 0.70;

// Stage E: bottom-left zoom — frames bottom-left CORNER of the window with
// final lines (✓ Clerk... / Pulling env vars / Env vars written / └ Done) above it.
// Window bottom-left corner at element (x=0, y=VISIBLE_HEIGHT_MAX=1452).
// Target: corner at screen (x=130, y=810) — with 270px purple margin below.
// At S_E=2.1:
//   tx_E = 130  (left edge of terminal at screen x=130)
//   ty_E = 810 - 1452*2.1 = 810 - 3049 = -2239
// Verify lines in frame:
//   Line 29 (✓ Clerk) element_y=1232 → screen_y = -2239 + 1232*2.1 = 348 ✓
//   Line 32 (└ Done)  element_y=1392 → screen_y = -2239 + 1392*2.1 = 684 ✓
//   Window bottom corner screen_y = -2239 + 1452*2.1 = 810 ✓  (purple bg visible below)
const S_E  = 2.1;
const TX_E = 130;
const TY_E = -2239;

// ─── Camera stage transitions ───────────────────────────────────────────────
const ZOOM_IN_START  = 3100;   // Stage A → B starts (200ms lag after clerk init types at 2900)
const ZOOM_IN_END    = 3800;   // Stage B fully settled
const ZOOM_OUT_START = 5000;   // Stage C → D starts (generation complete)
const ZOOM_OUT_END   = 6200;   // Stage D fully settled
const HOLD_END       = 7800;   // Stage D hold ends
const ZOOM_BL_START  = 7800;   // Stage D → E starts
const ZOOM_BL_END    = 9100;   // Stage E fully settled

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

export function SceneTerminal() {
  const cameraRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cmdSpanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const cursorRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const winRef = useRef<HTMLDivElement>(null);
  const winBodyRef = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // ── Window fade in ──
    if (winRef.current) {
      const t = track(ms, 60, 320);
      winRef.current.style.opacity = `${t}`;
    }

    // ── Window height expansion — compact → full as lines stream in ──
    if (winRef.current && winBodyRef.current) {
      const tH = track(ms, HEIGHT_EXPAND_START, HEIGHT_EXPAND_END);
      const h = lerp(VISIBLE_HEIGHT_MIN, VISIBLE_HEIGHT_MAX, tH);
      winRef.current.style.height = `${h}px`;
    }

    // ── Animate each line ──
    LINES.forEach((line, i) => {
      const el = lineRefs.current[i];
      if (!el) return;

      if (line.isCmd) {
        const t = track(ms, line.ms - 100, line.ms + 100);
        el.style.opacity = `${t}`;
        const cmdSpan = cmdSpanRefs.current[i];
        if (cmdSpan && line.cmdDuration) {
          cmdSpan.textContent = typewriter(ms, line.ms, line.cmdDuration, line.text);
        }
        const cur = cursorRefs.current[i];
        if (cur) {
          const typingDone = ms > line.ms + (line.cmdDuration || 0) + 300;
          cur.style.opacity = typingDone ? "0" : (blinkCursor(ms) ? "1" : "0");
        }
      } else {
        const t = track(ms, line.ms, line.ms + 200);
        el.style.opacity = `${t}`;
        el.style.transform = `translateY(${(1 - t) * 6}px)`;
        if (line.glow && t > 0.3) {
          const glowT = track(ms, line.ms + 200, line.ms + 700);
          el.style.textShadow = `0 0 ${10 * glowT}px rgba(124,58,237,0.65)`;
        }
      }
    });

    // ── 5-stage camera choreography ──
    if (!cameraRef.current) return;

    // Progress for each transition (0→1)
    const pZoomIn  = track(ms, ZOOM_IN_START,  ZOOM_IN_END);   // A→B
    const pZoomOut = track(ms, ZOOM_OUT_START, ZOOM_OUT_END);  // B→D (same as A)
    const pZoomBL  = track(ms, ZOOM_BL_START,  ZOOM_BL_END);   // D→E

    // Compose the 5 stages:
    // Stage A base:
    let tx = TX_A;
    let ty = TY_A;
    let S  = S_A;

    // Stage B: zoom in (lerp from A to B)
    tx = lerp(tx, TX_B, pZoomIn);
    ty = lerp(ty, TY_B, pZoomIn);
    S  = lerp(S,  S_B,  pZoomIn);

    // Stage D: zoom back out (lerp from current B toward D=A)
    tx = lerp(tx, TX_D, pZoomOut);
    ty = lerp(ty, TY_D, pZoomOut);
    S  = lerp(S,  S_D,  pZoomOut);

    // Stage E: zoom to bottom-left (lerp from current D toward E)
    tx = lerp(tx, TX_E, pZoomBL);
    ty = lerp(ty, TY_E, pZoomBL);
    S  = lerp(S,  S_E,  pZoomBL);

    cameraRef.current.style.transform = `translateX(${tx}px) translateY(${ty}px) scale(${S})`;
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration={`${DURATION}ms`}
      onFrame={onFrame as any}
      style={{
        position: "relative",
        width: 1920,
        height: 1080,
        overflow: "hidden",
        background: "#1A0B33",
      }}
    >
      <TraceLayer sceneStartMs={SCENE_START} enabled={TRACE_MODE} opacity={0.5} />

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

      {/* Camera wrapper — applies zoom + pan via transform with transformOrigin "0 0" */}
      <div
        ref={cameraRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transformOrigin: "0 0",
          // Initial state = Stage A (panned out, windowed)
          transform: `translateX(${TX_A}px) translateY(${TY_A}px) scale(${S_A})`,
          zIndex: 10,
        }}
      >
        {/* Terminal window — starts compact, expands as lines stream in */}
        <div
          ref={winRef}
          style={{
            width: TERMINAL_W,
            height: VISIBLE_HEIGHT_MIN,  // animated by onFrame
            borderRadius: 12,
            border: `1px solid ${cc.border}`,
            boxShadow: "0 24px 80px rgba(0,0,0,0.65)",
            overflow: "hidden",
            opacity: 0,
          }}
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
            ref={winBodyRef}
            style={{
              width: "100%",
              height: VISIBLE_HEIGHT_MAX - TITLEBAR_H,  // full content height always
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
                return (
                  <div
                    key={i}
                    ref={el => { lineRefs.current[i] = el; }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: LINE_H,
                      opacity: 0,
                    }}
                  >
                    <span style={{ color: cc.fgMuted }}>steve@MacBook-Pro taskflow-web % </span>
                    <span
                      ref={el => { cmdSpanRefs.current[i] = el; }}
                      style={{ color: cc.fg, fontWeight: 600 }}
                    />
                    <span
                      ref={el => { cursorRefs.current[i] = el; }}
                      style={{
                        display: "inline-block",
                        width: 14,
                        height: LINE_H * 0.75,
                        background: cc.fg,
                        verticalAlign: "middle",
                        marginLeft: 2,
                        opacity: 0,
                      }}
                    />
                  </div>
                );
              } else {
                return (
                  <div
                    key={i}
                    ref={el => { lineRefs.current[i] = el; }}
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      height: LINE_H,
                      gap: 6,
                      opacity: 0,
                    }}
                  >
                    <span style={{
                      color: line.symColor ?? cc.fgDim,
                      minWidth: 20,
                      textAlign: "center",
                      flexShrink: 0,
                    }}>
                      {line.symbol}
                    </span>
                    <span style={{ color: line.textColor }}>
                      {line.isAction ? (
                        <>
                          <span style={{ color: cc.purpleHi, fontWeight: 700 }}>{line.isAction}</span>
                          {line.text}
                        </>
                      ) : line.text}
                    </span>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </Timegroup>
  );
}

SceneTerminal.duration = DURATION;
