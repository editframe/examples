import React from "react";

type Easing = "out-cubic" | "in-cubic" | "in-out-cubic" | "out-back";

// CSS cubic-bezier equivalents of the power-curve / spring easings this project
// used to compute per-frame via animejs `eases` + a hand-rolled `outBack`.
const EASE_CSS: Record<Easing, string> = {
  "out-cubic": "cubic-bezier(0.33,1,0.68,1)",       // matches eases.outCubic
  "in-cubic": "cubic-bezier(0.32,0,0.67,0)",        // matches eases.inCubic
  "in-out-cubic": "cubic-bezier(0.65,0,0.35,1)",    // matches eases.inOutCubic
  "out-back": "cubic-bezier(0.34,1.56,0.64,1)",     // matches helpers.ts outBack (overshoot spring)
};

export type RevealProps = {
  /** [delay, end] local-ms window (relative to this scene's own Timegroup) for the enter fade + float. */
  enter: readonly [number, number];
  /** px to float up from on enter (default 20; use 0 for a pure fade). */
  y?: number;
  /** Exit fade — [delay, end] local-ms tuple. Omit for elements with no exit (they just hold). */
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
 * are local to that scene's own clock. This project's root sequence has no `overlap`
 * (scenes are deliberate hard cuts, not crossfades — see Video.tsx), so unlike the
 * allbirds reference `Reveal`, there is no `exit="transition"` mode wired to
 * `--ef-transition-out-start`; exits are always an explicit local-ms window.
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
