import React from "react";
import { Timegroup } from "@editframe/react";
import { Scene1_LogoOpen } from "./scenes/Scene1_LogoOpen";
import { Scene2_Personas } from "./scenes/Scene2_Personas";
import { Scene3_SameData } from "./scenes/Scene3_SameData";
import { Scene4_Debate } from "./scenes/Scene4_Debate";
import { Scene5_Pipeline } from "./scenes/Scene5_Pipeline";
import { Scene6_WeeklyReport } from "./scenes/Scene6_WeeklyReport";
import { Scene7_Outro } from "./scenes/Scene7_Outro";

export const Video = () => {
  return (
    <Timegroup
      workbench
      className="w-[1920px] h-[1080px] bg-[#E8E6DC] relative overflow-hidden"
      mode="sequence"
    >
      <Scene1_LogoOpen />
      <Scene2_Personas />
      <Scene3_SameData />
      <Scene4_Debate />
      <Scene5_Pipeline />
      <Scene6_WeeklyReport />
      <Scene7_Outro />
    </Timegroup>
  );
};
