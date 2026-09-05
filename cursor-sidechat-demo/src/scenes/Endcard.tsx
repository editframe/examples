/**
 * Endcard — "Side Chats" words + cube.
 *
 * Exclusive 10.55–17.2 = 6650ms. Sequence overlap mounts this scene at
 * 10.55 while Windows is still up through 10.78, so the fade sits over
 * Window B on the original music beat.
 *
 * addFrameTask stays for cube spin / word-group left keyframes / blur fades —
 * not 1:1 CSS (coupled opacity+blur+measured left).
 */
import React, { useEffect, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { CubeLogo } from "../components/CubeLogo";
import { ENDCARD_ABS_START, ENDCARD_MS } from "../constants";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a), 0, 1);
const easeIO = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
type KF = Array<[number, number]>;
const kf = (tab: KF, t: number) => {
  if (t <= tab[0][0]) return tab[0][1];
  for (let i = 1; i < tab.length; i++)
    if (t <= tab[i][0]) {
      const [t0, v0] = tab[i - 1];
      const [t1, v1] = tab[i];
      return lerp(v0, v1, (t - t0) / (t1 - t0));
    }
  return tab[tab.length - 1][1];
};

const ECL: KF = [
  [10.72, 935], [10.97, 815], [11.2, 795], [11.5, 787], [12.23, 787], [12.37, 565], [12.5, 549], [12.7, 545],
];

type TgEl = HTMLElement & {
  initializer?: (inst: TgEl) => (() => void) | void;
  addFrameTask: (cb: (info: { ownCurrentTimeMs: number }) => void) => () => void;
};

export const Endcard = () => {
  const rootRef = useRef<TgEl>(null);

  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;
    tg.initializer = (inst) => {
      const q = <T extends HTMLElement>(sel: string) => inst.querySelector(sel) as T;

      const endcard = q(".endcard");
      const ecwrap = q(".ecwrap");
      const ecgrp = q(".ecgrp");
      const wSide = q(".wSide");
      const wChats = q(".wChats");
      const avail = q(".avail");
      const cubewrap = q(".cubewrap");
      const cube3d = q(".cube3d");
      const spinner = q(".spinner");
      const cubeflat = q(".cubeflat");

      let availBase = 920;
      const fontsApi: any = (document as any).fonts;
      if (fontsApi?.load) {
        ["600 74px Inter"].forEach((f) => fontsApi.load(f));
      }
      const measure = () => {
        availBase = 545 + ecgrp.offsetWidth + 26;
      };
      measure();

      const render = (ms: number) => {
        const t = ENDCARD_ABS_START + ms / 1000;
        measure();

        endcard.style.opacity = String(seg(t, 10.55, 10.78));
        const gl = kf(ECL, t);
        ecgrp.style.left = `${gl}px`;
        const p1 = seg(t, 10.7, 10.85);
        wSide.style.opacity = String(p1);
        wSide.style.filter = `blur(${6 * (1 - p1)}px)`;
        const p2 = seg(t, 11.02, 11.35);
        wChats.style.opacity = String(p2);
        wChats.style.filter = `blur(${8 * (1 - p2)}px)`;
        avail.style.left = `${kf([[12.3, availBase + 29], [12.7, availBase]], t)}px`;
        avail.style.opacity = String(seg(t, 12.28, 12.5));
        const po = easeIO(seg(t, 13.97, 14.2));
        ecwrap.style.transform = `scale(${lerp(1, 0.85, po)})`;
        ecwrap.style.opacity = String(1 - seg(t, 13.99, 14.2));
        ecwrap.style.filter = `blur(${4 * po}px)`;
        const cvis2 = t >= 14.17;
        cubewrap.style.opacity = String(cvis2 ? seg(t, 14.17, 14.25) : 0);
        if (cvis2) {
          const spin = lerp(-380, 0, easeIO(seg(t, 14.17, 15.05)));
          const csc = kf([[14.17, 1.9], [14.6, 1.25], [15.05, 1]], t);
          cube3d.style.transform = `scale(${csc}) rotateX(-30deg)`;
          spinner.style.transform = `rotateY(${45 + spin}deg)`;
          const cb = 6 * (1 - seg(t, 14.17, 14.6));
          cubewrap.style.filter = cb > 0.05 ? `blur(${cb}px)` : "none";
          const xf = seg(t, 15.0, 15.12);
          cube3d.style.opacity = String(1 - xf);
          cubeflat.style.opacity = String(xf);
          cubeflat.style.transform = `scale(${csc})`;
        }
      };

      render(0);
      const cleanup = inst.addFrameTask(({ ownCurrentTimeMs }) => render(ownCurrentTimeMs));
      return () => cleanup();
    };
    return () => {
      tg.initializer = undefined;
    };
  }, []);

  return (
    <Timegroup ref={rootRef as React.Ref<HTMLElement>} mode="fixed" duration={`${ENDCARD_MS}ms`} className="absolute w-full h-full">
      <div className="endcard">
        <div className="ecwrap" style={{ transformOrigin: "960px 541px" }}>
          <div className="ecline">
            <div className="ecgrp">
              <span className="wSide">Side</span>
              <span className="wChats"> Chats</span>
            </div>
            <div className="avail"><span>Available Now</span></div>
          </div>
        </div>
        <div className="cubewrap">
          <div className="cube3d">
            <div className="spinner">
              <div className="face" style={{ transform: "translateZ(39px)" }}>
                <svg width="78" height="78" viewBox="0 0 78 78">
                  <path d="M0 0 L74 2 L39 62 L39 22 Z" fill="#f7f7f7" transform="translate(2,8) scale(0.94)" />
                </svg>
              </div>
              <div className="face" style={{ transform: "rotateY(90deg) translateZ(39px)" }} />
              <div className="face" style={{ transform: "rotateX(90deg) translateZ(39px)" }} />
            </div>
          </div>
          <div className="cubeflat"><CubeLogo w={114} /></div>
        </div>
      </div>
    </Timegroup>
  );
};
