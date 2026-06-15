/**
 * Opus 4.8 ad — master timing constants (0–25s).
 *
 * Source of truth: _opus_run/02-timemap-pro.json (Gemini time-map, REFINED).
 * Where time-map and dense frames disagree, FRAMES WIN — adjust here.
 *
 * ALL times are MASTER milliseconds (single 25 000 ms clock). The whole video
 * is one fixed Timegroup, so ownCurrentTimeMs == master ms. No scene offsets.
 *
 * Builders: tune timing by editing these constants only. Keep them named.
 */

export const DURATION_MS = 25000;
export const FPS = 30;

/** When true, overlays the matching reference frame at ~35% opacity for alignment. */
export const TRACE_MODE = false;
export const TRACE_OPACITY = 0.35;

// ── BEAT 1 — Terminal intro (0–1.9s) ──
export const TERM_IN_START = 0;
export const TERM_IN_END = 600; // window scales in 0.8→1.0
export const CREATURE_IN_END = 500;
export const STATUS_UPDATE_1 = 917; // "0 awaiting · 1 working" + "Working / apps/web Reading routes…"

// ── BEAT 2 — Kites appear + Needs-input list (1.9–8s) ──
export const STATUS_UPDATE_2 = 1917; // Needs input apps/web + 3 working
export const KITE_ORANGE_IN = 1917;
export const STATUS_UPDATE_3 = 2583; // apps/admin needs input
export const KITE_PINK_IN = 2833;
export const STATUS_UPDATE_4 = 2833; // apps/docs done
export const STATUS_UPDATE_5 = 3083; // final count
export const KITE_PURPLE_IN = 3583;
export const CREATURE_WALK_START = 4000; // walk right along the top
export const CREATURE_WALK_END = 6800;
export const KITES_FLOAT_UP = 7500;
export const TERM_EXIT_START = 7300; // terminal shrinks away toward beat 3
export const TERM_EXIT_END = 8000;

// ── BEAT 3 — Headlines (8–12.5s) ──
export const HL1_LINE1_IN = 8000; // "Long-running tasks"
export const HL1_LINE2_IN = 9000; // "shouldn't run your life"
export const HL1_OUT = 10916;
export const HL2_IN = 10917; // "Introducing Opus 4.8"
export const HL2_OUT = 12700;

// ── BEAT 4 — Terminal returns + Issue card + type command (12.5–17.5s) ──
// FRAME-VERIFIED (overrides Gemini + brief prose):
//   k_028 (13.5s) small term + Issue card; f176 (14.58s) typing begins "migrate▮"
//   f178→f182 (14.75→15.08s) camera ZOOMS IN; k_031 (15s) zoomed "App Router▮"
//   f208 (17.25s) full command done; f212→f216 (17.58→17.92s) ZOOM OUT, submit→chip
export const TERM_RETURN = 12900; // returned terminal fades in (Working / 4 apps)
export const CARD_ISSUE_IN = 13000; // Issue 781 card slides in top-right (small/wide view)
export const AUTO_MODE_IN = 13600; // ">> auto mode on" appears with returned terminal
export const TYPE_START = 14550; // command starts typing (frame f176)
export const TYPE_END = 17280; // command finished (frame f208 ≈17.25s)
// CAMERA — zoom IN then HOLD then zoom OUT (frame-verified, NOT Gemini's slow push)
export const CAM_IN_START = 14600;  // zoom-in begins (just after typing starts)
export const CAM_IN_END = 15050;    // zoom-in completes (~0.45s, fast)
export const CAM_OUT_START = 17480; // zoom-out begins (command submitted)
export const CAM_OUT_END = 18020;   // zoom-out completes (~0.5s) → small terminal again
export const CAM_SCALE = 1.75;      // measured: term width 760→1328 = 1.747×
export const CAM_FOCUS_X = 960;     // centered horizontally
// Origin near the terminal BOTTOM: keeps the prompt+command in frame at zoom
// (header crops off above). Solved from prompt y953→~835 at 1.75× → oy≈1100.
export const CAM_FOCUS_Y = 1090;

export const CMD_SUBMIT = 17480;    // command submits → grey chip + "Try refactor" hint

// ── BEAT 5 — AI execution / code output (17.6–21s, small terminal) ──
export const AI_THOUGHT_IN = 17800; // "Thought for 2s (ctrl+o to expand)"
export const AI_PLAN_IN = 18100;    // "● I'll start by exploring the repo…"
export const AI_CODE_IN = 18700;    // "● Write 70 lines … page.tsx" + syntax code
export const AI_BUILD_1 = 19600;    // "● Now delete dashboard's old pages/…"
export const AI_BUILD_2 = 20000;    // "● Build succeeds…"
export const AI_BUILD_3 = 20350;    // "● All routes return 200…"
export const AI_COMPLETE = 20650;   // "Migration is complete and verified…"

// ── BEAT 6 — Notification cards stack (21–25s) ──
// k_043 (21s) Issue+Calendar on RIGHT alongside code; k_046 (22.5s) terminal gone,
// cards CENTERED & large; k_048 (23.5s) 3 cards centered; k_050 (24.5s) scroll up.
export const CARD_CALENDAR_IN = 20700; // "Afternoon at the park" slides in (right, w/ code)
// FRAME-VERIFIED back-third choreography (k_043 21.0 → k_050 24.5):
//   k_044 (21.5): terminal panning OFF-LEFT, 2 cards MEDIUM right-of-center
//   k_045 (22.0): terminal GONE, 2 cards LARGE & centered (cx≈960, cardW≈1003)
//   k_048 (23.5): 3 cards (Kite crew in), top pushed up to y≈48
//   k_050 (24.5): 3 cards settled, top at y≈130
export const TERM_FADE_OUT = 21050;    // terminal/code fades+slides-left (gone by ~22.0)
export const TERM_FADE_DUR = 900;      // fade/slide completes ~21.95s
export const CARDS_CENTER_START = 21050; // cards begin growing + migrating to center
export const CARDS_CENTER_END = 22000;   // cards fully centered & large by t=22.0 (matches k_045)
export const CARD_MESSAGE_IN = 23050;  // "Kite crew" slides in at bottom (k_047→k_048 23.0→23.5)
export const CARDS_SCROLL_UP = 23550;  // whole stack scrolls up (Issue drifts up) k_048→k_050

// ── TYPE-ON ──
export const COMMAND_TEXT =
  "migrate apps/dashboard to App Router — it's the orders dashboard, the surface the whole company lives in. we have 3 more apps to do after this so let's get the pattern right the first time";
export const TYPE_CPS = 84.7;

// ── Layout (canvas 1920×1080) ──
// Front (hero) terminal: measured ~838px wide, center y≈649 (k_002).
export const HERO_TERM_W = 838;
export const HERO_TERM_H = 540;
export const HERO_TERM_CX = 960; // centered horizontally
export const HERO_TERM_CY = 648; // sits in lower-middle (matches k_002)
// Returned terminal (beat 4+): measured ~760px wide × ~840px tall, center y≈583
// (k_028 spans y163→1003). Taller than the front terminal — more body content.
export const RET_TERM_W = 760;
export const RET_TERM_H = 840;
export const RET_TERM_CY = 583;
