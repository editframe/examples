/**
 * Cursor Side Chat demo — timing ledger.
 *
 * Sequence overlap is ONLY the Windows→Endcard fade (original 10.55–10.78).
 * Window A→B (5.63–6.07) stays inside Windows; a uniform A→B overlap would
 * invent a crossfade the original does not have.
 *
 * Windows stays mounted through the fade (0–10.78) so Endcard can overlay
 * Window B on the original music beat. Endcard mounts at 10.55.
 *
 *   Windows  10780ms  0–10.78 (exclusive 0–10.55 + 230ms fade tail)
 *   Endcard   6650ms  10.55–17.2
 *   10780 + 6650 - 230 = 17200
 */
export const TOTAL_MS = 17200;
export const OVERLAP_MS = 230;

export const WINDOWS_MS = 10780;
export const WINDOWS_ABS_START = 0;

export const ENDCARD_MS = 6650;
export const ENDCARD_ABS_START = 10.55;
