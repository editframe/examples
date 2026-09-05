/**
 * Prompt — S3 chat upload + S3b sent (3.45–8.93s).
 * Hard cut at 7.33 stays inside this scene. CAM3 punch ~6.25.
 */
import React, { useEffect, useRef } from "react";
import { Timegroup, Video as Clip, Image as EfImage } from "@editframe/react";
import { ArrowUp, CursorSvg, Star, WavIcon } from "../components/Icons";
import { W } from "../components/Word";
import { PORTRAIT_SRC, PROMPT_ABS_S, PROMPT_MS, THUMB_SEQ } from "../constants";
import {
  collectGroups,
  dotsAt,
  easeIO,
  easeOut,
  kf,
  lerp,
  seg,
  updateWords,
  type KF,
  type TgEl,
} from "../lib";

const CAM3_S: KF = [[3.45, 1.0], [3.9, 1.0], [4.15, 1.6], [4.63, 1.62], [5.3, 1.0], [6.253, 1.035], [6.267, 5.85], [7.33, 5.85]];
const CAM3_TX: KF = [[3.45, 0], [3.9, 0], [4.15, -1], [4.63, -6], [5.3, 0], [6.253, -19.2],
  [6.267, -5532.6], [6.3, -5564.6], [6.333, -5579.1], [6.4, -5596.1], [6.467, -5607.1],
  [6.533, -5614.1], [6.6, -5618.6], [6.667, -5621.6], [6.733, -5624.6], [6.8, -5627.6],
  [6.867, -5630.1], [6.933, -5634.1], [7.0, -5636.6], [7.067, -5640.1], [7.133, -5642.6],
  [7.2, -5645.6], [7.33, -5651]];
const CAM3_TY: KF = [[3.45, 0], [3.9, 0], [4.15, -211], [4.63, -217], [5.3, 0], [6.253, -10.8],
  [6.267, -2582.5], [7.0, -2583.5], [7.067, -2586.5], [7.133, -2592], [7.2, -2604], [7.33, -2627.5]];
const CUR3_X: KF = [[3.93, 774], [4.1, 509], [4.28, 280], [4.45, 268], [5.2, 305], [6.1, 905], [6.25, 1055],
  [6.333, 1066.2], [6.4, 1073.5], [6.467, 1078.3], [6.6, 1081.1], [6.8, 1081.5], [7.33, 1081.6]];
const CUR3_Y: KF = [[3.93, 198], [4.1, 263], [4.28, 306], [4.45, 300], [5.2, 300], [6.1, 470], [6.25, 507],
  [6.333, 509.3], [6.4, 511], [6.467, 512], [6.6, 511.8], [6.8, 512.8], [7.33, 513]];
const SEND3_SQ: KF = [[6.267, 0.967], [6.35, 1.0], [6.45, 1.0], [6.53, 0.86], [6.6, 0.786],
  [6.667, 0.852], [6.733, 0.94], [6.79, 0.985], [6.86, 1.008], [6.95, 0.99], [7.1, 0.995]];
const TH_X: KF = [[3.62, 1160], [3.85, 850], [4.1, 450], [4.28, 235], [4.43, 180]];
const TH_Y: KF = [[3.62, 48], [3.85, 120], [4.1, 205], [4.28, 262], [4.43, 282]];
const TH_W: KF = [[3.62, 150], [3.85, 178], [4.1, 212], [4.28, 158], [4.43, 111]];
const CARD3_T: KF = [[3.45, 388], [4.4, 388], [4.6, 255]];

