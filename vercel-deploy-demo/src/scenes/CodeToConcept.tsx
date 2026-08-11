import React from "react";
import { Timegroup } from "@editframe/react";
import { vc, fonts } from "../lib/colors";
import { SCENES } from "../constants";

/**
 * Scene 3 — CodeToConcept (5.0s local + 0.5s crossfade tail)  ‖ Delba canon rebuild
 *
 * Reference: Delba's "use client visually explained" + "Partial Prerendering
 * explained" — both videos use the move: a code block sits in the middle
 * frame, then ANNOTATIONS slide in from the side, labelling which lines are
 * server vs client (or static vs dynamic). The labels travel with bracket-
 * style line indicators (`}` on the right edge of the code block).
 *
 * We use the PPR vocabulary: <ShoppingCart /> is dynamic (blue), the rest of
 * the page shell is static (purple). The bracket-label vocabulary is hers.
 *
 * Beats (local ms, this scene's own clock):
 *   0–2200      Code block fades in line-by-line (stagger 110ms/line).
 *               Geist Mono, syntax-tokenized very lightly (keyword gray400,
 *               strings + tags gray100).
 *   1800–2300   Right-edge "static" bracket draws over the whole block, purple.
 *   2150–2500   Label "static" slides in from x+24 → x+0.
 *   2500–3000   Right-edge "dynamic" bracket draws over the Suspense block, blue.
 *   2850–3200   Label "dynamic" slides in.
 *   3200–4500   Hold — viewer reads.
 *   4500–5000   Crossfade out (--ef-transition-out-start).
 *
 * Brand checks:
 *   - Bg #0A0A0A ✓
 *   - Geist Mono code, Geist Sans labels ✓
 *   - TWO accents (purple + blue) used here — this is the ONLY scene that
 *     uses both, because the paired vocabulary IS the meaning. Per brand
 *     rules: "Color is information, not decoration." ✓
 *   - Code is a real, plausible Next.js snippet ✓
 */

type CodeLine = {
  // tokens: [text, style]
  tokens: Array<[string, "keyword" | "string" | "tag" | "fn" | "plain" | "comment"]>;
};

const COLOR = {
  keyword: vc.gray400, // export, function, return
  fn: vc.gray100, // Page, ShoppingCart
  tag: vc.gray100, // <main>, <Suspense>, <ShoppingCart />
  string: vc.purpleSoft, // fallback strings — soft purple ties into vocabulary
  plain: vc.textMuted,
  comment: vc.gray600,
};

const LINES: CodeLine[] = [
  { tokens: [["export default function ", "keyword"], ["Page", "fn"], ["() {", "plain"]] },
  { tokens: [["  return (", "plain"]] },
  { tokens: [["    <main>", "tag"]] },
  { tokens: [["      <Suspense fallback={<", "tag"], ["Skeleton", "fn"], [" />}>", "tag"]] },
  { tokens: [["        <ShoppingCart />", "tag"]] },
  { tokens: [["      </Suspense>", "tag"]] },
  { tokens: [["      <ProductGrid />", "tag"]] },
  { tokens: [["    </main>", "tag"]] },
  { tokens: [["  );", "plain"]] },
  { tokens: [["}", "plain"]] },
];

// Layout (px)
const CODE_LEFT = 380;
const CODE_TOP = 220;
const LINE_HEIGHT = 56;
const CODE_FONT_SIZE = 28;
const CODE_RIGHT = 1180; // right edge of code text area; brackets live just past this
const LINE_STAGGER = 110;
const LINE_FADE_DUR = 260;

// Static bracket spans the whole component (lines 0-9).
const STATIC_DASH_TOTAL = 320;
const STATIC_DRAW_START = 1800;
const STATIC_DRAW_END = 2300;
const STATIC_LABEL_START = 2150;
const STATIC_LABEL_END = 2500;

// Dynamic bracket spans lines 3-5 (the Suspense block), nested inside the static one.
const DYNAMIC_DASH_TOTAL = 220;
const DYNAMIC_DRAW_START = 2500;
const DYNAMIC_DRAW_END = 3000;
const DYNAMIC_LABEL_START = 2850;
const DYNAMIC_LABEL_END = 3200;

