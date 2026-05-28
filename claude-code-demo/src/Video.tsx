import React from "react";
import { Timegroup } from "@editframe/react";
import Scene1_Demo from "./scenes/Scene1_Demo";
import Scene2_Reveal from "./scenes/Scene2_Reveal";
import Scene3_ArmPull from "./scenes/Scene3_ArmPull";
import Scene4_SecondPrompt from "./scenes/Scene4_SecondPrompt";
import Scene5_Curtain from "./scenes/Scene5_Curtain";
import Scene6_LogoCard from "./scenes/Scene6_LogoCard";

/**
 * Claude Code — Agent View (v4)
 * 1920×1080 @ 30fps
 *
 *   Scene 1: Demo + 3D agent spawn        8.5s
 *   Scene 2: Scatter + mascot reveal      3.5s
 *   Scene 3: Arm-pull (one-by-one)        8.0s
 *   Scene 4: Compiled list + 2nd prompt   6.5s
 *   Scene 5: Jump-out + black curtain     7.0s
 *   Scene 6: Claude Code + EDITFRAME      3.5s
 *   ────────────────────────────────── 37.0s
 */

export const Video: React.FC = () => (
  <Timegroup
    mode="sequence"
    workbench
    className="w-[1920px] h-[1080px]"
    style={{ background: "var(--paper)" }}
  >
    <Scene1_Demo />
    <Scene2_Reveal />
    <Scene3_ArmPull />
    <Scene4_SecondPrompt />
    <Scene5_Curtain />
    <Scene6_LogoCard />
  </Timegroup>
);

export default Video;
