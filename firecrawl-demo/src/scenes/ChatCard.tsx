import React, { useEffect, useRef } from "react";
import { Timegroup } from "@editframe/react";
import type { TgEl } from "../lib/anim";
import { clamp01, wp, wpn, seg, easeOutCubic } from "../lib/anim";
import { W, H, FPS, FONT, RESP_LINES, CHAT_CARD_MS, CHAT_CARD_START } from "../constants";
import { Box, Txt, Grid, Img, RR } from "../components/Presentational";
import { toneCol } from "../lib/anim";

const P_TEXT: Record<string, string[]> = {
  BUG: ["+That's +a +known *bug *in *firmware 4.2.1. It *resets", "*the +HDMI-CEC +handshake on certain LG and", "Samsung *panels. +Hold +Bluetooth +and", "+volume-down *for *eight *seconds *until *the *LED", "*flashes *amber *twice."],
  SET: ["+Then *in *your *TV *settings, +toggle CEC off, wait ten", "seconds, *toggle *it *back *on.", "", "+If *that *doesn't *do *it, +we *shipped *a *hotfix *last", "*night, +4.2.2, +and +I +can *walk *you *through *it."],
  DROP: ["That's a known *issue *with *firmware +4.2.1. +It *drops", "the HDMI-CEC +handshake +on +certain +LG +and", "Samsung TVs.", "Hold Bluetooth +and +volume-down *on *the *back *for", "+eight +seconds +until +the +LED +flashes +amber +twice."],
  SWITCH: ["+Then *switch +CEC +off *in *your *TV *settings, wait ten", "seconds, *switch *it *back *on.", "", "+If +it +doesn't +reconnect, we *pushed *a *hotfix", "+overnight, 4.2.2, and I can *guide *you *through *it"],
  EXT: ["+Then *on *your *TV, +toggle CEC off under External", "*Device *Manager, wait ten seconds, +toggle +it +back +on.", "", "*If *that *doesn't *work, we +released +a +patch +last", "*night, 4.2.2, and I can +walk +you +through +it."],
  RES: ["+That's +a +known *issue *with *firmware 4.2.1. It resets", "the HDMI-CEC +handshake on certain LG and", "*Samsung *panels. +Hold +the +Bluetooth +and", "+volume-down *buttons *together for eight seconds", "+until +the +LED +flashes +amber +twice."],
};
const PANELS: { x: number; y: number; w: number; t: string; dy: number; side: boolean; s: number; k: number }[] = [
  { x: -27, y: -51, w: 587, t: "BUG", dy: -55, side: true, s: 123, k: 0.56 }, { x: -27, y: 185, w: 587, t: "SET", dy: 10, side: true, s: 121, k: 0.9 }, { x: -27, y: 429, w: 587, t: "DROP", dy: 0, side: true, s: 117, k: 0.98 }, { x: -27, y: 671, w: 587, t: "SWITCH", dy: -16, side: true, s: 119, k: 0.875 }, { x: -27, y: 913, w: 587, t: "RES", dy: 29, side: true, s: 123, k: 0.57 },
  { x: 628, y: -41, w: 668, t: "EXT", dy: -55, side: false, s: 121, k: 0.79 }, { x: 628, y: 178, w: 668, t: "BUG", dy: 10, side: false, s: 117, k: 0.95 }, { x: 628, y: 683, w: 668, t: "SET", dy: -16, side: false, s: 116, k: 1.05 }, { x: 628, y: 934, w: 668, t: "DROP", dy: 29, side: false, s: 119, k: 0.77 },
  { x: 1362, y: -51, w: 587, t: "SWITCH", dy: -55, side: true, s: 123, k: 0.68 }, { x: 1362, y: 184, w: 587, t: "RES", dy: 10, side: true, s: 122, k: 0.74 }, { x: 1362, y: 430, w: 587, t: "EXT", dy: 0, side: true, s: 117, k: 1.14 }, { x: 1362, y: 676, w: 587, t: "BUG", dy: -16, side: true, s: 122, k: 0.79 }, { x: 1362, y: 913, w: 587, t: "SET", dy: 29, side: true, s: 123, k: 0.64 },
];
const PZS = [[120, 0.93], [126, 0.955], [130, 0.975], [134, 0.987], [138, 0.996], [142, 1.002], [146, 1.005], [150, 1.009], [154, 1.01], [158, 1.013]];
const PTY = [[130, 0], [134, 9], [138, 14], [142, 17], [146, 19], [150, 20], [154, 19], [159, 16]];
const PO7 = [[116, 0], [118, 0.26], [120, 0.56], [122, 0.87], [124, 0.92], [126, 0.97], [130, 1]];
const PO = [[0, 0], [1, 0.19], [3, 0.37], [5, 0.5], [7, 0.63], [9, 0.73], [11, 0.79], [13, 0.85], [17, 0.91], [23, 0.96], [29, 0.99], [33, 1]];

