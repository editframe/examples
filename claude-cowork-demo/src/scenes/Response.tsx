import React, { useEffect, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { Reveal } from "@shared/components/Reveal";
import { clamp, lerp, easeInOutCubic } from "@shared/utils/animation";
import { Chevron } from "../components/Chevron";
import { RESPONSE_MS } from "../constants";
import { kf, type TgEl } from "../lib/motion";

/**
 * Response — reply feed + Progress card (12.67–20.0s).
 *
 * Absolute-second tables keep working via
 * `t = SCENE_ABS_START + ownCurrentTimeMs/1000` (SCENE_ABS_START = 12.67).
 *
 * The 18.2–18.45 s2/s3 crossfade stays INSIDE this scene (sequence overlap is
 * uniform and would bleed onto the Composer→Response hard cut).
 *
 * CSS/Reveal: thought fade, feed items/chips/head, top fade, s2/s3 crossfade,
 * progress card enter, step word fades.
 * addFrameTask: cam2, chat scroll, reply word reveal + spark-follow, feed
 * connector lines, progress ring dashoffset.
 */

const SCENE_ABS_START = 12.67;

const BUBBLE = [
  "My Acme QBR is tomorrow at 11am and the renewal is shaky. Pull",
  "everything: the email threads, #acct-acme in Slack, the last two meeting",
  "transcripts, their recent news. Build my prep doc with talking points and",
  "flag anything that feels off. Draft the renewal email but don’t send it.",
  "After the meeting, give me the recap and action items. Run the prep at",
  "8am tomorrow so it picks up anything that comes in overnight.",
].join("\n");

const RESPONSE = [
  "Got it. Prep at 8, the email stays in drafts until you say so, and recap after the meeting. I’ll run",
  "a quick check that I can reach everything tonight so nothing trips up the 8am run. If anything",
  "needs your call, I’ll ask.",
].join("\n");

const STEP1 = "Schedule morning Acme research +\nprep doc task";
const STEP2 = "Schedule post-meeting recap task";

const FEED_ITEMS = [
  { icon: "slack", title: "Confirm #acct-acme is reachable", tIn: 15.95, tChip: 16.2 },
  { icon: "gmail", title: "Verify Gmail access", tIn: 16.2, tChip: 16.45 },
  { icon: "gcal", title: "Find the 11am QBR on Monday", tIn: 16.42, tChip: 16.68 },
  { icon: "drive", title: "Verify Drive access", tIn: 16.5, tChip: 16.9 },
];
const FEED_Y = [1612, 1826, 2040, 2254];

const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));

function cam2(t: number) {
  if (t < 13.5) return { s: 3.0, fx: 455, fy: 626 };
  const p = easeInOutCubic(seg(t, 13.5, 14.05));
  return { s: lerp(3.0, 1, p), fx: lerp(455, 960, p), fy: lerp(626, 540, p) };
}

function words(text: string): { word: string; br: boolean }[] {
  const out: { word: string; br: boolean }[] = [];
  for (const line of text.split("\n")) {
    const ws = line.split(" ");
    ws.forEach((w, i) => out.push({ word: w + (i < ws.length - 1 ? " " : ""), br: false }));
    out[out.length - 1].br = true;
  }
  out[out.length - 1].br = false;
  return out;
}

const WSpan = ({ text }: { text: string }) => (
  <>
    {words(text).map((w, i) => (
      <React.Fragment key={i}>
        <span className="w">{w.word}</span>
        {w.br && "\n"}
      </React.Fragment>
    ))}
  </>
);

/** Staggered opacity-only word reveal — 1:1 with the old revealWords() loop. */
const FadeWords = ({ text, t0, t1, fade = 0.15 }: { text: string; t0: number; t1: number; fade?: number }) => {
  const ws = words(text);
  const n = ws.length;
  return (
    <>
      {ws.map((w, i) => {
        const st = t0 + (i / Math.max(1, n - 1)) * (t1 - t0);
        const delay = (st - SCENE_ABS_START) * 1000;
        return (
          <React.Fragment key={i}>
            <span className="w" style={{ animation: `word-in ${fade * 1000}ms ${delay}ms linear both` }}>
              {w.word}
            </span>
            {w.br && "\n"}
          </React.Fragment>
        );
      })}
    </>
  );
};

const Spark = () => (
  <svg viewBox="0 0 60 60" width="60" height="60">
    <g stroke="#CC6248" strokeLinecap="round">
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2 - 0.35 + (i % 3 === 0 ? 0.12 : i % 2 ? 0.05 : -0.08);
        const r1 = 1.5;
        const r2 = [27, 19, 24, 17, 26, 21, 18, 25, 20, 23][i];
        const w = [5, 3.4, 4.4, 3.6, 4.8, 3.9, 3.5, 4.6, 3.7, 4.2][i];
        return (
          <line
            key={i}
            strokeWidth={w}
            x1={30 + Math.cos(a) * r1}
            y1={30 + Math.sin(a) * r1}
            x2={30 + Math.cos(a) * r2}
            y2={30 + Math.sin(a) * r2}
          />
        );
      })}
    </g>
  </svg>
);

