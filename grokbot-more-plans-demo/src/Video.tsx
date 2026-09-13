/**
 * Grok Bot — More Plans — 12.48s · 1920×1080 · 30fps.
 *
 * Three scene Timegroups sequenced as hard cuts (no crossfade in source):
 *
 *   Bounce   7300ms   0–7.30s     shapes enter, tower build + sway
 *   Headline 3000ms   7.30–10.30s headline text, shapes exit, ball alone
 *   Lockup   2180ms   10.30–12.48s "Grok" + "Bot" slide into lockup
 *
 * Check: 7300 + 3000 + 2180 = 12480.
 */
import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import "./styles.css";
import { Bounce } from "./scenes/Bounce";
import { Headline } from "./scenes/Headline";
import { Lockup } from "./scenes/Lockup";
import { TOTAL_MS } from "./constants";

const MUSIC = "/grokbot-more-plans-demo/src/assets/grokbot-more-plans-demo-music-bed.wav";

export const Video: React.FC = () => (
  <Timegroup mode="contain" workbench className="w-[1920px] h-[1080px] relative overflow-hidden">
    <Timegroup mode="sequence" className="absolute inset-0">
      <Bounce />
      <Headline />
      <Lockup />
    </Timegroup>
    <Audio src={MUSIC} volume={1} duration={`${TOTAL_MS}ms`} />
  </Timegroup>
);

export default Video;
