import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { clamp, lerp, track, easeOutCubic, easeInCubic, outBack } from "./components/helpers";
import {
  DURATION_MS, W, H,
  NEAR_BLACK, BLACK, CHARCOAL, CHARCOAL_2, GREY_MID, GREY_LINE, OFF_WHITE, WHITE,
  COOL_ACCENT, COOL_ACCENT_DIM, COOL_ACCENT_GLOW,
  WELL_A, WELL_B,
  HOOK_IN, LOGO_WIPE_START, LOGO_WIPE_END, HOOK_LINE_IN, HOOK_OUT,
  HERO_IN, HERO_REVEAL_END, HERO_TITLE_IN, HERO_SUB_IN, HERO_PRICE_IN, HERO_OUT,
  WELLA_FRAME_IN, WELLA_COPY1_IN, WELLA_COPY2_IN, WELLA_STAT_IN, WELLA_OUT,
  FEAT_IN, FEAT_C1_IN, FEAT_C2_IN, FEAT_C3_IN, FEAT_OUT,
  WELLB_FRAME_IN, WELLB_COPY1_IN, WELLB_SPEC_IN, WELLB_PEAK_IN, WELLB_OUT,
  CW_IN, CW_LABEL_IN, CW_PREVIEW_IN, CW_GRID_IN, CW_GRID_STEP, CW_SELECT_START, CW_SELECT_STEP, CW_OUT,
  CTA_IN, CTA_FIN_IN, CTA_SHOP_IN, CTA_BTN_IN, CTA_PRICE_IN, CTA_URL_IN,
} from "./constants";
import {
  MODEL_A, POSTER_ATHLETE, POSTER_FABRIC, MODEL_0049, MODEL_0030,
  CW_BLUE, CW_GREEN, CW_BROWN, CW_WHITE, CW_SMOKEBLUE, CW_LINENBROWN, CW_LIGHTGREY,
  GYMSHARK_LOGO, GYMSHARK_FIN,
} from "./assets";

// ── 8 REAL colorways (FIX 3) — model-a is the black/charcoal Geo Camo, then the 7 tonal
// product shots. `obj` = objectPosition tuned per shot so the chest/torso (where the
// colorway reads) is framed in the swatch + the main preview. ──
const COLORWAYS: { name: string; sub: string; src: string; obj: string }[] = [
  { name: "ONYX BLACK",   sub: "GEO SEAMLESS", src: MODEL_A,       obj: "50% 30%" },
  { name: "TEAL",         sub: "GEO SEAMLESS", src: CW_BLUE,       obj: "50% 42%" },
  { name: "SAGE GREEN",   sub: "GEO SEAMLESS", src: CW_GREEN,      obj: "50% 42%" },
  { name: "EARTH BROWN",  sub: "GEO SEAMLESS", src: CW_BROWN,      obj: "50% 42%" },
  { name: "BONE WHITE",   sub: "GEO SEAMLESS", src: CW_WHITE,      obj: "50% 44%" },
  { name: "SMOKE BLUE",   sub: "SEAMLESS PLAIN", src: CW_SMOKEBLUE, obj: "50% 42%" },
  { name: "LINEN BROWN",  sub: "GEO SEAMLESS", src: CW_LINENBROWN, obj: "50% 42%" },
  { name: "LIGHT GREY",   sub: "GEO SEAMLESS", src: CW_LIGHTGREY,  obj: "50% 42%" },
];

// ── Type ──
const DISPLAY = "'Archivo Black', 'Archivo', Inter, sans-serif"; // heavy grotesque
const HEAVY = "'Archivo', Inter, sans-serif";
const SANS = "Inter, -apple-system, sans-serif";

