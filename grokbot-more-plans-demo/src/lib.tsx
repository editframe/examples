/**
 * Shared types, lookup utilities, constants, and shape components
 * used across all three scenes.
 */
import React from "react";
import { CANON } from "./motion";

/* ── Types ─────────────────────────────────────────────────────── */

export type TgEl = HTMLElement & {
  initializer?: (inst: TgEl) => (() => void) | void;
  addFrameTask: (cb: (info: { ownCurrentTimeMs: number }) => void) => () => void;
};

export type Tab = { m: Map<number, number[]>; rows: number[][] };

/* ── Table lookup / interpolation ──────────────────────────────── */

export const mk = (rows: number[][]): Tab => ({
  m: new Map(rows.map((r) => [r[0], r])),
  rows,
});

export const look = (t: Tab, f: number, maxGap = 45): number[] | null => {
  const r = t.m.get(f);
  if (r) return r;
  const rs = t.rows;
  if (!rs.length || f < rs[0][0] || f > rs[rs.length - 1][0]) return null;
  let lo = 0,
    hi = rs.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (rs[mid][0] < f) lo = mid;
    else hi = mid;
  }
  const a = rs[lo],
    b = rs[hi];
  if (b[0] - a[0] > maxGap) return null;
  const u = (f - a[0]) / (b[0] - a[0]);
  return a.map((v, i) => (i === 0 ? f : v + (b[i] - v) * u));
};

/* ── Visual constants ──────────────────────────────────────────── */

export const COL: Record<string, string> = {
  bk: "#000000",
  og: "#F49707",
  tl: "#0FD0A4",
  rd: "#E44004",
  br: "#91653D",
  st: "#767676",
  bl: "#1A87F7",
  dk: "#3B3B3B",
};

export const FONT = `"InterVar", "InterV", "Inter", sans-serif`;

export const ALTS = ["tl", "bk", "rd"];
export const DOMSEQ = ["tl", "bk", "st", "bk2", "rd", "br", "rd2", "og", "tl2", "bl", "dk"];
export const BASE = (n: string): string => (n.endsWith("2") ? n.slice(0, -1) : n);
export const ZORDER = ["tl", "bk", "st", "rd", "br", "og", "bl", "dk"];
export const BALLS = new Set(["bk", "og"]);

export const HEAD_INK = [3.09, 9.95, 1007.6, 75.3];
export const GROK_INK = [5.1, 11.8, 236.8, 83];
export const BOT_INK = [6.3, 14, 162.5, 81];

/* ── Style helpers (factory) ───────────────────────────────────── */

export const st = (el: HTMLElement | null, k: string, v: string) => {
  if (k === "width" && v.endsWith("px")) v = `${Math.round(parseFloat(v))}px`;
  if (el && (el.style as any)[k] !== v) (el.style as any)[k] = v;
};

/* ── Clover shape component ────────────────────────────────────── */

export const Clover = (p: { n: string; cls?: string }) => {
  const c = (CANON as any)[p.n] as {
    w: number;
    h: number;
    circles: number[][];
    caps?: number[][];
  };
  return (
    <div
      className={`cv-${p.cls || p.n}`}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: c.w,
        height: c.h,
        opacity: 0,
        transformOrigin: `${Math.round(c.w / 2)}px ${Math.round(c.h / 2)}px`,
      }}
    >
      {c.circles.map(([nx, ny, nr], i) => {
        const d = Math.round(2 * nr * c.w);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: d,
              height: d,
              borderRadius: Math.ceil(d / 2),
              background: COL[p.n],
              transformOrigin: `${d / 2}px ${d / 2}px`,
              transform: `translate(${(nx * c.w - d / 2).toFixed(2)}px, ${(ny * c.h - d / 2).toFixed(2)}px)`,
            }}
          />
        );
      })}
      {(c.caps || []).map(([x1, y1, x2, y2, nr], i) => {
        const ax = x1 * c.w,
          ay = y1 * c.h,
          bx = x2 * c.w,
          by = y2 * c.h;
        const r = nr * c.w,
          len = Math.hypot(bx - ax, by - ay);
        const wI = Math.round(len + 2 * r),
          hI = Math.round(2 * r);
        const deg = (Math.atan2(by - ay, bx - ax) * 180) / Math.PI;
        return (
          <div
            key={`c${i}`}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: wI,
              height: hI,
              borderRadius: Math.ceil(hI / 2),
              background: COL[p.n],
              transformOrigin: `${wI / 2}px ${hI / 2}px`,
              transform: `translate(${((ax + bx) / 2 - wI / 2).toFixed(2)}px, ${((ay + by) / 2 - hI / 2).toFixed(2)}px) rotate(${deg.toFixed(3)}deg)`,
            }}
          />
        );
      })}
    </div>
  );
};
