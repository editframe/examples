import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { PURPLE_MS } from "../constants";
import { track, keys, lerp, linear, outCubic, inOutCubic, PAL } from "../helpers";
import { useFrameTask } from "../useFrameTask";
import { GrabCursor, ArrowCursor } from "../components/Cursors";

/**
 * S06 — Purple slider  ·  4.083s
 * Choreography:
 *  - 0-420ms: camera parked DEEP (2.2x) on the pill's left cap — empty pill.
 *  - 500-1000ms: a HAND drags the knob IN from below the frame, knob carries a
 *    TILTED blue selection box (white corner handles) that straightens as it lands.
 *  - 1080-1330ms: camera pulls out to the wide view; hand swaps to the black arrow; the
 *    gizmo builds in stages (blue ring -> top handle -> green up-arrow -> pink right-arrow).
 *  - 1330-1920ms: timeline slides up from the bottom (BELOW the pill in z-order).
 *  - 2750-4080ms: cursor lands ON the pink arrow (arrow bolds), DRAGS the knob
 *    LEFT->RIGHT to the pill's right end (staying inside), leaving a white diamond +
 *    blue dotted trail; blue bar + right kf diamond pop at ms3000; easing icon (still
 *    UNFILLED) pops at ms3833; whole frame starts a slow zoom-in toward the timeline.
 * World: pill (264,163) 1391x444 r222 · knob r177 rest centre (484,387) · timeline top 716.
 */
const COIN = "#37108A";   // dark navy donut
const BLUE = "#0D99FF";   // figma selection blue
const GREEN = "#1FAE54";  // transform up-axis
const PINK = "#FF3DA0";   // transform right-axis
// knob geometry: donut outer r≈152, hole r≈82, blue ring r≈131 riding ON the donut;
// rest centre (484,387), drag end centre 1422.
const KR = 152, KX = 484, KY = 387, KX1 = 1422, RING_R = 131;
const TL_H = 364;
const RULER_X = (k: number) => 26 + 241.6 * k; // ruler label anchors 0..1.2
const PH_X = 871.5;                             // playhead (static)

