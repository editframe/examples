/**
 * ElevenLabs Vocals — 25s · 1920×1080 · 30fps.
 *
 * Five hard-cut scenes, no overlap:
 *
 *   Intro          3617ms   0–3.617s       (wordmark glyphs, sprite)
 *   Upload         1866ms   3.617–5.483s   (upload button, thumbs)
 *   Carousel       5167ms   5.483–10.65s   (product-UI carousel)
 *   Songs          1233ms   10.65–11.883s  (song rows, tree, transition)
 *   AuroraFinale  13117ms   11.883–25.0s   (modal, aurora, wipe, finale)
 *
 * Check: 3617 + 1866 + 5167 + 1233 + 13117 = 25000.
 */
export const TOTAL_MS = 25000;

export const INTRO_MS = 3617;
export const UPLOAD_MS = 1866;
export const CAROUSEL_MS = 5167;
export const SONGS_MS = 1233;
export const AURORA_FINALE_MS = 13117;

/** Absolute seconds of each scene's start — compute t = ABS_START + ownCurrentTimeMs / 1000, then F = t * 30 + 1. */
export const INTRO_ABS_START = 0;
export const UPLOAD_ABS_START = 3.617;
export const CAROUSEL_ABS_START = 5.483;
export const SONGS_ABS_START = 10.65;
export const AURORA_FINALE_ABS_START = 11.883;
