import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import { TitleIntro } from "./scenes/TitleIntro";
import { Backlog } from "./scenes/Backlog";
import { CodegenIssue } from "./scenes/CodegenIssue";
import { Integrations } from "./scenes/Integrations";
import { DevinIssue } from "./scenes/DevinIssue";
import { OutroTicker } from "./scenes/OutroTicker";
import { OutroTitle } from "./scenes/OutroTitle";
import { LinearLogo } from "./scenes/LinearLogo";
import { BG, DURATION_MS } from "./constants";

const MUSIC = "/linear-agents-demo/src/assets/linear-agents-demo-music-bed.mp3";

/**
 * Linear for Agents — 1:1 reproduction, 0–32s. 1920×1080 @ 30fps.
 *
 * Eight scenes (see src/scenes/), each its OWN `<Timegroup mode="fixed">`, played by
 * one `<Timegroup mode="sequence">`, itself the sole scene-bearing child of the root
 * `<Timegroup mode="contain">` (the music bed is the sequence's sibling, spanning the
 * full runtime). Every scene animates against its own local clock via plain CSS
 * `@keyframes` — there is no master-ms clock, and (with one narrowly-scoped exception
 * in Backlog.tsx, documented there) no `onFrame`/imperative ref-driven style mutation
 * anywhere in this composition. See `src/constants.ts` (`SCENES`) for how the eight
 * scene durations add up to the total runtime.
 *
 * TITLE INTRO    "Linear for Agents" fades in/out on near-black
 * BACKLOG        engineering backlog scrolls in, rows selected + assigned to Codegen
 * CODEGEN ISSUE  ENG-1293 — Codegen ships a PR, moves to In Review
 * INTEGRATIONS   settings page — cursor enables Devin
 * DEVIN ISSUE    ENG-237 — @devin mention, response reveals with a code block
 * OUTRO TICKER   slot-machine word swap: Coding → Triage → Planning
 * OUTRO TITLE    "Linear for Agents" full title card
 * LINEAR LOGO    Linear mark + wordmark, fade to black
 */
export const Video: React.FC = () => (
  <Timegroup
    mode="contain"
    workbench
    className="w-[1920px] h-[1080px] relative overflow-hidden"
    style={{ background: BG }}
  >
    <Timegroup mode="sequence" className="absolute inset-0">
      <TitleIntro />
      <Backlog />
      <CodegenIssue />
      <Integrations />
      <DevinIssue />
      <OutroTicker />
      <OutroTitle />
      <LinearLogo />
    </Timegroup>

    {/* Explicit duration (rather than `mode="fit"`, unsupported on <Audio>) pins this to the
        composition's total runtime regardless of the source file's own length. */}
    <Audio src={MUSIC} volume={1} duration={`${DURATION_MS}ms`} />
  </Timegroup>
);

export default Video;
