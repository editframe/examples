import React, { useEffect, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { LP, TRQ, WIREF, FLAPA } from "../fold";
import { WALLS } from "../walls";
import { SQ_TR, SQ_BL, SPK2, WR2, WIRE } from "../b11";
import type { TgEl, G } from "../lib/anim";
import { clamp01, wp, wpn, inR, seg, gridX, gridY, gry, setGridOps, halfMap } from "../lib/anim";
import { W, H, FPS, FOLD_WALLS_MS, FOLD_WALLS_START, CN, NV, NH, KMIN, JMIN, WPAD, STAR_DS } from "../constants";
import { Box, RR, Grid, GlyphGrid, Sparkle, Star2, star4TilesS, STAR_U, softPx } from "../components/Presentational";

const sqBlob = (cx: number, cy: number, rad: number) => (r: number, c: number) => Math.max(0, 0.38 * (1 - Math.hypot(c - cx, r - cy) / rad));
const sqBlobBL = (r: number, c: number) => ((r * 7 + c * 13) % 2 === 0 ? 0.045 + 0.135 * Math.exp(-((c - 2.5) ** 2 / 12.5 + (r - 3.5) ** 2 / 18)) : 0);
const sqBlobTR = () => 0;
const DASH_POOL = 360, WD_POOL = 120, MK_POOL = 10;
const WALL_POOL = 48;

export const FoldWalls = () => {
  const rootRef = useRef<TgEl>(null);
  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;
    tg.initializer = (inst) => {
      const q = <T extends HTMLElement>(sel: string) => inst.querySelector(sel) as T | null;
      const st = (el: HTMLElement | null, k: string, v: string) => {
        if (k === "width" && v.endsWith("px")) v = `${Math.round(parseFloat(v))}px`;
        if (el && (el.style as any)[k] !== v) (el.style as any)[k] = v;
      };
      const cache = new Map<string, HTMLElement | null>();
      const g = (sel: string) => { if (!cache.has(sel)) cache.set(sel, q(sel)); return cache.get(sel)!; };
      const op = (sel: string, v: number) => st(g(sel), "opacity", String(clamp01(v)));
      const tf = (sel: string, v: string) => st(g(sel), "transform", v);
      const tr = (sel: string, x: number, y: number, sx = 1, sy = sx) => tf(sel, `translate(${x}px, ${y}px) scale(${sx}, ${sy})`);

      const setRR = (c: string, x: number, y: number, w: number, h: number, r: number) => {
        const el = g(`.${c}`); if (!el) return;
        const ww = Math.max(0, w), hh = Math.max(0, h);
        st(el, "transform", `translate(${x}px, ${y}px)`); st(el, "width", `${ww}px`); st(el, "height", `${hh}px`); st(el, "borderRadius", `${Math.max(0, Math.min(r, ww / 2, hh / 2))}px`);
      };
      const setGrid = (c: string, G: G) => {
        for (let i = 0; i < NV; i++) {
          const x = gridX(G, KMIN + i);
          tr(`.${c}-v${i}`, Math.round(x - 0.5), 0);
        }
        for (let i = 0; i < NH; i++) {
          const y = gridY(G, JMIN + i);
          tr(`.${c}-h${i}`, 0, Math.round(y - 0.5));
        }
      };
      const setCell = (c: string, n: number, G: G, k: number, j: number, o = 1) => {
        const x0 = gridX(G, k), x1 = gridX(G, k + 1), y0 = gridY(G, j), y1 = gridY(G, j + 1);
        tr(`.${c}-cell${n}`, x0 + 1, y0 + 1, x1 - x0 - 1, y1 - y0 - 1); op(`.${c}-cell${n}`, o);
      };

      const SPK = [[387, 726, 420, 3], [388, 690, 399, 21], [389, 678, 390, 29], [391, 683, 377, 44], [393, 718, 368, 52], [395, 795, 361, 58], [397, 961, 355, 65], [399, 1218, 352, 67], [400, 1266, 350, 67.5], [401, 1299, 348, 68], [403, 1336, 347, 69], [405, 1348, 344, 69]];
      const WRT = [[388, 687, 400, 677], [389, 668, 390, 687], [390, 649, 386, 692], [391, 636, 380, 702], [393, 618, 371, 711], [395, 605, 364, 717], [397, 595, 358, 723], [399, 588, 354, 726], [401, 582, 351, 730], [405, 574, 347, 734]];
      const SP11 = [[387, 231.5], [388, 271.5], [389, 290.5], [390, 304.5], [392, 325], [394, 339.5], [396, 351.5], [398, 360], [400, 367], [404, 377], [408, 382], [412, 384.5], [420, 384.5], [428, 383.5], [436, 382.2], [440, 380.5], [444, 377.8], [448, 373], [452, 365], [456, 349.5], [458, 332], [460, 287.2], [462, 262.5], [464, 250], [466, 243], [468, 237.5], [472, 230.8], [476, 226.8], [480, 224]];
      const SEXT = [[387, 726, 420, 3.5, 3.5], [388, 690, 400, 11.0, 10.0], [389, 678, 390, 15.5, 15.5], [390, 679, 382, 20.0, 17.5], [391, 684, 377, 23.5, 20.5], [392, 696, 372, 25.5, 25.0], [393, 723, 368, 28.0, 28.0], [394, 757, 364, 30.0, 30.0], [395, 796, 362, 31.0, 30.0], [396, 906, 358, 33.0, 33.0], [397, 1023, 351, 34.5, 34.5], [398, 1144, 354, 36.0, 36.0], [399, 1202, 352, 36.0, 36.0], [400, 1253, 350, 36.5, 36.5], [401, 1298, 350, 36.0, 36.0], [402, 1320, 348, 36.5, 36.0], [403, 1334, 346, 36.5, 36.0], [404, 1344, 346, 36.5, 37.0], [405, 1348, 344, 36.5, 36.0], [406, 1330, 344, 36.5, 36.0], [407, 1339, 328, 36.5, 36.0], [408, 1032, 343, 36.5, 36.0], [409, 890, 342, 36.5, 36.0], [410, 800, 342, 36.5, 36.0], [411, 736, 342, 36.5, 36.0], [412, 690, 342, 36.5, 36.0], [413, 654, 342, 36.5, 36.0], [414, 628, 342, 36.5, 36.0], [415, 608, 342, 36.5, 36.0], [416, 594, 342, 36.5, 36.0], [417, 584, 342, 36.5, 36.0], [418, 576, 342, 36.5, 36.0], [419, 572, 342, 36.5, 36.0], [420, 572, 342, 36.5, 36.0], [421, 572, 342, 36.5, 36.0], [422, 572, 342, 36.5, 36.0], [423, 572, 342, 36.5, 36.0], [424, 572, 342, 36.5, 36.0], [425, 572, 342, 36.5, 36.0], [426, 572, 342, 36.5, 36.0], [427, 574, 342, 36.5, 36.0], [428, 576, 340, 36.5, 36.0], [429, 584, 340, 36.5, 36.0], [430, 596, 337, 36.5, 36.0], [431, 616, 332, 36.5, 36.0], [432, 654, 324, 36.5, 36.0], [433, 778, 298, 36.5, 36.0], [434, 970, 257, 36.5, 36.0], [435, 1016, 248, 36.5, 36.0], [436, 1040, 242, 36.5, 36.0], [437, 1054, 240, 36.5, 36.0], [438, 1064, 238, 36.5, 36.0], [439, 1068, 238, 36.5, 36.0], [440, 1072, 236, 36.5, 36.0], [441, 1072, 238, 36.5, 36.0], [442, 1072, 238, 36.5, 36.0], [443, 1072, 238, 36.5, 36.0], [444, 1072, 240, 36.5, 36.0], [445, 1072, 240, 36.5, 36.0], [446, 1072, 240, 36.5, 36.0], [447, 1070, 242, 36.5, 36.0], [448, 1070, 242, 36.5, 36.0], [449, 1070, 244, 36.5, 36.0], [450, 1068, 246, 36.5, 36.0], [451, 1068, 248, 36.5, 36.0], [452, 1065, 252, 35.0, 33.5], [453, 1062, 258, 33.0, 32.5], [454, 1058, 263, 30.5, 29.0], [455, 1055, 269, 27.5, 27.0], [456, 1050, 277, 24.5, 25.5], [458, 1023, 316, 17.0, 16.0], [459, 1011, 341, 20, 20], [460, 957, 395, 24, 25], [461, 962, 400, 24, 25], [462, 960, 407, 24, 25], [463, 962, 412, 24, 25], [464, 962, 413, 24, 25], [465, 962, 415, 23.0, 24.5], [466, 962, 417, 23.0, 24.0], [467, 962, 419, 22.5, 23.5], [468, 962, 420, 22.5, 23.5], [469, 962, 421, 22.5, 23.5], [470, 962, 422, 22.0, 23.5], [471, 962, 423, 21.5, 23.0], [472, 963, 423, 22.0, 19.5], [473, 962, 423, 20.0, 23.0], [474, 962, 424, 21.5, 23.0], [475, 962, 425, 22.0, 23.0], [476, 962, 425, 22.0, 23.0], [477, 962, 425, 21.0, 22.5], [478, 962, 426, 22.0, 22.5], [479, 962, 426, 21.5, 23.0], [480, 960, 427, 22, 23]];
      const SPKALL = SPK.filter((r) => r[0] < 405).map((r) => [r[0], r[1], r[2], r[3] * 0.855 * 1.16]).concat(SPK2.map((r) => [r[0], r[1], r[2], r[3] * (r[0] >= 463 ? 1.22 : 1.16)]));
      const CUBE_K = [[457, 830, 454, 346, 184, -185], [458, 811, 454, 338, 176, -176], [459, 792, 459, 319, 167, -167], [460, 748, 466, 291, 153, -153], [463, 783, 477, 242, 128, -120], [467, 782, 471, 248, 128, -120], [471, 787, 477, 241, 124, -120], [475, 790, 479, 236, 122, -118], [480, 793, 478, 234, 118, -115]];
      const WF_EXTRA: Record<number, number[]> = { 458: [611, 454, 1149, 792, 176, -176], 459: [658, 459, 1111, 778, 167, -167], 460: [746, 466, 1039, 757, 153, -153] };
      const MSZ = [[433, 13], [436, 20], [453, 20], [459, 17], [460, 15], [463, 13]];

      let dgi = 0, dwi = 0, mki = 0, halfLast = -1;
      const dashSeg = (x1: number, y1: number, x2: number, y2: number, white = false, alpha = 1, inside?: (x: number, y: number) => boolean) => {
        const L = Math.hypot(x2 - x1, y2 - y1); if (L < 4) return;
        const ang = Math.atan2(y2 - y1, x2 - x1), ux = Math.cos(ang), uy = Math.sin(ang);
        for (let t = 0; t < L; t += 26) {
          const len = Math.min(12, L - t); if (len < 1) break;
          if (inside && !inside(x1 + ux * (t + len / 2), y1 + uy * (t + len / 2))) continue;
          const c = white ? `.dw${dwi}` : `.dg${dgi}`; const el = g(c); if (!el) return; if (white) dwi++; else dgi++;
          st(el, "width", `${len}px`); st(el, "transform", `translate(${x1 + ux * t}px, ${y1 + uy * t - 1}px) rotate(${ang}rad)`); op(c, alpha);
        }
      };
      const marker = (x: number, y: number, sz = 13) => { const c = `.mk${mki}`; if (!g(c)) return; mki++; tf(c, `translate(${x - sz / 2}px, ${y - sz / 2}px) scale(${(sz / 13).toFixed(3)})`); op(c, 1); };
      const wireFinish = () => { for (let i = dgi; i < DASH_POOL; i++) op(`.dg${i}`, 0); for (let i = dwi; i < WD_POOL; i++) op(`.dw${i}`, 0); for (let i = mki; i < MK_POOL; i++) op(`.mk${i}`, 0); dgi = 0; dwi = 0; mki = 0; };

      const renderE = (f: number) => {
        const on = f >= 387;
        op(".sc5", on ? 1 : 0);
        if (!on) return;
        const sp = wp(f, SP11);
        const hr5 = 0.525 * sp - 3.8, sy5 = sp / 153.6;
        const G: G = { sx: sp / 154, sy: sy5, cx: 958.5, cy: 538.5, tx: 0, ty: 0, kx0: 958.5, ky0: 538.5 + hr5 / sy5 };
        setGrid("g5", G);
        { const gcol = gry(wp(f, [[456, 230], [462, 234]])); const offs: Record<number, number> = { [-3]: -0.016, [-2]: 0.016, [1]: 0.025, [3]: 0.017 };
          for (let i = 0; i < NV; i++) { const k = KMIN + i; tr(`.g5-v${i}`, gridX(G, k) + (offs[k] ?? 0) * sp - 1.5, 0, 1.5, 1); st(g(`.g5-v${i}`), "background", gcol); }
          for (let i = 0; i < NH; i++) { tr(`.g5-h${i}`, 0, gridY(G, JMIN + i) - 1.5, 1, 1.5); st(g(`.g5-h${i}`), "background", gcol); } }
        const TINT = [[-1, -2, 449, 455], [-3, -1, 453, 459], [2, 0, 457, 463]];
        for (let i = 0; i < 3; i++) { const c = TINT[i]; setCell("g5", i, G, c[0], c[1], 1 - seg(f, c[2], c[3])); }
        const sk = wpn(f, SPKALL); const se = wpn(f, SEXT);
        {
          const hx = Math.max(2, Math.round(se[2] * 1.078)), hy = Math.max(2, Math.round(se[3] * 1.078)), scx = Math.round(se[0]), scy = Math.round(se[1]);
          tf(".spark", `translate(${scx - hx}px, ${scy - hy}px)`); op(".spark", 1); st(g(".spark"), "width", `${2 * hx}px`); st(g(".spark"), "height", `${2 * hy}px`);
          const tiles = star4TilesS(hx, hy, "#EE3D07", "rgba(238,61,7,0)", STAR_DS), hs = (hx + hy) / 2, sq = Math.sqrt(Math.max(1, hs));
          const HX = STAR_U.map((u) => Math.max(2, Math.round(hx - u * sq))), HY = STAR_U.map((u) => Math.max(2, Math.round(hy - u * sq)));
          const box = (L: HTMLElement, A: HTMLElement, l: number, t: number, w: number, h: number, ax: number, ay: number) => {
            st(L, "left", `${l}px`); st(L, "top", `${t}px`); st(L, "width", `${Math.max(0, w)}px`); st(L, "height", `${Math.max(0, h)}px`);
            st(A, "left", `${ax}px`); st(A, "top", `${ay}px`); st(A, "width", `${2 * hx}px`); st(A, "height", `${2 * hy}px`);
            const kids = A.children; for (let i = 0; i < 8; i++) { const e = kids[i] as HTMLElement, q = tiles[i]; e.style.left = `${q.l}px`; e.style.top = `${q.t}px`; e.style.width = `${q.w}px`; e.style.height = `${q.h}px`; e.style.background = q.bg; }
          };
          for (let k = 0; k < STAR_U.length; k++) {
            const Hx = HX[k], Hy = HY[k], Nx = k + 1 < STAR_U.length ? Math.min(HX[k + 1], Hx) : 0, Ny = k + 1 < STAR_U.length ? Math.min(HY[k + 1], Hy) : 0;
            if (k === STAR_U.length - 1) { const L = g(`.sparkl${k}s0`), A = g(`.sparka${k}s0`); if (L && A) box(L, A, hx - Hx, hy - Hy, 2 * Hx, 2 * Hy, Hx - hx, Hy - hy); continue; }
            const geo = [[hx - Hx, hy - Hy, 2 * Hx, Hy - Ny, Hx - hx, Hy - hy], [hx - Hx, hy + Ny, 2 * Hx, Hy - Ny, Hx - hx, -hy - Ny],
              [hx - Hx, hy - Ny, Hx - Nx, 2 * Ny, Hx - hx, Ny - hy], [hx + Nx, hy - Ny, Hx - Nx, 2 * Ny, -hx - Nx, Ny - hy]];
            for (let sd = 0; sd < 4; sd++) { const L = g(`.sparkl${k}s${sd}`), A = g(`.sparka${k}s${sd}`); if (L && A) box(L, A, geo[sd][0], geo[sd][1], geo[sd][2], geo[sd][3], geo[sd][4], geo[sd][5]); }
          } }
        { const hs = Math.max(0.3, sk[2] / 60.5); tf(".halo", `translate(${sk[0] - 84 * hs}px, ${sk[1] - 84 * hs}px) scale(${hs.toFixed(4)})`); op(".halo", f >= 395 ? seg(f, 394, 396) : 0); st(g(".halo"), "border", f >= 460 ? "5px solid rgba(255,255,255,0.5)" : "2.5px solid #E8E8E8"); st(g(".halo"), "filter", f >= 460 ? "blur(1.2px)" : "blur(0.8px)"); }
        const wl = wpn(f, WRT);
        const wrOn = f >= 388 && f <= 457;
        const wf = f >= 434 && f <= 459 ? (f === 454 ? WIREF[453].map((v, i) => (v + WIREF[455][i]) / 2) : (WIREF[f] ?? WF_EXTRA[f])) : undefined;
        const owr = f >= 405 ? wpn(f, WR2) : [wl[0], wl[1], Math.max(2, Math.max(958.5, sk[0]) - wl[0]), Math.max(2, wl[2] - wl[1])];
        const wr = wf ? [wf[2] - (wf[3] - wf[1]), wf[1], wf[3] - wf[1], wf[3] - wf[1]] : owr;
        op(".wr", wrOn ? wp(f, [[388, 0.33], [389, 0.4], [390, 0.67], [391, 1]]) : 0);
        const wrr = wf ? 0 : f >= 410 ? 24 : 30;
        if (wrOn) setRR("wr", wr[0], wr[1], wr[2], wr[3], wrr);
        setRR("hclip", wr[0], wr[1], wr[2], wr[3], wrr); op(".hclip", wrOn ? wp(f, [[394, 0], [395, 0.2], [397, 0.35], [398, 1]]) : 0);
        op(".half", 1); tf(".half", `translate(${owr[0] - wr[0]}px, ${owr[1] - wr[1]}px)`);
        if (f !== halfLast) { setGridOps(g(".halfg"), 26, 30, 23, 0, 0, 24, halfMap(f), 12, 1.0); halfLast = f; }
        const hpz = wp(f, [[397, 0.3], [398, 0.4], [399, 0.45], [400, 0.5], [401, 0.6], [402, 0.7], [403, 0.85], [404, 1.2]]);
        const hwv = g(".hwipe");
        if (hwv) { st(hwv, "width", `${2 * wr[2]}px`); st(hwv, "height", `${wr[3]}px`); st(hwv, "background", `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.75) ${((260 / (2 * wr[2])) * 100).toFixed(2)}%, rgba(255,255,255,0.75) 100%)`); }
        tf(".hwipe", `translate(${wr[2] * hpz}px, 0px)`); op(".hwipe", inR(f, 398, 404) ? 1 : 0);
        const cps = [[wr[0], wr[1]], [wr[0] + wr[2], wr[1]], [wr[0], wr[1] + wr[3]], [wr[0] + wr[2], wr[1] + wr[3]]];
        for (let i = 0; i < 4; i++) { tf(`.cp${i}`, `translate(${cps[i][0] - 6}px, ${cps[i][1] - 6}px)`); op(`.cp${i}`, wrOn && f >= 397 && (f <= 404 || (i >= 2 && f <= 433)) ? 1 : 0); }
        const cbk = f >= 457 ? wpn(f, CUBE_K) : null;
        for (let i = 0; i < 2; i++) { const p = cbk && f >= 458 ? [cbk[0] + cbk[2], cbk[1] + (i === 0 ? 0 : cbk[2])] : (i === 0 ? cps[1] : cps[3]); const hz0 = i === 0 ? 15 : 24; const sc = f <= 429 ? 1 : f <= 457 ? (i === 0 ? 36 / 30 : 36 / 48) : (i === 0 ? 18 / 30 : 20 / 48); const hz = (hz0 + WPAD) * sc; tf(`.wsp${i}`, `translate(${p[0] - hz}px, ${p[1] - hz}px) scale(${sc.toFixed(3)})`); op(`.wsp${i}`, inR(f, 405, 480) ? 1 : 0); }
        tf(".wsp2", `translate(${cps[0][0] - 20 - WPAD}px, ${cps[0][1] - 20 - WPAD}px)`); op(".wsp2", inR(f, 405, 429) ? 1 : 0);
        for (const [c, tab, bw, bh] of [[".sqTR", SQ_TR, 282, 293], [".sqBL", SQ_BL, 282, 293]] as const) {
          const r = f >= (c === ".sqBL" ? 428 : 434) ? undefined : tab[f]; const el = g(c); if (!el) continue; if (!r) { op(c, 0); continue; }
          st(el, "width", `${r[2]}px`); st(el, "height", `${r[3]}px`); st(el, "transform", `translate(${r[0]}px, ${r[1]}px)`); op(c, 1);
          tf(`${c}h`, `scale(${r[2] / bw}, ${r[3] / bh})`);
        }
        if (f >= 409 && f <= 433) {
          const v = wpn(f, WIRE); const Pt = (i: number) => [v[2 * i], v[2 * i + 1]]; const bBL = [v[8], v[13]];
          const segsG: number[][] = [];
          if (f >= 411) segsG.push([...Pt(0), ...Pt(1)], [...Pt(0), ...Pt(2)], [...Pt(2), ...Pt(3)], [...Pt(1), ...Pt(3)], [...Pt(0), ...Pt(4)], [...Pt(2), ...bBL], [...Pt(3), ...Pt(6)]);
          segsG.push([...Pt(4), ...Pt(5)], [...Pt(5), ...Pt(6)], [...Pt(4), ...bBL], [...bBL, ...Pt(6)]);
          const wTL = [wr[0], wr[1]], wBL = [wr[0], wr[1] + wr[3]], wBR = [wr[0] + wr[2], wr[1] + wr[3]], wTR = [wr[0] + wr[2], wr[1]];
          if (f >= 411) segsG.push([...wTL, ...Pt(0)], [...wBL, ...Pt(2)]);
          segsG.push([...wBR, ...Pt(6)]);
          const sq = SQ_TR[f]; if (sq) { segsG.push([sq[0] + sq[2], sq[1], ...Pt(5)]); dashSeg(wTR[0], wTR[1], sq[0] + sq[2], sq[1], true); } else segsG.push([...wTR, ...Pt(5)]);
          for (const sg of segsG) dashSeg(sg[0], sg[1], sg[2], sg[3]);
          for (const i of f >= 411 ? [4, 5, 6, 0, 1, 2, 3] : [4, 5, 6]) { const p = Pt(i); marker(p[0], p[1]); }
        }
        const lp = f >= 428 && f <= 459 ? LP[f] : undefined, tq = f >= 434 && f <= 459 ? TRQ[f] : undefined;
        if (lp) {
          const [x0, t0, x1, t1, lh] = lp; const k = (t1 - t0) / Math.max(1, x1 - x0);
          const lpe = g(".lp"); if (lpe) { st(lpe, "width", `${x1 - x0}px`); st(lpe, "height", `${lh}px`); st(lpe, "transform", `matrix(1, ${k.toFixed(4)}, 0, 1, ${x0}, ${t0})`); }
          op(".lp", 1); tf(".lph", `scale(${((x1 - x0) / 282).toFixed(4)}, ${(lh / 293).toFixed(4)})`); op(".lph", f < 440 ? 0.3 : 0);
        } else op(".lp", 0);
        if (tq) {
          const tqe = g(".trq"); if (tqe) { st(tqe, "width", `${tq[2]}px`); st(tqe, "height", `${tq[3]}px`); st(tqe, "transform", `translate(${tq[0]}px, ${tq[1]}px)`); }
          op(".trq", 1); tf(".trqh", `scale(${(tq[2] / 282).toFixed(4)}, ${(tq[3] / 293).toFixed(4)})`);
        } else op(".trq", 0);
        if (wf) {
          const [FL, FT, FR, FB, Dx, Dy] = wf; const hgt = FB - FT, X = FR - hgt;
          const ap = FLAPA[f] ? [FLAPA[f][0] + 2, FLAPA[f][1] - 3] : [X + 0.93 * Dx, FT + 0.93 * Dy];
          const kf = (ap[1] - FT) / Math.max(1, ap[0] - X), fw = Math.max(1, ap[0] - X);
          const fe = g(".flap"); if (fe) { st(fe, "width", `${fw}px`); st(fe, "height", `${hgt}px`); st(fe, "transform", `matrix(1, ${kf.toFixed(4)}, 0, 1, ${X}, ${FT})`); }
          op(".flap", 1);
          { const e = owr[0] - X, f0 = owr[1] - FT - kf * e; tf(".flapg", `matrix(1, ${(-kf).toFixed(4)}, 0, 1, ${e.toFixed(1)}, ${f0.toFixed(1)})`); }
          {
            const fg = g(".flapgg"); if (fg) { setGridOps(fg, 26, 30, 23, 0, 0, 24, halfMap(f), 12, 1.0); const kids = fg.children;
              for (let i = 0; i < kids.length; i++) { const d = FT - (owr[1] + Math.floor(i / 26) * 23 + 11.5), m = 1 + 0.85 * Math.min(65, Math.max(0, 100 - d)) / 65; const k = kids[i] as HTMLElement; const b = parseFloat(k.style.opacity) || 0; k.style.opacity = String(Math.round(Math.min(1, b * m) * 100) / 100); } } }
          const q = 0.46, sx = FL + q * Dx, sy = FT + q * Dy, BL2 = FL + Dx, BT = FT + Dy, BR2 = FR + Dx, BB = FB + Dy;
          const edges = [[FL, FT, FR, FT], [FL, FB, FR, FB], [FL, FT, FL, FB], [FR, FT, FR, FB],
            [BL2, BT, BR2, BT], [BL2, BB, BR2, BB], [BL2, BT, BL2, BB], [BR2, BT, BR2, BB],
            [FL, FT, BL2, BT], [FL, FB, BL2, BB], [FR, FT, BR2, BT], [FR, FB, BR2, BB],
            [sx, sy, sx + FR - FL, sy], [sx, sy + hgt, sx + FR - FL, sy + hgt], [sx, sy, sx, sy + hgt], [sx + FR - FL, sy, sx + FR - FL, sy + hgt]];
          const inLP = (x: number, y: number) => { if (!lp) return false; if (x < lp[0] - 1 || x > lp[2] + 1) return false; const ty = lp[1] + ((lp[3] - lp[1]) / Math.max(1, lp[2] - lp[0])) * (x - lp[0]); return y >= ty - 1.5 && y <= ty + lp[4] + 1.5; };
          const inTQ = (x: number, y: number) => !!tq && x >= tq[0] - 1 && x <= tq[0] + tq[2] + 1 && y >= tq[1] - 1 && y <= tq[1] + tq[3] + 1;
          for (const e of edges) dashSeg(e[0], e[1], e[2], e[3]);
          for (const e of edges) dashSeg(e[0], e[1], e[2], e[3], true, 1, (x, y) => inLP(x, y) || inTQ(x, y));
          const ms = wp(f, MSZ);
          marker(FL, FT, ms); marker(FL, FB, ms); marker(BL2, BT, ms); marker(BR2, BT, ms); marker(BR2, BB, ms); marker(BL2, BB, ms);
        } else op(".flap", 0);
        if (cbk) {
          const fx = cbk[0], fy = cbk[1], s = cbk[2], dx = cbk[3], dy = cbk[4], ady = -dy, bx = fx + dx, by = fy + dy;
          const fo = f >= 460 ? 1 : 0;
          const cf = g(".cf"), ct = g(".ct"), cr = g(".cr"), ctg = g(".ctg");
          if (cf) {
            st(cf, "width", `${s}px`); st(cf, "height", `${s}px`); st(cf, "transform", `translate(${fx}px, ${fy}px)`);
            const th = wp(f, [[463, 121.5], [467, 118.5], [469, 115.5], [471, 112.5]]);
            const tfl = wp(f, [[459, 0], [463, -8], [465, -5], [467, -1], [469, 15], [471, 30], [473, 37]]), pw = wp(f, [[459, 45], [463, 71], [465, 90], [467, 98], [469, 108], [471, 120], [473, 123], [477, 125]]);
            const m0 = wp(f, [[460, 0], [461, 0.35], [463, 0.5], [467, 1]]), dk = wp(f, [[467, 0], [471, 1]]);
            const c0 = [236 + dk, 85 - 26 * dk, 5 - dk].map((v) => 255 + (v - 255) * m0);
            const rgb = (c: number[]) => `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;
            const at = (pct: number) => rgb(c0.map((v) => v + (255 - v) * Math.min(1, Math.max(0, (pct - tfl) / Math.max(1, pw - tfl)))));
            const stops = [`${at(0)} 0%`];
            if (tfl > 0 && tfl < 100) stops.push(`${rgb(c0)} ${tfl.toFixed(1)}%`);
            if (pw > 0 && pw < 100) stops.push(`rgb(255,255,255) ${pw.toFixed(1)}%`);
            stops.push(`${at(100)} 100%`);
            st(cf, "background", `linear-gradient(${th.toFixed(1)}deg, ${stops.join(", ")})`);
          }
          op(".cf", f >= 458 ? 1 : 0);
          if (cr) { st(cr, "width", `${dx}px`); st(cr, "height", `${s}px`); st(cr, "transform", `matrix(1, ${(dy / dx).toFixed(4)}, 0, 1, ${fx + s}, ${fy})`);
            const lps = wp(f, [[465, 62], [467, 72], [469, 85]]), lpa = wp(f, [[465, 0.44], [467, 0.34], [469, 0.21]]);
            const lc = [237 + (255 - 237) * lpa, 59 + (255 - 59) * lpa, 4 + (255 - 4) * lpa].map(Math.round);
            st(cr, "background", `linear-gradient(165deg, rgb(237,59,4) 0%, rgb(237,59,4) ${lps}%, rgb(${lc[0]},${lc[1]},${lc[2]}) 100%)`); }
          op(".cr", fo);
          if (ct) { st(ct, "width", `${s}px`); st(ct, "height", `${ady}px`); st(ct, "transform", `matrix(1, 0, ${(-dx / ady).toFixed(4)}, 1, ${bx}, ${by})`); }
          if (ctg) {
            const R = wp(f, [[467, 140], [471, 150]]), cc = -dx / ady, gcx = sk[0] + 20, gcy = sk[1] - 24, f0 = gcy - R - by, e = gcx - R - bx - cc * f0;
            st(ctg, "width", `${2 * R}px`); st(ctg, "height", `${2 * R}px`); st(ctg, "transform", `matrix(1, 0, ${(-cc).toFixed(4)}, 1, ${e.toFixed(1)}, ${f0.toFixed(1)})`);
            st(ctg, "background", `radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,255,255,0.936) 0%, rgba(255,255,255,0.936) 24%, rgba(255,255,255,0.898) 29%, rgba(255,255,255,0.802) 35%, rgba(255,255,255,0.735) 40%, rgba(255,255,255,0.649) 45%, rgba(255,255,255,0.544) 51%, rgba(255,255,255,0.43) 56%, rgba(255,255,255,0.315) 61%, rgba(255,255,255,0.239) 67%, rgba(255,255,255,0.162) 72%, rgba(255,255,255,0.105) 77%, rgba(255,255,255,0.067) 83%, rgba(255,255,255,0.029) 88%, rgba(255,255,255,0) 100%)`);
          }
          op(".ct", fo);
          if (f >= 460) {
            dashSeg(fx, fy, fx, fy + s, true); dashSeg(fx, fy, bx, by, true); dashSeg(bx, by, bx + s, by, true); dashSeg(bx + s, by, bx + s, by + s, true);
            dashSeg(bx + s, by + s, fx + s, fy + s, true); dashSeg(fx, fy, fx + s, fy, true); dashSeg(fx + s, fy, bx + s, by, true); if (f >= 469) dashSeg(fx, fy + s, fx + s, fy + s, true);
            const q = 0.46, sx = fx + q * dx, sy = fy + q * dy; dashSeg(sx, sy, sx + s, sy, true, 0.6); dashSeg(sx + s, sy, sx + s, sy + s, true, 0.6); dashSeg(bx + 8, by, bx + 8, fy, true, 0.6);
            const ms = wp(f, MSZ); marker(fx, fy, ms); marker(fx, fy + s, ms); marker(bx, by, ms); marker(bx + s, by, ms); marker(bx + s, by + s, ms);
          }
        } else { op(".cf", 0); op(".ct", 0); op(".cr", 0); }
        wireFinish();
        const cells = WALLS[Math.min(480, Math.max(466, f))] ?? [];
        for (let i = 0; i < WALL_POOL; i++) {
          const c = cells[i]; const el = g(`.wc${i}`);
          if (!c || !el) { op(`.wc${i}`, 0); continue; }
          tr(`.wc${i}`, c[0], c[1], c[2], c[3]); st(el, "background", `rgb(${c[4]},${c[4]},${c[4]})`); op(`.wc${i}`, 1);
        }
      };

      const cleanup = inst.addFrameTask((info) => {
        const f = FOLD_WALLS_START + Math.round((info.ownCurrentTimeMs / 1000) * FPS);
        renderE(f);
      });
      return () => { if (cleanup) cleanup(); };
    };
  }, []);

  return (
    <Timegroup ref={rootRef as any} mode="fixed" duration={`${FOLD_WALLS_MS}ms`} fps={24} style={{ position: "relative", width: W, height: H, overflow: "hidden" }}>
      <div className="sc5" style={{ position: "absolute", left: 0, top: 0, width: W, height: H, background: "#F8F8F8", opacity: 1 }}>
        <Grid c="g5" color="#E6E6E6" cells={3} cellColor="#F4F4F4" t={1.5} />
        {Array.from({ length: DASH_POOL }).map((_, i) => <Box key={"dg" + i} c={`dg${i}`} w={12} h={2} bg="#E8E8E8" o={0} s={{ transformOrigin: "0 1px" }} />)}
        <div className="trq" style={{ position: "absolute", left: 0, top: 0, width: 282, height: 293, opacity: 0, overflow: "hidden", transformOrigin: "0 0" }}>
          <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, background: "#EE3D07", filter: "blur(1.7px)" }} />
          <GlyphGrid c="trqh" cols={10} rows={13} dx={30} dy={23} size={28} color="#FFFFFF" seed={9} opf={(r, c) => ((r * 7 + c * 13) % 18 === 0 ? 0.11 : 0)} font={CN} bold stagger />
        </div>
        {[["sqTR", sqBlobTR, 9]].map(([c, fn, sd]) => (
          <div key={c as string} className={c as string} style={{ position: "absolute", left: 0, top: 0, width: 282, height: 293, opacity: 0, overflow: "hidden", transformOrigin: "0 0" }}>
            <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, background: "#EE3D07", filter: "blur(1.7px)" }} />
            <GlyphGrid c={`${c}h`} cols={10} rows={13} dx={30} dy={23} size={28} color="#FFFFFF" seed={sd as number} opf={fn as (r: number, c: number) => number} font={CN} bold stagger />
          </div>
        ))}
        <RR c="wr" r={20} bg="#FFFFFF" o={0} />
        <div className="flap" style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, background: "#FFFFFF", opacity: 0, overflow: "hidden", transformOrigin: "0 0", filter: "blur(1.0px)" }}>
          <div className="flapg" style={{ position: "absolute", left: 0, top: 0, width: 780, height: 414, transformOrigin: "0 0" }}>
            <GlyphGrid c="flapgg" cols={26} rows={18} dx={30} dy={23} size={28} color="#D8D8D8" seed={1} font={CN} sx={1.9} stagger />
          </div>
        </div>
        <div className="hclip" style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, overflow: "hidden", borderRadius: 20, opacity: 0, transformOrigin: "0 0", filter: "blur(1px)" }}>
          <div className="half" style={{ position: "absolute", left: 0, top: 0, width: 766, height: 385, opacity: 0, transformOrigin: "0 0" }}>
            <GlyphGrid c="halfg" cols={26} rows={18} dx={30} dy={23} size={28} color="#BABABA" seed={1} font={CN} sx={1.9} stagger />
          </div>
          <div className="hwipe" style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, opacity: 0, transformOrigin: "0 0" }} />
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`cp${i}`} style={{ position: "absolute", left: 0, top: 0, width: 12, height: 12, opacity: 0 }}>
            <div style={{ position: "absolute", left: 5, top: 0, width: 2, height: 12, background: "#CFCFCF" }} /><div style={{ position: "absolute", left: 0, top: 5, width: 12, height: 2, background: "#CFCFCF" }} />
          </div>
        ))}
        <div className="sqBL" style={{ position: "absolute", left: 0, top: 0, width: 282, height: 293, opacity: 0, overflow: "hidden", transformOrigin: "0 0" }}>
          <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, background: "#EE3D07", filter: "blur(1.7px)" }} />
          <GlyphGrid c="sqBLh" cols={10} rows={13} dx={30} dy={23} size={28} color="#FFFFFF" seed={5} opf={sqBlobBL} font={CN} bold stagger />
        </div>
        <div className="lp" style={{ position: "absolute", left: 0, top: 0, width: 282, height: 293, opacity: 0, overflow: "hidden", transformOrigin: "0 0" }}>
          <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, background: "#EE3D07", filter: "blur(1.7px)" }} />
          <GlyphGrid c="lph" cols={10} rows={13} dx={30} dy={23} size={28} color="#FFFFFF" seed={5} opf={sqBlob(2.5, 10, 9)} font={CN} bold stagger />
        </div>
        <div className="cf" style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, background: "#FFFFFF", opacity: 0, transformOrigin: "0 0", filter: "blur(1.4px)" }} />
        <div className="cr" style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, background: "#EE3D07", opacity: 0, transformOrigin: "0 0", filter: "blur(1.4px)" }} />
        <div className="ct" style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, background: "#EE3D07", opacity: 0, overflow: "hidden", transformOrigin: "0 0", filter: "blur(1.4px)" }}>
          <div className="ctg" style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, transformOrigin: "0 0" }} />
        </div>
        {Array.from({ length: WD_POOL }).map((_, i) => <Box key={"dw" + i} c={`dw${i}`} w={12} h={2.5} bg="rgba(221,221,221,0.68)" o={0} s={{ transformOrigin: "0 1px", filter: "blur(0.8px)" }} />)}
        {Array.from({ length: MK_POOL }).map((_, i) => <Box key={"mk" + i} c={`mk${i}`} w={13} h={13} bg="rgba(221,221,221,0.68)" o={0} s={{ filter: "blur(0.8px)" }} />)}
        <Sparkle c="wsp0" s={30} color="#E5E5E5" tc="rgba(229,229,229,0)" pad={WPAD} blur={0.6} soft={softPx(30, undefined, 3)} />
        <Sparkle c="wsp1" s={48} color="#E5E5E5" tc="rgba(229,229,229,0)" pad={WPAD} blur={0.6} soft={softPx(48, undefined, 3)} />
        <Sparkle c="wsp2" s={40} color="#E5E5E5" tc="rgba(229,229,229,0)" pad={WPAD} blur={0.6} soft={softPx(40, undefined, 3)} />
        <Box c="halo" w={168} h={168} r={84} o={0} s={{ border: "2px solid #E4E4E4", boxSizing: "border-box" }} />
        <Star2 c="spark" />
        {Array.from({ length: WALL_POOL }).map((_, i) => <Box key={i} c={`wc${i}`} o={0} />)}
      </div>
    </Timegroup>
  );
};
