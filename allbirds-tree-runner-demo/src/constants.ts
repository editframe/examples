/**
 * ALLBIRDS — Tree Runner NZ · 9:16 social ad · master constants.
 * 1080x1920 @ 30fps. Seven scenes, each its own `<Timegroup mode="fixed">`, sequenced
 * with a shared `overlap` (see SCENES below) — no single master-ms clock.
 * Brand world: light, natural, calm, weightless. Oat canvas, soft black, FLOAT motion.
 */
export const DURATION_MS = 25000;   // ~25s (inside the 20-30s limit) — sum(SCENES.*.duration) - 6*OVERLAP_MS
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
 * ── SCENES ──
 * Each beat is its own `<Timegroup mode="fixed">`, sequenced by the root
 * `<Timegroup mode="sequence" overlap={OVERLAP_MS}>` in `Video.tsx`. There is
 * no master clock read anywhere — every scene animates against its OWN local
 * time (`--ef-progress` / plain CSS keyframe delays), which is what makes the
 * per-scene components declarative instead of one big `onFrame` switchboard.
 *
 * `OVERLAP_MS` of shared time exists at every scene boundary — during it, the
 * outgoing scene is playing the tail of its own duration (see
 * `--ef-transition-out-start` in `references/css-variables.md`) while the
 * incoming scene plays the head of its own. `duration` below already accounts
 * for that: every scene after the first is `nominal + OVERLAP_MS` so its own
 * "solo" screen time still matches the original cut. Net result: the 7
 * durations minus 6 overlaps sum to exactly `DURATION_MS`.
 */
export const OVERLAP_MS = 600;

export const SCENES = {
  hook: { duration: 2000, label: "wordmark + EFFORTLESS BY NATURE float-in on oat" },
  hero: { duration: 4600, label: "Tree Runner NZ floats in (weightless), Tread lightly + $100" },
  wellA: { duration: 5600, label: "portrait lifestyle well + Comfort, naturally" },
  feat: { duration: 4100, label: "MERINO · TREE FIBER · SUGARCANE + carbon label (mono)" },
  wellB: { duration: 5100, label: "landscape well + TREAD LIGHTER" },
  range: { duration: 4100, label: "the family across the muted palette + main preview" },
  cta: { duration: 3100, label: "wordmark + SHOP NOW + B Corp + allbirds.com on oat" },
} as const;

export type SceneName = keyof typeof SCENES;