export const CodeToConcept: React.FC = () => {
  // Bracket geometry — one big SVG layer covering the right edge of the code
  // column. Lines start at CODE_TOP, each line is LINE_HEIGHT.
  const svgLeft = CODE_RIGHT;
  const svgTop = CODE_TOP - 10;
  const svgHeight = LINES.length * LINE_HEIGHT + 20;

  const staticY1 = 0 + 6;
  const staticY2 = LINES.length * LINE_HEIGHT - 4;
  const staticPath = `M 4 ${staticY1} L 16 ${staticY1} L 16 ${staticY2} L 4 ${staticY2}`;

  const dynY1 = 3 * LINE_HEIGHT + 6;
  const dynY2 = 6 * LINE_HEIGHT - 4;
  const dynPath = `M 38 ${dynY1} L 50 ${dynY1} L 50 ${dynY2} L 38 ${dynY2}`;

  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENES.codeToConcept.duration}ms`}
      className="absolute inset-0 overflow-hidden"
    >
      <div style={{ position: "absolute", inset: 0, background: vc.bg }} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          animation: "scene-fade-out var(--ef-transition-duration) var(--ef-transition-out-start) cubic-bezier(0.32,0,0.67,0) forwards",
        }}
      >
        {/* Tiny eyebrow above code block */}
        <div
          style={{
            position: "absolute",
            left: CODE_LEFT,
            top: CODE_TOP - 56,
            fontFamily: fonts.mono,
            fontSize: 16,
            color: vc.gray600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          app / page.tsx
        </div>

        {/* Code block */}
        <div
          style={{
            position: "absolute",
            left: CODE_LEFT,
            top: CODE_TOP,
            fontFamily: fonts.mono,
            fontSize: CODE_FONT_SIZE,
            lineHeight: `${LINE_HEIGHT}px`,
            color: vc.fg,
            whiteSpace: "pre",
          }}
        >
          {LINES.map((line, i) => (
            <div
              key={i}
              style={{
                height: LINE_HEIGHT,
                animation: `reveal-in ${LINE_FADE_DUR}ms ${i * LINE_STAGGER}ms cubic-bezier(0.33,1,0.68,1) backwards`,
                ["--reveal-y" as any]: "8px",
              }}
            >
              {line.tokens.map(([txt, kind], j) => (
                <span key={j} style={{ color: COLOR[kind] }}>
                  {txt}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Bracket layer (right of code) */}
        <svg
          width="320"
          height={svgHeight}
          viewBox={`0 0 320 ${svgHeight}`}
          style={{
            position: "absolute",
            left: svgLeft,
            top: svgTop,
          }}
        >
          <path
            d={staticPath}
            stroke={vc.purple}
            strokeWidth={2}
            strokeDasharray={STATIC_DASH_TOTAL}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              ["--dash-total" as any]: STATIC_DASH_TOTAL,
              animation: `bracket-draw ${STATIC_DRAW_END - STATIC_DRAW_START}ms ${STATIC_DRAW_START}ms cubic-bezier(0.33,1,0.68,1) backwards`,
            }}
          />
          <path
            d={dynPath}
            stroke={vc.blue}
            strokeWidth={2}
            strokeDasharray={DYNAMIC_DASH_TOTAL}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              ["--dash-total" as any]: DYNAMIC_DASH_TOTAL,
              animation: `bracket-draw ${DYNAMIC_DRAW_END - DYNAMIC_DRAW_START}ms ${DYNAMIC_DRAW_START}ms cubic-bezier(0.33,1,0.68,1) backwards`,
            }}
          />
        </svg>

        {/* Static label — anchored near the TOP of the static bracket so it
            doesn't overlap with the inset dynamic label (which sits inside the
            same SVG column at the suspense block). */}
        <div
          style={{
            position: "absolute",
            left: svgLeft + 36,
            top: svgTop + staticY1 - 8,
            fontFamily: fonts.sans,
            fontSize: 28,
            fontWeight: 500,
            color: vc.purple,
            letterSpacing: "-0.02em",
            ["--slide-x" as any]: "24px",
            animation: `slide-x-in ${STATIC_LABEL_END - STATIC_LABEL_START}ms ${STATIC_LABEL_START}ms cubic-bezier(0.33,1,0.68,1) backwards`,
          }}
        >
          static
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 14,
              color: vc.gray600,
              marginTop: 4,
              letterSpacing: "0.02em",
            }}
          >
            prerendered shell
          </div>
        </div>

        {/* Dynamic label — anchored at vertical CENTER of the Suspense bracket,
            indented further right so the eye reads "this small piece, inside
            the big static block, is dynamic." */}
        <div
          style={{
            position: "absolute",
            left: svgLeft + 78,
            top: svgTop + (dynY1 + dynY2) / 2 - 24,
            fontFamily: fonts.sans,
            fontSize: 28,
            fontWeight: 500,
            color: vc.blue,
            letterSpacing: "-0.02em",
            ["--slide-x" as any]: "24px",
            animation: `slide-x-in ${DYNAMIC_LABEL_END - DYNAMIC_LABEL_START}ms ${DYNAMIC_LABEL_START}ms cubic-bezier(0.33,1,0.68,1) backwards`,
          }}
        >
          dynamic
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 14,
              color: vc.gray600,
              marginTop: 4,
              letterSpacing: "0.02em",
            }}
          >
            streamed at request
          </div>
        </div>
      </div>
    </Timegroup>
  );
};

export default CodeToConcept;
