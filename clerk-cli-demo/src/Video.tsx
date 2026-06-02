/**
 * Clerk CLI Setup Demo — v7 round-6 (consolidated terminal)
 * 1920×1080 @ 30fps · ~15.5s total
 * Scene sequence: SceneTerminal(11.5s) + Scene6(2s) + Scene7(3.5s) = 17s
 *
 * SceneTerminal replaces the former Scene1–Scene5.
 * ONE continuous terminal accumulates all CLI output with a content-following
 * camera anchored bottom-left. Scene6 + Scene7 are UNCHANGED.
 */
import React from "react";
import { Timegroup } from "@editframe/react";
import { SceneTerminal } from "./scenes/SceneTerminal";
import { Scene6 } from "./scenes/Scene6";
import { Scene7 } from "./scenes/Scene7";

export const Video: React.FC = () => (
  <Timegroup
    mode="sequence"
    style={{
      width: 1920,
      height: 1080,
      background: "#000000",
    }}
  >
    <SceneTerminal />
    <Scene6 />
    <Scene7 />
  </Timegroup>
);
