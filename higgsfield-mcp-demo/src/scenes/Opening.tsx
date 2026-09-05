/**
 * Opening — S1 intro + S2 toggle (0–3.45s).
 * Keeps the 2.20–2.45 focus-pull overlap inside this scene.
 */
import React, { useEffect, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { Star } from "../components/Icons";
import { OPENING_ABS_S, OPENING_MS } from "../constants";
import { easeIO, easeOut, kf, lerp, mix, seg, type KF, type TgEl } from "../lib";

const S1_ROWY: KF = [[0, 353], [0.97, 353], [1.5, 235], [2.0, 188], [2.27, 176]];
const S1_VAY: KF = [[1.3, 383], [2.0, 336], [2.27, 326]];
const S1_CR: KF = [[0.74, 0], [0.86, 22], [0.96, 45], [1.06, 12], [1.14, 0]];
const TYPE_SEGS: Array<[number, number, number, number]> = [
  [0, 11, 0.05, 0.27],
  [11, 16, 0.34, 0.47],
  [16, 22, 0.54, 0.74],
];

export const Opening = () => {
  const rootRef = useRef<TgEl>(null);

  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;
    tg.initializer = (inst) => {
      const q = <T extends HTMLElement>(sel: string) => inst.querySelector(sel) as T;
      const qa = (sel: string) => Array.from(inst.querySelectorAll(sel)) as HTMLElement[];

      const s1 = q(".s1"),
        s1pink = q(".s1pink"),
        s1row = q(".s1row"),
        s1va = q(".s1va"),
        caret = q(".caret"),
        s1glow = q(".s1glow");
      const c1s = qa(".c1");
      c1s.forEach((el, i) => {
        for (const [a, b, t0, t1] of TYPE_SEGS)
          if (i >= a && i < b) el.dataset.rt = String(t0 + ((i - a) / (b - a)) * (t1 - t0));
      });
      const c1edge = c1s.map((el) => el.offsetLeft + el.offsetWidth);
      const vchs = qa(".vch");
      const NV = vchs.length;
      vchs.forEach((el, i) => (el.dataset.rt = String(1.06 + ((NV - 1 - i) / Math.max(1, NV - 1)) * 0.27)));
      const vleft = vchs.map((el) => el.offsetLeft);
      const vaRight = NV ? vchs[NV - 1].offsetLeft + vchs[NV - 1].offsetWidth : 850;
      const headEnd = c1edge.length ? c1edge[c1edge.length - 1] : 935;
      const VA_DARK: [number, number, number] = [63, 60, 58];
      const CORAL2: [number, number, number] = [200, 131, 101];
      const CARET_D: [number, number, number] = [59, 59, 59];
      const s2 = q(".s2"),
        s2grp = q(".s2grp"),
        s2trackOn = q(".s2on"),
        s2handle = q(".s2handle"),
        s2i = q(".s2i"),
        s2ring = q(".s2ring"),
        s2label = q(".s2label");

      const render = (ms: number) => {
        const t = OPENING_ABS_S + ms / 1000;

        const s1on = t < 2.45;
        s1.style.opacity = s1on ? String(1 - seg(t, 2.23, 2.4)) : "0";
        if (s1on) {
          const bl1 = 9 * seg(t, 2.23, 2.4);
          const f1 = bl1 > 0.3 ? `blur(${bl1.toFixed(2)}px)` : "none";
          s1row.style.filter = f1;
          s1va.style.filter = f1;
          s1pink.style.opacity = String(seg(t, 1.0, 2.0));
          const rowy = kf(S1_ROWY, t);
          s1row.style.top = `${rowy - 45}px`;
          const vaTop = kf(S1_VAY, t) - 20;
          s1va.style.top = `${vaTop}px`;
          let lastEdge = c1s.length ? c1s[0].offsetLeft - 12 : 320;
          c1s.forEach((el, i) => {
            const on = t >= Number(el.dataset.rt);
            el.style.opacity = on ? "1" : "0";
            if (on) lastEdge = c1edge[i];
          });
          let newestLeft = -1;
          vchs.forEach((el) => {
            const rt = Number(el.dataset.rt);
            if (t < rt) {
              el.style.opacity = "0";
            } else {
              el.style.opacity = "1";
              el.style.color = mix(CORAL2, VA_DARK, easeOut(seg(t, rt, rt + 0.5)));
              if (newestLeft < 0 || el.offsetLeft < newestLeft) newestLeft = el.offsetLeft;
            }
          });
          let cx: number, cy: number, ch = 88;
          const rowCarY = rowy - 44;
          if (t < 0.74) {
            cx = lastEdge + 5;
            cy = rowCarY;
          } else if (t < 1.06) {
            cx = kf([[0.74, headEnd + 5], [0.86, headEnd + 38], [0.96, headEnd + 55], [1.06, vaRight + 16]], t);
            cy = kf([[0.74, rowCarY], [0.86, rowCarY + 44], [0.96, rowCarY + 106], [1.06, vaTop - 6]], t);
          } else {
            ch = 86;
            cx = (newestLeft >= 0 ? newestLeft : vaRight) - (t < 1.33 ? 9 : 0) - (t >= 1.33 ? 34 : 0);
            if (t >= 1.33 && vchs.length) cx = vleft[0] - 34;
            cy = vaTop - 6;
          }
          const sq = 1 - 0.22 * Math.sin(Math.PI * seg(t, 1.05, 1.18)) + 0.06 * Math.sin(Math.PI * seg(t, 1.18, 1.3));
          caret.style.height = `${ch}px`;
          caret.style.transform = `translate(${cx}px,${cy}px) rotate(${kf(S1_CR, t)}deg) scaleY(${sq.toFixed(3)})`;
          caret.style.background = t < 0.8 ? "#3b3b3b" : mix(CARET_D, CORAL2, seg(t, 0.8, 1.0));
          const glowAmt = 0.5 * seg(t, 1.0, 1.15);
          caret.style.boxShadow = glowAmt > 0.03 ? `0 0 16px rgba(226,138,108,${glowAmt.toFixed(2)})` : "none";
          caret.style.opacity = String(seg(t, 0.02, 0.16) * (t < 1.55 ? 1 : 1 - seg(t, 1.55, 1.75)));
          s1glow.style.opacity = String(0.9 * seg(t, 0.34, 0.5) * (1 - seg(t, 0.63, 0.88)));
          s1glow.style.transform = `translate(625px,${rowy - 85}px)`;
        }

        const s2on = t >= 2.2 && t < 3.45;
        s2.style.opacity = s2on ? "1" : "0";
        if (s2on) {
          s2grp.style.opacity = String(seg(t, 2.22, 2.42) * (1 - seg(t, 3.415, 3.45)));
          const px2 = seg(t, 3.38, 3.45);
          const bl2 = 8 * (1 - seg(t, 2.25, 2.45)) + 7 * px2;
          s2grp.style.filter = bl2 > 0.3 ? `blur(${bl2.toFixed(2)}px)` : "none";
          s2grp.style.transform = `translateY(${-17 * seg(t, 2.3, 3.0) - 48 * easeIO(seg(t, 3.05, 3.5)) - 85 * px2 * px2}px) scale(${lerp(1.045, 1, easeOut(seg(t, 2.27, 2.48)))}) scaleY(${1 + 0.55 * px2})`;
          s2trackOn.style.opacity = String(seg(t, 2.45, 2.62));
          s2handle.style.left = `${kf([[2.27, 517], [2.45, 517], [2.72, 598]], t)}px`;
          s2i.style.opacity = String(seg(t, 2.58, 2.72));
          s2ring.style.opacity = String(1 - seg(t, 2.5, 2.62));
          s2label.style.color = mix([185, 187, 187], [43, 43, 43], seg(t, 2.6, 3.3));
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
    <Timegroup ref={rootRef as React.Ref<HTMLElement>} mode="fixed" duration={`${OPENING_MS}ms`} className="absolute w-full h-full">
      <div className="scene s1">
        <div className="s1bg" />
        <div className="s1pink" />
        <div className="s1glow" />
        <div className="s1row">
          <span className="s1hf">
            {"Higgsfield /MCP".split("").map((ch, i) => (
              <span key={i} className="c1">{ch === " " ? " " : ch}</span>
            ))}
          </span>
          <span className="s1star c1">
            <Star size={56} color="#E06A50" />
          </span>
          <span className="s1claude serif">
            {"Claude".split("").map((ch, i) => (
              <span key={i} className="c1">{ch}</span>
            ))}
          </span>
        </div>
        <div className="s1va">
          {"Video Analysis".split("").map((ch, i) => (
            <span key={i} className="vch">{ch === " " ? " " : ch}</span>
          ))}
        </div>
        <div className="caret" />
      </div>

      <div className="scene s2">
        <div className="s2grp">
          <div className="s2track" />
          <div className="s2track s2on" style={{ background: "#3ed35e", opacity: 0 }} />
          <div className="s2i" />
          <div className="s2ring" />
          <div className="s2handle" />
          <div className="s2label">Higgsfield /MCP</div>
        </div>
      </div>
    </Timegroup>
  );
};
