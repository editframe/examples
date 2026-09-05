/**
 * Close — "Connect to the apps you already use" (22.75–26s = 3250ms).
 *
 * Hard cut in. Typewriter recenter + the line-2 vertical ease stay a
 * scene-scoped addFrameTask.
 */
import React, { useEffect, useRef } from "react";
import { Timegroup } from "@editframe/react";
import {
  CLOSE_MS,
  CLOSE_ABS_START as SCENE_ABS_START,
  seg,
  easeOut,
  recenter,
  type TgEl,
} from "../constants";

const H3_L1 = "Connect to the apps";
const H3_L2 = "you already use";
const h3All = H3_L1 + " " + H3_L2;
const h3Times: number[] = [];
for (let i = 0; i < h3All.length; i++) h3Times.push(23.1 + (i + 1) / 24);

export const Close = () => {
  const rootRef = useRef<TgEl>(null);

  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;

    tg.initializer = (inst) => {
      const q = <T extends HTMLElement>(sel: string) => inst.querySelector(sel) as T;
      const qa = (sel: string) => Array.from(inst.querySelectorAll(sel)) as HTMLElement[];

      const h3Line1 = q(".h3l1");
      const h3Line2 = q(".h3l2");
      const h3Block = q(".h3block");
      const h3Chars = qa(".h3c");

      const render = (t: number) => {
        const n1 = H3_L1.length;
        for (let i = 0; i < h3Chars.length; i++)
          h3Chars[i].style.opacity = t >= h3Times[i < n1 ? i : i + 1] ? "1" : "0";
        const l2s = h3Times[n1 + 1];
        const y = t < l2s ? 40 : -8 + 22 * (1 - easeOut(seg(t, 24.05, 24.3)));
        h3Block.style.transform = `translateY(${y}px)`;
        recenter(h3Line1, h3Chars.slice(0, n1));
        recenter(h3Line2, h3Chars.slice(n1));
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
      duration={`${CLOSE_MS}ms`}
      className="absolute w-full h-full"
    >
      <div className="scene headline s-h3">
        <div className="h3block">
          <div className="hline h3l1">
            {H3_L1.split("").map((c, i) => (
              <span key={i} className="h3c" style={{ opacity: 0 }}>
                {c}
              </span>
            ))}
          </div>
          <div className="hline h3l2">
            {H3_L2.split("").map((c, i) => (
              <span key={`b${i}`} className="h3c" style={{ opacity: 0 }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Timegroup>
  );
};
