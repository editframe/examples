/**
 * Publish — Slides 5 + 6 (6.13–10.07s, 3934ms, global frames 185–302).
 *
 *   S5  Second window with draft card; Publish is clicked
 *   S6  Card morphs alone on grey, cloud mascot tracks
 *
 * S5 and S6 share the cloud mascot and cursor overlay — kept as one scene.
 * Scene-scoped addFrameTask for all waypoint tables.
 */
import React, { useEffect, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { C, Tx, Box, Cloud, Hand, CAP, look, lk, lc, toGlobalFrame, pinWidths, fontsReady, type TgEl } from "../components/ui";
import { Blob, Eye, Ell, SH_R, SH_B } from "../components/shapes";
import { paintBg } from "../lib/blob";
import { BG5, HERO_BG } from "../lib/bg";
import { BUB_TOP, LOW_TOP, CL, CUR5, PUB5, HERO6, OLD6, TITLE6, DESC6, BTN6, SHADOW6 } from "../lib/motion56";
import { PUBLISH_MS, PUBLISH_F0 } from "../constants";

const G = { ink: "#080808", name: "#080808", sub: "#6A6A6A", time: "#969696", side: "#F6F6F6", pane: "#FBFBFB" };

const Avatars = () => (
  <>
    <Ell x={207} y={-27} w={63} h={62} bg="#10E473" />
    <Eye cx={243.5} cy={5.5} w={3.5} h={8} rot={20} /><Eye cx={256.5} cy={4} w={3} h={7} rot={20} />
    <Ell x={207} y={84} w={42} h={42} r={11} bg="#F3813D" />
    <Eye cx={231.5} cy={96.5} w={3} h={6} rot={20} /><Eye cx={241} cy={95} w={2.5} h={4} rot={20} />
    <Ell x={237} y={109} w={23} h={23} r={4} bg="#1B87F7" rot={45} />
    <Ell x={232} y={112} w={34} h={34} bg="#1B87F7" />
    <Eye cx={251.5} cy={122.5} w={3} h={5} rot={20} /><Eye cx={258.5} cy={120.5} w={2} h={3} rot={20} />
    <Ell x={207} y={185} w={63} h={63} r={20} bg="#F3813D" />
    <Eye cx={244} cy={202.5} w={5} h={10} rot={20} /><Eye cx={258} cy={200.5} w={4} h={9} rot={20} />
    <Ell x={207} y={289} w={63} h={58} bg="#EE2751" />
    <Eye cx={244} cy={306.5} w={5} h={10} rot={20} /><Eye cx={257.5} cy={304.5} w={4} h={9} rot={20} />
    <Ell x={225} y={392} w={26} h={26} r={3} bg="#1A87F7" rot={45} />
    <Ell x={213} y={398} w={51} h={51} bg="#1A87F7" />
    <Eye cx={242.5} cy={414} w={5} h={9} rot={20} /><Eye cx={253.5} cy={412.5} w={3.5} h={8} rot={20} />
    <Ell x={215} y={495} w={32} h={32} bg="#8E8D92" />
    <Ell x={234} y={498} w={30} h={30} bg="#8E8D92" />
    <Ell x={207} y={511} w={63} h={34} bg="#8E8D92" />
    <Eye cx={242.5} cy={510.5} w={5} h={10} rot={20} /><Eye cx={254} cy={510} w={4} h={9} rot={20} />
    {/* Jenny: pink rounded triangle */}
    <div style={{ position: "absolute", left: 200, top: 574, width: 76, height: 22, background: G.side }} />
    <Ell x={230} y={592} w={16} h={16} bg="#EF46AD" />
    <Eye cx={242} cy={618} w={4} h={7} rot={20} /><Eye cx={251.5} cy={617} w={3} h={6} rot={20} />
    {/* Chang: teal hexagon */}
    <Ell x={210} y={706} w={56} h={33} bg="linear-gradient(#2ED6B0, #2ED6B0 60%, #46DAB8)" />
    <Eye cx={243.5} cy={710.5} w={6} h={10} rot={20} /><Eye cx={256} cy={708} w={4} h={9} rot={20} />
    <Ell x={205} y={792} w={46} h={46} bg="#FFFFFF" />
    <div style={{ position: "absolute", left: 223, top: 803, width: 2, height: 6, background: "#262626" }} />
    <div style={{ position: "absolute", left: 230, top: 803, width: 2, height: 6, background: "#262626" }} />
    <div style={{ position: "absolute", left: 220, top: 808, width: 16, height: 13, borderRadius: "3px 3px 8px 8px", border: "2px solid #262626", boxSizing: "border-box", background: "#FFFFFF" }} />
    <div style={{ position: "absolute", left: 227, top: 820, width: 2, height: 6, background: "#262626" }} />
    <Ell x={200} y={860} w={60} h={60} bg="#FFFFFF" />
    <Ell x={217} y={880} w={22} h={23} bg="#F2C9AE" />
    <Ell x={215} y={871} w={26} h={16} bg="#2E251D" />
    <Ell x={216} y={877} w={8} h={8} bg="#2E251D" />
    <Ell x={232} y={877} w={8} h={8} bg="#2E251D" />
    <Ell x={219} y={884} w={18} h={18} bg="#F2C9AE" />
    <div style={{ position: "absolute", left: 222, top: 888, width: 2, height: 2, background: "#2B2B2B", borderRadius: 1 }} />
    <div style={{ position: "absolute", left: 231, top: 888, width: 2, height: 2, background: "#2B2B2B", borderRadius: 1 }} />
    <Ell x={224} y={894} w={8} h={4} bg="#7A3B3B" />
    <div style={{ position: "absolute", left: 225, top: 895, width: 6, height: 1, background: "#FFFFFF" }} />
  </>
);

/* Jenny triangle (must appear before the cover rect) */
import { Tri } from "../components/shapes";
const JennyTri = () => <><Tri ax={238} ay={580} by={649} hw={31} col="#EF46AD" /></>;
/* Chang hexagon layers */
const ChangHex = () => <>
  <Tri ax={238} ay={689} by={707} hw={28} col="#2ED6B0" />
  <Tri ax={238} ay={755} by={738} hw={28} col="#4FDBBC" />
  <Tri ax={238} ay={755} by={745} hw={17} col="#7FE2CB" />
  <Tri ax={238} ay={755} by={750} hw={8.5} col="#A0E8D6" />
</>;

const ROWS: { k: number; name: string; sub: string; time?: string }[] = [
  { k: -1, name: "Luke", sub: "Inbox's at 3. Two need a reply today.", time: "7:34 PM" },
  { k: 0, name: "Website launch", sub: "John: checkout's clean on staging,…", time: "11:18 AM" },
  { k: 1, name: "John", sub: "Repro'd the checkout crash. Write-…", time: "Yesterday" },
  { k: 2, name: "Keith", sub: "Acme's wobbling. Drafted a Thurs…" },
  { k: 3, name: "Tyler", sub: "14 receipts in. Still missing your Ub…", time: "9:04 AM" },
  { k: 4, name: "Manuel", sub: "Launch post is live. First 200 impre…", time: "2:20 PM" },
  { k: 5, name: "Jenny", sub: "3 places in SoMa. The Folsom 2be…", time: "Tuesday" },
  { k: 6, name: "Chang", sub: "Sourced 3. Skipped one already in…", time: "10:12 AM" },
];

const LockChevron = (p: { cls?: string; dy?: number }) => {
  const d = p.dy ?? 0; const c = p.cls;
  return <>
    <div className={c} style={{ position: "absolute", left: 1168, top: 767 + d, width: 15, height: 15, borderRadius: "50%", border: "2px solid #6E6E6E", boxSizing: "border-box" }} />
    <div className={c} style={{ position: "absolute", left: 1165, top: 777 + d, width: 21, height: 10, borderRadius: 2, border: "2px solid #6E6E6E", boxSizing: "border-box", background: G.pane }} />
    <div className={c} style={{ position: "absolute", left: 1199, top: 778 + d, width: 8, height: 2, background: "#6E6E6E", borderRadius: 1, transform: "rotate(45deg)" }} />
    <div className={c} style={{ position: "absolute", left: 1204, top: 778 + d, width: 8, height: 2, background: "#6E6E6E", borderRadius: 1, transform: "rotate(-45deg)" }} />
  </>;
};

const DraftBlock = (p: { tcls?: string; bcls?: string; pubCls?: string; ox: number; oy: number }) => {
  const X = p.ox, Y = p.oy;
  return <>
    <Tx cls={p.tcls} x={711 - X} capTop={669 - Y} size={22} color="#000000" t="An operations bot that coordinates work and" />
    <Tx cls={p.tcls} x={712 - X} capTop={704 - Y} size={22} color="#000000" t="surfaces decisions that need your approval." />
    <div className={p.pubCls} style={{ position: "absolute", left: 708 - X, top: 749 - Y, width: 110, height: 56, borderRadius: 14, background: "#000000", transformOrigin: "50% 50%" }}>
      <Tx cls={p.bcls} cx={55} capTop={19} size={22} w={500} color="#FFFFFF" t="Publish" />
    </div>
    <Box cls={p.bcls} x={830 - X} y={749 - Y} w={161} h={56} r={14} bg="#EFEFEF" />
    <Tx cls={p.bcls} cx={910.5 - X} capTop={767 - Y} size={21.7} w={500} color="#000000" t="View Details" />
    <div style={{ position: "absolute", left: -X, top: -Y, width: 1920, height: 1080 }}><LockChevron cls={p.bcls} /></div>
  </>;
};

export const Publish: React.FC = () => {
  const nb = Math.floor((BG5[0].length - 4) / 9);
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
        const f = toGlobalFrame(ms, PUBLISH_F0);

        /* ---- S5 ---- */
        const s5 = f >= 185 && f <= 242;
        op(".sc5", s5 ? 1 : 0);
        if (s5) {
          paintBg(g, st, ".bg5", ".bg5b-", BG5, f, look);
          tf(".up5", `translate(0px, ${(lc(BUB_TOP, f) - 8).toFixed(1)}px)`);
          tf(".low5", `translate(0px, ${(lc(LOW_TOP, f) - 416).toFixed(1)}px)`);
          op(".low5", f >= 237 ? 0 : 1);
          st(g(".pub5"), "background", f >= 213 ? "#323232" : "#000000");
          tf(".pub5", `scale(${lc(PUB5, f).toFixed(3)})`);
        }

        /* ---- S6 bg + card ---- */
        op(".sc6bg", f <= 237 ? 0 : f <= 242 ? 0.2 * (f - 237) : f <= 302 ? 1 : 0);
        const c6 = f >= 238 && f <= 302;
        op(".card6", c6 ? 1 : 0);
        if (c6) {
          const h = look(HERO6, f) || HERO6[HERO6.length - 1];
          const s = (h[2] - h[1]) / 781; const hh = (h[4] - h[3]) / s;
          tf(".card6", `translate(${h[1].toFixed(1)}px, ${h[3].toFixed(1)}px) scale(${s.toFixed(4)})`);
          st(g(".c6hero"), "height", `${Math.round(hh) + 30}px`); st(g(".c6cover"), "top", `${Math.round(hh)}px`);
          tf(".c6body", `translate(0px, ${(hh - 364).toFixed(1)}px)`);
          const ta = lc(TITLE6, f, 1); op(".c6title", ta); tf(".c6title", `translate(0px, ${lc(TITLE6, f, 2).toFixed(1)}px)`);
          const da = lc(DESC6, f, 1); const dd = `translate(0px, ${lc(DESC6, f, 2).toFixed(1)}px)`;
          op(".c6d1", da); op(".c6d2", da); tf(".c6d1", dd); tf(".c6d2", dd);
          const ba = lc(BTN6, f); op(".c6btn", ba); op(".c6bt", ba);
          const sa = lc(SHADOW6, f); [".c6sh0", ".c6sh1", ".c6sh2", ".c6sh3", ".c6sh4"].forEach((c) => op(c, sa));
        }

        /* ---- old6 morph ---- */
        const o6 = f >= 237 && f <= 245;
        op(".old6", o6 ? 1 : 0);
        if (o6) {
          const o = look(OLD6, f) || OLD6[0];
          tf(".old6", `translate(${o[1].toFixed(1)}px, ${(o[2] - CAP * 22 * o[3]).toFixed(1)}px) scale(${o[3].toFixed(4)})`);
          opAll(".o6t", o[4]); opAll(".o6b", o[5]); op(".o6pub", o[5]);
        }

        /* ---- cloud ---- */
        const cl = f >= 185 && f <= 302 ? look(CL, f) : null;
        op(".cl5body", cl ? cl[12] : 0);
        if (cl) {
          tf(".cl5body", `translate(${(cl[1] - 121).toFixed(1)}px, ${(cl[2] - 98).toFixed(1)}px) rotate(${cl[4].toFixed(2)}deg) scale(${cl[3].toFixed(4)})`);
          const L = cl[9], W = cl[10]; const eyeOn = L > 0.5 && W > 0.5;
          const ew = Math.max(1, Math.round(W)), eh = Math.max(1, Math.round(L));
          ([[".cl5e1", cl[5], cl[6]], [".cl5e2", cl[7], cl[8]]] as [string, number, number][]).forEach(([sel, ex, ey]) => {
            const el = g(sel); if (!el) return;
            op(sel, eyeOn ? cl[12] : 0);
            if (!eyeOn) return;
            st(el, "width", `${ew}px`); st(el, "height", `${eh}px`); st(el, "borderRadius", `${ew}px`);
            st(el, "left", `${Math.round(ex - ew / 2)}px`); st(el, "top", `${Math.round(ey - eh / 2)}px`);
            st(el, "transform", `rotate(${cl[11].toFixed(1)}deg)`);
          });
        }

        /* ---- small cursor ---- */
        const cu = f >= 202 && f <= 246 ? look(CUR5, f) : null;
        op(".cur5", cu ? 1 : 0);
        if (cu) {
          tf(".cur5", `translate(${cu[1].toFixed(1)}px, ${cu[2].toFixed(1)}px) scale(${(0.32 * cu[3]).toFixed(4)})`);
          const al = cu[4]; const bgv = f <= 238 ? 249 : f === 239 ? 245 : f === 240 ? 242 : f === 241 ? 239 : 236;
          const wv = Math.round(bgv + (255 - bgv) * al);
          const kv = Math.round(bgv * (1 - al)); fadeParts(".cur5 .k7", kv); fadeParts(".cur5 .k7c", kv); fadeParts(".cur5 .w7", wv); fadeParts(".cur5 .w7c", wv);
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
    <Timegroup ref={rootRef as React.Ref<HTMLElement>} mode="fixed" duration={`${PUBLISH_MS}ms`} className="scene">
      {/* S5 layer */}
      <div className="sc5" style={{ position: "absolute", inset: 0, opacity: 0 }}>
        <div className="bg5" style={{ position: "absolute", inset: 0, background: "#6FA6E8", overflow: "hidden" }}>
          {Array.from({ length: nb }, (_, i) => <div key={i} className={`bg5b-${i}`} style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1 }} />)}
        </div>
        <div style={{ position: "absolute", left: 176, top: -80, width: 1900, height: 1020, borderRadius: 55, overflow: "hidden", background: G.pane }}>
          <div style={{ position: "absolute", left: -176, top: 80, width: 1920, height: 1080 }}>
            <div style={{ position: "absolute", left: 176, top: -80, width: 480, height: 1020, background: G.side }} />
            <div style={{ position: "absolute", left: 656, top: -80, width: 1, height: 1020, background: "#E7E7E7" }} />
            <JennyTri />
            <Avatars />
            <ChangHex />
            {ROWS.map((r) => <React.Fragment key={r.name}>
              <Tx x={284} capTop={92 + 101 * r.k} size={22} w={600} color={G.name} t={r.name} />
              {r.time && <Tx rx={621} capTop={92 + 101 * r.k} size={20} color={G.time} t={r.time} />}
              <Tx x={284} capTop={125 + 101 * r.k} size={20} color={G.sub} t={r.sub} />
            </React.Fragment>)}
            <Tx x={268} capTop={806} size={21} w={500} color={G.name} t="Plugins" />
            <Tx x={268} capTop={879} size={21} w={500} color={G.name} t="Peng Zheng" />

            <div style={{ position: "absolute", left: 657, top: -80, width: 1263, height: 909, overflow: "hidden" }}>
              <div style={{ position: "absolute", left: -657, top: 80, width: 1920, height: 1080 }}>
                <div className="up5" style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
                  <Box x={1395} y={8} w={518} h={96} r={48} bg={C.ink} />
                  <Tx x={1417} capTop={31} size={22} color="#FFFFFF" t="Create a copy of yourself that I can share with" />
                  <Tx x={1417} capTop={68} size={22} color="#FFFFFF" t="somebody else." />
                  <Box x={693} y={134} w={518} h={130} r={30} bg="#EDEDED" />
                  <Tx x={714} capTop={156} size={22} color="#0A0A0A" t="Here's a draft version you can review. Publish it" />
                  <Tx x={714} capTop={192} size={22} color="#0A0A0A" t="to make it shareable and copy a link to your" />
                  <Tx x={714} capTop={228} size={22} color="#0A0A0A" t="clipboard." />
                  <Tx x={709} capTop={300} size={22} w={600} color={G.name} t="Kenny" />
                  <Box x={1125} y={299} w={96} h={38} r={19} bg="#EFEFEF" />
                  <Box x={1139} y={306} w={10} h={10} r={5} bg="#797979" />
                  <Tx x={1161} capTop={303} size={21.5} color="#333333" t="Draft" />
                </div>
                <div className="low5" style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
                  <DraftBlock ox={0} oy={0} pubCls="pub5" />
                </div>
              </div>
            </div>

            <div style={{ position: "absolute", left: 689, top: 843, width: 1232, height: 88, borderRadius: 44, background: "#F0F0F0" }} />
            <div style={{ position: "absolute", left: 690, top: 844, width: 1230, height: 86, borderRadius: 43, background: "#E4E4E4" }} />
            <div style={{ position: "absolute", left: 691, top: 845, width: 1228, height: 84, borderRadius: 42, background: G.pane }} />
            <Ell x={700} y={855} w={55} h={60} bg="#F1F1F1" />
            <div style={{ position: "absolute", left: 718, top: 882, width: 24, height: 3, background: "#6E6E6E", borderRadius: 1 }} />
            <div style={{ position: "absolute", left: 728, top: 872, width: 3, height: 24, background: "#6E6E6E", borderRadius: 1 }} />
            <Tx x={770} capTop={875} size={22} color="#9A9A9A" t="Message Kenny" />
            <div style={{ position: "absolute", left: 950, top: 871, width: 2, height: 27, background: "#1E1E1E" }} />
            <Ell x={1851} y={860} w={48} h={48} bg={C.ink} />
            <div style={{ position: "absolute", left: 1873, top: 872, width: 3, height: 24, background: "#FFFFFF", borderRadius: 1.5 }} />
            <div style={{ position: "absolute", left: 1873, top: 872, width: 3, height: 15, background: "#FFFFFF", borderRadius: 1.5, transform: "rotate(45deg)", transformOrigin: "50% 1.5px" }} />
            <div style={{ position: "absolute", left: 1873, top: 872, width: 3, height: 15, background: "#FFFFFF", borderRadius: 1.5, transform: "rotate(-45deg)", transformOrigin: "50% 1.5px" }} />
          </div>
        </div>
      </div>

      {/* S6 layers */}
      <div className="sc6bg" style={{ position: "absolute", inset: 0, background: "#ECECEC", opacity: 0 }} />
      <div className="card6" style={{ position: "absolute", left: 0, top: 0, width: 781, height: 687, transformOrigin: "0 0", opacity: 0 }}>
        <div className="c6sh0" style={{ position: "absolute", left: 781, top: 30, width: 52, height: 657, background: SH_R, opacity: 0 }} />
        <div className="c6sh3" style={{ position: "absolute", left: 781, top: 4, width: 52, height: 26, background: SH_R, opacity: 0 }} />
        <div className="c6sh1" style={{ position: "absolute", left: 36, top: 687, width: 745, height: 52, background: SH_B, opacity: 0 }} />
        <div className="c6sh4" style={{ position: "absolute", left: 4, top: 687, width: 32, height: 52, background: SH_B, opacity: 0 }} />
        <div className="c6sh2" style={{ position: "absolute", left: 781, top: 687, width: 52, height: 52, background: "radial-gradient(circle 52px at 0px 0px, rgba(0,0,0,0.05), rgba(0,0,0,0.04) 20%, rgba(0,0,0,0.025) 45%, rgba(0,0,0,0.012) 70%, rgba(0,0,0,0.0) 100%)", opacity: 0 }} />
        <div className="c6white" style={{ position: "absolute", left: 0, top: 0, width: 781, height: 687, borderRadius: 30, background: G.pane }} />
        <div className="c6hero" style={{ position: "absolute", left: 0, top: 0, width: 781, height: 394, borderRadius: 30, overflow: "hidden",
            background: `rgb(${Math.round(HERO_BG[1])},${Math.round(HERO_BG[2])},${Math.round(HERO_BG[3])})` }}>
          {Array.from({ length: Math.floor((HERO_BG.length - 4) / 9) }, (_, i) => <Blob key={i} q={HERO_BG.slice(4 + i * 9, 13 + i * 9)} ox={576} oy={157} />)}
        </div>
        <div className="c6cover" style={{ position: "absolute", left: 0, top: 364, width: 781, height: 30, background: G.pane }} />
        <div className="c6body" style={{ position: "absolute", left: 0, top: 0, width: 781, height: 687 }}>
          <Tx cls="c6title" cx={390.5} capTop={425.5} size={40.4} w={600} color="#000000" t="Meet Sales Outbound" />
          <Tx cls="c6d1" cx={390.5} capTop={486.5} size={25.4} color="#6C6C6C" t="Research prospects, personalize outreach, and draft" />
          <Tx cls="c6d2" cx={390.5} capTop={524} size={25.4} color="#6C6C6C" t="high-converting sales campaigns." />
          <Box cls="c6btn" x={28} y={593} w={724} h={61} r={14} bg="#060606" />
          <Tx cls="c6bt" cx={390.5} capTop={614} size={24} w={400} ls={0.17} color="#FFFFFF" t="Open in Grok Bot" />
        </div>
      </div>
      <div className="old6" style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, transformOrigin: "0 0", opacity: 0 }}>
        <DraftBlock ox={711} oy={669 - CAP * 22} tcls="o6t" bcls="o6b" pubCls="o6pub" />
      </div>

      {/* cloud mascot (screen space) */}
      <div className="cl5body" style={{ position: "absolute", left: 0, top: 0, width: 242, height: 196, transformOrigin: "121px 98px", opacity: 0 }}>
        <Cloud x={0} y={0} eyes={false} />
      </div>
      <div className="cl5e1" style={{ position: "absolute", left: 0, top: 0, width: 10, height: 10, background: "#FFFFFF", opacity: 0 }} />
      <div className="cl5e2" style={{ position: "absolute", left: 0, top: 0, width: 10, height: 10, background: "#FFFFFF", opacity: 0 }} />
      {/* small hand cursor (0.32 × S3 hand), tip at translate point */}
      <div className="cur5" style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, opacity: 0, transformOrigin: "0 0" }}><Hand /></div>
    </Timegroup>
  );
};
