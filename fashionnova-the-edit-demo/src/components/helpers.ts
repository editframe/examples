/**
 * Only used by `scenes/FanToEdit.tsx`'s one deliberate `addFrameTask` exception (the
 * fly-in → fan → deal card choreography — see the comment there for why that one stayed
 * imperative). Every other scene in this composition is plain CSS; nothing else in
 * `src/` should need these.
 */

/** Clamp v to [lo, hi] (default 0..1) */
export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

/** Linear interpolate */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Map ms → 0..1 progress within [start, end] with optional easing.
 * Returns 0 before start, 1 after end.
 */
export const track = (
  ms: number,
  start: number,
  end: number,
  ease: (t: number) => number = (t) => t
): number => ease(clamp((ms - start) / (end - start)));

/** Ease out + overshoot (spring-like) */
export const outBack = (t: number, overshoot = 1.7): number => {
  const c1 = overshoot;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/** Ease out cubic */
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Ease in-out quad */
export const easeInOutQuad = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
