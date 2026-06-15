/**
 * OLIPOP — short-form social ad (9:16). Master timing constants (0–20000ms).
 * Single 20000ms Timegroup clock. ownCurrentTimeMs == MASTER milliseconds.
 * Lean: HEALTH-FORWARD PUNCHY (sugar-swap / gut-health story).
 * Source: _olipop_run/BRIEF-OLIPOP.md.
 */

export const DURATION_MS = 20000;
export const FPS = 30;
export const CANVAS_W = 1080;
export const CANVAS_H = 1920;

// ────────────────────────────────────────────────────────────────────────────
//  BRAND PALETTE  (sampled from real OLIPOP cans + brand world)
// ────────────────────────────────────────────────────────────────────────────
export const SEAFOAM = "#BFE3E0";       // tropical can body / mint
export const SEAFOAM_LT = "#EAF5F6";    // pale seafoam wash
export const TEAL_INK = "#14433D";      // deep teal / forest ink (display ink)
export const TEAL_DEEP = "#0E332E";     // darker teal for depth
export const CREAM = "#F3ECDD";         // warm cream
export const CREAM_LT = "#FAF4E8";      // lighter warm cream
export const CORAL = "#E8503A";         // tropical punch coral / red
export const CORAL_DEEP = "#C73A28";    // deeper coral for shadow
export const SOFT_PINK = "#F2B6AA";     // soft pink accent
export const SUNSET_GOLD = "#F2B705";   // golden sunburst ray
export const SUNSET_AMBER = "#EE9B3A";  // amber ray

// Per-flavor color-blocking (rainbow montage)
export const FL_TROPICAL = "#E8503A";   // coral
export const FL_PINEAPPLE = "#F2B705";  // golden yellow
export const FL_GINGERALE = "#7FB23C";  // lime green
export const FL_CRISPAPPLE = "#C7402E"; // apple red
export const FL_SHIRLEY = "#D81E63";    // cherry pink
export const FL_VINTAGECOLA = "#6B4226";// warm brown

// ────────────────────────────────────────────────────────────────────────────
//  BEAT 1 — HOOK  (0–2000)
// ────────────────────────────────────────────────────────────────────────────
export const HOOK_IN = 0;
export const HOOK_BURST_IN = 60;        // sunburst scales up
export const HOOK_LOGO_IN = 360;        // OLIPOP wordmark mask-wipe
export const HOOK_TAG_IN = 760;         // "a new kind of soda" bounce-settle
export const HOOK_SUB_IN = 1120;        // supporting line
export const HOOK_OUT = 1820;           // color-block wipe out
export const HOOK_END = 2100;

// ────────────────────────────────────────────────────────────────────────────
//  BEAT 2 — CAN HERO  (2000–5000)
// ────────────────────────────────────────────────────────────────────────────
export const HERO_IN = 1980;
export const HERO_BURST_IN = 2040;      // coral sunburst rotates in
export const HERO_CAN_IN = 2180;        // can push-in begins
export const HERO_CAN_SETTLE = 2900;    // can settled, bob begins
export const HERO_FLAVOR_IN = 2760;     // "tropical punch" title
export const HERO_INGRED_IN = 3160;     // "prebiotics · botanicals · plant fiber"
export const HERO_RINGS_IN = 3400;      // concentric rings pulse
export const HERO_OUT = 4500;           // wipe to well — MUST finish before 5.0s
export const HERO_END = 4920;           // hero fully gone before well goes static at 5.0s

// ────────────────────────────────────────────────────────────────────────────
//  BEAT 3 — VIDEO WELL  (frame in 4.6–5.0, STATIONARY 5.0–9.0, out 9.0–9.5)
//  WELL RECT (exact, non-negotiable): x=180 y=640 w=720 h=720 r=36
// ────────────────────────────────────────────────────────────────────────────
export const WELL_FRAME_IN = 4150;      // retro frame settles behind hero
export const WELL_FRAME_IN_END = 4560;  // fully placed; hero seafoam-wipe then REVEALS it
export const WELL_STATIC_START = 5000;  // PERFECTLY STATIONARY from here
export const WELL_STATIC_END = 9000;    //   ...to here. NO move/scale in window.
export const WELL_FRAME_OUT = 9000;     // frame animates out
export const WELL_FRAME_OUT_END = 9500;
export const WELL_X = 180;
export const WELL_Y = 640;
export const WELL_W = 720;
export const WELL_H = 720;
export const WELL_R = 36;
export const WELL_COPY_IN = 5160;       // editorial copy around well
export const WELL_NOWPLAYING_IN = 5400;

// ────────────────────────────────────────────────────────────────────────────
//  BEAT 4 — THE SWAP (health story)  (9000–12200)
// ────────────────────────────────────────────────────────────────────────────
export const SWAP_IN = 9100;
export const SWAP_OLD_IN = 9300;        // "regular soda" + 39g sugar card
export const SWAP_STRIKE_IN = 9920;     // strike-through line draws across 39g
export const SWAP_VS_IN = 10260;        // big "vs" / arrow
export const SWAP_NEW_IN = 10460;       // OLIPOP 4g card slams in
export const SWAP_STAT1_IN = 10760;     // 4g sugar
export const SWAP_STAT2_IN = 10960;     // 9g fiber
export const SWAP_STAT3_IN = 11160;     // prebiotics / gut-healthy
export const SWAP_OUT = 11960;
export const SWAP_END = 12260;

// ────────────────────────────────────────────────────────────────────────────
//  BEAT 5 — FLAVOR RAINBOW  (12200–16200)
// ────────────────────────────────────────────────────────────────────────────
export const RAINBOW_IN = 12200;
export const RAINBOW_PER_CAN = 540;     // each flavor card holds ~540ms
// 6 flavors: 12320, 12860, 13400, 13940, 14480, 15020
export const RAINBOW_CAN0 = 12320;
export const RAINBOW_GRID_IN = 15080;   // all cans collapse into a fan/grid
export const RAINBOW_TITLE_IN = 15280;  // "find your flavor" / "13 flavors"
export const RAINBOW_OUT = 15960;
export const RAINBOW_END = 16260;

// ────────────────────────────────────────────────────────────────────────────
//  BEAT 6 — OFFER  (16200–18200)
// ────────────────────────────────────────────────────────────────────────────
export const OFFER_IN = 16200;
export const OFFER_BURST_IN = 16280;
export const OFFER_PACK_IN = 16420;     // 12-pack push-in
export const OFFER_TITLE_IN = 16720;    // "build your variety pack"
export const OFFER_BADGE_IN = 17020;    // 9g fiber / 12 pack badges
export const OFFER_OUT = 17960;
export const OFFER_END = 18260;

// ────────────────────────────────────────────────────────────────────────────
//  BEAT 7 — CTA  (18200–20000)
// ────────────────────────────────────────────────────────────────────────────
export const CTA_IN = 18200;
export const CTA_SCROLL_IN = 18200;     // (mock removed)
export const CTA_RESOLVE = 18260;       // outro burst/rings open the beat directly — no void
export const CTA_LOGO_IN = 18360;       // "drink olipop"
export const CTA_URL_IN = 18700;        // drinkolipop.com
export const CTA_HOLD = 19000;
