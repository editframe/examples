import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import { Hook } from "./scenes/Hook";
import { Hero } from "./scenes/Hero";
import { Application } from "./scenes/Application";
import { Result } from "./scenes/Result";
import { Range } from "./scenes/Range";
import { Offer } from "./scenes/Offer";
import { Cta } from "./scenes/Cta";
import { DewyBridge } from "./components/DewyBridge";
import { OAT, GRAIN, OVERLAP_MS, DURATION_MS } from "./constants";

const MUSIC = "/rhode-demo/src/assets/rhode-demo-music-bed.mp3";

/**
 * rhode — "summer '26" eCommerce product ad. 1080×1920 portrait @ 30fps, ~20s total.
 *
 * Seven beats (see src/scenes/), each its OWN `<Timegroup mode="fixed">`, played by
 * one root `<Timegroup mode="sequence" overlap={OVERLAP_MS}>`. Every scene animates
 * against its own local clock via plain CSS `@keyframes` / `--ef-progress` /
 * `--ef-transition-out-start` — there is no master-ms clock, no `onFrame`, and no
 * imperative ref-driven style mutation anywhere in this composition. See
 * `src/constants.ts` (`SCENES`) for how the scene durations + overlap add up to the
 * total runtime.
 *
 * HOOK          wordmark draw-in, "limited edition" / "summer '26"
 * HERO          dusty-rose block wipe, Highlight Milk push-in, "the dewy look", $28
 * APPLICATION   video-in-frame well 1 (real footage composited outside this file)
 * RESULT        skin macro Ken-Burns + well 2 + lip-swatch grid, "glassy, lit-from-within"
 * RANGE         kinetic montage — sip, macadamia, the summer kit + prices
 * OFFER         the summer kit, $100, "limited edition"
 * CTA           stylized rhode site-scroll resolving to "shop rhode" + rhodeskin.com
 *
 * `DewyBridge` (the "dewy texture" sensorial macro) sits OUTSIDE the sequence, as a
 * sibling — see that component's doc comment for why.
 */
export const Video: React.FC = () => (
  <Timegroup mode="contain" workbench className="w-[1080px] h-[1920px] relative overflow-hidden" style={{ background: OAT }}>
    <Timegroup mode="sequence" overlap={`${OVERLAP_MS}ms`} className="absolute inset-0">
      <Hook />
      <Hero />
      <Application />
      <Result />
      <Range />
      <Offer />
      <Cta />
    </Timegroup>

    <DewyBridge />

    {/* whole-video ambient layers — film grain + edge vignette, always on, no animation */}
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 40, backgroundImage: GRAIN, backgroundSize: "160px 160px", opacity: 0.04, mixBlendMode: "overlay" }} />
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 41, background: "radial-gradient(130% 100% at 50% 45%, rgba(0,0,0,0) 60%, rgba(42,35,32,0.16) 100%)" }}
    />

    {/* Explicit duration (rather than `mode="fit"`, unsupported on <Audio>) pins this to the
        composition's total runtime regardless of the source file's own length. */}
    <Audio src={MUSIC} volume={1} duration={`${DURATION_MS}ms`} />
  </Timegroup>
);
