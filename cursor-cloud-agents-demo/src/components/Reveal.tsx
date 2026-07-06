import React from "react";

type Easing = "out-cubic" | "in-cubic" | "in-out-cubic" | "out-quad" | "linear";

// CSS cubic-bezier equivalents of the power-curve easings this project used to compute per-frame.
const EASE_CSS: Record<Easing, string> = {
  "out-cubic": "cubic-bezier(0.33,1,0.68,1)", // matches easeOutCubic / 1-(1-t)^3
  "in-cubic": "cubic-bezier(0.32,0,0.67,0)", // matches easeInCubic / t^3
  "in-out-cubic": "cubic-bezier(0.65,0,0.35,1)", // matches the hand-rolled inOutCubic used for camera moves
  "out-quad": "cubic-bezier(0.5,1,0.89,1)", // matches t*(2-t)
  linear: "linear",
};

export type RevealProps = {
  /** [delay, end] local-ms window (relative to this scene's own Timegroup) for the enter fade + translate. */
  enter: readonly [number, number];
  /** px to translate in from on enter (default 16). Positive = from below. */
  y?: number;
  /** px to translate in from on enter, horizontal (default 0). Positive = from the right. */
  x?: number;
  /**
   * Exit fade — a `[delay, end]` local-ms tuple for exits that happen mid-scene. Omit for
   * elements with no exit (Timegroup sequencing hides the whole scene at the boundary, so
   * most elements in this project don't need one).
   */
  exit?: readonly [number, number];
  /** px to continue translating by during the exit (default 0 = fades in place). */
  exitY?: number;
  exitX?: number;
  easeIn?: Easing;
  easeOut?: Easing;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Declarative fade + translate reveal, driven by the `reveal-in` / `reveal-out` CSS
 * `@keyframes` in styles.css instead of a per-frame imperative style mutation.
 *
 * Every scene is its own `<Timegroup mode="fixed">` (see `src/scenes/`), so `enter`/`exit`
 * are local-ms windows relative to that scene's own clock. Use this for one-shot
 * "translate + fade in, optionally fade out mid-scene" callouts; keep continuous/procedural
 * motion (spinners, camera moves, multi-stage morphs) as bespoke `@keyframes` instead.
 */
export function Reveal({
  enter,
  y = 16,
  x = 0,
  exit,
  exitY = 0,
  exitX = 0,
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
          "--reveal-exit-x": `${exitX}px`,
          "--reveal-exit-y": `${exitY}px`,
          animation: animations.join(", "),
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
