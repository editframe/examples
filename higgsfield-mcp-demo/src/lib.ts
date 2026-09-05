/** Shared motion math + word-group cooling. GROUPS times are absolute seconds. */

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a), 0, 1);
export const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
export const easeIO = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export type KF = Array<[number, number]>;
export const kf = (tab: KF, t: number) => {
  if (t <= tab[0][0]) return tab[0][1];
  for (let i = 1; i < tab.length; i++)
    if (t <= tab[i][0]) {
      const [t0, v0] = tab[i - 1];
      const [t1, v1] = tab[i];
      return lerp(v0, v1, (t - t0) / (t1 - t0));
    }
  return tab[tab.length - 1][1];
};

const CORAL: [number, number, number] = [192, 107, 82];
export const hex2rgb = (h: string): [number, number, number] => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];
export const mix = (a: [number, number, number], b: [number, number, number], p: number) =>
  `rgb(${Math.round(lerp(a[0], b[0], p))},${Math.round(lerp(a[1], b[1], p))},${Math.round(
    lerp(a[2], b[2], p),
  )})`;

/* word groups: [t0, t1, coolFrom, finalHex] — coolFrom "" = plain reveal */
const GROUPS: Record<
  string,
  { t0: number; t1: number; cool: boolean; fc: string; from?: [number, number, number]; cd?: number }
> = {
  msg: { t0: 4.95, t1: 6.05, cool: true, fc: "#2b2b2b" },
  ais: { t0: 7.38, t1: 7.55, cool: false, fc: "#a1a1a1" },
  ait: { t0: 7.6, t1: 8.6, cool: false, fc: "#565656" },
  ast: { t0: 8.65, t1: 8.88, cool: false, fc: "#1f1f1f" },
  think: { t0: 15.8, t1: 16.7, cool: false, fc: "#9a9a9a" },
  body: { t0: 15.98, t1: 16.75, cool: false, fc: "#454545" },
  mp: { t0: 16.82, t1: 16.86, cool: false, fc: "#1f1f1f" },
  bq1: { t0: 16.82, t1: 17.05, cool: false, fc: "#3d3d3d" },
  bq2: { t0: 17.05, t1: 17.3, cool: false, fc: "#3d3d3d" },
  bq3: { t0: 17.3, t1: 17.66, cool: false, fc: "#3d3d3d" },
  bq4: { t0: 17.7, t1: 17.9, cool: false, fc: "#3d3d3d" },
  bq5: { t0: 17.92, t1: 18.1, cool: false, fc: "#3d3d3d" },
  bq6: { t0: 18.12, t1: 18.25, cool: false, fc: "#3d3d3d" },
  bq7: { t0: 18.27, t1: 18.42, cool: false, fc: "#3d3d3d" },
  cbs: { t0: 18.5, t1: 18.62, cool: false, fc: "#6f6f6f" },
  ind1: { t0: 18.65, t1: 18.95, cool: false, fc: "#4a4a4a" },
  ind2: { t0: 18.82, t1: 19.4, cool: false, fc: "#4a4a4a" },
  ind3: { t0: 19.45, t1: 19.75, cool: false, fc: "#4a4a4a" },
  ind4: { t0: 19.8, t1: 20.08, cool: false, fc: "#4a4a4a" },
  close: { t0: 20.1, t1: 21.4, cool: false, fc: "#4a4a4a" },
  gen: { t0: 26.55, t1: 26.8, cool: false, fc: "#4f4f4f" },
  /* whole line appears together (complete at 36.03s), then cools long */
  end: { t0: 36.0, t1: 36.05, cool: true, fc: "#333333", from: [168, 168, 168], cd: 1.35 },
};

export const dotsAt = (t: number, t0: number) =>
  ".".repeat(1 + (Math.max(0, Math.floor((t - t0) / 0.45)) % 3));

export type TgEl = HTMLElement & {
  initializer?: (inst: TgEl) => (() => void) | void;
  addFrameTask: (cb: (info: { ownCurrentTimeMs: number }) => void) => () => void;
};

export const collectGroups = (inst: HTMLElement) => {
  const spans = Array.from(inst.querySelectorAll(".w")) as HTMLElement[];
  const byG: Record<string, HTMLElement[]> = {};
  spans.forEach((el) => {
    const g = el.dataset.g!;
    (byG[g] = byG[g] || []).push(el);
  });
  Object.entries(byG).forEach(([g, els]) => {
    const grp = GROUPS[g];
    if (!grp) return;
    const chars = els.reduce((s, e) => s + (e.textContent?.length ?? 1), 0);
    let acc = 0;
    els.forEach((el) => {
      el.dataset.rt = String(grp.t0 + (acc / chars) * (grp.t1 - grp.t0));
      acc += el.textContent?.length ?? 1;
    });
  });
  const gFinal: Record<string, [number, number, number]> = {};
  Object.entries(GROUPS).forEach(([g, v]) => (gFinal[g] = hex2rgb(v.fc)));
  return { byG, gFinal };
};

export const updateWords = (
  t: number,
  byG: Record<string, HTMLElement[]>,
  gFinal: Record<string, [number, number, number]>,
) => {
  Object.entries(byG).forEach(([g, els]) => {
    const grp = GROUPS[g];
    if (!grp) return;
    if (t < grp.t0 - 0.05 && els[0].style.opacity === "0") return;
    els.forEach((el) => {
      const rt = Number(el.dataset.rt);
      if (t < rt) {
        el.style.opacity = "0";
      } else {
        el.style.opacity = "1";
        el.style.color = grp.cool
          ? mix(grp.from ?? CORAL, gFinal[g], easeOut(seg(t, rt, rt + (grp.cd ?? 0.55))))
          : GROUPS[g].fc;
      }
    });
  });
};
