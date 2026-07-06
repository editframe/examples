/**
 * Cursor SDK Product Demo (v6, round-5 user feedback)
 * 1920×1080 @ 30fps
 *
 * Eight scenes (see src/scenes/), each its own `<Timegroup mode="fixed">`, played by one
 * root `<Timegroup mode="sequence">` — hard cuts between scenes are deliberate here (each
 * scene's own comments call out its background flipping "instantly"), so unlike some other
 * example projects in this repo the sequence has no `overlap`.
 *
 * Nearly every scene animates against its own local clock via plain CSS `@keyframes` /
 * `steps()` typewriter clips / the shared `cursor-blink` cursor — no master-ms clock, no
 * imperative ref-driven style mutation. Two scenes keep a small, explicitly-justified
 * `addFrameTask` for math that has no reasonable static-CSS equivalent: Scene4_CodeBlock's
 * accelerating camera chase + per-token text reveal, and Scene5_TerminalRun's
 * viewport-follow scroll smoothing (see each file's own comment for why).
 */
import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import { TOTAL_MS } from "./constants";
import { Scene1_2_Terminal } from "./scenes/Scene1_2_Terminal";
import { Scene3_ComposerText } from "./scenes/Scene3_ComposerText";
import { Scene4_CodeBlock } from "./scenes/Scene4_CodeBlock";
import { Scene5_TerminalRun } from "./scenes/Scene5_TerminalRun";
import { Scene6_TitleCard } from "./scenes/Scene6_TitleCard";
import { Scene7_NowAvailable } from "./scenes/Scene7_NowAvailable";
import { Scene8_LogoOutro } from "./scenes/Scene8_LogoOutro";

const MUSIC = "/assets/music-bed.mp3";

export const Video: React.FC = () => (
  <Timegroup
    mode="sequence"
    className="relative overflow-hidden"
    style={{
      width: 1920,
      height: 1080,
      background: "#0A0A0A",
    }}
  >
    <Scene1_2_Terminal />
    <Scene3_ComposerText />
    <Scene4_CodeBlock />
    <Scene5_TerminalRun />
    <Scene6_TitleCard />
    <Scene7_NowAvailable />
    <Scene8_LogoOutro />

    {/* Explicit duration (rather than `mode="fit"`, unsupported on <Audio>) pins this to the
        composition's total runtime regardless of the source file's own length. */}
    <Audio src={MUSIC} volume={1} duration={`${TOTAL_MS}ms`} />
  </Timegroup>
);
