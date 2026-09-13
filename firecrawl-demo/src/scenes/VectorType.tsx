import React, { useEffect, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { S1, S1_POOL } from "../s1vec";
import { S1W, S1W_POOL } from "../s1white";
import type { TgEl } from "../lib/anim";
import { clamp01, wp, pop, gry, easeOutCubic } from "../lib/anim";
import { W, H, FPS, OR1, TRI_BG, VECTOR_TYPE_MS, VECTOR_TYPE_START } from "../constants";
import { Box } from "../components/Presentational";

const OSQ: Record<number, number[]> = { 24: [886, 200, 148, 147], 25: [890, 204, 140, 140], 26: [902, 214, 116, 118], 27: [904, 217, 112, 113], 28: [900, 214, 120, 119], 29: [894, 208, 132, 131], 30: [888, 203, 144, 143], 31: [886, 202, 148, 147], 32: [887, 208, 146, 145], 33: [888, 226, 144, 137], 34: [892, 258, 136, 110], 35: [893, 285, 134, 80], 36: [891, 278, 138, 72], 37: [888, 268, 144, 68], 38: [887, 261, 146, 66], 39: [886, 256, 148, 64], 40: [886, 252, 148, 63], 41: [886, 248, 148, 64], 42: [886, 246, 148, 64], 43: [888, 246, 145, 62], 44: [890, 248, 140, 59], 45: [898, 251, 124, 53], 46: [915, 258, 90, 39], 47: [923, 262, 74, 31], 48: [925, 263, 69, 29], 49: [926, 263, 68, 29] };
const DSQ: Record<number, number[]> = { 25: [928, 768, 64, 64], 26: [916, 756, 88, 88], 27: [905, 745, 110, 110], 28: [895, 735, 130, 130], 29: [888, 728, 144, 144], 30: [885, 724, 150, 150], 31: [886, 723, 148, 149], 32: [886, 720, 147, 146], 33: [888, 711, 144, 138], 34: [891, 650, 138, 112], 35: [892, 575, 135, 83], 36: [890, 541, 140, 76], 37: [888, 519, 144, 73], 38: [887, 505, 146, 70], 39: [886, 495, 148, 69], 40: [885, 489, 149, 68], 41: [885, 485, 150, 68], 42: [885, 484, 150, 68], 43: [885, 483, 150, 68] };
const ODOT: Record<number, number[]> = { 29: [854, 1046, 166, 20], 30: [844, 1058, 156, 19], 31: [840, 1062, 153, 18], 32: [840, 1062, 160, 18], 33: [841, 1060, 184, 19], 34: [848, 1056, 238, 17], 35: [849, 1054, 314, 17], 36: [846, 1058, 326, 18] };
const KDOT: Record<number, number[]> = { 24: [946, 954, 790, 20], 26: [869, 1032, 873, 20], 27: [850, 1051, 892, 20], 28: [842, 1060, 900, 19], 29: [838, 1063, 904, 20], 30: [837, 1064, 904, 20], 31: [838, 1063, 902, 19], 32: [839, 1062, 897, 19], 33: [841, 1060, 882, 19], 34: [847, 1055, 807, 18], 35: [849, 1053, 719, 18], 36: [845, 1057, 686, 18], 37: [841, 1060, 667, 19], 38: [839, 1061, 654, 19], 39: [838, 1062, 645, 19], 40: [837, 1062, 640, 19], 41: [836, 1063, 636, 20], 42: [836, 1063, 635, 20], 43: [836, 1063, 634, 20] };

export const VectorType = () => {
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

      const groupY = (f: number) => wp(f, [[25, 768], [27, 745], [29, 728], [31, 726], [35, 726], [37, 520], [41, 483], [53, 483], [55, 419], [57, 393], [59, 383], [61, 380], [63, 378], [65, 368], [67, 343], [69, 259]]);

      const renderA = (f: number) => {
        const on = f <= 69;
        op(".sc1", on ? 1 : 0);
        if (!on) return;
        const gy = groupY(f);
        { const d1 = S1[f] ?? S1[1];
          st(g(".s1bg"), "background", gry(d1.bg));
          for (let i = 0; i < S1_POOL.b; i++) { const b = d1.b[i], c = `.s1b${i}`, el = g(c); if (!el) continue; if (!b) { op(c, 0); continue; }
            st(el, "width", `${b[2]}px`); st(el, "height", `${b[3]}px`); st(el, "background", gry(b[5])); st(el, "transform", `translate(${b[0] - b[2] / 2}px, ${b[1] - b[3] / 2}px) rotate(${b[4]}deg)`); op(c, 1); }
          const wpc = S1W[f] ?? [];
          for (let i = 0; i < S1W_POOL; i++) { const q2 = wpc[i], c = `.s1w${i}`, el = g(c); if (!el) continue; if (!q2) { op(c, 0); continue; }
            const n = (j: number) => q2[j] as number;
            if (q2[0] === "p") { st(el, "width", `${n(3)}px`); st(el, "height", `${n(4)}px`); st(el, "background", "#FFFFFF"); st(el, "transform", `matrix(1, ${n(5)}, 0, 1, ${n(1)}, ${n(2)})`); }
            else { const ax = n(1), ay = n(2); st(el, "width", "100px"); st(el, "height", "100px"); st(el, "background", TRI_BG); st(el, "transform", `matrix(${(n(3) - ax) / 100}, ${(n(4) - ay) / 100}, ${(n(5) - ax) / 100}, ${(n(6) - ay) / 100}, ${ax}, ${ay})`); }
            op(c, 1); }
          for (let i = 0; i < S1_POOL.l; i++) { const l = d1.l[i], c = `.s1l${i}`, el = g(c); if (!el) continue; if (!l) { op(c, 0); continue; }
            const len = Math.hypot(l[2] - l[0], l[3] - l[1]), ang = Math.atan2(l[3] - l[1], l[2] - l[0]);
            st(el, "width", `${Math.max(1, Math.round(len) + 1)}px`); st(el, "background", gry(d1.lv)); st(el, "transform", `translate(${l[0] + 0.75 * Math.sin(ang)}px, ${l[1] - 0.75 * Math.cos(ang)}px) rotate(${ang}rad)`); op(c, 1); }
          for (let i = 0; i < S1_POOL.r; i++) { const r = d1.r[i], c = `.s1r${i}`, el = g(c); if (!el) continue; if (!r) { op(c, 0); continue; }
            st(el, "width", `${r[2]}px`); st(el, "height", `${r[3]}px`); st(el, "background", gry(r[4])); st(el, "transform", `translate(${r[0]}px, ${r[1]}px)`); op(c, 1); }
        }
        let ox = 886, oy = 200, ow = 148, oh = 148;
        if (f < 25) {
          oy = wp(f, [[1, 412], [7, 285], [13, 284], [19, 200]], easeOutCubic);
        } else if (f < 50) {
          [ox, oy, ow, oh] = OSQ[f];
        } else {
          [ox, oy, ow, oh] = [926, 263, 68, 29];
          if (f >= 53) oy += gy - 483;
        }
        tr(".osq", ox, oy, ow, oh);
        st(g(".osq"), "background", f >= 49 ? "#363636" : OR1);
        op(".osq", f >= 61 ? 0 : 1);
        if (f >= 25) {
          const dq = DSQ[f];
          if (dq) tr(".dsq", dq[0], dq[1], dq[2], dq[3]); else tr(".dsq", 885, gy, 150, 68);
          op(".dsq", 1);
        } else op(".dsq", 0);
        const od = ODOT[f];
        op(".odot0", od ? 1 : 0); op(".odot1", od ? 1 : 0);
        if (od) { tr(".odot0", od[0] - 854, od[2] - 166, od[3] / 20); tr(".odot1", od[1] - 1046, od[2] - 166, od[3] / 20); }
        const kd = KDOT[f];
        op(".ddot0", kd || f >= 44 ? 1 : 0); op(".ddot1", kd || f >= 44 ? 1 : 0);
        if (kd) { tr(".ddot0", kd[0], kd[2], kd[3] / 20); tr(".ddot1", kd[1], kd[2], kd[3] / 20); }
        else if (f >= 44) { const dy = gy - 483 + 634; tr(".ddot0", 836, dy); tr(".ddot1", 1063, dy); }
        const gd = gy - 483;
        const c1 = f >= 49 ? 1 : 0; tr(".cas0", 924, wp(f, [[49, 944], [53, 926]]) + gd); op(".cas0", c1 * pop(f, 49, 2));
        tr(".cas1", 1000, 856 + gd); op(".cas1", f >= 53 ? pop(f, 53, 2) : 0);
        tr(".cas2", 848, 716 + gd); op(".cas2", f >= 55 ? pop(f, 55, 2) : 0);
        tr(".tiny", 952, 240 + gd); op(".tiny", f >= 63 ? pop(f, 63, 2) : 0);
      };

      const cleanup = inst.addFrameTask((info) => {
        const f = VECTOR_TYPE_START + Math.round((info.ownCurrentTimeMs / 1000) * FPS);
        renderA(f);
      });
      return () => { if (cleanup) cleanup(); };
    };
  }, []);

  return (
    <Timegroup ref={rootRef as any} mode="fixed" duration={`${VECTOR_TYPE_MS}ms`} fps={24} style={{ position: "relative", width: W, height: H, overflow: "hidden" }}>
      <div className="sc1" style={{ position: "absolute", left: 0, top: 0, width: W, height: H, background: "#FFFFFF", opacity: 1 }}>
        <Box c="s1bg" w={W} h={H} bg="#FFFFFF" />
        {Array.from({ length: S1_POOL.b }).map((_, i) => <Box key={"b" + i} c={`s1b${i}`} o={0} s={{ transformOrigin: "50% 50%" }} />)}
        {Array.from({ length: S1W_POOL }).map((_, i) => <Box key={"w" + i} c={`s1w${i}`} o={0} />)}
        {Array.from({ length: S1_POOL.l }).map((_, i) => <Box key={"l" + i} c={`s1l${i}`} h={1.5} o={0} />)}
        {Array.from({ length: S1_POOL.r }).map((_, i) => <Box key={"r" + i} c={`s1r${i}`} o={0} />)}
        <Box c="dsq" bg="#363636" o={0} />
        <Box c="osq" bg={OR1} />
        <Box c="odot0" x={854} y={166} w={20} h={20} bg={OR1} o={0} /><Box c="odot1" x={1046} y={166} w={20} h={20} bg={OR1} o={0} />
        <Box c="ddot0" w={20} h={20} bg="#262626" o={0} /><Box c="ddot1" w={20} h={20} bg="#262626" o={0} />
        <Box c="cas0" w={73} h={66} bg={OR1} o={0} /><Box c="cas1" w={73} h={66} bg={OR1} o={0} /><Box c="cas2" w={73} h={66} bg={OR1} o={0} />
        <Box c="tiny" w={16} h={16} bg={OR1} o={0} />
      </div>
    </Timegroup>
  );
};
