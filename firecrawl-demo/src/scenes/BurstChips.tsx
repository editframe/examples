import React, { useEffect, useRef } from "react";
import { Timegroup } from "@editframe/react";
import type { TgEl, G } from "../lib/anim";
import { clamp01, seg, wp, wpn, easeOutCubic, gridX, gridY, gry, inR } from "../lib/anim";
import { W, H, FPS, FONT, OR, NV, NH, KMIN, JMIN, BURST_CHIPS_MS, BURST_CHIPS_START } from "../constants";
import { BURST, BURST_POOL } from "../burst";
import { CHIPS, CHIP_VAL } from "../chips";
import { Box, Txt, Grid, Img, RR, Shadow, ShadowX, Corner } from "../components/Presentational";

const CHIP_DX = -2, CHIP_DY = -3;

const DESC_LINES = [
  "Engineered for unpredictable weather, this superlight shell",
  "combines fully waterproof and windproof fabric with a breathable",
  "membrane that releases moisture as you move.",
  "The laminated elastic hem keeps the silhouette clean and modern,",
  "while streamlined design details make it equally at home on city",
  "streets and shoulder-season trails. Stay dry, stay comfortable,",
  "stay moving.",
];

type Sty = React.CSSProperties;
const lineStyle = (bg = "#C5C5C5"): Sty => ({ position: "absolute", left: 0, top: 0, width: 1, height: 4, background: bg, transformOrigin: "0 0", opacity: 0 });
const vlineStyle = (bg = "#C5C5C5"): Sty => ({ position: "absolute", left: 0, top: 0, width: 4, height: 1, background: bg, transformOrigin: "0 0", opacity: 0 });

