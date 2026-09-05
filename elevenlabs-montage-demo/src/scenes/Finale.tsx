/**
 * Finale — H + I + J (12.9–22.0s, declared 9100ms).
 *
 * Mounts at 12.9 while Charts is still up through 13.06. H icon converge +
 * globe warp, I topic bubbles, J pricing grid. t = 12.9 + ownCurrentTimeMs/1000.
 * J titles keep a static scaleX, so they stay in the frame task with the grid.
 */
import React, { useEffect, useRef } from "react";
import { Timegroup, Image as EfImage } from "@editframe/react";
import { FINALE_ABS_START, FINALE_MS } from "../constants";
import { ckf, easeOut, kf, lerp, seg, type CircKF, type KF, type TgEl } from "../lib/anim";
import { drawGlobe, GlobeTexture, primeGlobeTexture } from "../components/Globe";

const slackPng = "/elevenlabs-montage-demo/src/assets/crops/slack.png";
const whatsappPng = "/elevenlabs-montage-demo/src/assets/crops/whatsapp.png";
const phonePng = "/elevenlabs-montage-demo/src/assets/crops/phone.png";
const chatPng = "/elevenlabs-montage-demo/src/assets/crops/chat.png";
const mailPng = "/elevenlabs-montage-demo/src/assets/crops/mail.png";
const lineglobePng = "/elevenlabs-montage-demo/src/assets/crops/lineglobe.png";

const ROT: KF = [[13.0, 0], [13.3, 0.04], [13.57, 0.17], [13.83, 0.39], [14.1, 0.65], [14.37, 0.97], [14.63, 1.43], [14.9, 1.95], [15.17, 2.53], [15.43, 3.28], [15.7, 4.13], [15.97, 5.31], [16.1, 7.5], [16.2, 10.7], [16.3, 16.0], [16.4, 24.4], [16.5, 37.2], [16.6, 52], [16.7, 70], [16.85, 95]];
const deRot = (x: number, y: number) => {
  const th = (0.97 * Math.PI) / 180;
  const dx = x - 960, dy = y - 540;
  return { x: 960 + dx * Math.cos(th) + dy * Math.sin(th), y: 540 - dx * Math.sin(th) + dy * Math.cos(th) };
};
const H_ICONS = [
  { img: slackPng, w: 80, h: 80, ...deRot(960, 180), t0: 13.17, t1: 13.3, conv: [[13.17, 205], [13.23, 93], [13.3, 90], [13.37, 72], [13.43, 36], [13.5, -15], [13.57, -39], [13.63, -31], [13.7, -21], [13.77, -6], [13.83, -2], [13.9, 0]] as KF, axis: "y" },
  { img: whatsappPng, w: 79, h: 85, ...deRot(215, 533), t0: 13.3, t1: 13.45, conv: [[13.3, 170], [13.43, 178], [13.5, 166], [13.57, 129], [13.63, 90], [13.7, 51], [13.77, 19], [13.83, 0], [13.9, -4], [14.0, 0]] as KF, axis: "x" },
  { img: phonePng, w: 74, h: 74, ...deRot(600, 540), t0: 13.13, t1: 13.25, conv: [[13.17, -82], [13.23, -33], [13.3, -3], [13.37, 11], [13.43, 16], [13.5, 18], [13.63, 8], [13.7, -5], [13.83, -5], [13.97, 0]] as KF, axis: "x" },
  { img: chatPng, w: 74, h: 68, ...deRot(1318, 542), t0: 13.13, t1: 13.25, conv: [[13.23, 64], [13.3, 55], [13.37, 45], [13.43, 41], [13.5, 33], [13.57, 25], [13.63, 19], [13.7, 13], [13.77, 9], [13.83, 5], [13.9, 2], [14.0, 0]] as KF, axis: "x" },
  { img: mailPng, w: 72, h: 64, ...deRot(1673, 549), t0: 13.3, t1: 13.45, conv: [[13.37, 68], [13.43, 70], [13.5, 56], [13.57, 44], [13.63, 33], [13.7, 24], [13.77, 17], [13.83, 10], [13.9, 5], [14.0, 0]] as KF, axis: "x" },
  { img: lineglobePng, w: 83, h: 83, ...deRot(954, 895), t0: 13.17, t1: 13.3, conv: [[13.17, -135], [13.23, -98], [13.3, -58], [13.37, 1], [13.43, 52], [13.5, 49], [13.57, 38], [13.63, 29], [13.7, 21], [13.77, 14], [13.83, 9], [13.9, 4], [13.97, 0]] as KF, axis: "y" },
];
const IC_S: KF = [[13.13, 2.1], [13.23, 1.98], [13.3, 1.87], [13.37, 1.74], [13.43, 1.61], [13.5, 1.49], [13.57, 1.37], [13.63, 1.26], [13.7, 1.16], [13.77, 1.1], [13.83, 1.06], [13.9, 1.03], [14.0, 1.0]];
const EARTH_SCALE: KF = [[12.97, 2.2], [13.0, 2.4], [13.033, 3.0], [13.067, 2.365], [13.1, 2.024], [13.133, 1.817], [13.167, 1.79], [13.233, 1.76], [13.3, 1.696], [13.367, 1.608], [13.433, 1.384], [13.5, 1.176], [13.567, 1.136], [13.633, 1.104], [13.7, 1.08], [13.767, 1.056], [13.833, 1.04], [13.9, 1.016], [13.967, 1.0], [16.1, 1.0], [16.5, 1.037], [16.6, 1.109], [16.7, 1.224], [16.8, 1.606], [16.9, 1.807], [16.967, 1.866], [17.05, 1.95]];

