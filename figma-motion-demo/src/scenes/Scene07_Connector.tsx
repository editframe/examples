import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { CONNECTOR_MS } from "../constants";
import { track, lerp, keys, outCubic, outBack, PAL } from "../helpers";
import { useFrameTask } from "../useFrameTask";
import { ArrowCursor } from "../components/Cursors";

/**
 * S07 — Purple: zoomed timeline → easing-icon click → easing panel  ·  5.083s
 *  Beat A (0–1583ms): zoomed WHITE timeline (settling by ms250). Ruler 0–0.8; playhead FLAG at ~0.66;
 *    blue bar 0→0.66; keyframe track = hollow diamonds at 0 and 0.66 with a BLUE-filled square easing
 *    icon (white diagonal) EXACTLY halfway. Cursor glides in from upper-right down-left onto the icon
 *    (by ms1080) and CLICKS it (ms1080–1417). No scrub drag — nothing else moves.
 *  ms1583: HARD CUT — timeline dismissed instantly, wide pill view + easing panel appear.
 *  Beat B (1750–4583ms): cursor sweeps up-right onto the panel, grabs the TOP-RIGHT bezier handle
 *    and drags LEFT: 0,0,1,1 → 0,0,0.8,1 → 0,0,0.6,1 → 0,0,0.3,1;
 *    then it grabs the BOTTOM-LEFT handle and drags RIGHT: → 0.67,0,0.3,1 (S-curve).
 */
const BLUE = "#0D99FF";
const Y = 540, X0 = -80;
// easing graph geometry (local to the popup svg viewBox)
const GX = 44, GY = 392, GW = 432, GH = 300; // origin x, baseline y, width, height
const CUT = 1583; // hard cut — timeline dismissed (panel pops ~ms1917)
// Beat A timeline geometry: ruler 0 at x30, 445px per 0.2s; playhead flag at ~0.755
// (x1710); blue bar 40->1580; diamonds at 0 and under the flag; easing icon midway (x≈890).
const PH_X = 1697, ICON_X = 875;
const CLICK_MS = 1333; // the fill swaps at this moment; the cursor tip has already settled on the icon

function bezPath(x1: number, y1: number, x2: number, y2: number) {
  const p1x = GX + x1 * GW, p1y = GY - y1 * GH;
  const p2x = GX + x2 * GW, p2y = GY - y2 * GH;
  return { d: `M${GX} ${GY} C ${p1x} ${p1y} ${p2x} ${p2y} ${GX + GW} ${GY - GH}`, h1: [p1x, p1y], h2: [p2x, p2y] };
}

