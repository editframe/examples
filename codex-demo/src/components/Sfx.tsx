/**
 * Sfx — lightweight wrapper for in-scene audio cues.
 * Final SFX layer is applied post-render via bash mix script.
 * These are draft cues only.
 *
 * Props:
 *   cue    — selects sample from public/sfx/
 *   at     — offset within scene (seconds)
 *   dur    — play duration (defaults to 1.2s)
 *   volume — 0–1
 */
import React from "react";
import { Audio } from "@editframe/react";

const SFX_PATHS: Record<string, string> = {
  pop: "/sfx/pop.mp3",
  plop: "/sfx/plop.mp3",
  notify: "/sfx/notify.mp3",
  ping: "/sfx/ping.mp3",
  confirm: "/sfx/confirm.mp3",
  twinkle: "/sfx/twinkle.mp3",
  reveal: "/sfx/reveal.mp3",
  glitch: "/sfx/glitch-short.mp3",
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
