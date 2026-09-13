import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import { TunnelScene } from "./scenes/TunnelScene";
import { ManuscriptScene } from "./scenes/ManuscriptScene";
import { PhilosopherScene } from "./scenes/PhilosopherScene";
import { SandScene } from "./scenes/SandScene";
import { EndingScene } from "./scenes/EndingScene";
import { TOTAL_MS } from "./constants";
import "./styles.css";

const MUSIC = "/alchemy-demo/src/assets/alchemy-demo-music-bed.wav";

/**
 * Alchemy — 1920×1080 · 20s
 *
 *   Tunnel       0–2367ms      seals rush through a tunnel
 *   Manuscript   2367–5833ms   manuscript pages layer into a depth field
 *   Philosopher  5833–10467ms  statement type, ring, and stone
 *   Sand         10467–14500ms sand resolves into a thought network
 *   Ending       14500–20000ms AI, abundance, perpetuity — closing seal
 *   ────────────────────────────────────────────────
 *                20000ms       hard-cut sequence (overlap=0)
 */
export const Video: React.FC = () => (
  <Timegroup
    mode="contain"
    workbench
    className="w-[1920px] h-[1080px] relative overflow-hidden"
    style={{ background: "#fff" }}
  >
    <Timegroup mode="sequence" className="absolute inset-0">
      <TunnelScene />
      <ManuscriptScene />
      <PhilosopherScene />
      <SandScene />
      <EndingScene />
    </Timegroup>
    <Audio src={MUSIC} volume={1} duration={`${TOTAL_MS}ms`} />
  </Timegroup>
);

export default Video;
