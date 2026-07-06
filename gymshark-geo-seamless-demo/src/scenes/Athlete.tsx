import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { Reveal } from "../components/Reveal";
import { Fin } from "../components/Fin";
import { camoBg, facetedCamo } from "../components/camo";
import { SCENES, OVERLAP_MS, WELL_A, NEAR_BLACK, WHITE, OFF_WHITE, GREY_MID, COOL_ACCENT, COOL_ACCENT_DIM, COOL_ACCENT_GLOW, DISPLAY, HEAVY } from "../constants";

const MODEL_0030 = "/assets/model-0030.jpg";

/**
 * ATHLETE · WELL_A — 4600ms local (nominal 4150ms solo + OVERLAP_MS, abs 3900–8500).
 * Training footage well (real Gymshark footage is composited into this exact rect after
 * render — see CREDITS.md / add-audio.sh; the poster image here is the placeholder frame)
 * + "BUILT FOR THE GRIND" / "LOCKED-IN FIT" performance copy.
 *
 * OWN entrance (T2 · GEAR-MESH SLAB SHUTTER, the only bespoke transition tied to this
 * beat): two angular camo slabs start meshed closed, covering Hero, then counter-rotate
 * apart during this scene's first `OVERLAP_MS` to reveal the well. No exit of its own —
 * Feature's own entrance (T3, see scenes/Feature.tsx) is what erases this scene.
 */
