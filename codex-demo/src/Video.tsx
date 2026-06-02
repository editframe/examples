/**
 * Video.tsx — OpenAI Codex demo (v5, round-5 fixes)
 * 1920×1080 @ 30fps · 22000ms total
 *
 * Scene timing (all compressed per FIX 2):
 * Scene1:  0–2500ms   — "Computer Use / in Codex on Mac" title on codex-gradient bg
 * Scene2:  2500–4500ms — CloudTicTacToe headline + typing (fast, 2000ms)
 * Scene3:  4500–6000ms — Send click + transition (1500ms)
 * Scene4:  6000–8500ms — Dual-panel ZOOMED IN 1.4x + Thinking (2500ms)
 * Scene5:  8500–13000ms — More agent steps, Working counter (4500ms)
 * Scene6:  13000–14500ms — Cursor zooms + RUN click + TicTacToe SPAWNS (1500ms)
 * Scene7:  14500–17500ms — 3-window layout settles (3000ms)
 * Scene8:  17500–22000ms — Cursor → center cell, X+Os spawn, fade out (4500ms)
 */
import React from "react";
import { Timegroup } from "@editframe/react";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { Scene5 } from "./scenes/Scene5";
import { Scene6 } from "./scenes/Scene6";
import { Scene7 } from "./scenes/Scene7";
import { Scene8 } from "./scenes/Scene8";

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
    <Scene1 />
    <Scene2 />
    <Scene3 />
    <Scene4 />
    <Scene5 />
    <Scene6 />
    <Scene7 />
    <Scene8 />
  </Timegroup>
);