export const Prompt = () => {
  const rootRef = useRef<TgEl>(null);

  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;
    tg.initializer = (inst) => {
      const q = <T extends HTMLElement>(sel: string) => inst.querySelector(sel) as T;
      const { byG, gFinal } = collectGroups(inst);

      const s3 = q(".s3"),
        cam3 = q(".cam3"),
        thumb3 = q(".thumb3"),
        cur3 = q(".cur3"),
        send3 = q(".send3"),
        send3a1 = q(".send3 .sa1"),
        send3a2 = q(".send3 .sa2"),
        card3 = q(".card3"),
        wav3 = q(".wav3"),
        s3enter = q(".s3enter"),
        playring3 = q(".thumb3 .playring");
      const s3b = q(".s3b"),
        inlineCard = q(".inlinecard"),
        inlinePill = q(".inlinepill");

      const render = (ms: number) => {
        const t = PROMPT_ABS_S + ms / 1000;
        updateWords(t, byG, gFinal);

        const s3on = t >= 3.45 && t < 7.33;
        s3.style.opacity = s3on ? "1" : "0";
        if (s3on) {
          const s = kf(CAM3_S, t);
          cam3.style.transform = `translate(${kf(CAM3_TX, t)}px,${kf(CAM3_TY, t)}px) scale(${s})`;
          const ent = easeOut(seg(t, 3.45, 3.58));
          s3enter.style.transform = `translateY(${55 * (1 - ent)}px) scaleY(${1 + 0.11 * (1 - ent)})`;
          s3enter.style.opacity = String(seg(t, 3.45, 3.53));
          const dev = 13 * (1 - seg(t, 3.45, 3.6));
          s3enter.style.filter = dev > 0.25 ? `blur(${(dev * 0.55).toFixed(2)}px)` : "none";
          const c3t = kf(CARD3_T, t);
          card3.style.top = `${c3t}px`;
          const cu3 = t >= 6.253;
          card3.style.width = cu3 ? "974.5px" : "959px";
          card3.style.height = `${(cu3 ? 551 : 543) - c3t}px`;
          const tw = kf(TH_W, t), th = tw * 0.91;
          thumb3.style.left = `${kf(TH_X, t)}px`;
          thumb3.style.top = `${kf(TH_Y, t)}px`;
          thumb3.style.width = `${tw}px`;
          thumb3.style.height = `${th}px`;
          thumb3.style.filter = t < 4.2 ? `blur(${5.5 * (1 - seg(t, 3.62, 4.15))}px)` : "none";
          const rw = tw * 0.27;
          playring3.style.left = `${(tw - rw) / 2}px`;
          playring3.style.top = `${(th - rw) / 2 - 1}px`;
          playring3.style.width = `${rw}px`;
          playring3.style.height = `${rw}px`;
          const pop = t < 4.43 ? 0 : easeOut(seg(t, 4.43, 4.65));
          thumb3.style.opacity = String(seg(t, 3.62, 3.72));
          thumb3.style.transform = `scale(${t < 4.43 ? 1 : lerp(0.96, 1, pop)})`;
          cur3.style.opacity = t >= 3.93 ? "1" : "0";
          wav3.style.opacity = t < 4.9 ? "1" : "0";
          send3.style.opacity = t >= 4.9 ? "1" : "0";
          cur3.style.transform = `translate(${kf(CUR3_X, t)}px,${kf(CUR3_Y, t)}px) scale(${t >= 6.253 ? 1.43 : 1})`;
          send3.style.filter = "none";
          send3.style.transform = `scale(${kf(SEND3_SQ, t)})`;
          const swpA = easeIO(seg(t, 6.62, 6.78));
          const swpB = easeOut(seg(t, 6.66, 6.95));
          if (send3a1) send3a1.style.transform = `translateY(${(-34 * swpA).toFixed(1)}px)`;
          if (send3a2) send3a2.style.transform = `translateY(${(34 * (1 - swpB)).toFixed(1)}px)`;
        }

        const s3bon = t >= 7.33 && t < 8.93;
        s3b.style.opacity = s3bon ? String(seg(t, 7.33, 7.4) * (1 - seg(t, 8.78, 8.93))) : "0";
        if (s3bon) {
          const up = easeOut(seg(t, 7.33, 7.44));
          const exit = easeIO(seg(t, 8.7, 8.93));
          s3b.style.transform = `translateY(${lerp(16, 0, up) - 26 * seg(t, 7.6, 8.7) - 60 * exit}px) scale(${1 + 1.25 * exit})`;
          const ip = easeOut(seg(t, 8.55, 8.78));
          inlineCard.style.opacity = String(seg(t, 8.55, 8.68));
          inlineCard.style.transform = `scale(${lerp(0.9, 1, ip)})`;
          inlinePill.textContent = "Analyzing" + dotsAt(t, 8.55);
        }
      };

      const cleanup = inst.addFrameTask(({ ownCurrentTimeMs }) => render(ownCurrentTimeMs));
      render(0);
      return cleanup;
    };
    return () => {
      tg.initializer = undefined;
    };
  }, []);

  return (
    <Timegroup ref={rootRef as React.Ref<HTMLElement>} mode="fixed" duration={`${PROMPT_MS}ms`} className="absolute w-full h-full">
      <div className="scene s3">
        <div className="cam cam3">
          <div className="s3enter" style={{ position: "absolute", inset: 0 }}>
            <div className="chathdr" style={{ top: 132 }}>
              <span className="hf">Higgsfield /MCP</span>
              <span className="star">
                <Star size={44} color="#E08A74" />
              </span>
              <span className="cl serif">Claude</span>
            </div>
            <div className="inputcard card3" style={{ left: 163, top: 255, width: 959, height: 288 }} />
            <div className="typed" style={{ left: 189, top: 412 }}>
              <W g="msg" t="Analyze this video, I want to create something like that!" />
            </div>
            <div className="plus" style={{ left: 196, top: 492 }}>+</div>
            <div className="opus" style={{ left: 828, top: 494 }}>Opus 4.7</div>
            <div className="adaptive" style={{ left: 928, top: 495 }}>Adaptive</div>
            <svg viewBox="0 0 14 9" style={{ position: "absolute", left: 1014, top: 501, width: 14, height: 9 }}>
              <path d="M1.5 1.5 L7 7 L12.5 1.5" stroke="#a8a8a8" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="wavicon wav3" style={{ left: 1063, top: 496 }}>
              <WavIcon size={22} color="#2f2f2f" />
            </div>
            <div className="sendbtn send3" style={{ left: 1057, top: 485, opacity: 0, overflow: "hidden" }}>
              <div className="sa1" style={{ position: "absolute", inset: 0 }}>
                <ArrowUp size={21} color="#fff" />
              </div>
              <div className="sa2" style={{ position: "absolute", inset: 0 }}>
                <ArrowUp size={21} color="#fff" />
              </div>
            </div>
          </div>
          <div className="thumb thumb3" style={{ left: 180, top: 282, width: 111, height: 101, opacity: 0 }}>
            <EfImage src={PORTRAIT_SRC} />
            <Timegroup mode="sequence" className="vseq3">
              <Timegroup mode="fixed" duration="0.17s"><div /></Timegroup>
              <Timegroup mode="fixed" duration="3.71s"><Clip src={THUMB_SEQ} className="vfill" /></Timegroup>
            </Timegroup>
            <div className="playring" style={{ left: 40, top: 35, width: 30, height: 30 }} />
          </div>
          <div className="cursor cur3">
            <CursorSvg size={30} />
          </div>
        </div>
      </div>

      <div className="scene s3b">
        <div className="movcard" style={{ left: 1085, top: -46, width: 200, height: 166 }}>
          <div className="movlbl">MOV</div>
        </div>
        <div className="bub" style={{ left: 810, top: 133, width: 520, height: 100 }}>
          <div className="bubtxt">
            Analyze this video, I want to create
            <br />
            something like that!
          </div>
        </div>
        <div className="aistat" style={{ left: 289, top: 335 }}>
          <W g="ais" t="Strategized video analysis and creative replication approach" />
        </div>
        <div className="aitype" style={{ left: 289, top: 368 }}>
          <W g="ait" t="I'll analyze the video for you. Let me extract frames and examine it.." />
        </div>
        <div className="aistart" style={{ left: 289, top: 412 }}>
          <W g="ast" t="Analyzing started..." />
        </div>
        <div className="inlinecard" style={{ left: 290, top: 440, width: 398, height: 222 }}>
          <EfImage src={PORTRAIT_SRC} />
          <div className="inlinepill">Analyzing.</div>
        </div>
      </div>
    </Timegroup>
  );
};
