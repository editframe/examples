/**
 * Opening — AB + C + D (0–7.31s, declared 7310ms).
 * Exclusive screen time is still 0–7.15; the extra 160ms is the sequence
 * tail so Charts mounts at 7.15 over the already-faded table.
 *
 * AB wordmark / bloom / intro grain, C Spotlight slide, D table rise.
 * D subtitle + column headers are 1:1 opacity fades (Reveal). Everything
 * else stays a scene-scoped addFrameTask; t is absolute seconds from 0.
 */
import React, { useEffect, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { Reveal } from "@shared/components/Reveal";
import { OPENING_ABS_START, OPENING_MS } from "../constants";
import { easeOut, kf, seg, type KF, type TgEl } from "../lib/anim";

let introBg: { blob: HTMLCanvasElement; tiles: HTMLCanvasElement[] } | null = null;
function buildIntroBg() {
  const blob = document.createElement("canvas");
  blob.width = 384;
  blob.height = 216;
  const c = blob.getContext("2d")!;
  c.fillStyle = "#283927";
  c.fillRect(0, 0, 384, 216);
  const rad = (x: number, y: number, r: number, col: string) => {
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, col);
    g.addColorStop(1, col.slice(0, 7) + "00");
    c.fillStyle = g;
    c.fillRect(0, 0, 384, 216);
  };
  rad(46, 28, 124, "#5c5f50ff");
  rad(262, 12, 128, "#3f6134ff");
  rad(380, 4, 60, "#20301fff");
  rad(8, 112, 92, "#1b241cff");
  rad(190, 203, 170, "#151c15ff");
  rad(18, 206, 84, "#1a3840ff");
  const tiles: HTMLCanvasElement[] = [];
  for (const seed of [0x9e3779b9, 0x85ebca6b, 0xc2b2ae35]) {
    const tc = document.createElement("canvas");
    tc.width = 512;
    tc.height = 512;
    const tctx = tc.getContext("2d")!;
    const img = tctx.createImageData(512, 512);
    const d = img.data;
    let x = seed | 0;
    for (let i = 0; i < d.length; i += 4) {
      x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
      const v = 128 + ((x & 63) - 32);
      d[i] = v; d[i + 1] = v; d[i + 2] = v; d[i + 3] = 255;
    }
    tctx.putImageData(img, 0, 0);
    tiles.push(tc);
  }
  return { blob, tiles };
}
function drawIntroBg(ctx: CanvasRenderingContext2D, t: number) {
  if (!introBg) introBg = buildIntroBg();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.drawImage(introBg.blob, 0, 0, 1920, 1080);
  const tile = introBg.tiles[Math.floor(t * 30) % introBg.tiles.length];
  const pat = ctx.createPattern(tile, "repeat");
  if (pat) {
    ctx.globalCompositeOperation = "overlay";
    ctx.globalAlpha = 0.45;
    ctx.save();
    ctx.scale(1.5, 1.5);
    ctx.fillStyle = pat;
    ctx.fillRect(0, 0, 1920 / 1.5, 1080 / 1.5);
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }
}

const AB_SCALE: KF = [[0, 1], [0.1, 0.99], [0.2, 0.96], [0.3, 0.87], [0.4, 0.64], [0.5, 0.51], [0.6, 0.44], [0.7, 0.42], [0.8, 0.39], [0.9, 0.37], [1.0, 0.36], [1.1, 0.352]];
const AB_CY: KF = [[0, 525], [0.3, 527], [0.5, 532], [0.7, 533.5], [1.0, 534.8]];
const WML_X: KF = [[0.97, 948], [1.03, 937], [1.067, 920], [1.10, 917], [1.133, 905], [1.167, 861], [1.20, 830], [1.233, 806], [1.267, 793], [1.30, 788], [1.345, 786]];
const WMB2_X: KF = [[0.97, 960], [1.03, 978], [1.067, 996], [1.10, 1000], [1.133, 1013], [1.185, 1050]];
const WMR_X: KF = [[1.167, 1064], [1.20, 1030], [1.233, 1014], [1.267, 1002], [1.30, 994], [1.37, 988], [1.45, 986]];
const ELEVEN_T = [1.233, 1.267, 1.30, 1.323, 1.343, 1.363];
const AGENTS_T = [1.167, 1.20, 1.233, 1.267, 1.30, 1.333];
const BLOOM_R: KF = [[2.37, 82], [2.43, 151], [2.5, 306], [2.57, 567], [2.63, 945], [2.7, 1437], [2.77, 1954], [3.0, 2600]];
const BLOOM_CX: KF = [[2.37, 874], [2.43, 934], [2.5, 955], [2.57, 960]];
const BLOOM_AR: KF = [[2.37, 1.42], [2.57, 1.42], [2.63, 1.55], [2.7, 1.9], [2.77, 2.5], [3.0, 2.6]];

