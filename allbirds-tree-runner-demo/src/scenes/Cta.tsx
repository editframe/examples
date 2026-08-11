import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { Reveal } from "@shared/components/Reveal";
import { SCENES, W, INK, OAT, STONE, GEOGRAPH } from "../constants";

const TREE_LEFT = "/allbirds-tree-runner-demo/src/assets/tree-left.png";

const eyebrow: React.CSSProperties = {
  fontFamily: GEOGRAPH, fontWeight: 500, textTransform: "uppercase",
  color: STONE, letterSpacing: "3px",
};

/**
 * CTA / Outro — wordmark + "Shop Now" + B Corp proof + allbirds.com, clean on oat.
 * 3100ms local. Final beat — everything enters and holds, nothing exits.
 */
export const Cta: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.cta.duration}ms`} className="absolute inset-0">
    {/* mini floating preview shoe above the wordmark */}
    <div className="absolute" style={{ left: W / 2, top: "33%", width: 360, animation: "cta-shoe-in 800ms 350ms cubic-bezier(0.33,1,0.68,1) both" }}>
      <Image src={TREE_LEFT} style={{ width: "100%", height: "auto", mixBlendMode: "multiply", animation: "cta-mini-bob 3000ms ease-in-out infinite" }} />
    </div>

    <div className="absolute left-0 right-0 text-center" style={{ top: "49%" }}>
      <div
        style={{
          fontFamily: GEOGRAPH, fontWeight: 500, fontSize: 92, color: INK, lineHeight: 1,
          animation: "cta-mark-in 750ms 600ms cubic-bezier(0.33,1,0.68,1) both",
        }}
      >
        allbirds
      </div>

      <Reveal enter={[950, 1700]} y={18} className="inline-flex" style={{ marginTop: 40 }}>
        <div
          style={{
            background: INK, color: OAT, borderRadius: 999, padding: "22px 64px",
            fontFamily: GEOGRAPH, fontWeight: 500, fontSize: 26, letterSpacing: "1.5px", textTransform: "uppercase",
            animation: "cta-shop-pulse 1200ms ease-in-out infinite",
          }}
        >
          Shop Now
        </div>
      </Reveal>

      <Reveal enter={[1300, 2000]} y={16} style={{ ...eyebrow, fontSize: 15, marginTop: 44 }}>
        B Corp since 2016 · carbon-negative
      </Reveal>
      <Reveal
        enter={[1650, 2350]}
        y={14}
        style={{ fontFamily: GEOGRAPH, fontWeight: 400, fontSize: 24, color: STONE, marginTop: 16, letterSpacing: "0.06em" }}
      >
        allbirds.com
      </Reveal>
    </div>
  </Timegroup>
);