export const Athlete: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.athlete.duration}ms`} className="absolute inset-0 overflow-hidden" style={{ background: NEAR_BLACK }}>
    {/* ambient camo texture behind */}
    <div className="absolute inset-0" style={{ ...camoBg, opacity: 0.16 }} />
    <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 40% 45%, transparent 30%, rgba(0,0,0,0.7) 90%)" }} />
    {/* separation glow behind the well shoulders */}
    <div className="absolute" style={{ left: WELL_A.x - 120, top: WELL_A.y - 60, width: WELL_A.w + 240, height: WELL_A.h * 0.6, background: "radial-gradient(ellipse at 50% 30%, rgba(120,120,120,0.30) 0%, transparent 70%)" }} />

    {/* right-gutter chrome stack — hairline + tick scale + rotated index + frame-count spec */}
    <div className="absolute" style={{ right: 46, top: WELL_A.y, height: WELL_A.h, width: 2, background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.28) 18%, rgba(255,255,255,0.28) 82%, transparent)" }} />
    <div className="absolute flex flex-col justify-between items-end" style={{ right: 30, top: WELL_A.y + 40, bottom: 1920 - (WELL_A.y + WELL_A.h) + 230 }}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} style={{ width: i % 2 ? 10 : 22, height: 2, background: i % 2 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.7)" }} />
      ))}
    </div>
    <div className="absolute whitespace-nowrap" style={{ right: 62, top: WELL_A.y + 70, transform: "rotate(90deg)", transformOrigin: "right top", color: "rgba(255,255,255,0.5)", fontFamily: HEAVY, fontWeight: 800, fontSize: 16, letterSpacing: 6 }}>TRAINING · 4K</div>
    <div className="absolute text-right" style={{ right: 24, top: WELL_A.y + WELL_A.h - 112 }}>
      <div style={{ color: WHITE, fontFamily: DISPLAY, fontSize: 40, lineHeight: 1 }}>60</div>
      <div style={{ width: 30, height: 2, background: "rgba(255,255,255,0.45)", marginLeft: "auto", marginTop: 8, marginBottom: 7 }} />
      <div style={{ color: GREY_MID, fontFamily: HEAVY, fontWeight: 800, fontSize: 13, letterSpacing: 5 }}>FPS</div>
    </div>

    {/* left-gutter spec band */}
    <Reveal enter={[1000, 1300]} y={24} className="absolute" style={{ left: 24, top: WELL_A.y, height: WELL_A.h, width: 150 }}>
      <div className="absolute top-0 left-0 flex flex-col items-start" style={{ gap: 8 }}>
        <Fin size={0.26} color="rgba(255,255,255,0.92)" />
        <div style={{ color: COOL_ACCENT_DIM, fontFamily: HEAVY, fontWeight: 900, fontSize: 15, letterSpacing: 4 }}>FW · 26</div>
      </div>
      <div className="absolute whitespace-nowrap" style={{ top: 230, left: 14, transform: "rotate(90deg)", transformOrigin: "left top", color: "rgba(255,255,255,0.5)", fontFamily: HEAVY, fontWeight: 800, fontSize: 17, letterSpacing: 6 }}>GEO SEAMLESS · PERFORMANCE</div>
      <div className="absolute" style={{ bottom: 0, left: 0, padding: "10px 14px", border: "2px solid rgba(255,255,255,0.45)" }}>
        <div style={{ color: WHITE, fontFamily: DISPLAY, fontSize: 30, lineHeight: 1 }}>4-WAY</div>
        <div style={{ color: GREY_MID, fontFamily: HEAVY, fontWeight: 700, fontSize: 13, letterSpacing: 3, marginTop: 2 }}>STRETCH</div>
        <div className="absolute" style={{ left: -2, top: -2, width: 4, height: 12, background: COOL_ACCENT_DIM }} />
      </div>
    </Reveal>

    {/* WELL_A frame — EXACT rect, STATIONARY. Full-bleed footage framed only by sharp
        bracket corners (no device bezel/chrome) for the gritty-premium editorial register. */}
    <Reveal
      enter={[450, 750]}
      easeIn="out-expo"
      className="absolute overflow-hidden"
      style={{ left: WELL_A.x, top: WELL_A.y, width: WELL_A.w, height: WELL_A.h, borderRadius: 4 }}
    >
      <Image
        src={MODEL_0030}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "42% 30%",
          borderRadius: 4, filter: "grayscale(1) brightness(1.02) contrast(1.4)", transformOrigin: "50% 38%",
          transform: "scale(1.12)", animation: `athlete-push-in ${SCENES.athlete.duration - OVERLAP_MS}ms cubic-bezier(0.33,1,0.68,1) forwards`,
        }}
      />
      {/* studio bg pushed to near-black at the edges so the well matches the dark curve */}
      <div className="absolute inset-0" style={{ borderRadius: 4, background: "radial-gradient(ellipse 52% 58% at 50% 40%, transparent 30%, rgba(6,6,7,0.6) 70%, rgba(4,4,5,0.94) 100%)" }} />
      <div className="absolute inset-0" style={{ borderRadius: 4, background: "rgba(16,16,18,0.28)", mixBlendMode: "multiply" }} />
      <div className="absolute" style={{ left: 0, right: 0, top: "6%", height: "60%", background: "radial-gradient(ellipse 50% 60% at 50% 40%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 48%, transparent 76%)", mixBlendMode: "screen" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 24%, transparent 68%, rgba(0,0,0,0.82) 100%)" }} />
      <div className="absolute inset-0" style={{ borderRadius: 4, border: `2px solid rgba(255,255,255,0.6)` }} />
      {/* bracket corners — the // angular crop language, the only framing chrome */}
      <Reveal enter={[600, 870]} y={0} className="absolute inset-0">
        {[[0, 0, 1, 1], [1, 0, -1, 1], [0, 1, 1, -1], [1, 1, -1, -1]].map((c, i) => (
          <div key={i} className="absolute" style={{ [c[0] ? "right" : "left"]: -2, [c[1] ? "bottom" : "top"]: -2, width: 40, height: 40, borderTop: c[1] ? "none" : `4px solid ${WHITE}`, borderBottom: c[1] ? `4px solid ${WHITE}` : "none", borderLeft: c[0] ? "none" : `4px solid ${WHITE}`, borderRight: c[0] ? `4px solid ${WHITE}` : "none" } as React.CSSProperties} />
        ))}
        <div className="absolute flex items-center" style={{ top: 14, left: 16, gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: WHITE, boxShadow: `0 0 10px ${COOL_ACCENT_GLOW}` }} />
          <span style={{ color: WHITE, fontFamily: HEAVY, fontWeight: 800, fontSize: 15, letterSpacing: 3 }}>REC · 00:04</span>
        </div>
      </Reveal>
    </Reveal>

    {/* copy bands — outside the well rect, never over it */}
    <div className="absolute" style={{ top: 350, left: 70, animation: "wellA-copy1-in 260ms 480ms cubic-bezier(0.16,1,0.3,1) backwards, wellA-copy1-out 300ms 2150ms cubic-bezier(0.32,0,0.67,0) forwards" }}>
      <div className="flex items-baseline" style={{ gap: 11, marginBottom: 8 }}>
        <span style={{ color: COOL_ACCENT, fontFamily: HEAVY, fontWeight: 900, fontSize: 22, letterSpacing: 1 }}>//</span>
        <span style={{ color: OFF_WHITE, fontFamily: HEAVY, fontWeight: 800, fontSize: 22, letterSpacing: 6 }}>PERFORMANCE</span>
      </div>
      <div style={{ color: WHITE, fontFamily: DISPLAY, fontSize: 68, lineHeight: 0.86, letterSpacing: -2 }}>BUILT FOR<br />THE GRIND</div>
    </div>
    <div className="absolute text-left" style={{ bottom: 150, left: 70, animation: "wellA-copy2-in 260ms 2500ms cubic-bezier(0.16,1,0.3,1) both" }}>
      <div className="flex items-baseline" style={{ gap: 11, marginBottom: 8 }}>
        <span style={{ color: COOL_ACCENT, fontFamily: HEAVY, fontWeight: 900, fontSize: 22, letterSpacing: 1 }}>//</span>
        <span style={{ color: OFF_WHITE, fontFamily: HEAVY, fontWeight: 800, fontSize: 22, letterSpacing: 6 }}>THE FIT</span>
      </div>
      <div style={{ color: WHITE, fontFamily: DISPLAY, fontSize: 54, lineHeight: 0.86, letterSpacing: -2 }}>LOCKED-IN<br />FIT</div>
      <div style={{ width: 180, height: 2, background: "rgba(255,255,255,0.55)", marginTop: 12 }} />
    </div>

    {/* T2 · GEAR-MESH SLAB SHUTTER — closes over Hero then withdraws to reveal the well */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 60 }}>
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: "56%", ...facetedCamo, transform: "translateY(0)", clipPath: "polygon(0 0,100% 0,100% 86%,90% 100%,80% 86%,70% 100%,60% 86%,50% 100%,40% 86%,30% 100%,20% 86%,10% 100%,0 86%)", animation: `athlete-shutter-top-out ${OVERLAP_MS}ms cubic-bezier(0.33,1,0.68,1) forwards` }}
      />
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "56%", ...facetedCamo, transform: "translateY(0)", clipPath: "polygon(5% 14%,15% 0,25% 14%,35% 0,45% 14%,55% 0,65% 14%,75% 0,85% 14%,95% 0,100% 14%,100% 100%,0 100%,0 14%)", animation: `athlete-shutter-bottom-out ${OVERLAP_MS}ms cubic-bezier(0.33,1,0.68,1) forwards` }}
      />
      <div
        className="absolute left-0 right-0"
        style={{ top: "50%", height: 4, marginTop: -2, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.95),transparent)", boxShadow: "0 0 22px rgba(255,255,255,0.6)", opacity: 1, animation: `athlete-shutter-seam ${OVERLAP_MS}ms linear forwards` }}
      />
    </div>
  </Timegroup>
);
