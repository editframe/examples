import React from "react";
import { Audio } from "@editframe/react";

/**
 * Drop an <Sfx /> inside any `mode="fixed"` <Timegroup> scene.
 *   `cue`    selects which sample to play.
 *   `at`     offset within the scene (seconds).
 *   `dur`    play duration (defaults to 1.2s).
 *   `volume` 0–1.
 *
 * SFX files live in `src/assets/sfx/`, part of the composition's own
 * dependency graph so `vite-plugin-singlefile` can inline them into the
 * portable single-HTML bundle.
 */

const SFX_PATHS: Record<string, string> = {
  pop: "/assets/sfx/pop.mp3",
  plop: "/assets/sfx/plop.mp3",
  twinkle: "/assets/sfx/twinkle.mp3",
  reveal: "/assets/sfx/reveal.mp3",
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
