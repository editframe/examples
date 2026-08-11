import { clamp, lerp, linear, easeInCubic, easeOutCubic, easeInOutCubic, outBack } from "@shared/utils/animation";
import type { CameraStop, Ease, Frame } from "./types";

const EASE_FN: Record<Ease, (t: number) => number> = {
  linear,
  inCubic: easeInCubic,
  outCubic: easeOutCubic,
  inOutCubic: easeInOutCubic,
  outBack: outBack(1.7),
};

const FRAME_NUMERIC_DEFAULTS = {
  x: 0,
  y: 0,
  z: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  scale: 1,
} as const;

type NumericKey = keyof typeof FRAME_NUMERIC_DEFAULTS;

function assertValidStops(stops: CameraStop[]): void {
  if (!stops || stops.length === 0) {
    throw new Error("resolveFrame: `stops` must be a non-empty array.");
  }
  for (let i = 1; i < stops.length; i++) {
    if (stops[i].at < stops[i - 1].at) {
      throw new Error(
        `resolveFrame: \`stops\` must be sorted ascending by \`at\` — stop ${i} (at=${stops[i].at}ms) ` +
          `comes before stop ${i - 1} (at=${stops[i - 1].at}ms).`
      );
    }
  }
}

function resolveStopFrame(stop: CameraStop, measured?: DOMRect): Frame {
  if (typeof stop.frame === "function") {
    if (!measured) {
      throw new Error(
        `resolveFrame: stop at ${stop.at}ms has a measured-frame function but no DOMRect was supplied ` +
          `(pass \`measure\`/\`measured\` to <Camera>/useCameraFrame, or use a static Frame for this stop).`
      );
    }
    return stop.frame(measured);
  }
  return stop.frame;
}

function lerpFrame(a: Frame, b: Frame, t: number): Frame {
  const at = (key: NumericKey) => a[key] ?? FRAME_NUMERIC_DEFAULTS[key];
  const bt = (key: NumericKey) => b[key] ?? FRAME_NUMERIC_DEFAULTS[key];
  return {
    x: lerp(at("x"), bt("x"), t),
    y: lerp(at("y"), bt("y"), t),
    z: lerp(at("z"), bt("z"), t),
    rotateX: lerp(at("rotateX"), bt("rotateX"), t),
    rotateY: lerp(at("rotateY"), bt("rotateY"), t),
    rotateZ: lerp(at("rotateZ"), bt("rotateZ"), t),
    scale: lerp(at("scale"), bt("scale"), t),
    origin: t < 1 ? a.origin : b.origin,
  };
}

/**
 * The one direction of truth for camera interpolation: given a sorted, non-empty list of
 * `stops` and a scene-local `ms`, returns the `Frame` the camera should be at. Every
 * mechanism in `Camera.tsx` (generated CSS `@keyframes` for static stops, an imperative
 * `onFrame` writer for dynamic ones) and `useCameraFrame.ts` calls this instead of
 * re-deriving `lerp`/`track` math per scene.
 *
 * Before `stops[0].at`, holds `stops[0]`'s frame; after the last stop's `at`, holds the
 * last frame — `ms` is always clamped into the shot list's own range, never extrapolated.
 *
 * `measured` is required only if some `stop.frame` is a `(measured: DOMRect) => Frame`
 * function (see `types.ts`) — throws a clear error in that case if omitted, rather than
 * silently rendering a default frame.
 *
 * Invariants are enforced, not just documented: throws if `stops` is empty or unsorted.
 */
export function resolveFrame(stops: CameraStop[], ms: number, measured?: DOMRect): Frame {
  assertValidStops(stops);

  const first = stops[0];
  if (ms <= first.at) return resolveStopFrame(first, measured);

  const last = stops[stops.length - 1];
  if (ms >= last.at) return resolveStopFrame(last, measured);

  for (let i = 1; i < stops.length; i++) {
    const prev = stops[i - 1];
    const next = stops[i];
    if (ms > next.at) continue;

    if (next.hold) return resolveStopFrame(next, measured);

    const span = next.at - prev.at;
    const t = span <= 0 ? 1 : EASE_FN[next.ease ?? "linear"](clamp((ms - prev.at) / span));
    return lerpFrame(resolveStopFrame(prev, measured), resolveStopFrame(next, measured), t);
  }

  /* istanbul ignore next -- unreachable: ms is within [first.at, last.at) and every
     segment is covered by the loop above. */
  return resolveStopFrame(last, measured);
}
