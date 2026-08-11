import React, { useCallback, useRef } from "react";
import { Timegroup, Image } from "@editframe/react";
import { Reveal } from "@shared/components/Reveal";
import { Fin } from "../components/Fin";
import { camoBg } from "../components/camo";
import { track, easeOutCubic } from "@shared/utils/animation";
import { SCENES, OVERLAP_MS, WELL_B, NEAR_BLACK, WHITE, OFF_WHITE, GREY_LINE, COOL_ACCENT, COOL_ACCENT_GLOW, DISPLAY, HEAVY } from "../constants";

const POSTER_FABRIC = "/gymshark-geo-seamless-demo/src/assets/poster-fabric.jpg";

const SPECS = [
  { label: "STRETCH RECOVERY", kind: "num" as const, fill: 0.98 },
  { label: "BREATHABILITY", kind: "grade" as const, fill: 0.86 },
  { label: "SEAM COUNT", kind: "num" as const, fill: 0 },
];
const GRADES = ["F", "D", "C", "B", "A", "A+"];
const BAR_T0 = 930; // local ms: WELLB_SPEC_IN(650) + 280
const BAR_DUR = 620;
const BAR_GAP = 260;

/**
 * FABRIC · WELL_B — 3600ms local (nominal 3150ms solo + OVERLAP_MS, abs 10400–14000).
 * Seamless geo-knit fabric macro fills the well (real footage composited after render,
 * see CREDITS.md) + "ENGINEERED, NOT SEWN" headline + a kinetic spec panel.
 *
 * OWN entrance (T4 · BLUEPRINT GRID DRAW, the only bespoke transition tied to this beat):
 * a technical drafting grid + measurement crosshair draws in across the frame, scans
 * once, then retracts — "drafting" this engineered scene into existence. No exit of its
 * own — Colorways' own entrance (T5, see scenes/Colorways.tsx) is what erases this scene.
 *
 * The three spec-bar readouts (a count-up %, a letter-grade tick, and the live 0.2mm
 * measurement digits) mutate text content over time, which has no reasonable closed-form
 * CSS expression — everything else in this scene (bar width sweep, glow, ticks, the
 * scanning crosshair, the camo drift) is plain CSS. This is the one deliberately-scoped
 * `onFrame` in the whole composition; it only ever reads this scene's own local clock.
 */
