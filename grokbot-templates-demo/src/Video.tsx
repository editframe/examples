/**
 * Grok Bot — shareable templates — 16.567s · 1920×1080 · 30fps.
 *
 * Six scenes sequenced with hard cuts (no overlap). Silent — no <Audio>.
 *
 *   Intro       3833ms   Settings slide / pan / press
 *   WordCard    2300ms   "Share your Bots as a template"
 *   Publish     3934ms   Draft publish + card morph + cloud
 *   CloseUp     1633ms   Card close-up: hover, press, whip out
 *   ChatWindow  2167ms   macOS chat window over blue wallpaper
 *   Lockup      2700ms   Black mark → "Grok Bot" wordmark
 *
 * Check: 3833 + 2300 + 3934 + 1633 + 2167 + 2700 = 16567.
 */
import React from "react";
import { Timegroup } from "@editframe/react";
import "./styles.css";
import { Intro } from "./scenes/Intro";
import { WordCard } from "./scenes/WordCard";
import { Publish } from "./scenes/Publish";
import { CloseUp } from "./scenes/CloseUp";
import { ChatWindow } from "./scenes/ChatWindow";
import { Lockup } from "./scenes/Lockup";

export const Video: React.FC = () => (
  <Timegroup mode="contain" workbench className="w-[1920px] h-[1080px] relative overflow-hidden">
    <Timegroup mode="sequence" className="absolute inset-0">
      <Intro />
      <WordCard />
      <Publish />
      <CloseUp />
      <ChatWindow />
      <Lockup />
    </Timegroup>
  </Timegroup>
);

export default Video;
