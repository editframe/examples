import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { GOAL_MS } from "../constants";
import { track, keys, lerp, clamp, outBack, outCubic, inOutCubic, PAL } from "../helpers";
import { useFrameTask } from "../useFrameTask";

/**
 * S09 — Purple "Goal Reached"  ·  2.5s
 * Three beats inside the window:
 *   A (0–250ms)   full-frame light-lavender card, big dark "Unlocked" pill centred
 *   B (250–700ms) "You saved $200 for Headphones" reads at top, pill drops low-centre
 *   C (700–2500)  the full card shrinks into the centred phone "Goal Reached" mockup,
 *                 chrome party-popper + confetti, purple bg revealed around it
 * EF rasterizer: NO css/svg gradients — solid fills + stacked solid blobs only.
 */
const SANS = 'Arial, Helvetica, "Segoe UI", sans-serif';
const SERIF = 'Georgia, "Times New Roman", serif';
const INK = "#2A0A6E";        // deep purple text
const PILL = "#3A0DA0";       // dark-purple pill
const LAV = "#CEC0FE";        // light lavender (pill text / circle)
const CARDBG = "#E9E2FB";     // light-lavender card surface
const BLOB = "#B7A4F4";       // medium-lavender splash behind popper
const BLOB2 = "#C7B9F8";
// chrome bands (light -> dark) used as stacked solid fills to fake the metal sheen
const CHR_WHITE = "#F4F6FA";
const CHR_HI = "#D8DCE4";
const CHR_MID = "#AEB4C0";
const CHR_LO = "#828896";
const CHR_DK = "#565C6A";
const CHR_DKR = "#3C4250";
const CONFETTI = ["#C8CCD4", "#9AA0AC", "#B6BCC8", "#8B91A0", "#E0E3EA"];

// piecewise-linear key interpolation: [ms, value][]
const keyv2 = (ms: number, ks: [number, number][]) => {
  if (ms <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) {
    if (ms <= ks[i][0]) {
      const [t0, v0] = ks[i - 1], [t1, v1] = ks[i];
      return v0 + (v1 - v0) * ((ms - t0) / (t1 - t0));
    }
  }
  return ks[ks.length - 1][1];
};

/**
 * Figma-Motion spark mark for the Unlocked icon: a dark eye-ellipse with a
 * LAVENDER 4-point sparkle cut into its right half (sparkle = circle colour,
 * so it reads as a notch out of the ellipse).
 */
const SparkMark: React.FC<{ dark: string; spark: string }> = ({ dark, spark }) => (
  <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: "block" }}>
    <ellipse cx="48" cy="52" rx="38" ry="25" fill={dark} />
    {/* 4-point sparkle, lavender, offset to the right of centre */}
    <path
      d="M64 26 C68 47 70 49 91 53 C70 57 68 59 64 80 C60 59 58 57 37 53 C58 49 60 47 64 26 Z"
      fill={spark}
    />
  </svg>
);

/** Dark pill with "Unlocked" + lavender circle holding the spark. Sized by props. */
const UnlockedPill: React.FC<{ w: number; h: number; fs: number }> = ({ w, h, fs }) => {
  const cir = h * 0.74;
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: h / 2, background: PILL, display: "flex", alignItems: "center" }}>
      <div style={{ flex: 1, textAlign: "center", paddingLeft: h * 0.18, fontFamily: SANS, fontWeight: 800, fontStyle: "normal", fontSize: fs, color: LAV, letterSpacing: -1 }}>Unlocked</div>
      <div style={{ width: cir, height: cir, marginRight: (h - cir) / 2, borderRadius: "50%", background: LAV, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: cir * 0.7, height: cir * 0.7 }}><SparkMark dark={PILL} spark={LAV} /></div>
      </div>
    </div>
  );
};

/**
 * 3D chrome party-popper cone (tip down-left, mouth up-right), built from
 * stacked SOLID silver bands to fake the metal sheen (EF kills gradients).
 */
