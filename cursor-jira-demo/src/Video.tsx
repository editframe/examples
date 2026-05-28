import React from "react";
import { Timegroup } from "@editframe/react";
import { TicketScatter } from "./scenes/TicketScatter";
import { CursorJiraScene } from "./scenes/CursorJiraScene";
import { LogoCard } from "./scenes/LogoCard";

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
 */
export const Video = () => {
  return (
    <Timegroup
      workbench
      className="w-[1920px] h-[1080px] bg-white relative overflow-hidden"
      mode="sequence"
    >
      <TicketScatter />
      <CursorJiraScene />
      <LogoCard />
    </Timegroup>
  );
};
