import React, { forwardRef } from "react";

/**
 * Coral pixel-art creature (dog/quadruped) from the Opus 4.8 ad.
 * Faces RIGHT: chunky body, a snout step on the right edge, two black square
 * eyes on the upper body, four stubby 2-wide legs underneath.
 *
 * Grid: 16 cols × 12 rows. Pixel size configurable.
 *   . = transparent   B = body (coral)
 *
 * The 4 leg groups walk via the `leg-hop-a` / `leg-hop-b` CSS keyframes
 * (styles.css) — legs 0 & 2 share phase A, legs 1 & 3 share phase B (a negative
 * `animation-delay` of half the hop period), reproducing the original alternating
 * diagonal gait without any per-frame ref mutation. The walk window (4000–6800ms,
 * this composition's only appearance of the creature walking) is baked into the
 * animation's own `animation-delay` + `animation-iteration-count` — this
 * component is a one-off asset for this composition, not a reusable design-system
 * piece, so hardcoding its one walk cue here (rather than threading it through as
 * a prop) keeps the call site simple.
 *
 * Matches PALETTE: body #CE6E58, eyes #1A1A1A.
 */

interface Props {
  pixel?: number;
  style?: React.CSSProperties;
  className?: string;
}

// Body block (16 cols × 12 rows). Coral dog, faces RIGHT (matches k_013/k_019):
// chunky body, head/back on the left, a SNOUT step protruding lower-right,
// two black square eyes on the upper body toward the right, 4 stubby legs.
const BODY = [
  "................", // 0
  "................", // 1
  "...BBBBBBBB.....", // 2  rounded back/head top (cols 3-10)
  "..BBBBBBBBBBB...", // 3  head widens
  "..BBBBBBBBBBB...", // 4  eyes drawn over cols 7 & 10 on this row
  "..BBBBBBBBBBBB..", // 5  body
  "..BBBBBBBBBBBBB.", // 6  snout extends right (col 12-13)
  "..BBBBBBBBBBBBB.", // 7  snout/jaw
  "..BBBBBBBBBBB...", // 8  belly
  "..BB..BB.BB..BB.", // 9  legs (cols 2-3,6-7,9-10,13-14) — drawn separately
  "..BB..BB.BB..BB.", // 10 legs continue
  "................", // 11
];

const EYE_ROW = 4;
const LEFT_EYE_COL = 7;
const RIGHT_EYE_COL = 10;

// Leg column pairs + rows (drawn as separate groups for walk animation)
const LEG_COLS: number[][] = [
  [2, 3],
  [6, 7],
  [9, 10],
  [13, 14],
];
const LEG_ROWS = [9, 10];

const PixelCreature = forwardRef<SVGSVGElement, Props>(
  ({ pixel = 12, style, className }, ref) => {
    const px = pixel;
    const COLS = 16;
    const ROWS = 12;
    const W = COLS * px;
    const H = ROWS * px;

    const cell = (key: string, cx: number, cy: number, fill: string) => (
      <rect
        key={key}
        x={cx * px}
        y={cy * px}
        width={px + 0.5}
        height={px + 0.5}
        fill={fill}
        shapeRendering="crispEdges"
      />
    );

    // Body cells (skip the leg rows — legs drawn separately)
    const bodyCells: React.ReactNode[] = [];
    BODY.forEach((row, ry) => {
      if (ry === 9 || ry === 10) return; // legs handled below
      for (let cx = 0; cx < row.length; cx++) {
        if (row[cx] === "B") bodyCells.push(cell(`b-${ry}-${cx}`, cx, ry, "var(--creature)"));
      }
    });

    const legGroups: React.ReactNode[][] = LEG_COLS.map((cols, gi) => {
      const cells: React.ReactNode[] = [];
      for (const ry of LEG_ROWS) for (const cx of cols) cells.push(cell(`leg${gi}-${ry}-${cx}`, cx, ry, "var(--creature)"));
      return cells;
    });

    return (
      <svg
        ref={ref}
        className={`pixel-art ${className ?? ""}`}
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={style}
      >
        <g>{bodyCells}</g>

        {/* Legs — each a group with transform-origin at top for a pivot/lift walk.
            Groups 0 & 2 share phase A, groups 1 & 3 share phase B (see styles.css). */}
        {legGroups.map((cells, gi) => (
          <g
            key={gi}
            className={gi % 2 === 0 ? "leg-hop-a" : "leg-hop-b"}
            style={{ transformBox: "fill-box", transformOrigin: "center top" }}
          >
            {cells}
          </g>
        ))}

        {/* Eyes — black squares, slightly oversized to avoid AA gaps */}
        <rect
          x={LEFT_EYE_COL * px - 1}
          y={EYE_ROW * px - 1}
          width={px + 2}
          height={px + 2}
          fill="var(--creature-eye)"
          shapeRendering="crispEdges"
        />
        <rect
          x={RIGHT_EYE_COL * px - 1}
          y={EYE_ROW * px - 1}
          width={px + 2}
          height={px + 2}
          fill="var(--creature-eye)"
          shapeRendering="crispEdges"
        />
      </svg>
    );
  }
);
PixelCreature.displayName = "PixelCreature";
export default PixelCreature;
