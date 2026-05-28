import React from "react";
import { Timegroup } from "@editframe/react";
import { SceneA_FigmaWindow } from "./scenes/SceneA_FigmaWindow";
import { SceneB_AgentPrompt } from "./scenes/SceneB_AgentPrompt";
import { SceneBprime_OnboardingGeneration } from "./scenes/SceneBprime_OnboardingGeneration";
import { SceneC_ThenGoDeep } from "./scenes/SceneC_ThenGoDeep";
import { SceneD_LogoCard } from "./scenes/SceneD_LogoCard";

/**
 * Figma — Native Agent (v7 — cursor click responses + use-case payoff scene)
 * 1920×1080 @ 30fps. Target ~29.5s.
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
 *   SceneC_ThenGoDeep                  4.5s   peg 091344
 *   SceneD_LogoCard                    3.5s   5-color F mark on #1E1E1E
 *   ─────────────────────────────────────
 *                                     29.5s   total
 *
 * Camera magnitudes: brand cap explicitly RELAXED to 2.5x for this video.
 * Each zoom resolves on a peg-anchored target.
 */
export const Video = () => {
  return (
    <Timegroup
      workbench
      className="w-[1920px] h-[1080px] relative overflow-hidden"
      mode="sequence"
      style={{ background: "#1E1E1E" }}
    >
      <SceneA_FigmaWindow />
      <SceneB_AgentPrompt />
      <SceneBprime_OnboardingGeneration />
      <SceneC_ThenGoDeep />
      <SceneD_LogoCard />
    </Timegroup>
  );
};
