import { eases } from "animejs";

/**
 * Small animation/math primitives shared by every composition's `onFrame` escape hatches
 * (see BEST-PRACTICES.md §2 — CSS first, `addFrameTask` last resort). Consolidated from
 * ~10 near-identical per-example `components/helpers.ts` files; this is the one place these
 * primitives are defined, so every scene's interpolation math means the same thing.
 */

/** Clamp `n` to `[lo, hi]` (default `[0, 1]`, i.e. animation progress). */
export const clamp = (n: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));

/** Linear interpolation: `lerp(0, 10, 0.5) === 5`. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * The workhorse: eased progress (0→1) of an event between `startMs`..`endMs`. Returns 0
 * before `startMs`, 1 after `endMs`. Defaults to `animejs`'s `outCubic` — pass `linear`
 * explicitly for a non-eased ramp.
 */
export const track = (
  ms: number,
  startMs: number,
  endMs: number,
  easeFn: (t: number) => number = eases.outCubic
) => easeFn(clamp((ms - startMs) / (endMs - startMs)));

/** Identity easing — explicit opt-out of `track`'s default `outCubic`. */
export const linear = (t: number) => t;

/** Ease-out cubic: `1 - (1-t)^3`. */
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Ease-in cubic: `t^3`. */
export const easeInCubic = (t: number) => t * t * t;

/** Ease-in-out cubic. */
export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Ease-in-out quad. */
export const easeInOutQuad = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/**
 * Back-out ease **factory** with controllable overshoot (default 1.7) — call it to get a
 * drop-in `(t: number) => number` easing function, e.g. `track(ms, a, b, outBack(2.2))`.
 */
export const outBack = (overshoot = 1.7) => {
  const s = overshoot;
  return (t: number) => {
    const u = t - 1;
    return 1 + (s + 1) * u * u * u + s * u * u;
  };
};

/** Pre-baked `outBack(1.7)` — drop-in `EasingFunction` for the common case. */
export const easeOutBack = outBack(1.7);

/** Reveals `text` character-by-character over `[start, start + dur]` ms. */
export const typewriter = (ms: number, start: number, dur: number, text: string) =>
  text.slice(0, Math.floor(clamp((ms - start) / dur) * text.length));

/** Quadratic bezier through three 2D points — e.g. a cursor's arced hop path. */
export const bez = (
  t: number,
  p0: [number, number],
  p1: [number, number],
  p2: [number, number]
): [number, number] => {
  const u = 1 - t;
  return [
    u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
    u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
  ];
};
