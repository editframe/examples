import React, { forwardRef } from "react";
import { BRAND } from "../brand";

/**
 * Pixel-art kite from the Opus 4.8 ad: a colored DIAMOND body with a dark-brown
 * CROSS spar over it, plus a dotted-string tail of small colored squares hanging
 * down, and small white twinkle accents.
 *
 * Variants: "orange" | "purple" | "pink" (colors from PALETTE).
 *
 * The whole kite is one <svg>. The parent (scene) animates position + a gentle
 * sway via the forwarded ref. The tail dots are part of the svg so they sway with it.
 */

type Variant = "orange" | "purple" | "pink";

interface Props {
  variant: Variant;
  pixel?: number;
  style?: React.CSSProperties;
  className?: string;
}

const COLOR: Record<Variant, string> = {
  orange: BRAND.kiteOrange,
  purple: BRAND.kitePurple,
  pink: BRAND.kitePink,
};

// Diamond body on a 13×13 pixel grid (rows 0-9), cross spar over it.
// X = body, . = empty. The diamond is symmetric.
const DIAMOND = [
  "......X......",
  ".....XXX.....",
  "....XXXXX....",
  "...XXXXXXX...",
  "..XXXXXXXXX..",
  ".XXXXXXXXXXX.",
  "..XXXXXXXXX..",
  "...XXXXXXX...",
  "....XXXXX....",
  ".....XXX.....",
];

const Kite = forwardRef<SVGSVGElement, Props>(
  ({ variant, pixel = 9, style, className }, ref) => {
    const px = pixel;
    const COLS = 13;
    const DIAMOND_ROWS = DIAMOND.length; // 10
    const TAIL_DOTS = 6;
    const tailGap = 1; // empty rows between dots
    const totalRows = DIAMOND_ROWS + TAIL_DOTS * (1 + tailGap) + 2;
    const W = COLS * px;
    const H = totalRows * px;

    const color = COLOR[variant];
    const spar = BRAND.kiteSpar;

    const cells: React.ReactNode[] = [];
    const cell = (k: string, cx: number, cy: number, fill: string, size = px + 0.5) =>
      cells.push(
        <rect key={k} x={cx * px} y={cy * px} width={size} height={size} fill={fill} shapeRendering="crispEdges" />
      );

    // Diamond body
    DIAMOND.forEach((row, ry) => {
      for (let cx = 0; cx < row.length; cx++) {
        if (row[cx] === "X") cell(`d-${ry}-${cx}`, cx, ry, color);
      }
    });

    // Cross spar: extends PAST the diamond edges (matches k_013 — long cross arms).
    // Vertical (col 6, rows -1..10) + horizontal (row 4, cols -1..12).
    const midCol = 6;
    for (let ry = -1; ry <= DIAMOND_ROWS; ry++) cell(`sv-${ry}`, midCol, ry, spar);
    const midRowA = 4;
    for (let cx = -1; cx <= 12; cx++) cell(`sh-${cx}`, cx, midRowA, spar);

    // Dotted-string tail: small colored squares descending from the bottom point.
    let tailY = DIAMOND_ROWS + 1;
    for (let i = 0; i < TAIL_DOTS; i++) {
      const wobble = i % 2 === 0 ? 0 : 1; // slight zigzag
      cell(`t-${i}`, midCol + wobble, tailY, color, px * 0.7);
      tailY += 1 + tailGap;
    }

    return (
      <svg
        ref={ref}
        className={`pixel-art ${className ?? ""}`}
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ overflow: "visible", ...style }}
      >
        {/* twinkle accents (small white crosses) */}
        <g opacity={0.85}>
          <Twinkle x={-px * 1.4} y={px * 1.6} s={px * 0.9} />
          <Twinkle x={W + px * 0.4} y={px * 3.2} s={px * 0.7} />
        </g>
        {cells}
      </svg>
    );
  }
);

const Twinkle: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x},${y})`} stroke="#FFFFFF" strokeWidth={Math.max(1.5, s * 0.3)} strokeLinecap="round">
    <line x1={-s} y1={0} x2={s} y2={0} />
    <line x1={0} y1={-s} x2={0} y2={s} />
  </g>
);

Kite.displayName = "Kite";
export default Kite;
