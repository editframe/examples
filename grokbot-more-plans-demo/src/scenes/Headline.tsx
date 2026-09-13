/**
 * Headline — f220–310 (7.30–10.30s, 3000ms).
 *
 * "Grok Bot, now on more plans" enters while the remaining shapes (og, bl, dk)
 * exit. The black ball (bk) persists throughout. After the headline and shapes
 * depart (~f280), only bk remains for the transition into the lockup.
 *
 * Active shapes: bk (full), og (→f271), bl+tip (→f275), dk clover (→f277).
 * No ZALT alternates in this frame range.
 * All motion is addFrameTask — the waypoint tables are irreducible.
 */
import React, { useEffect, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { T_bk, T_og, T_bl, T_dk, EYES, TIP, CANON, SHEAR } from "../motion";
import { HEAD } from "../texts";
import {
  mk, look, st, COL, FONT, BALLS, BASE, HEAD_INK, Clover,
  type TgEl, type Tab,
} from "../lib";
import { HEADLINE_MS, HEADLINE_START_MS, FPS, LAST } from "../constants";

/** Shapes active in this scene (no alternates). */
const SCENE_SHAPES = ["bk", "og", "bl", "dk"] as const;

export const Headline: React.FC = () => {
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

      const TAB: Record<string, Tab> = {
        bk: mk(T_bk), og: mk(T_og), bl: mk(T_bl), dk: mk(T_dk),
      };
      const TIPT = mk(TIP);
      const HEADT = mk(HEAD);

      const eyes = (n: string, f: number, cls?: string) => {
        const es = (EYES as any)[n]?.[f] as number[][] | undefined;
        for (let i = 0; i < 2; i++) {
          const sel = `.ey-${cls || n}${i}`;
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
        const el = g(".head");
        if (el) {
          el.style.width = "auto";
          st(el, "width", `${el.offsetWidth + 2}px`);
        }
      };
      const fontsOk = () => {
        const d = typeof document !== "undefined" ? document : null;
        if (!d || !(d as any).fonts || !(d as any).fonts.check) return true;
        try { return (d as any).fonts.check("450 80px InterVar"); } catch { return true; }
      };

      const render = (localMs: number) => {
        const absMs = localMs + HEADLINE_START_MS;
        const f = Math.max(1, Math.min(LAST, Math.round((absMs / 1000) * FPS) + 1));

        /* ── shapes ─────────────────────────────────────────── */
        for (const n of SCENE_SHAPES) {
          if (n === "bl") {
            const r = look(TIPT, f);
            if (!r) { op(".bd-bl", 0); op(".tip-bl", 0); eyes("bl", -1); continue; }
            const rad = r[1] + 1.7,
              tiplen = r[2] + 4.0,
              tipang = r[3],
              px = r[4],
              py = r[5];
            tf(".bd-bl", `translate(${px - rad}px, ${py - rad}px) scale(${(2 * rad) / 100})`);
            op(".bd-bl", 1);
            const kx = (rad + tiplen) / 141.42;
            const cxr = 70.71 * kx;
            const ky = Math.sqrt(Math.max(rad * 0.25, rad * rad - cxr * cxr)) / 70.71;
            tf(".tip-bl", `translate(${px}px, ${py}px) rotate(${tipang}deg) scale(${kx}, ${ky}) rotate(135deg)`);
            op(".tip-bl", 1);
            eyes("bl", f);
            continue;
          }

          const r = look(TAB[n], f, 3);
          if (BALLS.has(n)) {
            const sel = `.bd-${n}`;
            if (!r) { op(sel, 0); eyes(n, -1); continue; }
            const cx = r[1], cy = r[2], w = r[3], h = r[4], brot = r[5] || 0;
            tf(sel, `translate(${cx}px, ${cy}px) rotate(${brot}deg) scale(${w / 100}, ${h / 100}) translate(-50px, -50px)`);
            op(sel, 1);
            eyes(n, f);
          } else {
            const sel = `.cv-${n}`;
            const c = (CANON as any)[n];
            if (!r) { op(sel, 0); eyes(n, -1); continue; }
            const cx = r[1], cy = r[2], sx = r[3], sy = r[4], rot = r[5];
            const th = (rot * Math.PI) / 180,
              co = Math.cos(th),
              si = Math.sin(th);
            const sh = (SHEAR as any)[n]?.[f] as number[] | undefined;
            const px = sh ? sh[0] : cx,
              py = sh ? sh[1] : cy;
            const m00 = sh ? sh[2] : sx * co,
              m01 = sh ? sh[3] : -sx * si;
            const m10 = sh ? sh[4] : sy * si,
              m11 = sh ? sh[5] : sy * co;
            const ox = Math.round(c.w / 2) - c.w / 2,
              oy = Math.round(c.h / 2) - c.h / 2;
            const tx = px - Math.round(c.w / 2) + m00 * ox + m01 * oy;
            const ty = py - Math.round(c.h / 2) + m10 * ox + m11 * oy;
            tf(sel, `translate(${tx}px, ${ty}px) matrix(${m00}, ${m10}, ${m01}, ${m11}, 0, 0)`);
            op(sel, 1);
            eyes(n, f);
          }
        }

        /* ── headline ───────────────────────────────────────── */
        const hr = look(HEADT, f, 3);
        if (!hr) {
          op(".head", 0);
        } else {
          const x0 = hr[1], y0 = hr[2], w = hr[3], h = hr[4];
          const sx = w / HEAD_INK[2], sy = h / HEAD_INK[3];
          tf(".head", `translate(${x0 - HEAD_INK[0] * sx}px, ${y0 - HEAD_INK[1] * sy}px) scale(${sx}, ${sy})`);
          op(".head", 1);
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

  const ball = (n: string) => (
    <div
      className={`bd-${n}`}
      style={{
        position: "absolute", left: 0, top: 0,
        width: 100, height: 100, borderRadius: 50,
        background: COL[BASE(n)], opacity: 0, transformOrigin: "0 0",
      }}
    />
  );

  return (
    <Timegroup
      ref={rootRef as any}
      mode="fixed"
      duration={`${HEADLINE_MS}ms`}
      style={{
        position: "relative", width: 1920, height: 1080,
        overflow: "hidden", background: "#FFFFFF", fontFamily: FONT,
      }}
    >
      {/* bk ball */}
      {ball("bk")}
      <div className="ey-bk0" style={{ position: "absolute", left: 0, top: 0, width: 100, height: 26, borderRadius: 13, background: "#FFFFFF", opacity: 0, transformOrigin: "50px 13px" }} />
      <div className="ey-bk1" style={{ position: "absolute", left: 0, top: 0, width: 100, height: 26, borderRadius: 13, background: "#FFFFFF", opacity: 0, transformOrigin: "50px 13px" }} />

      {/* og ball */}
      {ball("og")}
      <div className="ey-og0" style={{ position: "absolute", left: 0, top: 0, width: 100, height: 26, borderRadius: 13, background: "#FFFFFF", opacity: 0, transformOrigin: "50px 13px" }} />
      <div className="ey-og1" style={{ position: "absolute", left: 0, top: 0, width: 100, height: 26, borderRadius: 13, background: "#FFFFFF", opacity: 0, transformOrigin: "50px 13px" }} />

      {/* bl tip + ball */}
      <div
        className="tip-bl"
        style={{
          position: "absolute", left: -100, top: -100,
          width: 100, height: 100, borderRadius: "0 50px 50px 50px",
          background: COL.bl, opacity: 0, transformOrigin: "100px 100px",
        }}
      />
      {ball("bl")}
      <div className="ey-bl0" style={{ position: "absolute", left: 0, top: 0, width: 100, height: 26, borderRadius: 13, background: "#FFFFFF", opacity: 0, transformOrigin: "50px 13px" }} />
      <div className="ey-bl1" style={{ position: "absolute", left: 0, top: 0, width: 100, height: 26, borderRadius: 13, background: "#FFFFFF", opacity: 0, transformOrigin: "50px 13px" }} />

      {/* dk clover */}
      <Clover n="dk" />
      <div className="ey-dk0" style={{ position: "absolute", left: 0, top: 0, width: 100, height: 26, borderRadius: 13, background: "#FFFFFF", opacity: 0, transformOrigin: "50px 13px" }} />
      <div className="ey-dk1" style={{ position: "absolute", left: 0, top: 0, width: 100, height: 26, borderRadius: 13, background: "#FFFFFF", opacity: 0, transformOrigin: "50px 13px" }} />

      {/* headline */}
      <div
        className="head"
        style={{
          position: "absolute", left: 0, top: 0,
          whiteSpace: "nowrap", fontFamily: FONT,
          fontWeight: 450, fontSize: 80, lineHeight: "80px",
          letterSpacing: 0, color: "#000000",
          opacity: 0, transformOrigin: "0 0",
        }}
      >
        Grok Bot, now on more plans
      </div>
    </Timegroup>
  );
};
