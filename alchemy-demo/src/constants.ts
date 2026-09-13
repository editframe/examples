/**
 * Alchemy — 20s · 1920×1080 · 30fps.
 *
 * Hard-cut sequence (overlap=0). Scene Timegroups keep the source
 * fractional-second durations so CSS keyframe percentages stay exact:
 *
 *   Tunnel       2.366666666s   0–2.37s
 *   Manuscript   3.466666667s   2.37–5.83s
 *   Philosopher  4.633333333s   5.83–10.47s
 *   Sand         4.033333333s   10.47–14.5s
 *   Ending       5.500000001s   14.5–20.0s
 *
 * Check: 2.366666666 + 3.466666667 + 4.633333333 + 4.033333333 + 5.500000001 = 20s.
 */
export const TOTAL_MS = 20000;
