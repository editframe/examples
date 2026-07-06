/**
 * Sfx — lightweight wrapper for in-scene audio cues.
 *
 * Props:
 *   cue      — selects sample from src/assets/sfx/
 *   at       — offset within the scene's own Timegroup (seconds)
 *   dur      — play duration (defaults to 1.2s)
 *   volume   — 0–1
 *   sourceIn — trims this many seconds off the start of the source file
 *              (seconds) — e.g. click.mp3 has leading silence before its
 *              transient.
 */
import React from "react";
import { Audio } from "@editframe/react";

const SFX_PATHS: Record<string, string> = {
  click: "/assets/sfx/click.mp3",
  keyboard: "/assets/sfx/keyboard.wav",
};

export const Sfx: React.FC<{
  cue: keyof typeof SFX_PATHS;
  at: number;
  dur?: number;
  volume?: number;
  sourceIn?: number;
}> = ({ cue, at, dur = 1.2, volume = 1, sourceIn }) => {
  const src = SFX_PATHS[cue];
  if (!src) return null;
  return (
    <Audio
      src={src}
      offset={`${at}s`}
      duration={`${dur}s`}
      volume={volume}
      sourcein={sourceIn !== undefined ? `${sourceIn}s` : undefined}
    />
  );
};
