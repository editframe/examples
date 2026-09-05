/**
 * AppUI — composer + sel macro + mic macro + waveform (8.85–22.75s = 13900ms).
 *
 * Sel (11.73–14.17) and mic (14.17–15.32) stay inside this scene as overlays
 * that hide `.cam` — they are not their own sequence beats. Camera pan
 * (cam / OXTAB / uiDy), waveform bars, recording timer, selector caret, and
 * mic press stay a scene-scoped addFrameTask. UI slide-in and right-controls
 * fade are 1:1 Reveals; sel/mic/cam visibility is CSS instant gates.
 */
import React, { useEffect, useRef } from "react";
import { Timegroup, Image as EfImage } from "@editframe/react";
import { Reveal } from "@shared/components/Reveal";
import {
  APP_UI_MS,
  APP_UI_ABS_START as SCENE_ABS_START,
  clamp,
  seg,
  easeOut,
  lerp,
  type TgEl,
} from "../constants";
import {
  plusPng,
  chevronPng,
  folderPng,
  handPng,
  micPng,
  micSmallPng,
  sendPng,
  sendSmallPng,
  stopPng,
} from "../assets";

const SEL_TEXT = "5.6 Sol Extra High";
const SEL_BLACK = 7;
const TRANSCRIPT =
  "Help me build a go-to-market deck for a new product line covering materials, financial projections, and marketing.";

const DOT_COLORS = ["#48DF76", "#E886BE", "#3D9BFF", "#EF293F"];

const selTimes: number[] = [];
for (let i = 0; i < SEL_TEXT.length; i++)
  selTimes.push(i < 2 ? 11.9 + i * 0.08 : 12.05 + (i - 2) * 0.0375);

const TR_WORDS = TRANSCRIPT.split(" ");
const TR_TAIL_T = [21.36, 21.44, 21.49, 21.56, 21.65];
const trTimes = TR_WORDS.map((_, i) => (i < 12 ? 21.27 : TR_TAIL_T[i - 12]));
const TR_VIEW_W = 2088;

const REC_START = 14.45;
const STOP_PRESS = 20.88;
const TR_POP = 21.27;

const WAVE_ENTER = 2040;
const WAVE_V = 392;
const WAVE_PITCH = 21;
const WAVE_LAST_BIRTH = 19.94;
const NBARS = Math.floor(((WAVE_LAST_BIRTH - REC_START) * WAVE_V) / WAVE_PITCH) + 1;
const barBirth = (i: number) => REC_START + (i * WAVE_PITCH) / WAVE_V;
const ENV: Array<[number, number]> = [
  [15.55, 1.0],
  [15.95, 0.75],
  [16.3, 0.07],
  [17.0, 1.0],
  [17.6, 0.6],
  [17.95, 0.9],
  [18.1, 0.3],
  [18.35, 1.0],
  [18.55, 0.3],
  [19.3, 0.62],
  [19.45, 0.4],
  [19.6, 1.0],
  [19.8, 0.5],
  [99, 0.15],
];
const envAt = (tb: number) => ENV.find(([u]) => tb < u)![1];
const WAVE_H: number[] = [62,85,39,54,85,85,25,40,85,85,48,68,77,20,56,85,68,84,82,85,71,20,38,85,25,22,60,68,36,12,17,14,12,12,13,36,84,76,68,71,84,85,40,12,34,85,85,52,59,26,14,34,52,52,46,41,42,22,16,52,20,42,72,58,49,52,32,34,78,84,84,51,58,24,12,33,52,51,46,40,42,20,14,51,20,42,58,45,45,52,21,22,38,82,70,57,48,33,32,20,24,16,12];

const DOT_PITCH = 21;
const DOT_X0 = 402;
const DOT_X1 = 1985;
const NDOTS = Math.floor((DOT_X1 - DOT_X0) / DOT_PITCH);

const OXTAB: Array<[number, number]> = [
  [19.05, -21],
  [19.2, -15],
  [19.3, -8],
  [19.4, 2],
  [19.5, 15],
  [19.6, 34],
  [19.7, 60],
  [19.8, 96],
  [19.9, 151],
  [20.0, 245],
  [20.13, 473],
  [20.23, 649],
  [20.33, 718],
  [20.43, 766],
  [20.53, 804],
  [20.63, 822],
  [20.73, 844],
  [20.83, 850],
  [20.93, 869],
  [21.0, 870],
];

