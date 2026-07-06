/**
 * Video.tsx — Claude for Microsoft 365 demo (v7, round-6 user feedback)
 * 1920×1080 @ 30fps · 24.5s total
 *
 * Scene breakdown (verified against each scene's own DURATION_MS — this table
 * was previously out of sync with the actual per-scene constants):
 *   Scene1_IconsIntro           — 3500ms  (0–3500ms)       FIX1: slower logo exit
 *   Scene2_OutlookFocus         — 3000ms  (3500–6500ms)    FIX2: clean fade entrance
 *   Scene3_OutlookChromeAndType — 6500ms  (6500–13000ms)   FIX3+4: outline + 3-pane
 *   Scene4_Thinking             — 3000ms  (13000–16000ms)  FIX5: brighter shimmer
 *   Scene5_ResponseAndScroll    — 8500ms  (16000–24500ms)  FIX6+7: highlight+pan
 *   Total: 24500ms
 */
import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import { Scene1_IconsIntro } from "./scenes/Scene1_IconsIntro";
import { Scene2_OutlookFocus } from "./scenes/Scene2_OutlookFocus";
import { Scene3_OutlookChromeAndType } from "./scenes/Scene3_OutlookChromeAndType";
import { Scene4_Thinking } from "./scenes/Scene4_Thinking";
import { Scene5_ResponseAndScroll } from "./scenes/Scene5_ResponseAndScroll";

const TOTAL_MS = 24500;

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

    {/* Explicit duration (rather than `mode="fit"`, unsupported on <Audio>) pins this to the
        composition's total runtime regardless of the source file's own length. */}
    <Audio src="/assets/music-bed.mp3" volume={1} duration={`${TOTAL_MS}ms`} />
  </Timegroup>
);
