/**
 * Cursor Side Chat demo — 17.2s · 1920×1080
 *
 * contain workbench (.stage)
 *   sequence overlap=230ms          // ONLY Windows→Endcard (10.55–10.78 fade)
 *     Windows  10780ms              // 0–10.78 so Window B stays under the fade
 *     Endcard   6650ms              // mounts at 10.55; 10.55–17.2
 *   Audio sibling
 *
 * 10780 + 6650 - 230 = 17200
 */
import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import { Windows } from "./scenes/Windows";
import { Endcard } from "./scenes/Endcard";
import { OVERLAP_MS, TOTAL_MS } from "./constants";
import "./fonts.css";
import "./styles.css";

const MUSIC = "/cursor-sidechat-demo/src/assets/cursor-sidechat-demo-music-bed.mp3";

export const Video: React.FC = () => (
  <Timegroup mode="contain" workbench className="stage">
    <Timegroup
      mode="sequence"
      overlap={`${OVERLAP_MS}ms`}
      className="absolute w-full h-full"
    >
      <Windows />
      <Endcard />
    </Timegroup>

    <Audio src={MUSIC} volume={1} duration={`${TOTAL_MS}ms`} />
  </Timegroup>
);

export default Video;
