/**
 * ChatWindow — Slide 8 (11.70–13.87s, 2167ms, global frames 352–416).
 *
 * macOS-style chat window over the blue wallpaper. The new "Sales Outbound"
 * row slides in from the right, the rows below shift down, then the whole
 * window zooms out slightly toward the end.
 *
 * The big hand cursor from CloseUp is still visible for one frame (f=352)
 * at the very start — included here for visual fidelity.
 */
import React, { useEffect, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { Tx, Box, Cloud, BigHand, lc, toGlobalFrame, pinWidths, fontsReady, type TgEl } from "../components/ui";
import { Blob, Eye, Ell } from "../components/shapes";
import { BG8 } from "../lib/bg";
import { ROW8, BELOW8, ZOOM8, HAND7 } from "../lib/motion789";
import { CHAT_WINDOW_MS, CHAT_WINDOW_F0 } from "../constants";
import { look } from "../components/ui";

const HexRect = (p: { rot: number }) => (
  <div style={{ position: "absolute", left: 216, top: 863, width: 123, height: 71, borderRadius: 10, background: "#F6AD3D", transform: `rotate(${p.rot}deg)` }} />
);

export const ChatWindow: React.FC = () => {
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

      let prepared = false;
      const render = (ms: number) => {
        const f = toGlobalFrame(ms, CHAT_WINDOW_F0);

        tf(".win8", `scale(${lc(ZOOM8, f).toFixed(4)})`);
        tf(".row8", `translate(${lc(ROW8, f).toFixed(1)}px, 0px)`);
        tf(".below8", `translate(0px, ${lc(BELOW8, f).toFixed(1)}px)`);

        /* hand cursor carry-over from CloseUp (visible for 1 frame, fades to 0 at f=353) */
        const h7 = f >= 352 && f <= 353 ? look(HAND7, f) : null;
        op(".cur7", h7 && h7[4] > 0 ? 1 : 0);
        if (h7 && h7[4] > 0) {
          tf(".cur7", `translate(${h7[1].toFixed(1)}px, ${h7[2].toFixed(1)}px) scale(${h7[3].toFixed(4)})`);
          const a7 = h7[4]; const w7 = Math.round(236 + 19 * a7);
          fadeParts(".cur7 .k7c", Math.round(236 * (1 - a7))); fadeParts(".cur7 .w7", w7); fadeParts(".cur7 .w7c", w7);
        }
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
    <Timegroup ref={rootRef as React.Ref<HTMLElement>} mode="fixed" duration={`${CHAT_WINDOW_MS}ms`} className="scene">
      <div style={{ position: "absolute", inset: 0 }}>
        <div className="bg8" style={{ position: "absolute", inset: 0, overflow: "hidden", background: `rgb(${Math.round(BG8[1])},${Math.round(BG8[2])},${Math.round(BG8[3])})` }}>
          {Array.from({ length: Math.floor((BG8.length - 4) / 9) }, (_, i) => <Blob key={i} q={BG8.slice(4 + i * 9, 13 + i * 9)} ox={0} oy={0} />)}
        </div>
        <div className="win8" style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "934px 577px" }}>
          <div style={{ position: "absolute", left: 135, top: 132, width: 1900, height: 1000, borderRadius: 60, overflow: "hidden", background: "#FBFBFB" }}>
            <div style={{ position: "absolute", left: -135, top: -132, width: 1920, height: 1080 }}>
              <Box x={135} y={132} w={1072} h={948} bg="#F6F6F6" />
              <Box x={1207} y={132} w={3} h={948} bg="#ECECEC" />
              <Ell x={178} y={194} w={54} h={54} bg="#F14D57" />
              <Ell x={266} y={194} w={54} h={54} bg="#F7BE34" />
              <Ell x={354} y={194} w={54} h={54} bg="#34E143" />
              <Box x={1093} y={219} w={45} h={4} r={2} bg="#696969" />
              <Box x={1113} y={199} w={4} h={45} r={2} bg="#696969" />
              <Box x={179} y={320} w={982} h={123} r={31} bg="#D9D9D9" />
              <Box x={180} y={321} w={980} h={121} r={30} bg="#EBEBEB" />
              <Box x={212} y={321} w={916} h={2} bg="#DCDCDC" />
              <Box x={212} y={323} w={916} h={1} bg="#E4E4E4" />
              <div style={{ position: "absolute", left: 219, top: 359, width: 38, height: 38, borderRadius: "50%", border: "4px solid #909090", boxSizing: "border-box" }} />
              <div style={{ position: "absolute", left: 256, top: 388, width: 4, height: 18, borderRadius: 2, background: "#909090", transform: "rotate(-45deg)" }} />
              <Tx x={294} capTop={363} size={52} color="#929292" t="Search" />
              <div style={{ position: "absolute", left: 135, top: 132, width: 1072, height: 948, overflow: "hidden" }}>
                <div style={{ position: "absolute", left: -135, top: -132, width: 1920, height: 1080 }}>
                  <div className="below8" style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
                    <HexRect rot={0} /><HexRect rot={60} /><HexRect rot={120} />
                    <Eye cx={317.9} cy={867.2} w={8} h={26} rot={-27} /><Eye cx={289.9} cy={871.8} w={11} h={26} rot={-27} />
                    <Tx x={378} capTop={845} size={51} w={550} color="#101010" t="Justin" />
                    <Tx x={378} capTop={918} size={48} color="#6C6C6C" t="8 intros drafted" />
                    <Box x={706} y={939} w={38} h={3} bg="#6F6F6F" />
                    <Tx x={757} capTop={918} size={48} color="#6C6C6C" t="sitting in the CR…" />
                    <Box x={210} y={1078} w={136} h={88} r={44} bg="#10E473" />
                    <Eye cx={319.4} cy={1099.9} w={6} h={20} rot={-27} /><Eye cx={290.4} cy={1103.1} w={9} h={20} rot={-27} />
                    <Tx x={378} capTop={1069} size={51} w={600} color="#101010" t="Luke" />
                    <Tx rx={1128} capTop={1070} size={44} color="#969696" t="7:34 PM" />
                  </div>
                  <div className="row8" style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
                    <Box x={165} y={524} w={1010} h={230} r={58} bg="#DEDEDE" />
                    <Cloud x={210} y={580} k={0.62} eyes={false} />
                    <Eye cx={278.4} cy={631.8} w={13} h={33} rot={-19} /><Eye cx={309.5} cy={624.1} w={13} h={33} rot={-19} />
                    <Tx x={378} capTop={592} size={51} w={600} color="#101010" t="Sales Outbound" />
                    <Tx x={385} capTop={662} size={48} color="#616161" t="Hey! I'm your Sales Outbound Bot" />
                  </div>
                </div>
              </div>
              <Box x={1246} y={152} w={88} h={127} r={12} bg="#FFFFFF" />
              <Cloud x={1254} y={176} k={0.33} color="#2087F8" eyes={false} />
              <Eye cx={1268.2} cy={215.5} w={5} h={17} rot={-5} /><Eye cx={1284.3} cy={214} w={6} h={17} rot={-5} />
              <Tx x={1356} capTop={195} size={44} w={600} color="#101010" t="Sales Outbound" />
            </div>
          </div>
        </div>
      </div>
      {/* hand cursor carry-over (1-frame fade-out) */}
      <div className="cur7" style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, opacity: 0, transformOrigin: "13px 74px" }}><BigHand /></div>
    </Timegroup>
  );
};
