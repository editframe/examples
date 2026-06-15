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

export const typewriter = (
  ms: number,
  start: number,
  dur: number,
  text: string
) => text.slice(0, Math.floor(clamp((ms - start) / dur) * text.length));

/**
 * Typewriter by characters-per-second — returns text revealed up to `ms`.
 * Matches the reference's actual cps so the command lands frame-accurate.
 */
export const typewriterCps = (
  ms: number,
  start: number,
  cps: number,
  text: string
) => {
  const chars = Math.floor(Math.max(0, (ms - start) / 1000) * cps);
  return text.slice(0, Math.min(chars, text.length));
};

// Custom out-back easing (not exported by animejs v4) — DIRECT form: outBack(t, overshoot)
export const outBack = (t: number, overshoot = 1.5) => {
  const c1 = overshoot;
  const c3 = c1 + 1;
  const x = clamp(t);
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

// FACTORY form (skill-canonical): const e = outBackEase(1.7); e(t)
export const outBackEase = (overshoot = 1.7) => (t: number) =>
  outBack(t, overshoot);
