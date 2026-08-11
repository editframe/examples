import React from "react";

type Easing =
  | "linear"
  | "out-cubic"
  | "in-cubic"
  | "in-out-cubic"
  | "in-out-quad"
  | "out-quad"
  | "out-quart"
  | "out-expo"
  | "out-back";

// CSS cubic-bezier equivalents of the power-curve/spring easings every project used to
// compute per-frame (via animejs `eases.*` / hand-rolled cubic-in-out / cubic-out-back)
// before switching to this declarative component. Consolidated from ~16 near-identical
// per-example `components/Reveal.tsx` easing tables — every curve any of them used lives
// here once.
const EASE_CSS: Record<Easing, string> = {
  linear: "linear",
  "out-cubic": "cubic-bezier(0.33,1,0.68,1)", // matches animejs eases.outCubic
  "in-cubic": "cubic-bezier(0.32,0,0.67,0)", // matches animejs eases.inCubic
  "in-out-cubic": "cubic-bezier(0.65,0,0.35,1)", // matches the hand-rolled camEase()/eases.inOutCubic
  "in-out-quad": "cubic-bezier(0.45,0,0.55,1)", // matches animejs eases.inOutQuad
  "out-quad": "cubic-bezier(0.5,1,0.89,1)", // matches t*(2-t) / eases.outQuad
  "out-quart": "cubic-bezier(0.25,1,0.5,1)", // matches animejs eases.outQuart
  "out-expo": "cubic-bezier(0.16,1,0.3,1)", // matches animejs eases.outExpo
  "out-back": "cubic-bezier(0.34,1.56,0.64,1)", // matches animejs eases.outBack(~1.7)
};

export type RevealProps = {
  /** [delay, end] local-ms window (relative to this scene's own Timegroup) for the enter animation. */
  enter: readonly [number, number];
  /** px to translate in from on enter, X axis (default 0). */
  x?: number;
  /** px to translate in from on enter, Y axis (default 20). */
  y?: number;
  /** starting scale on enter (default 1 = no scale animation). */
  scaleFrom?: number;
  /**
   * Exit fade. Either:
   * - `"transition"` — align with this scene's own outgoing crossfade, via the
   *   `--ef-transition-duration` / `--ef-transition-out-start` CSS vars the parent
   *   `<Timegroup>` exposes.
   * - `[delay, end]` local-ms tuple — for exits that happen mid-scene, independent of
   *   the scene boundary.
   * Omit entirely for elements with no exit.
   */
  exit?: "transition" | readonly [number, number];
  /** Extra delay added on top of `--ef-transition-out-start` when `exit="transition"` (ms). */
  exitDelay?: number;
  exitX?: number;
  exitY?: number;
  /** ending scale on exit (default 1 = no further scale change). */
  exitScale?: number;
  easeIn?: Easing;
  easeOut?: Easing;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Declarative fade + translate/scale reveal, driven by the `reveal-in` / `reveal-out`
 * CSS `@keyframes` in `@shared/styles/reveal.css` instead of a per-frame imperative style
 * mutation. See BEST-PRACTICES.md §2 (priority 1: "one-shot fade/float enter-exit").
 *
 * Every scene is its own `<Timegroup mode="fixed">`, so `enter`/`exit` are local to that
 * scene's own clock — small, human-scale numbers instead of master-ms.
 *
 * Note: if the wrapped element also needs a STATIC positioning transform (e.g. a
 * `translate(-50%,-50%)` centering offset), put that transform on an outer wrapper div
 * and use `Reveal` for the inner content — `Reveal` writes its own `transform` and would
 * otherwise clobber a static one.
 */
export function Reveal({
  enter,
  x = 0,
  y = 20,
  scaleFrom = 1,
  exit,
  exitDelay = 0,
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
  if (exit === "transition") {
    const delay = exitDelay
      ? `calc(var(--ef-transition-out-start) + ${exitDelay}ms)`
      : "var(--ef-transition-out-start)";
    animations.push(`reveal-out var(--ef-transition-duration) ${delay} ${EASE_CSS[easeOut]} forwards`);
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
          "--reveal-x": `${x}px`,
          "--reveal-y": `${y}px`,
          "--reveal-scale-from": scaleFrom,
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
