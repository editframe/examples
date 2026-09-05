/**
 * Headline2 — "Built to take on your most ambitious ideas" (6.43–8.85s = 2420ms).
 *
 * Hard cut in/out (sequence overlap 0). Typewriter recenter + the line-2
 * vertical settle stay a scene-scoped addFrameTask.
 */
import React, { useEffect, useRef } from "react";
import { Timegroup } from "@editframe/react";
import {
  HEADLINE2_MS,
  HEADLINE2_ABS_START as SCENE_ABS_START,
  recenter,
  type TgEl,
} from "../constants";

const H2_L1 = "Built to take on your most";
const H2_L2 = "ambitious ideas";
const h2All = H2_L1 + " " + H2_L2;
const h2Times: number[] = [];
for (let i = 0; i < h2All.length; i++) h2Times.push(6.45 + (i + 1) / 39);

export const Headline2 = () => {
  const rootRef = useRef<TgEl>(null);

  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;

    tg.initializer = (inst) => {
      const q = <T extends HTMLElement>(sel: string) => inst.querySelector(sel) as T;
      const qa = (sel: string) => Array.from(inst.querySelectorAll(sel)) as HTMLElement[];

      const h2Line1 = q(".h2l1");
      const h2Line2 = q(".h2l2");
      const h2Block = q(".h2block");
      const h2Chars = qa(".h2c");

      const render = (t: number) => {
        const n1 = H2_L1.length;
        for (let i = 0; i < h2Chars.length; i++)
          h2Chars[i].style.opacity = t >= h2Times[i < n1 ? i : i + 1] ? "1" : "0";
        const line2Start = h2Times[n1 + 1];
        h2Block.style.transform = `translateY(${(t < line2Start ? 46 : 0) + 8}px)`;
        recenter(h2Line1, h2Chars.slice(0, n1));
        recenter(h2Line2, h2Chars.slice(n1));
      };

      const cleanup = inst.addFrameTask(({ ownCurrentTimeMs }) => {
        const t = SCENE_ABS_START + ownCurrentTimeMs / 1000;
        render(t);
      });
      render(SCENE_ABS_START);
      return cleanup;
    };

    return () => {
      tg.initializer = undefined;
    };
  }, []);

  return (
    <Timegroup
      ref={rootRef as React.Ref<HTMLElement>}
      mode="fixed"
      duration={`${HEADLINE2_MS}ms`}
      className="absolute w-full h-full"
    >
      <div className="scene headline s-h2">
        <div className="h2block">
          <div className="hline h2l1">
            {H2_L1.split("").map((c, i) => (
              <span key={i} className="h2c" style={{ opacity: 0 }}>
                {c}
              </span>
            ))}
          </div>
          <div className="hline h2l2">
            {H2_L2.split("").map((c, i) => (
              <span key={`b${i}`} className="h2c" style={{ opacity: 0 }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Timegroup>
  );
};
