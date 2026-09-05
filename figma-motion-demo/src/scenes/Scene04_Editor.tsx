import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { EDITOR_MS } from "../constants";
import { keys, track, outCubic, outQuint, inOutCubic, lerp, clamp, flowerSpin, SPIN_OFF, limeMorphPath, limeNotch } from "../helpers";
import { useFrameTask } from "../useFrameTask";
import { ModernGarden } from "../components/ModernGarden";
import { BORDER_TOP, BORDER_BOTTOM, BORDER_LEFT, BORDER_RIGHT } from "../assets/border5";

/**
 * S04 — Figma editor reveal  ·  4.6–6.8s
 * The Modern Garden site sits inside the Figma Motion editor: left layers rail
 * (Figma logo + icon sidebar + Pages/Layers + Flower 1/2/3), right Motion
 * properties panel (Transform / Layout / Appearance / Fill), bottom Motion
 * timeline (ruler 0–8500, Flower 1/2 + Leaf 1A tracks, keyframe diamonds), a
 * floating toolbar, and a top-right avatar/play/Share. The PLAYHEAD advances
 * left→right while the 3 card flower graphics rotate + scale.
 */
const FONT = 'Arial, Helvetica, "Segoe UI", sans-serif';
const PANEL = "#FFFFFF";
const INK = "#1E1E1E";
const SUB = "#9A9A9A";
const BLUE = "#0D99FF";
const LINE = "#E6E6E6";
const RAIL_W = 340;   // left layers rail width
const PROP_W = 282;   // right properties panel width
const TL_H = 380;     // bottom timeline height

