/**
 * Video.tsx — Vercel Knowledge Base product demo (v5, round-5 user feedback)
 * 1920×1080 @ 30fps · 30s total
 *
 * One root `Timegroup mode="sequence"` (hard cuts between distinct app views —
 * browsing, then the article, then the AI panel — matches how a real product
 * screen-recording cuts between contexts, so no crossfade `overlap` is used)
 * wrapping three scenes, each its own `Timegroup mode="fixed"` in `src/scenes/`
 * with its own local clock. No master-ms clock spans the whole video.
 *
 * Scene layout:
 *  Scene1_HeroToOverview  0–12000ms      (merged: hero close-up → pan-out → scroll → filter → Sandbox click)
 *  Scene4_ArticlePage     12000–16500ms
 *  Scene5_AIChatPanel     16500–30000ms
 */
import React from "react";
import { Timegroup } from "@editframe/react";
import { Scene1_HeroToOverview } from "./scenes/Scene1_HeroToOverview";
import { Scene4_ArticlePage } from "./scenes/Scene4_ArticlePage";
import { Scene5_AIChatPanel } from "./scenes/Scene5_AIChatPanel";

export const Video: React.FC = () => (
  <Timegroup
    mode="sequence"
    className="relative w-full h-full overflow-hidden"
    style={{
      width: 1920,
      height: 1080,
      background: "#000000",
    }}
  >
    <Scene1_HeroToOverview />
    <Scene4_ArticlePage />
    <Scene5_AIChatPanel />
  </Timegroup>
);
