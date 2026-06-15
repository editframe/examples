import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { clamp, lerp, track, easeOutCubic, easeInCubic, easeInOutQuad, outBack } from "./components/helpers";
import { DURATION_MS, BLACK, WHITE, OFF_WHITE, INK, GREY, MONT, PRICE, SALE } from "./constants";
import {
  ED01, ED07, ED10, ED11, DRESS_1, DRESS_2, DRESS_3,
  TEX_PAPER, TEX_INK,
} from "./assets";

/**
 * FASHION NOVA — "THE STITCH · FINAL"  (9:16 · 1080x1920 · 25s · ONE fixed Timegroup)
 *
 * STITCHED from g1 (Kinetic Type · base) + g2 (Lookbook Assembly) + g3 (Retail Mechanics).
 * MONOCHROME / SILVER brand kit: every BUILT graphic is black / white / grey / SILVER —
 * NO yellow, NO magenta. Real look photos + TEX_INK keep their natural color.
 *
 * SCENE SEQUENCE (master ms · 25000 total):
 *   S1 COVER          0     – 4000   g1 S1, MOD: TEX_INK through letters · wordmark CENTERED · SILVER tag
 *   S2 SWING RACK     4000  – 9000   g3 B2, MOD: BIGGER hanging cards, no dead space · mono
 *   S3 FAN → EDIT     9000  – 14500  g2 FAN + DEAL beats · mono recolor · photos in color
 *   S4 FINAL HOURS    14500 – 19500  g3 B7 flip-clock countdown · white/silver
 *   S5 OUTRO          19500 – 25000  g1 S6, MOD: image-filled lockup, NO 80% OFF tag
 */

// ── SILVER monochrome accent (replaces all YELLOW/MAGENTA) ──
const SILVER = "#C9CDD2";
const SILVER_GRAD = "linear-gradient(180deg,#F2F4F6 0%,#C9CDD2 45%,#9AA0A6 100%)";
const SILVER_DIM = "#9AA0A6";

// ── scene windows (master ms) ──
const S1 = 0,     S1E = 4000;
const S2 = 4000,  S2E = 9000;
const S3 = 9000,  S3E = 14500;
const S4 = 14500, S4E = 19500;
const S5 = 19500, S5E = 25000;

// scene visibility: hard cut-in, short cross to avoid a flash of empty frame between beats
const sceneVis = (ms: number, start: number, end: number, fadeIn = 260, fadeOut = 320) =>
  track(ms, start, start + fadeIn, easeOutCubic) * (1 - track(ms, end - fadeOut, end, easeInCubic));

// shared style helpers
const imgFill = (src: string, pos = "center 18%", size = "cover"): React.CSSProperties => ({
  backgroundImage: `url(${src})`,
  backgroundSize: size,
  backgroundPosition: pos,
  backgroundRepeat: "no-repeat",
});

// text masked by an image (type-as-window) — the heart of the concept
const textWindow = (src: string, pos = "center 16%", size = "150%"): React.CSSProperties => ({
  backgroundImage: `url(${src})`,
  backgroundSize: size,
  backgroundPosition: pos,
  backgroundRepeat: "no-repeat",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
});

const cover = (src: string, extra: React.CSSProperties = {}): React.CSSProperties => ({
  position: "absolute", inset: 0, width: "100%", height: "100%",
  objectFit: "cover", ...extra,
});

// perforated dashed edge (swing-tag look) — mono
const PERF = `repeating-linear-gradient(90deg, ${BLACK} 0 7px, transparent 7px 14px)`;
const ob = (overshoot = 1.7) => (t: number) => outBack(t, overshoot);

// ── S3 card layout constants (from g2) ──
const CARD_W = 360;
const CARD_H = 540;
type Look = { src: string; no: string; name: string; objPos: string; off: string };
const LOOKS: Look[] = [
  { src: DRESS_2, no: "01", name: "MIDNIGHT MAXI", objPos: "50% 18%", off: "50" },
  { src: ED01,    no: "02", name: "PLUM BODYCON",  objPos: "50% 30%", off: "60" },
  { src: ED11,    no: "03", name: "IVORY GOWN",    objPos: "50% 22%", off: "40" },
  { src: ED07,    no: "04", name: "LUXE BLAZER",   objPos: "50% 38%", off: "70" },
  { src: ED10,    no: "05", name: "CREAM COWL",    objPos: "50% 40%", off: "55" },
  { src: DRESS_3, no: "06", name: "NOIR EDITION",  objPos: "50% 20%", off: "65" },
];
// fly-in origins (offscreen), relative to S3 centre (540,960)
const FLYIN = [
  { x: -820, y: -1100, r: -28 }, { x: 820, y: -1180, r: 26 },
  { x: -900, y: 1180, r: 22 },   { x: 900, y: 1120, r: -24 },
  { x: -1050, y: -120, r: -14 }, { x: 1050, y: 120, r: 16 },
];
const DECK = [
  { x: -16, y: -22, r: -7 }, { x: 14, y: -10, r: 5 }, { x: -8, y: 4, r: -3 },
  { x: 10, y: 16, r: 4 },    { x: -4, y: 28, r: -2 }, { x: 6, y: 40, r: 6 },
];
const FAN = [
  { x: -360, y: 70, r: -34 }, { x: -212, y: 4, r: -20 }, { x: -70, y: -28, r: -7 },
  { x: 70, y: -28, r: 7 },    { x: 212, y: 4, r: 20 },   { x: 360, y: 70, r: 34 },
];
const GRID = [
  { x: -250, y: -470, r: 0 }, { x: 250, y: -470, r: 0 },
  { x: -250, y: 0, r: 0 },    { x: 250, y: 0, r: 0 },
  { x: -250, y: 470, r: 0 },  { x: 250, y: 470, r: 0 },
];

