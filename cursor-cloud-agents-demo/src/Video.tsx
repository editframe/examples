/**
 * Video.tsx — Cursor Cloud Agents demo (v6, round-6 feedback)
 * Total: 20000ms (sum of scene durations below; no sequence overlap)
 *
 * Scene layout (sequence):
 *   Scene 1: 0–2500ms      — Chat window, bigger, no traffic lights, chatbox centered
 *   Scene 2: 2500–4500ms   — Camera zoom into dropdown, centered
 *   Scene 3: 4500–6500ms   — "Agents are only as useful..." tagline
 *   Scene 4: 6500–9000ms   — Create New Environment popup ("Start Agent" click at 8000ms)
 *   Scene 5: 9000–11500ms  — Checklist FULL completion
 *   Scene 6: 11500–16500ms — Two-panel paper-stack choreography
 *   Scene 7: 16500–18500ms — "Agents that work like developers do"
 *   Scene 8: 18500–20000ms — Cursor cube outro (white bg + cube mark)
 *
 * Music bed (LowTide, 66s-in segment) is baked (fade/loudnorm) into
 * src/assets/cursor-cloud-agents-demo-music.mp3 and pinned to the composition's total runtime via an
 * explicit `duration` (see the `composition`/`css-animations` skills and
 * allbirds-tree-runner-demo/src/Video.tsx for the reference pattern). The
 * "Start Agent" click SFX is a scene-local `<Audio offset>` cue inside
 * CreateEnv — see that file.
 */
import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import { Chatbox } from "./scenes/Chatbox";
import { ZoomToDropdown } from "./scenes/ZoomToDropdown";
import { Tagline } from "./scenes/Tagline";
import { CreateEnv } from "./scenes/CreateEnv";
import { Checklist } from "./scenes/Checklist";
import { FoldedPanels } from "./scenes/FoldedPanels";
import { DevTagline } from "./scenes/DevTagline";
import { CubeLogo } from "./scenes/CubeLogo";

const MUSIC = "/cursor-cloud-agents-demo/src/assets/cursor-cloud-agents-demo-music.mp3";
const TOTAL_MS = 20000;

export const Video: React.FC = () => (
  <Timegroup
    mode="contain"
    workbench
    className="relative w-full h-full overflow-hidden"
    style={{
      width: 1920,
      height: 1080,
      background: "#000000",
    }}
  >
    <Timegroup mode="sequence" className="absolute inset-0">
      <Chatbox />
      <ZoomToDropdown />
      <Tagline />
      <CreateEnv />
      <Checklist />
      <FoldedPanels />
      <DevTagline />
      <CubeLogo />
    </Timegroup>

    {/* Explicit duration (rather than `mode="fit"`, unsupported on <Audio>) pins this to the
        composition's total runtime regardless of the source file's own length. */}
    <Audio src={MUSIC} volume={1} duration={`${TOTAL_MS}ms`} />
  </Timegroup>
);
