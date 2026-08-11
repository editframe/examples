/**
 * The virtual-camera concept, enumerated once. Every existing "pan/zoom a scene" pattern
 * in this repo — CSS `@keyframes` rigs, `onFrame` state machines, origin-%-plus-recenter
 * math, focal-pixel framing — is really the same underlying idea: *at any moment, the
 * scene has one framing*. `Frame` names that framing explicitly; `CameraStop` names a
 * keyframe of it; `resolveFrame` (see `resolveFrame.ts`) is the one function that
 * evaluates a `Frame` at a given time, so every mechanism shares one interpolation
 * implementation instead of re-deriving it per scene.
 *
 * 3D from the start: `x`/`y`/`z` are a `translate3d`, not a 2D `translate` + `scale`. `z`
 * is the primary "zoom" axis (a real dolly move, with perspective foreshortening) —
 * `scale` is kept only as a cheap flat-zoom escape hatch (see `shots.ts`'s `dollyIn` vs.
 * the rarely-needed `pushIn`).
 */

export type Frame = {
  x: number;
  y: number;
  z: number;
  /** Degrees. Subtle tilt is what makes a push-in read as camera movement, not CSS zoom. */
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  /** Escape hatch only — prefer `z` for "zoom" (see shots.ts). Default 1 (no scale). */
  scale?: number;
  /** CSS `transform-origin`, e.g. `"50% 50%"` or a focal `"%"` pair. */
  origin?: string;
};

/** Named power-curve/spring easings — the numeric-function analogues of Reveal's CSS ones. */
export type Ease = "linear" | "inCubic" | "outCubic" | "inOutCubic" | "outBack";

/**
 * A keyframe of the camera's motion: at scene-local `at` ms, the camera should be at
 * `frame`. `frame` is either a plain `Frame` (known at author time) or a function of a
 * measured `DOMRect` (for stops that depend on runtime-measured content, e.g. `focusOn` a
 * just-measured element) — see `useCameraFrame.ts` / `Camera.tsx` for how each is applied.
 *
 * `ease` describes how the *previous* stop's frame eases into this one (ignored on the
 * first stop). `hold: true` makes this stop a plateau: the frame snaps to (and holds at)
 * this stop's own value for the entire segment from the previous stop's `at` through this
 * one, instead of easing in — use it for "arrive early, hold, then move again" shots
 * without having to hand-duplicate an identical `Frame` at two `at`s.
 */
export type CameraStop =
  | { at: number; frame: Frame; ease?: Ease; hold?: boolean }
  | { at: number; frame: (measured: DOMRect) => Frame; ease?: Ease; hold?: boolean };

/** True if any stop needs a runtime-measured `DOMRect` (forces the `onFrame` mechanism). */
export function hasDynamicStops(stops: CameraStop[]): boolean {
  return stops.some((s) => typeof s.frame === "function");
}

/**
 * Renders a `Frame` to a CSS `transform` value — the one place this mapping is written.
 * Used by `<Camera>` (both its CSS-keyframe and `onFrame` mechanisms) and by any scene
 * calling `useCameraFrame` directly from its own `onFrame`, so a `Frame` always paints the
 * same way regardless of caller.
 */
export function frameToTransform(frame: Frame): string {
  const { x, y, z, rotateX = 0, rotateY = 0, rotateZ = 0, scale = 1 } = frame;
  return (
    `translate3d(${x}px, ${y}px, ${z}px) ` +
    `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) ` +
    `scale(${scale})`
  );
}
