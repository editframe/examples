import React from "react";
import { Timegroup } from "@editframe/react";
import { Reveal } from "../components/Reveal";
import { ProductCard } from "../components/ProductCard";
import { SCENES, LEFT_COL, DUSTY_ROSE, OAT, ESPRESSO, BROWN, SANS, SERIF } from "../constants";

const SUMMER_KIT = "/assets/flat/summer-kit.png";

/**
 * OFFER — The Summer Kit. 2200ms local (200ms cross-fades in as Range's montage
 * settles, 200ms cross-fades out as CTA's site-scroll takes over). The backdrop
 * rises into view (`wipe-rise-in`/`out` — the entrance grows from a sliver at the
 * bottom up, the mirror image of Hero/Result's top-down `wipe-y`), and the product
 * card settles with a small rotation ease before continuing to grow very slightly
 * for the rest of the beat, same split entrance/continuous-bob pattern as Hero.
 */
export const Offer: React.FC = () => (
  <Timegroup
    mode="fixed"
    duration={`${SCENES.offer.duration}ms`}
    className="absolute inset-0"
    style={{
      background: `radial-gradient(120% 90% at 40% 38%, ${DUSTY_ROSE} 0%, ${OAT} 75%)`,
      animation: [
        "wipe-rise-in 420ms 250ms cubic-bezier(0.33,1,0.68,1) backwards",
        "wipe-rise-out var(--ef-transition-duration) var(--ef-transition-out-start) cubic-bezier(0.45,0,0.55,1) forwards",
      ].join(", "),
    }}
  >
    <div style={{ position: "absolute", left: LEFT_COL, top: 240, fontFamily: SANS, fontWeight: 500, fontSize: 28, letterSpacing: 11, textTransform: "uppercase", color: BROWN }}>
      <Reveal enter={[600, 1050]} exit="transition" y={0} style={{ display: "inline-block" }}>
        limited edition
      </Reveal>
    </div>
    <div style={{ position: "absolute", left: LEFT_COL, top: 296, width: 900, fontFamily: SANS, fontWeight: 300, fontSize: 104, lineHeight: 0.92, letterSpacing: -1, color: ESPRESSO }}>
      <Reveal enter={[750, 1300]} exit="transition" y={30} style={{ display: "block" }}>
        the summer kit
      </Reveal>
    </div>

    <div className="absolute" style={{ left: "50%", top: "52%", animation: "offer-card-in 1700ms 250ms cubic-bezier(0.33,1,0.68,1) both" }}>
      <div style={{ animation: "card-bob 5650ms ease-in-out -900ms infinite" }}>
        <ProductCard
          src={SUMMER_KIT}
          cardW={760}
          cardH={660}
          imgPad={30}
          cardStyle={{ position: "relative", left: 0, top: 0, borderRadius: 40 }}
          imgStyle={{
            filter: "sepia(0.22) saturate(1.18) hue-rotate(-6deg) contrast(1.04) brightness(1.01)",
            animation: "product-bob 5650ms -1400ms ease-in-out infinite",
          }}
          glossStyle={{ animation: "gloss-sweep 1400ms 750ms cubic-bezier(0.45,0,0.55,1) both" }}
        />
      </div>
    </div>

    <div style={{ position: "absolute", left: LEFT_COL, top: 1470, transformOrigin: "left center" }}>
      <Reveal enter={[950, 1230]} exit="transition" easeIn="out-back" y={0} style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 100, color: ESPRESSO, textShadow: "0 1px 2px rgba(245,241,234,0.6)" }}>
        $100
      </Reveal>
    </div>
    <div style={{ position: "absolute", left: LEFT_COL, top: 1610, fontFamily: SANS, fontWeight: 400, fontSize: 28, letterSpacing: 5, color: BROWN }}>
      taupe pouch + three essentials
    </div>
  </Timegroup>
);
