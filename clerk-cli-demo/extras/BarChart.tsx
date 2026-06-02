import React from 'react';
import { useCurrentFrame } from '@editframe/react';

/**
 * BarChart — animated bars that grow from 0 to their target value.
 *
 * Each bar animates in sequence with a configurable stagger. Includes
 * value labels that count up as the bar grows.
 *
 * @example
 * <BarChart
 *   bars={[
 *     { label: 'Before',  value: 42 },
 *     { label: 'After',   value: 87, highlight: true },
 *   ]}
 *   startFrame={30}
 *   endFrame={120}
 *   accent="#D97757"
 * />
 */

export interface BarData {
  label: string;
  value: number;
  /** If true, the bar uses the accent color instead of ink. */
  highlight?: boolean;
}

export interface BarChartProps {
  bars: BarData[];
  /** Frame at which the first bar starts growing. */
  startFrame: number;
  /** Frame at which the last bar is fully grown. */
  endFrame: number;
  /** Stagger between bars in frames (defaults to spaced evenly). */
  staggerFrames?: number;
  /** Stack vertically or horizontally? */
  orientation?: 'vertical' | 'horizontal';
  /** Container width in pixels. */
  width?: number;
  /** Container height in pixels. */
  height?: number;
  /** Bar color (non-highlighted). */
  ink?: string;
  /** Accent color (used for highlighted bars + labels). */
  accent?: string;
  /** Label color. */
  labelColor?: string;
  /** Optional unit suffix shown after values (e.g. '%'). */
  unit?: string;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function BarChart({
  bars,
  startFrame,
  endFrame,
  staggerFrames,
  orientation = 'horizontal',
  width = 480,
  height = 320,
  ink = '#141413',
  accent = '#D97757',
  labelColor = '#141413',
  unit = '',
}: BarChartProps) {
  const frame = useCurrentFrame();
  const totalFrames = endFrame - startFrame;
  const stagger = staggerFrames ?? Math.floor(totalFrames / (bars.length * 2));
  const growFrames = totalFrames - stagger * (bars.length - 1);

  const maxValue = Math.max(...bars.map((b) => b.value), 1);
  const isVertical = orientation === 'vertical';

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        display: 'flex',
        flexDirection: isVertical ? 'row' : 'column',
        alignItems: isVertical ? 'flex-end' : 'stretch',
        justifyContent: 'space-around',
        gap: 16,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        pointerEvents: 'none',
      }}
    >
      {bars.map((bar, i) => {
        const localStart = startFrame + i * stagger;
        const progress = clamp((frame - localStart) / growFrames, 0, 1);
        const grown = easeOut(progress);
        const ratio = (bar.value / maxValue) * grown;
        const displayValue = Math.round(bar.value * grown);
        const color = bar.highlight ? accent : ink;

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: isVertical ? 'column-reverse' : 'row',
              alignItems: 'center',
              gap: 12,
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: labelColor,
                minWidth: isVertical ? 'auto' : 72,
                textAlign: isVertical ? 'center' : 'right',
              }}
            >
              {bar.label}
            </div>
            <div
              style={{
                background: `${color}22`,
                flex: 1,
                height: isVertical ? '100%' : 28,
                width: isVertical ? 48 : '100%',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 4,
              }}
            >
              <div
                style={{
                  background: color,
                  height: isVertical ? `${ratio * 100}%` : '100%',
                  width: isVertical ? '100%' : `${ratio * 100}%`,
                  transition: 'none',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                }}
              />
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color,
                minWidth: 64,
                textAlign: 'left',
              }}
            >
              {displayValue}
              {unit}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BarChart;
