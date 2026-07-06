import React from "react";
import { Timegroup } from "@editframe/react";
import { Reveal } from "../components/Reveal";
import { ProductCard } from "../components/ProductCard";
import { SCENES, LEFT_COL, DUSTY_ROSE, SOFT_PINK, ESPRESSO, BROWN, COCOA, SANS, SERIF } from "../constants";

const HIGHLIGHT_MILK = "/assets/flat/highlight-milk.png";

/**
 * HERO 1 — Highlight Milk. 2600ms local (200ms cross-fades in from Hook, 200ms
 * cross-fades out as Application's video well takes over). The dusty-rose backdrop
 * wipes on as its own shape-morph (`wipe-y-in`/`out`, a full-bleed clip-path reveal
 * — this scene's own version of a "shape morph" transition, category 4), the product
 * card lands with an overshoot settle then keeps growing very slightly for the rest of
 * the beat, and drifts with a slow weightless bob (continuous, category 3 — split into
 * an outer entrance wrapper + inner bob wrapper per the split-motion pattern).
 */
export const Hero: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.hero.duration}ms`} className="absolute inset-0">
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(158deg, ${DUSTY_ROSE} 0%, ${DUSTY_ROSE} 42%, ${SOFT_PINK} 100%)`,
        animation: [
          "wipe-y-in 420ms 250ms cubic-bezier(0.33,1,0.68,1) backwards",
          "wipe-y-out var(--ef-transition-duration) var(--ef-transition-out-start) cubic-bezier(0.45,0,0.55,1) forwards",
        ].join(", "),
      }}
    />

    {/* card: outer wrapper = anchor + entrance pop/grow, inner wrapper = continuous bob */}
    <div
      className="absolute"
      style={{
        left: "50%",
        top: "46%",
        animation: "hero-card-in 2250ms 250ms cubic-bezier(0.33,1,0.68,1) both",
      }}
    >
      <div style={{ animation: "card-bob 6900ms ease-in-out infinite" }}>
        <ProductCard
          src={HIGHLIGHT_MILK}
          cardW={720}
          cardH={820}
          imgPad={44}
          cardStyle={{ position: "relative", left: 0, top: 0 }}
          imgStyle={{
            animation: [
              // focus-pull: the product resolves from a soft studio blur to fully crisp
              "hero-focus-pull 280ms 670ms cubic-bezier(0.33,1,0.68,1) both",
              "product-bob 6900ms -1700ms ease-in-out infinite",
            ].join(", "),
          }}
          glossStyle={{ animation: "gloss-sweep 1400ms 950ms cubic-bezier(0.45,0,0.55,1) both" }}
        />
        {/* cap glint — a single diagonal light sweep across the cap */}
        <div
          className="absolute"
          style={{
            left: "50%",
            top: -260,
            width: 360,
            height: 220,
            background: "linear-gradient(120deg, rgba(237,230,218,0) 42%, rgba(237,230,218,0.6) 50%, rgba(237,230,218,0) 58%)",
            filter: "blur(2px)",
            pointerEvents: "none",
            animation: "cap-glint-sweep 800ms 1200ms cubic-bezier(0.45,0,0.55,1) both",
          }}
        />
      </div>
    </div>

    <div style={{ position: "absolute", left: LEFT_COL, top: 220, fontFamily: SANS, fontWeight: 500, fontSize: 26, letterSpacing: 9, textTransform: "uppercase", color: BROWN }}>
      <Reveal enter={[550, 1000]} exit="transition" y={0} exitY={0} style={{ display: "inline-block" }}>
        highlight milk
      </Reveal>
    </div>
    <div style={{ position: "absolute", left: LEFT_COL, top: 266, fontFamily: SANS, fontWeight: 300, fontSize: 132, lineHeight: 0.9, letterSpacing: -1, color: ESPRESSO }}>
      <Reveal enter={[700, 1300]} exit="transition" y={34} style={{ display: "block" }}>
        the dewy
        <br />
        look
      </Reveal>
    </div>
    <div style={{ position: "absolute", left: LEFT_COL, top: 1500, transformOrigin: "left center" }}>
      <Reveal enter={[1300, 1650]} exit="transition" easeIn="out-back" y={0} style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 76, color: ESPRESSO }}>
        $28
      </Reveal>
    </div>
    <div style={{ position: "absolute", left: LEFT_COL, top: 1602 }}>
      <Reveal enter={[1550, 2000]} exit="transition" y={0} style={{ fontFamily: SANS, fontWeight: 500, fontSize: 26, letterSpacing: 4, color: COCOA }}>
        multipurpose luminizer
      </Reveal>
    </div>
  </Timegroup>
);
