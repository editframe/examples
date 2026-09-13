/**
 * Grok Bot — More Plans · 12.48s · 1920×1080 · 30fps.
 *
 * Three scenes sequenced as hard cuts (no crossfade in source):
 *
 *   Bounce   7300ms   0–7.30s     f1–220   shapes enter, tower build + sway
 *   Headline 3000ms   7.30–10.30s f220–310  headline text, shapes exit, ball alone
 *   Lockup   2180ms   10.30–12.48s f310–373 "Grok" + "Bot" slide in
 *
 * Check: 7300 + 3000 + 2180 = 12480.
 */
export const W = 1920;
export const H = 1080;
export const FPS = 30;
export const LAST = 373;
export const TOTAL_MS = 12480;

export const BOUNCE_MS = 7300;
export const HEADLINE_MS = 3000;
export const LOCKUP_MS = 2180;

/** Absolute ms offset per scene — used to remap local clock → absolute frame. */
export const BOUNCE_START_MS = 0;
export const HEADLINE_START_MS = 7300;
export const LOCKUP_START_MS = 10300;
