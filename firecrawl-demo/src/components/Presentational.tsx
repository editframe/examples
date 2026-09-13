import React from "react";
import { Image as EfImage } from "@editframe/react";
import { FONT, MONO, NV, NH, S4 } from "../constants";

type Sty = React.CSSProperties;

/* ---------- layout primitives ---------- */
export const Box = (p: { c?: string; x?: number; y?: number; w?: number; h?: number; bg?: string; r?: number; o?: number; s?: Sty; children?: React.ReactNode }) => (
  <div className={p.c} style={{ position: "absolute", left: p.x ?? 0, top: p.y ?? 0, width: Math.round(p.w ?? 1), height: p.h ?? 1, background: p.bg, borderRadius: p.r, opacity: p.o ?? 1, transformOrigin: "0 0", ...p.s }}>{p.children}</div>
);
export const Txt = (p: { c?: string; x: number; y: number; w?: number; size: number; color: string; weight?: number; lh: number; mono?: boolean; o?: number; s?: Sty; children?: React.ReactNode }) => (
  <div className={p.c} style={{ position: "absolute", left: p.x, top: p.y, width: Math.round(p.w ?? 1600), fontSize: p.size, lineHeight: `${p.lh}px`, color: p.color, fontWeight: p.weight ?? 400, fontFamily: p.mono ? MONO : FONT, whiteSpace: p.w ? "normal" : "nowrap", opacity: p.o ?? 1, transformOrigin: "0 0", letterSpacing: p.mono ? "-0.01em" : "-0.005em", ...p.s }}>{p.children}</div>
);
export const Img = (p: { c: string; src: string; x?: number; y?: number; w: number; h: number; o?: number; s?: Sty }) => (
  <div className={p.c} style={{ position: "absolute", left: p.x ?? 0, top: p.y ?? 0, width: p.w, height: p.h, opacity: p.o ?? 0, transformOrigin: "0 0", ...p.s }}>
    <EfImage src={p.src} style={{ position: "absolute", left: 0, top: 0, width: p.w, height: p.h, display: "block" }} />
  </div>
);
export const RR = (p: { c: string; r: number; bg: string; o?: number; s?: Sty }) => (
  <div className={p.c} style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, background: p.bg, borderRadius: p.r, opacity: p.o ?? 1, transformOrigin: "0 0", ...p.s }} />
);

/* ---------- shadows ---------- */
export const Shadow = (p: { c?: string; w: number; h: number; r: number; layers?: number; alpha?: number; dy?: number; grow?: number; color?: string }) => {
  const n = p.layers ?? 5, a = p.alpha ?? 0.02, dy = p.dy ?? 8, gr = p.grow ?? 6, col = p.color ?? "0,0,0";
  return (
    <div className={p.c} style={{ position: "absolute", left: 0, top: 0, width: p.w, height: p.h, transformOrigin: "0 0" }}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: -gr * (i + 1), top: dy * (i + 1) - gr * (i + 1), width: p.w + 2 * gr * (i + 1), height: p.h + 2 * gr * (i + 1), borderRadius: p.r + gr * (i + 1), background: `rgba(${col},${a})` }} />
      ))}
    </div>
  );
};
export const ShadowX = (p: { c?: string; x?: number; y?: number; w: number; h: number; r: number; k?: number; kc?: number; aL?: number; cL?: number; aT?: number; cT?: number; aR?: number; aB?: number }) => {
  const k = p.k ?? 1, kc = p.kc ?? k, aL = p.aL ?? 0.68, cL = p.cL ?? 0, aT = p.aT ?? 0, cT = p.cT ?? 0, aR = p.aR ?? 0.92, aB = p.aB ?? 1.4;
  return (
    <div className={p.c} style={{ position: "absolute", left: p.x ?? 0, top: p.y ?? 0, width: p.w, height: p.h, transformOrigin: "0 0" }}>
      {[4, 9, 15, 21, 27, 33].map((e, i) => (
        <div key={"a" + i} style={{ position: "absolute", left: -(aL * e - cL), top: -(aT * e - cT), width: Math.round(p.w + (aL * e - cL) + aR * e), height: Math.round(p.h + (aT * e - cT) + aB * e), borderRadius: p.r + 0.8 * e, background: `rgba(0,0,0,${0.0075 * k})` }} />
      ))}
      {[3, 6, 10, 15, 21].map((e, i) => (
        <div key={"b" + i} style={{ position: "absolute", left: 12, top: 8, width: Math.round(p.w - 24), height: Math.round(p.h - 8 + e), borderRadius: p.r, background: `rgba(0,0,0,${0.0045 * kc})` }} />
      ))}
    </div>
  );
};

