import React from 'react';
import { useCurrentFrame } from '@editframe/react';

/**
 * LowerThird — speaker name + title bar that slides in from the left.
 *
 * Typical use: attribute a quote, intro a person, label a UI element.
 *
 * @example
 * <LowerThird
 *   name="Anthropic"
 *   title="Building Claude"
 *   startFrame={60}
 *   endFrame={210}
 *   accent="#D97757"
 * />
 */

export interface LowerThirdProps {
  /** Primary name / label (larger text). */
  name: string;
  /** Secondary title / subtitle. */
  title?: string;
  /** Frame at which the bar slides in. */
  startFrame: number;
  /** Frame at which the bar is fully gone. */
  endFrame: number;
  /** Vertical position from bottom, in pixels. */
  bottom?: number;
  /** Horizontal offset from left, in pixels. */
  left?: number;
  /** Bar background color. */
  bg?: string;
  /** Bar foreground (text) color. */
  fg?: string;
  /** Accent color used for the leading sliver + title text. */
  accent?: string;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function LowerThird({
  name,
  title,
  startFrame,
  endFrame,
  bottom = 100,
  left = 80,
  bg = '#141413',
  fg = '#FFFFFF',
  accent = '#D97757',
}: LowerThirdProps) {
  const frame = useCurrentFrame();
  const slideInFrames = 14;
  const slideOutFrames = 12;
  const total = endFrame - startFrame;
  const local = frame - startFrame;

  if (local < 0 || local > total) return null;

  // Slide-in progress (0 → 1).
  let slide = 0;
  if (local <= slideInFrames) {
    slide = easeOutCubic(local / slideInFrames);
  } else if (local < total - slideOutFrames) {
    slide = 1;
  } else {
    slide = easeOutCubic((total - local) / slideOutFrames);
  }

  const translateX = lerp(-420, 0, clamp(slide, 0, 1));
  const opacity = clamp(slide, 0, 1);

  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        left,
        opacity,
        transform: `translateX(${translateX}px)`,
        display: 'flex',
        alignItems: 'stretch',
        pointerEvents: 'none',
        boxShadow: '0 6px 22px rgba(0,0,0,0.22)',
      }}
    >
      {/* Accent sliver */}
      <div style={{ width: 6, background: accent }} />
      {/* Body */}
      <div
        style={{
          background: bg,
          color: fg,
          padding: '14px 28px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          minWidth: 220,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.15 }}>{name}</div>
        {title && (
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: accent,
              letterSpacing: '0.04em',
              marginTop: 2,
            }}
          >
            {title}
          </div>
        )}
      </div>
    </div>
  );
}

export default LowerThird;
