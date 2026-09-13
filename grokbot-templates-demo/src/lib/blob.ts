/** Blob CSS helpers: radial-gradient generation and per-frame background painting. */

const BGR = 3.0;

export const blobCss = (sx: number, sy: number, A: number, r: number, g: number, b: number): string => {
  const stops: string[] = [];
  for (let s = 0; s <= 10; s++) {
    const t = s / 10; const a = A * Math.exp(-0.5 * (t * BGR) * (t * BGR));
    stops.push(`rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${(s === 10 ? 0 : Math.max(0, a)).toFixed(4)}) ${(t * 100).toFixed(1)}%`);
  }
  return `radial-gradient(ellipse ${Math.round(sx * BGR)}px ${Math.round(sy * BGR)}px at 50% 50%, ${stops.join(", ")})`;
};

/** Paint a blob-keyframed wallpaper in-place via DOM style writes. */
export const paintBg = (
  g: (sel: string) => HTMLElement,
  st: (el: HTMLElement | null, k: string, v: string) => void,
  baseSel: string, blobPrefix: string, T: number[][], f: number,
  look: (rows: number[][], f: number) => number[] | null,
) => {
  if (!T.length) return;
  const fc = Math.max(T[0][0], Math.min(T[T.length - 1][0], f));
  const row = look(T, fc) || T[0];
  st(g(baseSel), "background", `rgb(${Math.round(row[1])},${Math.round(row[2])},${Math.round(row[3])})`);
  const nb = Math.floor((row.length - 4) / 9);
  for (let i = 0; i < nb; i++) {
    const [cx, cy, sx, sy, rot, A, r, gg, b] = row.slice(4 + i * 9, 13 + i * 9);
    const el = g(`${blobPrefix}${i}`); if (!el) continue;
    const W = Math.round(2 * sx * BGR), H = Math.round(2 * sy * BGR);
    st(el, "left", `${Math.round(cx - W / 2)}px`); st(el, "top", `${Math.round(cy - H / 2)}px`);
    st(el, "width", `${W}px`); st(el, "height", `${H}px`);
    st(el, "transform", `rotate(${rot.toFixed(4)}rad)`);
    st(el, "background", blobCss(sx, sy, A, r, gg, b));
  }
};
