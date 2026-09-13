/** Shared animation helpers for per-scene addFrameTask logic. */

export type TgEl = HTMLElement & {
  initializer?: (inst: TgEl) => (() => void) | void;
  addFrameTask: (cb: (info: { ownCurrentTimeMs: number }) => void) => () => void;
};

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);
export const easeInCubic = (p: number) => p * p * p;
export const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

export type W = Array<[number, number]>;

/** Piecewise-linear waypoint interpolation on frame number F. */
export const wp = (f: number, pts: W) => {
  if (f <= pts[0][0]) return pts[0][1];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    if (f <= b[0]) return lerp(a[1], b[1], (f - a[0]) / (b[0] - a[0]));
  }
  return pts[pts.length - 1][1];
};

/** Shorthand: set one CSS property on an element if it's non-null. */
export const st = (el: HTMLElement | null, k: string, v: string) => {
  if (el) (el.style as any)[k] = v;
};
