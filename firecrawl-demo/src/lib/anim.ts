import { HALF_KEYS, HALF_D } from "../half";

export type TgEl = HTMLElement & {
  initializer?: (inst: TgEl) => (() => void) | void;
  addFrameTask: (cb: (info: { ownCurrentTimeMs: number }) => void) => () => void;
};
export type Ease = (t: number) => number;
export type G = { sx: number; sy: number; cx: number; cy: number; tx: number; ty: number; kx0: number; ky0: number; dl?: number };

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInCubic = (t: number) => t * t * t;
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutBack = (t: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

export const wpn = (f: number, pts: number[][], ease?: Ease): number[] => {
  if (f <= pts[0][0]) return pts[0].slice(1);
  for (let i = 1; i < pts.length; i++) {
    if (f <= pts[i][0]) {
      const t0 = seg(f, pts[i - 1][0], pts[i][0]);
      const t = ease ? ease(t0) : t0;
      return pts[i].slice(1).map((v, k) => lerp(pts[i - 1][k + 1], v, t));
    }
  }
  return pts[pts.length - 1].slice(1);
};
export const wp = (f: number, pts: number[][], ease?: Ease) => wpn(f, pts, ease)[0];
export const inR = (f: number, a: number, b: number) => f >= a && f <= b;
export const pop = (f: number, at: number, len = 3) => easeOutBack(seg(f, at, at + len));

export const gry = (v: number) => { const q = Math.round(v); return `rgb(${q},${q},${q})`; };
export const toneCol = (t: number, k: number) => { const v = Math.round(255 - (255 - [204, 138, 55][t]) * k); return `rgb(${v},${v},${v})`; };

/* grid coordinate helpers */
export const gridX = (G: G, k: number) => {
  if (G.dl !== undefined) { const m = k - 5.5, n = Math.abs(m) - 0.5, n5 = Math.min(n, 5), ex = Math.max(0, n - 5); return G.cx + Math.sign(m) * (77 + 154 * n + (G.dl * n5 * (n5 + 1)) / 2 + G.dl * ex * 4.81 + (G.dl * 0.365 * ex * (ex - 1)) / 2); }
  return G.cx + (G.kx0 + 154 * k + G.tx - G.cx) * G.sx;
};
export const gridY = (G: G, j: number) => {
  if (G.dl !== undefined) { const m = j - 2.5, n = Math.abs(m) - 0.5; return G.cy + Math.sign(m) * (78 + 156 * n + (G.dl * n * (n + 1)) / 2); }
  return G.cy + (G.ky0 + 156 * j + G.ty - G.cy) * G.sy;
};

/* bilinear sample of a cell-density grid at cell coordinates (0 outside) */
export const sampleD = (D: number[][], u: number, v: number) => {
  const rows = D.length, cols = rows ? D[0].length : 0; if (!rows || !cols) return 0;
  const x = u - 0.5, y = v - 0.5; if (x < -1 || y < -1 || x > cols || y > rows) return 0;
  const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
  const at = (r: number, c: number) => (r < 0 || c < 0 || r >= rows || c >= cols ? 0 : D[r][c]);
  return (at(y0, x0) * (1 - fx) + at(y0, x0 + 1) * fx) * (1 - fy) + (at(y0 + 1, x0) * (1 - fx) + at(y0 + 1, x0 + 1) * fx) * fy;
};

/* write per-cell opacities of a GlyphGrid from a density map */
export const setGridDirect = (el: HTMLElement | null, cols: number, D: number[][] | null, scale: number, sub = 1) => {
  if (!el) return; const kids = el.children;
  for (let i = 0; i < kids.length; i++) {
    const r = Math.floor(i / cols), c = Math.floor((i % cols) / sub); const o = D ? Math.min(1, (D[r]?.[c] ?? 0) / scale) : 0;
    (kids[i] as HTMLElement).style.opacity = String(o < 0.02 ? 0 : Math.round(o * 100) / 100);
  }
};

export const setGridOps = (el: HTMLElement | null, cols: number, dx: number, dy: number, ox: number, oy: number, cell: number, D: number[][] | null, scale: number, t0 = 0) => {
  if (!el) return; const kids = el.children;
  for (let i = 0; i < kids.length; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    const o = D ? Math.min(1, Math.max(0, sampleD(D, (c * dx + dx / 2 - ox) / cell, (r * dy + dy / 2 - oy) / cell) - t0) / scale) : 0;
    (kids[i] as HTMLElement).style.opacity = String(o < 0.02 ? 0 : Math.round(o * 100) / 100);
  }
};

export const halfMap = (f: number): number[][] | null => {
  if (f < HALF_KEYS[0]) return null;
  let i = 0; while (i < HALF_KEYS.length - 1 && HALF_KEYS[i + 1] <= f) i++;
  const a = HALF_D[HALF_KEYS[i]]; if (i === HALF_KEYS.length - 1) return a;
  const b = HALF_D[HALF_KEYS[i + 1]], u = (f - HALF_KEYS[i]) / (HALF_KEYS[i + 1] - HALF_KEYS[i]);
  return a.map((row, r) => row.map((v, c) => v + (b[r][c] - v) * u));
};