const SlackIcon = () => (
  <svg viewBox="0 0 44 44" width="44" height="44">
    <g opacity="0.93">
      <rect x="19" y="3" width="7.5" height="17" rx="3.75" fill="#36C5F0" />
      <rect x="24" y="19" width="17" height="7.5" rx="3.75" fill="#2EB67D" />
      <rect x="17.5" y="24" width="7.5" height="17" rx="3.75" fill="#ECB22E" />
      <rect x="3" y="17.5" width="17" height="7.5" rx="3.75" fill="#E01E5A" />
    </g>
  </svg>
);

const GmailIcon = () => (
  <svg viewBox="0 0 44 44" width="44" height="44">
    <rect x="3" y="8" width="38" height="28" rx="4" fill="#fff" />
    <path d="M3 12 a4 4 0 0 1 4-4 h2 L22 19 L35 8 h2 a4 4 0 0 1 4 4 V32 a4 4 0 0 1-4 4 h-3 V15 L22 25 L10 15 V36 H7 a4 4 0 0 1-4-4Z" fill="#EA4335" />
    <path d="M3 12 L10 17 V36 H7 a4 4 0 0 1-4-4Z" fill="#4285F4" />
    <path d="M41 12 L34 17 V36 h3 a4 4 0 0 0 4-4Z" fill="#34A853" />
    <path d="M9 8 L22 19 L35 8 L22 17Z" fill="#C5221F" opacity="0.9" />
  </svg>
);

const GcalIcon = () => (
  <svg viewBox="0 0 44 44" width="46" height="46">
    <rect x="5" y="5" width="34" height="34" rx="6" fill="#fff" stroke="#1A73E8" strokeWidth="3.5" />
    <text x="22" y="27.5" textAnchor="middle" fontSize="17" fontWeight="500" fill="#1A73E8" fontFamily="Hanken Grotesk, sans-serif">
      31
    </text>
  </svg>
);

const DriveIcon = () => (
  <svg viewBox="0 0 44 44" width="44" height="44">
    <path d="M16 6 L3 29 l6 10 L22 16Z" fill="#0F9D58" />
    <path d="M16 6 h12 L41 29 H28Z" fill="#FFCF44" />
    <path d="M41 29 l-6 10 H9 l6-10Z" fill="#4285F4" />
  </svg>
);

const FEED_ICONS: Record<string, React.ReactNode> = {
  slack: <SlackIcon />,
  gmail: <GmailIcon />,
  gcal: <GcalIcon />,
  drive: <DriveIcon />,
};

const RingSvg = ({ id }: { id: string }) => (
  <svg viewBox="0 0 66 66" className={id}>
    <circle cx="33" cy="33" r="31" fill="none" stroke="#e6e5df" strokeWidth="2.5" />
    <circle
      cx="33"
      cy="33"
      r="31"
      transform={`rotate(${id === "ring1" ? 130 : 200} 33 33)`}
      fill="none"
      stroke="#2C87DB"
      strokeWidth="8"
      strokeLinecap="round"
      strokeDasharray="171 194.8"
      strokeDashoffset="171"
    />
  </svg>
);

const localMs = (absSec: number) => (absSec - SCENE_ABS_START) * 1000;

