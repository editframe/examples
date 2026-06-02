/**
 * Video.tsx — Cursor Cloud Agents demo (v6, round-6 feedback)
 * Total: ~23500ms
 *
 * Scene layout (sequence):
 *   Scene 1: 0–2500ms      — Chat window, bigger, no traffic lights, chatbox centered
 *   Scene 2: 2500–4500ms   — Camera zoom into dropdown, centered
 *   Scene 3: 4500–6500ms   — "Agents are only as useful..." tagline
 *   Scene 4: 6500–9000ms   — Create New Environment popup
 *   Scene 5: 9000–16000ms  — Checklist FULL completion (7000ms, extends by 3000ms)
 *   Scene 6: 16000–21000ms — Two-panel paper-stack choreography (5000ms, extends by 1500ms)
 *   Scene 7: 21000–23000ms — "Agents that work like developers do"
 *   Scene 8: 23000–24500ms — Cursor cube outro (white bg + cube mark)
 */
import React from "react";
import { Timegroup } from "@editframe/react";
import { Scene1_Chatbox } from "./scenes/Scene1_Chatbox";
import { Scene2_ZoomToDropdown } from "./scenes/Scene2_ZoomToDropdown";
import { Scene3_Tagline } from "./scenes/Scene3_Tagline";
import { Scene4_CreateEnv } from "./scenes/Scene4_CreateEnv";
import { Scene5_Checklist } from "./scenes/Scene5_Checklist";
import { Scene6_FoldedPanels } from "./scenes/Scene6_FoldedPanels";
import { Scene7_DevTagline } from "./scenes/Scene7_DevTagline";
import { Scene8_CubeLogo } from "./scenes/Scene8_CubeLogo";

export const Video: React.FC = () => (
  <Timegroup
    mode="sequence"
    className="relative w-full h-full overflow-hidden"
    style={{
      width: 1920,
      height: 1080,
      background: "#000000",
    }}
  >
    <Scene1_Chatbox />
    <Scene2_ZoomToDropdown />
    <Scene3_Tagline />
    <Scene4_CreateEnv />
    <Scene5_Checklist />
    <Scene6_FoldedPanels />
    <Scene7_DevTagline />
    <Scene8_CubeLogo />
  </Timegroup>
);
