/**
 * Windows — wallpaper + Window A + Window B + tooltip + cursor + world camera.
 *
 * Declared 10780ms (0–10.78). Exclusive screen time is still 0–10.55; the
 * extra 230ms is the fade tail so Window B stays under the endcard overlay.
 *
 * Window A→B (5.63–6.07) is internal to this scene.
 *
 * addFrameTask stays for font-measured camera (TX2/TY2/TX4), selection sweep,
 * cursor path, typing chars, and send swap — none of these have a closed-form
 * CSS equivalent that cannot drift from the measured layout.
 */
import React, { useEffect, useRef } from "react";
import { Timegroup, Image as EfImage } from "@editframe/react";
import { CubeLogo } from "../components/CubeLogo";
import { WINDOWS_ABS_START, WINDOWS_MS } from "../constants";

const wallpaperJpg = "/cursor-sidechat-demo/src/assets/cursor-sidechat-demo-wallpaper.jpg";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a), 0, 1);
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
type KF = Array<[number, number]>;
const kf = (tab: KF, t: number) => {
  if (t <= tab[0][0]) return tab[0][1];
  for (let i = 1; i < tab.length; i++)
    if (t <= tab[i][0]) {
      const [t0, v0] = tab[i - 1];
      const [t1, v1] = tab[i];
      return lerp(v0, v1, (t - t0) / (t1 - t0));
    }
  return tab[tab.length - 1][1];
};

const S2 = 3.5;
const Q2: [number, number] = [928, 524];
const S4 = 3.7;
const Q4: [number, number] = [197, 408];
const TYPED = "what kind of data do we have on personas?";
const T_TYPE0 = 6.13;
const TYPE_RATE = 18.9;
const PANX: KF = [[7.0, 0], [7.45, -430], [7.85, -640], [8.2, -709], [8.4, -732]];
const PANY: KF = [[7.0, 0], [8.2, 13], [8.4, 15]];
const SWEEP: KF = [
  [3.23, 0], [3.33, 42], [3.37, 114], [3.43, 735], [3.5, 818], [3.57, 860], [3.63, 895], [3.7, 900],
];

