/**
 * Charts — E + F + G (7.15–13.06s, declared 5910ms).
 *
 * E fullscreen pan, F card (lerps into G top-left), G language cards.
 * G stays mounted through its 12.995–13.06 fade so the globe can fly in
 * behind the cards. t = 7.15 + ownCurrentTimeMs/1000.
 */
import React, { useEffect, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { CHARTS_ABS_START, CHARTS_MS } from "../constants";
import { easeIO, easeOut, kf, lerp, pathFrom, seg, type KF, type TgEl } from "../lib/anim";
import chartE from "../assets/chartE.json";
import chartF from "../assets/chartF.json";
import chartsG from "../assets/chartsG.json";

const E_PAN: KF = (chartE as { pan: KF }).pan;
const E_TIP: KF = [[7.17, 1050], [7.23, 1123], [7.37, 1249], [7.5, 1334], [7.63, 1334], [7.77, 1305], [7.9, 1276], [8.03, 1252], [8.17, 1235], [8.3, 1212], [8.43, 1184], [8.57, 1159], [8.7, 1144], [8.83, 1138], [8.97, 1135], [9.1, 1133], [9.23, 1166], [9.37, 1235], [9.5, 1342], [9.63, 1412], [9.77, 1499], [9.95, 1600]];
const E_MASTER = (chartE as { master: Array<[number, number]> }).master;

const F_SCALE: KF = [[9.74, 1.17], [9.83, 1.146], [9.9, 1.115], [9.97, 1.096], [10.1, 1.069], [10.3, 1.045], [10.5, 1.029], [10.7, 1.017], [10.9, 1.01], [11.03, 1.0026], [11.08, 1.0]];
const F_RECT = { x: 541, y: 203, w: 837, h: 671 };
const G_TL = { x: 426, y: 113, w: 523, h: 418 };
const F_CHART = chartF as Array<[number, number]>;

const G_CARDS = [
  { x: 972, y: 111, w: 523, h: 418, key: "TR", title: "Resolution rate", value: "74.5%", nlines: 5, ylab: [["100%", 0], ["50%", 2], ["0%", 4]] as Array<[string, number]>, xlab: ["17 Aug", "24 Aug"], xr: 471 },
  { x: 425, y: 550, w: 523, h: 421, key: "BL", title: "Average handle time", value: "6m 04s", nlines: 5, ylab: [["10’", 0], ["5’", 2], ["0", 4]] as Array<[string, number]>, xlab: ["17 Aug", "24 Aug"], xr: 465 },
  { x: 972, y: 550, w: 523, h: 421, key: "BR", title: "Abandonment rate", value: "2.5%", nlines: 6, ylab: [["5%", 0], ["4%", 1], ["3%", 2], ["2%", 3], ["1%", 4], ["0%", 5]] as Array<[string, number]>, xlab: ["17 May", "24"], xr: 466 },
];
const G_POP_T = [11.12, 11.24, 11.36];

export const Charts: React.FC = () => {
  const rootRef = useRef<TgEl>(null);

  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;
    tg.initializer = (inst) => {
      const q = <T extends HTMLElement>(sel: string) => inst.querySelector(sel) as T;
      const qa = (sel: string) => Array.from(inst.querySelectorAll(sel)) as HTMLElement[];

      const sE = q(".sE"), eClip = q(".eclip"), ePan = q(".epan");
      const fCard = q(".fcard"), fScaler = q(".fscaler");
      const sG = q(".sG"), gGuides = q(".gguides"), gCards = qa(".gcard");

      const render = (ms: number) => {
        const t = CHARTS_ABS_START + ms / 1000;

        const eOn = t >= 7.1 && t < 9.98;
        sE.style.opacity = eOn ? String(seg(t, 7.17, 7.5) * (1 - seg(t, 9.82, 9.98))) : "0";
        if (eOn) {
          const tip = kf(E_TIP, t);
          eClip.style.clipPath = `inset(0 ${Math.max(0, 1920 - tip)}px 0 0)`;
          ePan.style.transform = `translateX(${-kf(E_PAN, t)}px)`;
          const p = easeIO(seg(t, 9.77, 10.0));
          if (p > 0) {
            const sx = lerp(1, 0.48, p), sy = lerp(1, 0.36, p);
            sE.style.transform = `translate(${lerp(0, 30, p)}px,${lerp(0, 90, p)}px) scale(${sx},${sy})`;
          } else sE.style.transform = "none";
        }

        const fOn = t >= 9.74 && t < 13.0;
        fCard.style.opacity = fOn ? String(seg(t, 9.74, 9.86) * (1 - seg(t, 12.6, 12.98))) : "0";
        if (fOn) {
          let rx: number, ry: number, rw: number, rh: number;
          if (t < 11.08) {
            const s = kf(F_SCALE, t);
            rw = F_RECT.w * s; rh = F_RECT.h * s;
            rx = F_RECT.x + (F_RECT.w - rw) / 2; ry = F_RECT.y + (F_RECT.h - rh) / 2;
          } else {
            const p = easeIO(seg(t, 11.08, 11.5));
            rx = lerp(F_RECT.x, G_TL.x, p); ry = lerp(F_RECT.y, G_TL.y, p);
            rw = lerp(F_RECT.w, G_TL.w, p); rh = lerp(F_RECT.h, G_TL.h, p);
          }
          fCard.style.left = `${rx}px`; fCard.style.top = `${ry}px`;
          fCard.style.width = `${rw}px`; fCard.style.height = `${rh}px`;
          fScaler.style.transform = `scale(${rw / F_RECT.w})`;
        }

        const gOn = t >= 10.95 && t < 13.08;
        sG.style.opacity = gOn ? String(1 - seg(t, 12.995, 13.06)) : "0";
        if (gOn) {
          gGuides.style.opacity = String(seg(t, 11.0, 11.5));
          gCards.forEach((el, i) => {
            const p = seg(t, G_POP_T[i], G_POP_T[i] + 0.42);
            el.style.opacity = String(seg(t, G_POP_T[i], G_POP_T[i] + 0.25));
            el.style.transform = `scale(${lerp(0.86, 1, easeOut(p))})`;
          });
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

  const eLine = pathFrom(E_MASTER);
  const eFill = pathFrom(E_MASTER, { y: 1080 });
  const fPts: Array<[number, number]> = F_CHART.map(([x, y]) => [
    (x - 529) * 0.977, (y - 194) * 0.977,
  ]);

  return (
    <Timegroup ref={rootRef as React.Ref<HTMLElement>} mode="fixed" duration={`${CHARTS_MS}ms`} className="scene">
      <div className="scene sE" style={{ opacity: 0 }}>
        <div className="eclip">
          <div className="epan">
            <svg width="2600" height="1080" viewBox="0 0 2600 1080">
              <path d={eFill} fill="#E4E7F0" />
              <path d={eLine} fill="none" stroke="#4861CF" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <div className="fcard" style={{ opacity: 0 }}>
        <div className="fscaler">
          <div className="ftitle">Average CSAT Rating</div>
          <div className="fvalue">
            4.1
            <svg viewBox="0 0 24 23" style={{ position: "absolute", left: 46, top: 1, width: 24, height: 22 }}>
              <path d="M12 0l3.1 7.2 7.9.7-6 5.2 1.8 7.7L12 16.7 5.2 20.8 7 13.1l-6-5.2 7.9-.7z" fill="#a9a9a5" />
            </svg>
          </div>
          {[146.5, 237.5, 328.5, 414.5, 510.5, 599].map((y, i) => (
            <div className="fgridline" key={i} style={{ top: y }} />
          ))}
          {["5", "4", "3", "2", "1", "0"].map((l, i) => (
            <div className="fylab" key={i} style={{ top: [146.5, 237.5, 328.5, 414.5, 510.5, 599][i] - 11 }}>{l}</div>
          ))}
          <div className="fxlab" style={{ left: 86 }}>17 May</div>
          <div className="fxlab" style={{ right: 30 }}>24 May</div>
          <svg className="fplot" width="837" height="671" viewBox="0 0 837 671">
            <path d={pathFrom(fPts, { y: 599 })} fill="#EDEFF9" />
            <path d={pathFrom(fPts)} fill="none" stroke="#4861CF" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="scene sG" style={{ opacity: 0 }}>
        <div className="gguides" style={{ opacity: 0 }}>
          <div className="gv" style={{ left: 424 }} />
          <div className="gv" style={{ left: 1524 }} />
          <div className="gh" style={{ top: 81 }} />
          <div className="gh" style={{ top: 988 }} />
          <div className="gcirc" style={{ left: -726, top: -20, width: 1120, height: 1120 }} />
          <div className="gcirc" style={{ left: 1526, top: -20, width: 1120, height: 1120 }} />
        </div>
        {G_CARDS.map((c) => (
          <div className="gcard" key={c.key} style={{ left: c.x, top: c.y, width: c.w, height: c.h, opacity: 0 }}>
            <div className="gtitle">{c.title}</div>
            <div className="gvalue">{c.value}</div>
            {Array.from({ length: c.nlines }, (_, k) => (
              <div className="ggridline" key={k} style={{ top: 101 + (k * 275) / (c.nlines - 1) }} />
            ))}
            {c.ylab.map(([l, k], j) => (
              <div className="gylab" key={j} style={{ top: 101 + (k * 275) / (c.nlines - 1) - 8 }}>{l}</div>
            ))}
            <svg className="gplot" width={c.w} height={c.h} viewBox={`0 0 ${c.w} ${c.h}`}>
              <path d={pathFrom((chartsG as Record<string, Array<[number, number]>>)[c.key], { y: 376 })} fill="#E7E9F4" />
              <path d={pathFrom((chartsG as Record<string, Array<[number, number]>>)[c.key])} fill="none" stroke="#4861CF" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <div className="gxlab" style={{ left: 62 }}>{c.xlab[0]}</div>
            <div className="gxlab" style={{ left: c.xr }}>{c.xlab[1]}</div>
          </div>
        ))}
      </div>
    </Timegroup>
  );
};
