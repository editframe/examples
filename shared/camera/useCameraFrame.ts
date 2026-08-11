import { resolveFrame } from "./resolveFrame";
import type { CameraStop, Frame } from "./types";

/**
 * For components that derive a `Frame` from React state/props during render (e.g. a
 * `nowMs` held in `useState` and advanced elsewhere) instead of an imperative per-frame
 * callback — call this like any other hook, unconditionally at the top of the component.
 * Same `resolveFrame` core `<Camera>` uses, so there's still only one interpolation
 * implementation in the codebase, just a different caller.
 *
 * Named `use*` for symmetry with that render-time call shape, but it holds no internal
 * hook state (no `useState`/`useMemo`/etc.) — it's a thin, pure wrapper around
 * `resolveFrame`. That means it's safe to call unconditionally from a real hook context,
 * but scenes that already have their **own** imperative `onFrame` (the dominant pattern in
 * this codebase — see e.g. `vercel-knowledge-base-demo/src/scenes/HeroToOverview.tsx`)
 * should import and call `resolveFrame` directly from `./resolveFrame` inside that
 * callback instead: calling a `use`-prefixed function from a non-render callback trips
 * `eslint-plugin-react-hooks`'s rules-of-hooks check even when, as here, it's actually safe.
 *
 * @param stops the shot list (see `types.ts` / `shots.ts`)
 * @param nowMs the scene-local ms to evaluate at
 * @param measured a `DOMRect` for any stops whose `frame` is a measured-frame function;
 *   omit if every stop uses a static `Frame`
 */
export function useCameraFrame(stops: CameraStop[], nowMs: number, measured?: DOMRect): Frame {
  return resolveFrame(stops, nowMs, measured);
}