/* ---------- sparkle / star ---------- */
export const tileGeo = (i: number, s: number, geo?: [number, number]) => {
  const c = geo ? geo[0] * 100 : 28, R = geo ? geo[1] : 131, hi = 100 + c, lo = -c;
  const [cx, cy, qx, qy] = [[hi, lo, 1, 0], [lo, lo, 0, 0], [lo, hi, 0, 1], [hi, hi, 1, 1]][i];
  const h = s / 2, S0 = h + 0.3, S1a = h + 1;
  const L0 = qx ? h - 0.3 : 0, T0 = qy ? h - 0.3 : 0, L1 = qx ? h - 1 : 0, T1 = qy ? h - 1 : 0;
  return { L1, T1, S1: S1a, cx1: ((L0 + (cx / 100) * S0 - L1) / S1a) * 100, cy1: ((T0 + (cy / 100) * S0 - T1) / S1a) * 100, R1: (R * S0) / S1a, R, S0 };
};
export const softPx = (s: number, geo: [number, number] | undefined, px: number) => px / (1.31 * (s / 2 + 0.3) / 100);
export const tileBg = (i: number, s: number, geo: [number, number] | undefined, color: string, tc: string, soft: number, bias = 0) => {
  const g = tileGeo(i, s, geo), rho = (g.R * g.S0) / 100, d = (soft * 1.31 * g.S0) / 100, ro = rho + (0.5 + bias) * d, ri = Math.max(0, rho - (0.5 - bias) * d);
  const Rp = (ro / g.S1) * 100;
  return `radial-gradient(ellipse ${Rp.toFixed(3)}% ${Rp.toFixed(3)}% at ${g.cx1.toFixed(3)}% ${g.cy1.toFixed(3)}%, ${tc} ${((ri / ro) * 100).toFixed(2)}%, ${color} 100%)`;
};

export const Sparkle = (p: { c: string; s: number; color: string; tc: string; o?: number; geo?: [number, number]; x?: number; y?: number; soft?: number; pad?: number; blur?: number }) => {
  const pd = p.pad ?? 0;
  return (
    <div className={p.c} style={{ position: "absolute", left: p.x ?? 0, top: p.y ?? 0, width: p.s + 2 * pd, height: p.s + 2 * pd, opacity: p.o ?? 0, transformOrigin: "0 0", filter: p.blur ? `blur(${p.blur}px)` : undefined }}>
      {[0, 1, 2, 3].map((i) => { const g = tileGeo(i, p.s, p.geo); return <div key={i} style={{ position: "absolute", left: g.L1 + pd, top: g.T1 + pd, width: g.S1, height: g.S1, background: tileBg(i, p.s, p.geo, p.color, p.tc, p.soft ?? 2.1) }} />; })}
    </div>
  );
};

