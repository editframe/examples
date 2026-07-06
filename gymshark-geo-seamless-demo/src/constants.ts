/**
 * GYMSHARK — Geo Seamless · 9:16 social ad · master constants.
 * 1080x1920 @ 30fps. Seven scenes, each its own `<Timegroup mode="fixed">`, sequenced
 * with a shared `overlap` (see SCENES below) — no single master-ms clock.
 * Lean: GRITTY PERFORMANCE — raw industrial gym energy, dark high-contrast monochrome.
 */

export const W = 1080;
export const H = 1920;

// ── STRICT MONOCHROME PALETTE ──
export const NEAR_BLACK = "#0A0A0A";
export const BLACK = "#000000";
export const CHARCOAL_2 = "#262626";
export const GREY_MID = "#8A8A8A";
export const GREY_LINE = "#3A3A3A";
export const OFF_WHITE = "#F4F4F4";
export const WHITE = "#FFFFFF";

// ── 100% ACHROMATIC single accent — the cut is strict black/charcoal/grey/white, ZERO
// residual teal/cyan. The accent reads as one controlled focal/secondary pair in pure
// greyscale (never breaking the dark monochrome). Glow is a faint white bloom. ──
export const COOL_ACCENT = "#FFFFFF";        // focal accent → pure white
export const COOL_ACCENT_DIM = "#9A9A9A";    // secondary accent → mid-grey
export const COOL_ACCENT_GLOW = "rgba(255,255,255,0.30)";

// ── TYPE (Archivo Black / Archivo / Inter, loaded via Google Fonts in index.html) ──
export const DISPLAY = "'Archivo Black', 'Archivo', Inter, sans-serif"; // heavy grotesque headlines
export const HEAVY = "'Archivo', Inter, sans-serif";                    // eyebrows, labels, specs

// ── FIXED VIDEO WELLS (EXACT — composited after render, see add-audio.sh / wells.json).
// These rects are load-bearing for the ffmpeg finalize step and must stay in sync with
// wells.json — don't change them without updating that file too. ──
export const WELL_A = { x: 220, y: 540, w: 640, h: 1060, r: 24 };  // athlete training, 4.35–8.50s
export const WELL_B = { x: 160, y: 1020, w: 760, h: 600, r: 20 };  // fabric macro, 10.85–14.00s

/**
 * ── SCENES ──
 * Each beat is its own `<Timegroup mode="fixed">`, sequenced by the root
 * `<Timegroup mode="sequence" overlap={OVERLAP_MS}>` in `Video.tsx`. There is no master
 * clock read anywhere — every scene animates against its OWN local time (`--ef-progress` /
 * plain CSS keyframe delays / `animation-delay`), which is what makes the per-scene
 * components declarative instead of one big `onFrame` switchboard.
 *
 * `OVERLAP_MS` of shared time exists at every scene boundary — during it, the outgoing
 * scene just holds (it needs no exit of its own) while the incoming scene plays its own
 * bespoke "geo-camo mechanics" transition across its first `OVERLAP_MS` (an opaque shape
 * that erases the outgoing scene as it resolves — see each scene file's own comment).
 * `duration` below already accounts for the overlap: every scene after the first is
 * `nominal + OVERLAP_MS`, so its own "solo" screen time still matches the original cut.
 * Net result: the 7 durations minus 6 overlaps sum to exactly the original ~19s runtime
 * (1250+3550+4600+2800+3600+3350+2550 - 6*450 = 19000).
 */
export const OVERLAP_MS = 450;

export const SCENES = {
  hook: { duration: 1250, label: "calm geo-camo drift, real logo wipe-in, one kicker line" },
  hero: { duration: 3550, label: "Geo Seamless tee settles clean, GEO SEAMLESS / T-SHIRT + $36" },
  athlete: { duration: 4600, label: "athlete training well + BUILT FOR THE GRIND / LOCKED-IN FIT" },
  feature: { duration: 2800, label: "detail push + SEAMLESS KNIT · 4-WAY STRETCH · SWEAT-WICKING" },
  fabric: { duration: 3600, label: "fabric macro well + ENGINEERED, NOT SEWN + spec panel" },
  colorways: { duration: 3350, label: "8-swatch selector cycling the range + main preview" },
  cta: { duration: 2550, label: "real logo lockup → SHOP NOW → FROM $36 → GYMSHARK.COM" },
} as const;
