import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import { Composer } from "./scenes/Composer";
import { Response } from "./scenes/Response";
import { TOTAL_MS } from "./constants";
import "./styles.css";

const MUSIC = "/claude-cowork-demo/src/assets/claude-cowork-demo-music-bed.mp3";

/**
 * Claude Cowork product demo — 1920×1080 · 20s
 *
 *   Composer   0–12670ms     headline + prompt card + cursor
 *   Response   12670–20000ms reply feed + Progress card
 *   ────────────────────────────────────────────────
 *              20000ms        hard-cut sequence (overlap=0)
 *
 * The 18.2–18.45s s2/s3 crossfade lives inside Response so a uniform sequence
 * overlap cannot bleed onto the Composer→Response hard cut.
 */
export const Video: React.FC = () => (
  <Timegroup mode="contain" workbench className="stage">
    <Timegroup mode="sequence" className="absolute w-full h-full">
      <Composer />
      <Response />
    </Timegroup>
    <Audio src={MUSIC} volume={1} duration={`${TOTAL_MS}ms`} />
  </Timegroup>
);

export default Video;
