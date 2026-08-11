/**
 * Video.tsx — Claude for Microsoft 365 demo (v7, round-6 user feedback)
 * 1920×1080 @ 30fps · 24.5s total
 *
 * Scene breakdown (verified against each scene's own DURATION_MS — this table
 * was previously out of sync with the actual per-scene constants):
 *   IconsIntro           — 3500ms  (0–3500ms)       FIX1: slower logo exit
 *   OutlookFocus         — 3000ms  (3500–6500ms)    FIX2: clean fade entrance
 *   OutlookChromeAndType — 6500ms  (6500–13000ms)   FIX3+4: outline + 3-pane
 *   Thinking             — 3000ms  (13000–16000ms)  FIX5: brighter shimmer
 *   ResponseAndScroll    — 8500ms  (16000–24500ms)  FIX6+7: highlight+pan
 *   Total: 24500ms
 */
import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import { IconsIntro } from "./scenes/IconsIntro";
import { OutlookFocus } from "./scenes/OutlookFocus";
import { OutlookChromeAndType } from "./scenes/OutlookChromeAndType";
import { Thinking } from "./scenes/Thinking";
import { ResponseAndScroll } from "./scenes/ResponseAndScroll";

const TOTAL_MS = 24500;

export const Video: React.FC = () => (
  <Timegroup
    mode="contain"
    workbench
    className="relative w-full h-full overflow-hidden"
    style={{
      width: 1920,
      height: 1080,
      background: "#EFECE3",
    }}
  >
    <Timegroup mode="sequence" className="absolute w-full h-full">
      <IconsIntro />
      <OutlookFocus />
      <OutlookChromeAndType />
      <Thinking />
      <ResponseAndScroll />
    </Timegroup>

    {/* Explicit duration (rather than `mode="fit"`, unsupported on <Audio>) pins this to the
        composition's total runtime regardless of the source file's own length. Sibling of
        the sequence (not a child of it) so it spans the whole timeline as a background
        track instead of being treated as an extra sequential scene. */}
    <Audio src="/claude-office-demo/src/assets/claude-office-demo-music-bed.mp3" volume={1} duration={`${TOTAL_MS}ms`} />
  </Timegroup>
);
