/**
 * Cursor SDK Product Demo (v6, round-5 user feedback)
 * 1920×1080 @ 30fps · ~23.7s total
 */
import React from "react";
import { Timegroup } from "@editframe/react";
import { Scene1_2_Terminal } from "./scenes/Scene1_2_Terminal";
import { Scene3_ComposerText } from "./scenes/Scene3_ComposerText";
import { Scene4_CodeBlock } from "./scenes/Scene4_CodeBlock";
import { Scene5_TerminalRun } from "./scenes/Scene5_TerminalRun";
import { Scene6_TitleCard } from "./scenes/Scene6_TitleCard";
import { Scene7_NowAvailable } from "./scenes/Scene7_NowAvailable";
import { Scene8_LogoOutro } from "./scenes/Scene8_LogoOutro";

export const Video: React.FC = () => (
  <Timegroup
    mode="sequence"
    className="relative overflow-hidden"
    style={{
      width: 1920,
      height: 1080,
      background: "#0A0A0A",
    }}
  >
    <Scene1_2_Terminal />
    <Scene3_ComposerText />
    <Scene4_CodeBlock />
    <Scene5_TerminalRun />
    <Scene6_TitleCard />
    <Scene7_NowAvailable />
    <Scene8_LogoOutro />
  </Timegroup>
);
