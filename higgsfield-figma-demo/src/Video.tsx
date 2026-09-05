/* ------------------------------------------------------------------ */
/* Higgsfield for Figma — 27s concept demo, 1920x1080 @30fps.          */
/* Canonical composition entry. Master Timegroup: mode="fixed" 27s.    */
/* All motion is a pure function of the Editframe clock via            */
/* addFrameTask; scene visibility is driven via opacity only.          */
/*                                                                     */
/* Scene timeline (one "world" per beat, gated by t):                  */
/*   W1   0.00-2.76  title lockup assembles, zoom-blast transition     */
/*   W2   2.46-7.42  canvas brief: card drag-in, brief typing          */
/*   W3   7.42-11.78 prompt panel: thumb drop, LED generation wipe     */
/*   W4  11.78-15.14 layout card: context menu, background removal     */
/*   W5  15.14-17.52 hero page: stretched title, ticker row            */
/*   W6  17.52-22.05 logo drag onto canvas, video-gen panel            */
/*   W7  22.05-25.14 face card, marquee multi-select, prompt typing    */
/*   W8  25.14-27.00 full-bleed input, send, whip to the final grid    */
/* ------------------------------------------------------------------ */

import React, { useEffect, useRef } from "react";
import { Audio, Image as EfImage, Timegroup } from "@editframe/react";
import {
  AUDIO_SRC,
  BRAND_FACE_SRC,
  GRID_A_SRC,
  GRID_B_SRC,
  GRID_C_SRC,
  GRID_D_SRC,
  TOTAL_MS,
  WATCH_CUTOUT_SRC,
  WATCH_RENDER_SRC,
  WRIST_SRC,
} from "./constants";
import "./styles.css";

/* ---------------- helpers ---------------- */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);
const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
const easeOutBack = (p: number) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
};

/* waypoint path: [{t,x,y}] -> position at t (easeInOut between points) */
type Wp = { t: number; x: number; y: number };
const path = (t: number, pts: Wp[]) => {
  if (t <= pts[0].t) return { x: pts[0].x, y: pts[0].y };
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    if (t <= b.t) {
      const p = easeInOut(seg(t, a.t, b.t));
      return { x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p) };
    }
  }
  const l = pts[pts.length - 1];
  return { x: l.x, y: l.y };
};

/* camera keyframes: {t, fx, fy, s} — focus point + scale, screen-centered */
type Ck = { t: number; fx: number; fy: number; s: number; e?: (p: number) => number };
const cam = (t: number, ks: Ck[]) => {
  if (t <= ks[0].t) return ks[0];
  for (let i = 0; i < ks.length - 1; i++) {
    const a = ks[i], b = ks[i + 1];
    if (t <= b.t) {
      const p = (b.e || easeInOut)(seg(t, a.t, b.t));
      return { fx: lerp(a.fx, b.fx, p), fy: lerp(a.fy, b.fy, p), s: lerp(a.s, b.s, p) };
    }
  }
  return ks[ks.length - 1];
};
const camCss = (c: { fx: number; fy: number; s: number }) =>
  `translate(${960 - c.fx * c.s}px, ${540 - c.fy * c.s}px) scale(${c.s})`;

/* blur is rasterized at layer scale in headless chromium — a large scale
   times a big radius stalls the renderer. only blur at modest scales. */
const camBlur = (px: number, s: number) =>
  px < 0.3 || s > 1.6 ? "none" : `blur(${Math.min(px, 10)}px)`;

/* typing: returns visible substring */
const typed = (t: number, a: number, b: number, s: string) =>
  s.slice(0, Math.floor(s.length * seg(t, a, b)));

/* ---------------- static texts ---------------- */

const BRIEF = "Guys, new client\nWatch landing page\nOne-hour deadline\nThis photo is all we got";
const PROMPT1 = "Make professional product photography of a watch";
const PROMPT2 = "Minimalist watch logo, simple black silhouette";
const PROMPT3 = "Woman running across volcanic rocks, watch on wrist. Pro sportswear photoshoot.";
const LAYOUT_TXT = "Layout's done.\nPlug in your stuff.";
const FACE_TXT = "This is the face\nof the brand.\nClient just sent her over.";
const CAPTION = "A clinical-grade sensor array on an aerospace-titanium body. It reads your body 24/7 — and tells you what actually matters.";
const TICKER = ["EC", "BLOOD OXYGEN", "SKIN TEMPERATURE", "SLEEP STAGES", "36-HOUR BATTERY", "100M WATER-RATED", "GRADE-5 TITANIUM", "5G CELLULAR"];

/* ---------------- small components ---------------- */

const CursorSvg = ({ color }: { color: string }) => (
  <svg width="36" height="40" viewBox="0 0 18 20">
    <path d="M2 1.5 L16 10.6 L9 11.7 L5.2 18 Z" fill={color} stroke={color} strokeWidth="2.4" strokeLinejoin="round" />
  </svg>
);

const Cursor = ({ cls, color, pill, pillBg, pillColor }: { cls: string; color: string; pill?: string; pillBg?: string; pillColor?: string }) => (
  <div className={`cursor ${cls}`}>
    <CursorSvg color={color} />
    {pill ? (
      <div className="pill" style={{ background: pillBg || color, color: pillColor || "#fff" }}>{pill}</div>
    ) : null}
  </div>
);

const Sel = ({ cls, style }: { cls?: string; style?: React.CSSProperties }) => (
  <div className={`sel ${cls || ""}`} style={style}>
    <div className="h tl" /><div className="h tr" /><div className="h bl" /><div className="h br" />
  </div>
);

/* Higgsfield squiggle mark — two adjacent loops with a descender tail */
const Squiggle = ({ w, color }: { w: number; color: string }) => (
  <svg width={w} height={w * 0.78} viewBox="0 0 120 94" fill="none">
    <path
      d="M8 22 C18 12 30 12 34 22 C38 32 26 36 20 44 C10 56 18 68 32 66 C48 63 52 48 66 42 C80 36 92 40 94 52 C96 66 84 78 74 74 C64 70 68 56 80 52 C92 48 100 52 112 52"
      stroke={color} strokeWidth="13" strokeLinecap="butt" fill="none"
    />
  </svg>
);

/* pixelated squiggle (intro tile) — native rect grid */
const PIX: Array<[number, number]> = [
  [2,3],[3,2],[4,2],[5,3],[5,4],[4,5],[3,6],[3,7],[4,8],[5,8],[6,7],[6,6],[5,5],
  [7,4],[8,3],[9,3],[10,4],[10,5],[9,6],[8,7],[8,8],[9,9],[10,9],[11,8],[11,7],
  [6,9],[7,10],[8,10],[12,6],[12,9],[11,10],
];
const PixSquiggle = ({ w }: { w: number }) => (
  <svg width={w} height={w} viewBox="0 0 14 14">
    {PIX.map(([x, y], i) => <rect key={i} x={x} y={y} width="1.08" height="1.08" fill="#2B2F24" />)}
  </svg>
);

/* Figma mark (5 shapes) */
const FigmaMark = ({ w }: { w: number }) => {
  const u = w / 2;
  return (
    <div style={{ position: "relative", width: w, height: u * 3 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: u, height: u, background: "#ED2038", borderRadius: `${u/2}px 0 0 ${u/2}px` }} />
      <div style={{ position: "absolute", left: u, top: 0, width: u, height: u, background: "#F2653A", borderRadius: `0 ${u/2}px ${u/2}px 0` }} />
      <div style={{ position: "absolute", left: 0, top: u, width: u, height: u, background: "#833BF8", borderRadius: `${u/2}px 0 0 ${u/2}px` }} />
      <div style={{ position: "absolute", left: u, top: u, width: u, height: u, background: "#10C4F9", borderRadius: "50%" }} />
      <div style={{ position: "absolute", left: 0, top: u * 2, width: u, height: u, background: "#30E171", borderRadius: `${u/2}px 0 ${u/2}px ${u/2}px` }} />
    </div>
  );
};

/* generated blob logo (Vector Generation result / Logo.svg / nav mark) */
const BlobLogo = ({ w }: { w: number }) => (
  <svg width={w} height={w * 1.08} viewBox="0 0 100 108">
    <path d="M48 3 C68 -2 88 10 94 28 C99 43 91 52 96 64 C101 79 90 96 72 102 C56 107 40 105 28 96 C14 86 5 72 7 56 C9 42 3 34 10 22 C17 9 34 6 48 3 Z" fill="#0B0B0B" />
    <ellipse cx="32" cy="45" rx="15" ry="19" fill="#fff" />
    <path d="M57 17 C67 11 78 20 76 32 C74 44 64 49 57 43 C50 37 49 23 57 17 Z" fill="#fff" />
    <path d="M51 54 C61 49 70 60 66 74 C62 88 48 95 42 87 C35 79 40 60 51 54 Z" fill="#fff" />
    <path d="M70 40 C77 38 83 45 81 53 C79 61 70 61 68 55 C66 48 65 42 70 40 Z" fill="#0B0B0B" />
    <path d="M22 74 C27 71 33 75 32 81 C31 87 24 88 21 84 C18 80 18 76 22 74 Z" fill="#fff" />
  </svg>
);

