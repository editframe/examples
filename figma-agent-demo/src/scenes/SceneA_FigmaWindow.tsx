import React, { useCallback, useRef } from "react";
import { Timegroup, Audio } from "@editframe/react";
import { Reveal } from "../components/Reveal";
import { Sfx } from "../components/Sfx";
import { clamp, lerp, typewriter } from "../components/helpers";

/**
 * SceneA — Figma window (10s).
 *
 * Pegs that anchor this scene:
 *   PEG-091222: full Figma window, Bookworm/Book Details mockup centered on
 *               lavender canvas, layers/pages list left, properties right,
 *               bottom canvas toolbar visible.
 *   PEG-091306: tight punch on top of mockup — selection handles + sparkle
 *               outside top-right of frame.
 *   PEG-091415: progress card UI (Split / Natasha Ruiz / Chapter 3 of 8)
 *               that mirrors the green progress card later in this scene.
 *   PEG-092718: right-panel auto-layout properties with tooltip — the
 *               look the right panel matches.
 *
 * Reference video timing (Figma Native Agent.mp4):
 *   0–1.5s wide settle on Figma window, file name types
 *   1.5–4s push-in to mockup top (book details header, big selection handles)
 *   4–7s   pan-right to properties panel — Fill swatch + Auto-layout tooltip
 *   7–10s  pull back, "exporting…" pill appears, dissolve out
 *
 * Camera magnitudes (brand cap relaxed to 2.5x for this video):
 *   t=0     scale 0.92, settle
 *   t=1.5   scale 1.0
 *   t=2.5   scale 2.0, tx=0,  ty=+260 (frame the Book Details header top) [see note below]
 *   t=5     scale 1.6,  tx=-560, ty=+60 (frame right-panel Fill area)
 *   t=8     scale 1.0,  tx=0,  ty=0 (wide release)
 *   t=10    fade to next scene
 *
 * NOTE: the camera magnitudes actually implemented (see `scenea-camera` in
 * styles.css) were re-tuned so the cursor's clicks land on visible targets —
 * see the click-target derivation comments further down. The values above are
 * the original design intent; the shipped numbers are 1.5/1.5/1.0→3.5/1.0/tx0
 * →4.5/1.5/tx760,ty120→5.5(hold)→6.8/1.6/tx-680,ty200→8.0(hold)→10/1.0/tx0.
 *
 * Camera + panel/mockup/badge/stagger animations are all fully declarative CSS
 * (see `scenea-*` keyframes in styles.css and the `Reveal` usages below). Two
 * things are kept as a small scene-scoped `addFrameTask`:
 *   1. The file-name typewriter — CSS cannot mutate text content over time.
 *   2. The cursor sweep + both click "consequences" (Progress Card row
 *      selection, Fill swatch → color-picker → hue-drag → button recolor,
 *      including the Fill hex text swap). These stay together because
 *      they're all keyed off the exact same two click timestamps
 *      (4600ms, 7000ms) and re-deriving that coupling as independently-timed
 *      CSS keyframes risks the click/selection/color-swap drifting out of
 *      sync without a render pass to verify (REFACTOR-PATTERNS.md Part 2b,
 *      priority 5). The Fill hex text swap in particular cannot be pure CSS
 *      at all (text content), so this callback isn't avoidable, only
 *      minimizable — everything that COULD move to CSS without that
 *      dependency (camera, panels, mockup, stagger, tooltip, exporting pill)
 *      has been.
 */

const INTER: React.CSSProperties = {
  fontFamily:
    "'Inter', 'Plus Jakarta Sans', -apple-system, system-ui, sans-serif",
  fontFeatureSettings: "'cv11', 'ss01', 'ss03'",
};

const LAYERS = [
  { name: "Image", indent: 0, icon: "▢" },
  { name: "Bookworm / Home / Mobile", indent: 0, icon: "▣" },
  { name: "Header", indent: 1, icon: "▦" },
  // "Progress Card" highlights ONLY after the cursor click at t=4.6s — not pre-styled.
  { name: "Progress Card", indent: 1, icon: "◉" },
  { name: "Cover Art", indent: 2, icon: "▢" },
  { name: "Bookworm / Book Details", indent: 0, icon: "▣" },
  { name: "Hero Image", indent: 1, icon: "▦" },
  { name: "CTA Row", indent: 1, icon: "▭" },
  { name: "Buttons / Active", indent: 2, icon: "◐" },
  { name: "Buttons / Idle", indent: 2, icon: "◐" },
  { name: "Menu", indent: 1, icon: "▦" },
  { name: "Web / Cart / Mobile", indent: 0, icon: "▣" },
  { name: "Cart Summary", indent: 1, icon: "▭" },
  { name: "Checkout / Confirm", indent: 1, icon: "▢" },
  { name: "Modal / Address", indent: 1, icon: "▭" },
];

