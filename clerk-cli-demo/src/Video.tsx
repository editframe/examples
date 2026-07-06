/**
 * Clerk CLI Setup Demo — v7 round-6 (consolidated terminal)
 * 1920×1080 @ 30fps · 17s total
 * Scene sequence: SceneTerminal(11.5s) + Scene6(2s) + Scene7(3.5s) = 17s
 *
 * SceneTerminal replaces the former Scene1–Scene5 (deleted — they were dead,
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
import { Timegroup } from "@editframe/react";
import { SceneTerminal } from "./scenes/SceneTerminal";
import { Scene6 } from "./scenes/Scene6";
import { Scene7 } from "./scenes/Scene7";

export const Video: React.FC = () => (
  <Timegroup
    mode="sequence"
    style={{
      width: 1920,
      height: 1080,
      background: "#000000",
    }}
  >
    <SceneTerminal />
    <Scene6 />
    <Scene7 />
  </Timegroup>
);
