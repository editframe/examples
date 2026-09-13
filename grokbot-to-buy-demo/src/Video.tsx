/**
 * Grok Bot — Buy Anything — 11.33s · 1920×1080 · 30fps.
 *
 * Hard-cut sequence (overlap=0). Silent — no `<Audio>`.
 * All motion is CSS `@keyframes` in motion.css, card-perspective.css, outro.css.
 *
 *   Buy    0–7.966s      7966ms
 *   Outro  7.966–11.333s 3367ms
 *   ────────────────────────────────
 *          11333ms
 */
import React from "react";
import { Timegroup } from "@editframe/react";
import { Buy } from "./scenes/Buy";
import { Outro } from "./scenes/Outro";
import "./styles.css";
import "./motion.css";
import "./outro.css";
import "./card-perspective.css";

export const Video = () => (
  <Timegroup
    mode="contain"
    workbench
    className="w-[1920px] h-[1080px] relative overflow-hidden"
    style={{ background: "#f6f7fc" }}
  >
    <Timegroup mode="sequence" className="sequence absolute inset-0">
      <Buy />
      <Outro />
    </Timegroup>
  </Timegroup>
);

export default Video;
