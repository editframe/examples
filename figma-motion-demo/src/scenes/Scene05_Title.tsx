import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TITLE_MS } from "../constants";
import { track, lerp, clamp, outCubic } from "../helpers";
import { useFrameTask } from "../useFrameTask";
import { CARD_SPACESHIP, CARD_REFURN, CARD_QUIET, FERN, VIDEOPANEL, POD_A, POD_B, POD_C, POD_D } from "../assets/title5";

/**
 * S05 — "Figma Motion" title  ·  6.83–9.83s (3.0s)
 * Choreography:
 *  - Title: "Figma" POPS at ms250 in WHITE -> orange at ms417; "Motion" POPS at ms417
 *    WHITE -> orange at ms583. Both lines CENTERED on x=960 (not left-aligned).
 *    No slide/scale — instant pops.
 *  - Museum tray (dark, rounded) rises in from bottom-left in the first ~330ms, then drifts
 *    up-left while the CARDS slide right->left inside it (SPACESHIP EARTH exits; RE:FURNISHED,
 *    THE QUIET SPECTRUM enter). Card titles fill from grey skeleton bars as each card settles.
 *    Tray+cards EXIT left late in the scene (~ms2400-2750) as the RE:FURNISHED card expands
 *    into the video panel.
 *  - FERN halftone tile enters top-right at the start and drifts DOWN-LEFT.
 *  - PINK tile w/ 2 teal squares hangs from top ms583-1229, replaced by the green/purple
 *    CHECKER sliding DOWN from ~ms1167.
 *  - POD tile drops from top-right to its bottom seat by ~ms333, then settles left-down;
 *    the yellow molecule overlay MORPHS continuously (nodes/splines shift).
 *  - VIDEO panel (frosted RE:FURNISHED label baked into the art) grows from the card spot
 *    over ms2350-2700 to (x -10, y 338, 483x407) — no play button / progress bar.
 */
const ORANGE = "#F4602A";
const SANS = 'Arial, Helvetica, "Segoe UI", sans-serif';
const CARD_W = 268, CARD_PITCH = 293;

// piecewise-linear key interpolation: [ms, value][]
const keyv = (ms: number, ks: [number, number][]) => {
  if (ms <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) {
    if (ms <= ks[i][0]) {
      const [t0, v0] = ks[i - 1], [t1, v1] = ks[i];
      return v0 + (v1 - v0) * ((ms - t0) / (t1 - t0));
    }
  }
  return ks[ks.length - 1][1];
};

// checker grid: cells RECOLOR over time — green/purple only until ~ms2400, then
// orange/grey accents appear on rows 2-3. Irregular col/row sizes.
const CHK_COLS = [85, 165, 80, 32];
const CHK_ROWS = [118, 68, 54];
const CHK_G = "#0B5B33", CHK_P = "#8B57FB", CHK_O = "#F06A2B", CHK_GR = "#8E8E8E";
const CHK_STATE_A = [CHK_G, CHK_P, CHK_G, CHK_P, CHK_P, CHK_G, CHK_P, CHK_G, CHK_G, CHK_P, CHK_G, CHK_P];
const CHK_STATE_B = [CHK_G, CHK_P, CHK_G, CHK_P, CHK_O, CHK_GR, CHK_G, CHK_P, CHK_GR, CHK_O, CHK_GR, CHK_P];

const MUSEUM: { date: string; title: string[]; img: string; imgW?: number }[] = [
  { date: "01.29–04.27, 2026", title: ["SPACESHIP", "EARTH"], img: CARD_SPACESHIP },
  { date: "03.06–06.16, 2026", title: ["RE:", "FURNISHED"], img: CARD_REFURN },
  { date: "05.16–08.21, 2026", title: ["THE QUIET", "SPECTRUM"], img: CARD_QUIET, imgW: 176 },
];
const TITLE_REVEAL = [667, 1300, 2083]; // skeleton -> real text per card

