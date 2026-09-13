/**
 * Intro — Slides 1–3 (0–3.83s, 3833ms, global frames 1–115).
 *
 *   S1  Chat pane slides left to reveal Settings panel
 *   S2  Vertical pan down the settings panel
 *   S3  Zoom cut, cursor enters, hover + press on "Share as template" button
 *
 * All three beats share the camera, wallpaper, and window DOM — kept as one scene.
 * Uses scene-scoped addFrameTask for waypoint interpolation tables.
 */
import React, { useEffect, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { C, Tx, Box, Cloud, Hand, look, lk, toGlobalFrame, pinWidths, fontsReady, type TgEl } from "../components/ui";
import { paintBg } from "../lib/blob";
import { BG1b as BG1 } from "../lib/bg";
import { SLIDE, BLOBX, SHADA, PAN, S3DRIFT, CURSOR, BTN } from "../lib/motion";
import { INTRO_MS, INTRO_F0 } from "../constants";

export const Intro: React.FC = () => {
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

      let prepared = false;
      const render = (ms: number) => {
        const f = toGlobalFrame(ms, INTRO_F0);

        let s = 1, bx = 0, by = 0;
        if (f <= 74) { by = lk(PAN, f); }
        else { s = 1.8611; bx = -826.2; by = -3657 + lk(S3DRIFT, f); }
        const tx = bx + 800 - 800 * s;
        tf(".cam", `translate(${tx.toFixed(2)}px, ${by.toFixed(2)}px) scale(${s})`);
        {
          const xR = bx + 1390 * s, yB = by + 2304 * s, yT = Math.max(-10, by + 161 * s), xL = Math.max(-10, bx - 500 * s);
          tf(".wshR", `translate(${xR.toFixed(1)}px, ${yT.toFixed(1)}px)`); st(g(".wshR"), "height", `${Math.max(1, Math.round(yB - yT))}px`);
          tf(".wshB", `translate(${xL.toFixed(1)}px, ${yB.toFixed(1)}px)`); st(g(".wshB"), "width", `${Math.max(1, Math.round(xR - xL))}px`);
          tf(".wshC", `translate(${xR.toFixed(1)}px, ${yB.toFixed(1)}px)`);
        }

        paintBg(g, st, ".bgbase", ".bgb-", BG1, f, look);

        const dx = lk(SLIDE, f);
        tf(".chatgrp", `translate(${dx.toFixed(2)}px, 0px)`);
        op(".paneShadow", lk(SHADA, f));
        tf(".pblob", `translate(${lk(BLOBX, f).toFixed(2)}px, 0px)`);

        const bt = look(BTN, f) || [f, 1, 1, 0];
        tf(".shareBtn", f >= 78 ? `translate(0px, ${bt[3].toFixed(2)}px) scale(${bt[1].toFixed(4)}, ${bt[2].toFixed(4)})` : "none");
        const hu = f < 78 ? 0 : f === 78 ? 0.5 : f === 79 ? 0.8 : 1;
        const mix = (a: number, b: number) => Math.round(a + (b - a) * hu);
        const hex = (v: number) => `rgb(${v},${v},${v})`;
        [".btnH0", ".btnH1", ".btnH2"].forEach((s) => op(s, f >= 78 ? 1 : 0));
        st(g(".btnH0"), "background", hex(mix(223, 224)));
        st(g(".btnH1"), "background", hex(mix(239, 198)));
        st(g(".btnH2"), "background", hex(mix(239, 216)));

        const cv = f >= 75 && f <= 115;
        op(".cursor", cv ? 1 : 0);
        if (cv) {
          const c = look(CURSOR, f) || [f, 928, 506, 1];
          tf(".cursor", `translate(${c[1].toFixed(1)}px, ${c[2].toFixed(1)}px) scale(${c[3].toFixed(3)})`);
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

  const WX = 800;
  const WSH = "rgba(0,0,0,0.135) 0%, rgba(0,0,0,0.11) 8%, rgba(0,0,0,0.095) 16%, rgba(0,0,0,0.08) 24%, rgba(0,0,0,0.066) 32%, rgba(0,0,0,0.052) 40%, rgba(0,0,0,0.045) 48%, rgba(0,0,0,0.036) 56%, rgba(0,0,0,0.028) 64%, rgba(0,0,0,0.022) 72%, rgba(0,0,0,0.016) 80%, rgba(0,0,0,0.008) 88%, rgba(0,0,0,0) 100%";
  const bot2 = ["The one open question is the follow-up. Sarah", "thinks the current cold emails are too", "aggressive, and most of the room agreed, but", "nobody decided what happens next."];

  return (
    <Timegroup ref={rootRef as React.Ref<HTMLElement>} mode="fixed" duration={`${INTRO_MS}ms`} className="scene">
      <div style={{ position: "absolute", inset: 0 }}>
        <div className="bgbase" style={{ position: "absolute", inset: 0, background: "#6FA6E8", overflow: "hidden" }}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <div key={i} className={`bgb-${i}`} style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1 }} />)}
        </div>

        <div className="wshR" style={{ position: "absolute", left: 0, top: 0, width: 108, height: 2400, background: `linear-gradient(90deg, ${WSH})` }} />
        <div className="wshB" style={{ position: "absolute", left: 0, top: 0, width: 2400, height: 108, background: `linear-gradient(180deg, ${WSH})` }} />
        <div className="wshC" style={{ position: "absolute", left: 0, top: 0, width: 108, height: 108, background: `radial-gradient(circle 108px at 0px 0px, ${WSH})` }} />
        <div className="cam" style={{ position: "absolute", left: -WX, top: 0, width: 2400, height: 2400, transformOrigin: "0 0" }}>

          <div style={{ position: "absolute", left: WX - 500, top: 161, width: 1890, height: 2143, borderRadius: 24, overflow: "hidden", background: C.pane }}>
            <div style={{ position: "absolute", left: 1010, top: 0, width: 880, height: 2143, background: C.pane }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 2, height: 2143, background: "linear-gradient(90deg,#EFEFEF,#DCDCDC)" }} />
              <div style={{ position: "absolute", left: 49, top: 31, width: 16, height: 30 }}>
                <div style={{ position: "absolute", left: 5, top: 5, width: 16, height: 3, background: "#696969", borderRadius: 2, transform: "rotate(-52deg)", transformOrigin: "0 50%" }} />
                <div style={{ position: "absolute", left: 5, top: 22, width: 16, height: 3, background: "#696969", borderRadius: 2, transform: "rotate(52deg)", transformOrigin: "0 50%" }} />
              </div>
              <Tx cx={450.5} capTop={193 - 161} size={35} w={600} t="Settings" />
              <div style={{ position: "absolute", left: 829, top: 31, width: 27, height: 27 }}>
                <div style={{ position: "absolute", left: -3, top: 12, width: 33, height: 3, background: "#646464", borderRadius: 2, transform: "rotate(45deg)" }} />
                <div style={{ position: "absolute", left: -3, top: 12, width: 33, height: 3, background: "#646464", borderRadius: 2, transform: "rotate(-45deg)" }} />
              </div>
              <Cloud cls="pblob" x={320} y={183} />
              <Tx x={569 - 510} capTop={626 - 161} size={32} color={C.gray} t="Name" />
              <Box x={35} y={683 - 161} w={831} h={83} r={16} border={`2px solid ${C.fieldBorder}`} />
              <Tx x={578 - 510} capTop={710 - 161} size={35} t="Sales Outbound" />
              <Tx x={568 - 510} capTop={806 - 161} size={32} color={C.gray} t="Title" />
              <Box x={35} y={862 - 161} w={831} h={85} r={16} border={`2px solid ${C.fieldBorder}`} />
              <Tx x={574 - 510} capTop={891 - 161} size={35} t="Operator" />
              <Tx x={569 - 510} capTop={986 - 161} size={32} color={C.gray} t="Description" />
              <Box x={35} y={1042 - 161} w={831} h={224} r={16} border={`2px solid ${C.fieldBorder}`} />
              <Tx x={573 - 510} capTop={1072 - 161} size={35} color={C.light} t="What should this Bot help with?" />
              <Box x={35} y={1301 - 161} w={831} h={207} r={16} bg={C.card} />
              <Tx x={575 - 510} capTop={1325 - 161} size={30} w={500} t="Desktop notifications" />
              <Tx x={575 - 510} capTop={1364 - 161} size={30} color={C.gray} t="Get notified when this Bot finishes or needs" />
              <Tx x={575 - 510} capTop={1400 - 161} size={30} color={C.gray} t="input" />
              <Box x={1272 - 510} y={1378 - 161} w={75} h={54} r={27} bg={C.ink} />
              <Box x={1297 - 510} y={1383 - 161} w={43} h={43} r={22} bg="#FFFFFF" />
              <div className="shareBtn" style={{ position: "absolute", left: 35, top: 2203 - 161, width: 830, height: 90, borderRadius: 18, background: C.btnIdle, border: `1px solid ${C.btnBorder}`, boxSizing: "border-box", transformOrigin: "50% 50%" }}>
                <div className="btnH0" style={{ position: "absolute", left: -1, top: -1, width: 830, height: 90, borderRadius: 18, background: "#DFDFDF", opacity: 0 }} />
                <div className="btnH1" style={{ position: "absolute", left: 1, top: 1, width: 826, height: 86, borderRadius: 16, background: "#EFEFEF", opacity: 0 }} />
                <div className="btnH2" style={{ position: "absolute", left: 3, top: 3, width: 822, height: 82, borderRadius: 14, background: "#EFEFEF", opacity: 0 }} />
                <div style={{ position: "absolute", left: 245, top: 41, width: 3, height: 22, background: "#1A1A1A", borderRadius: 2 }} />
                <div style={{ position: "absolute", left: 278, top: 41, width: 3, height: 22, background: "#1A1A1A", borderRadius: 2 }} />
                <div style={{ position: "absolute", left: 245, top: 60, width: 36, height: 3, background: "#1A1A1A", borderRadius: 2 }} />
                <div style={{ position: "absolute", left: 261, top: 27, width: 3, height: 27, background: "#1A1A1A", borderRadius: 2 }} />
                <div style={{ position: "absolute", left: 261, top: 27, width: 3, height: 14, background: "#1A1A1A", borderRadius: 2, transform: "rotate(45deg)", transformOrigin: "50% 1px" }} />
                <div style={{ position: "absolute", left: 261, top: 27, width: 3, height: 14, background: "#1A1A1A", borderRadius: 2, transform: "rotate(-45deg)", transformOrigin: "50% 1px" }} />
                <Tx x={860 - 545} capTop={2234 - 2203} size={34.35} w={500} t="Share as template" />
              </div>
            </div>

            <div className="chatgrp" style={{ position: "absolute", left: 0, top: 0, width: 1890, height: 2143 }}>
              <div className="paneShadow" style={{ position: "absolute", left: 1890, top: 0, width: 62, height: 2143, opacity: 0.167,
                background: "linear-gradient(90deg, rgba(0,0,0,0.0) 0px, rgba(0,0,0,0.55) 9px, rgba(0,0,0,1) 12px, rgba(0,0,0,0.78) 17px, rgba(0,0,0,0.62) 24px, rgba(0,0,0,0.45) 31px, rgba(0,0,0,0.29) 40px, rgba(0,0,0,0.12) 50px, rgba(0,0,0,0) 62px)" }} />
              <div style={{ position: "absolute", left: 0, top: 0, width: 704, height: 2143, background: C.side }}>
                <div style={{ position: "absolute", left: 702, top: 0, width: 2, height: 2143, background: "#EBEBEB" }} />
                <div style={{ position: "absolute", left: 620, top: 204 - 161 + 15, width: 33, height: 3, background: "#676767", borderRadius: 1 }} />
                <div style={{ position: "absolute", left: 635, top: 204 - 161, width: 3, height: 33, background: "#676767", borderRadius: 1 }} />
                <Box x={-40} y={293 - 161} w={709} h={90} r={22} bg="#ECECEC" border="2px solid #DEDEDE" />
                <Box x={-40} y={404 - 161} w={709} h={153} r={22} bg="#DFDFDF" />
                <Tx x={528} capTop={444 - 161} size={32} color="#8A8A8A" t="7:34 PM" />
                <Tx x={500} capTop={498 - 161} size={32} color="#5A5A5A" t="y all-ha…" />
                <Tx x={506} capTop={659 - 161} size={32} color="#5A5A5A" t="the CR…" />
                <Tx x={528} capTop={770 - 161} size={32} color="#8A8A8A" t="7:34 PM" />
                <Tx x={500} capTop={824 - 161} size={32} color="#5A5A5A" t="ply today." />
                <Tx x={520} capTop={932 - 161} size={32} color="#8A8A8A" t="11:18 AM" />
                <Tx x={500} capTop={986 - 161} size={32} color="#5A5A5A" t="staging,…" />
              </div>
              <div style={{ position: "absolute", left: 704, top: 0, width: 1186, height: 2143, background: C.pane }}>
                <Cloud x={237 - 204} y={192 - 161} k={0.26} />
                <Tx x={324 - 204} capTop={207 - 161} size={35} w={500} t="Sales Outbound" />
                <Tx cx={798 - 204} capTop={359 - 161} size={34} color={C.gray} t="9:41 AM" />
                <Box x={496 - 204} y={451 - 161} w={841} h={100} r={50} bg={C.ink} />
                <Tx x={531 - 204} capTop={489 - 161} size={37} color="#FFFFFF" t="What were the takeaways from that sales sync?" />
                <Box x={260 - 204} y={597 - 161} w={841} h={158} r={40} bg={C.botBub} />
                <Tx x={295 - 204} capTop={633 - 161} size={37} t="Most of the session was about their new" />
                <Tx x={295 - 204} capTop={689 - 161} size={37} t="outbound list." />
                <Box x={260 - 204} y={762 - 161} w={858} h={277} r={40} bg={C.botBub} />
                {bot2.map((l, i) => <Tx key={i} x={295 - 204} capTop={802 - 161 + i * 57} size={37} t={l} />)}
                <Box x={1350 - 204} y={301 - 161} w={16} h={900} r={8} bg={C.scroll} />
              </div>
            </div>
          </div>
        </div>

        <div className="cursor" style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, opacity: 0, transformOrigin: "15px 84px" }}><Hand /></div>
      </div>
    </Timegroup>
  );
};
