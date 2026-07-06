import React from "react";

type Easing = "out-cubic" | "in-cubic" | "in-out-quad";

// CSS cubic-bezier equivalents of the power-curve easings this project used to compute per-frame.
const EASE_CSS: Record<Easing, string> = {
  "out-cubic": "cubic-bezier(0.33,1,0.68,1)",   // matches easeOutCubic
  "in-cubic": "cubic-bezier(0.32,0,0.67,0)",    // matches easeInCubic
  "in-out-quad": "cubic-bezier(0.45,0,0.55,1)", // matches easeInOutQuad
};

export type RevealProps = {
  /** [delay, end] local-ms window (relative to this scene's own Timegroup) for the enter fade + float-up. */
  enter: readonly [number, number];
  /** px to float up from on enter (default 20; use 0 for a pure fade with no slide). */
  y?: number;
  /**
   * Exit fade — a [delay, end] local-ms tuple, independent of the scene boundary (this
   * composition uses no `overlap`, so there is no `--ef-transition-*` crossfade window to
   * align to — see constants.ts). Omit entirely for elements with no exit (e.g. content
   * that stays on screen until the whole scene cuts away).
   */
  exit?: readonly [number, number];
  /** px to continue sliding by during the exit (default 0 = fades in place). */
  exitY?: number;
  easeIn?: Easing;
  easeOut?: Easing;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Declarative fade + translateY reveal, driven by the `reveal-in` / `reveal-out` CSS
 * `@keyframes` in styles.css instead of a per-frame imperative style mutation.
 *
 * Every scene is its own `<Timegroup mode="fixed">` (see `src/scenes/`), so `enter`/`exit`
 * are local to that scene's own clock — small, human-scale numbers instead of master-ms.
 */
export function Reveal({
  enter,
  y = 20,
  exit,
  exitY = 0,
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
          "--reveal-y": `${y}px`,
          "--reveal-exit-y": `${exitY}px`,
          animation: animations.join(", "),
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