const UIDY: Array<[number, number]> = [
  [9.0, 90],
  [9.27, 57],
  [9.4, 48.7],
  [9.53, 44.6],
  [9.67, 42.1],
  [9.8, 40.6],
  [9.93, 39.6],
  [10.07, 37.6],
  [10.2, 34.6],
  [10.33, 27.6],
  [10.65, 9],
  [10.95, 0],
];
function uiDy(t: number): number {
  if (t <= UIDY[0][0]) return UIDY[0][1];
  if (t >= UIDY[UIDY.length - 1][0]) return 0;
  for (let i = 0; i < UIDY.length - 1; i++) {
    const [t0, d0] = UIDY[i];
    const [t1, d1] = UIDY[i + 1];
    if (t >= t0 && t < t1) return lerp(d0, d1, (t - t0) / (t1 - t0));
  }
  return 0;
}

function cam(t: number): { s: number; ox: number; oy: number } {
  if (t < 15.32) {
    const s = t < 10.33 ? 1.0286 : lerp(1.0286, 1.0, easeOut(seg(t, 10.33, 10.95)));
    return { s, ox: 292.7 - 324 / s, oy: 0 };
  }
  let ox: number;
  if (t < 16.6) ox = lerp(55, -21, easeOut(seg(t, 15.32, 16.6)));
  else if (t < OXTAB[0][0]) ox = -21;
  else if (t >= OXTAB[OXTAB.length - 1][0]) ox = 870;
  else {
    ox = 870;
    for (let i = 0; i < OXTAB.length - 1; i++) {
      const [t0, x0] = OXTAB[i];
      const [t1, x1] = OXTAB[i + 1];
      if (t >= t0 && t < t1) {
        ox = lerp(x0, x1, (t - t0) / (t1 - t0));
        break;
      }
    }
  }
  return { s: 1.0, ox, oy: 0 };
}

/* scene-local ms: 9.0–9.3 → 150–450; 14.2–14.45 → 5350–5600 */
const UI_FADE: readonly [number, number] = [150, 450];
const RIGHT_FADE: readonly [number, number] = [5350, 5600];

