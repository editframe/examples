/**
 * rhode — "summer '26" eCommerce product ad · master constants.
 * 1080x1920 @ 30fps, ~20s total. Seven sequenced beats, each its own
 * `<Timegroup mode="fixed">` (see src/scenes/), sequenced with a shared `overlap`
 * (see SCENES below) — no single master-ms clock — plus one cross-fade bridge
 * (`DewyBridge`) that sits outside the sequence. Brand world: warm-neutral,
 * glossy, editorial. Oat-cream ground, espresso type, dusty rose + cocoa accents.
 * No pure white, no pure black.
 */
export const W = 1080;
export const H = 1920;
export const LEFT_COL = 96;

// ── PALETTE (brand-accurate warm neutrals) ──
export const OAT = "#EDE6DA";
export const WARM_WHITE = "#F5F1EA";
export const CARD_CREAM = "#E9E1D3";
export const ESPRESSO = "#2A2320";
export const BROWN = "#5C4434";
export const DUSTY_ROSE = "#E8D4D0";
export const SOFT_PINK = "#E0C7C2";
export const COCOA = "#4A3528";
export const ESPRESSO_BG = "#33291F";
export const ESPRESSO_BG_LO = "#2A2320";

// ── TYPE ──
export const SANS = "Inter, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif";
export const SERIF = "'Source Serif 4', Georgia, 'Times New Roman', serif";

// ── VIDEO WELL 1 (Application beat) — exact, non-negotiable ──
// inner rect x=220, y=560, width=640, height=1040, corner radius 40. Flat cream
// #EDE6DA placeholder — real footage is composited in afterward, outside this
// composition (see README "Quick start" / add-audio.sh's sibling render step);
// the well rect itself never transforms once the frame is on screen.
export const WELL_X = 220;
export const WELL_Y = 560;
export const WELL_W = 640;
export const WELL_H = 1040;
export const WELL_R = 40;
export const FRAME_PAD = 22; // premium off-white frame padding OUTSIDE the well rect

// ── VIDEO WELL 2 (Result beat) — founder/model clip, exact spec ──
// inner rect x=120, y=1180, w=440, h=680, radius 32. Same flat-cream-placeholder
// convention as WELL 1.
export const W2_X = 120;
export const W2_Y = 1180;
export const W2_W = 440;
export const W2_H = 680;
export const W2_R = 32;
export const W2_PAD = 18; // off-white frame padding OUTSIDE well 2

export const GRAIN =
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

/**
 * ── SCENES ──
 * Each beat is its own `<Timegroup mode="fixed">`, sequenced by the root
 * `<Timegroup mode="sequence" overlap={OVERLAP_MS}>` in `Video.tsx`. There is no
 * master clock read anywhere — every scene animates against its OWN local time
 * (`--ef-progress` / plain CSS keyframe delays).
 *
 * `OVERLAP_MS` of shared time exists at every scene boundary — during it, the
 * outgoing scene is playing the tail of its own duration (see
 * `--ef-transition-out-start` in `references/css-variables.md`) while the
 * incoming scene plays the head of its own. `duration` below already accounts for
 * that: every scene after the first is `nominal + OVERLAP_MS` so its own "solo"
 * screen time still matches the original cut. Net result: the 7 sequenced
 * durations minus 6 overlaps sum to exactly 20000ms (the original total runtime).
 *
 * The original single `onFrame` cut also had an eighth beat, "Dewy Texture"
 * (~9.0–10.5s), that isn't in this list — it's a short cross-fade bridge that
 * visually overlaps BOTH the tail of Application and the head of Result at once
 * (by up to 1.2s), which a uniform per-pair `overlap` can't represent. It's kept
 * as `<DewyBridge>`, a sibling of the scene sequence (see `Video.tsx`), animating
 * on the whole composition's own local clock — see that component's doc comment.
 */
export const OVERLAP_MS = 200;

export const SCENES = {
  hook: { duration: 1950, label: "wordmark draw-in, limited edition / summer '26" },
  hero: { duration: 2600, label: "dusty-rose block wipe, Highlight Milk push-in, the dewy look, $28" },
  application: { duration: 5150, label: "video-in-frame well 1, how it's applied / the dewy look" },
  result: { duration: 3680, label: "skin macro Ken-Burns + well 2 + lip-swatch grid, glassy lit-from-within" },
  range: { duration: 2870, label: "kinetic montage — sip, macadamia, the summer kit + prices" },
  offer: { duration: 2200, label: "the summer kit, $100, limited edition" },
  cta: { duration: 2750, label: "stylized site-scroll resolving to shop rhode + rhodeskin.com" },
} as const;

export type SceneName = keyof typeof SCENES;