const PAGES = [
  "Screens",
  "Components",
  "Design Review",
  "QA Feedback",
  "Archive",
  "Handoff",
];

// Layer-row entrance stagger — computed once from array index (priority-2
// pattern from REFACTOR-PATTERNS.md Part 2b), not a per-frame `.forEach`.
const LAYER_STAGGER_START = 1500;
const LAYER_STAGGER_STEP = 160;
const LAYER_STAGGER_DUR = 460;

// ── CURSOR (clicks land on real UI targets) ──
// CSS coords (pre-camera-transform). The cursor lives INSIDE the camera
// rig so it scales/translates with the panel under it.
//
// Click 1 — Progress Card row in LEFT panel:
//   target = (100, 384) [design] → re-measured to (80, 461), see below.
//   t=1.0s   enter from bottom-left  (200, 980)
//   t=4.3s   land on row              (80, 461)
//   t=4.6s   CLICK pulse fires        → row gets blue selection highlight
//   t=4.6–5.4s hold on row
//
// Click 2 — Fill swatch in RIGHT panel:
//   target = (1627, 433)
//   t=5.4–6.7s travel from row toward swatch (curved through middle)
//   t=6.7s   land on swatch
//   t=7.0s   CLICK pulse fires        → color picker pops + CTA colors change
//   t=7.0–8.4s hold on swatch
//   t=8.4–9.2s exit downward, fade out
//
// EMPIRICAL CALIBRATION (re-measured from rendered frames): the real CSS y of
// the Progress Card row is ~461, not the design's ~384 — the hand-counted
// layer-row y-base under-estimated the vertical padding before the Layers
// list (tabs + Pages section + borders all stack taller than assumed).
const PROGRESS_X = 80, PROGRESS_Y = 461;
const SWATCH_X = 1627, SWATCH_Y = 433;
// Hue-bar drag coords (in CSS, derived from picker geometry):
//   picker_left ≈ SWATCH_X - 188 = 1439
//   hue bar y: picker_top + 111 = (SWATCH_Y + 30) + 111 = 574
//   green (80%): 1451 + 156*0.8 = 1576   purple (50%): 1451 + 156*0.5 = 1529
const HUE_GREEN_X = 1576, HUE_PURPLE_X = 1529, HUE_Y = 574;

