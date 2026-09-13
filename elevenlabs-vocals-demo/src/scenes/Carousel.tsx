/**
 * Carousel — 5.483–10.65s (5167ms).
 *
 * Full-screen product-UI carousel: 155 frames (c2seq-166.jpg … c2seq-320.jpg).
 * Only one frame visible at a time via opacity switching.
 *
 * All timing is absolute-frame waypoint animation (irreducible addFrameTask).
 */
import React, { useEffect, useRef } from "react";
import { Timegroup, Image as EfImage } from "@editframe/react";
import { CAROUSEL_ABS_START, CAROUSEL_MS } from "../constants";
import { st, type TgEl } from "../lib/anim";

const A = "/elevenlabs-vocals-demo/src/assets";

export const Carousel: React.FC = () => {
  const rootRef = useRef<TgEl>(null);

  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;

    tg.initializer = (inst) => {
      const c2Els = Array.from(inst.querySelectorAll<HTMLElement>(".wc2-seq"));

      const render = (ms: number) => {
        const t = CAROUSEL_ABS_START + ms / 1000;
        const F = t * 30 + 1;

        const cOn = F >= 165.5 && F < 320.5;
        const cIdx = Math.max(0, Math.min(154, Math.round(F) - 166));
        c2Els.forEach((el, ii) => st(el, "opacity", cOn && ii === cIdx ? "1" : "0"));
      };

      const cleanup = inst.addFrameTask(({ ownCurrentTimeMs }) => render(ownCurrentTimeMs));
      render(0);
      return cleanup;
    };
    return () => { tg.initializer = undefined; };
  }, []);

  return (
    <Timegroup ref={rootRef as React.Ref<HTMLElement>} mode="fixed" duration={`${CAROUSEL_MS}ms`} className="absolute inset-0">
      {Array.from({ length: 155 }, (_, i) => (
        <div key={i} className="wc2-seq" style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: 0 }}>
          <EfImage src={`${A}/c2seq-${166 + i}.jpg`} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }} />
        </div>
      ))}
    </Timegroup>
  );
};