export const Scene06_Purple: React.FC = () => {
  const zoomWrap = useRef<HTMLDivElement>(null);
  const cam = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLDivElement>(null);
  const bbox = useRef<HTMLDivElement>(null);
  const gzRing = useRef<HTMLDivElement>(null);
  const gzTopH = useRef<HTMLDivElement>(null);
  const gzGreen = useRef<HTMLDivElement>(null);
  const gzRight = useRef<HTMLDivElement>(null);
  const gzPinkThin = useRef<HTMLDivElement>(null);
  const gzPinkBold = useRef<HTMLDivElement>(null);
  const hand = useRef<HTMLDivElement>(null);
  const arrow = useRef<HTMLDivElement>(null);
  const trailDia = useRef<HTMLDivElement>(null);
  const dots = useRef<HTMLDivElement>(null);
  const tl = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const kfRight = useRef<HTMLDivElement>(null);
  const kfLine = useRef<HTMLDivElement>(null);
  const easeIcon = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
    const ms = ownCurrentTimeMs;

    // ---- CAMERA: parked 2.2x on the knob rest spot during the empty-pill hold; snaps out to
    // MEDIUM ~1.22x by ms1200 and HOLDS ~1.2x through the gizmo-build beat (the gizmo ring
    // reads right at 1.2x; 1.35x was noticeably too big), then fully wide by ~ms2450. ----
    const camScale = keys(ms, [[950, 2.2], [1083, 1.65], [1200, 1.22], [1750, 1.2], [2450, 1.0]], inOutCubic);
    if (cam.current) {
      cam.current.style.transformOrigin = `${KX}px ${KY}px`;
      cam.current.style.transform = `scale(${camScale})`;
    }

    // ---- KNOB ENTRY: the hand path enters from BELOW-RIGHT of the rest spot,
    // arcs up-left into place, hand riding it ----
    const ke = track(ms, 500, 583, outCubic);
    const ky = keys(ms, [[500, 810], [667, 626], [833, 481], [1000, 422], [1167, 400], [1400, KY]]);
    // drag: knob centre keys — creeps at ms3000, fast middle, seated by ms3583
    const kex = keys(ms, [[500, 575], [667, 592], [833, 529], [1000, 503], [1167, 490], [1400, KX]]);
    const kdrag = keys(ms, [[2950, 0], [3000, 8], [3167, 259], [3333, 710], [3500, 934], [3583, KX1 - KX]]);
    const kx = kex + kdrag;
    if (knob.current) {
      knob.current.style.opacity = String(ke);
      knob.current.style.left = `${kx}px`;
      knob.current.style.top = `${ky}px`;
    }
    // selection box: tilted CLOCKWISE on entry, rotates CCW to axis-aligned by ms1000,
    // disappears at ms1100
    if (bbox.current) {
      bbox.current.style.transform = `rotate(${keys(ms, [[500, -14], [833, -8], [1000, -4], [1100, 0]])}deg)`;
      bbox.current.style.opacity = String(ke * (1 - track(ms, 1100, 1180, outCubic)));
    }
    // gizmo build order: blue ring first (ms1100), then top handle + right handle + green
    // arrow together (ms1450), then the pink arrow (ms1630)
    if (gzRing.current) gzRing.current.style.opacity = String(track(ms, 1100, 1200, outCubic));
    const stage2 = track(ms, 1450, 1560, outCubic);
    if (gzTopH.current) gzTopH.current.style.opacity = String(stage2);
    if (gzGreen.current) gzGreen.current.style.opacity = String(stage2);
    if (gzRight.current) gzRight.current.style.opacity = String(stage2);
    // pink arrow: thin on arrival, bolds at the GRAB (ms2750) just before movement
    const bold = track(ms, 2750, 2830, outCubic);
    if (gzPinkThin.current) gzPinkThin.current.style.opacity = String(track(ms, 1630, 1720, outCubic) * (1 - bold));
    if (gzPinkBold.current) gzPinkBold.current.style.opacity = String(bold);

    // ---- cursors: hand rides the knob centre; swaps to the arrow around ms1170-1280 ----
    if (hand.current) {
      hand.current.style.left = `${kx - 75}px`;
      hand.current.style.top = `${ky - 82}px`;
      hand.current.style.opacity = String(ke * (1 - track(ms, 1167, 1280, outCubic)));
    }
    // black arrow: hover -> onto the pink arrow; during the drag the tip stays locked slightly
    // BELOW-RIGHT of the pink arrow's point -> exits right after release
    if (arrow.current) {
      const preX = keys(ms, [[1280, 575], [1750, 660], [2170, 719], [2500, 809], [2830, 698], [3083, 677]]);
      const preY = keys(ms, [[1280, 700], [1750, 640], [2170, 540], [2500, 501], [2830, 407], [3083, 398]]);
      const dragBlend = track(ms, 2950, 3030, linear);
      const post = track(ms, 3833, 4000, linear);
      const tx = lerp(lerp(preX, kx + 300, dragBlend), 1960, post);
      const ty = lerp(lerp(preY, KY + 22, dragBlend), 350, post);
      arrow.current.style.left = `${tx - 4}px`;
      arrow.current.style.top = `${ty - 4}px`;
      arrow.current.style.opacity = String(track(ms, 1280, 1370, outCubic));
    }

    // ---- trail: white diamond pops at the origin on the GRAB (ms2830), dots reveal as the knob passes ----
    if (trailDia.current) trailDia.current.style.opacity = String(track(ms, 2830, 2910, outCubic));
    if (dots.current) {
      const children = dots.current.children;
      for (let i = 0; i < children.length; i++) {
        const x = 552 + i * 95;
        (children[i] as HTMLElement).style.opacity = kx > x + 40 ? "1" : "0";
      }
    }

    // ---- timeline slides up BELOW the pill — decelerating top keys ----
    const tlTop = keys(ms, [[1250, 1080], [1417, 847], [1500, 768], [1667, 738], [1833, 726], [2000, 721], [2170, 716]]);
    if (tl.current) tl.current.style.top = `${tlTop}px`;
    // blue bar + right kf diamond POP fully-formed at ms3000; kf line one frame later
    if (bar.current) bar.current.style.opacity = ms >= 3000 ? "1" : "0";
    if (kfRight.current) kfRight.current.style.opacity = ms >= 3000 ? "1" : "0";
    if (kfLine.current) kfLine.current.style.opacity = ms >= 3083 ? "1" : "0";
    // easing icon pops UNFILLED at ms3833 (fills only when CLICKED, in S07)
    if (easeIcon.current) easeIcon.current.style.opacity = String(track(ms, 3833, 3916, outCubic));

    // ---- late whole-frame zoom toward the timeline (canvas+timeline inside; cursors outside) ----
    const z = keys(ms, [[3500, 1.0], [3583, 1.002], [3667, 1.005], [3750, 1.02], [3833, 1.056], [3917, 1.13], [4000, 1.219]]);
    if (zoomWrap.current) {
      zoomWrap.current.style.transformOrigin = "40px 1382px";
      zoomWrap.current.style.transform = `scale(${z})`;
    }
  }, []);

  const frameRef = useFrameTask(handleFrame);
  return (
    <Timegroup mode="fixed" duration={`${PURPLE_MS}ms`} ref={frameRef} className="absolute inset-0" style={{ background: PAL.purple, overflow: "hidden" }}>
      <div ref={zoomWrap} style={{ position: "absolute", inset: 0 }}>
        {/* ===== CAMERA (canvas: pill / trail / knob / hand) ===== */}
        <div ref={cam} style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", left: 264, top: 163, width: 1391, height: 444, borderRadius: 222, background: PAL.lavender }} />
          {/* motion trail: white diamond at the drag origin + fixed dots revealed as the knob passes */}
          <div ref={trailDia} style={{ position: "absolute", left: 442 - 22, top: KY - 22, width: 44, height: 44, background: "#fff", border: `5px solid ${BLUE}`, transform: "rotate(45deg)", opacity: 0 }} />
          <div ref={dots}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} style={{ position: "absolute", left: 552 + i * 95 - 13, top: KY - 13, width: 26, height: 26, borderRadius: "50%", background: BLUE, opacity: 0 }} />
            ))}
          </div>
          {/* ===== knob (dark donut) + selection box + staged gizmo ===== */}
          <div ref={knob} style={{ position: "absolute", left: KX, top: 620, width: KR * 2, height: KR * 2, marginLeft: -KR, marginTop: -KR, opacity: 0 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: COIN }} />
            <div style={{ position: "absolute", inset: 70, borderRadius: "50%", background: PAL.lavender }} />
            {/* centre origin: white dot w/ blue outline + dark needle running hole -> rim */}
            <div style={{ position: "absolute", left: "50%", top: "50%", width: 148, height: 12, transform: "translate(-3%,-50%)", background: COIN, borderRadius: 6 }} />
            <div style={{ position: "absolute", left: "50%", top: "50%", width: 10, height: 38, transform: "translate(-50%,-6%)", background: COIN, borderRadius: 5 }} />
            <div style={{ position: "absolute", left: "50%", top: "50%", width: 34, height: 34, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "#fff", border: `6px solid ${BLUE}` }} />
            {/* TILTED selection box + white corner handles (pick-up pose) */}
            <div ref={bbox} style={{ position: "absolute", inset: -40, opacity: 0 }}>
              <div style={{ position: "absolute", inset: 0, border: `5px solid ${BLUE}` }} />
              {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([x, y], i) => (
                <div key={i} style={{ position: "absolute", left: `${x * 100}%`, top: `${y * 100}%`, width: 46, height: 46, marginLeft: -23, marginTop: -23, background: "#fff", border: `6px solid ${BLUE}` }} />
              ))}
            </div>
            {/* gizmo stage 1: thin blue ring INSIDE the donut */}
            <div ref={gzRing} style={{ position: "absolute", inset: KR - RING_R, borderRadius: "50%", border: `6px solid ${BLUE}`, opacity: 0 }} />
            {/* stage 2: top square handle on the ring */}
            <div ref={gzTopH} style={{ position: "absolute", left: KR - 20, top: KR - RING_R - 20, width: 40, height: 40, background: "#fff", border: `6px solid ${BLUE}`, borderRadius: 7, opacity: 0 }} />
            {/* stage 3: green UP arrow floating ABOVE the knob — white-cased shaft, OUTLINED head */}
            <div ref={gzGreen} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", opacity: 0 }}>
              <svg width={KR * 2} height={KR * 2} viewBox={`0 0 ${KR * 2} ${KR * 2}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                <line x1={KR} y1="12" x2={KR} y2="-62" stroke="#fff" strokeWidth="26" strokeLinecap="round" />
                <line x1={KR} y1="12" x2={KR} y2="-62" stroke={GREEN} strokeWidth="12" strokeLinecap="round" />
                <path d={`M${KR} -108 L${KR + 36} -56 L${KR - 36} -56 Z`} fill="none" stroke="#fff" strokeWidth="22" strokeLinejoin="round" />
                <path d={`M${KR} -108 L${KR + 36} -56 L${KR - 36} -56 Z`} fill="none" stroke={GREEN} strokeWidth="10" strokeLinejoin="round" />
              </svg>
            </div>
            {/* stage 4: right square handle + pink RIGHT arrow (solid head, white casing) — thin, then BOLD at drag */}
            <div ref={gzRight} style={{ position: "absolute", left: KR + RING_R - 20, top: KR - 20, width: 40, height: 40, background: "#fff", border: `6px solid ${BLUE}`, borderRadius: 7, opacity: 0 }} />
            <div ref={gzPinkThin} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", opacity: 0 }}>
              <svg width={KR * 2} height={KR * 2} viewBox={`0 0 ${KR * 2} ${KR * 2}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                <line x1={KR + RING_R + 22} y1={KR} x2={KR + RING_R + 78} y2={KR} stroke="#fff" strokeWidth="20" strokeLinecap="round" />
                <line x1={KR + RING_R + 22} y1={KR} x2={KR + RING_R + 78} y2={KR} stroke={PINK} strokeWidth="9" strokeLinecap="round" />
                <path d={`M${KR + RING_R + 116} ${KR} L${KR + RING_R + 74} ${KR - 28} L${KR + RING_R + 74} ${KR + 28} Z`} fill={PINK} stroke="#fff" strokeWidth="9" strokeLinejoin="round" />
              </svg>
            </div>
            <div ref={gzPinkBold} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", opacity: 0 }}>
              <svg width={KR * 2} height={KR * 2} viewBox={`0 0 ${KR * 2} ${KR * 2}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                <line x1={KR + RING_R + 22} y1={KR} x2={KR + RING_R + 92} y2={KR} stroke="#fff" strokeWidth="28" strokeLinecap="round" />
                <line x1={KR + RING_R + 22} y1={KR} x2={KR + RING_R + 92} y2={KR} stroke={PINK} strokeWidth="15" strokeLinecap="round" />
                <path d={`M${KR + RING_R + 140} ${KR} L${KR + RING_R + 86} ${KR - 34} L${KR + RING_R + 86} ${KR + 34} Z`} fill={PINK} stroke="#fff" strokeWidth="11" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          {/* white grab hand riding the knob centre */}
          <div ref={hand} style={{ position: "absolute", left: KX - 75, top: 620 - 82, opacity: 0 }}><GrabCursor x={0} y={0} size={150} /></div>
        </div>

        {/* ===== bottom timeline (screen-fixed; slides up BELOW the pill) ===== */}
        <div ref={tl} style={{ position: "absolute", left: 0, right: 0, top: 1080, height: TL_H, background: "#fff", fontFamily: 'Arial, Helvetica, "Segoe UI", sans-serif' }}>
          {/* ruler labels 0..1.2 anchored at x = 26 + 241.6k */}
          {["0", "0.2", "0.4", "0.6", "0.8", "1", "1.2"].map((t, i) => (
            <div key={i} style={{ position: "absolute", top: 22, left: RULER_X(i), transform: "translateX(-50%)", color: "#9AA0A6", fontSize: 34, fontWeight: 500 }}>{t}</div>
          ))}
          <div style={{ position: "absolute", top: 86, left: 0, right: 0, height: 2, background: "#E6E8EB" }} />
          {/* playhead: blue flag + line (static at ~0.7; flag y≈745, line runs OVER the rows) */}
          <div style={{ position: "absolute", top: 30, left: PH_X - 17, width: 34, zIndex: 3 }}>
            <svg width="34" height="32" viewBox="0 0 36 34" style={{ display: "block" }}>
              <path d="M2 2 a2 2 0 0 1 2 -2 H32 a2 2 0 0 1 2 2 V18 a3 3 0 0 1 -1 2 L20 32 a3 3 0 0 1 -4 0 L3 20 a3 3 0 0 1 -1 -2 Z" fill={BLUE} />
            </svg>
          </div>
          <div style={{ position: "absolute", top: 60, left: PH_X - 1.5, width: 3, height: TL_H - 60, background: BLUE, zIndex: 3 }} />
          {/* blue duration bar — POPS fully-formed at ms3000 (26 -> 872) */}
          <div ref={bar} style={{ position: "absolute", top: 189, left: 26, width: 846, height: 61, background: BLUE, borderRadius: 14, opacity: 0 }}>
            <div style={{ position: "absolute", left: 14, top: 17, width: 7, height: 27, background: "#fff", borderRadius: 3 }} />
            <div style={{ position: "absolute", right: 14, top: 17, width: 7, height: 27, background: "#fff", borderRadius: 3 }} />
          </div>
          {/* keyframe row: pale band + left diamond (always) + right diamond/line (pop at ms3000, line a frame later) */}
          <div style={{ position: "absolute", top: 270, left: 0, width: 890, height: 82, background: "#E6F5FC" }} />
          <div ref={kfLine} style={{ position: "absolute", top: 310, left: 53, width: 792, height: 2, background: BLUE, opacity: 0 }} />
          <div style={{ position: "absolute", top: 296, left: 26 - 15, width: 30, height: 30, background: "#fff", border: `4px solid ${BLUE}`, transform: "rotate(45deg)" }} />
          <div ref={kfRight} style={{ position: "absolute", top: 296, left: 871 - 15, width: 30, height: 30, background: "#fff", border: `4px solid ${BLUE}`, transform: "rotate(45deg)", opacity: 0 }} />
          {/* easing icon — UNFILLED (white bg, blue border, blue diagonal); fills on CLICK in S07 */}
          <div ref={easeIcon} style={{ position: "absolute", top: 292, left: 472 - 19, width: 38, height: 38, background: "#fff", border: `4px solid ${BLUE}`, borderRadius: 8, overflow: "hidden", opacity: 0 }}>
            <div style={{ position: "absolute", left: -5, top: 14, width: 48, height: 5, background: BLUE, transform: "rotate(-45deg)" }} />
          </div>
          {/* right zoom slider (blue fill at x≈1664-1712, y≈790 → local 74) */}
          <div style={{ position: "absolute", top: 68, right: 130, width: 150, height: 12, borderRadius: 6, background: "#D7DBE0" }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 78, height: 12, borderRadius: 6, background: BLUE }} />
            <div style={{ position: "absolute", left: 70, top: -10, width: 32, height: 32, borderRadius: "50%", background: "#fff", border: `4px solid ${BLUE}` }} />
          </div>
        </div>
      </div>

      {/* black arrow cursor — OUTSIDE the zoom wrap (tip keys are screen-space) */}
      <div ref={arrow} style={{ position: "absolute", left: 575, top: 700, opacity: 0 }}><ArrowCursor x={0} y={0} size={130} /></div>
    </Timegroup>
  );
};

export default Scene06_Purple;