export const BurstChips = () => {
  const rootRef = useRef<TgEl>(null);
  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;
    tg.initializer = (inst) => {
      const q = <T extends HTMLElement>(sel: string) => inst.querySelector(sel) as T | null;
      const st = (el: HTMLElement | null, k: string, v: string) => {
        if (k === "width" && v.endsWith("px")) v = `${Math.round(parseFloat(v))}px`;
        if (el && (el.style as any)[k] !== v) (el.style as any)[k] = v; };
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
      const setCorner = (c: string, x: number, y: number, R: number, which: "bl" | "tl" | "tr" | "br", cut = 0) => {
        const el = g(`.${c}`), inner = g(`.${c}-i`); if (!el || !inner) return;
        tf(`.${c}`, `translate(${x}px, ${y + cut}px)`); st(el, "width", `${R}px`); st(el, "height", `${Math.max(0, R - cut)}px`);
        st(inner, "width", `${2 * R}px`); st(inner, "height", `${2 * R}px`); st(inner, "borderRadius", `${R}px`);
        st(inner, "left", `${which === "tr" || which === "br" ? -R : 0}px`); st(inner, "top", `${(which === "bl" || which === "br" ? -R : 0) - cut}px`);
      };
      const setDisc = (c: string, x: number, y: number, ro: number, which: "br" | "tl", bg: string) => {
        const el = g(`.${c}`), inner = g(`.${c}-i`); if (!el || !inner) return;
        tf(`.${c}`, `translate(${x}px, ${y}px)`); st(el, "width", `${ro}px`); st(el, "height", `${ro}px`);
        st(inner, "width", `${2 * ro}px`); st(inner, "height", `${2 * ro}px`); st(inner, "borderRadius", `${ro}px`); st(inner, "background", bg);
        st(inner, "left", `${which === "br" ? -ro : 0}px`); st(inner, "top", `${which === "br" ? -ro : 0}px`);
      };
      const setGrid = (c: string, G: G, blur?: (x: number, y: number) => number, thin = false) => {
        const bc = (b: number) => gry(231 + 12 * b), bwid = (b: number) => 2 + 3 * b;
        for (let i = 0; i < NV; i++) {
          const x = gridX(G, KMIN + i);
          if (!blur) { const xr = thin ? x - 0.5 : Math.round(x - 0.5); tr(`.${c}-v${i}`, xr, 0); tr(`.${c}-vb${i}`, xr, 0); continue; }
          const wT = bwid(blur(x, 270)), wB = bwid(blur(x, 810)), c0 = bc(blur(x, 0)), c1 = bc(blur(x, 540)), c2 = bc(blur(x, 1080));
          tr(`.${c}-v${i}`, x - wT / 2, 0, wT / 2, 1); st(g(`.${c}-v${i}`), "background", `linear-gradient(180deg, ${c0} 73.53%, ${c1} 100%)`);
          tr(`.${c}-vb${i}`, x - wB / 2, 0, wB / 2, 1); st(g(`.${c}-vb${i}`), "background", `linear-gradient(180deg, ${c1} 0%, ${c2} 26.21%)`);
        }
        for (let i = 0; i < NH; i++) {
          const y = gridY(G, JMIN + i);
          if (!blur) { const yr = thin ? y - 0.5 : Math.round(y - 0.5); tr(`.${c}-h${i}`, 0, yr); tr(`.${c}-hb${i}`, 0, yr); continue; }
          const wL = bwid(blur(480, y)), wR = bwid(blur(1440, y)), c0 = bc(blur(0, y)), c1 = bc(blur(960, y)), c2 = bc(blur(1920, y));
          tr(`.${c}-h${i}`, 0, y - wL / 2, 1, wL / 2); st(g(`.${c}-h${i}`), "background", `linear-gradient(90deg, ${c0} 53.4%, ${c1} 100%)`);
          tr(`.${c}-hb${i}`, 0, y - wR / 2, 1, wR / 2); st(g(`.${c}-hb${i}`), "background", `linear-gradient(90deg, ${c1} 0%, ${c2} 47.06%)`);
        }
      };
      const setCell = (c: string, n: number, G: G, k: number, j: number, o = 1) => {
        const x0 = gridX(G, k), x1 = gridX(G, k + 1), y0 = gridY(G, j), y1 = gridY(G, j + 1);
        tr(`.${c}-cell${n}`, x0 + 1, y0 + 1, x1 - x0 - 1, y1 - y0 - 1); op(`.${c}-cell${n}`, o);
      };
      const setMarker = (c: string, n: number, G: G, k: number, j: number, o = 1) => {
        tf(`.${c}-mk${n}`, `translate(${gridX(G, k) - 3.5}px, ${gridY(G, j) - 3.5}px) rotate(45deg)`); op(`.${c}-mk${n}`, o);
      };
      const mctx = document.createElement("canvas").getContext("2d");
      const measure = (t: string, font: string) => { if (!mctx) return 0; mctx.font = font; return mctx.measureText(t).width; };
      try { const fs = (document as any).fonts; if (fs && fs.load) { fs.load(`25px ${FONT}`); fs.load(`600 30px ${FONT}`); fs.load(`500 22px ${FONT}`); } } catch { /* fonts API unavailable */ }

      const B9TX = [[335, 0], [336, 46.5], [337, -15.5], [338, -51.5], [339, -75.5], [340, -92.5], [341, -105.5], [342, -114.5], [343, -121.5], [344, -126.5], [345, -131.5]];
      const PCARD = [[340, 780, 460, 173, 159], [342, 724, 446, 262, 187], [344, 594, 383, 575, 314], [346, 412, 259, 1053, 563], [348, 347, 234, 1221, 612], [350, 316, 223, 1295, 635], [354, 292, 215, 1342, 651], [358, 283, 212, 1354, 657], [360, 278, 210, 1362, 661], [364, 271, 207, 1374, 667], [370, 262, 202, 1392, 676], [376, 250, 197, 1416, 687], [380, 234, 189, 1448, 703], [384, 194, 170, 1528, 741], [386, 146, 147, 1624, 788]];
      const ANN: number[][][] = [
        [[355, 549.6, 118.0, 198.7, 93.1, 0.4, 0], [356, 548.3, 118.8, 199.3, 92.9, 0.6, 0], [357, 554.3, 119.5, 74.2, 69.0, 1, 0], [358, 550.0, 119.3, 133.6, 67.9, 1, 0], [359, 547.4, 119.9, 235.8, 69.7, 1, 0.4], [360, 545.8, 120.6, 395.5, 68.5, 1, 0.13], [361, 545.6, 121.4, 433.4, 67.3, 1, 0], [362, 545.4, 119.1, 435.5, 69.2, 1, 0], [366, 544.7, 119.0, 435.8, 69.6, 1, 0], [370, 546.0, 119.0, 434.0, 70.0, 1, 0], [380, 544.1, 119.2, 436.4, 69.2, 1, 0], [386, 546.0, 119.1, 435.4, 70.3, 1, 0]],
        [[359, 549.4, 193.7, 197.8, 92.3, 0.5, 0], [360, 625.5, 196.2, 121.6, 75.6, 1, 0], [361, 671.0, 195.8, 75.5, 68.3, 1, 0], [362, 671.6, 194.4, 75.3, 69.2, 1, 1], [363, 547.3, 194.9, 154.3, 69.0, 1, 0], [364, 548.1, 195.5, 127.7, 68.9, 1, 0], [370, 547.0, 195.0, 127.0, 70.0, 1, 0], [380, 547.0, 194.2, 126.9, 69.2, 1, 0], [386, 547.7, 194.6, 126.9, 70.3, 1, 0]],
        [[362, 1042.0, 305.3, 158.7, 182.1, 0.4, 0], [363, 1071.2, 335.1, 103.6, 123.9, 0.6, 0], [364, 1036.4, 287.7, 135.8, 86.1, 1, 0], [365, 1037.2, 288.1, 135.5, 85.9, 1, 0], [366, 1063.2, 287.5, 108.9, 53.5, 1, 1], [367, 1052.8, 287.9, 119.8, 53.3, 1, 0], [368, 1051.5, 287.2, 120.5, 54.2, 1, 0], [370, 1052.0, 287.0, 120.0, 54.0, 1, 0], [380, 1051.7, 286.5, 121.1, 53.8, 1, 0], [386, 1051.7, 287.1, 121.7, 54.9, 1, 0]],
        [[366, 1246.7, 328.8, 56.5, 50.4, 0.4, 0], [367, 1245.0, 329.1, 58.4, 50.3, 1, 0], [368, 1188.1, 315.4, 112.5, 54.2, 1, 0], [369, 1171.5, 315.7, 130.3, 54.1, 1, 0], [370, 1170.0, 315.0, 130.0, 54.0, 1, 0], [380, 1169.0, 314.4, 131.7, 53.8, 1, 0], [386, 1170.0, 314.6, 132.0, 53.1, 1, 0]],
        [[368, 748.2, 377.6, 78.3, 68.3, 1, 0], [369, 618.3, 377.8, 134.3, 56.1, 1, 0], [370, 582.0, 377.0, 104.0, 54.0, 1, 0.4], [371, 596.3, 376.9, 153.6, 54.8, 1, 0.3], [372, 621.4, 376.8, 238.6, 51.7, 1, 0], [373, 627.6, 376.8, 251.8, 55.5, 1, 0], [375, 628.0, 375.6, 256.3, 57.2, 1, 0], [380, 628.7, 374.9, 255.7, 57.7, 1, 0], [386, 628.3, 376.3, 257.1, 56.6, 1, 0]],
      ];
      const TAGW = [8, 5, 7, 7, 8].map((n) => n * 6.6 + 20);
      const ENTER = [[344, 44, 60, 40, 50, 0], [345, 40, 56, 36, 44, 0], [346, 34.5, 51, 32, 36, 0], [347, 19, 30, 30, 21.5, 0], [348, 11.4, 19, 28, 14, 0], [349, 6, 11, 15, 7.5, 0], [350, 4.3, 7, 7, 4.4, 0], [351, 2, 3, 3, 1, 0], [352, 1.4, 2, 1, 1, 0], [353, 0, 0, 0, 0, 0]];
      const TYPE = [[343, 0], [344, 22], [345, 33], [346, 73], [347, 94], [348, 139], [349, 174], [350, 204], [351, 234], [352, 260], [353, 288], [354, 314], [355, 341], [356, 367], [357, 377]];
      const DESC_FULL = DESC_LINES.join(" ");
      const DESC_P2 = DESC_LINES.slice(0, 3).join(" ").length;
      const wrapDesc = (n: number, avail: number): string[] => {
        const out: string[] = [];
        if (avail >= 690) {
          let acc = 0;
          for (const full of DESC_LINES) { const k = Math.max(0, Math.min(full.length, n - acc)); out.push(full.slice(0, k)); acc += full.length + 1; }
          return out;
        }
        const font = `24px ${FONT}`;
        const paras = [DESC_FULL.slice(0, Math.min(n, DESC_P2)), n > DESC_P2 + 1 ? DESC_FULL.slice(DESC_P2 + 1, n) : ""];
        for (const p of paras) {
          if (!p) continue;
          let line = "";
          for (const wd of p.split(" ")) {
            const cand = line ? line + " " + wd : wd;
            if (line && measure(cand, font) > avail) { out.push(line); line = wd; } else line = cand;
          }
          if (line) out.push(line);
        }
        return out;
      };
      const PAN = [[300, -1.75], [304, -5.75], [308, -10.5], [310, -14.5], [314, -22.5], [316, -28.5], [320, -40.5], [324, -57.25], [328, -79], [330, -92], [332, -106.75], [334, -124.5], [335, -135.5]];
      const DOTX = [[296, 1124], [298, 1117], [299, 1115], [300, 1126], [301, 1145], [302, 1167], [306, 1244], [310, 1309], [314, 1368], [318, 1425], [322, 1486], [326, 1560], [330, 1656], [333, 1755], [335, 1850]];
      const DOTY = [[296, 502], [298, 440], [299, 418], [300, 397], [301, 384], [302, 383]];
      const DLT = [[278, 40], [282, 28.75], [286, 24], [290, 20], [293, 17.85], [296, 13.75], [298, 11.75], [300, 10], [305, 6.5], [310, 4], [320, 1.3], [328, 0]];
      const CXG = [[261, 2375.5], [262, 2113.25], [263, 1980.5], [264, 1879.5], [265, 1796.5], [266, 1724.5], [267, 1661.25], [268, 1605], [269, 1553.75], [270, 1508], [271, 1465.25], [272, 1426.5], [273, 1390], [274, 1357.25], [275, 1326], [276, 1296.5], [277, 1269.5], [278, 1244], [282, 1158], [286, 1094], [290, 1044.5], [293, 1016.5], [296, 973.75], [298, 961.5], [300, 958.5]];
      const BAND_X0 = [[262, 120], [265, 170], [270, 220], [275, 190], [278, 110], [283, 40], [290, 20], [300, 0]];
      const BAND_XE = [[262, 400], [265, 480], [270, 540], [275, 490], [278, 430], [283, 690], [290, 800], [300, 650], [320, 650], [335, 550]];
      const BAND_V0 = [[278, 230], [290, 231], [335, 232]], BAND_VE = [[290, 249], [300, 244], [310, 242], [335, 240]];
      const BAND_Y0 = [[279, 803], [281, 809], [283, 811], [285, 809], [288, 805], [291, 802], [295, 799], [300, 796], [307, 796], [310, 798], [316, 799], [319, 800], [324, 801], [332, 802], [335, 802]];
      const BAND_Y1 = [[279, 1016], [283, 999], [286, 983], [290, 965], [295, 950], [296, 940], [300, 927], [305, 916], [310, 909], [315, 904], [320, 902], [326, 900], [335, 900]];
      const BAND_LF = [[284, 120], [290, 160], [296, 300], [300, 320], [310, 550], [320, 560], [335, 760]];
      const CYG = [[261, 344.25], [262, 404.25], [263, 438.5], [264, 460.5], [265, 475.75], [266, 486.75], [267, 495.5], [268, 502], [269, 507], [270, 511], [271, 513.5], [272, 516], [273, 518], [274, 519.75], [275, 521.5], [276, 523], [277, 524.5], [278, 525.75], [282, 530], [286, 533.75], [290, 536.25], [293, 537.5], [296, 539.5]];
      const VXT = [[284, 768], [285, 756], [286, 744], [287, 732], [288, 722], [289, 712], [290, 703], [291, 694], [292, 687], [293, 681], [294, 673], [295, 667], [296, 647], [297, 642], [298, 639], [299, 636], [300, 634], [302, 635], [306, 635], [308, 633], [310, 631], [312, 629], [314, 623], [316, 618], [318, 613], [320, 606], [322, 599], [324, 590], [326, 580], [328, 570], [330, 557], [332, 542], [334, 524], [335, 514]];
      const HBT = [[277, 915], [278, 917], [279, 907], [280, 902], [281, 899], [282, 896], [283, 893], [284, 891], [285, 889], [286, 887], [287, 886], [288, 884], [289, 883], [290, 882], [291, 881], [292, 880], [293, 879], [294, 877], [295, 876], [296, 873], [297, 871], [298, 869], [299, 867], [300, 865], [302, 863], [304, 860], [306, 858], [308, 857], [310, 855], [312, 854], [316, 853], [324, 853], [326, 852], [330, 851], [334, 850]];
      const RCT = [[294, 44], [296, 54], [298, 57], [300, 61], [303, 64], [305, 66], [308, 69], [310, 70], [313, 72], [316, 75], [320, 77], [328, 81], [335, 83]];
      const SQC: [number, number, number[][]][] = [[6, 2, [[296, 1], [297, 0.45], [298, 0.28], [299, 0]]], [6, 1, [[297, 0.46], [298, 1], [302, 1], [303, 0.23], [304, 0.23], [305, 0]]], [7, 1, [[303, 0.9], [304, 1], [312, 1], [313, 0.45], [314, 0]]], [8, 1, [[313, 0.4], [314, 0.9], [315, 1], [321, 1], [322, 0.43], [323, 0]]], [9, 1, [[322, 0.45], [323, 0.45], [324, 0.95], [325, 1], [330, 1], [331, 0.2], [332, 0]]], [10, 1, [[330, 0.9], [331, 1], [334, 1], [335, 0.24], [336, 0]]], [11, 1, [[335, 1], [341, 1]]]];
      const XKT = [[303, 1180], [305, 1200], [310, 1280], [315, 1290], [320, 1300], [325, 1290], [330, 1270], [335, 1240]];
      const A0T = [[303, 0.7], [305, 0.68], [310, 0.69], [315, 0.61], [320, 0.59], [325, 0.57], [330, 0.55], [335, 0.52]];
      const S383T = [[303, 0], [306, 40], [310, 70], [314, 70], [320, 130], [326, 190], [332, 340], [335, 420]];
      const F383T = [[303, 0.8], [310, 0.72], [320, 0.7], [326, 0.6], [335, 0.6]];
      const CCOLT = [[296, 1], [298, 0.95], [300, 0.85], [302, 0.72], [304, 0.62], [308, 0.55], [310, 0.5], [314, 0.38], [320, 0.33], [326, 0.23], [335, 0.2]];
      const TTT = [[296, 1], [298, 0.88], [300, 0.8], [301, 0.62], [302, 0.57], [304, 0.42], [306, 0.35], [308, 0.29], [310, 0.21], [312, 0.16], [314, 0.13], [316, 0.09], [318, 0.06], [320, 0.03], [323, 0.02], [326, 0]];
      const PC3T = [[303, 0.65], [304, 0.59], [306, 0.47], [310, 0.47], [314, 0.38], [320, 0.39], [326, 0.3], [335, 0.27]];
      const PC2T = [[296, 0.95], [299, 0.7], [302, 0.55], [304, 0.55], [306, 0.46], [308, 0.36], [312, 0.34], [314, 0.24], [320, 0.17], [335, 0.16]];
      const WTT = [[296, 270], [298, 220], [300, 240], [302, 180], [304, 150], [306, 120], [310, 90], [314, 60], [326, 40], [335, 40]];
      const RZ4 = [[278, -200], [279, 0], [281, 135], [283, 263], [285, 305], [287, 398], [289, 450], [291, 490], [295, 650], [300, 860], [305, 1020], [310, 1400], [312, 1700]];
      const SPX4 = [[345, 154.5], [346, 155], [348, 156], [350, 156.5], [352, 157], [354, 158], [356, 159], [358, 160], [360, 160], [362, 161], [364, 162], [367, 163], [370, 164], [372, 164.25], [374, 165], [375, 166], [376, 167], [378, 168], [379, 169], [380, 170.25], [381, 172], [382, 173], [383, 176], [384, 179.75], [385, 186], [386, 191]];
      const SPY4 = [[345, 156], [346, 157], [349, 158], [351, 159], [354, 160], [357, 161], [360, 162], [362, 163], [364, 164], [368, 165], [370, 165.5], [372, 166], [374, 167.25], [375, 168], [377, 169], [378, 170], [379, 171], [380, 172], [381, 173.5], [382, 175], [383, 178], [384, 182], [385, 188], [386, 193]];
      const TX4 = [[345, -132], [346, -133.6], [348, -136.6], [350, -140.5], [352, -144.4], [355, -147.3], [358, -146.5], [360, -149.2], [363, -150.1], [366, -150.1], [370, -146.2], [372, -148], [376, -146], [380, -144.5], [382, -144], [383, -141.5], [384, -140], [385, -138.2], [386, -135.9]];
      const renderD = (f: number) => {
        const on = f >= 261 && f <= 386;
        op(".sc4", on ? 1 : 0);
        if (!on) return;
        /* camera */
        const spx = f < 346 ? wp(f, [[262, 334], [299, 165], [310, 162], [320, 159], [326, 155.5], [332, 154], [335, 154]], easeOutCubic) : wp(f, SPX4);
        const spy = f < 346 ? wp(f, [[262, 185], [299, 167], [325, 157.5], [335, 156]], easeOutCubic) : wp(f, SPY4);
        const dx = f < 300 ? 0 : f <= 335 ? wp(f, PAN) : f <= 345 ? wp(f, B9TX) - 157.5 : -289;
        const tx = f < 336 ? dx : f <= 345 ? wp(f, B9TX) : wp(f, TX4);
        const rad = f <= 335;
        const G: G = rad
          ? { sx: 1, sy: 1, cx: f >= 300 ? 958.5 + wp(f, PAN) : wp(f, CXG), cy: wp(f, CYG), tx: 0, ty: 0, kx0: 111.5, ky0: 149.5, dl: wp(f, DLT) }
          : { sx: spx / 154, sy: spy / 156, cx: f < 346 ? 960 : 1048, cy: 540, tx, ty: 0, kx0: 111.5, ky0: 149.5 };
        const rz4 = wp(f, RZ4);
        const blur4 = (x: number, y: number) => (f <= 278 ? 1 : Math.max(0, Math.min(1, (Math.hypot(x - 850, y - 950) - rz4) / 400)));
        setGrid("g4", G, blur4);
        if (f >= 345) { const x0 = gridX(G, 2), x1 = gridX(G, 11), y0 = gridY(G, 0), y1 = gridY(G, 5); tr(".g4-plate", x0 + 1.5, y0 + 1.5, x1 - x0 - 3, y1 - y0 - 3); op(".g4-plate", 1); }
        else op(".g4-plate", 0);
        /* light grid cells: B9 pan cells then B10 corner cells */
        const cellsB9: [number, number, number, number][] = [[3, 5, 336, 345], [7, 0, 336, 337], [9, 4, 336, 344], [1, 0, 337, 345], [11, -1, 339, 345], [12, 5, 340, 345]];
        const cellsB10: [number, number][] = [[1, 0], [2, -1], [2, 1], [11, -1], [10, 0], [11, 1], [2, 5], [11, 5]];
        for (let i = 0; i < 6; i++) { const c = cellsB9[i]; setCell("g4", i, G, c[0], c[1], inR(f, c[2], c[3]) ? 1 : 0); }
        for (let i = 0; i < 8; i++) { const c = cellsB10[i]; setCell("g4", 6 + i, G, c[0], c[1], f >= 346 ? 1 : 0); }
        const mk = f >= 346 ? [[2, 0], [11, 0], [2, 5], [11, 5]] : [[5, 0], [8, 0], [5, 3], [8, 3]];
        for (let i = 0; i < 4; i++) setMarker("g4", i, G, mk[i][0], mk[i][1], f >= 296 ? 1 : 0);
        /* B7 line + dot */
        const dotX = wp(f, [[261, 331], [262, 502], [263, 604], [264, 664], [265, 704], [266, 731], [267, 750], [268, 762], [269, 771], [270, 775], [271, 776], [272, 777], [273, 780], [274, 786], [275, 799], [276, 821], [277, 866]]);
        const dotY = wp(f, [[261, 736], [262, 796], [263, 831], [264, 852.5], [265, 868], [266, 879], [267, 888], [268, 894], [269, 899], [270, 903], [271, 906], [272, 908], [273, 910], [274, 912], [275, 913.5], [276, 915], [277, 917]]);
        /* line thickness 12 -> 8 -> 6 -> 4 over the opening */
        const lh = wp(f, [[262, 12], [263, 8], [264, 8], [265, 4.3], [267, 4.3], [268, 4], [276, 4], [277, 6], [279, 6], [283, 5], [287, 4]]);
        const lineY = f < 278 ? dotY : wp(f, HBT) + 0.5;
        const preBurst = f < 278;
        /* trace path: bottom horizontal, climb at vx, run at y=539, climb again at X2, run at y=383 to the dot */
        const vx = wp(f, VXT);
        const ty = wp(f, [[284, 531.5], [285, 533], [286, 534], [290, 536.5], [291, 537], [292, 537.5], [293, 538.5], [295, 538.5], [296, 540]]);
        const R = Math.min(wp(f, RCT), (ty - 382) / 2);
        const pathOn = f >= 284 && f <= 341;
        const endX = f < 284 ? dotX : vx + 2 - R;
        tr(".ph0", 0, lineY - lh / 2, Math.max(0, endX), lh / 4);
        { const lv = f >= 276 ? Math.round(197 + 8 * Math.max(0, lh - 4)) : 197; st(g(".ph0"), "background", `rgb(${lv},${lv},${lv})`); }
        op(".ph0", f <= 341 ? 1 : 0);
        const bOn = f >= 262 && f <= 335;
        const bPieces = [".band", ".bandc0", ".bandv", ".bandc1", ".bandm"];
        if (!bOn) { bPieces.forEach((s) => op(s, 0)); op(".bandt", 0); }
        else {
          let by0: number, by1: number;
          if (f <= 278) { let j0 = JMIN; for (let j = JMIN; j < JMIN + NH - 1; j++) if (gridY(G, j) <= lineY) j0 = j; by0 = gridY(G, j0) + 1.5; by1 = gridY(G, j0 + 1) - 1.5; }
          else { by0 = wp(f, BAND_Y0) - 0.7; by1 = wp(f, BAND_Y1) + 1.4; }
          const hb = Math.max(1, by1 - by0);
          const bx0 = wp(f, BAND_X0), bxE = wp(f, BAND_XE), bv0 = wp(f, BAND_V0), bvE = wp(f, BAND_VE);
          const vh = (x: number) => (x <= bx0 ? bv0 : x >= bxE ? bvE : bv0 + ((bvE - bv0) * (x - bx0)) / (bxE - bx0));
          const gv = (q: number) => `rgb(${Math.round(q)},${Math.round(q)},${Math.round(q)})`;
          const ccx = pathOn ? vx - R : 1920, hw = Math.max(1, Math.min(ccx + 4, bxE)), xm = Math.min(bxE, hw);
          const pct = (x: number) => `${Math.max(0, Math.min(100, (100 * x) / hw)).toFixed(1)}%`;
          st(g(".band"), "background", `linear-gradient(90deg, ${gv(bv0)} 0%, ${gv(bv0)} ${pct(bx0)}, ${gv(vh(xm))} ${pct(xm)}, ${gv(vh(hw))} 100%)`);
          tr(".band", 0, by0, hw, hb); op(".band", 1); tr(".bandt", 0, by0, hw, 1); op(".bandt", 0);
          if (pathOn) {
            const arc = (Math.PI / 2) * R, vc = vh(ccx), lf = wp(f, BAND_LF);
            const vs = (s: number) => vc + (249 - vc) * Math.max(0, Math.min(1, (s - ccx) / lf));
            const ro = R + hb / 2, ccy = lineY - R, BDX = 4;
            setDisc("bandc0", ccx + BDX, ccy, ro, "br", gv(vs(ccx + arc / 2))); op(".bandc0", 1);
            const s1 = ccx + arc, vTopR = ty + R, lv = Math.max(0, ccy - vTopR), s2 = s1 + lv;
            st(g(".bandv"), "background", `linear-gradient(0deg, ${gv(vs(s1))} 0%, ${gv(vs(s2))} 100%)`);
            tr(".bandv", vx - hb / 2 + BDX, vTopR, hb, Math.max(1, lv)); op(".bandv", lv > 0 ? 1 : 0);
            const c2x = vx + R;
            setDisc("bandc1", c2x - ro + BDX, vTopR - ro, ro, "tl", gv(vs(s2 + arc / 2))); op(".bandc1", 1);
            const s3 = s2 + arc, rem = Math.max(0, lf - (s3 - ccx)), mw = Math.min(rem, 1920 - c2x);
            st(g(".bandm"), "background", `linear-gradient(90deg, ${gv(vs(s3))} 0%, ${gv(vs(s3 + mw))} 100%)`);
            tr(".bandm", c2x + BDX, ty - hb / 2, Math.max(1, mw), hb); op(".bandm", mw > 2 ? 1 : 0);
          } else bPieces.slice(1).forEach((s) => op(s, 0));
        }
        const tailX0 = wp(f, [[262, -400], [265, -85], [267, 240], [268, 300], [269, 470], [270, 630]]);
        const tail0A = wp(f, [[262, 1], [263, 0.98], [264, 0.75], [265, 0.66], [266, 0.62], [267, 0.58], [268, 0.54], [269, 0.55], [270, 0.55], [271, 0]]);
        const tfd = wp(f, [[265, 310], [267, 300], [268, 250], [269, 170], [270, 125]]);
        const ts = wp(f, [[265, 0], [267, 0.3], [268, 0.3], [270, 0]]);
        const tlen = Math.max(0, dotX - tailX0);
        if (preBurst && f <= 270 && tlen > 2) {
          const tc = (a: number) => {
            const b = clamp01(a), m = Math.min(1, b / 0.66), n = Math.max(0, (b - 0.66) / 0.34);
            const r = 197 + 40 * m - 1 * n, gg = 197 - 93 * m - 19 * n, bb = 197 - 132 * m - 60 * n;
            return `rgb(${Math.round(r)},${Math.round(gg)},${Math.round(bb)})`;
          };
          const p1 = Math.min(100, (tfd / tlen) * 100), p2 = Math.max(p1, ((tlen - 24) / tlen) * 100), oc = tc(tail0A);
          st(g(".ph0o"), "background", `linear-gradient(90deg, ${tc(ts * tail0A)} 0%, ${oc} ${p1.toFixed(1)}%, ${oc} ${p2.toFixed(1)}%, ${OR} 100%)`);
          tr(".ph0o", tailX0, lineY - lh / 2, tlen, lh / 4); op(".ph0o", 1);
        } else op(".ph0o", 0);
        const pOn = pathOn ? seg(f, 284, 287) : 0;
        setCorner("pc0", vx + 2 - R, lineY + 2 - R, R, "br"); op(".pc0", pOn);
        const vTop = ty - 2 + R;
        tr(".pv0", vx - 2, vTop, 1, Math.max(0, lineY + 2 - R - vTop)); op(".pv0", pOn);
        setCorner("pc1", vx - 2, ty - 2, R, "tl"); op(".pc1", pOn);
        const X2 = f <= 335 ? (gridX(G, 6) + gridX(G, 7)) / 2 - 1.0 : 1116 + dx;
        const b8 = f >= 296 && f <= 341;
        const exEnd = f < 296 ? wp(f, [[287, 830], [296, 1036]]) : X2 + 2 - R;
        tr(".ph1", vx - 2 + R, ty - 2, Math.max(0, exEnd - vx + 2 - R), 1); op(".ph1", pOn);
        const dcx = f < 296 ? dotX : wp(f, DOTX) + dx + 2.4;
        const dcy = f < 296 ? dotY : wp(f, DOTY);
        const turned = b8 && dcy <= 383 + R;
        const cut3 = dcy > 383.5 ? Math.max(0, Math.min(R, dcy - 380.5)) : 0;
        const hx0 = X2 - 2 + R, hw = turned ? Math.max(0, (f === 335 ? 1633 : dcx) - hx0) : 0;
        const head = (d: number) => (d < 70 ? 1 : Math.max(0, 1 - (d - 70) / 250));
        const S383 = wp(f, S383T), F383 = wp(f, F383T), CCOL = wp(f, CCOLT), TT = wp(f, TTT), WT = wp(f, WTT);
        const rowAlpha = (sb: number) => (f < 303 ? head(sb) : sb < S383 ? 1 : Math.max(F383, 1 - (sb - S383) / 150));
        const oa = (a: number) => `rgba(236,85,5,${clamp01(a).toFixed(3)})`;
        const grad = (deg: number, as: number[]) => `linear-gradient(${deg}deg, ${as.map((a, i) => `${oa(a)} ${((100 * i) / (as.length - 1)).toFixed(1)}%`).join(", ")})`;
        const rowOn = turned && hw > 0;
        tr(".ph2g", hx0, 380.5, hw, 1); op(".ph2g", rowOn ? 1 : 0);
        const xk = f <= 335 ? wp(f, XKT) : 1375.5 + dx, a0 = wp(f, A0T);
        const rowBg = f < 303 ? grad(90, [0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1].map((t) => rowAlpha(dcx - (hx0 + hw * t))))
          : `linear-gradient(90deg, ${oa(a0)} 0%, ${oa(1)} ${(100 * clamp01((xk - hx0) / Math.max(1, hw))).toFixed(1)}%, ${oa(1)} 100%)`;
        st(g(".ph2"), "background", rowBg); tr(".ph2", hx0, 380.5, hw, 1); op(".ph2", rowOn ? 1 : 0);
        setCorner("pc3g", X2 - 2, 380.5, R, "tl", cut3); op(".pc3g", turned ? 1 : 0);
        setCorner("pc3", X2 - 2, 380.5, R, "tl", cut3); op(".pc3", turned ? (f < 303 ? Math.max(CCOL, rowAlpha(hw)) : wp(f, PC3T)) : 0);
        const vTop2 = Math.max(380.5 + R, dcy), vLen = Math.max(0, ty + 2 - R - vTop2);
        const dTop = turned ? hw + 63 : 0;
        const colA = [0, 0.5, 1].map((t) => Math.max(head(dTop + vLen * t), CCOL));
        tr(".pv1g", X2 - 2, vTop2, 1, vLen); op(".pv1g", b8 ? 1 : 0);
        st(g(".pv1"), "background", grad(180, colA)); tr(".pv1", X2 - 2, vTop2, 1, vLen); op(".pv1", b8 ? 1 : 0);
        const dBot = dTop + vLen + 30;
        setCorner("pc2", X2 + 2 - R, ty + 2 - R, R, "br"); op(".pc2", b8 ? 1 : 0);
        setCorner("pc2o", X2 + 2 - R, ty + 2 - R, R, "br"); op(".pc2o", b8 ? Math.max(head(dBot), wp(f, PC2T)) : 0);
        const tailA = [1, 5 / 6, 4 / 6, 3 / 6, 2 / 6, 1 / 6, 0].map((t) => { const sd = 300 * t; return Math.max(head(dBot + 33 + sd), TT * Math.max(0, 1 - sd / WT)); });
        st(g(".ph1o"), "background", grad(90, tailA)); tr(".ph1o", X2 + 2 - R - 300, ty - 2, 300, 1); op(".ph1o", b8 ? 1 : 0);
        /* dot: 50px on the B7 line, 70px after the burst */
        const dsz = f >= 296 ? 70 : 50;
        const dotOn = (preBurst && f >= 261) || inR(f, 296, 335);
        tf(".dot", `translate(${dcx - dsz / 2}px, ${dcy - dsz / 2}px) scale(${dsz / 48})`); op(".dot", dotOn ? 1 : 0);
        /* pulse ring */
        const pr = seg(f, 273, 281);
        tf(".pulse", `translate(${dotX + 14 - 93}px, ${dotY - 93}px)`); op(".pulse", f === 277 ? 1 : 0); void pr;
        let si = -1; for (let i = 0; i < SQC.length; i++) if (SQC[i][2][0][0] <= f) si = i;
        const setSq = (c: string, q: [number, number, number[][]] | null) => {
          if (!q || !inR(f, 296, 341)) { op(`.${c}`, 0); return; }
          const [k, j, tab] = q; const a = f > tab[tab.length - 1][0] ? 0 : wp(f, tab);
          const x0 = gridX(G, k), x1 = gridX(G, k + 1), y0 = gridY(G, j), y1 = gridY(G, j + 1);
          const el = g(`.${c}`); if (el) { st(el, "width", `${x1 - x0}px`); st(el, "height", `${y1 - y0}px`); st(el, "borderRadius", `${wp(f, [[296, 10], [300, 6], [320, 5], [335, 4]]).toFixed(2)}px`); st(el, "borderWidth", "4px"); }
          tf(`.${c}`, `translate(${x0 - 1.25}px, ${y0 - 1.25}px)`); op(`.${c}`, a);
        };
        setSq("osq2", si >= 0 ? SQC[si] : null); setSq("osq2p", si >= 1 ? SQC[si - 1] : null); op(".dash335", f === 335 ? 1 : 0);
        for (const k of ["L", "T", "R", "F"]) {
          const c = `.chp${k}`; let e = CHIPS[k][f];
          if (!e && k !== "T" && f > 335 && f <= 341) { const a = CHIPS[k][335], b = CHIPS[k][334]; e = a.map((v, i) => v + (f - 335) * (v - b[i])); }
          if (!e) { op(c, 0); continue; }
          const [tx, ty, , th, bx, by, bw, bh] = e; const sc = th / 46;
          tf(c, `translate(${bx}px, ${by}px)`); op(c, 1);
          const bEl = g(`${c}-b`); if (bEl) { st(bEl, "width", `${bw}px`); st(bEl, "height", `${bh}px`); st(bEl, "borderRadius", `${Math.round(0.17 * bh)}px`); }
          tf(`${c}-s`, `scale(${bw / 275}, ${bh / 115})`);
          const tEl = g(`${c}-t`); if (tEl) { const v = CHIP_VAL[k][Math.min(f, 335)]; if (tEl.textContent !== v) tEl.textContent = v; st(tEl, "transform", `translate(${tx - bx + CHIP_DX * sc}px, ${ty - by + CHIP_DY * sc}px) scale(${sc})`); }
        }
        { const items = BURST[f] ?? [];
          for (let i = 0; i < BURST_POOL; i++) { const it = items[i], c = `.bu${i}`, el = g(c), inn = g(`${c}-in`); if (!el || !inn) continue; if (!it) { op(c, 0); continue; }
            const t = it[0] as string, a = it[1] as number, b = it[2] as number, w = it[3] as number, h = it[4] as number;
            let x = a, y = b, W2 = w, H2 = h, bg = OR, br = "0px", bd = "0px solid transparent", inOn = false, ix = 0, iy = 0, ir = 0;
            if (t === "d") { x = a - w; y = b - w; W2 = 2 * w; H2 = 2 * w; br = `${w}px`; }
            else if (t === "o") { bg = "transparent"; br = `${it[5] as number}px`; bd = `${it[6] as number}px solid ${OR}`; }
            else if (t === "h") { const r = w, side = it[4] as string; bg = "transparent"; inOn = true; ir = r;
              if (side === "b") { x = a - r; y = b - r; W2 = 2 * r; H2 = r; ix = 0; iy = 0; }
              else if (side === "t") { x = a - r; y = b; W2 = 2 * r; H2 = r; ix = 0; iy = -r; }
              else if (side === "l") { x = a - r; y = b - r; W2 = r; H2 = 2 * r; ix = 0; iy = 0; }
              else { x = a; y = b - r; W2 = r; H2 = 2 * r; ix = -r; iy = 0; } }
            st(el, "width", `${W2}px`); st(el, "height", `${H2}px`); st(el, "borderRadius", br); st(el, "background", bg); st(el, "border", bd);
            st(el, "transform", `translate(${x}px, ${y}px)`); op(c, t === "o" ? ((it[7] as number) ?? 1) : t === "l" ? ((it[5] as number) ?? 1) : 1);
            if (inOn) { st(inn, "width", `${2 * ir}px`); st(inn, "height", `${2 * ir}px`); st(inn, "transform", `translate(${ix}px, ${iy}px)`); }
            op(`${c}-in`, inOn ? 1 : 0); } }
        const chox = wp(f, [[322, 617], [324, 608], [325, 602]]);
        tf(".chO", `translate(${chox}px, 248px)`); op(".chO", inR(f, 322, 325) && f !== 323 ? 1 : 0);
        tf(".chG", `translate(${chox}px, 248px)`); op(".chG", f === 323 ? 1 : 0);
        tf(".chW", `translate(${wp(f, [[326, 596], [328, 583], [330, 569], [332, 552], [334, 531], [335, 519]])}px, 248px)`); op(".chW", inR(f, 326, 335) ? 1 : 0);
        /* product card */
        const pcOn = f >= 340;
        op(".pcard", pcOn ? 1 : 0);
        if (pcOn) {
          const [x, y, w, h] = wpn(f, PCARD);
          setRR("pc", x, y, w, h, 32); setRR("pcb", x - 1, y - 1, w + 2, h + 2, 33);
          const s0 = w / 1392;
          tr(".pshadow", x, y, s0, h / 676);
          op(".pcontent", f >= 343 ? 1 : 0);
          const cam = f > 360;
          const [lx, ly, lw, lh] = cam ? [278, 210, 1362, 661] : [x, y, w, h];
          const s = lw / 1392, ts = Math.max(0.96, s);
          const kx = cam ? wp(f, SPX4) / 160 : 1, ky = cam ? wp(f, SPY4) / 162 : 1, dtx = cam ? wp(f, TX4) + 149.2 : 0;
          const PX = (px: number) => cam ? 1048 + (px + dtx - 1048) * kx : px;
          const PY = (py: number) => cam ? 540 + (py - 540) * ky : py;
          /* image box 487x612 (rest), 32px in from the left edge, vertically centred */
          const ix = lx + 32 * s, iy = ly + (lh - 612 * s) / 2;
          tr(".imgbox", PX(ix), PY(iy), s * kx, s * ky); tr(".jacket", PX(ix), PY(iy), s * kx, s * ky);
          const sh = wpn(f, ENTER);
          const TX = lx + 107 + 446 * s;
          const ry = (rest: number, k: number) => ly + (rest + sh[k]) * s;
          const tw = f <= 344 ? 183 : f <= 346 ? 311 : 486;
          tr(".ptitle", PX(TX - 5 * ts), PY(ry(71, 0)), ts * kx, ts * ky); st(g(".ptitle"), "width", `${tw}px`); op(".ptitle", f >= 344 ? 1 : 0);
          tr(".pcat", PX(TX), PY(ry(145, 1)), ts * 1.14 * kx, ts * 1.1 * ky); op(".pcat", f >= 346 ? 1 : 0);
          const pd = f < 357 ? "$" : f === 357 ? "$1" : f === 358 ? "$18" : "$189";
          const pe = g(".pdark"); if (pe && pe.textContent !== pd) pe.textContent = pd;
          tr(".pdark", PX(TX - 2 * ts), PY(ry(210, 2)), ts * kx, ts * ky); op(".pdark", f >= 348 ? 1 : 0);
          const goff = f <= 357 ? measure(pd, `600 47px ${FONT}`) + 2.1 * pd.length + 4 : wp(f, [[358, 105], [359, 118], [360, 123], [361, 125], [363, 127]]);
          tr(".pgrey", PX(TX - 2 * ts + goff * ts), PY(ry(217, 2)), ts * kx, ts * ky); op(".pgrey", f >= 348 ? 1 : 0);
          const bw = Math.max(0, lx + lw - 42 * s - TX), bh = 262 * s;
          setRR("dbox", PX(TX), PY(ry(291, 3)), bw * kx, bh * ky, 16 * s * kx);
          const nchars = Math.round(wp(f, TYPE));
          const lines = wrapDesc(nchars, (bw - 64 * ts) / ts);
          for (let i = 0; i < 8; i++) {
            const el = g(`.dl${i}`); if (!el) continue;
            const t = lines[i] ?? ""; if (el.textContent !== t) el.textContent = t;
            tr(`.dl${i}`, 32 * ts * kx, (15.2 + 30.8 * i) * ts * ky, ts * kx, ts * ky); op(`.dl${i}`, t.length > 0 ? 1 : 0);
          }
          for (let i = 0; i < 4; i++) { const sw = wp(f, [[352, 0.4], [353, 0.7], [354, 0.8], [355, 0.85], [357, 0.88], [365, 1]]) * s; tr(`.sw${i}`, PX(TX + [0, 61, 116, 170][i] * s + 24 * (s - sw)), PY(ry(584, 3) + 16 * (s - sw)), sw * kx, sw * ky); op(`.sw${i}`, f >= 352 ? 1 : 0); }
          for (let i = 0; i < ANN.length; i++) {
            const A = ANN[i];
            if (f < A[0][0]) { op(`.an${i}`, 0); op(`.ap${i}`, 0); op(`.af${i}`, 0); continue; }
            const [ax, ay, aw, ah, aa, af] = wpn(f, A);
            setRR(`af${i}`, x + ax * s0, y + (ay + 22) * s0, aw * s0, (ah - 22) * s0, 6 * s0); op(`.af${i}`, i === 0 ? Math.min(1, af * 1.3) : af);
            setRR(`an${i}`, x + ax * s0, y + (ay + 22) * s0, aw * s0, (ah - 22) * s0, 6 * s0); op(`.an${i}`, aa);
            tr(`.ap${i}`, x + (ax + aw - TAGW[i]) * s0, y + (ay + 1) * s0, s0); op(`.ap${i}`, aa);
          }
        }
      };

      const cleanup = inst.addFrameTask((info) => {
        const f = BURST_CHIPS_START + Math.round((info.ownCurrentTimeMs / 1000) * FPS);
        renderD(f);
      });
      return () => { if (cleanup) cleanup(); };
    };
  }, []);

  return (
    <Timegroup ref={rootRef as any} mode="fixed" duration={`${BURST_CHIPS_MS}ms`} fps={24} style={{ position: "relative", width: W, height: H, overflow: "hidden" }}>
      <div className="sc4" style={{ position: "absolute", left: 0, top: 0, width: W, height: H, background: "#F9F9F9", opacity: 1 }}>
        <Grid c="g4" color="#F3F3F3" cells={14} cellColor="#F2F2F2" markers={4} split plate />
        <div className="band" style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, opacity: 0, transformOrigin: "0 0" }} />
        <div className="bandt" style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, opacity: 0, transformOrigin: "0 0", background: "rgba(0,0,0,0.075)" }} />
        <div className="bandc0" style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, overflow: "hidden", opacity: 0, transformOrigin: "0 0" }}><div className="bandc0-i" style={{ position: "absolute", left: 0, top: 0, width: 2, height: 2 }} /></div>
        <div className="bandv" style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, opacity: 0, transformOrigin: "0 0" }} />
        <div className="bandc1" style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, overflow: "hidden", opacity: 0, transformOrigin: "0 0" }}><div className="bandc1-i" style={{ position: "absolute", left: 0, top: 0, width: 2, height: 2 }} /></div>
        <div className="bandm" style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, opacity: 0, transformOrigin: "0 0" }} />
        <div className="ph0" style={lineStyle()} />
        <div className="ph0o" style={{ ...lineStyle(), background: `linear-gradient(90deg, rgba(236,85,5,0), ${OR})` }} />
        <Corner c="pc0" which="br" />
        <div className="pv0" style={vlineStyle()} />
        <Corner c="pc1" which="tl" />
        <div className="ph1" style={lineStyle()} />
        <div className="ph1o" style={lineStyle(OR)} />
        <Corner c="pc2" which="br" />
        <Corner c="pc2o" which="br" bg={OR} />
        <div className="pv1g" style={vlineStyle()} />
        <div className="pv1" style={vlineStyle(OR)} />
        <Corner c="pc3g" which="tl" />
        <Corner c="pc3" which="tl" bg={OR} />
        <div className="ph2g" style={lineStyle()} />
        <div className="ph2" style={lineStyle(OR)} />
        <Box c="pulse" w={186} h={186} r={93} o={0} s={{ border: "4px solid rgba(236,85,5,0.72)", boxSizing: "border-box" }} />
        <Box c="osq2p" w={165} h={165} r={10} o={0} s={{ border: `3px solid ${OR}`, boxSizing: "border-box" }} />
        <Box c="dash335" x={1236} y={930} w={32} h={2} bg={OR} o={0} />
        <Box c="osq2" w={165} h={165} r={10} o={0} s={{ border: `3px solid ${OR}`, boxSizing: "border-box" }} />
        <Box c="dot" w={48} h={48} r={24} bg={OR} o={0} />
        {["L", "T", "R", "F"].map((k) => (
          <div key={k} className={`chp${k}`} style={{ position: "absolute", left: 0, top: 0, width: 275, height: 115, opacity: 0, transformOrigin: "0 0" }}>
            <ShadowX c={`chp${k}-s`} w={275} h={115} r={19} />
            <div className={`chp${k}-b`} style={{ position: "absolute", left: 0, top: 0, width: 275, height: 115, background: "#FAFAFA", borderRadius: 19, border: "1px solid #ECECEC", boxSizing: "border-box" }} />
            <Txt c={`chp${k}-t`} x={0} y={0} size={55} color="#797979" lh={64} mono>$0.00</Txt>
          </div>
        ))}
        {Array.from({ length: BURST_POOL }).map((_, i) => (
          <div key={"bu" + i} className={`bu${i}`} style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, opacity: 0, overflow: "hidden", boxSizing: "border-box", transformOrigin: "0 0" }}>
            <div className={`bu${i}-in`} style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, background: OR, borderRadius: "50%", opacity: 0 }} />
          </div>
        ))}
        <div className="chO" style={{ position: "absolute", left: 0, top: 0, width: 276, height: 116, opacity: 0, transformOrigin: "0 0" }}>
          <Shadow w={276} h={116} r={16} layers={5} alpha={0.05} dy={4} grow={4} color="231,73,20" />
          <div style={{ position: "absolute", left: 0, top: 0, width: 276, height: 116, background: OR, borderRadius: 16 }} />
          <Txt c="chO-s" x={29} y={26} size={56} color="#FFFFFF" lh={64} mono>$103.48</Txt>
        </div>
        <div className="chW" style={{ position: "absolute", left: 0, top: 0, width: 276, height: 116, opacity: 0, transformOrigin: "0 0" }}>
          <Shadow w={276} h={116} r={16} layers={5} alpha={0.025} dy={3} grow={3} />
          <div style={{ position: "absolute", left: 0, top: 0, width: 276, height: 116, background: "#FCFCFC", borderRadius: 16, border: `1.5px solid ${OR}`, boxSizing: "border-box" }} />
          <Txt c="chW-t" x={29} y={26} size={56} color={OR} lh={64} mono>$103.48</Txt>
        </div>
        <div className="chG" style={{ position: "absolute", left: 0, top: 0, width: 276, height: 116, opacity: 0, transformOrigin: "0 0" }}>
          <Shadow w={276} h={116} r={16} layers={5} alpha={0.025} dy={3} grow={3} />
          <div style={{ position: "absolute", left: 0, top: 0, width: 276, height: 116, background: "#FCFCFC", borderRadius: 16, border: `1.5px solid ${OR}`, boxSizing: "border-box" }} />
          <Txt c="chG-t" x={29} y={26} size={56} color="#767676" lh={64} mono>$103.48</Txt>
        </div>
        {/* product card */}
        <div className="pcard" style={{ position: "absolute", left: 0, top: 0, width: W, height: H, opacity: 0 }}>
          <ShadowX c="pshadow" w={1392} h={676} r={32} k={0.45} kc={1.25} aL={0.36} aT={0} aR={0.36} aB={0.75} />
          <RR c="pcb" r={33} bg="#DCDCDC" />
          <RR c="pc" r={32} bg="#FFFFFF" />
          <div className="pcontent" style={{ position: "absolute", left: 0, top: 0, width: W, height: H, opacity: 0 }}>
            <Box c="imgbox" w={487} h={612} bg="#E6E6E6" r={16} />
            <Img c="jacket" src="/firecrawl-demo/src/assets/jacket.png" w={487} h={612} o={1} />
            <Box c="ptitle" w={486} h={48} s={{ overflow: "hidden" }}><Txt x={0} y={-5} size={48} weight={600} color="#1A1A1A" lh={56} s={{ letterSpacing: "-0.02em" }}>Stratos Shell Jacket</Txt></Box>
            <Txt c="pcat" x={0} y={0} size={23} color="#3A3A3A" lh={28} mono o={0}>Apparel · Outerwear · Jackets</Txt>
            <Txt c="pdark" x={0} y={0} size={47} color="#1A1A1A" lh={56} weight={600} o={0} s={{ letterSpacing: "0.045em" }}>$</Txt>
            <Txt c="pgrey" x={0} y={0} size={33} color="#B4B4B4" lh={44} weight={400} o={0}>249</Txt>
            <div className="dbox" style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, background: "#F8F8F8", borderRadius: 16, overflow: "hidden", transformOrigin: "0 0" }}>
              {Array.from({ length: 8 }).map((_, i) => <Txt key={i} c={`dl${i}`} x={0} y={0} size={24.3} color="#616161" lh={30.8} o={0} s={{ letterSpacing: 0 }}>{DESC_LINES[i] ?? ""}</Txt>)}
            </div>
            {["#1A1A1A", "#ACACAC", "#675A9E", "#4354BB"].map((col, i) => (
              <Box key={i} c={`sw${i}`} w={48} h={32} o={0}>
                {i === 0 ? <div style={{ position: "absolute", left: -5, top: -5, width: 58, height: 42, borderRadius: 11, border: "2px solid #1A1A1A", boxSizing: "border-box" }} /> : null}
                <div style={{ position: "absolute", left: 0, top: 0, width: 48, height: 32, borderRadius: 8, background: col }} />
              </Box>
            ))}
            {["Category", "Price", "Keyword", "Keyword", "Category"].map((t, i) => (
              <React.Fragment key={i}>
                <RR c={`af${i}`} r={6} bg={OR} o={0} />
                <RR c={`an${i}`} r={6} bg="transparent" o={0} s={{ border: `2px solid ${OR}`, boxSizing: "border-box" }} />
                <div className={`ap${i}`} style={{ position: "absolute", left: 0, top: 0, width: Math.round(t.length * 6.6 + 20), height: 22, background: OR, borderRadius: 4, opacity: 0, transformOrigin: "0 0" }}>
                  <Txt x={10} y={3} size={12} color="#FFFFFF" lh={16} mono>{t}</Txt>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </Timegroup>
  );
};
