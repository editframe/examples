import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import { clamp, lerp, track } from "../components/helpers";
import { vc, fonts } from "../lib/colors";

/**
 * Scene 3 — CodeToConcept (6.5s)  ‖ Delba canon rebuild
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
 * Beats:
 *   0–500       Cross-dissolve in.
 *   500–2500    Code block fades in line-by-line (stagger ≈ 220ms/line).
 *               Geist Mono, syntax-tokenized very lightly (keyword gray400,
 *               strings + tags gray100).
 *   2500–3300   Right-edge "static" bracket draws over lines 1–8, purple.
 *               Label "static" slides in from x+24 → x+0.
 *   3300–4100   Right-edge "dynamic" bracket draws over lines 4–6
 *               (the <Suspense> with <ShoppingCart />), blue. Label
 *               "dynamic" slides in.
 *   4100–5500   Hold — viewer reads.
 *   5500–6500   Cross-dissolve out.
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
  keyword: vc.gray400,    // export, function, return
  fn: vc.gray100,         // Page, ShoppingCart
  tag: vc.gray100,        // <main>, <Suspense>, <ShoppingCart />
  string: vc.purpleSoft,  // fallback strings — soft purple ties into vocabulary
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

export const Scene3_CodeToConcept: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Array<HTMLDivElement | null>>([]);
  const staticBracketRef = useRef<SVGPathElement>(null);
  const staticLabelRef = useRef<HTMLDivElement>(null);
  const dynamicBracketRef = useRef<SVGPathElement>(null);
  const dynamicLabelRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
    const ms = ownCurrentTimeMs;

    if (wrapperRef.current) {
      // No scene-level fade — prevents black seam at the cut.
      wrapperRef.current.style.opacity = "1";
    }

    // Code lines stagger in (first line starts immediately at scene cut so we
    // don't show a black frame at the seam).
    LINES.forEach((_, i) => {
      const el = lineRefs.current[i];
      if (!el) return;
      const start = i * 110;
      const p = track(ms, start, start + 260, eases.outCubic);
      el.style.opacity = String(p);
      el.style.transform = `translateY(${lerp(8, 0, p)}px)`;
    });

    // Static bracket (lines 0-3 inclusive + 6-9, but we draw single bracket
    // covering the "shell" lines 0,1,2,3,6,7,8,9 — visually we cover the
    // outer block, with the dynamic bracket clearly nested inside).
    if (staticBracketRef.current) {
      const total = 320;
      const p = track(ms, 1800, 2300, eases.outCubic);
      staticBracketRef.current.style.strokeDasharray = String(total);
      staticBracketRef.current.style.strokeDashoffset = String(total * (1 - p));
      staticBracketRef.current.style.opacity = String(clamp((ms - 1800) / 180));
    }
    if (staticLabelRef.current) {
      const p = track(ms, 2150, 2500, eases.outCubic);
      staticLabelRef.current.style.opacity = String(p);
      staticLabelRef.current.style.transform = `translateX(${lerp(24, 0, p)}px)`;
    }

    // Dynamic bracket (lines 3-5 — the Suspense block)
    if (dynamicBracketRef.current) {
      const total = 220;
      const p = track(ms, 2500, 3000, eases.outCubic);
      dynamicBracketRef.current.style.strokeDasharray = String(total);
      dynamicBracketRef.current.style.strokeDashoffset = String(total * (1 - p));
      dynamicBracketRef.current.style.opacity = String(clamp((ms - 2500) / 180));
    }
    if (dynamicLabelRef.current) {
      const p = track(ms, 2850, 3200, eases.outCubic);
      dynamicLabelRef.current.style.opacity = String(p);
      dynamicLabelRef.current.style.transform = `translateX(${lerp(24, 0, p)}px)`;
    }
  }, []);

  // Bracket geometry — for SVGs we use one big SVG layer covering the right
  // edge of the code column. Lines start at CODE_TOP, each line is LINE_HEIGHT.
  const svgLeft = CODE_RIGHT;
  const svgTop = CODE_TOP - 10;
  const svgHeight = LINES.length * LINE_HEIGHT + 20;

  // Static bracket spans lines 0-9 (the whole component)
  const staticY1 = 0 + 6;
  const staticY2 = LINES.length * LINE_HEIGHT - 4;
  const staticPath = `M 4 ${staticY1} L 16 ${staticY1} L 16 ${staticY2} L 4 ${staticY2}`;

  // Dynamic bracket spans lines 3-5 (the Suspense block) — inset further right
  const dynY1 = 3 * LINE_HEIGHT + 6;
  const dynY2 = 6 * LINE_HEIGHT - 4;
  const dynPath = `M 38 ${dynY1} L 50 ${dynY1} L 50 ${dynY2} L 38 ${dynY2}`;

  return (
    <Timegroup
      mode="fixed"
      duration="5s"
      onFrame={handleFrame as any}
      className="absolute inset-0 overflow-hidden"
    >
      <div style={{ position: "absolute", inset: 0, background: vc.bg }} />

      <div ref={wrapperRef} style={{ position: "absolute", inset: 0, opacity: 0 }}>
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
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              style={{
                opacity: 0,
                willChange: "transform, opacity",
                height: LINE_HEIGHT,
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
            ref={staticBracketRef}
            d={staticPath}
            stroke={vc.purple}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0 }}
          />
          <path
            ref={dynamicBracketRef}
            d={dynPath}
            stroke={vc.blue}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0 }}
          />
        </svg>

        {/* Static label — anchored near the TOP of the static bracket so it
            doesn't overlap with the inset dynamic label (which sits inside the
            same SVG column at the suspense block). */}
        <div
          ref={staticLabelRef}
          style={{
            position: "absolute",
            left: svgLeft + 36,
            top: svgTop + staticY1 - 8,
            fontFamily: fonts.sans,
            fontSize: 28,
            fontWeight: 500,
            color: vc.purple,
            letterSpacing: "-0.02em",
            opacity: 0,
            willChange: "transform, opacity",
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
          ref={dynamicLabelRef}
          style={{
            position: "absolute",
            left: svgLeft + 78,
            top: svgTop + (dynY1 + dynY2) / 2 - 24,
            fontFamily: fonts.sans,
            fontSize: 28,
            fontWeight: 500,
            color: vc.blue,
            letterSpacing: "-0.02em",
            opacity: 0,
            willChange: "transform, opacity",
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

export default Scene3_CodeToConcept;