export const Scene04_Editor: React.FC = () => {
  const siteWrap = useRef<HTMLDivElement>(null);
  const chrome = useRef<HTMLDivElement>(null);
  const starRef = useRef<SVGGElement>(null);
  const raysRef = useRef<SVGGElement>(null);
  const flowerRef = useRef<HTMLDivElement>(null);
  const leavesRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const limePathRef = useRef<SVGPathElement>(null);
  const pinkRef = useRef<HTMLDivElement>(null);
  const playhead = useRef<HTMLDivElement>(null);
  const playLabel = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
    const ms = ownCurrentTimeMs;
    // site continues S03's zoom-out: from ~0.9 down into the centred editor artboard
    const s = keys(ms, [[0, 0.92], [620, 0.555]], outQuint);
    if (siteWrap.current) siteWrap.current.style.transform = `translate(-50%,-50%) scale(${s})`;
    // chrome fades in early
    const c = track(ms, 40, 380, outCubic);
    if (chrome.current) chrome.current.style.opacity = String(c);

    // playhead advances left→right (ms ≈ 900 → 2900 across the scene; ruler: 0ms@x150, 500ms@+79px)
    const phMs = lerp(900, 2900, clamp(ms / 2833, 0, 1));
    const phX = 150 + (phMs / 500) * 79; // px within timeline content area (after the 150px track-name gutter)
    if (playhead.current) playhead.current.style.transform = `translateX(${phX}px)`;
    if (playLabel.current) { const v = Math.round(phMs / 100) * 100; playLabel.current.textContent = (v < 1000 ? "0" : "") + v; }

    // each card runs its OWN in-card mini-animation (the Figma Motion preview is live):
    //   card1 pink star rotates CW while the white starburst rays counter-rotate CCW;
    //   card2 flower head rotates CW; card3 seed ring+center pulse (grey tiles stay fixed).
    const p = clamp(ms / 2833, 0, 1);
    // LEFT (Plant) card — the pink star + sunburst rays are LOCKED together (rotating the SAME
    // way, never counter-rotating) while the whole starburst PULSES (grows a touch then shrinks).
    // The starburst should read NEARLY STATIC — only a few degrees of rotation and a whisper of
    // a pulse, barely-there by design.
    const burstRot = lerp(0, -9, p);                 // one-way, star + rays together
    const burstPulse = 1 + 0.03 * Math.sin(Math.PI * p); // whisper of a grow-then-shrink
    if (starRef.current) starRef.current.setAttribute("transform", `translate(202,118) rotate(${burstRot}) scale(${burstPulse})`);
    if (raysRef.current) raysRef.current.setAttribute("transform", `rotate(${burstRot} 202 118) translate(202 118) scale(${burstPulse}) translate(-202 -118)`);
    // LIGHT GUIDE windmill: the flower HEAD (spokes+petals, rigid) keeps rotating at a STEADY rate
    // the WHOLE scene — never decelerates, never freezes; still turning at scene end (flowerSpin linear).
    if (flowerRef.current) flowerRef.current.style.transform = `rotate(${flowerSpin(SPIN_OFF.s04 + ms)}deg)`;

    // PLANT — the "stem going up" motion lasts the WHOLE scene and doesn't stop: the plant
    // TRANSLATES UP continuously across the entire editor scene — +45% (low) → 0 (settled) spread
    // over the full 2833ms, so it is still rising right up to the end.
    if (leavesRef.current) {
      const rise = keys(ms, [[0, 45], [2833, 0]]); // continuous rise across the whole scene (linear, never holds)
      leavesRef.current.style.transform = `translateY(${rise}%)`;
    }
    if (dotsRef.current) dotsRef.current.style.opacity = "1";

    // SEED: the LIME opens like a seed pod (disc → bowtie → tulip) while the PINK ball drops into it
    // and rises back. `top` IS the ball centre. Lime stays a disc until ~ms500, opens to a bowtie
    // by ~ms1100, holds, then closes into a tulip by scene end; pink rests centred (37.5%) until
    // ~ms500, DROPS to the lime's lower rim (62.8%) by ~ms1000, HOLDS, then RISES up into the
    // tulip as the scene ends.
    const mm = keys(ms, [[0, 0], [500, 0], [1167, 0.4], [2000, 0.5], [2500, 1.0], [2833, 1.0]], inOutCubic);
    if (limePathRef.current) { const [tn, bn] = limeNotch(mm); limePathRef.current.setAttribute("d", limeMorphPath(tn, bn)); }
    if (pinkRef.current) pinkRef.current.style.top = `${keys(ms, [[0, 37.5], [500, 37.5], [1000, 62.8], [2000, 62.8], [2250, 37.5], [2667, 25], [2833, 24]], inOutCubic)}%`;
  }, []);

  const frameRef = useFrameTask(handleFrame);
  return (
    <Timegroup mode="fixed" duration={`${EDITOR_MS}ms`} ref={frameRef} className="absolute inset-0" style={{ background: "#C4C4C4" }}>
      {/* grungy PURPLE-SPECKLE + lime-blob border (procedural alpha strips — reads as grain, not solid bands) */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 56, backgroundImage: `url(${BORDER_TOP})`, backgroundSize: "100% 100%", pointerEvents: "none", zIndex: 30 }} />
      <div style={{ position: "absolute", left: 0, bottom: 0, width: 1920, height: 52, backgroundImage: `url(${BORDER_BOTTOM})`, backgroundSize: "100% 100%", pointerEvents: "none", zIndex: 30 }} />
      <div style={{ position: "absolute", left: 0, top: 56, width: 40, height: 972, backgroundImage: `url(${BORDER_LEFT})`, backgroundSize: "100% 100%", pointerEvents: "none", zIndex: 30 }} />
      <div style={{ position: "absolute", right: 0, top: 56, width: 76, height: 972, backgroundImage: `url(${BORDER_RIGHT})`, backgroundSize: "100% 100%", pointerEvents: "none", zIndex: 30 }} />

      {/* the website artboard sitting in the canvas (browser frame) */}
      <div ref={siteWrap} style={{ position: "absolute", left: 990, top: 396, width: 1920, height: 1080, transform: "translate(-50%,-50%) scale(0.92)", transformOrigin: "center", borderRadius: 6, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.25)", willChange: "transform" }}>
        <ModernGarden cardRefs={{ plant: { starRef, raysRef, leavesRef, dotsRef }, light: { flowerRef }, seed: { limePathRef, pinkRef } }} />
      </div>

      {/* editor chrome (fades in) */}
      <div ref={chrome} style={{ position: "absolute", inset: 0, opacity: 0, fontFamily: FONT }}>
        {/* breadcrumb above the canvas */}
        <div style={{ position: "absolute", top: 26, left: RAIL_W + 24, color: "#7C7C7C", fontSize: 18 }}>Desktop / Guides</div>

        {/* ============ LEFT LAYERS RAIL ============ */}
        <div style={{ position: "absolute", top: 14, left: 0, bottom: 0, width: RAIL_W, background: PANEL, borderRight: `1px solid ${LINE}`, color: INK }}>
          {/* file header row: Figma logo + title + Figma sub + panel-collapse icon */}
          <div style={{ position: "absolute", top: 18, left: 56, fontSize: 20, fontWeight: 700, color: "#2C2C2C" }}>The Modern Garden</div>
          <div style={{ position: "absolute", top: 44, left: 56, fontSize: 16, color: SUB }}>Figma</div>
          {/* Figma 'F' logo glyph */}
          <div style={{ position: "absolute", top: 18, left: 18, width: 26, height: 38, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 1 }}>
              <div style={{ width: 12, height: 12, background: "#F24E1E", borderRadius: "6px 6px 0 0" }} />
              <div style={{ width: 12, height: 12, background: "#FF7262", borderRadius: "0 6px 6px 0" }} />
            </div>
            <div style={{ display: "flex", gap: 1 }}>
              <div style={{ width: 12, height: 12, background: "#A259FF", borderRadius: "6px 0 0 6px" }} />
              <div style={{ width: 12, height: 12, background: "#1ABCFE", borderRadius: "50%" }} />
            </div>
            <div style={{ width: 12, height: 12, background: "#0ACF83", borderRadius: "0 0 6px 6px" }} />
          </div>
          <div style={{ position: "absolute", top: 20, right: 16, width: 22, height: 22, border: `1.5px solid #BBB`, borderRadius: 4 }} />

          {/* slim icon sidebar column */}
          <div style={{ position: "absolute", top: 86, left: 0, bottom: 0, width: 50, borderRight: `1px solid ${LINE}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, paddingTop: 14, color: "#777", fontSize: 17 }}>
            <span style={{ color: BLUE }}>▤</span><span>◈</span><span>＋</span><span>▦</span><span>◉</span>
          </div>

          {/* Pages row + add */}
          <div style={{ position: "absolute", top: 94, left: 64, fontSize: 16, color: "#5A5A5A", display: "flex", alignItems: "center" }}><span style={{ fontSize: 11, color: SUB, marginRight: 6 }}>›</span>Pages</div>
          <div style={{ position: "absolute", top: 92, right: 16, fontSize: 20, color: SUB }}>＋</div>
          {/* Layers row + filter icon */}
          <div style={{ position: "absolute", top: 134, left: 64, fontSize: 16, color: "#5A5A5A" }}>Layers</div>
          <div style={{ position: "absolute", top: 134, right: 16, fontSize: 15, color: SUB }}>≣</div>
          {/* Flower 1/2/3 layer rows: chevron + grid icon + name */}
          {["Flower 1", "Flower 2", "Flower 3"].map((n, i) => (
            <div key={n} style={{ position: "absolute", left: 64, top: 174 + i * 34, display: "flex", alignItems: "center", gap: 10, fontSize: 16, color: INK }}>
              <span style={{ fontSize: 11, color: "#9A9A9A" }}>›</span>
              <span style={{ display: "inline-flex", width: 16, height: 16, alignItems: "center", justifyContent: "center", color: "#7A7A7A", fontSize: 14 }}>◈</span>
              <span>{n}</span>
            </div>
          ))}
        </div>

        {/* ============ RIGHT PROPERTIES PANEL ============ */}
        {/* top-right account/play/share bar (above the panel) */}
        <div style={{ position: "absolute", top: 18, right: 16, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>M</div>
          <div style={{ width: 26, height: 26, borderRadius: "50%", border: "1.5px solid #C8C8C8", color: "#444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>▶</div>
          <div style={{ background: BLUE, color: "#fff", borderRadius: 7, padding: "7px 16px", fontSize: 16, fontWeight: 600 }}>Share</div>
        </div>

        <div style={{ position: "absolute", top: 64, right: 0, bottom: 0, width: PROP_W, background: PANEL, borderLeft: `1px solid ${LINE}`, padding: "0 16px", color: INK, fontSize: 15 }}>
          {/* Motion 100% */}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 10px", fontWeight: 600 }}>Motion <span style={{ color: "#555", fontWeight: 400 }}>100% <span style={{ color: SUB }}>⌄</span></span></div>
          {/* Card row with code/grid/… icons */}
          <div style={{ padding: "10px 0", borderTop: `1px solid ${LINE}`, color: "#444", fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
            <span>Card <span style={{ color: SUB, fontWeight: 400 }}>⌄</span></span>
            <span style={{ color: SUB, letterSpacing: 6, fontSize: 14 }}>‹/›  ⌗  ⋯</span>
          </div>
          {/* Animation style + */}
          <div style={{ padding: "10px 0", borderTop: `1px solid ${LINE}`, color: "#444", display: "flex", justifyContent: "space-between" }}>Animation style <span style={{ color: SUB }}>＋</span></div>
          {/* Transform */}
          <div style={{ paddingTop: 12, color: "#444", fontWeight: 600, display: "flex", justifyContent: "space-between" }}>Transform <span style={{ color: SUB, letterSpacing: 2 }}>⋮⋮</span></div>
          {[["X", "100", "Y", "50"]].map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginTop: 8 }}>
              {[[r[0], r[1]], [r[2], r[3]]].map(([k, v], j) => (
                <div key={j} style={{ flex: 1, border: `1px solid ${LINE}`, borderRadius: 6, padding: "6px 8px", fontSize: 14, display: "flex", justifyContent: "space-between" }}><span><span style={{ color: SUB }}>{k}</span> {v}</span><span style={{ color: "#CFCFCF", fontSize: 12 }}>◇</span></div>
              ))}
            </div>
          ))}
          <div style={{ marginTop: 8, border: `1px solid ${LINE}`, borderRadius: 6, padding: "6px 8px", fontSize: 14, display: "flex", justifyContent: "space-between" }}><span><span style={{ color: SUB }}>⤢</span> 120%</span><span style={{ color: "#CFCFCF", fontSize: 12 }}>◇</span></div>
          <div style={{ marginTop: 8, border: `1px solid ${LINE}`, borderRadius: 6, padding: "6px 8px", fontSize: 14, width: "48%", display: "flex", justifyContent: "space-between" }}><span><span style={{ color: SUB }}>∟</span> 0°</span><span style={{ color: "#CFCFCF", fontSize: 12 }}>◇</span></div>
          {/* Layout */}
          <div style={{ paddingTop: 14, marginTop: 8, borderTop: `1px solid ${LINE}`, color: "#444", fontWeight: 600, display: "flex", justifyContent: "space-between" }}>Layout <span style={{ color: SUB, letterSpacing: 3 }}>⤢ ⊞</span></div>
          <div style={{ display: "flex", gap: 6, marginTop: 8, color: SUB, fontSize: 15 }}>
            {["⊟", "⇅", "⊡", "▦"].map((g, i) => (
              <div key={i} style={{ flex: 1, border: `1px solid ${LINE}`, borderRadius: 6, padding: "5px 0", textAlign: "center" }}>{g}</div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {[["W", "100"], ["H", "100"]].map(([k, v], j) => (
              <div key={j} style={{ flex: 1, border: `1px solid ${LINE}`, borderRadius: 6, padding: "6px 8px", fontSize: 14, display: "flex", justifyContent: "space-between" }}><span><span style={{ color: SUB }}>{k}</span> {v}</span><span style={{ color: "#CFCFCF", fontSize: 12 }}>◇</span></div>
            ))}
          </div>
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#444" }}>
            <span style={{ width: 16, height: 16, borderRadius: 4, background: BLUE, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>✓</span>Clip content
          </div>
          {/* Appearance */}
          <div style={{ paddingTop: 14, marginTop: 10, borderTop: `1px solid ${LINE}`, color: "#444", fontWeight: 600, display: "flex", justifyContent: "space-between" }}>Appearance <span style={{ color: SUB }}>◉ ◍</span></div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {[["▥", "100%"], ["⌜", "64"]].map(([k, v], j) => (
              <div key={j} style={{ flex: 1, border: `1px solid ${LINE}`, borderRadius: 6, padding: "6px 8px", fontSize: 14, display: "flex", justifyContent: "space-between" }}><span><span style={{ color: SUB }}>{k}</span> {v}</span><span style={{ color: "#CFCFCF", fontSize: 12 }}>◇</span></div>
            ))}
          </div>
          {/* Fill */}
          <div style={{ paddingTop: 14, marginTop: 10, borderTop: `1px solid ${LINE}`, color: "#444", fontWeight: 600, display: "flex", justifyContent: "space-between" }}>Fill <span style={{ color: SUB }}>＋</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, border: `1px solid ${LINE}`, borderRadius: 6, padding: "6px 8px", fontSize: 14 }}>
            <span style={{ width: 16, height: 16, borderRadius: 3, background: "#fff", border: "1px solid #DADADA" }} />FFFFFF
            <span style={{ marginLeft: "auto", color: "#444" }}>100 %</span>
            <span style={{ color: SUB }}>◉ −</span>
          </div>
        </div>

        {/* ============ FLOATING TOOLBAR ============ */}
        <div style={{ position: "absolute", left: 990, top: 612, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 4, background: PANEL, borderRadius: 14, padding: "8px 10px", boxShadow: "0 10px 30px rgba(0,0,0,0.22)" }}>
          {[{ g: "▷", on: true }, { g: "⊞" }, { g: "▢" }, { g: "✎" }, { g: "T" }, { g: "▭" }, { g: "✦" }].map((t, i) => (
            <div key={i} style={{ width: 40, height: 40, borderRadius: 9, background: t.on ? BLUE : "transparent", color: t.on ? "#fff" : "#3A3A3A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>{t.g}</div>
          ))}
          <div style={{ width: 1, height: 26, background: LINE, margin: "0 4px" }} />
          {["✐", "▥", "◈", "‹/›"].map((g, i) => (
            <div key={i} style={{ width: 38, height: 40, borderRadius: 9, background: g === "◈" ? "#E8F4FF" : "transparent", color: g === "◈" ? BLUE : "#3A3A3A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: g === "‹/›" ? 14 : 18 }}>{g}</div>
          ))}
        </div>

        {/* ============ BOTTOM MOTION TIMELINE ============ */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: TL_H, background: PANEL, borderTop: `1px solid ${LINE}`, color: INK }}>
          {/* timeline toolbar: play/pause, keyframe, current/total ms, view icons */}
          <div style={{ position: "absolute", top: 16, left: 14, display: "flex", alignItems: "center", gap: 12, fontSize: 15 }}>
            <span style={{ color: "#3A3A3A", fontSize: 17 }}>⏸</span>
            <span style={{ color: SUB, fontSize: 15 }}>◈</span>
            <span ref={playLabel} style={{ border: `1px solid ${LINE}`, borderRadius: 6, padding: "4px 10px", color: "#2C2C2C", minWidth: 46, textAlign: "center" }}>1400</span>
            <span style={{ border: `1px solid ${LINE}`, borderRadius: 6, padding: "4px 10px", color: "#2C2C2C" }}>3000</span>
            <span style={{ color: SUB }}>ms</span>
            <span style={{ color: SUB, marginLeft: 8 }}>≣ ⌅</span>
          </div>

          {/* ruler (0 .. 8500) */}
          <div style={{ position: "absolute", top: 50, left: 150, right: 250, height: 18, display: "flex", color: SUB, fontSize: 12 }}>
            {["0", "500", "1000", "1500", "2000", "2500", "3000", "3500", "4000", "4500", "5000", "5500", "6000", "6500", "7000", "7500", "8000", "8500"].map((t, i) => (
              <span key={t} style={{ position: "absolute", left: i * 79 }}>{t}</span>
            ))}
          </div>

          {/* playhead (advances) — kept above the tracks */}
          <div ref={playhead} style={{ position: "absolute", top: 46, left: 0, width: 2, height: TL_H - 46, background: BLUE, transform: "translateX(220px)", willChange: "transform", zIndex: 5 }}>
            <div style={{ position: "absolute", top: -2, left: -5, width: 12, height: 12, background: BLUE, borderRadius: 3 }} />
          </div>

          {/* tracks: name gutter (left) + lane bars */}
          {([
            { n: "Flower 1", indent: 0, bold: true, bar: BLUE, x: 0, w: 474, sel: true },
            { n: "Rotation", indent: 1, bar: "#cfe9ff", x: 0, w: 237, label: "Rotation" },
            { n: "Rotation", indent: 1, bar: "#cfe9ff", x: 237, w: 237, label: "Rotation" },
            { n: "Position", indent: 1, kf: [158, 316, 474], val: "12, 52" },
            { n: "Flower 2", indent: 0, bold: true, bar: "#E2E2E2", x: 0, w: 300 },
            { n: "Rotation", indent: 1, kf: [0, 332, 474] },
            { n: "Position", indent: 1, kf: [0, 158, 332] },
            { n: "Leaf 1A", indent: 0, bold: true, color: "#7C49E8", bar: "#caa6ff", x: 0, w: 474, label: "" },
            { n: "Rotation", indent: 1, bar: "#dfd2fb", x: 0, w: 237, label: "Rotation" },
          ] as any[]).map((tr, i) => {
            const y = 78 + i * 33;
            return (
              <div key={i}>
                {/* name */}
                <div style={{ position: "absolute", top: y + 2, left: 14 + tr.indent * 22, fontSize: 14, color: tr.color || (tr.bold ? INK : "#555"), fontWeight: tr.bold ? 600 : 400, display: "flex", alignItems: "center", gap: 6 }}>
                  {tr.bold && <span style={{ fontSize: 11, color: "#9A9A9A" }}>⌄</span>}
                  {tr.bold && <span style={{ width: 14, height: 14, display: "inline-flex", alignItems: "center", justifyContent: "center", color: tr.color || "#7A7A7A", fontSize: 12 }}>{tr.color ? "▢" : "◈"}</span>}
                  {!tr.bold && tr.val && <span style={{ color: SUB, fontSize: 12, marginRight: 4 }}>‹ ◇ ›</span>}
                  <span>{tr.n}</span>
                  {tr.val && <span style={{ color: "#555", marginLeft: 8 }}>{tr.val}</span>}
                </div>
                {/* selected-row highlight for Flower 1 */}
                {tr.sel && <div style={{ position: "absolute", top: y - 3, left: 150, right: 250, height: 26, background: "#EAF5FF", borderRadius: 4 }} />}
                {/* lane bar */}
                {tr.bar && (
                  <div style={{ position: "absolute", top: y, left: 150 + tr.x, width: tr.w, height: 20, borderRadius: 6, background: tr.bar, border: tr.sel ? `1px solid ${BLUE}` : tr.bar === "#cfe9ff" || tr.bar === "#dfd2fb" ? "1px solid #b9d9f5" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#2C2C2C", overflow: "hidden" }}>
                    {tr.label}
                  </div>
                )}
                {/* keyframe diamonds */}
                {tr.kf && (tr.kf as number[]).map((kx, ki) => (
                  <div key={ki} style={{ position: "absolute", top: y + 4, left: 150 + kx - 6, width: 12, height: 12, background: "#fff", border: "1.5px solid #8A8A8A", transform: "rotate(45deg)", borderRadius: 2 }} />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </Timegroup>
  );
};

export default Scene04_Editor;
