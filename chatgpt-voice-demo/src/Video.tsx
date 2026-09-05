/**
 * ChatGPT voice product demo — 26s · 1920×1080
 *
 * Hard-cut sequence (overlap 0). Logo+H1 share Intro so the original 100ms
 * overlap (Logo until 3.2, H1 from 3.1) stays inside one Timegroup. Sel/mic
 * macros stay inside AppUI and hide `.cam` the same way as the master-clock
 * original. Music is a sibling of the sequence, not a child of it.
 *
 *   Intro     6430ms   0–6.43s
 *   Headline2 2420ms   6.43–8.85s
 *   AppUI    13900ms   8.85–22.75s
 *   Close     3250ms   22.75–26s
 *   6430 + 2420 + 13900 + 3250 = 26000
 */
import React from "react";
import { Audio, Timegroup } from "@editframe/react";
import { TOTAL_MS } from "./constants";
import { MUSIC } from "./assets";
import { Intro } from "./scenes/Intro";
import { Headline2 } from "./scenes/Headline2";
import { AppUI } from "./scenes/AppUI";
import { Close } from "./scenes/Close";
import "./styles.css";

export const Video = () => (
  <Timegroup mode="contain" workbench className="stage">
    <Timegroup mode="sequence" className="absolute w-full h-full">
      <Intro />
      <Headline2 />
      <AppUI />
      <Close />
    </Timegroup>
    <Audio src={MUSIC} volume={1} duration={`${TOTAL_MS}ms`} />
  </Timegroup>
);

export default Video;
