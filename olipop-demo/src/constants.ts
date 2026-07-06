/**
 * OLIPOP — short-form social ad (9:16). 1080×1920 @ 30fps, 20s total.
 * Seven scenes (see src/scenes/), each its own `<Timegroup mode="fixed">`, played by
 * one root `<Timegroup mode="sequence" overlap={OVERLAP_MS}>`. Every scene animates
 * against its own local clock via plain CSS `@keyframes` / `--ef-progress` /
 * `--ef-transition-out-start` — there is no master-ms clock, no `onFrame`, and no
 * imperative ref-driven style mutation anywhere in this composition.
 * Lean: HEALTH-FORWARD PUNCHY (sugar-swap / gut-health story).
 */

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

// Per-flavor color-blocking (rainbow montage)
export const FL_TROPICAL = "#E8503A";   // coral
export const FL_PINEAPPLE = "#F2B705";  // golden yellow
export const FL_GINGERALE = "#7FB23C";  // lime green
export const FL_CRISPAPPLE = "#C7402E"; // apple red
export const FL_SHIRLEY = "#D81E63";    // cherry pink
export const FL_VINTAGECOLA = "#6B4226";// warm brown

// ────────────────────────────────────────────────────────────────────────────
//  THE FIXED VIDEO WELL  (frame rect the composite-well.sh script targets)
//  non-negotiable — must match composite-well.sh's WX/WY/WW/WH
// ────────────────────────────────────────────────────────────────────────────
export const WELL_X = 180;
export const WELL_Y = 640;
export const WELL_W = 720;
export const WELL_H = 720;
export const WELL_R = 36;

/**
 * ── SCENES ──
 * Each beat is its own `<Timegroup mode="fixed">`, sequenced by the root
 * `<Timegroup mode="sequence" overlap={OVERLAP_MS}>` in `Video.tsx`. There is
 * no master clock read anywhere — every scene animates against its OWN local
 * time (`--ef-progress` / plain CSS keyframe delays), which is what makes the
 * per-scene components declarative instead of one big `onFrame` switchboard.
 *
 * `OVERLAP_MS` of shared time exists at every scene boundary — during it, the
 * outgoing scene is playing the tail of its own duration (see
 * `--ef-transition-out-start` in the `composition` skill's css-variables doc)
 * while the incoming scene plays the head of its own. `duration` below already
 * accounts for that: every scene after the first is `nominal + OVERLAP_MS` so
 * its own "solo" screen time still matches the original cut. Net result: the 7
 * durations minus 6 overlaps sum to exactly 20000ms (the total runtime).
 *
 * 850ms was chosen (rather than a shorter crossfade) because it's the exact
 * pre-roll the video-well beat needs: the retro badge frame used to start
 * settling into place 850ms before the "stationary" window began (4150ms vs
 * 5000ms in the original master clock) — using that same value as the
 * sequence-wide overlap lets that settle-in play entirely inside the shared
 * transition zone with the Can-hero beat, with no beat-specific overlap hack.
 */
export const OVERLAP_MS = 850;

export const SCENES = {
  hook: { duration: 2000, label: "wordmark mask-wipe + tagline bounce-settle on cream" },
  hero: { duration: 3850, label: "Tropical Punch can push-in on coral sunburst + rings, rising bubbles" },
  well: { duration: 4850, label: "retro-TV badge holds stationary around the fixed video well" },
  swap: { duration: 4050, label: "39g sugar struck through, OLIPOP 4g/9g-fiber card slams in" },
  rainbow: { duration: 4850, label: "six flavor cans montage, then collapse into a 3×2 grid" },
  offer: { duration: 2850, label: "12-pack push-in, build your variety pack" },
  cta: { duration: 2650, label: "drink olipop lockup + sparkle stars + drinkolipop.com" },
} as const;

export type SceneName = keyof typeof SCENES;
