import React from "react";
import { Timegroup } from "@editframe/react";
import Scene1_Headline from "./scenes/Scene1_Headline";
import Scene2_ClaudeWindow from "./scenes/Scene2_ClaudeWindow";
import Scene3_Findings from "./scenes/Scene3_Findings";
import Scene4_PRPatch from "./scenes/Scene4_PRPatch";
import Scene5_Logo from "./scenes/Scene5_Logo";

/**
 * Claude Security — v5 TOTAL SCRAP REBUILD
 *
 * v4 was scrapped: headline ran off right edge, Claude.ai window was
 * pinned bottom-right with 60% empty cream. Jeremy: "SCRAP the 2nd video
 * COMPLETELY. Don't build off from it."
 *
 * v5 ground truth: jeremy-refs/Claude Security Agent.mp4 + CLAUDE pegs.
 *
 *  Scene 1  (0–5s)     Headline "Claude Security now available in public beta"
 *                      — CENTERED, fits within 1700px (fontSize=72)
 *  Scene 2  (5–11s)    Claude.ai window with Security tab highlighted
 *                      — CENTERED via inset:0 flex (no bottom-right pin)
 *  Scene 3  (11–18s)   acme-corp/hookrelay header + 4 findings card
 *  Scene 4  (18–23s)   PR patch row + "The Fix" + secure code block
 *                      + coral underline under "secure subprocess execution"
 *  Scene 5  (23–26s)   Coral burst + "Claude" wordmark
 *
 *  Total: 26s
 */
export const Video: React.FC = () => {
  return (
    <Timegroup
      mode="sequence"
      className="relative w-full h-full overflow-hidden"
      style={{
        width: 1920,
        height: 1080,
        background: "#DEDCD2",
      }}
    >
      <Scene1_Headline />
      <Scene2_ClaudeWindow />
      <Scene3_Findings />
      <Scene4_PRPatch />
      <Scene5_Logo />
    </Timegroup>
  );
};
