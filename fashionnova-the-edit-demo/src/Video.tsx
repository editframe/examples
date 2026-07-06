import React from "react";
import { Timegroup } from "@editframe/react";
import { AmbientField } from "./components/AmbientField";
import { Hud } from "./components/Hud";
import { Cover } from "./scenes/Cover";
import { SwingRack } from "./scenes/SwingRack";
import { FanToEdit } from "./scenes/FanToEdit";
import { SpecStack } from "./scenes/SpecStack";
import { Outro } from "./scenes/Outro";
import { OFF_WHITE, OVERLAP_MS } from "./constants";

/**
 * FASHION NOVA — "The Edit" · 9:16 · 1080×1920 @ 30fps, ~25s total.
 *
 * Five scenes (see src/scenes/), each its OWN `<Timegroup mode="fixed">`, played by one
 * root `<Timegroup mode="sequence" overlap={OVERLAP_MS}>`. Every scene animates against
 * its own local clock via plain CSS `@keyframes` / `--ef-transition-out-start` — there is
 * no master-ms clock and no imperative ref-driven style mutation anywhere in this
 * composition, except ONE narrowly-scoped `addFrameTask` inside `scenes/FanToEdit.tsx`
 * (see the comment there) and the live frame counter inside `components/Hud.tsx`. See
 * `src/constants.ts` (`SCENES`) for how the scene durations + overlap add up to the total
 * runtime, and the `css-animations` / `composition` skills for the underlying timing model.
 *
 * COVER       see-through FASHION/NOVA wordmark, ink bleeds through, silver tag
 * SWING RACK  big swing-tickets drop onto the rack, SHOP THE LOOK
 * FAN → EDIT  card-deck flies in → fans → deals into THE EDIT grid
 * SPEC STACK  full-frame dress-spec infographic, FINAL HOURS
 * OUTRO       image-filled FASHION NOVA lockup + URL
 */
export const Video: React.FC = () => (
  <Timegroup mode="contain" workbench className="w-[1080px] h-[1920px] relative overflow-hidden" style={{ background: OFF_WHITE }}>
    <div className="absolute" style={{ inset: -20, animation: "drift-wobble 5200ms ease-in-out infinite alternate" }}>
      <Timegroup mode="sequence" overlap={`${OVERLAP_MS}ms`} className="absolute inset-0">
        <Cover />
        <SwingRack />
        <FanToEdit />
        <SpecStack />
        <Outro />
      </Timegroup>

      <Hud />
      <AmbientField />
    </div>
  </Timegroup>
);
