import React from "react";
import { Audio } from "@editframe/react";

/**
 * Drop an <Sfx /> inside any `mode="fixed"` <Timegroup> scene.
 *   `cue`    selects which sample to play.
 *   `at`     offset within the scene (seconds).
 *   `dur`    play duration (defaults to 1.2s).
 *   `volume` 0–1.
 *
 * SFX files live in `public/sfx/`. Editframe's audio pipeline pulls them
 * via the dev server's static file route — this is more reliable than
 * inlined base64, which doesn't round-trip through the AudioContext encoder.
 */

const SFX_PATHS: Record<string, string> = {
  pop: "/sfx/pop.mp3",
  plop: "/sfx/plop.mp3",
  notify: "/sfx/notify.mp3",
  success: "/sfx/success.mp3",
  twinkle: "/sfx/twinkle.mp3",
  reveal: "/sfx/reveal.mp3",
  glitch: "/sfx/glitch.mp3",
  "glitch-short": "/sfx/glitch-short.mp3",
  ping: "/sfx/ping.mp3",
  confirm: "/sfx/confirm.mp3",
  "glass-pop": "/sfx/glass-pop.mp3",
  disappear: "/sfx/disappear.mp3",
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
