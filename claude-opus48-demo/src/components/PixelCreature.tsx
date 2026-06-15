import React, { forwardRef } from "react";

/**
 * Coral pixel-art creature (dog/quadruped) from the Opus 4.8 ad.
 * Faces RIGHT: chunky body, a snout step on the right edge, two black square
 * eyes on the upper body, four stubby 2-wide legs underneath.
 *
 * Grid: 16 cols × 12 rows. Pixel size configurable.
 *   . = transparent   B = body (coral)
 * Eyes + legs are drawn separately so they can be animated via refs:
 *   - legs: 4 groups (leg1..leg4) — translateY for the walk cycle
 *   - eyes: leftEye / rightEye — tiny translate for gaze (optional)
 *
 * Matches PALETTE: body #CE6E58, eyes #1A1A1A.
 */

interface Props {
  pixel?: number;
  bodyRef?: React.Ref<SVGGElement>;
  leftEyeRef?: React.Ref<SVGRectElement>;
  rightEyeRef?: React.Ref<SVGRectElement>;
  leg1Ref?: React.Ref<SVGGElement>;
  leg2Ref?: React.Ref<SVGGElement>;
  leg3Ref?: React.Ref<SVGGElement>;
  leg4Ref?: React.Ref<SVGGElement>;
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
  (
    { pixel = 12, bodyRef, leftEyeRef, rightEyeRef, leg1Ref, leg2Ref, leg3Ref, leg4Ref, style, className },
    ref
  ) => {
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
        <g ref={bodyRef}>{bodyCells}</g>

        {/* Legs — each a group with transform-origin at top for a pivot/lift walk */}
        <g ref={leg1Ref} style={{ transformBox: "fill-box", transformOrigin: "center top", willChange: "transform" }}>{legGroups[0]}</g>
        <g ref={leg2Ref} style={{ transformBox: "fill-box", transformOrigin: "center top", willChange: "transform" }}>{legGroups[1]}</g>
        <g ref={leg3Ref} style={{ transformBox: "fill-box", transformOrigin: "center top", willChange: "transform" }}>{legGroups[2]}</g>
        <g ref={leg4Ref} style={{ transformBox: "fill-box", transformOrigin: "center top", willChange: "transform" }}>{legGroups[3]}</g>

        {/* Eyes — black squares, slightly oversized to avoid AA gaps */}
        <rect
          ref={leftEyeRef}
          x={LEFT_EYE_COL * px - 1}
          y={EYE_ROW * px - 1}
          width={px + 2}
          height={px + 2}
          fill="var(--creature-eye)"
          shapeRendering="crispEdges"
          style={{ willChange: "transform" }}
        />
        <rect
          ref={rightEyeRef}
          x={RIGHT_EYE_COL * px - 1}
          y={EYE_ROW * px - 1}
          width={px + 2}
          height={px + 2}
          fill="var(--creature-eye)"
          shapeRendering="crispEdges"
          style={{ willChange: "transform" }}
        />
      </svg>
    );
  }
);
PixelCreature.displayName = "PixelCreature";
export default PixelCreature;
