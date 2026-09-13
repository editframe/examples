import React from "react";
import { Audio, Timegroup } from "@editframe/react";
import { W, H, FPS, FONT, TOTAL_MS } from "./constants";
import { VectorType } from "./scenes/VectorType";
import { ChatCard } from "./scenes/ChatCard";
import { Deck } from "./scenes/Deck";
import { BurstChips } from "./scenes/BurstChips";
import { FoldWalls } from "./scenes/FoldWalls";
import "./styles.css";

const MUSIC = "/firecrawl-demo/src/assets/firecrawl-demo-music-bed.wav";

export const Video = () => (
  <Timegroup
    workbench
    mode="contain"
    fps={FPS}
    className="relative overflow-hidden"
    style={{ width: W, height: H, background: "#FFFFFF", fontFamily: FONT }}
  >
    <Timegroup mode="sequence" className="absolute inset-0">
      <VectorType />
      <ChatCard />
      <Deck />
      <BurstChips />
      <FoldWalls />
    </Timegroup>
    <Audio src={MUSIC} volume={1} duration={`${TOTAL_MS}ms`} />
  </Timegroup>
);

export default Video;
