/**
 * ALLBIRDS — Tree Runner NZ · 9:16 social ad · master constants.
 * 1080x1920 @ 30fps. ONE fixed Timegroup clock. All times = MASTER milliseconds.
 * Brand world: light, natural, calm, weightless. Oat canvas, soft black, FLOAT motion.
 */
export const DURATION_MS = 25000;   // ~25s (inside the 20-30s limit)
export const FPS = 30;
export const W = 1080;
export const H = 1920;

// ── PALETTE (exact, sampled from allbirds.com) ──
export const OAT = "#ECE9E2";        // THE brand canvas / off-white base
export const SAND = "#E0DACF";       // warm taupe surface
export const COOL_OAT = "#E0E2DC";   // faint sage-grey tint
export const INK = "#212121";        // soft near-black (text) — never pure #000
export const CHARCOAL = "#242729";   // cool charcoal / product "void" backdrop
export const STONE = "#8C857A";      // muted warm grey (secondary text)
export const LINE = "#C9C3B8";       // hairline on oat
// muted nature accents — chalky/desaturated, NEVER saturated or neon
export const SAGE = "#9AA48B";
export const DUSTY_BLUE = "#8FA6AE";
export const DUSTY_MAUVE = "#B49A98";
export const TAUPE = "#B8A992";
export const AUBURN = "#A6603F";

// ── TYPE (real brand fonts embedded in styles.css) ──
export const GEOGRAPH = "'Geograph', system-ui, sans-serif";   // headlines + body (light/regular/medium)
export const MONO = "'Akkurat Mono', ui-monospace, monospace"; // spec/carbon-data labels
// Label voice: small UPPERCASE, weight 500, letter-spacing ~0.6px (the Allbirds eyebrow style).

export const PRICE = "$100";

// ── FIXED VIDEO WELLS (real videos composited AFTER render via FFmpeg) ──
export const WELL_A = { x: 160, y: 540, w: 760, h: 1000, r: 22 };  // PORTRAIT lifestyle (life-2, 606x1080)
export const WELL_A_IN = 6000;
export const WELL_A_OUT = 11000;
export const WELL_B = { x: 120, y: 760, w: 840, h: 560, r: 18 };   // LANDSCAPE lifestyle/material (life-1, 1920x1080)
export const WELL_B_IN = 14500;
export const WELL_B_OUT = 19000;

// ── BEATS (~25s, calm Allbirds pacing — each beat breathes) ──
export const HOOK_IN = 0;
export const HOOK_OUT = 2000;        // wordmark "allbirds" + "EFFORTLESS BY NATURE" float-in on oat
export const HERO_IN = 2000;
export const HERO_OUT = 6000;        // Tree Runner NZ floats in (weightless), "TREE RUNNER NZ" + $100
export const WELLA_IN = 6000;
export const WELLA_OUT = 11000;      // portrait lifestyle well + "WEAR ALL DAY COMFORT"
export const FEAT_IN = 11000;
export const FEAT_OUT = 14500;       // MATERIALS: merino wool · tree fiber · sugarcane + carbon label (mono)
export const WELLB_IN = 14500;
export const WELLB_OUT = 19000;      // 2nd well + "TREAD LIGHTER" / carbon-zero proof
export const RANGE_IN = 19000;
export const RANGE_OUT = 22500;      // THE RANGE — colorway grid + main preview (muted palette)
export const CTA_IN = 22500;         // wordmark + "SHOP NOW" + carbon-zero + allbirds.com, clean on oat