const I_AM: CircKF = [[16.8, 960, 539, 202], [16.93, 959, 539, 232], [17.07, 953, 540, 240], [17.2, 899, 543, 232], [17.33, 834, 547, 172], [17.47, 817, 548, 154], [17.6, 811, 548, 147], [17.73, 809, 548, 145], [18.0, 808, 548, 145], [18.67, 806, 549, 147], [20.6, 806, 549, 147]];
const I_CMC: CircKF = [[17.33, 1107, 549, 69], [17.47, 1107, 549, 97], [17.6, 1108, 549, 113], [17.73, 1108, 549, 123], [17.87, 1108, 549, 128], [18.0, 1109, 549, 130], [18.4, 1109, 549, 130], [18.67, 1110, 549, 131], [20.6, 1110, 549, 131]];
const I_TP: CircKF = [[17.47, 977, 801, 73], [17.6, 977, 801, 106], [17.73, 977, 802, 121], [17.87, 977, 802, 129], [18.0, 977, 803, 133], [18.27, 977, 804, 134], [18.67, 977, 806, 135], [20.6, 977, 806, 135]];
const I_AAL: CircKF = [[17.6, 981, 306, 59], [17.73, 981, 305, 95], [17.87, 981, 305, 111], [18.0, 981, 304, 119], [18.13, 981, 304, 123], [18.4, 981, 303, 124], [18.67, 981, 302, 124], [20.6, 981, 302, 124]];
const I_BLUES = [
  { tab: I_AM, label: "Account\nManagement", show: 17.33, fs: 28 },
  { tab: I_CMC, label: "Card Management\nand Controls", show: 17.6, fs: 24 },
  { tab: I_TP, label: "Transactions\nand Payments", show: 17.73, fs: 24 },
  { tab: I_AAL, label: "Account Access\nand Login", show: 17.87, fs: 24 },
];
const J_TGT: Array<[number, number, number]> = [[556, 463, 60], [702, 616, 67], [690, 482, 49], [517, 634, 103]];
const I_GRAYS: Array<[number, number, number, number, string]> = [
  [1013, 109, 59, 18.93, ""], [856, 133, 74, 19.07, ""], [1132, 176, 64, 18.87, ""], [1255, 184, 24, 20.0, ""],
  [718, 278, 116, 18.8, "Fraud and Security\nConcerns"], [1203, 323, 87, 18.87, "Fees and Charges\nDisputes"],
  [541, 313, 44, 19.27, ""], [1366, 323, 55, 19.33, ""], [592, 444, 72, 18.4, ""], [1427, 415, 36, 19.13, ""],
  [1315, 460, 70, 18.8, ""], [468, 438, 30, 19.2, ""], [1435, 542, 58, 19.27, ""], [481, 547, 56, 19.0, ""],
  [1314, 628, 66, 18.2, ""], [590, 661, 79, 18.47, ""], [1428, 673, 31, 19.2, ""],
  [1209, 762, 86, 18.93, "Statements\nand Documents"], [728, 795, 96, 17.93, "Loans and Credit\nServices"],
  [1366, 760, 52, 19.07, ""], [562, 810, 52, 19.47, ""], [1152, 913, 62, 19.0, ""], [1268, 891, 39, 19.13, ""],
  [821, 943, 62, 18.93, ""], [703, 954, 42, 19.6, ""], [1001, 986, 36, 19.8, ""],
];