/* Higgsfield panel */
const Panel = ({ cls, thumbs, mosaic }: { cls: string; thumbs?: string[]; mosaic?: boolean }) => (
  <div className={`hpanel ${cls}`} style={{ height: 970 }}>
    <div className="tbar">
      <div className="chip"><Squiggle w={22} color="#1A2000" /></div>
      <div className="tname">Higgsfield</div>
      <div className="x">✕</div>
    </div>
    <div className="tabs">
      <div className="avatar" />
      <div className="tabwrap">
        <div className="tab"><span style={{ fontSize: 17 }}>⊞</span> Apps</div>
        <div className="tab on"><span style={{ fontSize: 17 }}>▣</span> Image</div>
        <div className="tab"><span style={{ fontSize: 17 }}>▶</span> Video</div>
      </div>
      <div className="lay"><span style={{ color: "#B9B9BE", fontSize: 16 }}>◫</span></div>
    </div>
    <div className={`body-${cls}`} style={{ position: "absolute", left: 24, right: 24, top: 130, bottom: 320 }} />
    <div className={`hinput hinput-${cls}`}>
      <div className="thumbs">
        {(thumbs || []).map((src, i) => (
          <div key={i} className="thumb"><EfImage src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
        ))}
      </div>
      <div className="ptext" />
      <div className="plus">+</div>
      <div className="send">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 19V6M6 12l6-6 6 6" stroke="#101300" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      {mosaic ? (
        <div className="mosaic">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className={`ms ms${n}${n % 2 ? "" : " dim"}`} />
          ))}
        </div>
      ) : null}
    </div>
  </div>
);

