import React from "react";
import { Timegroup } from "@editframe/react";
import { AmbientField } from "./components/AmbientField";
import { Hook } from "./scenes/Hook";
import { Hero } from "./scenes/Hero";
import { Athlete } from "./scenes/Athlete";
import { Feature } from "./scenes/Feature";
import { Fabric } from "./scenes/Fabric";
import { Colorways } from "./scenes/Colorways";
import { Cta } from "./scenes/Cta";
import { NEAR_BLACK, OVERLAP_MS } from "./constants";

/**
 * GYMSHARK — Geo Seamless · 9:16 · dark monochrome performance cut.
 * 1080×1920 @ 30fps, ~19s total.
 *
 * Seven scenes (see src/scenes/), each its OWN `<Timegroup mode="fixed">`, played by one
 * root `<Timegroup mode="sequence" overlap={OVERLAP_MS}>`. Every scene animates against
 * its own local clock via plain CSS `@keyframes` / `animation-delay` — there is no
 * master-ms clock and no imperative ref-driven style mutation anywhere in this
 * composition, except one deliberately-scoped `onFrame` inside Fabric.tsx for the three
 * spec-panel text readouts (see the comment there for why). See `src/constants.ts`
 * (`SCENES`) for how the scene durations + overlap add up to the total runtime, and the
 * `css-animations` / `composition` skills for the underlying timing model.
 *
 * HOOK       wordmark wipe-in + EFFORTLESS geo-camo drift on near-black
 * HERO       Geo Seamless tee settles clean, GEO SEAMLESS / T-SHIRT + $36
 * ATHLETE    training footage well + BUILT FOR THE GRIND / LOCKED-IN FIT
 * FEATURE    detail push + SEAMLESS KNIT · 4-WAY STRETCH · SWEAT-WICKING
 * FABRIC     fabric-macro well + ENGINEERED, NOT SEWN + kinetic spec panel
 * COLORWAYS  8-swatch selector cycling the range + main preview
 * CTA        real logo lockup → SHOP NOW → FROM $36 → GYMSHARK.COM
 *
 * Six inter-scene cuts, each a distinct "geo-camo mechanics" transition — see the
 * per-scene comments in src/scenes/ for what each one is doing (halftone dissolve,
 * gear-mesh shutter, spec-panel shatter, blueprint grid draw, rack split, halftone
 * converge). Every transition is owned by the INCOMING scene (its own entrance effect),
 * which keeps it on top in DOM/stacking order without needing z-index juggling — the
 * outgoing scene never needs a matching exit because the next scene's opaque entrance
 * effect is what erases it.
 *
 * This project intentionally keeps the silent-render + `add-audio.sh` two-step pipeline
 * (real athlete/fabric footage + music are composited after render — see README.md /
 * CREDITS.md) rather than moving to native `<Video>`/`<Audio>` elements; that re-sync is
 * out of scope here since there's no known upstream author repo to sync it from.
 */
export const Video: React.FC = () => (
  <Timegroup mode="contain" workbench className="w-[1080px] h-[1920px] relative overflow-hidden" style={{ background: NEAR_BLACK }}>
    <Timegroup mode="sequence" overlap={`${OVERLAP_MS}ms`} className="absolute inset-0">
      <Hook />
      <Hero />
      <Athlete />
      <Feature />
      <Fabric />
      <Colorways />
      <Cta />
    </Timegroup>

    <AmbientField />
  </Timegroup>
);