const J_AX: KF = [[20.3, 1.0], [20.45, 1.3], [20.5, 1.21], [20.6, 1.094], [20.7, 1.05], [20.8, 1.028], [20.9, 1.013], [21.0, 1.005], [21.1, 1.0]];
const J_AY: KF = [[20.3, 1.0], [20.45, 1.55], [20.5, 1.4], [20.6, 1.15], [20.7, 1.075], [20.8, 1.04], [20.9, 1.017], [21.0, 1.006], [21.1, 1.0]];
const J_BY: KF = [[20.3, 0], [20.45, -290], [20.5, -237], [20.6, -96], [20.7, -49], [20.8, -25], [20.9, -11], [21.0, -4], [21.1, 0]];
const J_BX: KF = [[20.3, 0], [20.45, -6], [21.0, -3], [21.1, 0]];
const J_ROWS = [
  { chev: ">", name: "Account management", desc: "Profile updates, beneficiary changes, account closures, and preferen...", n: "412", pct: "87%", top: 74, sub: false, hl: false },
  { chev: ">", name: "Transactions and payments", desc: "Failed transfers, pending payments, direct debits, and recurring char...", n: "347", pct: "81%", top: 134, sub: false, hl: false },
  { chev: ">", name: "Card management and controls", desc: "Lost cards, activation, PIN resets, spending limits, and travel notificat...", n: "324", pct: "89%", top: 194, sub: false, hl: false },
  { chev: "", name: "Account access and login", desc: "Login failures, authentication issues, and account recovery requests", n: "287", pct: "54%", top: 255, sub: false, hl: true },
  { chev: "↳", name: "Password issues", desc: "Forgotten credentials, reset email failures, and security question", n: "168", pct: "38%", top: 316, sub: true, hl: false },
  { chev: "↳", name: "Two-factor authentification issues", desc: "SMS code delays, authenticator app sync, and trusted device err...", n: "89", pct: "67%", top: 376, sub: true, hl: false },
];

