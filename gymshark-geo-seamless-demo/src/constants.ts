/**
 * GYMSHARK — Geo Seamless · 9:16 social ad · master timing constants.
 * 1080x1920 @ 30fps. ONE fixed Timegroup clock. All times = MASTER milliseconds.
 * Lean: GRITTY PERFORMANCE — raw industrial gym energy, dark high-contrast monochrome.
 */

export const DURATION_MS = 19000;
export const FPS = 30;

export const W = 1080;
export const H = 1920;

// ── STRICT MONOCHROME PALETTE ──
export const NEAR_BLACK = "#0A0A0A";
export const BLACK = "#000000";
export const CHARCOAL = "#1A1A1A";
export const CHARCOAL_2 = "#262626";
export const GREY_MID = "#8A8A8A";
export const GREY_LINE = "#3A3A3A";
export const OFF_WHITE = "#F4F4F4";
export const WHITE = "#FFFFFF";

// ── 100% ACHROMATIC (panel 2) — the cut is now STRICT black/charcoal/grey/white, ZERO
// residual teal/cyan. The former "cool steel" accent is neutralized to a bright off-white
// (focal marks) + mid-grey (secondary), so the // marks, REC/LIVE ticks, scope reticle and
// SEAM-COUNT proof still read as the single controlled accent — but in pure greyscale, not
// breaking the dark monochrome. Glow is a faint white bloom. ──
export const COOL_ACCENT = "#FFFFFF";        // focal accent → pure white (was teal)
export const COOL_ACCENT_DIM = "#9A9A9A";    // secondary accent → mid-grey
export const COOL_ACCENT_GLOW = "rgba(255,255,255,0.30)";

// ── FIXED VIDEO WELLS (EXACT — composited after render) ──
export const WELL_A = { x: 220, y: 540, w: 640, h: 1060, r: 24 };  // athlete training
export const WELL_A_IN = 4500;
export const WELL_A_OUT = 8500;

// FIX A — pushed UP from y:1160 (subject was clipped at the bottom frame edge, head
// haloing into the spec text). Now y:1080, h:600 → bottom 1680 = 240px bottom margin
// (>=120 required) and clears the spec panel above. WELL_B is the composite target; this
// exact rect is mirrored in wells.json at the fork root.
export const WELL_B = { x: 160, y: 1020, w: 760, h: 600, r: 20 };  // fabric macro (nudged up ~60px + bolder explicit frame per client)
export const WELL_B_IN = 11000;
export const WELL_B_OUT = 14000;

// ════════════════════════════════════════════════════════════════
// BEAT 1 — HOOK (0–1250): MINIMALIST (FIX 1). Calm geo-camo drift on near-black, ONE
// confident move: the REAL gymshark logo (white wordmark+fin lockup, FIX 2) lands clean
// via a single sharp left→right wipe reveal. No rapid cuts, no shine/flash, no busy
// streaks. Premium, restrained, still a strong scroll-stopper. HARD CUT to hero at 1250.
// ════════════════════════════════════════════════════════════════
export const HOOK_IN = 0;
export const LOGO_WIPE_START = 120;      // real logo wipes in (single confident move)
export const LOGO_WIPE_END = 760;        // logo fully revealed, settles
export const HOOK_LINE_IN = 560;         // single quiet kicker line resolves under the logo
export const HOOK_OUT = 1250;            // overlay clears — product owns the frame after
// (legacy names kept so any stray reference compiles)
export const FIN_DRAW_START = 120;
export const FIN_DRAW_END = 300;
export const WORDMARK_SLAM = 200;

// ════════════════════════════════════════════════════════════════
// BEAT 2 — PRODUCT HERO (0–4350): reveals from frame 0 under camo mask, model push-in,
// "GEO SEAMLESS T-SHIRT", "$36". Snaps to full clarity by ~1.5s (fast ease-out).
// ════════════════════════════════════════════════════════════════
export const HERO_IN = 0;                // hero present from frame 0 (under the hook overlay)
export const HERO_REVEAL_END = 520;      // geo-camo mask clears FAST → body-in-shirt by ~0.2-0.5s (panel 14)
// FRONT-LOADED CADENCE (panel 14): title/sub/$36 snap in tight succession right off the hook
// clear (250-300ms apart) so the product/$36 beat lands by ~1.8s — punchy first 4s — then the
// scene HOLDS and breathes to 4350 before the engineering beats.
export const HERO_TITLE_IN = 1340;       // GEO SEAMLESS label slam (on the heels of the hook clear)
export const HERO_SUB_IN = 1580;         // T-SHIRT
export const HERO_PRICE_IN = 1860;       // $36 tag — hard snap into the price (lands by ~1.9s)
export const HERO_OUT = 4350;            // wipe to WELL_A (UNCHANGED — keeps WELL_A @ 4500 in sync)

