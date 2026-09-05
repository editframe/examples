/**
 * Flow — S4 analyzing card through S8 endline (8.93–38.06s).
 * Holds S5∩S6 (22.98–23.32), S6∩S7 (26.55–27.10), and S7∩S8 (35.9–36.02)
 * so those overlaps are not split across Timegroups.
 */
import React, { useEffect, useRef } from "react";
import { Timegroup, Video as Clip, Image as EfImage } from "@editframe/react";
import { EndCard } from "../components/EndCard";
import { ArrowUp, CopyIcon, CursorSvg, PasteIcon, Star, WavIcon } from "../components/Icons";
import { W } from "../components/Word";
import { BAG_SRC, CARD_SEQ, FLOW_ABS_S, FLOW_MS, PRODUCT_SRC, VERT_SEQ } from "../constants";
import {
  collectGroups,
  dotsAt,
  easeIO,
  easeOut,
  hex2rgb,
  kf,
  lerp,
  mix,
  seg,
  updateWords,
  type KF,
  type TgEl,
} from "../lib";

const S4_L: KF = [[8.93, 137], [15.77, 137], [15.97, 285]];
const S4_T: KF = [[8.93, 75], [15.77, 75], [15.97, 203]];
const S4_W: KF = [[8.93, 1011], [15.77, 1011], [15.97, 410]];
const S4_H: KF = [[8.93, 562], [15.77, 562], [15.97, 229]];
const S4_TITLEY: KF = [[8.93, 120], [9.6, 34], [10.2, -2], [15.77, -26]];
const PILL_L: KF = [[8.93, 433], [15.77, 433], [15.97, 425]];
const PILL_T: KF = [[8.93, 488], [15.77, 488], [15.97, 368]];
const PILL_W: KF = [[8.93, 412], [15.77, 412], [15.97, 132]];
const PILL_H: KF = [[8.93, 96], [15.77, 96], [15.97, 37]];
const PILL_FS: KF = [[8.93, 38], [15.77, 38], [15.97, 17]];
const CAM6_S: KF = [[23.3, 1.0], [25.07, 1.0], [25.08, 1.68], [25.85, 1.69], [26.02, 1.565], [26.75, 1.565], [27.3, 1.3]];
const CAM6_TX: KF = [[24.9, 0], [25.07, 0], [25.08, 7.5], [25.85, -2], [26.02, -776], [26.35, -785], [26.75, -785], [27.3, -420]];
const CAM6_TY: KF = [[24.9, 0], [25.07, 0], [25.08, -134.6], [25.23, -149.6], [25.85, -153], [26.02, -520], [26.35, -526], [26.75, -526], [27.3, -310]];
const CARD6_T: KF = [[23.3, 334], [23.85, 293], [24.1, 293], [24.2, 246], [24.33, 128], [24.45, 154], [24.58, 184], [24.78, 189], [25.1, 192], [26.6, 192]];
const CARD6_B: KF = [[23.3, 473], [23.85, 432], [24.1, 432], [24.33, 453], [24.6, 486], [24.95, 499], [25.08, 505], [25.2, 574], [25.34, 621], [25.5, 616], [26.6, 616]];
const PR6_T: KF = [[24.28, 170], [24.45, 197], [24.6, 214], [25.06, 214], [25.2, 272], [25.34, 336], [25.5, 331], [26.6, 331]];
const BAG_X: KF = [[24.767, -90], [24.8, -50], [24.833, -10], [24.867, 41], [24.9, 85], [24.933, 121],
  [24.967, 149], [25.0, 172], [25.033, 190], [25.067, 204], [25.13, 216], [25.23, 236], [25.4, 240]];
const BAG_Y: KF = [[24.767, 263], [24.8, 239], [24.833, 215], [24.867, 193], [24.9, 172], [24.933, 157],
  [24.967, 144], [25.0, 136], [25.033, 130], [25.067, 129], [25.13, 162], [25.23, 198], [25.4, 215]];
const BAG_BLUR: KF = [[24.767, 7], [24.9, 4.5], [25.0, 1.5], [25.067, 0]];
const CUR6_X: KF = [[23.62, 762], [23.78, 736], [23.92, 712], [24.1, 662], [24.24, 612], [24.4, 520], [24.55, 428],
  [24.767, 28], [24.8, 68], [24.833, 108], [24.867, 159], [24.9, 203], [24.933, 239], [24.967, 267],
  [25.0, 290], [25.033, 308], [25.067, 322], [25.18, 361], [25.24, 343], [25.42, 346], [25.6, 560], [25.78, 800], [25.95, 966], [26.02, 1000], [26.15, 1004], [27.5, 1004]];
const CUR6_Y: KF = [[23.62, 340], [23.78, 366], [23.92, 368], [24.1, 376], [24.24, 388], [24.4, 430], [24.55, 478],
  [24.767, 374], [24.8, 350], [24.833, 326], [24.867, 304], [24.9, 283], [24.933, 268], [24.967, 255],
  [25.0, 247], [25.033, 241], [25.067, 240], [25.18, 325], [25.24, 296], [25.42, 300], [25.6, 390], [25.78, 490], [25.95, 560], [26.02, 588], [26.15, 592], [27.5, 592]];
