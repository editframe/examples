import React from "react";

export const FONT = `"InterVar", "InterV", "Inter", "Helvetica Neue", Arial, sans-serif`;
export const CAP = 0.1367;

export type TgEl = HTMLElement & {
  initializer?: (inst: TgEl) => (() => void) | void;
  addFrameTask: (cb: (info: { ownCurrentTimeMs: number }) => void) => () => void;
};

export const look = (rows: number[][], f: number): number[] | null => {
  if (!rows.length || f < rows[0][0] || f > rows[rows.length - 1][0]) return null;
  let lo = 0, hi = rows.length - 1;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (rows[mid][0] <= f) lo = mid; else hi = mid; }
  const a = rows[lo], b = rows[hi];
  if (a[0] === f || b[0] === a[0]) return a;
  const u = (f - a[0]) / (b[0] - a[0]);
  return a.map((v, i) => (i === 0 ? f : v + (b[i] - v) * u));
};
export const lk = (rows: number[][], f: number, i = 1, dflt = 0) => { const r = look(rows, f); return r ? r[i] : dflt; };
export const lc = (rows: number[][], f: number, i = 1) => lk(rows, Math.max(rows[0][0], Math.min(rows[rows.length - 1][0], f)), i);

const K = "#000000", W = "#FFFFFF";
const A = (l: number, t: number, w: number, h: number, r: number, bg: string, extra?: React.CSSProperties, cls?: string) => (
  <div className={cls} style={{ position: "absolute", left: l, top: t, width: w, height: h, borderRadius: r, background: bg, ...(extra || {}) }} />
);
const CLIP = (l: number, t: number, w: number, h: number, children: React.ReactNode, cls?: string) => (
  <div className={cls} style={{ position: "absolute", left: l, top: t, width: w, height: h, overflow: "hidden" }}>{children}</div>
);
const RINGS: [number, number][] = [[12, 0.015], [8, 0.025], [4, 0.035], [0, 0.04], [-4, 0.04], [-8, 0.04]];
export const BigHand = () => (
  <>
    {RINGS.map(([e, a], i) => (
      <div key={i} style={{ position: "absolute", left: -28 - e, top: 74, width: 107 + 2 * e, height: 82 + e, overflow: "hidden" }}>
        {A(0, -(47 + e), 107 + 2 * e, 82 + e + 47 + e, 47 + e, `rgba(0,0,0,${a})`)}
      </div>
    ))}
    {CLIP(-36, 66, 107, 82, <>{A(0, 0, 90, 35, 0, K, undefined, "k7c")}{A(90, 12, 17, 23, 0, K, undefined, "k7c")}{A(55, 0, 5, 82, 0, K, undefined, "k7c")}{A(0, -28, 110, 110, 55, K, undefined, "k7c")}{A(13, -12, 94, 94, 47, K, undefined, "k7c")}</>)}
    {A(50, 59, 21, 40, 16, K, undefined, "k7")}
    {A(-14, 0, 27, 95, 13.5, K, undefined, "k7")}
    {A(25, 53, 27, 32, 13.5, K, undefined, "k7")}
    {A(44, 57, 25, 30, 12.5, K, undefined, "k7")}
    {A(-42, 57, 26, 80, 13, K, { transformOrigin: "13px 13px", transform: "rotate(-18deg)" }, "k7")}
    {A(-5.5, 8, 11, 75, 5.5, W, undefined, "w7")}
    {A(32.5, 61, 10, 25, 5, W, undefined, "w7")}
    {A(51.5, 65, 9, 20, 4.5, W, undefined, "w7")}
    {A(-34, 65, 11, 45, 5.5, W, { transformOrigin: "5.5px 5px", transform: "rotate(-18deg)" }, "w7")}
    {CLIP(-28, 72, 91, 68, <>
      {A(22.5, 0, 68, 36, 8, W, undefined, "w7c")}
      {CLIP(0, 21, 94, 47, A(0, -47, 94, 94, 47, W, undefined, "w7c"))}
      {A(47, 21, 5, 47, 0, W, undefined, "w7c")}
      {A(13, -10, 78, 78, 39, W, undefined, "w7c")}
    </>)}
  </>
);
export const Hand = () => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, transform: "scale(1.13)", transformOrigin: "0 0" }}><BigHand /></div>
);

