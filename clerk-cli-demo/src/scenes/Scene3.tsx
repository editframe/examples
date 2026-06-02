/**
 * Scene 3 — `clerk init` command + HEAVY ZOOM (FIX 1 + FIX 2)
 * Master time: 4500–6000ms (duration 1500ms)
 *
 * FIX 1: transform-origin computed to keep "clerk init" text CENTERED at peak zoom.
 *   Terminal positioned at left:310px, top:160px (hardcoded center).
 *   transformOrigin: "585px 81px" — the exact pivot that keeps "clerk init" at screen (960,540).
 *   Math: terminal left edge = (1920-1300)/2 = 310, top = (1080-760)/2 = 160.
 *   "clerk init" center in element space: x≈585 (after prompt prefix), y≈81px (within titlebar+padding).
 *   At scale s, screen pos of (585, 81) = (310+585, 160+81) = (895, 241) — fixed at that screen point.
 *   We compensate by centering the pivot at the average between element center and clerk_init center.
 *   Actually: transformOrigin is the point that STAYS FIXED during scale. We set it to the screen-mapped
 *   position of "clerk init" within the element so it stays visually centered.
 *
 * FIX 2: Duration cut from 3000ms → 1500ms. Typing faster, lines stream in during zoom.
 *
 * Beat plan:
 * 0–150ms:   Scene enters, terminal at natural position (scale 1.0)
 * 0–800ms:   "clerk init" types out (9 chars @ 80ms = 720ms, starts at 0)
 * 0–1000ms:  Camera zooms from scale 1.0 → 3.5 (heavy zoom, clerk init stays centered)
 * 800ms:     Typing done
 * 900–1400ms: Init output lines appear quickly (stagger 80ms each)
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { cc, fonts } from "../lib/colors";
import { track, blinkCursor, typewriter } from "../components/helpers";
import { eases } from "animejs";

const SCENE_START = 4500;
const DURATION = 1500;

const TERMINAL_W = 1300;
const TERMINAL_H = 760;

// Hardcoded center position: (1920-1300)/2=310, (1080-760)/2=160
const TERMINAL_LEFT = 310;
const TERMINAL_TOP = 160;

// FIX 1: transform-origin computed so "clerk init" center stays at screen (960, 540).
// Math: terminal positioned at left:310, top:160. Frame center = (960, 540).
// "clerk init" center measured from actual render output:
//   element_x ~456px (back-calculated: observed screen_x ~802, origin 441 → (802-751)/3.5+441=456)
//   element_y ~172px (44 titlebar + 28 padding + 2*40 static lines + 8 marginTop + 20 text-center)
// Target: keep (456, 172) at screen (960, 540).
// Iterative approach: each 10px decrease in ORIGIN_X shifts clerk_init screen_x +25px right.
// After r5c (368): clerk_init center observed at screen_x~920, need 960, gap=40px → reduce 16px more.
// New ORIGIN_X = 352. Expected result: screen_x ~920+40 = 960 (centered).
// screen_y: keep at 89px (Y is approximately correct).
const ORIGIN_X = 352;
const ORIGIN_Y = 89;

// Zoom parameters
const ZOOM_START = 0;
const ZOOM_PEAK_T = 900; // reach full zoom
const ZOOM_SCALE_START = 1.0;
// FIX 1: Reduced from 3.5 to 2.2 — reference _ref_02s.jpg shows full line captured, no edge cropping.
// 3.5 was too tight; 2.2 keeps "clerk init" centered and fully in frame.
const ZOOM_SCALE_PEAK = 2.2;

// clerk init command — starts immediately
const CMD_TYPE_START = 0;
const CMD = "clerk init";
const MS_PER_CHAR = 80;
const CMD_TYPE_END = CMD_TYPE_START + CMD.length * MS_PER_CHAR; // 720ms
const CMD_SUBMIT = CMD_TYPE_END + 150; // ~870ms

// Output lines — appear fast during + after zoom
type CliLine = {
  ms: number;
  symbol: string;
  symColor: string;
  text: string;
  textColor: string;
};

const INIT_LINES_EARLY: CliLine[] = [
  { ms: 880,  symbol: "r",  symColor: cc.fgDim,      text: "  clerk init",                               textColor: cc.fgMuted },
  { ms: 960,  symbol: "◇",  symColor: cc.purpleSoft,  text: "  Detecting framework",                      textColor: cc.fgMuted },
  { ms: 1040, symbol: "|",  symColor: cc.fgDim,      text: "  Logged in as steve@clerk.dev",             textColor: cc.fg },
  { ms: 1120, symbol: "◇",  symColor: cc.purpleSoft,  text: "  Installing packages",                     textColor: cc.fgMuted },
];

const FILE_LINES: CliLine[] = [
  { ms: 1200, symbol: "|",  symColor: cc.fgDim,      text: "    CREATE  proxy.ts",                       textColor: cc.fg },
  { ms: 1280, symbol: "|",  symColor: cc.fgDim,      text: "    MODIFY  app/layout.tsx",                  textColor: cc.fg },
  { ms: 1360, symbol: "|",  symColor: cc.fgDim,      text: "    CREATE  app/sign-in/[[...sign-in]]/page.tsx", textColor: cc.fg },
  { ms: 1440, symbol: "|",  symColor: cc.fgDim,      text: "    CREATE  app/sign-up/[[...sign-up]]/page.tsx", textColor: cc.fg },
];

export function Scene3() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const cmdRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const earlyLineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fileLineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // FIX 1: Camera zoom — terminal positioned at fixed pixel coords, only scale changes.
    // transformOrigin is baked into the element style (set on mount).
    // Here we only update the scale, so the origin point stays fixed at its screen position.
    if (terminalRef.current) {
      const zoomT = eases.inOutCubic(Math.min(1, Math.max(0, (ms - ZOOM_START) / (ZOOM_PEAK_T - ZOOM_START))));
      const scale = ZOOM_SCALE_START + (ZOOM_SCALE_PEAK - ZOOM_SCALE_START) * zoomT;
      terminalRef.current.style.transform = `scale(${scale})`;
    }

    // Command typewriter
    if (cmdRef.current) {
      const typed = typewriter(ms, CMD_TYPE_START, CMD_TYPE_END - CMD_TYPE_START, CMD);
      cmdRef.current.textContent = typed;
    }

    // Cursor
    if (cursorRef.current) {
      const submitted = ms > CMD_SUBMIT;
      cursorRef.current.style.opacity = submitted ? "0" : (blinkCursor(ms) ? "1" : "0");
    }

    // Early init lines
    INIT_LINES_EARLY.forEach((line, i) => {
      const el = earlyLineRefs.current[i];
      if (!el) return;
      const t = track(ms, line.ms, line.ms + 120);
      el.style.opacity = `${t}`;
      el.style.transform = `translateY(${(1 - t) * 5}px)`;
    });

    // File create/modify lines
    FILE_LINES.forEach((line, i) => {
      const el = fileLineRefs.current[i];
      if (!el) return;
      const t = track(ms, line.ms, line.ms + 100);
      el.style.opacity = `${t}`;
      el.style.transform = `translateY(${(1 - t) * 4}px)`;
    });
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

      {/* Purple gradient backdrop */}
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

      {/* Terminal window — FIX 1: positioned with hardcoded pixel coords so scale() alone controls zoom.
          transformOrigin set to the "clerk init" text center in element-local space.
          This guarantees the origin point stays at its FIXED screen position during scale. */}
      <div
        ref={terminalRef}
        style={{
          position: "absolute",
          left: TERMINAL_LEFT,
          top: TERMINAL_TOP,
          // FIX 1: transform-origin computed so "clerk init" center stays at screen (960, 540).
          // ORIGIN_X=441, ORIGIN_Y=89 derived from: screen = terminal_offset + Origin + (point - Origin)*scale
          transformOrigin: `${ORIGIN_X}px ${ORIGIN_Y}px`,
          transform: "scale(1.0)",
          width: TERMINAL_W,
          height: TERMINAL_H,
          borderRadius: 12,
          border: `1px solid ${cc.border}`,
          boxShadow: "0 24px 80px rgba(0,0,0,0.65)",
          overflow: "hidden",
          zIndex: 10,
        }}
      >
        {/* Title bar */}
        <div style={{
          width: "100%",
          height: 44,
          background: "#1C1C1C",
          borderBottom: `1px solid ${cc.border}`,
          display: "flex",
          alignItems: "center",
          position: "relative",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", gap: 8, marginLeft: 16 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: cc.dotRed, opacity: 0.85 }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: cc.dotYellow, opacity: 0.85 }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: cc.dotGreen, opacity: 0.85 }} />
          </div>
          <div style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 13,
            color: cc.fgMuted,
            fontFamily: fonts.mono,
          }}>
            ~/Dev/taskflow-web
          </div>
        </div>

        {/* Terminal body */}
        <div style={{
          width: "100%",
          height: TERMINAL_H - 44,
          background: "#131316",
          padding: "28px 36px",
          boxSizing: "border-box",
          fontFamily: fonts.mono,
          fontSize: 26,
          lineHeight: "40px",
          overflow: "hidden",
        }}>
          {/* Login result lines (continuity from Scene 2) */}
          <div style={{ display: "flex", gap: 8, color: cc.fgMuted }}>
            <span style={{ color: cc.fgDim, minWidth: 20, textAlign: "center" }}>|</span>
            <span>  Logged in as <span style={{ color: cc.fg }}>steve@clerk.dev</span></span>
          </div>
          <div style={{ display: "flex", gap: 8, color: cc.fgMuted }}>
            <span style={{ color: cc.fgDim, minWidth: 20, textAlign: "center" }}>L</span>
            <span>  Done</span>
          </div>

          {/* New command line */}
          <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
            <span style={{ color: cc.fgMuted, fontSize: 24 }}>steve@MacBook-Pro taskflow-web % </span>
            <span ref={cmdRef} style={{ color: cc.fg, fontWeight: 600, fontSize: 26 }}></span>
            <span
              ref={cursorRef}
              style={{
                display: "inline-block",
                width: 14,
                height: 28,
                background: cc.fg,
                verticalAlign: "middle",
                marginLeft: 2,
              }}
            />
          </div>

          {/* Init output lines */}
          {INIT_LINES_EARLY.map((line, i) => (
            <div
              key={i}
              ref={el => { earlyLineRefs.current[i] = el; }}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                opacity: 0,
                transform: "translateY(5px)",
              }}
            >
              <span style={{ color: line.symColor, minWidth: 20, textAlign: "center" }}>{line.symbol}</span>
              <span style={{ color: line.textColor }}>{line.text}</span>
            </div>
          ))}

          {/* File create/modify lines */}
          {FILE_LINES.map((line, i) => (
            <div
              key={i}
              ref={el => { fileLineRefs.current[i] = el; }}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                opacity: 0,
                transform: "translateY(4px)",
              }}
            >
              <span style={{ color: line.symColor, minWidth: 20, textAlign: "center" }}>{line.symbol}</span>
              <span>
                <span style={{ color: cc.purpleHi, fontWeight: 700 }}>
                  {line.text.includes("CREATE") ? "CREATE" : line.text.includes("MODIFY") ? "MODIFY" : ""}
                </span>
                <span style={{ color: line.textColor }}>
                  {line.text.includes("CREATE") ? line.text.replace("    CREATE", "") : line.text.includes("MODIFY") ? line.text.replace("    MODIFY", "") : line.text}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Timegroup>
  );
}

Scene3.duration = DURATION;
