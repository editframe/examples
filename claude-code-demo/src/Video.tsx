import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import AgentSpawn from "./scenes/AgentSpawn";
import MascotReveal from "./scenes/MascotReveal";
import ArmPull from "./scenes/ArmPull";
import SecondPrompt from "./scenes/SecondPrompt";
import Curtain from "./scenes/Curtain";
import LogoCard from "./scenes/LogoCard";

const MUSIC = "/claude-code-demo/src/assets/claude-code-demo-music-bed.mp3";
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
    mode="contain"
    workbench
    className="w-[1920px] h-[1080px]"
    style={{ background: "var(--paper)" }}
  >
    <Timegroup mode="sequence" className="absolute w-full h-full">
      <AgentSpawn />
      <MascotReveal />
      <ArmPull />
      <SecondPrompt />
      <Curtain />
      <LogoCard />
    </Timegroup>

    {/* Explicit duration (rather than `mode="fit"`, unsupported on <Audio>) pins this to the
        composition's total runtime regardless of the source file's own length. Sibling of
        the sequence (not a child of it) so it spans the whole timeline as a background
        track instead of being treated as an extra sequential scene. */}
    <Audio src={MUSIC} volume={1} duration={`${TOTAL_MS}ms`} />
  </Timegroup>
);

export default Video;