export const ChatCard = () => {
  const rootRef = useRef<TgEl>(null);
  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;
    tg.initializer = (inst) => {
      const q = <T extends HTMLElement>(sel: string) => inst.querySelector(sel) as T | null;
      const qa = (sel: string) => Array.from(inst.querySelectorAll<HTMLElement>(sel));
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

      const mctx = document.createElement("canvas").getContext("2d");
      const measure = (t: string, font: string) => { if (!mctx) return 0; mctx.font = font; return mctx.measureText(t).width; };
      try { const fs = (document as any).fonts; if (fs && fs.load) { fs.load(`25px ${FONT}`); fs.load(`600 30px ${FONT}`); fs.load(`500 22px ${FONT}`); } } catch { /* fonts API unavailable */ }

      const layoutPanels = () => {
        const font = `25px ${FONT}`; const sp = measure(" ", font);
        qa(".vl").forEach((ln) => {
          const wds = Array.from(ln.children) as HTMLElement[];
          const lineW = Number(ln.dataset.w || 0), just = ln.dataset.j === "1";
          const ws = wds.map((w) => measure(w.textContent || "", font) - 0.625 * (w.textContent || "").length);
          const total = ws.reduce((a, b) => a + b, 0);
          const gap = just && wds.length > 1 ? (lineW - total) / (wds.length - 1) : sp * 1.45;
          let x = 0; wds.forEach((w, i) => { st(w, "left", `${x}px`); x += ws[i] + gap; });
        });
      };
      const fixLeafWidths = () => {
        qa("div").forEach((el) => {
          if (el.children.length > 0) return;
          const t = el.textContent || ""; if (!t.trim()) return;
          const cs = getComputedStyle(el); if (cs.whiteSpace !== "nowrap") return;
          const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
          const ls = parseFloat(cs.letterSpacing) || 0;
          const w = measure(t, font) + ls * t.length;
          st(el, "width", `${Math.ceil(w) + 2}px`);
        });
      };

      const setGridPos = (c: string, xs: number[], ys: number[]) => {
        for (let i = 0; i < 27; i++) tr(`.${c}-v${i}`, (i < xs.length ? xs[i] : -100) - 0.5, 0);
        for (let i = 0; i < 20; i++) tr(`.${c}-h${i}`, 0, (i < ys.length ? ys[i] : -100) - 0.5);
      };

      const CARD = [[70, 324], [72, 354], [74, 430], [76, 458], [78, 476], [80, 486], [84, 494], [88, 505], [90, 540], [92, 548], [96, 568], [100, 586], [104, 602], [108, 614], [114, 626], [120, 652], [128, 668], [134, 707], [140, 724], [150, 736], [158, 730], [159, 724]];
      const BUB_Y = [[88, 309], [89, 305], [90, 278], [91, 263], [92, 255], [93, 248], [94, 243], [95, 239], [97, 237], [100, 236], [105, 232], [108, 230], [109, 228], [110, 224], [111, 216], [112, 204], [113, 177], [114, 126], [115, 73], [116, 50], [117, 39], [118, 37], [119, 34]];
      const LBL_Y = [[89, 414], [90, 387], [91, 372], [92, 364], [93, 357], [94, 352], [95, 348], [96, 347], [97, 346], [100, 345], [105, 341], [108, 339], [109, 337], [110, 333], [111, 326], [112, 314], [113, 289], [114, 235], [115, 191], [116, 173], [117, 164], [118, 161], [119, 160]];
      const RB = [[111, 19, 366, 370, 44, 130], [112, 19, 351, 576, 44, 92], [113, 20, 328, 688, 93, 64], [114, 25, 273, 684, 157, 36], [115, 25, 229, 684, 219, 32], [116, 25, 213, 684, 218, 32], [117, 25, 204, 684, 218, 32], [118, 25, 200, 684, 219, 32], [119, 25, 199, 684, 220, 32]];
      const L1N = [[111, 19], [112, 25], [113, 31], [114, 41]];
      const L7N = [[114, 0], [115, 11], [116, 15], [117, 19], [118, 23], [119, 26]];
      const H2 = [[70, 277.5], [72, 273.5], [74, 256.5], [75, 243.5], [76, 230], [80, 185.5], [85, 150.5], [90, 128.5], [95, 112.5], [100, 100.75], [105, 92.5], [110, 86.5], [120, 79], [126, 77]];
      const P2 = [[70, 134], [72, 134.5], [74, 136.5], [75, 137.7], [76, 138.8], [80, 143.3], [85, 147], [90, 149], [95, 150.5], [100, 151.8], [105, 152.7], [110, 153], [120, 154], [126, 154]];
      const HR2 = [[70, 138], [71, 129.25], [72, 125], [73, 121.5], [74, 118.5], [75, 116], [76, 113.75], [77, 111.5], [78, 109.5], [79, 108], [80, 106.75], [85, 100], [90, 94.5], [95, 91], [100, 87.5], [105, 85], [110, 83], [120, 80.25], [128, 78]];
      const PR2 = [[70, 136], [71, 138.5], [72, 140.3], [73, 141.5], [74, 142.4], [75, 143], [76, 144], [77, 144.5], [78, 145.25], [79, 145.5], [80, 146], [85, 148.5], [90, 150], [95, 151.5], [100, 152.75], [105, 153.5], [110, 154], [120, 154.5], [128, 155.5]];
      const QR2 = [[70, 117], [72, 116.5], [80, 130], [100, 150], [128, 155.5]];
      const CY2 = [[70, 833.5], [71, 747.75], [72, 675.5], [73, 632], [74, 604], [75, 584], [76, 569.25], [77, 558.5], [78, 551], [79, 545.5], [80, 541.75], [82, 540.3], [85, 539.5]];

      let prepared = false;
      const renderB = (f: number) => {
        const on = f >= 70 && f <= 159;
        op(".sc2", on ? 1 : 0);
        if (!on) return;
        if (!prepared) { prepared = true; fixLeafWidths(); }
        layoutPanels(); fixLeafWidths();
        const h2 = wp(f, H2), p2 = wp(f, P2), q2 = Math.max(0, (848 - h2 - 3 * p2) / 2);
        const hr2 = wp(f, HR2), pr2 = wp(f, PR2), qr2 = wp(f, QR2), cy2 = wp(f, CY2);
        const dx2 = [h2, h2 + p2, h2 + 2 * p2, h2 + 3 * p2, h2 + 3 * p2 + q2, h2 + 3 * p2 + 2 * q2];
        const dy2 = [0, 1, 2, 3, 4].map((n) => hr2 + 3 * pr2 + n * qr2); dy2.unshift(hr2, hr2 + pr2, hr2 + 2 * pr2);
        setGridPos("g2", [...dx2.map((d) => 959.5 - d), ...dx2.map((d) => 959.5 + d)], [...dy2.map((d) => cy2 - d), ...dy2.map((d) => cy2 + d)]);
        op(".g2", 1);
        const cw = wp(f, CARD) * 1.005, s = cw / 736, ch = 551 * s;
        tf(".cc", `translate(${960 - cw / 2}px, ${540 - ch / 2}px) scale(${s})`);
        tf(".cch", `translate(${960 - cw / 2}px, ${540 - ch / 2}px) scale(${s})`);
        const yb = wp(f, BUB_Y), yl = wp(f, LBL_Y);
        tr(".bub", 251, yb - 2); op(".bub", f >= 72 ? seg(f, 72, 75) : 0); tr(".bubr", 251, yb - 3); op(".bubr", f >= 72 ? seg(f, 72, 75) : 0);
        tr(".agent", 26, yl); op(".agent", f >= 89 ? 1 : 0);
        const pt = yl + 39, ph = Math.min(51, 431 - pt);
        const dots = f <= 94 ? 0 : f <= 96 ? 1 : f <= 98 ? 2 : 3;
        setRR("think", 22, pt - 1, 129 + 8 * dots, Math.max(0, ph + 2), 15); op(".think", f >= 90 && f <= 110 && ph > 2 ? 1 : 0);
        const tt = g(".think-t"); const ts = "Thinking" + ".".repeat(dots); if (tt && tt.textContent !== ts) tt.textContent = ts;
        const rbOn = f >= 111; const rbEl = g(".rb");
        op(".rb", rbOn ? 1 : 0);
        if (rbOn && rbEl) {
          const [rx, ry, rw, rh, rc] = wpn(f, RB);
          const grey = Math.round(rc);
          setRR("rb", rx, ry, rw, rh, f <= 112 ? 22 : 16);
          st(rbEl, "background", `rgb(${grey},${grey},${grey})`);
          st(rbEl, "borderColor", f >= 114 ? "#333333" : `rgb(${grey},${grey},${grey})`);
          const col = f <= 111 ? "#262626" : "#F2F2F2";
          const n1 = Math.round(wp(f, L1N)), n7 = Math.round(wp(f, L7N));
          const vis = f <= 112 ? 1 : f === 113 ? 3 : f === 114 ? 5 : 7;
          for (let i = 0; i < RESP_LINES.length; i++) {
            const el = g(`.rl${i}`); if (!el) continue;
            const full = RESP_LINES[i];
            const txt = i === 0 ? full.slice(0, n1) : i === 6 ? full.slice(0, n7) : full;
            if (el.textContent !== txt) el.textContent = txt;
            st(el, "color", col);
            tf(`.rl${i}`, `translate(40px, ${ry + (rh <= 44 ? 8 : 14) + 26.5 * i}px)`);
            op(`.rl${i}`, i < vis && txt.length > 0 ? 1 : 0);
          }
        } else for (let i = 0; i < RESP_LINES.length; i++) op(`.rl${i}`, 0);
        let b5o = 0;
        for (let i = 0; i < PANELS.length; i++) {
          const s0 = PANELS[i].s, po = i === 7 ? wp(f, PO7) : f < s0 ? 0 : wp(f - s0, PO), pe = easeOutCubic(seg(f, s0, s0 + 23));
          const fo = 1;
          const zs = wp(f, PZS), pph = 74 + 29 * P_TEXT[PANELS[i].t].length; tf(`.vp${i}`, `translate(${((PANELS[i].w / 2) * (1 - zs)).toFixed(2)}px, ${(PANELS[i].dy * (1 - pe) + (pph / 2) * (1 - zs) + wp(f, PTY)).toFixed(2)}px) scale(${zs.toFixed(4)})`); op(`.vp${i}`, po * fo); b5o = Math.max(b5o, po * fo);
        }
        op(".b5bg", b5o);
      };

      const cleanup = inst.addFrameTask((info) => {
        const f = CHAT_CARD_START + Math.round((info.ownCurrentTimeMs / 1000) * FPS);
        renderB(f);
      });
      return () => { if (cleanup) cleanup(); };
    };
  }, []);

  return (
    <Timegroup ref={rootRef as any} mode="fixed" duration={`${CHAT_CARD_MS}ms`} fps={24} style={{ position: "relative", width: W, height: H, overflow: "hidden" }}>
      <div className="sc2" style={{ position: "absolute", left: 0, top: 0, width: W, height: H, background: "#F9F9F9", opacity: 0 }}>
        <Box c="b5bg" w={W} h={H} bg="#F4F4F4" o={0} />
        <Grid c="g2" color="#E6E6E6" hcolor="#E9E9E9" />
        {PANELS.map((p, i) => {
          const lines = P_TEXT[p.t];
          return (
            <div key={i} className={`vp${i}`} style={{ position: "absolute", left: p.x, top: p.y, width: p.w, height: 74 + 29 * lines.length, opacity: 0, transformOrigin: "0 0" }}>
              {(["top", "bottom", "left", "right"] as const).map((d) => { const ph = 74 + 29 * lines.length, S = 20, R = 24; const bg = `linear-gradient(to ${d}, rgba(0,0,0,0.033) 0%, rgba(0,0,0,0.022) 20%, rgba(0,0,0,0.013) 40%, rgba(0,0,0,0.007) 60%, rgba(0,0,0,0.0037) 80%, rgba(0,0,0,0) 100%)`;
                const r = d === "top" ? { left: R, top: -S, width: p.w - 2 * R, height: S } : d === "bottom" ? { left: R, top: ph, width: p.w - 2 * R, height: S } : d === "left" ? { left: -S, top: R, width: S, height: ph - 2 * R } : { left: p.w, top: R, width: S, height: ph - 2 * R };
                return <div key={d} style={{ position: "absolute", ...r, background: bg }} />; })}
              <div style={{ position: "absolute", left: 0, top: 0, width: p.w, height: 74 + 29 * lines.length, background: "#E5E5E5", borderRadius: 24 }} />
              <div style={{ position: "absolute", left: 0, top: 0, width: p.w, height: 74 + 29 * lines.length, filter: p.side ? "blur(0.8px)" : "blur(0.9px)" }}>
              {lines.map((ln, li) => {
                if (!ln) return null;
                const last = li === lines.length - 1 || lines[li + 1] === "";
                return (
                  <div key={li} className="vl" data-w={p.w - 80} data-j={last || ln.endsWith("TVs.") || ln.endsWith("hotfix *last") ? "0" : "1"} style={{ position: "absolute", left: 40, top: 37 + 29 * li, width: p.w - 80, height: 29 }}>
                    {ln.split(" ").filter(Boolean).map((w, wi) => { const tone = w[0] === "*" ? 2 : w[0] === "+" ? 1 : 0; return <div key={wi} style={{ position: "absolute", left: 0, top: 0, height: 29, fontSize: 25, lineHeight: "29px", fontFamily: FONT, letterSpacing: "-0.025em", whiteSpace: "nowrap", color: toneCol(tone, p.k) }}>{tone ? w.slice(1) : w}</div>; })}
                  </div>
                );
              })}
              </div>
            </div>
          );
        })}
        <div className="cch" style={{ position: "absolute", left: 0, top: 0, width: 736, height: 551, transformOrigin: "0 0" }}>
          {[0.73, 0.375, 0.1, 0.02].map((a, i) => <div key={i} style={{ position: "absolute", left: -(i + 1), top: -(i + 1), width: 736 + 2 * (i + 1), height: 551 + 2 * (i + 1), borderRadius: 37 + i, background: `rgba(29,29,29,${a})` }} />)}
        </div>
        <div className="cc" style={{ position: "absolute", left: 0, top: 0, width: 736, height: 551, background: "#1D1D1D", borderRadius: 36, overflow: "hidden", transformOrigin: "0 0" }}>
          <Box c="bubr" w={459} h={88} bg="#626262" r={15} o={0} />
          <Box c="bub" w={459} h={88} bg="#383838" r={15} o={0}>
            <Txt x={16} y={13} size={22} color="#FFFFFF" lh={27} s={{ letterSpacing: "0.055em" }}>My Aria soundbar won't connect to my</Txt>
            <Txt x={16} y={40} size={22} color="#FFFFFF" lh={27} s={{ letterSpacing: "0.055em" }}>TV after the latest firmware update.</Txt>
          </Box>
          <Box c="agent" w={220} h={20} o={0}>
            <Box x={-6} y={-6} w={30} h={30} bg="#1D1D1D" r={15} />
            <Img c="agentlogo" src="/firecrawl-demo/src/assets/firecrawl-demo-logo.png" x={-2} y={-2} w={22} h={22} o={1} />
            <Txt x={29} y={-5} size={21} color="#DEDEDE" lh={27} s={{ letterSpacing: "0.055em" }}>AI Agent</Txt>
          </Box>
          <div className="think" style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, background: "#1D1D1D", border: "1px solid #343434", boxSizing: "border-box", borderRadius: 14, opacity: 0, overflow: "hidden", transformOrigin: "0 0" }}>
            <Txt c="think-t" x={17} y={13} size={20} color="#E4E4E4" lh={26} s={{ letterSpacing: "0.055em" }}>Thinking...</Txt>
          </div>
          <RR c="rb" r={12} bg="#202020" o={0} s={{ border: "1px solid #202020", boxSizing: "border-box" }} />
          {RESP_LINES.map((ln, i) => <Txt key={i} c={`rl${i}`} x={0} y={0} size={22} color="#F2F2F2" lh={27} o={0} s={{ letterSpacing: "0.06em" }}>{ln || " "}</Txt>)}
          <Box c="ib" x={22} y={455} w={686} h={75} bg="#393939" r={13} s={{ border: "1px solid #5A5A5A", boxSizing: "border-box" }} />
          <Txt x={41} y={472} size={27.5} color="#B4B4B4" lh={34} s={{ letterSpacing: "0.025em" }}>Ask anything...</Txt>
          <Box c="ibtn" x={645} y={465} w={55} h={55} bg="#1D1D1D" r={27.5} s={{ border: "1px solid #3A3A3A", boxSizing: "border-box" }}>
            <Box x={25} y={17} w={1} h={18} bg="#DDDDDD" />
            <Box x={25} y={17} w={1} h={12} bg="#CDCDCD" s={{ transformOrigin: "50% 0", transform: "rotate(45deg)" }} />
            <Box x={25} y={17} w={1} h={12} bg="#CDCDCD" s={{ transformOrigin: "50% 0", transform: "rotate(-45deg)" }} />
          </Box>
        </div>
      </div>
    </Timegroup>
  );
};
