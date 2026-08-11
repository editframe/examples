/**
 * Clerk CLI Setup Demo — v7 round-6 (consolidated terminal)
 * 1920×1080 @ 30fps · 17s total
 * Scene sequence: Terminal(11.5s) + Tagline(2s) + LogoCard(3.5s) = 17s
 *
 * Terminal replaces the former Scene1–Scene5 (deleted — they were dead,
 * unimported code once this scene took over; see git history for the originals).
 * ONE continuous terminal accumulates all CLI output with a content-following
 * camera anchored bottom-left.
 *
 * Three scenes, each its own `<Timegroup mode="fixed">` (see src/scenes/),
 * played back-to-back as hard cuts (no crossfade) by this root
 * `<Timegroup mode="sequence">`. Every scene animates against its own local
 * clock via plain CSS `@keyframes` / `--ef-progress` — there is no master-ms
 * clock and no `onFrame`/ref-driven imperative style mutation anywhere in this
 * composition (see the per-scene comments in src/scenes/ and the
 * `css-animations` / `composition` skills for the underlying timing model).
 */
import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import { Terminal } from "./scenes/Terminal";
import { Tagline } from "./scenes/Tagline";
import { LogoCard } from "./scenes/LogoCard";
import { DURATION_MS } from "./constants";

const MUSIC = "/clerk-cli-demo/src/assets/clerk-cli-demo-music.mp3";

export const Video: React.FC = () => (
  <Timegroup
    mode="contain"
    workbench
    style={{
      width: 1920,
      height: 1080,
      background: "#000000",
    }}
  >
    <Timegroup mode="sequence" className="absolute w-full h-full">
      <Terminal />
      <Tagline />
      <LogoCard />
    </Timegroup>

    {/* Explicit duration (rather than `mode="fit"`, unsupported on <Audio>) pins this to the
        composition's total runtime regardless of the source file's own length. Sibling of
        the sequence (not a child of it) so it spans the whole timeline as a background
        track instead of being treated as an extra sequential scene. */}
    <Audio src={MUSIC} volume={1} duration={`${DURATION_MS}ms`} />
  </Timegroup>
);
