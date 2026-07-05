import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import { AmbientField } from "./components/AmbientField";
import { Hook } from "./scenes/Hook";
import { Hero } from "./scenes/Hero";
import { WellA } from "./scenes/WellA";
import { Feat } from "./scenes/Feat";
import { WellB } from "./scenes/WellB";
import { Range } from "./scenes/Range";
import { Cta } from "./scenes/Cta";
import { OAT, INK, GEOGRAPH, OVERLAP_MS, DURATION_MS } from "./constants";

const MUSIC = "/assets/music-bed.mp3";

/**
 * ALLBIRDS — Tree Runner NZ · 9:16 · "Natural Materials" cut.
 * 1080×1920 @ 30fps, ~25s total.
 *
 * Seven scenes (see src/scenes/), each its OWN `<Timegroup mode="fixed">`, played by
 * one root `<Timegroup mode="sequence" overlap={OVERLAP_MS}>`. Every scene animates
 * against its own local clock via plain CSS `@keyframes` / `--ef-progress` /
 * `--ef-transition-out-start` — there is no master-ms clock, no `onFrame`, and no
 * imperative ref-driven style mutation anywhere in this composition. See
 * `src/constants.ts` (`SCENES`) for how the scene durations + overlap add up to the
 * total runtime, and the `css-animations` / `composition` skills for the underlying
 * timing model.
 *
 * HOOK    wordmark + EFFORTLESS BY NATURE, fibers settle on oat
 * HERO    Tree Runner NZ floats weightless on a soft sand tile, $100
 * WELL_A  portrait lifestyle well (real footage) + "Comfort, naturally"
 * FEAT    MERINO · TREE FIBER · SUGARCANE + carbon number (mono)
 * WELL_B  landscape material well (real footage) + "Tread Lighter"
 * RANGE   the colorway family across the muted palette + main preview
 * CTA     wordmark + SHOP NOW + B Corp + allbirds.com on oat
 *
 * Transitions are soft MATERIAL MORPHS, each distinct — see the per-scene comments
 * in src/scenes/ for what each one is doing (tile-morph, knit-wipe, parallax-contract, …).
 */
export const Video: React.FC = () => (
  <Timegroup
    mode="contain"
    workbench
    className="w-[1080px] h-[1920px] relative overflow-hidden"
    style={{ background: OAT, fontFamily: GEOGRAPH, color: INK }}
  >
    <Timegroup mode="sequence" overlap={`${OVERLAP_MS}ms`} className="absolute inset-0">
      <Hook />
      <Hero />
      <WellA />
      <Feat />
      <WellB />
      <Range />
      <Cta />
    </Timegroup>

    <AmbientField />
    {/* Explicit duration (rather than `mode="fit"`, unsupported on <Audio>) pins this to the
        composition's total runtime regardless of the source file's own length. */}
    <Audio src={MUSIC} volume={1} duration={`${DURATION_MS}ms`} />
  </Timegroup>
);