export const Scene07_Connector: React.FC = () => {
  const line = useRef<HTMLDivElement>(null);
  const arrow = useRef<HTMLDivElement>(null);
  const curve = useRef<SVGPathElement>(null);
  const handle = useRef<SVGCircleElement>(null);          // upper bezier control dot (solid black) — dragged
  const handleArm = useRef<SVGLineElement>(null);          // black tangent arm from dot → curve end
  const grayArm = useRef<SVGLineElement>(null);           // gray tangent arm from dot → left edge
  const label = useRef<HTMLSpanElement>(null);
  const cursor = useRef<HTMLDivElement>(null);             // Beat B cursor (drags the bezier handles)
  const scrub = useRef<HTMLDivElement>(null);
  const scrubCursor = useRef<HTMLDivElement>(null);        // Beat A cursor (clicks the easing icon)
  const popup = useRef<HTMLDivElement>(null);
  const iconFill = useRef<HTMLDivElement>(null);           // Beat A easing icon FILLED state (on click)
  const handle1 = useRef<SVGCircleElement>(null);          // bottom-left bezier control dot
  const handle1Arm = useRef<SVGLineElement>(null);         // blue arm: curve start -> bottom dot

  const handleFrame = useCallback(({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
    const ms = ownCurrentTimeMs;
    // connector draws in quickly behind everything, then holds (diamond settles at centre ~x689)
    const X1 = 615;
    const p = track(ms, 150, 700, outCubic);
    const x = lerp(X0, X1, p);
    if (line.current) line.current.style.width = `${x - X0}px`;
    if (arrow.current) { arrow.current.style.left = `${x + 24}px`; arrow.current.style.opacity = String(1 - track(ms, 650, 850, outCubic)); }

    // ── Beat A: zoomed WHITE timeline — settles by ms250, HARD-dismissed at the CUT ──
    const sIn = track(ms, 0, 250, outCubic);             // finishing the S06->S07 pan/zoom (settled ms250)
    const scrubO = ms >= CUT ? 0 : 1;                    // timeline already fills the frame at scene start — no fade-in
    if (scrub.current) { scrub.current.style.opacity = String(scrubO); scrub.current.style.transform = `scale(${lerp(1.05, 1, sIn)})`; }
    // cursor: sweeps high across the ruler, dives down-left, approaches the icon
    // ALONG the keyframe line from the LEFT, tip LANDS ON the icon at ~ms1000, clicks, exits right
    if (scrubCursor.current) {
      const tx = keys(ms, [[167, 1010], [417, 560], [583, 430], [750, 600], [917, 800], [1000, 870], [1417, 870], [1583, 990]]);
      const ty = keys(ms, [[167, 290], [417, 300], [583, 520], [750, 720], [917, 778], [1000, 783], [1417, 783], [1583, 795]]);
      scrubCursor.current.style.opacity = String(scrubO);
      scrubCursor.current.style.left = `${tx - 4}px`;
      scrubCursor.current.style.top = `${ty - 4}px`;
    }
    // the easing icon starts UNFILLED and FILLS solid blue the moment it is clicked
    if (iconFill.current) iconFill.current.style.opacity = ms >= CLICK_MS ? "1" : "0";

    // ── HARD CUT (timeline out) — the panel opened AT the click but sits
    // off-crop in Beat A's zoom, so it is already there the moment the wide view cuts in ──
    const pop = track(ms, 1583, 1660, outCubic);
    if (popup.current) { popup.current.style.opacity = pop > 0.5 ? "1" : "0"; popup.current.style.transform = "none"; }
    // bezier value anchors:
    //   top handle x2: still 1 at ms2917 (cursor just arrived) -> drags down to 0.3 by ms3417;
    //   bottom handle x1: 0 until ~ms3958, -> 0.67 by ms4417 (label reads 0.67).
    const x1 = keys(ms, [[3958, 0], [4417, 0.67]]);
    const x2 = keys(ms, [[2917, 1], [3417, 0.3]]);
    const b = bezPath(x1, 0, x2, 1);
    if (curve.current) curve.current.setAttribute("d", b.d);
    // top-right control dot + its tangent arm to the curve end. While GRABBED (ms2830-3500)
    // the dot renders as a BLUE HOLLOW ring and the arm turns blue.
    const topGrab = ms >= 2830 && ms <= 3500;
    if (handle.current) {
      handle.current.setAttribute("cx", String(b.h2[0])); handle.current.setAttribute("cy", String(b.h2[1]));
      handle.current.setAttribute("fill", topGrab ? "#F5F5F5" : "#1E1E1E");
      handle.current.setAttribute("stroke", topGrab ? BLUE : "none");
      handle.current.setAttribute("stroke-width", topGrab ? "6" : "0");
    }
    if (handleArm.current) {
      handleArm.current.setAttribute("x1", String(b.h2[0])); handleArm.current.setAttribute("y1", String(b.h2[1]));
      handleArm.current.setAttribute("x2", String(GX + GW)); handleArm.current.setAttribute("y2", String(GY - GH));
      handleArm.current.setAttribute("stroke", topGrab ? BLUE : "#1E1E1E");
    }
    // gray tangent arm from the top dot to the graph's left edge
    if (grayArm.current) {
      grayArm.current.setAttribute("x1", String(b.h2[0])); grayArm.current.setAttribute("y1", String(b.h2[1]));
    }
    // bottom-left control dot + blue arm from the curve start (emerges as x1 rises)
    const botGrab = ms >= 3900 && ms <= 4500;
    if (handle1.current) {
      handle1.current.setAttribute("cx", String(b.h1[0])); handle1.current.setAttribute("cy", String(b.h1[1]));
      handle1.current.setAttribute("fill", botGrab ? "#F5F5F5" : "#1E1E1E");
      handle1.current.setAttribute("stroke", botGrab ? BLUE : "none");
      handle1.current.setAttribute("stroke-width", botGrab ? "6" : "0");
    }
    if (handle1Arm.current) {
      handle1Arm.current.setAttribute("x2", String(b.h1[0])); handle1Arm.current.setAttribute("y2", String(b.h1[1]));
    }
    // cursor: sweeps from lower-left up onto the panel (ms1800-2750: graph lower-left ->
    // ON the top handle), rides the TOP handle during the drag, then hops to the BOTTOM
    // handle (~ms3750) and rides it right
    if (cursor.current) {
      cursor.current.style.opacity = pop > 0.5 ? "1" : "0";
      // dot centre (1460,468); the true svg origin derived from it is (1187,356);
      // cursor tip sits ~3px inside its wrapper → tip lands ON the dot
      const SVG_LEFT = 1187, SVG_TOP = 356, SCALE = 1.219;
      // ArrowCursor tip offset (viewBox "3.4 1.4 18 21.2", path tip M4 2) at size 190:
      // ((4-3.4)/18)*190 = 6.33 right, ((2-1.4)/21.2)*190 = 5.38 down. Subtract so the TIP lands
      // exactly ON the control dot.
      const TIPX = 6.33, TIPY = 5.38;
      const topX = SVG_LEFT + b.h2[0] * SCALE - TIPX, topY = SVG_TOP + b.h2[1] * SCALE - TIPY;
      const botX = SVG_LEFT + b.h1[0] * SCALE - TIPX, botY = SVG_TOP + b.h1[1] * SCALE - TIPY;
      const sweep = track(ms, 1800, 2750, outCubic);     // lower-left of graph -> top handle
      const hop = track(ms, 3750, 3958, outCubic);       // top handle -> bottom handle
      const cx = lerp(lerp(1290, topX, sweep), botX, hop);
      const cy = lerp(lerp(700, topY, sweep), botY, hop);
      cursor.current.style.left = `${cx}px`;
      cursor.current.style.top = `${cy}px`;
    }
    const fmt = (v: number) => String(parseFloat(v.toFixed(2)));
    if (label.current) label.current.textContent = `${fmt(x1)}, 0, ${fmt(x2)}, 1`;
  }, []);

  const frameRef = useFrameTask(handleFrame);
  return (
    <Timegroup mode="fixed" duration={`${CONNECTOR_MS}ms`} ref={frameRef} className="absolute inset-0" style={{ background: PAL.purple }}>
      {/* pill — extends right so its rounded cap nearly reaches the panel (right cap x=1055,
          vertical y193-885 → h692, centre y540; tiny purple gap to the panel) */}
      <div style={{ position: "absolute", left: -1290, top: 194, width: 2345, height: 692, borderRadius: 346, background: PAL.lavender }} />
      {/* connector line + dots + diamond keyframe (4 dots Ø60 at x≈67/219/371/523,
          diamond centre x≈689 / right-tip x≈778) — spread wide & centred, not crammed on the left */}
      <div ref={line} style={{ position: "absolute", left: X0, top: Y - 4, height: 10, background: BLUE, width: 0 }}>
        {[0.211, 0.430, 0.649, 0.868].map((f) => <div key={f} style={{ position: "absolute", left: `${f * 100}%`, top: -26, width: 60, height: 60, borderRadius: "50%", marginLeft: -30, background: BLUE }} />)}
        <div style={{ position: "absolute", left: "100%", top: -56, marginLeft: 14, width: 120, height: 120, background: "#fff", border: `14px solid ${BLUE}`, transform: "rotate(45deg)", borderRadius: 10, boxSizing: "border-box" }} />
      </div>
      <div ref={arrow}><ArrowCursor x={0} y={18} size={70} /></div>

      {/* Beat A: zoomed WHITE timeline — ruler 0-0.8, playhead FLAG at 0.66, bar 0->0.66,
          hollow diamonds at 0 and 0.66, BLUE easing icon (white diagonal) exactly halfway. Static. */}
      <div ref={scrub} style={{ position: "absolute", inset: 0, background: "#FFFFFF", fontFamily: 'Arial, Helvetica, "Segoe UI", sans-serif', color: "#1E1E1E", zIndex: 50, transformOrigin: "60% 55%" }}>
        {/* light-blue selected-row highlight band behind the keyframe track (y ≈ 730-830) */}
        <div style={{ position: "absolute", top: 730, left: 0, right: 0, height: 100, background: "#EAF5FF" }} />
        {/* ruler — large numbers 0 … 0.8 (0 at x30, 417px per 0.2 → playhead sits AT 0.8) */}
        <div style={{ position: "absolute", top: 350, left: 30, width: 2502, display: "flex", color: "#7A7A7A", fontSize: 60, fontWeight: 400 }}>
          {["0", "0.2", "0.4", "0.6", "0.8", "1.0"].map((t) => <span key={t} style={{ width: 417, textAlign: "left" }}>{t}</span>)}
        </div>
        {/* blue clip bar with end ticks (x 40 -> 1700, y 576-697) */}
        <div style={{ position: "absolute", top: 576, left: 40, width: 1660, height: 120, background: BLUE, borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 32px", color: "#fff", fontSize: 52, boxSizing: "border-box" }}><span>|</span><span>|</span></div>
        {/* thin keyframe track line + hollow diamonds at 0 (x52) and under the flag (x1697), y 783 */}
        <div style={{ position: "absolute", top: 780, left: 80, width: PH_X - 105, height: 5, background: BLUE }} />
        <div style={{ position: "absolute", top: 760, left: 29, width: 46, height: 46, background: "#fff", border: `6px solid ${BLUE}`, transform: "rotate(45deg)", boxSizing: "border-box" }} />
        <div style={{ position: "absolute", top: 760, left: PH_X - 23, width: 46, height: 46, background: "#fff", border: `6px solid ${BLUE}`, transform: "rotate(45deg)", boxSizing: "border-box" }} />
        {/* easing icon: starts UNFILLED (white, blue border + blue diagonal); the FILLED
            layer (solid blue, white diagonal) swaps in the frame the cursor clicks it */}
        <div style={{ position: "absolute", top: 748, left: ICON_X - 35, width: 70, height: 70, background: "#fff", border: `6px solid ${BLUE}`, borderRadius: 12, overflow: "hidden", boxSizing: "border-box" }}>
          <div style={{ position: "absolute", left: -15, top: 25, width: 88, height: 7, background: BLUE, transform: "rotate(-45deg)" }} />
        </div>
        <div ref={iconFill} style={{ position: "absolute", top: 748, left: ICON_X - 35, width: 70, height: 70, background: BLUE, borderRadius: 12, overflow: "hidden", opacity: 0 }}>
          <div style={{ position: "absolute", left: -9, top: 31, width: 88, height: 7, background: "#fff", transform: "rotate(-45deg)" }} />
        </div>
        {/* blue playhead with FLAG head (flag x 1645-1749, y ≈ 180-280) */}
        <div style={{ position: "absolute", top: 180, left: PH_X - 52, width: 104 }}>
          <svg width="104" height="98" viewBox="0 0 36 34" style={{ display: "block" }}>
            <path d="M2 2 a2 2 0 0 1 2 -2 H32 a2 2 0 0 1 2 2 V18 a3 3 0 0 1 -1 2 L20 32 a3 3 0 0 1 -4 0 L3 20 a3 3 0 0 1 -1 -2 Z" fill={BLUE} />
          </svg>
        </div>
        <div style={{ position: "absolute", top: 276, height: 640, left: PH_X - 3, width: 6, background: BLUE }} />
      </div>
      {/* Beat A cursor — glides onto the easing icon and clicks it */}
      <div ref={scrubCursor} style={{ position: "absolute", left: 160, top: 300, zIndex: 51 }}><ArrowCursor x={0} y={0} size={104} /></div>

      {/* Beat B: easing popup (pops ~ms1917; rect ≈ x1150-1860, y105+) */}
      <div ref={popup} style={{ position: "absolute", left: 1150, top: 105, width: 710, borderRadius: 26, background: "#fff", boxShadow: "0 26px 80px rgba(0,0,0,0.32)", fontFamily: 'Arial, Helvetica, "Segoe UI", sans-serif', padding: "30px 32px 34px", color: "#1E1E1E", opacity: 0, transformOrigin: "50% 38%", boxSizing: "border-box" }}>
        {/* header: "Linear ▾" */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1.5px solid #E5E5E5", borderRadius: 14, padding: "18px 22px", fontSize: 34 }}><span>Linear</span><span style={{ color: "#888", fontSize: 26 }}>⌄</span></div>
        {/* Curve / Spring segmented tabs */}
        <div style={{ display: "flex", marginTop: 22, background: "#F2F2F2", borderRadius: 12, padding: 6, fontSize: 30 }}>
          <span style={{ flex: 1, textAlign: "center", fontWeight: 500, padding: "12px 0", background: "#fff", border: "1px solid #E2E2E2", borderRadius: 9, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>Curve</span>
          <span style={{ flex: 1, textAlign: "center", color: "#9A9A9A", padding: "12px 0" }}>Spring</span>
        </div>
        {/* graph box */}
        <div style={{ marginTop: 22, background: "#F5F5F5", borderRadius: 14, padding: 6, boxSizing: "border-box" }}>
          <svg viewBox="0 0 520 440" width="100%" style={{ display: "block" }}>
            {/* baseline + left axis (faint) */}
            <line x1={GX} y1={GY} x2={GX + GW} y2={GY} stroke="#E2E2E2" strokeWidth="2" />
            <line x1={GX} y1={GY} x2={GX} y2={GY - GH} stroke="#E2E2E2" strokeWidth="2" />
            {/* gray tangent arm: from the dragged dot → left edge of the graph (top line) */}
            <line ref={grayArm} x1={GX + GW} y1={GY - GH} x2={GX - 4} y2={GY - GH} stroke="#BDBDBD" strokeWidth="5" />
            {/* black tangent arm from the dragged dot → curve end keyframe */}
            <line ref={handleArm} x1={GX + GW} y1={GY - GH} x2={GX + GW} y2={GY - GH} stroke="#1E1E1E" strokeWidth="5" />
            {/* blue arm: curve start -> bottom control dot (emerges as x1 rises) */}
            <line ref={handle1Arm} x1={GX} y1={GY} x2={GX} y2={GY} stroke={BLUE} strokeWidth="5" />
            {/* the bezier curve */}
            <path ref={curve} d={bezPath(0, 0, 1, 1).d} stroke="#1E1E1E" strokeWidth="6" fill="none" strokeLinecap="round" />
            {/* end keyframe dots (solid black) */}
            <circle cx={GX} cy={GY} r="9" fill="#1E1E1E" />
            {/* bottom-left control handle — dragged right in the final beat */}
            <circle ref={handle1} cx={GX} cy={GY} r="13" fill="#1E1E1E" />
            {/* upper control handle — SOLID BLACK dot (dragged) */}
            <circle ref={handle} cx={GX + GW} cy={GY - GH} r="15" fill="#1E1E1E" />
          </svg>
        </div>
        {/* bezier numeric label */}
        <div style={{ marginTop: 16, fontSize: 26, color: "#8A8A8A", display: "flex", alignItems: "center", gap: 10 }}>⌇ <span ref={label}>0, 0, 1, 1</span></div>
      </div>
      {/* large black cursor dragging the bezier handle (Beat B) — ~190px tall, tip ON the dot */}
      <div ref={cursor} style={{ position: "absolute", left: 1490, top: 340, opacity: 0, zIndex: 60 }}><ArrowCursor x={0} y={0} size={190} /></div>
    </Timegroup>
  );
};

export default Scene07_Connector;
