import React, { useMemo } from 'react';
import { useCurrentFrame } from '@editframe/react';

/**
 * ParticleField — ambient drifting-particle background layer.
 *
 * Generates a deterministic, seeded particle layer that drifts slowly.
 * Use it under a scene to add visual density when the foreground is sparse.
 *
 * @example
 * <ParticleField count={40} color="#141413" opacity={0.18} />
 */

export interface ParticleFieldProps {
  /** How many particles. 20-60 is the sweet spot for 1080p. */
  count?: number;
  /** Particle color. */
  color?: string;
  /** Base opacity (each particle randomizes slightly around this). */
  opacity?: number;
  /** Drift speed multiplier. 1 = slow. */
  speed?: number;
  /** Min/max particle radius in pixels. */
  sizeRange?: [number, number];
  /** Seed for deterministic placement (same seed = same layout). */
  seed?: number;
}

// Mulberry32 PRNG — deterministic for given seed.
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function ParticleField({
  count = 40,
  color = '#141413',
  opacity = 0.18,
  speed = 1,
  sizeRange = [2, 5],
  seed = 1337,
}: ParticleFieldProps) {
  const frame = useCurrentFrame();

  const particles = useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: rand() * 100, // % across viewport
      y: rand() * 100, // % down viewport
      r: sizeRange[0] + rand() * (sizeRange[1] - sizeRange[0]),
      driftX: (rand() - 0.5) * 40, // px drift over a full cycle
      driftY: (rand() - 0.5) * 30,
      phase: rand() * Math.PI * 2,
      alpha: opacity * (0.5 + rand() * 0.8),
    }));
  }, [count, seed, sizeRange[0], sizeRange[1], opacity]);

  const t = frame / 60 / speed;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {particles.map((p) => {
        const dx = Math.sin(t + p.phase) * p.driftX;
        const dy = Math.cos(t * 0.8 + p.phase) * p.driftY;
        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.r * 2,
              height: p.r * 2,
              borderRadius: '50%',
              background: color,
              opacity: p.alpha,
              transform: `translate(${dx}px, ${dy}px)`,
            }}
          />
        );
      })}
    </div>
  );
}

export default ParticleField;
