import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import {
  clamp,
  lerp,
  track,
  easeOutCubic,
  easeInOutQuad,
  outBack,
} from "./components/helpers";

import {
  highlightMilk,
  sip,
  macadamia,
  summerKit,
  lifeGrid1,
  gemDewyMacro,
  gemSkinMacro,
} from "./components/assets";

/**
 * rhode — "summer '26" eCommerce product ad. RICH RENDITION (C).
 * 1080×1920 portrait @ 30fps. One fixed 20000ms Timegroup, frame-driven onFrame.
 *
 * Content-rich kinetic premium DTC beauty ad. Keeps B's color-block energy +
 * stylized site-scroll close, but FULLER: real campaign lifestyle stills used big
 * and editorial, AND a real application VIDEO composited into a fixed well (4.5–9s).
 *
 * BEAT MAP (master ms)
 *   0      HOOK         oat cream, wordmark draw-in, "limited edition" / "summer '26"
 *   2000   HERO 1       dusty-rose block wipe, Highlight Milk push-in, "the dewy look", $28
 *   4500   APPLICATION  VIDEO-IN-FRAME (WELL 1: 220,560,640,1040) STATIONARY 4.5–9.0
 *   8700   DEWY TEXTURE gem-dewy-macro push-in + grain, "the dewy finish / skin-first glow"
 *   9500   RESULT       gem-skin-macro Ken-Burns + WELL 2 (120,1180,440,680) STATIONARY 9.8–12.8
 *                       + glossy lip-swatch grid + "glassy, lit-from-within" / "real glow, real skin"
 *   12800  RANGE        kinetic montage: sip / macadamia / summer kit + prices (ease-out settle)
 *   15500  OFFER        the summer kit, $100, limited edition (warmed oat glow)
 *   17500  CTA / scroll stylized rhode site-scroll → staggered: button → "rhode" → url
 *   20000  end
 *
 * ── VIDEO WELL (exact, non-negotiable) ──
 *   inner rect x=220, y=560, width=640, height=1040, corner radius 40.
 *   The well interior is flat cream #EDE6DA (placeholder, replaced by FFmpeg later).
 *   The premium frame (off-white rounded card, ~22px padding, warm drop shadow) sits
 *   OUTSIDE the rect. From 4.5s–9.0s the well rect has NO transform (perfectly stationary).
 *   The card animates IN before 4.5s and OUT after 9.0s via a separate entrance/exit veil.
 */

const DURATION_MS = 20000;

const SANS = "Inter, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif";
const SERIF = "'Source Serif 4', Georgia, 'Times New Roman', serif";

// ── PALETTE (brand-accurate warm neutrals) ──
const OAT = "#EDE6DA";
const WARM_WHITE = "#F5F1EA";
const CARD_CREAM = "#E9E1D3";
const ESPRESSO = "#2A2320";
const BROWN = "#5C4434";
const DUSTY_ROSE = "#E8D4D0";
const SOFT_PINK = "#E0C7C2";
const COCOA = "#4A3528";
const ESPRESSO_BG = "#33291F";
const ESPRESSO_BG_LO = "#2A2320";

const W = 1080;
const H = 1920;
const LEFT_COL = 96;

// ── VIDEO WELL — exact spec ──
const WELL_X = 220;
const WELL_Y = 560;
const WELL_W = 640;
const WELL_H = 1040;
const WELL_R = 40;
const FRAME_PAD = 22; // premium off-white frame padding OUTSIDE the well rect

// ── VIDEO WELL 2 — founder/model clip in the RESULT section (exact spec) ──
//   inner rect x=120, y=1180, w=440, h=680, radius 32. Flat cream #EDE6DA placeholder
//   (FFmpeg composites real footage later). PERFECTLY STATIONARY 9.8s–12.8s.
const W2_X = 120;
const W2_Y = 1180;
const W2_W = 440;
const W2_H = 680;
const W2_R = 32;
const W2_PAD = 18; // off-white frame padding OUTSIDE well 2

const GRAIN =
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

// ── small helpers ──
const op = (el: HTMLElement | null, v: number) => {
  if (el) el.style.opacity = String(clamp(v));
};
const set = (el: HTMLElement | null, t: string, o?: number) => {
  if (!el) return;
  el.style.transform = t;
  if (o !== undefined) el.style.opacity = String(clamp(o));
};