const cameEase = (t: number) => {
  const x = clamp(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

export const SceneA_FigmaWindow: React.FC = () => {
  const fileNameRef = useRef<HTMLSpanElement>(null);
  const progressLayerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorPulseRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const hueDotRef = useRef<HTMLDivElement>(null);
  const fillSwatchRef = useRef<HTMLDivElement>(null);
  const fillHexRef = useRef<HTMLSpanElement>(null);
  const addToLibBtnRef = useRef<HTMLDivElement>(null);
  const readBtnRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;

      // File name typewriter
      if (fileNameRef.current) {
        const t = typewriter(ms, 500, 900, "Bookworm");
        if (fileNameRef.current.textContent !== t)
          fileNameRef.current.textContent = t;
      }

      // ── CURSOR ──
      if (cursorRef.current) {
        let cx = 200, cy = 980, op = 0;
        if (ms < 1000) {
          op = 0;
        } else if (ms < 4300) {
          const t = clamp((ms - 1000) / 3300);
          const e = cameEase(t);
          cx = lerp(200, PROGRESS_X, e);
          cy = lerp(980, PROGRESS_Y, e);
          op = clamp((ms - 1000) / 250);
        } else if (ms < 5400) {
          cx = PROGRESS_X; cy = PROGRESS_Y; op = 1;
        } else if (ms < 6700) {
          const t = clamp((ms - 5400) / 1300);
          const e = cameEase(t);
          cx = lerp(PROGRESS_X, SWATCH_X, e);
          cy = lerp(PROGRESS_Y, SWATCH_Y, e);
          op = 1;
        } else if (ms < 7100) {
          cx = SWATCH_X; cy = SWATCH_Y; op = 1;
        } else if (ms < 7300) {
          const t = clamp((ms - 7100) / 200);
          const e = 1 - Math.pow(1 - t, 3); // outCubic
          cx = lerp(SWATCH_X, HUE_GREEN_X, e);
          cy = lerp(SWATCH_Y, HUE_Y, e);
          op = 1;
        } else if (ms < 7900) {
          const t = clamp((ms - 7300) / 600);
          const e = cameEase(t); // inOutCubic
          cx = lerp(HUE_GREEN_X, HUE_PURPLE_X, e);
          cy = HUE_Y; op = 1;
        } else if (ms < 8400) {
          cx = HUE_PURPLE_X; cy = HUE_Y; op = 1;
        } else {
          const t = clamp((ms - 8400) / 800);
          cx = lerp(SWATCH_X, SWATCH_X + 40, t);
          cy = lerp(SWATCH_Y, SWATCH_Y + 120, t);
          op = 1 - t;
        }
        cursorRef.current.style.opacity = String(op);
        cursorRef.current.style.transform = `translate(${cx - 4}px, ${cy - 2}px)`;
      }
      // Click pulses
      if (cursorPulseRef.current) {
        let pulse = 0, px = PROGRESS_X, py = PROGRESS_Y;
        const m1 = ms - 4600;
        const m2 = ms - 7000;
        if (m1 >= 0 && m1 <= 360) { pulse = 1 - m1 / 360; px = PROGRESS_X; py = PROGRESS_Y; }
        else if (m2 >= 0 && m2 <= 360) { pulse = 1 - m2 / 360; px = SWATCH_X; py = SWATCH_Y; }
        if (pulse > 0) {
          const scale = 1 + (1 - pulse) * 2.2;
          cursorPulseRef.current.style.opacity = String(pulse);
          cursorPulseRef.current.style.transform = `translate(${px - 18}px, ${py - 18}px) scale(${scale})`;
        } else {
          cursorPulseRef.current.style.opacity = "0";
        }
      }

      // ── CLICK 1 CONSEQUENCE: Progress Card row gains Figma selection blue ──
      if (progressLayerRef.current) {
        const sel = clamp((ms - 4600) / 260);
        const row = progressLayerRef.current;
        row.style.background = sel > 0
          ? `rgba(13,153,255,${0.14 * sel})`
          : "transparent";
        row.style.borderLeftColor = sel > 0.5 ? "#0D99FF" : "transparent";
        row.style.color = sel > 0.5 ? "#0D6FB8" : "#1E1E1E";
        row.style.fontWeight = sel > 0.5 ? "500" : "400";
        if (sel > 0.5) {
          row.style.marginLeft = "-2px";
          const iconSpan = row.firstChild as HTMLElement | null;
          if (iconSpan) iconSpan.style.color = "#0D99FF";
        } else {
          row.style.marginLeft = "0px";
        }
      }

      // ── CLICK 2 CONSEQUENCE: color picker pops + Fill changes from green to purple ──
      if (ms >= 7000) {
        const popP = clamp((ms - 7000) / 250);
        if (colorPickerRef.current) {
          const fadeOut = clamp((ms - 8200) / 300);
          const easedFadeOut = fadeOut * fadeOut * fadeOut; // inCubic
          const op = popP * (1 - easedFadeOut);
          colorPickerRef.current.style.opacity = String(op);
          colorPickerRef.current.style.transform = `translateY(${lerp(8, 0, popP)}px)`;
        }

        const dragP = clamp((ms - 7300) / 600);
        const dotPct = lerp(80, 50, dragP);
        if (hueDotRef.current) {
          hueDotRef.current.style.left = `${dotPct}%`;
        }

        const isPurple = dragP > 0.5;
        if (fillSwatchRef.current) {
          fillSwatchRef.current.style.background = isPurple ? "#A259FF" : "#0ACF83";
        }
        if (fillHexRef.current) {
          fillHexRef.current.textContent = isPurple ? "A259FF" : "0ACF83";
        }
        if (addToLibBtnRef.current) {
          addToLibBtnRef.current.style.borderColor = isPurple ? "#A259FF" : "#0ACF83";
          addToLibBtnRef.current.style.color = isPurple ? "#6B2BDB" : "#0A8856";
        }
        if (readBtnRef.current) {
          readBtnRef.current.style.background = isPurple ? "#A259FF" : "#0ACF83";
        }
      } else {
        if (colorPickerRef.current) colorPickerRef.current.style.opacity = "0";
        if (hueDotRef.current) hueDotRef.current.style.left = "80%";
      }
    },
    []
  );

  return (
    <Timegroup
      mode="fixed"
      duration="10s"
      onFrame={handleFrame as any}
      className="absolute inset-0"
    >
      {/* Lavender canvas — peg-matched #B7C3CC */}
      <div style={{ position: "absolute", inset: 0, background: "#B7C3CC" }} />

      {/* Cross-dissolve to SceneB's own (same-colored) canvas */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#B7C3CC",
          zIndex: 40,
          pointerEvents: "none",
          animation: "wash-in 300ms 9700ms cubic-bezier(0.33,1,0.68,1) both",
        }}
      />

      <Sfx cue="reveal" at={0.05} dur={1.0} volume={0.38} />
      <Sfx cue="pop" at={1.8} dur={0.4} volume={0.22} />
      <Sfx cue="ping" at={6.3} dur={0.5} volume={0.26} />
      <Sfx cue="confirm" at={8.9} dur={0.5} volume={0.28} />
      {/* Cursor-click SFX — keyed to the exact same click timestamps (4.6s, 7.0s)
          as the cursor sweep + click-consequence choreography above. */}
      <Audio src="/assets/sfx/click-hd-loud.mp3" offset="4.6s" duration="1.5s" volume={0.45} />
      <Audio src="/assets/sfx/click-hd-loud.mp3" offset="7.0s" duration="1.5s" volume={0.45} />

      {/* ===== CAMERA RIG ===== */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "50% 50%",
          animation: "scenea-camera 10000ms cubic-bezier(0.65,0,0.35,1) both",
        }}
      >
        {/* ===== TOP BAR ===== */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 48,
            background: "#FFFFFF",
            borderBottom: "1px solid #E5E5E5",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            zIndex: 6,
            ...INTER,
            fontSize: 13,
            color: "#1E1E1E",
            animation: "scenea-topbar-in 600ms cubic-bezier(0.25,1,0.5,1) both",
          }}
        >
          <svg
            width="22"
            height="33"
            viewBox="0 0 38 57"
            fill="none"
            style={{ marginRight: 14 }}
          >
            <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
            <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
            <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
            <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
            <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
          </svg>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontWeight: 500,
              letterSpacing: "-0.005em",
            }}
          >
            <span style={{ fontWeight: 600 }}>
              <span ref={fileNameRef}></span>
              <span
                style={{
                  display: "inline-block",
                  width: 1,
                  height: 14,
                  background: "#1E1E1E",
                  verticalAlign: "middle",
                  marginLeft: 1,
                  opacity: 0.7,
                }}
              />
            </span>
            <span style={{ color: "#757575", marginLeft: 4 }}>▾</span>
            <span style={{ color: "#757575", marginLeft: 6, fontSize: 12 }}>
              Auto-saved
            </span>
          </div>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FF7262, #F24E1E)",
                border: "2px solid #FFFFFF",
                boxShadow: "0 0 0 1px #E5E5E5",
              }}
            />
            <div
              style={{
                background: "#0D99FF",
                color: "#FFFFFF",
                padding: "7px 16px",
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Share
            </div>
          </div>
        </div>

        {/* ===== LEFT PANEL ===== */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 48,
            bottom: 0,
            width: 280,
            background: "#FFFFFF",
            borderRight: "1px solid #E5E5E5",
            color: "#1E1E1E",
            ...INTER,
            fontSize: 13,
            zIndex: 5,
            animation: "scenea-left-in 720ms 80ms cubic-bezier(0.25,1,0.5,1) both",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "12px 18px",
              gap: 22,
              borderBottom: "1px solid #E5E5E5",
            }}
          >
            <span
              style={{
                fontWeight: 600,
                borderBottom: "2px solid #1E1E1E",
                paddingBottom: 6,
                marginBottom: -7,
              }}
            >
              File
            </span>
            <span style={{ color: "#757575", paddingBottom: 6 }}>Assets</span>
          </div>

          <div
            style={{
              padding: "14px 18px 4px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 12 }}>Pages</span>
            <span style={{ color: "#757575" }}>+</span>
          </div>
          {PAGES.map((p, i) => (
            <div
              key={p}
              style={{
                padding: "5px 18px 5px 22px",
                background: i === 0 ? "rgba(13,153,255,0.14)" : "transparent",
                fontWeight: i === 0 ? 500 : 400,
                borderLeft:
                  i === 0
                    ? "2px solid #0D99FF"
                    : "2px solid transparent",
                marginLeft: i === 0 ? -2 : 0,
              }}
            >
              {p}
            </div>
          ))}

          <div
            style={{
              padding: "16px 18px 4px",
              marginTop: 6,
              borderTop: "1px solid #E5E5E5",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 12 }}>Layers</span>
          </div>
          {LAYERS.map((l, i) => {
            const isProgressCard = i === 3;
            return (
              <div
                key={l.name}
                ref={isProgressCard ? progressLayerRef : undefined}
                style={{
                  padding: `5px 18px 5px ${22 + l.indent * 14}px`,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#1E1E1E",
                  background: "transparent",
                  fontWeight: 400,
                  borderLeft: "2px solid transparent",
                  marginLeft: 0,
                  animation: `scenea-layer-in ${LAYER_STAGGER_DUR}ms ${LAYER_STAGGER_START + i * LAYER_STAGGER_STEP}ms cubic-bezier(0.25,1,0.5,1) backwards`,
                }}
              >
                <span style={{ fontSize: 11, color: "#757575" }}>{l.icon}</span>
                <span>{l.name}</span>
              </div>
            );
          })}
        </div>

        {/* ===== RIGHT PANEL ===== */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 48,
            bottom: 0,
            width: 320,
            background: "#FFFFFF",
            borderLeft: "1px solid #E5E5E5",
            color: "#1E1E1E",
            ...INTER,
            fontSize: 12,
            zIndex: 5,
            animation: "scenea-right-in 740ms 160ms cubic-bezier(0.25,1,0.5,1) both",
          }}
        >
          {/* Design / Prototype tabs */}
          <div
            style={{
              display: "flex",
              padding: "10px 18px",
              borderBottom: "1px solid #E5E5E5",
              fontSize: 13,
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontWeight: 600,
                borderBottom: "2px solid #1E1E1E",
                paddingBottom: 6,
                marginBottom: -7,
              }}
            >
              Design
            </span>
            <span
              style={{
                marginLeft: 20,
                color: "#757575",
                paddingBottom: 6,
              }}
            >
              Prototype
            </span>
            <span style={{ marginLeft: "auto" }}>100% ▾</span>
          </div>

          {/* Alignment buttons row (mirrors peg-092718) */}
          <div
            style={{
              display: "flex",
              padding: "12px 16px",
              gap: 4,
              borderBottom: "1px solid #F5F5F5",
            }}
          >
            {["⊢", "⊥", "⊣", "⊤", "⊞", "⊥"].map((s, i) => (
              <div
                key={i}
                style={{
                  width: 28,
                  height: 24,
                  borderRadius: 4,
                  background: "#F5F5F5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#757575",
                  fontSize: 11,
                }}
              >
                {s}
              </div>
            ))}
          </div>

          <SectionHeader label="Position" />
          <div
            style={{
              padding: "0 16px 12px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 6,
            }}
          >
            <Field label="X" v="240" />
            <Field label="Y" v="120" />
          </div>

          <SectionHeader label="Layout" />
          <div
            style={{
              padding: "0 16px 12px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 6,
            }}
          >
            <Field label="W" v="380" />
            <Field label="H" v="740" />
          </div>

          {/* Auto-layout block (peg-092718) */}
          <SectionHeader label="Auto layout" />
          <div
            style={{
              padding: "0 16px 12px",
              display: "flex",
              gap: 4,
              position: "relative",
            }}
          >
            {["▤", "▦", "▧", "▩"].map((s, i) => (
              <div
                key={i}
                style={{
                  width: 30,
                  height: 26,
                  borderRadius: 4,
                  background: i === 3 ? "#FFFFFF" : "#F5F5F5",
                  border: i === 3 ? "1px solid #1E1E1E" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: i === 3 ? "#1E1E1E" : "#757575",
                  fontSize: 12,
                }}
              >
                {s}
              </div>
            ))}
            {/* Tooltip — fades in on camera-pan to right, capped at 70% opacity */}
            <div style={{ position: "absolute", right: 6, top: 32, opacity: 0.7 }}>
              <Reveal
                enter={[6500, 6800]}
                exit={[7800, 8100]}
                y={6}
                style={{
                  background: "#1E1E1E",
                  color: "#FFFFFF",
                  padding: "6px 10px",
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  zIndex: 8,
                  boxShadow: "0 6px 14px rgba(0,0,0,0.2)",
                }}
              >
                Toggle automatic positioning
              </Reveal>
            </div>
          </div>

          <SectionHeader label="Fill" />
          <div
            style={{
              padding: "6px 16px 12px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              position: "relative",
            }}
          >
            <div
              ref={fillSwatchRef}
              style={{
                width: 22,
                height: 22,
                borderRadius: 4,
                background: "#0ACF83",
                boxShadow: "0 0 0 1px #E5E5E5",
                transition: "background 180ms ease",
              }}
            />
            <span
              ref={fillHexRef}
              style={{
                fontFamily: "'Inter', monospace",
                fontSize: 12,
                letterSpacing: 0.3,
              }}
            >
              0ACF83
            </span>
            <span style={{ marginLeft: "auto", fontSize: 12 }}>
              100 <span style={{ color: "#757575" }}>%</span>
            </span>

            {/* Color picker popup — appears on click at t=7.0s */}
            <div
              ref={colorPickerRef}
              style={{
                position: "absolute",
                left: -188,
                top: 30,
                width: 180,
                background: "#FFFFFF",
                borderRadius: 8,
                padding: "10px 12px",
                boxShadow:
                  "0 16px 36px rgba(20,24,36,0.22), 0 0 0 1px rgba(0,0,0,0.06)",
                opacity: 0,
                zIndex: 12,
                ...INTER,
                willChange: "transform, opacity",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 11,
                  color: "#757575",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                }}
              >
                Color picker
              </div>
              {/* gradient saturation pad */}
              <div
                style={{
                  height: 80,
                  borderRadius: 4,
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%), linear-gradient(to right, #FFFFFF 0%, #A259FF 100%)",
                  marginBottom: 8,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "68%",
                    top: "30%",
                    width: 10,
                    height: 10,
                    border: "1.5px solid #FFFFFF",
                    borderRadius: "50%",
                    transform: "translate(-50%,-50%)",
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.4)",
                  }}
                />
              </div>
              {/* hue bar */}
              <div
                style={{
                  height: 10,
                  borderRadius: 4,
                  background:
                    "linear-gradient(to right, #F24E1E, #FF7262, #A259FF, #1ABCFE, #0ACF83, #F24E1E)",
                  marginBottom: 8,
                  position: "relative",
                }}
              >
                <div
                  ref={hueDotRef}
                  style={{
                    position: "absolute",
                    left: "80%",
                    top: "50%",
                    width: 4,
                    height: 16,
                    background: "#1E1E1E",
                    borderRadius: 2,
                    transform: "translate(-50%,-50%)",
                    willChange: "left",
                  }}
                />
              </div>
              {/* swatch row */}
              <div style={{ display: "flex", gap: 4 }}>
                {["#F24E1E", "#FF7262", "#A259FF", "#1ABCFE", "#0ACF83"].map(
                  (c, i) => (
                    <div
                      key={c}
                      style={{
                        flex: 1,
                        height: 16,
                        borderRadius: 3,
                        background: c,
                        boxShadow:
                          i === 2 ? "0 0 0 1.5px #1E1E1E" : "0 0 0 1px #E5E5E5",
                      }}
                    />
                  )
                )}
              </div>
            </div>
          </div>

          <SectionHeader label="Stroke" />
          <div
            style={{
              padding: "6px 16px 12px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 4,
                background: "#1E1E1E",
                boxShadow: "0 0 0 1px #E5E5E5",
              }}
            />
            <span
              style={{
                fontFamily: "'Inter', monospace",
                fontSize: 12,
                letterSpacing: 0.3,
              }}
            >
              1E1E1E
            </span>
            <span style={{ marginLeft: "auto", fontSize: 12 }}>1 px</span>
          </div>

          <SectionHeader label="Effects" />
          <div
            style={{
              padding: "4px 16px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              fontSize: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#F5F5F5",
                padding: "5px 8px",
                borderRadius: 4,
              }}
            >
              <span style={{ color: "#757575", fontSize: 11 }}>◑</span>
              <span>Drop shadow</span>
              <span style={{ marginLeft: "auto", color: "#757575" }}>Y 4 · B 14</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#F5F5F5",
                padding: "5px 8px",
                borderRadius: 4,
              }}
            >
              <span style={{ color: "#757575", fontSize: 11 }}>◐</span>
              <span>Inner shadow</span>
              <span style={{ marginLeft: "auto", color: "#757575" }}>Y 1 · B 2</span>
            </div>
          </div>

          <SectionHeader label="Constraints" />
          <div
            style={{
              padding: "0 16px 12px",
              display: "flex",
              gap: 4,
            }}
          >
            {["←", "↔", "→", "▲", "↕", "▼"].map((s, i) => (
              <div
                key={i}
                style={{
                  width: 28,
                  height: 24,
                  borderRadius: 4,
                  background: i === 1 || i === 4 ? "#FFFFFF" : "#F5F5F5",
                  border:
                    i === 1 || i === 4
                      ? "1px solid #1E1E1E"
                      : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#1E1E1E",
                  fontSize: 11,
                }}
              >
                {s}
              </div>
            ))}
          </div>

          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid #E5E5E5",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontWeight: 600,
              fontSize: 12,
              position: "relative",
            }}
          >
            <span>Export</span>
            <span
              style={{ color: "#757575", fontSize: 16, fontWeight: 400 }}
            >
              +
            </span>
          </div>
          <div
            style={{
              padding: "4px 16px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              fontSize: 11,
              color: "#1E1E1E",
            }}
          >
            {[
              ["1x", "PNG", "bookworm-home.png"],
              ["2x", "PNG", "bookworm-home@2x.png"],
              ["3x", "PDF", "bookworm-home.pdf"],
            ].map(([scale, fmt, fname]) => (
              <div
                key={fname}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#F5F5F5",
                  padding: "5px 8px",
                  borderRadius: 4,
                }}
              >
                <span style={{ width: 22, color: "#757575" }}>{scale}</span>
                <span style={{ width: 30, color: "#757575" }}>{fmt}</span>
                <span
                  style={{
                    fontFamily: "'Inter', monospace",
                    fontSize: 11,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {fname}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid #E5E5E5",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 12,
              position: "relative",
            }}
          >
            <span style={{ color: "#757575" }}>Ready to export</span>
            <div style={{ position: "absolute", right: 16, bottom: -24 }}>
              <Reveal
                enter={[8800, 9100]}
                exit={[9700, 9950]}
                y={8}
                style={{
                  background: "#0D99FF",
                  color: "#fff",
                  padding: "3px 10px",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 600,
                  boxShadow: "0 4px 10px rgba(13,153,255,0.4)",
                }}
              >
                exporting…
              </Reveal>
            </div>
          </div>
        </div>

        {/* ===== CANVAS — mobile mockup (peg-091222 center) ===== */}
        {/* Frame label */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 120,
            transform: "translateX(-50%)",
            color: "#0D99FF",
            ...INTER,
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          Book details / Mobile
        </div>

        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 380,
            height: 740,
            background: "#FFFFFF",
            borderRadius: 36,
            boxShadow:
              "0 0 0 1.5px #0D99FF, 0 20px 50px rgba(0,0,0,0.10)",
            overflow: "hidden",
            ...INTER,
            zIndex: 2,
            animation: "scenea-mockup-in 1200ms 700ms cubic-bezier(0.33,1,0.68,1) both",
          }}
        >
          {/* iOS status bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "16px 26px 4px",
              color: "#1E1E1E",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            <span>9:41</span>
            <span style={{ letterSpacing: 1 }}>●●●</span>
          </div>

          {/* Header with back chevron + Book details title */}
          <div
            style={{
              padding: "8px 22px",
              display: "flex",
              alignItems: "center",
              color: "#1E1E1E",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#F5F5F5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              ‹
            </div>
            <div
              style={{
                flex: 1,
                textAlign: "center",
                fontWeight: 600,
                fontSize: 16,
                letterSpacing: "-0.01em",
              }}
            >
              Book details
            </div>
            <div style={{ width: 32, height: 32 }} />
          </div>

          {/* Lime cover area with SPLIT cover (peg-091222) */}
          <div
            style={{
              margin: "12px 22px",
              height: 260,
              borderRadius: 16,
              background: "#E8F5D8",
              padding: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 160,
                height: 220,
                borderRadius: 6,
                background:
                  "repeating-conic-gradient(#F9C5D5 0 25%, #C8E6A0 0 50%) 0 0/26px 26px",
                boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "20px 0",
                alignItems: "center",
                color: "#5B2A3A",
                fontWeight: 700,
                fontSize: 22,
                letterSpacing: "0.3em",
              }}
            >
              <span>SPLIT</span>
              <span style={{ fontSize: 11, lineHeight: 1.2 }}>
                NATASHA<br />RUIZ
              </span>
            </div>
          </div>

          {/* CTA row */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 10,
              margin: "0 22px",
            }}
          >
            <div
              ref={addToLibBtnRef}
              style={{
                flex: 1,
                padding: "10px 0",
                textAlign: "center",
                border: "1.5px solid #0ACF83",
                borderRadius: 999,
                color: "#0A8856",
                fontWeight: 600,
                fontSize: 13,
                transition: "border-color 200ms ease, color 200ms ease",
              }}
            >
              + Add to library
            </div>
            <div
              ref={readBtnRef}
              style={{
                flex: 1,
                padding: "10px 0",
                textAlign: "center",
                background: "#0ACF83",
                borderRadius: 999,
                color: "#fff",
                fontWeight: 600,
                fontSize: 13,
                transition: "background 200ms ease",
              }}
            >
              ✓ Read
            </div>
          </div>

          <div style={{ padding: "14px 22px 4px" }}>
            <div
              style={{
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "#1E1E1E",
              }}
            >
              SPLIT
            </div>
            <div style={{ fontSize: 13, color: "#757575", marginTop: 2 }}>
              Natasha Ruiz
            </div>
          </div>

          <div style={{ padding: "10px 22px", display: "flex", gap: 6 }}>
            <div
              style={{
                background: "#0ACF83",
                color: "#FFFFFF",
                padding: "5px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Non-fiction
            </div>
            <div
              style={{
                background: "#A8DA8F",
                color: "#1F5B2E",
                padding: "5px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Sociology
            </div>
          </div>
        </div>

        {/* Selection handles — blue dots around mockup (peg-091306) */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 400,
            height: 760,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 3,
            animation: "wash-in 600ms 1700ms cubic-bezier(0.33,1,0.68,1) both",
          }}
        >
          {[
            [0, 0],
            [0.5, 0],
            [1, 0],
            [0, 0.5],
            [1, 0.5],
            [0, 1],
            [0.5, 1],
            [1, 1],
          ].map(([x, y], i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${x * 100}%`,
                top: `${y * 100}%`,
                width: 10,
                height: 10,
                background: "#FFFFFF",
                border: "1.5px solid #0D99FF",
                transform: "translate(-50%, -50%)",
                borderRadius: 2,
              }}
            />
          ))}
          {/* sparkle outside top-right (peg-091306) */}
          <div
            style={{
              position: "absolute",
              left: "100%",
              top: -20,
              marginLeft: 14,
              color: "#0D99FF",
              fontSize: 26,
              lineHeight: 1,
            }}
          >
            ✦
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: -22,
              color: "#0D99FF",
              ...INTER,
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            380 × 740
          </div>
        </div>

        {/* ===== BOTTOM CANVAS TOOLBAR ===== */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 22,
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "8px 10px",
            background: "#FFFFFF",
            borderRadius: 12,
            boxShadow:
              "0 6px 20px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
            color: "#1E1E1E",
            zIndex: 6,
            ...INTER,
            fontSize: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "6px 10px 6px 8px",
              borderRadius: 8,
              background: "rgba(13,153,255,0.12)",
            }}
          >
            <svg width="14" height="16" viewBox="0 0 22 26" fill="none">
              <path
                d="M3 2 L3 20 L8 16 L11 22 L14 21 L11 15 L18 15 Z"
                fill="#0D99FF"
                stroke="#0D99FF"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {[
            <svg key="1" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 8 H21 M3 16 H21 M8 3 V21 M16 3 V21"
                stroke="#1E1E1E"
                strokeWidth="1.6"
              />
            </svg>,
            <svg key="2" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect
                x="4"
                y="4"
                width="16"
                height="16"
                rx="1.5"
                stroke="#1E1E1E"
                strokeWidth="1.6"
              />
            </svg>,
            <svg key="3" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3 L21 9 L17.5 20 H6.5 L3 9 Z"
                stroke="#1E1E1E"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>,
            <svg key="4" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 5 H19 M12 5 V20"
                stroke="#1E1E1E"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>,
            <svg key="5" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 8 A4 4 0 0 1 8 4 H16 A4 4 0 0 1 20 8 V14 A4 4 0 0 1 16 18 H10 L6 22 V18 A4 4 0 0 1 4 14 Z"
                stroke="#1E1E1E"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>,
            <svg key="6" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M10 3 L12 9 L18 11 L12 13 L10 19 L8 13 L2 11 L8 9 Z"
                fill="#1E1E1E"
              />
              <circle cx="19" cy="5" r="2" fill="#1E1E1E" />
            </svg>,
          ].map((icon, i) => (
            <div
              key={i}
              style={{ padding: "6px 8px", borderRadius: 6, color: "#1E1E1E" }}
            >
              {icon}
            </div>
          ))}
        </div>

        {/* ===== CURSOR CLICK PULSE ===== */}
        <div
          ref={cursorPulseRef}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "3px solid #F24E1E",
            opacity: 0,
            zIndex: 19,
            pointerEvents: "none",
            boxShadow: "0 0 14px rgba(242,78,30,0.55)",
            willChange: "transform, opacity",
            transformOrigin: "18px 18px",
          }}
        />

        {/* ===== FIGMA-STYLE CURSOR + NAME PILL ===== */}
        <div
          ref={cursorRef}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 20,
            opacity: 0,
            willChange: "transform, opacity",
            pointerEvents: "none",
          }}
        >
          <svg
            width="22"
            height="26"
            viewBox="0 0 22 26"
            style={{
              display: "block",
              filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.30))",
            }}
          >
            <path
              d="M3 2 L3 20 L8 16 L11 22 L14 21 L11 15 L18 15 Z"
              fill="#1E1E1E"
              stroke="#FFFFFF"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          <div
            style={{
              position: "absolute",
              left: 18,
              top: 22,
              background: "#F24E1E",
              color: "#FFFFFF",
              padding: "3px 8px",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 500,
              ...INTER,
              letterSpacing: "-0.005em",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
            }}
          >
            Jack
          </div>
        </div>
      </div>
    </Timegroup>
  );
};

const SectionHeader: React.FC<{ label: string }> = ({ label }) => (
  <div
    style={{
      padding: "10px 16px 6px",
      borderTop: "1px solid #E5E5E5",
      display: "flex",
      justifyContent: "space-between",
      fontWeight: 600,
      fontSize: 12,
    }}
  >
    <span>{label}</span>
    <span style={{ color: "#757575", fontSize: 14 }}>⋯</span>
  </div>
);

const Field: React.FC<{ label: string; v: string }> = ({ label, v }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      background: "#F5F5F5",
      padding: "5px 8px",
      borderRadius: 4,
      minHeight: 28,
    }}
  >
    <span
      style={{ color: "#757575", width: 14, fontSize: 11, fontWeight: 500 }}
    >
      {label}
    </span>
    <span
      style={{
        color: "#1E1E1E",
        fontFamily: "'Inter', monospace",
        fontVariantNumeric: "tabular-nums",
        fontSize: 12,
      }}
    >
      {v}
    </span>
  </div>
);

export default SceneA_FigmaWindow;