const IBeam = ({ s = 1 }: { s?: number }) => (
  <svg width={15 * s} height={22 * s} viewBox="0 0 15 22">
    <g fill="none" strokeLinecap="round">
      <g stroke="#ffffff" strokeWidth={4.6}>
        <path d="M3 2 C5 2 6.6 2.7 7.5 3.6 C8.4 2.7 10 2 12 2" />
        <path d="M7.5 3.6 V18.4" />
        <path d="M3 20 C5 20 6.6 19.3 7.5 18.4 C8.4 19.3 10 20 12 20" />
      </g>
      <g stroke="#101010" strokeWidth={2.1}>
        <path d="M3 2 C5 2 6.6 2.7 7.5 3.6 C8.4 2.7 10 2 12 2" />
        <path d="M7.5 3.6 V18.4" />
        <path d="M3 20 C5 20 6.6 19.3 7.5 18.4 C8.4 19.3 10 20 12 20" />
      </g>
    </g>
  </svg>
);
const Hand = ({ s = 1 }: { s?: number }) => (
  <svg width={17 * s} height={20 * s} viewBox="0 0 17 20">
    <path
      d="M6.7 18.6 C5 16.6 2.6 13 2.6 10 C2.6 8.4 4.5 8.2 5.3 9.5 L6 10.7 L6 3 C6 1 9 1 9 3 L9 7.2 C9 5.9 11.4 5.9 11.4 7.2 L11.4 8 C11.4 6.9 13.6 6.9 13.6 8.2 L13.6 9 C13.6 8.1 15.5 8.2 15.5 9.5 C15.5 12.4 14.8 15.9 13.2 18.6 Z"
      fill="#ffffff" stroke="#1a1a1a" strokeWidth="0.9" strokeLinejoin="round"
    />
  </svg>
);
const Funnel = ({ s = 22, c = "#3a3a38" }: { s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 22 22" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 4 H19.5 L13 11 V18 L9 15.5 V11 Z" />
  </svg>
);
const Robot = ({ s = 22, c = "#3a3a38" }: { s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 22 22" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round">
    <rect x="4" y="7" width="14" height="11" rx="3" />
    <path d="M11 7 V3.5 M8.2 12 v1.6 M13.8 12 v1.6" />
  </svg>
);
const GridIco = ({ s = 22, c = "#3a3a38" }: { s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 22 22" fill="none" stroke={c} strokeWidth="1.6">
    <rect x="3" y="3" width="7" height="7" rx="1.6" />
    <rect x="12.5" y="3" width="7" height="7" rx="1.6" />
    <rect x="3" y="12.5" width="7" height="7" rx="1.6" />
    <path d="M16 12.5 v7 M12.5 16 h7" strokeLinecap="round" />
  </svg>
);
const DotGrid = ({ s = 16, c = "#5f5e56" }: { s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 16 16" fill={c}>
    {[2, 8, 14].flatMap((y) => [2, 8, 14].map((x) => <circle key={`${x}${y}`} cx={x} cy={y} r={y === 8 || x === 8 ? 1.5 : 1.1} />))}
  </svg>
);
const CloudIco = ({ s = 26, c = "#98978d" }: { s?: number; c?: string }) => (
  <svg width={s} height={(s * 16) / 26} viewBox="0 0 26 16" fill="none" stroke={c} strokeWidth="1.6">
    <path d="M7 14.5 a5.5 5.5 0 1 1 1.2-10.9 a6.4 6.4 0 0 1 12.3 1.9 a4.4 4.4 0 0 1-1 8.9 Z" strokeLinejoin="round" />
  </svg>
);
const PanelIco = ({ s = 22, c = "#6f6e68" }: { s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 22 22" fill="none" stroke={c} strokeWidth="1.6">
    <rect x="3" y="4" width="16" height="14" rx="3" />
    <path d="M9 4 V18" />
  </svg>
);
const SearchIco = ({ s = 22, c = "#6f6e68" }: { s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 22 22" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round">
    <circle cx="10" cy="10" r="6" />
    <path d="M14.5 14.5 L18.5 18.5" />
  </svg>
);
const PlusMinus = ({ s = 17, c = "#91908a" }: { s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 17 17" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round">
    <path d="M5 3.5 V8.5 M2.5 6 H7.5 M2.5 12.5 H8" />
    <path d="M10.5 11 L14.5 14.5 M14.5 11 L10.5 14.5" />
  </svg>
);
const Speech = ({ s = 20, c = "#23231f" }: { s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.8">
    <path d="M10 2.6 a7.4 7.4 0 1 1-6.9 10.1 L2.4 17 l4.3-.8 A7.4 7.4 0 0 1 10 2.6 Z" strokeLinejoin="round" />
  </svg>
);
const MicIco = ({ s = 19, c = "#ffffff" }: { s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 19 19" fill="none" stroke={c} strokeWidth="1.7" strokeLinecap="round">
    <rect x="7" y="2" width="5" height="9" rx="2.5" />
    <path d="M4 9.5 a5.5 5.5 0 0 0 11 0 M9.5 15 V17.5" />
  </svg>
);
const UpArrow = ({ s = 20, c = "#ffffff" }: { s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 16 V4.5 M4.8 9.5 L10 4.3 L15.2 9.5" />
  </svg>
);
const PlusIco = ({ s = 18, c = "#7c7b75" }: { s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 18 18" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round">
    <path d="M9 3 V15 M3 9 H15" />
  </svg>
);
const Chev = ({ s = 13, c = "#8f8e88" }: { s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 13 13" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 5 L6.5 8.5 L10 5" />
  </svg>
);

const SRowA = ({ y, icon, label, right }: { y: number; icon: React.ReactNode; label: string; right?: React.ReactNode }) => (
  <div className="srow" style={{ left: 38, top: y - 15, height: 30, width: 400 }}>
    {icon}
    <span>{label}</span>
    {right && <span style={{ marginLeft: "auto", marginRight: 16 }}>{right}</span>}
  </div>
);
const SRowB = ({ y, icon, label, right }: { y: number; icon: React.ReactNode; label: string; right?: React.ReactNode }) => (
  <div className="brow" style={{ left: 22, top: y - 12, height: 24, width: 268 }}>
    {icon}
    <span>{label}</span>
    {right && <span style={{ marginLeft: "auto", marginRight: 10 }}>{right}</span>}
  </div>
);

const BChat = () => (
  <>
    <div className="bhdr">New onboarding flow</div>
    <div className="bbubble"><span>build an onboarding flow that segments by persona</span></div>
    <div className="bblk bhd" style={{ top: 120 }}>Thought 5s</div>
    <div className="bblk" style={{ top: 150 }}>
      I'll explore the codebase for existing onboarding patterns and how personas<br />
      are modeled, then design a segmented flow that fits current conventions.
    </div>
    <div className="bblk bhd" style={{ top: 226 }}><b>Explored</b> 2 searches</div>
    <div className="bblk" style={{ top: 250 }}>
      Reading the portal onboarding implementation to see how cohorts and job<br />
      roles are wired today.
    </div>
    <div className="bblk bhd" style={{ top: 322 }}><b>Edited</b> 17 files, explored 6 files, 4 searches, lints, ran 3 commands&nbsp;+551 -31</div>
    <div className="bblk" style={{ top: 350 }}>
      Implementing persona segmentation: defining personas in shared constants,<br />
      branching the onboarding-v2 route flow, and wiring capture in JobDataForm.
    </div>
    <div className="bblk bhd" style={{ top: 422 }}><b>Explored</b> 24 files, 13 searches</div>
    <div className="bblk" style={{ top: 452 }}>
      I added a persona-segmented onboarding flow on the portal, wired to the<br />
      existing customize step (usage type + job role).
    </div>
    <div className="bblk planL" style={{ top: 515 }}>Planning next moves</div>
    <div className="ibar" style={{ left: 41, top: 805, width: 625 }}>
      <div className="plus"><PlusIco s={13} /></div>
      <span className="ph">Send follow-up</span>
      <span className="model">Cursor Grok 4.5 <span className="hfl">High Fast</span></span>
      <span className="chev"><Chev s={10} /></span>
      <div className="mic"><MicIco s={14} /></div>
    </div>
  </>
);

type TgEl = HTMLElement & {
  initializer?: (inst: TgEl) => (() => void) | void;
  addFrameTask: (cb: (info: { ownCurrentTimeMs: number }) => void) => () => void;
};

export const Windows = () => {
  const rootRef = useRef<TgEl>(null);

  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;
    tg.initializer = (inst) => {
      const q = <T extends HTMLElement>(sel: string) => inst.querySelector(sel) as T;
      const qa = (sel: string) => Array.from(inst.querySelectorAll(sel)) as HTMLElement[];

      const world = q(".world");
      const winA = q(".winA");
      const winB = q(".winB");
      const bpanelIn = q(".bpanelin");
      const selrect = q(".selrect");
      const selspan = q(".selspan");
      const blk1 = q(".ablk1");
      const tooltip = q(".tooltip");
      const tin = q(".tin");
      const cur = q(".cur");
      const curI = q(".curI");
      const curH = q(".curH");
      const ablkR = qa(".ablkR");
      const tcs = qa(".tc");
      const acard = q(".acard");
      const bubR = q(".bubR");
      const planR = q(".planR");
      const ibarR = q(".ibarR");
      const lbl1 = q(".lbl1");
      const lbl2 = q(".lbl2");
      const lblwrap = q(".lblwrap");

      let selWw = 260, selCx = 0, selCy = 0, selLx = 0;
      let TX2 = 0, TY2 = 0, ttCx = 0, ttCy = 0;
      let TX4 = 0, TY4 = 0, CCX = 0, CCY = 0;
      let sweepK = 1;
      let CURX: KF = [[0, 0]];
      let CURY: KF = [[0, 0]];
      const fontsApi: any = (document as any).fonts;
      if (fontsApi?.load) {
        ["25px Inter", "18px Inter", "14px Inter", "22px Inter", "500 20.5px Inter"].forEach((f) => fontsApi.load(f));
      }
      const measure = () => {
        const selWx = winA.offsetLeft + blk1.offsetLeft + selspan.offsetLeft;
        const selWy = winA.offsetTop + blk1.offsetTop + selspan.offsetTop;
        selWw = selspan.offsetWidth;
        const selWh = selspan.offsetHeight;
        selCx = selWx + selWw / 2;
        selCy = selWy + selWh / 2;
        selLx = selWx;
        selspan.style.backgroundImage = "linear-gradient(#e34a00, #e34a00)";
        selspan.style.backgroundRepeat = "no-repeat";
        selspan.style.backgroundPosition = "0 50%";
        TX2 = Q2[0] - selCx * S2;
        TY2 = Q2[1] - selCy * S2;
        ttCx = selCx + 286 / S2;
        ttCy = selCy - 196 / S2;
        tooltip.style.left = `${ttCx - 99}px`;
        tooltip.style.top = `${ttCy - 26.5}px`;
        const chip = inst.querySelector(".chip") as HTMLElement;
        const crow = chip.parentElement as HTMLElement;
        const chipWx = winB.offsetLeft + 984 + acard.offsetLeft + crow.offsetLeft + chip.offsetLeft;
        const chipWy = winB.offsetTop + acard.offsetTop + crow.offsetTop + chip.offsetTop;
        TX4 = Q4[0] - chipWx * S4;
        TY4 = Q4[1] - chipWy * S4;
        CCX = chipWx + 280;
        CCY = chipWy + 40;
        sweepK = selWw / (900 / S2);
        tcs.forEach((el, i) => (el.dataset.rt = String(T_TYPE0 + i / TYPE_RATE)));
        const w2 = (sx: number, sy: number): [number, number] => [(sx - TX2) / S2, (sy - TY2) / S2];
        const p405 = w2(1380, 600), p430 = w2(1425, 560), p463 = w2(1360, 505),
          p500 = w2(1240, 420), p530 = w2(1112, 318);
        CURX = [
          [3.05, selLx - 16], [3.22, selLx - 2], [3.7, selLx + selWw + 2], [4.05, p405[0]],
          [4.3, p430[0]], [4.63, p463[0]], [4.95, p500[0]], [5.15, p530[0]], [5.98, p530[0]],
        ];
        CURY = [
          [3.05, selCy + 48], [3.22, selCy + 12], [3.7, selCy + 12], [4.05, p405[1]],
          [4.3, p430[1]], [4.63, p463[1]], [4.95, p500[1]], [5.15, p530[1]],
          [5.6, p530[1]], [5.65, p530[1] + 2], [5.98, p530[1]],
        ];
      };
      measure();

      const render = (ms: number) => {
        const t = WINDOWS_ABS_START + ms / 1000;
        measure();

        let s = 1, tx = 0, ty = 0;
        if (t < 2.73) { /* rest */ }
        else if (t < 3.33) {
          const p = 1 - Math.pow(1 - seg(t, 2.73, 3.33), 4);
          s = lerp(1, S2, p); tx = lerp(0, TX2, p); ty = lerp(0, TY2, p);
        } else if (t < 5.63) { s = S2; tx = TX2; ty = TY2; }
        else if (t < 6.07) {
          const p = easeOut(seg(t, 5.63, 6.07));
          s = lerp(S2, 1, p); tx = lerp(TX2, 0, p); ty = lerp(TY2, 0, p);
        } else if (t < 6.4) { /* full view */ }
        else if (t < 6.83) {
          const p = Math.pow(seg(t, 6.4, 6.83), 2);
          s = lerp(1, 1.32, p); tx = CCX * (1 - s); ty = CCY * (1 - s);
        } else if (t < 8.73) {
          s = S4;
          tx = TX4 + kf(PANX, t);
          ty = TY4 + kf(PANY, t);
        } else if (t < 9.0) {
          const p = easeOut(seg(t, 8.73, 9.0));
          s = lerp(S4, 1, p);
          tx = lerp(TX4 + kf(PANX, 8.73), 0, p);
          ty = lerp(TY4 + kf(PANY, 8.73), 0, p);
        }
        world.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;

        const aVis = t < 5.98;
        winA.style.opacity = String(aVis ? 1 - seg(t, 5.72, 5.98) : 0);
        winA.style.transform = `translateY(${kf([[0, 12], [0.35, 0]], t)}px)`;
        ablkR.forEach((el) => {
          const rt = Number(el.dataset.rt);
          const p = easeOut(seg(t, rt, rt + 0.14));
          el.style.opacity = String(p);
          el.style.transform = `translateY(${8 * (1 - p)}px)`;
        });
        const swW = (kf(SWEEP, t) / S2) * sweepK;
        selspan.style.backgroundSize = t >= 3.23 ? `${swW}px 38px` : "0 0";
        selrect.style.opacity = "0";
        const tp = easeOut(seg(t, 4.03, 4.15));
        const press = 1 - 0.04 * (seg(t, 5.6, 5.63) * (1 - seg(t, 5.66, 5.7)));
        tooltip.style.opacity = String(tp * (aVis ? 1 : 0));
        tooltip.style.transform = `scale(${(0.8 + 0.2 * tp) * press})`;
        tin.style.opacity = String(seg(t, 5.3, 5.42));
        const cvis = t >= 3.02 && t < 5.98;
        cur.style.opacity = String(cvis ? seg(t, 3.02, 3.1) * (1 - seg(t, 5.72, 5.98)) : 0);
        if (cvis) {
          let cx: number;
          if (t >= 3.22 && t <= 3.7) cx = selLx + (kf(SWEEP, t) / S2) * sweepK + 2;
          else cx = kf(CURX, t);
          const cy = kf(CURY, t);
          cur.style.transform = `translate(${cx}px, ${cy}px)`;
        }
        curI.style.opacity = t < 4.05 ? "1" : "0";
        curH.style.opacity = t >= 4.05 ? "1" : "0";

        winB.style.opacity = String(seg(t, 5.72, 5.98));
        bpanelIn.style.transform = `translateX(${(1 - easeOut(seg(t, 5.75, 6.1))) * 80}px)`;
        tcs.forEach((el) => {
          el.style.opacity = t >= Number(el.dataset.rt) ? "1" : "0";
        });
        const sent = t >= 8.73;
        acard.style.opacity = sent ? "0" : "1";
        ibarR.style.opacity = sent ? "1" : "0";
        const bp = easeOut(seg(t, 8.9, 9.15));
        bubR.style.opacity = String(bp);
        bubR.style.transform = `translateY(${6 * (1 - bp)}px)`;
        planR.style.opacity = String(seg(t, 9.1, 9.4));
        const swp = t >= 8.8;
        lbl1.style.opacity = swp ? "0" : "1";
        lbl2.style.opacity = swp ? "1" : "0";
        lblwrap.style.width = `${swp ? lbl2.offsetWidth : lbl1.offsetWidth}px`;
      };

      render(0);
      const cleanup = inst.addFrameTask(({ ownCurrentTimeMs }) => render(ownCurrentTimeMs));
      return () => cleanup();
    };
    return () => {
      tg.initializer = undefined;
    };
  }, []);

  return (
    <Timegroup ref={rootRef as React.Ref<HTMLElement>} mode="fixed" duration={`${WINDOWS_MS}ms`} className="absolute w-full h-full">
      <div className="world">
        <EfImage className="wp" src={wallpaperJpg} />

        <div className="winA">
          <div className="achat" />
          <div className="asb">
            <div style={{ position: "absolute", left: 30, top: 24 }}><CubeLogo w={26} /></div>
            <div style={{ position: "absolute", left: 384, top: 27 }}><PanelIco /></div>
            <div style={{ position: "absolute", left: 424, top: 27 }}><SearchIco /></div>
            <SRowA y={129} icon={<Funnel />} label="New Agent" right={<span className="skbdtxt" style={{ color: "#a3a29a", fontSize: 20, fontFamily: '"Segoe UI Symbol", "Segoe UI", Inter' }}>⌘N</span>} />
            <SRowA y={183} icon={<Robot />} label="Automations" />
            <SRowA y={236} icon={<GridIco />} label="Marketplace" />
            <div className="sgrey" style={{ left: 38, top: 292 }}>Today</div>
            <div className="ssel" style={{ top: 331 }} />
            <SRowA y={356} icon={<DotGrid />} label="New onboarding flow" />
            <SRowA y={417} icon={<DotGrid />} label="Multi-tenant data isolation" right={<CloudIco />} />
            <SRowA y={469} icon={<DotGrid />} label="Port iOS app" right={<CloudIco />} />
            <SRowA y={521} icon={<DotGrid />} label="Build CI/CD pipeline" right={<CloudIco />} />
            <SRowA y={573} icon={<DotGrid />} label="Migrate to PlanetScale" right={<CloudIco />} />
          </div>
          <div className="ahdr">New onboarding flow</div>
          <div className="abubble"><span>build an onboarding flow that segments by persona</span></div>
          <div className="ablk ahd" style={{ top: 170 }}>Thought 5s</div>
          <div className="ablk" style={{ top: 205 }}>
            I'll explore the codebase for existing onboarding patterns and how personas are modeled,<br />
            then design a segmented flow that fits current conventions.
          </div>
          <div className="ablk ahd ablkR" data-rt="0.20" style={{ top: 305 }}><b>Explored</b> 2 searches</div>
          <div className="ablk ablk1 ablkR" data-rt="0.20" style={{ top: 346 }}>
            <div className="selrect" />
            Reading the portal onboarding implementation to see how <span className="selspan">cohorts and job roles</span> are wired<br />
            today.
          </div>
          <div className="ablk ahd ablkR" data-rt="0.33" style={{ top: 445 }}><b>Edited</b> 17 files, explored 6 files, 4 searches, lints, ran 3 commands&nbsp;&nbsp;+551 -31</div>
          <div className="ablk ablkR" data-rt="0.33" style={{ top: 486 }}>
            Implementing persona segmentation: defining personas in shared constants, branching<br />
            the onboarding-v2 route flow, and wiring capture in JobDataForm.
          </div>
          <div className="ablk ahd ablkR" data-rt="0.52" style={{ top: 586 }}><b>Explored</b> 24 files, 13 searches</div>
          <div className="ablk ablkR" data-rt="0.52" style={{ top: 630 }}>
            I added a persona-segmented onboarding flow on the portal, wired to the existing<br />
            customize step (usage type + job role).
          </div>
          <div className="ablk agrey ablkR" data-rt="0.52" style={{ top: 740, color: "#a9a8a0" }}>Planning next moves</div>
        </div>

        <div className="tooltip">
          <div className="tin" />
          <span>Add to Side Chat</span>
        </div>
        <div className="cur">
          <div className="curI" style={{ position: "absolute", left: -8.6, top: -12.6 }}><IBeam s={1.15} /></div>
          <div className="curH" style={{ position: "absolute", left: -14.4, top: -3.9, opacity: 0 }}><Hand s={2.2} /></div>
        </div>

        <div className="winB">
          <div className="bchat">
            <BChat />
          </div>
          <div className="bpanel">
            <div className="bpanelin" style={{ position: "absolute", inset: 0 }}>
              <div className="tabs" style={{ left: 20, top: 15 }}>
                <span className="tchanges"><PlusMinus />Changes</span>
                <span className="tpill">
                  <Speech s={18} />
                  <span className="lblwrap">
                    <span className="lbl1">New Side Chat</span>
                    <span className="lbl2" style={{ opacity: 0 }}>Data on personas</span>
                  </span>
                </span>
                <span className="tplus">+</span>
              </div>
              <div className="acard" style={{ left: 17, width: 593 }}>
                <div className="crow">
                  <span className="chip"><Speech s={13} c="#cf5525" />"cohorts and job roles"</span>
                  {TYPED.split("").map((ch, i) => (
                    <span key={i} className={`tc${i === 0 ? " tfirst" : ""}`}>{ch}</span>
                  ))}
                </div>
                <div className="mrow">
                  <div className="plus"><PlusIco s={13} /></div>
                  <span className="model">Cursor Grok 4.5 <span className="hfl">High Fast</span></span>
                  <span className="chev"><Chev s={10} /></span>
                  <div className="sendbtn"><UpArrow s={14} /></div>
                </div>
              </div>
              <div className="bubR" style={{ left: 17 }}><span>what kind of data do we have on personas?</span></div>
              <div className="planR" style={{ left: 30 }}>Planning next moves</div>
              <div className="ibar ibarR" style={{ left: 17, top: 805, width: 593 }}>
                <div className="plus"><PlusIco s={13} /></div>
                <span className="ph">Send follow-up</span>
                <span className="model">Cursor Grok 4.5 <span className="hfl">High Fast</span></span>
                <span className="chev"><Chev s={10} /></span>
                <div className="mic"><MicIco s={14} /></div>
              </div>
            </div>
          </div>
          <div className="bsb">
            <div style={{ position: "absolute", left: 28, top: 18 }}><CubeLogo w={22} /></div>
            <div style={{ position: "absolute", left: 250, top: 22 }}><PanelIco s={18} /></div>
            <div style={{ position: "absolute", left: 280, top: 22 }}><SearchIco s={18} /></div>
            <SRowB y={96} icon={<Funnel s={18} />} label="New Agent" right={<span style={{ color: "#a3a29a", fontSize: 16, fontFamily: '"Segoe UI Symbol", "Segoe UI", Inter' }}>⌘N</span>} />
            <SRowB y={153} icon={<Robot s={18} />} label="Automations" />
            <SRowB y={210} icon={<GridIco s={18} />} label="Marketplace" />
            <div className="bgrey" style={{ left: 22, top: 246 }}>Today</div>
            <div className="bsel" style={{ top: 288 }} />
            <SRowB y={308} icon={<DotGrid s={13} />} label="New onboarding flow" />
            <SRowB y={365} icon={<DotGrid s={13} />} label="Multi-tenant data isolation" right={<CloudIco s={20} />} />
            <SRowB y={417} icon={<DotGrid s={13} />} label="Port iOS app" right={<CloudIco s={20} />} />
            <SRowB y={469} icon={<DotGrid s={13} />} label="Build CI/CD pipeline" right={<CloudIco s={20} />} />
            <SRowB y={521} icon={<DotGrid s={13} />} label="Migrate to PlanetScale" right={<CloudIco s={20} />} />
          </div>
        </div>
      </div>
    </Timegroup>
  );
};
