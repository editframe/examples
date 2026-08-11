import React from "react";
import { Image } from "@editframe/react";
import { Reveal } from "@shared/components/Reveal";
import { W, SOFT_PINK, WARM_WHITE, SANS, SERIF, GRAIN } from "../constants";

const GEM_DEWY_MACRO = "/rhode-demo/src/assets/gem-dewy-macro.jpg";

/**
 * DEWY TEXTURE bridge — sensorial macro of the blush cream swirl, "the dewy finish /
 * skin-first glow". A short (~1.5s) beat that visually overlaps BOTH the tail of
 * Application (well 1 closing, ~9.0s) and the head of Result (well 2 + skin macro
 * revealing, ~9.3–9.7s) at once, by up to 1.2s — more overlap than any other transition
 * in this cut. The root `<Timegroup mode="sequence">` only supports a single uniform
 * `overlap` value shared by every pair of scenes, so this beat can't be modeled as an
 * ordinary sequenced scene without either distorting that shared value or duplicating it
 * into Application/Result's own durations.
 *
 * Instead — same pattern as `AmbientField` in the reference implementation — this is a
 * plain sibling of the scene sequence, not nested in any `Timegroup mode="fixed"` scene.
 * Its own local time is therefore the WHOLE composition's own local time, so the original
 * absolute-ms cues (9000, 9220, 10050, 10350, 10500, …) carry over completely unchanged
 * — no scene-local subtraction needed here, unlike every file under `src/scenes/`.
 */
export const DewyBridge: React.FC = () => (
  <div
    className="absolute left-0 top-0 overflow-hidden pointer-events-none"
    style={{
      width: W,
      height: 1120, // upper region only — clears the WELL 2 window (y >= 1180)
      zIndex: 5, // above Application + Result during the handoff, peels up & away by 10.4s
      background: SOFT_PINK,
      animation: [
        "dewy-in 220ms 9000ms cubic-bezier(0.33,1,0.68,1) backwards",
        "dewy-fade-out 300ms 10050ms cubic-bezier(0.45,0,0.55,1) forwards",
        "dewy-lift-out 450ms 10050ms cubic-bezier(0.45,0,0.55,1) forwards",
      ].join(", "),
    }}
  >
    <Image
      src={GEM_DEWY_MACRO}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: 1380,
        objectFit: "cover",
        objectPosition: "50% 40%",
        filter: "saturate(1.08) contrast(1.04) brightness(1.02)",
        animation: "dewy-img-push 1400ms 9000ms cubic-bezier(0.33,1,0.68,1) both",
      }}
    />
    {/* soft grain + warm vignette to make the macro feel sensorial/tactile */}
    <div
      className="absolute inset-0"
      style={{ backgroundImage: GRAIN, backgroundSize: "150px 150px", opacity: 0.09, mixBlendMode: "overlay" }}
    />
    <div
      className="absolute inset-0"
      style={{ background: "radial-gradient(120% 100% at 50% 42%, rgba(0,0,0,0) 50%, rgba(74,53,40,0.3) 100%)" }}
    />
    {/* base scrim so caption reads */}
    <div
      className="absolute left-0 right-0 bottom-0"
      style={{ height: 520, background: "linear-gradient(to bottom, rgba(74,53,40,0) 0%, rgba(74,53,40,0.5) 100%)" }}
    />
    {/* text-align centering (not translateX) so it doesn't fight Reveal's own translateY transform */}
    <div className="absolute left-0 right-0 text-center" style={{ top: 880 }}>
      <Reveal
        enter={[9180, 9560]}
        exit={[10050, 10350]}
        style={{
          fontFamily: SERIF,
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: 82,
          color: WARM_WHITE,
          textShadow: "0 2px 20px rgba(42,35,32,0.55)",
          whiteSpace: "nowrap",
        }}
      >
        the dewy finish
      </Reveal>
      <Reveal
        enter={[9360, 9720]}
        exit={[10050, 10350]}
        style={{
          marginTop: 40,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: 8,
          textTransform: "uppercase",
          color: WARM_WHITE,
          textShadow: "0 2px 14px rgba(42,35,32,0.6)",
          whiteSpace: "nowrap",
        }}
      >
        skin-first glow
      </Reveal>
    </div>
  </div>
);
