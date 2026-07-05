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
export const STONE = "#8C857A";      // muted warm grey (secondary text)
export const LINE = "#C9C3B8";       // hairline on oat
// muted nature accents — chalky/desaturated, NEVER saturated or neon
export const SAGE = "#9AA48B";
export const DUSTY_BLUE = "#8FA6AE";
export const TAUPE = "#B8A992";

// ── TYPE (real brand fonts embedded in styles.css) ──
export const GEOGRAPH = "'Geograph', system-ui, sans-serif";   // headlines + body (light/regular/medium)
export const MONO = "'Akkurat Mono', ui-monospace, monospace"; // spec/carbon-data labels
// Label voice: small UPPERCASE, weight 500, letter-spacing ~0.6px (the Allbirds eyebrow style).

export const PRICE = "$100";

// ── FIXED VIDEO WELLS (lifestyle/material footage frames) ──
export const WELL_A = { x: 160, y: 540, w: 760, h: 1000, r: 22 };  // PORTRAIT lifestyle (well-a-people-walk.mp4)
export const WELL_B = { x: 120, y: 760, w: 840, h: 560, r: 18 };   // LANDSCAPE material macro (well-b-material-macro.mp4)

/**
 * ── BEATS (~25s, calm Allbirds pacing — each beat breathes) ──
 * Nominal in/out boundaries for each beat, in master ms. This is the single
 * source of truth for the scene timeline (see README.md "Scene timeline").
 *
 * The per-element enter/exit windows inside `Video.tsx`'s `handleFrame` are
 * intentionally offset a few hundred ms from these boundaries so the incoming
 * beat's transition overlaps the outgoing one (no dead frame, no hard cut) —
 * they are not expected to match these numbers exactly.
 */
export const BEATS = {
  hook: { in: 0, out: 2000 },         // wordmark "allbirds" + "EFFORTLESS BY NATURE" float-in on oat
  hero: { in: 2000, out: 6000 },      // Tree Runner NZ floats in (weightless), "Tread lightly" + $100
  wellA: { in: 6000, out: 11000 },    // portrait lifestyle well + "Comfort, naturally"
  feat: { in: 11000, out: 14500 },    // MATERIALS: merino wool · tree fiber · sugarcane + carbon label (mono)
  wellB: { in: 14500, out: 19000 },   // 2nd well + "TREAD LIGHTER" / carbon-zero proof
  range: { in: 19000, out: 22500 },   // THE RANGE — colorway grid + main preview (muted palette)
  cta: { in: 22500, out: 25000 },     // wordmark + "SHOP NOW" + carbon-zero + allbirds.com, clean on oat
} as const;
