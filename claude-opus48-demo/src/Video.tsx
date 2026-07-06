import React from "react";
import { Timegroup } from "@editframe/react";
import Background from "./components/Background";
import MenuBar from "./components/MenuBar";
import CreatureAndKites from "./components/CreatureAndKites";
import NotificationStack from "./components/NotificationStack";
import TraceOverlay from "./components/TraceOverlay";
import { Hero } from "./scenes/Hero";
import { Headlines } from "./scenes/Headlines";
import { Command } from "./scenes/Command";
import { OVERLAP_MS, TRACE_MODE } from "./constants";

/**
 * Opus 4.8 ad — 1:1 reproduction, 0–25s.
 * 1920×1080 @ 30fps.
 *
 * Three scenes (see src/scenes/), each its OWN `<Timegroup mode="fixed">`, played
 * by one root `<Timegroup mode="sequence" overlap={OVERLAP_MS}>`. Every scene
 * animates against its own local clock via plain CSS `@keyframes` /
 * `animation-delay` / `--ef-transition-*` — there is no master-ms clock, no
 * `onFrame`, and no imperative ref-driven style mutation anywhere in this
 * composition. See `src/constants.ts` (`SCENES`) for how the scene durations +
 * overlap add up to the total runtime, and the `css-animations` / `composition`
 * skills for the underlying timing model.
 *
 * HERO       terminal scales in, status line builds up, needs-input list fills
 * HEADLINES  "Long-running tasks / shouldn't run your life" then "Introducing Opus 4.8"
 * COMMAND    terminal returns, camera pushes in, command types on, code streams in
 *
 * Two motifs run continuously ACROSS scene boundaries and so are rendered as
 * their own components (siblings of the scene sequence, not scene content —
 * see each component's doc comment):
 *   CreatureAndKites   perches in Hero, walks, roams through Headlines, exits
 *                      as Command begins
 *   NotificationStack  small cards dock top-right mid-Command, then grow +
 *                      center + settle through to the end of the video
 */
export const Video: React.FC = () => (
  <Timegroup
    mode="contain"
    workbench
    className="w-[1920px] h-[1080px] relative overflow-hidden"
    style={{ background: "var(--paper)" }}
  >
    <Background />
    <MenuBar />

    <Timegroup mode="sequence" overlap={`${OVERLAP_MS}ms`} className="absolute inset-0">
      <Hero />
      <Headlines />
      <Command />
    </Timegroup>

    <CreatureAndKites />
    <NotificationStack />

    {/* Trace overlay (off by default) */}
    {TRACE_MODE && <TraceOverlay />}
  </Timegroup>
);

export default Video;
