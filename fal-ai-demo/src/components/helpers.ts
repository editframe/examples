// Most of this project's animation is now declarative CSS (see src/scenes/*.tsx and
// styles.css). These two helpers are the only ones still used, by Scene1's cursor
// addFrameTask — see Scene1.tsx's file header for why that one effect stays JS-driven.

export const clamp = (n: number, lo = 0, hi = 1) =>
  Math.max(lo, Math.min(hi, n));

// Quadratic bezier through three points — used for the cursor's arced hop path.
export const bez = (
  t: number,
  p0: [number, number],
  p1: [number, number],
  p2: [number, number]
): [number, number] => {
  const u = 1 - t;
  return [
    u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
    u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
  ];
};
