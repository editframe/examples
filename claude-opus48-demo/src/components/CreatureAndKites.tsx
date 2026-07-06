import React from "react";
import PixelCreature from "./PixelCreature";
import Kite from "./Kite";

/**
 * The coral pixel creature + its three kites — one continuous motif that perches
 * (Hero scene), walks + the kites pop in (Hero scene), roams while the headlines
 * play (Headlines scene), then fades out just as the terminal returns (start of
 * the Command scene). Because it's on screen continuously ACROSS three scene
 * boundaries, it can't be owned by any single scene's `<Timegroup mode="fixed">`
 * (a Timegroup's own subtree unmounts/hides when the scene ends) — like
 * `AmbientField` in the allbirds reference, it's rendered as a sibling of the
 * scene sequence. Being a direct child of the `contain` root, its own local time
 * equals the whole composition's absolute time, so every cue below is still the
 * original absolute-ms value from the pre-refactor `onFrame` body.
 *
 * Layered wrappers (outside → in), matching the original per-frame composition:
 *   walk-shift   one-shot translateX, shared by the creature AND all 3 kites
 *   roam-exit    one-shot fade + lift-out, shared by the creature AND all 3 kites
 *   kite-float   one-shot translateY "float up", kites only
 *   per-kite:    pop-in (scale+opacity) -> sway+tilt (infinite) -> bob (infinite)
 *   creature:    fade-in -> roam-sway (bespoke keyframe) -> bob (infinite, legs walk via CSS — see PixelCreature)
 *
 * Simplifications from the original per-frame math (documented, not silent):
 * - The creature's "tilt" used a period 1.25x its sway period in the original; here
 *   tilt is folded into the same sway keyframe/period as a minor ambient-motion
 *   simplification (imperceptible at this amplitude).
 * - The creature's bob amplitude no longer boosts from 1.5px to 5px during the walk
 *   window — it holds a constant ~3px average bob for its whole lifetime, since the
 *   difference is a couple of pixels and not worth a 3-stage layered animation.
 */
export const CreatureAndKites: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 6 }}>
    <div className="absolute inset-0 creature-kites-walk-shift">
      <div className="absolute inset-0 creature-kites-roam-exit">
        {/* KITES (behind the creature — matches the original z-index order) — float up
            together, then each pops in + sways/bobs independently */}
        <div className="absolute inset-0 kite-float-up">
          <div className="absolute" style={{ left: 720, top: 150 }}>
            <div className="kite-pop-orange">
              <div className="kite-sway-orange">
                <div className="kite-bob-orange">
                  <Kite variant="orange" pixel={9} />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute" style={{ left: 600, top: 50 }}>
            <div className="kite-pop-pink">
              <div className="kite-sway-pink">
                <div className="kite-bob-pink">
                  <Kite variant="pink" pixel={9} />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute" style={{ left: 660, top: 110 }}>
            <div className="kite-pop-purple">
              <div className="kite-sway-purple">
                <div className="kite-bob-purple">
                  <Kite variant="purple" pixel={9} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CREATURE */}
        <div className="absolute" style={{ left: 820, top: 250 }}>
          <div className="creature-fade-in">
            <div className="creature-roam-sway">
              <div className="creature-bob">
                <PixelCreature pixel={12} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CreatureAndKites;