// ── easings ──
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const Video: React.FC = () => {
  // ── BEAT 1 HOOK refs (MINIMALIST — real logo, one confident wipe) ──
  const b1Ref = useRef<HTMLDivElement>(null);
  const hookLogoWrapRef = useRef<HTMLDivElement>(null);   // real GYMSHARK logo (wipe-revealed)
  const hookLogoMaskRef = useRef<HTMLDivElement>(null);   // clip wrap over the logo image (inset wipe)
  const hookWipeEdgeRef = useRef<HTMLDivElement>(null);   // hairline leading edge of the wipe
  const hookLineRef = useRef<HTMLDivElement>(null);       // one quiet kicker line
  const hookCamoRef = useRef<HTMLDivElement>(null);       // calm geo-camo drift behind

  // ── BEAT 2 HERO refs ──
  const b2Ref = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const heroTitleRef = useRef<HTMLDivElement>(null);
  const heroSubRef = useRef<HTMLDivElement>(null);
  const heroPriceRef = useRef<HTMLDivElement>(null);
  // FIX B — heroSweepRef / heroFlashRef / heroRevealRef removed (stripped effects)

  // ── BEAT 3 WELL_A refs ──
  const b3Ref = useRef<HTMLDivElement>(null);
  const wellAFrameRef = useRef<HTMLDivElement>(null);
  const wellAImgRef = useRef<HTMLImageElement>(null);   // poster image — subtle push-in (panel 10)
  const wellACornerRef = useRef<HTMLDivElement>(null);
  const wellACopy1Ref = useRef<HTMLDivElement>(null);
  const wellACopy2Ref = useRef<HTMLDivElement>(null);
  const wellAStatRef = useRef<HTMLDivElement>(null);

  // ── BEAT 4 FEATURE refs ──
  const b4Ref = useRef<HTMLDivElement>(null);
  const featImgRef = useRef<HTMLDivElement>(null);
  const featC1Ref = useRef<HTMLDivElement>(null);
  const featC2Ref = useRef<HTMLDivElement>(null);
  const featC3Ref = useRef<HTMLDivElement>(null);

  // ── BEAT 5 WELL_B refs ──
  const b5Ref = useRef<HTMLDivElement>(null);
  const wellBFrameRef = useRef<HTMLDivElement>(null);
  const wellBImgRef = useRef<HTMLImageElement>(null);   // macro image — subtle push-in (panel 10)
  const wellBCopy1Ref = useRef<HTMLDivElement>(null);
  const wellBCamoRef = useRef<HTMLDivElement>(null);
  const wellBSweepRef = useRef<HTMLDivElement>(null);   // crosshair sweep across the scope
  const wellBTicksRef = useRef<HTMLDivElement>(null);    // scrolling 0.2mm measurement ticks
  const wellBSpecRef = useRef<HTMLDivElement>(null);     // kinetic spec panel filling the void
  const wellBReadoutRef = useRef<HTMLDivElement>(null);  // live measurement readout digits
  const wellBPeakRef = useRef<HTMLDivElement>(null);     // "0" SEAM COUNT scale-pop accent (proof peak)

  // ── BEAT 6 COLORWAY SELECTOR refs (8 REAL swatches + big MAIN PREVIEW) ──
  const b6Ref = useRef<HTMLDivElement>(null);
  const cwSwatchRefs = Array.from({ length: 8 }, () => useRef<HTMLDivElement>(null));
  const cwSwatchImgRefs = Array.from({ length: 8 }, () => useRef<HTMLImageElement>(null)); // per-swatch img (re-lit when active)
  const cwSwatchRingRefs = Array.from({ length: 8 }, () => useRef<HTMLDivElement>(null)); // selection ring per swatch
  const cwPreviewRefs = Array.from({ length: 8 }, () => useRef<HTMLDivElement>(null));    // stacked real previews (crossfade)
  const cwPreviewWrapRef = useRef<HTMLDivElement>(null);   // preview panel container (entry pop)
  const cwNameRef = useRef<HTMLDivElement>(null);          // selected colorway NAME
  const cwSubRef = useRef<HTMLDivElement>(null);           // selected colorway sub
  const cwIndexRef = useRef<HTMLDivElement>(null);         // "03 / 08" index readout
  const cwLabelRef = useRef<HTMLDivElement>(null);
  const cwFindRef = useRef<HTMLDivElement>(null);
  const cwCamoRef = useRef<HTMLDivElement>(null);

  // ── BEAT 7 CTA / OUTRO refs (b05 style — FIX 4) ──
  const b7Ref = useRef<HTMLDivElement>(null);
  const ctaBgRef = useRef<HTMLDivElement>(null);          // drifting fabric-texture bg
  const ctaBg2Ref = useRef<HTMLDivElement>(null);         // slower parallax model ghost behind
  const ctaCamoRef = useRef<HTMLDivElement>(null);        // drifting geo-camo motif
  const ctaLogoRef = useRef<HTMLDivElement>(null);        // REAL gymshark logo lockup (settle)
  const ctaTitleRef = useRef<HTMLDivElement>(null);       // SHOP GEO SEAMLESS (line reveal)
  const ctaBtnRef = useRef<HTMLDivElement>(null);         // SHOP NOW pill (overshoot pop)
  const ctaBtnSheenRef = useRef<HTMLDivElement>(null);    // specular sheen sweep on the pill
  const ctaFlashRef = useRef<HTMLDivElement>(null);       // 1-frame land flash
  const ctaPriceRef = useRef<HTMLDivElement>(null);       // FROM $36 anchor
  const ctaUrlRef = useRef<HTMLDivElement>(null);         // GYMSHARK.COM

  // global ambient
  const grainRef = useRef<HTMLDivElement>(null);

  // ── SIX TRANSITION overlays (Geo-Camo Mechanics) — one designed move per cut ──
  const tx1Ref = useRef<HTMLDivElement>(null);   // T1 halftone dot-dissolve
  const tx1aRef = useRef<HTMLDivElement>(null);
  const tx1bRef = useRef<HTMLDivElement>(null);
  const tx1IrisRef = useRef<HTMLDivElement>(null);
  const tx2Ref = useRef<HTMLDivElement>(null);   // T2 gear-mesh slab shutter
  const tx2TopRef = useRef<HTMLDivElement>(null);
  const tx2BotRef = useRef<HTMLDivElement>(null);
  const tx2SeamRef = useRef<HTMLDivElement>(null);
  const tx3Ref = useRef<HTMLDivElement>(null);   // T3 spec-panel shatter
  const tx4Ref = useRef<HTMLDivElement>(null);   // T4 blueprint grid draw
  const tx4HRef = useRef<HTMLDivElement>(null);
  const tx4VRef = useRef<HTMLDivElement>(null);
  const tx4CrossRef = useRef<HTMLDivElement>(null);
  const tx4GridRef = useRef<HTMLDivElement>(null);
  const tx5Ref = useRef<HTMLDivElement>(null);   // T5 rack split
  const tx6Ref = useRef<HTMLDivElement>(null);   // T6 halftone converge
  const tx6CoreRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback((arg: any) => {
    const ms = arg?.ownCurrentTimeMs ?? -1;

    const set = (el: HTMLElement | null, style: Partial<CSSStyleDeclaration>) => {
      if (!el) return;
      Object.assign(el.style, style);
    };
    // OPACITY-ONLY gating (display toggling is unreliable in this editframe render-clone build).
    // Each beat wrapper gets its opacity set EVERY frame; 0 outside its window so it cannot
    // cover lower beats. visibility:hidden as belt-and-suspenders so hidden beats never paint.
    const gate = (ref: React.RefObject<HTMLElement>, on: boolean, opacity = 1) => {
      const el = ref.current;
      if (!el) return;
      const o = on ? clamp(opacity) : 0;
      el.style.opacity = String(o);
      el.style.visibility = o > 0 ? "visible" : "hidden";
    };

    // ════════ BEAT 1 — MINIMALIST HOOK (FIX 1 + 2) ════════
    // Calm geo-camo drift on near-black. The REAL gymshark logo lands clean via ONE
    // confident left→right wipe. One quiet kicker line. No streaks, no flash, no rapid cuts.
    {
      const exit = track(ms, HOOK_OUT - 220, HOOK_OUT, easeInCubic);
      gate(b1Ref, ms < HOOK_OUT, 1 - exit);
    }
    if (ms < HOOK_OUT) {
      // calm, slow geo-camo drift behind (restrained — not ripping)
      const cdrift = ms * 0.04;
      set(hookCamoRef.current, {
        backgroundPosition: `${-cdrift}px ${-cdrift * 0.6}px, ${-cdrift * 0.5 + 9}px ${-cdrift * 0.3 + 9}px`,
        opacity: String(lerp(0.0, 0.16, track(ms, 0, 500))),
      });
      // REAL logo: a tiny settle (no scale punch) — premium, restrained. The lockup is
      // CONTAINED by an inner clip wrap so the reveal can NEVER show a stray black box
      // outside the wordmark bounds (panel 1).
      const logoIn = track(ms, LOGO_WIPE_START, LOGO_WIPE_START + 260, easeOutCubic);
      set(hookLogoWrapRef.current, {
        opacity: String(logoIn),
        transform: `translateY(${lerp(10, 0, logoIn)}px)`,
      });
      // ONE confident sharp wipe sweeps left→right ACROSS THE LOGO ITSELF via a clipPath inset
      // on the logo image — the lockup is uncovered left→right with a hairline leading edge,
      // strictly inside the wordmark box. No sliding slab, so no notched black rectangle ever
      // rides alongside the fin. (panel 1 — clean wipe contained to the lockup bounds.)
      const wipeP = track(ms, LOGO_WIPE_START, LOGO_WIPE_END, easeOutExpo);
      set(hookLogoMaskRef.current, {
        // hookLogoMaskRef now wraps the logo image and is the clipped reveal surface
        clipPath: `inset(0 ${lerp(100, 0, wipeP)}% 0 0)`,
      });
      // hairline leading edge rides the wipe front (a single crisp white tick), then vanishes
      set(hookWipeEdgeRef.current, {
        left: `${lerp(0, 100, wipeP)}%`,
        opacity: String(wipeP > 0.02 && wipeP < 0.98 ? 0.9 : 0),
      });
      // one quiet kicker line fades up (no slam)
      const hlP = track(ms, HOOK_LINE_IN, HOOK_LINE_IN + 360, easeOutCubic);
      set(hookLineRef.current, {
        opacity: String(track(ms, HOOK_LINE_IN, HOOK_LINE_IN + 280)),
        transform: `translateY(${lerp(14, 0, hlP)}px)`,
      });
    }

    // ════════ BEAT 2 — PRODUCT HERO (active from frame 0, under the hook overlay) ════════
    // FIX B — STRIPPED. No faceted reveal mask, no light sweep, no price flash, no clip-slams,
    // no aggressive push-in. The model + GEO SEAMLESS + $36 present CLEANLY: a very subtle
    // settle only. The single notable effect tied to this beat is its OUTGOING transition T2.
    {
      const exit2 = track(ms, HERO_OUT, HERO_OUT + 160, easeInCubic);
      gate(b2Ref, ms >= HERO_IN && ms < HERO_OUT + 200, 1 - exit2);
    }
    if (ms >= HERO_IN && ms < HERO_OUT + 200) {
      // CALM settle: image rests at full clarity almost immediately, with a barely-perceptible
      // breathing creep so the frame is alive but confident (no snap, no whip).
      const settleP = track(ms, 0, 900, easeOutCubic);            // gentle ease into rest
      const breathe = 1 + 0.010 * Math.sin((ms - HERO_IN) * 0.0011); // slow ambient breath
      const scale = lerp(1.10, 1.04, settleP) * breathe;
      const py = lerp(14, 0, settleP);
      set(heroImgRef.current, { transform: `translateY(${py}px) scale(${scale})`, opacity: "1" });
      // GEO SEAMLESS — clean fade + tiny rise (no clip-slam, no slide-in whip)
      const tP = track(ms, HERO_TITLE_IN, HERO_TITLE_IN + 360, easeOutCubic);
      set(heroTitleRef.current, { opacity: String(tP), transform: `translateY(${lerp(14, 0, tP)}px)`, clipPath: "none" });
      const sP = track(ms, HERO_SUB_IN, HERO_SUB_IN + 340, easeOutCubic);
      set(heroSubRef.current, { opacity: String(sP), transform: `translateY(${lerp(12, 0, sP)}px)` });
      // $36 — clean fade-up settle, no flash, no scale punch
      const prP = track(ms, HERO_PRICE_IN, HERO_PRICE_IN + 360, easeOutCubic);
      set(heroPriceRef.current, { opacity: String(prP), transform: `translateY(${lerp(12, 0, prP)}px)` });
    }

    // ════════ BEAT 3 — ATHLETE WELL_A (STATIONARY rect) ════════
    {
      const exit3 = track(ms, WELLA_OUT - 120, WELLA_OUT, easeInCubic);
      gate(b3Ref, ms >= WELLA_FRAME_IN && ms < WELLA_OUT, 1 - exit3);
    }
    if (ms >= WELLA_FRAME_IN && ms < WELLA_OUT) {
      // frame body draws in BEFORE footage window, stays EXACT + motionless during 4500-8500
      const fP = track(ms, WELLA_FRAME_IN, WELLA_FRAME_IN + 300, easeOutExpo);
      set(wellAFrameRef.current, { opacity: String(fP) });
      // PUSH-IN parallax on the image so the still reads as live training footage (panel 10).
      // The well RECT is EXACT/stationary; only the IMAGE slowly scales + drifts inside its clip.
      const waPush = track(ms, WELLA_FRAME_IN, WELLA_OUT, easeOutCubic);
      set(wellAImgRef.current, { transform: `scale(${lerp(1.12, 1.26, waPush)}) translateY(${lerp(0, -14, waPush)}px)` });
      // corner ticks
      set(wellACornerRef.current, { opacity: String(track(ms, WELLA_FRAME_IN + 150, WELLA_FRAME_IN + 420)) });
      // copy bands slide in from frame edge (positioned OUTSIDE the well rect, never over it).
      // STAGGER (panel 10): BUILT FOR THE GRIND fades OUT over 6050-6350 — fully gone before
      // LOCKED-IN FIT reaches full opacity at WELLA_COPY2_IN (6400) — single dominant headline.
      const c1P = track(ms, WELLA_COPY1_IN, WELLA_COPY1_IN + 260, easeOutExpo);
      const c1Out = track(ms, WELLA_COPY2_IN - 350, WELLA_COPY2_IN - 50, easeInCubic);
      set(wellACopy1Ref.current, { opacity: ms >= WELLA_COPY1_IN ? String(c1P * (1 - c1Out)) : "0", transform: `translateX(${lerp(70, 0, c1P)}px) translateY(${lerp(0, -18, c1Out)}px)` });
      const c2P = track(ms, WELLA_COPY2_IN, WELLA_COPY2_IN + 260, easeOutExpo);
      set(wellACopy2Ref.current, { opacity: ms >= WELLA_COPY2_IN ? "1" : "0", transform: `translateX(${lerp(-70, 0, c2P)}px)` });
      const stP = track(ms, WELLA_STAT_IN, WELLA_STAT_IN + 300, easeOutExpo);
      set(wellAStatRef.current, { opacity: ms >= WELLA_STAT_IN ? "1" : "0", transform: `translateY(${lerp(24, 0, stP)}px)` });
    }

    // ════════ BEAT 4 — SEAMLESS FEATURE ════════
    {
      const exit4 = track(ms, FEAT_OUT, FEAT_OUT + 160, easeInCubic);
      gate(b4Ref, ms >= FEAT_IN && ms < FEAT_OUT + 200, 1 - exit4);
    }
    if (ms >= FEAT_IN && ms < FEAT_OUT + 200) {
      // PUNCH-IN on the cut — whole scene snaps from 1.05 → 1.0 in ~180ms (kinetic cut)
      const punch4 = track(ms, FEAT_IN, FEAT_IN + 180, easeOutExpo);
      set(b4Ref.current, { transform: `scale(${lerp(1.05, 1, punch4)})`, transformOrigin: "50% 42%" });
      // SLOW PUSH-IN + FABRIC-STRETCH (panel 8): continuous push, a gentle horizontal pan that
      // reads as the weave traveling, and a subtle anisotropic scaleY breathing so the fabric
      // looks like it is stretching on the body — proving the 4-way claim visually (not static).
      const push4 = track(ms, FEAT_IN, FEAT_OUT, easeOutCubic);
      const stretch = Math.sin((ms - FEAT_IN) * 0.0016);          // slow ~4s breathing cycle
      const sx = lerp(1.1, 1.24, push4) * (1 + 0.012 * stretch);  // stretch wider on the breath
      const sy = lerp(1.1, 1.24, push4) * (1 - 0.012 * stretch);  // ...narrower vertically (4-way)
      set(featImgRef.current, { transform: `scale(${sx}, ${sy}) translateX(${lerp(0, -34, push4)}px) translateY(${4 * stretch}px)`, opacity: String(track(ms, FEAT_IN, FEAT_IN + 220)) });
      const f1 = track(ms, FEAT_C1_IN, FEAT_C1_IN + 220, easeOutExpo);
      set(featC1Ref.current, { opacity: ms >= FEAT_C1_IN ? "1" : "0", transform: `translateX(${lerp(64, 0, f1)}px)` });
      const f2 = track(ms, FEAT_C2_IN, FEAT_C2_IN + 220, easeOutExpo);
      set(featC2Ref.current, { opacity: ms >= FEAT_C2_IN ? "1" : "0", transform: `translateX(${lerp(64, 0, f2)}px)` });
      const f3 = track(ms, FEAT_C3_IN, FEAT_C3_IN + 220, easeOutExpo);
      set(featC3Ref.current, { opacity: ms >= FEAT_C3_IN ? "1" : "0", transform: `translateX(${lerp(64, 0, f3)}px)` });
    }

    // ════════ BEAT 5 — FABRIC WELL_B (STATIONARY rect) ════════
    {
      const exit5 = track(ms, WELLB_OUT - 120, WELLB_OUT, easeInCubic);
      gate(b5Ref, ms >= WELLB_FRAME_IN && ms < WELLB_OUT, 1 - exit5);
    }
    if (ms >= WELLB_FRAME_IN && ms < WELLB_OUT) {
      // scope card SCALE-POPS in from center (no crawl-up). Settles by 11050 → EXACT/static.
      const fbP = track(ms, WELLB_FRAME_IN, WELLB_FRAME_IN + 200, easeOutExpo);
      set(wellBFrameRef.current, { opacity: String(track(ms, WELLB_FRAME_IN, WELLB_FRAME_IN + 90)), transform: `scale(${lerp(0.9, 1, fbP)})` });
      // subtle push-in on the macro image (frame RECT stays EXACT/stationary) — panel 10
      const wbPush = track(ms, WELLB_FRAME_IN, WELLB_OUT, easeOutCubic);
      set(wellBImgRef.current, { transform: `scaleX(-1) scale(${lerp(1.04, 1.14, wbPush)})` });
      // headline lands ON the cut (top zone never empty)
      const bc1 = track(ms, WELLB_COPY1_IN, WELLB_COPY1_IN + 220, easeOutExpo);
      set(wellBCopy1Ref.current, { opacity: ms >= WELLB_COPY1_IN ? "1" : "0", transform: `translateY(${lerp(-22, 0, bc1)}px)` });
      // spec panel pre-populated right behind the headline — fills the mid void immediately
      const spP = track(ms, WELLB_SPEC_IN, WELLB_SPEC_IN + 260, easeOutExpo);
      set(wellBSpecRef.current, { opacity: ms >= WELLB_SPEC_IN ? "1" : "0", transform: `translateY(${lerp(20, 0, spP)}px)` });
      // camo motion in the measurement band
      const bdrift = ms * 0.04;
      set(wellBCamoRef.current, { backgroundPosition: `${-bdrift}px 0px, ${-bdrift * 0.5 + 9}px 9px` });
      // scrolling 0.2mm measurement ticks loop leftward
      const tickX = ((ms - WELLB_FRAME_IN) * 0.09) % 44;
      set(wellBTicksRef.current, { transform: `translateX(${-tickX}px)` });
      // animated spec bar SWEEP-FILL (panel 5) — staggered L→R, ~620ms per bar, 260ms apart.
      // Spread across the scene so the bars are visibly ANIMATING (not identical static fills).
      const barDur = 620, barGap = 260, barT0 = WELLB_SPEC_IN + 280;
      document.querySelectorAll<HTMLElement>(".spec-fill").forEach((el) => {
        const target = parseFloat(el.dataset.fill || "0");
        const idx = parseInt(el.dataset.stagger || "0", 10);
        const start = barT0 + idx * barGap;
        const bp = track(ms, start, start + barDur, easeOutCubic);
        el.style.width = `${target * 100 * bp}%`;
      });
      // leading-edge glow rides the tip of each sweeping bar
      document.querySelectorAll<HTMLElement>(".spec-glow").forEach((el) => {
        const idx = parseInt(el.dataset.stagger || "0", 10);
        const start = barT0 + idx * barGap;
        const bp = track(ms, start, start + barDur, easeOutCubic);
        // approximate fill width target from sibling — use the same fill values
        const fillTargets = [0.98, 0.86, 0.0];
        const w = (fillTargets[idx] || 0) * 100 * bp;
        el.style.left = `${w}%`;
        el.style.opacity = bp > 0.02 && bp < 0.98 ? "0.9" : "0";
      });
      // COUNT-UP numeric readouts — tick in lockstep with each bar's sweep
      document.querySelectorAll<HTMLElement>(".spec-num").forEach((el) => {
        const idx = parseInt(el.dataset.stagger || "0", 10);
        const start = barT0 + idx * barGap;
        const bp = track(ms, start, start + barDur, easeOutCubic);
        if (el.dataset.kind === "num") {
          const to = parseFloat(el.dataset.to || "0");
          const suffix = el.dataset.suffix || "";
          el.textContent = `${Math.round(to * bp)}${suffix}`;
        } else if (el.dataset.kind === "grade") {
          const grades = (el.dataset.grades || "F").split(",");
          const gi = Math.min(grades.length - 1, Math.floor(bp * grades.length));
          el.textContent = grades[gi];
        }
      });
      // PROOF PEAK — the "0" SEAM COUNT scale-pops + cool-accent glow (panel 16). Brief.
      const pk = track(ms, WELLB_PEAK_IN, WELLB_PEAK_IN + 360, easeInOutCubic);
      const pkScale = pk > 0 && pk < 1 ? 1 + 0.4 * Math.sin(pk * Math.PI) : 1;
      set(wellBPeakRef.current, { transform: `scale(${pkScale})`, color: pk > 0 && pk < 1 ? COOL_ACCENT : WHITE });
      // live measurement readout digits tick subtly (0.18–0.22mm)
      if (wellBReadoutRef.current) {
        const v = 0.20 + 0.018 * Math.sin((ms - WELLB_FRAME_IN) * 0.012);
        wellBReadoutRef.current.textContent = `${v.toFixed(2)}mm`;
      }
      // crosshair scan SWEEP rakes down the scope (cool-accent line)
      const sweepY = ((ms - WELLB_FRAME_IN) * 0.42) % (WELL_B.h + 40);
      set(wellBSweepRef.current, { transform: `translateY(${sweepY}px)`, opacity: String(0.5 + 0.5 * Math.abs(Math.sin((ms - WELLB_FRAME_IN) * 0.004))) });
    }

    // ════════ BEAT 6 — COLORWAY SELECTOR (FIX 3) ════════
    {
      const exit6 = track(ms, CW_OUT, CW_OUT + 160, easeInCubic);
      gate(b6Ref, ms >= CW_IN && ms < CW_OUT + 200, 1 - exit6);
    }
    if (ms >= CW_IN && ms < CW_OUT + 200) {
      // gentle PUNCH-IN on the cut
      const punch6 = track(ms, CW_IN, CW_IN + 200, easeOutExpo);
      set(b6Ref.current, { transform: `scale(${lerp(1.04, 1, punch6)})`, transformOrigin: "50% 42%" });

      // which colorway is SELECTED right now — cycles through all 8 across the beat, then
      // holds on the last so the final frame before the wipe is a settled real product shot.
      const rawSel = ms >= CW_SELECT_START ? Math.floor((ms - CW_SELECT_START) / CW_SELECT_STEP) : -1;
      const selIdx = rawSel < 0 ? -1 : Math.min(7, rawSel);

      // MAIN PREVIEW panel pops in
      const pvP = track(ms, CW_PREVIEW_IN, CW_PREVIEW_IN + 320, easeOutExpo);
      set(cwPreviewWrapRef.current, { opacity: String(track(ms, CW_PREVIEW_IN, CW_PREVIEW_IN + 160)), transform: `scale(${lerp(0.92, 1, pvP)})` });
      // crossfade the stacked real previews — the selected one is visible, others fade out.
      // Before any selection, default to colorway 0 so the preview is never empty.
      const shownIdx = selIdx < 0 ? 0 : selIdx;
      cwPreviewRefs.forEach((r, i) => {
        const on = i === shownIdx;
        // slight ken-burns drift on the active preview so it never reads as a frozen poster
        const kb = on ? 1 + 0.03 * Math.sin((ms - CW_IN) * 0.0016) : 1;
        set(r.current, { opacity: on ? "1" : "0", transform: `scale(${1.04 * kb})` });
      });

      // 8 REAL swatches cascade in, then the SELECTED one gets a bright white ring.
      cwSwatchRefs.forEach((r, i) => {
        const t0 = CW_GRID_IN + i * CW_GRID_STEP;
        const p = track(ms, t0, t0 + 240, easeOutExpo);
        set(r.current, {
          opacity: ms >= t0 ? "1" : "0",
          transform: `translateY(${lerp(36, 0, p)}px) scale(${lerp(0.84, 1, p)})`,
          clipPath: `inset(0 0 ${lerp(100, 0, p)}% 0)`,
        });
      });
      cwSwatchRingRefs.forEach((r, i) => {
        const lit = i === selIdx;
        set(r.current, { opacity: lit ? "1" : "0", transform: `scale(${lit ? 1 : 0.96})` });
      });
      // colour blooms ONLY on the selected swatch (panel 4): the active img is re-lit + fully
      // saturated, every other stays desaturated-dim so the row never competes with the hero.
      cwSwatchImgRefs.forEach((r, i) => {
        const lit = i === selIdx;
        set(r.current, { filter: lit ? "contrast(1.08) brightness(1.0) saturate(1.0)" : "contrast(1.05) brightness(0.6) saturate(0.4)" });
      });

      // selected colorway NAME + sub + index — snap-swap on each selection with a micro pop
      const sinceSel = selIdx >= 0 ? (ms - (CW_SELECT_START + selIdx * CW_SELECT_STEP)) : 0;
      const namePop = selIdx >= 0 ? clamp(1 - sinceSel / 150) : 0;     // brief lift each swap
      const cw = COLORWAYS[shownIdx];
      if (cwNameRef.current) {
        cwNameRef.current.textContent = cw.name;
        set(cwNameRef.current, { opacity: ms >= CW_SELECT_START - 40 ? "1" : "0", transform: `translateX(${lerp(0, -10, namePop)}px)` });
      }
      if (cwSubRef.current) cwSubRef.current.textContent = cw.sub;
      if (cwIndexRef.current) cwIndexRef.current.textContent = `${String(shownIdx + 1).padStart(2, "0")} / 08`;

      // header lands on the cut
      const lP = track(ms, CW_LABEL_IN, CW_LABEL_IN + 240, easeOutExpo);
      set(cwLabelRef.current, { opacity: ms >= CW_LABEL_IN ? "1" : "0", transform: `translateY(${lerp(28, 0, lP)}px)` });
      const fP = track(ms, CW_LABEL_IN + 140, CW_LABEL_IN + 380, easeOutExpo);
      set(cwFindRef.current, { opacity: ms >= CW_LABEL_IN + 140 ? "1" : "0", transform: `translateY(${lerp(24, 0, fP)}px)` });
      // camo drift behind
      const cwd = (ms - CW_IN) * 0.03;
      set(cwCamoRef.current, { backgroundPosition: `${-cwd}px ${-cwd * 0.6}px, ${-cwd * 0.5 + 9}px ${-cwd * 0.3 + 9}px` });
    }

    // ════════ BEAT 7 — CTA / OUTRO (b05 style — FIX 4) ════════
    gate(b7Ref, ms >= CTA_IN, 1);
    if (ms >= CTA_IN) {
      // fabric-texture bg slowly drifts + scales + breathes a luminance bloom (b05 item 15)
      const drift = track(ms, CTA_IN, 18000);
      const bloom = 0.5 + 0.5 * Math.sin((ms - CTA_IN) / 700);
      set(ctaBgRef.current, {
        transform: `scale(${lerp(1.04, 1.12, drift)}) translateY(${lerp(0, -22, drift)}px)`,
        opacity: String(0.48 + bloom * 0.12),
      });
      // slower parallax model ghost drifts the OPPOSITE way for depth (panel 11 — moving last-frame b-roll)
      set(ctaBg2Ref.current, {
        transform: `scale(${lerp(1.12, 1.04, drift)}) translateY(${lerp(-10, 14, drift)}px)`,
      });
      // geo-camo motif drifts continuously so the close never reads as a flat still
      const cdr = (ms - CTA_IN) * 0.035;
      set(ctaCamoRef.current, { backgroundPosition: `${-cdr}px ${-cdr * 0.6}px, ${-cdr * 0.5 + 9}px ${-cdr * 0.3 + 9}px` });
      // REAL logo lockup: punch in slightly oversized (1.16) and settle with overshoot (b05 item 7)
      const settle = track(ms, CTA_FIN_IN, CTA_FIN_IN + 420, (t) => outBack(t, 1.6));
      set(ctaLogoRef.current, {
        opacity: String(track(ms, CTA_FIN_IN, CTA_FIN_IN + 220)),
        transform: `scale(${lerp(1.16, 1, settle)})`,
      });
      // SHOP GEO SEAMLESS — line-by-line reveal + slide (b05 item 5)
      const tSlide = track(ms, CTA_SHOP_IN, CTA_SHOP_IN + 400, (t) => outBack(t, 1.3));
      const tReveal = track(ms, CTA_SHOP_IN, CTA_SHOP_IN + 360, easeOutCubic);
      set(ctaTitleRef.current, {
        opacity: String(track(ms, CTA_SHOP_IN, CTA_SHOP_IN + 200)),
        transform: `translateY(${lerp(34, 0, tSlide)}px)`,
        clipPath: `inset(0 0 ${lerp(102, 0, tReveal)}% 0)`,
      });
      // SHOP NOW pill — hard scale-POP (overshoot) then a recurring breathing pulse (b05 item 16)
      const btP = track(ms, CTA_BTN_IN, CTA_BTN_IN + 410, (t) => outBack(t, 2.6));
      const btPulse = 1 + 0.022 * Math.sin((ms - CTA_BTN_IN - 410) / 240);
      set(ctaBtnRef.current, {
        opacity: ms >= CTA_BTN_IN ? "1" : "0",
        transform: `scale(${ms > CTA_BTN_IN + 410 ? btPulse : lerp(0.7, 1, btP)})`,
      });
      // 1-frame white flash punch the instant the pill lands
      const f = Math.max(0, 1 - Math.abs(ms - (CTA_BTN_IN + 130)) / 90);
      set(ctaFlashRef.current, { opacity: String(f * 0.85) });
      // specular sheen sweeps the white pill on entry, then once more on the final beat (b05 item 7)
      const sEntry = track(ms, CTA_BTN_IN + 70, CTA_BTN_IN + 470, easeOutCubic);
      const s2 = track(ms, 17850, 18000, easeOutCubic);
      const sx = ms < 17820 ? lerp(-160, 260, sEntry) : lerp(-160, 260, s2);
      set(ctaBtnSheenRef.current, { transform: `translateX(${sx}%) skewX(-18deg)` });
      // FROM $36 anchor + GYMSHARK.COM
      const prP = track(ms, CTA_PRICE_IN, CTA_PRICE_IN + 340, (t) => outBack(t, 1.6));
      set(ctaPriceRef.current, { opacity: String(track(ms, CTA_PRICE_IN, CTA_PRICE_IN + 200)), transform: `translateY(${lerp(14, 0, prP)}px)` });
      const urlIn = track(ms, CTA_URL_IN, CTA_URL_IN + 340, easeOutCubic);
      set(ctaUrlRef.current, { opacity: String(track(ms, CTA_URL_IN, CTA_URL_IN + 200) * 0.9), transform: `translateY(${lerp(12, 0, urlIn)}px)` });
    }

    // ════════════════════════════════════════════════════════════════════════════
    // SIX UNIQUE "GEO-CAMO MECHANICS" TRANSITIONS — authored per-cut. The engineered
    // fabric / hardware does the work at every cut. No two share a move or direction.
    //   T1 1250  Logo→Hero      HALFTONE DOT-DISSOLVE  (camo dots scatter, reshuffle)
    //   T2 4350  Hero→WellA     GEAR-MESH SLAB SHUTTER  (interlocking angular slabs mesh)
    //   T3 8500  WellA→Feature  SPEC-PANEL SHATTER       (UI panels snap apart, reassemble)
    //   T4 10850 Feature→WellB  BLUEPRINT GRID DRAW       (measurement grid draws scene in)
    //   T5 14000 WellB→Colorway RACK SPLIT (the liked one) (frame racks into the 8-tile grid)
    //   T6 16900 Colorway→CTA   HALFTONE CONVERGE          (dots collapse inward to the mark)
    // Helper: each transition reveals its overlay only inside its window; cleared otherwise.
    const hideTx = (el: HTMLElement | null) => { if (el) { el.style.opacity = "0"; el.style.visibility = "hidden"; } };
    // clear ALL transition overlays first; each block below re-enables its own.
    [tx1Ref, tx2Ref, tx3Ref, tx4Ref, tx5Ref, tx6Ref].forEach((r) => hideTx(r.current));

    // ── T1 · HALFTONE DOT-DISSOLVE (1250) — a solid camo-dot plane covering the hook
    // SCATTERS apart (two dense dot fields drift on opposite vectors + bloom) while a
    // circular APERTURE opens at center, dissolving the hook to uncover the hero. ──
    {
      const t0 = HOOK_OUT - 220, t1 = HOOK_OUT + 240;
      if (ms >= t0 && ms <= t1) {
        const p = clamp((ms - t0) / (t1 - t0));
        const e = easeInOutCubic(p);
        set(tx1Ref.current, { opacity: "1", visibility: "visible" });
        // iris: solid plane with a GROWING transparent hole at center → reveals hero beneath.
        // (radial-gradient mask: transparent core, opaque ring — the hole grows from 0→full)
        const hole = lerp(0, 78, e);            // % of frame the open aperture covers
        set(tx1IrisRef.current, {
          background: NEAR_BLACK,
          maskImage: `radial-gradient(circle at 50% 42%, transparent ${hole}%, #000 ${hole + 6}%)`,
          webkitMaskImage: `radial-gradient(circle at 50% 42%, transparent ${hole}%, #000 ${hole + 6}%)`,
        });
        // dense dot field A scatters up-left + blooms (dissolving camo)
        set(tx1aRef.current, {
          transform: `translate(${-e * 140}px, ${-e * 100}px) scale(${1 + e * 0.7})`,
          opacity: String(1 - e),
          maskImage: `radial-gradient(circle at 50% 42%, transparent ${hole}%, #000 ${hole + 6}%)`,
          webkitMaskImage: `radial-gradient(circle at 50% 42%, transparent ${hole}%, #000 ${hole + 6}%)`,
        });
        // dense dot field B scatters down-right + blooms, opposite vector (reshuffle)
        set(tx1bRef.current, {
          transform: `translate(${e * 140}px, ${e * 100}px) scale(${1 + e * 0.7})`,
          opacity: String(1 - e),
          maskImage: `radial-gradient(circle at 50% 42%, transparent ${hole}%, #000 ${hole + 6}%)`,
          webkitMaskImage: `radial-gradient(circle at 50% 42%, transparent ${hole}%, #000 ${hole + 6}%)`,
        });
      }
    }

    // ── T2 · GEAR-MESH SLAB SHUTTER (4350) — the HERO's only effect. Angular camo
    // slabs from top + bottom INTERLOCK like meshing gear teeth (offset triangular
    // edges), close the frame, then counter-rotate apart to reveal WELL_A. ──
    {
      const t0 = HERO_OUT - 170, t1 = HERO_OUT + 250;
      if (ms >= t0 && ms <= t1) {
        const p = clamp((ms - t0) / (t1 - t0));
        set(tx2Ref.current, { opacity: "1", visibility: "visible" });
        // close (0→0.5) then open (0.5→1) — the teeth mesh fully at mid then withdraw
        const close = easeOutCubic(clamp(p / 0.5));
        const open = easeInCubic(clamp((p - 0.5) / 0.5));
        const meshed = close - open;                       // 1 at the meshed midpoint
        // top slab descends, bottom slab rises — they overlap (mesh) at center
        set(tx2TopRef.current, { transform: `translateY(${lerp(-1020, 0, meshed)}px)` });
        set(tx2BotRef.current, { transform: `translateY(${lerp(1020, 0, meshed)}px)` });
        // a thin white seam glows where the teeth mesh
        set(tx2SeamRef.current, { opacity: String(meshed > 0.6 ? (meshed - 0.6) / 0.4 : 0), transform: `scaleX(${0.4 + meshed * 0.6})` });
      }
    }

    // ── T3 · SPEC-PANEL SHATTER (8500) — WELL_A's UI/spec chrome FRACTURES into
    // rectangular panels that fly out on staggered vectors (snap apart), and the
    // pieces reassemble as the feature scene's callout layout. ──
    {
      const t0 = WELLA_OUT - 160, t1 = WELLA_OUT + 250;
      if (ms >= t0 && ms <= t1) {
        const p = clamp((ms - t0) / (t1 - t0));
        const e = easeInOutCubic(p);
        set(tx3Ref.current, { opacity: "1", visibility: "visible" });
        // 6 panels: first half (0→0.55) snap APART outward; second half (0.45→1) the
        // incoming panels snap IN from the opposite edges (reassemble). Per-panel vectors.
        document.querySelectorAll<HTMLElement>(".tx3-panel").forEach((el) => {
          const idx = parseInt(el.dataset.idx || "0", 10);
          const dirX = (idx % 3 - 1);                       // -1,0,1 columns
          const dirY = (idx < 3 ? -1 : 1);                  // top / bottom rows
          const stag = idx * 0.05;
          const out = easeOutCubic(clamp((p - stag) / 0.5));   // outgoing fly-apart
          const x = dirX * 760 * out;
          const y = dirY * 620 * out;
          const rot = (dirX || 1) * 8 * out;
          el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
          el.style.opacity = String(1 - out);
        });
      }
    }

    // ── T4 · BLUEPRINT GRID DRAW (10850) — a technical drafting grid + measurement
    // crosshairs DRAW IN (lines extend from the edges) across the frame, scan once,
    // then retract — the incoming WELL_B engineered scene is "drafted" into existence. ──
    {
      const t0 = FEAT_OUT - 160, t1 = FEAT_OUT + 270;
      if (ms >= t0 && ms <= t1) {
        const p = clamp((ms - t0) / (t1 - t0));
        set(tx4Ref.current, { opacity: "1", visibility: "visible" });
        // grid lines DRAW (0→0.5) then HOLD+fade (0.5→1)
        const draw = easeOutCubic(clamp(p / 0.5));
        const fade = clamp((p - 0.55) / 0.45);
        set(tx4Ref.current, { opacity: String(1 - fade) });
        // horizontal rule sweeps down (the drafting scan), vertical rule sweeps right
        set(tx4HRef.current, { transform: `scaleX(${draw})`, opacity: String(0.9 - fade * 0.9) });
        set(tx4VRef.current, { transform: `scaleY(${draw})`, opacity: String(0.9 - fade * 0.9) });
        // a measurement crosshair travels diagonally as the grid resolves
        set(tx4CrossRef.current, { left: `${lerp(8, 78, draw)}%`, top: `${lerp(12, 80, draw)}%`, opacity: String(draw > 0.05 ? 1 - fade : 0) });
        // grid field opacity peaks at draw, eases off
        set(tx4GridRef.current, { opacity: String(lerp(0, 0.85, draw) * (1 - fade)) });
      }
    }

    // ── T5 · RACK SPLIT (14000) — the LIKED transition, elevated + kept DISTINCT.
    // The engineered frame SPLITS into vertical camo slabs that rack sideways (with
    // momentum + offset stagger) and re-rack into the 8-colorway tile grid. A carry-
    // through: the slabs literally become the swatch columns. ──
    {
      const t0 = WELLB_OUT - 180, t1 = WELLB_OUT + 280;
      if (ms >= t0 && ms <= t1) {
        const p = clamp((ms - t0) / (t1 - t0));
        set(tx5Ref.current, { opacity: "1", visibility: "visible" });
        // 6 vertical slabs rack offscreen alternating up/down with stagger (momentum)
        document.querySelectorAll<HTMLElement>(".tx5-slab").forEach((el) => {
          const idx = parseInt(el.dataset.idx || "0", 10);
          const stag = idx * 0.06;
          const e = easeInCubic(clamp((p - stag) / 0.7));
          const dir = idx % 2 ? 1 : -1;
          el.style.transform = `translateY(${dir * 2000 * e}px) skewX(-6deg)`;
          el.style.opacity = String(p > 0.85 ? 0 : 1);
        });
      }
    }

    // ── T6 · HALFTONE CONVERGE (16900) — OLIPOP-style "everything merges into one":
    // the colorway tiles + camo dots COLLAPSE inward to a single point at center,
    // which blooms into the CTA mark. Iris closes to a point then opens on the CTA. ──
    {
      const t0 = CW_OUT - 200, t1 = CW_OUT + 240;
      if (ms >= t0 && ms <= t1) {
        const p = clamp((ms - t0) / (t1 - t0));
        set(tx6Ref.current, { opacity: "1", visibility: "visible" });
        // converge (0→0.55): tiles rush to center & shrink. bloom (0.55→1): white flash eases out.
        const conv = easeInCubic(clamp(p / 0.55));
        document.querySelectorAll<HTMLElement>(".tx6-tile").forEach((el) => {
          const cx = parseFloat(el.dataset.cx || "0");      // tile center offset x (px from center)
          const cy = parseFloat(el.dataset.cy || "0");
          el.style.transform = `translate(${-cx * conv}px, ${-cy * conv}px) scale(${1 - conv})`;
          el.style.opacity = String(1 - conv);
        });
        // center bloom: a tight BRIGHT core that flashes hard as everything lands, then eases out
        const bloom = clamp((p - 0.45) / 0.18) * (1 - clamp((p - 0.62) / 0.32));
        set(tx6CoreRef.current, { opacity: String(bloom * 1.0), transform: `scale(${0.3 + bloom * 2.2})` });
      }
    }

    // grain breathes slightly
    set(grainRef.current, { opacity: String(0.10 + 0.03 * Math.sin(ms * 0.012)) });
  }, []);

  // ── geo-camo halftone background (CSS dot grid, two layers offset = camo feel) ──
  const camoBg: React.CSSProperties = {
    backgroundImage: `radial-gradient(circle, ${GREY_LINE} 1.4px, transparent 1.6px), radial-gradient(circle, ${CHARCOAL_2} 1.4px, transparent 1.6px)`,
    backgroundSize: "18px 18px, 18px 18px",
    backgroundPosition: "0 0, 9px 9px",
  };

  // ── HARD-EDGED faceted geo-camo slab (for kinetic reveal + transition wipes). Angular,
  // coded, near-black with a faint cool-steel rim so it reads as the geo pattern in motion,
  // not a soft dissolve. Used by the hero entry mask and inter-scene faceted wipes. ──
  const facetedCamo: React.CSSProperties = {
    backgroundColor: BLACK,
    backgroundImage:
      `linear-gradient(135deg, #141414 0 25%, transparent 25% 50%, #0c0c0c 50% 75%, transparent 75%),` +
      `linear-gradient(45deg, #0e0e0e 0 25%, transparent 25% 50%, #161616 50% 75%, transparent 75%),` +
      `radial-gradient(circle, rgba(120,140,150,0.10) 1px, transparent 1.6px)`,
    backgroundSize: "180px 180px, 240px 240px, 9px 9px",
  };

  // Gymshark FIN — the OFFICIAL single shark-fin silhouette: ONE solid, pointed blade
  // that leans forward (to the right), with a sharp tip top-right, a curved concave
  // trailing (back) edge sweeping down-left, and a swept base foot. NOT two slashes.
  // ONE canonical solid-white geometry used EVERYWHERE (splash, eyebrows, swatch tags,
  // CTA) so the brand mark is identical and unmistakable. `pathRef` animates fill-opacity
  // only on the splash slam — never a thin outline / ghost variant.
  //
  // viewBox 0..120. Tip ≈ (96,12). Leading edge falls down-right to base. Trailing edge
  // is a single CONCAVE curve from tip down to the rear foot — the signature fin scoop.
  // SINGLE solid shark-fin (verified by headless-Chrome rasterization). Reads as a fin at
  // every size from the 1.9x splash down to the 0.2x swatch tags.
  //  - Sharp tip top-right (forward lean)
  //  - Right (leading) edge: near-straight, falls to a rounded base foot
  //  - Base: short flat foot along the bottom
  //  - Left (trailing) edge: ONE strong CONCAVE belly scoop back up to the tip — the
  //    hollow curve that makes it unmistakably a shark fin.
  const FIN_PATH =
    "M99 16 Q101 14 101 19 " +   // sharp tip (top-right), tiny crest
    "L84 99 Q83 103 78 103 " +   // leading edge down to front base foot (rounded)
    "L33 103 Q27 103 30 97 " +   // flat base to rear base foot (rounded)
    "C49 73 57 46 94 19 " +      // CONCAVE belly scoops up to the tip
    "Q96 16 99 16 Z";            // close at the tip
  // FIN — the AUTHENTIC Gymshark mark, cropped from the official gymshark-logo.png lockup
  // (panel 8). ONE real asset used at every fin instance (well tags, swatch lockup, CTA) so
  // every fin is pixel-identical to the brand mark — no hand-drawn approximation. The native
  // fin glyph is ~191×142; we render at 120·size wide to match the prior visual scale. White
  // by default; `color` other than white tints via a brightness/sepia filter (rarely used).
  const Fin = ({ size = 1, color = WHITE }: { size?: number; color?: string; pathRef?: React.RefObject<SVGPathElement> }) => {
    const w = 132 * size;
    const tint =
      color === WHITE || color === "#FFFFFF"
        ? "none"
        : // approximate non-white tints (only dim greys are ever passed): drop brightness
          `brightness(${color === "rgba(255,255,255,0.92)" ? 0.96 : 0.6})`;
    return (
      <img
        src={GYMSHARK_FIN}
        style={{ width: w, height: "auto", display: "block", filter: tint, opacity: color.startsWith("rgba") ? Number(color.split(",")[3]?.replace(")", "") || 1) : 1 }}
      />
    );
  };

  // 8 colorways rendered as DARK-MONOCHROME tonal swatches (charcoal→near-white range).
  // No product photos = no old-logo glyph, no washed AI render, no white e-comm tiles.
  // Each swatch = a CSS geo-camo fabric tile graded into a single graphite tone.
  // Tonal ramp widened at the TOP end so the Onyx→Bone greyscale has a clear final step
  // (Smoke and Bone were sitting too close). BONE lifted to a near-bone off-white.
  // PURE COOL GREYSCALE ramp — every tone is dead-neutral (R=G=B), edge to edge. SMOKE and
  // BONE previously crept warm under the corner light; both neutralized to strict grey.
  // Dark quartile tones SPREAD APART (panel 9) so Onyx→Gunmetal are clearly stepped, not a
  // near-black mush. Each tone carries an explicit luminance value (lum) printed on the chip
  // so the "EIGHT TONES" claim is legible even where the greys are close.
  const cwTones = [
    { name: "ONYX",    fabric: "#161616", chip: "#0C0C0C", lum: "06", light: false },
    { name: "GRAPHITE",fabric: "#2A2A2A", chip: "#1A1A1A", lum: "14", light: false },
    { name: "SLATE",   fabric: "#3C3C3C", chip: "#262626", lum: "20", light: false },
    { name: "GUNMETAL",fabric: "#525252", chip: "#363636", lum: "29", light: false },
    { name: "ASH",     fabric: "#6A6A6A", chip: "#474747", lum: "39", light: false },
    { name: "STEEL",   fabric: "#868686", chip: "#5C5C5C", lum: "50", light: false },
    { name: "SMOKE",   fabric: "#A6A6A6", chip: "#787878", lum: "64", light: false },
    { name: "BONE",    fabric: "#CECECE", chip: "#AFAFAF", lum: "80", light: true  },
  ];

  // A CSS GEO-CAMO fabric tile: layered angular blotches + halftone knit dots, graded
  // to one graphite tone. Reads as the seamless geo-camo tee fabric, dark + premium.
  const CamoSwatch = ({ tone }: { tone: { name: string; fabric: string; chip: string; lum?: string; light?: boolean } }) => (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: tone.chip }}>
      {/* TOP RIM-LIGHT (panel 9): a thin bright edge along the top so adjacent dark tones
          separate even when their base greys are close. */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 70, background: "linear-gradient(180deg, rgba(255,255,255,0.10), transparent)" }} />
      {/* angular geo-camo blotches */}
      <div style={{ position: "absolute", inset: -10,
        backgroundColor: tone.fabric,
        backgroundImage:
          `linear-gradient(135deg, ${tone.fabric} 25%, transparent 25%),` +
          `linear-gradient(225deg, ${tone.fabric} 25%, transparent 25%),` +
          `linear-gradient(45deg, ${tone.chip} 25%, transparent 25%),` +
          `linear-gradient(315deg, ${tone.chip} 25%, ${tone.fabric} 25%)`,
        backgroundSize: "46px 46px, 46px 46px, 46px 46px, 46px 46px",
        backgroundPosition: "0 0, 23px 0, 23px -23px, 0 23px",
        opacity: 0.9 }} />
      {/* seamless-knit halftone dots */}
      <div style={{ position: "absolute", inset: 0,
        backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.32) 1px, transparent 1.4px)`,
        backgroundSize: "8px 8px", mixBlendMode: "multiply", opacity: 0.7 }} />
      {/* low-key contrast + grain tint to match gritty hero grade */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%, transparent 35%, rgba(0,0,0,0.55) 95%)" }} />
    </div>
  );

  return (
    <Timegroup
      mode="fixed"
      duration={`${DURATION_MS}ms`}
      onFrame={handleFrame as any}
      workbench
      className="w-[1080px] h-[1920px] relative overflow-hidden"
      style={{ background: NEAR_BLACK }}
    >
      {/* base dark floor */}
      <div style={{ position: "absolute", inset: 0, background: NEAR_BLACK, zIndex: 0 }} />

      {/* ══════════ BEAT 1 — MINIMALIST HOOK (FIX 1 + 2) ══════════
          A calm, premium opener on near-black: a faint geo-camo drift, the REAL GYMSHARK
          logo (white wordmark + fin lockup) revealed by ONE confident left→right wipe, and
          one quiet kicker line. No rapid cuts, no shine/flash, no busy streaks. This is an
          OPAQUE card (own near-black bg) so the hook is clean — the product owns 1250ms+. */}
      <div ref={b1Ref} style={{ position: "absolute", inset: 0, zIndex: 40, background: NEAR_BLACK }}>
        {/* faint geo-camo drift — restrained, sets brand texture without busy-ness */}
        <div ref={hookCamoRef} style={{ position: "absolute", inset: -40, ...camoBg, opacity: 0 }} />
        {/* soft center vignette so the logo sits in a confident pool of light */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 40% at 50% 46%, rgba(40,40,44,0.5) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 80% at 50% 50%, transparent 50%, rgba(0,0,0,0.6) 100%)" }} />

        {/* CENTERED REAL LOGO — revealed by a single sharp wipe (the one confident move) */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div ref={hookLogoWrapRef} style={{ opacity: 0, position: "relative", width: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* the real white GYMSHARK wordmark + fin lockup, revealed left→right by a clipPath
                inset CONTAINED to the lockup box — no slab can ever sit beside the fin (panel 1). */}
            <div ref={hookLogoMaskRef} style={{ width: 700, clipPath: "inset(0 100% 0 0)" }}>
              <img src={GYMSHARK_LOGO} style={{ width: 700, height: "auto", display: "block" }} />
            </div>
            {/* hairline leading edge of the wipe — a single crisp white tick riding the front */}
            <div ref={hookWipeEdgeRef} style={{ position: "absolute", top: "8%", bottom: "8%", left: "0%", width: 3, background: "rgba(255,255,255,0.9)", opacity: 0, pointerEvents: "none" }} />
          </div>
          {/* one quiet kicker line under the logo — calm, single line */}
          <div ref={hookLineRef} style={{ opacity: 0, marginTop: 34, display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 40, height: 2, background: "rgba(255,255,255,0.4)" }} />
            <span style={{ color: OFF_WHITE, fontFamily: HEAVY, fontWeight: 800, fontSize: 26, letterSpacing: 10 }}>GEO SEAMLESS</span>
            <div style={{ width: 40, height: 2, background: "rgba(255,255,255,0.4)" }} />
          </div>
        </div>
      </div>

      {/* ══════════ BEAT 2 — PRODUCT HERO (below the hook overlay; active from frame 0) ══════════ */}
      <div ref={b2Ref} style={{ position: "absolute", inset: 0, zIndex: 30, background: NEAR_BLACK, opacity: 0, visibility: "hidden" }}>
        {/* graded model image — torso KEY-LIT so Geo Camo reads, bg kept engineered-dark */}
        <div ref={heroImgRef} style={{ position: "absolute", inset: 0, transformOrigin: "50% 38%" }}>
          <img src={MODEL_A} style={{ position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)", width: 1080, height: 1920, objectFit: "cover", objectPosition: "50% 24%", filter: "grayscale(0.45) brightness(0.92) contrast(1.18)" }} />
          {/* KEY/RIM: warm-white key glow ON THE TORSO only — lifts the camo ~1.5 stops locally */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 42% 26% at 50% 40%, rgba(255,255,255,0.30) 0%, transparent 72%)", mixBlendMode: "screen" }} />
          {/* RE-DARKEN the studio bg → engineered dark, leaving the lit torso readable */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 44% at 50% 40%, transparent 42%, rgba(8,8,8,0.97) 88%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,8,8,0.62) 0%, transparent 30%, rgba(8,8,8,0.2) 58%, rgba(8,8,8,0.96) 100%)" }} />
          {/* (chest puck + stamp removed — the footage already reads as Gymshark camo; the
              feathered patch read as a smudge) */}
        </div>
        {/* FIX B — faceted reveal mask + light sweep REMOVED. The hero presents clean. */}
        {/* bottom title block — balanced FULL-WIDTH bar. GEO / SEAMLESS stacked tight
            (leading 0.86), T-SHIRT kicker pulled DIRECTLY under SEAMLESS on the same left
            edge, $36 baseline-aligned to the kicker. Hairline rule spans the band so weight
            is no longer dumped split bottom-left/bottom-right with dead air between. */}
        <div style={{ position: "absolute", left: 64, bottom: 130, right: 64 }}>
          {/* top hairline rule of the band */}
          <div style={{ width: "100%", height: 2, background: "rgba(255,255,255,0.28)", marginBottom: 24 }} />
          <div ref={heroTitleRef} style={{ opacity: 0, color: WHITE, fontFamily: DISPLAY, fontSize: 110, lineHeight: 0.86, letterSpacing: 0 }}>GEO<br />SEAMLESS</div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 18 }}>
            <div ref={heroSubRef} style={{ opacity: 0, color: OFF_WHITE, fontFamily: HEAVY, fontWeight: 900, fontSize: 38, letterSpacing: 10 }}>T-SHIRT</div>
            {/* $36 — dark chip in the STRICT WHITE corner-bracket language (panel 13): no cyan
                rule, no cool glow. Hard white corner brackets match the GYMSHARK.COM CTA + the
                FIBER SCOPE HUD so there is ONE consistent white-on-black accent system. */}
            {/* $36 chip — OPTICALLY CENTERED (panel 11): flex-centered box with equalized padding,
                value nudged up to sit on the optical center, and four IDENTICAL corner ticks so the
                chip reads machined like the spec-sheet frames. */}
            <div ref={heroPriceRef} style={{ opacity: 0, transformOrigin: "100% 100%", position: "relative", width: 132, height: 84, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,10,10,0.6)", border: "2px solid rgba(255,255,255,0.5)" }}>
              <span style={{ color: WHITE, fontFamily: DISPLAY, fontSize: 52, lineHeight: 1, display: "block", transform: "translateY(-3px)" }}>$36</span>
              {[[0,0],[1,0],[0,1],[1,1]].map((c, i) => (
                <div key={i} style={{ position: "absolute", [c[0] ? "right" : "left"]: -3, [c[1] ? "bottom" : "top"]: -3, width: 18, height: 18, borderTop: c[1] ? "none" : `4px solid ${WHITE}`, borderBottom: c[1] ? `4px solid ${WHITE}` : "none", borderLeft: c[0] ? "none" : `4px solid ${WHITE}`, borderRight: c[0] ? `4px solid ${WHITE}` : "none" } as React.CSSProperties} />
              ))}
            </div>
          </div>
        </div>
        {/* FIX B — 1-frame price flash REMOVED. */}
      </div>

      {/* ══════════ BEAT 3 — ATHLETE WELL_A ══════════ */}
      <div ref={b3Ref} style={{ position: "absolute", inset: 0, zIndex: 30, background: NEAR_BLACK, opacity: 0, visibility: "hidden" }}>
        {/* ambient camo texture behind */}
        <div style={{ position: "absolute", inset: 0, ...camoBg, opacity: 0.16 }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 40% 45%, transparent 30%, rgba(0,0,0,0.7) 90%)" }} />
        {/* SEPARATION GLOW behind the well shoulders — lifts the subject off the black so the
            on-garment camo reads, and kills the dead-black surround (well stays EXACT). */}
        <div style={{ position: "absolute", left: WELL_A.x - 120, top: WELL_A.y - 60, width: WELL_A.w + 240, height: WELL_A.h * 0.6, background: "radial-gradient(ellipse at 50% 30%, rgba(120,120,120,0.30) 0%, transparent 70%)" }} />
        {/* RIGHT-GUTTER chrome stack (panel 13): the right dead column (x 860→1080) now carries a
            confident hairline + tick scale + rotated index + a frame-count readout so NO empty
            black band flanks the well. (Well stays EXACT/stationary — this lives in the gutter.) */}
        <div style={{ position: "absolute", right: 46, top: WELL_A.y, height: WELL_A.h, width: 2, background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.28) 18%, rgba(255,255,255,0.28) 82%, transparent)" }} />
        {/* tick scale running down the right hairline — SHORTENED so it stops well ABOVE the
            60·FPS spec tag (panel 13: the FPS label no longer crosses a rule). */}
        <div style={{ position: "absolute", right: 30, top: WELL_A.y + 40, bottom: 1920 - (WELL_A.y + WELL_A.h) + 230, display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end" }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{ width: i % 2 ? 10 : 22, height: 2, background: i % 2 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.7)" }} />
          ))}
        </div>
        {/* rotated index label up the far-right spine */}
        <div style={{ position: "absolute", right: 62, top: WELL_A.y + 70, transform: "rotate(90deg)", transformOrigin: "right top", whiteSpace: "nowrap", color: "rgba(255,255,255,0.5)", fontFamily: HEAVY, fontWeight: 800, fontSize: 16, letterSpacing: 6 }}>TRAINING · 4K</div>
        {/* frame-count spec tag pinned to the right gutter bottom (panel 13): '60' big, 'FPS' set
            in tracked small grey BENEATH it with clear air + its own underscore tick — no longer
            overlapping the tick scale, so it scans as an intentional spec tag like 4-WAY STRETCH. */}
        <div style={{ position: "absolute", right: 24, top: WELL_A.y + WELL_A.h - 112, textAlign: "right" }}>
          <div style={{ color: WHITE, fontFamily: DISPLAY, fontSize: 40, lineHeight: 1 }}>60</div>
          <div style={{ width: 30, height: 2, background: "rgba(255,255,255,0.45)", marginLeft: "auto", marginTop: 8, marginBottom: 7 }} />
          <div style={{ color: GREY_MID, fontFamily: HEAVY, fontWeight: 800, fontSize: 13, letterSpacing: 5 }}>FPS</div>
        </div>
        {/* LEFT-GUTTER spec band (panel 17/10): the busiest moving scene's bare left third now
            carries a confident vertical hairline + rotated brand stamp + a floating spec tag so
            the 9:16 frame fills edge-to-edge and the well stops reading as a floating inset.
            (The well itself stays EXACT/stationary — this lives entirely in the gutter to its left.) */}
        <div ref={wellAStatRef} style={{ position: "absolute", left: 24, top: WELL_A.y, height: WELL_A.h, width: 150, opacity: 0 }}>
          {/* top tag — SMALLER fin (panel 3) + FW·26, pinned to the very top of the gutter */}
          <div style={{ position: "absolute", top: 0, left: 0, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
            <Fin size={0.26} color="rgba(255,255,255,0.92)" />
            <div style={{ color: COOL_ACCENT_DIM, fontFamily: HEAVY, fontWeight: 900, fontSize: 15, letterSpacing: 4 }}>FW · 26</div>
          </div>
          {/* rotated brand stamp — NUDGED DOWN into a clamped mid-low slot (panels 3 & 12) so it
              clears the fin + FW·26 by a clean margin. Origin set to the slot top so the rail
              grows DOWN, never up into the logo. Tightened tracking so it fits the gutter. */}
          <div style={{ position: "absolute", top: 230, left: 14, transform: "rotate(90deg)", transformOrigin: "left top", whiteSpace: "nowrap", color: "rgba(255,255,255,0.5)", fontFamily: HEAVY, fontWeight: 800, fontSize: 17, letterSpacing: 6 }}>GEO SEAMLESS · PERFORMANCE</div>
          {/* bottom spec chip — a floating data tag, bracket framed, pinned to gutter bottom */}
          <div style={{ position: "absolute", bottom: 0, left: 0, padding: "10px 14px", border: "2px solid rgba(255,255,255,0.45)" }}>
            <div style={{ color: WHITE, fontFamily: DISPLAY, fontSize: 30, lineHeight: 1 }}>4-WAY</div>
            <div style={{ color: GREY_MID, fontFamily: HEAVY, fontWeight: 700, fontSize: 13, letterSpacing: 3, marginTop: 2 }}>STRETCH</div>
            <div style={{ position: "absolute", left: -2, top: -2, width: 4, height: 12, background: COOL_ACCENT_DIM }} />
          </div>
        </div>

        {/* WELL_A frame — EXACT rect 220,540,640,1060 r24, STATIONARY.
            NO device bezel, NO GYMSHARK/LIVE chrome, NO rounded inner bevel — the athlete
            footage reads FULL-BLEED in the well, framed only by sharp BRACKET CORNERS, for
            the gritty-premium editorial register (not a creator template). */}
        <div ref={wellAFrameRef} style={{ position: "absolute", left: WELL_A.x, top: WELL_A.y, width: WELL_A.w, height: WELL_A.h, opacity: 0, overflow: "hidden", borderRadius: 4 }}>
          {/* (soft drop-shadow halo REMOVED — panel 7. It made the well read as a floating
              letterboxed card. The crisp hairline edge + hard brackets are the only frame.) */}
          {/* PRODUCT-CORRECT WELL_A (panel 5): the old poster showed a baggy GRAPHIC TEE, not the
              Geo Seamless product, and read washed/phone-grade. Swapped to MODEL_0030 — a clean
              studio shot of the model ACTUALLY wearing the black Geo Seamless camo tee (fin on
              chest, fitted), framed on the torso so the seamless camo + fit are the hero.
              PREMIUM B&W GRADE (panels 3/5/9): full greyscale, hard contrast 1.4, black point
              crushed, brightness held so blacks match WELL_A↔seamless-macro — crisp 4K, no haze. */}
          {/* subtle PUSH-IN parallax on the still so the well reads as live footage, not a frozen
              poster (panel 10) — the well RECT stays EXACT/stationary; only the image ken-burns. */}
          <img ref={wellAImgRef} src={MODEL_0030} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "42% 30%", borderRadius: 4, filter: "grayscale(1) brightness(1.02) contrast(1.4)", transform: "scale(1.18)", transformOrigin: "50% 38%" }} />
          {/* HOUSE-DARK STUDIO PASS (panels 3/5/9): MODEL_0030 ships on a light studio bg; a strong
              radial vignette pushes that bg to near-black at the edges so the well sits on the same
              dark monochrome curve as the seamless macro, while the centred model stays crisp + lit.
              Crushes the haze, deepens blacks → premium 4K read, not stock/phone grey. */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 4, background: "radial-gradient(ellipse 52% 58% at 50% 40%, transparent 30%, rgba(6,6,7,0.6) 70%, rgba(4,4,5,0.94) 100%)" }} />
          {/* charcoal multiply pass so the whole frame matches the near-black system tone */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 4, background: "rgba(16,16,18,0.28)", mixBlendMode: "multiply" }} />
          {/* CENTERED KEY/RIM bloom over the torso lifts the figure ~1 stop so the camo + fitted
              cut read against the now-dark surround (controlled light, not a flat lift). */}
          <div style={{ position: "absolute", left: 0, right: 0, top: "6%", height: "60%", background: "radial-gradient(ellipse 50% 60% at 50% 40%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 48%, transparent 76%)", mixBlendMode: "screen" }} />
          {/* editorial gradient floor so bottom copy can sit cleanly without a chrome bar */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 24%, transparent 68%, rgba(0,0,0,0.82) 100%)" }} />
          {/* crisp 2px editorial edge — confident frame, no soft shadow (panel 7) */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 4, border: `2px solid rgba(255,255,255,0.6)` }} />
          {/* BRACKET CORNERS — the // angular crop language, the ONLY framing chrome */}
          <div ref={wellACornerRef} style={{ position: "absolute", inset: 0, opacity: 0 }}>
            {[[0,0,1,1],[1,0,-1,1],[0,1,1,-1],[1,1,-1,-1]].map((c, i) => (
              <div key={i} style={{ position: "absolute", [c[0] ? "right" : "left"]: -2, [c[1] ? "bottom" : "top"]: -2, width: 40, height: 40, borderTop: c[1] ? "none" : `4px solid ${WHITE}`, borderBottom: c[1] ? `4px solid ${WHITE}` : "none", borderLeft: c[0] ? "none" : `4px solid ${WHITE}`, borderRight: c[0] ? `4px solid ${WHITE}` : "none" } as React.CSSProperties} />
            ))}
            {/* top-left timecode tick — white-on-black REC mark (achromatic, panel 2) */}
            <div style={{ position: "absolute", top: 14, left: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: WHITE, boxShadow: `0 0 10px ${COOL_ACCENT_GLOW}` }} />
              <span style={{ color: WHITE, fontFamily: HEAVY, fontWeight: 800, fontSize: 15, letterSpacing: 3 }}>REC · 00:04</span>
            </div>
          </div>
        </div>

        {/* copy bands — OUTSIDE the well rect, never over it. Leading tightened to 0.88. */}
        <div ref={wellACopy1Ref} style={{ position: "absolute", top: 350, left: 70, opacity: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 11, marginBottom: 8 }}>
            <span style={{ color: COOL_ACCENT, fontFamily: HEAVY, fontWeight: 900, fontSize: 22, letterSpacing: 1 }}>//</span>
            <span style={{ color: OFF_WHITE, fontFamily: HEAVY, fontWeight: 800, fontSize: 22, letterSpacing: 6 }}>PERFORMANCE</span>
          </div>
          {/* heavy-condensed voice (panel 15): tighter tracking so the well headline reads as
              dense/heavy as the hero wordmark + CTA — one type voice across the spot. */}
          <div style={{ color: WHITE, fontFamily: DISPLAY, fontSize: 68, lineHeight: 0.86, letterSpacing: -2 }}>BUILT FOR<br />THE GRIND</div>
        </div>
        {/* LOCKED-IN FIT — LEFT-ALIGNED to the SAME column (x=70) as the eyebrow/headline
            (panel 16): the two copy beats now share one margin axis so the frame reads as a
            single left-anchored composition, not two blocks on different axes. Sits below the
            well bottom with clean breathing room. */}
        <div ref={wellACopy2Ref} style={{ position: "absolute", bottom: 150, left: 70, textAlign: "left", opacity: 0 }}>
          {/* DISTINCT ANGLE (panel 15) — a FIT message, not another ENGINEERED/BUILT/MOVE line */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 11, marginBottom: 8 }}>
            <span style={{ color: COOL_ACCENT, fontFamily: HEAVY, fontWeight: 900, fontSize: 22, letterSpacing: 1 }}>//</span>
            <span style={{ color: OFF_WHITE, fontFamily: HEAVY, fontWeight: 800, fontSize: 22, letterSpacing: 6 }}>THE FIT</span>
          </div>
          <div style={{ color: WHITE, fontFamily: DISPLAY, fontSize: 54, lineHeight: 0.86, letterSpacing: -2 }}>LOCKED-IN<br />FIT</div>
          <div style={{ width: 180, height: 2, background: "rgba(255,255,255,0.55)", marginTop: 12 }} />
        </div>
        {/* (right-side 3-tag stat stack REMOVED — panel 8 de-clutter. The spec read now lives
            as ONE clean tag in the left gutter band so the eye lands on the headline → well →
            ENGINEERED TO MOVE in a clear sequence, not 3 competing layers firing at once.) */}
      </div>

      {/* ══════════ BEAT 4 — SEAMLESS FEATURE ══════════ */}
      <div ref={b4Ref} style={{ position: "absolute", inset: 0, zIndex: 30, background: NEAR_BLACK, opacity: 0, visibility: "hidden" }}>
        <div ref={featImgRef} style={{ position: "absolute", inset: 0, transformOrigin: "40% 40%" }}>
          <img src={MODEL_0049} style={{ position: "absolute", inset: 0, width: 1080, height: 1920, objectFit: "cover", objectPosition: "42% 30%", filter: "grayscale(0.34) brightness(0.92) contrast(1.2)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,10,0.5) 0%, transparent 38%, rgba(10,10,10,0.92) 100%)" }} />
          {/* (chest puck + stamp removed — the macro weave already reads as the seamless camo) */}
        </div>
        {/* header — distinct message from BEAT 5 (which owns SEAMLESS KNIT / NOT SEWN).
            This beat is the PERFORMANCE spec read, not a second fabric-detail macro. */}
        {/* top scrim so the white eyebrow + headline never fight the bright camo behind */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 420, background: "linear-gradient(180deg, rgba(8,8,8,0.85) 0%, rgba(8,8,8,0.45) 55%, transparent 100%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 110, left: 70, right: 70 }}>
          {/* eyebrow: rendered as a flex row so the '//' mark is a discrete glyph pair that
              CANNOT be clipped or garbled by sub-pixel kerning against the camo. Lifted to
              full OFF_WHITE for strict contrast (panel 1 — no broken/dim leading char). */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ color: COOL_ACCENT_DIM, fontFamily: HEAVY, fontWeight: 900, fontSize: 24, letterSpacing: 1 }}>//</span>
            <span style={{ color: OFF_WHITE, fontFamily: HEAVY, fontWeight: 800, fontSize: 24, letterSpacing: 6 }}>THE FEEL</span>
          </div>
          {/* DISTINCT ANGLE (panel 15) — a FEEL message (was BUILT TO PERFORM), so each mid-roll
              beat earns its own message instead of reusing ENGINEERED/BUILT/PERFORM. */}
          <div style={{ color: WHITE, fontFamily: DISPLAY, fontSize: 84, lineHeight: 0.86, marginTop: 10, letterSpacing: -2 }}>MOVES<br />LIKE SKIN</div>
        </div>
        {/* callout rows bottom */}
        <div style={{ position: "absolute", bottom: 200, left: 70, right: 70, display: "flex", flexDirection: "column", gap: 22 }}>
          {[
            { r: featC1Ref, k: "01", t: "SEAMLESS KNIT" },
            { r: featC2Ref, k: "02", t: "4-WAY STRETCH" },
            { r: featC3Ref, k: "03", t: "SWEAT-WICKING" },
          ].map((c, i) => (
            <div key={i} ref={c.r} style={{ opacity: 0, display: "flex", alignItems: "center", gap: 22, borderBottom: `2px solid ${GREY_LINE}`, paddingBottom: 14 }}>
              <span style={{ color: GREY_MID, fontFamily: DISPLAY, fontSize: 34, minWidth: 60 }}>{c.k}</span>
              <span style={{ color: WHITE, fontFamily: DISPLAY, fontSize: 50, letterSpacing: 1 }}>{c.t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ BEAT 5 — FABRIC WELL_B ══════════ */}
      <div ref={b5Ref} style={{ position: "absolute", inset: 0, zIndex: 30, background: NEAR_BLACK, opacity: 0, visibility: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, ...camoBg, opacity: 0.14 }} />
        {/* header copy ABOVE the well (well y starts at 1160). Leading tight 0.86.
            "NOT SEWN." lifted from grey → near-white (#D6D6D6) so it reads as a confident
            statement, not a faded sub-line, while still tonally stepped under ENGINEERED. */}
        <div ref={wellBCopy1Ref} style={{ position: "absolute", top: 130, left: 70, right: 70, opacity: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ color: COOL_ACCENT, fontFamily: HEAVY, fontWeight: 900, fontSize: 24, letterSpacing: 1 }}>//</span>
            <span style={{ color: OFF_WHITE, fontFamily: HEAVY, fontWeight: 800, fontSize: 24, letterSpacing: 6 }}>SEAMLESS KNIT</span>
          </div>
          {/* both lines pure WHITE — full strict contrast, no faded grey sub-line */}
          <div style={{ color: WHITE, fontFamily: DISPLAY, fontSize: 116, lineHeight: 0.86, marginTop: 12 }}>ENGINEERED,</div>
          <div style={{ color: WHITE, fontFamily: DISPLAY, fontSize: 116, lineHeight: 0.88 }}>NOT SEWN.</div>
        </div>

        {/* KINETIC SPEC PANEL — pulled UP to top:440 (panel 11) so it sits directly under the
            NOT SEWN. headline as ONE continuous editorial grid — no dead vertical band between
            the two zones. Animated bar readouts + scrolling tick column + live measurement
            digits so the zone is loaded, not empty. (driven in handleFrame) */}
        <div ref={wellBSpecRef} style={{ position: "absolute", top: 440, left: 70, right: 70, opacity: 0 }}>
          {/* connector hairline tying headline → spec grid into one block */}
          <div style={{ width: 70, height: 3, background: COOL_ACCENT, marginBottom: 26, boxShadow: `0 0 12px ${COOL_ACCENT_GLOW}` }} />
          {/* top hairline + label */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <span style={{ color: WHITE, fontFamily: HEAVY, fontWeight: 900, fontSize: 26, letterSpacing: 4 }}>GEO CAMO · SEAMLESS WEAVE</span>
            <span ref={wellBReadoutRef} style={{ color: WHITE, fontFamily: HEAVY, fontWeight: 800, fontSize: 22, letterSpacing: 2 }}>0.20mm</span>
          </div>
          {/* moving camo measurement band */}
          <div ref={wellBCamoRef} style={{ position: "relative", height: 58, ...camoBg, opacity: 0.55, borderTop: `2px solid ${GREY_LINE}`, borderBottom: `2px solid ${GREY_LINE}`, overflow: "hidden" }}>
            {/* scrolling 0.2mm measurement ticks */}
            <div ref={wellBTicksRef} style={{ position: "absolute", top: 0, bottom: 0, left: 0, display: "flex", alignItems: "center", gap: 22, whiteSpace: "nowrap" }}>
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 2, height: i % 5 === 0 ? 26 : 13, background: i % 5 === 0 ? WHITE : "rgba(255,255,255,0.45)" }} />
                </div>
              ))}
            </div>
          </div>
          {/* three engineered spec bars — sweep-fill L→R with a COUNT-UP readout (panel 5).
              Each bar staggers ~260ms after the previous (data-stagger index) and the numeric
              readout counts up in lockstep with the fill, so the scene's payoff is a
              progressive reveal, not three identical static fills. */}
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              { label: "STRETCH RECOVERY", suffix: "%", to: 98, fill: 0.98, kind: "num" },
              { label: "BREATHABILITY", grades: ["F","D","C","B","A","A+"], fill: 0.86, kind: "grade" },
              { label: "SEAM COUNT", suffix: "", to: 0, fill: 0.0, kind: "num" },
            ].map((s, i) => {
              const isSeam = i === 2;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  {/* labels lifted GREY→WHITE for strict contrast */}
                  <span style={{ color: WHITE, fontFamily: HEAVY, fontWeight: 800, fontSize: 18, letterSpacing: 2, width: 240 }}>{s.label}</span>
                  {/* TRACK maps to VALUE (panel 14): SEAM COUNT = 0 → the track itself is EMPTY,
                      just a single origin tick, so a sharp eye never reads a near-full bar for a
                      "0" value. The 98% / A+ bars keep a full faint track that fills to value. */}
                  <div style={{ position: "relative", flex: 1, height: 8, background: isSeam ? "transparent" : GREY_LINE, overflow: "visible" }}>
                    {/* origin tick — present on every row so the bar has a defined start */}
                    <div style={{ position: "absolute", left: 0, top: -3, bottom: -3, width: 3, background: isSeam ? COOL_ACCENT : "rgba(255,255,255,0.55)" }} />
                    {/* empty-track dotted guide for the SEAM row so the lane still reads (but as EMPTY) */}
                    {isSeam && <div style={{ position: "absolute", left: 0, right: 0, top: 3, height: 2, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.16) 0 6px, transparent 6px 14px)" }} />}
                    <div className="spec-fill" data-fill={String(s.fill)} data-stagger={String(i)} style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "0%", background: isSeam ? COOL_ACCENT : WHITE }} />
                    {/* leading-edge glow on the sweeping bar */}
                    <div className="spec-glow" data-stagger={String(i)} style={{ position: "absolute", top: -3, bottom: -3, width: 14, left: "0%", background: isSeam ? COOL_ACCENT : WHITE, filter: "blur(5px)", opacity: 0 }} />
                  </div>
                  {/* count-up readout — driven by handleFrame via the .spec-num class */}
                  <span
                    ref={isSeam ? wellBPeakRef : undefined}
                    className="spec-num"
                    data-stagger={String(i)}
                    data-kind={s.kind}
                    data-to={s.kind === "num" ? String(s.to) : ""}
                    data-suffix={s.kind === "num" ? s.suffix : ""}
                    data-grades={s.kind === "grade" ? (s.grades as string[]).join(",") : ""}
                    style={{ color: WHITE, fontFamily: DISPLAY, fontSize: isSeam ? 40 : 24, lineHeight: 1, letterSpacing: 1, width: 110, textAlign: "right", transformOrigin: "100% 50%", display: "inline-block", textShadow: isSeam ? `0 0 18px ${COOL_ACCENT_GLOW}` : "none" }}
                  >{s.kind === "num" ? `0${s.suffix}` : "F"}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* WELL_B frame — EXACT rect 160,1160,760,560 r20, STATIONARY.
            Distinct from WELL_A: this is a LAB MACRO-SCOPE device (crosshair reticle, scale
            ticks, measurement HUD) — opposite read to WELL_A's vertical LIVE training feed,
            so the two well moments never read as a repeat even with similar footage. */}
        {/* (big soft separation halo REMOVED — panel 7. The well now reads as a confident
            device frame via crisp hairline + hard brackets, not a soft-shadowed floating card.) */}
        {/* LAB-BENCH BAND behind the scope: a banded lower-third (full bleed L↔R) so the well
            sits ON a surface instead of floating with bare black side gutters (panel 10). */}
        <div style={{ position: "absolute", left: 0, right: 0, top: WELL_B.y - 36, height: WELL_B.h + 72, background: "linear-gradient(180deg, transparent 0%, rgba(40,40,42,0.7) 14%, rgba(40,40,42,0.7) 86%, transparent 100%)", borderTop: "3px solid #585858", borderBottom: "3px solid #585858" }} />
        {/* gutter label — RIGHT spine only (panel 7 de-clutter: the duplicate left "SAMPLE 01 ·
            GEO KNIT" side-rail is dropped so the densest frame breathes; the scope HUD already
            carries the sample/scale read). */}
        <div style={{ position: "absolute", right: 24, top: WELL_B.y + WELL_B.h, transform: "rotate(-90deg)", transformOrigin: "right bottom", color: COOL_ACCENT, fontFamily: HEAVY, fontWeight: 900, fontSize: 15, letterSpacing: 5, whiteSpace: "nowrap" }}>LIVE · 100×</div>
        <div ref={wellBFrameRef} style={{ position: "absolute", left: WELL_B.x, top: WELL_B.y, width: WELL_B.w, height: WELL_B.h, opacity: 0, transformOrigin: "50% 50%" }}>
          {/* OUTER DEVICE BEZEL — bolder explicit frame so the well reads as a deliberate gym/lab
              device against the black bg (client: the frame was blending). Sits OUTSIDE the
              composited footage rect so it stays visible over the real fabric video. */}
          <div style={{ position: "absolute", inset: -12, borderRadius: 8, border: "3px solid rgba(255,255,255,0.82)", boxShadow: "0 0 0 1.5px rgba(0,0,0,0.65), 0 0 22px rgba(0,0,0,0.55)" }} />
          {/* FULL-BLEED macro footage, square editorial crop (small radius). scaleX(-1)
              un-mirrors the source. No rounded device bezel, no inner bevel.
              PREMIUM-MATCH GRADE (panels 3/9): full greyscale, contrast pushed 1.28→1.5, brightness
              eased so the soft/compressed/'stock' read is killed and the blacks match WELL_A — crisp
              4K weave, not milky/foggy. A gentle push-in adds life to the macro. */}
          <img ref={wellBImgRef} src={POSTER_FABRIC} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: 4, filter: "grayscale(1) brightness(0.92) contrast(1.5)", transform: "scaleX(-1) scale(1.06)", transformOrigin: "50% 50%" }} />
          {/* sharpen-ish micro-contrast vignette + black-point crush to match WELL_A blacks (no haze) */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 4, background: "radial-gradient(ellipse 64% 64% at 50% 50%, transparent 36%, rgba(4,4,5,0.6) 92%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: 4, background: "rgba(14,14,16,0.18)", mixBlendMode: "multiply" }} />
          {/* crisp 2px hairline edge — NO soft drop shadow (panel 7) */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 4, border: `2px solid rgba(255,255,255,0.6)` }} />
          {/* BRACKET CORNERS — the only framing chrome (// crop language) */}
          {[[0,0,1,1],[1,0,-1,1],[0,1,1,-1],[1,1,-1,-1]].map((c, i) => (
            <div key={i} style={{ position: "absolute", [c[0] ? "right" : "left"]: -8, [c[1] ? "bottom" : "top"]: -8, width: 58, height: 58, borderTop: c[1] ? "none" : `7px solid ${WHITE}`, borderBottom: c[1] ? `7px solid ${WHITE}` : "none", borderLeft: c[0] ? "none" : `7px solid ${WHITE}`, borderRight: c[0] ? `7px solid ${WHITE}` : "none", filter: "drop-shadow(0 0 6px rgba(0,0,0,0.7))" } as React.CSSProperties} />
          ))}
          {/* MACRO-SCOPE HUD — crosshair reticle (center), the lab-macro metaphor */}
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 120, height: 120, marginLeft: -60, marginTop: -60 }}>
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.5)" }} />
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.5)" }} />
            <div style={{ position: "absolute", left: "50%", top: "50%", width: 30, height: 30, marginLeft: -15, marginTop: -15, border: `2px solid ${COOL_ACCENT}`, borderRadius: "50%" }} />
          </div>
          {/* KINETIC crosshair SWEEP — cool-accent scan line rakes down the scope (driven) */}
          <div ref={wellBSweepRef} style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3, background: `linear-gradient(90deg, transparent, ${COOL_ACCENT}, transparent)`, boxShadow: `0 0 16px ${COOL_ACCENT_GLOW}` }} />
          {/* scale ticks down the left edge */}
          <div style={{ position: "absolute", left: 16, top: 56, bottom: 56, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{ width: i % 2 ? 8 : 16, height: 2, background: "rgba(255,255,255,0.6)" }} />
            ))}
          </div>
          {/* top-left scope readout — SCRIM PLATE + heavier weight + text-shadow (panel 7) so the
              HUD label stays razor-crisp over the busy halftone instead of dissolving into it. */}
          <div style={{ position: "absolute", top: 12, left: 12, padding: "5px 11px", background: "rgba(8,8,8,0.62)", border: "1px solid rgba(255,255,255,0.18)" }}>
            <span style={{ color: WHITE, fontFamily: HEAVY, fontWeight: 900, fontSize: 16, letterSpacing: 3, textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>FIBER SCOPE · 0.2mm</span>
          </div>
          {/* corner mark — same scrim treatment so MACRO 100× holds against the weave */}
          <div style={{ position: "absolute", bottom: 12, right: 12, display: "flex", alignItems: "center", gap: 8, padding: "5px 11px", background: "rgba(8,8,8,0.62)", border: "1px solid rgba(255,255,255,0.18)" }}>
            <Fin size={0.3} color={WHITE} />
            <span style={{ color: WHITE, fontFamily: HEAVY, fontWeight: 900, fontSize: 17, letterSpacing: 3, textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>MACRO 100×</span>
          </div>
        </div>
        {/* (redundant bottom-right label removed — the headline owns the frame, panel 9) */}
      </div>

      {/* ══════════ BEAT 6 — COLORWAY SELECTOR (FIX 3) ══════════
          A real product selector: header "8 COLORWAYS / FIND YOURS", a big MAIN PREVIEW
          panel showing the SELECTED colorway's REAL product shot + its name, and a row of
          8 REAL product-shot swatches below. The selection cycles through all 8 — the main
          preview crossfades to each colorway and the active swatch gets a white ring. */}
      <div ref={b6Ref} style={{ position: "absolute", inset: 0, zIndex: 30, background: NEAR_BLACK, opacity: 0, visibility: "hidden" }}>
        <div ref={cwCamoRef} style={{ position: "absolute", inset: -40, ...camoBg, opacity: 0.12 }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 42%, transparent 34%, rgba(0,0,0,0.78) 94%)" }} />

        {/* header — tight, pulled to the top */}
        <div style={{ position: "absolute", top: 96, left: 70, right: 70 }}>
          <div ref={cwLabelRef} style={{ opacity: 0, display: "flex", alignItems: "baseline", gap: 20 }}>
            <span style={{ color: WHITE, fontFamily: DISPLAY, fontSize: 132, lineHeight: 0.78 }}>8</span>
            <span style={{ color: WHITE, fontFamily: DISPLAY, fontSize: 60, lineHeight: 0.9, letterSpacing: 1 }}>COLORWAYS</span>
          </div>
          <div ref={cwFindRef} style={{ opacity: 0, marginTop: 12, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 56, height: 3, background: WHITE }} />
            <span style={{ color: GREY_MID, fontFamily: HEAVY, fontWeight: 800, fontSize: 28, letterSpacing: 8 }}>FIND YOURS</span>
          </div>
        </div>

        {/* MAIN PREVIEW panel — large framed window showing the SELECTED colorway's REAL shot.
            Stacked images crossfade as the selection cycles. Bracket-corner editorial frame. */}
        <div ref={cwPreviewWrapRef} style={{ position: "absolute", left: 130, top: 360, width: 820, height: 940, opacity: 0, transformOrigin: "50% 50%", overflow: "hidden", borderRadius: 6 }}>
          {/* stacked real previews (only the selected one is opaque). HOUSE-TONE grade (panel 2):
              brightness pulled DOWN and saturation eased so the garment colour reads as a
              premium ACCENT inside the dark system, never a near-white silver-studio departure. */}
          {COLORWAYS.map((c, i) => (
            <div key={i} ref={cwPreviewRefs[i]} style={{ position: "absolute", inset: 0, opacity: 0, transformOrigin: "50% 42%" }}>
              <img src={c.src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: c.obj, filter: "contrast(1.12) brightness(0.7) saturate(0.7)" }} />
            </div>
          ))}
          {/* CHARCOAL BACKDROP WASH (panel 2): the bright silver studio gradient behind the hero
              is knocked to charcoal — a multiply charcoal field + radial vignette so the loud
              near-white panel becomes a dark stage and only the lit garment carries the colour. */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(18,18,20,0.5)", mixBlendMode: "multiply", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 58% 60% at 50% 40%, transparent 30%, rgba(8,8,9,0.78) 92%)", pointerEvents: "none" }} />
          {/* warm-white key bloom ON the torso only — re-lifts the garment ~1 stop so the colour
              still pops as a controlled reveal against the now-dark surround */}
          <div style={{ position: "absolute", left: 0, right: 0, top: "12%", height: "52%", background: "radial-gradient(ellipse 46% 60% at 50% 42%, rgba(255,255,255,0.16) 0%, transparent 72%)", mixBlendMode: "screen", pointerEvents: "none" }} />
          {/* editorial floor scrim so the name/sub sit cleanly */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,8,8,0.5) 0%, transparent 26%, transparent 50%, rgba(8,8,8,0.94) 100%)", pointerEvents: "none" }} />
          {/* crisp white edge */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 6, border: `2px solid rgba(255,255,255,0.6)`, pointerEvents: "none" }} />
          {/* bracket corners — the // crop language */}
          {[[0,0,1,1],[1,0,-1,1],[0,1,1,-1],[1,1,-1,-1]].map((c, i) => (
            <div key={i} style={{ position: "absolute", [c[0] ? "right" : "left"]: -2, [c[1] ? "bottom" : "top"]: -2, width: 44, height: 44, borderTop: c[1] ? "none" : `4px solid ${WHITE}`, borderBottom: c[1] ? `4px solid ${WHITE}` : "none", borderLeft: c[0] ? "none" : `4px solid ${WHITE}`, borderRight: c[0] ? `4px solid ${WHITE}` : "none", pointerEvents: "none" } as React.CSSProperties} />
          ))}
          {/* top-left index readout chip */}
          <div style={{ position: "absolute", top: 18, left: 18, padding: "6px 12px", background: "rgba(8,8,8,0.6)", border: "1px solid rgba(255,255,255,0.22)" }}>
            <span ref={cwIndexRef} style={{ color: WHITE, fontFamily: HEAVY, fontWeight: 900, fontSize: 18, letterSpacing: 3 }}>01 / 08</span>
          </div>
          {/* selected colorway NAME + sub, bottom-left over the floor scrim */}
          <div style={{ position: "absolute", left: 28, bottom: 26, right: 28 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 6 }}>
              <Fin size={0.3} color={WHITE} />
              <span ref={cwSubRef} style={{ color: OFF_WHITE, fontFamily: HEAVY, fontWeight: 800, fontSize: 22, letterSpacing: 6 }}>GEO SEAMLESS</span>
            </div>
            <div ref={cwNameRef} style={{ opacity: 0, color: WHITE, fontFamily: DISPLAY, fontSize: 72, lineHeight: 0.9, letterSpacing: 0 }}>ONYX BLACK</div>
          </div>
        </div>

        {/* 8 REAL swatch thumbnails — a row at the bottom; active one gets a bold white ring.
            (panel 6) labels +14% & taller name plate, the row lifted with breathing room above
            it (a hairline + kicker spacer) and the active border made heavier with a stronger
            glow so the synced selection reads instantly on mobile. (panel 4) inactive thumbs are
            desaturated-dim by default so colour only blooms on the selected hero. */}
        {/* breathing-room divider above the row (sits in the gap between preview & swatches) */}
        <div style={{ position: "absolute", left: 60, right: 60, bottom: 270, display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: GREY_MID, fontFamily: HEAVY, fontWeight: 800, fontSize: 16, letterSpacing: 6 }}>THE RANGE</span>
          <div style={{ flex: 1, height: 2, background: "rgba(255,255,255,0.18)" }} />
        </div>
        <div style={{ position: "absolute", left: 60, right: 60, bottom: 70, display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 12 }}>
          {COLORWAYS.map((c, i) => (
            <div key={i} ref={cwSwatchRefs[i]} style={{ opacity: 0, position: "relative", height: 172, borderRadius: 8, overflow: "hidden", border: `2px solid ${GREY_LINE}` }}>
              {/* INACTIVE = desaturated-dim. The active one is re-lit/re-saturated in handleFrame
                  by driving this img's filter, so colour only blooms on the selected swatch. */}
              <img ref={cwSwatchImgRefs[i]} src={c.src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%", filter: "contrast(1.05) brightness(0.62) saturate(0.45)" }} />
              {/* dark floor + name (label +14%, taller plate) */}
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 40, background: "rgba(8,8,8,0.84)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: OFF_WHITE, fontFamily: HEAVY, fontWeight: 800, fontSize: 13, letterSpacing: 1, whiteSpace: "nowrap" }}>{c.name}</span>
              </div>
              {/* SELECTION RING — driven; bold bright-white frame + strong glow on the active swatch */}
              <div ref={cwSwatchRingRefs[i]} style={{ position: "absolute", inset: 0, opacity: 0, border: `4px solid ${WHITE}`, borderRadius: 8, boxShadow: `0 0 26px rgba(255,255,255,0.7), inset 0 0 22px rgba(255,255,255,0.28)`, pointerEvents: "none", transformOrigin: "50% 50%" }} />
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ BEAT 7 — CTA / OUTRO (b05 style — FIX 4) ══════════
          The REAL gymshark logo lockup on a dark fabric-texture bg → "SHOP GEO SEAMLESS" →
          off-white "SHOP NOW" pill (camo accent bar + specular sheen) → "FROM $36" anchor →
          GYMSHARK.COM. Rebuilt in b05's outro composition, using the authentic mark. */}
      <div ref={b7Ref} style={{ position: "absolute", inset: 0, zIndex: 30, background: NEAR_BLACK, opacity: 0, visibility: "hidden" }}>
        {/* drifting fabric-texture bg (the seamless macro, graded dark mono) — MORE present so the
            close is a live product field, not a flat black noise field (panel 11). */}
        <div ref={ctaBgRef} style={{ position: "absolute", inset: 0, opacity: 0.55, transformOrigin: "50% 50%", willChange: "transform, opacity" }}>
          <img src={POSTER_FABRIC} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "78% 64%", filter: "grayscale(1) contrast(1.42) brightness(0.62)" }} />
        </div>
        {/* second, slower parallax model ghost behind for depth + life (the product, moving) */}
        <div ref={ctaBg2Ref} style={{ position: "absolute", inset: 0, opacity: 0.16, transformOrigin: "50% 30%", willChange: "transform", mixBlendMode: "screen" }}>
          <img src={MODEL_0030} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 24%", filter: "grayscale(1) contrast(1.3) brightness(0.7)" }} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,10,10,0.46) 0%, rgba(10,10,10,0.68) 100%)" }} />
        {/* faint geo-camo motif layer (rotated, drifting) so the camo language carries into the close */}
        <div ref={ctaCamoRef} style={{ position: "absolute", inset: -60, ...camoBg, opacity: 0.2, transform: "rotate(-10deg) scale(1.5)", willChange: "background-position" }} />
        {/* breathing luminance bloom behind the lockup */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(58% 40% at 50% 42%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 38%, transparent 72%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 80% at 50% 50%, transparent 52%, rgba(0,0,0,0.6) 100%)" }} />

        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          {/* REAL logo lockup (white wordmark + fin) */}
          <div ref={ctaLogoRef} style={{ opacity: 0, marginBottom: 40, transformOrigin: "50% 50%", willChange: "transform" }}>
            <img src={GYMSHARK_LOGO} style={{ width: 560, height: "auto", display: "block" }} />
          </div>
          {/* SHOP GEO SEAMLESS */}
          <div ref={ctaTitleRef} style={{ opacity: 0, fontFamily: DISPLAY, fontSize: 100, lineHeight: 0.9, letterSpacing: -2, textAlign: "center", color: WHITE, willChange: "transform" }}>
            SHOP GEO<br />SEAMLESS
          </div>
          {/* SHOP NOW pill — PREMIUM BRANDED fill (panel 11): pure-white plane, BLACK heavy text,
              a bold geo-camo accent bar + a fin lockup, a confident drop-shadow and a hairline
              white ring so it reads as a deliberate brand button, not a flat grey rectangle. The
              sheen is dimmed + sits BEHIND the text (z below the label) so the type stays crisp. */}
          <div ref={ctaBtnRef} style={{ opacity: 0, position: "relative", marginTop: 50, padding: "30px 80px 30px 96px", background: "#FFFFFF", boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.25), 0 22px 56px rgba(0,0,0,0.6)", overflow: "hidden", willChange: "transform", display: "flex", alignItems: "center", gap: 20 }}>
            {/* bold geo-camo accent bar (left edge) — wider, more confident */}
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 34, background: NEAR_BLACK, zIndex: 3 }} />
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 34, ...camoBg, opacity: 0.95, zIndex: 3, pointerEvents: "none" }} />
            <span style={{ position: "relative", zIndex: 2, fontFamily: HEAVY, fontWeight: 900, fontSize: 44, letterSpacing: 5, color: "#080808" }}>SHOP NOW</span>
            {/* arrow chevron — pushes the action read */}
            <span style={{ position: "relative", zIndex: 2, fontFamily: DISPLAY, fontSize: 40, color: "#080808", lineHeight: 1, transform: "translateY(-2px)" }}>→</span>
            {/* specular sheen sweep — dimmer + behind the text */}
            <div ref={ctaBtnSheenRef} style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "55%", background: "linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(170,170,170,0.55) 48%, rgba(170,170,170,0.55) 52%, rgba(255,255,255,0) 100%)", transform: "translateX(-160%) skewX(-18deg)", zIndex: 1, willChange: "transform", pointerEvents: "none", mixBlendMode: "multiply" }} />
            {/* 1-frame land flash */}
            <div ref={ctaFlashRef} style={{ position: "absolute", inset: 0, background: "#fff", opacity: 0, zIndex: 4, pointerEvents: "none", mixBlendMode: "screen" }} />
          </div>
          {/* FROM $36 anchor */}
          <div ref={ctaPriceRef} style={{ opacity: 0, marginTop: 28, display: "inline-flex", alignItems: "center", gap: 14, willChange: "transform, opacity" }}>
            <Fin size={0.22} color={WHITE} />
            <span style={{ fontFamily: HEAVY, fontWeight: 900, fontSize: 38, letterSpacing: 5, color: WHITE }}>FROM $36</span>
          </div>
          {/* GYMSHARK.COM */}
          <div ref={ctaUrlRef} style={{ opacity: 0, marginTop: 26, fontFamily: HEAVY, fontWeight: 800, fontSize: 32, letterSpacing: 8, color: OFF_WHITE, willChange: "transform" }}>
            GYMSHARK.COM
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          SIX UNIQUE GEO-CAMO MECHANICS TRANSITION OVERLAYS (zIndex 60, above all beats).
          Each is driven only inside its cut window in handleFrame; hidden otherwise.
          ══════════════════════════════════════════════════════════════════════════ */}

      {/* T1 · HALFTONE DOT-DISSOLVE — a solid camo plane (iris) with a growing center hole
          reveals the hero, while two DENSE dot fields scatter on opposite vectors + bloom. */}
      <div ref={tx1Ref} style={{ position: "absolute", inset: 0, zIndex: 61, opacity: 0, visibility: "hidden", pointerEvents: "none" }}>
        {/* solid camo plane — masked by a growing circular aperture */}
        <div ref={tx1IrisRef} style={{ position: "absolute", inset: 0, ...facetedCamo }} />
        {/* dense bright dot field A */}
        <div ref={tx1aRef} style={{ position: "absolute", inset: -240, backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.85) 2px, transparent 2.6px)`, backgroundSize: "16px 16px", backgroundPosition: "0 0", willChange: "transform,opacity" }} />
        {/* dense dot field B (offset half-cell so the two read as a camo halftone) */}
        <div ref={tx1bRef} style={{ position: "absolute", inset: -240, backgroundImage: `radial-gradient(circle, rgba(200,200,200,0.7) 2px, transparent 2.6px)`, backgroundSize: "16px 16px", backgroundPosition: "8px 8px", willChange: "transform,opacity" }} />
      </div>

      {/* T2 · GEAR-MESH SLAB SHUTTER — top + bottom camo slabs with INTERLOCKING triangular
          teeth descend/rise to mesh at center, then withdraw to reveal WELL_A. */}
      <div ref={tx2Ref} style={{ position: "absolute", inset: 0, zIndex: 61, opacity: 0, visibility: "hidden", pointerEvents: "none", overflow: "hidden" }}>
        {/* top slab — saw-tooth bottom edge (clip-path) so it meshes like a gear */}
        <div ref={tx2TopRef} style={{ position: "absolute", top: 0, left: 0, right: 0, height: "56%", ...facetedCamo, transform: "translateY(-1020px)", clipPath: "polygon(0 0,100% 0,100% 86%,90% 100%,80% 86%,70% 100%,60% 86%,50% 100%,40% 86%,30% 100%,20% 86%,10% 100%,0 86%)" }} />
        {/* bottom slab — saw-tooth top edge offset by half a tooth so teeth INTERLOCK */}
        <div ref={tx2BotRef} style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "56%", ...facetedCamo, transform: "translateY(1020px)", clipPath: "polygon(5% 14%,15% 0,25% 14%,35% 0,45% 14%,55% 0,65% 14%,75% 0,85% 14%,95% 0,100% 14%,100% 100%,0 100%,0 14%)" }} />
        {/* white seam glow where the teeth mesh */}
        <div ref={tx2SeamRef} style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 4, marginTop: -2, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.95),transparent)", opacity: 0, boxShadow: "0 0 22px rgba(255,255,255,0.6)" }} />
      </div>

      {/* T3 · SPEC-PANEL SHATTER — 6 rectangular UI panels (the spec-chrome language) snap
          apart outward on staggered vectors. The grid of panels fractures + clears. */}
      <div ref={tx3Ref} style={{ position: "absolute", inset: 0, zIndex: 61, opacity: 0, visibility: "hidden", pointerEvents: "none", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gridTemplateRows: "repeat(2,1fr)" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="tx3-panel" data-idx={String(i)} style={{ position: "relative", ...facetedCamo, border: "1px solid rgba(255,255,255,0.14)", willChange: "transform,opacity" }}>
            {/* a spec hairline + tick so each shard reads as a UI panel, not a flat block */}
            <div style={{ position: "absolute", top: 18, left: 18, right: 18, height: 2, background: "rgba(255,255,255,0.35)" }} />
            <div style={{ position: "absolute", top: 30, left: 18, width: 40, height: 2, background: "rgba(255,255,255,0.6)" }} />
            <div style={{ position: "absolute", bottom: 18, right: 18, width: 22, height: 22, borderRight: "3px solid rgba(255,255,255,0.5)", borderBottom: "3px solid rgba(255,255,255,0.5)" }} />
          </div>
        ))}
      </div>

      {/* T4 · BLUEPRINT GRID DRAW — a drafting grid + sweeping rules + a traveling crosshair
          DRAW the incoming engineered (WELL_B) scene into existence, then retract. */}
      <div ref={tx4Ref} style={{ position: "absolute", inset: 0, zIndex: 61, opacity: 0, visibility: "hidden", pointerEvents: "none", background: NEAR_BLACK }}>
        {/* blueprint grid field (fine + coarse rules) */}
        <div ref={tx4GridRef} style={{ position: "absolute", inset: 0, opacity: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.18) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.18) 1px,transparent 1px),linear-gradient(rgba(255,255,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.06) 1px,transparent 1px)`, backgroundSize: "240px 240px,240px 240px,48px 48px,48px 48px" }} />
        {/* horizontal drafting rule scales in from the left */}
        <div ref={tx4HRef} style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 3, marginTop: -1, background: "linear-gradient(90deg,rgba(255,255,255,0.9),rgba(255,255,255,0.3))", transformOrigin: "left center", transform: "scaleX(0)" }} />
        {/* vertical drafting rule scales in from the top */}
        <div ref={tx4VRef} style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 3, marginLeft: -1, background: "linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.3))", transformOrigin: "center top", transform: "scaleY(0)" }} />
        {/* traveling measurement crosshair */}
        <div ref={tx4CrossRef} style={{ position: "absolute", left: "8%", top: "12%", width: 70, height: 70, marginLeft: -35, marginTop: -35, opacity: 0 }}>
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.85)" }} />
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.85)" }} />
          <div style={{ position: "absolute", inset: 22, border: "2px solid rgba(255,255,255,0.9)", borderRadius: "50%" }} />
        </div>
      </div>

      {/* T5 · RACK SPLIT (the liked transition, elevated) — 6 vertical camo slabs rack
          offscreen alternating up/down with staggered momentum, becoming the swatch columns. */}
      <div ref={tx5Ref} style={{ position: "absolute", inset: 0, zIndex: 61, opacity: 0, visibility: "hidden", pointerEvents: "none", display: "flex" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="tx5-slab" data-idx={String(i)} style={{ position: "relative", flex: 1, height: "100%", ...facetedCamo, borderRight: i < 5 ? "2px solid rgba(255,255,255,0.16)" : "none", willChange: "transform,opacity" }}>
            {/* white leading edge so the slab reads as the engineered // language in motion */}
            <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 4, background: "rgba(255,255,255,0.5)" }} />
          </div>
        ))}
      </div>

      {/* T6 · HALFTONE CONVERGE — colorway tiles + camo collapse inward to a single core
          (OLIPOP "merge into one"), which blooms into the CTA mark. */}
      <div ref={tx6Ref} style={{ position: "absolute", inset: 0, zIndex: 61, opacity: 0, visibility: "hidden", pointerEvents: "none", background: NEAR_BLACK }}>
        {Array.from({ length: 8 }).map((_, i) => {
          // 8 tiles in a 4x2 grid; cx/cy = displacement from frame center (used to converge)
          const col = i % 4, row = Math.floor(i / 4);
          const cellW = W / 4, cellH = 360;
          const left = col * cellW, top = 700 + row * cellH;
          const cx = (left + cellW / 2) - W / 2;
          const cy = (top + cellH / 2) - H / 2;
          return (
            <div key={i} className="tx6-tile" data-cx={String(cx)} data-cy={String(cy)} style={{ position: "absolute", left, top, width: cellW - 8, height: cellH - 8, ...facetedCamo, border: "1px solid rgba(255,255,255,0.18)", willChange: "transform,opacity" }} />
          );
        })}
        {/* center bloom core that flashes as everything lands */}
        <div ref={tx6CoreRef} style={{ position: "absolute", left: "50%", top: "50%", width: 360, height: 360, marginLeft: -180, marginTop: -180, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 38%, transparent 70%)", opacity: 0 }} />
      </div>

      {/* ══════════ GLOBAL grain ══════════ */}
      <div ref={grainRef} style={{ position: "absolute", inset: 0, zIndex: 70, pointerEvents: "none", opacity: 0.11, mixBlendMode: "overlay", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
    </Timegroup>
  );
};
