/**
 * Intro — 0–3.617s (3617ms).
 *
 * Three visual beats driven by image sequences + a sprite strip:
 *   i2seq  F 1.5–43.5   (42 frames: i2seq-2 … i2seq-43)
 *   wseq   F 43.5–63.55 (20 frames: wseq-44 … wseq-63)
 *   sprite F 63.55–109.5 (46 positions in a vertical sprite strip)
 *
 * All timing is absolute-frame waypoint animation (irreducible addFrameTask).
 */
import React, { useEffect, useRef } from "react";
import { Timegroup, Image as EfImage } from "@editframe/react";
import { INTRO_ABS_START, INTRO_MS } from "../constants";
import { st, type TgEl } from "../lib/anim";

const A = "/elevenlabs-vocals-demo/src/assets";

export const Intro: React.FC = () => {
  const rootRef = useRef<TgEl>(null);

  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;

    tg.initializer = (inst) => {
      const qa = (sel: string) => Array.from(inst.querySelectorAll<HTMLElement>(sel));
      const q = <T extends HTMLElement>(sel: string) => inst.querySelector(sel) as T | null;

      const wseqEls = qa(".w1-seq");
      const i2Els = qa(".wi2-seq");
      const sprite = q(".w1-sprite");
      const spriteImg = q(".w1-simg");

      const render = (ms: number) => {
        const t = INTRO_ABS_START + ms / 1000;
        const F = t * 30 + 1;

        /* i2seq — F 1.5–43.5 */
        {
          const iOn = F >= 1.5 && F < 43.5;
          const iIdx = Math.max(0, Math.min(41, Math.round(F) - 2));
          i2Els.forEach((el, ii) => st(el, "opacity", iOn && ii === iIdx ? "1" : "0"));
        }

        /* wseq — F 43.5–63.55 */
        {
          const wsOn = F >= 43.5 && F < 63.55;
          const wsIdx = Math.max(0, Math.min(19, Math.round(F) - 44));
          wseqEls.forEach((el, i) => st(el, "opacity", wsOn && i === wsIdx ? "1" : "0"));
        }

        /* sprite — F 63.55–109.5 */
        {
          const sOn = F >= 63.55 && F < 109.5;
          st(sprite, "opacity", sOn ? "1" : "0");
          if (sOn) {
            const idx = Math.max(0, Math.min(45, Math.round(F - 64)));
            st(spriteImg, "transform", `translateY(${-idx * 140}px)`);
          }
        }
      };

      const cleanup = inst.addFrameTask(({ ownCurrentTimeMs }) => render(ownCurrentTimeMs));
      render(0);
      return cleanup;
    };
    return () => { tg.initializer = undefined; };
  }, []);

  return (
    <Timegroup ref={rootRef as React.Ref<HTMLElement>} mode="fixed" duration={`${INTRO_MS}ms`} className="absolute inset-0">
      {/* sprite logo */}
      <div className="w1-sprite s1b-sprite" style={{ opacity: 0 }}>
        <div className="w1-simg" style={{ position: "absolute", left: 0, top: 0, width: 260, height: 6440 }}>
          <EfImage src={`${A}/sprite-logo-b.png`} style={{ position: "absolute", left: 0, top: 0, width: 260, height: 6440 }} />
        </div>
      </div>

      {/* wseq — 20 wordmark-glyph frames */}
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} className="w1-seq" style={{ position: "absolute", left: 530, top: 460, width: 920, height: 170, opacity: 0 }}>
          <EfImage src={`${A}/wseq-${44 + i}.png`} style={{ position: "absolute", left: 0, top: 0, width: 920, height: 170 }} />
        </div>
      ))}

      {/* i2seq — 42 intro frames */}
      {Array.from({ length: 42 }, (_, i) => (
        <div key={i} className="wi2-seq" style={{ position: "absolute", left: 700, top: 450, width: 460, height: 180, opacity: 0 }}>
          <EfImage src={`${A}/i2seq-${2 + i}.png`} style={{ position: "absolute", left: 0, top: 0, width: 460, height: 180 }} />
        </div>
      ))}
    </Timegroup>
  );
};
