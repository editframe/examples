import React from "react";

export const SH = "rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.059) 8%, rgba(0,0,0,0.038) 15%, rgba(0,0,0,0.03) 23%, rgba(0,0,0,0.025) 31%, rgba(0,0,0,0.021) 38%, rgba(0,0,0,0.017) 46%, rgba(0,0,0,0.017) 54%, rgba(0,0,0,0.008) 62%, rgba(0,0,0,0.008) 69%, rgba(0,0,0,0.004) 77%, rgba(0,0,0,0.004) 85%, rgba(0,0,0,0) 100%";
export const SH_R = `linear-gradient(90deg, ${SH})`, SH_B = `linear-gradient(180deg, ${SH})`;

export const Blob = (p: { q: number[]; ox: number; oy: number }) => {
  const [cx, cy, sx, sy, rot, A, r, g, b] = p.q; const R = 3;
  const stops: string[] = [];
  for (let s = 0; s <= 10; s++) { const t = s / 10; const a = A * Math.exp(-0.5 * (t * R) * (t * R)); stops.push(`rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${(s === 10 ? 0 : a).toFixed(4)}) ${(t * 100).toFixed(1)}%`); }
  const W = Math.round(2 * sx * R), H = Math.round(2 * sy * R);
  return <div style={{ position: "absolute", left: Math.round(cx - p.ox - W / 2), top: Math.round(cy - p.oy - H / 2), width: W, height: H, transform: `rotate(${rot.toFixed(4)}rad)`,
    background: `radial-gradient(ellipse ${Math.round(sx * R)}px ${Math.round(sy * R)}px at 50% 50%, ${stops.join(", ")})` }} />;
};

export const Eye = (p: { cx: number; cy: number; w: number; h: number; rot?: number }) => (
  <div style={{ position: "absolute", left: Math.round((p.cx - p.w / 2) * 2) / 2, top: Math.round((p.cy - p.h / 2) * 2) / 2, width: p.w, height: p.h,
    borderRadius: p.w, background: "#FFFFFF", transform: p.rot ? `rotate(${p.rot}deg)` : undefined }} />
);

export const Ell = (p: { x: number; y: number; w: number; h: number; bg: string; r?: number | string; rot?: number; cls?: string }) => (
  <div className={p.cls} style={{ position: "absolute", left: p.x, top: p.y, width: p.w, height: p.h, borderRadius: p.r ?? "50%", background: p.bg,
    transform: p.rot ? `rotate(${p.rot}deg)` : undefined }} />
);

export const Tri = (p: { ax: number; ay: number; by: number; hw: number; col: string }) => {
  const up = p.by > p.ay; const H = Math.abs(p.by - p.ay); const top = Math.min(p.ay, p.by);
  const a = (Math.atan2(p.hw, H) * 180) / Math.PI; const S = 300; const hw = Math.round(p.hw);
  const rect = (side: "L" | "R"): React.CSSProperties => {
    const originX = side === "L" ? S : 0; const originY = up ? 0 : S;
    const rot = (side === "L" ? -1 : 1) * (up ? 1 : -1) * (90 - a);
    return { position: "absolute", left: side === "L" ? hw - S : 0, top: up ? 0 : H - S, width: S, height: S, background: p.col,
      transformOrigin: `${originX}px ${originY}px`, transform: `rotate(${rot.toFixed(3)}deg)` };
  };
  return <>
    <div style={{ position: "absolute", left: p.ax - hw, top, width: hw, height: H, overflow: "hidden" }}><div style={rect("L")} /></div>
    <div style={{ position: "absolute", left: p.ax, top, width: hw, height: H, overflow: "hidden" }}><div style={rect("R")} /></div>
  </>;
};
