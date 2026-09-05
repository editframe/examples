/**
 * Intro — Logo bloom + H1 "Introducing ChatGPT Work" (0–6.43s = 6430ms).
 *
 * Logo and H1 share this Timegroup so the original 100ms overlap (Logo until
 * 3.2s, H1 from 3.1s) is a CSS opacity gate, not a sequence blend. Blossom
 * morph, appicon drift, typewriter recenter, and accent-color steps stay a
 * scene-scoped addFrameTask (no closed-form CSS equivalent).
 */
import React, { useEffect, useRef } from "react";
import { Timegroup, Image as EfImage } from "@editframe/react";
import {
  INTRO_MS,
  INTRO_ABS_START as SCENE_ABS_START,
  seg,
  easeOut,
  easeIO,
  lerp,
  recenter,
  type TgEl,
} from "../constants";
import { blossomPng, blossomBPng, appiconPng } from "../assets";

const H1_BASE = "Introducing ChatGPT ";
const H1_ACCENT = "Work";

const ACC_KF: Array<[number, string]> = [
  [4.83, "#3D9BFF"],
  [5.0, "#3DCA76"],
  [5.17, "#FA78C0"],
  [5.28, "#EF293F"],
  [5.36, "#0087FC"],
];

const h1Times: number[] = [];
for (let i = 0; i < H1_BASE.length; i++) h1Times.push(3.15 + (i + 1) / 13);
const H1_ACC_T = [4.83, 5.0, 5.2, 5.47];

export const Intro = () => {
  const rootRef = useRef<TgEl>(null);

  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;

    tg.initializer = (inst) => {
      const q = <T extends HTMLElement>(sel: string) => inst.querySelector(sel) as T;
      const qa = (sel: string) => Array.from(inst.querySelectorAll(sel)) as HTMLElement[];

      const blossom = q(".blossom");
      const blossomB = q(".blossomB");
      const appicon = q(".appicon");
      const h1BaseChars = qa(".h1b");
      const h1AccChars = qa(".h1a");
      const h1Acc = q(".h1acc");
      const h1Line = q(".h1line");

      const render = (t: number) => {
        if (t < 3.2) {
          const rot = 90 * easeIO(seg(t, 0, 1.1));
          const BSZ: Array<[number, number]> = [
            [0, 120],
            [0.13, 148],
            [0.5, 172],
            [0.9, 182],
          ];
          let bsz = 182;
          for (let k = 0; k < BSZ.length - 1; k++)
            if (t >= BSZ[k][0] && t < BSZ[k + 1][0])
              bsz = lerp(BSZ[k][1], BSZ[k + 1][1], (t - BSZ[k][0]) / (BSZ[k + 1][0] - BSZ[k][0]));
          if (t < 0) bsz = 120;
          const bsc = bsz / 182;
          const morph = seg(t, 0.15, 0.45);
          const fadeAll = 1 - seg(t, 1.1, 1.32);
          blossom.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(${bsc})`;
          blossomB.style.transform = `translate(-50%, -50%) rotate(${rot - 40.3}deg) scale(${bsc})`;
          blossom.style.opacity = `${(1 - morph) * fadeAll}`;
          blossomB.style.opacity = `${morph * fadeAll}`;
          const aIn = easeOut(seg(t, 1.1, 1.35));
          const drift = lerp(1.0, 0.94, seg(t, 1.35, 2.95));
          const aOut = 1 - seg(t, 2.95, 3.15);
          appicon.style.opacity = `${aIn * aOut}`;
          appicon.style.transform = `translate(-50%, -50%) scale(${
            lerp(0.9, 1, aIn) * drift * lerp(1, 0.9, seg(t, 2.95, 3.15))
          })`;
        }

        if (t >= 3.1 && t < 6.43) {
          for (let i = 0; i < h1BaseChars.length; i++)
            h1BaseChars[i].style.opacity = t >= h1Times[i] ? "1" : "0";
          for (let i = 0; i < h1AccChars.length; i++)
            h1AccChars[i].style.opacity = t >= H1_ACC_T[i] ? "1" : "0";
          let col = ACC_KF[0][1];
          for (const [kt, c] of ACC_KF) if (t >= kt) col = c;
          h1Acc.style.color = col;
          recenter(h1Line, [...h1BaseChars, ...h1AccChars]);
        }
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
      duration={`${INTRO_MS}ms`}
      className="absolute w-full h-full"
    >
      <div className="scene s-logo" style={{ animation: "instant-hide 0ms 3200ms both" }}>
        <EfImage className="blossom" src={blossomPng} />
        <EfImage className="blossomB" src={blossomBPng} style={{ opacity: 0 }} />
        <EfImage className="appicon" src={appiconPng} style={{ opacity: 0 }} />
      </div>

      <div className="scene headline s-h1" style={{ animation: "instant-show 0ms 3100ms both" }}>
        <div className="hline h1line">
          {H1_BASE.split("").map((c, i) => (
            <span key={i} className="h1b" style={{ opacity: 0 }}>
              {c}
            </span>
          ))}
          <span className="h1acc">
            {H1_ACCENT.split("").map((c, i) => (
              <span key={i} className="h1a" style={{ opacity: 0 }}>
                {c}
              </span>
            ))}
          </span>
        </div>
      </div>
    </Timegroup>
  );
};