export const C = {
  pane: "#FBFBFB", side: "#F6F6F6", ink: "#060606", gray: "#666666", light: "#969696",
  botBub: "#EDEDED", divider: "#DCDCDC", fieldBorder: "#D8D8D8", card: "#F1F1F1",
  btnIdle: "#EFEFEF", btnHover: "#D8D8D8", btnPress: "#C8C8C8", btnBorder: "#DFDFDF",
  blue: "#1A87F7", scroll: "#E7E7E7",
};

export const Tx = (p: { x?: number; cx?: number; rx?: number; capTop: number; size: number; w?: number; color?: string; t: string; cls?: string; ls?: number }) => (
  <div className={p.cls} data-pin data-cx={p.cx} data-rx={p.rx} style={{
    position: "absolute", left: Math.round(p.cx !== undefined ? p.cx - 200 : p.rx !== undefined ? p.rx - 400 : (p.x as number)), top: Math.round(p.capTop - CAP * p.size),
    fontFamily: FONT, fontWeight: p.w ?? 400, fontSize: p.size, lineHeight: `${p.size}px`, color: p.color ?? C.ink,
    whiteSpace: "nowrap", letterSpacing: p.ls !== undefined ? `${p.ls}px` : undefined,
  }}>{p.t}</div>
);

export const Box = (p: { x: number; y: number; w: number; h: number; r?: number; bg?: string; border?: string; cls?: string; op?: number; extra?: React.CSSProperties }) => (
  <div className={p.cls} style={{ position: "absolute", left: Math.round(p.x), top: Math.round(p.y), width: Math.round(p.w), height: Math.round(p.h),
    borderRadius: p.r ?? 0, background: p.bg, border: p.border, opacity: p.op, boxSizing: "border-box", ...(p.extra || {}) }} />
);

export const Cloud = (p: { x: number; y: number; k?: number; color?: string; cls?: string; eyes?: boolean }) => {
  const k = p.k ?? 1; const col = p.color ?? C.blue;
  const circ: number[][] = [[93, 56, 56], [166, 62, 50], [130, 66, 54], [60, 122, 60], [181, 122, 60], [120, 126, 65], [121, 156, 39]];
  return (
    <div className={p.cls} style={{ position: "absolute", left: Math.round(p.x), top: Math.round(p.y), width: Math.round(242 * k), height: Math.round(196 * k) }}>
      {circ.map((c, i) => <div key={i} style={{ position: "absolute", left: Math.round((c[0] - c[2]) * k), top: Math.round((c[1] - c[2]) * k), width: Math.round(2 * c[2] * k), height: Math.round(2 * c[2] * k), borderRadius: "50%", background: col }} />)}
      {p.eyes !== false && <>
        <div style={{ position: "absolute", left: Math.round(84 * k), top: Math.round(78 * k), width: Math.round(21 * k), height: Math.round(53 * k), borderRadius: Math.round(11 * k), background: "#FFFFFF" }} />
        <div style={{ position: "absolute", left: Math.round(136 * k), top: Math.round(78 * k), width: Math.round(22 * k), height: Math.round(53 * k), borderRadius: Math.round(11 * k), background: "#FFFFFF" }} />
      </>}
    </div>
  );
};

/** Convert localMs inside a scene → global frame number for the motion tables. */
export const toGlobalFrame = (localMs: number, sceneF0: number, maxF = 497) =>
  Math.max(sceneF0, Math.min(maxF, Math.round((localMs / 1000) * 30) + sceneF0));

/** Pin data-pin text widths to integer px after the webfont is ready. */
export const pinWidths = (inst: HTMLElement) => {
  inst.querySelectorAll("[data-pin]").forEach((n) => {
    const el = n as HTMLElement;
    el.style.width = "auto";
    const w = el.offsetWidth + 2;
    el.style.width = `${w}px`;
    const cx = el.getAttribute("data-cx");
    if (cx && cx !== "undefined") el.style.left = `${Math.round(Number(cx) - w / 2)}px`;
    const rx = el.getAttribute("data-rx");
    if (rx && rx !== "undefined") el.style.left = `${Math.round(Number(rx) - (w - 2)) + 2}px`;
  });
};

export const fontsReady = () => {
  const d: any = typeof document !== "undefined" ? document : null;
  if (!d || !d.fonts || !d.fonts.check) return true;
  try { return d.fonts.check("400 37px InterVar") && d.fonts.check("600 35px InterVar"); } catch { return true; }
};
