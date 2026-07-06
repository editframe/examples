import React from "react";

type Easing = "out-cubic" | "in-cubic" | "in-out-quad" | "out-back" | "out-quart" | "out-quad";

// CSS cubic-bezier equivalents of the power-curve easings this project used to compute per-frame
// (see REFACTOR-PATTERNS.md Part 2b). `out-quart`/`out-quad` extend that doc's three curves using
// the same technique (the standard easings.net bezier for each power curve) — `eases.outQuart` and
// `eases.outQuad` are by far the most common easings in the original CursorJiraScene onFrame body.
// `out-back` is the standard "overshoot" approximation of animejs's outBack(1.7), used for the
// @Cursor chip pop-in.
const EASE_CSS: Record<Easing, string> = {
  "out-cubic": "cubic-bezier(0.33,1,0.68,1)",
  "in-cubic": "cubic-bezier(0.32,0,0.67,0)",
  "in-out-quad": "cubic-bezier(0.45,0,0.55,1)",
  "out-back": "cubic-bezier(0.34,1.56,0.64,1)",
  "out-quart": "cubic-bezier(0.25,1,0.5,1)",
  "out-quad": "cubic-bezier(0.5,1,0.89,1)",
};

export type RevealProps = {
  /** [delay, end] local-ms window (relative to this scene's own Timegroup) for the enter animation. */
  enter: readonly [number, number];
  /** Optional [delay, end] local-ms window for a mid-scene exit fade. Omit for elements with no exit. */
  exit?: readonly [number, number];
  /** px to translate from on enter (default 0,20 = float up). */
  x?: number;
  y?: number;
  /** initial scale on enter (default 1 = no scale, just fade/translate). */
  scale?: number;
  /** px/scale to continue moving/scaling by during the exit (default = mirrors enter). */
  exitX?: number;
  exitY?: number;
  exitScale?: number;
  easeIn?: Easing;
  easeOut?: Easing;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Declarative fade + translate/scale reveal, driven by the `reveal-in` / `reveal-out` CSS
 * `@keyframes` in styles.css instead of a per-frame imperative style mutation (see
 * `src/components/Reveal.tsx` in the allbirds-tree-runner-demo reference implementation).
 *
 * `enter`/`exit` are local to the scene's own `<Timegroup mode="fixed">` clock — small,
 * human-scale numbers instead of master-ms. Use this for one-shot "fade in (+ float/scale),
 * later fade out" callouts; keep continuous/procedural motion (ambient drift, breathing,
 * shape-morphs) as infinite CSS keyframes instead.
 */
export function Reveal({
  enter,
  exit,
  x = 0,
  y = 20,
  scale = 1,
  exitX = 0,
  exitY = 0,
  exitScale = 1,
  easeIn = "out-cubic",
  easeOut = "in-cubic",
  style,
  className,
  children,
}: RevealProps) {
  const [inAt, inEnd] = enter;
  const animations = [`reveal-in ${inEnd - inAt}ms ${inAt}ms ${EASE_CSS[easeIn]} backwards`];
  if (exit) {
    const [outAt, outEnd] = exit;
    animations.push(`reveal-out ${outEnd - outAt}ms ${outAt}ms ${EASE_CSS[easeOut]} forwards`);
  }
  return (
    <div
      className={className}
      style={
        {
          ...style,
          "--reveal-x": `${x}px`,
          "--reveal-y": `${y}px`,
          "--reveal-scale": scale,
          "--reveal-exit-x": `${exitX}px`,
          "--reveal-exit-y": `${exitY}px`,
          "--reveal-exit-scale": exitScale,
          animation: animations.join(", "),
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