export const Fabric: React.FC = () => {
  const stretchRef = useRef<HTMLSpanElement>(null);
  const gradeRef = useRef<HTMLSpanElement>(null);
  const seamRef = useRef<HTMLSpanElement>(null);
  const mmRef = useRef<HTMLSpanElement>(null);

  const handleFrame = useCallback((arg: { ownCurrentTimeMs?: number }) => {
    const ms = arg?.ownCurrentTimeMs ?? 0;
    const p0 = track(ms, BAR_T0, BAR_T0 + BAR_DUR, easeOutCubic);
    if (stretchRef.current) stretchRef.current.textContent = `${Math.round(98 * p0)}%`;
    const p1 = track(ms, BAR_T0 + BAR_GAP, BAR_T0 + BAR_GAP + BAR_DUR, easeOutCubic);
    if (gradeRef.current) gradeRef.current.textContent = GRADES[Math.min(GRADES.length - 1, Math.floor(p1 * GRADES.length))];
    if (seamRef.current) seamRef.current.textContent = "0";
    const v = 0.2 + 0.018 * Math.sin(ms * 0.012);
    if (mmRef.current) mmRef.current.textContent = `${v.toFixed(2)}mm`;
  }, []);

  return (
    <Timegroup mode="fixed" duration={`${SCENES.fabric.duration}ms`} onFrame={handleFrame as any} className="absolute inset-0" style={{ background: NEAR_BLACK }}>
      <div className="absolute inset-0" style={{ ...camoBg, opacity: 0.14 }} />

      {/* header copy above the well */}
      <Reveal enter={[520, 740]} y={-22} className="absolute" style={{ top: 130, left: 70, right: 70 }}>
        <div className="flex items-baseline" style={{ gap: 12 }}>
          <span style={{ color: COOL_ACCENT, fontFamily: HEAVY, fontWeight: 900, fontSize: 24, letterSpacing: 1 }}>//</span>
          <span style={{ color: OFF_WHITE, fontFamily: HEAVY, fontWeight: 800, fontSize: 24, letterSpacing: 6 }}>SEAMLESS KNIT</span>
        </div>
        <div style={{ color: WHITE, fontFamily: DISPLAY, fontSize: 116, lineHeight: 0.86, marginTop: 12 }}>ENGINEERED,</div>
        <div style={{ color: WHITE, fontFamily: DISPLAY, fontSize: 116, lineHeight: 0.88 }}>NOT SEWN.</div>
      </Reveal>

      {/* kinetic spec panel */}
      <Reveal enter={[650, 910]} y={20} className="absolute" style={{ top: 440, left: 70, right: 70 }}>
        <div style={{ width: 70, height: 3, background: COOL_ACCENT, marginBottom: 26, boxShadow: `0 0 12px ${COOL_ACCENT_GLOW}` }} />
        <div className="flex items-center justify-between" style={{ marginBottom: 18 }}>
          <span style={{ color: WHITE, fontFamily: HEAVY, fontWeight: 900, fontSize: 26, letterSpacing: 4 }}>GEO CAMO · SEAMLESS WEAVE</span>
          <span ref={mmRef} style={{ color: WHITE, fontFamily: HEAVY, fontWeight: 800, fontSize: 22, letterSpacing: 2 }}>0.20mm</span>
        </div>
        {/* moving camo measurement band */}
        <div className="relative overflow-hidden" style={{ height: 58, ...camoBg, opacity: 0.55, borderTop: `2px solid ${GREY_LINE}`, borderBottom: `2px solid ${GREY_LINE}`, animation: "camo-drift 4000ms linear infinite" }}>
          <div className="absolute top-0 bottom-0 left-0 flex items-center whitespace-nowrap" style={{ gap: 22, animation: "fabric-ticks-scroll 490ms linear infinite" }}>
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div style={{ width: 2, height: i % 5 === 0 ? 26 : 13, background: i % 5 === 0 ? WHITE : "rgba(255,255,255,0.45)" }} />
              </div>
            ))}
          </div>
        </div>
        {/* three engineered spec bars — CSS sweep-fill L→R, staggered by index */}
        <div className="flex flex-col" style={{ marginTop: 22, gap: 18 }}>
          {SPECS.map((s, i) => {
            const isSeam = i === 2;
            const delay = BAR_T0 + i * BAR_GAP;
            return (
              <div key={s.label} className="flex items-center" style={{ gap: 18 }}>
                <span style={{ color: WHITE, fontFamily: HEAVY, fontWeight: 800, fontSize: 18, letterSpacing: 2, width: 240 }}>{s.label}</span>
                <div className="relative" style={{ flex: 1, height: 8, background: isSeam ? "transparent" : GREY_LINE, overflow: "visible" }}>
                  <div className="absolute" style={{ left: 0, top: -3, bottom: -3, width: 3, background: isSeam ? COOL_ACCENT : "rgba(255,255,255,0.55)" }} />
                  {isSeam && <div className="absolute" style={{ left: 0, right: 0, top: 3, height: 2, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.16) 0 6px, transparent 6px 14px)" }} />}
                  {!isSeam && (
                    <>
                      <div
                        className="absolute"
                        style={{ left: 0, top: 0, bottom: 0, width: "0%", background: WHITE, animation: `fabric-bar-fill-${i} ${BAR_DUR}ms ${delay}ms cubic-bezier(0.33,1,0.68,1) forwards` }}
                      />
                      <div
                        className="absolute"
                        style={{ top: -3, bottom: -3, width: 14, left: "0%", background: WHITE, filter: "blur(5px)", opacity: 0, animation: `fabric-bar-glow-${i} ${BAR_DUR}ms ${delay}ms cubic-bezier(0.33,1,0.68,1) forwards` }}
                      />
                    </>
                  )}
                </div>
                <span
                  ref={isSeam ? seamRef : i === 0 ? stretchRef : gradeRef}
                  style={{ color: WHITE, fontFamily: DISPLAY, fontSize: isSeam ? 40 : 24, lineHeight: 1, letterSpacing: 1, width: 110, textAlign: "right", display: "inline-block", textShadow: isSeam ? `0 0 18px ${COOL_ACCENT_GLOW}` : "none" }}
                >
                  {isSeam ? "0" : s.kind === "num" ? "0%" : "F"}
                </span>
              </div>
            );
          })}
        </div>
      </Reveal>

      {/* lab-bench band behind the scope */}
      <div className="absolute left-0 right-0" style={{ top: WELL_B.y - 36, height: WELL_B.h + 72, background: "linear-gradient(180deg, transparent 0%, rgba(40,40,42,0.7) 14%, rgba(40,40,42,0.7) 86%, transparent 100%)", borderTop: "3px solid #585858", borderBottom: "3px solid #585858" }} />
      <div className="absolute whitespace-nowrap" style={{ right: 24, top: WELL_B.y + WELL_B.h, transform: "rotate(-90deg)", transformOrigin: "right bottom", color: COOL_ACCENT, fontFamily: HEAVY, fontWeight: 900, fontSize: 15, letterSpacing: 5 }}>LIVE · 100×</div>

      {/* WELL_B frame — EXACT rect, STATIONARY. Lab macro-scope device read. */}
      <div
        className="absolute"
        style={{
          left: WELL_B.x, top: WELL_B.y, width: WELL_B.w, height: WELL_B.h, transformOrigin: "50% 50%", opacity: 0, transform: "scale(0.9)",
          animation: `fabric-frame-pop 200ms 450ms cubic-bezier(0.16,1,0.3,1) both`,
        }}
      >
        <div className="absolute" style={{ inset: -12, borderRadius: 8, border: "3px solid rgba(255,255,255,0.82)", boxShadow: "0 0 0 1.5px rgba(0,0,0,0.65), 0 0 22px rgba(0,0,0,0.55)" }} />
        <Image
          src={POSTER_FABRIC}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: 4,
            filter: "grayscale(1) brightness(0.92) contrast(1.5)", transformOrigin: "50% 50%", transform: "scaleX(-1) scale(1.04)",
            animation: `fabric-push-in ${SCENES.fabric.duration - OVERLAP_MS}ms 450ms cubic-bezier(0.33,1,0.68,1) forwards`,
          }}
        />
        <div className="absolute inset-0" style={{ borderRadius: 4, background: "radial-gradient(ellipse 64% 64% at 50% 50%, transparent 36%, rgba(4,4,5,0.6) 92%)" }} />
        <div className="absolute inset-0" style={{ borderRadius: 4, background: "rgba(14,14,16,0.18)", mixBlendMode: "multiply" }} />
        <div className="absolute inset-0" style={{ borderRadius: 4, border: `2px solid rgba(255,255,255,0.6)` }} />
        {[[0, 0, 1, 1], [1, 0, -1, 1], [0, 1, 1, -1], [1, 1, -1, -1]].map((c, i) => (
          <div key={i} className="absolute" style={{ [c[0] ? "right" : "left"]: -8, [c[1] ? "bottom" : "top"]: -8, width: 58, height: 58, borderTop: c[1] ? "none" : `7px solid ${WHITE}`, borderBottom: c[1] ? `7px solid ${WHITE}` : "none", borderLeft: c[0] ? "none" : `7px solid ${WHITE}`, borderRight: c[0] ? `7px solid ${WHITE}` : "none", filter: "drop-shadow(0 0 6px rgba(0,0,0,0.7))" } as React.CSSProperties} />
        ))}
        {/* macro-scope HUD — crosshair reticle */}
        <div className="absolute" style={{ left: "50%", top: "50%", width: 120, height: 120, marginLeft: -60, marginTop: -60 }}>
          <div className="absolute" style={{ left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.5)" }} />
          <div className="absolute" style={{ top: "50%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.5)" }} />
          <div className="absolute" style={{ left: "50%", top: "50%", width: 30, height: 30, marginLeft: -15, marginTop: -15, border: `2px solid ${COOL_ACCENT}`, borderRadius: "50%" }} />
        </div>
        {/* continuous scan sweep — infinite, no JS */}
        <div className="absolute left-0 right-0 top-0" style={{ height: 3, background: `linear-gradient(90deg, transparent, ${COOL_ACCENT}, transparent)`, boxShadow: `0 0 16px ${COOL_ACCENT_GLOW}`, opacity: 0.8, animation: "fabric-sweep-loop 1520ms linear infinite" }} />
        <div className="absolute flex flex-col justify-between" style={{ left: 16, top: 56, bottom: 56 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} style={{ width: i % 2 ? 8 : 16, height: 2, background: "rgba(255,255,255,0.6)" }} />
          ))}
        </div>
        <div className="absolute" style={{ top: 12, left: 12, padding: "5px 11px", background: "rgba(8,8,8,0.62)", border: "1px solid rgba(255,255,255,0.18)" }}>
          <span style={{ color: WHITE, fontFamily: HEAVY, fontWeight: 900, fontSize: 16, letterSpacing: 3, textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>FIBER SCOPE · 0.2mm</span>
        </div>
        <div className="absolute flex items-center" style={{ bottom: 12, right: 12, gap: 8, padding: "5px 11px", background: "rgba(8,8,8,0.62)", border: "1px solid rgba(255,255,255,0.18)" }}>
          <Fin size={0.3} color={WHITE} />
          <span style={{ color: WHITE, fontFamily: HEAVY, fontWeight: 900, fontSize: 17, letterSpacing: 3, textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>MACRO 100×</span>
        </div>
      </div>

      {/* T4 · BLUEPRINT GRID DRAW — a drafting grid + crosshair draws this scene in */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 60 }}>
        <div className="absolute inset-0" style={{ opacity: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.18) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.18) 1px,transparent 1px),linear-gradient(rgba(255,255,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.06) 1px,transparent 1px)", backgroundSize: "240px 240px,240px 240px,48px 48px,48px 48px", animation: `fabric-grid-field ${OVERLAP_MS}ms linear both` }} />
        <div className="absolute left-0 right-0" style={{ top: "50%", height: 3, marginTop: -1, background: "linear-gradient(90deg,rgba(255,255,255,0.9),rgba(255,255,255,0.3))", transformOrigin: "left center", transform: "scaleX(0)", animation: `fabric-rule-h ${OVERLAP_MS}ms linear forwards` }} />
        <div className="absolute top-0 bottom-0" style={{ left: "50%", width: 3, marginLeft: -1, background: "linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.3))", transformOrigin: "center top", transform: "scaleY(0)", animation: `fabric-rule-v ${OVERLAP_MS}ms linear forwards` }} />
        <div className="absolute" style={{ left: "8%", top: "12%", width: 70, height: 70, marginLeft: -35, marginTop: -35, opacity: 0, animation: `fabric-crosshair-travel ${OVERLAP_MS}ms linear both` }}>
          <div className="absolute" style={{ left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.85)" }} />
          <div className="absolute" style={{ top: "50%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.85)" }} />
          <div className="absolute" style={{ inset: 22, border: "2px solid rgba(255,255,255,0.9)", borderRadius: "50%" }} />
        </div>
      </div>
    </Timegroup>
  );
};
