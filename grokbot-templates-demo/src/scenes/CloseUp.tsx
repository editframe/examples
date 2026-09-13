/**
 * CloseUp — Slide 7 (10.07–11.70s, 1633ms, global frames 303–351).
 *
 * The template card zooms to full-screen, the cursor enters, hovers over the
 * "Open in Grok Bot" button, presses, then the whole card whips off-screen.
 * Scene-scoped addFrameTask for S7CARD, S7WHIP, S7PRESS, HAND7 tables.
 */
import React, { useEffect, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { Tx, Box, BigHand, look, lc, toGlobalFrame, pinWidths, fontsReady, type TgEl } from "../components/ui";
import { Blob, SH_R, SH_B } from "../components/shapes";
import { HERO_BG } from "../lib/bg";
import { S7CARD, S7WHIP, S7PRESS, HAND7 } from "../lib/motion789";
import { CLOSE_UP_MS, CLOSE_UP_F0 } from "../constants";

const SH7 = "rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.064) 7%, rgba(0,0,0,0.055) 14%, rgba(0,0,0,0.047) 21%, rgba(0,0,0,0.034) 28%, rgba(0,0,0,0.03) 35%, rgba(0,0,0,0.025) 42%, rgba(0,0,0,0.025) 49%, rgba(0,0,0,0.021) 56%, rgba(0,0,0,0.017) 63%, rgba(0,0,0,0.017) 70%, rgba(0,0,0,0.004) 77%, rgba(0,0,0,0.004) 92%, rgba(0,0,0,0) 100%";
const SH7_R = `linear-gradient(90deg, ${SH7})`, SH7_B = `linear-gradient(180deg, ${SH7})`;

export const CloseUp: React.FC = () => {
  const rootRef = useRef<TgEl>(null);

  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;
    tg.initializer = (inst) => {
      const cache = new Map<string, HTMLElement | null>();
      const g = (sel: string) => { if (!cache.has(sel)) cache.set(sel, inst.querySelector(sel) as HTMLElement | null); return cache.get(sel)!; };
      const st = (el: HTMLElement | null, k: string, v: string) => { if (el && (el.style as any)[k] !== v) (el.style as any)[k] = v; };
      const op = (sel: string, v: number) => st(g(sel), "opacity", String(v));
      const tf = (sel: string, v: string) => st(g(sel), "transform", v);
      const allCache = new Map<string, HTMLElement[]>();
      const fadeParts = (sel: string, gray: number) => { if (!allCache.has(sel)) allCache.set(sel, Array.from(inst.querySelectorAll(sel)) as HTMLElement[]); const col = `rgb(${gray},${gray},${gray})`; allCache.get(sel)!.forEach((el) => st(el, "background", col)); };
      const opAll = (sel: string, v: number) => {
        if (!allCache.has(sel)) allCache.set(sel, Array.from(inst.querySelectorAll(sel)) as HTMLElement[]);
        allCache.get(sel)!.forEach((el) => st(el, "opacity", String(v)));
      };

      let prepared = false;
      const render = (ms: number) => {
        const f = toGlobalFrame(ms, CLOSE_UP_F0);

        /* card zoom + whip */
        const c = look(S7CARD, f) || S7CARD[0]; const wx = lc(S7WHIP, f);
        tf(".card7", `translate(${(c[1] + wx).toFixed(1)}px, ${c[2].toFixed(1)}px) scale(${c[3].toFixed(4)})`);
        st(g(".btn7bg"), "background", f >= 318 ? "rgb(41,41,41)" : "#060606");
        tf(".btn7", `scale(${lc(S7PRESS, f).toFixed(4)})`);

        /* big hand cursor */
        const h7 = f >= 311 && f <= 352 ? look(HAND7, f) : null;
        op(".cur7", h7 ? 1 : 0); opAll(".cur7 .k7", h7 ? h7[4] : 1);
        { const a7 = h7 ? h7[4] : 1; const w7 = Math.round(236 + 19 * a7);
          fadeParts(".cur7 .k7c", Math.round(236 * (1 - a7))); fadeParts(".cur7 .w7", w7); fadeParts(".cur7 .w7c", w7); }
        if (h7) tf(".cur7", `translate(${h7[1].toFixed(1)}px, ${h7[2].toFixed(1)}px) scale(${h7[3].toFixed(4)})`);
      };

      const cleanup = inst.addFrameTask(({ ownCurrentTimeMs }) => {
        if (!prepared) { pinWidths(inst); if (fontsReady()) prepared = true; }
        render(ownCurrentTimeMs);
      });
      render(0);
      return cleanup;
    };
    return () => { tg.initializer = undefined; };
  }, []);

  return (
    <Timegroup ref={rootRef as React.Ref<HTMLElement>} mode="fixed" duration={`${CLOSE_UP_MS}ms`} className="scene">
      <div style={{ position: "absolute", inset: 0, background: "#ECECEC" }}>
        <div className="card7" style={{ position: "absolute", left: 0, top: 0, width: 781, height: 687, transformOrigin: "0 0" }}>
          <div style={{ position: "absolute", left: 781, top: 30, width: 24, height: 657, background: SH7_R }} />
          <div style={{ position: "absolute", left: 781, top: 6, width: 24, height: 24, background: SH7_R }} />
          <div style={{ position: "absolute", left: 30, top: 687, width: 751, height: 24, background: SH7_B }} />
          <div style={{ position: "absolute", left: 6, top: 687, width: 24, height: 24, background: SH7_B }} />
          <div style={{ position: "absolute", left: 781, top: 687, width: 24, height: 24, background: "radial-gradient(circle 24px at 0px 0px, rgba(0,0,0,0.08), rgba(0,0,0,0.055) 14%, rgba(0,0,0,0.034) 28%, rgba(0,0,0,0.025) 45%, rgba(0,0,0,0.017) 65%, rgba(0,0,0,0.004) 78%, rgba(0,0,0,0) 100%)" }} />
          <div style={{ position: "absolute", left: 0, top: 0, width: 781, height: 687, borderRadius: 30, background: "#FBFBFB" }} />
          <div style={{ position: "absolute", left: 0, top: 0, width: 781, height: 394, borderRadius: 30, overflow: "hidden",
            background: `rgb(${Math.round(HERO_BG[1])},${Math.round(HERO_BG[2])},${Math.round(HERO_BG[3])})` }}>
            {Array.from({ length: Math.floor((HERO_BG.length - 4) / 9) }, (_, i) => <Blob key={i} q={HERO_BG.slice(4 + i * 9, 13 + i * 9)} ox={576} oy={157} />)}
          </div>
          <div style={{ position: "absolute", left: 0, top: 364, width: 781, height: 30, background: "#FBFBFB" }} />
          <Tx cx={390.5} capTop={425.5} size={40.4} w={600} color="#000000" t="Meet Sales Outbound" />
          <Tx cx={390.5} capTop={486.5} size={25.4} color="#6C6C6C" t="Research prospects, personalize outreach, and draft" />
          <Tx cx={390.5} capTop={524} size={25.4} color="#6C6C6C" t="high-converting sales campaigns." />
          <div className="btn7" style={{ position: "absolute", left: 28, top: 593, width: 724, height: 61, transformOrigin: "362px 30.5px" }}>
            <Box cls="btn7bg" x={0} y={0} w={724} h={61} r={14} bg="#060606" />
            <Tx cx={362} capTop={21} size={24} w={400} ls={0.17} color="#FFFFFF" t="Open in Grok Bot" />
          </div>
        </div>
      </div>
      <div className="cur7" style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, opacity: 0, transformOrigin: "13px 74px" }}><BigHand /></div>
    </Timegroup>
  );
};
