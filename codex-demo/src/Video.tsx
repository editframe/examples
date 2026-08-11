/**
 * Video.tsx — OpenAI Codex demo (v5, round-5 fixes)
 * 1920×1080 @ 30fps · 22000ms total
 *
 * Eight scenes (see src/scenes/), each its OWN `<Timegroup mode="fixed">`, played by one
 * root `<Timegroup mode="sequence">` (hard cuts — no crossfade overlap between beats, by
 * design; see individual scene files for the transition each one performs into the next).
 * Every scene animates against its own local clock via plain CSS `@keyframes` /
 * `animation-delay` — there is no master-ms clock and no imperative ref-driven style
 * mutation anywhere in this composition except a small number of scene-scoped `onFrame`
 * callbacks kept for genuinely irreducible per-frame text (a "Working for Xs" counter,
 * and PromptType's char-by-char typewriter effect) — see the file header comment in each of
 * those scenes for why.
 *
 * Scene timing (all compressed per FIX 2):
 * TitleCard:      0–2500ms   — "Computer Use / in Codex on Mac" title on codex-gradient bg
 * PromptType:     2500–4500ms — CloudTicTacToe headline + typing (fast, 2000ms)
 * SendTransition: 4500–6000ms — Send click + transition (1500ms)
 * PanelZoomOut:   6000–8500ms — Dual-panel ZOOMED IN 1.4x + Thinking (2500ms)
 * AgentWorking:   8500–13000ms — More agent steps, Working counter (4500ms)
 * RunZoom:        13000–14500ms — Cursor zooms + RUN click + TicTacToe SPAWNS (1500ms)
 * AppLaunch:      14500–17500ms — 3-window layout settles (3000ms)
 * GameFadeOut:    17500–22000ms — Cursor → center cell, X+Os spawn, fade out (4500ms)
 */
import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import { TitleCard } from "./scenes/TitleCard";
import { PromptType } from "./scenes/PromptType";
import { SendTransition } from "./scenes/SendTransition";
import { PanelZoomOut } from "./scenes/PanelZoomOut";
import { AgentWorking } from "./scenes/AgentWorking";
import { RunZoom } from "./scenes/RunZoom";
import { AppLaunch } from "./scenes/AppLaunch";
import { GameFadeOut } from "./scenes/GameFadeOut";

const MUSIC = "/codex-demo/src/assets/codex-demo-music-bed.mp3";
const TOTAL_MS = 22000;

export const Video: React.FC = () => (
  <Timegroup
    mode="contain"
    workbench
    className="relative w-full h-full overflow-hidden"
    style={{
      width: 1920,
      height: 1080,
      background: "#000000",
    }}
  >
    <Timegroup mode="sequence" className="absolute inset-0">
      <TitleCard />
      <PromptType />
      <SendTransition />
      <PanelZoomOut />
      <AgentWorking />
      <RunZoom />
      <AppLaunch />
      <GameFadeOut />
    </Timegroup>

    {/* Explicit duration (rather than `mode="fit"`, unsupported on <Audio>) pins this to the
        composition's total runtime regardless of the source file's own length. */}
    <Audio src={MUSIC} volume={1} duration={`${TOTAL_MS}ms`} />
  </Timegroup>
);
