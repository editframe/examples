/**
 * Video.tsx — Claude for Microsoft 365 demo (v7, round-6 user feedback)
 * 1920×1080 @ 30fps · ~26s total
 *
 * Scene breakdown:
 *   Scene1_IconsIntro           — 5000ms  (0–5000ms)       FIX1: slower logo exit
 *   Scene2_OutlookFocus         — 3000ms  (5000–8000ms)    FIX2: clean fade entrance
 *   Scene3_OutlookChromeAndType — 6500ms  (8000–14500ms)   FIX3+4: outline + 3-pane
 *   Scene4_Thinking             — 3000ms  (14500–17500ms)  FIX5: brighter shimmer
 *   Scene5_ResponseAndScroll    — 8500ms  (17500–26000ms)  FIX6+7: highlight+pan
 *   Total: 26000ms
 */
import React from "react";
import { Timegroup } from "@editframe/react";
import { Scene1_IconsIntro } from "./scenes/Scene1_IconsIntro";
import { Scene2_OutlookFocus } from "./scenes/Scene2_OutlookFocus";
import { Scene3_OutlookChromeAndType } from "./scenes/Scene3_OutlookChromeAndType";
import { Scene4_Thinking } from "./scenes/Scene4_Thinking";
import { Scene5_ResponseAndScroll } from "./scenes/Scene5_ResponseAndScroll";

export const Video: React.FC = () => (
  <Timegroup
    mode="sequence"
    className="relative w-full h-full overflow-hidden"
    style={{
      width: 1920,
      height: 1080,
      background: "#EFECE3",
    }}
  >
    <Scene1_IconsIntro />
    <Scene2_OutlookFocus />
    <Scene3_OutlookChromeAndType />
    <Scene4_Thinking />
    <Scene5_ResponseAndScroll />
  </Timegroup>
);
