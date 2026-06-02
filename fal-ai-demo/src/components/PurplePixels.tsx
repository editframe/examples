/**
 * PurplePixels — scattered flickering purple squares.
 *
 * Fully deterministic: positions and timings are seeded by `seed` + pixel index.
 * Each pixel:
 *   - fades in at a position
 *   - holds for 200–600ms
 *   - fades out
 *   - jumps to a NEW pre-computed position
 *   - repeats
 *
 * NEVER uses Math.random() at render time — all randomness is pre-computed.
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";

interface PurplePixelsProps {
  seed?: number;
  count?: number;
  zIndex?: number;
  color?: string;
  /** If true, pixels avoid the center region (scatter to edges/corners) */
  edgesOnly?: boolean;
}

// Simple LCG PRNG — deterministic
function lcg(s: number) {
  let state = s;
  return () => {
    state = (1664525 * state + 1013904223) & 0xffffffff;
    return (state >>> 0) / 0xffffffff;
  };
}

interface PixelConfig {
  // Array of positions this pixel cycles through
  positions: Array<{ x: number; y: number }>;
  // Size in px
  size: number;
  // Cycle duration in ms
  cycleDuration: number;
  // Offset so pixels don't all sync
  offset: number;
  // Hold fraction (0–1) — fraction of cycle spent visible
  holdFraction: number;
}

function buildPixelConfigs(
  count: number,
  seed: number,
  edgesOnly: boolean
): PixelConfig[] {
  const rand = lcg(seed * 31337 + 7919);
  const configs: PixelConfig[] = [];

  for (let i = 0; i < count; i++) {
    const positions: Array<{ x: number; y: number }> = [];

    // Pre-compute 4 positions for each pixel
    for (let p = 0; p < 4; p++) {
      let x: number, y: number;
      if (edgesOnly) {
        // Scatter to edges: top 15%, bottom 15%, left 15%, right 15%
        const edge = Math.floor(rand() * 4);
        if (edge === 0) { // top
          x = rand() * 1920;
          y = rand() * 160;
        } else if (edge === 1) { // bottom
          x = rand() * 1920;
          y = 920 + rand() * 160;
        } else if (edge === 2) { // left
          x = rand() * 200;
          y = rand() * 1080;
        } else { // right
          x = 1720 + rand() * 200;
          y = rand() * 1080;
        }
      } else {
        // Scatter anywhere on screen
        x = rand() * 1900;
        y = rand() * 1060;
      }
      positions.push({ x: Math.round(x), y: Math.round(y) });
    }

    configs.push({
      positions,
      size: 6 + Math.floor(rand() * 7), // 6–12px
      cycleDuration: 600 + Math.floor(rand() * 800), // 600–1400ms per cycle
      offset: Math.floor(rand() * 2000), // stagger start by 0–2000ms
      holdFraction: 0.3 + rand() * 0.4, // 30–70% of cycle visible
    });
  }

  return configs;
}

export function PurplePixels({
  seed = 42,
  count = 40,
  zIndex = 1,
  color = '#AA77FE',
  edgesOnly = false,
}: PurplePixelsProps) {
  const configs = React.useMemo(
    () => buildPixelConfigs(count, seed, edgesOnly),
    [count, seed, edgesOnly]
  );

  // One ref per pixel div
  const pixelRefs = useRef<Array<HTMLDivElement | null>>([]);
  if (pixelRefs.current.length !== count) {
    pixelRefs.current = Array(count).fill(null);
  }

  const onFrame = useCallback(
    ({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
      for (let i = 0; i < count; i++) {
        const el = pixelRefs.current[i];
        if (!el) continue;
        const cfg = configs[i];

        // Time within this pixel's cycle (accounting for offset)
        const cycleMs = ((ms + cfg.offset) % cfg.cycleDuration + cfg.cycleDuration) % cfg.cycleDuration;
        const cycleFrac = cycleMs / cfg.cycleDuration;

        // fade-in: 0–15% of cycle
        // hold: 15%–(15%+holdFraction) of cycle
        // fade-out: next 15%
        // off: rest of cycle (position changes here)
        const fadeInEnd = 0.15;
        const holdEnd = fadeInEnd + cfg.holdFraction;
        const fadeOutEnd = holdEnd + 0.15;

        let opacity = 0;
        if (cycleFrac < fadeInEnd) {
          opacity = cycleFrac / fadeInEnd;
        } else if (cycleFrac < holdEnd) {
          opacity = 1;
        } else if (cycleFrac < fadeOutEnd) {
          opacity = 1 - (cycleFrac - holdEnd) / 0.15;
        } else {
          opacity = 0;
        }

        // Which position index are we on?
        // Position rotates once per full cycle (when opacity is 0 at end)
        // Use the cycle count to pick position
        const cycleCount = Math.floor((ms + cfg.offset) / cfg.cycleDuration);
        const posIdx = cycleCount % cfg.positions.length;
        const pos = cfg.positions[posIdx];

        el.style.opacity = String(Math.max(0, Math.min(1, opacity * 0.85)));
        el.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      }
    },
    [count, configs]
  );

  return (
    <Timegroup
      mode="fixed"
      duration="60s"
      onFrame={onFrame as any}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex,
      }}
    >
      {/* Container — pixels use translate() from (0,0) origin */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0 }}>
        {configs.map((cfg, i) => (
          <div
            key={i}
            ref={(el) => { pixelRefs.current[i] = el; }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: cfg.size,
              height: cfg.size,
              background: color,
              borderRadius: 1,
              opacity: 0,
              willChange: 'opacity, transform',
              pointerEvents: 'none',
            }}
          />
        ))}
      </div>
    </Timegroup>
  );
}
