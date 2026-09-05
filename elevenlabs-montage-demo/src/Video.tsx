/**
 * ElevenLabs product demo — 22s · 1920×1080.
 *
 * Three scene Timegroups (Opening / Charts / Finale) sequenced with a uniform
 * 160ms overlap (the original G→H fade). Outgoing scenes keep that tail so
 * Charts/Finale mount on the music beat, not 160ms early.
 *
 *   Opening  7310ms  0–7.31
 *   Charts   5910ms  7.15–13.06
 *   Finale   9100ms  12.9–22.0
 *
 * Check: 7310 + 5910 + 9100 − 2×160 = 22000.
 */
import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./styles.css";
import { Opening } from "./scenes/Opening";
import { Charts } from "./scenes/Charts";
import { Finale } from "./scenes/Finale";
import { TOTAL_MS, OVERLAP_MS } from "./constants";

const MUSIC = "/elevenlabs-montage-demo/src/assets/elevenlabs-montage-demo-music-bed.mp3";

export const Video: React.FC = () => (
  <Timegroup mode="contain" workbench className="stage">
    <Timegroup mode="sequence" overlap={`${OVERLAP_MS}ms`} className="scene">
      <Opening />
      <Charts />
      <Finale />
    </Timegroup>
    <Audio src={MUSIC} volume={1} duration={`${TOTAL_MS}ms`} />
  </Timegroup>
);

export default Video;
