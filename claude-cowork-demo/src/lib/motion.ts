import { lerp } from "@shared/utils/animation";

export type TgEl = HTMLElement & {
  initializer?: (inst: TgEl) => (() => void) | void;
  addFrameTask: (cb: (info: { ownCurrentTimeMs: number }) => void) => () => void;
};

/** Linear interpolation across a [time, value] keyframe table. */
export function kf(t: number, table: [number, number][]): number {
  if (t <= table[0][0]) return table[0][1];
  for (let i = 1; i < table.length; i++) {
    if (t <= table[i][0]) {
      const [t0, v0] = table[i - 1];
      const [t1, v1] = table[i];
      return lerp(v0, v1, (t - t0) / (t1 - t0));
    }
  }
  return table[table.length - 1][1];
}