export const Scene05_Title: React.FC = () => {
  const l1 = useRef<HTMLDivElement>(null);
  const l2 = useRef<HTMLDivElement>(null);
  const fern = useRef<HTMLDivElement>(null);
  const pink = useRef<HTMLDivElement>(null);
  const chk = useRef<HTMLDivElement>(null);
  const tray = useRef<HTMLDivElement>(null);
  const cardRow = useRef<HTMLDivElement>(null);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const cardTexts = useRef<(HTMLDivElement | null)[]>([]);
  const cardSkels = useRef<(HTMLDivElement | null)[]>([]);
  const pod = useRef<HTMLDivElement>(null);
  const podLayers = useRef<(HTMLDivElement | null)[]>([]);
  const chkCells = useRef<(HTMLDivElement | null)[]>([]);
  const videoPanel = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
    const ms = ownCurrentTimeMs;

    // ---- title: instant pops, white -> orange steps
    if (l1.current) {
      l1.current.style.opacity = ms >= 250 ? "1" : "0";
      l1.current.style.color = ms < 417 ? "#FFFFFF" : ORANGE;
    }
    if (l2.current) {
      l2.current.style.opacity = ms >= 417 ? "1" : "0";
      l2.current.style.color = ms < 583 ? "#FFFFFF" : ORANGE;
    }

    // ---- fern tile: enters top-right, drifts DOWN-LEFT
    if (fern.current) {
      const x = keyv(ms, [[0, 1570], [167, 1565], [333, 1540], [833, 1513], [1500, 1490], [2333, 1480], [3000, 1478]]);
      const y = keyv(ms, [[0, -460], [167, -430], [333, -182], [833, 37], [1500, 118], [2333, 150], [3000, 158]]);
      fern.current.style.transform = `translate(${x}px, ${y}px)`;
    }

    // ---- pink tile w/ teal squares: hangs from top ms583-1000, slides back up out by ~ms1229
    if (pink.current) {
      const y = keyv(ms, [[583, -175], [833, -90], [1000, -88], [1229, -180]]);
      pink.current.style.transform = `translate(1185px, ${y}px)`;
    }

    // ---- checker: anchored at the top edge, REVEALS downward (height clip);
    //      cells recolor: orange/grey accents appear on rows 2-3 only from ~ms2400
    if (chk.current) {
      const h = keyv(ms, [[1167, 0], [1500, 160], [2333, 198], [2667, 240]]);
      chk.current.style.height = `${h}px`;
    }
    const chkPal = ms < 2400 ? CHK_STATE_A : CHK_STATE_B;
    chkCells.current.forEach((el, i) => { if (el) el.style.background = chkPal[i]; });

    // ---- tray + cards: rise in from bottom-left, drift up-left, cards slide left inside;
    //      whole group exits left ~ms2417-2750
    if (tray.current) {
      const x = keyv(ms, [[83, -28], [833, -124], [1500, -150], [2333, -157], [2417, -157], [2750, -720]]);
      const y = keyv(ms, [[83, 1090], [333, 755], [833, 525], [1500, 432], [2333, 388], [3000, 388]]);
      tray.current.style.transform = `translate(${x}px, ${y}px)`;
    }
    if (cardRow.current) {
      // tray starts EMPTY — the row slides in fast from the right, then drifts left
      const rx = keyv(ms, [[167, 660], [333, 153], [833, 150], [1500, 7], [2333, -126], [3000, -126]]);
      cardRow.current.style.transform = `translateX(${rx}px)`;
    }
    // cards 2 and 3 enter individually from the right, staggered (card2 ~ms400, card3 ~ms1300)
    if (cardEls.current[1]) cardEls.current[1].style.transform = `translateX(${keyv(ms, [[400, 230], [800, 0]])}px)`;
    if (cardEls.current[2]) cardEls.current[2].style.transform = `translateX(${keyv(ms, [[1300, 260], [1800, 0]])}px)`;
    // card titles fill in from skeletons as each card settles
    cardTexts.current.forEach((el, i) => { if (el) el.style.opacity = ms >= TITLE_REVEAL[i] ? "1" : "0"; });
    cardSkels.current.forEach((el, i) => { if (el) el.style.opacity = ms >= TITLE_REVEAL[i] ? "0" : "1"; });

    // ---- pod tile: drops from top-right to bottom seat by ~ms333, settles left-down.
    //      Content = pre-baked art layers (molecule baked in), crossfading between anchor states.
    if (pod.current) {
      const x = keyv(ms, [[0, 1085], [333, 935], [833, 815], [1500, 760], [2333, 735], [3000, 730]]);
      const y = keyv(ms, [[0, -140], [333, 618], [833, 780], [1500, 828], [2333, 855], [3000, 862]]);
      pod.current.style.transform = `translate(${x}px, ${y}px)`;
    }
    const podFade = [1, track(ms, 900, 1050), track(ms, 1600, 1750), track(ms, 2400, 2550)];
    podLayers.current.forEach((el, i) => { if (el) el.style.opacity = String(podFade[i]); });

    // ---- video panel: grows from the RE:FURNISHED card spot over ms2350-2700
    if (videoPanel.current) {
      const v = track(ms, 2350, 2700, outCubic);
      videoPanel.current.style.opacity = v > 0.02 ? "1" : "0";
      videoPanel.current.style.left = `${lerp(10, -10, v)}px`;
      videoPanel.current.style.top = `${lerp(430, 338, v)}px`;
      videoPanel.current.style.width = `${lerp(268, 483, v)}px`;
      videoPanel.current.style.height = `${lerp(340, 407, v)}px`;
    }
  }, []);

  const regTxt = (i: number) => (el: HTMLDivElement | null) => { cardTexts.current[i] = el; };
  const regSkel = (i: number) => (el: HTMLDivElement | null) => { cardSkels.current[i] = el; };
  const regCard = (i: number) => (el: HTMLDivElement | null) => { cardEls.current[i] = el; };
  const regPod = (i: number) => (el: HTMLDivElement | null) => { podLayers.current[i] = el; };
  const regChk = (i: number) => (el: HTMLDivElement | null) => { chkCells.current[i] = el; };

  // checker cell offsets (irregular grid)
  const chkCellRects: { x: number; y: number; w: number; h: number }[] = [];
  {
    let cy = 0;
    for (const rh of CHK_ROWS) {
      let cx = 0;
      for (const cw of CHK_COLS) { chkCellRects.push({ x: cx, y: cy, w: cw, h: rh }); cx += cw; }
      cy += rh;
    }
  }

  const frameRef = useFrameTask(handleFrame);
  return (
    <Timegroup mode="fixed" duration={`${TITLE_MS}ms`} ref={frameRef} className="absolute inset-0" style={{ background: "#000" }}>
      {/* checker — anchored top, height-clipped reveal; cells recolor over time (below fern in z) */}
      <div ref={chk} style={{ position: "absolute", left: 1213, top: 0, width: 362, height: 0, overflow: "hidden", zIndex: 3 }}>
        {chkCellRects.map((r, i) => (
          <div key={i} ref={regChk(i)} style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, background: CHK_STATE_A[i] }} />
        ))}
      </div>

      {/* pink tile with two teal squares, hanging from the top edge */}
      <div ref={pink} style={{ position: "absolute", left: 0, top: 0, width: 365, height: 175, transform: "translate(1185px,-180px)", background: "#F7C6C2", zIndex: 3 }}>
        <div style={{ position: "absolute", left: 55, bottom: 8, width: 66, height: 66, background: "#00B8C7" }} />
        <div style={{ position: "absolute", left: 230, bottom: 8, width: 66, height: 66, background: "#00B8C7" }} />
      </div>

      {/* fern halftone tile — drifts down-left */}
      <div ref={fern} style={{ position: "absolute", left: 0, top: 0, width: 440, height: 450, transform: "translate(1570px,-460px)", backgroundImage: `url(${FERN})`, backgroundSize: "100% 100%", zIndex: 4 }} />

      {/* pod tile — pre-baked art layers (molecule baked in) crossfading between anchor states */}
      <div ref={pod} style={{ position: "absolute", left: 0, top: 0, width: 750, height: 462, transform: "translate(1085px,-140px)", overflow: "hidden", zIndex: 5 }}>
        <div ref={regPod(0)} style={{ position: "absolute", left: 0, top: 0, width: 748, height: 462, backgroundImage: `url(${POD_A})`, backgroundSize: "100% 100%" }} />
        <div ref={regPod(1)} style={{ position: "absolute", left: 0, top: 0, width: 750, height: 300, backgroundImage: `url(${POD_B})`, backgroundSize: "100% 100%", opacity: 0 }} />
        <div ref={regPod(2)} style={{ position: "absolute", left: 0, top: 0, width: 752, height: 252, backgroundImage: `url(${POD_C})`, backgroundSize: "100% 100%", opacity: 0 }} />
        <div ref={regPod(3)} style={{ position: "absolute", left: 0, top: 0, width: 748, height: 225, backgroundImage: `url(${POD_D})`, backgroundSize: "100% 100%", opacity: 0 }} />
      </div>

      {/* museum tray + cards (tray clips cards; rounded corners) */}
      <div ref={tray} style={{ position: "absolute", left: 0, top: 0, width: 640, height: 415, transform: "translate(-28px,1090px)", background: "#3A3D36", borderRadius: 28, overflow: "hidden", zIndex: 6 }}>
        <div ref={cardRow} style={{ position: "absolute", left: 0, top: 40, display: "flex" }}>
          {MUSEUM.map((c, i) => (
            <div key={i} ref={regCard(i)} style={{ position: "relative", width: CARD_W, marginRight: CARD_PITCH - CARD_W, flex: `0 0 ${CARD_W}px`, background: "#F4F2EE", borderRadius: 14, overflow: "hidden", fontFamily: SANS }}>
              <div style={{ height: 210, backgroundImage: `url(${c.img})`, backgroundSize: c.imgW ? "auto 100%" : "100% 100%", backgroundPosition: "left center", backgroundRepeat: "no-repeat", backgroundColor: "#DDD9D2" }} />
              <div style={{ position: "relative", padding: "12px 14px 16px", minHeight: 96 }}>
                {/* skeleton placeholder bars (pre-reveal) */}
                <div ref={regSkel(i)} style={{ position: "absolute", left: 14, top: 14, opacity: 1 }}>
                  <div style={{ width: 120, height: 12, borderRadius: 6, background: "#DAD6CF" }} />
                  <div style={{ width: 150, height: 26, borderRadius: 6, background: "#DAD6CF", marginTop: 12 }} />
                </div>
                {/* real text (post-reveal) */}
                <div ref={regTxt(i)} style={{ opacity: 0 }}>
                  <div style={{ fontSize: 13, color: "#6F6F6F" }}><span style={{ color: "#C9C43B" }}>●</span> {c.date}</div>
                  <div style={{ marginTop: 8, lineHeight: 1.12 }}>
                    {c.title.map((t) => (
                      <div key={t} style={{ display: "table", background: "#E8FF59", fontWeight: 800, fontSize: 24, padding: "0 4px", color: "#111" }}>{t}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* video panel — frosted RE:FURNISHED label + pause bars baked into the art */}
      <div ref={videoPanel} style={{ position: "absolute", left: 10, top: 430, width: 268, height: 340, borderRadius: 14, overflow: "hidden", opacity: 0, zIndex: 7, backgroundImage: `url(${VIDEOPANEL})`, backgroundSize: "100% 100%" }} />

      {/* title — both lines CENTERED on x=960, instant pops */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 400, fontSize: 210, lineHeight: 1.18, letterSpacing: "-0.02em", zIndex: 10, paddingBottom: 10 }}>
        <div ref={l1} style={{ opacity: 0, color: "#FFFFFF" }}>Figma</div>
        <div ref={l2} style={{ opacity: 0, color: "#FFFFFF" }}>Motion</div>
      </div>
    </Timegroup>
  );
};

export default Scene05_Title;
