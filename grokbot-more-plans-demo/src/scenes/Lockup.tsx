/**
 * Lockup — f310–373 (10.30–12.48s, 2180ms).
 *
 * "Grok" and "Bot" slide into the lockup while the black ball (bk)
 * persists from the previous scene. No eyes are visible in this range
 * (EYES[bk] ends at f164). All motion is addFrameTask — the waypoint
 * tables are irreducible.
 */
import React, { useEffect, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { T_bk, EYES } from "../motion";
import { LOCK } from "../texts";
import {
  mk, look, st, COL, FONT, GROK_INK, BOT_INK,
  type TgEl,
} from "../lib";
import { LOCKUP_MS, LOCKUP_START_MS, FPS, LAST } from "../constants";

export const Lockup: React.FC = () => {
  const rootRef = useRef<TgEl>(null);

  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;

    tg.initializer = (inst) => {
      const q = (sel: string) => inst.querySelector(sel) as HTMLElement | null;
      const cache = new Map<string, HTMLElement | null>();
      const g = (sel: string) => {
        if (!cache.has(sel)) cache.set(sel, q(sel));
        return cache.get(sel)!;
      };
      const op = (sel: string, v: number) => st(g(sel), "opacity", String(v));
      const tf = (sel: string, v: string) => st(g(sel), "transform", v);

      const BK = mk(T_bk);
      const LOCKT = mk(LOCK);

      const eyes = (n: string, f: number) => {
        const es = (EYES as any)[n]?.[f] as number[][] | undefined;
        for (let i = 0; i < 2; i++) {
          const sel = `.ey-${n}${i}`;
          const e = es?.[i];
          if (!e) { op(sel, 0); continue; }
          const [cx, cy, len, wid, ang] = e;
          const el = g(sel);
          if (!el) continue;
          const wI = Math.max(2, Math.round(len + 1.24)),
            hI = Math.max(2, Math.round(wid + 1.23));
          st(el, "width", `${wI}px`);
          st(el, "height", `${hI}px`);
          st(el, "borderRadius", `${Math.ceil(Math.min(wI, hI) / 2)}px`);
          st(el, "transformOrigin", `${wI / 2}px ${hI / 2}px`);
          tf(sel, `translate(${cx + 0.52 - wI / 2}px, ${cy + 0.42 - hI / 2}px) rotate(${ang}deg)`);
          op(sel, 1);
        }
      };

      let prepared = false;
      const prep = () => {
        for (const sel of [".lkg", ".lkb"]) {
          const el = g(sel);
          if (el) {
            el.style.width = "auto";
            st(el, "width", `${el.offsetWidth + 2}px`);
          }
        }
      };
      const fontsOk = () => {
        const d = typeof document !== "undefined" ? document : null;
        if (!d || !(d as any).fonts || !(d as any).fonts.check) return true;
        try { return (d as any).fonts.check("600 108px InterVar"); } catch { return true; }
      };

      const render = (localMs: number) => {
        const absMs = localMs + LOCKUP_START_MS;
        const f = Math.max(1, Math.min(LAST, Math.round((absMs / 1000) * FPS) + 1));

        /* ── bk ball ────────────────────────────────────────── */
        const br = look(BK, f, 3);
        if (!br) {
          op(".bd-bk", 0);
          eyes("bk", -1);
        } else {
          const cx = br[1], cy = br[2], w = br[3], h = br[4], brot = br[5] || 0;
          tf(".bd-bk", `translate(${cx}px, ${cy}px) rotate(${brot}deg) scale(${w / 100}, ${h / 100}) translate(-50px, -50px)`);
          op(".bd-bk", 1);
          eyes("bk", f);
        }

        /* ── lockup text ────────────────────────────────────── */
        const lr = look(LOCKT, f, 3);
        if (!lr) {
          op(".lkg", 0);
          op(".lkb", 0);
        } else {
          const gx = lr[1], gy = lr[2], gw = lr[3], gh = lr[4];
          const bx = lr[5], by = lr[6], bw = lr[7], bh = lr[8];
          const gsx = gw / GROK_INK[2], gsy = gh / GROK_INK[3];
          tf(".lkg", `translate(${gx - GROK_INK[0] * gsx}px, ${gy - GROK_INK[1] * gsy}px) scale(${gsx}, ${gsy})`);
          op(".lkg", 1);
          if (bw > 0) {
            const bsx = bw / BOT_INK[2], bsy = bh / BOT_INK[3];
            tf(".lkb", `translate(${bx - BOT_INK[0] * bsx}px, ${by - BOT_INK[1] * bsy}px) scale(${bsx}, ${bsy})`);
            op(".lkb", 1);
          } else {
            op(".lkb", 0);
          }
        }
      };

      const cleanup = inst.addFrameTask(({ ownCurrentTimeMs }) => {
        if (!prepared) { prep(); if (fontsOk()) prepared = true; }
        render(ownCurrentTimeMs);
      });
      render(0);
      return cleanup;
    };

    return () => { tg.initializer = undefined; };
  }, []);

  return (
    <Timegroup
      ref={rootRef as any}
      mode="fixed"
      duration={`${LOCKUP_MS}ms`}
      style={{
        position: "relative", width: 1920, height: 1080,
        overflow: "hidden", background: "#FFFFFF", fontFamily: FONT,
      }}
    >
      {/* bk ball + eyes */}
      <div
        className="bd-bk"
        style={{
          position: "absolute", left: 0, top: 0,
          width: 100, height: 100, borderRadius: 50,
          background: COL.bk, opacity: 0, transformOrigin: "0 0",
        }}
      />
      <div className="ey-bk0" style={{ position: "absolute", left: 0, top: 0, width: 100, height: 26, borderRadius: 13, background: "#FFFFFF", opacity: 0, transformOrigin: "50px 13px" }} />
      <div className="ey-bk1" style={{ position: "absolute", left: 0, top: 0, width: 100, height: 26, borderRadius: 13, background: "#FFFFFF", opacity: 0, transformOrigin: "50px 13px" }} />

      {/* lockup text */}
      <div
        className="lkg"
        style={{
          position: "absolute", left: 0, top: 0,
          whiteSpace: "nowrap", fontFamily: FONT,
          fontWeight: 600, fontSize: 108, lineHeight: "108px",
          letterSpacing: 0, color: "#000000",
          opacity: 0, transformOrigin: "0 0",
        }}
      >
        Grok
      </div>
      <div
        className="lkb"
        style={{
          position: "absolute", left: 0, top: 0,
          whiteSpace: "nowrap", fontFamily: FONT,
          fontWeight: 600, fontSize: 108, lineHeight: "108px",
          letterSpacing: 0, color: "#000000",
          opacity: 0, transformOrigin: "0 0",
        }}
      >
        Bot
      </div>
    </Timegroup>
  );
};
