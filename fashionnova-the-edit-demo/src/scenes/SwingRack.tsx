import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { SCENES, BLACK, WHITE, OFF_WHITE, INK, MONT, PRICE, SILVER, SILVER_GRAD } from "../constants";
import { RegMark } from "../components/RegMark";
import { Barcode } from "../components/Barcode";
import { CutFlash } from "../components/CutFlash";

const TEX_PAPER = "/assets/tex-paper.png";

// perforated dashed edge (swing-tag look)
const PERF = `repeating-linear-gradient(90deg, ${BLACK} 0 7px, transparent 7px 14px)`;

const cover = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...extra,
});

// BIGGER tags (fill the frame): src, badge no., x offset, card size, string length
const TAGS = [
  { src: "/assets/dress-2.jpg", num: "01", x: 60, tw: 366, th: 600, str: 110 },
  { src: "/assets/ed01.jpg", num: "02", x: 380, tw: 396, th: 640, str: 250 },
  { src: "/assets/ed11.jpg", num: "03", x: 728, tw: 366, th: 600, str: 150 },
];

/** Swing-ticket TAG face (look photo cropped in + mono/silver chrome). */
const SwingTicket: React.FC<{ src: string; num: string; tw: number; th: number }> = ({ src, num, tw, th }) => (
  <div style={{ width: tw, height: th, background: OFF_WHITE, position: "relative", boxShadow: "0 24px 50px rgba(0,0,0,0.55)", border: `2px solid ${BLACK}` }}>
    <div style={{ position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", width: 30, height: 30, borderRadius: "50%", background: BLACK }}>
      <div style={{ position: "absolute", inset: 8, borderRadius: "50%", background: OFF_WHITE }} />
    </div>
    <div style={{ position: "absolute", top: 58, left: 14, right: 14, height: 3, background: PERF }} />
    <div style={{ position: "absolute", top: 72, left: 16, fontWeight: 900, fontSize: 36, color: BLACK, fontFamily: MONT }}>{num}</div>
    <div style={{ position: "absolute", top: 80, right: 16, fontWeight: 700, fontSize: 15, letterSpacing: "0.18em", color: BLACK, fontFamily: MONT }}>NOVA BABE</div>
    <div style={{ position: "absolute", top: 118, left: 16, right: 16, bottom: 100, overflow: "hidden", background: BLACK }}>
      <Image src={src} style={cover()} />
    </div>
    <div style={{ position: "absolute", bottom: 50, left: 16, background: SILVER_GRAD, color: BLACK, fontWeight: 900, fontSize: 28, padding: "5px 14px", fontFamily: MONT, border: `2px solid ${BLACK}`, transform: "rotate(-3deg)" }}>{PRICE}</div>
    <div style={{ position: "absolute", bottom: 16, left: 16 }}><Barcode w={tw - 32} h={22} /></div>
    <div style={{ position: "absolute", bottom: 54, right: 16, fontWeight: 800, fontSize: 13, letterSpacing: "0.12em", color: BLACK, fontFamily: MONT, textAlign: "right", lineHeight: 1.1 }}>SHOP<br />THE LOOK</div>
  </div>
);

/**
 * SWING RACK — big swing-tickets drop onto a rail under a "SHOP THE LOOK" header.
 * 5300ms local: first 300ms is the tail of Cover's exit-compress; the rail + tags start
 * dropping essentially at the cut (matching the original's "already dropping" no-dead-
 * frame cut). Each tag's post-drop sway is simplified to a constant-amplitude infinite
 * sway (the original decayed from a wide swing down to a settled ~3.4° over 1.5s —
 * a reasonable simplification; see CREDITS/refactor notes).
 */
export const SwingRack: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.swingRack.duration}ms`} className="absolute inset-0" style={{ fontFamily: MONT, color: BLACK, background: INK }}>
    <CutFlash />
    <Image src={TEX_PAPER} style={cover({ opacity: 0.1, mixBlendMode: "screen" })} />
    <div className="absolute inset-0" style={{ background: "radial-gradient(120% 80% at 50% 30%, rgba(255,255,255,0.06), rgba(0,0,0,0) 60%)" }} />
    <RegMark style={{ top: 40, left: 40 }} />
    <RegMark style={{ top: 40, right: 40 }} />

    {/* header — SILVER chip */}
    <div className="absolute left-0 right-0 text-center" style={{ top: 84, animation: "swingrack-head-in 400ms 260ms cubic-bezier(0.33,1,0.68,1) both" }}>
      <div style={{ display: "inline-block", background: SILVER_GRAD, color: BLACK, fontWeight: 900, fontSize: 32, padding: "7px 20px", letterSpacing: "0.04em", fontFamily: MONT, border: `2px solid ${BLACK}`, transform: "rotate(-1.5deg)" }}>SHOP THE LOOK</div>
      <div style={{ marginTop: 12, fontWeight: 800, fontSize: 20, letterSpacing: "0.34em", color: WHITE, fontFamily: MONT }}>NEW ARRIVALS · UP TO 80% OFF</div>
    </div>

    {/* giant background watermark */}
    <div style={{ position: "absolute", left: "50%", top: "72%", transform: "translate(-50%,-50%) rotate(-8deg)", fontWeight: 900, fontSize: 460, lineHeight: 0.8, color: "rgba(255,255,255,0.05)", fontFamily: MONT, whiteSpace: "nowrap", letterSpacing: "-0.04em", pointerEvents: "none" }}>SALE</div>

    {/* vertical brand ticker rails */}
    <div style={{ position: "absolute", top: 420, bottom: 120, left: 18, width: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontWeight: 800, fontSize: 16, letterSpacing: "0.4em", color: "rgba(255,255,255,0.4)", fontFamily: MONT }}>UP TO 80% OFF · FINAL HOURS</div>
    </div>
    <div style={{ position: "absolute", top: 420, bottom: 120, right: 18, width: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ writingMode: "vertical-rl", fontWeight: 800, fontSize: 16, letterSpacing: "0.4em", color: "rgba(255,255,255,0.4)", fontFamily: MONT }}>NOVA BABE · SHOP THE LOOK</div>
    </div>

    {/* rail */}
    <div className="absolute" style={{ top: 410, left: 64, right: 64, height: 7, background: WHITE, borderRadius: 4, boxShadow: "0 6px 18px rgba(0,0,0,0.7)", transformOrigin: "0% 50%", animation: "swingrack-rail-in 400ms 180ms cubic-bezier(0.33,1,0.68,1) both" }} />
    <div className="absolute" style={{ top: 406, left: 54, width: 16, height: 16, borderRadius: "50%", background: WHITE }} />
    <div className="absolute" style={{ top: 406, right: 54, width: 16, height: 16, borderRadius: "50%", background: WHITE }} />

    {/* 3 swing-tickets */}
    {TAGS.map((t, i) => (
      <div
        key={i}
        className="absolute"
        style={{
          top: 410 + t.str, left: t.x,
          animation: [
            `swingrack-tag-fade 220ms ${360 + i * 300}ms cubic-bezier(0.33,1,0.68,1) both`,
            `swingrack-tag-drop 560ms ${360 + i * 300}ms cubic-bezier(0.34,1.56,0.64,1) both`,
          ].join(", "),
        }}
      >
        <div
          style={{
            position: "relative", transformOrigin: `50% ${-t.str}px`,
            animation: `swingrack-tag-sway ${(200 + i * 22) * 6.283}ms ease-in-out ${-(i * 300)}ms infinite`,
          }}
        >
          <div style={{ position: "absolute", left: "50%", bottom: "100%", width: 3, height: t.str, background: WHITE, transform: "translateX(-50%)" }} />
          <div style={{ position: "absolute", left: "50%", bottom: "100%", width: 16, height: 16, border: `3px solid ${WHITE}`, borderRadius: "50%", transform: "translate(-50%, 4px)", background: INK }} />
          <SwingTicket src={t.src} num={t.num} tw={t.tw} th={t.th} />
        </div>
      </div>
    ))}

    {/* ticker footer */}
    <div className="absolute left-0 right-0 text-center" style={{ bottom: 56, fontWeight: 900, fontSize: 24, letterSpacing: "0.26em", color: SILVER, fontFamily: MONT }}>03 LOOKS · {PRICE} EACH · FASHIONNOVA.COM</div>
  </Timegroup>
);
