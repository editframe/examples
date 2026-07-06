/**
 * Linear for Agents — master constants. 1920×1080 @ 30fps, 32s total.
 *
 * Eight scenes (see src/scenes/), each its own `<Timegroup mode="fixed">`, played by
 * one root `<Timegroup mode="sequence">` (see src/Video.tsx). This composition's beats
 * are hard cuts / abutting fades rather than true crossfades — every scene's own
 * fade-in completes before the next scene's fade-in begins (verified against the
 * original master-ms cue points), so the sequence uses no `overlap` (0ms): each
 * scene's `duration` is its original nominal on-screen time, and the eight durations
 * sum to exactly `DURATION_MS`. See the per-scene files for local (scene-relative)
 * timing constants — there is no shared master clock.
 */
export const DURATION_MS = 32000;
export const FPS = 30;

// ── TYPE ──
export const FONT = "Inter, system-ui, -apple-system, sans-serif";
export const MONO = "'SF Mono', ui-monospace, 'Roboto Mono', Menlo, monospace";

// ── PALETTE (dark, flat Linear UI — never pure #000, no drop shadows on text) ──
export const BG = "#111115";
export const CODE_BG = "#1A1A1E";
export const TEXT_PRIMARY = "#E4E4E6";
export const TEXT_SECONDARY = "#8A8F98";
export const LINEAR_PURPLE = "#5E6AD2";
export const CHECKBOX_BLUE = "#4A82F6";
export const DEVIN_BLUE = "#3886E1";

/**
 * ── SCENES ──
 * Each beat is its own `<Timegroup mode="fixed">`, sequenced by the root
 * `<Timegroup mode="sequence">` in `Video.tsx`. There is no master clock read
 * anywhere — every scene animates against its OWN local time (`ownCurrentTimeMs`
 * resets to 0 at each scene's start), which is what makes the per-scene components
 * declarative instead of one big `onFrame` switchboard.
 *
 * No `overlap` is used (0ms) — this composition's cuts are hard cuts or abutting
 * fades (one scene finishes fading out at/before the next starts fading in), not
 * true temporal crossfades, so each scene's `duration` is simply its original nominal
 * screen time. Net result: the 8 durations sum to exactly `DURATION_MS`.
 */
export const SCENES = {
  titleIntro: { duration: 1767, label: "'Linear for Agents' title card fades in/out on near-black" },
  backlog: { duration: 8200, label: "engineering backlog: scroll settle, select, assign to Codegen" },
  codegenIssue: { duration: 5266, label: "ENG-1293: Codegen ships a PR, moves to In Review" },
  integrations: { duration: 2167, label: "integrations settings: cursor enables Devin" },
  devinIssue: { duration: 6830, label: "ENG-237: @devin mention, response reveals with code block" },
  outroTicker: { duration: 1920, label: "slot-machine word ticker: Coding → Triage → Planning" },
  outroTitle: { duration: 3950, label: "'Linear for Agents' full title card" },
  linearLogo: { duration: 1900, label: "Linear mark + wordmark, fade to black" },
} as const;

export type SceneName = keyof typeof SCENES;
