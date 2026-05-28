import React, { forwardRef } from "react";

/**
 * Claude Code mascot — pixel-art match to Anthropic's actual mascot.
 *
 * Grid: 14 cols × 16 rows.
 *   - Solid Claude-orange body (no belly highlights, no shading)
 *   - Two 1×1 black square eyes
 *   - Two arm stubs extending one cell out each side
 *   - Four 2-wide vertical legs at the bottom
 *   - Optional wide-brim Stetson hat overlay for `variant="cowboy"`
 *
 * Animatable parts exposed as refs.
 */

type Variant = "standard" | "cowboy";

interface Props {
  variant?: Variant;
  pixel?: number;
  hatRef?: React.Ref<SVGGElement>;
  bodyRef?: React.Ref<SVGGElement>;
  leftEyeRef?: React.Ref<SVGRectElement>;
  rightEyeRef?: React.Ref<SVGRectElement>;
  leg1Ref?: React.Ref<SVGGElement>;
  leg2Ref?: React.Ref<SVGGElement>;
  leg3Ref?: React.Ref<SVGGElement>;
  leg4Ref?: React.Ref<SVGGElement>;
  leftArmRef?: React.Ref<SVGGElement>;
  rightArmRef?: React.Ref<SVGGElement>;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Body grid (14 cols × 16 rows).
 * Each row is exactly 14 chars.
 *   . = transparent
 *   P = body
 *   E = eye (drawn separately, refs)
 *   A = arm cells (drawn separately, refs)
 *   T = leg cells (drawn separately, refs)
 */
const BODY_ROWS = [
  "...............", // 0  (15-col grid)
  "...............", // 1
  "...............", // 2
  "...............", // 3
  "...............", // 4
  "...............", // 5
  "..PPPPPPPPPPP..", // 6  body top — FLAT (cols 2-12)
  "..PPPPPPPPPPP..", // 7
  "..PPEPPPPPEPP..", // 8  eyes at col 4 and col 10
  "..PPPPPPPPPPP..", // 9
  "AAPPPPPPPPPPPAA", // 10 arms 2-wide each side (cols 0-1 and 13-14)
  "AAPPPPPPPPPPPAA", // 11 arms continue
  "..PPPPPPPPPPP..", // 12
  "..PPPPPPPPPPP..", // 13
  "..TT.TT.TT.TT..", // 14 legs (cols 2-3, 5-6, 8-9, 11-12)
  "..TT.TT.TT.TT..", // 15
];

// Hat overlay (rows 0-4 overlap body's top empty rows).
// Stetson silhouette: dome top + band stripe + wide flat brim.
const HAT_ROWS = [
  "...............", // 0
  "....BBBBBBB....", // 1  crown top (7 wide, cols 4-10)
  "...BBBBBBBBB...", // 2  crown (9 wide)
  "...BBYYYYYBB...", // 3  crown band (Y = darker)
  "..BBBBBBBBBBB..", // 4  near-brim (cols 2-12)
  "BBBBBBBBBBBBBBB", // 5  brim widest (full 15)
];

// Eye positions (single-cell each) at row 8 cols 4 and 9
const EYE_ROW = 8;
const LEFT_EYE_COL = 4;
const RIGHT_EYE_COL = 10;

// Arm positions: 2-wide stubs each side at rows 10-11
// Left arm cols 0-1, right arm cols 13-14
const LEFT_ARM_COLS = [0, 1];
const RIGHT_ARM_COLS = [13, 14];
const ARM_ROWS = [10, 11];

// Leg positions: rows 14-15, cols 2-3, 5-6, 8-9, 11-12
const LEG_COLS: number[][] = [
  [2, 3],
  [5, 6],
  [8, 9],
  [11, 12],
];
const LEG_ROWS = [14, 15];

const Mascot = forwardRef<SVGSVGElement, Props>(
  (
    {
      variant = "standard",
      pixel = 14,
      hatRef,
      bodyRef,
      leftEyeRef,
      rightEyeRef,
      leg1Ref,
      leg2Ref,
      leg3Ref,
      leg4Ref,
      leftArmRef,
      rightArmRef,
      style,
      className,
    },
    ref
  ) => {
    const px = pixel;
    const W = 15;
    const H = 16;

    const cell = (key: string, x: number, y: number, fill: string) => (
      <rect key={key} x={x * px} y={y * px} width={px} height={px} fill={fill} />
    );

    // Build body (P cells only, skip eyes/arms/legs)
    const bodyCells: React.ReactNode[] = [];
    BODY_ROWS.forEach((row, ry) => {
      for (let cx = 0; cx < row.length; cx++) {
        const ch = row[cx];
        if (ch !== "P") continue;
        bodyCells.push(cell(`b-${ry}-${cx}`, cx, ry, "var(--claude)"));
      }
    });

    // Arms — 2 cells wide × 2 cells tall each side
    const leftArmCells: React.ReactNode[] = [];
    const rightArmCells: React.ReactNode[] = [];
    for (const ry of ARM_ROWS) {
      for (const cx of LEFT_ARM_COLS) {
        leftArmCells.push(cell(`la-${ry}-${cx}`, cx, ry, "var(--claude)"));
      }
      for (const cx of RIGHT_ARM_COLS) {
        rightArmCells.push(cell(`ra-${ry}-${cx}`, cx, ry, "var(--claude)"));
      }
    }

    // Legs (each leg = 2 cols × 2 rows = 4 cells)
    const legGroups: React.ReactNode[][] = LEG_COLS.map((cols, gi) => {
      const cells: React.ReactNode[] = [];
      for (const ry of LEG_ROWS) {
        for (const cx of cols) {
          cells.push(cell(`leg${gi}-${ry}-${cx}`, cx, ry, "var(--claude)"));
        }
      }
      return cells;
    });

    // Hat cells (cowboy only)
    const hatCells: React.ReactNode[] = [];
    if (variant === "cowboy") {
      HAT_ROWS.forEach((row, ry) => {
        for (let cx = 0; cx < row.length; cx++) {
          const ch = row[cx];
          if (ch === ".") continue;
          const fill = ch === "Y" ? "var(--hat-band)" : "var(--hat-brown)";
          hatCells.push(cell(`h-${ry}-${cx}`, cx, ry, fill));
        }
      });
    }

    const totalW = W * px;
    const totalH = H * px;

    return (
      <svg
        ref={ref}
        className={`pixel-art ${className ?? ""}`}
        width={totalW}
        height={totalH}
        viewBox={`0 0 ${totalW} ${totalH}`}
        style={style}
      >
        {/* Body */}
        <g ref={bodyRef}>{bodyCells}</g>

        {/* Eyes — pure black squares overshooting their cell by 1px on each side
            to fully cover any anti-aliasing gap with the surrounding body cells.
            Parent translates them by integer pixels to change gaze direction. */}
        <rect
          ref={leftEyeRef}
          x={LEFT_EYE_COL * px - 1}
          y={EYE_ROW * px - 1}
          width={px + 2}
          height={px + 2}
          fill="#000000"
          shapeRendering="crispEdges"
          style={{ willChange: "transform" }}
        />
        <rect
          ref={rightEyeRef}
          x={RIGHT_EYE_COL * px - 1}
          y={EYE_ROW * px - 1}
          width={px + 2}
          height={px + 2}
          fill="#000000"
          shapeRendering="crispEdges"
          style={{ willChange: "transform" }}
        />

        {/* Arms — grouped for independent transforms */}
        <g
          ref={leftArmRef}
          style={{ transformBox: "fill-box", transformOrigin: "right center" }}
        >
          {leftArmCells}
        </g>
        <g
          ref={rightArmRef}
          style={{ transformBox: "fill-box", transformOrigin: "left center" }}
        >
          {rightArmCells}
        </g>

        {/* Legs — grouped */}
        <g ref={leg1Ref} style={{ transformBox: "fill-box", transformOrigin: "center top" }}>{legGroups[0]}</g>
        <g ref={leg2Ref} style={{ transformBox: "fill-box", transformOrigin: "center top" }}>{legGroups[1]}</g>
        <g ref={leg3Ref} style={{ transformBox: "fill-box", transformOrigin: "center top" }}>{legGroups[2]}</g>
        <g ref={leg4Ref} style={{ transformBox: "fill-box", transformOrigin: "center top" }}>{legGroups[3]}</g>

        {/* Hat overlay (cowboy variant) */}
        {variant === "cowboy" && (
          <g
            ref={hatRef}
            style={{ transformBox: "fill-box", transformOrigin: "50% 90%" }}
          >
            {hatCells}
          </g>
        )}
      </svg>
    );
  }
);
Mascot.displayName = "Mascot";
export default Mascot;