export const star4TilesS = (hx: number, hy: number, color: string, tc: string, d: number) => {
  const px = S4.P * hx, bx = S4.B * hx, py = S4.P * hy, by = S4.B * hy, vx = Math.ceil(0.26 * hx), vy = Math.ceil(0.26 * hy);
  const kx = (bx + d / 2) / bx, ky = (by + d / 2) / by, stop = ((Math.max(0, by - d / 2) / (by + d / 2)) * 100).toFixed(3);
  const out: { l: number; t: number; w: number; h: number; bg: string }[] = [];
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    { const cx = sx > 0 ? hx : 0, cy = sy > 0 ? by : vy - by, rx = px * ky, ry = by * ky;
      out.push({ l: sx > 0 ? hx : 0, t: sy > 0 ? hy : hy - vy, w: hx, h: vy, bg: `radial-gradient(ellipse ${((rx / hx) * 100).toFixed(3)}% ${((ry / vy) * 100).toFixed(3)}% at ${((cx / hx) * 100).toFixed(3)}% ${((cy / vy) * 100).toFixed(3)}%, ${tc} ${stop}%, ${color} 100%)` }); }
    { const cx = sx > 0 ? bx : vx - bx, cy = sy > 0 ? hy : 0, rx = bx * kx, ry = py * kx;
      out.push({ l: sx > 0 ? hx : hx - vx, t: sy > 0 ? hy : 0, w: vx, h: hy, bg: `radial-gradient(ellipse ${((rx / vx) * 100).toFixed(3)}% ${((ry / hy) * 100).toFixed(3)}% at ${((cx / vx) * 100).toFixed(3)}% ${((cy / hy) * 100).toFixed(3)}%, ${tc} ${stop}%, ${color} 100%)` }); }
  }
  return out;
};

export const Star4 = (p: { c: string }) => (
  <div className={p.c} style={{ position: "absolute", left: 0, top: 0, width: 10, height: 10 }}>
    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0 }} />)}
  </div>
);

export const STAR_U = [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.7, 2.0, 2.3, 2.6];
export const REF_AX: [number, number][] = [[22, 1], [24, 0.97], [26, 0.85], [28, 0.72], [30, 0.63], [32, 0.47], [34, 0.31], [36, 0.2], [38, 0.04], [39.4, 0]];
export const NAT_AX: [number, number][] = [[23, 0.99], [24, 0.946], [25, 0.873], [26, 0.8], [27, 0.735], [28, 0.678], [29, 0.626], [30, 0.575], [31, 0.528], [32, 0.494], [33, 0.459], [34, 0.426], [35, 0.412], [36, 0.394], [37, 0.384], [38, 0.317], [39, 0.03]];
export const lerpTab = (tab: [number, number][], x: number) => {
  if (x <= tab[0][0]) return tab[0][1]; if (x >= tab[tab.length - 1][0]) return tab[tab.length - 1][1];
  for (let i = 1; i < tab.length; i++) if (x <= tab[i][0]) { const [x0, y0] = tab[i - 1], [x1, y1] = tab[i]; return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0); }
  return tab[tab.length - 1][1];
};
export const BAND_A = STAR_U.map((u, k) => {
  const um = k + 1 < STAR_U.length ? (u + STAR_U[k + 1]) / 2 : u + 0.4, r = 39.4 - um * Math.sqrt(39.4);
  return Math.min(1, lerpTab(REF_AX, r) / Math.max(0.02, lerpTab(NAT_AX, r)));
});

export const Star2 = (p: { c: string }) => (
  <div className={p.c} style={{ position: "absolute", left: 0, top: 0, width: 10, height: 10, opacity: 0 }}>
    {STAR_U.map((_, k) => (k < STAR_U.length - 1 ? [0, 1, 2, 3] : [0]).map((side) => (
      <div key={`${k}-${side}`} className={`${p.c}l${k}s${side}`} style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, overflow: "hidden", opacity: BAND_A[k] }}>
        <Star4 c={`${p.c}a${k}s${side}`} />
      </div>
    )))}
  </div>
);

/* ---------- glyph grid ---------- */
export const glyphChar = (r: number, c: number, seed: number, alt = false) => {
  let h = (r * 7919 + c * 104729 + seed * 7331 + 17) >>> 0; h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0; h = (h ^ (h >>> 16)) >>> 0;
  const v = h % 100;
  if (alt) return v < 50 ? "#" : v < 93 ? "@" : "&~W|=*~"[(h >>> 7) % 7];
  return v < 64 ? "#" : v < 89 ? "@" : "%";
};

