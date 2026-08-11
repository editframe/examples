/**
 * TitleAndPillsScroll — THREE STANDALONE BEATS, temporally disjoint so only one is ever
 * on screen:
 *
 *   Beat 1 — "Introducing new agent templates / for financial services"
 *            (centered, fade in → hold → fade out completely)
 *   ── brief blank (cream) ──
 *   Beat 2 — the agent-template PILLS slide up through center, the centered one
 *            highlights coral (this is the only thing that "scrolls", alone)
 *   ── brief blank (cream) ──
 *   Beat 3 — "Add them with easy-to-install plugins"
 *            (centered, fade in → hold → fade out)
 *
 * The title and headline are each their own absolutely-centered `Reveal`, with their own
 * opacity window — no overlap between beats. The pill column scroll is one continuous CSS
 * `pills-column-scroll` keyframe; each pill's highlight is a `pill-bump` (or `pill-settle`
 * for the last one) keyframe with an `animation-delay` computed once, at module scope, from
 * the exact instant that pill crosses center under the scroll's own easing curve (see
 * `PILL_CROSSING_MS` below) — not a per-frame distance check.
 *
 * All local-ms constants below are this scene's OWN clock (0 at this scene's activation).
 * This is not the first scene, so — per the sequence's `overlap` — its own local zero sits
 * `OVERLAP_MS` before its old nominal start; every timing constant already includes that
 * shift (see REFACTOR-PATTERNS.md 2b "absolute-ms → local-ms").
 *
 * 1920×1080 @ 30fps, bg #EAE8DE
 */
import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import { TraceLayer } from "../components/TraceLayer";
import { Reveal } from "@shared/components/Reveal";
import { TRACE_MODE, TRACE_OPACITY, OVERLAP_MS } from "../constants";

export const TITLE_PILLS_START    = 1900;
export const TITLE_PILLS_DURATION = 10100 + OVERLAP_MS; // 10700

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

// ── Beat windows (scene-local ms, already shifted +OVERLAP_MS) — temporally disjoint ──
const TITLE_IN_START = 200 + OVERLAP_MS,  TITLE_IN_END = 700 + OVERLAP_MS;
const TITLE_OUT_START = 2400 + OVERLAP_MS, TITLE_OUT_END = 2850 + OVERLAP_MS;
const PILLS_IN_START = 3050 + OVERLAP_MS, PILLS_IN_END = 3450 + OVERLAP_MS;
const PILLS_OUT_START = 6500 + OVERLAP_MS, PILLS_OUT_END = 6900 + OVERLAP_MS;
const HEAD_IN_START  = 7100 + OVERLAP_MS, HEAD_IN_END  = 7600 + OVERLAP_MS;
const HEAD_OUT_START  = 9750 + OVERLAP_MS, HEAD_OUT_END  = 10100 + OVERLAP_MS;

// Pills slide-up window (within the pills beat)
const PILLS_SCROLL_START = 3450 + OVERLAP_MS;
const PILLS_SCROLL_END   = 6500 + OVERLAP_MS;

// Pills column scroll positions:
//   pill i screen center = columnY + i*PILL_STRIDE + PILL_H/2
//   START: pill 0 just below center (entering from the masked bottom)
//   END:   pill 10 (Risk analyst) settles at center, highlighted
const PILLS_START_Y = (CENTER_Y + 160) - PILL_H / 2;            // pill 0 ~160px below center
const PILLS_END_Y   = CENTER_Y - PILL_H / 2 - 10 * PILL_STRIDE;  // pill 10 at center

/**
 * The instant (scene-local ms) each pill crosses center, under the same eased scroll
 * curve as `pills-column-scroll` (CSS `cubic-bezier(0.76,0,0.24,1)`, the bezier
 * equivalent of `easeInOutQuart` — derived the same way as the `easeOutCubic`/
 * `easeInCubic`/`easeInOutQuad` equivalents in REFACTOR-PATTERNS.md). Computed once,
 * offline, by inverting `columnY(t) = lerp(START_Y, END_Y, easeInOutQuart(t))` for each
 * pill's centering position — not re-derived per frame. See CREDITS/derivation note: the
 * deltas between consecutive crossings (≈150,109,87,74,70,80,96,125,187,985ms) match the
 * per-bump tick spacing already hand-tuned in add-audio.sh, confirming the values.
 */
const PILL_CROSSING_MS = [
  5137, 5287, 5396, 5483, 5557, 5627, 5707, 5803, 5928, 6115, 7100,
].map(ms => ms - 4050 + PILLS_SCROLL_START); // re-based onto PILLS_SCROLL_START in case OVERLAP_MS ever changes

// Per-pill highlight bump: width adapts to the local gap between neighboring crossings
// (computed once, from the index, at module load) so bumps never overlap in the fast
// middle of the scroll and stay comfortably visible in the slow sections near the ends.
const PILL_BUMPS = PILL_CROSSING_MS.slice(0, -1).map((ms, i) => {
  const gapBefore = i === 0 ? Infinity : ms - PILL_CROSSING_MS[i - 1];
  const gapAfter = PILL_CROSSING_MS[i + 1] - ms;
  const duration = Math.min(gapBefore, gapAfter, 260) * 0.85;
  return { delay: ms - duration / 2, duration };
});
const LAST_PILL_CROSSING_MS = PILL_CROSSING_MS[PILL_CROSSING_MS.length - 1];

