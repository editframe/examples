import { clamp, lerp } from "@shared/utils/animation";

export { lerp };

export type TgEl = HTMLElement & {
  initializer?: (inst: TgEl) => (() => void) | void;
  addFrameTask: (cb: (info: { ownCurrentTimeMs: number }) => void) => () => void;
};

export const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a), 0, 1);
export const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
export const easeIO = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

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

export type CircKF = Array<[number, number, number, number]>;
export const ckf = (tab: CircKF, t: number) => {
  if (t <= tab[0][0]) return tab[0];
  for (let i = 1; i < tab.length; i++)
    if (t <= tab[i][0]) {
      const p = (t - tab[i - 1][0]) / (tab[i][0] - tab[i - 1][0]);
      return [t, lerp(tab[i - 1][1], tab[i][1], p), lerp(tab[i - 1][2], tab[i][2], p), lerp(tab[i - 1][3], tab[i][3], p)];
    }
  return tab[tab.length - 1];
};

export const pathFrom = (pts: Array<[number, number]>, close?: { y: number }) => {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) d += ` L ${pts[i][0]} ${pts[i][1]}`;
  if (close) d += ` L ${pts[pts.length - 1][0]} ${close.y} L ${pts[0][0]} ${close.y} Z`;
  return d;
};
