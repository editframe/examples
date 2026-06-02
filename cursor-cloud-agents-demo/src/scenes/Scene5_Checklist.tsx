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
import React, { useRef, useCallback } from "react";
import { Timegroup } from "@editframe/react";
import { lerp, clamp } from "../components/helpers";
import { TraceLayer } from "../components/TraceLayer";
import { TRACE_MODE } from "../constants";

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
// SPIN_START[i]: when item i starts spinning (only item 0 spins)
// RESOLVE_WHITE[i]: when it becomes white check (brief flash before green)
// RESOLVE_GREEN[i]: when it becomes green check
const SPIN_START =    [200,  999999, 999999, 999999]; // only item 0 spins
const RESOLVE_WHITE = [850,  1150,   1400,   1650];
const RESOLVE_GREEN = [950,  1200,   1450,   1700];

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

// Item state enum
type ItemState = "pending" | "spinning" | "white_check" | "green_check" | "final_check";

function getItemState(ms: number, i: number): ItemState {
  if (ms >= RESOLVE_GREEN[i]) {
    // Last item gets a slightly different check style — still white circle check but with tick
    return i === 3 ? "final_check" : "green_check";
  }
  if (ms >= RESOLVE_WHITE[i]) return "white_check";
  if (ms >= SPIN_START[i]) return "spinning";
  return "pending";
}

// Check transition progress (for animating in)
function getCheckInT(ms: number, i: number): number {
  if (ms < RESOLVE_WHITE[i]) return 0;
  return clamp((ms - RESOLVE_WHITE[i]) / 200);
}

function getGreenInT(ms: number, i: number): number {
  if (ms < RESOLVE_GREEN[i]) return 0;
  return clamp((ms - RESOLVE_GREEN[i]) / 200);
}

export function Scene5_Checklist() {
  const rowRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const spinnerRefs = [
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
  ];
  const iconContainerRefs = [
    useRef<SVGSVGElement>(null),
    useRef<SVGSVGElement>(null),
    useRef<SVGSVGElement>(null),
    useRef<SVGSVGElement>(null),
  ];
  const textRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  // We use data attributes on svg elements to track which icon to show
  // Instead, let's use separate div containers per item state
  // Use refs to the "state indicator" groups
  const pendingRefs = [
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
  ];
  const checkRefs = [
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
  ];
  const greenRefs = [
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
    useRef<SVGGElement>(null),
  ];

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    for (let i = 0; i < 4; i++) {
      // Row fade-in
      const t = clamp((ms - ITEM_APPEAR[i]) / 250);
      const eased = 1 - Math.pow(1 - t, 2);
      if (rowRefs[i].current) {
        rowRefs[i].current!.style.opacity = String(lerp(0, 1, eased));
        rowRefs[i].current!.style.transform = `translateX(${lerp(-12, 0, eased)}px)`;
      }

      const state = getItemState(ms, i);

      // Spinner rotation
      if (spinnerRefs[i].current) {
        const isSpinning = state === "spinning";
        spinnerRefs[i].current!.style.opacity = isSpinning ? "1" : "0";
        if (isSpinning) {
          const spinMs = ms - SPIN_START[i];
          const deg = ((spinMs / 900) * 360) % 360;
          spinnerRefs[i].current!.style.transform = `rotate(${deg}deg)`;
          (spinnerRefs[i].current!.style as any).transformOrigin = `${ICON_CENTER}px ${ICON_CENTER}px`;
        }
      }

      // Pending (dashed circle) — visible when pending
      if (pendingRefs[i].current) {
        pendingRefs[i].current!.style.opacity = state === "pending" ? "1" : "0";
      }

      // White check — visible during white_check state, fades as green comes in
      if (checkRefs[i].current) {
        const isWhite = state === "white_check";
        const checkT = getCheckInT(ms, i);
        const greenT = getGreenInT(ms, i);
        const opacity = isWhite ? checkT : (state === "green_check" || state === "final_check") ? Math.max(0, 1 - greenT * 2) : 0;
        checkRefs[i].current!.style.opacity = String(opacity);
      }

      // Green check (or final check for item 3)
      if (greenRefs[i].current) {
        const isGreen = state === "green_check" || state === "final_check";
        const greenT = getGreenInT(ms, i);
        greenRefs[i].current!.style.opacity = isGreen ? String(greenT) : "0";
      }

      // Text brightness
      if (textRefs[i].current) {
        const isDone = state === "green_check" || state === "final_check";
        const isActive = state === "spinning" || state === "white_check";
        const targetOpacity = isDone ? 1 : isActive ? 1 : 0.35;
        textRefs[i].current!.style.color = isDone
          ? "#FFFFFF"
          : isActive
          ? "#FFFFFF"
          : "rgba(255,255,255,0.35)";
      }
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration="2.5s"
      onFrame={onFrame as any}
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
          <div
            key={i}
            ref={rowRefs[i] as React.RefObject<HTMLDivElement>}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
              marginBottom: i < 3 ? 44 : 0,
              opacity: 0,
            }}
          >
            {/* Icon SVG — contains all states layered */}
            <svg
              ref={iconContainerRefs[i] as React.RefObject<SVGSVGElement>}
              width={ICON_SIZE}
              height={ICON_SIZE}
              viewBox={`0 0 ${ICON_SIZE} ${ICON_SIZE}`}
              style={{ flexShrink: 0 }}
            >
              {/* PENDING: dashed circle */}
              <g ref={pendingRefs[i] as React.RefObject<SVGGElement>} style={{ opacity: i === 0 ? 0 : 1 }}>
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

              {/* SPINNING: spoked spinner */}
              <g
                ref={spinnerRefs[i] as React.RefObject<SVGGElement>}
                style={{
                  opacity: i === 0 ? 1 : 0,
                  transformOrigin: `${ICON_CENTER}px ${ICON_CENTER}px`,
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
              <g ref={checkRefs[i] as React.RefObject<SVGGElement>} style={{ opacity: 0 }}>
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

              {/* GREEN CHECK (items 0-2) or FINAL CHECK (item 3) */}
              <g ref={greenRefs[i] as React.RefObject<SVGGElement>} style={{ opacity: 0 }}>
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

            {/* Text */}
            <div
              ref={textRefs[i] as React.RefObject<HTMLDivElement>}
              style={{
                fontSize: 80,
                fontWeight: 500,
                color: i === 0 ? "#FFFFFF" : "rgba(255,255,255,0.35)",
                fontFamily: "system-ui, -apple-system, 'SF Pro Display', 'Inter', sans-serif",
                letterSpacing: "-0.025em",
                whiteSpace: "nowrap",
                lineHeight: 1,
                transition: "color 0.2s ease",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      <TraceLayer sceneStartMs={START_MASTER} enabled={TRACE_MODE} opacity={0.4} />
    </Timegroup>
  );
}

Scene5_Checklist.duration = DURATION;
// Scene 5 now ends at 9000 + 2500 = 11500ms → Scene6 starts at 11500ms
