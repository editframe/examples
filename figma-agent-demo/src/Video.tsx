import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import { SceneA_FigmaWindow } from "./scenes/SceneA_FigmaWindow";
import { SceneB_AgentPrompt } from "./scenes/SceneB_AgentPrompt";
import { SceneBprime_OnboardingGeneration } from "./scenes/SceneBprime_OnboardingGeneration";
import { SceneC_ThenGoDeep } from "./scenes/SceneC_ThenGoDeep";
import { SceneD_LogoCard } from "./scenes/SceneD_LogoCard";

const MUSIC = "/assets/music-bed.mp3";
const TOTAL_MS = 30800;

/**
 * Figma — Native Agent (v7 — cursor click responses + use-case payoff scene)
 * 1920×1080 @ 30fps. Target ~30.8s.
 *
 * v7 changes (Jeremy round 7):
 *   - SceneA: cursor clicks now have VISIBLE UI consequences.
 *       click 1 → "Progress Card" layer row highlights in #0D99FF selection blue.
 *       click 2 → color picker pops, Fill swatch + CTA buttons re-color to Figma purple.
 *   - NEW SceneBprime (5.5s): use-case payoff for SceneB's prompt — Figma
 *       generates a 4-step onboarding flow (Welcome / Choose topics / Set
 *       preferences / You're in) on the lavender canvas. Anchored to pegs
 *       091322 + 091330.
 *   - SceneC, SceneD unchanged (Jeremy explicitly approved SceneC).
 *
 * Scene ledger:
 *   SceneA_FigmaWindow                10.0s   pegs 091222 + 091306 + 092718
 *   SceneB_AgentPrompt                 6.0s   peg 091314
 *   SceneBprime_OnboardingGeneration   5.5s   pegs 091322 + 091330  (NEW)
 *   SceneC_ThenGoDeep                  5.8s   peg 091344
 *   SceneD_LogoCard                    3.5s   5-color F mark on #1E1E1E
 *   ─────────────────────────────────────
 *                                     30.8s   total
 *
 * Camera magnitudes: brand cap explicitly RELAXED to 2.5x for this video.
 * Each zoom resolves on a peg-anchored target.
 *
 * Repo layout:
 *   src/Video.tsx                the composition root (this file)
 *   src/scenes/*.tsx             one `<Timegroup mode="fixed">` per scene, its own
 *                                local clock, sequenced by the inner `mode="sequence"`
 *                                Timegroup below (no crossfade `overlap` — scenes
 *                                hard-cut via their own internal solid-color wash)
 *   src/components/Reveal.tsx    shared declarative fade+translate/scale entrance/exit
 *   src/components/Sfx.tsx       per-scene sound-effect cue helper
 *   src/components/helpers.ts    small math helpers (clamp/lerp/typewriter/easing)
 *   src/components/FigmaLogo.tsx the 5-color Figma "F" mark (SceneD)
 *
 * Every scene animates against its own local time via CSS `@keyframes`/`Reveal`
 * rather than a per-frame `onFrame` switchboard. The only remaining `addFrameTask`
 * usage (SceneA, SceneB, SceneC, SceneBprime) is scoped to text-content mutation
 * (typewriter effects, animated status dots, a hex-code swap) and, in SceneA/
 * SceneB, the cursor-sweep + click-consequence choreography — see the doc
 * comment at the top of each scene file for why those specific bits are kept
 * as JS instead of CSS.
 *
 * The scene sequence is wrapped in an outer `mode="contain"` Timegroup so the
 * music bed `<Audio>` can sit as a sibling spanning the whole composition,
 * rather than being swept up as an extra "scene" inside the sequence.
 */
export const Video = () => {
  return (
    <Timegroup
      mode="contain"
      workbench
      className="w-[1920px] h-[1080px] relative overflow-hidden"
      style={{ background: "#1E1E1E" }}
    >
      <Timegroup mode="sequence" className="absolute inset-0">
        <SceneA_FigmaWindow />
        <SceneB_AgentPrompt />
        <SceneBprime_OnboardingGeneration />
        <SceneC_ThenGoDeep />
        <SceneD_LogoCard />
      </Timegroup>

      {/* Explicit duration (rather than `mode="fit"`, unsupported on <Audio>) pins this to
          the composition's total runtime regardless of the source file's own length. */}
      <Audio src={MUSIC} volume={1} duration={`${TOTAL_MS}ms`} />
    </Timegroup>
  );
};
