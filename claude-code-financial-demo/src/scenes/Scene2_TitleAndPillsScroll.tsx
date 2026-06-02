/**
 * Scene 2 — THREE STANDALONE BEATS (Round 7 — user comments #2/#3)
 *
 * The previous version stacked the title + pills + plugin headline into ONE tall
 * column that scrolled as a unit, so the title and the "Add them…" headline were
 * always visible alongside the pills — they bled into each other. The user was
 * explicit: these are STANDALONE scenes and must NOT overlap.
 *
 * This version separates them in TIME so only ONE beat is ever on screen:
 *   Beat 1 — "Introducing new agent templates / for financial services"
 *            (centered, fade in → hold → fade OUT completely)   ~0.2–2.85s
 *   ── brief blank (cream) ──
 *   Beat 2 — the agent-template PILLS slide up through center, the centered one
 *            highlights coral (this is the only thing that "scrolls", alone)  ~3.05–6.9s
 *   ── brief blank (cream) ──
 *   Beat 3 — "Add them with easy-to-install plugins"
 *            (centered, fade in → hold → fade out)               ~7.1–10.1s
 *
 * The title and headline are NO LONGER part of the scrolling column — each is its
 * own absolutely-centered element with its own opacity window. No overlap.
 *
 * 1920×1080 @ 30fps, bg #EAE8DE
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TraceLayer } from "../components/TraceLayer";
import { track, lerp, clamp } from "../components/helpers";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { eases } from "animejs";

export const SCENE2_MERGED_START    = 1900;
export const SCENE2_MERGED_DURATION = 10100;

const PILLS = [
  "Pitch builder",
  "Meeting preparer",
  "Earnings reviewer",
  "Model builder",
  "Valuation reviewer",
  "Market researcher",
  "GL Reconciler",
  "Month-end Closer",
  "Statement Auditor",
  "Portfolio monitor",
  "Risk analyst",
];

const SCREEN_W = 1920;
const SCREEN_H = 1080;
const CENTER_Y = SCREEN_H / 2;

const PILL_H      = 88;
const PILL_GAP    = 20;
const PILL_STRIDE = PILL_H + PILL_GAP; // 108

// ── Beat windows (scene-local ms) — temporally disjoint so beats never overlap ──
const TITLE_IN_START = 200,  TITLE_IN_END = 700,  TITLE_OUT_START = 2400, TITLE_OUT_END = 2850;
const PILLS_IN_START = 3050, PILLS_IN_END = 3450, PILLS_OUT_START = 6500, PILLS_OUT_END = 6900;
const HEAD_IN_START  = 7100, HEAD_IN_END  = 7600, HEAD_OUT_START  = 9750, HEAD_OUT_END  = 10100;

// Pills slide-up window (within the pills beat)
const PILLS_SCROLL_START = 3450;
const PILLS_SCROLL_END   = 6500;

// Pills column scroll positions:
//   pill i screen center = columnY + i*PILL_STRIDE + PILL_H/2
//   START: pill 0 just below center (entering from the masked bottom)
//   END:   pill 10 (Risk analyst) settles at center, highlighted
const PILLS_START_Y = (CENTER_Y + 160) - PILL_H / 2;            // pill 0 ~160px below center
const PILLS_END_Y   = CENTER_Y - PILL_H / 2 - 10 * PILL_STRIDE;  // pill 10 at center

// Beat opacity: 0 before in, ramp in, 1 hold, ramp out, 0 after.
function beatOpacity(
  ms: number, inS: number, inE: number, outS: number, outE: number
): number {
  if (ms <= inS) return 0;
  if (ms < inE)  return clamp((ms - inS) / (inE - inS));
  if (ms <= outS) return 1;
  if (ms < outE)  return clamp(1 - (ms - outS) / (outE - outS));
  return 0;
}

export function Scene2_TitleAndPillsScroll(): React.ReactElement {
  const titleRef    = useRef<HTMLDivElement>(null);
  const pillsWrapRef = useRef<HTMLDivElement>(null);
  const columnRef   = useRef<HTMLDivElement>(null);
  const pillRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const headRef     = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // ── Beat 1: TITLE (standalone, fades fully out before pills) ──
    if (titleRef.current) {
      titleRef.current.style.opacity = String(
        beatOpacity(ms, TITLE_IN_START, TITLE_IN_END, TITLE_OUT_START, TITLE_OUT_END)
      );
    }

    // ── Beat 2: PILLS (standalone) — wrapper opacity gates the whole beat ──
    if (pillsWrapRef.current) {
      pillsWrapRef.current.style.opacity = String(
        beatOpacity(ms, PILLS_IN_START, PILLS_IN_END, PILLS_OUT_START, PILLS_OUT_END)
      );
    }

    // Pills slide up + center-highlight (only matters while the pills beat is visible)
    const scrollT = track(ms, PILLS_SCROLL_START, PILLS_SCROLL_END, eases.inOutQuart);
    const columnY = lerp(PILLS_START_Y, PILLS_END_Y, scrollT);
    if (columnRef.current) {
      columnRef.current.style.transform = `translateX(-50%) translateY(${columnY}px)`;
    }
    pillRefs.current.forEach((el, i) => {
      if (!el) return;
      const pillScreenY = columnY + i * PILL_STRIDE + PILL_H / 2;
      const distFromCenter = Math.abs(pillScreenY - CENTER_Y);
      const isActive = distFromCenter < 60;
      const nearness = Math.max(0, 1 - (distFromCenter - 60) / 120);
      if (isActive) {
        el.style.background = "#D87757";
        el.style.color      = "#FFFFFF";
        el.style.fontWeight = "600";
        el.style.fontSize   = "42px";
        el.style.border     = "none";
        el.style.opacity    = "1";
      } else {
        const alpha = 0.15 + nearness * 0.75;
        el.style.background = `rgba(238, 209, 193, ${alpha})`;
        el.style.color      = `rgba(42, 40, 37, ${0.3 + nearness * 0.65})`;
        el.style.fontWeight = "400";
        el.style.fontSize   = "40px";
        el.style.border     = `1.5px solid rgba(216, 119, 87, 0.15)`;
        const screenDist = distFromCenter;
        el.style.opacity = screenDist > 460 ? String(Math.max(0, 1 - (screenDist - 460) / 200)) : "1";
      }
    });

    // ── Beat 3: HEADLINE (standalone) ──
    if (headRef.current) {
      headRef.current.style.opacity = String(
        beatOpacity(ms, HEAD_IN_START, HEAD_IN_END, HEAD_OUT_START, HEAD_OUT_END)
      );
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE2_MERGED_DURATION}ms`}
      onFrame={onFrame as any}
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0, width: SCREEN_W, height: SCREEN_H, overflow: "hidden" }}
    >
      <TraceLayer sceneStartMs={SCENE2_MERGED_START} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {!TRACE_MODE && (
        <div style={{ position: "absolute", inset: 0, background: "#EAE8DE", zIndex: 1 }} />
      )}

      {/* ── BEAT 2: PILLS column (zIndex 5, BELOW the edge masks) ── */}
      <div
        ref={pillsWrapRef}
        style={{ position: "absolute", inset: 0, zIndex: 5, opacity: 0, willChange: "opacity" }}
      >
        <div
          ref={columnRef}
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            transform: `translateX(-50%) translateY(${PILLS_START_Y}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: PILL_GAP,
            willChange: "transform",
            width: 900,
          }}
        >
          {PILLS.map((pill, i) => (
            <div
              key={pill}
              ref={el => { pillRefs.current[i] = el; }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: PILL_H,
                paddingLeft: 52,
                paddingRight: 52,
                borderRadius: 16,
                background: "rgba(238, 209, 193, 0.4)",
                fontFamily: "'Newsreader', 'EB Garamond', Georgia, serif",
                fontWeight: 400,
                fontSize: 40,
                color: "rgba(42, 40, 37, 0.6)",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
                willChange: "opacity, background, color",
                border: "1.5px solid rgba(216, 119, 87, 0.15)",
              }}
            >
              {pill}
            </div>
          ))}
        </div>
      </div>

      {/* Top / bottom cream edge masks (zIndex 10) — fade pills at edges only */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 300,
        background: "linear-gradient(to bottom, #EAE8DE 0%, transparent 100%)",
        zIndex: 10, pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 300,
        background: "linear-gradient(to top, #EAE8DE 0%, transparent 100%)",
        zIndex: 10, pointerEvents: "none",
      }} />

      {/* ── BEAT 1: TITLE (zIndex 15, above masks) — standalone, centered ── */}
      <div
        ref={titleRef}
        style={{
          position: "absolute",
          left: 0, right: 0,
          top: CENTER_Y,
          transform: "translateY(-50%)",
          textAlign: "center",
          opacity: 0,
          willChange: "opacity",
          zIndex: 15,
          fontFamily: "'Newsreader', 'EB Garamond', Georgia, serif",
          fontWeight: 400,
          fontSize: 68,
          lineHeight: 1.4,
          color: "#1A1410",
          letterSpacing: "-0.01em",
        }}
      >
        <div>Introducing new agent templates</div>
        <div>for financial services</div>
      </div>

      {/* ── BEAT 3: HEADLINE (zIndex 15, above masks) — standalone, centered ── */}
      <div
        ref={headRef}
        style={{
          position: "absolute",
          left: 0, right: 0,
          top: CENTER_Y,
          transform: "translateY(-50%)",
          textAlign: "center",
          opacity: 0,
          willChange: "opacity",
          zIndex: 15,
          fontFamily: "'Newsreader', 'EB Garamond', Georgia, serif",
          fontWeight: 400,
          fontSize: 56,
          lineHeight: 1.25,
          color: "#1A1A1A",
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
        }}
      >
        Add them with easy-to-install plugins
      </div>
    </Timegroup>
  );
}

Scene2_TitleAndPillsScroll.duration = SCENE2_MERGED_DURATION;
