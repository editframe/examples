import type { Frame } from "./types";

/**
 * Shot-builder vocabulary: scene authors already think in film-operator terms ("push in",
 * "pan to", "hold", "focus on the button") — these helpers let the code say so, instead of
 * scattering magic-numbered `ZOOM_OUT_START`/`SCALE_CLOSE`-style constants through a scene
 * file. Every helper returns a plain `Frame` for use in a `CameraStop`.
 *
 * 3D-first by default: `dollyIn`/`dollyOut` move the camera in `z` (a real dolly, with
 * perspective foreshortening under `<Camera perspective>`) rather than a flat CSS `scale()`
 * — reach for `pushIn`/`pullOut` only for the rare case a flat zoom is genuinely wanted.
 * `tilt`/`orbit` add the subtle rotation that makes a move read as a *camera* repositioning
 * rather than a zoom effect applied to a flat scene.
 */

/** No movement — an explicit "the camera stays here" frame (for `CameraStop.hold`). */
export const holdAt = (frame: Frame): Frame => frame;

/** Pan/translate to `x`/`y` with no change in depth or rotation. */
export const panTo = (x: number, y: number, opts?: Partial<Omit<Frame, "x" | "y">>): Frame => ({
  x,
  y,
  z: 0,
  ...opts,
});

/**
 * Dolly the camera toward the scene by `z` px — the encouraged "zoom in" primitive.
 * Optionally add a subtle tilt (`rotateX`/`rotateY`) so the move reads as camera depth,
 * not a flat blow-up. Pass `x`/`y` to combine with a pan (e.g. dollying in on an
 * off-center subject).
 */
export const dollyIn = (
  z: number,
  opts?: { x?: number; y?: number; rotateX?: number; rotateY?: number; rotateZ?: number; origin?: string }
): Frame => ({ x: 0, y: 0, ...opts, z });

/** Dolly the camera away from the scene by `z` px (negative = pull back further than rest). */
export const dollyOut = (z: number, opts?: { x?: number; y?: number; origin?: string }): Frame => ({
  x: 0,
  y: 0,
  ...opts,
  z,
});

/** Add (or override) a subtle rotational tilt on an existing frame. */
export const tilt = (frame: Frame, rotateX: number, rotateY: number): Frame => ({
  ...frame,
  rotateX,
  rotateY,
});

/**
 * Flat zoom via CSS `scale()` — the escape hatch for when a true dolly isn't wanted.
 * Prefer `dollyIn`/`dollyOut` by default (see module doc).
 */
export const pushIn = (scale: number, opts?: Partial<Omit<Frame, "scale">>): Frame => ({
  x: 0,
  y: 0,
  z: 0,
  ...opts,
  scale,
});
export const pullOut = pushIn;

/**
 * Arc the camera around `center` at constant `radius`, at `angleDeg` around the circle
 * (0 = directly right of center, 90 = below) — for reveals that should feel like the
 * camera moving around a subject, not the subject itself spinning.
 */
export const orbit = (
  center: { x: number; y: number },
  radius: number,
  angleDeg: number,
  opts?: { z?: number }
): Frame => {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: center.x + radius * Math.cos(rad),
    y: center.y + radius * Math.sin(rad),
    z: opts?.z ?? 0,
    rotateY: angleDeg * 0.15, // subtle parallax-matching tilt as the camera swings around
  };
};

/**
 * Frame a focal point in the scene at a given dolly depth, centering `point` in the
 * `viewport`. Encodes the recenter/origin-% math previously hand-derived per scene
 * (`cursor-jira-demo`, `claude-office-demo`) exactly once: dollying toward a point that
 * isn't the scene's own center requires an `x`/`y` offset proportional to how far off-center
 * the point is and how much `z`-depth (i.e. effective magnification) is being applied.
 */
export const focusOn = (
  point: { x: number; y: number },
  z: number,
  viewport: { w: number; h: number },
  opts?: { rotateX?: number; rotateY?: number }
): Frame => {
  const magnification = 1 + z / 1000; // heuristic: matches <Camera>'s perspective-driven visual scale-up
  const offsetX = (viewport.w / 2 - point.x) * (magnification - 1);
  const offsetY = (viewport.h / 2 - point.y) * (magnification - 1);
  return { x: offsetX, y: offsetY, z, ...opts };
};
