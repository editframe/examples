import React from "react";

type Easing = "out-cubic" | "in-cubic" | "in-out-quad";

// CSS cubic-bezier equivalents of the power-curve easings this project used to compute
// per-frame via animejs's `eases` + a per-frame `track()`/`lerp()` helper.
const EASE_CSS: Record<Easing, string> = {
  "out-cubic": "cubic-bezier(0.33,1,0.68,1)", // matches eases.outCubic
  "in-cubic": "cubic-bezier(0.32,0,0.67,0)", // matches eases.inCubic
  "in-out-quad": "cubic-bezier(0.45,0,0.55,1)", // matches eases.inOutQuad
};

export type RevealProps = {
  /** [delay, end] local-ms window (relative to this scene's own Timegroup) for the enter fade + float-up. */
  enter: readonly [number, number];
  /** px to float up from on enter (default 20). */
  y?: number;
  /** Optional exit fade — a [delay, end] local-ms tuple. Omit for scenes that hard-cut (no exit needed). */
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
 * `@keyframes` in styles.css instead of a per-frame imperative style mutation
 * (`track()`/`lerp()` + `ref.current.style...` in an `onFrame` callback).
 *
 * `enter`/`exit` are local to the scene's own `<Timegroup mode="fixed">` clock.
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
