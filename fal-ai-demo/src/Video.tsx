/**
 * Video.tsx — fal.ai "Introducing fal Assets" demo
 * 14.4s total · 1920×1080 · 30fps
 *
 * Three scenes (see src/scenes/), each its OWN `<Timegroup mode="fixed">`, played back
 * to back by one root `<Timegroup mode="sequence">` — NO overlap, since the reference
 * edit (FALAI.mp4) hard-cuts between beats. Every scene animates against its own local
 * clock via plain CSS `@keyframes` / `--ef-progress`; the only per-frame JS left is a
 * single scene-scoped `addFrameTask` in AssetsDashboard for the cursor's arced hop motion (see
 * the comment there for why). See `src/constants.ts` (`SCENES`) for scene durations.
 *
 * AssetsDashboard  0–8000ms     nav tab walkthrough + Assets dashboard reveal
 * AssetsIntro      8000–11200ms "Introducing fal Assets" reveal + typewriter subtitle
 * LogoOutro        11200–14400ms fal logo outro (white, reference-faithful)
 */
import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import { AssetsDashboard } from "./scenes/AssetsDashboard";
import { AssetsIntro } from "./scenes/AssetsIntro";
import { LogoOutro } from "./scenes/LogoOutro";
import { W, H, TOTAL_MS } from "./constants";

const MUSIC = "/fal-ai-demo/src/assets/fal-ai-demo-music.mp3";

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
      <AssetsDashboard />
      <AssetsIntro />
      <LogoOutro />
    </Timegroup>
    {/* Explicit duration (rather than `mode="fit"`, unsupported on <Audio>) pins this to
        the composition's resolved length. Fade-in/fade-out/loudnorm already baked into
        the asset itself — see src/assets/fal-ai-demo-music.mp3 provenance in CREDITS.md. Sibling of
        the sequence (not a child of it) so it spans the whole timeline as a background
        track instead of being treated as an extra sequential scene. */}
    <Audio src={MUSIC} volume={1} duration={`${TOTAL_MS}ms`} />
  </Timegroup>
);