// ════════════════════════════════════════════════════════════════
// BEAT 3 — ATHLETE WELL_A (4500–8500): training footage frame + performance copy
// ════════════════════════════════════════════════════════════════
// WELL_A is STATIONARY 4500–8500. Frame draws in just before, holds, releases after.
export const WELLA_FRAME_IN = 4350;      // frame draws in (before footage window)
export const WELLA_COPY1_IN = 4380;      // "BUILT FOR THE GRIND" lands ON the cut — well never naked (panel 12)
export const WELLA_STAT_IN = 4900;       // left-gutter brand band fills early (ambient framing)
export const WELLA_COPY2_IN = 6400;      // "ENGINEERED TO MOVE" (staggered last headline — panel 8 de-clutter)
export const WELLA_OUT = 8500;           // hard cut

// ════════════════════════════════════════════════════════════════
// BEAT 4 — SEAMLESS FEATURE (8500–11000): detail crop + callouts
// ════════════════════════════════════════════════════════════════
export const FEAT_IN = 8500;             // hard cut, detail crop push
export const FEAT_C1_IN = 8900;          // SEAMLESS KNIT
export const FEAT_C2_IN = 9400;          // 4-WAY STRETCH
export const FEAT_C3_IN = 9900;          // SWEAT-WICKING
export const FEAT_OUT = 10850;           // wipe to WELL_B

// ════════════════════════════════════════════════════════════════
// BEAT 5 — FABRIC WELL_B (11000–14000): seamless geo-knit macro + "ENGINEERED, NOT SEWN"
// ════════════════════════════════════════════════════════════════
export const WELLB_FRAME_IN = 10850;     // scope card scale-pops in from center
export const WELLB_COPY1_IN = 10920;     // "ENGINEERED, NOT SEWN" headline lands ON the cut
export const WELLB_SPEC_IN = 11050;      // spec panel pre-populated right behind the headline
export const WELLB_PEAK_IN = 11700;      // scale-pop accent on the "0" SEAM COUNT (proof peak)
export const WELLB_COPY2_IN = 12300;     // (legacy) — bottom-right label now removed
export const WELLB_OUT = 14000;          // hard cut

// ════════════════════════════════════════════════════════════════
// BEAT 6 — COLORWAY SELECTOR (14000–16900) — FIX 3. A real selector: a row of 8 REAL
// product-shot SWATCHES + a large MAIN PREVIEW panel. The selection cycles through all
// 8 colorways across the beat; the MAIN PREVIEW swaps to the selected colorway's REAL
// product photo + its name. NO fake-tinted model — real photos only.
// ════════════════════════════════════════════════════════════════
export const CW_IN = 14000;              // hard cut
export const CW_LABEL_IN = 14000;        // "8 COLORWAYS / FIND YOURS" header lands ON the cut
export const CW_PREVIEW_IN = 14080;      // main preview panel scale-pops in — center never empty
export const CW_GRID_IN = 14150;         // first swatch
export const CW_GRID_STEP = 55;          // per-swatch cascade stagger (ms)
export const CW_SELECT_START = 14620;    // first selection lands (after the row cascades in)
export const CW_SELECT_STEP = 280;       // dwell per colorway (8 × 280 ≈ 2240ms of cycling)
export const CW_OUT = 16900;             // wipe to CTA

// ════════════════════════════════════════════════════════════════
// BEAT 7 — CTA / OUTRO (16900–19000) — FIX 4 (b05 style). REAL logo lockup on the dark
// fabric-texture bg → "SHOP GEO SEAMLESS" → off-white "SHOP NOW" pill (camo accent bar +
// sheen) → "FROM $36" anchor → GYMSHARK.COM. Built in b05's outro composition.
// ════════════════════════════════════════════════════════════════
// NOTE: the editframe render-clone caps this project at 540 frames (18.0s) regardless of
// DURATION_MS, so the WHOLE outro is front-loaded to be SETTLED + held by ~17.85s — every
// element (logo, SHOP GEO SEAMLESS, SHOP NOW, FROM $36, GYMSHARK.COM) lands inside the
// 18.0s render window and reads on the final held frames.
export const CTA_IN = 16900;             // wipe arrives
export const CTA_FIN_IN = 16970;         // real logo lockup settles in ON the cut
export const CTA_SHOP_IN = 17150;        // SHOP GEO SEAMLESS line-by-line reveal
export const CTA_BTN_IN = 17400;         // SHOP NOW pill scale-pops in (overshoot)
export const CTA_PRICE_IN = 17600;       // FROM $36 anchor
export const CTA_URL_IN = 17740;         // GYMSHARK.COM
export const CTA_HOLD = 17900;
