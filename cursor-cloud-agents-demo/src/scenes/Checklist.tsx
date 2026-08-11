/**
 * Scene 5 — Agent startup checklist with FULL COMPLETION
 * Duration: 2500ms (was 7000ms — user: WAY too long)
 *
 * NEW SEQUENCE (round-7 fix):
 *   0ms    — all 4 items appear
 *   200ms  — item 0 starts spinning
 *   ~1000ms — item 0 becomes green check
 *   ~1200ms — item 1 becomes green check (staggered ~250ms after item 0)
 *   ~1450ms — item 2 becomes green check
 *   ~1700ms — item 3 becomes green check (final)
 *   2500ms — scene ends
 *
 * Items 1-3 go DIRECTLY to green (no per-item spinner). Only item 0 spins.
 */
import React from "react";
import { Timegroup } from "@editframe/react";
import { Reveal } from "@shared/components/Reveal";
import { TraceLayer } from "../components/TraceLayer";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";

const DURATION = 2500;
const START_MASTER = 9000;

const ITEMS = [
  "Analyze & clone repos",
  "Configure secrets",
  "Install dependencies",
  "Environment ready",
];

// All items appear immediately (staggered 80ms apart so it feels alive)
const ITEM_APPEAR = [0, 80, 160, 240];

// Per-item state timeline — ROUND 7 SPEC:
// Item 0: spins 200→950ms (750ms spinner), then green at 950ms
// Items 1,2,3: skip spinner entirely, go directly green staggered 250ms apart
// SPIN_START[i] (only item 0 spins): [200, never, never, never] — baked into the
//   `checklist-spinner-vis-0` @keyframes (styles.css).
// RESOLVE_WHITE[i] (white-check flash before green): [850, 1150, 1400, 1650] —
//   baked into the `checklist-pending-{i}` / `checklist-check-{i}` / `checklist-text-{i}`
//   @keyframes (styles.css).
const RESOLVE_GREEN = [950, 1200, 1450, 1700];

// Spoked spinner geometry
const ICON_SIZE = 80;
const ICON_CENTER = ICON_SIZE / 2;
const SPOKE_COUNT = 8;
const SPOKE_OUTER_R = 30;
const SPOKE_INNER_R = 18;

function buildSpokes() {
  const spokes: Array<{ x1: number; y1: number; x2: number; y2: number; opacity: number }> = [];
  for (let i = 0; i < SPOKE_COUNT; i++) {
    const angle = (i / SPOKE_COUNT) * 2 * Math.PI - Math.PI / 2;
    const opacity = 1 - (i / SPOKE_COUNT) * 0.75;
    spokes.push({
      x1: ICON_CENTER + SPOKE_INNER_R * Math.cos(angle),
      y1: ICON_CENTER + SPOKE_INNER_R * Math.sin(angle),
      x2: ICON_CENTER + SPOKE_OUTER_R * Math.cos(angle),
      y2: ICON_CENTER + SPOKE_OUTER_R * Math.sin(angle),
      opacity,
    });
  }
  return spokes;
}
const SPOKES = buildSpokes();

// Static dashed circle for inactive/pending items
const DASHED_R = 30;
const DASHED_CIRC = 2 * Math.PI * DASHED_R;

// Per-item state timing, expressed as CSS keyframes instead of a per-frame state
// machine — see `checklist-*-{i}` rules in styles.css. Each item's row fade-in
// (Reveal), spinner visibility, pending/check/green-check opacity, and text
// color are all instant/eased functions of ms alone, so every item's whole
// timeline is baked into a fixed set of percentage keyframe stops (of the
// scene's 2500ms duration) computed once from ITEM_APPEAR / SPIN_START /
// RESOLVE_WHITE / RESOLVE_GREEN above.

