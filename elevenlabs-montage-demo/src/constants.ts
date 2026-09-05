/**
 * ElevenLabs montage — 22s · 1920×1080.
 *
 * Uniform overlap is the G→H fade (12.9–13.06). Outgoing scenes keep that
 * tail so incoming scenes mount on the original music beat:
 *
 *   Opening  7310ms  0–7.31 (exclusive 0–7.15 + 160ms tail)
 *   Charts   5910ms  7.15–13.06 (exclusive 7.15–12.9 + 160ms G fade)
 *   Finale   9100ms  12.9–22.0
 *
 * Check: 7310 + 5910 + 9100 − 2×160 = 22000.
 */
export const TOTAL_MS = 22000;
export const OVERLAP_MS = 160;

export const OPENING_MS = 7150 + OVERLAP_MS;
export const CHARTS_MS = 5750 + OVERLAP_MS;
export const FINALE_MS = 9100;

/** Absolute seconds of each scene Timegroup's exclusive start — remap keyframe tables with `t = ABS + ownCurrentTimeMs/1000`. */
export const OPENING_ABS_START = 0;
export const CHARTS_ABS_START = 7.15;
export const FINALE_ABS_START = 12.9;