export const GlyphGrid = (p: { c: string; cols: number; rows: number; dx: number; dy: number; size: number; color: string; seed: number; opf?: (r: number, c: number) => number; font?: string; bold?: boolean; stagger?: boolean; sx?: number; weight?: number; alt?: boolean }) => (
  <div className={p.c} style={{ position: "absolute", left: 0, top: 0, width: p.cols * p.dx, height: p.rows * p.dy, transformOrigin: "0 0" }}>
    {Array.from({ length: p.rows * p.cols }).map((_, i) => { const r = Math.floor(i / p.cols), c = i % p.cols; return (
      <div key={i} style={{ position: "absolute", left: c * p.dx + (p.stagger && r % 2 ? p.dx / 2 : 0), top: r * p.dy, width: p.dx, height: p.dy, fontFamily: p.font ?? MONO, fontWeight: p.weight ?? (p.bold ? 700 : 400), fontSize: p.size, lineHeight: `${p.dy}px`, color: p.color, opacity: p.opf ? p.opf(r, c) : 0, whiteSpace: "nowrap", transform: p.sx ? `scaleX(${p.sx})` : undefined }}>{glyphChar(r, c, p.seed, p.alt)}</div>); })}
  </div>
);

/* ---------- grid of 1px lines ---------- */
export const Grid = (p: { c: string; color: string; hcolor?: string; cells?: number; cellColor?: string; markers?: number; split?: boolean; plate?: boolean; t?: number; tv?: number }) => {
  const W = 1920, H = 1080;
  return (
    <div className={p.c} style={{ position: "absolute", left: 0, top: 0, width: W, height: H }}>
      {Array.from({ length: p.cells ?? 0 }).map((_, i) => (
        <div key={"cell" + i} className={`${p.c}-cell${i}`} style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, background: p.cellColor ?? "#F0F0F0", transformOrigin: "0 0", opacity: 0 }} />
      ))}
      {Array.from({ length: NV }).map((_, i) => (
        <div key={"v" + i} className={`${p.c}-v${i}`} style={{ position: "absolute", left: 0, top: -1500, width: p.tv ?? p.t ?? 2, height: p.split ? 2040 : 4100, background: p.color, transformOrigin: "0 0" }} />
      ))}
      {p.split && Array.from({ length: NV }).map((_, i) => (
        <div key={"vb" + i} className={`${p.c}-vb${i}`} style={{ position: "absolute", left: 0, top: 540, width: 2, height: 2060, background: p.color, transformOrigin: "0 0" }} />
      ))}
      {Array.from({ length: NH }).map((_, i) => (
        <div key={"h" + i} className={`${p.c}-h${i}`} style={{ position: "absolute", left: -1100, top: 0, width: p.split ? 2060 : 4100, height: p.t ?? 2, background: p.hcolor ?? p.color, transformOrigin: "0 0" }} />
      ))}
      {p.split && Array.from({ length: NH }).map((_, i) => (
        <div key={"hb" + i} className={`${p.c}-hb${i}`} style={{ position: "absolute", left: 960, top: 0, width: 2040, height: 2, background: p.hcolor ?? p.color, transformOrigin: "0 0" }} />
      ))}
      {p.plate ? <div className={`${p.c}-plate`} style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, background: "#F9F9F9", transformOrigin: "0 0", opacity: 0 }} /> : null}
      {Array.from({ length: p.markers ?? 0 }).map((_, i) => (
        <div key={"mk" + i} className={`${p.c}-mk${i}`} style={{ position: "absolute", left: 0, top: 0, width: 8, height: 8, background: "#D4D4D4", transformOrigin: "4px 4px", opacity: 0 }} />
      ))}
    </div>
  );
};

/* ---------- corner cutout ---------- */
export const Corner = (p: { c: string; which: "bl" | "tl" | "tr" | "br"; bg?: string }) => (
  <div className={p.c} style={{ position: "absolute", left: 0, top: 0, width: 40, height: 40, overflow: "hidden", opacity: 0, transformOrigin: "0 0" }}>
    <div className={`${p.c}-i`} style={{ position: "absolute", left: p.which === "tr" || p.which === "br" ? -40 : 0, top: p.which === "bl" || p.which === "br" ? -40 : 0, width: 80, height: 80, borderRadius: 40, border: `4px solid ${p.bg ?? "#C5C5C5"}`, boxSizing: "border-box" }} />
  </div>
);