const D_SCL: KF = [[4.3, 1.033], [5.17, 1.0283], [5.3, 1.0236], [5.43, 1.0209], [5.57, 1.0175], [5.83, 1.0115], [6.3, 1.0007], [6.6, 1.0]];
const D_TITLE_Y: KF = [[4.3, 517], [4.77, 516], [4.83, 514], [4.9, 508], [4.97, 499], [5.03, 483], [5.1, 457], [5.17, 409], [5.23, 336], [5.3, 288], [5.37, 263], [5.43, 248], [5.5, 239], [5.57, 234], [5.63, 232], [5.7, 231], [5.83, 232], [6.03, 234], [6.17, 235], [6.37, 236], [6.57, 238], [7.1, 240]];
const D_ROW_Y: KF[] = [
  [[5.23, 547], [5.3, 484], [5.37, 446], [5.43, 421], [5.5, 403], [5.57, 391], [5.63, 383], [5.7, 377], [5.77, 373], [5.83, 370], [5.9, 368], [5.97, 365], [6.03, 364], [6.1, 363], [6.17, 362], [6.3, 361], [6.43, 361], [6.57, 362], [7.1, 362]],
  [[5.37, 570], [5.43, 539], [5.5, 516], [5.57, 500], [5.63, 488], [5.7, 479], [5.77, 473], [5.83, 467], [5.9, 463], [5.97, 459], [6.03, 456], [6.1, 454], [6.17, 452], [6.23, 450], [6.3, 449], [6.43, 448], [6.57, 448], [7.1, 447]],
  [[5.5, 634], [5.57, 613], [5.63, 596], [5.7, 584], [5.77, 575], [5.83, 567], [5.9, 560], [5.97, 555], [6.03, 550], [6.1, 547], [6.17, 543], [6.23, 541], [6.3, 539], [6.37, 537], [6.43, 536], [6.5, 535], [6.57, 535], [7.1, 533]],
  [[5.63, 707], [5.7, 691], [5.77, 677], [5.83, 666], [5.9, 657], [5.97, 649], [6.03, 643], [6.1, 638], [6.17, 633], [6.23, 629], [6.3, 626], [6.37, 624], [6.43, 622], [6.5, 620], [6.57, 618], [7.1, 613]],
  [[5.77, 796], [5.83, 781], [5.9, 768], [5.97, 757], [6.03, 748], [6.1, 740], [6.17, 734], [6.23, 729], [6.3, 724], [6.37, 720], [6.43, 717], [6.5, 715], [6.57, 712], [7.1, 705]],
  [[5.9, 878], [5.97, 864], [6.03, 851], [6.1, 841], [6.17, 832], [6.23, 825], [6.3, 819], [6.37, 814], [6.43, 809], [6.5, 806], [6.57, 802], [7.1, 792]],
];
const D_ROW_T = [5.2, 5.33, 5.46, 5.6, 5.73, 5.86];
const D_HDR_T = [4.45, 4.62, 4.78, 4.88, 4.93];
const D_FADE: KF = [[6.73, 1], [6.87, 0.85], [6.97, 0.55], [7.07, 0]];
const D_ROWS = [
  ["Open a new account", "Questions about opening checking, savings, or other account types", "427", "72%", "g", "up", "+0.38", "g", "up"],
  ["Account type and features", "Differences between account types, features, and eligibility", "312", "60%", "y", "up", "+0.19", "g", "up"],
  ["Update account details", "Updating name, address, phone number, email, and more", "201", "56%", "y", "dn", "-0.05", "r", "dn"],
  ["Close an account", "Requests and questions about closing an account", "149", "48%", "r", "dn", "-0.23", "r", "dn"],
  ["Joint accounts and beneficiaries", "Adding/removing joint owners or managing beneficiaries", "87", "52%", "y", "up", "+0.05", "g", "dash"],
  ["Account verification and documentation", "Requests for account verification letters or supporting documents", "65", "78%", "g", "up", "+0.35", "g", "up"],
];
const D_HDRS = ["Volume", "Resolution Rate", "Resolution\nTrend", "Sentiment\nScore", "Sentiment\nTrend"];
const D_COL_X = [909, 1092, 1290, 1476, 1658];
const D_VOL: Array<KF | number> = [
  [[5.3, 421], [5.43, 424], [5.63, 426], [5.83, 428]],
  312, 201,
  [[5.63, 148], [6.03, 149], [6.23, 150], [6.43, 151], [6.63, 152], [6.83, 153]],
  87,
  [[6.23, 67], [6.43, 68], [6.63, 70], [6.83, 72], [7.05, 73]],
];
const D_PCT: Array<KF | number> = [
  72,
  [[5.43, 57], [6.03, 60], [6.23, 62], [6.43, 63], [6.63, 64], [6.83, 65]],
  56, 48,
  [[5.83, 52], [6.23, 55], [6.43, 57], [6.63, 59], [6.83, 61], [7.0, 63]],
  78,
];
const D_SCORE: Array<KF | number> = [
  38,
  [[5.43, 17], [6.03, 19], [6.23, 20], [6.43, 21], [6.63, 22]],
  -5,
  [[5.63, -22], [6.03, -22], [6.23, -24], [6.28, -24.6], [6.43, -25.4], [6.63, -27], [6.83, -28]],
  5,
  [[6.23, 36], [6.26, 36.6], [6.43, 37.4], [6.63, 39], [6.83, 40], [7.05, 41]],
];
const cellVal = (v: KF | number, t: number) => Math.round(typeof v === "number" ? v : kf(v, t));
const fmtScore = (v: number) => `${v < 0 ? "-" : "+"}0.${String(Math.abs(v)).padStart(2, "0")}`;

