import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import {
  clamp,
  lerp,
  track,
  outBack,
  easeOutCubic,
  easeInCubic,
  easeInOutQuad,
} from "./components/helpers";
import { Sunburst, Rings, WaveBand, Scallop, Star, PalmEmblem, Bubble } from "./components/retro";
import * as C from "./constants";
import {
  CAN_TROPICAL,
  CAN_PINEAPPLE,
  CAN_GINGERALE,
  CAN_CRISPAPPLE,
  CAN_SHIRLEY,
  CAN_VINTAGECOLA,
  PACK_12,
  VID_POSTER,
} from "./assets";

/**
 * OLIPOP — short-form social ad (9:16, 1080×1920 @ 30fps, ~20s, silent).
 * HEALTH-FORWARD PUNCHY lean. Single 20000ms fixed Timegroup; ms == master.
 * Retro-illustrated kinetic motion graphics + cinematic cans + the fixed video well.
 */

// ── Type ──
const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif"; // Windsor-ish warm high-contrast serif
const SANS = "'Archivo', -apple-system, 'Helvetica Neue', Arial, sans-serif";

const W = C.CANVAS_W;
const H = C.CANVAS_H;

// retro print-grain data-URI (subtle, baked, no per-frame cost)
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

// ─────────────────────────────────────────────────────────────────────────────
//  OLIPOP wordmark — drawn (coral, Windsor-ish), so the HOOK/CTA aren't image-bound
// ─────────────────────────────────────────────────────────────────────────────
const Wordmark: React.FC<{ size?: number; color?: string }> = ({ size = 150, color = C.CORAL }) => (
  <div
    style={{
      fontFamily: SERIF,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: size * 0.02,
      color,
      lineHeight: 0.9,
      WebkitTextStroke: `${size * 0.012}px ${color}`,
    }}
  >
    OLIPOP
  </div>
);

// tracked-caps supporting label
const TrackedCaps: React.FC<{ children: React.ReactNode; size?: number; color?: string; ls?: number }> = ({
  children,
  size = 26,
  color = C.TEAL_INK,
  ls = 6,
}) => (
  <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: size, letterSpacing: ls, color, textTransform: "uppercase" }}>
    {children}
  </div>
);

