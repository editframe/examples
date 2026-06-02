// helpers.ts — the four animation primitives every scene uses.

import { eases } from "animejs";

/** Clamp n to [lo, hi]. Default [0, 1] for animation progress values. */
export const clamp = (n: number, lo = 0, hi = 1) =>
  Math.max(lo, Math.min(hi, n));

/** Linear interpolation: lerp(0, 10, 0.5) === 5. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * The workhorse. Returns eased progress (0→1) of an event between startMs..endMs.
 */
export const track = (
  ms: number,
  startMs: number,
  endMs: number,
  easeFn: (t: number) => number = eases.outCubic
) => easeFn(clamp((ms - startMs) / (endMs - startMs)));

/**
 * Back-out ease with controllable overshoot. Default 1.7.
 */
export const outBack = (overshoot = 1.7) => {
  const s = overshoot;
  return (t: number) => {
    const u = t - 1;
    return 1 + (s + 1) * u * u * u + s * u * u;
  };
};

/** Pre-baked outBack with overshoot=1.7 */
export const easeOutBack = outBack(1.7);