const Arrow = ({ dir }: { dir: "up" | "dn" }) => (
  <svg width="23" height="23" viewBox="0 0 23 23" style={{ transform: dir === "dn" ? "scaleY(-1)" : "none" }}>
    <path d="M 4.5 18.5 L 17.5 5.5 M 8.5 5 L 18 5 L 18 14.5" fill="none" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Opening: React.FC = () => {
  const rootRef = useRef<TgEl>(null);

  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;
    tg.initializer = (inst) => {
      const q = <T extends HTMLElement>(sel: string) => inst.querySelector(sel) as T;
      const qa = (sel: string) => Array.from(inst.querySelectorAll(sel)) as HTMLElement[];

      const sAB = q(".sAB"), iibars = q(".iibars"), wm = q(".wordmark"),
        wmL = q(".wmL"), wmB2 = q(".wmb2"), wmB2Fly = q(".wmb2fly"), wmR = q(".wmR"),
        elevenCh = qa(".wmL .wmch"), agentsCh = qa(".wmR .wmch"),
        bloom = q(".bloom"), bloomDot = q(".bloomdot"), whiteout = q(".whiteout");
      const bgCanvas = q<HTMLCanvasElement>(".bgcanvas");
      const bgCtx = bgCanvas ? bgCanvas.getContext("2d") : null;
      const spot = q(".spot");
      const sD = q(".sD"), dScale = q(".dscale"), dTitleLine = q(".dtline"),
        dTitle = q(".dtitle"), dRows = qa(".drow");

      const render = (ms: number) => {
        const t = OPENING_ABS_START + ms / 1000;

        const abOn = t < 3.0;
        sAB.style.opacity = abOn ? "1" : "0";
        if (abOn) {
          if (bgCtx) drawIntroBg(bgCtx, t);
          const s = kf(AB_SCALE, t);
          const cy = kf(AB_CY, t);
          iibars.style.transform = `translate(-50%,-50%) scale(${s})`;
          iibars.style.top = `${cy}px`;
          iibars.style.opacity = t < 0.97 ? "1" : "0";
          wm.style.opacity = t >= 0.97 && t < 2.65 ? String(1 - seg(t, 2.35, 2.62)) : "0";
          wmL.style.left = `${kf(WML_X, t)}px`;
          wmB2Fly.style.left = `${kf(WMB2_X, t)}px`;
          wmB2Fly.style.opacity = t >= 0.97 && t < 1.185 ? "1" : "0";
          wmB2.style.opacity = t >= 1.19 ? "1" : "0";
          wmR.style.left = `${kf(WMR_X, t)}px`;
          for (let i = 0; i < elevenCh.length; i++)
            elevenCh[i].style.opacity = t >= ELEVEN_T[i] ? "1" : "0";
          for (let i = 0; i < agentsCh.length; i++)
            agentsCh[i].style.opacity = t >= AGENTS_T[i] ? "1" : "0";
          bloomDot.style.opacity = String(seg(t, 2.3, 2.42) * (1 - seg(t, 2.45, 2.55)));
          const br = kf(BLOOM_R, t);
          bloom.style.opacity = t >= 2.37 ? String(0.75 + 0.25 * seg(t, 2.45, 2.6)) : "0";
          bloom.style.left = `${kf(BLOOM_CX, t)}px`;
          bloom.style.width = `${br * 2}px`;
          bloom.style.height = `${(br * 2) / kf(BLOOM_AR, t)}px`;
        }
        whiteout.style.opacity = String(seg(t, 2.7, 3.05) * (1 - seg(t, 3.05, 3.35)));

        const spotO = seg(t, 2.6, 2.95) * (1 - seg(t, 3.9, 4.15));
        spot.style.opacity = String(spotO);
        spot.style.transform = `translate(-50%,-50%) translateX(${-70 * Math.pow(seg(t, 3.8, 4.15), 2)}px)`;

        const dOn = t >= 4.25 && t < 7.12;
        sD.style.opacity = dOn ? String(kf(D_FADE, t)) : "0";
        if (dOn) {
          const s = kf(D_SCL, t);
          dScale.style.transform = `scale(${s})`;
          const ty = kf(D_TITLE_Y, t);
          dTitleLine.style.transform = `translateY(${407 + (ty - 407) / s - 237}px)`;
          dTitle.style.opacity = String(seg(t, 4.27, 4.5));
          dTitle.style.transform = `translateX(${45 * (1 - easeOut(seg(t, 4.27, 4.55)))}px) scaleX(0.845)`;
          dRows.forEach((el, i) => {
            const ry = kf(D_ROW_Y[i], t);
            el.style.opacity = String(seg(t, D_ROW_T[i], D_ROW_T[i] + 0.24));
            el.style.transform = `translateY(${407 + (ry - 407) / s - 361}px)`;
            const vol = el.querySelector(".dvol") as HTMLElement;
            const pct = el.querySelector(".dpct") as HTMLElement;
            const sco = el.querySelector(".dscore") as HTMLElement;
            if (vol) vol.textContent = String(cellVal(D_VOL[i], t));
            if (pct) pct.textContent = `${cellVal(D_PCT[i], t)}%`;
            if (sco) sco.textContent = fmtScore(cellVal(D_SCORE[i], t));
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

  return (
    <Timegroup ref={rootRef as React.Ref<HTMLElement>} mode="fixed" duration={`${OPENING_MS}ms`} className="scene">
      <div className="scene sAB">
        <canvas className="bgcanvas" width={1920} height={1080} />
        <div className="iibars">
          <div className="iibar b1" />
          <div className="iibar b2" />
        </div>
        <div className="wordmark" style={{ opacity: 0 }}>
          <div className="wmL">
            <div className="wmbar" style={{ left: 0 }} />
            <div className="wmbar wmb2" style={{ left: 14, opacity: 0 }} />
            <span className="wmtxt wmbold">
              {"Eleven".split("").map((ch, i) => (
                <span key={i} className="wmch" style={{ opacity: 0 }}>{ch}</span>
              ))}
            </span>
          </div>
          <div className="wmbar wmb2fly" style={{ opacity: 0 }} />
          <div className="wmR">
            {"Agents".split("").map((ch, i) => (
              <span key={i} className="wmch" style={{ opacity: 0 }}>{ch}</span>
            ))}
          </div>
        </div>
        <div className="bloomdot" style={{ opacity: 0 }} />
        <div className="bloom" style={{ opacity: 0 }} />
      </div>
      <div className="whiteout" style={{ opacity: 0 }} />

      <div className="spot" style={{ opacity: 0 }}>Spotlight</div>

      <div className="scene sD" style={{ opacity: 0 }}>
        <div className="dscale">
          <div className="dtline">
            <div className="dtitle">Deep dive on Account Management</div>
            <Reveal enter={[4370, 4550]} y={0} easeIn="linear" className="dsub">Sub-topic</Reveal>
            {D_HDRS.map((h, i) => (
              <Reveal
                key={i}
                className="dhdr"
                enter={[D_HDR_T[i] * 1000, D_HDR_T[i] * 1000 + 160]}
                y={0}
                easeIn="linear"
                style={{ left: D_COL_X[i] - 110, top: h.includes("\n") ? 252 : 258 }}
              >
                {h.split("\n").map((l, j) => (<div key={j}>{l}</div>))}
              </Reveal>
            ))}
          </div>
          {D_ROWS.map((r, i) => (
            <div className="drow" key={i} style={{ opacity: 0 }}>
              <div className="dlabel">{r[0]}</div>
              <div className="ddesc">{r[1]}</div>
              <div className="dcell dvol" style={{ left: D_COL_X[0] - 110 }}>{r[2]}</div>
              <div className={`dcell dpct c-${r[4]}`} style={{ left: D_COL_X[1] - 110 }}>{r[3]}</div>
              <div className={`darr c-${r[5] === "up" ? "g" : "r"}`} style={{ left: D_COL_X[2] - 110 }}>
                <Arrow dir={r[5] as "up" | "dn"} />
              </div>
              <div className={`dcell dscore c-${r[7]}`} style={{ left: D_COL_X[3] - 110 }}>{r[6]}</div>
              <div className={`darr c-${r[7]}`} style={{ left: D_COL_X[4] - 110 }}>
                {r[8] === "dash" ? <span className="dash">—</span> : <Arrow dir={r[8] as "up" | "dn"} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Timegroup>
  );
};
