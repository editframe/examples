export type StyleMap = Partial<CSSStyleDeclaration>;

export const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

export const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const track = (
  ms: number,
  startMs: number,
  endMs: number,
  ease: (t: number) => number = easeOutCubic,
) => ease(clamp((ms - startMs) / (endMs - startMs)));

export const typewriter = (ms: number, startMs: number, durationMs: number, text: string) => {
  const chars = Math.floor(track(ms, startMs, startMs + durationMs, (t) => t) * text.length);
  return text.slice(0, chars);
};

export const setStyles = (root: HTMLElement, selector: string, styles: StyleMap) => {
  const element = root.querySelector<HTMLElement>(selector);
  if (!element) return;
  Object.entries(styles).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      element.style[key as any] = String(value);
    }
  });
};

export const setText = (root: HTMLElement, selector: string, value: string) => {
  const element = root.querySelector<HTMLElement>(selector);
  if (element && element.textContent !== value) {
    element.textContent = value;
  }
};

export const setSignalProgress = (
  root: HTMLElement,
  selector: string,
  progress: number,
  opacity = progress,
) => {
  const path = root.querySelector<SVGPathElement>(selector);
  if (!path) return;
  path.style.strokeDashoffset = `${1 - clamp(progress)}`;
  path.style.opacity = `${clamp(opacity)}`;
};
