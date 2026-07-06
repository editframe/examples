import React from "react";
import { Audio } from "@editframe/react";

/**
 * Drop an <Sfx /> inside any `mode="fixed"` <Timegroup> scene.
 *   `cue`    selects which sample to play.
 *   `at`     offset within the scene (seconds).
 *   `dur`    play duration (defaults to 1.2s).
 *   `volume` 0–1.
 *
 * SFX files live in `src/assets/sfx/` and are bundled by the singlefile
 * build like any other local asset (see `<Video>`/`<Audio>` local-asset
 * resolution in the `vite-plugin` skill).
 */

const SFX_PATHS: Record<string, string> = {
  pop: "/assets/sfx/pop.mp3",
  notify: "/assets/sfx/notify.mp3",
  twinkle: "/assets/sfx/twinkle.mp3",
  reveal: "/assets/sfx/reveal.mp3",
  "glitch-short": "/assets/sfx/glitch-short.mp3",
  ping: "/assets/sfx/ping.mp3",
  confirm: "/assets/sfx/confirm.mp3",
  "glass-pop": "/assets/sfx/glass-pop.mp3",
};

export const Sfx: React.FC<{
  cue: keyof typeof SFX_PATHS;
  at: number;
  dur?: number;
  volume?: number;
}> = ({ cue, at, dur = 1.2, volume = 1 }) => {
  const src = SFX_PATHS[cue];
  if (!src) return null;
  return (
    <Audio
      src={src}
      offset={`${at}s`}
      duration={`${dur}s`}
      volume={volume}
    />
  );
};
