/**
 * FASHION NOVA — 9:16 social ad · brand kit (tokens only — each CONCEPT designs its own
 * structure/beats; this file only locks palette, type, clock, and the asset roster).
 * 1080x1920 @ 30fps, ONE fixed Timegroup (25000ms). ms = ownCurrentTimeMs.
 */
export const DURATION_MS = 25000;
export const FPS = 30;
export const W = 1080;
export const H = 1920;

// ── PALETTE (stark, high-contrast, bold) ──
export const BLACK = "#000000";      // THE brand color
export const WHITE = "#FFFFFF";
export const OFF_WHITE = "#F6F4F1";
export const INK = "#111111";
export const GREY = "#8A8A8A";
export const LINE = "#E2DED7";
export const YELLOW = "#FFE600";     // loud %OFF / NEW slam accent
export const MAGENTA = "#FF1FA0";    // glam "Nova Babe" accent (use deliberately)

// ── TYPE (Montserrat = Proxima Nova substitute, embedded in styles.css; weights 400-900) ──
export const MONT = "'Montserrat', 'Proxima Nova', system-ui, sans-serif";

export const PRICE = "$39.99";
export const SALE = "UP TO 80% OFF";

// ── ASSET ROSTER (all in assets.ts, base64; ALL vetted classy + watermark-clean) ──
// LOOKS (real FN on-model, fully clothed):
//   DRESS_1 / DRESS_2 / DRESS_3 — black maxi dress (the hero piece), 3 angles
//   ED01  — purple long-sleeve bodycon (most-covered look)
//   ED07  — white tailored blazer (NOVA LUXE)
//   ED10  — cream cowl-neck/halter top (LUXE)
//   ED11  — white halter maxi gown (LUXE, floor-length)
//   ED15  — lifestyle / on-court look
//   ED14  — gold drop earrings (accessory cut-in for "shop the look" detail)
// EDITORIAL TEXTURES (abstract, no people/text — use as designed backgrounds / transition fills):
//   TEX_PAPER     — warm off-white pressed-paper grain (magazine page)
//   TEX_INK       — glossy black liquid ink on white (premium fluid transition)
//   TEX_COLLAGE   — torn cream/black/yellow paper collage (editorial zine bg)
//   TEX_LIGHTLEAK — warm butter-yellow→cream light-leak haze
