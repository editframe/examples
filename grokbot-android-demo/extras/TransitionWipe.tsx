import React from 'react';
import { useCurrentFrame } from '@editframe/react';

/**
 * TransitionWipe — animated diagonal/cardinal wipe between two scenes.
 *
 * Renders an absolutely-positioned overlay that animates from off-screen
 * to fully-covering between `startFrame` and `endFrame`, holds, then
 * reverses out. Use it as a hard cover for a scene boundary, or as a
 * "swipe reveal" of the next scene below.
 *
 * @example
 * <TransitionWipe
 *   startFrame={90}
 *   endFrame={108}
 *   color="#141413"
 *   direction="diagonal"
 * />
 */

type Direction = 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top' | 'diagonal';

export interface TransitionWipeProps {
  /** Frame at which the wipe begins moving in. */
  startFrame: number;
  /** Frame at which the wipe is fully covering. */
  endFrame: number;
  /** Optional frame at which the wipe begins moving out (defaults to staying held). */
  exitStartFrame?: number;
  /** Optional frame at which the wipe is fully gone (must follow exitStartFrame). */
  exitEndFrame?: number;
  /** Fill color of the wipe layer. */
  color?: string;
  /** Direction of travel. */
  direction?: Direction;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

function progress(frame: number, start: number, end: number) {
  if (frame <= start) return 0;
  if (frame >= end) return 1;
  return easeInOut((frame - start) / (end - start));
}

export function TransitionWipe({
  startFrame,
  endFrame,
  exitStartFrame,
  exitEndFrame,
  color = '#141413',
  direction = 'diagonal',
}: TransitionWipeProps) {
  const frame = useCurrentFrame();

  // Cover progress (0 → 1).
  const enter = progress(frame, startFrame, endFrame);
  // Reveal progress (0 → 1) — only fires if exit frames provided.
  const exit =
    exitStartFrame !== undefined && exitEndFrame !== undefined
      ? progress(frame, exitStartFrame, exitEndFrame)
      : 0;

  // Effective coverage: 0 (gone) → 1 (full) → 0 (gone again).
  const coverage = clamp(enter - exit, 0, 1);

  // Translate the layer based on direction and coverage.
  const dist = lerp(110, 0, coverage); // 110vw/vh off-screen → 0 covering.
  const transform = {
    'left-to-right': `translateX(-${dist}%)`,
    'right-to-left': `translateX(${dist}%)`,
    'top-to-bottom': `translateY(-${dist}%)`,
    'bottom-to-top': `translateY(${dist}%)`,
    diagonal: `translate(${-dist * 0.6}%, ${-dist * 0.4}%) rotate(-8deg)`,
  }[direction];

  return (
    <div
      style={{
        position: 'absolute',
        inset: direction === 'diagonal' ? '-20%' : 0,
        background: color,
        transform,
        pointerEvents: 'none',
        zIndex: 100,
      }}
    />
  );
}

export default TransitionWipe;
