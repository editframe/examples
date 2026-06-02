import React from 'react';
import { useCurrentFrame } from '@editframe/react';

/**
 * CaptionStrip — broadcast-style lower-third caption with optional kicker
 * (small uppercase label above the main text) and typewriter reveal.
 *
 * Fades in, types the main text character-by-character, holds, then fades out.
 *
 * @example
 * <CaptionStrip
 *   kicker="PLAN MODE"
 *   text="Claude shows its plan before acting."
 *   startFrame={30}
 *   endFrame={180}
 * />
 */

export interface CaptionStripProps {
  /** Main caption text. */
  text: string;
  /** Small uppercase kicker above the main text. */
  kicker?: string;
  /** Frame at which the caption fades in. */
  startFrame: number;
  /** Frame at which the caption is fully gone. */
  endFrame: number;
  /** Vertical position from bottom, in pixels. */
  bottom?: number;
  /** Background color. */
  bg?: string;
  /** Foreground (text) color. */
  fg?: string;
  /** Accent color for the kicker + left bar. */
  accent?: string;
  /** Characters per second for the typewriter effect. */
  charsPerSecond?: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function CaptionStrip({
  text,
  kicker,
  startFrame,
  endFrame,
  bottom = 80,
  bg = '#141413',
  fg = '#FFFFFF',
  accent = '#D97757',
  charsPerSecond = 30,
}: CaptionStripProps) {
  const frame = useCurrentFrame();
  const fps = 30;

  const typeDuration = (text.length / charsPerSecond) * fps;
  const fadeIn = 8;
  const fadeOut = 12;

  // Opacity ramp: fade in for `fadeIn`, hold, fade out at end.
  const localFrame = frame - startFrame;
  const totalFrames = endFrame - startFrame;
  let opacity = 0;
  if (localFrame >= 0 && localFrame <= fadeIn) {
    opacity = localFrame / fadeIn;
  } else if (localFrame > fadeIn && localFrame < totalFrames - fadeOut) {
    opacity = 1;
  } else if (localFrame >= totalFrames - fadeOut && localFrame <= totalFrames) {
    opacity = (totalFrames - localFrame) / fadeOut;
  }
  opacity = clamp(opacity, 0, 1);

  // Typewriter: reveal chars proportional to time past fadeIn.
  const charsRevealed = clamp(
    Math.floor(((localFrame - fadeIn) / typeDuration) * text.length),
    0,
    text.length,
  );
  const visibleText = text.slice(0, charsRevealed);

  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        left: '50%',
        transform: `translateX(-50%) translateY(${(1 - opacity) * 12}px)`,
        opacity,
        background: bg,
        color: fg,
        padding: '14px 28px 16px 24px',
        borderLeft: `4px solid ${accent}`,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        pointerEvents: 'none',
      }}
    >
      {kicker && (
        <div
          style={{
            fontSize: 12,
            letterSpacing: '0.12em',
            color: accent,
            fontWeight: 600,
            marginBottom: 4,
            textTransform: 'uppercase',
          }}
        >
          {kicker}
        </div>
      )}
      <div style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.25, minWidth: 280 }}>
        {visibleText}
        {charsRevealed < text.length && (
          <span style={{ opacity: frame % 30 < 15 ? 1 : 0 }}>▍</span>
        )}
      </div>
    </div>
  );
}

export default CaptionStrip;
