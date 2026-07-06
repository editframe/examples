/**
 * Video.tsx — Claude Code Financial Services demo
 * 1920×1080 @ 30fps · 23s total (0–1900 + 1900–12000 + 12000–15500 + 15500–23000)
 *
 * Four scenes (see src/scenes/), each its OWN `<Timegroup mode="fixed">`, played by one
 * root `<Timegroup mode="sequence" overlap={OVERLAP_MS}>`. Every scene animates against
 * its own local clock via CSS `@keyframes` / the `Reveal` component / `--ef-progress` —
 * there is no master-ms clock and no imperative ref-driven style mutation anywhere in
 * this composition, except one deliberately-scoped `addFrameTask` inside
 * `HexagonFormation` for its software 3D perspective projection (see that file's own
 * comment for why). See `src/constants.ts` (`OVERLAP_MS`) and each scene's own duration
 * constant for how the scene durations + overlap add up to the total runtime, and the
 * `css-animations` / `composition` skills for the underlying timing model.
 *
 * HEXAGON    coral node-graph forms flat → turns 3D → collapses to center
 * TITLE_PILLS  headline, then the agent-template pill column scrolls through center,
 *              then the plugins headline — three standalone beats, never overlapping
 * MANAGED_AGENTS  "Or deploy them as Managed Agents" on coral
 * ARQOS      ARQOS dashboard → zoom into Valuation Reviewer → Claude outro on cream
 *
 * Scene backgrounds are identical across the Hexagon→TitlePills and
 * ManagedAgents→Arqos cuts (both cream, both coral respectively), so only the
 * TitlePills→ManagedAgents boundary — the one place the background color actually
 * changes — needs an explicit crossfade (see ManagedAgents.tsx).
 */
import React from "react";
import { Timegroup } from "@editframe/react";
import { HexagonFormation } from "./scenes/HexagonFormation";
import { TitleAndPillsScroll } from "./scenes/TitleAndPillsScroll";
import { ManagedAgents } from "./scenes/ManagedAgents";
import { ArqosDashboard } from "./scenes/ArqosDashboard";
import { OVERLAP_MS } from "./constants";

export const Video: React.FC = () => (
  <Timegroup
    mode="contain"
    workbench
    className="w-[1920px] h-[1080px] relative overflow-hidden"
    style={{ background: "#EAE8DE" }}
  >
    <Timegroup mode="sequence" overlap={`${OVERLAP_MS}ms`} className="absolute inset-0">
      <HexagonFormation />
      <TitleAndPillsScroll />
      <ManagedAgents />
      <ArqosDashboard />
    </Timegroup>
  </Timegroup>
);
