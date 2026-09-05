export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export const linear = (t: number) => t;
export const outCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const inCubic = (t: number) => t * t * t;
export const inOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const outQuint = (t: number) => 1 - Math.pow(1 - t, 5);
export const outQuart = (t: number) => 1 - Math.pow(1 - t, 4);
export const outBack = (t: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
export const inOutBack = (t: number) => { const c1 = 1.70158, c2 = c1 * 1.525; return t < 0.5 ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2 : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2; };

/** eased progress 0..1 of ms across [start,end] */
export function track(ms: number, start: number, end: number, ease: (t: number) => number = linear): number {
  if (ms <= start) return 0;
  if (ms >= end) return 1;
  return ease((ms - start) / (end - start));
}

/** piecewise-linear keyframes: keys = [[ms,value], ...] sorted by ms */
export function keys(ms: number, pts: [number, number][], ease: (t: number) => number = linear): number {
  if (ms <= pts[0][0]) return pts[0][1];
  const last = pts[pts.length - 1];
  if (ms >= last[0]) return last[1];
  for (let i = 0; i < pts.length - 1; i++) {
    const [t0, v0] = pts[i], [t1, v1] = pts[i + 1];
    if (ms >= t0 && ms <= t1) return lerp(v0, v1, ease((ms - t0) / (t1 - t0)));
  }
  return last[1];
}

/** Light-Guide flower WINDMILL rotation (deg) as a fn of GLOBAL scene-time (ms) across
 *  S02(morph)+S03(cards)+S04(editor). CONSTANT-velocity spin (LINEAR, ~52.5°/s) — the windmill
 *  turns at a STEADY rate the whole way through and NEVER decelerates or freezes; it is still
 *  visibly rotating at the very end of the editor scene. Head = spokes + petals rigid, so the
 *  white petals rotate in sync.
 *  Each scene calls this with its own offset (S02 0, S03 1917, S04 2500). */
export const SPIN_DUR = 5333;
export const SPIN_OFF = { s02: 0, s03: 1917, s04: 2500 };
export const flowerSpin = (g: number) => -280 * (1 - clamp(g / SPIN_DUR, 0, 1));

/** Seed-card LIME silhouette (card-% coords, viewBox 0..100) as a fn of two notch depths:
 *  tn (top) & bn (bottom), 0 = none, 1 = apex reaches the disc centre. The lime opens like a
 *  seed pod: disc(0,0) → bowtie/butterfly(1,1) → tulip(1,0). Centred on the resting flower
 *  (50,37.5), radius 25.3% of the card. */
export function limeMorphPath(tn: number, bn: number): string {
  const CX = 50, CY = 37.5, R = 25.3, n = 26;
  const aT = 0.46 * tn, aB = 0.46 * bn;
  const P: string[] = [];
  const push = (u: number, v: number) => P.push(`${(CX + u * R).toFixed(2)} ${(CY + v * R).toFixed(2)}`);
  for (let i = 0; i <= n; i++) { const th = aT + (Math.PI - aB - aT) * i / n; push(Math.sin(th), -Math.cos(th)); }
  push(0, 1 - bn);                       // bottom apex (bn=1 → centre)
  for (let i = 0; i <= n; i++) { const th = (Math.PI - aB) - ((Math.PI - aB) - aT) * i / n; push(-Math.sin(th), -Math.cos(th)); }
  push(0, -1 + tn);                      // top apex
  return "M" + P.join(" L") + "Z";
}
/** notch depths for morph progress m: top opens then holds; bottom opens (→bowtie) then closes (→tulip). */
export const limeNotch = (m: number): [number, number] => [
  Math.min(1, m / 0.4),
  m < 0.4 ? Math.min(1, m / 0.4) : Math.max(0, 1 - (m - 0.4) / 0.6),
];

function hx(h: string): [number, number, number] {
  h = h.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
/** linear-interpolate two hex colors -> rgb() string */
export function lerpHex(a: string, b: string, p: number): string {
  const pa = hx(a), pb = hx(b);
  return `rgb(${Math.round(lerp(pa[0], pb[0], p))},${Math.round(lerp(pa[1], pb[1], p))},${Math.round(lerp(pa[2], pb[2], p))})`;
}

export const PAL = {
  sage: "#DADCCF", lime: "#D8F08E", dgreen: "#0E6B3A", dgreenDeep: "#0B5A30",
  purple: "#4F0BD0", lavender: "#CEC0FE", blue: "#0A9AFB",
  grey: "#CCD1D4", orange: "#FE942E", black: "#000000", white: "#FFFFFF",
  titleOrange: "#FF5C2B",
};
