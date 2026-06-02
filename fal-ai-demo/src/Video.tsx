/**
 * Video.tsx — fal.ai "Introducing fal Assets" demo (REWORK v6 — reference match)
 * ~12.4s total · 1920×1080 · 30fps
 *
 * Scene timing (SceneHyper REMOVED — not in reference):
 *  Scene1:  0–8000ms    (8000ms) — nav walkthrough (0–3.5s) + Assets dashboard reveal (3.5–8s)
 *  Scene2:  8000–11200ms(3200ms) — "Introducing fal Assets" reveal + typewriter
 *  Scene3: 11200–14400ms(3200ms) — fal logo outro (white, reference-faithful)
 */
import React from "react";
import { Timegroup } from "@editframe/react";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";

export const Video: React.FC = () => (
  <Timegroup
    mode="sequence"
    className="relative overflow-hidden"
    style={{
      width: 1920,
      height: 1080,
      position: "relative",
    }}
  >
    {/* Scene 1: nav walkthrough + Assets dashboard reveal (0–8000ms) */}
    <Scene1 />

    {/* Scene 2: "Introducing fal Assets" reveal (8000–11200ms) */}
    <Scene2 />

    {/* Scene 3: fal logo outro (11200–14400ms) */}
    <Scene3 />
  </Timegroup>
);
