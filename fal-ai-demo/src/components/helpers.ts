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

// Custom out-back easing (matches animejs outBack but tweakable)
export const outBack = (t: number, overshoot = 1.7) => {
  const c1 = overshoot;
  const c3 = c1 + 1;
  const x = clamp(t);
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

// Quadratic bezier through three points
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

// Cubic bezier through four points (for natural cursor arcs)
export const cbez = (
  t: number,
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number]
): [number, number] => {
  const u = 1 - t;
  const uu = u * u;
  const uuu = uu * u;
  const tt = t * t;
  const ttt = tt * t;
  return [
    uuu * p0[0] + 3 * uu * t * p1[0] + 3 * u * tt * p2[0] + ttt * p3[0],
    uuu * p0[1] + 3 * uu * t * p1[1] + 3 * u * tt * p2[1] + ttt * p3[1],
  ];
};

// RGB interpolation
export const rgbLerp = (
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] => [
  Math.round(lerp(a[0], b[0], t)),
  Math.round(lerp(a[1], b[1], t)),
  Math.round(lerp(a[2], b[2], t)),
];

export const toHex = (rgb: [number, number, number]) =>
  "#" +
  rgb
    .map((c) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
