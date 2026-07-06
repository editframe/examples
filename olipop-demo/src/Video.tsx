import React from "react";
import { Timegroup } from "@editframe/react";
import { AmbientField } from "./components/AmbientField";
import { Hook } from "./scenes/Hook";
import { Hero } from "./scenes/Hero";
import { Well } from "./scenes/Well";
import { Swap } from "./scenes/Swap";
import { Rainbow } from "./scenes/Rainbow";
import { Offer } from "./scenes/Offer";
import { Cta } from "./scenes/Cta";
import { OVERLAP_MS, TEAL_DEEP } from "./constants";

/**
 * OLIPOP — short-form social ad (9:16). 1080×1920 @ 30fps, 20s, silent (music + the real
 * video-well clip are muxed in afterward by `composite-well.sh` / `add-audio.sh`).
 *
 * Seven scenes (see src/scenes/), each its OWN `<Timegroup mode="fixed">`, played by one
 * root `<Timegroup mode="sequence" overlap={OVERLAP_MS}>`. Every scene animates against
 * its own local clock via plain CSS `@keyframes` / `--ef-progress` /
 * `--ef-transition-out-start` — there is no master-ms clock, no `onFrame`, and no
 * imperative ref-driven style mutation anywhere in this composition. See
 * `src/constants.ts` (`SCENES`) for how the scene durations + overlap add up to the
 * total runtime, and the `css-animations` / `composition` skills for the underlying
 * timing model.
 *
 * HOOK    wordmark mask-wipe + tagline bounce-settle on cream
 * HERO    Tropical Punch can push-in on coral sunburst + rings, rising bubbles
 * WELL    retro-TV badge holds stationary around the fixed video well (real clip composited in later)
 * SWAP    39g sugar struck through, OLIPOP 4g/9g-fiber card slams in
 * RAINBOW six flavor cans montage, then collapse into a 3×2 grid
 * OFFER   12-pack push-in, build your variety pack
 * CTA     drink olipop lockup + sparkle stars + drinkolipop.com
 */
export const Video: React.FC = () => (
  <Timegroup
    mode="contain"
    workbench
    className="w-[1080px] h-[1920px] relative overflow-hidden"
    style={{ background: TEAL_DEEP }}
  >
    {/* camera-drift wrapper — a gentle ambient breathing motion across the whole video.
        Approximated as one clean infinite loop rather than the original's three
        independent, incommensurate sine waves (dx/dy/scale on different periods), since
        combining those exactly isn't expressible as a single CSS keyframes loop and the
        effect is subtle background ambience, not a focal element. */}
    <div className="absolute inset-0" style={{ animation: "camera-drift 18000ms ease-in-out infinite" }}>
      <Timegroup mode="sequence" overlap={`${OVERLAP_MS}ms`} className="absolute inset-0">
        <Hook />
        <Hero />
        <Well />
        <Swap />
        <Rainbow />
        <Offer />
        <Cta />
      </Timegroup>
    </div>

    <AmbientField />
  </Timegroup>
);