const PopperCone: React.FC = () => (
  <svg viewBox="0 0 200 220" width="100%" height="100%" style={{ display: "block", overflow: "visible" }}>
    {/* cone body — vertical facets, darkest at tip, brightest mid-left highlight */}
    <polygon points="55,206 96,104 150,128 120,150" fill={CHR_DKR} />
    <polygon points="55,206 96,104 112,116 84,160" fill={CHR_DK} />
    <polygon points="55,206 84,160 70,178" fill={CHR_LO} />
    <polygon points="84,160 96,104 112,116 100,150" fill={CHR_MID} />
    <polygon points="96,104 112,116 134,118 150,128" fill={CHR_LO} />
    {/* bright highlight streak down the cone */}
    <polygon points="78,158 92,108 100,110 88,160" fill={CHR_HI} />
    <polygon points="83,150 90,114 95,116 88,152" fill={CHR_WHITE} />
    {/* mouth — elliptical opening, silver rim + dark interior */}
    <ellipse cx="120" cy="116" rx="44" ry="20" transform="rotate(-34 120 116)" fill={CHR_HI} stroke={CHR_DK} strokeWidth="3" />
    <ellipse cx="120" cy="116" rx="30" ry="12" transform="rotate(-34 120 116)" fill={CHR_DKR} />
    <ellipse cx="116" cy="112" rx="20" ry="8" transform="rotate(-34 116 112)" fill={CHR_DK} />
    {/* rim glint */}
    <path d="M92 102 q26 -16 52 6" fill="none" stroke={CHR_WHITE} strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

/** One curly metallic streamer (helix-ish spiral) drawn as a thick silver stroke. */
const Streamer: React.FC<{ d: string; color: string; w: number }> = ({ d, color, w }) => (
  <>
    <path d={d} fill="none" stroke={CHR_DK} strokeWidth={w + 2} strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  </>
);

/** 4-point chrome star confetti. */
const StarBit: React.FC<{ x: number; y: number; r: number; color: string }> = ({ x, y, r, color }) => (
  <path
    d={`M${x} ${y - r} C${x + r * 0.18} ${y - r * 0.18} ${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y} C${x + r * 0.18} ${y + r * 0.18} ${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r} C${x - r * 0.18} ${y + r * 0.18} ${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y} C${x - r * 0.18} ${y - r * 0.18} ${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r} Z`}
    fill={color}
    stroke={CHR_DK}
    strokeWidth="1"
  />
);

export const Scene09_GoalReached: React.FC = () => {
  const cover = useRef<HTMLDivElement>(null);   // full-frame intro card (beats A/B)
  const coverPill = useRef<HTMLDivElement>(null);
  const saveTop = useRef<HTMLDivElement>(null);
  const phone = useRef<HTMLDivElement>(null);   // centred phone mockup (beat C)
  const conf = useRef<HTMLDivElement>(null);    // confetti group

  const handleFrame = useCallback(({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
    const ms = ownCurrentTimeMs;

    // ---- intro cover (light card) --------------------------------------------
    // pill squishes from the big fat toggle to the small wide button (ms250 -> ms620),
    // the card slides left->right (purple margin switches sides), then lifts to the phone.
    const lift = track(ms, 560, 760, inOutCubic);              // 0..1 cover exit
    if (cover.current) {
      cover.current.style.opacity = String(1 - lift);
      cover.current.style.left = `${keyv2(ms, [[167, -60], [500, 55]])}px`;
      cover.current.style.right = `${keyv2(ms, [[167, 60], [500, 0]])}px`;
      cover.current.style.transform = `translateY(${lerp(0, -90, lift)}px) scale(${lerp(1, 0.96, lift)})`;
    }
    if (coverPill.current) {
      const drop = keys(ms, [[250, 0], [620, 1]], outCubic);
      const sx = lerp(1.43, 1, drop), sy = lerp(2.12, 1, drop); // ~1410x435 -> ~985x205
      coverPill.current.style.opacity = "1";
      coverPill.current.style.transform = `translate(-50%,-50%) translateY(${lerp(8, 120, drop)}px) scale(${sx}, ${sy})`;
    }
    if (saveTop.current) {
      const t = track(ms, 300, 560, outCubic);                 // "You saved" reads in (B)
      saveTop.current.style.opacity = String(t);
      saveTop.current.style.transform = `translateY(${lerp(26, 0, t)}px)`;
    }

    // ---- phone mockup (beat C) ----------------------------------------------
    const rise = track(ms, 600, 980, outBack);                 // phone scales/rises in
    if (phone.current) {
      phone.current.style.opacity = String(clamp((ms - 600) / 200, 0, 1));
      phone.current.style.transform = `translate(-50%,-50%) scale(${lerp(0.86, 1, rise)})`;
    }
    if (conf.current) {
      const pop = track(ms, 900, 1400, outBack);               // confetti burst (spring out of the mouth)
      conf.current.style.opacity = String(clamp((ms - 880) / 160, 0, 1));
      conf.current.style.transform = `scale(${lerp(0.42, 1.06, pop)})`;
    }
  }, []);

  const frameRef = useFrameTask(handleFrame);
  return (
    <Timegroup mode="fixed" duration={`${GOAL_MS}ms`} ref={frameRef} className="absolute inset-0" style={{ background: PAL.purple }}>

      {/* ============ Beat C : centred phone "Goal Reached" mockup ============ */}
      <div
        ref={phone}
        style={{
          position: "absolute", left: "50%", top: "50%", width: 452, height: 944,
          transform: "translate(-50%,-50%) scale(0.86)", background: CARDBG, borderRadius: 46,
          opacity: 0, overflow: "hidden", boxShadow: "0 36px 90px rgba(0,0,0,0.30)",
        }}
      >
        {/* heading — two left-aligned lines; sized so "Reached" clears the right edge */}
        <div style={{ position: "absolute", left: 100, top: 132, fontFamily: SANS, fontWeight: 800, fontSize: 58, lineHeight: 1.0, color: INK, letterSpacing: -2.5 }}>
          Goal<br />Reached
        </div>

        {/* lavender splash (two stacked solid organic blobs — NO gradients) */}
        <div style={{ position: "absolute", left: "50%", top: 352, width: 332, height: 312, marginLeft: -166, background: BLOB2, borderRadius: "46% 54% 58% 42% / 52% 44% 56% 48%" }} />
        <div style={{ position: "absolute", left: "50%", top: 392, width: 244, height: 236, marginLeft: -110, background: BLOB, borderRadius: "54% 46% 42% 58% / 44% 56% 46% 54%" }} />

        {/* 3D chrome party-popper cone (tilted, tip down-left) */}
        <div style={{ position: "absolute", left: "50%", top: 392, width: 240, height: 264, marginLeft: -120, transform: "rotate(6deg)" }}>
          <PopperCone />
        </div>

        {/* confetti / streamers — curly metal ribbons, stars + bits bursting out the mouth */}
        <div ref={conf} style={{ position: "absolute", left: "50%", top: 350, width: 300, height: 260, marginLeft: -130, transformOrigin: "44% 64%" }}>
          <svg viewBox="0 0 300 260" width="100%" height="100%" style={{ overflow: "visible" }}>
            {/* big, WIDE burst — silver confetti + stars spray across the whole
                top half of the card in a wide up-and-out arc. */}
            {/* big curly streamers spiralling up & out of the mouth to BOTH sides */}
            <Streamer d="M118 96 q-14 -22 4 -34 q16 -10 6 -28 q-8 -14 8 -22" color={CHR_HI} w={7} />
            <Streamer d="M108 104 q-30 -14 -30 -40 q0 -18 -22 -22" color={CHR_MID} w={6} />
            <Streamer d="M150 88 q18 -16 8 -34 q-10 -16 10 -26" color={CHR_MID} w={6} />
            <Streamer d="M168 104 q30 -10 26 -34 q-4 -20 18 -24 q16 -2 18 14" color={CHR_HI} w={7} />
            <Streamer d="M192 132 q34 -2 40 22 q4 18 -14 22 q-16 4 -10 22" color={CHR_MID} w={6} />
            <Streamer d="M186 158 q34 6 30 32 q-2 16 -20 14" color={CHR_HI} w={6} />
            <Streamer d="M204 80 q22 -14 36 4" color={CHR_HI} w={6} />
            <Streamer d="M92 130 q-34 2 -42 30" color={CHR_MID} w={5} />
            <Streamer d="M138 70 q6 -26 -12 -36" color={CHR_HI} w={5} />
            <Streamer d="M78 96 q-20 -10 -22 -32" color={CHR_HI} w={5} />
            {/* stars — bigger + more, scattered across the top */}
            <StarBit x={186} y={54} r={15} color={CHR_WHITE} />
            <StarBit x={256} y={140} r={13} color={CHR_HI} />
            <StarBit x={222} y={210} r={11} color={CHR_WHITE} />
            <StarBit x={120} y={54} r={11} color={CHR_HI} />
            <StarBit x={58} y={122} r={10} color={CHR_WHITE} />
            <StarBit x={248} y={70} r={9} color={CHR_HI} />
            <StarBit x={86} y={190} r={9} color={CHR_WHITE} />
            {/* scattered confetti — dense upward FAN of larger silver rects + circles */}
            {[...Array(30)].map((_, i) => {
              const a = (-166 + i * 6.2) * Math.PI / 180;     // upper arc: up-left → straight up → up-right
              const r = 52 + (i % 6) * 25;
              const cx = 132 + r * Math.cos(a), cy = 122 + r * Math.sin(a);
              const col = CONFETTI[i % CONFETTI.length];
              const s = 1 + (i % 3) * 0.35;
              return i % 2 === 0
                ? <rect key={i} x={cx - 9 * s} y={cy - 5 * s} width={18 * s} height={10 * s} rx={2} fill={col} transform={`rotate(${i * 37} ${cx} ${cy})`} />
                : <circle key={i} cx={cx} cy={cy} r={4.5 + (i % 3) * 1.6} fill={col} />;
            })}
          </svg>
        </div>

        {/* "You saved $200 for Headphones" */}
        <div style={{ position: "absolute", left: 152, top: 720, width: 240, textAlign: "left", fontFamily: SANS, fontWeight: 500, fontSize: 26, lineHeight: 1.28, color: INK }}>
          You saved $200 for Headphones
        </div>

        {/* Unlocked pill — lower-left of card */}
        <div style={{ position: "absolute", left: 44, bottom: 60 }}>
          <UnlockedPill w={290} h={78} fs={30} />
        </div>
      </div>

      {/* ============ Beats A/B : light-lavender cover card ======== */}
      {/* card slides left->right (purple margin moves from right edge to LEFT edge) */}
      <div ref={cover} style={{ position: "absolute", left: -60, top: 0, right: 60, bottom: 44, borderRadius: "0 0 64px 64px", background: CARDBG, overflow: "hidden" }}>
        {/* "You saved $200 for Headphones" — top of frame */}
        <div ref={saveTop} style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 88, lineHeight: 1.22, color: INK }}>
          You saved $200 for<br />Headphones
        </div>
        {/* Unlocked pill — starts centred (A), drops low-centre (B). Rest size ~985x205 */}
        <div ref={coverPill} style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%) scale(0.72)", opacity: 0 }}>
          <UnlockedPill w={985} h={205} fs={110} />
        </div>
      </div>

    </Timegroup>
  );
};

export default Scene09_GoalReached;
