/**
 * Cursor Router — 21.95s · 1920×1080.
 *
 * Hard-cut sequence (no overlap). Total is the plain sum of scene durations:
 *
 *   Frontier   3833ms  0–3.833
 *   Optimize   2600ms  3.833–6.433
 *   Router     5934ms  6.433–12.367
 *   Cost       3000ms  12.367–15.367
 *   Type       1600ms  15.367–16.967
 *   Available  2266ms  16.967–19.233
 *   Logo       2717ms  19.233–21.95
 *
 * Check: 3833 + 2600 + 5934 + 3000 + 1600 + 2266 + 2717 = 21950.
 */
export const FRONTIER_MS = 3833;
export const OPTIMIZE_MS = 2600;
export const ROUTER_MS = 5934;
export const COST_MS = 3000;
export const TYPE_MS = 1600;
export const AVAILABLE_MS = 2266;
export const LOGO_MS = 2717;

export const TOTAL_MS =
  FRONTIER_MS + OPTIMIZE_MS + ROUTER_MS + COST_MS + TYPE_MS + AVAILABLE_MS + LOGO_MS;
