/**
 * Lockup — Slide 9 (13.87–16.57s, 2700ms, global frames 417–497).
 *
 * Black circle pops and shrinks left, eyes animate inside, then "Grok" and
 * "Bot" slide in to form the wordmark. Scene-scoped addFrameTask for
 * MARK9, EYE9, GROK9, BOT9 tables.
 */
import React, { useEffect, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { Tx, look, lc, toGlobalFrame, pinWidths, fontsReady, type TgEl } from "../components/ui";
import { MARK9, EYE9, GROK9, BOT9 } from "../lib/motion789";
import { LOCKUP_MS, LOCKUP_F0 } from "../constants";

export const Lockup: React.FC = () => {
  const rootRef = useRef<TgEl>(null);

  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;
    tg.initializer = (inst) => {
      const cache = new Map<string, HTMLElement | null>();
      const g = (sel: string) => { if (!cache.has(sel)) cache.set(sel, inst.querySelector(sel) as HTMLElement | null); return cache.get(sel)!; };
      const st = (el: HTMLElement | null, k: string, v: string) => { if (el && (el.style as any)[k] !== v) (el.style as any)[k] = v; };
      const op = (sel: string, v: number) => st(g(sel), "opacity", String(v));
      const tf = (sel: string, v: string) => st(g(sel), "transform", v);

      let prepared = false;
      const render = (ms: number) => {
        const f = toGlobalFrame(ms, LOCKUP_F0);

        const m = look(MARK9, f) || MARK9[MARK9.length - 1]; const k = m[2] / 115;
        tf(".mark9", `translate(${(m[1] - 57.5).toFixed(1)}px, 479.5px) scale(${k.toFixed(4)})`);
        const e = f >= 447 && f <= 450 ? null : look(EYE9, f);
        op(".e9a", e ? 1 : 0); op(".e9b", e ? 1 : 0);
        if (e) {
          const a = g(".e9a"), b = g(".e9b");
          st(a, "left", `${(57.5 + e[1] - 4.5).toFixed(1)}px`); st(a, "top", `${(57.5 + e[2] - 15).toFixed(1)}px`); st(a, "transform", `rotate(${e[5].toFixed(1)}deg)`);
          st(b, "left", `${(57.5 + e[3] - 6.5).toFixed(1)}px`); st(b, "top", `${(57.5 + e[4] - 15.5).toFixed(1)}px`); st(b, "transform", `rotate(${e[5].toFixed(1)}deg)`);
        }
        op(".grok9", f >= 448 ? 1 : 0); if (f >= 448) tf(".grok9", `translate(${(lc(GROK9, f) - 5).toFixed(1)}px, 0px)`);
        op(".bot9", f >= 452 ? 1 : 0); if (f >= 452) tf(".bot9", `translate(${(lc(BOT9, f) - 181.5).toFixed(1)}px, 0px)`);
      };

      const cleanup = inst.addFrameTask(({ ownCurrentTimeMs }) => {
        if (!prepared) { pinWidths(inst); if (fontsReady()) prepared = true; }
        render(ownCurrentTimeMs);
      });
      render(0);
      return cleanup;
    };
    return () => { tg.initializer = undefined; };
  }, []);

  return (
    <Timegroup ref={rootRef as React.Ref<HTMLElement>} mode="fixed" duration={`${LOCKUP_MS}ms`} className="scene">
      <div style={{ position: "absolute", inset: 0, background: "#FFFFFF" }}>
        <div className="mark9" style={{ position: "absolute", left: 0, top: 0, width: 115, height: 115, borderRadius: 58, background: "#000000", overflow: "hidden", transformOrigin: "57.5px 57.5px" }}>
          <div className="e9a" style={{ position: "absolute", left: 0, top: 0, width: 9, height: 30, borderRadius: 9, background: "#FFFFFF", opacity: 0 }} />
          <div className="e9b" style={{ position: "absolute", left: 0, top: 0, width: 13, height: 31, borderRadius: 13, background: "#FFFFFF", opacity: 0 }} />
        </div>
        <div className="grok9" style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, opacity: 0 }}>
          <Tx x={0} capTop={492} size={119} w={500} color="#000000" t="Grok" />
        </div>
        <div className="bot9" style={{ position: "absolute", left: 0, top: 0, width: 1, height: 1, opacity: 0 }}>
          <Tx x={0} capTop={492} size={119} w={500} color="#000000" t="Bot" />
        </div>
      </div>
    </Timegroup>
  );
};