export const Video: React.FC = () => {
  // ── scene wrappers ──
  const hookRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const wellRef = useRef<HTMLDivElement>(null);
  const swapRef = useRef<HTMLDivElement>(null);
  const rainbowRef = useRef<HTMLDivElement>(null);
  const offerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // ── HOOK refs ──
  const hookBurstRef = useRef<HTMLDivElement>(null);
  const hookLogoRef = useRef<HTMLDivElement>(null);
  const hookLogoMaskRef = useRef<HTMLDivElement>(null);
  const hookTagRef = useRef<HTMLDivElement>(null);
  const hookSubRef = useRef<HTMLDivElement>(null);
  const hookWipeRef = useRef<HTMLDivElement>(null);
  const hookStarsRef = useRef<HTMLDivElement>(null);

  // ── HERO refs ──
  const heroBurstRef = useRef<HTMLDivElement>(null);
  const heroRingsRef = useRef<HTMLDivElement>(null);
  const heroCanRef = useRef<HTMLDivElement>(null);
  const heroShadowRef = useRef<HTMLDivElement>(null);
  const heroSpecRef = useRef<HTMLDivElement>(null);
  const heroFlavorRef = useRef<HTMLDivElement>(null);
  const heroIngredRef = useRef<HTMLDivElement>(null);
  const heroBubblesRef = useRef<HTMLDivElement>(null);
  const heroWipeRef = useRef<HTMLDivElement>(null);

  // ── WELL refs ──
  const wellFrameRef = useRef<HTMLDivElement>(null);
  const wellCopyTopRef = useRef<HTMLDivElement>(null);
  const wellCopyBotRef = useRef<HTMLDivElement>(null);
  const wellStarRef = useRef<HTMLDivElement>(null);
  const wellBurstRef = useRef<HTMLDivElement>(null);
  const wellDotRef = useRef<HTMLDivElement>(null);

  // ── SWAP refs ──
  const swapTitleRef = useRef<HTMLDivElement>(null);
  const swapOldRef = useRef<HTMLDivElement>(null);
  const swapStrikeRef = useRef<SVGLineElement>(null);
  const swapArrowRef = useRef<HTMLDivElement>(null);
  const swapNewRef = useRef<HTMLDivElement>(null);
  const swapStat1Ref = useRef<HTMLDivElement>(null);
  const swapStat2Ref = useRef<HTMLDivElement>(null);
  const swapStat3Ref = useRef<HTMLDivElement>(null);
  const swapBurstRef = useRef<HTMLDivElement>(null);

  // ── RAINBOW refs ──
  const rainbowBgRef = useRef<HTMLDivElement>(null);
  const rainbowBurstRef = useRef<HTMLDivElement>(null);
  const flCanRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const flLabelRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const rainbowGridRef = useRef<HTMLDivElement>(null);
  const rainbowTitleRef = useRef<HTMLDivElement>(null);

  // ── OFFER refs ──
  const offerBurstRef = useRef<HTMLDivElement>(null);
  const offerPackRef = useRef<HTMLDivElement>(null);
  const offerTitleRef = useRef<HTMLDivElement>(null);
  const offerSubRef = useRef<HTMLDivElement>(null);
  const offerShadowRef = useRef<HTMLDivElement>(null);

  // ── CTA refs ──
  const ctaScrollRef = useRef<HTMLDivElement>(null);
  const ctaBurstRef = useRef<HTMLDivElement>(null);
  const ctaRingsRef = useRef<HTMLDivElement>(null);
  const ctaLogoRef = useRef<HTMLDivElement>(null);
  const ctaUrlRef = useRef<HTMLDivElement>(null);
  const ctaStarRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  // ── global camera drift ──
  const camRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
    const ms = ownCurrentTimeMs;
    const set = (el: HTMLElement | null, k: string, v: string) => {
      if (el) (el.style as any)[k] = v;
    };
    const op = (el: HTMLElement | null, v: number) => {
      if (el) el.style.opacity = String(clamp(v));
    };
    const gate = (el: HTMLElement | null, on: boolean, o = 1) => {
      if (!el) return;
      const v = on ? clamp(o) : 0;
      el.style.opacity = String(v);
      el.style.pointerEvents = v > 0 ? "auto" : "none";
    };

    // global breathing camera drift (subtle, lags nothing — ambient life)
    if (camRef.current) {
      const dx = Math.sin(ms / 2600) * 6;
      const dy = Math.cos(ms / 3100) * 5;
      const sc = 1 + Math.sin(ms / 4200) * 0.004;
      camRef.current.style.transform = `translate(${dx}px,${dy}px) scale(${sc})`;
    }

    // ════════════════════════ BEAT 1 — HOOK (0–2000) ════════════════════════
    {
      const visible = ms < C.HOOK_END;
      const out = track(ms, C.HOOK_OUT, C.HOOK_END, easeInCubic);
      gate(hookRef.current, visible, 1);
      // rotating sunburst — continuous slow spin + scale-in
      if (hookBurstRef.current) {
        const inS = track(ms, C.HOOK_BURST_IN, C.HOOK_BURST_IN + 520, outBack);
        const rot = ms * 0.012;
        hookBurstRef.current.style.transform = `translate(-50%,-50%) rotate(${rot}deg) scale(${lerp(0.4, 1.05, inS)})`;
        op(hookBurstRef.current, inS);
      }
      // wordmark mask-wipe up
      if (hookLogoMaskRef.current) {
        const wipe = track(ms, C.HOOK_LOGO_IN, C.HOOK_LOGO_IN + 460, easeOutCubic);
        hookLogoMaskRef.current.style.transform = `translateY(${lerp(110, 0, wipe)}%)`;
        op(hookLogoRef.current, wipe > 0 ? 1 : 0);
      }
      if (hookLogoRef.current) {
        const pop = track(ms, C.HOOK_LOGO_IN, C.HOOK_LOGO_IN + 520, outBack);
        hookLogoRef.current.style.transform = `scale(${lerp(0.86, 1, pop)})`;
      }
      // tagline bounce-settle
      if (hookTagRef.current) {
        const inT = track(ms, C.HOOK_TAG_IN, C.HOOK_TAG_IN + 560, outBack);
        hookTagRef.current.style.transform = `translateY(${lerp(56, 0, inT)}px) rotate(${lerp(-3, -2, inT)}deg)`;
        op(hookTagRef.current, track(ms, C.HOOK_TAG_IN, C.HOOK_TAG_IN + 260));
      }
      if (hookSubRef.current) {
        op(hookSubRef.current, track(ms, C.HOOK_SUB_IN, C.HOOK_SUB_IN + 360, easeOutCubic));
        hookSubRef.current.style.transform = `translateY(${lerp(20, 0, track(ms, C.HOOK_SUB_IN, C.HOOK_SUB_IN + 360, easeOutCubic))}px)`;
      }
      // floating stars twinkle
      if (hookStarsRef.current) {
        const tw = 0.5 + 0.5 * Math.sin(ms / 240);
        hookStarsRef.current.style.opacity = String(0.55 + tw * 0.45);
        hookStarsRef.current.style.transform = `scale(${lerp(0.9, 1.06, tw)})`;
      }
      // color-block wipe out (coral sweeps down-left)
      if (hookWipeRef.current) {
        hookWipeRef.current.style.transform = `translateY(${lerp(-100, 0, out)}%)`;
      }
    }

    // ════════════════════════ BEAT 2 — CAN HERO (2000–5000) ════════════════════════
    {
      const visible = ms >= C.HERO_IN && ms < C.HERO_END;
      const out = track(ms, C.HERO_OUT, C.HERO_END, easeInOutQuad);
      gate(heroRef.current, visible, 1);
      // coral sunburst rotates (opposite direction) + slight scale breathing
      if (heroBurstRef.current) {
        const inS = track(ms, C.HERO_BURST_IN, C.HERO_BURST_IN + 600, easeOutCubic);
        const rot = -ms * 0.009;
        const breathe = 1 + Math.sin(ms / 900) * 0.015;
        heroBurstRef.current.style.transform = `translate(-50%,-50%) rotate(${rot}deg) scale(${lerp(0.6, 1, inS) * breathe})`;
        op(heroBurstRef.current, inS);
      }
      // concentric rings pulse outward
      if (heroRingsRef.current) {
        const inS = track(ms, C.HERO_RINGS_IN, C.HERO_RINGS_IN + 500, easeOutCubic);
        const pulse = 1 + (Math.sin(ms / 700) * 0.5 + 0.5) * 0.06;
        heroRingsRef.current.style.transform = `translate(-50%,-50%) scale(${lerp(0.7, 1, inS) * pulse})`;
        op(heroRingsRef.current, inS * 0.85);
      }
      // can cinematic push-in + subtle bob
      if (heroCanRef.current) {
        const push = track(ms, C.HERO_CAN_IN, C.HERO_CAN_SETTLE, easeOutCubic);
        const bob = Math.sin((ms - C.HERO_CAN_SETTLE) / 760) * 9;
        const sc = lerp(0.62, 1, push);
        const y = lerp(120, 0, push) + (push >= 1 ? bob : 0);
        heroCanRef.current.style.transform = `translate(-50%,-50%) translateY(${y}px) scale(${sc})`;
        op(heroCanRef.current, track(ms, C.HERO_CAN_IN, C.HERO_CAN_IN + 260));
      }
      // grounded soft shadow scales with push, breathes with bob
      if (heroShadowRef.current) {
        const push = track(ms, C.HERO_CAN_IN, C.HERO_CAN_SETTLE, easeOutCubic);
        const bob = Math.sin((ms - C.HERO_CAN_SETTLE) / 760);
        const sc = lerp(0.5, 1, push) * (push >= 1 ? 1 - bob * 0.06 : 1);
        heroShadowRef.current.style.transform = `translateX(-50%) scaleX(${sc})`;
        op(heroShadowRef.current, push * 0.4);
      }
      // condensation specular sweep across can
      if (heroSpecRef.current) {
        const sweep = (Math.sin(ms / 1400) * 0.5 + 0.5);
        heroSpecRef.current.style.transform = `translateX(${lerp(-120, 120, sweep)}px) rotate(18deg)`;
        op(heroSpecRef.current, track(ms, C.HERO_CAN_SETTLE, C.HERO_CAN_SETTLE + 300) * (0.25 + sweep * 0.4));
      }
      // flavor title bounce-settle
      if (heroFlavorRef.current) {
        const inT = track(ms, C.HERO_FLAVOR_IN, C.HERO_FLAVOR_IN + 560, outBack);
        heroFlavorRef.current.style.transform = `translateX(-50%) translateY(${lerp(40, 0, inT)}px)`;
        op(heroFlavorRef.current, track(ms, C.HERO_FLAVOR_IN, C.HERO_FLAVOR_IN + 260));
      }
      if (heroIngredRef.current) {
        const inT = track(ms, C.HERO_INGRED_IN, C.HERO_INGRED_IN + 420, easeOutCubic);
        heroIngredRef.current.style.transform = `translateX(-50%) translateY(${lerp(18, 0, inT)}px)`;
        op(heroIngredRef.current, inT);
      }
      // rising bubbles
      if (heroBubblesRef.current) {
        const kids = heroBubblesRef.current.children;
        for (let i = 0; i < kids.length; i++) {
          const el = kids[i] as HTMLElement;
          const speed = 1700 + i * 360;
          const phase = (ms / speed + i * 0.37) % 1;
          const x = parseFloat(el.dataset.x || "0");
          const drift = Math.sin((ms / 900) + i) * 18;
          el.style.transform = `translate(${x + drift}px, ${lerp(420, -540, phase)}px)`;
          el.style.opacity = String(clamp(Math.sin(phase * Math.PI)) * 0.85);
        }
      }
      // wipe out — seafoam block sweeps to reveal well
      if (heroWipeRef.current) {
        heroWipeRef.current.style.transform = `translateX(${lerp(100, 0, out)}%)`;
      }
    }

    // ════════════════════════ BEAT 3 — VIDEO WELL (4.4–9.5) ════════════════════════
    // STATIONARY 5.0–9.0s (non-negotiable). Frame in 4.4–4.95, out 9.0–9.5.
    {
      const visible = ms >= C.WELL_FRAME_IN && ms < C.WELL_FRAME_OUT_END;
      gate(wellRef.current, visible, 1);
      if (wellFrameRef.current) {
        const inP = track(ms, C.WELL_FRAME_IN, C.WELL_FRAME_IN_END, easeOutCubic);
        const outP = track(ms, C.WELL_FRAME_OUT, C.WELL_FRAME_OUT_END, easeInCubic);
        // During 5.0–9.0 inP==1 and outP==0 → transform identity, opacity 1: PERFECTLY STATIONARY.
        const inWindow = ms >= C.WELL_STATIC_START && ms <= C.WELL_STATIC_END;
        if (inWindow) {
          wellFrameRef.current.style.transform = "translate(0px,0px) scale(1)";
          wellFrameRef.current.style.opacity = "1";
        } else {
          const sc = lerp(0.9, 1, inP) * lerp(1, 0.94, outP);
          const ty = lerp(46, 0, inP) + lerp(0, -30, outP);
          wellFrameRef.current.style.transform = `translate(0px,${ty}px) scale(${sc})`;
          wellFrameRef.current.style.opacity = String(inP * (1 - outP));
        }
      }
      // editorial copy AROUND the well (outside it) — safe to animate any time
      if (wellCopyTopRef.current) {
        const inT = track(ms, C.WELL_COPY_IN, C.WELL_COPY_IN + 420, easeOutCubic);
        const outT = track(ms, C.WELL_FRAME_OUT, C.WELL_FRAME_OUT_END, easeInCubic);
        wellCopyTopRef.current.style.transform = `translateY(${lerp(-24, 0, inT)}px)`;
        op(wellCopyTopRef.current, inT * (1 - outT));
      }
      if (wellCopyBotRef.current) {
        const inT = track(ms, C.WELL_COPY_IN + 200, C.WELL_COPY_IN + 620, easeOutCubic);
        const outT = track(ms, C.WELL_FRAME_OUT, C.WELL_FRAME_OUT_END, easeInCubic);
        wellCopyBotRef.current.style.transform = `translateY(${lerp(24, 0, inT)}px)`;
        op(wellCopyBotRef.current, inT * (1 - outT));
      }
      // b01 STAR flourish top-left of the badge — slow spin + gentle twinkle pulse.
      // It lives inside the (stationary 5–9s) frame group; its OWN transform spins only
      // the star art, never the well rect.
      if (wellStarRef.current) {
        const tw = 0.5 + 0.5 * Math.sin(ms / 360);
        wellStarRef.current.style.transform = `rotate(${ms / 12}deg) scale(${lerp(0.9, 1.08, tw)})`;
      }
      // ambient sunburst behind everything keeps spinning (background, not the well)
      if (wellBurstRef.current) {
        wellBurstRef.current.style.transform = `translate(-50%,-50%) rotate(${ms * 0.006}deg)`;
      }
      // blinking REC dot on the frame chrome (chrome is part of static group visually,
      // but the dot blink is opacity-only so it doesn't move the well)
      if (wellDotRef.current) {
        wellDotRef.current.style.opacity = String(Math.floor(ms / 500) % 2 === 0 ? 1 : 0.25);
      }
    }

    // ════════════════════════ BEAT 4 — THE SWAP (9.0–12.2) ════════════════════════
    {
      const visible = ms >= C.SWAP_IN && ms < C.SWAP_END;
      const out = track(ms, C.SWAP_OUT, C.SWAP_END, easeInOutQuad);
      gate(swapRef.current, visible, 1);
      if (swapBurstRef.current) {
        swapBurstRef.current.style.transform = `translate(-50%,-50%) rotate(${ms * 0.007}deg)`;
        op(swapBurstRef.current, track(ms, C.SWAP_IN, C.SWAP_IN + 400) * (1 - out));
      }
      if (swapTitleRef.current) {
        const inT = track(ms, C.SWAP_IN, C.SWAP_IN + 380, easeOutCubic);
        swapTitleRef.current.style.transform = `translateX(-50%) translateY(${lerp(-30, 0, inT)}px)`;
        op(swapTitleRef.current, inT * (1 - out));
      }
      // OLD soda card slides in from left
      if (swapOldRef.current) {
        const inT = track(ms, C.SWAP_OLD_IN, C.SWAP_OLD_IN + 460, outBack);
        const dim = track(ms, C.SWAP_STRIKE_IN + 200, C.SWAP_STRIKE_IN + 700); // dims after strike
        swapOldRef.current.style.transform = `translateX(${lerp(-460, 0, inT)}px) rotate(${lerp(-6, -3, inT)}deg)`;
        swapOldRef.current.style.opacity = String(clamp(inT * (1 - out) * (1 - dim * 0.45)));
        swapOldRef.current.style.filter = `grayscale(${dim * 0.6})`;
      }
      // strike-through draws across the 39g
      if (swapStrikeRef.current) {
        const draw = track(ms, C.SWAP_STRIKE_IN, C.SWAP_STRIKE_IN + 340, easeOutCubic);
        swapStrikeRef.current.setAttribute("stroke-dashoffset", String(lerp(420, 0, draw)));
      }
      // arrow / vs pops
      if (swapArrowRef.current) {
        const inT = track(ms, C.SWAP_VS_IN, C.SWAP_VS_IN + 360, outBack);
        const pulse = 1 + Math.sin(ms / 360) * 0.05;
        swapArrowRef.current.style.transform = `translate(-50%,-50%) scale(${lerp(0.3, 1, inT) * pulse})`;
        op(swapArrowRef.current, inT * (1 - out));
      }
      // NEW OLIPOP card slams in from right
      if (swapNewRef.current) {
        const inT = track(ms, C.SWAP_NEW_IN, C.SWAP_NEW_IN + 420, outBack);
        swapNewRef.current.style.transform = `translateX(${lerp(460, 0, inT)}px) rotate(${lerp(6, 3, inT)}deg)`;
        op(swapNewRef.current, inT * (1 - out));
      }
      // stat chips stagger up
      const chip = (r: React.RefObject<HTMLDivElement>, t0: number) => {
        if (!r.current) return;
        const inT = track(ms, t0, t0 + 320, outBack);
        r.current.style.transform = `translateY(${lerp(30, 0, inT)}px) scale(${lerp(0.7, 1, inT)})`;
        r.current.style.opacity = String(clamp(inT * (1 - out)));
      };
      chip(swapStat1Ref, C.SWAP_STAT1_IN);
      chip(swapStat2Ref, C.SWAP_STAT2_IN);
      chip(swapStat3Ref, C.SWAP_STAT3_IN);
    }

    // ════════════════════════ BEAT 5 — FLAVOR RAINBOW (12.2–16.2) ════════════════════════
    {
      const visible = ms >= C.RAINBOW_IN && ms < C.RAINBOW_END;
      const out = track(ms, C.RAINBOW_OUT, C.RAINBOW_END, easeInOutQuad);
      gate(rainbowRef.current, visible, 1);
      if (rainbowBurstRef.current) {
        rainbowBurstRef.current.style.transform = `translate(-50%,-50%) rotate(${-ms * 0.01}deg)`;
      }
      // each flavor card: enters, holds briefly, exits as next enters; last 4 settle into grid
      const collapse = track(ms, C.RAINBOW_GRID_IN, C.RAINBOW_GRID_IN + 460, easeOutCubic);
      for (let i = 0; i < 6; i++) {
        const el = flCanRefs[i].current;
        const lbl = flLabelRefs[i].current;
        const t0 = C.RAINBOW_CAN0 + i * C.RAINBOW_PER_CAN;
        const inT = track(ms, t0, t0 + 300, outBack);
        const exitT = track(ms, t0 + C.RAINBOW_PER_CAN, t0 + C.RAINBOW_PER_CAN + 260, easeInCubic);
        // bg color-block also flips per flavor
        if (rainbowBgRef.current && ms >= t0 && (i === 5 || ms < t0 + C.RAINBOW_PER_CAN)) {
          rainbowBgRef.current.dataset.fl = String(i);
        }
        if (el) {
          if (collapse > 0) {
            // collapse all 6 into a clean centered 3×2 grid below the title.
            // can wrapper center is (50%, 850); scaled to 0.42 → ~227px-wide cans.
            const col = i % 3;
            const row = Math.floor(i / 3);
            const gx = lerp(0, (col - 1) * 264, collapse);          // cols: -264, 0, +264
            const gy = lerp(0, 70 + row * 360, collapse);           // two rows, centered
            const gsc = lerp(1, 0.42, collapse);
            const rot = lerp(0, (col - 1) * 5, collapse);
            el.style.transform = `translate(-50%,-50%) translate(${gx}px,${gy}px) scale(${gsc}) rotate(${rot}deg)`;
            el.style.opacity = String(clamp((1 - out)));
          } else {
            const showing = inT > 0 && exitT < 1;
            const y = lerp(60, 0, inT) - exitT * 80;
            const sc = lerp(0.78, 1, inT) * lerp(1, 0.9, exitT);
            const rot = lerp(-7, 0, inT) + exitT * 6;
            el.style.transform = `translate(-50%,-50%) translateY(${y}px) scale(${sc}) rotate(${rot}deg)`;
            el.style.opacity = String(clamp((showing ? inT * (1 - exitT) : 0)));
          }
        }
        if (lbl) {
          if (collapse > 0) {
            op(lbl, 0);
          } else {
            // label enters slightly after the can, and snaps out fast (160ms) so two
            // flavor labels never overlap as garbled doubled text during the swap.
            const lblIn = track(ms, t0 + 90, t0 + 320, easeOutCubic);
            const lblExit = track(ms, t0 + C.RAINBOW_PER_CAN - 60, t0 + C.RAINBOW_PER_CAN + 100, easeInCubic);
            lbl.style.transform = `translateX(-50%) translateY(${lerp(28, 0, lblIn)}px)`;
            lbl.style.opacity = String(clamp(lblIn * (1 - lblExit)));
          }
        }
      }
      // background flips by reading the data-fl marker (set above)
      if (rainbowBgRef.current) {
        const fl = parseInt(rainbowBgRef.current.dataset.fl || "0", 10);
        const cols = [C.FL_TROPICAL, C.FL_PINEAPPLE, C.FL_GINGERALE, C.FL_CRISPAPPLE, C.FL_SHIRLEY, C.FL_VINTAGECOLA];
        rainbowBgRef.current.style.background = collapse > 0 ? C.TEAL_INK : cols[fl];
      }
      // title "find your flavor"
      if (rainbowTitleRef.current) {
        const inT = track(ms, C.RAINBOW_TITLE_IN, C.RAINBOW_TITLE_IN + 420, outBack);
        rainbowTitleRef.current.style.transform = `translateX(-50%) translateY(${lerp(-40, 0, inT)}px)`;
        op(rainbowTitleRef.current, inT * (1 - out));
      }
      if (rainbowGridRef.current) op(rainbowGridRef.current, 1);
    }

    // ════════════════════════ BEAT 6 — OFFER (16.2–18.2) ════════════════════════
    {
      const visible = ms >= C.OFFER_IN && ms < C.OFFER_END;
      const out = track(ms, C.OFFER_OUT, C.OFFER_END, easeInOutQuad);
      gate(offerRef.current, visible, 1);
      if (offerBurstRef.current) {
        offerBurstRef.current.style.transform = `translate(-50%,-50%) rotate(${ms * 0.008}deg)`;
        op(offerBurstRef.current, track(ms, C.OFFER_IN, C.OFFER_IN + 360) * (1 - out));
      }
      if (offerPackRef.current) {
        const push = track(ms, C.OFFER_PACK_IN, C.OFFER_PACK_IN + 560, easeOutCubic);
        const bob = Math.sin(ms / 760) * 7;
        offerPackRef.current.style.transform = `translate(-50%,-50%) translateY(${lerp(90, 0, push) + bob}px) scale(${lerp(0.7, 1, push)})`;
        op(offerPackRef.current, track(ms, C.OFFER_PACK_IN, C.OFFER_PACK_IN + 220) * (1 - out));
      }
      if (offerShadowRef.current) {
        const push = track(ms, C.OFFER_PACK_IN, C.OFFER_PACK_IN + 560, easeOutCubic);
        offerShadowRef.current.style.transform = `translateX(-50%) scaleX(${lerp(0.5, 1, push)})`;
        op(offerShadowRef.current, push * 0.4 * (1 - out));
      }
      if (offerTitleRef.current) {
        const inT = track(ms, C.OFFER_TITLE_IN, C.OFFER_TITLE_IN + 420, outBack);
        offerTitleRef.current.style.transform = `translateX(-50%) translateY(${lerp(-30, 0, inT)}px)`;
        op(offerTitleRef.current, inT * (1 - out));
      }
      // b01-style inline supporting line: clip-wipe reveal (left→right), then hold.
      if (offerSubRef.current) {
        const inT = track(ms, C.OFFER_BADGE_IN, C.OFFER_BADGE_IN + 500, easeOutCubic);
        offerSubRef.current.style.clipPath = `inset(0 ${lerp(100, 0, inT)}% 0 0)`;
        op(offerSubRef.current, track(ms, C.OFFER_BADGE_IN, C.OFFER_BADGE_IN + 240, easeOutCubic) * (1 - out));
      }
    }

    // ════════════════════════ BEAT 7 — CTA (18.2–20.0) ════════════════════════
    {
      const visible = ms >= C.CTA_IN;
      gate(ctaRef.current, visible, 1);
      // site-scroll mock scrolls up then fades as lockup resolves
      if (ctaScrollRef.current) {
        const scroll = track(ms, C.CTA_SCROLL_IN, C.CTA_RESOLVE, easeInOutQuad);
        const fade = track(ms, C.CTA_RESOLVE, C.CTA_RESOLVE + 300, easeInCubic);
        ctaScrollRef.current.style.transform = `translateY(${lerp(0, -680, scroll)}px)`;
        op(ctaScrollRef.current, track(ms, C.CTA_IN, C.CTA_IN + 200) * (1 - fade));
      }
      // b01 outro: radiating coral sunburst + concentric rings appear on resolve
      const resolved = track(ms, C.CTA_RESOLVE, C.CTA_RESOLVE + 300);
      if (ctaBurstRef.current) {
        const sc = lerp(1.3, 1, track(ms, C.CTA_RESOLVE, C.CTA_RESOLVE + 700, easeOutCubic));
        ctaBurstRef.current.style.transform = `translate(-50%,-50%) rotate(${ms * 0.012}deg) scale(${sc})`;
        op(ctaBurstRef.current, resolved);
      }
      if (ctaRingsRef.current) {
        const grow = lerp(0.5, 1, track(ms, C.CTA_RESOLVE, C.CTA_RESOLVE + 900, easeOutCubic));
        const pulse = 1 + (Math.sin(ms / 800) * 0.5 + 0.5) * 0.04;
        ctaRingsRef.current.style.transform = `translate(-50%,-50%) scale(${grow * pulse})`;
        op(ctaRingsRef.current, resolved * 0.78);
      }
      // "drink OLIPOP" lockup — pops up + bobs (kept centered via translate(-50%,-50%))
      if (ctaLogoRef.current) {
        const inT = track(ms, C.CTA_LOGO_IN, C.CTA_LOGO_IN + 560, outBack);
        const bob = Math.sin(ms / 560) * 4;
        ctaLogoRef.current.style.transform = `translate(-50%,-50%) translateY(${lerp(60, bob, inT)}px) scale(${lerp(0.6, 1, inT)})`;
        op(ctaLogoRef.current, track(ms, C.CTA_LOGO_IN, C.CTA_LOGO_IN + 280, easeOutCubic));
      }
      if (ctaUrlRef.current) {
        const inT = track(ms, C.CTA_URL_IN, C.CTA_URL_IN + 460, easeOutCubic);
        ctaUrlRef.current.style.transform = `translateY(${lerp(28, 0, inT)}px)`;
        op(ctaUrlRef.current, track(ms, C.CTA_URL_IN, C.CTA_URL_IN + 240, easeOutCubic));
      }
      // sparkle stars pop in staggered + slow spin/twinkle
      ctaStarRefs.forEach((r, i) => {
        if (!r.current) return;
        const pop = track(ms, C.CTA_LOGO_IN + 200 + i * 110, C.CTA_LOGO_IN + 520 + i * 110, outBack);
        const tw = 0.5 + 0.5 * Math.sin(ms / 300 + i);
        r.current.style.transform = `scale(${lerp(0.3, 1, pop) * lerp(0.85, 1.15, tw)}) rotate(${ms / 24 + i * 60}deg)`;
        op(r.current, pop * lerp(0.4, 1, tw));
      });
    }
  }, []);

  // common absolute-fill style
  const fill: React.CSSProperties = { position: "absolute", inset: 0 };

  return (
    <Timegroup
      mode="fixed"
      duration="20000ms"
      onFrame={handleFrame as any}
      workbench
      className="w-[1080px] h-[1920px] relative overflow-hidden"
      style={{ background: C.TEAL_DEEP }}
    >
      {/* ════════ global camera-drift wrapper ════════ */}
      <div ref={camRef} style={{ ...fill, willChange: "transform" }}>

        {/* ═══════════════════ BEAT 1 — HOOK ═══════════════════ */}
        <div ref={hookRef} style={{ ...fill, zIndex: 70, background: C.CREAM, overflow: "hidden" }}>
          {/* rotating sunburst centered */}
          <div ref={hookBurstRef} style={{ position: "absolute", left: "50%", top: 760, width: 1, height: 1, willChange: "transform" }}>
            <svg width={2800} height={2800} viewBox="-1400 -1400 2800 2800" style={{ position: "absolute", left: -1400, top: -1400 }}>
              <Sunburst rays={28} colorA={C.CORAL} colorB={C.SOFT_PINK} r={1500} />
            </svg>
          </div>
          {/* twinkle stars */}
          <div ref={hookStarsRef} style={{ position: "absolute", inset: 0, willChange: "transform, opacity" }}>
            <div style={{ position: "absolute", left: 150, top: 360 }}><Star size={58} fill={C.CREAM_LT} /></div>
            <div style={{ position: "absolute", left: 880, top: 480 }}><Star size={44} fill={C.SUNSET_GOLD} /></div>
            <div style={{ position: "absolute", left: 200, top: 1180 }}><Star size={50} fill={C.SUNSET_GOLD} /></div>
            <div style={{ position: "absolute", left: 860, top: 1080 }}><Star size={64} fill={C.CREAM_LT} /></div>
            <div style={{ position: "absolute", left: 540, top: 300 }}><Star size={36} fill={C.CREAM_LT} /></div>
          </div>
          {/* center stack on a clean CREAM sticker-badge (high contrast, on-brand lockup) */}
          <div style={{ position: "absolute", left: 90, right: 90, top: 470, display: "flex", flexDirection: "column", alignItems: "center", background: C.CREAM_LT, borderRadius: 60, padding: "70px 50px 64px", boxShadow: "0 30px 70px rgba(15,40,36,0.3)", border: `8px solid ${C.TEAL_INK}` }}>
            {/* inner coral hairline ring */}
            <div style={{ position: "absolute", inset: 16, borderRadius: 46, border: `3px solid ${C.CORAL}`, pointerEvents: "none" }} />
            <div style={{ overflow: "hidden", padding: "0 10px" }}>
              <div ref={hookLogoMaskRef} style={{ willChange: "transform" }}>
                <div ref={hookLogoRef} style={{ willChange: "transform", opacity: 0 }}>
                  <Wordmark size={168} color={C.CORAL} />
                </div>
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <PalmEmblem size={150} ink={C.TEAL_INK} sun={C.CORAL} />
            </div>
            <div ref={hookTagRef} style={{ marginTop: 22, willChange: "transform, opacity", opacity: 0 }}>
              <div style={{ fontFamily: SERIF, fontWeight: 800, fontStyle: "italic", fontSize: 100, color: C.TEAL_INK, textAlign: "center", lineHeight: 0.96 }}>
                a new kind<br />of soda
              </div>
            </div>
            <div ref={hookSubRef} style={{ marginTop: 30, willChange: "transform, opacity", opacity: 0 }}>
              <TrackedCaps size={27} color={C.CORAL} ls={6}>prebiotic&nbsp;·&nbsp;deliciously&nbsp;healthy</TrackedCaps>
            </div>
          </div>
          {/* color-block wipe-out (coral) */}
          <div ref={hookWipeRef} style={{ ...fill, background: C.CORAL, transform: "translateY(-100%)", willChange: "transform", zIndex: 80 }} />
        </div>

        {/* ═══════════════════ BEAT 2 — CAN HERO ═══════════════════ */}
        <div ref={heroRef} style={{ ...fill, zIndex: 60, background: C.CORAL, overflow: "hidden", opacity: 0 }}>
          {/* coral sunburst */}
          <div ref={heroBurstRef} style={{ position: "absolute", left: "50%", top: 820, width: 1, height: 1, willChange: "transform" }}>
            <svg width={2800} height={2800} viewBox="-1400 -1400 2800 2800" style={{ position: "absolute", left: -1400, top: -1400 }}>
              <Sunburst rays={32} colorA={C.CORAL_DEEP} colorB={C.CORAL} r={1500} />
            </svg>
          </div>
          {/* concentric rings */}
          <div ref={heroRingsRef} style={{ position: "absolute", left: "50%", top: 820, width: 1, height: 1, willChange: "transform" }}>
            <svg width={1700} height={1700} viewBox="-850 -850 1700 1700" style={{ position: "absolute", left: -850, top: -850 }}>
              <Rings count={6} gap={86} stroke={C.CREAM_LT} sw={5} start={300} />
            </svg>
          </div>
          {/* rising bubbles */}
          <div ref={heroBubblesRef} style={{ position: "absolute", left: "50%", top: 0, width: 1, height: H, willChange: "opacity" }}>
            {[
              { x: -300, s: 30 }, { x: -160, s: 18 }, { x: 220, s: 26 }, { x: 320, s: 40 },
              { x: -360, s: 16 }, { x: 140, s: 22 }, { x: -60, s: 34 }, { x: 380, s: 14 },
            ].map((b, i) => (
              <div key={i} data-x={b.x} style={{ position: "absolute", left: 0, top: 0, willChange: "transform, opacity" }}>
                <Bubble size={b.s} color={C.CREAM_LT} />
              </div>
            ))}
          </div>
          {/* grounded shadow */}
          <div ref={heroShadowRef} style={{ position: "absolute", left: "50%", top: 1330, width: 460, height: 70, marginLeft: -230, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(15,40,36,0.55), transparent 70%)", willChange: "transform, opacity" }} />
          {/* HERO CAN — centered via translate(-50%,-50%) ONLY (no margins → no double offset) */}
          <div ref={heroCanRef} style={{ position: "absolute", left: "50%", top: 760, width: 540, height: 710, willChange: "transform, opacity" }}>
            <img src={CAN_TROPICAL} style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 24px 40px rgba(15,40,36,0.4))" }} />
            {/* condensation specular sweep */}
            <div ref={heroSpecRef} style={{ position: "absolute", left: 120, top: 60, width: 90, height: 600, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)", filter: "blur(8px)", willChange: "transform, opacity", mixBlendMode: "screen" }} />
          </div>
          {/* flavor title */}
          <div ref={heroFlavorRef} style={{ position: "absolute", left: "50%", top: 1380, textAlign: "center", willChange: "transform, opacity", opacity: 0 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 800, fontStyle: "italic", fontSize: 132, color: C.CREAM_LT, lineHeight: 0.9, textShadow: "0 6px 0 rgba(199,58,40,0.5)" }}>
              tropical<br />punch
            </div>
          </div>
          <div ref={heroIngredRef} style={{ position: "absolute", left: "50%", top: 1700, whiteSpace: "nowrap", willChange: "transform, opacity", opacity: 0 }}>
            <TrackedCaps size={30} color={C.CREAM_LT} ls={5}>prebiotics&nbsp;·&nbsp;botanicals&nbsp;·&nbsp;plant&nbsp;fiber</TrackedCaps>
          </div>
          {/* wipe out (seafoam) */}
          <div ref={heroWipeRef} style={{ ...fill, background: C.SEAFOAM, transform: "translateX(100%)", willChange: "transform", zIndex: 90 }} />
        </div>

        {/* ═══════════════════ BEAT 3 — VIDEO WELL ═══════════════════ */}
        <div ref={wellRef} style={{ ...fill, zIndex: 50, background: C.SEAFOAM, overflow: "hidden", opacity: 0 }}>
          {/* ambient spinning sunburst behind everything (NOT the well) */}
          <div ref={wellBurstRef} style={{ position: "absolute", left: "50%", top: 1000, width: 1, height: 1, willChange: "transform", opacity: 0.5 }}>
            <svg width={2800} height={2800} viewBox="-1400 -1400 2800 2800" style={{ position: "absolute", left: -1400, top: -1400 }}>
              <Sunburst rays={36} colorA={C.SEAFOAM_LT} colorB={"#A9D9D4"} r={1500} />
            </svg>
          </div>
          {/* top editorial copy */}
          <div ref={wellCopyTopRef} style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", willChange: "transform, opacity", opacity: 0 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 800, fontStyle: "italic", fontSize: 104, color: C.TEAL_INK, lineHeight: 0.92 }}>
              a new kind<br />of soda
            </div>
          </div>
          {/* ─── THE WELL FRAME GROUP (animates in/out, STATIONARY 5–9s) ─── */}
          {/* Outer group wraps a frame positioned so the INNER well is EXACTLY 180,640,720,720,r36. */}
          {/* B01 GRAFT: chunky cream/off-white rounded badge frame — cream backing + coral mid + teal hairline,
              with a yellow STAR (top-left) and a "NOW PLAYING" pill (top-right). Drawn AROUND the fixed rect. */}
          <div ref={wellFrameRef} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, willChange: "transform, opacity", opacity: 0 }}>
            {/* cream backing slab (chunky off-white badge body) */}
            <div style={{ position: "absolute", left: C.WELL_X - 34, top: C.WELL_Y - 34, width: C.WELL_W + 68, height: C.WELL_H + 68, borderRadius: C.WELL_R + 30, background: C.CREAM_LT, boxShadow: "0 40px 80px rgba(15,40,36,0.45)" }} />
            {/* coral mid-frame with teal border */}
            <div style={{ position: "absolute", left: C.WELL_X - 16, top: C.WELL_Y - 16, width: C.WELL_W + 32, height: C.WELL_H + 32, borderRadius: C.WELL_R + 14, background: C.CORAL, border: `6px solid ${C.TEAL_INK}` }} />
            {/* ── THE EXACT WELL: x=180 y=640 w=720 h=720 r=36 ── */}
            <div style={{ position: "absolute", left: C.WELL_X, top: C.WELL_Y, width: C.WELL_W, height: C.WELL_H, borderRadius: C.WELL_R, overflow: "hidden", background: C.TEAL_DEEP, border: `4px solid ${C.TEAL_INK}` }}>
              <img src={VID_POSTER} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              {/* subtle scanline texture inside well (retro TV) */}
              <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 4px)", pointerEvents: "none" }} />
              {/* corner sheen */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 40%)", pointerEvents: "none" }} />
              {/* corner play badge */}
              <div style={{ position: "absolute", left: "50%", top: "50%", width: 108, height: 108, marginLeft: -54, marginTop: -54, borderRadius: "50%", background: "rgba(243,236,221,0.92)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }}>
                <div style={{ width: 0, height: 0, marginLeft: 10, borderTop: "26px solid transparent", borderBottom: "26px solid transparent", borderLeft: `40px solid ${C.CORAL}` }} />
              </div>
            </div>
            {/* STAR top-left of the badge (b01) — twinkle/spin driven in handleFrame */}
            <div ref={wellStarRef} style={{ position: "absolute", left: C.WELL_X - 54, top: C.WELL_Y - 54, willChange: "transform", zIndex: 2 }}>
              <Star size={120} fill={C.SUNSET_GOLD} />
            </div>
            {/* NOW PLAYING pill top-right of the badge (b01) — blinking REC dot */}
            <div style={{ position: "absolute", left: C.WELL_X + C.WELL_W - 230, top: C.WELL_Y - 56, display: "flex", alignItems: "center", gap: 12, background: C.TEAL_INK, padding: "12px 22px", borderRadius: 100, border: `4px solid ${C.CREAM_LT}`, zIndex: 2 }}>
              <div ref={wellDotRef} style={{ width: 18, height: 18, borderRadius: "50%", background: C.CORAL }} />
              <TrackedCaps size={26} color={C.CREAM_LT} ls={3}>now&nbsp;playing</TrackedCaps>
            </div>
          </div>

          {/* bottom editorial copy */}
          <div ref={wellCopyBotRef} style={{ position: "absolute", left: 0, right: 0, top: 1500, textAlign: "center", willChange: "transform, opacity", opacity: 0 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 800, fontStyle: "italic", fontSize: 88, color: C.CORAL, lineHeight: 0.92 }}>
              tropical punch
            </div>
            <div style={{ marginTop: 18 }}>
              <TrackedCaps size={26} color={C.TEAL_INK} ls={6}>prebiotics&nbsp;·&nbsp;botanicals&nbsp;·&nbsp;fiber</TrackedCaps>
            </div>
          </div>
        </div>

        {/* ═══════════════════ BEAT 4 — THE SWAP ═══════════════════ */}
        <div ref={swapRef} style={{ ...fill, zIndex: 40, background: C.CREAM, overflow: "hidden", opacity: 0 }}>
          <div ref={swapBurstRef} style={{ position: "absolute", left: "50%", top: 960, width: 1, height: 1, willChange: "transform", opacity: 0 }}>
            <svg width={2800} height={2800} viewBox="-1400 -1400 2800 2800" style={{ position: "absolute", left: -1400, top: -1400 }}>
              <Sunburst rays={28} colorA={C.SEAFOAM_LT} colorB={C.CREAM_LT} r={1500} />
            </svg>
          </div>
          {/* title */}
          <div ref={swapTitleRef} style={{ position: "absolute", left: "50%", top: 170, textAlign: "center", willChange: "transform, opacity", opacity: 0 }}>
            <TrackedCaps size={34} color={C.CORAL} ls={8}>the&nbsp;swap</TrackedCaps>
            <div style={{ fontFamily: SERIF, fontWeight: 800, fontStyle: "italic", fontSize: 104, color: C.TEAL_INK, lineHeight: 0.94, marginTop: 12 }}>
              ditch the<br />sugar bomb
            </div>
          </div>

          {/* OLD soda card */}
          <div ref={swapOldRef} style={{ position: "absolute", left: 90, top: 580, width: 900, willChange: "transform, opacity, filter", opacity: 0 }}>
            <div style={{ background: "#3A3A3A", borderRadius: 28, padding: "40px 44px", boxShadow: "0 18px 40px rgba(0,0,0,0.25)", position: "relative", border: "4px solid #2A2A2A" }}>
              <TrackedCaps size={28} color="#C9C9C9" ls={5}>regular&nbsp;soda</TrackedCaps>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6, position: "relative" }}>
                <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 168, color: "#FFFFFF", lineHeight: 0.9 }}>39g</div>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, color: "#FF6B5A" }}>sugar</div>
                {/* strike line */}
                <svg style={{ position: "absolute", left: -10, top: 80, overflow: "visible" }} width={420} height={20}>
                  <line ref={swapStrikeRef} x1={0} y1={10} x2={400} y2={10} stroke="#FF3B2F" strokeWidth={16} strokeLinecap="round" strokeDasharray={420} strokeDashoffset={420} />
                </svg>
              </div>
              <TrackedCaps size={24} color="#9A9A9A" ls={3}>spikes&nbsp;·&nbsp;crashes&nbsp;·&nbsp;no&nbsp;fiber</TrackedCaps>
            </div>
          </div>

          {/* arrow / vs */}
          <div ref={swapArrowRef} style={{ position: "absolute", left: "50%", top: 935, width: 1, height: 1, willChange: "transform, opacity", opacity: 0 }}>
            <div style={{ width: 150, height: 150, marginLeft: -75, marginTop: -75, borderRadius: "50%", background: C.CORAL, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 30px rgba(232,80,58,0.5)", border: `6px solid ${C.CREAM_LT}` }}>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontStyle: "italic", fontSize: 64, color: C.CREAM_LT }}>vs</div>
            </div>
          </div>

          {/* NEW OLIPOP card */}
          <div ref={swapNewRef} style={{ position: "absolute", left: 90, top: 1040, width: 900, willChange: "transform, opacity", opacity: 0 }}>
            <div style={{ background: C.TEAL_INK, borderRadius: 28, padding: "40px 44px", boxShadow: "0 18px 40px rgba(20,67,61,0.4)", position: "relative", border: `4px solid ${C.CORAL}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Wordmark size={56} color={C.CORAL} />
              </div>
              <div style={{ display: "flex", gap: 18, marginTop: 24 }}>
                <div ref={swapStat1Ref} style={{ flex: 1, background: C.CREAM_LT, borderRadius: 18, padding: "20px 0", textAlign: "center", willChange: "transform, opacity", opacity: 0 }}>
                  <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: C.CORAL, lineHeight: 0.9 }}>4g</div>
                  <TrackedCaps size={22} color={C.TEAL_INK} ls={3}>sugar</TrackedCaps>
                </div>
                <div ref={swapStat2Ref} style={{ flex: 1, background: C.CORAL, borderRadius: 18, padding: "20px 0", textAlign: "center", willChange: "transform, opacity", opacity: 0 }}>
                  <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: C.CREAM_LT, lineHeight: 0.9 }}>9g</div>
                  <TrackedCaps size={22} color={C.CREAM_LT} ls={3}>fiber</TrackedCaps>
                </div>
                <div ref={swapStat3Ref} style={{ flex: 1.3, background: C.SEAFOAM, borderRadius: 18, padding: "20px 6px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", willChange: "transform, opacity", opacity: 0 }}>
                  <div style={{ fontFamily: SERIF, fontWeight: 800, fontStyle: "italic", fontSize: 46, color: C.TEAL_INK, lineHeight: 0.95 }}>gut-<br />healthy</div>
                  <TrackedCaps size={18} color={C.TEAL_INK} ls={2}>prebiotics</TrackedCaps>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════ BEAT 5 — FLAVOR RAINBOW ═══════════════════ */}
        <div ref={rainbowRef} style={{ ...fill, zIndex: 30, overflow: "hidden", opacity: 0 }}>
          <div ref={rainbowBgRef} style={{ ...fill, background: C.FL_TROPICAL, transition: "none" }} />
          <div ref={rainbowBurstRef} style={{ position: "absolute", left: "50%", top: 960, width: 1, height: 1, willChange: "transform", opacity: 0.4 }}>
            <svg width={2800} height={2800} viewBox="-1400 -1400 2800 2800" style={{ position: "absolute", left: -1400, top: -1400 }}>
              <Sunburst rays={40} colorA={"rgba(255,255,255,0.22)"} colorB={"rgba(255,255,255,0.05)"} r={1500} />
            </svg>
          </div>
          {/* the 6 flavor cans (single stage, stacked center) */}
          {[
            { src: CAN_TROPICAL, name: "tropical punch" },
            { src: CAN_PINEAPPLE, name: "pineapple paradise" },
            { src: CAN_GINGERALE, name: "ginger ale" },
            { src: CAN_CRISPAPPLE, name: "crisp apple" },
            { src: CAN_SHIRLEY, name: "shirley temple" },
            { src: CAN_VINTAGECOLA, name: "vintage cola" },
          ].map((f, i) => (
            <React.Fragment key={i}>
              <div ref={flCanRefs[i]} style={{ position: "absolute", left: "50%", top: 850, width: 540, height: 710, willChange: "transform, opacity", opacity: 0 }}>
                <img src={f.src} style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 24px 36px rgba(0,0,0,0.32))" }} />
              </div>
              <div ref={flLabelRefs[i]} style={{ position: "absolute", left: "50%", top: 1430, textAlign: "center", willChange: "transform, opacity", opacity: 0 }}>
                <div style={{ fontFamily: SERIF, fontWeight: 800, fontStyle: "italic", fontSize: 92, color: C.CREAM_LT, lineHeight: 0.92, textShadow: "0 5px 0 rgba(0,0,0,0.25)" }}>{f.name}</div>
              </div>
            </React.Fragment>
          ))}
          {/* "find your flavor" final title */}
          <div ref={rainbowTitleRef} style={{ position: "absolute", left: "50%", top: 300, textAlign: "center", willChange: "transform, opacity", opacity: 0 }}>
            <TrackedCaps size={34} color={C.CREAM_LT} ls={8}>13&nbsp;flavors</TrackedCaps>
            <div style={{ fontFamily: SERIF, fontWeight: 800, fontStyle: "italic", fontSize: 120, color: C.CREAM_LT, lineHeight: 0.9, marginTop: 14, textShadow: "0 6px 0 rgba(0,0,0,0.2)" }}>
              find your<br />flavor
            </div>
          </div>
          <div ref={rainbowGridRef} style={{ position: "absolute", inset: 0 }} />
        </div>

        {/* ═══════════════════ BEAT 6 — OFFER ═══════════════════ */}
        <div ref={offerRef} style={{ ...fill, zIndex: 20, background: C.SEAFOAM, overflow: "hidden", opacity: 0 }}>
          <div ref={offerBurstRef} style={{ position: "absolute", left: "50%", top: 880, width: 1, height: 1, willChange: "transform", opacity: 0 }}>
            <svg width={2800} height={2800} viewBox="-1400 -1400 2800 2800" style={{ position: "absolute", left: -1400, top: -1400 }}>
              <Sunburst rays={32} colorA={C.SEAFOAM_LT} colorB={"#A9D9D4"} r={1500} />
            </svg>
          </div>
          {/* title */}
          <div ref={offerTitleRef} style={{ position: "absolute", left: "50%", top: 240, textAlign: "center", willChange: "transform, opacity", opacity: 0 }}>
            <TrackedCaps size={32} color={C.CORAL} ls={8}>stock&nbsp;up</TrackedCaps>
            <div style={{ fontFamily: SERIF, fontWeight: 800, fontStyle: "italic", fontSize: 104, color: C.TEAL_INK, lineHeight: 0.94, marginTop: 14 }}>
              build your<br />variety pack
            </div>
          </div>
          {/* shadow */}
          <div ref={offerShadowRef} style={{ position: "absolute", left: "50%", top: 1430, width: 700, height: 80, marginLeft: -350, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(15,40,36,0.4), transparent 70%)", willChange: "transform, opacity" }} />
          {/* 12-pack — centered via translate(-50%,-50%) ONLY */}
          <div ref={offerPackRef} style={{ position: "absolute", left: "50%", top: 1000, width: 900, height: 900, willChange: "transform, opacity", opacity: 0 }}>
            <img src={PACK_12} style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 28px 44px rgba(15,40,36,0.35))" }} />
          </div>
          {/* B01 GRAFT: inline tracked-caps line replaces the two badge cards.
              Dark green (#14433D) because the offer bg is light seafoam — white would blend in. */}
          <div ref={offerSubRef} style={{ position: "absolute", left: 0, right: 0, top: 1640, textAlign: "center", willChange: "opacity, clip-path" }}>
            <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 38, letterSpacing: 6, color: C.TEAL_INK, textTransform: "uppercase" }}>
              9g&nbsp;fiber&nbsp;·&nbsp;12&nbsp;pack&nbsp;·&nbsp;mix&nbsp;&amp;&nbsp;match
            </span>
          </div>
        </div>

        {/* ═══════════════════ BEAT 7 — CTA ═══════════════════ */}
        <div ref={ctaRef} style={{ ...fill, zIndex: 10, background: C.CORAL, overflow: "hidden", opacity: 0 }}>
          {/* ═══ B01 GRAFT — outro lockup on coral concentric-ring sunburst (opens the CTA beat directly) ═══ */}
          {/* radiating coral sunburst (centered behind the lockup) */}
          <div ref={ctaBurstRef} style={{ position: "absolute", left: "50%", top: 960, width: 1, height: 1, willChange: "transform", opacity: 0 }}>
            <svg width={2800} height={2800} viewBox="-1400 -1400 2800 2800" style={{ position: "absolute", left: -1400, top: -1400 }}>
              <Sunburst rays={30} colorA={C.CORAL} colorB={"#F2856C"} r={1500} />
            </svg>
          </div>
          {/* concentric cream rings (the b01 "radiating" target) */}
          <div ref={ctaRingsRef} style={{ position: "absolute", left: "50%", top: 960, width: 1, height: 1, willChange: "transform", opacity: 0 }}>
            <svg width={1700} height={1700} viewBox="-850 -850 1700 1700" style={{ position: "absolute", left: -850, top: -850 }}>
              <Rings count={7} gap={108} stroke={C.CREAM} sw={6} start={150} />
            </svg>
          </div>
          {/* center sun glow so the radiating reads as centered */}
          <div style={{ position: "absolute", left: "50%", top: 960, width: 920, height: 920, marginLeft: -460, marginTop: -460, borderRadius: "50%", background: `radial-gradient(closest-side, ${C.CORAL} 40%, rgba(232,80,58,0) 72%)`, pointerEvents: "none" }} />
          {/* stars (b01 sparkle ring) */}
          {[
            { x: 130, y: 360 }, { x: 870, y: 440 }, { x: 160, y: 1520 },
            { x: 880, y: 1480 }, { x: 520, y: 300 },
          ].map((p, i) => (
            <div key={i} ref={ctaStarRefs[i]} style={{ position: "absolute", left: p.x, top: p.y, willChange: "transform, opacity", opacity: 0 }}>
              <Star size={i % 2 ? 70 : 92} fill={C.SUNSET_GOLD} />
            </div>
          ))}
          {/* "drink" (small cream) + "OLIPOP" (big yellow, dark-green outline) */}
          <div ref={ctaLogoRef} style={{ position: "absolute", left: "50%", top: 860, transform: "translate(-50%,-50%)", textAlign: "center", willChange: "transform, opacity", opacity: 0 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 130, color: C.CREAM_LT, lineHeight: 0.85, textShadow: `0 8px 0 ${C.TEAL_INK}` }}>drink</div>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 200, color: C.SUNSET_GOLD, lineHeight: 0.85, WebkitTextStroke: `5px ${C.TEAL_INK}`, textShadow: `0 9px 0 ${C.TEAL_INK}` }}>OLIPOP</div>
          </div>
          {/* drinkolipop.com cream pill */}
          <div ref={ctaUrlRef} style={{ position: "absolute", left: 0, right: 0, top: 1240, textAlign: "center", willChange: "transform, opacity", opacity: 0 }}>
            <span style={{ display: "inline-block", fontFamily: SANS, fontWeight: 700, fontSize: 50, color: C.TEAL_INK, background: C.CREAM_LT, padding: "18px 50px", borderRadius: 100, letterSpacing: 2, border: `6px solid ${C.TEAL_INK}` }}>
              drinkolipop.com
            </span>
          </div>
        </div>

      </div>

      {/* ════════ retro print grain (top, baked, ambient) ════════ */}
      <div style={{ ...fill, zIndex: 200, backgroundImage: GRAIN, backgroundSize: "200px 200px", opacity: 0.06, mixBlendMode: "multiply", pointerEvents: "none" }} />
      {/* subtle vignette */}
      <div style={{ ...fill, zIndex: 201, background: "radial-gradient(ellipse at center, transparent 55%, rgba(14,51,46,0.22) 100%)", pointerEvents: "none" }} />
    </Timegroup>
  );
};