/** Product on a warm-cream studio card (depth via ground shadow + gloss + cream feather). */
function ProductCard({
  imgRef,
  cardRef,
  groundRef,
  glossRef,
  src,
  cardW,
  cardH,
  imgPad,
  cardStyle,
}: {
  imgRef: React.RefObject<HTMLImageElement>;
  cardRef: React.RefObject<HTMLDivElement>;
  groundRef: React.RefObject<HTMLDivElement>;
  glossRef: React.RefObject<HTMLDivElement>;
  src: string;
  cardW: number;
  cardH: number;
  imgPad: number;
  cardStyle?: React.CSSProperties;
}) {
  return (
    <div
      ref={cardRef}
      style={{
        position: "absolute",
        width: cardW,
        height: cardH,
        borderRadius: 36,
        background: CARD_CREAM,
        boxShadow:
          "0 60px 110px rgba(42,35,32,0.20), 0 18px 38px rgba(42,35,32,0.12)",
        overflow: "hidden",
        willChange: "transform, opacity",
        ...cardStyle,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: imgPad,
          left: imgPad,
          width: cardW - imgPad * 2,
          height: cardH - imgPad * 2,
          borderRadius: 22,
          background:
            // warmed: no near-white center — warm oat #E3D8C2 → deeper oat so the glow behind
            // the bottle reads as warm studio light, never a near-white hotspot.
            "radial-gradient(82% 74% at 50% 42%, #E3D8C2 0%, #D9CCB3 62%, #CFC0A6 100%)",
          boxShadow: "inset 0 2px 12px rgba(42,35,32,0.08)",
          filter: "blur(1.2px)", // soft studio backdrop so the product reads as the sharpest element
          pointerEvents: "none",
        }}
      />
      <div
        ref={groundRef}
        style={{
          position: "absolute",
          left: "50%",
          bottom: cardH * 0.16,
          width: cardW * 0.46,
          height: cardW * 0.13,
          transform: "translateX(-50%)",
          background:
            "radial-gradient(60% 100% at 50% 50%, rgba(42,35,32,0.16) 0%, rgba(42,35,32,0.07) 45%, rgba(42,35,32,0) 78%)",
          filter: "blur(12px)",
          pointerEvents: "none",
        }}
      />
      <img
        ref={imgRef}
        src={src}
        alt=""
        style={{
          position: "absolute",
          left: imgPad,
          top: imgPad,
          width: cardW - imgPad * 2,
          height: cardH - imgPad * 2,
          objectFit: "contain",
          willChange: "transform",
        }}
      />
      <div
        ref={glossRef}
        style={{
          position: "absolute",
          inset: "-20%",
          background:
            // warmed to oat #EDE6DA (237,230,218) — no near-white hotspot/halo behind the bottle
            "linear-gradient(125deg, rgba(237,230,218,0) 44%, rgba(237,230,218,0.55) 50%, rgba(237,230,218,0) 56%)",
          filter: "blur(3px)",
          pointerEvents: "none",
          opacity: 0.8,
        }}
      />
      {/* CREAM EDGE-FEATHER ON TOP — swallows the PNG's studio-white bounding box so there
          is no second white rectangle inside the card (works in headless render). */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(62% 66% at 50% 47%, rgba(231,221,204,0) 40%, rgba(228,216,196,0.6) 66%, #E3D5BE 84%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(120% 100% at 50% 35%, rgba(0,0,0,0) 62%, rgba(42,35,32,0.08) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

function gloss(el: HTMLElement | null, ms: number, start: number, end: number) {
  if (!el) return;
  const p = track(ms, start, end, easeInOutQuad);
  const tx = lerp(-130, 130, p);
  const ty = lerp(-110, 110, p);
  el.style.transform = `translate(${tx}%, ${ty}%)`;
  const vis = Math.sin(clamp(p) * Math.PI);
  el.style.opacity = String(0.95 * vis);
}

export function Video() {
  // scene refs
  const hookRef = useRef<HTMLDivElement>(null);
  const hero1Ref = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLDivElement>(null);
  const offerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // HOOK
  const hookWordRef = useRef<HTMLDivElement>(null);
  const hookRuleRef = useRef<HTMLDivElement>(null);
  const hookKickerRef = useRef<HTMLDivElement>(null);
  const hookSubRef = useRef<HTMLDivElement>(null);
  const hookDotRef = useRef<HTMLDivElement>(null);

  // HERO1
  const h1CardRef = useRef<HTMLDivElement>(null);
  const h1ImgRef = useRef<HTMLImageElement>(null);
  const h1GroundRef = useRef<HTMLDivElement>(null);
  const h1GlossRef = useRef<HTMLDivElement>(null);
  const h1CapGlintRef = useRef<HTMLDivElement>(null);
  const h1KickerRef = useRef<HTMLDivElement>(null);
  const h1TitleRef = useRef<HTMLDivElement>(null);
  const h1PriceRef = useRef<HTMLDivElement>(null);
  const h1SubRef = useRef<HTMLDivElement>(null);

  // APPLICATION (video-in-frame)
  const appCardVeilRef = useRef<HTMLDivElement>(null); // entrance/exit veil around the well
  const appShadeRef = useRef<HTMLDivElement>(null); // warm shadow under the frame card
  const appKickerRef = useRef<HTMLDivElement>(null);
  const appTitleRef = useRef<HTMLDivElement>(null);
  const appSubRef = useRef<HTMLDivElement>(null);
  const appNoteRef = useRef<HTMLDivElement>(null);
  const appTickRef = useRef<HTMLDivElement>(null);

  // DEWY TEXTURE bridge (gem-dewy-macro)
  const dewyRef = useRef<HTMLDivElement>(null);
  const dewyImgRef = useRef<HTMLImageElement>(null);
  const dewyCapRef = useRef<HTMLDivElement>(null);
  const dewySubRef = useRef<HTMLDivElement>(null);

  // RESULT / LIFESTYLE
  const rSkinRef = useRef<HTMLImageElement>(null); // gem-skin-macro Ken-Burns drift backdrop
  const rWell2WrapRef = useRef<HTMLDivElement>(null); // WELL 2 frame card group (entrance/exit only)
  const rWell2ShadeRef = useRef<HTMLDivElement>(null);
  const rSwatchRef = useRef<HTMLDivElement>(null);
  const rSwatchImgRef = useRef<HTMLImageElement>(null);
  const rTitleRef = useRef<HTMLDivElement>(null);
  const rTagRef = useRef<HTMLDivElement>(null);
  const rLineRef = useRef<HTMLDivElement>(null);
  const rKickerRef = useRef<HTMLDivElement>(null);

  // RANGE montage
  const rangeKickerRef = useRef<HTMLDivElement>(null);
  const rg1Ref = useRef<HTMLDivElement>(null);
  const rg2Ref = useRef<HTMLDivElement>(null);
  const rg3Ref = useRef<HTMLDivElement>(null);

  // OFFER
  const ofCardRef = useRef<HTMLDivElement>(null);
  const ofImgRef = useRef<HTMLImageElement>(null);
  const ofGroundRef = useRef<HTMLDivElement>(null);
  const ofGlossRef = useRef<HTMLDivElement>(null);
  const ofTitleRef = useRef<HTMLDivElement>(null);
  const ofPriceRef = useRef<HTMLDivElement>(null);
  const ofKickerRef = useRef<HTMLDivElement>(null);

  // CTA
  const ctaPageRef = useRef<HTMLDivElement>(null);
  const ctaOverlayRef = useRef<HTMLDivElement>(null);
  const ctaPlateRef = useRef<HTMLDivElement>(null);
  const ctaPlateWordRef = useRef<HTMLDivElement>(null);
  const ctaShopRef = useRef<HTMLDivElement>(null);
  const ctaWordRef = useRef<HTMLDivElement>(null);
  const ctaUrlRef = useRef<HTMLDivElement>(null);

  const fadeOutRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback((arg: any) => {
    const ms: number =
      typeof arg === "number"
        ? arg
        : arg?.ownCurrentTimeMs ?? arg?.currentTimeMs ?? arg?.timeMs ?? arg?.ms ?? 0;

    // ════════════════════════ HOOK (0–2000) — tightened: product reveal lands by ~2s ════════════════════════
    {
      const out = track(ms, 1750, 2050, easeInOutQuad);
      op(hookRef.current, ms < 2050 ? 1 : 0);
      if (hookRef.current) hookRef.current.style.visibility = ms < 2100 ? "visible" : "hidden";

      // wordmark already on-screen at frame 0 (no blank lead): starts at ~0.55 opacity
      // and resolves in; this makes the very first frame carry the mark.
      const wIn = track(ms, 0, 900, easeOutCubic);
      if (hookWordRef.current) {
        const y = lerp(20, 0, wIn) - 30 * out;
        hookWordRef.current.style.transform = `translate(-50%, calc(-50% + ${y}px)) scale(${lerp(1.015, 1, wIn)})`;
        hookWordRef.current.style.opacity = String(clamp(lerp(0.55, 1, wIn) * (1 - out)));
        hookWordRef.current.style.letterSpacing = `${lerp(22, 12, wIn)}px`;
      }
      if (hookRuleRef.current) {
        const r = track(ms, 450, 1050, easeOutCubic);
        hookRuleRef.current.style.transform = `translateX(-50%) scaleX(${r})`;
        hookRuleRef.current.style.opacity = String(clamp(r * (1 - out)));
      }
      const kIn = track(ms, 350, 850, easeOutCubic);
      set(hookKickerRef.current, `translate(-50%, ${lerp(16, 0, kIn) - 24 * out}px)`, kIn * (1 - out));
      const sIn = track(ms, 650, 1200, easeOutCubic);
      set(hookSubRef.current, `translate(-50%, ${lerp(22, 0, sIn) - 24 * out}px)`, sIn * (1 - out));
      if (hookDotRef.current) {
        const pulse = 1 + 0.18 * Math.sin(ms / 260);
        hookDotRef.current.style.transform = `translateX(-50%) scale(${pulse})`;
        hookDotRef.current.style.opacity = String(clamp(kIn * (1 - out)));
      }
    }

    // ════════════════════════ HERO 1 — Highlight Milk (2000–4500) — pulled earlier, faster hook ════════════════════════
    {
      const inP = track(ms, 2000, 2420, easeOutCubic);
      const out = track(ms, 4250, 4500, easeInOutQuad);
      const active = ms >= 1950 && ms < 4550;
      if (hero1Ref.current) hero1Ref.current.style.visibility = active ? "visible" : "hidden";
      if (hero1Ref.current) {
        const inset = lerp(100, 0, inP);
        const outset = lerp(0, 100, out);
        hero1Ref.current.style.clipPath = `inset(${outset}% 0% ${inset}% 0%)`;
        hero1Ref.current.style.opacity = "1";
      }
      const push = track(ms, 2420, 4250, easeOutCubic);
      const heroScale = lerp(1.05, 1.14, push);
      const cardBob = Math.sin(ms / 1100) * 8;
      const prodBob = Math.sin(ms / 1100 + 0.6) * 14;
      if (h1CardRef.current) {
        const landS = lerp(0.9, 1, outBack(clamp(inP), 1.4));
        const s = heroScale * landS;
        const ry = lerp(13, 7, easeOutCubic(inP)) + Math.sin(ms / 1400) * 1.5;
        const rx = lerp(0, -4, easeOutCubic(inP));
        h1CardRef.current.style.transform = `translate(-50%, calc(-50% + ${cardBob}px)) perspective(1500px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${s})`;
        h1CardRef.current.style.opacity = String(clamp(inP * (1 - out)));
        const sh = 60 + cardBob * 1.4;
        h1CardRef.current.style.boxShadow = `0 ${sh}px 120px rgba(42,35,32,0.22), 0 18px 40px rgba(42,35,32,0.13)`;
      }
      if (h1ImgRef.current) {
        const lift = -16 + prodBob;
        h1ImgRef.current.style.transform = `translateY(${lift}px) scale(${lerp(1.5, 1.6, push)})`;
        // Focus-pull fully resolves to CRISP by ~3.0s (earlier + completes), then the
        // product is the sharpest element on screen: tighter contrast + micro-sharpen,
        // and a faint behind-blur on the card gradient so the bottle reads in front.
        const focus = track(ms, 2420, 2700, easeOutCubic);
        const blurPx = lerp(2.0, 0, focus);
        const sharp = focus; // 0→1 as it resolves
        h1ImgRef.current.style.filter =
          `sepia(0.12) saturate(${lerp(1.06, 1.16, sharp)}) hue-rotate(-8deg) ` +
          `brightness(${lerp(1.02, 1.05, sharp)}) contrast(${lerp(1.0, 1.12, sharp)}) blur(${blurPx}px)`;
      }
      if (h1GroundRef.current) {
        h1GroundRef.current.style.transform = `translateX(calc(-50% + ${prodBob * 0.4}px)) scaleX(${1 + prodBob * 0.01})`;
      }
      gloss(h1GlossRef.current, ms, 2700, 4100);
      if (h1CapGlintRef.current) {
        const gp = track(ms, 2950, 3750, easeInOutQuad);
        const gx = lerp(-160, 160, gp);
        const gvis = Math.sin(clamp(gp) * Math.PI);
        h1CapGlintRef.current.style.transform = `translateX(-50%) translateX(${gx}px) rotate(18deg)`;
        h1CapGlintRef.current.style.opacity = String(0.85 * gvis * (1 - out));
      }
      const kIn = track(ms, 2300, 2750, easeOutCubic);
      set(h1KickerRef.current, `translateX(${lerp(-26, 0, kIn)}px)`, kIn * (1 - out));
      const tIn = track(ms, 2450, 3050, easeOutCubic);
      set(h1TitleRef.current, `translateY(${lerp(34, 0, tIn)}px)`, tIn * (1 - out));
      const pIn = track(ms, 3050, 3550, outBack);
      set(h1PriceRef.current, `scale(${lerp(0.7, 1, clamp(pIn))})`, track(ms, 3050, 3400) * (1 - out));
      const subIn = track(ms, 3300, 3750, easeOutCubic);
      op(h1SubRef.current, subIn * (1 - out));
    }

    // ════════════════════ APPLICATION — VIDEO-IN-FRAME (4500–9000) ════════════════════
    // The well rect (220,560,640,1040) NEVER transforms. Entrance/exit handled by a veil
    // and the surrounding copy ONLY. From 4.5s–9.0s the well is perfectly stationary.
    {
      const active = ms >= 4350 && ms < 9200;
      if (appRef.current) appRef.current.style.visibility = active ? "visible" : "hidden";
      // scene bg cross-dissolves in (3.95→4.5) and out (9.0→9.2)
      const bgIn = track(ms, 4050, 4500, easeOutCubic);
      const bgOut = track(ms, 9000, 9200, easeInOutQuad);
      op(appRef.current, bgIn * (1 - bgOut));

      // ENTRANCE/EXIT VEIL — a cream wash + slide that covers the frame BEFORE 4.5s and
      // AFTER 9.0s, so the well rect itself can stay perfectly still in the window.
      if (appCardVeilRef.current) {
        // veil opaque before 4.5 (slides up off the frame), comes back after 9.0
        const reveal = track(ms, 4150, 4500, easeOutCubic); // 1 = fully revealed
        const cover = track(ms, 9000, 9180, easeInOutQuad); // 1 = covered again
        const v = clamp(1 - reveal + cover);
        appCardVeilRef.current.style.opacity = String(v);
        const ty = lerp(-60, 0, reveal) + lerp(0, 40, cover);
        appCardVeilRef.current.style.transform = `translateY(${ty}px)`;
      }
      // soft warm shadow under the frame card — also held static in the window
      if (appShadeRef.current) {
        appShadeRef.current.style.opacity = String(0.9 * bgIn * (1 - bgOut));
      }

      // editorial copy AROUND the well (outside the rect) — pulled forward so the upper
      // area carries content the instant the beat begins (no near-empty dwell).
      const kIn = track(ms, 4250, 4700, easeOutCubic);
      set(appKickerRef.current, `translateX(${lerp(-24, 0, kIn)}px)`, kIn * (1 - bgOut));
      const tIn = track(ms, 4350, 4900, easeOutCubic);
      set(appTitleRef.current, `translateY(${lerp(34, 0, tIn)}px)`, tIn * (1 - bgOut));
      const sIn = track(ms, 5400, 5900, easeOutCubic);
      set(appSubRef.current, `translateY(${lerp(26, 0, sIn)}px)`, sIn * (1 - bgOut));
      const nIn = track(ms, 6600, 7100, easeOutCubic);
      set(appNoteRef.current, `translateY(${lerp(22, 0, nIn)}px)`, nIn * (1 - bgOut));
      // a small "applying" tick dot pulses to signal a live moment
      if (appTickRef.current) {
        const pulse = 1 + 0.3 * Math.sin(ms / 220);
        appTickRef.current.style.transform = `scale(${pulse})`;
        appTickRef.current.style.opacity = String(0.9 * kIn * (1 - bgOut));
      }
    }

    // ════════════════════ DEWY TEXTURE bridge (9000–10400) ════════════════════
    // Sensorial macro of the blush cream swirl: slow push-in + soft grain, caption
    // "the dewy finish / skin-first glow". Snaps in AFTER WELL 1's window closes (9.0),
    // so WELL 1 stays perfectly clean & stationary through 9.0s. Occupies the UPPER region
    // only (clears the WELL 2 window at y≥1180) and peels up & away by 10.4 to hand the
    // top band to the RESULT skin-macro. ~1.4s sensorial beat. No well is ever occluded.
    {
      const inP = track(ms, 9000, 9220, easeOutCubic);    // snaps in just after WELL 1 closes
      const lift = track(ms, 10050, 10500, easeInOutQuad); // peels up to reveal RESULT top band
      // FADE completes a beat sooner than the lift travel so the caption FULLY clears (no
      // half-wiped "the dewy" ghost lingering under the next beat's "THE RESULT" label).
      const fade = track(ms, 10050, 10350, easeInOutQuad);
      const active = ms >= 8980 && ms < 10520;
      if (dewyRef.current) {
        dewyRef.current.style.visibility = active ? "visible" : "hidden";
        dewyRef.current.style.opacity = String(clamp(inP * (1 - fade)));
        dewyRef.current.style.transform = `translateY(${lerp(0, -200, lift)}px)`;
      }
      if (dewyImgRef.current) {
        // slow continuous push-in through the whole beat
        const push = track(ms, 9000, 10400, easeOutCubic);
        const s = lerp(1.12, 1.26, push);
        const px = lerp(1.5, -2, push);
        dewyImgRef.current.style.transform = `translate(${px}%, 0%) scale(${s})`;
      }
      const cIn = track(ms, 9180, 9560, easeOutCubic);
      set(dewyCapRef.current, `translate(-50%, ${lerp(26, 0, cIn)}px)`, cIn * (1 - fade));
      const sIn = track(ms, 9360, 9720, easeOutCubic);
      set(dewySubRef.current, `translate(-50%, ${lerp(20, 0, sIn)}px)`, sIn * (1 - fade));
    }

    // ════════════════════ RESULT / LIFESTYLE (9500–12800) — RICH redesign ════════════════════
    // Lit-from-within glowing-skin macro drift (gem-skin-macro) + WELL 2 founder clip
    // (STATIONARY 9.8–12.8) + glossy lip-swatch grid + result copy. Alive, not static.
    {
      // reveal completes by 9.75 so WELL 2 is fully composited & dead-still from 9.8.
      // exit held until 12.8 so WELL 2 is perfectly stationary through its full window.
      const inP = track(ms, 9350, 9700, easeOutCubic);
      const out = track(ms, 12800, 13080, easeInOutQuad);
      const active = ms >= 9300 && ms < 13130;
      if (resultRef.current) resultRef.current.style.visibility = active ? "visible" : "hidden";
      if (resultRef.current) {
        const inset = lerp(100, 0, inP);
        const outset = lerp(0, 100, out);
        resultRef.current.style.clipPath = `inset(${outset}% 0% ${inset}% 0%)`;
      }
      // Ken-Burns drift on the glowing-skin macro backdrop (full-bleed top)
      const kb = track(ms, 9450, 12800, (t) => t);
      if (rSkinRef.current) {
        const s = lerp(1.1, 1.22, kb);
        const px = lerp(-3, 4, kb);
        const py = lerp(-2, 3, kb);
        rSkinRef.current.style.transform = `translate(${px}%, ${py}%) scale(${s})`;
      }
      // headline / kicker / line copy. The "THE RESULT" label holds back until the dewy caption
      // has FULLY faded (dewy fade completes ~10350) so there's never a double-text ghost.
      const kIn = track(ms, 10350, 10750, easeOutCubic);
      set(rKickerRef.current, `translateX(${lerp(-22, 0, kIn)}px)`, kIn * (1 - out));
      const tIn = track(ms, 10500, 11050, easeOutCubic);
      set(rTitleRef.current, `translateY(${lerp(34, 0, tIn)}px)`, tIn * (1 - out));
      // subline enters AFTER the headline has fully settled (headline lands ~11050) so the two
      // never read as one stacked block — clear stagger + clear vertical gap.
      const lIn = track(ms, 11100, 11550, easeOutCubic);
      set(rLineRef.current, `translateY(${lerp(20, 0, lIn)}px)`, lIn * (1 - out));

      // WELL 2 — frame card entrance/exit ONLY (the well rect itself never transforms).
      // FAST ~0.15s fade landing AT 9.8s so the card frame is NEVER visible as an empty cream
      // rect held before its video window — it snaps in exactly when the footage composites in.
      if (rWell2WrapRef.current) {
        const cardIn = track(ms, 9650, 9800, easeOutCubic);
        rWell2WrapRef.current.style.opacity = String(clamp(cardIn * (1 - out)));
        // already settled at land — no exit transform before out, dead-still in the locked window
        rWell2WrapRef.current.style.transform = `translateY(0px)`;
      }
      if (rWell2ShadeRef.current) {
        rWell2ShadeRef.current.style.opacity = String(0.85 * clamp(track(ms, 9650, 9800, easeOutCubic) * (1 - out)));
      }

      // glossy lip-swatch grid — slides up + settles (right of WELL 2), own subtle Ken-Burns
      if (rSwatchRef.current) {
        const sIn = track(ms, 10000, 10550, easeOutCubic);
        const lift = lerp(64, 0, sIn);
        const land = lerp(0.94, 1, outBack(clamp(sIn), 1.3));
        rSwatchRef.current.style.transform = `translateY(${lift}px) scale(${land})`;
        rSwatchRef.current.style.opacity = String(clamp(sIn * (1 - out)));
      }
      if (rSwatchImgRef.current) {
        const s = lerp(1.04, 1.1, kb);
        rSwatchImgRef.current.style.transform = `scale(${s})`;
      }
      const tagIn = track(ms, 11000, 11500, easeOutCubic);
      set(rTagRef.current, `translateY(${lerp(24, 0, tagIn)}px)`, tagIn * (1 - out));
    }

    // ════════════════════ RANGE — kinetic montage (12500–15500) ════════════════════
    {
      // wipe-in fires only AFTER WELL 2's stationary window closes (12.8) so the well is never
      // occluded mid-window. The wipe (12.8→13.3) covers the result as it exits — no blank frame.
      const inP = track(ms, 12800, 13300, easeOutCubic);
      const out = track(ms, 15200, 15500, easeInOutQuad);
      const active = ms >= 12780 && ms < 15550;
      if (rangeRef.current) rangeRef.current.style.visibility = active ? "visible" : "hidden";
      if (rangeRef.current) {
        const inset = lerp(100, 0, inP);
        const outset = lerp(0, 100, out);
        rangeRef.current.style.clipPath = `inset(0% ${inset}% 0% ${outset}%)`; // wipe from right
      }
      const kIn = track(ms, 12950, 13350, easeOutCubic);
      set(rangeKickerRef.current, `translateX(${lerp(-22, 0, kIn)}px)`, kIn * (1 - out));
      // three product tiles cascade in DURING the wipe (the wipe clip reveals them progressively)
      // so the beat fills fast — no near-empty cream frame after the wipe completes at 13.3.
      const tiles: Array<[React.RefObject<HTMLDivElement>, number]> = [
        [rg1Ref, 13050],
        [rg2Ref, 13150],
        [rg3Ref, 13250],
      ];
      // EASE-OUT SETTLE: the grid's ambient bob decelerates to a dead stop over 14.3→15.1
      // (before the wipe fires at 15.2) so the montage doesn't read as "near-linear into the
      // wipe" — it visibly settles, then the transition takes a stationary composition.
      const settleStop = 1 - track(ms, 14300, 15100, easeOutCubic); // 1→0 (motion damping)
      tiles.forEach(([ref, t0]) => {
        if (!ref.current) return;
        const a = track(ms, t0, t0 + 520, easeOutCubic);
        const land = lerp(0.9, 1, outBack(clamp(a), 1.5));
        const lift = lerp(64, 0, a);
        const bob = Math.sin((ms - t0) / 900) * 5 * settleStop;
        ref.current.style.transform = `translateY(${lift + bob}px) scale(${land})`;
        ref.current.style.opacity = String(clamp(a * (1 - out)));
      });
    }

    // ════════════════════════ OFFER — The Summer Kit (15500–17500) ════════════════════════
    {
      const inP = track(ms, 15500, 15920, easeOutCubic);
      const out = track(ms, 17200, 17500, easeInOutQuad);
      const active = ms >= 15450 && ms < 17550;
      if (offerRef.current) offerRef.current.style.visibility = active ? "visible" : "hidden";
      if (offerRef.current) {
        const inset = lerp(100, 0, inP);
        const outset = lerp(0, 100, out);
        offerRef.current.style.clipPath = `inset(${inset}% 0% ${outset}% 0%)`;
      }
      const push = track(ms, 15920, 17200, easeOutCubic);
      const cardBob = Math.sin(ms / 900 + 3) * 7;
      const prodBob = Math.sin(ms / 900 + 3.6) * 11;
      if (ofCardRef.current) {
        const s = lerp(1.0, 1.06, push) * lerp(0.92, 1, outBack(clamp(inP), 1.4));
        const settleRot = lerp(4.5, 1, easeOutCubic(inP));
        ofCardRef.current.style.transform = `translate(-50%, calc(-50% + ${cardBob}px)) perspective(1700px) rotate(${settleRot}deg) scale(${s})`;
        ofCardRef.current.style.opacity = String(clamp(inP * (1 - out)));
        const sh = 56 + cardBob * 1.4;
        ofCardRef.current.style.boxShadow = `0 ${sh}px 110px rgba(42,35,32,0.20), 0 16px 36px rgba(42,35,32,0.12)`;
      }
      if (ofImgRef.current) {
        ofImgRef.current.style.transform = `translateY(${prodBob}px) scale(${lerp(1.02, 1.05, push)})`;
        ofImgRef.current.style.filter = "sepia(0.22) saturate(1.18) hue-rotate(-6deg) contrast(1.04) brightness(1.01)";
      }
      if (ofGroundRef.current) ofGroundRef.current.style.transform = `translateX(calc(-50% + ${prodBob * 0.3}px))`;
      gloss(ofGlossRef.current, ms, 16000, 17000);
      const kIn = track(ms, 15850, 16300, easeOutCubic);
      set(ofKickerRef.current, `translateX(${lerp(-24, 0, kIn)}px)`, kIn * (1 - out));
      const tIn = track(ms, 16000, 16550, easeOutCubic);
      set(ofTitleRef.current, `translateY(${lerp(30, 0, tIn)}px)`, tIn * (1 - out));
      // $100 resolves EARLIER + faster so it is fully solid (not ghosted) through 16–17s.
      const pIn = track(ms, 16200, 16650, outBack);
      set(ofPriceRef.current, `scale(${lerp(0.72, 1, clamp(pIn))})`, track(ms, 16200, 16480) * (1 - out));
    }

    // ════════════════════════ CTA — stylized site scroll (17500–20000) ════════════════════════
    {
      const inP = track(ms, 17500, 17850, easeOutCubic);
      const active = ms >= 17450;
      if (ctaRef.current) ctaRef.current.style.visibility = active ? "visible" : "hidden";
      op(ctaRef.current, inP);
      const scroll = track(ms, 17650, 18750, easeInOutQuad);
      if (ctaPageRef.current) {
        ctaPageRef.current.style.transform = `translateY(${lerp(0, -980, scroll)}px)`;
      }
      // ESPRESSO BLOCK WIPE — sweeps up over the scroll page (designed transition, no
      // washed-out white). Cover→reveal sped ~30%: plate covers in 280ms, the warm CTA
      // overlay starts riding up BEFORE the plate fully settles, so no single frame is a
      // flat solid espresso block (the wordmark also rides the plate).
      const plateWipe = track(ms, 18550, 18830, easeInOutQuad);
      if (ctaPlateRef.current) {
        ctaPlateRef.current.style.transform = `translateY(${lerp(100, 0, plateWipe)}%)`;
      }
      // wordmark rides up WITH the plate so the espresso block never reads as a dead flat fill
      if (ctaPlateWordRef.current) {
        const ride = track(ms, 18600, 18900, easeOutCubic);
        const fade = track(ms, 18900, 19050, easeInOutQuad);
        ctaPlateWordRef.current.style.transform = `translate(-50%, calc(-50% + ${lerp(120, 0, ride)}px))`;
        ctaPlateWordRef.current.style.opacity = String(clamp(ride * (1 - fade)) * 0.9);
      }
      // CONTENT-TO-CONTENT WIPE: the cream CTA overlay rides up EARLIER and overlaps the plate
      // (starts 18620, before the plate has finished covering at 18830), with an ease-out-BACK
      // overshoot-settle so it slides past 0% and rocks back. Its content (pill + wordmark + url)
      // is ALREADY visible while the overlay's leading edge sweeps in — so the incoming content
      // meets the outgoing scene with no empty-cream gap. No frame is ever a blank wash.
      const overlayWipe = track(ms, 18620, 19060, (t) => outBack(t, 1.1));
      if (ctaOverlayRef.current) {
        ctaOverlayRef.current.style.transform = `translateY(${lerp(100, 0, overlayWipe)}%)`;
        ctaOverlayRef.current.style.opacity = "1";
      }
      // raw 0→1 progress of the overlay's leading edge (for tying content to the sweep)
      const overlayRaw = track(ms, 18620, 19000, easeOutCubic);
      // ── STAGGERED CTA LOCKUP (~4-frame / ~130ms beats) ──
      //   1) button presses + settles (18620→19000)  →  2) "rhode" wordmark draws (19130→)
      //   →  3) rhodeskin.com url fades (19330→). Each element clearly lands before the next.
      if (ctaShopRef.current) {
        // The pill is FULLY FORMED as the overlay carries it up — opacity ramps with the sweep so
        // the cream plate is never blank, then a press-settle resolves FIRST in the lockup.
        const press = track(ms, 18620, 19000, easeOutCubic);
        const finalScale = lerp(0.92, 1.0, outBack(clamp(press), 1.2));
        ctaShopRef.current.style.transform = `scale(${finalScale})`;
        ctaShopRef.current.style.opacity = String(clamp(track(ms, 18620, 18860, easeOutCubic)));
        // fill color settle: cocoa → espresso as it presses in
        const fill = track(ms, 18620, 19000, easeOutCubic);
        const r = Math.round(lerp(0x4A, 0x24, fill));
        const g = Math.round(lerp(0x35, 0x1D, fill));
        const b = Math.round(lerp(0x28, 0x19, fill));
        ctaShopRef.current.style.background = `rgb(${r},${g},${b})`;
        const bloom = track(ms, 18680, 19200, easeOutCubic);
        const by = lerp(14, 36, bloom);
        const bb = lerp(28, 70, bloom);
        ctaShopRef.current.style.boxShadow = `0 ${by}px ${bb}px rgba(42,35,32,${lerp(0.16, 0.32, bloom)})`;
      }
      // wordmark begins ~130ms AFTER the button has settled
      const wIn = track(ms, 19130, 19520, easeOutCubic);
      if (ctaWordRef.current) {
        ctaWordRef.current.style.opacity = String(clamp(wIn));
        ctaWordRef.current.style.letterSpacing = `${lerp(24, 12, wIn)}px`;
      }
      // url fades ~130ms after the wordmark begins
      const uIn = track(ms, 19330, 19720, easeOutCubic);
      op(ctaUrlRef.current, uIn);
      void overlayRaw;
    }

    // Very subtle end resolve only — the final frame must KEEP the crisp espresso CTA
    // lockup (a full white-out washed the pill to muddy gray on the last frame).
    if (fadeOutRef.current) {
      fadeOutRef.current.style.opacity = String(0.1 * track(ms, 19850, 20000, easeInOutQuad));
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration={`${DURATION_MS}ms`}
      onFrame={handleFrame as any}
      workbench
      className="w-[1080px] h-[1920px] relative overflow-hidden"
      style={{ background: OAT }}
    >
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: OAT }} />

      {/* ══════════════════ HOOK ══════════════════ */}
      <div
        ref={hookRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          background: `radial-gradient(130% 100% at 50% 38%, ${WARM_WHITE} 0%, ${OAT} 70%)`,
        }}
      >
        <div style={{ position: "absolute", top: 70, left: 70, width: 54, height: 54, borderLeft: `2px solid ${BROWN}55`, borderTop: `2px solid ${BROWN}55` }} />
        <div style={{ position: "absolute", top: 70, right: 70, width: 54, height: 54, borderRight: `2px solid ${BROWN}55`, borderTop: `2px solid ${BROWN}55` }} />
        <div style={{ position: "absolute", bottom: 70, left: 70, width: 54, height: 54, borderLeft: `2px solid ${BROWN}55`, borderBottom: `2px solid ${BROWN}55` }} />
        <div style={{ position: "absolute", bottom: 70, right: 70, width: 54, height: 54, borderRight: `2px solid ${BROWN}55`, borderBottom: `2px solid ${BROWN}55` }} />

        <div ref={hookKickerRef} style={{ position: "absolute", left: "50%", top: 770, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 500, fontSize: 30, letterSpacing: 12, textTransform: "uppercase", color: BROWN }}>
          limited edition
        </div>
        <div ref={hookWordRef} style={{ position: "absolute", left: "50%", top: "50%", fontFamily: SANS, fontWeight: 300, fontSize: 196, letterSpacing: 12, color: ESPRESSO, lineHeight: 1 }}>
          rhode
        </div>
        <div ref={hookRuleRef} style={{ position: "absolute", left: "50%", top: 1075, width: 280, height: 2, background: BROWN, transformOrigin: "center", transform: "translateX(-50%) scaleX(0)" }} />
        <div ref={hookSubRef} style={{ position: "absolute", left: "50%", top: 1110, transform: "translateX(-50%)", fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 60, color: BROWN }}>
          summer ’26
        </div>
        <div ref={hookDotRef} style={{ position: "absolute", left: "50%", top: 740, width: 9, height: 9, borderRadius: "50%", background: SOFT_PINK, transform: "translateX(-50%)" }} />
      </div>

      {/* ══════════════════ HERO 1 — Highlight Milk / dusty rose ══════════════════ */}
      <div
        ref={hero1Ref}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 11,
          background: `linear-gradient(158deg, ${DUSTY_ROSE} 0%, ${DUSTY_ROSE} 42%, ${SOFT_PINK} 100%)`,
          visibility: "hidden",
        }}
      >
        <ProductCard imgRef={h1ImgRef} cardRef={h1CardRef} groundRef={h1GroundRef} glossRef={h1GlossRef} src={highlightMilk} cardW={720} cardH={820} imgPad={44} cardStyle={{ left: "50%", top: 1000 }} />
        <div ref={h1CapGlintRef} style={{ position: "absolute", left: "50%", top: 540, width: 360, height: 220, transform: "translateX(-50%)", background: "linear-gradient(120deg, rgba(237,230,218,0) 42%, rgba(237,230,218,0.6) 50%, rgba(237,230,218,0) 58%)", filter: "blur(2px)", pointerEvents: "none", opacity: 0, zIndex: 5 }} />
        <div ref={h1KickerRef} style={{ position: "absolute", left: LEFT_COL, top: 220, fontFamily: SANS, fontWeight: 500, fontSize: 26, letterSpacing: 9, textTransform: "uppercase", color: BROWN }}>
          highlight milk
        </div>
        <div ref={h1TitleRef} style={{ position: "absolute", left: LEFT_COL, top: 266, fontFamily: SANS, fontWeight: 300, fontSize: 132, lineHeight: 0.9, letterSpacing: -1, color: ESPRESSO }}>
          the dewy
          <br />
          look
        </div>
        <div ref={h1PriceRef} style={{ position: "absolute", left: LEFT_COL, top: 1500, fontFamily: SERIF, fontWeight: 400, fontSize: 76, color: ESPRESSO, transformOrigin: "left center" }}>
          $28
        </div>
        <div ref={h1SubRef} style={{ position: "absolute", left: LEFT_COL, top: 1602, fontFamily: SANS, fontWeight: 500, fontSize: 26, letterSpacing: 4, color: COCOA, opacity: 0 }}>
          multipurpose luminizer
        </div>
      </div>

      {/* ══════════════════ APPLICATION — VIDEO-IN-FRAME ══════════════════ */}
      <div
        ref={appRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 12,
          // toned: oat-cream canvas with dusty rose only as a soft accent at the top — drops the
          // cool/saturated SOFT_PINK end that read too pink as a full-bleed.
          background: `linear-gradient(160deg, ${DUSTY_ROSE} 0%, ${OAT} 52%, ${OAT} 100%)`,
          visibility: "hidden",
          opacity: 0,
        }}
      >
        {/* faint editorial corner marks for density */}
        <div style={{ position: "absolute", top: 60, right: 64, width: 48, height: 48, borderRight: `2px solid ${BROWN}40`, borderTop: `2px solid ${BROWN}40` }} />
        <div style={{ position: "absolute", bottom: 60, right: 64, width: 48, height: 48, borderRight: `2px solid ${BROWN}40`, borderBottom: `2px solid ${BROWN}40` }} />

        {/* WARM DROP SHADOW under the frame card (held static in window) */}
        <div
          ref={appShadeRef}
          style={{
            position: "absolute",
            left: WELL_X - FRAME_PAD,
            top: WELL_Y - FRAME_PAD + 30,
            width: WELL_W + FRAME_PAD * 2,
            height: WELL_H + FRAME_PAD * 2,
            borderRadius: WELL_R + FRAME_PAD,
            boxShadow: "0 70px 140px rgba(42,35,32,0.30), 0 28px 60px rgba(42,35,32,0.18)",
            background: "transparent",
            opacity: 0,
            pointerEvents: "none",
          }}
        />

        {/* PREMIUM FRAME CARD — soft off-white rounded card, ~22px padding OUTSIDE the well.
            STATIC: never transformed. */}
        <div
          style={{
            position: "absolute",
            left: WELL_X - FRAME_PAD,
            top: WELL_Y - FRAME_PAD,
            width: WELL_W + FRAME_PAD * 2,
            height: WELL_H + FRAME_PAD * 2,
            borderRadius: WELL_R + FRAME_PAD,
            background: "#F0EADF",
            boxShadow: "inset 0 1px 0 rgba(240,234,223,0.8), inset 0 0 0 1px rgba(74,53,40,0.10)",
          }}
        >
          {/* THE WELL — exact rect 220,560,640,1040, radius 40, flat cream placeholder. STATIC. */}
          <div
            style={{
              position: "absolute",
              left: FRAME_PAD,
              top: FRAME_PAD,
              width: WELL_W,
              height: WELL_H,
              borderRadius: WELL_R,
              background: OAT, // warmed near-white panel → oat cream #EDE6DA
              overflow: "hidden",
            }}
          >
            {/* subtle interior vignette so the cream isn't a dead flat block (still no movement) */}
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(110% 90% at 50% 35%, rgba(237,230,218,0.5) 0%, rgba(74,53,40,0.08) 100%)" }} />
            {/* tiny corner timecode-style chip for "live video" feel (static) */}
            <div style={{ position: "absolute", left: 22, top: 22, display: "flex", alignItems: "center", gap: 10 }}>
              <div ref={appTickRef} style={{ width: 12, height: 12, borderRadius: "50%", background: "#C96B6B", opacity: 0 }} />
              <span style={{ fontFamily: SANS, fontSize: 18, letterSpacing: 3, color: BROWN, textTransform: "uppercase" }}>applying</span>
            </div>
          </div>
        </div>

        {/* ENTRANCE/EXIT VEIL — cream wash over the frame, only outside the window */}
        <div
          ref={appCardVeilRef}
          style={{
            position: "absolute",
            left: WELL_X - FRAME_PAD - 6,
            top: WELL_Y - FRAME_PAD - 6,
            width: WELL_W + FRAME_PAD * 2 + 12,
            height: WELL_H + FRAME_PAD * 2 + 12,
            borderRadius: WELL_R + FRAME_PAD,
            background: `linear-gradient(160deg, ${DUSTY_ROSE} 0%, ${OAT} 80%)`,
            opacity: 1,
            pointerEvents: "none",
          }}
        />

        {/* editorial copy AROUND the well (outside the rect). Well right edge = 860; copy lives
            in the right gutter 900→1020. Title above the well, sub/note in the right gutter. */}
        <div ref={appKickerRef} style={{ position: "absolute", left: WELL_X, top: 150, fontFamily: SANS, fontWeight: 500, fontSize: 24, letterSpacing: 8, textTransform: "uppercase", color: BROWN }}>
          how it’s applied
        </div>
        <div ref={appTitleRef} style={{ position: "absolute", left: WELL_X, top: 196, fontFamily: SANS, fontWeight: 300, fontSize: 96, lineHeight: 0.92, letterSpacing: -1, color: ESPRESSO }}>
          the dewy look
        </div>

        {/* right-gutter editorial stack — BOTH items share ONE left axis (912) and ONE box
            width (148) with identical left text-alignment, so their left edges align exactly
            against the card's right edge (well right = 860, frame edge = 882 → 30px gutter). */}
        <div ref={appSubRef} style={{ position: "absolute", left: 906, top: 720, width: 154, textAlign: "left", fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 40, lineHeight: 1.08, color: COCOA }}>
          peptide
          <br />
          lip tint
        </div>
        <div ref={appNoteRef} style={{ position: "absolute", left: 912, top: 1300, width: 148, textAlign: "left", fontFamily: SANS, fontWeight: 500, fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: BROWN, lineHeight: 1.55 }}>
          skin first,
          <br />
          makeup
          <br />
          second
        </div>
      </div>

      {/* ══════════════════ DEWY TEXTURE bridge (gem-dewy-macro) ══════════════════ */}
      <div
        ref={dewyRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: W,
          height: 1120, // UPPER region only — clears the WELL 2 window (y≥1180)
          zIndex: 18, // ABOVE app + result during the handoff, peels up & away by 10.4
          background: SOFT_PINK,
          visibility: "hidden",
          opacity: 0,
          overflow: "hidden",
          willChange: "transform, opacity",
        }}
      >
        <img ref={dewyImgRef} src={gemDewyMacro} alt="" style={{ position: "absolute", left: 0, top: 0, width: "100%", height: 1380, objectFit: "cover", objectPosition: "50% 40%", willChange: "transform", filter: "saturate(1.08) contrast(1.04) brightness(1.02)" }} />
        {/* soft grain + warm vignette to make the macro feel sensorial/tactile */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: GRAIN, backgroundSize: "150px 150px", opacity: 0.09, mixBlendMode: "overlay", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(120% 100% at 50% 42%, rgba(0,0,0,0) 50%, rgba(74,53,40,0.3) 100%)" }} />
        {/* base scrim so caption reads */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 520, background: "linear-gradient(to bottom, rgba(74,53,40,0) 0%, rgba(74,53,40,0.5) 100%)", pointerEvents: "none" }} />
        <div ref={dewyCapRef} style={{ position: "absolute", left: "50%", top: 880, transform: "translateX(-50%)", fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 82, color: WARM_WHITE, textShadow: "0 2px 20px rgba(42,35,32,0.55)", whiteSpace: "nowrap" }}>
          the dewy finish
        </div>
        <div ref={dewySubRef} style={{ position: "absolute", left: "50%", top: 1012, transform: "translateX(-50%)", fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: 8, textTransform: "uppercase", color: WARM_WHITE, textShadow: "0 2px 14px rgba(42,35,32,0.6)", whiteSpace: "nowrap" }}>
          skin-first glow
        </div>
      </div>

      {/* ══════════════════ RESULT / LIFESTYLE — RICH redesign ══════════════════ */}
      <div
        ref={resultRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 13,
          background: `linear-gradient(to bottom, ${COCOA} 0%, ${ESPRESSO} 46%, ${ESPRESSO_BG_LO} 100%)`,
          visibility: "hidden",
        }}
      >
        {/* GLOWING-SKIN MACRO backdrop (top band) with Ken-Burns drift — lit-from-within */}
        <div style={{ position: "absolute", top: 0, left: 0, width: W, height: 760, overflow: "hidden" }}>
          <img ref={rSkinRef} src={gemSkinMacro} alt="" style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 44%", willChange: "transform", filter: "saturate(1.08) sepia(0.06) hue-rotate(-4deg) brightness(1.05) contrast(1.03)" }} />
          {/* warm soft-light wash to keep it in the espresso world */}
          <div style={{ position: "absolute", inset: 0, background: COCOA, mixBlendMode: "soft-light", opacity: 0.42, pointerEvents: "none" }} />
          {/* base scrim so it melts into the espresso band */}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, rgba(42,35,32,0) 44%, rgba(42,35,32,0.6) 84%, ${ESPRESSO} 100%)` }} />
          <div ref={rKickerRef} style={{ position: "absolute", left: LEFT_COL, top: 80, fontFamily: SANS, fontWeight: 600, fontSize: 24, letterSpacing: 9, textTransform: "uppercase", color: WARM_WHITE, textShadow: "0 2px 16px rgba(42,35,32,0.55)" }}>
            the result
          </div>
        </div>

        {/* headline on the espresso band — serif italic. Width-capped + clear line-height so the
            three visual lines ("glassy," / "lit-from-" / "within") have breathing room and the
            descenders of "within" never reach the subline below. */}
        <div ref={rTitleRef} style={{ position: "absolute", left: LEFT_COL, top: 800, width: 900, fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 80, lineHeight: 1.14, color: WARM_WHITE, textShadow: "0 2px 24px rgba(0,0,0,0.4)" }}>
          glassy,
          <br />
          lit-from-within
        </div>
        {/* small supporting line — sits cleanly BELOW the headline descenders (clear vertical gap) */}
        <div ref={rLineRef} style={{ position: "absolute", left: LEFT_COL + 2, top: 1108, fontFamily: SANS, fontWeight: 500, fontSize: 28, letterSpacing: 5, color: SOFT_PINK }}>
          real glow, real skin
        </div>

        {/* ── WELL 2 — founder/model clip. EXACT rect 120,1180,440,680, radius 32.
             Premium off-white frame OUTSIDE the rect + warm shadow. Interior flat cream
             #EDE6DA. STATIONARY 9.8–12.8 (only the wrapper's entrance settles, before 9.8). ── */}
        {/* warm drop shadow under the frame card */}
        <div
          ref={rWell2ShadeRef}
          style={{
            position: "absolute",
            left: W2_X - W2_PAD,
            top: W2_Y - W2_PAD + 26,
            width: W2_W + W2_PAD * 2,
            height: W2_H + W2_PAD * 2,
            borderRadius: W2_R + W2_PAD,
            boxShadow: "0 60px 120px rgba(0,0,0,0.5), 0 24px 50px rgba(0,0,0,0.35)",
            opacity: 0,
            pointerEvents: "none",
          }}
        />
        <div ref={rWell2WrapRef} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, opacity: 0, willChange: "opacity, transform" }}>
          {/* premium off-white frame card OUTSIDE the well rect */}
          <div
            style={{
              position: "absolute",
              left: W2_X - W2_PAD,
              top: W2_Y - W2_PAD,
              width: W2_W + W2_PAD * 2,
              height: W2_H + W2_PAD * 2,
              borderRadius: W2_R + W2_PAD,
              background: "#F0EADF",
              boxShadow: "inset 0 1px 0 rgba(240,234,223,0.9), inset 0 0 0 1px rgba(74,53,40,0.10)",
            }}
          >
            {/* THE WELL 2 RECT — exact 120,1180,440,680, radius 32, flat cream placeholder */}
            <div
              style={{
                position: "absolute",
                left: W2_PAD,
                top: W2_PAD,
                width: W2_W,
                height: W2_H,
                borderRadius: W2_R,
                background: "#EDE6DA",
                overflow: "hidden",
              }}
            >
              {/* subtle interior vignette so the cream isn't a dead flat block (no movement) */}
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(110% 90% at 50% 36%, rgba(237,230,218,0.45) 0%, rgba(74,53,40,0.10) 100%)" }} />
              {/* small static "founder" chip — live-footage feel */}
              <div style={{ position: "absolute", left: 20, top: 20, display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#C96B6B" }} />
                <span style={{ fontFamily: SANS, fontSize: 16, letterSpacing: 3, color: BROWN, textTransform: "uppercase" }}>founder</span>
              </div>
            </div>
          </div>
        </div>

        {/* glossy lip-swatch grid — RIGHT of WELL 2 (well right edge = 560), framed editorial */}
        <div ref={rSwatchRef} style={{ position: "absolute", left: 600, top: 1180, width: 420, borderRadius: 26, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.45)", border: `1px solid ${OAT}55`, willChange: "transform, opacity", opacity: 0 }}>
          <div style={{ position: "relative", width: "100%", height: 540, overflow: "hidden" }}>
            <img ref={rSwatchImgRef} src={lifeGrid1} alt="" style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", willChange: "transform" }} />
            {/* oat-cream grid dividers (re-tint near-white seams to oat) */}
            <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 3, transform: "translateY(-50%)", background: OAT, opacity: 0.9, pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 3, transform: "translateX(-50%)", background: OAT, opacity: 0.9, pointerEvents: "none" }} />
          </div>
        </div>
        <div ref={rTagRef} style={{ position: "absolute", left: 600, top: 1750, width: 420, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 22, letterSpacing: 5, textTransform: "uppercase", color: SOFT_PINK, whiteSpace: "nowrap" }}>
          eight glossy shades
        </div>
      </div>

      {/* ══════════════════ RANGE — kinetic montage ══════════════════ */}
      <div
        ref={rangeRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 14,
          background: `linear-gradient(165deg, ${WARM_WHITE} 0%, ${OAT} 100%)`,
          visibility: "hidden",
        }}
      >
        {/* eyebrow on ONE line, left-aligned to headline optical margin, clear leading below */}
        <div ref={rangeKickerRef} style={{ position: "absolute", left: LEFT_COL + 3, top: 150, fontFamily: SANS, fontWeight: 600, fontSize: 26, letterSpacing: 9, textTransform: "uppercase", color: BROWN, whiteSpace: "nowrap" }}>
          the range
        </div>
        <div style={{ position: "absolute", left: LEFT_COL, top: 224, fontFamily: SANS, fontWeight: 300, fontSize: 100, lineHeight: 0.94, letterSpacing: -1, color: ESPRESSO }}>
          warm-weather
          <br />
          essentials
        </div>

        {/* ── balanced 2-column bento: two equal product tiles (top row) + wide kit (bottom).
            Cards span the full content width (70→1010). Vertical metrics tightened: label sits
            tight under the card, price tight under the label; the largest gap is headline→grid. */}

        {/* tile 1 — sip pocket blush (product card on oat cream) */}
        <div ref={rg1Ref} style={{ position: "absolute", left: 70, top: 540, width: 448, willChange: "transform, opacity", opacity: 0 }}>
          <div style={{ width: 448, height: 540, borderRadius: 30, background: CARD_CREAM, boxShadow: "0 36px 70px rgba(42,35,32,0.20)", overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", inset: 26, borderRadius: 20, background: "radial-gradient(80% 70% at 50% 42%, #E3D8C2 0%, #D6C8AE 100%)" }} />
            <img src={sip} alt="" style={{ position: "absolute", inset: 40, width: "calc(100% - 80px)", height: "calc(100% - 80px)", objectFit: "contain" }} />
          </div>
          <div style={{ marginTop: 18, fontFamily: SANS, fontWeight: 500, fontSize: 32, letterSpacing: 0.3, color: ESPRESSO }}>pocket blush</div>
          <div style={{ marginTop: 2, fontFamily: SERIF, fontSize: 38, color: COCOA }}>$22</div>
        </div>

        {/* tile 2 — peptide lip tint · macadamia (clean brown tube on OAT CREAM, not cool gray) */}
        <div ref={rg2Ref} style={{ position: "absolute", left: 562, top: 540, width: 448, willChange: "transform, opacity", opacity: 0 }}>
          <div style={{ width: 448, height: 540, borderRadius: 30, background: CARD_CREAM, boxShadow: "0 36px 70px rgba(42,35,32,0.20)", overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", inset: 26, borderRadius: 20, background: "radial-gradient(80% 70% at 50% 42%, #E3D8C2 0%, #D6C8AE 100%)" }} />
            <img src={macadamia} alt="" style={{ position: "absolute", inset: 44, width: "calc(100% - 88px)", height: "calc(100% - 88px)", objectFit: "contain", filter: "saturate(1.06) contrast(1.04)" }} />
          </div>
          <div style={{ marginTop: 18, fontFamily: SANS, fontWeight: 500, fontSize: 32, letterSpacing: 0.3, color: ESPRESSO }}>tint · macadamia</div>
          <div style={{ marginTop: 2, fontFamily: SERIF, fontSize: 38, color: COCOA }}>$20</div>
        </div>

        {/* tile 3 — summer kit (wide, bottom) — full content width, right column populated */}
        <div ref={rg3Ref} style={{ position: "absolute", left: 70, top: 1210, width: 940, willChange: "transform, opacity", opacity: 0 }}>
          <div style={{ width: 940, height: 470, borderRadius: 30, background: CARD_CREAM, boxShadow: "0 40px 80px rgba(42,35,32,0.22)", overflow: "hidden", position: "relative", display: "flex", alignItems: "center" }}>
            <div style={{ position: "absolute", inset: 24, borderRadius: 22, background: "radial-gradient(80% 80% at 42% 50%, #E3D8C2 0%, #D6C8AE 100%)" }} />
            <img src={summerKit} alt="" style={{ position: "absolute", left: 30, top: 24, width: 540, height: "calc(100% - 48px)", objectFit: "contain", filter: "sepia(0.18) saturate(1.14) hue-rotate(-6deg) contrast(1.03)" }} />
            <div style={{ position: "absolute", right: 56, top: "50%", transform: "translateY(-50%)", textAlign: "right" }}>
              <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 24, letterSpacing: 6, textTransform: "uppercase", color: BROWN }}>limited edition</div>
              <div style={{ marginTop: 8, fontFamily: SANS, fontWeight: 300, fontSize: 52, color: ESPRESSO, letterSpacing: -0.5 }}>the summer kit</div>
              <div style={{ marginTop: 2, fontFamily: SERIF, fontSize: 56, color: ESPRESSO }}>$100</div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════ OFFER — The Summer Kit ══════════════════ */}
      <div
        ref={offerRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 15,
          background: `radial-gradient(120% 90% at 40% 38%, ${DUSTY_ROSE} 0%, ${OAT} 75%)`,
          visibility: "hidden",
        }}
      >
        <div ref={ofKickerRef} style={{ position: "absolute", left: LEFT_COL, top: 240, fontFamily: SANS, fontWeight: 500, fontSize: 28, letterSpacing: 11, textTransform: "uppercase", color: BROWN }}>
          limited edition
        </div>
        <div ref={ofTitleRef} style={{ position: "absolute", left: LEFT_COL, top: 296, textAlign: "left", fontFamily: SANS, fontWeight: 300, fontSize: 104, lineHeight: 0.92, letterSpacing: -1, color: ESPRESSO, width: 900 }}>
          the summer kit
        </div>
        <ProductCard imgRef={ofImgRef} cardRef={ofCardRef} groundRef={ofGroundRef} glossRef={ofGlossRef} src={summerKit} cardW={760} cardH={660} imgPad={30} cardStyle={{ left: "50%", top: 1000, borderRadius: 40 }} />
        <div ref={ofPriceRef} style={{ position: "absolute", left: LEFT_COL, top: 1470, fontFamily: SERIF, fontWeight: 500, fontSize: 100, color: ESPRESSO, transformOrigin: "left center", textShadow: "0 1px 2px rgba(245,241,234,0.6)" }}>
          $100
        </div>
        <div style={{ position: "absolute", left: LEFT_COL, top: 1610, fontFamily: SANS, fontWeight: 400, fontSize: 28, letterSpacing: 5, color: BROWN }}>
          taupe pouch + three essentials
        </div>
      </div>

      {/* ══════════════════ CTA — stylized rhode site scroll ══════════════════ */}
      <div ref={ctaRef} style={{ position: "absolute", inset: 0, zIndex: 16, background: OAT, visibility: "hidden", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 110, background: `${OAT}F2`, borderBottom: `1px solid ${BROWN}33`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3, backdropFilter: "blur(6px)" }}>
          <span style={{ fontFamily: SANS, fontWeight: 300, fontSize: 46, letterSpacing: 6, color: ESPRESSO }}>rhode</span>
          <span style={{ position: "absolute", left: 50, fontFamily: SANS, fontSize: 26, color: BROWN, letterSpacing: 2 }}>☰</span>
          <span style={{ position: "absolute", right: 50, fontFamily: SANS, fontWeight: 500, fontSize: 24, color: COCOA, letterSpacing: 2 }}>bag (3)</span>
        </div>

        <div ref={ctaPageRef} style={{ position: "absolute", top: 110, left: 0, right: 0, willChange: "transform" }}>
          <div style={{ height: 760, background: `linear-gradient(160deg, ${DUSTY_ROSE}, ${SOFT_PINK})`, position: "relative" }}>
            <div style={{ position: "absolute", left: 60, top: 130, fontFamily: SANS, fontWeight: 300, fontSize: 110, lineHeight: 0.96, color: ESPRESSO, letterSpacing: -1 }}>
              summer ’26
              <br />
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400 }}>has landed.</span>
            </div>
            <div style={{ position: "absolute", left: 64, top: 470, fontFamily: SANS, fontSize: 30, letterSpacing: 3, color: BROWN }}>warm-weather essentials, dropping now</div>
            <div style={{ position: "absolute", left: 64, top: 560, display: "inline-block", padding: "26px 56px", background: ESPRESSO, color: OAT, fontFamily: SANS, fontSize: 26, letterSpacing: 5, borderRadius: 999, textTransform: "uppercase", whiteSpace: "nowrap" }}>shop the collection</div>
          </div>

          <div style={{ padding: "70px 60px 90px", background: OAT }}>
            <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 8, textTransform: "uppercase", color: COCOA, marginBottom: 40 }}>best sellers</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>
              {[
                { img: highlightMilk, name: "highlight milk", price: "$28" },
                { img: sip, name: "pocket blush", price: "$22" },
                { img: macadamia, name: "lip tint · macadamia", price: "$20" },
                { img: summerKit, name: "the summer kit", price: "$100" },
              ].map((p) => (
                <div key={p.name} style={{ background: "#E9E1D3", borderRadius: 28, overflow: "hidden", border: `1px solid ${COCOA}22`, boxShadow: "0 24px 54px rgba(42,35,32,0.18)" }}>
                  <div style={{ height: 420, background: `radial-gradient(80% 70% at 50% 42%, #E4D9C3 0%, #D8CAB1 100%)`, position: "relative" }}>
                    <img src={p.img} alt="" style={{ position: "absolute", inset: 24, width: "calc(100% - 48px)", height: "calc(100% - 48px)", objectFit: "contain", filter: "saturate(1.06) contrast(1.05)" }} />
                  </div>
                  <div style={{ padding: "22px 26px 30px" }}>
                    <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 30, color: COCOA, letterSpacing: 0.5 }}>{p.name}</div>
                    <div style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 34, color: COCOA, marginTop: 8 }}>{p.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* designed espresso color-block wipe — sweeps up over the scroll, carrying the CTA
            in with momentum instead of a washed-out cross-dissolve. */}
        <div ref={ctaPlateRef} style={{ position: "absolute", inset: 0, zIndex: 4, background: ESPRESSO_BG, transform: "translateY(100%)", willChange: "transform" }}>
          {/* wordmark rides the plate so no frame is a flat solid espresso block */}
          <div ref={ctaPlateWordRef} style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", fontFamily: SANS, fontWeight: 300, fontSize: 150, letterSpacing: 14, color: OAT, opacity: 0, whiteSpace: "nowrap" }}>
            rhode
          </div>
        </div>

        <div ref={ctaOverlayRef} style={{ position: "absolute", inset: 0, zIndex: 5, opacity: 0, transform: "translateY(100%)", willChange: "transform", background: `radial-gradient(120% 90% at 50% 50%, ${WARM_WHITE} 0%, ${OAT} 72%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div ref={ctaShopRef} style={{ padding: "30px 78px", background: "#241D19", color: WARM_WHITE, fontFamily: SANS, fontWeight: 500, fontSize: 48, letterSpacing: 10, textTransform: "uppercase", borderRadius: 999, boxShadow: "0 30px 60px rgba(42,35,32,0.34)", opacity: 0, isolation: "isolate" }}>
            shop rhode
          </div>
          <div ref={ctaWordRef} style={{ marginTop: 70, fontFamily: SANS, fontWeight: 300, fontSize: 150, letterSpacing: 12, color: ESPRESSO, opacity: 0 }}>
            rhode
          </div>
          <div ref={ctaUrlRef} style={{ marginTop: 24, fontFamily: SANS, fontWeight: 400, fontSize: 34, letterSpacing: 8, color: BROWN, opacity: 0 }}>
            rhodeskin.com
          </div>
        </div>
      </div>

      {/* ── global film grain ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 40, backgroundImage: GRAIN, backgroundSize: "160px 160px", opacity: 0.04, mixBlendMode: "overlay", pointerEvents: "none" }} />
      {/* ── soft edge vignette ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 41, pointerEvents: "none", background: "radial-gradient(130% 100% at 50% 45%, rgba(0,0,0,0) 60%, rgba(42,35,32,0.16) 100%)" }} />
      {/* final resolve */}
      <div ref={fadeOutRef} style={{ position: "absolute", inset: 0, zIndex: 50, background: OAT, opacity: 0, pointerEvents: "none" }} />
    </Timegroup>
  );
}
