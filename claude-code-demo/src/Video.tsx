import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import Scene1_Demo from "./scenes/Scene1_Demo";
import Scene2_Reveal from "./scenes/Scene2_Reveal";
import Scene3_ArmPull from "./scenes/Scene3_ArmPull";
import Scene4_SecondPrompt from "./scenes/Scene4_SecondPrompt";
import Scene5_Curtain from "./scenes/Scene5_Curtain";
import Scene6_LogoCard from "./scenes/Scene6_LogoCard";

const MUSIC = "/assets/music-bed.mp3";
const TOTAL_MS = 36000;

/**
 * Claude Code — Agent View (v4)
 * 1920×1080 @ 30fps
 *
 *   Scene 1: Demo + 3D agent spawn        8.5s
 *   Scene 2: Scatter + mascot reveal      3.5s
 *   Scene 3: Arm-pull (one-by-one)        6.5s
 *   Scene 4: Compiled list + 2nd prompt   7.0s
 *   Scene 5: Jump-out + black curtain     7.0s
 *   Scene 6: Claude Code + EDITFRAME      3.5s
 *   ────────────────────────────────── 36.0s
 *
 * Each scene is its own `<Timegroup mode="fixed">` (see src/scenes/), sequenced by this
 * root `<Timegroup mode="sequence">` with no `overlap` — cuts between scenes are
 * deliberate hard cuts (scatter, jump-out, curtain), not crossfades, matching the
 * original edit. Every scene animates against its own local clock via plain CSS
 * `@keyframes` / <Reveal>; the only remaining `onFrame` usage is scoped per-scene for
 * text-content mutation (typewriters, counters) or a genuinely coupled rig (the arm-pull
 * and curtain-pull scenes — see the comments at the top of each for why).
 */

export const Video: React.FC = () => (
  <Timegroup
    mode="sequence"
    workbench
    className="w-[1920px] h-[1080px]"
    style={{ background: "var(--paper)" }}
  >
    <Scene1_Demo />
    <Scene2_Reveal />
    <Scene3_ArmPull />
    <Scene4_SecondPrompt />
    <Scene5_Curtain />
    <Scene6_LogoCard />

    {/* Explicit duration (rather than `mode="fit"`, unsupported on <Audio>) pins this to the
        composition's total runtime regardless of the source file's own length. */}
    <Audio src={MUSIC} volume={1} duration={`${TOTAL_MS}ms`} />
  </Timegroup>
);

export default Video;
