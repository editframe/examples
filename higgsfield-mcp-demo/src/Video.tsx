/**
 * Higgsfield MCP product demo — 38.06s · 1280×720
 *
 * Sequence (overlap=0): Opening 3450 + Prompt 5480 + Flow 29130 = 38060.
 * Overlapping beats stay inside one scene. Audio is a sibling of the sequence.
 */
import React from "react";
import { Audio, Timegroup } from "@editframe/react";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import { MUSIC_SRC, TOTAL_MS } from "./constants";
import { Flow } from "./scenes/Flow";
import { Opening } from "./scenes/Opening";
import { Prompt } from "./scenes/Prompt";
import "./styles.css";

export const Video = () => (
  <Timegroup mode="contain" workbench className="stage">
    <Timegroup mode="sequence" overlap="0ms" className="absolute w-full h-full">
      <Opening />
      <Prompt />
      <Flow />
    </Timegroup>
    <Audio src={MUSIC_SRC} volume={1} duration={`${TOTAL_MS}ms`} />
  </Timegroup>
);

export default Video;
