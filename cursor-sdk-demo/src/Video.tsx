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
 * `addFrameTask` for math that has no reasonable static-CSS equivalent: CodeBlock's
 * accelerating camera chase + per-token text reveal, and TerminalRun's
 * viewport-follow scroll smoothing (see each file's own comment for why).
 */
import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import { TOTAL_MS } from "./constants";
import { Terminal } from "./scenes/Terminal";
import { ComposerText } from "./scenes/ComposerText";
import { CodeBlock } from "./scenes/CodeBlock";
import { TerminalRun } from "./scenes/TerminalRun";
import { TitleCard } from "./scenes/TitleCard";
import { NowAvailable } from "./scenes/NowAvailable";
import { LogoOutro } from "./scenes/LogoOutro";

const MUSIC = "/cursor-sdk-demo/src/assets/cursor-sdk-demo-music-bed.mp3";

export const Video: React.FC = () => (
  <Timegroup
    mode="contain"
    workbench
    className="relative overflow-hidden"
    style={{
      width: 1920,
      height: 1080,
      background: "#0A0A0A",
    }}
  >
    <Timegroup mode="sequence" className="absolute w-full h-full">
      <Terminal />
      <ComposerText />
      <CodeBlock />
      <TerminalRun />
      <TitleCard />
      <NowAvailable />
      <LogoOutro />
    </Timegroup>

    {/* Explicit duration (rather than `mode="fit"`, unsupported on <Audio>) pins this to the
        composition's total runtime regardless of the source file's own length. Sibling of
        the sequence (not a child of it) so it spans the whole timeline as a background
        track instead of being treated as an extra sequential scene. */}
    <Audio src={MUSIC} volume={1} duration={`${TOTAL_MS}ms`} />
  </Timegroup>
);
