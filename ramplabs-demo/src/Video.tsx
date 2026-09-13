/**
 * Ramp Labs — 25 s · 1920×1080 · 60 fps.
 *
 *   InvoiceScene         0–3.933s      236 frames
 *   SpendScene           3.933–7.267s  200 frames
 *   SeparationScene      7.267–12.700s 326 frames
 *   InvestigationScene  12.700–18.700s 360 frames
 *   WorkItemsScene      18.700–25.000s 378 frames
 *   ────────────────────────────────────────────────
 *                       1500 frames = 25s  hard-cut sequence (overlap=0)
 *
 * Scene lengths come from `timing.ts` (frames). Motion is CSS `@keyframes`
 * in `src/*-motion.css`.
 */
import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import { InvoiceScene } from "./scenes/InvoiceScene";
import { SpendScene } from "./scenes/SpendScene";
import { SeparationScene } from "./scenes/SeparationScene";
import { WorkItemsScene } from "./scenes/WorkItemsScene";
import { InvestigationScene } from "./scenes/InvestigationScene";
import "./styles.css";

const MUSIC = "/ramplabs-demo/src/assets/ramplabs-demo-music-bed.wav";

export const Video = () => (
  <Timegroup
    mode="contain"
    workbench
    fps={60}
    className="relative w-[1920px] h-[1080px] overflow-hidden"
    style={{ width: 1920, height: 1080, background: "#fff" }}
  >
    <Timegroup mode="sequence" className="scenes">
      <InvoiceScene />
      <SpendScene />
      <SeparationScene />
      <InvestigationScene />
      <WorkItemsScene />
    </Timegroup>
    <Audio src={MUSIC} duration="25000ms" volume={1} />
  </Timegroup>
);

export default Video;
