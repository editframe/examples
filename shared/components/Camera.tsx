import React, { useCallback, useMemo, useRef } from "react";
import { Timegroup } from "@editframe/react";
import type { CameraStop, Ease, Frame } from "../camera/types";
import { hasDynamicStops, frameToTransform } from "../camera/types";
import { resolveFrame } from "../camera/resolveFrame";

export interface CameraProps {
  /** px; sets CSS `perspective` on the camera's parent stage. On by default, not opt-in. */
  perspective?: number;
  stops: CameraStop[];
  /**
   * ms the camera rig (and its children, in the `onFrame`/dynamic mechanism) stays
   * mounted for. Defaults to `stops[last].at - stops[0].at`, i.e. "the shot list spans the
   * whole time this content needs a camera" — pass an explicit value if the wrapped
   * content should keep showing (holding the last frame) past the last stop.
   */
  duration?: number;
  /**
   * Required if any stop's `frame` is a `(measured: DOMRect) => Frame` function — called
   * once per rendered frame to get the `DOMRect` those stops resolve against (e.g.
   * `() => targetRef.current!.getBoundingClientRect()`).
   */
  measure?: () => DOMRect | null | undefined;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const EASE_CSS: Record<Ease, string> = {
  linear: "linear",
  inCubic: "cubic-bezier(0.32,0,0.67,0)",
  outCubic: "cubic-bezier(0.33,1,0.68,1)",
  inOutCubic: "cubic-bezier(0.65,0,0.35,1)",
  outBack: "cubic-bezier(0.34,1.56,0.64,1)",
};

let cameraKeyframesCounter = 0;

/** Builds a one-off `@keyframes` rule (as a `<style>` text node) for a fully-static shot list. */
function buildStaticKeyframes(stops: Extract<CameraStop, { frame: Frame }>[]): { name: string; css: string } {
  const name = `camera-shot-${++cameraKeyframesCounter}`;
  const first = stops[0];
  const last = stops[stops.length - 1];
  const span = Math.max(1, last.at - first.at);

  const pct = (at: number) => `${(((at - first.at) / span) * 100).toFixed(4)}%`;

  const rules: string[] = [];
  rules.push(`0% { transform: ${frameToTransform(first.frame)}; ${first.frame.origin ? `transform-origin: ${first.frame.origin};` : ""} }`);

  for (let i = 1; i < stops.length; i++) {
    const stop = stops[i];
    const prevRuleIdx = rules.length - 1;
    // `ease`/`hold` on `stop` describe the segment ENDING at `stop`, but CSS's per-keyframe
    // `animation-timing-function` describes the segment STARTING at that keyframe — so it's
    // attached to the *previous* emitted rule.
    const timing = stop.hold ? "steps(1, jump-start)" : EASE_CSS[stop.ease ?? "linear"];
    rules[prevRuleIdx] = rules[prevRuleIdx].replace(
      /\}$/,
      `animation-timing-function: ${timing}; }`
    );
    rules.push(
      `${pct(stop.at)} { transform: ${frameToTransform(stop.frame)}; ${stop.frame.origin ? `transform-origin: ${stop.frame.origin};` : ""} }`
    );
  }

  return { name, css: `@keyframes ${name} {\n  ${rules.join("\n  ")}\n}` };
}

/**
 * The virtual camera. Wraps `children` in a `transform-style: preserve-3d` rig under a
 * `perspective`-bearing stage, and applies the `Frame` resolved from `stops` (via the one
 * `resolveFrame` evaluator — see `camera/resolveFrame.ts`) as
 * `translate3d(x,y,z) rotateX() rotateY() rotateZ() scale()`. A positive `z` moves the
 * camera "toward" the scene (a real dolly, with perspective foreshortening) rather than a
 * flat `scale()` with no depth relationship to the rest of the composition.
 *
 * Chooses its mechanism automatically, sharing the one evaluator either way:
 * - All stops static `Frame`s → generates a CSS `@keyframes` animation once at mount
 *   (matching `<Reveal>`'s declarative, no-per-frame-JS style).
 * - Any stop is a `(measured: DOMRect) => Frame` function → falls back to an internal
 *   `onFrame` writer that calls `resolveFrame` every rendered frame.
 */
export function Camera({ perspective = 1400, stops, duration, measure, className, style, children }: CameraProps) {
  const dynamic = hasDynamicStops(stops);
  const rigRef = useRef<HTMLElement>(null);

  // The stops' own span (last.at - first.at) — always the CSS keyframe animation's actual
  // duration in the static mechanism, since keyframe percentages are computed against it.
  const stopsSpan = Math.max(1, stops[stops.length - 1].at - stops[0].at);
  // How long the rig stays mounted (dynamic/`Timegroup` mechanism only). Can exceed
  // `stopsSpan` — see `duration` doc above — in which case the last frame just holds via
  // `resolveFrame`'s clamping, no keyframe stretching involved.
  const totalDuration = duration ?? stopsSpan;

  const onFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      if (!rigRef.current) return;
      const measured = measure ? measure() ?? undefined : undefined;
      const frame = resolveFrame(stops, ownCurrentTimeMs, measured);
      rigRef.current.style.transform = frameToTransform(frame);
      if (frame.origin) rigRef.current.style.transformOrigin = frame.origin;
    },
    // `stops`/`measure` are expected to be stable per mount (shot lists are authored, not
    // re-generated every render) — see useCameraFrame.ts for the runtime-driven case.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Computed unconditionally (Rules of Hooks) even though only the static branch below
  // uses it — guarded internally since `buildStaticKeyframes` assumes every stop's `frame`
  // is a plain object, which isn't true when `dynamic` is true.
  const { name, css } = useMemo(
    () => (dynamic ? { name: "", css: "" } : buildStaticKeyframes(stops as Extract<CameraStop, { frame: Frame }>[])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const stage: React.CSSProperties = { perspective, ...style };
  const rigStyle: React.CSSProperties = { transformStyle: "preserve-3d", width: "100%", height: "100%" };

  if (dynamic) {
    return (
      <div className={className} style={stage}>
        <Timegroup
          mode="fixed"
          duration={`${totalDuration}ms`}
          onFrame={onFrame as any}
          style={rigStyle}
          ref={rigRef}
        >
          {children}
        </Timegroup>
      </div>
    );
  }

  return (
    <div className={className} style={stage}>
      <style>{css}</style>
      <div
        style={{
          ...rigStyle,
          // Duration is the stops' own span, not `totalDuration` — `duration` only
          // controls how long a *mounted* rig holds (relevant to the dynamic mechanism); the
          // static mechanism's mount lifetime is controlled by whatever wraps `<Camera>`, and
          // `animation-fill-mode: both` already holds the final keyframe indefinitely.
          animation: `${name} ${stopsSpan}ms linear ${stops[0].at}ms both`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
