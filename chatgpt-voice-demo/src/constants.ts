/**
 * Scene arithmetic (hard-cut sequence, overlap 0):
 *   Intro     6430ms  (0–6.43s)   Logo + H1, 100ms overlap stays inside
 *   Headline2 2420ms  (6.43–8.85s)
 *   AppUI    13900ms  (8.85–22.75s) composer + sel + mic macros
 *   Close     3250ms  (22.75–26s)
 *   6430 + 2420 + 13900 + 3250 = 26000
 */
export const INTRO_MS = 6430;
export const HEADLINE2_MS = 2420;
export const APP_UI_MS = 13900;
export const CLOSE_MS = 3250;
export const TOTAL_MS = INTRO_MS + HEADLINE2_MS + APP_UI_MS + CLOSE_MS;

/** Absolute start in seconds — reconstruct the original master clock per scene. */
export const INTRO_ABS_START = 0;
export const HEADLINE2_ABS_START = 6.43;
export const APP_UI_ABS_START = 8.85;
export const CLOSE_ABS_START = 22.75;

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a), 0, 1);
export const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
export const easeIO = (p: number) =>
  p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** Re-center a typing line: revealed portion keeps the line's own center. */
export const recenter = (line: HTMLElement, spans: HTMLElement[]) => {
  let last: HTMLElement | null = null;
  for (const s of spans) if (s.style.opacity === "1") last = s;
  const fullW = line.offsetWidth;
  const revW = last ? last.offsetLeft + last.offsetWidth : 0;
  line.style.transform = `translateX(${(fullW - revW) / 2}px)`;
};

export type TgEl = HTMLElement & {
  initializer?: (inst: TgEl) => (() => void) | void;
  addFrameTask: (cb: (info: { ownCurrentTimeMs: number }) => void) => () => void;
};
