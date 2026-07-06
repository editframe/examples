import React from "react";

type Easing = "out-cubic" | "in-cubic" | "in-out-quad";

// CSS cubic-bezier equivalents of the power-curve easings this project used to compute per-frame.
const EASE_CSS: Record<Easing, string> = {
  "out-cubic": "cubic-bezier(0.33,1,0.68,1)", // matches animejs eases.outCubic
  "in-cubic": "cubic-bezier(0.32,0,0.67,0)", // matches animejs eases.inCubic
  "in-out-quad": "cubic-bezier(0.45,0,0.55,1)", // matches animejs eases.inOutQuad
};

export type RevealProps = {
  /** [delay, end] local-ms window (relative to this scene's own Timegroup) for the enter fade + float-up. */
  enter: readonly [number, number];
  /** px to float up from on enter (default 20, 0 = pure fade). */
  y?: number;
  /**
   * Exit fade. Either:
   * - `"transition"` — align with this scene's own outgoing crossfade, via the
   *   `--ef-transition-duration` / `--ef-transition-out-start` CSS vars the parent
   *   `<Timegroup>` exposes. Use this whenever the element should simply fade out as
   *   the scene hands off to the next one.
   * - `[delay, end]` local-ms tuple — for exits that happen mid-scene, independent of
   *   the scene boundary.
   * Omit entirely for elements with no exit (e.g. the final scene's lockup).
   */
  exit?: "transition" | readonly [number, number];
  /** px to continue floating by during the exit (default 0 = fades in place). */
  exitY?: number;
  easeIn?: Easing;
  easeOut?: Easing;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Declarative fade + translateY reveal, driven by the `reveal-in` / `reveal-out` CSS
 * `@keyframes` in styles.css instead of a per-frame imperative `ref.current.style...`
 * mutation inside an `onFrame` callback.
 *
 * Every scene is its own `<Timegroup mode="fixed">` (see `src/scenes/`), so `enter`/
 * `exit` are local to that scene's own clock — small, human-scale numbers instead of
 * master-ms. Use this for one-shot "fade in, later fade out" callouts; keep
 * continuous/procedural motion (ambient drift, breathing, shape-morphs) as infinite
 * CSS keyframes with no scene-relative timing at all — never per-frame JS.
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
  if (exit === "transition") {
    animations.push(
      `reveal-out var(--ef-transition-duration) var(--ef-transition-out-start) ${EASE_CSS[easeOut]} forwards`
    );
  } else if (exit) {
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
