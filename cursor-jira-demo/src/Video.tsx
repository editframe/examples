import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import { TicketScatter } from "./scenes/TicketScatter";
import { CursorJiraScene } from "./scenes/CursorJiraScene";
import { LogoCard } from "./scenes/LogoCard";

const MUSIC = "/assets/audio-bed.mp3";
const DURATION_MS = 28500; // 3500 (TicketScatter) + 21500 (CursorJiraScene) + 3500 (LogoCard)

/**
 * Cursor With Jira — v5 (Jeremy scrap-and-rebuild, 2026-05-23)
 * 1920×1080 @ 30fps
 *
 * Baseline = `EDITFRAMES Cursor With Jira Demo.mp4` in Downloads,
 * the version Jeremy approved EXCEPT he wants:
 *   - the codebase-scan ball-bouncing-into-boxes moment REMOVED
 *   - cursor camera ZOOM IN when the Agents pill activates
 *   - cursor camera ZOOM OUT when the user types "Thanks..."
 *   - word-tracking pan during composer typing kept (beloved)
 *   - NO EDITFRAME watermark on the end card
 *
 *   Scene 0: TicketScatter — 3D scatter + smash-zoom        3.5s
 *   Scene 1: CursorJiraScene — Jira surface with @Cursor  21.5s
 *            agent pill, rotating "Cursor is …" text,
 *            non-overlapping camera windows:
 *              [0–7.4)   locked 1.0x   (chrome build)
 *              [7.4–10.6) typing pan + gentle 1.0→1.18x
 *              [10.6–12)  hold 1.10x   (improve glow)
 *              [12–12.6)  ZOOM IN to Agents 1.10→1.45x
 *              [12.6–19.4) hold 1.45x  (agent text rotates)
 *              [19.4–20.3) ZOOM OUT to 1.0x ("Thanks…")
 *              [20.3+)    locked 1.0x  (posted comment)
 *   Scene 2: LogoCard — Cursor mark + wordmark on black     3.5s
 *   ──────────────────────────────────────────────────────── 28.5s
 *
 * v7 (2026-05-23): cut CursorJiraScene from 25s → 21.5s per client.
 * Jira content now ends at video t=25s; logo card runs 25–28.5s.
 *
 * Removed in v5: CodebaseOverlay.tsx (the bouncing-codebase scene).
 *
 * Refactor note: the three scenes above were already their own top-level
 * `<Timegroup mode="fixed">`s sequenced by this file's root `mode="sequence"`
 * Timegroup — that part of REFACTOR-PATTERNS.md Part 2b already matched.
 * What didn't: every scene's insides were a single `onFrame` switchboard
 * writing to refs every frame. LogoCard and TicketScatter's stagger/fades
 * (and almost all of CursorJiraScene's ~30 fade/translate/stagger elements)
 * are now plain CSS `@keyframes`/`Reveal` components instead. The camera-rig
 * transform in CursorJiraScene and TicketScatter's coupled 3D scatter+smash
 * zoom stay as scoped `addFrameTask`s (see the comments in those files for
 * why) — as does the handful of genuine dynamic TEXT CONTENT changes
 * (composer typing, rotating agent label, reply typing) in CursorJiraScene.
 */
export const Video = () => {
  return (
    <Timegroup
      workbench
      className="w-[1920px] h-[1080px] bg-white relative overflow-hidden"
      mode="contain"
    >
      <Timegroup mode="sequence" className="absolute w-full h-full">
        <TicketScatter />
        <CursorJiraScene />
        <LogoCard />
      </Timegroup>
      {/* Explicit duration (rather than `mode="fit"`, unsupported on <Audio>) pins this to
          the composition's total runtime regardless of the source file's own length. Sibling
          of the sequence (not a child of it) so it spans the whole timeline as a background
          track instead of being treated as an extra sequential scene. */}
      <Audio src={MUSIC} volume={1} duration={`${DURATION_MS}ms`} />
    </Timegroup>
  );
};
