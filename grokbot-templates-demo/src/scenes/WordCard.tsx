/**
 * WordCard — Slide 4 (3.83–6.13s, 2300ms, global frames 116–184).
 *
 * White background, six words slide up staggered, then the whole line rises
 * off screen. Scene-scoped addFrameTask drives the per-word top animation
 * and the group exit.
 */
import React, { useEffect, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { Tx, lk, toGlobalFrame, pinWidths, fontsReady, type TgEl } from "../components/ui";
import { S4WORDS, S4EXIT } from "../lib/motion";
import { WORD_CARD_MS, WORD_CARD_F0 } from "../constants";

export const WordCard: React.FC = () => {
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
        const f = toGlobalFrame(ms, WORD_CARD_F0);

        const ex = lk(S4EXIT, f);
        S4WORDS.forEach((w, i) => {
          const on = f >= w.on;
          op(`.w4-${i}`, on ? 1 : 0);
          if (on) {
            const k = f - w.on; const top = k < w.tops.length ? w.tops[k] : w.tops[w.tops.length - 1];
            tf(`.w4-${i}`, `translate(0px, ${(top - w.tops[w.tops.length - 1] + ex).toFixed(1)}px)`);
          }
        });
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
    <Timegroup ref={rootRef as React.Ref<HTMLElement>} mode="fixed" duration={`${WORD_CARD_MS}ms`} className="scene">
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: "#FFFFFF" }}>
        {S4WORDS.map((w, i) => (
          <div key={i} className={`w4-${i}`} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: 0 }}>
            <Tx x={w.x} capTop={508.5} size={79} w={500} t={w.t} />
          </div>
        ))}
      </div>
    </Timegroup>
  );
};
