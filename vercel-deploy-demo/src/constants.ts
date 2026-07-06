/**
 * Vercel — Delba-canon rebuild v4 · master constants.
 * 1920x1080 @ 30fps. Six scenes, each its own `<Timegroup mode="fixed">`, sequenced
 * with a shared `overlap` (see SCENES below) — no single master-ms clock, no `onFrame`.
 */

/**
 * ── SCENES ──
 * Each beat is its own `<Timegroup mode="fixed">`, sequenced by the root
 * `<Timegroup mode="sequence" overlap={OVERLAP_MS}>` in `Video.tsx`. Every scene
 * animates against its OWN local time (`ownCurrentTimeMs` resets to 0 per scene) via
 * plain CSS `@keyframes` / `animation-delay` — there is no master clock read anywhere.
 *
 * `OVERLAP_MS` of shared time exists at every scene boundary — during it, the
 * outgoing scene plays its own exit fade (via `--ef-transition-out-start` /
 * `--ef-transition-duration`) while the incoming scene plays the head of its own
 * `duration`. `duration` below already accounts for that: every scene after the
 * first is `nominal + OVERLAP_MS` so its own "solo" screen time still matches the
 * original v7 pacing cut. Net result: the 6 durations minus 5 overlaps sum to
 * exactly 22500ms (22.5s) — the original v7 total.
 */
export const OVERLAP_MS = 500;

export const SCENES = {
  terminalPush: { duration: 3000, label: "Opener / title card" },
  fileTreeRoute: { duration: 4500 + OVERLAP_MS, label: "FileTreeRoute (file → URL)" },
  codeToConcept: { duration: 5000 + OVERLAP_MS, label: "CodeToConcept (Suspense brackets)" },
  buildLog: { duration: 4500 + OVERLAP_MS, label: "BuildLog (vercel deploy stream)" },
  outputCard: { duration: 3000 + OVERLAP_MS, label: "OutputCard (thesis sentence)" },
  logoCard: { duration: 2500 + OVERLAP_MS, label: "LogoCard (Vercel mark)" },
} as const;
