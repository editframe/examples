/**
 * Grok Bot — Templates · 16.567s · 1920×1080 · 30fps · silent.
 *
 * Scene durations correspond to exact frame-count spans at 30fps.
 * No overlap — every transition in the source is a hard cut.
 *
 *   Intro       3833ms   f 1–115   Settings slide / pan / press
 *   WordCard    2300ms   f 116–184 "Share your Bots as a template"
 *   Publish     3934ms   f 185–302 Draft publish + card morph + cloud
 *   CloseUp     1633ms   f 303–351 Card zoom, hover, press, whip out
 *   ChatWindow  2167ms   f 352–416 macOS chat window over wallpaper
 *   Lockup      2700ms   f 417–497 Black mark → "Grok Bot" lockup
 *
 * Check: 3833 + 2300 + 3934 + 1633 + 2167 + 2700 = 16567.
 */
export const TOTAL_MS = 16567;

export const INTRO_MS = 3833;
export const WORD_CARD_MS = 2300;
export const PUBLISH_MS = 3934;
export const CLOSE_UP_MS = 1633;
export const CHAT_WINDOW_MS = 2167;
export const LOCKUP_MS = 2700;

/** First global frame of each scene — use to remap local ms → global frame. */
export const INTRO_F0 = 1;
export const WORD_CARD_F0 = 116;
export const PUBLISH_F0 = 185;
export const CLOSE_UP_F0 = 303;
export const CHAT_WINDOW_F0 = 352;
export const LOCKUP_F0 = 417;
