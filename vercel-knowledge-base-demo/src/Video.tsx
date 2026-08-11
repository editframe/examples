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
 *  HeroToOverview  0–12000ms      (merged: hero close-up → pan-out → scroll → filter → Sandbox click)
 *  ArticlePage     12000–16500ms
 *  AIChatPanel     16500–30000ms
 */
import React from "react";
import { Timegroup } from "@editframe/react";
import { HeroToOverview } from "./scenes/HeroToOverview";
import { ArticlePage } from "./scenes/ArticlePage";
import { AIChatPanel } from "./scenes/AIChatPanel";

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
    <HeroToOverview />
    <ArticlePage />
    <AIChatPanel />
  </Timegroup>
);
