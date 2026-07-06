/**
 * FASHION NOVA — "The Edit" · 9:16 social ad · master constants.
 * 1080x1920 @ 30fps. Five scenes, each its own `<Timegroup mode="fixed">`, sequenced
 * with a shared `overlap` (see SCENES below) — no single master-ms clock.
 * Brand: stark black & white, MONOCHROME/SILVER accents only (no yellow/magenta).
 */
export const DURATION_MS = 25000; // sum(SCENES.*.duration) - 4*OVERLAP_MS
export const FPS = 30;
export const W = 1080;
export const H = 1920;

// ── PALETTE (stark, high-contrast, monochrome) ──
export const BLACK = "#000000"; // THE brand color — grounds, type
export const WHITE = "#FFFFFF"; // surfaces, card fills, primary type on dark
export const OFF_WHITE = "#F6F4F1"; // paper / magazine-page ground (TEX_PAPER)
export const INK = "#111111"; // near-black body text
export const GREY = "#8A8A8A"; // muted secondary text

// mono accent scale — replaces all yellow/magenta from the old kinetic-type draft
export const SILVER = "#C9CDD2";
export const SILVER_GRAD = "linear-gradient(180deg,#F2F4F6 0%,#C9CDD2 45%,#9AA0A6 100%)";

// ── TYPE (Montserrat = Proxima Nova substitute, embedded in styles.css; weights 400-900) ──
export const MONT = "'Montserrat', 'Proxima Nova', system-ui, sans-serif";

export const PRICE = "$39.99";

/**
 * ── SCENES ──
 * Each beat is its own `<Timegroup mode="fixed">`, sequenced by the root
 * `<Timegroup mode="sequence" overlap={OVERLAP_MS}>` in `Video.tsx`. There is no
 * master clock read anywhere — every scene animates against its OWN local time
 * (plain CSS keyframe delays / `--ef-transition-*`), which is what makes the
 * per-scene components declarative instead of one big `onFrame` switchboard.
 *
 * `OVERLAP_MS` of shared time exists at every scene boundary — during it, the
 * outgoing scene plays the tail of its own duration (`--ef-transition-out-start`)
 * while the incoming scene plays the head of its own. `duration` below already
 * accounts for that: every scene after the first is `nominal + OVERLAP_MS` so its
 * own "solo" screen time still matches the original cut. Net result: the 5
 * durations minus 4 overlaps sum to exactly `DURATION_MS`.
 */
export const OVERLAP_MS = 300;

export const SCENES = {
  cover: { duration: 4000, label: "see-through FASHION/NOVA wordmark, ink bleeds through, silver tag" },
  swingRack: { duration: 5300, label: "swing-tickets drop onto the rack, SHOP THE LOOK" },
  fanToEdit: { duration: 5800, label: "card-deck flies in → fans → deals into THE EDIT grid" },
  specStack: { duration: 5300, label: "full-frame dress-spec infographic, FINAL HOURS" },
  outro: { duration: 5800, label: "image-filled FASHION NOVA lockup + URL" },
} as const;

export type SceneName = keyof typeof SCENES;
