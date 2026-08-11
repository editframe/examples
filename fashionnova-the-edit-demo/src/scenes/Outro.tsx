import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { SCENES, BLACK, WHITE, MONT, SILVER_GRAD } from "../constants";
import { CutFlash } from "../components/CutFlash";
import { textWindow } from "../components/textStyles";

const TEX_INK = "/fashionnova-the-edit-demo/src/assets/tex-ink.png";
const DRESS_2 = "/fashionnova-the-edit-demo/src/assets/dress-2.jpg";
const DRESS_3 = "/fashionnova-the-edit-demo/src/assets/dress-3.jpg";

/**
 * OUTRO — image-filled FASHION NOVA lockup + URL, no redundant %OFF tag.
 * 5800ms local; first 300ms is the tail of SpecStack's crossfade. Last scene — everything
 * enters and holds, nothing exits.
 */
export const Outro: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.outro.duration}ms`} className="absolute inset-0" style={{ fontFamily: MONT, color: WHITE }}>
    <CutFlash />
    <div className="absolute inset-5" style={{ background: BLACK }} />
    {/* ink pour confined to lower third */}
    <div className="absolute overflow-hidden" style={{ left: 20, right: 20, bottom: 20, height: "42%", opacity: 0.5 }}>
      <Image src={TEX_INK} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 10%", filter: "invert(1)", opacity: 0.3, mixBlendMode: "screen", transform: "scaleY(-1)" }} />
    </div>
    <div className="absolute inset-5" style={{ background: "radial-gradient(ellipse 70% 45% at 50% 36%, rgba(255,255,255,0.07), transparent 70%)" }} />
    {/* top rule */}
    <div className="absolute flex justify-between" style={{ top: 70, left: 76, right: 76, fontWeight: 700, fontSize: 24, letterSpacing: 3, borderBottom: "2px solid rgba(255,255,255,0.4)", paddingBottom: 14 }}>
      <span>THE FALL EDIT</span><span>ISSUE Nº 07</span>
    </div>

    {/* image-filled FASHION NOVA, centered */}
    <div className="absolute left-0 right-0 text-center" style={{ top: "40%", transform: "translateY(-50%)" }}>
      <div
        style={{
          fontWeight: 900, fontSize: 230, lineHeight: 0.84, letterSpacing: "-0.02em",
          ...textWindow(DRESS_2, "center 14%", "170%"),
          animation: [
            "outro-fash-fade 180ms 500ms cubic-bezier(0.33,1,0.68,1) both",
            "outro-fash-slide 700ms 500ms cubic-bezier(0.34,1.56,0.64,1) both",
            "outro-fash-pan 5500ms 300ms cubic-bezier(0.45,0,0.55,1) both",
          ].join(", "),
        }}
      >
        FASHION
      </div>
      <div
        style={{
          fontWeight: 900, fontSize: 330, lineHeight: 0.8, letterSpacing: "-0.03em",
          ...textWindow(DRESS_3, "center 18%", "150%"),
          animation: [
            "outro-nova-fade 180ms 660ms cubic-bezier(0.33,1,0.68,1) both",
            "outro-nova-slide 700ms 660ms cubic-bezier(0.34,1.56,0.64,1) both",
            "outro-nova-pan 5500ms 300ms cubic-bezier(0.45,0,0.55,1) both",
          ].join(", "),
        }}
      >
        NOVA
      </div>
    </div>

    {/* silver underline */}
    <div className="absolute" style={{ top: "60%", left: 160, right: 160, height: 8, background: SILVER_GRAD, transformOrigin: "center", animation: "outro-under-in 600ms 1300ms cubic-bezier(0.33,1,0.68,1) both" }} />
    {/* url */}
    <div className="absolute left-0 right-0 text-center" style={{ top: "65%", fontWeight: 800, fontSize: 50, letterSpacing: 12, animation: "outro-url-in 480ms 1800ms cubic-bezier(0.33,1,0.68,1) both" }}>FASHIONNOVA.COM</div>
    <div className="absolute left-0 right-0 text-center" style={{ top: "71%", color: "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: 30, letterSpacing: 6 }}>NEW ARRIVALS DAILY</div>
  </Timegroup>
);
