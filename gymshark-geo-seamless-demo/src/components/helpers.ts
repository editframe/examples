/** Clamp v to [lo, hi] (default 0..1) */
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

/**
 * Map ms → 0..1 progress within [start, end] with optional easing. Returns 0 before
 * start, 1 after end. Used only by Fabric.tsx's scoped `onFrame` (the spec-panel text
 * readouts) — everywhere else in this composition is driven by CSS, not this helper.
 */
export const track = (
  ms: number,
  start: number,
  end: number,
  ease: (t: number) => number = (t) => t
): number => ease(clamp((ms - start) / (end - start)));

/** Ease out cubic */
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