/* site frame; scale = inner scale from 1920 design px */
const Site = ({ cls, w, scale }: { cls: string; w: number; scale: number }) => (
  <div className={`site ${cls}`} style={{ width: w, height: 3000 * scale }}>
    <div className="inner" style={{ transform: `scale(${scale})` }}>
      <div className="snav">
        <div className="brand"><span className={`mark mark-${cls}`} style={{ display: "inline-flex", opacity: 0 }}><BlobLogo w={30} /></span>HiggsWatch</div>
        <div className="links"><span>GALLERY</span><span>DETAILS</span><span>FEATURES</span><span>FAQ</span></div>
        <div className="cta">Pre-order</div>
      </div>
      <div className="shero">
        <div className={`bigtitle title-${cls}`} />
        <div className={`wimg wimg-${cls}`} style={{ opacity: 0 }}>
          <EfImage src={WATCH_CUTOUT_SRC} style={{ width: "100%" }} />
        </div>
        <div className="cap">{CAPTION}</div>
        <div className="btns">
          <div className="pre">Pre-order — from $399</div>
          <div className="wt">What it tracks &rsaquo;</div>
        </div>
      </div>
      <div className="sticker">
        <div className={`row trow-${cls}`}>
          {[0, 1, 2].map((r) => (
            <React.Fragment key={r}>
              {TICKER.map((it, i) => (
                <React.Fragment key={i}>
                  <span className="it">{it}</span><span className="sep">/</span>
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="swild">
        <div className="lbl"><span className="sq" />IN THE WILD</div>
        <div className="arrows"><div className="ar">‹</div><div className="ar">›</div></div>
        <div className="gcard" style={{ left: 380, top: 300 }}>
          <div className="gt">Engineered<br />for motion</div>
          <div className="gs">Engineered for those<br />who move.</div>
        </div>
        <div className="gcard" style={{ left: 1330, top: 300 }}>
          <div className="gt">Always<br />on alert</div>
          <div className="gs">Tracks what<br />matters.</div>
        </div>
        <div className="gsub" style={{ left: 380, top: 852 }}>MORNING RUN · HEART ZONES LIVE</div>
        <div className="gsub" style={{ left: 1330, top: 852 }}>DESK TO DINNER · ONE BAND</div>
      </div>
      <div className="sdark">
        <div className="lbl2"><span className="dot" />UP CLOSE</div>
        <div className="h2">Every detail, engineered to<br />be felt.</div>
        <div className="prow">
          <div className="pc" />
          <div className="pc" />
          <div className="pc buy">
            <div className="b1">Buy with one-click</div>
            <div className="b2">HiggsWatch</div>
            <div className="b3">$18 <span className="off">45%</span></div>
            <div className="b4">Short product description placeholder — 1–2 lines about the watch.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ---------------- main ---------------- */

type TgEl = HTMLElement & {
  initializer?: (inst: TgEl) => (() => void) | void;
  addFrameTask: (cb: (info: { ownCurrentTimeMs: number }) => void) => () => void;
};

export const Video = () => {
  const rootRef = useRef<TgEl>(null);

  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;

    tg.initializer = (inst) => {
      const q = <T extends HTMLElement>(sel: string) => inst.querySelector(sel) as T | null;
      const qa = (sel: string) => Array.from(inst.querySelectorAll<HTMLElement>(sel));

      /* worlds */
      const w1 = q(".w1"), w2 = q(".w2"), w3 = q(".w3"), w4 = q(".w4");
      const w5 = q(".w5"), w6 = q(".w6"), w7 = q(".w7"), w8 = q(".w8");
      const cams = {
        c1: q(".cam1"), c2: q(".cam2"), c3: q(".cam3"), c4: q(".cam4"),
        c5: q(".cam5"), c6: q(".cam6"), c7: q(".cam7"), c8: q(".cam8"),
      };

      /* W1 refs */
      const tile = q(".i-tile"), tileGhost = q(".i-ghost"), tileSel = q(".i-sel0");
      const vecSq = q(".i-vec"), hgText = q(".i-hg"), hgSel = q(".i-hgsel");
      const forTxt = q(".i-for"), figmaTxt = q(".i-figma"), figmaSlot = q(".i-fslot");
      const movers = qa(".i-mv");
      const introCursors = qa(".w1 .cursor");

      /* W2 refs */
      const briefTxt = q(".b-text"), briefBg = q(".b-bg"), briefSel = q(".b-sel");
      const wristCard2 = q(".b-wrist");
      const cur2Calm = q(".w2 .cur-calm"), cur2Dem = q(".w2 .cur-dem");
      const cur2Jag = q(".w2 .cur-jag");
      const pill2Calm = q(".w2 .cur-calm .pill"), pill2Dem = q(".w2 .cur-dem .pill");
      /* horizontal whip smear: directional blur built from a screen-space
         X stretch (about x=960) plus isotropic blur, so letters stretch
         through the whip */
      const whipCss = (n: number, k = 1.7) =>
        n > 0.01 ? `translateX(960px) scale(${1 + k * n}, 1) translateX(-960px) ` : "";

      /* W3 refs */
      const panel3 = q(".hpanel.p3"), input3text = q(".hinput-p3 .ptext");
      const input3 = q(".hinput-p3"), thumbs3 = q(".hinput-p3 .thumbs");
      const wrist3 = q(".g3-wrist"), wrist3sel = q(".g3-sel");
      const flyThumb = q(".g3-fly"), inprog3 = q(".g3-prog");
      const result3 = q(".g3-result"), body3 = q(".body-p3");
      const cur3 = q(".w3 .cur-jag"), send3 = q(".hinput-p3 .send");
      const mosaic3 = q(".hinput-p3 .mosaic");
      const mpatch3 = qa(".hinput-p3 .ms");
      const pill3s = q(".g3-screenpill");

      /* W4 refs */
      const card4 = q(".g4-card"), layoutTxt = q(".g4-layout"), layoutSel = q(".g4-lsel");
      const menu4 = q(".g4-menu"), imgTop4 = q(".g4-imgtop") as HTMLElement | null;
      const white4 = q(".g4-white"), speck4 = q(".g4-speck");
      const cur4dem = q(".w4 .cur-dem"), cur4jag = q(".w4 .cur-jag");

      /* W5 refs */
      const wimg5 = q(".wimg-s5"), title5 = q(".title-s5"), title5sel = q(".g5-tsel");
      const trow5 = q(".trow-s5");
      const cur5calm = q(".w5 .cur-calm"), cur5jag = q(".w5 .cur-jag");

      /* W6 refs */
      const input6 = q(".hinput-p6"), input6text = q(".hinput-p6 .ptext");
      const vgWrap = q(".g6-vg"), vgLogo = q(".g6-logo"), dragLogo = q(".g6-drag");
      const mark6 = q(".mark-s6"), trow6 = q(".trow-s6"), title6 = q(".title-s6"), wimg6 = q(".wimg-s6");
      const cur6 = q(".w6 .cur-jag"), cur6calm = q(".w6 .cur-calm"), send6 = q(".hinput-p6 .send");

      /* W7 refs */
      const face7 = q(".g7-face"), faceSel7 = q(".g7-fsel"), faceTxt = q(".g7-text"), faceBg = q(".g7-bg"), faceTxtSel = q(".g7-tsel");
      const wrist7 = q(".g7-wrist"), panel7 = q(".hpanel.p7"), thumbs7 = q(".hinput-p7 .thumbs");
      const cur7calm = q(".w7 .cur-calm"), cur7dem = q(".w7 .cur-dem");
      const marq7 = q(".g7-marquee"), input7text = q(".hinput-p7 .ptext");

      /* W8 refs */
      const input8text = q(".g8-input .ptext8"), send8btn = q(".g8-send");
      const tiles8 = qa(".g8-grid .gtile"), cur8 = q(".w8 .cur-calm"), cur8dem = q(".w8 .cur-dem");

      const setT = (el: HTMLElement | null, v: string) => { if (el && el.textContent !== v) el.textContent = v; };
      const st = (el: HTMLElement | null, prop: string, v: string) => { if (el) (el.style as unknown as Record<string, string>)[prop] = v; };

      /* Figma-shape flight targets (slot at 1135,475, unit 52.5) */
      const U = 52.5;
      const flights = [
        { x: 1135, y: 475, fx: 2050, fy: -150 },       /* red */
        { x: 1135 + U, y: 475, fx: 2150, fy: 260 },    /* orange */
        { x: 1135, y: 475 + U, fx: 1550, fy: 1250 },   /* purple */
        { x: 1135 + U, y: 475 + U, fx: 2100, fy: 700 },/* blue */
        { x: 1135, y: 475 + 2 * U, fx: 1350, fy: 1300 } /* green */
      ];
      const flightDelay = [0, 0.05, 0.1, 0.14, 0.18];
      /* two phases: shapes converge at ~2.6x scale into a loose
         cluster (visible t≈1.0-1.3), then the cluster shrinks into the slot */
      const flightLarge = [
        { x: 1205, y: 374 }, { x: 1342, y: 374 },
        { x: 1205, y: 511 }, { x: 1342, y: 511 },
        { x: 1205, y: 647 },
      ];

      const introCurWp: Wp[][] = [
        /* honda -> red */    [{ t: 0.7, x: 1980, y: -60 }, { t: 1.0, x: 1265, y: 345 }, { t: 1.55, x: 1140, y: 465 }, { t: 1.9, x: 900, y: 380 }],
        /* calm -> orange */  [{ t: 0.72, x: 2050, y: 300 }, { t: 1.02, x: 1450, y: 330 }, { t: 1.55, x: 1240, y: 470 }, { t: 1.9, x: 1500, y: 420 }],
        /* 5th -> purple */   [{ t: 0.75, x: 1500, y: 1220 }, { t: 1.05, x: 1240, y: 545 }, { t: 1.6, x: 1140, y: 530 }, { t: 1.9, x: 1100, y: 700 }],
        /* demius -> blue */  [{ t: 0.73, x: 2100, y: 760 }, { t: 1.03, x: 1420, y: 530 }, { t: 1.55, x: 1230, y: 545 }, { t: 1.9, x: 1450, y: 700 }],
        /* jagan -> green */  [{ t: 0.78, x: 1400, y: 1350 }, { t: 1.1, x: 1650, y: 760 }, { t: 1.6, x: 1750, y: 850 }, { t: 1.9, x: 1850, y: 950 }],
      ];

      const render = (tMs: number) => {
        const t = tMs / 1000;

        /* world switching — opacity plus content-visibility so inactive
           worlds are fully skipped by the compositor (textures released;
           opacity-0 alone accumulates GPU memory across 800+ frames). */
        const gate = (el: HTMLElement | null, on: boolean) => {
          if (!el) return;
          el.style.opacity = on ? "1" : "0";
          (el.style as unknown as Record<string, string>).contentVisibility = on ? "visible" : "hidden";
        };
        gate(w1, t < 2.76);
        gate(w2, t >= 2.46 && t < 7.42);
        gate(w3, t >= 7.42 && t < 11.78);
        gate(w4, t >= 11.78 && t < 15.14);
        gate(w5, t >= 15.14 && t < 17.52);
        gate(w6, t >= 17.52 && t < 22.05);
        gate(w7, t >= 22.05 && t < 25.14);
        gate(w8, t >= 25.14);

        /* ============ W1: intro 0–2.76 ============ */
        if (w1 && t < 2.76) {
          /* layer ZOOM-THROUGH, not a pan — lockup scales up
             from center (1.06 → ~9x, first move 2.40, peak 2.55) and flies
             past the frame edges by 2.75 over the static canvas beneath */
          const c = cam(t, [
            { t: 0, fx: 960, fy: 540, s: 1 },
            { t: 0.33, fx: 960, fy: 540, s: 1 },
            { t: 0.55, fx: 940, fy: 542, s: 1.06 },
            { t: 2.38, fx: 940, fy: 542, s: 1.06 },
            /* zoom center 967 = inside the "…field | for" word space, so the
               d exits left and the f lingers right */
            { t: 2.45, fx: 967, fy: 542, s: 1.5 },
            { t: 2.55, fx: 967, fy: 542, s: 2.5 },
            { t: 2.65, fx: 967, fy: 542, s: 16 },
            { t: 2.76, fx: 967, fy: 542, s: 30 },
          ]);
          const zoomN = seg(t, 2.45, 2.6) * (1 - seg(t, 2.7, 2.8));
          st(cams.c1, "transform", whipCss(zoomN, 0.55) + camCss(c));
          const blur = 8 * seg(t, 0.34, 0.42) * (1 - seg(t, 0.45, 0.58));
          /* zoom smear: filter applies PRE-transform, so screen blur =
             radius x scale — world-constant 6px reads as ghosting at s2.8
             and huge soft blobs at s12+ (camBlur's s>1.6
             guard would kill it entirely, hence the bypass) */
          const zBlur = Math.min(9, 45 / c.s) * seg(t, 2.44, 2.52);
          st(cams.c1, "filter", zBlur > 0.3 ? `blur(${zBlur.toFixed(1)}px)` : camBlur(blur, c.s));

          /* tile & resolve */
          st(tile, "opacity", String(1 - seg(t, 0.36, 0.5)));
          st(tileGhost, "opacity", String(0.5 * (1 - seg(t, 0.36, 0.46))));
          st(tileSel, "opacity", String(1 - seg(t, 0.36, 0.46)));
          st(vecSq, "opacity", String(seg(t, 0.4, 0.52)));

          /* Higgsfield typing */
          const hg = typed(t, 0.4, 0.82, "Higgsfield");
          setT(hgText, hg);
          st(hgSel, "opacity", String(seg(t, 0.38, 0.44) * (1 - seg(t, 0.9, 1.05))));
          if (hgSel) hgSel.style.width = `${Math.max(120, 42 + hg.length * 39)}px`;

          /* shape flights */
          movers.forEach((m, i) => {
            const f = flights[i];
            const lg = flightLarge[i];
            const d = flightDelay[i];
            const p1 = easeOutCubic(seg(t, 0.74 + d, 1.1 + d));
            const p2 = easeInOut(seg(t, 1.32 + d, 1.66 + d));
            const x = p2 > 0 ? lerp(lg.x, f.x, p2) : lerp(f.fx, lg.x, p1);
            const y = p2 > 0 ? lerp(lg.y, f.y, p2) : lerp(f.fy, lg.y, p1);
            const sc = p2 > 0 ? lerp(2.6, 1, p2) : lerp(2.1, 2.6, p1);
            m.style.transform = `translate(${x}px, ${y}px) scale(${sc})`;
            m.style.opacity = t >= 0.72 + d ? "1" : "0";
            const mb = m.querySelector(".mb") as HTMLElement | null;
            if (mb) mb.style.opacity = String((1 - p1) * 0.9);
            const msel = m.querySelector(".sel") as HTMLElement | null;
            if (msel) msel.style.opacity = String(seg(t, 0.8 + d, 0.9 + d) * (1 - seg(t, 1.66, 1.84)));
          });

          /* for + Figma text */
          st(forTxt, "opacity", String(seg(t, 1.58, 1.85)));
          if (forTxt) forTxt.style.transform = `translateX(${(1 - easeOutCubic(seg(t, 1.58, 1.85))) * -18}px)`;
          st(figmaTxt, "opacity", String(seg(t, 1.42, 1.62)));
          if (figmaTxt) figmaTxt.style.transform = `translateY(${(1 - easeOutCubic(seg(t, 1.42, 1.62))) * 14}px)`;
          st(figmaSlot, "opacity", "1");

          /* intro cursors */
          introCursors.forEach((cEl, i) => {
            const wp = introCurWp[i];
            if (!wp) return;
            const pos = path(t, wp);
            cEl.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
            cEl.style.opacity = t >= wp[0].t ? String(1 - seg(t, 1.72, 1.92)) : "0";
          });
        }

        /* ============ W2: brief 2.46–7.42 ============ */
        if (w2 && t >= 2.46 && t < 7.42) {
          /* canvas is STATIC during the title zoom-through —
             no pan-in; it just sits beneath while W1 flies out */
          const c = cam(t, [
            { t: 2.46, fx: 960, fy: 540, s: 1.0 },
            { t: 3.0, fx: 960, fy: 540, s: 1.0 },
            { t: 4.9, fx: 1120, fy: 590, s: 1.17 },
            { t: 7.0, fx: 1145, fy: 598, s: 1.18 },
            { t: 7.42, fx: 1750, fy: 620, s: 1.3 },
          ]);
          /* the reveal blurs ALL elements — canvas
             layer (cursors included) gets horizontal stretch + blur while
             the title blasts through, crisp again by ~2.65 */
          const revN = seg(t, 2.5, 2.56) * (1 - seg(t, 2.58, 2.66));
          st(cams.c2, "transform", whipCss(revN, 0.3) + camCss(c));
          st(cams.c2, "filter", camBlur(4 * revN + 13 * seg(t, 7.05, 7.42), c.s));

          /* wrist card dragged in by Jagan96 from off-right — pinned by
             waypoints: partially on at 3.05,
             ~quarter across at 3.20, landed 3.62 */
          const dwp = path(t, [
            { t: 2.94, x: 1330, y: 215 }, { t: 3.0, x: 1050, y: 170 },
            { t: 3.05, x: 820, y: 133 }, { t: 3.2, x: 120, y: 19 },
            { t: 3.4, x: 0, y: 0 },
          ]);
          const dxc = t >= 2.94 ? dwp.x : 1330, dyc = t >= 2.94 ? dwp.y : 215;
          const dp = 1 - dxc / 1330;
          if (wristCard2) {
            /* entry smear is DIRECTIONAL —
               horizontal stretch + modest blur, not pure gaussian */
            wristCard2.style.transform = `translate(${dxc}px, ${dyc}px) rotate(${(1 - dp) * -5}deg) scaleX(${1 + (1 - dp) * 0.5})`;
            wristCard2.style.filter = dp > 0 && dp < 1 ? `blur(${(1 - dp) * 6}px)` : "none";
          }
          st(wristCard2, "opacity", t >= 2.94 ? "1" : "0");
          /* card passes OVER Demius (t=3.2) but Jagan drags on top of it */
          st(wristCard2, "zIndex", "3");
          st(cur2Jag, "zIndex", "4");

          if (cur2Jag) {
            let jx: number, jy: number, jop = 1;
            if (t < 3.78) { jx = 915 + dxc; jy = 475 + dyc; jop = t >= 2.9 ? 1 : 0; }
            else {
              const jp = path(t, [{ t: 3.78, x: 915, y: 475 }, { t: 4.1, x: 1390, y: 470 }, { t: 4.5, x: 2150, y: 640 }]);
              jx = jp.x; jy = jp.y; jop = 1 - seg(t, 4.35, 4.5);
            }
            cur2Jag.style.transform = `translate(${jx}px, ${jy}px)`;
            cur2Jag.style.opacity = String(jop);
          }

          /* brief typing — starts after the card lands, no text until 3.85 */
          const btxt = typed(t, 3.85, 6.55, BRIEF);
          setT(briefTxt, btxt);
          const lines = btxt.length ? btxt.split("\n").length : 0;
          st(briefBg, "opacity", String(seg(t, 3.8, 3.88)));
          st(briefSel, "opacity", String(seg(t, 3.8, 3.88)));
          if (briefSel) briefSel.style.height = `${Math.max(70, lines * 68 + 22)}px`;
          if (briefBg) briefBg.style.height = `${Math.max(70, lines * 68 + 22)}px`;

          /* cursor spots during the reveal, fading in as the title clears */
          const pc = path(t, [{ t: 2.48, x: 790, y: 700 }, { t: 2.55, x: 776, y: 715 }, { t: 2.65, x: 679, y: 724 }, { t: 2.85, x: 625, y: 765 }, { t: 3.9, x: 540, y: 790 }, { t: 5.4, x: 340, y: 905 }, { t: 7.0, x: 520, y: 960 }]);
          if (cur2Calm) cur2Calm.style.transform = `translate(${pc.x}px, ${pc.y}px)`;
          st(cur2Calm, "opacity", String(seg(t, 2.46, 2.56)));
          /* name tags absent mid-blast, fade in 2.72-2.85 */
          st(pill2Calm, "opacity", String(seg(t, 2.72, 2.85)));
          st(pill2Dem, "opacity", String(seg(t, 2.72, 2.85)));
          const pd = path(t, [{ t: 2.48, x: 975, y: 705 }, { t: 2.55, x: 967, y: 715 }, { t: 2.65, x: 922, y: 719 }, { t: 2.85, x: 917, y: 753 }, { t: 3.9, x: 870, y: 784 }, { t: 5.6, x: 905, y: 940 }, { t: 7.2, x: 1500, y: 700 }]);
          if (cur2Dem) cur2Dem.style.transform = `translate(${pd.x}px, ${pd.y}px)`;
          st(cur2Dem, "opacity", String(seg(t, 2.46, 2.56)));
        }

        /* ============ W3: watch generation 7.42–11.78 ============ */
        if (w3 && t >= 7.42 && t < 11.78) {
          const c = cam(t, [
            { t: 7.42, fx: 900, fy: 540, s: 1 },
            { t: 8.85, fx: 900, fy: 540, s: 1 },
            { t: 9.2, fx: 1466, fy: 878, s: 2.38 },
            { t: 10.14, fx: 1466, fy: 878, s: 2.38 },
            { t: 10.38, fx: 1466, fy: 560, s: 1.34 },
            { t: 10.95, fx: 1466, fy: 560, s: 1.34 },
            { t: 11.45, fx: 1466, fy: 468, s: 3.0 },
          ]);
          /* zoom-out from 10.16 is a fast blurred vertical whip —
             camBlur's s>1.6 guard would kill it, so bypass with screen-space
             radius + vertical stretch smear */
          const vwN = seg(t, 10.16, 10.26) * (1 - seg(t, 10.3, 10.42));
          const vWhip = vwN > 0.01 ? `translateY(540px) scale(1, ${1 + 0.5 * vwN}) translateY(-540px) ` : "";
          st(cams.c3, "transform", vWhip + camCss(c));
          const blur = 10 * seg(t, 7.42, 7.5) * (1 - seg(t, 7.55, 7.8)) + 6 * seg(t, 8.85, 8.95) * (1 - seg(t, 9.0, 9.2)) + 8 * seg(t, 11.0, 11.12) * (1 - seg(t, 11.2, 11.45));
          const zo = 16 * seg(t, 10.16, 10.24) * (1 - seg(t, 10.34, 10.48));
          st(cams.c3, "filter", zo > 0.3 ? `blur(${(zo / c.s).toFixed(1)}px)` : camBlur(blur, c.s));

          /* panel slide-in */
          const ps = easeOutCubic(seg(t, 7.42, 7.95));
          if (panel3) panel3.style.transform = `translateX(${lerp(860, 0, ps)}px)`;

          /* wrist selected card */
          st(wrist3sel, "opacity", t < 8.6 ? "1" : "0");

          /* drag thumb into input — lands BEFORE the zoom; typing starts wide */
          const fp = seg(t, 8.0, 8.3);
          if (flyThumb) {
            const fx = lerp(670, 1200, easeInOut(fp));
            const fy = lerp(445, 830, easeInOut(fp));
            const fs = lerp(1, 0.36, easeInOut(fp));
            flyThumb.style.transform = `translate(${fx}px, ${fy}px) scale(${fs})`;
            flyThumb.style.opacity = t >= 7.98 && t < 8.32 ? "1" : "0";
          }
          if (thumbs3) thumbs3.style.opacity = t >= 8.3 ? "1" : "0";
          if (input3) input3.classList.toggle("hasthumbs", t >= 8.3 && t < 10.25);
          const glow = seg(t, 8.3, 8.4) * (1 - seg(t, 8.45, 8.8));
          st(thumbs3, "filter", glow > 0.05 ? `drop-shadow(0 0 ${18 * glow}px rgba(233,0,155,${0.9 * glow}))` : "none");

          /* prompt typing — starts in the wide view, zoom happens mid-type */
          /* prompt text + thumb stay visible UNDER the LED field until it
             dissolves */
          setT(input3text, t < 10.25 ? typed(t, 8.45, 9.62, PROMPT1) : "");
          if (thumbs3 && t >= 10.25) thumbs3.style.opacity = "0";

          /* send press */
          const press = seg(t, 9.64, 9.7) * (1 - seg(t, 9.7, 9.82));
          if (send3) send3.style.transform = `scale(${1 - 0.14 * press})`;

          /* LED generation field grows OUT of the send button: cluster at
             9.70, full input coverage by ~10.04, dissolved by 10.35. Built
             as statically-masked dot strips staggered by opacity only,
             shimmering as they pass. */
          if (mosaic3) {
            const mo = t >= 9.68 ? 1 - seg(t, 10.36, 10.42) : 0;
            mosaic3.style.opacity = String(mo);
            if (mo > 0) {
              /* traveling vertical wave: born at send (right) BY 9.70, clears
                 BEHIND itself as it sweeps left (left remnant at 10.20) */
              const starts = [9.62, 9.72, 9.82, 9.9, 9.96, 10.0];
              const offs = [9.94, 10.02, 10.1, 10.18, 10.26, 10.32];
              mpatch3.forEach((p, i) => {
                const born = seg(t, starts[i], starts[i] + 0.09);
                const on = born * (1 - seg(t, offs[i], offs[i] + 0.12));
                p.style.opacity = String(on * (0.62 + 0.33 * Math.sin(t * 24 + i * 1.7)));
                p.style.transform = `scaleY(${0.35 + 0.65 * seg(t, starts[i], starts[i] + 0.16)})`;
              });
            }
          }

          /* in progress */
          st(inprog3, "opacity", String(seg(t, 10.18, 10.32) * (1 - seg(t, 10.62, 10.75))));
          const sp = inprog3?.querySelector(".spin") as HTMLElement | null;
          if (sp) sp.style.transform = `rotate(${t * 540}deg)`;

          /* result reveal */
          if (result3) {
            const rp = easeOutCubic(seg(t, 10.72, 11.1));
            result3.style.opacity = String(seg(t, 10.72, 10.85));
            result3.style.clipPath = `inset(${(1 - rp) * 100}% 0 0 0)`;
            result3.style.filter = `blur(${(1 - rp) * 8}px)`;
          }

          /* Jagan96 cursor */
          const jp = path(t, [
            { t: 7.9, x: 880, y: 690 }, { t: 8.0, x: 700, y: 480 }, { t: 8.3, x: 1240, y: 862 },
            { t: 9.55, x: 1560, y: 940 }, { t: 9.64, x: 1764, y: 968 }, { t: 10.3, x: 1764, y: 968 },
            { t: 11.1, x: 1520, y: 700 },
          ]);
          if (cur3) { cur3.style.transform = `translate(${jp.x}px, ${jp.y}px)`; cur3.style.opacity = t >= 7.9 ? "1" : "0"; }

          /* screen-space pill during full-bleed */
          st(pill3s, "opacity", String(seg(t, 11.35, 11.5)));
        }

        /* ============ W4: site + remove bg 11.78–15.14 ============ */
        if (w4 && t >= 11.78 && t < 15.14) {
          const c = cam(t, [
            { t: 11.78, fx: 1385, fy: 792, s: 3.0 },
            { t: 12.18, fx: 960, fy: 540, s: 1.0 },
            { t: 13.47, fx: 960, fy: 540, s: 1.0 },
            { t: 13.85, fx: 1385, fy: 790, s: 2.66 },
            { t: 15.14, fx: 1385, fy: 790, s: 2.66 },
          ]);
          st(cams.c4, "transform", camCss(c));
          const blur = 9 * (1 - seg(t, 11.82, 12.14)) + 7 * seg(t, 13.5, 13.6) * (1 - seg(t, 13.66, 13.9));
          st(cams.c4, "filter", camBlur(blur, c.s));

          /* layout text typing */
          setT(layoutTxt, typed(t, 12.2, 13.1, LAYOUT_TXT));
          st(layoutSel, "opacity", String(seg(t, 12.16, 12.24)));

          /* context menu */
          const mp = easeOutBack(seg(t, 13.9, 14.08));
          if (menu4) {
            const dip = 1 - 0.06 * seg(t, 14.25, 14.3) * (1 - seg(t, 14.3, 14.42));
            menu4.style.transform = `scale(${Math.max(0.001, mp * dip)})`;
            menu4.style.opacity = String(seg(t, 13.9, 13.98) * (1 - seg(t, 14.34, 14.48)));
          }

          /* dot dissolve: top black image gets eaten right->left */
          if (imgTop4) {
            const dp = seg(t, 14.32, 14.9);
            if (dp > 0) {
              const r = lerp(0.2, 8.4, dp);
              const sweep = lerp(115, -25, dp);
              imgTop4.style.webkitMaskImage = `radial-gradient(circle, transparent ${r}px, black ${r + 0.5}px), linear-gradient(to left, transparent ${sweep - 18}%, black ${sweep}%)`;
              (imgTop4.style as unknown as Record<string, string>).webkitMaskComposite = "source-in";
              imgTop4.style.webkitMaskSize = "18px 18px, 100% 100%";
              (imgTop4.style as unknown as Record<string, string>).maskComposite = "intersect";
            } else {
              imgTop4.style.webkitMaskImage = "none";
            }
          }
          st(speck4, "opacity", String(seg(t, 14.3, 14.42) * (1 - seg(t, 14.82, 15.0))));
          if (speck4) speck4.style.backgroundPosition = `${-(t * 260) % 36}px ${(t * 170) % 36}px`;

          /* cursors */
          const dp4 = path(t, [{ t: 11.9, x: 1745, y: 425 }, { t: 12.4, x: 1712, y: 452 }, { t: 13.4, x: 1730, y: 460 }]);
          if (cur4dem) cur4dem.style.transform = `translate(${dp4.x}px, ${dp4.y}px)`;
          st(cur4dem, "opacity", t < 13.6 ? "1" : "0");
          const jp4 = path(t, [
            { t: 11.9, x: 1300, y: 700 }, { t: 13.4, x: 1330, y: 730 }, { t: 14.15, x: 1478, y: 838 },
            { t: 14.5, x: 1462, y: 848 },
          ]);
          if (cur4jag) cur4jag.style.transform = `translate(${jp4.x}px, ${jp4.y}px)`;
        }

        /* ============ W5: hero + big title 15.14–17.52 ============ */
        if (w5 && t >= 15.14 && t < 17.52) {
          const c = cam(t, [{ t: 15.14, fx: 980, fy: 470, s: 0.92 }, { t: 15.6, fx: 955, fy: 506, s: 1 }, { t: 17.52, fx: 955, fy: 507, s: 1.005 }]);
          st(cams.c5, "transform", camCss(c));
          const blur = 12 * (1 - seg(t, 15.16, 15.55));
          st(cams.c5, "filter", camBlur(blur, c.s));

          /* watch flies into hero */
          if (wimg5) {
            const p = easeOutCubic(seg(t, 15.14, 15.62));
            wimg5.style.opacity = "1";
            wimg5.style.transform = `translate(${lerp(900, 0, p)}px, ${lerp(-420, 0, p)}px) scale(${lerp(0.55, 1, p)})`;
            wimg5.style.filter = `blur(${(1 - p) * 10}px)`;
          }

          /* giant title typing */
          setT(title5, typed(t, 16.2, 17.5, "HiggsWatch"));
          st(title5sel, "opacity", String(seg(t, 16.1, 16.18)));
          if (title5sel) {
            const n = typed(t, 16.2, 17.5, "HiggsWatch").length;
            title5sel.style.width = `${Math.max(140, 40 + n * 120)}px`;
          }

          /* ticker marquee — anchored (no modulo: the real row width differs
             from any guessed cycle and a wrap mid-scene jumps the phase).
             Row origin passes the left edge at 16.5 → "EC /" leads. */
          if (trow5) trow5.style.transform = `translateX(${-((t - 16.5) * 66)}px)`;

          const cp5 = path(t, [{ t: 15.5, x: 400, y: 385 }, { t: 16.4, x: 428, y: 372 }, { t: 17.4, x: 470, y: 400 }]);
          if (cur5calm) cur5calm.style.transform = `translate(${cp5.x}px, ${cp5.y}px)`;
          const jp5 = path(t, [{ t: 15.5, x: 1280, y: 790 }, { t: 16.8, x: 1290, y: 800 }, { t: 17.45, x: 1550, y: 830 }]);
          if (cur5jag) cur5jag.style.transform = `translate(${jp5.x}px, ${jp5.y}px)`;
        }

        /* ============ W6: logo generation 17.52–22.05 ============ */
        if (w6 && t >= 17.52 && t < 22.05) {
          const c = cam(t, [
            { t: 17.52, fx: 1466, fy: 878, s: 2.38 },
            { t: 19.5, fx: 1466, fy: 878, s: 2.38 },
            { t: 19.82, fx: 1466, fy: 440, s: 2.5 },
            { t: 20.62, fx: 1466, fy: 440, s: 2.5 },
            { t: 21.35, fx: 760, fy: 220, s: 1.55 },
            { t: 22.05, fx: 745, fy: 232, s: 1.57 },
          ]);
          st(cams.c6, "transform", camCss(c));
          const blur = 9 * seg(t, 17.52, 17.6) * (1 - seg(t, 17.66, 17.9)) + 6 * seg(t, 19.52, 19.6) * (1 - seg(t, 19.66, 19.85)) + 10 * seg(t, 20.95, 21.15);
          st(cams.c6, "filter", camBlur(blur, c.s));

          /* nav close-up overlay (screen-space; replaces giant-scale zoom) */
          const nz = q(".g6-navzoom");
          if (nz) {
            nz.style.opacity = String(seg(t, 21.18, 21.32));
            /* keep panning here — slow drift + re-blur into the cut */
            nz.style.transform = `translateY(${lerp(-25, 25, seg(t, 21.32, 22.05))}px)`;
            nz.style.filter = `blur(${(1 - seg(t, 21.28, 21.5)) * 9 + 3 * seg(t, 21.55, 21.75) + 5 * seg(t, 21.9, 22.05)}px)`;
          }
          const nzMark = q(".g6-nzmark");
          st(nzMark, "opacity", t >= 21.42 ? "1" : "0");
          const nzPill = q(".g6-nzpill");
          if (nzPill) {
            const np = easeInOut(seg(t, 21.32, 21.44));
            nzPill.style.transform = `translate(${lerp(1130, 878, np)}px, ${lerp(700, 512, np)}px) scale(${lerp(1.6, 1, np)})`;
            nzPill.style.opacity = t >= 21.3 && t < 21.5 ? "1" : "0";
          }

          /* typing prompt2 */
          setT(input6text, t < 19.5 ? typed(t, 17.95, 19.28, PROMPT2) : "");
          const press6 = seg(t, 19.32, 19.4) * (1 - seg(t, 19.4, 19.52));
          if (send6) send6.style.transform = `scale(${1 - 0.14 * press6})`;

          /* vector generation reveal */
          st(vgWrap, "opacity", String(seg(t, 19.62, 19.78)));
          if (vgLogo) {
            const lp = easeOutBack(seg(t, 19.88, 20.14));
            vgLogo.style.transform = `scale(${Math.max(0.001, lp)})`;
            vgLogo.style.opacity = t >= 20.62 ? "0" : String(seg(t, 19.88, 19.96));
          }

          /* drag Logo.svg to nav */
          if (dragLogo) {
            const dp = easeInOut(seg(t, 20.66, 21.42));
            const dx = lerp(1400, 560, dp);
            const dy = lerp(468, 96, dp);
            const ds = lerp(1, 0.132, dp);
            const dr = Math.sin(dp * Math.PI) * -10;
            dragLogo.style.transform = `translate(${dx}px, ${dy}px) scale(${ds}) rotate(${dr}deg)`;
            dragLogo.style.opacity = t >= 20.62 && t < 21.3 ? "1" : "0";
          }
          st(mark6, "opacity", t >= 21.42 ? "1" : "0");

          /* site state carried over */
          setT(title6, "HiggsWatch");
          st(wimg6, "opacity", "1");
          if (trow6) trow6.style.transform = `translateX(${-((t * 22) % 440)}px)`;

          const jp6 = path(t, [
            { t: 17.9, x: 1720, y: 985 }, { t: 19.3, x: 1770, y: 972 }, { t: 19.9, x: 1560, y: 640 },
            { t: 20.6, x: 1480, y: 520 }, { t: 21.4, x: 620, y: 135 },
          ]);
          if (cur6) cur6.style.transform = `translate(${jp6.x}px, ${jp6.y}px)`;
          const cp6 = path(t, [{ t: 21.1, x: 420, y: 90 }, { t: 21.6, x: 452, y: 108 }]);
          if (cur6calm) { cur6calm.style.transform = `translate(${cp6.x}px, ${cp6.y}px)`; cur6calm.style.opacity = t >= 21.05 ? "1" : "0"; }
        }

        /* ============ W7: face of brand 22.05–25.14 ============ */
        if (w7 && t >= 22.05 && t < 25.14) {
          const c = cam(t, [
            { t: 22.05, fx: 960, fy: 540, s: 1.35 },
            { t: 22.45, fx: 960, fy: 540, s: 1.0 },
            { t: 24.9, fx: 960, fy: 540, s: 1.0 },
            { t: 25.14, fx: 1466, fy: 878, s: 2.38 },
          ]);
          st(cams.c7, "transform", camCss(c));
          const blur = 8 * (1 - seg(t, 22.08, 22.42)) + 7 * seg(t, 24.9, 25.05);
          st(cams.c7, "filter", camBlur(blur, c.s));

          /* portrait card in */
          if (face7) {
            const p = easeOutCubic(seg(t, 22.15, 22.55));
            face7.style.transform = `translate(${lerp(240, 0, p)}px, ${lerp(-160, 0, p)}px) scale(${lerp(0.92, 1, p)})`;
            face7.style.opacity = String(seg(t, 22.15, 22.3));
          }
          st(faceSel7, "opacity", String(seg(t, 22.3, 22.37) * (1 - seg(t, 23.9, 24.05))));

          /* face text typing */
          const ftxt = typed(t, 22.55, 23.65, FACE_TXT);
          setT(faceTxt, ftxt);
          const fl = ftxt.length ? ftxt.split("\n").length : 0;
          st(faceBg, "opacity", String(seg(t, 22.5, 22.58) * (1 - seg(t, 23.85, 23.95))));
          st(faceTxtSel, "opacity", String(seg(t, 22.5, 22.58) * (1 - seg(t, 23.85, 23.95))));
          if (faceTxtSel) faceTxtSel.style.height = `${Math.max(56, fl * 62 + 16)}px`;
          if (faceBg) faceBg.style.height = `${Math.max(56, fl * 62 + 16)}px`;

          /* panel slide — mid-slide at ~23.75 */
          const ps7 = easeOutCubic(seg(t, 23.5, 24.1));
          if (panel7) panel7.style.transform = `translateX(${lerp(860, 0, ps7)}px)`;

          /* marquee: Demius drags a selection rect enclosing BOTH images
             (24.15-24.4, TL anchored at wrist card's top-left) */
          const mqp = easeOutCubic(seg(t, 24.12, 24.42));
          if (marq7) {
            marq7.style.opacity = t >= 24.12 && t < 25.14 ? "1" : "0";
            marq7.style.width = `${Math.max(2, mqp * 860)}px`;
            marq7.style.height = `${Math.max(2, mqp * 590)}px`;
          }

          /* thumbs materialize in the tray as the marquee completes — no
             image flight, plugin-style selection sync */
          const th7 = thumbs7 ? Array.from(thumbs7.children) as HTMLElement[] : [];
          th7.forEach((el, i) => {
            const tp = easeOutBack(seg(t, 24.32 + i * 0.05, 24.48 + i * 0.05));
            el.style.opacity = String(seg(t, 24.32 + i * 0.05, 24.4 + i * 0.05));
            el.style.transform = `scale(${Math.max(0.001, 0.6 + 0.4 * tp)})`;
          });

          /* prompt typing starts in the WIDE view (~24.7), zoom mid-type */
          setT(input7text, typed(t, 24.7, 25.55, PROMPT3));

          /* CalmLama holds near the face's top-right the whole beat */
          const cp7 = path(t, [{ t: 22.15, x: 1060, y: 380 }, { t: 22.5, x: 922, y: 442 }, { t: 24.9, x: 900, y: 430 }]);
          if (cur7calm) cur7calm.style.transform = `translate(${cp7.x}px, ${cp7.y}px)`;
          /* Demius: sits on wrist card, then draws the marquee to its BR corner */
          const dp7 = path(t, [
            { t: 22.6, x: 340, y: 520 }, { t: 23.95, x: 380, y: 560 },
            { t: 24.12, x: 180, y: 370 }, { t: 24.42, x: 1040, y: 960 }, { t: 25.1, x: 1050, y: 968 },
          ]);
          if (cur7dem) {
            cur7dem.style.transform = `translate(${dp7.x}px, ${dp7.y}px)`;
            cur7dem.style.opacity = t >= 22.6 ? "1" : "0";
            const dpill = cur7dem.querySelector(".pill") as HTMLElement | null;
            if (dpill) dpill.style.opacity = String(1 - seg(t, 24.1, 24.2) * (1 - seg(t, 24.45, 24.6)));
          }
        }

        /* ============ W8: final prompt + grid 25.14–27 ============ */
        if (w8 && t >= 25.14) {
          /* camera: hold on the input card, then whip-pan LEFT to the grid
             plane (26.3-26.55: horizontal smear, panel exits right) */
          const c = cam(t, [
            { t: 25.14, fx: 960, fy: 540, s: 1 },
            { t: 26.28, fx: 960, fy: 540, s: 1 },
            { t: 26.6, fx: -1091, fy: 540, s: 1 },
            { t: 27.05, fx: -1091, fy: 540, s: 1 },
          ]);
          const whip8N = seg(t, 26.3, 26.45) * (1 - seg(t, 26.5, 26.72));
          st(cams.c8, "transform", whipCss(whip8N) + camCss(c));
          st(cams.c8, "filter", camBlur(20 * whip8N + 6 * (1 - seg(t, 25.14, 25.24)), 1));

          /* typing — same timeline as W7's wide view, continuing across the zoom */
          setT(input8text, typed(t, 24.7, 25.55, PROMPT3));

          /* Demius travels to the send button and presses it (~26.05) */
          const d8 = path(t, [{ t: 25.2, x: 1300, y: 1010 }, { t: 25.85, x: 1675, y: 915 }, { t: 26.05, x: 1690, y: 935 }]);
          if (cur8dem) { cur8dem.style.transform = `translate(${d8.x}px, ${d8.y}px)`; cur8dem.style.opacity = t < 26.35 ? "1" : "0"; }
          const press8 = seg(t, 26.02, 26.1) * (1 - seg(t, 26.1, 26.22));
          if (send8btn) send8btn.style.transform = `scale(${1 - 0.14 * press8})`;

          /* grid tiles pop after the whip lands */
          tiles8.forEach((tl, i) => {
            const p = easeOutBack(seg(t, 26.55 + i * 0.05, 26.75 + i * 0.05));
            tl.style.transform = `scale(${Math.max(0.001, 0.9 + 0.1 * p)})`;
            tl.style.opacity = String(seg(t, 26.55 + i * 0.05, 26.63 + i * 0.05));
          });
          /* this cursor renders ~1.75x the canvas cursors */
          const c8p = path(t, [{ t: 26.6, x: -1871, y: 260 }, { t: 26.95, x: -1799, y: 158 }]);
          if (cur8) {
            cur8.style.transformOrigin = "0 0";
            cur8.style.transform = `translate(${c8p.x}px, ${c8p.y}px) scale(1.75)`;
            cur8.style.opacity = String(seg(t, 26.62, 26.72));
          }
        }
      };

      const cleanup = inst.addFrameTask((info) => render(info.ownCurrentTimeMs));
      render(0);
      return () => { if (cleanup) cleanup(); };
    };
  }, []);

  return (
    <Timegroup mode="contain" workbench className="stage">
      <Timegroup mode="sequence" overlap="0ms" className="absolute inset-0">
        <Timegroup
          id="root"
          ref={rootRef as never}
          mode="fixed"
          duration={`${TOTAL_MS}ms`}
          className="absolute inset-0"
        >

      {/* ================= W1: intro ================= */}
      <div className="w w1" style={{ opacity: 1 }}>
        <div className="cam cam1">
          {/* phase A tile */}
          <div className="i-tile tile" style={{ left: 365, top: 470, width: 140, height: 140 }}>
            <div className="prog">
              <svg width="11" height="11" viewBox="0 0 12 12"><circle cx="6" cy="6" r="4.6" fill="none" stroke="#C6E64E" strokeWidth="2" strokeDasharray="20 9" /></svg>
              In progress
            </div>
            <div style={{ position: "absolute", left: 15, top: 22 }}><PixSquiggle w={110} /></div>
          </div>
          <Sel cls="i-sel0" style={{ left: 515, top: 475, width: 113, height: 120 }} />
          <div className="i-ghost" style={{ position: "absolute", left: 517, top: 538, width: 50, height: 56, background: "#F4F4F2", borderRadius: 6, opacity: 0.5 }} />

          {/* lockup */}
          <div className="i-vec" style={{ position: "absolute", left: 378, top: 490, opacity: 0 }}><Squiggle w={112} color="#3F3F3F" /></div>
          <div className="i-hg lockup-text" style={{ left: 535, top: 497, fontSize: 86 }} />
          <Sel cls="i-hgsel" style={{ left: 517, top: 477, width: 402, height: 135, opacity: 0 }} />
          <div className="i-for lockup-text" style={{ left: 975, top: 497, fontSize: 82, fontStyle: "italic", opacity: 0 }}>for</div>
          <div className="i-fslot" style={{ position: "absolute", left: 0, top: 0, opacity: 0 }} />
          <div className="i-figma lockup-text" style={{ left: 1275, top: 497, fontSize: 86, opacity: 0 }}>Figma</div>

          {/* flying shapes (movers) — order: red, orange, purple, blue, green */}
          {[
            { bg: "#ED2038", br: "26px 0 0 26px" },
            { bg: "#F2653A", br: "0 26px 26px 0" },
            { bg: "#833BF8", br: "26px 0 0 26px" },
            { bg: "#10C4F9", br: "50%" },
            { bg: "#30E171", br: "26px 0 26px 26px" },
          ].map((s, i) => (
            <div key={i} className="i-mv" style={{ position: "absolute", left: 0, top: 0, opacity: 0, willChange: "transform" }}>
              <div style={{ width: 52.5, height: 52.5, background: s.bg, borderRadius: s.br, position: "relative" }}>
                <div className="mb" style={{ position: "absolute", inset: -8, background: s.bg, filter: "blur(14px)", opacity: 0, borderRadius: 26 }} />
                <Sel style={{ inset: -10 }} />
              </div>
            </div>
          ))}

          {/* intro cursors: honda, calm, 5th, demius, jagan */}
          <Cursor cls="cur-honda" color="#FDFF1F" pill="Honda" pillBg="#F5E33D" pillColor="#3A3410" />
          <Cursor cls="cur-calm" color="#24BBFA" pill="CalmLama" />
          <Cursor cls="cur-5th" color="#EE531B" pill="Rubino" pillBg="#F0713F" />
          <Cursor cls="cur-dem" color="#28FFA2" pill="Demius" pillBg="#3BF08F" pillColor="#0B4D2C" />
          <Cursor cls="cur-jag" color="#E9009B" pill="Jagan96" pillBg="#F02FB2" />
        </div>
      </div>

      {/* ================= W2: brief ================= */}
      <div className="w w2">
        <div className="cam cam2">
          <div className="b-wrist pcard" style={{ left: 605, top: 415, width: 305, height: 300, opacity: 0 }}>
            <EfImage src={WRIST_SRC} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ position: "absolute", left: 1170, top: 388 }}>
            <div className="b-bg" style={{ position: "absolute", inset: "-8px -14px", background: "rgba(216,209,238,0.4)", opacity: 0 }} />
            <Sel cls="b-sel" style={{ left: -14, top: -8, width: 560, height: 90, opacity: 0 }} />
            <div className="b-text typedbox" style={{ position: "relative", fontSize: 44, lineHeight: "68px" }} />
          </div>
          <Cursor cls="cur-calm" color="#24BBFA" pill="CalmLama" />
          <Cursor cls="cur-dem" color="#28FFA2" pill="Demius" pillBg="#3BF08F" pillColor="#0B4D2C" />
          <Cursor cls="cur-jag" color="#E9009B" pill="Jagan96" pillBg="#F02FB2" />
        </div>
      </div>

      {/* ================= W3: watch generation ================= */}
      <div className="w w3">
        <div className="cam cam3">
          {/* wrist card selected on canvas */}
          <div className="g3-wrist pcard" style={{ left: 540, top: 315, width: 265, height: 265, borderRadius: 14 }}>
            <EfImage src={WRIST_SRC} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <Sel cls="g3-sel" style={{ left: 490, top: 268, width: 355, height: 380 }} />

          {/* flying thumb */}
          <div className="g3-fly" style={{ position: "absolute", left: 0, top: 0, width: 265, height: 265, borderRadius: 14, overflow: "hidden", opacity: 0, transformOrigin: "0 0" }}>
            <EfImage src={WRIST_SRC} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(233,0,155,0.55), rgba(233,0,155,0))" }} />
          </div>

          <Panel cls="p3" thumbs={[WRIST_SRC]} mosaic />
          {/* panel body content overlays */}
          <div className="g3-prog inprog" style={{ left: 1385, top: 420, opacity: 0 }}>
            <div className="spin" />In progress
          </div>
          <div className="g3-result" style={{ position: "absolute", left: 1146, top: 280, width: 640, height: 360, borderRadius: 14, overflow: "hidden", opacity: 0 }}>
            <EfImage src={WATCH_RENDER_SRC} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          <Cursor cls="cur-jag" color="#E9009B" pill="Jagan96" pillBg="#F02FB2" />
        </div>
        {/* screen-space pill for full-bleed moment */}
        <div className="g3-screenpill" style={{ position: "absolute", left: 420, top: 690, opacity: 0 }}>
          <div style={{ borderRadius: 999, padding: "12px 26px", fontSize: 30, fontWeight: 600, color: "#fff", background: "#F02FB2", display: "inline-block" }}>Jagan96</div>
        </div>
      </div>

      {/* ================= W4: canvas site + remove-bg ================= */}
      <div className="w w4">
        <div className="cam cam4">
          <Site cls="s4" w={635} scale={0.3307} />
          <div style={{ position: "absolute", left: 275, top: 97, width: 635, height: 990, overflow: "hidden", pointerEvents: "none" }}>
            {/* clip site to viewport-ish area — site rendered above */}
          </div>

          {/* layout text */}
          <div style={{ position: "absolute", left: 1030, top: 245 }}>
            <Sel cls="g4-lsel" style={{ left: -16, top: -10, width: 700, height: 210, opacity: 0 }} />
            <div className="g4-layout typedbox" style={{ position: "relative", fontSize: 64, lineHeight: "92px", fontWeight: 600 }} />
          </div>

          {/* watch result card (black bg) with dissolve stack */}
          <div className="g4-card" style={{ position: "absolute", left: 1140, top: 652, width: 490, height: 280, borderRadius: 16, overflow: "hidden", boxShadow: "0 14px 38px rgba(40,40,40,.16)" }}>
            <div className="g4-white" style={{ position: "absolute", inset: 0, background: "#fff" }} />
            <div style={{ position: "absolute", inset: 0 }}>
              <EfImage src={WATCH_CUTOUT_SRC} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div className="g4-imgtop" style={{ position: "absolute", inset: 0 }}>
              <EfImage src={WATCH_RENDER_SRC} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div className="g4-speck" style={{ position: "absolute", inset: 0, opacity: 0, backgroundImage: "radial-gradient(circle 2.5px, rgba(212,255,32,0.9) 2.4px, transparent 2.6px)", backgroundSize: "36px 36px" }} />
          </div>

          {/* context menu (world coords; scaled up by cam) */}
          <div className="g4-menu ctxmenu" style={{ left: 1452, top: 828, width: 138, transformOrigin: "0 0", opacity: 0 }}>
            <svg width="12" height="12" viewBox="0 0 16 16"><rect x="1" y="1" width="6" height="6" fill="#fff" /><rect x="9" y="1" width="6" height="6" fill="#666" /><rect x="1" y="9" width="6" height="6" fill="#666" /><rect x="9" y="9" width="6" height="6" fill="#fff" /></svg>
            <div className="mi">Remove background</div>
            <div className="ms">Create high-quality cutouts</div>
          </div>

          <Cursor cls="cur-dem" color="#28FFA2" pill="Demius" pillBg="#3BF08F" pillColor="#0B4D2C" />
          <Cursor cls="cur-jag" color="#E9009B" pill="Jagan96" pillBg="#F02FB2" />
        </div>
      </div>

      {/* ================= W5: hero + title ================= */}
      <div className="w w5">
        <div className="cam cam5">
          <Site cls="s5" w={1172} scale={0.6104} />
          <Cursor cls="cur-calm" color="#24BBFA" pill="CalmLama" />
          <Cursor cls="cur-jag" color="#E9009B" pill="Jagan96" pillBg="#F02FB2" />
          <Sel cls="g5-tsel" style={{ left: 361, top: 92, width: 1100, height: 325, opacity: 0 }} />
        </div>
      </div>

      {/* ================= W6: logo gen ================= */}
      <div className="w w6">
        <div className="cam cam6">
          <Site cls="s6" w={635} scale={0.3307} />
          <Panel cls="p6" />
          {/* vector generation state */}
          <div className="g6-vg" style={{ position: "absolute", left: 0, top: 0, opacity: 0 }}>
            <div style={{ position: "absolute", left: 1112, top: 126, width: 708, height: 894, background: "#111215" }} />
            <div className="vgpill" style={{ left: 1310, top: 150 }}>
              <svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4Z" fill="#fff" /></svg>
              Vector Generation
            </div>
            <div style={{ position: "absolute", left: 1745, top: 155, width: 40, height: 40, borderRadius: 10, background: "#1B1C1F", color: "#B9B9BE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>◫</div>
            <div className="vgcard" style={{ left: 1146, top: 240, width: 640, height: 400 }}>
              <div className="g6-logo" style={{ transformOrigin: "50% 50%" }}><BlobLogo w={210} /></div>
            </div>
          </div>
          {/* dragging Logo.svg */}
          <div className="g6-drag" style={{ position: "absolute", left: 0, top: 0, opacity: 0, transformOrigin: "0 0" }}>
            <div style={{ position: "relative" }}>
              <Sel style={{ inset: -14 }} />
              <BlobLogo w={130} />
              <div className="fnpill" style={{ left: "50%", top: 158 }}>Logo.svg</div>
            </div>
          </div>
          <Cursor cls="cur-jag" color="#E9009B" pill="Jagan96" pillBg="#F02FB2" />
          <Cursor cls="cur-calm" color="#24BBFA" pill="CalmLama" />
        </div>

        {/* screen-space nav close-up (native res — avoids giant world raster) */}
        <div className="g6-navzoom" style={{ position: "absolute", inset: 0, opacity: 0 }}>
          <div style={{ position: "absolute", inset: 0, background: "#E5E5E5" }} />
          <div style={{ position: "absolute", left: 0, top: 488, width: 1920, height: 110, background: "#fff", display: "flex", alignItems: "center" }}>
            <div style={{ position: "absolute", left: 866, display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 700, color: "#111" }}>
              <span className="g6-nzmark" style={{ display: "inline-flex", opacity: 0 }}><BlobLogo w={56} /></span>
              HiggsWatch
            </div>
            <div style={{ position: "absolute", right: 90, fontSize: 24, fontWeight: 500, color: "#5F5F5F", letterSpacing: "0.05em" }}>GALLERY</div>
          </div>
          <div style={{ position: "absolute", left: 0, top: 598, width: 1920, height: 482, background: "#D4FF20", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 60, top: 300, fontSize: 560, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 0.94, background: "linear-gradient(180deg, #060800 0%, #2A3606 55%, #3A4A08 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", whiteSpace: "pre" }}>HiggsW</div>
          </div>
          {/* landing Logo.svg pill (screen space) */}
          <div className="g6-nzpill" style={{ position: "absolute", left: 0, top: 0, opacity: 0, transformOrigin: "0 0" }}>
            <div style={{ position: "relative" }}>
              <BlobLogo w={56} />
              <div className="fnpill" style={{ left: 28, top: 70, fontSize: 22 }}>Logo.svg</div>
            </div>
          </div>
          <div style={{ position: "absolute", left: 190, top: 345 }}>
            <CursorSvg color="#24BBFA" />
            <div style={{ position: "absolute", left: 60, top: 80, borderRadius: 999, padding: "14px 34px", fontSize: 34, fontWeight: 600, color: "#fff", background: "#24BBFA" }}>CalmLama</div>
          </div>
          <div style={{ position: "absolute", left: 985, top: 470 }}>
            <CursorSvg color="#E9009B" />
            <div style={{ position: "absolute", left: 66, top: 96, borderRadius: 999, padding: "14px 30px", fontSize: 32, fontWeight: 600, color: "#fff", background: "#F02FB2" }}>Jagan96</div>
          </div>
        </div>
      </div>

      {/* ================= W7: face of brand ================= */}
      <div className="w w7">
        <div className="cam cam7">
          <div className="g7-wrist pcard" style={{ left: 197, top: 383, width: 300, height: 285, borderRadius: 14 }}>
            <EfImage src={WRIST_SRC} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          <div className="g7-face pcard" style={{ left: 557, top: 375, width: 455, height: 570, borderRadius: 16, opacity: 0 }}>
            <EfImage src={BRAND_FACE_SRC} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 10%", transform: "scale(1.35)", transformOrigin: "50% 12%" }} />
          </div>
          <Sel cls="g7-fsel" style={{ left: 557, top: 375, width: 455, height: 570, opacity: 0 }} />

          <div style={{ position: "absolute", left: 515, top: 140 }}>
            <div className="g7-bg" style={{ position: "absolute", inset: "-8px -14px", background: "rgba(216,209,238,0.4)", opacity: 0 }} />
            <Sel cls="g7-tsel" style={{ left: -14, top: -8, width: 400, height: 80, opacity: 0 }} />
            <div className="g7-text typedbox" style={{ position: "relative", fontSize: 40, lineHeight: "62px" }} />
          </div>

          <Panel cls="p7" thumbs={[WRIST_SRC, BRAND_FACE_SRC]} />

          {/* marquee selection rect (Demius drags it over both images) */}
          <div className="g7-marquee" style={{ position: "absolute", left: 180, top: 370, width: 0, height: 0, border: "3px solid #4A90F7", background: "rgba(74,144,247,0.08)", opacity: 0 }} />

          <Cursor cls="cur-calm" color="#24BBFA" pill="CalmLama" />
          <Cursor cls="cur-dem" color="#28FFA2" pill="Demius" pillBg="#3BF08F" pillColor="#0B4D2C" />
        </div>
      </div>

      {/* ================= W8: final prompt + grid ================= */}
      <div className="w w8">
        <div className="cam cam8">
          {/* full-screen input card */}
          <div className="g8-input" style={{ position: "absolute", left: 118, top: 238, width: 1690, height: 775, background: "#0A0A0C", borderRadius: 40, boxShadow: "0 30px 80px rgba(0,0,0,.3)" }}>
            <div style={{ position: "absolute", left: 0, top: -240, width: "100%", height: 240, background: "#111215" }} />
            <div style={{ position: "absolute", left: 96, top: 70, display: "flex", gap: 34 }}>
              <div style={{ width: 208, height: 208, borderRadius: 16, overflow: "hidden" }}>
                <EfImage src={WRIST_SRC} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ width: 208, height: 208, borderRadius: 16, overflow: "hidden" }}>
                <EfImage src={BRAND_FACE_SRC} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
            <div className="ptext8" style={{ position: "absolute", left: 100, right: 100, top: 330, color: "#C9C9CE", fontSize: 46, lineHeight: 1.5, whiteSpace: "pre-wrap" }} />
            <div style={{ position: "absolute", left: 96, bottom: 64, width: 74, height: 74, borderRadius: "50%", background: "#1C1C1F", color: "#E8E8EA", fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>+</div>
            <div className="g8-send" style={{ position: "absolute", right: 96, bottom: 64, width: 74, height: 74, borderRadius: "50%", background: "#D4FF20", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none"><path d="M12 19V6M6 12l6-6 6 6" stroke="#101300" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            {/* scanline overlay */}
            <div className="g8-scan scan" style={{ opacity: 0, backgroundImage: "repeating-linear-gradient(to bottom, rgba(198,230,78,0.55) 0px, rgba(198,230,78,0.55) 3px, transparent 3px, transparent 9px), radial-gradient(circle 2px, rgba(198,230,78,0.8) 1.8px, transparent 2.2px)", backgroundSize: "100% 9px, 26px 26px" }} />
          </div>

          {/* 2x2 grid — lives on a plane to the LEFT of the input card;
             the camera whips over to it (26.3-26.55) */}
          <div className="g8-grid" style={{ position: "absolute", left: -2300, top: 0, width: 2418, height: 1080, background: "#E7E7E7", opacity: 1 }}>
            <div className="gtile" style={{ left: 627, top: 205, width: 566, height: 316, position: "absolute", opacity: 0 }}>
              <EfImage src={GRID_A_SRC} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div className="gtile" style={{ left: 1224, top: 205, width: 566, height: 316, position: "absolute", opacity: 0 }}>
              <EfImage src={GRID_B_SRC} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div className="gtile" style={{ left: 627, top: 558, width: 564, height: 317, position: "absolute", opacity: 0 }}>
              <EfImage src={GRID_C_SRC} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div className="gtile" style={{ left: 1224, top: 558, width: 566, height: 317, position: "absolute", opacity: 0 }}>
              <EfImage src={GRID_D_SRC} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>

          <Cursor cls="cur-dem" color="#28FFA2" pill="Demius" pillBg="#3BF08F" pillColor="#0B4D2C" />
          <Cursor cls="cur-calm" color="#24BBFA" pill="CalmLama" />
        </div>
      </div>
        </Timegroup>
      </Timegroup>
      <Audio src={AUDIO_SRC} volume={1} duration={`${TOTAL_MS}ms`} />
    </Timegroup>
  );
};

export default Video;
