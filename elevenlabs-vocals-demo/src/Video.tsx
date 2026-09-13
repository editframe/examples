/**
 * ElevenLabs Vocals — 25s · 1920×1080 · 30fps.
 *
 * Five hard-cut scenes (no overlap):
 *
 *   Intro          3617ms   0–3.617s
 *   Upload         1866ms   3.617–5.483s
 *   Carousel       5167ms   5.483–10.65s
 *   Songs          1233ms   10.65–11.883s
 *   AuroraFinale  13117ms   11.883–25.0s
 *
 * Check: 3617 + 1866 + 5167 + 1233 + 13117 = 25000.
 */
import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import "./styles.css";
import { Intro } from "./scenes/Intro";
import { Upload } from "./scenes/Upload";
import { Carousel } from "./scenes/Carousel";
import { Songs } from "./scenes/Songs";
import { AuroraFinale } from "./scenes/AuroraFinale";
import { TOTAL_MS } from "./constants";

const MUSIC = "/elevenlabs-vocals-demo/src/assets/elevenlabs-vocals-demo-music-bed.wav";

export const Video: React.FC = () => (
  <Timegroup mode="contain" workbench className="w-[1920px] h-[1080px] relative overflow-hidden" style={{ background: "#000", fontFamily: 'InterV, Inter, "Helvetica Neue", Arial, sans-serif' }}>
    <Timegroup mode="sequence" className="absolute inset-0">
      <Intro />
      <Upload />
      <Carousel />
      <Songs />
      <AuroraFinale />
    </Timegroup>
    <Audio src={MUSIC} volume={1} duration={`${TOTAL_MS}ms`} />
  </Timegroup>
);

export default Video;