export const Response: React.FC = () => {
  const rootRef = useRef<TgEl>(null);

  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;

    tg.initializer = (inst) => {
      const q = <T extends HTMLElement>(sel: string) => inst.querySelector(sel) as T | null;

      const cam2El = q(".cam-2");
      const scrollEl = q(".chatscroll");
      const respEl = q(".response");
      const sparkEl = q(".spark");
      const ring1 = inst.querySelector(".ring1 circle[stroke-dasharray]") as SVGCircleElement | null;
      const ring2 = inst.querySelector(".ring2 circle[stroke-dasharray]") as SVGCircleElement | null;
      const fLineEls = Array.from(inst.querySelectorAll<HTMLElement>(".fline"));

      const render = (tMs: number) => {
        const t = SCENE_ABS_START + tMs / 1000;

        const { s, fx, fy } = cam2(t);
        if (cam2El) cam2El.style.transform = `translate(${960 - fx * s}px, ${540 - fy * s}px) scale(${s})`;

        const scrollY =
          t < 16.15
            ? -1285 * easeInOutCubic(seg(t, 15.75, 16.15))
            : kf(t, [
                [16.15, -1285],
                [16.85, -1382],
                [17.48, -1405],
              ]);
        if (scrollEl) scrollEl.style.transform = `translateY(${scrollY}px)`;

        if (respEl) {
          const spans = respEl.querySelectorAll<HTMLElement>(".w");
          const N = spans.length;
          spans.forEach((sp, i) => {
            let st: number;
            if (i === 0) st = 12.71;
            else if (i === 1) st = 12.8;
            else if (i >= N - 3) st = 15.18 + (i - (N - 3)) * 0.09;
            else if (i === N - 4) st = 14.94;
            else if (i === N - 5) st = 14.88;
            else st = 13.6 + ((i - 2) / Math.max(1, N - 8)) * (14.82 - 13.6);
            sp.style.opacity = String(seg(t, st, st + 0.15));
          });

          if (sparkEl) {
            const on = t >= 13.05 && t < 15.9;
            sparkEl.style.opacity = on ? "1" : "0";
            if (on) {
              let last: HTMLElement | null = null;
              for (let i = N - 1; i >= 0; i--) {
                if (parseFloat(spans[i].style.opacity || "0") > 0.3) {
                  last = spans[i];
                  break;
                }
              }
              const yOff = last ? last.offsetTop + 50 : 50;
              const gap = lerp(-4, 48, seg(t, 13.5, 14.05));
              sparkEl.style.top = `${606 + yOff + gap}px`;
            }
          }
        }

        fLineEls.forEach((el, k) => {
          const next = FEED_ITEMS[k + 1];
          const grow = seg(t, FEED_ITEMS[k].tIn + 0.2, next ? next.tIn + 0.1 : FEED_ITEMS[k].tIn + 0.4);
          el.style.height = `${grow * (FEED_Y[k + 1] ? FEED_Y[k + 1] - FEED_Y[k] - 76 : 90)}px`;
        });

        if (ring1) ring1.setAttribute("stroke-dashoffset", String(171 * (1 - easeInOutCubic(seg(t, 18.85, 19.18)))));
        if (ring2) ring2.setAttribute("stroke-dashoffset", String(171 * (1 - easeInOutCubic(seg(t, 19.0, 19.32)))));
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
      duration={`${RESPONSE_MS}ms`}
      className="absolute w-full h-full"
    >
      <div className="scene s2">
        <div className="cam cam-2">
          <div className="chatscroll">
            <div className="bubble">{BUBBLE}</div>
            <Reveal enter={[localMs(13.85), localMs(14.1)]} y={0} easeIn="linear" className="thought">
              Thought process <Chevron size={24} color="#86847C" rot={-90} />
            </Reveal>
            <div className="response">
              <WSpan text={RESPONSE} />
            </div>
            <div className="spark" style={{ opacity: 0 }}>
              <Spark />
            </div>

            <div className="feed">
              <Reveal enter={[localMs(15.95), localMs(16.15)]} y={0} easeIn="linear" className="feedhead">
                Used 4 integrations <Chevron size={26} color="#8A8880" rot={-90} />
              </Reveal>
              {FEED_ITEMS.map((it, k) => (
                <React.Fragment key={k}>
                  <Reveal
                    enter={[localMs(it.tIn), localMs(it.tIn + 0.12)]}
                    y={0}
                    easeIn="linear"
                    className="fitem"
                    style={{ top: `${FEED_Y[k]}px` }}
                  >
                    <div className="ficon">{FEED_ICONS[it.icon]}</div>
                    <div
                      className="ftitle"
                      style={{
                        animation: `ftitle-darken 1ms ${localMs(it.tIn + 0.6)}ms linear both`,
                      }}
                    >
                      {it.title}
                    </div>
                  </Reveal>
                  <Reveal
                    enter={[localMs(it.tChip), localMs(it.tChip + 0.15)]}
                    y={0}
                    easeIn="linear"
                    className="fchip"
                    style={{ top: `${FEED_Y[k] + 78}px` }}
                  >
                    Result
                  </Reveal>
                  {k < 3 && <div className="fline" style={{ top: `${FEED_Y[k] + 66}px`, height: 0 }} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <Reveal enter={[localMs(16.1), localMs(16.3)]} y={0} easeIn="linear" className="topfade" />
      </div>

      <div className="scene s3">
        <div className="pcard">
          <div className="phead">
            <span className="ptitle">Progress</span>
            <Chevron size={34} color="#55544E" sw={1.2} />
          </div>
          <div className="prow">
            <div className="pnum">
              <div className="pbg">1</div>
              <RingSvg id="ring1" />
            </div>
            <div className="ptext2 step1">
              <FadeWords text={STEP1} t0={18.3} t1={18.66} fade={0.15} />
            </div>
          </div>
          <div className="prow" style={{ animation: `word-in 120ms ${localMs(18.5)}ms linear both` }}>
            <div className="pnum">
              <div className="pbg">2</div>
              <RingSvg id="ring2" />
            </div>
            <div className="ptext2 step2">
              <FadeWords text={STEP2} t0={18.52} t1={18.92} fade={0.15} />
            </div>
          </div>
        </div>
      </div>
    </Timegroup>
  );
};