export const Video: React.FC = () => {
  // ===== refs =====
  const g1 = useRef<HTMLDivElement>(null); // grain
  const driftRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const progBar = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  // S1 COVER
  const s1 = useRef<HTMLDivElement>(null);
  const s1Fash = useRef<HTMLDivElement>(null);
  const s1Ion = useRef<HTMLDivElement>(null);
  const s1Nova = useRef<HTMLDivElement>(null);
  const s1Mast = useRef<HTMLDivElement>(null);
  const s1Sub = useRef<HTMLDivElement>(null);
  const s1Bar = useRef<HTMLDivElement>(null);
  const s1Tag = useRef<HTMLDivElement>(null);

  // S2 SWING-TICKET RACK (g3 B2)
  const s2 = useRef<HTMLDivElement>(null);
  const s2Rail = useRef<HTMLDivElement>(null);
  const s2Head = useRef<HTMLDivElement>(null);
  const s2TagWraps = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const s2TagStrs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  // S3 FAN → EDIT (g2)
  const s3 = useRef<HTMLDivElement>(null);
  const s3Stage = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stampRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fanTitleRef = useRef<HTMLDivElement>(null);
  const fanSubRef = useRef<HTMLDivElement>(null);
  const editTitleRef = useRef<HTMLDivElement>(null);
  const editRuleRef = useRef<HTMLDivElement>(null);
  const editFootRef = useRef<HTMLDivElement>(null);

  // S4 SPEC STACK (infographic) — header + 4 full-width spec bands + footer, mono/silver, NO ink
  const s4 = useRef<HTMLDivElement>(null);
  const s4Head = useRef<HTMLDivElement>(null);
  const s4Foot = useRef<HTMLDivElement>(null);
  const s4Bands = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  // S5 OUTRO (g1 S6)
  const s5 = useRef<HTMLDivElement>(null);
  const s5Fash = useRef<HTMLDivElement>(null);
  const s5Nova = useRef<HTMLDivElement>(null);
  const s5Url = useRef<HTMLDivElement>(null);
  const s5Under = useRef<HTMLDivElement>(null);

  const setOpa = (r: React.RefObject<HTMLDivElement>, v: number) => { if (r.current) r.current.style.opacity = String(v); };
  const set = (r: React.RefObject<HTMLElement>, s: Partial<CSSStyleDeclaration>) => { if (r.current) Object.assign(r.current.style, s); };

  const handleFrame = useCallback((arg: any) => {
    const ms: number = arg?.ownCurrentTimeMs ?? 0;

    // ===== GLOBAL: grain flicker, drift, counter, progress, scene-cut flash =====
    if (g1.current) g1.current.style.opacity = String(0.05 + 0.03 * Math.sin(ms / 90));
    if (driftRef.current) {
      const dx = Math.sin(ms / 2600) * 9;
      const dy = Math.cos(ms / 3100) * 7;
      driftRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
    }
    if (counterRef.current) {
      const f = Math.floor((ms / 1000) * 30);
      counterRef.current.textContent = `F ${String(f).padStart(4, "0")} / 0750`;
    }
    if (progBar.current) progBar.current.style.width = `${clamp(ms / DURATION_MS) * 100}%`;
    if (flashRef.current) {
      const cuts = [S2, S3, S4, S5];
      let fl = 0;
      for (const c of cuts) fl = Math.max(fl, track(ms, c - 60, c, easeOutCubic) * (1 - track(ms, c, c + 150, easeOutCubic)));
      flashRef.current.style.opacity = String(fl * 0.7);
    }

    // ===== scene container visibilities =====
    setOpa(s1, sceneVis(ms, S1, S1E));
    setOpa(s2, sceneVis(ms, S2, S2E));
    setOpa(s3, sceneVis(ms, S3, S3E));
    setOpa(s4, sceneVis(ms, S4, S4E));
    setOpa(s5, sceneVis(ms, S5, S5E));

    // ============================================================
    // S1 — COVER (0–4000)  TEX_INK behind see-through FASHION/NOVA, CENTERED, SILVER tag
    // ============================================================
    {
      const t = ms - S1;
      // masthead top bar
      if (s1Mast.current) {
        const p = track(t, 0, 320, easeOutCubic);
        s1Mast.current.style.opacity = "1";
        s1Mast.current.style.transform = `translateY(${lerp(-18, 0, p)}px)`;
      }
      // "FASHION" slams down, ink-filled
      if (s1Fash.current) {
        const p = track(t, 0, 560, outBack);
        s1Fash.current.style.opacity = String(track(t, 0, 120, easeOutCubic));
        s1Fash.current.style.transform = `translateY(${lerp(-180, 0, p)}px) scaleY(${lerp(1.22, 1, clamp(p))})`;
        const pan = lerp(54, 66, track(t, 0, 4000, easeInOutQuad));
        s1Fash.current.style.backgroundPosition = `center ${pan}%`;
      }
      if (s1Ion.current) {
        const p = track(t, 420, 820, easeOutCubic);
        s1Ion.current.style.opacity = String(p);
        s1Ion.current.style.letterSpacing = `${lerp(2, 18, p)}px`;
      }
      // "NOVA" slams up, ink-filled
      if (s1Nova.current) {
        const p = track(t, 300, 900, outBack);
        s1Nova.current.style.opacity = String(track(t, 300, 440, easeOutCubic));
        s1Nova.current.style.transform = `translateY(${lerp(220, 0, p)}px) scaleY(${lerp(1.25, 1, clamp(p))})`;
        const pan = lerp(68, 54, track(t, 0, 4000, easeInOutQuad));
        s1Nova.current.style.backgroundPosition = `center ${pan}%`;
      }
      if (s1Sub.current) {
        const p = track(t, 980, 1420, easeOutCubic);
        s1Sub.current.style.opacity = String(p);
        s1Sub.current.style.clipPath = `inset(0 ${lerp(100, 0, p)}% 0 0)`;
      }
      // SILVER swing tag flicks in
      if (s1Tag.current) {
        const p = track(t, 1180, 1560, outBack);
        s1Tag.current.style.opacity = String(track(t, 1180, 1300, easeOutCubic));
        s1Tag.current.style.transform = `rotate(${lerp(-22, -8, p)}deg) scale(${lerp(0.5, 1, clamp(p))})`;
      }
      if (s1Bar.current) s1Bar.current.style.transform = `scaleX(${track(t, 700, 1300, easeOutCubic)})`;
      // exit compress
      if (s1.current) {
        const ex = track(t, S1E - S1 - 360, S1E - S1, easeInCubic);
        s1.current.style.transform = `translateY(${lerp(0, -50, ex)}px) scale(${lerp(1, 1.04, ex)})`;
      }
    }

    // ============================================================
    // S2 — SWING-TICKET RACK (4000–9000)  g3 B2, BIGGER cards, mono
    // ============================================================
    {
      const rail = track(ms, S2 - 120, S2 + 280, easeOutCubic);
      set(s2Rail, { transform: `scaleX(${rail})`, transformOrigin: "0% 50%" });
      const head = track(ms, S2 - 40, S2 + 360, easeOutCubic);
      set(s2Head, { opacity: String(head), transform: `translateY(${lerp(-26, 0, head)}px)` });
      for (let i = 0; i < 3; i++) {
        // first tag is already dropping when the scene fades in (no dead frame at the cut)
        const t0 = S2 + 60 + i * 300;
        const drop = track(ms, t0, t0 + 560, ob(1.5));
        const settle = clamp((ms - (t0 + 560)) / 1500);
        const swayAmp = lerp(15, 3.4, settle);
        const ang = swayAmp * Math.sin((ms - t0) / (200 + i * 22) + i);
        set(s2TagWraps[i], {
          opacity: String(track(ms, t0, t0 + 220, easeOutCubic)),
          transform: `translateY(${lerp(-760, 0, drop)}px)`,
        });
        set(s2TagStrs[i], { transform: `rotate(${ang}deg)` });
      }
    }

    // ============================================================
    // S3 — FAN → THE EDIT (9000–14500)  g2 fly-in→fan→deal grid, mono
    // ============================================================
    {
      // local clock for this scene — cards start flying in BEFORE the scene fully fades in
      // so the cut from S2 never shows an empty/black frame.
      const FLY0 = S3 - 260;     // cards fly in & stack (already moving at the cut)
      const FAN0 = S3 + 1500;    // deck → fan
      const DEAL0 = S3 + 2900;   // fan → grid
      const STAMP0 = S3 + 3700;  // %OFF chips slam onto grid cards (mono chips)
      for (let i = 0; i < 6; i++) {
        const card = cardRefs.current[i];
        if (!card) continue;
        const flyP = track(ms, FLY0 + i * 90, FLY0 + 600 + i * 90, easeOutCubic);
        const fanP = track(ms, FAN0 + i * 40, FAN0 + 700 + i * 40, easeInOutQuad);
        const dealP = track(ms, DEAL0 + i * 90, DEAL0 + 700 + i * 90, outBack);
        const from = FLYIN[i], deck = DECK[i], fan = FAN[i], grid = GRID[i];
        let x = lerp(from.x, deck.x, flyP);
        let y = lerp(from.y, deck.y, flyP);
        let r = lerp(from.r, deck.r, flyP);
        x = lerp(x, fan.x, fanP); y = lerp(y, fan.y, fanP); r = lerp(r, fan.r, fanP);
        x = lerp(x, grid.x, dealP); y = lerp(y, grid.y, dealP); r = lerp(r, grid.r, dealP);
        // deck depth while stacked/fanned
        const deckZ = lerp(0, (5 - i) * 26, flyP) * (1 - fanP) * (1 - dealP);
        const scale = lerp(1, 0.8, dealP);
        card.style.opacity = String(flyP > 0.001 ? 1 : 0);
        card.style.transform = `translate3d(${x}px, ${y}px, ${deckZ}px) rotate(${r}deg) scale(${scale})`;
        // swing tag (mono) jitter
        const tag = tagRefs.current[i];
        if (tag) {
          const swing = Math.sin((ms + i * 230) / 360) * (3 + 3 * dealP);
          tag.style.transform = `rotate(${swing}deg)`;
        }
        // %OFF chip slam onto grid card (mono/silver)
        const stamp = stampRefs.current[i];
        if (stamp) {
          const sp = track(ms, STAMP0 + i * 90, STAMP0 + 300 + i * 90, outBack);
          stamp.style.opacity = String(clamp(sp));
          stamp.style.transform = `rotate(-9deg) scale(${lerp(1.5, 1, clamp(sp))})`;
        }
      }
      // FAN title "THE EDIT" rises while fanned, exits as deal begins
      if (fanTitleRef.current) {
        const inP = track(ms, FAN0 + 100, FAN0 + 600, outBack);
        const out = track(ms, DEAL0 - 200, DEAL0 + 150, easeInCubic);
        fanTitleRef.current.style.opacity = String(clamp(inP) * (1 - out));
        fanTitleRef.current.style.transform = `translateY(${lerp(40, 0, clamp(inP))}px) scale(${lerp(1.1, 1, clamp(inP))})`;
      }
      if (fanSubRef.current) {
        const inP = track(ms, FAN0 + 400, FAN0 + 800, easeOutCubic);
        const out = track(ms, DEAL0 - 200, DEAL0 + 150, easeInCubic);
        fanSubRef.current.style.opacity = String(inP * (1 - out));
      }
      // THE EDIT grid chrome (header / rule / footer) as cards deal
      {
        const inP = track(ms, DEAL0 + 100, DEAL0 + 600, easeOutCubic);
        const out = track(ms, S3E - 350, S3E - 80, easeInCubic);
        const vis = inP * (1 - out);
        if (editTitleRef.current) {
          editTitleRef.current.style.opacity = String(vis);
          editTitleRef.current.style.transform = `translateY(${lerp(-26, 0, inP)}px)`;
        }
        if (editRuleRef.current) {
          editRuleRef.current.style.opacity = String(vis);
          editRuleRef.current.style.transform = `scaleX(${inP})`;
        }
        if (editFootRef.current) {
          editFootRef.current.style.opacity = String(vis);
          editFootRef.current.style.transform = `translateY(${lerp(26, 0, inP)}px)`;
        }
      }
      // subtle stage breathe
      if (s3Stage.current) {
        const breathe = Math.sin(ms / 1600) * 5;
        const drift = Math.sin(ms / 2400) * 7;
        s3Stage.current.style.transform = `translate(${drift}px, ${breathe}px)`;
      }
    }

    // ============================================================
    // S4 — SPEC STACK INFOGRAPHIC (14500–19500)  full-frame dress-spec layout
    //   header band + 4 full-width spec bands + footer · mono/silver · NO ink
    //   (replaces the old thermal receipt — fills the whole frame, no dead space)
    // ============================================================
    {
      // header slides down + draws rule
      if (s4Head.current) {
        const h = track(ms, S4 + 80, S4 + 520, easeOutCubic);
        s4Head.current.style.opacity = String(h);
        s4Head.current.style.transform = `translateY(${lerp(-30, 0, h)}px)`;
      }
      // 4 spec bands stagger top→bottom: slide up + fade (entrance done well before S4E)
      for (let i = 0; i < 4; i++) {
        const t0 = S4 + 360 + i * 360;
        const b = track(ms, t0, t0 + 620, outBack);
        const fade = track(ms, t0, t0 + 300, easeOutCubic);
        set(s4Bands[i], { opacity: String(fade), transform: `translateY(${lerp(70, 0, b)}px)` });
      }
      // footer fades up last, holds
      if (s4Foot.current) {
        const f = track(ms, S4 + 1900, S4 + 2400, easeOutCubic);
        s4Foot.current.style.opacity = String(f);
        s4Foot.current.style.transform = `translateY(${lerp(24, 0, f)}px)`;
      }
    }

    // ============================================================
    // S5 — OUTRO (19500–25000)  g1 S6 image-filled lockup + URL, NO 80% tag
    // ============================================================
    {
      const t = ms - S5;
      if (s5Fash.current) {
        const p = track(t, 200, 900, outBack);
        s5Fash.current.style.opacity = String(track(t, 200, 380, easeOutCubic));
        s5Fash.current.style.transform = `translateX(${lerp(-180, 0, p)}px)`;
        const pan = lerp(14, 24, track(t, 0, 5500, easeInOutQuad));
        s5Fash.current.style.backgroundPosition = `center ${pan}%`;
      }
      if (s5Nova.current) {
        const p = track(t, 360, 1060, outBack);
        s5Nova.current.style.opacity = String(track(t, 360, 540, easeOutCubic));
        s5Nova.current.style.transform = `translateX(${lerp(180, 0, p)}px)`;
        const pan = lerp(28, 16, track(t, 0, 5500, easeInOutQuad));
        s5Nova.current.style.backgroundPosition = `center ${pan}%`;
      }
      if (s5Under.current) s5Under.current.style.transform = `scaleX(${track(t, 1000, 1600, easeOutCubic)})`;
      if (s5Url.current) {
        const p = track(t, 1500, 1980, easeOutCubic);
        s5Url.current.style.opacity = String(p);
        s5Url.current.style.letterSpacing = `${lerp(2, 12, p)}px`;
      }
    }
  }, []);

  // ── reusable HUD corner mark ──
  const RegMark: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div style={{ position: "absolute", width: 34, height: 34, ...style }}>
      <div style={{ position: "absolute", left: "50%", top: 0, width: 1.5, height: "100%", background: "rgba(0,0,0,0.55)", transform: "translateX(-50%)" }} />
      <div style={{ position: "absolute", top: "50%", left: 0, height: 1.5, width: "100%", background: "rgba(0,0,0,0.55)", transform: "translateY(-50%)" }} />
      <div style={{ position: "absolute", inset: 9, border: "1.5px solid rgba(0,0,0,0.55)", borderRadius: "50%" }} />
    </div>
  );
  // barcode (vertical bars) — mono
  const Barcode: React.FC<{ w: number; h: number; color?: string }> = ({ w, h, color = BLACK }) => {
    const widths = [3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 5, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1];
    return (
      <div style={{ display: "flex", gap: 2, width: w, height: h, alignItems: "stretch" }}>
        {widths.map((bw, i) => <div key={i} style={{ width: bw, background: color, flex: "0 0 auto" }} />)}
      </div>
    );
  };
  // S2 swing-ticket TAG face (look photo cropped in + mono/silver chrome)
  const Tag: React.FC<{ src: string; num: string; tw: number; th: number }> = ({ src, num, tw, th }) => (
    <div style={{ width: tw, height: th, background: OFF_WHITE, position: "relative", boxShadow: "0 24px 50px rgba(0,0,0,0.55)", border: `2px solid ${BLACK}` }}>
      {/* grommet hole */}
      <div style={{ position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", width: 30, height: 30, borderRadius: "50%", background: BLACK }}>
        <div style={{ position: "absolute", inset: 8, borderRadius: "50%", background: OFF_WHITE }} />
      </div>
      {/* perforated top strip */}
      <div style={{ position: "absolute", top: 58, left: 14, right: 14, height: 3, background: PERF }} />
      {/* number */}
      <div style={{ position: "absolute", top: 72, left: 16, fontWeight: 900, fontSize: 36, color: BLACK, fontFamily: MONT }}>{num}</div>
      <div style={{ position: "absolute", top: 80, right: 16, fontWeight: 700, fontSize: 15, letterSpacing: "0.18em", color: BLACK, fontFamily: MONT }}>NOVA BABE</div>
      {/* image window (photo keeps full color) */}
      <div style={{ position: "absolute", top: 118, left: 16, right: 16, bottom: 100, overflow: "hidden", background: BLACK }}>
        <img src={src} style={cover(src)} />
      </div>
      {/* SILVER price chip */}
      <div style={{ position: "absolute", bottom: 50, left: 16, background: SILVER_GRAD, color: BLACK, fontWeight: 900, fontSize: 28, padding: "5px 14px", fontFamily: MONT, border: `2px solid ${BLACK}`, transform: "rotate(-3deg)" }}>{PRICE}</div>
      {/* mini barcode */}
      <div style={{ position: "absolute", bottom: 16, left: 16 }}><Barcode w={tw - 32} h={22} /></div>
      {/* SHOP THE LOOK micro */}
      <div style={{ position: "absolute", bottom: 54, right: 16, fontWeight: 800, fontSize: 13, letterSpacing: "0.12em", color: BLACK, fontFamily: MONT, textAlign: "right", lineHeight: 1.1 }}>SHOP<br />THE LOOK</div>
    </div>
  );

  // S2 BIGGER tags: scaled up & lowered so they fill the frame (fix #2)
  const S2_TAGS = [
    { src: DRESS_2, num: "01", x: 60,  tw: 366, th: 600, str: 110 },
    { src: ED01,    num: "02", x: 380, tw: 396, th: 640, str: 250 },
    { src: ED11,    num: "03", x: 728, tw: 366, th: 600, str: 150 },
  ];

  return (
    <Timegroup
      mode="fixed"
      duration={`${DURATION_MS}ms`}
      onFrame={handleFrame as any}
      workbench
      className="w-[1080px] h-[1920px] relative overflow-hidden"
      style={{ background: OFF_WHITE }}
    >
      <div ref={driftRef} style={{ position: "absolute", inset: -20, fontFamily: MONT, color: BLACK }}>

        {/* ============ S1 — COVER ============ */}
        <div ref={s1} style={{ position: "absolute", inset: 20, opacity: 0 }}>
          {/* paper bg */}
          <div style={{ position: "absolute", inset: 0, ...imgFill(TEX_PAPER, "center", "cover") }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(246,244,241,0.30), rgba(246,244,241,0.0) 30%, rgba(246,244,241,0.0) 72%, rgba(246,244,241,0.55))" }} />
          {/* masthead */}
          <div ref={s1Mast} style={{ position: "absolute", top: 54, left: 56, right: 56, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0, borderBottom: `2px solid ${BLACK}`, paddingBottom: 14 }}>
            <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: 3 }}>THE FALL EDIT</div>
            <div style={{ fontWeight: 600, fontSize: 24, letterSpacing: 2 }}>ISSUE Nº 07</div>
          </div>
          {/* CENTERED wordmark block: FASHION + AUTUMN/WINTER + NOVA, vertically middle */}
          {/* FASHION — INK-filled letters (TEX_INK, not the woman) */}
          <div ref={s1Fash} style={{ position: "absolute", top: 560, left: 0, right: 0, textAlign: "center", fontWeight: 900, fontSize: 250, lineHeight: 0.86, letterSpacing: "-0.02em", opacity: 0, ...textWindow(TEX_INK, "center 60%", "460%") }}>FASHION</div>
          {/* thin separator line of type */}
          <div ref={s1Ion} style={{ position: "absolute", top: 850, left: 0, right: 0, textAlign: "center", fontWeight: 700, fontSize: 30, letterSpacing: 12, opacity: 0, color: BLACK }}>AUTUMN / WINTER · 2026</div>
          {/* NOVA — INK-filled letters */}
          <div ref={s1Nova} style={{ position: "absolute", top: 930, left: 0, right: 0, textAlign: "center", fontWeight: 900, fontSize: 360, lineHeight: 0.82, letterSpacing: "-0.03em", opacity: 0, ...textWindow(TEX_INK, "center 55%", "460%") }}>NOVA</div>
          {/* subline */}
          <div ref={s1Sub} style={{ position: "absolute", top: 1350, left: 0, right: 0, textAlign: "center", fontWeight: 700, fontSize: 38, letterSpacing: 8, opacity: 0, color: BLACK }}>NEW ARRIVALS · ON MODEL · NOW</div>
          {/* SILVER swing tag (fix #1: not yellow) */}
          <div ref={s1Tag} style={{ position: "absolute", top: 1460, right: 90, opacity: 0, transform: "rotate(-8deg)" }}>
            <div style={{ background: SILVER_GRAD, color: BLACK, fontWeight: 900, fontSize: 42, padding: "16px 26px", letterSpacing: 1, border: `2px solid ${BLACK}`, boxShadow: "0 14px 30px rgba(0,0,0,0.25)" }}>UP TO 80% OFF</div>
            <div style={{ width: 14, height: 14, borderRadius: "50%", border: `3px solid ${BLACK}`, background: OFF_WHITE, position: "absolute", top: -7, left: 18 }} />
          </div>
          {/* bottom rule */}
          <div ref={s1Bar} style={{ position: "absolute", bottom: 120, left: 56, right: 56, height: 6, background: BLACK, transformOrigin: "left", transform: "scaleX(0)" }} />
          <div style={{ position: "absolute", bottom: 70, left: 56, fontWeight: 700, fontSize: 24, letterSpacing: 3 }}>FASHIONNOVA.COM</div>
          <div style={{ position: "absolute", bottom: 70, right: 56, fontWeight: 600, fontSize: 24, letterSpacing: 2 }}>VOL. 01</div>
        </div>

        {/* ============ S2 — SWING-TICKET RACK (g3 B2, BIGGER, mono) ============ */}
        <div ref={s2} style={{ position: "absolute", inset: 0, opacity: 0, background: INK }}>
          <img src={TEX_PAPER} style={cover(TEX_PAPER, { opacity: 0.10, mixBlendMode: "screen" })} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 80% at 50% 30%, rgba(255,255,255,0.06), rgba(0,0,0,0) 60%)" }} />
          <RegMark style={{ top: 40, left: 40 }} />
          <RegMark style={{ top: 40, right: 40 }} />
          {/* header — SILVER chip */}
          <div ref={s2Head} style={{ position: "absolute", top: 84, left: 0, right: 0, textAlign: "center", opacity: 0 }}>
            <div style={{ display: "inline-block", background: SILVER_GRAD, color: BLACK, fontWeight: 900, fontSize: 32, padding: "7px 20px", letterSpacing: "0.04em", fontFamily: MONT, border: `2px solid ${BLACK}`, transform: "rotate(-1.5deg)" }}>SHOP THE LOOK</div>
            <div style={{ marginTop: 12, fontWeight: 800, fontSize: 20, letterSpacing: "0.34em", color: WHITE, fontFamily: MONT }}>NEW ARRIVALS · UP TO 80% OFF</div>
          </div>
          {/* giant background watermark fills lower zone */}
          <div style={{ position: "absolute", left: "50%", top: "72%", transform: "translate(-50%,-50%) rotate(-8deg)", fontWeight: 900, fontSize: 460, lineHeight: 0.8, color: "rgba(255,255,255,0.05)", fontFamily: MONT, whiteSpace: "nowrap", letterSpacing: "-0.04em", pointerEvents: "none" }}>SALE</div>
          {/* vertical brand ticker rails */}
          <div style={{ position: "absolute", top: 420, bottom: 120, left: 18, width: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontWeight: 800, fontSize: 16, letterSpacing: "0.4em", color: "rgba(255,255,255,0.4)", fontFamily: MONT }}>UP TO 80% OFF · FINAL HOURS</div>
          </div>
          <div style={{ position: "absolute", top: 420, bottom: 120, right: 18, width: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ writingMode: "vertical-rl", fontWeight: 800, fontSize: 16, letterSpacing: "0.4em", color: "rgba(255,255,255,0.4)", fontFamily: MONT }}>NOVA BABE · SHOP THE LOOK</div>
          </div>
          {/* rail (lowered to make room for bigger tags) */}
          <div ref={s2Rail} style={{ position: "absolute", top: 410, left: 64, right: 64, height: 7, background: WHITE, borderRadius: 4, boxShadow: "0 6px 18px rgba(0,0,0,0.7)" }} />
          <div style={{ position: "absolute", top: 406, left: 54, width: 16, height: 16, borderRadius: "50%", background: WHITE }} />
          <div style={{ position: "absolute", top: 406, right: 54, width: 16, height: 16, borderRadius: "50%", background: WHITE }} />
          {/* 3 BIGGER swing-tickets */}
          {S2_TAGS.map((t, i) => (
            <div key={i} ref={s2TagWraps[i]} style={{ position: "absolute", top: 410 + t.str, left: t.x, transform: "translateY(-760px)", opacity: 0 }}>
              <div ref={s2TagStrs[i]} style={{ position: "relative", transformOrigin: `50% ${-t.str}px` }}>
                <div style={{ position: "absolute", left: "50%", bottom: "100%", width: 3, height: t.str, background: WHITE, transform: "translateX(-50%)" }} />
                <div style={{ position: "absolute", left: "50%", bottom: "100%", width: 16, height: 16, border: `3px solid ${WHITE}`, borderRadius: "50%", transform: "translate(-50%, 4px)", background: INK }} />
                <Tag src={t.src} num={t.num} tw={t.tw} th={t.th} />
              </div>
            </div>
          ))}
          {/* ticker footer — SILVER text */}
          <div style={{ position: "absolute", bottom: 56, left: 0, right: 0, textAlign: "center", fontWeight: 900, fontSize: 24, letterSpacing: "0.26em", color: SILVER, fontFamily: MONT }}>03 LOOKS · $39.99 EACH · FASHIONNOVA.COM</div>
        </div>

        {/* ============ S3 — FAN → THE EDIT (g2, mono) ============ */}
        <div ref={s3} style={{ position: "absolute", inset: 0, opacity: 0, background: "#0d0d0f" }}>
          <img src={TEX_PAPER} style={cover(TEX_PAPER, { opacity: 0.07, mixBlendMode: "screen" })} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 50% 42%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none" }} />
          <RegMark style={{ top: 40, left: 40 }} />
          <RegMark style={{ top: 40, right: 40 }} />
          <div ref={s3Stage} style={{ position: "absolute", inset: 0, perspective: 1700 }}>
            {/* FAN title */}
            <div ref={fanTitleRef} style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", opacity: 0 }}>
              <div style={{ fontWeight: 900, fontSize: 150, letterSpacing: "-0.02em", color: WHITE, textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>THE EDIT</div>
            </div>
            <div ref={fanSubRef} style={{ position: "absolute", left: 0, right: 0, top: 430, textAlign: "center", fontWeight: 700, fontSize: 34, letterSpacing: "0.34em", color: SILVER, opacity: 0 }}>SIX LOOKS · ONE DROP</div>

            {/* THE EDIT grid chrome */}
            <div ref={editTitleRef} style={{ position: "absolute", left: 70, right: 70, top: 110, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0 }}>
              <div style={{ fontWeight: 900, fontSize: 64, letterSpacing: "0.02em", color: WHITE }}>THE EDIT</div>
              <div style={{ fontWeight: 700, fontSize: 28, letterSpacing: "0.24em", color: WHITE }}>VOL.01</div>
            </div>
            <div ref={editRuleRef} style={{ position: "absolute", left: 70, right: 70, top: 190, height: 4, background: WHITE, transformOrigin: "left center", transform: "scaleX(0)", opacity: 0 }} />
            <div ref={editFootRef} style={{ position: "absolute", left: 70, right: 70, bottom: 96, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 26, letterSpacing: "0.22em", color: WHITE }}>FASHIONNOVA.COM</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 40 }}>
                {[3, 2, 5, 2, 3, 6, 2, 4, 2, 5, 3, 2, 6, 3, 2].map((w, k) => (
                  <div key={k} style={{ width: w, height: 40, background: WHITE }} />
                ))}
              </div>
              <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: "0.1em", color: WHITE }}>P.01</div>
            </div>

            {/* THE CARDS */}
            {LOOKS.map((look, i) => (
              <div
                key={i}
                ref={(el) => { cardRefs.current[i] = el; }}
                style={{
                  position: "absolute", left: 540 - CARD_W / 2, top: 960 - CARD_H / 2,
                  width: CARD_W, height: CARD_H, background: WHITE, padding: 14, paddingBottom: 46,
                  boxShadow: "0 30px 60px rgba(0,0,0,0.45), 0 4px 14px rgba(0,0,0,0.3)",
                  willChange: "transform, opacity", transformStyle: "preserve-3d", opacity: 0,
                  zIndex: 20 + (6 - i),
                }}
              >
                <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: OFF_WHITE }}>
                  <img src={look.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: look.objPos, display: "block" }} />
                  {/* number badge */}
                  <div style={{ position: "absolute", left: 0, top: 0, background: BLACK, color: WHITE, fontWeight: 900, fontSize: 30, padding: "6px 14px", letterSpacing: "0.04em" }}>{look.no}</div>
                  {/* %OFF stamp — SILVER (mono) */}
                  <div
                    ref={(el) => { stampRefs.current[i] = el; }}
                    style={{ position: "absolute", right: 10, top: 12, background: SILVER_GRAD, color: BLACK, fontWeight: 900, fontSize: 26, padding: "6px 10px", lineHeight: 0.95, textAlign: "center", border: `2px solid ${BLACK}`, opacity: 0, boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}
                  >{look.off}%<br />OFF</div>
                </div>
                {/* footer label */}
                <div style={{ position: "absolute", left: 14, right: 14, bottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "0.14em", color: BLACK }}>{look.name}</span>
                  <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "0.06em", color: GREY }}>{PRICE}</span>
                </div>
                {/* swing tag — mono (BLACK/SILVER) */}
                <div
                  ref={(el) => { tagRefs.current[i] = el; }}
                  style={{ position: "absolute", right: -6, top: 8, transformOrigin: "top center", width: 30, height: 60, pointerEvents: "none" }}
                >
                  <div style={{ width: 2, height: 16, background: BLACK, margin: "0 auto" }} />
                  <div style={{ width: 30, height: 44, background: BLACK, color: SILVER, fontWeight: 900, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 3 }}>NEW</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============ S4 — SPEC STACK INFOGRAPHIC (mono/silver · NO INK · fills frame) ============ */}
        <div ref={s4} style={{ position: "absolute", inset: 0, opacity: 0, background: "linear-gradient(180deg, #17171B 0%, #0C0C0E 100%)" }}>
          <img src={TEX_PAPER} style={cover(TEX_PAPER, { opacity: 0.05, mixBlendMode: "screen" })} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(90% 60% at 50% 30%, rgba(255,255,255,0.06), rgba(0,0,0,0) 72%)", pointerEvents: "none" }} />
          {/* full-frame vertical flex: header / 4 bands / footer — edge to edge, no dead space */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
            {/* ── HEADER BAND ── */}
            <div ref={s4Head} style={{ flex: "0 0 226px", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 60px", opacity: 0, borderBottom: `3px solid ${WHITE}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontWeight: 900, fontSize: 88, letterSpacing: "-0.01em", color: WHITE, fontFamily: MONT, lineHeight: 0.9 }}>THE EDIT</div>
                <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: "0.22em", color: SILVER, fontFamily: MONT }}>VOL.01</div>
              </div>
              <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ background: SILVER_GRAD, color: BLACK, fontWeight: 900, fontSize: 26, padding: "6px 16px", letterSpacing: "0.06em", fontFamily: MONT, border: `2px solid ${WHITE}` }}>FINAL HOURS</div>
                <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: "0.30em", color: "rgba(255,255,255,0.78)", fontFamily: MONT }}>FOUR LOOKS · UP TO 80% OFF</div>
              </div>
            </div>
            {/* ── 4 FULL-WIDTH SPEC BANDS ── */}
            {[
              { src: DRESS_3, no: "01", name: "MIDNIGHT MAXI", objPos: "50% 16%", specs: ["FLOOR-LENGTH MAXI", "RIBBED KNIT · COWL BACK", "SIZES XS–XL"] },
              { src: ED01,    no: "02", name: "PLUM BODYCON",  objPos: "50% 26%", specs: ["RUCHED MINI", "STRETCH MESH · SQUARE NECK", "SIZES XS–L"] },
              { src: ED07,    no: "04", name: "LUXE BLAZER",   objPos: "50% 30%", specs: ["OVERSIZED BLAZER DRESS", "TAILORED SUITING · DOUBLE-BREASTED", "SIZES S–XL"] },
              { src: ED11,    no: "07", name: "IVORY GOWN",    objPos: "50% 18%", specs: ["SATIN SLIP GOWN", "BIAS-CUT · OPEN BACK", "SIZES XS–XL"] },
            ].map((band, i) => (
              <div
                key={i}
                ref={s4Bands[i]}
                style={{
                  flex: "1 1 0", minHeight: 0, display: "flex", alignItems: "center", gap: 36,
                  padding: "0 56px", opacity: 0,
                  borderBottom: i < 3 ? `1.5px solid rgba(255,255,255,0.16)` : "none",
                  background: i % 2 === 0 ? "rgba(255,255,255,0.022)" : "transparent",
                }}
              >
                {/* full-COLOR photo (left, tall) */}
                <div style={{ position: "relative", width: 250, height: 330, flex: "0 0 auto", overflow: "hidden", background: BLACK, border: `2px solid rgba(255,255,255,0.85)`, boxShadow: "0 18px 40px rgba(0,0,0,0.55)" }}>
                  <img src={band.src} style={cover(band.src, { objectPosition: band.objPos })} />
                  {/* look-number chip */}
                  <div style={{ position: "absolute", left: 0, top: 0, background: BLACK, color: WHITE, fontWeight: 900, fontSize: 26, padding: "4px 12px", letterSpacing: "0.04em", fontFamily: MONT }}>{band.no}</div>
                </div>
                {/* name + spec lines */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: "0.30em", color: SILVER, fontFamily: MONT, marginBottom: 6 }}>LOOK {band.no}</div>
                  <div style={{ fontWeight: 900, fontSize: 60, letterSpacing: "-0.01em", color: WHITE, fontFamily: MONT, lineHeight: 0.92 }}>{band.name}</div>
                  <div style={{ marginTop: 16, height: 2, width: 120, background: SILVER }} />
                  {band.specs.map((s, k) => (
                    <div key={k} style={{ marginTop: k === 0 ? 16 : 8, fontWeight: 700, fontSize: 21, letterSpacing: "0.20em", color: "rgba(255,255,255,0.82)", fontFamily: MONT }}>{s}</div>
                  ))}
                </div>
                {/* price block (right) — $59 struck → silver $39.99 chip */}
                <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  <div style={{ fontWeight: 900, fontSize: 34, color: "rgba(255,255,255,0.5)", textDecoration: "line-through", fontFamily: MONT }}>$59</div>
                  <div style={{ background: SILVER_GRAD, color: BLACK, fontWeight: 900, fontSize: 48, padding: "10px 22px", fontFamily: MONT, border: `2px solid ${WHITE}`, boxShadow: "0 10px 24px rgba(0,0,0,0.4)", lineHeight: 1 }}>$39.99</div>
                </div>
              </div>
            ))}
            {/* ── FOOTER BAND ── */}
            <div ref={s4Foot} style={{ flex: "0 0 78px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 60px", opacity: 0, borderTop: `3px solid ${WHITE}` }}>
              <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: "0.26em", color: WHITE, fontFamily: MONT }}>FASHIONNOVA.COM</div>
              <Barcode w={220} h={34} color={WHITE} />
              <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: "0.1em", color: SILVER, fontFamily: MONT }}>$39.99 EACH</div>
            </div>
          </div>
        </div>

        {/* ============ S5 — OUTRO (g1 S6, NO 80% tag) ============ */}
        <div ref={s5} style={{ position: "absolute", inset: 20, opacity: 0 }}>
          <div style={{ position: "absolute", inset: 0, background: BLACK }} />
          {/* ink pour confined to lower third */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "42%", overflow: "hidden", opacity: 0.5 }}>
            <div style={{ position: "absolute", inset: 0, ...imgFill(TEX_INK, "center 10%", "cover"), filter: "invert(1)", opacity: 0.3, mixBlendMode: "screen", transform: "scaleY(-1)" }} />
          </div>
          {/* subtle radial vignette glow behind the logo (mono) */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 45% at 50% 36%, rgba(255,255,255,0.07), transparent 70%)" }} />
          {/* top rule */}
          <div style={{ position: "absolute", top: 70, left: 56, right: 56, display: "flex", justifyContent: "space-between", color: WHITE, fontWeight: 700, fontSize: 24, letterSpacing: 3, borderBottom: "2px solid rgba(255,255,255,0.4)", paddingBottom: 14 }}>
            <span>THE FALL EDIT</span><span>ISSUE Nº 07</span>
          </div>
          {/* image-filled FASHION NOVA, centered */}
          <div style={{ position: "absolute", top: "40%", left: 0, right: 0, textAlign: "center", transform: "translateY(-50%)" }}>
            <div ref={s5Fash} style={{ fontWeight: 900, fontSize: 230, lineHeight: 0.84, letterSpacing: "-0.02em", opacity: 0, ...textWindow(DRESS_2, "center 14%", "170%") }}>FASHION</div>
            <div ref={s5Nova} style={{ fontWeight: 900, fontSize: 330, lineHeight: 0.8, letterSpacing: "-0.03em", opacity: 0, ...textWindow(DRESS_3, "center 18%", "150%") }}>NOVA</div>
          </div>
          {/* SILVER underline (mono, was yellow) */}
          <div ref={s5Under} style={{ position: "absolute", top: "60%", left: 160, right: 160, height: 8, background: SILVER_GRAD, transformOrigin: "center", transform: "scaleX(0)" }} />
          {/* url */}
          <div ref={s5Url} style={{ position: "absolute", top: "65%", left: 0, right: 0, textAlign: "center", color: WHITE, fontWeight: 800, fontSize: 50, letterSpacing: 12, opacity: 0 }}>FASHIONNOVA.COM</div>
          <div style={{ position: "absolute", top: "71%", left: 0, right: 0, textAlign: "center", color: "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: 30, letterSpacing: 6 }}>NEW ARRIVALS DAILY</div>
          {/* NO 80% OFF tag here (fix #3 — removed) */}
        </div>

        {/* ============ PERSISTENT HUD ============ */}
        <RegMark style={{ left: 30, top: 30 }} />
        <RegMark style={{ right: 30, top: 30 }} />
        <RegMark style={{ left: 30, bottom: 30 }} />
        <RegMark style={{ right: 30, bottom: 30 }} />
        <div ref={counterRef} style={{ position: "absolute", left: 84, bottom: 38, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: "rgba(0,0,0,0.55)", mixBlendMode: "difference" }}>F 0000 / 0750</div>
        <div style={{ position: "absolute", right: 84, bottom: 38, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: "rgba(0,0,0,0.55)", mixBlendMode: "difference" }}>FN · A/W 26</div>
        {/* master progress bar — SILVER (mono) */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 6, background: "rgba(0,0,0,0.12)" }}>
          <div ref={progBar} style={{ height: "100%", width: "0%", background: SILVER }} />
        </div>

        {/* scene-cut white flash */}
        <div ref={flashRef} style={{ position: "absolute", inset: -40, background: WHITE, opacity: 0, pointerEvents: "none" }} />

        {/* grain */}
        <div ref={g1} style={{ position: "absolute", inset: -40, opacity: 0.06, pointerEvents: "none", mixBlendMode: "overlay", backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }} />
      </div>
    </Timegroup>
  );
};
