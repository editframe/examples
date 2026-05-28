import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import { clamp, lerp, track } from "../components/helpers";
import { vc, fonts } from "../lib/colors";

/**
 * Scene 2 — FileTreeRoute (6.0s)  ‖ Delba canon rebuild
 *
 * Reference: Delba's "Next.js Explained: Creating Routes" (Episode 1 of her
 * filesystem-routing series) — https://www.youtube.com/watch?v=kmJEmfRhv5g
 *
 * The defining Delba move: animated filesystem tree on the left, the
 * corresponding URL on the right, an arrow that draws between them showing
 * "this file → this route." Nothing else on screen. Geist Mono throughout.
 *
 * Frame composition (locked):
 *   - LEFT column (x≈420–820): file tree, monospace, indented by depth
 *   - ARROW (x≈900–1100): thin gray line drawing left-to-right
 *   - RIGHT column (x≈1180–1500): the URL that file produces, big
 *
 * Beats (frame-driven):
 *   0–500       Scene cross-dissolve in.
 *   500–1500    `app/` root appears (typewriter cadence on the label).
 *   1500–2200   `page.tsx` slides in beneath, indented one level.
 *   2200–2900   `layout.tsx` slides in.
 *   2900–3700   `dashboard/` folder slides in (one level deep), then
 *               `dashboard/page.tsx` slides in (two levels deep).
 *   3700–4300   The `dashboard/page.tsx` row lights subtly (gray100 fg,
 *               with a faint purple left-edge tick — "this is the file").
 *   4300–4900   Arrow draws from that row to the right column.
 *   4900–5500   `/dashboard` types in on the right, big Geist Sans.
 *   5500–6000   Hold, then cross-dissolve out.
 *
 * Brand checks (pause-test):
 *   - Bg #0A0A0A ✓
 *   - Geist Mono (tree), Geist Sans (URL) ✓
 *   - One accent (purple) used at moment of meaning only ✓
 *   - >55% negative space ✓
 *   - NO terminal chrome, NO logo, NO globe ✓
 */

type Row = {
  label: string;
  depth: number;
  start: number; // appear ms
  isTarget?: boolean;
};

// First row starts at 0 so the scene cut isn't a black frame. The subsequent
// rows still stagger in to give the scene its rhythm.
const ROWS: Row[] = [
  { label: "app/", depth: 0, start: 0 },
  { label: "page.tsx", depth: 1, start: 600 },
  { label: "layout.tsx", depth: 1, start: 1100 },
  { label: "dashboard/", depth: 1, start: 1600 },
  { label: "page.tsx", depth: 2, start: 2100, isTarget: true },
];

const ARROW_DRAW_START = 2850;
const ARROW_DRAW_END = 3350;
const URL_TYPE_START = 3350;
const URL_TYPE_END = 3800;
const URL_TEXT = "/dashboard";

