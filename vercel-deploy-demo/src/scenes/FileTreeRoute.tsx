import React from "react";
import { Timegroup } from "@editframe/react";
import { Reveal } from "@shared/components/Reveal";
import { vc, fonts } from "../lib/colors";
import { SCENES } from "../constants";

/**
 * Scene 2 — FileTreeRoute (4.5s local + 0.5s crossfade tail)  ‖ Delba canon rebuild
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
 * Beats (local ms, this scene's own clock):
 *   0–600, 600–1100, 1100–1600, 1600–2100  Each tree row slides in.
 *   2100–2380   The `dashboard/page.tsx` row (target row) appears.
 *   2450–2900   Target row "lights up" with a purple left-edge tick.
 *   2850–3350   Arrow draws from that row to the right column.
 *   3350–3800   `/dashboard` types in on the right, big Geist Sans.
 *   3350–3800   Caret shows solid during typing, then blinks.
 *   3800–4050   Mono caption fades in beneath the URL.
 *   4000–4500   Hold.
 *   4500–5000   Crossfade out (--ef-transition-out-start).
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
  start: number; // appear ms (local, this scene's own clock)
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
const ARROW_DASH_TOTAL = 200; // path length budget for the SVG stroke-dasharray

export const FileTreeRoute: React.FC = () => {
  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENES.fileTreeRoute.duration}ms`}
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
              style={{
                position: "relative",
                paddingLeft: row.depth * 32 + 14,
                color: row.isTarget ? vc.fg : vc.textMuted,
                ["--slide-x" as any]: "-12px",
                animation: `slide-x-in 280ms ${row.start}ms cubic-bezier(0.33,1,0.68,1) backwards`,
              }}
            >
              {/* Purple left-edge tick — only on target row, only when "lit" */}
              {row.isTarget && (
                <div
                  style={{
                    position: "absolute",
                    left: row.depth * 32,
                    top: 4,
                    bottom: 4,
                    width: 3,
                    background: vc.purple,
                    borderRadius: 2,
                    transformOrigin: "center",
                    animation: "row-glow-in 450ms 2450ms cubic-bezier(0.33,1,0.68,1) backwards",
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
            d="M 0 20 L 240 20"
            stroke={vc.gray600}
            strokeWidth={1.5}
            strokeDasharray={ARROW_DASH_TOTAL}
            fill="none"
            style={{
              ["--dash-total" as any]: ARROW_DASH_TOTAL,
              animation: `bracket-draw ${ARROW_DRAW_END - ARROW_DRAW_START}ms ${ARROW_DRAW_START}ms cubic-bezier(0.33,1,0.68,1) backwards`,
            }}
          />
          <path
            d="M 232 12 L 244 20 L 232 28"
            stroke={vc.gray600}
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              ["--slide-x" as any]: "-6px",
              animation: `slide-x-in 100ms ${ARROW_DRAW_END - 100}ms cubic-bezier(0.33,1,0.68,1) backwards`,
            }}
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
          <div
            style={{
              overflow: "hidden",
              display: "inline-block",
              ["--tw-width" as any]: `${URL_TEXT.length}ch`,
              animation: `typewriter-reveal ${URL_TYPE_END - URL_TYPE_START}ms ${URL_TYPE_START}ms steps(${URL_TEXT.length}, end) both`,
            }}
          >
            {URL_TEXT}
          </div>
          {/* Caret — solid while the URL is typing, then blinks. Simplified to a
              single infinite blink starting once the arrow finishes drawing;
              the original per-frame version held it solid through the typing
              window before blinking, which isn't worth a bespoke two-stage
              keyframe for a cosmetic caret. */}
          <span
            style={{
              display: "inline-block",
              width: 6,
              height: 56,
              background: vc.fg,
              marginLeft: 4,
              transform: "translateY(8px)",
              animation: `caret-blink 1000ms steps(2, jump-none) ${ARROW_DRAW_END}ms infinite backwards`,
            }}
          />
        </div>

        {/* Mono caption beneath URL */}
        <Reveal
          enter={[URL_TYPE_END, URL_TYPE_END + 250]}
          y={0}
          style={{
            position: "absolute",
            left: 1180,
            top: "calc(50% + 60px)",
            fontFamily: fonts.mono,
            fontSize: 18,
            color: vc.textMuted,
            letterSpacing: "0.02em",
          }}
        >
          file → route
        </Reveal>
      </div>
    </Timegroup>
  );
};

export default FileTreeRoute;
