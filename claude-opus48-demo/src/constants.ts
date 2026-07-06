/**
 * Opus 4.8 ad — master constants (0–25s).
 *
 * Three scenes (see src/scenes/), each its own `<Timegroup mode="fixed">`, played by
 * one root `<Timegroup mode="sequence" overlap={OVERLAP_MS}>`. Every scene animates
 * against its own local clock via plain CSS `@keyframes` / `animation-delay` — there
 * is no master-ms clock, no `onFrame`, and no imperative ref-driven style mutation
 * anywhere in this composition. See `SCENES` below for how the scene durations +
 * overlap add up to the total runtime, and the `css-animations` / `composition`
 * skills for the underlying timing model.
 *
 * Two motifs — the coral creature + kites, and the notification-card stack — stay on
 * screen continuously ACROSS scene boundaries (they don't belong to any single
 * beat), so they're rendered as `src/components/CreatureAndKites.tsx` /
 * `NotificationStack.tsx`, siblings of the scene sequence rather than scene content.
 * Being direct children of the `contain` root, their own local time equals the whole
 * composition's absolute time, so they still key off the original absolute-ms cues.
 *
 * Builders: tune scene-local timing inside each scene file (inline, next to the
 * element it drives — see src/scenes/*.tsx); this file only holds values shared
 * across more than one file (scene boundaries, canvas layout, brand copy).
 */

export const DURATION_MS = 25000;

/** When true, overlays the matching reference frame at ~35% opacity for alignment. */
export const TRACE_MODE = false;
export const TRACE_OPACITY = 0.35;

/**
 * ── SCENES ──
 * Each scene is its own `<Timegroup mode="fixed">`, sequenced by the root
 * `<Timegroup mode="sequence" overlap={OVERLAP_MS}>` in `Video.tsx`. `duration`
 * already bakes in the shared overlap: every scene after the first is
 * `nominal solo screen time + OVERLAP_MS`, so its own "solo" time on screen still
 * matches the original cut. Net result: the 3 durations minus 2 overlaps sum to
 * exactly `DURATION_MS`.
 *
 *   hero       0 – 8000    solo 8000  (first scene, unchanged)
 *   headlines  8000 – 12900 solo 4900  -> duration 4900 + 700 = 5600
 *   command    12900 – 25000 solo 12100 -> duration 12100 + 700 = 12800
 *   sum(durations) - 2*700 = 8000 + 5600 + 12800 - 1400 = 25000 == DURATION_MS
 */
export const OVERLAP_MS = 700;

export const SCENES = {
  hero: { duration: 8000, label: "Terminal intro, status build-up, needs-input list, kites pop" },
  headlines: { duration: 5600, label: "Long-running tasks / Introducing Opus 4.8" },
  command: { duration: 12800, label: "Terminal returns, camera push-in, command types, code streams, cards settle" },
} as const;

export type SceneName = keyof typeof SCENES;

// ── Layout (canvas 1920×1080) — shared between the Hero and Command scenes ──
// Front (hero) terminal: measured ~838px wide, center y≈649.
export const HERO_TERM_W = 838;
export const HERO_TERM_H = 540;
export const HERO_TERM_CX = 960; // centered horizontally (also the returned terminal's cx)
export const HERO_TERM_CY = 648;
// Returned terminal (Command scene): measured ~760px wide × ~840px tall, center y≈583.
export const RET_TERM_W = 760;
export const RET_TERM_H = 840;
export const RET_TERM_CY = 583;

// ── Command scene copy ──
export const COMMAND_TEXT =
  "migrate apps/dashboard to App Router — it's the orders dashboard, the surface the whole company lives in. we have 3 more apps to do after this so let's get the pattern right the first time";
export const TYPE_CPS = 84.7;
