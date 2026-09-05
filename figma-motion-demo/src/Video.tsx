/**
 * Introducing Figma Motion — 20s · 1920×1080 · 12fps stepped.
 *
 * Sequence (overlap=0): nine scene Timegroups sum to 20000ms.
 * Overlapping beats stay inside one scene. Audio is a sibling of the sequence.
 */
import React from "react";
import { Audio, Timegroup } from "@editframe/react";
import { MUSIC_SRC, TOTAL_MS } from "./constants";
import Scene01_Intro from "./scenes/Scene01_Intro";
import Scene02_Morph from "./scenes/Scene02_Morph";
import Scene03_Cards from "./scenes/Scene03_Cards";
import Scene04_Editor from "./scenes/Scene04_Editor";
import Scene05_Title from "./scenes/Scene05_Title";
import Scene06_Purple from "./scenes/Scene06_Purple";
import Scene07_Connector from "./scenes/Scene07_Connector";
import Scene08_Unlocked from "./scenes/Scene08_Unlocked";
import Scene09_GoalReached from "./scenes/Scene09_GoalReached";
import "./styles.css";

export const Video: React.FC = () => (
  <Timegroup
    mode="contain"
    workbench
    className="relative w-[1920px] h-[1080px] overflow-hidden"
    style={{ width: 1920, height: 1080, background: "#000" }}
  >
    <Timegroup mode="sequence" overlap="0ms" className="absolute inset-0">
      <Scene01_Intro />
      <Scene02_Morph />
      <Scene03_Cards />
      <Scene04_Editor />
      <Scene05_Title />
      <Scene06_Purple />
      <Scene07_Connector />
      <Scene08_Unlocked />
      <Scene09_GoalReached />
    </Timegroup>
    <Audio src={MUSIC_SRC} volume={1} duration={`${TOTAL_MS}ms`} />
  </Timegroup>
);

export default Video;
