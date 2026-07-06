import React from "react";

type Easing = "out-cubic" | "in-cubic" | "in-out-quad" | "out-back";

// CSS cubic-bezier equivalents of the power-curve easings this project used to
// compute per-frame via `animejs`'s `eases` + a hand-rolled `outBack`.
const EASE_CSS: Record<Easing, string> = {
  "out-cubic": "cubic-bezier(0.33,1,0.68,1)",   // matches eases.outCubic
  "in-cubic": "cubic-bezier(0.32,0,0.67,0)",    // matches eases.inCubic
  "in-out-quad": "cubic-bezier(0.45,0,0.55,1)", // matches eases.inOutQuad
  "out-back": "cubic-bezier(0.34,1.56,0.64,1)", // matches helpers.ts's outBack(1.7)
};

export type RevealProps = {
  /** [delay, end] scene-local-ms window for the enter fade + slide. */
  enter: readonly [number, number];
  /** px to translateY from on enter (default 20). */
  y?: number;
  /** px to translateX from on enter (default 0). */
  x?: number;
  /** [delay, end] scene-local-ms window for an exit fade. Omit for elements that don't exit. */
  exit?: readonly [number, number];
  /** px to continue translateY by during the exit (default 0 = fades in place). */
  exitY?: number;
  easeIn?: Easing;
  easeOut?: Easing;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Declarative fade + translate reveal, driven by the `reveal-in` / `reveal-out`
 * CSS `@keyframes` in styles.css instead of a per-frame `onFrame` + ref mutation.
 *
 * Every scene is its own `<Timegroup mode="fixed">` (see `src/scenes/`), so
 * `enter`/`exit` are local to that scene's own clock — the same small,
 * human-scale numbers the original `handleFrame` callbacks already used via
 * `ownCurrentTimeMs`.
 */
export function Reveal({
  enter,
  y = 20,
  x = 0,
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
          "--reveal-x": `${x}px`,
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