export function Checklist() {
  return (
    <Timegroup
      mode="fixed"
      duration="2.5s"
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0, width: 1920, height: 1080 }}
    >
      {/* Black background */}
      {!TRACE_MODE && (
        <div style={{ position: "absolute", inset: 0, background: "#000000", zIndex: 1 }} />
      )}

      {/* Checklist — top-left anchored */}
      <div style={{ position: "absolute", left: 100, top: 130, zIndex: 10 }}>
        {ITEMS.map((label, i) => (
          <Reveal
            key={i}
            enter={[ITEM_APPEAR[i], ITEM_APPEAR[i] + 250]}
            x={-12}
            y={0}
            easeIn="out-quad"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
              marginBottom: i < 3 ? 44 : 0,
            }}
          >
            {/* Icon SVG — contains all states layered */}
            <svg width={ICON_SIZE} height={ICON_SIZE} viewBox={`0 0 ${ICON_SIZE} ${ICON_SIZE}`} style={{ flexShrink: 0 }}>
              {/* PENDING: dashed circle — visible from 0ms until the item starts spinning
                  (item 0, at SPIN_START=200ms) or resolves to white-check (items 1-3) */}
              <g style={{ animation: `checklist-pending-${i} 2500ms linear both` }}>
                <circle
                  cx={ICON_CENTER}
                  cy={ICON_CENTER}
                  r={DASHED_R}
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="3"
                  strokeDasharray={`${DASHED_CIRC * 0.15} ${DASHED_CIRC * 0.1}`}
                  strokeLinecap="round"
                />
              </g>

              {/* SPINNING: spoked spinner — only item 0 spins, 200-850ms */}
              <g
                style={{
                  opacity: i === 0 ? 1 : 0,
                  transformOrigin: `${ICON_CENTER}px ${ICON_CENTER}px`,
                  animation:
                    i === 0
                      ? "checklist-spin 900ms linear infinite, checklist-spinner-vis-0 2500ms linear both"
                      : undefined,
                }}
              >
                {SPOKES.map((spoke, si) => (
                  <line
                    key={si}
                    x1={spoke.x1}
                    y1={spoke.y1}
                    x2={spoke.x2}
                    y2={spoke.y2}
                    stroke="white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    opacity={spoke.opacity}
                  />
                ))}
              </g>

              {/* WHITE CHECK: solid white circle with check */}
              <g style={{ animation: `checklist-check-${i} 2500ms linear both` }}>
                <circle cx={ICON_CENTER} cy={ICON_CENTER} r={DASHED_R} fill="white" />
                <path
                  d={`M ${ICON_CENTER - 13} ${ICON_CENTER} l 8 8 l 16 -16`}
                  stroke="#000"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </g>

              {/* GREEN CHECK (items 0-2) or FINAL CHECK (item 3) — fades in 200ms from RESOLVE_GREEN[i] */}
              <g style={{ animation: `fade-in 200ms ${RESOLVE_GREEN[i]}ms linear both` }}>
                {i < 3 ? (
                  <>
                    <circle cx={ICON_CENTER} cy={ICON_CENTER} r={DASHED_R} fill="#22C55E" />
                    <path
                      d={`M ${ICON_CENTER - 13} ${ICON_CENTER} l 8 8 l 16 -16`}
                      stroke="white"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </>
                ) : (
                  <>
                    {/* Last item: white circle with dark check (slightly different) */}
                    <circle cx={ICON_CENTER} cy={ICON_CENTER} r={DASHED_R} fill="white" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                    <path
                      d={`M ${ICON_CENTER - 13} ${ICON_CENTER} l 8 8 l 16 -16`}
                      stroke="#111"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </>
                )}
              </g>
            </svg>

            {/* Text — dims until the item becomes active, then stays white */}
            <div
              style={{
                fontSize: 80,
                fontWeight: 500,
                fontFamily: "system-ui, -apple-system, 'SF Pro Display', 'Inter', sans-serif",
                letterSpacing: "-0.025em",
                whiteSpace: "nowrap",
                lineHeight: 1,
                animation: `checklist-text-${i} 2500ms linear both`,
              }}
            >
              {label}
            </div>
          </Reveal>
        ))}
      </div>

      <TraceLayer sceneStartMs={START_MASTER} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />
    </Timegroup>
  );
}

Checklist.duration = DURATION;
// Scene 5 now ends at 9000 + 2500 = 11500ms → Scene6 starts at 11500ms
