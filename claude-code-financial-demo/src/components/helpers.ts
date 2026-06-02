import { eases } from "animejs";

export const clamp = (n: number, lo = 0, hi = 1) =>
  Math.max(lo, Math.min(hi, n));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const track = (
  ms: number,
  startMs: number,
  endMs: number,
  easeFn: (t: number) => number = eases.outCubic
) => easeFn(clamp((ms - startMs) / (endMs - startMs)));

/** Back-out ease with controllable overshoot. Default 1.7. */
export const outBack = (overshoot = 1.7) => {
  const s = overshoot;
  return (t: number) => {
    const u = t - 1;
    return 1 + (s + 1) * u * u * u + s * u * u;
  };
};

/** Pre-baked outBack with overshoot=1.7 — drop-in EasingFunction. */
export const easeOutBack = outBack(1.7);
