import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import { Scene1_TerminalPush } from "./scenes/Scene1_TerminalPush";
import { Scene2_FileTreeRoute } from "./scenes/Scene2_FileTreeRoute";
import { Scene3_CodeToConcept } from "./scenes/Scene3_CodeToConcept";
import { Scene4_BuildLog } from "./scenes/Scene4_BuildLog";
import { Scene5_OutputCard } from "./scenes/Scene5_OutputCard";
import { Scene9_LogoCard } from "./scenes/Scene9_LogoCard";
import { OVERLAP_MS, DURATION_MS } from "./constants";

const MUSIC = "/assets/music-bed.mp3";

/**
 * Vercel — Delba-canon rebuild v4 (jeremy-vercel-1)
 * 1920×1080 @ 30fps
 *
 * REBUILD RATIONALE — what changed and why
 * ────────────────────────────────────────
 * Jeremy's feedback on v3 ("nothing like Delba's videos"): the v3 sequence
 * (terminal push → build log → URL → globe → stats → logo) was a *deploy
 * demo*. Delba doesn't make deploy demos. She makes visually-animated
 * concept explainers — filesystem trees, code annotations, static/dynamic
 * decomposition diagrams. v4 rebuilds the entire body of the video around
 * that.
 *
 * Confirmed Delba videos referenced for this rebuild:
 *   - "Partial Prerendering explained"            youtu.be/MTcPrTIBkpA
 *   - "use client explained"                      youtu.be/eO51VVCpTk0
 *   - "use client visually explained: What, Why, How"  youtu.be/dqAuHcIPYs0
 *   - "Next.js Explained: Creating Routes"        youtu.be/kmJEmfRhv5g
 *
 * Visual vocabulary inherited from her work + the Vercel PPR blog post
 *   (https://vercel.com/blog/partial-prerendering-with-next-js-...):
 *   - PURPLE = static / prerendered shell
 *   - BLUE   = dynamic / streamed-at-request
 *   - File trees in Geist Mono, indented by depth, on flat #0A0A0A
 *   - Bracket-and-label annotations sliding alongside code blocks
 *   - Wireframe page layouts with paired purple/blue color-coding
 *   - Headline cards in Geist Sans 500, generous negative space
 *
 * Scene list (total 22.5s) — v7 pacing pass: holds compressed 15-25%:
 *   Scene 1: Opener / title card               3.0s  ( 0.0 –  3.0)
 *   Scene 2: FileTreeRoute (file → URL)        4.5s  ( 3.0 –  7.5)
 *   Scene 3: CodeToConcept (Suspense brackets) 5.0s  ( 7.5 – 12.5)
 *   Scene 4: BuildLog (vercel deploy stream)   4.5s  (12.5 – 17.0)
 *   Scene 5: OutputCard (thesis sentence)      3.0s  (17.0 – 20.0)
 *   Scene 9: LogoCard (Vercel mark)            2.5s  (20.0 – 22.5)
 *   ─────────────────────────────────────────────── 22.5s
 *
 * v8 — sequenced with a real 500ms crossfade (`OVERLAP_MS` in constants.ts) instead
 * of hard cuts. Each scene's own `<Timegroup duration>` is bumped by `OVERLAP_MS`
 * (except the opener) so its "solo" screen time above is unchanged; the extra time
 * is spent fading out during `--ef-transition-out-start` while the next scene's own
 * elements play in. See `constants.ts` (`SCENES`) for the exact per-scene durations
 * and the arithmetic that keeps the total at 22.5s.
 *
 * Removed from v3:
 *   ✗ Scene2_BuildPipeline      — deploy-log streaming was the wrong subject
 *   ✗ Scene3_GlobeZoom (URL)    — URL reveal is a marketing-clip move,
 *                                 not an explainer move
 *   ✗ Scene6_EdgeNodeLights     — globes & maps are Vercel-marketing visuals,
 *                                 not Delba explainer visuals
 *   ✗ Scene8_StatsReveal        — stats line was a perf flex, not an
 *                                 explainer beat
 *   (legacy files for these remain on disk for reference / future rendering
 *    templates; they are simply unwired from Video.tsx.)
 *
 * Bg: off-black #0A0A0A throughout. NEVER pure #000000.
 */
export const Video = () => {
  return (
    <Timegroup
      workbench
      mode="contain"
      className="w-[1920px] h-[1080px] relative overflow-hidden"
      style={{ background: "#0A0A0A" }}
    >
      <Timegroup mode="sequence" overlap={`${OVERLAP_MS}ms`} className="absolute inset-0">
        <Scene1_TerminalPush />
        <Scene2_FileTreeRoute />
        <Scene3_CodeToConcept />
        <Scene4_BuildLog />
        <Scene5_OutputCard />
        <Scene9_LogoCard />
      </Timegroup>

      {/* Explicit duration (rather than `mode="fit"`, unsupported on <Audio>) pins this to the
          composition's total runtime regardless of the source file's own length. */}
      <Audio src={MUSIC} volume={1} duration={`${DURATION_MS}ms`} />
    </Timegroup>
  );
};
