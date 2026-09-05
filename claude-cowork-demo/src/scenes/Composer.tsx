import React, { useEffect, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { clamp, lerp, easeOutCubic, easeInCubic } from "@shared/utils/animation";
import { Chevron } from "../components/Chevron";
import { COMPOSER_MS } from "../constants";
import { kf, type TgEl } from "../lib/motion";

/**
 * Composer — headline + prompt card + cursor (0–12.67s).
 *
 * First scene, so local time == master time. Absolute-second tables stay as-is
 * via `t = SCENE_ABS_START + ownCurrentTimeMs/1000` (SCENE_ABS_START = 0).
 *
 * CSS: headline word fade+float, headline re-center + fade-out.
 * addFrameTask: cam1, typewriter+highlight HTML, cursor path/morph, card
 * geometry (width/height/top coupled to typed line count).
 */

const SCENE_ABS_START = 0;

const PROMPT = [
  "My Acme QBR is tomorrow at 11am and the renewal is shaky. Pull",
  "everything: the email threads, #acct-acme in Slack, the last two",
  "meeting transcripts, their recent news. Build my prep doc with",
  "talking points and flag anything that feels off. Draft the renewal email",
  "but don’t send it. Run the prep at 8am tomorrow so it picks up",
  "anything that comes in overnight. After the meeting, give me the",
  "recap and action items.",
].join("\n");

const end = (s: string) => PROMPT.indexOf(s) + s.length;
const HIGHLIGHTS = [
  { a: PROMPT.indexOf("Build my prep doc"), b: end("Build my prep doc"), tIn: 5.85, tOut: 6.55 },
  { a: PROMPT.indexOf("Draft the renewal email"), b: end("Draft the renewal email"), tIn: 7.62, tOut: 8.15 },
  { a: PROMPT.indexOf("Run the prep at 8am tomorrow"), b: end("Run the prep at 8am tomorrow"), tIn: 9.28, tOut: 9.84 },
  { a: PROMPT.indexOf("After the meeting"), b: end("recap and action items."), tIn: 10.5, tOut: 0 },
];

const TYPE_KF: [number, number][] = [
  [3.7, 0],
  [4.115, end("is tomo")],
  [4.58, end("shaky.")],
  [4.74, end("shaky.")],
  [4.96, end("Pull\neverything: the")],
  [5.042, end("recent news. Bu")],
  [6.83, end("feels off. Dra")],
  [8.48, end("it. Run the prep")],
  [9.83, end("overnight. After the m")],
  [11.05, PROMPT.length],
];

const HEAD_WORDS = [
  { w: "Claude ", t: 0.04 },
  { w: "keeps ", t: 0.14 },
  { w: "working, ", t: 0.24 },
  { w: "even ", t: 1.3 },
  { w: "when ", t: 1.39 },
  { w: "you’re ", t: 1.48 },
  { w: "not", t: 1.57 },
];

const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));

function cam1(t: number) {
  if (t < 4.55) return { s: 1, fx: 960, fy: 540 };
  if (t < 5.042) {
    const p = easeInCubic(seg(t, 4.55, 5.042));
    return { s: lerp(1, 1.38, p), fx: lerp(960, 1100, p), fy: lerp(540, 470, p) };
  }
  if (t < 6.83) {
    const p = seg(t, 5.042, 6.83);
    return { s: 3.4, fx: lerp(1181, 1201, p), fy: lerp(408, 418, p) };
  }
  if (t < 8.375) {
    const p = seg(t, 6.83, 8.375);
    return { s: 3.6, fx: lerp(1262, 1282, p), fy: lerp(438, 450, p) };
  }
  if (t < 9.83) {
    const p = seg(t, 8.375, 9.83);
    return { s: 2.6, fx: lerp(895, 915, p), fy: lerp(540, 552, p) };
  }
  const p = easeOutCubic(seg(t, 9.83, 11.0));
  const s = lerp(1.07, 1.0, p);
  let fy = 540;
  if (t > 12.5) fy += easeInCubic(seg(t, 12.5, 12.67)) * 170;
  return { s, fx: 960, fy };
}

