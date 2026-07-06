/**
 * Video.tsx — fal.ai "Introducing fal Assets" demo
 * 14.4s total · 1920×1080 · 30fps
 *
 * Three scenes (see src/scenes/), each its OWN `<Timegroup mode="fixed">`, played back
 * to back by one root `<Timegroup mode="sequence">` — NO overlap, since the reference
 * edit (FALAI.mp4) hard-cuts between beats. Every scene animates against its own local
 * clock via plain CSS `@keyframes` / `--ef-progress`; the only per-frame JS left is a
 * single scene-scoped `addFrameTask` in Scene1 for the cursor's arced hop motion (see
 * the comment there for why). See `src/constants.ts` (`SCENES`) for scene durations.
 *
 * Scene1  0–8000ms     nav tab walkthrough + Assets dashboard reveal
 * Scene2  8000–11200ms "Introducing fal Assets" reveal + typewriter subtitle
 * Scene3  11200–14400ms fal logo outro (white, reference-faithful)
 */
import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { W, H, TOTAL_MS } from "./constants";

const MUSIC = "/assets/music.mp3";

export const Video: React.FC = () => (
  <Timegroup
    mode="contain"
    workbench
    className="relative overflow-hidden"
    style={{
      width: W,
      height: H,
      position: "relative",
    }}
  >
    <Timegroup mode="sequence" className="absolute w-full h-full">
      <Scene1 />
      <Scene2 />
      <Scene3 />
    </Timegroup>
    {/* Explicit duration (rather than `mode="fit"`, unsupported on <Audio>) pins this to
        the composition's resolved length. Fade-in/fade-out/loudnorm already baked into
        the asset itself — see src/assets/music.mp3 provenance in CREDITS.md. Sibling of
        the sequence (not a child of it) so it spans the whole timeline as a background
        track instead of being treated as an extra sequential scene. */}
    <Audio src={MUSIC} volume={1} duration={`${TOTAL_MS}ms`} />
  </Timegroup>
);