const CAM7_S: KF = [[27.35, 1.0], [27.62, 2.07], [28.15, 2.13], [28.55, 1.0]];
const CAM7_TX: KF = [[27.35, 0], [27.62, -501], [28.15, -534], [28.55, 0]];
const CAM7_TY: KF = [[27.35, 0], [27.62, -243], [28.15, -260.5], [28.55, 0]];
const S7_L: KF = [[26.7, 458], [27.65, 457], [28.57, 487], [29.3, 453], [33.5, 444], [36.0, 441]];
const S7_T: KF = [[26.7, 430], [26.95, 334], [27.65, 339], [28.15, 339], [28.57, 37], [29.3, 37], [33.5, 22], [36.0, 18]];
const S7_W: KF = [[26.7, 229], [27.65, 304], [28.57, 361], [29.3, 365], [33.5, 383], [36.0, 388]];
const S7_H: KF = [[26.7, 600], [28.57, 647], [29.3, 650], [33.5, 678], [36.0, 684]];
const CUR5_X: KF = [[21.7, 318], [21.92, 505], [22.06, 658], [22.26, 910], [22.42, 1036], [22.62, 1036], [22.72, 706], [23.3, 700]];

export const Flow = () => {
  const rootRef = useRef<TgEl>(null);

  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;
    tg.initializer = (inst) => {
      const q = <T extends HTMLElement>(sel: string) => inst.querySelector(sel) as T;
      const qa = (sel: string) => Array.from(inst.querySelectorAll(sel)) as HTMLElement[];
      const { byG, gFinal } = collectGroups(inst);

      const s4 = q(".s4"),
        s4card = q(".s4card"),
        s4title = q(".s4title"),
        s4pill = q(".s4pill"),
        s4pillT = q(".s4pilltxt"),
        s4still = q(".s4still"),
        s4sheen = q(".s4sheen"),
        s4sheen2 = q(".s4sheen2"),
        s4fx = q(".s4fx");
      const s4flares = qa(".s4flare");
      const s4pools = qa(".s4pool");
      const s5 = q(".s5"),
        cam5 = q(".cam5"),
        s5rule = q(".s5rule"),
        s5glow = q(".s5cardglow"),
        stopbtn = q(".stopbtn"),
        copyic = q(".copyic"),
        cur5 = q(".cur5"),
        s5flow = q(".s5flow");
      const s5flares = qa(".s5flareh");
      const s5flareL = q(".s5flarel"),
        s5flareR = q(".s5flarer");
      const s5cop = q(".s5copied"),
        s5copLbl = q(".clbl");
      const s5pillEl = q(".s5pill");
      const s5cardEl = q(".s5card"),
        s5thinkEl = q(".s5think"),
        s5tbar = q(".s5tbar");
      const s6 = q(".s6"),
        cam6 = q(".cam6"),
        s6grp = q(".s6grp"),
        s6bag = q(".s6bag"),
        s6send = q(".s6send"),
        s6wav = q(".s6wav"),
        s6prompt = q(".s6prompt"),
        cur6 = q(".cur6"),
        s6cardEl = q(".s6card"),
        s6btnrow = q(".s6btnrow"),
        hdr6 = q(".hdr6"),
        gico6 = q(".gico");
      const s7 = q(".s7"),
        cam7 = q(".cam7"),
        s7grp = q(".s7grp"),
        s7card = q(".s7card"),
        s7title = q(".s7title"),
        s7pill = q(".s7pill"),
        s7spin = q(".s7spin"),
        s7dim = q(".s7dim"),
        pfill = q(".pfill"),
        pknob = q(".pknob"),
        pbar = q(".pbar"),
        s7pilltxtEl = q(".s7pilltxt"),
        s7sheen = q(".s7sheen");
      const genChars = qa(".gch");
      const s8txt = q(".s8txt");
      const GEN_BASE = hex2rgb("#4f4f4f"),
        GEN_HI: [number, number, number] = [216, 129, 110];
      copyic.style.left = "985px";
      copyic.style.top = `${526 + ((q(".mphdr") as HTMLElement)?.offsetTop ?? 0) - 20}px`;
      const s8 = q(".s8");

      const flowTop = 526;
      const flowEl = q(".s5flow");
      const wOf = (sel: string) => {
        let el = q(sel) as HTMLElement | null;
        let y = 0;
        while (el && el !== flowEl) {
          y += el.offsetTop;
          el = el.offsetParent as HTMLElement | null;
        }
        return flowTop + y;
      };
      const wMP = wOf(".mphdr");
      const wBQ3 = wOf(".bq3");
      const wAudio = wOf(".bq7");
      const wFloat = wOf(".ind3w");
      const wClose = wOf(".closew");
      const bqTop = wOf(".bq1");
      const bqEnd = wOf(".bq7") + (q(".bq7")?.offsetHeight ?? 0);
      const tyZoom = 365 - 1.92 * (wMP - 69);
      const icoScrY = (526 + ((q(".mphdr") as HTMLElement)?.offsetTop ?? 0) - 20) + 13 - 170 - 62;
      const CUR5_Y: KF = [[21.7, -18], [21.92, 128], [22.06, 224], [22.26, icoScrY - 52], [22.42, icoScrY + 2], [22.62, icoScrY + 2], [22.72, 392], [23.3, 390]];
      const TY5: KF = [
        [16.0, 0], [17.2, 0],
        [17.63, 116 - wMP],
        [18.47, 22 - 1.07 * wBQ3],
        [19.13, 98 - 1.35 * wAudio],
        [20.3, 58 - 1.5 * wFloat],
        [21.47, 402 - 1.5 * wClose],
        [21.95, -170], [22.5, -170], [22.68, tyZoom], [23.35, tyZoom],
      ];
      const S5_S: KF = [[16.0, 1], [17.63, 1], [18.47, 1.07], [19.13, 1.35], [20.3, 1.5], [21.47, 1.5], [21.95, 1.0], [22.5, 1.0], [22.68, 1.92], [23.35, 1.92]];
      const S5_TX: KF = [[16.0, 0], [18.47, 0], [19.13, -250], [20.3, -186], [21.47, -144], [21.95, 42], [22.5, 42], [22.68, -1226], [23.35, -1256]];

      const render = (ms: number) => {
        const t = FLOW_ABS_S + ms / 1000;
        updateWords(t, byG, gFinal);

        const s4on = t >= 8.93 && t < 15.97;
        s4.style.opacity = s4on ? "1" : "0";
        if (s4on) {
          const enter = easeOut(seg(t, 8.93, 9.3));
          const shr = easeIO(seg(t, 15.77, 15.97));
          const L = kf(S4_L, t), T = kf(S4_T, t), Wd = kf(S4_W, t), H = kf(S4_H, t);
          s4card.style.left = `${L}px`;
          s4card.style.top = `${T}px`;
          s4card.style.width = `${Wd}px`;
          s4card.style.height = `${H}px`;
          s4card.style.opacity = String(enter);
          s4card.style.transform = `scale(${lerp(0.92, 1, enter)})`;
          s4card.style.borderRadius = `${lerp(24, 14, shr)}px`;
          s4fx.style.left = `${L}px`;
          s4fx.style.top = `${T}px`;
          s4fx.style.width = `${Wd}px`;
          s4fx.style.height = `${H}px`;
          s4fx.style.transform = `scale(${lerp(0.92, 1, enter)})`;
          s4fx.style.borderRadius = `${lerp(24, 14, shr)}px`;
          s4fx.style.opacity = String(enter);
          const brth = Math.sin(((t - 8.93) / 3.0) * Math.PI * 2);
          const b4 = seg(t, 15.48, 15.66) * (1 - seg(t, 15.76, 15.98));
          s4fx.style.boxShadow =
            shr > 0.4
              ? "0 0 26px 8px rgba(190,233,134,0.8)"
              : b4 > 0.02
                ? `0 0 ${60 + 55 * b4}px ${16 * b4}px rgba(226,246,152,${0.3 + 0.42 * b4})`
                : `0 0 ${60 + 10 * brth}px rgba(255,240,210,${0.28 + 0.12 * brth})`;
          s4flares.forEach((el) => (el.style.opacity = String(b4)));
          const ang = (((t - 8.93) / 3.2) * 360) % 360;
          s4sheen.style.backgroundImage =
            `conic-gradient(from ${(ang - 116).toFixed(1)}deg at 50% 50%, rgba(255,190,150,0) 0deg, rgba(255,190,150,0.1) 20deg, rgba(255,175,205,0.16) 55deg, rgba(255,225,180,0.55) 90deg, rgba(255,244,222,0.9) 108deg, rgba(255,252,242,0.98) 116deg, rgba(170,225,255,0.4) 124deg, rgba(170,225,255,0) 134deg, rgba(255,190,150,0) 360deg)`;
          s4sheen2.style.backgroundImage =
            `conic-gradient(from ${(ang - 110).toFixed(1)}deg at 50% 50%, rgba(255,205,160,0) 0deg, rgba(255,205,160,0.25) 60deg, rgba(255,228,185,0.6) 100deg, rgba(255,240,210,0.8) 112deg, rgba(255,240,210,0) 126deg, rgba(255,205,160,0) 360deg)`;
          s4sheen.style.borderRadius = `${lerp(24, 14, shr) - 1}px`;
          s4sheen2.style.borderRadius = `${lerp(24, 14, shr) + 4}px`;
          const brW = (f: number, p: number) => Math.sin(t * f * Math.PI * 2 + p);
          const shOp = enter * (1 - seg(t, 15.5, 15.8));
          s4sheen.style.opacity = String(shOp * (0.86 + 0.14 * brW(0.21, 0)));
          s4sheen2.style.opacity = String(0.62 * shOp * (0.84 + 0.16 * brW(0.27, 2.1)));
          s4sheen.style.transform = `scale(${(1 + 0.007 * brW(0.23, 0.5)).toFixed(4)},${(1 + 0.007 * brW(0.31, 2.2)).toFixed(4)})`;
          s4sheen2.style.transform = `scale(${(1 + 0.011 * brW(0.19, 1.4)).toFixed(4)},${(1 + 0.011 * brW(0.26, 3.6)).toFixed(4)})`;
          const CORN = [299.1, 60.9, 119.1, 240.9];
          s4pools.forEach((el, i) => {
            let d = Math.abs(ang - CORN[i]) % 360;
            if (d > 180) d = 360 - d;
            el.style.opacity = String(0.85 * shOp * Math.exp(-Math.pow(d / 26, 2)));
          });
          s4title.style.top = `${kf(S4_TITLEY, t)}px`;
          s4title.style.opacity = String(enter * (1 - seg(t, 15.5, 15.75)));
          s4pill.style.left = `${kf(PILL_L, t)}px`;
          s4pill.style.top = `${kf(PILL_T, t)}px`;
          s4pill.style.width = `${kf(PILL_W, t)}px`;
          s4pill.style.height = `${kf(PILL_H, t)}px`;
          const fs = kf(PILL_FS, t);
          s4pillT.textContent = t < 15.5 ? "Analyzing" + dotsAt(t, 8.55) : "Analyzed!";
          s4pillT.style.fontSize = `${fs}px`;
          s4pillT.style.lineHeight = `${kf(PILL_H, t)}px`;
          s4pill.style.opacity = String(enter);
          s4still.style.opacity = t > 15.7 ? "1" : "0";
        }

        const s5on = t >= 15.9 && t < 23.32;
        s5.style.opacity = s5on ? String(seg(t, 15.9, 16.0) * (1 - seg(t, 23.02, 23.3))) : "0";
        if (s5on) {
          cam5.style.transform = `translate(${kf(S5_TX, t)}px,${kf(TY5, t)}px) scale(${kf(S5_S, t)})`;
          const c5 = easeIO(seg(t, 21.5, 21.95));
          const cw = 410 - 110 * c5, ch = 229 - 62 * c5, cl = 285 + 47 * c5;
          [s5cardEl, s5glow].forEach((el) => {
            el.style.left = `${cl}px`;
            el.style.width = `${cw}px`;
            el.style.height = `${ch}px`;
          });
          const wob = (f: number, p: number) => Math.sin(t * f * Math.PI * 2 + p);
          s5flares.forEach((el, i) => {
            el.style.left = `${cl + 5 + 16 * wob(0.42, i * 2.1)}px`;
            el.style.width = `${cw - 20 + 26 * wob(0.31, 1.3 + i * 1.7)}px`;
            el.style.top = i === 0 ? "197px" : `${196 + ch - 7}px`;
          });
          s5flareL.style.left = `${cl - 5}px`;
          s5flareR.style.left = `${cl + cw - 9}px`;
          [s5flareL, s5flareR].forEach((el, i) => {
            el.style.top = `${203 + ch * 0.12 + 18 * wob(0.37, 2.4 + i * 2.9)}px`;
            el.style.height = `${ch * 0.76 * (0.88 + 0.18 * wob(0.29, i * 1.2))}px`;
          });
          const genv = 0.75 + 0.25 * wob(0.52, 1.0);
          s5glow.style.boxShadow = `0 0 ${16 + 9 * wob(0.52, 1.0)}px ${4 + 3 * wob(0.52, 1.0)}px rgba(196,232,140,${0.5 + 0.28 * wob(0.52, 1.0)})`;
          const up5 = `translateY(${-62 * c5}px)`;
          s5thinkEl.style.transform = up5;
          s5flow.style.transform = up5;
          s5rule.style.marginTop = `${-62 * c5}px`;
          copyic.style.transform = `translateY(${-62 * c5 + 4 * (1 - easeOut(seg(t, 18.6, 18.85)))}px)`;
          s5tbar.style.opacity = t >= 21.8 && t < 22.3 ? "1" : "0";
          s5tbar.style.left = `${cl + 12}px`;
          s5tbar.style.top = `${203 + ch - 12}px`;
          s5tbar.style.width = `${cw - 24}px`;
          const bh = (bqEnd - bqTop) * seg(t, 16.88, 18.45);
          s5rule.style.top = `${bqTop}px`;
          s5rule.style.height = `${bh}px`;
          s5glow.style.opacity = String(0.9 * genv * seg(t, 15.97, 16.15) * (1 - 0.6 * c5));
          s5flares.forEach((f, i) => (f.style.opacity = String((0.72 + 0.28 * wob(0.61, i * 2.2)) * seg(t, 15.97, 16.15) * (1 - 0.8 * c5))));
          [s5flareL, s5flareR].forEach((f, i) => (f.style.opacity = String((0.6 + 0.4 * wob(0.47, 1.1 + i * 2.6)) * seg(t, 15.97, 16.15) * (1 - 0.85 * c5))));
          copyic.style.opacity = t >= 22.74 ? "0" : String(seg(t, 18.6, 18.8));
          copyic.style.filter = t >= 22.45 && t < 22.6 ? "brightness(0.4)" : "none";
          stopbtn.style.opacity = String(seg(t, 16.22, 16.5) * (1 - seg(t, 22.2, 22.4)));
          s5pillEl.style.opacity = String(1 - seg(t, 16.08, 16.35));
          cur5.style.opacity = t >= 21.7 && t < 22.74 ? "1" : "0";
          const dip5 = t >= 22.5 && t < 22.62 ? 0.92 : 1;
          cur5.style.transform = `translate(${kf(CUR5_X, t)}px,${kf(CUR5_Y, t)}px) scale(${(Math.max(1, kf(S5_S, t)) * dip5).toFixed(3)})`;
        }

        const copOn = t >= 22.74 && t < 23.3;
        s5cop.style.opacity = copOn ? String(seg(t, 22.74, 22.86) * (1 - seg(t, 23.05, 23.28))) : "0";
        if (copOn) s5copLbl.style.opacity = String(seg(t, 22.78, 22.92));

        const s6on = t >= 22.98 && t < 27.1;
        s6.style.opacity = s6on ? String(seg(t, 23.02, 23.32)) : "0";
        if (s6on) {
          s6.style.transform = `translateX(${60 * (1 - easeIO(seg(t, 23.02, 23.35)))}px)`;
          cam6.style.transform = `translate(${kf(CAM6_TX, t)}px,${kf(CAM6_TY, t)}px) scale(${kf(CAM6_S, t)})`;
          hdr6.style.top = `${kf([[23.3, 155], [23.6, 128], [23.85, 114]], t)}px`;
          hdr6.style.opacity = String(1 - seg(t, 24.18, 24.33));
          const cardT = kf(CARD6_T, t), cardB = kf(CARD6_B, t);
          s6cardEl.style.top = `${cardT}px`;
          s6cardEl.style.height = `${cardB - cardT}px`;
          const bl6 = 1.8 * seg(t, 24.2, 24.31) * (1 - seg(t, 24.36, 24.5));
          s6grp.style.filter = bl6 > 0.25 ? `blur(${bl6.toFixed(2)}px)` : "none";
          s6prompt.style.opacity = t >= 24.28 ? "1" : "0";
          s6prompt.style.top = `${kf(PR6_T, t)}px`;
          const bw6 = kf([[24.767, 132], [25.1, 132], [25.4, 126]], t);
          s6bag.style.opacity = t >= 24.767 ? "1" : "0";
          s6bag.style.left = `${kf(BAG_X, t)}px`;
          s6bag.style.top = `${kf(BAG_Y, t)}px`;
          s6bag.style.width = `${bw6.toFixed(1)}px`;
          s6bag.style.height = `${(bw6 * 0.957).toFixed(1)}px`;
          const bbl = kf(BAG_BLUR, t);
          s6bag.style.filter = (bbl > 0.2 ? `blur(${bbl.toFixed(1)}px) ` : "") +
            (t < 25.07 ? "drop-shadow(0 10px 22px rgba(0,0,0,0.18))" : "none");
          s6btnrow.style.transform = `translateY(${cardB - 465}px)`;
          s6wav.style.opacity = t < 24.3 ? "1" : "0";
          s6send.style.opacity = t >= 24.3 ? "1" : "0";
          const prs6 = t >= 26.33;
          s6send.style.filter = prs6 ? "brightness(0.82)" : "none";
          s6send.style.transform = prs6 ? "scale(0.9)" : "none";
          const fly = easeIO(seg(t, 26.78, 27.05));
          s6grp.style.transform = `translate(${900 * fly}px,${-800 * fly}px) rotate(${8 * fly}deg)`;
          s6grp.style.opacity = String(1 - seg(t, 26.85, 27.05));
          cur6.style.opacity = (t >= 23.62 && t < 24.6) || (t >= 24.77 && t < 26.95) ? "1" : "0";
          cur6.style.transform = `translate(${kf(CUR6_X, t)}px,${kf(CUR6_Y, t)}px)`;
          gico6.style.opacity = t < 24.28 ? "1" : String(1 - seg(t, 24.28, 24.36));
        }

        const s7on = t >= 26.55 && t < 36.02;
        s7.style.opacity = s7on ? String(1 - seg(t, 35.93, 36.0)) : "0";
        if (s7on) {
          cam7.style.transform = `translate(${kf(CAM7_TX, t)}px,${kf(CAM7_TY, t)}px) scale(${kf(CAM7_S, t)})`;
          s7grp.style.opacity = String(seg(t, 26.6, 26.82));
          if (t < 27.02) {
            const e7 = easeOut(seg(t, 26.6, 26.9));
            s7grp.style.transform = `translateY(${14 * (1 - e7)}px) scale(${lerp(0.98, 1, e7)})`;
          }
          const L = kf(S7_L, t), T = kf(S7_T, t), Wd = kf(S7_W, t), H = kf(S7_H, t);
          s7card.style.left = `${L}px`;
          s7card.style.top = `${T}px`;
          s7card.style.width = `${Wd}px`;
          s7card.style.height = `${H}px`;
          const f = Wd / 361;
          s7pill.style.left = `${34 * f}px`;
          s7pill.style.top = `${33 * f}px`;
          s7pill.style.width = `${191 * f}px`;
          s7pill.style.height = `${44 * f}px`;
          s7pill.style.transform = `scale(1)`;
          s7pilltxtEl.style.fontSize = `${24 * f}px`;
          s7pilltxtEl.style.left = `${52 * f}px`;
          s7pilltxtEl.style.top = `${7 * f}px`;
          s7spin.style.left = `${16 * f}px`;
          s7spin.style.top = `${10.5 * f}px`;
          s7spin.style.width = `${23 * f}px`;
          s7spin.style.height = `${23 * f}px`;
          s7title.style.opacity = String(1 - seg(t, 28.15, 28.45));
          if (t >= 26.82 && t < 28.5) {
            const N = genChars.length;
            const c = ((t / 0.65) % 1) * (N + 5) - 2.5;
            genChars.forEach((el, i) => {
              if (el.style.opacity === "0") return;
              const w = Math.exp(-Math.pow((i - c) / 1.7, 2));
              el.style.color = mix(GEN_BASE, GEN_HI, w);
            });
          }
          const ang7 = (((t - 26.7) / 3.2) * 360) % 360;
          s7sheen.style.backgroundImage = `conic-gradient(from ${(ang7 - 116).toFixed(1)}deg at 50% 50%, rgba(255,255,255,0) 0deg, rgba(255,255,255,0.08) 60deg, rgba(255,255,255,0.28) 100deg, rgba(255,255,255,0.6) 116deg, rgba(200,235,255,0.25) 126deg, rgba(200,235,255,0) 136deg, rgba(255,255,255,0) 360deg)`;
          s7sheen.style.opacity = String(0.65 * seg(t, 26.7, 27.0) * (0.85 + 0.15 * Math.sin(t * 1.45 + 1)));
          const po = 1 - seg(t, 28.6, 28.95);
          s7pill.style.opacity = String(po);
          s7spin.style.transform = `rotate(${(t * 300) % 360}deg)`;
          s7dim.style.opacity = String(t < 28.55 ? 1 : 0.88 * (1 - seg(t, 28.55, 28.95)));
          const p = seg(t, 28.5, 35.8);
          const bw = Wd * 0.66;
          pbar.style.left = `${Wd * 0.16}px`;
          pbar.style.top = `${H - 72}px`;
          pbar.style.width = `${bw}px`;
          pbar.style.opacity = String(seg(t, 28.45, 28.6) * 1);
          pfill.style.width = `${bw * p}px`;
          pknob.style.left = `${bw * p - 4}px`;
        }

        s8.style.opacity = t >= 35.9 ? "1" : "0";
        if (t >= 35.9) {
          s8txt.style.transform = `translateY(${13 * (1 - easeOut(seg(t, 36.05, 36.85)))}px)`;
        }
      };

      const cleanup = inst.addFrameTask(({ ownCurrentTimeMs }) => render(ownCurrentTimeMs));
      render(0);
      return cleanup;
    };
    return () => {
      tg.initializer = undefined;
    };
  }, []);

  return (
    <Timegroup ref={rootRef as React.Ref<HTMLElement>} mode="fixed" duration={`${FLOW_MS}ms`} className="absolute w-full h-full">
      <div className="scene s4">
        <div className="s4title" style={{ top: 120 }}>Analyzing started...</div>
        <div className="s4card" style={{ left: 137, top: 75, width: 1011, height: 562, transformOrigin: "50% 10%" }}>
          <EfImage className="fill" src={PRODUCT_SRC} style={{ opacity: 0 }} />
          <Timegroup mode="fixed" duration="6.84s" className="vseq4">
            <Clip src={CARD_SEQ} className="vfill" />
          </Timegroup>
          <EfImage className="fill s4still" src={PRODUCT_SRC} style={{ opacity: 0 }} />
        </div>
        <div className="s4fx" style={{ left: 137, top: 75, width: 1011, height: 562, transformOrigin: "50% 10%" }}>
          <div className="sheen s4sheen" />
          <div className="sheen s4sheen2" />
          <div className="s4flare s4flareT" />
          <div className="s4flare s4flareB" />
          <div className="s4pool" style={{ left: -45, top: -45 }} />
          <div className="s4pool" style={{ right: -45, top: -45 }} />
          <div className="s4pool" style={{ right: -45, bottom: -45 }} />
          <div className="s4pool" style={{ left: -45, bottom: -45 }} />
        </div>
        <div className="pill s4pill" style={{ left: 433, top: 488, width: 412, height: 96 }}>
          <div className="s4pilltxt" style={{ fontSize: 38, lineHeight: "96px" }}>Analyzing.</div>
        </div>
      </div>

      <div className="scene s5">
        <div className="cam cam5">
          <div className="s5scroll">
            <div className="aistat">Strategized video analysis and creative replication approach</div>
            <div className="aitype" style={{ fontSize: 26 }}>
              I'll analyze the video for you. Let me extract frames and examine it..
            </div>
            <div className="aistart">Analyzing started...</div>
            <div className="s5card">
              <EfImage src={PRODUCT_SRC} />
            </div>
            <div className="s5cardglow" />
            <div className="s5flare s5flareh s5flaret" />
            <div className="s5flare s5flareh s5flareb" />
            <div className="s5flare s5flarev s5flarel" />
            <div className="s5flare s5flarev s5flarer" />
            <div className="s5pill">Analyzed!</div>
            <div className="stopbtn" />
            <div className="s5tbar"><div className="s5tfill" /></div>
            <div className="s5think">
              <W g="think" t="Deconstructed luxur perfume ad structure and synthesized comprehensive video prompt" />
            </div>
            <div className="s5flow" style={{ position: "absolute", left: 259, top: 526, width: 760 }}>
              <div style={{ marginLeft: 72, width: 470 }} className="bqp">
                <W
                  g="body"
                  t={'This is a luxury fragrance commercial for a (fictional) brand called ROSEFIELD — an ~8 second golden-hour spot: extreme close-up of a spray, a dreamy meadow pose, a weightless backward "float" through swirling petals, then a clean product hero shot. Here\'s a detailed prompt you can paste into a text-to-video or image-to-video model (Seedance, Veo, Kling, Runway, etc.).'}
                />
              </div>
              <div className="mphdr" style={{ marginLeft: 74, margin: "26px 0 22px 74px", fontSize: 20, fontWeight: 700 }}>
                <W g="mp" t="MASTER PROMPT" />
              </div>
              <div className="s5bqwrap" style={{ position: "relative" }}>
                <div className="bq1 bqp" style={{ marginLeft: 88, width: 620, color: "#3d3d3d" }}>
                  <W g="bq1" t="Cinematic luxury {PRODUCT_CATEGORY} commercial, golden-hour summer, shot on warm filmic stock with shallow depth of field and soft anamorphic-style bokeh. A {SUBJECT} wearing {WARDROBE}, in {SETTING}. Backlit by a low warm sun flaring through {BACKLIGHT_SOURCE}; fine {PARTICLES} drift in the air." />
                </div>
                <div className="bqp" style={{ marginLeft: 88, width: 612 }}>
                  <W g="bq2" cls="shotb" t="Shot 1 (0–2s) —" />
                  <W g="bq2" t={'macro intimacy: Extreme close-up, slightly low angle on {FOCAL_AREA} as the subject lifts {PRODUCT_OBJECT} ({PRODUCT_LOOK}, "{BRAND}" {BRAND_PLACEMENT}) and {SIGNATURE_GESTURE}. The {SIGNATURE_EFFECT} catches the backlight and sparkles; loose hair strands glow against the sun. Hand and {PRODUCT_NOUN} in crisp focus, background a creamy {BG_COLORS} bokeh. Slow, locked, reverent.'} />
                </div>
                <div className="bq3 bqp" style={{ marginLeft: 88, width: 612 }}>
                  <W g="bq3" cls="shotb" t="Shot 2 (2–4s) —" />
                  <W g="bq3" t="bloom: Cut wider, low angle looking slightly up at the subject standing in {SETTING_SHORT}, eyes gently closed, a serene half-smile. They {EMOTIONAL_GESTURE} in a slow graceful arc; hair lifts in a soft breeze; sun bursts through {BACKLIGHT_SOURCE} in a warm lens flare. Camera drifts subtly, dreamlike." />
                </div>
                <div className="bqp" style={{ marginLeft: 88, width: 612 }}>
                  <W g="bq4" cls="shotb" t="Shot 3 (4–6s) —" />
                  <W g="bq4" t="release: They arch backward, abandoning themselves to the moment. Continuous motion into a surreal, weightless beat: the whole body lifts and floats horizontally above {GROUND_SURFACE}, suspended mid-air, hair and {WARDROBE_TRAIL} trailing, surrounded by a slow swirl of pale {PARTICLES} catching the light. Side profile, ethereal, balletic, slow-motion feel." />
                </div>
                <div className="bqp" style={{ marginLeft: 88, width: 612 }}>
                  <W g="bq5" cls="shotb" t="Shot 4 (6–8s) —" />
                  <W g="bq5" t={'hero: Smooth transition to a clean product shot. The {BRAND} {PRODUCT_NOUN} ({PRODUCT_HERO_LOOK}) stands on {HERO_SURFACE} beside its {PACKAGING_LOOK} reading "{BRAND} / {PRODUCT_LABEL} / {SIZE_OR_SPEC}". One soft {SINGLE_PARTICLE} floats down past frame. Behind, {SETTING_SHORT} dissolves into a luminous out-of-focus bokeh of {BG_COLORS}. Warm, soft, premium.'} />
                </div>
                <div className="bqp" style={{ marginLeft: 88, width: 612 }}>
                  <W g="bq6" cls="shotb" t="Look:" />
                  <W g="bq6" t="{MOOD_KEYWORDS}, high-end {PRODUCT_CATEGORY} aesthetic. {COLOR_GRADE}, gentle film grain, soft highlights, natural skin tones. 1080p+, 24fps, shallow focus throughout, no on-screen text except the brand on {BRANDED_OBJECTS}." />
                </div>
                <div className="bq7 bqp" style={{ marginLeft: 88, width: 612 }}>
                  <W g="bq7" cls="shotb" t="Audio:" />
                  <W g="bq7" t={'{MUSIC_STYLE} with a single airy piano motif, a delicate "{SIGNATURE_SFX}" on the {SIGNATURE_ACTION}, breeze and faint birdsong; resolve to a soft musical bloom on the product shot. No dialogue.'} />
                </div>
              </div>
              <div className="bqp" style={{ marginLeft: 74, width: 660, marginTop: 30 }}>
                <W g="cbs" cls="shotb" t="Compact beat sheet" />
                <W g="cbs" t="(handy if your tool wants short scene clips you stitch together):" />
              </div>
              <div className="bqp" style={{ marginLeft: 101, width: 535 }}>
                <W g="ind1" t="Macro: subject {SIGNATURE_GESTURE} with {BRAND} {PRODUCT_NOUN}, backlit {SIGNATURE_EFFECT} sparkling, golden {SETTING_SHORT} bokeh." />
              </div>
              <div className="bqp" style={{ marginLeft: 101, width: 535 }}>
                <W g="ind2" t="Wide low-angle: subject stands in {SETTING_SHORT}, eyes closed, {EMOTIONAL_GESTURE}, hair in breeze, sun flare." />
              </div>
              <div className="ind3w bqp" style={{ marginLeft: 101, width: 535 }}>
                <W g="ind3" t="Float: subject arches back and levitates horizontally above {GROUND_SURFACE} amid swirling {PARTICLES}, weightless slow-motion." />
              </div>
              <div className="bqp" style={{ marginLeft: 101, width: 535 }}>
                <W g="ind4" t="Product: {BRAND} {PRODUCT_NOUN} + {PACKAGING_SHORT} on {HERO_SURFACE}, drifting {SINGLE_PARTICLE}, dreamy {SETTING_SHORT} bokeh." />
              </div>
              <div className="closew" style={{ marginTop: 40, width: 660 }}>
                <W g="close" t={'A few things that make this read as "luxury {PRODUCT_CATEGORY}" rather than generic: keep the lens shallow (subject sharp, background melted), commit to the backlit golden hour with a real flare, and make the {SIGNATURE_EFFECT} and {PARTICLES} the only fast-moving elements while everything else moves slowly. If your generator supports it, request slow-motion (~48–60fps captured, played at 24) for the float beat.'} />
              </div>
            </div>
            <div className="s5rule" />
            <div className="copyic" style={{ left: 1024, top: 700 }}>
              <CopyIcon size={26} color="#8a8a8a" />
            </div>
          </div>
        </div>
        <div className="cursor cur5">
          <CursorSvg size={30} />
        </div>
      </div>

      <div className="scene s6">
        <div className="cam cam6">
          <div className="chathdr hdr6" style={{ top: 155 }}>
            <span className="hf">Higgsfield /MCP</span>
            <span className="star">
              <Star size={44} color="#E08A74" />
            </span>
            <span className="cl serif">Claude</span>
          </div>
          <div className="s6grp">
            <div className="inputcard s6card" style={{ left: 239, top: 334, width: 801, height: 139 }} />
            <div className="s6bag" style={{ left: -160, top: 262, width: 138, height: 130, opacity: 0 }}>
              <EfImage src={BAG_SRC} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", transform: "none", objectFit: "cover" }} />
            </div>
            <div className="s6prompt" style={{ left: 261, top: 170, width: 724, opacity: 0 }}>
              <span className="p1">
              Cinematic luxury perfume commercial, golden-hour summer, shot on warm filmic stock
              with shallow depth of field and soft anamorphic-style bokeh. A young woman with dark
              hair tied back, wearing a navy floral-print short-sleeve dress, in a sunlit
              English-style parkland meadow beneath a large spreading oak tree. Backlit by a low
              warm sun flaring through the leaves; fine seed pollen and white flower petals drift
              in the air.
              </span>
              <br />
              <br />
              <span className="shotb">Shot 1 (0–2s) — </span>macro intimacy: Extreme close-up,
              slightly low angle on her neck and collarbone as she lifts a clear glass perfume
              bottle (gold atomizer cap, "ROSEFIELD" etched on the glass) and sprays toward her
              throat. The fine mist catches the backlight and sparkles, loose hair strands glow
              against the sun. Hand and bottle in crisp focus, background a creamy gold-green
              bokeh. Slow, locked, reverent.
            </div>
            <div className="s6btnrow" style={{ position: "absolute", inset: 0 }}>
              <div className="plus" style={{ left: 266, top: 418 }}>+</div>
              <div className="opus" style={{ left: 830, top: 429, fontSize: 17 }}>Opus 4.7</div>
              <div className="adaptive" style={{ left: 905, top: 430, fontSize: 17 }}>Adaptive ⌄</div>
              <div className="wavicon s6wav" style={{ left: 985, top: 425 }}>
                <WavIcon size={20} color="#2f2f2f" />
              </div>
              <div className="sendbtn sm s6send" style={{ left: 987, top: 419, opacity: 0 }}>
                <ArrowUp size={15} color="#fff" />
              </div>
            </div>
          </div>
          <div className="cursor cur6">
            <div className="gico" style={{ position: "absolute", left: -16, top: -13 }}>
              <PasteIcon size={26} />
            </div>
            <CursorSvg size={30} />
          </div>
        </div>
      </div>

      <div className="scene s7">
        <div className="cam cam7">
          <div className="s7grp">
            <div className="s7title" style={{ top: 278 }}>
              {"Generating...".split("").map((ch, i) => (
                <span key={i} className="w gch" data-g="gen">{ch}</span>
              ))}
            </div>
            <div className="s7card" style={{ left: 487, top: 37, width: 361, height: 647 }}>
              <div className="vertwrap">
                <Timegroup mode="sequence" className="vseq7">
                  <Timegroup mode="fixed" duration="19.57s"><div /></Timegroup>
                  <Timegroup mode="fixed" duration="7.5s"><Clip src={VERT_SEQ} className="vfill" /></Timegroup>
                </Timegroup>
              </div>
              <div className="s7dim" />
              <div className="s7pill" style={{ left: 34, top: 36, width: 191, height: 44 }}>
                <div className="s7spin" />
                <div className="s7pilltxt">In progress</div>
              </div>
              <div className="pbar">
                <div className="pfill" />
                <div className="pknob" />
              </div>
              <div className="sheen s7sheen" />
            </div>
          </div>
        </div>
      </div>

      <EndCard />

      <div className="scene s5copied">
        <div className="cgrp" style={{ left: 662, top: 338, transform: "scale(1.92)", transformOrigin: "0 0" }}>
          <CopyIcon size={26} color="#7a7a7a" />
          <div className="clbl">Copied!</div>
        </div>
        <div className="cursor ccur" style={{ left: 688, top: 382, opacity: 1, transform: "scale(1.92)", transformOrigin: "0 0" }}>
          <CursorSvg size={30} />
        </div>
      </div>
    </Timegroup>
  );
};