const BgPattern = () => (
  <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
    <g fill="none" stroke="#7BA6CE" strokeWidth="10">
      <circle cx="700" cy="-1200" r="1520" />
      <circle cx="2300" cy="-500" r="950" />
      <circle cx="-500" cy="1200" r="900" />
      <circle cx="1200" cy="2000" r="1130" />
    </g>
  </svg>
);

const UpArrow = () => (
  <svg width="40" height="40" viewBox="0 0 40 40">
    <path d="M20 31 V10 M11 19.5 L20 10 L29 19.5" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = () => (
  <svg width="60" height="60" viewBox="0 0 60 60">
    <rect x="2" y="2" width="56" height="56" rx="14" fill="#F2F1EC" />
    <path d="M30 17 V43 M17 30 H43" stroke="#6b6a63" strokeWidth="2.8" strokeLinecap="round" />
  </svg>
);

const MicIcon = () => (
  <svg width="34" height="44" viewBox="0 0 34 44">
    <rect x="10" y="2" width="14" height="24" rx="7" fill="#57564F" />
    <path d="M4 20 a13 13 0 0 0 26 0 M17 33 V42" stroke="#57564F" strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);

const BoxIcon = () => (
  <svg width="34" height="34" viewBox="0 0 34 34">
    <path d="M5 10 a2 2 0 0 1 2-2 h7 l3 3 h10 a2 2 0 0 1 2 2 v13 a2 2 0 0 1 -2 2 H7 a2 2 0 0 1 -2-2 Z M11 16 h12 M11 21 h9" stroke="#57564F" strokeWidth="1.9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HandIcon = () => (
  <svg width="29" height="31" viewBox="0 0 32 34">
    <path d="M8 16 V7 a2.4 2.4 0 0 1 4.8 0 V14 M12.8 13 V4.5 a2.4 2.4 0 0 1 4.8 0 V14 M17.6 13.5 V6.5 a2.4 2.4 0 0 1 4.8 0 V16 M22.4 15 V10 a2.4 2.4 0 0 1 4.8 0 V21 a10 10 0 0 1 -10 10 h-2 a10 10 0 0 1 -9-5.6 L3 18 a2.5 2.5 0 0 1 4.3-2.4 L8 17" stroke="#57564F" strokeWidth="2.1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HandCursorSvg = () => (
  <svg width="108" height="114" viewBox="0 0 108 114" style={{ display: "block" }}>
    <path
      d="M32 5
         c-5.5 0 -9.5 4.2 -9.5 9.6
         v33.5
         l-4.8 -6.4
         c-3.1 -4.1 -8.9 -4.9 -13 -1.8
         c-4 3 -4.8 8.7 -1.9 12.8
         l16.5 23.1
         c4.9 6.9 12.9 11 21.4 11
         h13.3
         c10 0 18.1 -8.1 18.1 -18.1
         v-25.6
         c0 -4.9 -4 -8.9 -8.9 -8.9
         c-1.6 0 -3.1 0.4 -4.4 1.2
         c-0.8 -3.8 -4.2 -6.7 -8.2 -6.7
         c-2 0 -3.9 0.7 -5.3 1.9
         c-1.2 -3.1 -4.2 -5.3 -7.7 -5.3
         c-1.4 0 -2.7 0.3 -3.9 0.9
         v-13
         c0 -5.4 -4 -9.6 -9.5 -9.6 z"
      fill="#ffffff"
      stroke="#101010"
      strokeWidth="3.4"
      strokeLinejoin="round"
    />
  </svg>
);

const CursorSvg = () => (
  <>
    <svg
      className="curArrow"
      width="69"
      height="103"
      viewBox="-2 -2 16 24"
      style={{ position: "absolute", left: 27.4, top: 11.4, filter: "drop-shadow(-3px 7px 6px rgba(40, 40, 40, 0.3))" }}
    >
      <path
        d="M0 0 L0 16.9 L3.9 13.6 L6.3 19.3 L9.0 18.2 L6.6 12.6 L11.5 12.6 Z"
        fill="#101010"
        stroke="#ffffff"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
    <div
      className="curHand"
      style={{
        position: "absolute",
        left: 4,
        top: 15,
        width: 108,
        height: 114,
        filter: "drop-shadow(-4px 9px 7px rgba(40, 40, 40, 0.32))",
        opacity: 0,
      }}
    >
      <HandCursorSvg />
    </div>
  </>
);

export const Composer: React.FC = () => {
  const rootRef = useRef<TgEl>(null);

  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;

    tg.initializer = (inst) => {
      const q = <T extends HTMLElement>(sel: string) => inst.querySelector(sel) as T | null;

      const cam1El = q(".cam-1");
      const cardWrap = q(".cardwrap");
      const cardEl = q(".card");
      const lowerEl = q(".lowerbar");
      const ptextEl = q(".ptext-inner");
      const placeholderEl = q(".placeholder");
      const controlsEl = q(".controls");
      const lowerLabel = q(".lower-label");
      const cursorEl = q(".cursor");
      const sendBtn = q(".sendbtn");

      const render = (tMs: number) => {
        const t = SCENE_ABS_START + tMs / 1000;

        const { s, fx, fy } = cam1(t);
        if (cam1El) cam1El.style.transform = `translate(${960 - fx * s}px, ${540 - fy * s}px) scale(${s})`;

        if (cardWrap && cardEl) {
          const show = t >= 2.92;
          cardWrap.style.opacity = show ? "1" : "0";
          if (show) {
            const pe = easeOutCubic(seg(t, 2.92, 3.42));
            const width = lerp(865, 1396, pe);
            cardEl.style.width = `${width}px`;
            cardEl.style.opacity = String(seg(t, 2.92, 3.04));

            const n = Math.floor(kf(t, TYPE_KF));
            const visText = PROMPT.slice(0, n);
            const lines = Math.max(2, visText.split("\n").length);
            const cardH = 50 + lines * 55.5 + 26 + 80 + 28;

            const topPos = 476 - cardH / 2;
            const entranceTop = lerp(393, 476 - 295 / 2, pe);
            cardWrap.style.top = `${t < 3.45 ? entranceTop : topPos}px`;

            if (lowerEl) {
              lowerEl.style.opacity = String(seg(t, 3.15, 3.4));
              lowerEl.style.width = `${width}px`;
            }
            if (lowerLabel) lowerLabel.textContent = t < 9.83 ? "Project or folder" : "Work in a project or folder";

            if (controlsEl) controlsEl.style.opacity = String(seg(t, 3.22, 3.5));
            const cowork = controlsEl?.querySelector<HTMLElement>(".cowork");
            if (cowork) {
              const warm = t >= 9.8;
              cowork.style.borderColor = warm ? "#dcd8cd" : "#eceae3";
              cowork.style.boxShadow = warm ? "0 0 0 1.5px rgba(228,166,142,0.6)" : "none";
            }
            if (placeholderEl) placeholderEl.style.opacity = n === 0 ? String(seg(t, 3.28, 3.52)) : "0";

            if (ptextEl) {
              let html = "";
              let pos = 0;
              const esc = (x: string) => x.replace(/&/g, "&amp;").replace(/</g, "&lt;");
              for (const h of HIGHLIGHTS) {
                if (h.a >= n) continue;
                const bb = Math.min(h.b, n);
                const hlText = bb === n ? visText.slice(h.a, bb).replace(/ +$/, "") : visText.slice(h.a, bb);
                if (h.a > pos) html += esc(visText.slice(pos, h.a));
                const sweep = seg(t, h.tIn, h.tIn + 0.12);
                const fade = h.tOut ? 1 - seg(t, h.tOut, h.tOut + 0.12) : 1;
                const alpha = 0.95 * fade;
                if (sweep > 0 && fade > 0.01) {
                  html += `<span class="hl" style="background-image:linear-gradient(to right, rgba(236,198,183,${alpha}) ${sweep * 100}%, rgba(236,198,183,0) ${sweep * 100}%)">${esc(hlText)}</span>`;
                } else {
                  html += esc(hlText);
                }
                pos = bb;
              }
              if (pos < n) html += esc(visText.slice(pos).replace(/ +$/, ""));
              const caretOn = t < 11.1 || Math.floor((t - 11.1) / 0.53) % 2 === 0;
              if (t >= 3.6 && caretOn && n > 0) html += `<span class="caret"></span>`;
              ptextEl.innerHTML = html;
            }

            if (sendBtn) {
              const press = seg(t, 12.14, 12.22) - seg(t, 12.33, 12.42);
              sendBtn.style.opacity = String(1 - press * 0.45);
            }
          }
        }

        if (cursorEl) {
          const vis = t >= 11.42;
          cursorEl.style.opacity = vis ? "1" : "0";
          if (vis) {
            const x = kf(t, [
              [11.42, 1600],
              [11.5, 1592],
              [11.583, 1586],
              [11.625, 1578],
              [11.667, 1573],
              [11.708, 1570],
              [11.75, 1564],
              [11.88, 1561],
              [12.05, 1561],
            ]);
            const y = kf(t, [
              [11.42, 1085],
              [11.5, 887],
              [11.583, 843],
              [11.625, 800],
              [11.667, 766],
              [11.708, 741],
              [11.75, 707],
              [11.88, 670],
              [12.05, 651],
            ]);
            cursorEl.style.transform = `translate(${x}px, ${y}px)`;
            const arrowEl = cursorEl.querySelector<HTMLElement>(".curArrow");
            const handEl = cursorEl.querySelector<HTMLElement>(".curHand");
            if (arrowEl) arrowEl.style.opacity = t < 11.73 ? "1" : "0";
            if (handEl) handEl.style.opacity = t >= 11.73 ? "1" : "0";
          }
        }
      };

      const cleanup = inst.addFrameTask((info) => render(info.ownCurrentTimeMs));
      render(0);
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
      duration={`${COMPOSER_MS}ms`}
      className="absolute w-full h-full"
    >
      <div className="scene s1">
        <div className="s1-bg" />
        <div className="cam cam-1">
          <BgPattern />
          <div className="headline">
            {HEAD_WORDS.map((w, i) => (
              <span
                className="w"
                key={i}
                style={{
                  animation: `word-fade 260ms ${w.t * 1000}ms linear both, word-float 260ms ${w.t * 1000}ms cubic-bezier(0.33,1,0.68,1) both`,
                }}
              >
                {w.w}
              </span>
            ))}
          </div>
          <div className="cardwrap" style={{ transform: "translateX(-50%)", opacity: 0, left: "960px", top: "328px" }}>
            <div className="card">
              <div className="ptext">
                <span className="placeholder">How can I help you today?</span>
                <span className="ptext-inner" />
              </div>
              <div className="controls">
                <PlusIcon />
                <div className="toggle">
                  <span className="chat">Chat</span>
                  <span className="cowork">Cowork</span>
                </div>
                <div className="model">
                  <span className="opus">Opus 4.8</span>
                  <span className="high">High</span>
                  <Chevron sw={1.8} />
                </div>
                <div className="micwrap">
                  <MicIcon />
                </div>
                <div className="sendbtn">
                  <UpArrow />
                </div>
              </div>
            </div>
            <div className="lowerbar">
              <div className="grp">
                <BoxIcon />
                <span className="lower-label">Project or folder</span>
                <Chevron size={22} color="#57564F" sw={1.6} />
              </div>
              <div style={{ width: 1, height: 36, background: "#dedbd3" }} />
              <div className="grp">
                <HandIcon />
                <span>Ask</span>
                <Chevron size={24} color="#57564F" />
              </div>
            </div>
          </div>
          <div className="cursor" style={{ opacity: 0, left: 0, top: 0 }}>
            <CursorSvg />
          </div>
        </div>
      </div>
    </Timegroup>
  );
};
