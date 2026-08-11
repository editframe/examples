import { createSfx } from "@shared/components/Sfx";

/**
 * Drop inside any `mode="fixed"` <Timegroup> scene: `<Sfx cue="click" at={1.2} />`.
 * `sourceIn` (seconds) trims leading silence — e.g. `codex-demo-click.mp3` has some
 * before its transient.
 */
export const Sfx = createSfx({
  click: "/codex-demo/src/assets/sfx/codex-demo-click.mp3",
  keyboard: "/codex-demo/src/assets/sfx/codex-demo-keyboard.wav",
});
