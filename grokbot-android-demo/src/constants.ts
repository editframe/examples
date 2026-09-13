/**
 * Grok Bot — Android — 10s · 1920×1080 · 30fps.
 *
 * Hard-cut sequence (overlap=0):
 *   Phone         5.3s          0–5.3s
 *   Announcement  2.433333333s  5.3–7.733s
 *   Outro         2.266666667s  7.733–10s
 *
 * Check: 5.3 + 2.433333333 + 2.266666667 = 10.0.
 */
export const TOTAL_MS = 10000;

export const PHONE_DURATION = "5.3s";
export const ANNOUNCEMENT_DURATION = "2.433333333s";
export const OUTRO_DURATION = "2.266666667s";