const TICK = "/claude-code-financial-demo/src/assets/sfx/tick.wav";

/**
 * Scroll-tick SFX — one per pill crossing center. Absolute-ms values are the `adelay`
 * arguments hand-tuned in the retired `add-audio.sh` (a single tick sample extracted from
 * `menu-scroll.mp3` at 3.413s, `asplit` into 11 copies). Each is ~15ms ahead of its
 * matching `PILL_CROSSING_MS` instant to compensate for the tick sample's own attack lead,
 * except the last, which deliberately leads the final "settle" snap by ~585ms rather than
 * landing on it (per the original mix). Translated to this scene's local clock by
 * subtracting its local-zero shift (`TITLE_PILLS_START - OVERLAP_MS` = 1300 — see 2b
 * "absolute-ms → local-ms" in REFACTOR-PATTERNS.md).
 */
const TICK_OFFSETS_MS = [
  6422, 6571, 6681, 6769, 6843, 6912, 6992, 7088, 7214, 7400, 7815,
].map(ms => ms - (TITLE_PILLS_START - OVERLAP_MS));

export function TitleAndPillsScroll(): React.ReactElement {
  return (
    <Timegroup
      mode="fixed"
      duration={`${TITLE_PILLS_DURATION}ms`}
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0, width: SCREEN_W, height: SCREEN_H, overflow: "hidden" }}
    >
      <TraceLayer sceneStartMs={TITLE_PILLS_START - OVERLAP_MS} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {TICK_OFFSETS_MS.map((ms, i) => (
        <Audio key={i} src={TICK} offset={`${ms}ms`} duration="50ms" volume={1} />
      ))}

      {!TRACE_MODE && (
        <div style={{ position: "absolute", inset: 0, background: "#EAE8DE", zIndex: 1 }} />
      )}

      {/* ── BEAT 2: PILLS column (zIndex 5, BELOW the edge masks) ── */}
      <Reveal
        enter={[PILLS_IN_START, PILLS_IN_END]}
        exit={[PILLS_OUT_START, PILLS_OUT_END]}
        y={0}
        style={{ position: "absolute", inset: 0, zIndex: 5 }}
      >
        <div
          style={
            {
              position: "absolute",
              left: "50%",
              top: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: PILL_GAP,
              width: 900,
              "--pills-start-y": `${PILLS_START_Y}px`,
              "--pills-end-y": `${PILLS_END_Y}px`,
              animation: `pills-column-scroll ${PILLS_SCROLL_END - PILLS_SCROLL_START}ms ${PILLS_SCROLL_START}ms cubic-bezier(0.76,0,0.24,1) both`,
            } as React.CSSProperties
          }
        >
          {PILLS.map((pill, i) => {
            const isLast = i === PILLS.length - 1;
            const anim = isLast
              ? `pill-settle 200ms ${LAST_PILL_CROSSING_MS - 100}ms cubic-bezier(0.33,1,0.68,1) both`
              : `pill-bump ${PILL_BUMPS[i].duration}ms ${PILL_BUMPS[i].delay}ms cubic-bezier(0.45,0,0.55,1) both`;
            return (
              <div
                key={pill}
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
                  border: "1.5px solid rgba(216, 119, 87, 0.15)",
                  animation: anim,
                }}
              >
                {pill}
              </div>
            );
          })}
        </div>
      </Reveal>

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

      {/*
        BEAT 1: TITLE (zIndex 15, above masks) — standalone, centered.
        The centering `translateY(-50%)` lives on a static OUTER div, not on the Reveal
        itself — Reveal's own `reveal-in`/`reveal-out` keyframes also animate `transform`,
        which would otherwise clobber a static transform declared in the same style.
      */}
      <div style={{ position: "absolute", left: 0, right: 0, top: CENTER_Y, transform: "translateY(-50%)", zIndex: 15 }}>
        <Reveal
          enter={[TITLE_IN_START, TITLE_IN_END]}
          exit={[TITLE_OUT_START, TITLE_OUT_END]}
          y={0}
          style={{
            textAlign: "center",
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
        </Reveal>
      </div>

      {/* BEAT 3: HEADLINE (zIndex 15, above masks) — standalone, centered (see BEAT 1 note). */}
      <div style={{ position: "absolute", left: 0, right: 0, top: CENTER_Y, transform: "translateY(-50%)", zIndex: 15 }}>
        <Reveal
          enter={[HEAD_IN_START, HEAD_IN_END]}
          exit={[HEAD_OUT_START, HEAD_OUT_END]}
          y={0}
          style={{
            textAlign: "center",
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
        </Reveal>
      </div>
    </Timegroup>
  );
}

TitleAndPillsScroll.duration = TITLE_PILLS_DURATION;
