import React from "react";

type Easing = "out-cubic" | "in-cubic" | "in-out-quad";

// CSS cubic-bezier equivalents of the power-curve easings in ./helpers.ts
const EASE_CSS: Record<Easing, string> = {
  "out-cubic": "cubic-bezier(0.33,1,0.68,1)",   // matches easeOutCubic
  "in-cubic": "cubic-bezier(0.32,0,0.67,0)",    // matches easeInCubic
  "in-out-quad": "cubic-bezier(0.45,0,0.55,1)", // matches easeInOutQuad
};

export type RevealProps = {
  /** [start, end] master ms window for the enter fade + float-up. */
  enter: readonly [number, number];
  /** px to float up from on enter (default 20). */
  y?: number;
  /** [start, end] master ms window for the exit fade. Omit if the beat has no independent exit (e.g. CTA). */
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
 * Editframe's Timegroup drives `animation.currentTime` for every CSS animation in the
 * composition against the master clock, so this stays perfectly scrubbable/deterministic —
 * see the `css-animations` skill. Use this for one-shot "float up + fade in, later fade out"
 * callouts; keep continuous/procedural motion (ambient drift, breathing, shape-morphs) as
 * imperative `onFrame` code since it has no clean closed-form keyframe.
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
