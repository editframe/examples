/**
 * Video.tsx — Claude Code Financial Services demo (v7, round-6 user feedback)
 * 1920×1080 @ 30fps · ~25s total
 *
 * Scene timeline (MASTER):
 *   Scene1: 0–1900ms             Hexagon node-graph: fast form + collapse-to-center exit
 *   Scene2 (merged): 1900–12000ms Title + pills + plugin headline continuous Star Wars scroll
 *   Scene5: 12000–15500ms        Managed Agents on orange bg
 *   Scene6: 15500–23000ms        ARQOS dashboard → Claude outro cream bg
 */
import React from "react";
import { Timegroup } from "@editframe/react";
import { Scene1_WireframeCube } from "./scenes/Scene1_WireframeCube";
import { Scene2_TitleAndPillsScroll } from "./scenes/Scene2_TitleAndPillsScroll";
import { Scene5_ManagedAgents } from "./scenes/Scene5_ManagedAgents";
import { Scene6_ArqosDashboard } from "./scenes/Scene6_ArqosDashboard";

export const Video: React.FC = () => (
  <Timegroup
    mode="sequence"
    className="relative w-full h-full overflow-hidden"
    style={{
      width: 1920,
      height: 1080,
      background: "#EAE8DE",
    }}
  >
    <Scene1_WireframeCube />
    <Scene2_TitleAndPillsScroll />
    <Scene5_ManagedAgents />
    <Scene6_ArqosDashboard />
  </Timegroup>
);