export const Scene2_FileTreeRoute: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const targetGlowRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGPathElement>(null);
  const arrowHeadRef = useRef<SVGPathElement>(null);
  const urlRef = useRef<HTMLDivElement>(null);
  const urlCaretRef = useRef<HTMLSpanElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
    const ms = ownCurrentTimeMs;

    // No scene-level fade — see Scene1 rationale. Inner elements animate.
    if (wrapperRef.current) {
      wrapperRef.current.style.opacity = "1";
    }

    // Each row: slide in from x=-12px, opacity 0→1 over 280ms
    ROWS.forEach((row, i) => {
      const el = rowRefs.current[i];
      if (!el) return;
      const p = track(ms, row.start, row.start + 280, eases.outCubic);
      el.style.opacity = String(p);
      el.style.transform = `translateX(${lerp(-12, 0, p)}px)`;
    });

    // Target row "lights up" with purple left-tick
    if (targetGlowRef.current) {
      const p = track(ms, 2450, 2900, eases.outCubic);
      targetGlowRef.current.style.opacity = String(p);
      targetGlowRef.current.style.transform = `scaleY(${lerp(0.2, 1, p)})`;
    }

    // Arrow path — animated by stroke-dashoffset
    if (arrowRef.current) {
      const total = 200; // path length budget (we set dasharray to 200)
      const p = track(ms, ARROW_DRAW_START, ARROW_DRAW_END, eases.outCubic);
      arrowRef.current.style.strokeDasharray = String(total);
      arrowRef.current.style.strokeDashoffset = String(total * (1 - p));
      arrowRef.current.style.opacity = String(clamp((ms - ARROW_DRAW_START) / 200));
    }
    if (arrowHeadRef.current) {
      const p = track(ms, ARROW_DRAW_END - 100, ARROW_DRAW_END, eases.outCubic);
      arrowHeadRef.current.style.opacity = String(p);
      arrowHeadRef.current.style.transform = `translateX(${lerp(-6, 0, p)}px)`;
    }

    // URL typewriter on the right
    if (urlRef.current) {
      const p = track(ms, URL_TYPE_START, URL_TYPE_END, eases.linear);
      const n = Math.floor(p * URL_TEXT.length);
      urlRef.current.textContent = URL_TEXT.slice(0, n);
    }
    if (urlCaretRef.current) {
      const showCaret = ms >= ARROW_DRAW_END;
      const typing = ms >= URL_TYPE_START && ms < URL_TYPE_END;
      const blink = Math.floor(ms / 500) % 2 === 0 ? 1 : 0;
      urlCaretRef.current.style.opacity = showCaret ? String(typing ? 1 : blink) : "0";
    }

    // Tiny mono caption: appears with URL
    if (captionRef.current) {
      const p = track(ms, URL_TYPE_END, URL_TYPE_END + 250, eases.outCubic);
      captionRef.current.style.opacity = String(p);
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration="4.5s"
      onFrame={handleFrame as any}
      className="absolute inset-0 overflow-hidden"
    >
      <div style={{ position: "absolute", inset: 0, background: vc.bg }} />

      <div ref={wrapperRef} style={{ position: "absolute", inset: 0, opacity: 0 }}>
        {/* LEFT: file tree */}
        <div
          style={{
            position: "absolute",
            left: 420,
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: fonts.mono,
            fontSize: 26,
            lineHeight: 1.85,
            color: vc.textMuted,
            width: 360,
          }}
        >
          {ROWS.map((row, i) => (
            <div
              key={i}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              style={{
                position: "relative",
                paddingLeft: row.depth * 32 + 14,
                opacity: 0,
                willChange: "transform, opacity",
                color: row.isTarget ? vc.fg : vc.textMuted,
              }}
            >
              {/* Purple left-edge tick — only on target row, only when "lit" */}
              {row.isTarget && (
                <div
                  ref={targetGlowRef}
                  style={{
                    position: "absolute",
                    left: row.depth * 32,
                    top: 4,
                    bottom: 4,
                    width: 3,
                    background: vc.purple,
                    borderRadius: 2,
                    opacity: 0,
                    transformOrigin: "center",
                  }}
                />
              )}
              {row.label}
            </div>
          ))}
        </div>

        {/* ARROW — thin gray line that draws left→right */}
        <svg
          width="280"
          height="40"
          viewBox="0 0 280 40"
          style={{
            position: "absolute",
            left: 880,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <path
            ref={arrowRef}
            d="M 0 20 L 240 20"
            stroke={vc.gray600}
            strokeWidth={1.5}
            fill="none"
            style={{ opacity: 0 }}
          />
          <path
            ref={arrowHeadRef}
            d="M 232 12 L 244 20 L 232 28"
            stroke={vc.gray600}
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0, willChange: "transform, opacity" }}
          />
        </svg>

        {/* RIGHT: the URL */}
        <div
          style={{
            position: "absolute",
            left: 1180,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "baseline",
            gap: 0,
            fontFamily: fonts.sans,
            fontSize: 64,
            fontWeight: 500,
            letterSpacing: "-0.03em",
            color: vc.fg,
            whiteSpace: "pre",
          }}
        >
          <div ref={urlRef} />
          <span
            ref={urlCaretRef}
            style={{
              display: "inline-block",
              width: 6,
              height: 56,
              background: vc.fg,
              marginLeft: 4,
              opacity: 0,
              transform: "translateY(8px)",
            }}
          />
        </div>

        {/* Mono caption beneath URL */}
        <div
          ref={captionRef}
          style={{
            position: "absolute",
            left: 1180,
            top: "calc(50% + 60px)",
            fontFamily: fonts.mono,
            fontSize: 18,
            color: vc.textMuted,
            opacity: 0,
            letterSpacing: "0.02em",
          }}
        >
          file → route
        </div>
      </div>
    </Timegroup>
  );
};

export default Scene2_FileTreeRoute;