export const Finale: React.FC = () => {
  const rootRef = useRef<TgEl>(null);

  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;
    tg.initializer = (inst) => {
      const q = <T extends HTMLElement>(sel: string) => inst.querySelector(sel) as T;
      const qa = (sel: string) => Array.from(inst.querySelectorAll(sel)) as HTMLElement[];

      const sH = q(".sH"), hRot = q(".hrot"), hIcons = qa(".hicon"), earthWrap = q(".earth"),
        earthCanvas = q<HTMLCanvasElement>(".earthcanvas"), hDeco = qa(".hdeco");
      const earthCtx = earthCanvas ? earthCanvas.getContext("2d") : null;
      primeGlobeTexture();
      const sI = q(".sI"), blues = qa(".blu"), bluLbls = qa(".blulbl"), grays = qa(".gry"),
        gryLbls = qa(".grylbl"), iGuides = q(".iguides");
      const sJ = q(".sJ"), jScale = q(".jscale"), jBlack = q(".jblack"), jGraysL = qa(".jgray"),
        jTitles = qa(".jtitle"), jRowWraps = qa(".jrowwrap");

      const render = (ms: number) => {
        const t = FINALE_ABS_START + ms / 1000;

        const hOn = t >= 12.9 && t < 17.05;
        sH.style.opacity = hOn ? "1" : "0";
        if (hOn) {
          hRot.style.transform = `rotate(${kf(ROT, t)}deg)`;
          const dec = 1 - seg(t, 16.45, 16.8);
          for (const el of hDeco) el.style.opacity = String(seg(t, 12.95, 13.25) * dec);
          const ics = kf(IC_S, t);
          hIcons.forEach((el, i) => {
            const ic = H_ICONS[i];
            const off = kf(ic.conv, t);
            el.style.opacity = String(seg(t, ic.t0, ic.t1) * dec);
            el.style.transform =
              (ic.axis === "x" ? `translate(${off}px,0)` : `translate(0,${off}px)`) + ` scale(${ics})`;
          });
          const es = kf(EARTH_SCALE, t);
          earthWrap.style.transform = `translate(-50%,-50%) scale(${es})`;
          earthWrap.style.left = `${960 + kf([[12.97, 430], [13.0, 300], [13.033, -20], [13.067, -3], [13.1, 0]] as KF, t)}px`;
          earthWrap.style.top = `${540 + kf([[12.97, -130], [13.0, -100], [13.033, -13], [13.067, -2], [13.1, 0]] as KF, t)}px`;
          earthWrap.style.opacity = String(
            kf([[12.95, 0], [12.98, 0.25], [13.0, 0.4], [13.033, 0.65], [13.067, 1]] as KF, t) * (1 - seg(t, 16.72, 16.92))
          );
          const eb = 16 * (1 - seg(t, 13.0, 13.6)) + 9 * seg(t, 16.62, 17.0);
          const ga = 1 - seg(t, 13.35, 14.15);
          const glow = ga > 0.02
            ? ` drop-shadow(-6px -4px 30px rgba(140,200,150,${(0.55 * ga).toFixed(3)})) drop-shadow(8px 6px 34px rgba(90,190,190,${(0.5 * ga).toFixed(3)}))`
            : "";
          earthWrap.style.filter = eb > 0.3 || glow ? `blur(${Math.max(eb, 0)}px)${glow}` : "none";
          if (earthCtx) drawGlobe(earthCtx, t);
        }

        const iOn = t >= 16.75 && t < 21.0;
        sI.style.opacity = iOn ? "1" : "0";
        const iExit = kf([[20.08, 0], [20.2, 0.04], [20.3, 0.12], [20.4, 0.27], [20.5, 0.75], [20.6, 0.97], [20.67, 1]] as KF, t);
        const grayFade = 1 - seg(t, 20.43, 20.54);
        if (iOn) {
          iGuides.style.opacity = String(seg(t, 17.3, 17.9) * grayFade);
          blues.forEach((el, i) => {
            const B = I_BLUES[i];
            const on = t >= B.tab[0][0];
            el.style.opacity = on ? String(1 - seg(t, 20.52, 20.85)) : "0";
            if (on) {
              let [, cx, cy, r] = ckf(B.tab, t);
              if (iExit > 0) {
                const [tx, ty, tr] = J_TGT[i];
                const ax = kf(J_AX, t), ay = kf(J_AY, t);
                const sx = ax * tx + kf(J_BX, t), sy = ay * ty + kf(J_BY, t);
                const sr = tr * (ax + ay) / 2;
                cx = lerp(cx as number, sx, iExit); cy = lerp(cy as number, sy, iExit); r = lerp(r as number, sr, iExit);
              }
              el.style.left = `${(cx as number) - (r as number)}px`; el.style.top = `${(cy as number) - (r as number)}px`;
              el.style.width = el.style.height = `${(r as number) * 2}px`;
              bluLbls[i].style.opacity = String(seg(t, B.show + 0.15, B.show + 0.45) * (1 - seg(t, 20.35, 20.52)));
            }
          });
          grays.forEach((el, i) => {
            const [cx, cy, r, t0] = I_GRAYS[i];
            const p = easeOut(seg(t, t0 - 0.05, t0 + 0.42));
            const rr = r * p;
            el.style.opacity = p > 0.01 ? String(grayFade) : "0";
            el.style.left = `${cx - rr}px`; el.style.top = `${cy - rr}px`;
            el.style.width = el.style.height = `${rr * 2}px`;
          });
          gryLbls.forEach((el) => {
            const t0 = parseFloat(el.dataset.t0 || "19");
            el.style.opacity = String(seg(t, t0 + 0.25, t0 + 0.55) * grayFade);
          });
        }

        const jOn = t >= 20.42;
        sJ.style.opacity = jOn ? String(seg(t, 20.45, 20.72)) : "0";
        if (jOn) {
          const ax = kf(J_AX, t), ay = kf(J_AY, t), bx = kf(J_BX, t), by = kf(J_BY, t);
          jScale.style.transform = `translate(${bx}px, ${by}px) scale(${ax}, ${ay})`;
          jBlack.style.opacity = String(seg(t, 20.5, 20.72));
          jBlack.style.transform = `scale(${lerp(0.88, 1, easeOut(seg(t, 20.5, 20.85)))})`;
          for (const el of jGraysL) el.style.opacity = String(seg(t, 20.5, 20.78));
          for (const el of jTitles) el.style.opacity = String(seg(t, 20.95, 21.1));
          jRowWraps.forEach((el, i) => {
            el.style.opacity = String(seg(t, 21.0 + i * 0.085, 21.18 + i * 0.085));
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
    <Timegroup ref={rootRef as React.Ref<HTMLElement>} mode="fixed" duration={`${FINALE_MS}ms`} className="scene">
      <div className="scene sH" style={{ opacity: 0 }}>
        <div className="hrot">
          <div className="hdeco hgl v" style={{ left: 820 }} />
          <div className="hdeco hgl v" style={{ left: 1099 }} />
          <div className="hdeco hgl h" style={{ top: 397 }} />
          <div className="hdeco hgl h" style={{ top: 682 }} />
          {H_ICONS.map((ic, i) => (
            <div className="hicon" key={i} style={{ left: ic.x, top: ic.y }}>
              <div className="hring" />
              <EfImage src={ic.img} style={{ width: ic.w, height: ic.h, marginLeft: -ic.w / 2, marginTop: -ic.h / 2 }} />
            </div>
          ))}
          <div className="earth" style={{ opacity: 0 }}>
            <canvas className="earthcanvas" width={250} height={250} />
            <GlobeTexture />
          </div>
        </div>
      </div>

      <div className="scene sI" style={{ opacity: 0 }}>
        <div className="iguides" style={{ opacity: 0 }}>
          <div className="gv" style={{ left: 423 }} />
          <div className="gv" style={{ left: 1494 }} />
          <div className="gh" style={{ top: 44 }} />
          <div className="gh" style={{ top: 1030 }} />
        </div>
        {I_GRAYS.map((_, i) => (
          <div className="gry" key={i} style={{ opacity: 0 }} />
        ))}
        {I_GRAYS.filter((g) => g[4]).map((g, i) => (
          <div className="grylbl" key={i} data-t0={g[3]} style={{ left: g[0] - 150, top: g[1] - 24, opacity: 0 }}>
            {g[4].split("\n").map((l, j) => (<div key={j}>{l}</div>))}
          </div>
        ))}
        {I_BLUES.map((b, i) => (
          <div className="blu" key={i} style={{ opacity: 0 }}>
            <div className="blulbl" style={{ opacity: 0, fontSize: b.fs }}>
              {b.label.split("\n").map((l, j) => (<div key={j}>{l}</div>))}
            </div>
          </div>
        ))}
      </div>

      <div className="scene sJ" style={{ opacity: 0 }}>
        <div className="jscale">
          <div className="jguides">
            <div className="gv" style={{ left: 273 }} />
            <div className="gv" style={{ left: 1643 }} />
            <div className="gh" style={{ top: 329 }} />
            <div className="gh" style={{ top: 806 }} />
          </div>
          <div className="jcard" style={{ left: 291, top: 350, width: 652, height: 433 }}>
            <div className="jtitle">Topic bubble chart</div>
            <div className="jblack" style={{ left: 517 - 291 - 103, top: 634 - 350 - 103, width: 206, height: 206 }}>
              <div className="jblacklbl">Account access<br />and login</div>
            </div>
            {[
              { x: 556, y: 463, r: 60, lbl: "Account\nManagement", fs: 12 },
              { x: 690, y: 482, r: 49, lbl: "Transactions\nand Payments", fs: 10 },
              { x: 702, y: 616, r: 67, lbl: "Card Managements\nand Controls", fs: 11 },
            ].map((c, i) => (
              <div className="jgray" key={i} style={{ left: c.x - 291 - c.r, top: c.y - 350 - c.r, width: c.r * 2, height: c.r * 2, fontSize: c.fs }}>
                {c.lbl.split("\n").map((l, j) => (<div key={j}>{l}</div>))}
              </div>
            ))}
          </div>
          <div className="jcard" style={{ left: 975, top: 350, width: 650, height: 433 }}>
            <div className="jtitle">Conversation topics</div>
            {J_ROWS.map((r, i) => (
              <div key={i} className="jrowwrap" style={{ opacity: 0 }}>
                {r.hl && <div className="jhl" style={{ top: r.top - 9, height: 52 }} />}
                <div className="jrow" style={{ top: r.top }}>
                  {r.chev && <span className={r.sub ? "jsubarr" : "jchev"}>{r.chev}</span>}
                  <span className="jname" style={{ left: r.sub ? 70 : 39 }}>{r.name}</span>
                  <div className="jdesc" style={{ left: r.sub ? 70 : 39 }}>{r.desc}</div>
                  <span className="jnum">{r.n}</span>
                  <span className="jpct">{r.pct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Timegroup>
  );
};
