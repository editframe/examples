/**
 * Songs — 10.65–11.883s (1233ms).
 *
 * Three glowing song rows expand inside a tree container with connector art,
 * followed by a transition image sequence (t2seq, 18 frames).
 *
 * All timing is absolute-frame waypoint animation (irreducible addFrameTask).
 */
import React, { useEffect, useRef } from "react";
import { Timegroup, Image as EfImage } from "@editframe/react";
import { SONGS_ABS_START, SONGS_MS } from "../constants";
import { seg, wp, easeInOut, st, type W, type TgEl } from "../lib/anim";

const A = "/elevenlabs-vocals-demo/src/assets";

const ROWS = [
  { key: "r1", n: 1, g: { x: 699, y: 390 }, w: 797, art: `${A}/artr-b1-1.png` },
  { key: "r2", n: 2, g: { x: 817, y: 502 }, w: 806, art: `${A}/artr-b1-2.png` },
  { key: "r3", n: 3, g: { x: 699, y: 611 }, w: 797, art: `${A}/artr-b1-3.png` },
];

export const Songs: React.FC = () => {
  const rootRef = useRef<TgEl>(null);

  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;

    tg.initializer = (inst) => {
      const q = <T extends HTMLElement>(sel: string) => inst.querySelector(sel) as T | null;
      const qa = (sel: string) => Array.from(inst.querySelectorAll<HTMLElement>(sel));

      const tree = q(".w5-tree");
      const lines = q(".w5-lines");
      const conn = q(".w5-conn");
      const rowHalo = q(".w6-halo");
      const rowEls = ROWS.map(r => ({
        row: q(`.w6-${r.key}`), cover: q(`.w6c-${r.key}`), sweep: q(`.w6s-${r.key}`), edge: q(`.w6-${r.key} .s6-darkedge`),
        glow: q(`.w6-${r.key} .s6-glow`), art: q(`.w6-${r.key} .s6-art`), title: q(`.w6-${r.key} .s6-tt`),
        time: q(`.w6-${r.key} .s6-tm`), heart: q(`.w6-${r.key} .s6-heart`),
      }));
      const t2Els = qa(".wt2-seq");

      const render = (ms: number) => {
        const t = SONGS_ABS_START + ms / 1000;
        const F = t * 30 + 1;

        /* tree translateX */
        const gtx = wp(F, [[296, 0], [300, -8], [304, -16], [308, -24], [312, -32], [316, -40], [320, -50], [324, -60], [328, -70], [332, -80], [336, -92], [340, -104], [344, -111]] as W);
        st(tree, "transform", `translateX(${gtx}px)`);

        /* lines + connector */
        st(lines, "opacity", F >= 320.5 && F < 343.5 ? "1" : "0");
        st(conn, "opacity", F >= 320.5 && F < 343.5 ? "1" : "0");

        /* rows */
        const widths = [
          wp(F, [[300, 55], [304, 70], [308, 244], [312, 451], [316, 597], [320, 674], [324, 734], [328, 758], [332, 767], [336, 780], [344, 797]] as W),
          wp(F, [[298, 60], [300, 164], [304, 321], [308, 560], [312, 664], [316, 720], [320, 757], [328, 787], [336, 801], [344, 806]] as W),
          wp(F, [[302, 55], [306, 140], [310, 366], [314, 520], [318, 640], [322, 700], [326, 745], [330, 770], [338, 790], [346, 797]] as W),
        ];

        st(rowHalo, "opacity", String((F >= 320.5 && F < 343.5 ? 1 : 0) * seg(F, 310, 325)));

        rowEls.forEach((r, i) => {
          const on = F >= 320.5 && F < 343.5;
          st(r.row, "opacity", on ? "1" : "0");
          const w = widths[i];
          const rw = ROWS[i].w;
          const covOn = F >= 320.5 && F < 343.5;
          st(r.cover, "left", `${ROWS[i].g.x + 55 + Math.max(0, Math.min(w, rw) - 55)}px`);
          st(r.cover, "opacity", covOn ? "1" : "0");
          st(r.cover, "transform", covOn ? "none" : "translateX(-4000px)");
          if (!on) return;
          const dw = rw * easeInOut(seg(F, 311 + i * 2, 337 + i * 2));
          st(r.sweep, "left", `${dw - 900}px`);
          st(r.edge, "left", `${dw}px`);
          st(r.glow, "opacity", String(1 - seg(F, 338, 352)));
          const cop = String(seg(F, 303 + i, 310 + i));
          st(r.art, "opacity", cop);
          const top2 = String(seg(F, 312 + i, 322 + i));
          st(r.title, "opacity", top2);
          const mop = String(seg(F, 331, 340));
          st(r.time, "opacity", mop); st(r.heart, "opacity", mop);
        });

        /* t2seq — F 339.5–357.5 */
        {
          const tOn = F >= 339.5 && F < 357.5;
          const tIdx = Math.max(0, Math.min(17, Math.round(F) - 340));
          t2Els.forEach((el, ii) => st(el, "opacity", tOn && ii === tIdx ? String(Math.min(1, seg(F, 340, 344))) : "0"));
        }
      };

      const cleanup = inst.addFrameTask(({ ownCurrentTimeMs }) => render(ownCurrentTimeMs));
      render(0);
      return cleanup;
    };
    return () => { tg.initializer = undefined; };
  }, []);

  return (
    <Timegroup ref={rootRef as React.Ref<HTMLElement>} mode="fixed" duration={`${SONGS_MS}ms`} className="absolute inset-0">
      <div className="w5-tree" style={{ position: "absolute", inset: 0 }}>
        <div className="w5-lines" style={{ position: "absolute", inset: 0, opacity: 0 }}>
          <div style={{ position: "absolute", left: -1200, top: 538.7, width: 2003, height: 1.6, background: "#9a9a9a" }} />
          <div className="w5-conn" style={{ position: "absolute", left: 579, top: 370, width: 120, height: 315, opacity: 0 }}>
            <EfImage src={`${A}/connector-b2.png`} style={{ position: "absolute", left: 0, top: 0, width: 120, height: 315 }} />
          </div>
        </div>

        {ROWS.map((r) => (
          <div key={r.key} className={`w6-${r.key} s6-row`} style={{ left: r.g.x, top: r.g.y, width: r.w, height: 69, opacity: 0 }}>
            <div className="s6-dark" style={{ width: r.w }} />
            <div className="s6-glow" />
            <div className={`w6s-${r.key}`} style={{ position: "absolute", left: -900, top: 0, width: 900, height: 69, background: "linear-gradient(90deg, #212121 12%, #131414 60%, #060808 100%)" }} />
            <div className="s6-darkedge" style={{ left: 0 }} />
            <div className="s6-art" style={{ opacity: 0 }}>
              <EfImage src={r.art} style={{ position: "absolute", left: 0, top: 0, width: 55, height: 55 }} />
            </div>
            <div className="s6-tt" style={{ position: "absolute", left: 74, top: 6, width: 262, height: 56, opacity: 0 }}>
              <EfImage src={`${A}/rowt-b1-${r.n}.png`} style={{ position: "absolute", left: 0, top: 0, width: 262, height: 56 }} />
            </div>
            <div className="s6-tm" style={{ position: "absolute", left: r.w - 137, top: 16, width: 54, height: 40, opacity: 0 }}>
              <EfImage src={`${A}/rowtm-b1-${r.n}.png`} style={{ position: "absolute", left: 0, top: 0, width: 54, height: 40 }} />
            </div>
            <div className="s6-heart" style={{ opacity: 0, left: r.w - 51, top: 18, width: 34, height: 32 }}>
              <EfImage src={`${A}/icon-heart-b2.png`} style={{ position: "absolute", left: 0, top: 0, width: 34, height: 32 }} />
            </div>
          </div>
        ))}
        {ROWS.map((r) => (
          <div key={r.key} className={`w6c-${r.key}`} style={{ position: "absolute", left: r.g.x + 55, top: r.g.y - 12, width: 980, height: 93, background: "#000" }} />
        ))}
        <div className="w6-halo" style={{ position: "absolute", left: 1060, top: 250, width: 800, height: 560, opacity: 0, background: "radial-gradient(ellipse 400px 280px at 400px 280px, rgba(200,225,240,0.10) 0%, rgba(200,225,240,0.04) 55%, rgba(0,0,0,0) 78%)" }} />
      </div>

      {/* t2seq — 18 transition frames */}
      {Array.from({ length: 18 }, (_, i) => (
        <div key={i} className="wt2-seq" style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: 0 }}>
          <EfImage src={`${A}/t2seq-${340 + i}.jpg`} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }} />
        </div>
      ))}
    </Timegroup>
  );
};