export const AppUI = () => {
  const rootRef = useRef<TgEl>(null);

  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;

    tg.initializer = (inst) => {
      const q = <T extends HTMLElement>(sel: string) => inst.querySelector(sel) as T;
      const qa = (sel: string) => Array.from(inst.querySelectorAll(sel)) as HTMLElement[];

      const selLine = q(".selline");
      const selRow = q(".selrow");
      const trText = q(".trtext");
      const uiSlide = q(".uislide");
      const camEl = q(".cam");
      const phAsk = q(".ph-ask");
      const phDo = q(".ph-do");
      const lowerbar = q(".lowerbar");
      const composerEl = q(".composer");
      const cbodyEl = q(".cbody");
      const sSel = q(".s-sel");
      const selBarEl = q(".selbarline");
      const selChars = qa(".selc");
      const selDot = q(".seldot");
      const micWrap = q(".micwrap3");
      const micImg = q(".mic3");
      const stopImg = q(".stop3");
      const timerSpans = qa(".tmr");
      const waveGroup = q(".wavegroup");
      const bars = qa(".wbar");
      const wdots = qa(".wdot");
      const micW = q(".micw");
      const stopW = q(".stopw");
      const sendW = q(".sendw");
      const spinW = q(".spinw");
      const spinRing = q(".spinring");
      const wTimer = q(".wtimer");
      const trWordEls = qa(".trw");

      const render = (t: number) => {
        if (t >= 8.85 && t < 22.75) {
          const c = cam(t);
          camEl.style.transform = `scale(${c.s}) translate(${-c.ox}px, ${-c.oy}px)`;
          uiSlide.style.transform = `translateY(${uiDy(t) / c.s}px)`;

          const sw = seg(t, 9.84, 9.96);
          const phVisible = t < 14.45;
          phAsk.style.opacity = phVisible ? `${1 - sw}` : "0";
          phDo.style.opacity = phVisible ? `${sw}` : "0";

          const lbX = -153 * easeOut(seg(t, 20.0, 20.2));
          lowerbar.style.transform = `translate(${lbX}px, ${lerp(
            -155,
            0,
            easeOut(seg(t, 10.05, 10.55))
          )}px)`;
          composerEl.style.borderBottom =
            t < 14.45 ? "1px solid #d9d9d7" : "2px solid #d4d4d2";
          composerEl.style.top = t < 15.32 ? "328px" : "332px";
          cbodyEl.style.transform = `translateY(${t < 15.32 ? 0 : -4}px)`;

          const rec = t >= REC_START && t < STOP_PRESS;
          const spinning = t >= STOP_PRESS && t < TR_POP;
          micW.style.opacity = rec || spinning ? "0" : "1";
          stopW.style.opacity = rec ? "1" : "0";
          spinW.style.opacity = spinning ? "1" : "0";
          spinRing.style.transform = `rotate(${(t - STOP_PRESS) * 380}deg)`;
          selRow.style.opacity = rec ? "0" : "1";

          wTimer.style.opacity = t >= 15.32 && t < STOP_PRESS ? "1" : "0";
          wTimer.textContent = `0:0${clamp(Math.floor(t - 13.97), 0, 6)}`;

          const dip =
            t >= 22.25 && t < 22.4 ? 1 - 0.1 * Math.sin(Math.PI * seg(t, 22.25, 22.4)) : 1;
          sendW.style.transform = `translate(-50%, -50%) scale(${dip})`;

          waveGroup.style.opacity =
            t >= 15.32 && t < STOP_PRESS ? `${seg(t, 15.32, 15.47)}` : "0";
          if (t >= 15.2 && t < STOP_PRESS + 0.1) {
            for (let i = 0; i < bars.length; i++) {
              const el = bars[i];
              const tb = barBirth(i);
              const x = WAVE_ENTER - WAVE_V * (t - tb);
              if (t < tb || x < 410) {
                el.style.opacity = "0";
                continue;
              }
              el.style.opacity = `${x < 445 ? (x - 410) / 35 : 1}`;
              el.style.background = x < 445 ? "#93A198" : "#0a0d08";
              const h = WAVE_H[i] || 14;
              el.style.left = `${x - 210 - 5}px`;
              el.style.height = `${h}px`;
            }
            const leadVis = Math.max(420, WAVE_ENTER - WAVE_V * (t - REC_START));
            const tailVis =
              t < WAVE_LAST_BIRTH ? WAVE_ENTER : WAVE_ENTER - WAVE_V * (t - WAVE_LAST_BIRTH);
            for (let i = 0; i < wdots.length; i++) {
              const x = DOT_X0 + i * DOT_PITCH;
              wdots[i].style.opacity = x < leadVis - 34 || x > tailVis + 10 ? "1" : "0";
            }
          }

          for (let i = 0; i < trWordEls.length; i++)
            trWordEls[i].style.opacity = t >= trTimes[i] ? "1" : "0";
          let lastW: HTMLElement | null = null;
          for (const w of trWordEls) if (w.style.opacity === "1") lastW = w;
          const tw = lastW ? lastW.offsetLeft + lastW.offsetWidth : 0;
          trText.style.transform = `translateX(${-Math.max(197, tw - TR_VIEW_W)}px)`;
        }

        if (t >= 11.73 && t < 14.17) {
          const ss = lerp(1.0, 1.045, seg(t, 11.73, 14.17));
          sSel.style.transform = `scale(${ss})`;
          selBarEl.style.top = `${535 + 339 / ss - 2}px`;
          const pan = lerp(500, 0, seg(t, 11.87, 12.45));
          selLine.style.left = `${270 + pan}px`;
          let lastIdx = -1;
          for (let i = 0; i < selChars.length; i++) {
            const on = t >= selTimes[i];
            selChars[i].style.opacity = on ? "1" : "0";
            if (on) lastIdx = i;
          }
          if (t < 12.4) {
            selDot.style.opacity = "1";
            const anchor = lastIdx >= 0 ? selChars[lastIdx] : null;
            const xEnd = anchor ? anchor.offsetLeft + anchor.offsetWidth : 0;
            selDot.style.left = `${270 + pan + xEnd + 26}px`;
            selDot.style.background = DOT_COLORS[Math.floor(Math.max(0, t - 11.85) / 0.15) % 4];
          } else selDot.style.opacity = "0";
        }

        if (t >= 14.17 && t < 15.32) {
          const gIn = seg(t, 14.17, 14.27);
          micWrap.style.opacity = `${gIn}`;
          const press =
            t >= 14.32 && t < 14.45 ? 1 - 0.08 * Math.sin(Math.PI * seg(t, 14.32, 14.45)) : 1;
          micWrap.style.transform = `translate(-50%, -50%) scale(${
            lerp(0.85, 1, easeOut(gIn)) * press
          })`;
          const rec3 = t >= 14.45;
          micImg.style.opacity = rec3 ? "0" : "1";
          stopImg.style.opacity = rec3 ? "1" : "0";
          timerSpans[0].style.opacity = rec3 && t < 14.97 ? "1" : "0";
          timerSpans[1].style.opacity = t >= 14.97 ? "1" : "0";
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
      duration={`${APP_UI_MS}ms`}
      className="absolute w-full h-full"
    >
      <div className="scene s-ui">
        <div className="cam" style={{ animation: "instant-hide 0ms 2880ms both, instant-show 0ms 6470ms forwards" }}>
          <Reveal enter={UI_FADE} y={0} easeIn="linear" className="absolute inset-0">
            <div className="uislide">
              <div className="lowerbar">
                <EfImage className="lbicon" src={folderPng} style={{ left: 61, top: 53, width: 50, aspectRatio: "50 / 46" }} />
                <span className="lbdark" style={{ left: 132 }}>
                  Project
                </span>
                <span className="lbgray" style={{ left: 292 }}>
                  New Lamp Concept
                </span>
                <EfImage className="lbicon" src={handPng} style={{ left: 761, top: 51, width: 43, aspectRatio: "43 / 50" }} />
                <span className="lbdark" style={{ left: 827 }}>
                  Permissions
                </span>
                <span className="lbgray" style={{ left: 1092 }}>
                  Ask for approval
                </span>
              </div>
              <div className="composer">
                <div className="cbody">
                  <span className="ph ph-ask">Ask anything</span>
                  <span className="ph ph-do" style={{ opacity: 0 }}>
                    Do anything
                  </span>
                  <EfImage className="plusicon" src={plusPng} />
                  <div className="trview">
                    <div className="trtext">
                      {TR_WORDS.map((w, i) => (
                        <span key={i} className="trw" style={{ opacity: 0 }}>
                          {w}{" "}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="wavegroup" style={{ opacity: 0 }}>
                    {Array.from({ length: NDOTS }, (_, i) => (
                      <div
                        key={i}
                        className="wdot"
                        style={{ left: DOT_X0 + i * DOT_PITCH - 210, opacity: 0 }}
                      />
                    ))}
                    {Array.from({ length: NBARS }, (_, i) => (
                      <div key={i} className="wbar" style={{ opacity: 0 }} />
                    ))}
                  </div>
                  <Reveal enter={RIGHT_FADE} y={0} easeIn="linear" className="rightgrp">
                    <div className="selrow">
                      <span className="selblack">5.6 Sol</span>
                      <span className="selgray">Extra High</span>
                      <EfImage className="chev" src={chevronPng} />
                    </div>
                    <div className="ctl micw" style={{ left: 2079 }}>
                      <EfImage src={micSmallPng} />
                    </div>
                    <div className="ctl stopw" style={{ left: 2067, opacity: 0 }}>
                      <EfImage src={stopPng} />
                    </div>
                    <div className="ctl spinw" style={{ left: 2071, opacity: 0 }}>
                      <div className="spinring" />
                    </div>
                    <div className="ctl sendw" style={{ left: 2191 }}>
                      <EfImage src={sendSmallPng} />
                    </div>
                    <span className="wtimer" style={{ opacity: 0 }}>
                      0:01
                    </span>
                  </Reveal>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div
        className="scene s-sel"
        style={{ animation: "instant-show 0ms 2880ms both, instant-hide 0ms 5320ms forwards" }}
      >
        <div className="selline">
          {SEL_TEXT.split("").map((c, i) => (
            <span
              key={i}
              className={`selc ${i < SEL_BLACK ? "sb" : "sg"}`}
              style={{ opacity: 0 }}
            >
              {c}
            </span>
          ))}
        </div>
        <div className="seldot" style={{ opacity: 0 }} />
        <div className="selbarline" />
      </div>

      <div
        className="scene s-mic"
        style={{ animation: "instant-show 0ms 5320ms both, instant-hide 0ms 6470ms forwards" }}
      >
        <div className="edge-r" />
        <div className="edge-b" />
        <div className="corner-br" />
        <span className="timer">
          <span className="tmr" style={{ opacity: 0 }}>
            0:00
          </span>
          <span className="tmr" style={{ opacity: 0 }}>
            0:01
          </span>
        </span>
        <div className="micwrap3" style={{ opacity: 0 }}>
          <EfImage className="mic3" src={micPng} />
          <EfImage className="stop3" src={stopPng} style={{ opacity: 0 }} />
        </div>
        <div className="send3">
          <EfImage src={sendPng} />
        </div>
      </div>
    </Timegroup>
  );
};
