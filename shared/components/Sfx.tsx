import React from "react";
import { Audio } from "@editframe/react";

/**
 * `cue → asset path` map for one project's `src/assets/sfx/` folder. Kept as plain data
 * (not baked into this shared file) since every project's cues/paths are its own.
 */
export type SfxCueMap = Record<string, string>;

export type SfxProps<Cues extends SfxCueMap> = {
  /** Selects which sample to play. */
  cue: keyof Cues & string;
  /** Offset within the scene's own Timegroup (seconds). */
  at: number;
  /** Play duration (seconds, default 1.2). */
  dur?: number;
  /** 0–1 (see BEST-PRACTICES.md §4 — this is a plain multiplier, not dB; values >1 throw at render time). */
  volume?: number;
  /** Trims this many seconds off the start of the source file (e.g. leading silence before a transient). */
  sourceIn?: number;
};

/**
 * Creates a project-scoped `<Sfx>` bound to `cues` — drop the result inside any
 * `mode="fixed"` <Timegroup> scene as `<Sfx cue="pop" at={1.2} />`. See
 * BEST-PRACTICES.md §4 ("SFX cues: one-shot, tied to a moment, `offset` relative to the
 * parent Timegroup").
 *
 * Consolidated from 4 near-identical per-example `components/Sfx.tsx` files — the only
 * thing that ever varied between them was this cue map, so that's the one thing each
 * project still owns locally (see e.g. `codex-demo/src/components/Sfx.tsx`).
 */
export function createSfx<Cues extends SfxCueMap>(cues: Cues) {
  return function Sfx({ cue, at, dur = 1.2, volume = 1, sourceIn }: SfxProps<Cues>) {
    const src = cues[cue];
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
}
