/**
 * Grok Bot — Android — 1920×1080 · 10s
 *
 *   Phone         0–5.3s      lock screen + two notification cards
 *   Announcement  5.3–7.733s  "Grok Bot is now available on Android"
 *   Outro         7.733–10s   Grok Bot lockup
 *   ────────────────────────────────────────────────
 *                 10000ms     hard-cut sequence (overlap=0)
 */
import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import { Phone } from "./scenes/Phone";
import { Announcement } from "./scenes/Announcement";
import { Outro } from "./scenes/Outro";
import { TOTAL_MS } from "./constants";
import "./styles.css";
import "./outro-handoff.css";

const MUSIC = "/grokbot-android-demo/src/assets/grokbot-android-demo-music-bed.wav";

export const Video: React.FC = () => (
  <Timegroup
    mode="contain"
    workbench
    className="comp-root relative w-[1920px] h-[1080px] overflow-hidden"
  >
    <Timegroup mode="sequence" className="sequence">
      <Phone />
      <Announcement />
      <Outro />
    </Timegroup>
    <Audio src={MUSIC} volume={1} duration={`${TOTAL_MS}ms`} />
  </Timegroup>
);

export default Video;
