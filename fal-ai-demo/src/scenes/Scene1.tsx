/**
 * Scene 1 — fal.ai Dashboard Nav Panel + Assets Dashboard Reveal (0–8000ms)
 *
 * REWORK v5 — reference-faithful camera + cursor motion:
 *  - Camera: LEFT-anchored zoom 1.0→1.7×, transformOrigin "0% <navY%"
 *    Simultaneously pans RIGHT tracking active tab (tx grows as cursor moves right)
 *    fal logo stays near left edge throughout; bar bleeds off-screen right at peak zoom
 *  - Cursor: fast, arced bezier paths using cbez() — 300–400ms per hop
 *    Arc height ~30–40px above straight line — flows like air
 *  - Assets tab: HIDDEN at start (maxWidth 0 → full, opacity 0→1) at 2000–2600ms
 *    Flex reflow pushes Serverless/Compute/Workflows/Settings right automatically
 *  - Underline: tracks active tab, 300ms outCubic slide
 *  - Beta badge: pops in at 2600ms with outBack bounce
 *  - Dashboard reveal at ~4s+: UNCHANGED from v4 (zoom-out + expand + tile cascade)
 *
 * Beat breakdown:
 *  0ms:      full bar visible (scale 1.0), Home active, NO Assets tab yet
 *  0–400ms:  cursor fades in under Home
 *  400–700ms: cursor arcs Home→Explore (350ms, cbez arc)
 *  700–1200ms: hold at Explore
 *  1200–1550ms: cursor arcs Explore→Generate (350ms)
 *  1550–2000ms: hold at Generate
 *  2000–2600ms: Assets tab INSERTS (width/opacity expand), pushing tabs right
 *  2100–2500ms: cursor arcs Generate→Assets (400ms, overlaps insert)
 *  2600ms:   Assets active; Beta badge pops in
 *  2600–3600ms: hold at Assets (camera settled zoomed 1.7×, panned right)
 *  3600–4000ms: brief transition beat
 *  4000ms+:  dashboard expand + zoom-out (UNCHANGED)
 *  7600ms:   scene fade out
 *  8000ms:   cut
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { track, lerp, clamp, outBack, bez } from "../components/helpers";
import { TraceLayer } from "../components/TraceLayer";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import {
  tile_char_milo, tile_char_mateo, tile_char_nyla,
  tile_video_1, tile_video_3,
} from "../assets/tile-bitmaps";
// Real 3D character renders (fal Nano Banana) — crisp replacements for the dashboard tiles.
import {
  tile_grid_portrait, tile_grid_boy, tile_grid_heroine, tile_grid_creature, tile_grid_cyber2,
  tile_grid_junior, tile_grid_pigslow, tile_grid_cyber, tile_grid_neon,
} from "../assets/tile-hires";

// ─── Inline SVG icons ──────────────────────────────────────────────────────

const IconHome = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconExplore = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

// Assets icon — connected squares
const IconAssetsTab = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="9" height="9" rx="1" />
    <rect x="13" y="2" width="9" height="9" rx="1" />
    <path d="M2 14h4v4H2z" />
    <path d="M13 14h4v4h-4z" />
    <path d="M6 18h8" />
    <path d="M10 14v4" />
  </svg>
);

// Rocket icon (reference: Serverless uses rocket)
const IconRocket = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

// Chip icon (reference: Compute uses chip)
const IconChip = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="7" y="7" width="10" height="10" rx="1" />
    <path d="M16 2v2M8 2v2M2 16h2M2 8h2M22 16h-2M22 8h-2M16 22v-2M8 22v-2" />
  </svg>
);

// Nodes icon (reference: Workflows uses node-graph)
const IconNodes = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5" cy="5" r="2" />
    <circle cx="19" cy="5" r="2" />
    <circle cx="12" cy="19" r="2" />
    <path d="M7 5h10M6.5 6.5l4 11M17.5 6.5l-4 11" />
  </svg>
);

const IconGenerate = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
  </svg>
);

const IconSettings = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

// ─── fal icon mark ────────────────────────────────────────────────────────────
const FalIconMark = ({ size = 22, color = "#ffffff" }: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 23 23"
    fill={color}
    style={{ transform: "rotate(-45deg)" }}
  >
    <path d="M22.2216 6.72391C22.4793 6.4114 22.4826 5.94892 22.1962 5.66248L17.4071 0.873394C17.1206 0.586946 16.6582 0.590275 16.3457 0.848007C13.5582 3.14694 9.5102 3.14679 6.72259 0.847662C6.41008 0.589907 5.94759 0.586546 5.66116 0.872975L0.872362 5.66178C0.585934 5.94821 0.589293 6.41069 0.847048 6.72321C3.14617 9.51082 3.14633 13.5588 0.847397 16.3463C0.589663 16.6588 0.586337 17.1212 0.872784 17.4077L5.66187 22.1968C5.94831 22.4832 6.41079 22.4799 6.7233 22.2222C9.51075 19.9232 13.5587 19.9234 16.3464 22.2225C16.6589 22.4803 17.1214 22.4836 17.4078 22.1972L22.1966 17.4084C22.483 17.122 22.4797 16.6595 22.2219 16.347C19.9228 13.5594 19.9226 9.51136 22.2216 6.72391Z" />
  </svg>
);

// Purple outlined arrow cursor — matches reference
const PurpleCursor = () => (
  <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
    <path
      d="M2 2L2 22L7 17L10 25L13 24L10 16L17 16L2 2Z"
      fill="rgba(124,58,237,0.15)"
      stroke="#7C3AED"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Layout constants ─────────────────────────────────────────────────────────

const STRIP_HEIGHT = 175;   // compact two-row bar (was 430 — that created a huge empty black void)
const STRIP_WIDTH  = 1860;
const STRIP_LEFT   = 30;
const STRIP_TOP    = 220;

// Extended panel dimensions (after Assets click)
// Reference: the dashboard is a TALL window anchored near the top of the frame
// that BLEEDS off the bottom edge (Videos row only half-visible at the very bottom).
// So PANEL_FULL_TOP sits high and PANEL_FULL_HEIGHT is large enough to overflow 1080.
const PANEL_FULL_HEIGHT = 1308;
const PANEL_FULL_WIDTH  = 1860;
const PANEL_FULL_LEFT   = 30;
const PANEL_FULL_TOP    = 14;

const SIDEBAR_WIDTH = 210;

// ─── Camera: LEFT-anchored zoom + rightward pan ───────────────────────────────
//
// Reference analysis:
//   r_001: full bar in frame, scale 1.0, transformOrigin LEFT edge
//   r_004: ~1.5×, fal logo near left edge, bar bleeds right, Explore centered
//   r_008: ~1.7×, Generate centered on screen, right tabs cut off
//   r_016: ~1.7×, Assets centered, fal logo+wordmark off-screen LEFT
//
// Model: transformOrigin = "0% <navY%"  (left edge of canvas, nav bar Y center)
// Scale: 1.0 → 1.7 from 0ms → 2100ms (easeInOutCubic)
// Pan tx: translate so the ACTIVE TAB CENTER lands at ~50% screen width
//   With left-origin zoom, a native point at (nx, ny) appears at screen:
//     screen_x = nx * scale + tx
//   To put nx at screen center (960px):
//     tx = 960 - nx * scale
//   But we want left-of-center targeting (~640px) to feel natural:
//     tx = TARGET_SX - nx * scale
//
// At scale 1.0, tx = 0 → Home is at its natural left position ✓
// At scale 1.7, tx = 640 - 140*1.7 = 640 - 238 = 402  (Home still near left on screen)
// At scale 1.7 with Generate (nx=545), tx = 640 - 545*1.7 = 640-926.5 = -286.5
//   → camera has shifted so Generate is centered, fal has moved left+off

// Nav bar Y center for origin anchor (strip top + half strip height)
const NAV_CENTER_Y_PCT = ((STRIP_TOP + STRIP_HEIGHT / 2) / 1080) * 100; // ~27.3%

// Camera timeline — ONE smooth continuous push-in (no per-tab tracking "jump").
// The camera glides from full-bar (scale 1.0, no pan) to an Assets-framed peak
// (scale Z_PEAK, panned so Assets sits center-screen) over a single eased curve.
// The cursor hops tab→tab ON TOP of this calm push; the camera never lurches to
// chase the cursor.
const ZOOM_IN_START = 0;
const CAM_PUSH_END  = 2900; // push-in completes just after the cursor lands on Assets
const Z_START = 1.0;
const Z_PEAK  = 1.5;        // gentler than before (was 1.7) → calmer
const CAM_PEAK_TX = -357;   // at Z_PEAK this frames the Assets tab (nx≈758) ~center screen

// After Assets click, zoom OUT to frame the full (tall) dashboard window
const ZOOM_OUT_START = 4000;
const ZOOM_OUT_END   = 5400;
const Z_PANEL = 0.86;       // dashboard hold scale (panel ≈1600px wide on screen)
const HOLD_TX  = 134.4;     // centers the 1860-wide panel horizontally at Z_PANEL

// ─── Tab native X centers (in 1920px coordinate space) ───────────────────────
// Panel at x=30, tab row padding 36px → tab row starts at x=66
// Per-tab measured widths (icon 30px + gap 8px + text + padding 24px):
//   Home=148, Explore=213, Generate=235, Assets=192, Serverless=278, Compute=213, Workflows=256, Settings=235
const TAB_WIDTHS_NO_ASSETS = [148, 213, 235, 278, 213, 256, 235]; // without Assets
const TAB_CENTER_X_NATIVE = [
  66 + 74,        // home:      140px
  66 + 148 + 107, // explore:   321px
  66 + 361 + 118, // generate:  545px
  66 + 596 + 96,  // assets:    758px (used AFTER Assets inserts)
  66 + 788 + 139, // serverless: 993px (with Assets inserted)
];
void TAB_WIDTHS_NO_ASSETS; // suppress unused warning

// Cursor Y in native space — just below the tab underline
const NAV_Y_NATIVE = STRIP_TOP + STRIP_HEIGHT - 20;

// ─── Nav cursor walk timing ───────────────────────────────────────────────────
// Fast arcs: each hop ~300–400ms, holds ~500ms
// Home active:     0 – 400ms
// Arc H→E:       400 – 750ms   (350ms)
// Explore active: 750 – 1200ms
// Arc E→G:      1200 – 1550ms  (350ms)
// Generate active: 1550 – 2100ms
// Assets INSERT: 2000 – 2600ms  (Assets tab width/opacity animates in)
// Arc G→A:      2100 – 2500ms  (400ms, overlaps insert)
// Assets active: 2500 – 4000ms

// TICK-PRECISE: the Assets tab INSERT window is bolted to the G→A cursor arc.
// The tab grows in (dim/gray) exactly as the cursor sweeps toward it, and the
// instant the cursor LANDS (HOP_GA_END) the tab activates: white text + underline
// arrives + Beta badge pops — all on the SAME frame. Nothing lights up early.
const HOP_HE_START = 500;  const HOP_HE_END = 850;
const HOP_EG_START = 1400; const HOP_EG_END = 1750;
const HOP_GA_START = 2400; const HOP_GA_END = 2850;
const ASSETS_INSERT_START = 2400;  // == HOP_GA_START (insert begins as cursor leaves Generate)
const ASSETS_INSERT_END   = 2850;  // == HOP_GA_END   (insert completes as cursor lands)
const ASSETS_ACTIVE_MS    = 2850;  // == HOP_GA_END   (the exact land tick)

// ─── Tab definitions ─────────────────────────────────────────────────────────
const TAB_INFO = [
  { id: "home",       label: "Home"       },
  { id: "explore",    label: "Explore"    },
  { id: "generate",   label: "Generate"   },
  { id: "assets",     label: "Assets"     },
  { id: "serverless", label: "Serverless" },
  { id: "compute",    label: "Compute"    },
  { id: "workflows",  label: "Workflows"  },
  { id: "settings",   label: "Settings"   },
];

// Underline positions relative to left:36 anchor in the tab row container.
// Note: after Assets inserts, all tabs after Generate shift right by ~192px.
// We handle the underline via getBoundingClientRect in onFrame instead of hardcoded positions.
// Fallback static positions (pre-Assets-insert = no Assets in layout):
const UNDERLINE_POS_PRE: Array<{ x: number; w: number }> = [
  { x: 0,   w: 148 }, // home
  { x: 148, w: 213 }, // explore
  { x: 361, w: 235 }, // generate
];
// Post-insert (Assets present):
const UNDERLINE_POS_POST: Array<{ x: number; w: number }> = [
  { x: 0,   w: 148 }, // home
  { x: 148, w: 213 }, // explore
  { x: 361, w: 235 }, // generate
  { x: 596, w: 192 }, // assets
];

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// A tab lights up the instant the cursor LANDS on it (hop END), never when the
// cursor merely STARTS moving toward it. This keeps every activation tick-precise.
function getActiveTabIdx(ms: number): number {
  if (ms < HOP_HE_END) return 0;   // Home    — until cursor lands on Explore
  if (ms < HOP_EG_END) return 1;   // Explore — until cursor lands on Generate
  if (ms < HOP_GA_END) return 2;   // Generate— until cursor lands on Assets
  return 3;                        // Assets
}

const CONTENT_TILE_COUNT = 14;
const TILE_STAGGER_MS = 70;
const TILE_REVEAL_DUR = 320;
const TILE_CASCADE_START = 4500; // fades in with the dashboard reveal

const PRIMARY_VIOLET = "#7C3AED";

// Scene total duration — 8000ms to allow ~3s of dashboard hold
const SCENE_DURATION = 8000;

export function Scene1() {
  const tabRefs         = useRef<(HTMLDivElement | null)[]>(Array(8).fill(null));
  const underlineRef    = useRef<HTMLDivElement>(null);
  const betaBadgeRef    = useRef<HTMLSpanElement>(null);
  const contentRef      = useRef<HTMLDivElement>(null);
  const cursorRef       = useRef<HTMLDivElement>(null);
  const panelRef        = useRef<HTMLDivElement>(null);
  const cameraRef       = useRef<HTMLDivElement>(null);
  const sceneRef        = useRef<HTMLDivElement>(null);
  const tileRefs        = useRef<Array<HTMLDivElement | null>>(Array(CONTENT_TILE_COUNT).fill(null));

  const ACTIVE_COLOR   = "#ffffff";
  const INACTIVE_COLOR = "#5a6272";

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    const scene   = sceneRef.current;
    const camera  = cameraRef.current;
    const panel   = panelRef.current;
    const cursor  = cursorRef.current;
    const underline = underlineRef.current;
    const betaBadge = betaBadgeRef.current;
    const content = contentRef.current;

    // ── Panel size animation (strip → full dashboard) ──
    if (panel) {
      const GROW_START = 4000;
      const GROW_END   = 5400;

      if (ms < GROW_START) {
        panel.style.width   = `${STRIP_WIDTH}px`;
        panel.style.height  = `${STRIP_HEIGHT}px`;
        panel.style.left    = `${STRIP_LEFT}px`;
        panel.style.top     = `${STRIP_TOP}px`;
      } else {
        const t = track(ms, GROW_START, GROW_END, easeInOut);
        const w = Math.round(lerp(STRIP_WIDTH, PANEL_FULL_WIDTH, t));
        const h = Math.round(lerp(STRIP_HEIGHT, PANEL_FULL_HEIGHT, t));
        const l = Math.round(lerp(STRIP_LEFT, PANEL_FULL_LEFT, t));
        const topPos = Math.round(lerp(STRIP_TOP, PANEL_FULL_TOP, t));
        panel.style.width  = `${w}px`;
        panel.style.height = `${h}px`;
        panel.style.left   = `${l}px`;
        panel.style.top    = `${topPos}px`;
      }
    }

    // ── Scene fade out — start at 7600ms (400ms before cut at 8000ms) ──
    if (scene) {
      const fadeT = ms > 7600 ? clamp((ms - 7600) / 400) : 0;
      scene.style.opacity = String(1 - fadeT);
    }

    // ── Assets tab insertion: width + opacity animate in at ASSETS_INSERT_START ──
    const assetsTabEl = tabRefs.current[3]; // Assets is index 3
    if (assetsTabEl) {
      if (ms < ASSETS_INSERT_START) {
        assetsTabEl.style.maxWidth = "0px";
        assetsTabEl.style.opacity = "0";
        assetsTabEl.style.overflow = "hidden";
        assetsTabEl.style.padding = "0";
      } else if (ms < ASSETS_INSERT_END) {
        const t = easeOutCubic(clamp((ms - ASSETS_INSERT_START) / (ASSETS_INSERT_END - ASSETS_INSERT_START)));
        assetsTabEl.style.maxWidth = `${lerp(0, 260, t)}px`;
        assetsTabEl.style.opacity = String(t);
        assetsTabEl.style.overflow = "hidden";
        assetsTabEl.style.padding = `0 ${lerp(0, 12, t)}px`;
        assetsTabEl.style.paddingBottom = "20px";
      } else {
        assetsTabEl.style.maxWidth = "260px";
        assetsTabEl.style.opacity = "1";
        assetsTabEl.style.overflow = "visible";
        assetsTabEl.style.padding = "0 12px";
        assetsTabEl.style.paddingBottom = "20px";
      }
    }

    // ── Tab color states — NO pill background, only color brighten ──
    const activeIdx = getActiveTabIdx(ms);
    TAB_INFO.forEach((tab, i) => {
      const el = tabRefs.current[i];
      if (!el) return;
      const isActive = i === activeIdx;
      el.style.color = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;
      el.style.background = "transparent";
      el.style.fontWeight = isActive ? "600" : "500";
    });

    // ── Underline slide — tracks active tab through the Assets insertion reflow ──
    // We use pre/post position arrays. During Assets insert (2000–2600ms) the tab
    // positions shift, so we blend the underline smoothly with the cursor arc.
    if (underline) {
      let ulX = 0;
      let ulW = UNDERLINE_POS_PRE[0].w;

      if (ms < HOP_HE_START) {
        // Home
        ulX = UNDERLINE_POS_PRE[0].x; ulW = UNDERLINE_POS_PRE[0].w;
      } else if (ms < HOP_HE_END) {
        // Sliding H→E
        const t = easeOutCubic(clamp((ms - HOP_HE_START) / (HOP_HE_END - HOP_HE_START)));
        ulX = lerp(UNDERLINE_POS_PRE[0].x, UNDERLINE_POS_PRE[1].x, t);
        ulW = lerp(UNDERLINE_POS_PRE[0].w, UNDERLINE_POS_PRE[1].w, t);
      } else if (ms < HOP_EG_START) {
        // Explore
        ulX = UNDERLINE_POS_PRE[1].x; ulW = UNDERLINE_POS_PRE[1].w;
      } else if (ms < HOP_EG_END) {
        // Sliding E→G
        const t = easeOutCubic(clamp((ms - HOP_EG_START) / (HOP_EG_END - HOP_EG_START)));
        ulX = lerp(UNDERLINE_POS_PRE[1].x, UNDERLINE_POS_PRE[2].x, t);
        ulW = lerp(UNDERLINE_POS_PRE[1].w, UNDERLINE_POS_PRE[2].w, t);
      } else if (ms < HOP_GA_START) {
        // Generate hold
        ulX = UNDERLINE_POS_PRE[2].x; ulW = UNDERLINE_POS_PRE[2].w;
      } else if (ms < HOP_GA_END) {
        // Sliding G→A (Assets inserting simultaneously)
        const t = easeOutCubic(clamp((ms - HOP_GA_START) / (HOP_GA_END - HOP_GA_START)));
        ulX = lerp(UNDERLINE_POS_PRE[2].x, UNDERLINE_POS_POST[3].x, t);
        ulW = lerp(UNDERLINE_POS_PRE[2].w, UNDERLINE_POS_POST[3].w, t);
      } else {
        // Assets
        ulX = UNDERLINE_POS_POST[3].x; ulW = UNDERLINE_POS_POST[3].w;
      }

      underline.style.transform = `translateX(${ulX}px)`;
      underline.style.width = `${ulW}px`;
    }

    // ── Beta badge pop-in at ASSETS_ACTIVE_MS ──
    if (betaBadge) {
      if (ms < ASSETS_ACTIVE_MS) {
        betaBadge.style.opacity = "0";
        betaBadge.style.transform = "scale(0.4)";
      } else {
        const t = track(ms, ASSETS_ACTIVE_MS, ASSETS_ACTIVE_MS + 350, outBack);
        betaBadge.style.opacity = String(clamp(t * 3)); // snap to full opacity fast
        betaBadge.style.transform = `scale(${lerp(0.4, 1.0, t)})`;
      }
    }

    // ── Camera: ONE smooth continuous push-in, then a calm zoom-out to dashboard ──
    // No per-tab tracking. The camera glides from the full bar to an Assets-framed
    // peak on a single eased curve, so it never lurches/jumps to chase the cursor.
    // The cursor hops tab→tab ON TOP of this calm push.
    if (camera) {
      camera.style.transformOrigin = `0% ${NAV_CENTER_Y_PCT.toFixed(1)}%`;
      camera.style.perspective = "none";

      if (ms < CAM_PUSH_END) {
        // Continuous push-in: scale 1.0→Z_PEAK and pan 0→CAM_PEAK_TX on ONE curve
        const p = easeInOut(clamp((ms - ZOOM_IN_START) / (CAM_PUSH_END - ZOOM_IN_START)));
        const scale = lerp(Z_START, Z_PEAK, p);
        const tx = lerp(0, CAM_PEAK_TX, p);
        camera.style.transform = `translate(${tx.toFixed(1)}px, 0px) scale(${scale.toFixed(4)})`;

      } else if (ms < ZOOM_OUT_START) {
        // Hold at the Assets-framed peak
        camera.style.transform = `translate(${CAM_PEAK_TX}px, 0px) scale(${Z_PEAK})`;

      } else if (ms < ZOOM_OUT_END) {
        // Zoom OUT to frame the tall dashboard window (flat, no tilt)
        const q = easeInOut(clamp((ms - ZOOM_OUT_START) / (ZOOM_OUT_END - ZOOM_OUT_START)));
        const scale = lerp(Z_PEAK, Z_PANEL, q);
        const tx = lerp(CAM_PEAK_TX, HOLD_TX, q);
        camera.style.transform = `translate(${tx.toFixed(1)}px, 0px) scale(${scale.toFixed(4)})`;

      } else {
        // Dashboard hold: flat, face-on, centered. The panel itself is sized tall so
        // it anchors near the top of the frame and bleeds off the bottom edge.
        camera.style.transform = `translate(${HOLD_TX}px, 0px) scale(${Z_PANEL})`;
      }
    }

    // ── Cursor: fast arced bezier paths (cbez) ──
    if (cursor) {
      // Fade in
      if (ms < 150) {
        cursor.style.opacity = "0";
      } else if (ms < 450) {
        cursor.style.opacity = String(easeOutCubic(clamp((ms - 150) / 300)));
      } else if (ms >= 4000) {
        cursor.style.opacity = String(Math.max(0, 1 - easeOutCubic(clamp((ms - 4000) / 350))));
      } else {
        cursor.style.opacity = "1";
      }

      // Native-space cursor position: sits just below the tab label baseline
      const baseY = NAV_Y_NATIVE;
      let cx = TAB_CENTER_X_NATIVE[0] - 8;
      let cy = baseY;

      // Arc height for bezier (upward arc — control point is ABOVE the straight line)
      const ARC = 35;

      if (ms >= HOP_HE_START && ms < HOP_HE_END) {
        // H→E arc
        const t = easeInOut(clamp((ms - HOP_HE_START) / (HOP_HE_END - HOP_HE_START)));
        const fromX = TAB_CENTER_X_NATIVE[0] - 8;
        const toX   = TAB_CENTER_X_NATIVE[1] - 8;
        const [bx, by] = bez(t,
          [fromX, baseY],
          [(fromX + toX) / 2, baseY - ARC],
          [toX, baseY]
        );
        cx = bx; cy = by;
      } else if (ms < HOP_HE_START) {
        cx = TAB_CENTER_X_NATIVE[0] - 8; cy = baseY;
      } else if (ms >= HOP_EG_START && ms < HOP_EG_END) {
        // E→G arc
        const t = easeInOut(clamp((ms - HOP_EG_START) / (HOP_EG_END - HOP_EG_START)));
        const fromX = TAB_CENTER_X_NATIVE[1] - 8;
        const toX   = TAB_CENTER_X_NATIVE[2] - 8;
        const [bx, by] = bez(t,
          [fromX, baseY],
          [(fromX + toX) / 2, baseY - ARC],
          [toX, baseY]
        );
        cx = bx; cy = by;
      } else if (ms >= HOP_HE_END && ms < HOP_EG_START) {
        cx = TAB_CENTER_X_NATIVE[1] - 8; cy = baseY;
      } else if (ms >= HOP_GA_START && ms < HOP_GA_END) {
        // G→A arc (Assets inserting live)
        const t = easeInOut(clamp((ms - HOP_GA_START) / (HOP_GA_END - HOP_GA_START)));
        const fromX = TAB_CENTER_X_NATIVE[2] - 8;
        const toX   = TAB_CENTER_X_NATIVE[3] - 8;
        const [bx, by] = bez(t,
          [fromX, baseY],
          [(fromX + toX) / 2, baseY - ARC],
          [toX, baseY]
        );
        cx = bx; cy = by;
      } else if (ms >= HOP_EG_END && ms < HOP_GA_START) {
        cx = TAB_CENTER_X_NATIVE[2] - 8; cy = baseY;
      } else {
        cx = TAB_CENTER_X_NATIVE[3] - 8; cy = baseY;
      }

      // Subtle alive drift (tiny amplitude so it reads as fluid not jittery)
      cx += Math.sin(ms / 700) * 1.5;
      cy += Math.cos(ms / 600) * 1.0;

      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    }

    // ── Content container fade-in ──
    if (content) {
      if (ms < 4500) {
        content.style.opacity = "0";
      } else {
        const fadeIn = clamp((ms - 4500) / 400);
        content.style.opacity = String(fadeIn);
      }
    }

    // ── Staggered tile streaming reveals ──
    for (let i = 0; i < CONTENT_TILE_COUNT; i++) {
      const tile = tileRefs.current[i];
      if (!tile) continue;
      const tileStart = TILE_CASCADE_START + i * TILE_STAGGER_MS;
      const t = clamp((ms - tileStart) / TILE_REVEAL_DUR);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      if (ms < tileStart) {
        tile.style.opacity = "0";
        tile.style.transform = "scale(0.94)";
      } else {
        tile.style.opacity = String(eased);
        tile.style.transform = `scale(${lerp(0.94, 1, eased)})`;
      }
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE_DURATION}ms`}
      style={{
        position: "absolute",
        inset: 0,
        // Reference-faithful lighter/pinker lavender
        background: "#a96cf5",
        overflow: "hidden",
      }}
    >
      <TraceLayer sceneStartMs={0} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* Scene wrapper — opacity controlled for fade-out */}
      <div
        ref={sceneRef}
        style={{ position: "absolute", inset: 0, zIndex: 2 }}
      >
        {/* Camera layer */}
        <div
          ref={cameraRef}
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "50% 50%",
          }}
        >
          {/* ===== UNIFIED PANEL (strip → full dashboard) ===== */}
          <div
            ref={panelRef}
            style={{
              position: "absolute",
              left: STRIP_LEFT,
              top: STRIP_TOP,
              width: STRIP_WIDTH,
              height: STRIP_HEIGHT,
              background: "#111114",
              borderRadius: 14,
              border: "1px solid #1e1e26",
              boxShadow: "0 24px 80px rgba(0,0,0,0.55), 0 6px 24px rgba(0,0,0,0.35)",
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* ── NAV STRIP (always visible) — TWO-ROW layout matching reference ── */}
            <div
              style={{
                height: STRIP_HEIGHT,
                flexShrink: 0,
                borderBottom: "1px solid #1d1d25",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "16px 0 0 0",
              }}
            >
              {/* ── ROW 1: logo + account chip ── */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 36px",
                  gap: 0,
                }}
              >
                {/* fal logo mark + wordmark */}
                <div style={{ display: "flex", alignItems: "center", gap: 11, marginRight: 24, flexShrink: 0 }}>
                  <FalIconMark size={44} color="#ffffff" />
                  <span style={{ fontSize: 36, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.5px", fontFamily: "'Inter', system-ui, sans-serif" }}>
                    fal
                  </span>
                </div>

                {/* Account pill */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "#1a1a22",
                    borderRadius: 10,
                    padding: "8px 18px 8px 10px",
                    border: "1px solid #252530",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#ffffff",
                      flexShrink: 0,
                    }}
                  >
                    AS
                  </div>
                  <span style={{ fontSize: 22, fontWeight: 500, color: "#e0e0e8" }}>Alex Scott</span>
                  <span style={{ fontSize: 22, color: "#6b7280" }}>Personal</span>
                  <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M2 4l4 4 4-4" />
                    <path d="M2 8l4-4 4 4" />
                  </svg>
                </div>
              </div>

              {/* ── ROW 2: tab row (flush to bottom of bar) ── */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  position: "relative",
                  height: 82,
                  padding: "0 36px",
                  overflow: "visible",
                }}
              >
                {TAB_INFO.map((tab, i) => {
                  const isAssets = tab.id === "assets";
                  return (
                    <div
                      key={tab.id}
                      ref={(el) => { tabRefs.current[i] = el; }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "0 12px",
                        height: "100%",
                        color: "#5a6272",
                        fontSize: 36,
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        position: "relative",
                        flexShrink: 0,
                        background: "transparent",
                        paddingBottom: 20,
                        // Assets tab starts hidden — onFrame animates maxWidth+opacity
                        ...(isAssets ? {
                          maxWidth: "0px",
                          opacity: 0,
                          overflow: "hidden",
                          padding: "0",
                        } : {}),
                        willChange: "max-width, opacity",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", opacity: 0.75 }}>
                        {tab.id === "home"       && <IconHome />}
                        {tab.id === "explore"    && <IconExplore />}
                        {tab.id === "generate"   && <IconGenerate />}
                        {tab.id === "assets"     && <IconAssetsTab />}
                        {tab.id === "serverless" && <IconRocket />}
                        {tab.id === "compute"    && <IconChip />}
                        {tab.id === "workflows"  && <IconNodes />}
                        {tab.id === "settings"   && <IconSettings />}
                      </span>
                      <span>{tab.label}</span>
                      {isAssets && (
                        <span
                          ref={betaBadgeRef}
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#a78bfa",
                            background: "rgba(124, 58, 237, 0.22)",
                            borderRadius: 5,
                            padding: "2px 7px",
                            marginLeft: 3,
                            opacity: 0,
                            transformOrigin: "center",
                          }}
                        >
                          Beta
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* Active underline — slides between tabs */}
                <div
                  ref={underlineRef}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 36,
                    height: 3,
                    width: UNDERLINE_POS_PRE[0].w,
                    background: PRIMARY_VIOLET,
                    borderRadius: 2,
                    transform: `translateX(${UNDERLINE_POS_PRE[0].x}px)`,
                  }}
                />
              </div>
            </div>

            {/* ── EXPANDED BODY (sidebar + content) ── */}
            <div
              ref={contentRef}
              style={{
                flex: 1,
                display: "flex",
                opacity: 0,
                overflow: "hidden",
                minHeight: 0,
              }}
            >
              {/* ── LEFT SIDEBAR ── */}
              <div
                style={{
                  width: SIDEBAR_WIDTH,
                  flexShrink: 0,
                  borderRight: "1px solid #1d1d25",
                  padding: "16px 10px",
                  overflowY: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#e0e0e8",
                    marginBottom: 10,
                    padding: "4px 8px",
                  }}
                >
                  <span>My Assets</span>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M2 4l4 4 4-4" />
                  </svg>
                </div>

                {[
                  { label: "Home",        active: false },
                  { label: "All media",   active: false },
                  { label: "Characters",  active: true  },
                  { label: "Styles",      active: false },
                  { label: "Favorites",   count: "19"   },
                  { label: "Archive",     count: "5,432" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "5px 8px",
                      borderRadius: 5,
                      fontSize: 12,
                      color: item.active ? "#ffffff" : "#606878",
                      background: item.active ? "rgba(124, 58, 237, 0.18)" : "transparent",
                      marginBottom: 2,
                    }}
                  >
                    <span>{item.label}</span>
                    {item.count && (
                      <span style={{ fontSize: 10, color: "#404858" }}>{item.count}</span>
                    )}
                  </div>
                ))}

                <div style={{ height: 1, background: "#1d1d25", margin: "10px 0 8px" }} />

                <div style={{ fontSize: 9, fontWeight: 600, color: "#404858", padding: "0 8px", marginBottom: 6, letterSpacing: "0.8px", textTransform: "uppercase" }}>
                  Media types
                </div>
                {[
                  { label: "Images", count: "6,432" },
                  { label: "Videos", count: "3,106" },
                  { label: "Audio",  count: "947"   },
                  { label: "3D",     count: "462"   },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "3px 8px",
                      fontSize: 11,
                      color: "#606878",
                      marginBottom: 2,
                    }}
                  >
                    <span>{item.label}</span>
                    <span style={{ fontSize: 10, color: "#404858" }}>{item.count}</span>
                  </div>
                ))}

                <div style={{ height: 1, background: "#1d1d25", margin: "10px 0 8px" }} />

                <div style={{ fontSize: 9, fontWeight: 600, color: "#404858", padding: "0 8px", marginBottom: 6, letterSpacing: "0.8px", textTransform: "uppercase" }}>
                  Collections
                </div>
                {[
                  { label: "Milo Starling"  },
                  { label: "Mateo Rivas"    },
                  { label: "Cpt. Nyla Ward" },
                  { label: "Pigslow"        },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "3px 8px",
                      fontSize: 11,
                      color: "#606878",
                      marginBottom: 2,
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#404858", marginRight: 6 }} />
                    <span>{item.label}</span>
                  </div>
                ))}

                <div style={{ fontSize: 9, fontWeight: 600, color: "#404858", padding: "8px 8px 6px", letterSpacing: "0.8px", textTransform: "uppercase" }}>
                  Brand Campaign Q1
                </div>
                {[
                  { label: "Product Shots - Grea...", count: "$48.01" },
                  { label: "Social Media Assets"                      },
                  { label: "Hero Images - Landing"                    },
                  { label: "Client Review - Batch...", count: "$3.4k" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "3px 8px",
                      fontSize: 10,
                      color: "#505868",
                      marginBottom: 1,
                    }}
                  >
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 120 }}>{item.label}</span>
                    {item.count && <span style={{ color: "#404858", flexShrink: 0 }}>{item.count}</span>}
                  </div>
                ))}
              </div>

              {/* ── MAIN CONTENT AREA ── */}
              <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {/* Search + toolbar row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 20px",
                    borderBottom: "1px solid #1d1d25",
                    gap: 10,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      background: "#0e0e16",
                      border: "1px solid #1d1d25",
                      borderRadius: 7,
                      padding: "7px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#404858" strokeWidth="2" strokeLinecap="round">
                      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                    </svg>
                    <span style={{ fontSize: 12, color: "#404858" }}>Describe what you're looking for...</span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["▤", "⊞", "⊟", "≡", "⋮"].map((ic, idx) => (
                      <div key={idx} style={{ width: 28, height: 28, background: "#1a1a22", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#606878" }}>
                        {ic}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#606878" }}>
                    <span style={{ background: "#1a1a22", padding: "4px 8px", borderRadius: 5, border: "1px solid #252530" }}>Metadata</span>
                    <div style={{ width: 28, height: 16, background: PRIMARY_VIOLET, borderRadius: 8, position: "relative" }}>
                      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, right: 2 }} />
                    </div>
                    <span style={{ background: "#1a1a22", padding: "4px 8px", borderRadius: 5, border: "1px solid #252530" }}>Recently added ▾</span>
                  </div>
                </div>

                {/* Scrollable content */}
                <div style={{ flex: 1, padding: "24px 30px", overflow: "hidden" }}>

                  {/* Characters section */}
                  <div style={{ fontSize: 18, fontWeight: 600, color: "#e0e0e8", marginBottom: 18 }}>Characters</div>
                  <div style={{ display: "flex", gap: 22, marginBottom: 44, alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 66, height: 66, borderRadius: "50%", border: "1.5px dashed #2a2a36", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, color: "#404858" }}>
                        +
                      </div>
                      <span style={{ fontSize: 11, color: "#404858", textAlign: "center" }}>New character</span>
                    </div>
                    {[
                      { label: "Milo Starling",  img: tile_char_milo    },
                      { label: "Mateo Rivas",    img: tile_char_mateo   },
                      { label: "Cpt. Nyla Ward", img: tile_char_nyla    },
                      { label: "Dr. Amina",      img: tile_grid_heroine },
                      { label: "Pigslow",        img: tile_grid_pigslow },
                    ].map((char) => (
                      <div key={char.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 66, height: 66, borderRadius: "50%", background: "#252530", border: "2px solid #353545", position: "relative", overflow: "hidden", flexShrink: 0 }}>
                          <img src={char.img} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} draggable={false} />
                          <div style={{ position: "absolute", top: 3, right: 3, width: 14, height: 14, borderRadius: 3, background: "#252530", border: "1px solid #8b5cf6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: 7, height: 7, borderRadius: 1, background: "#8b5cf6" }} />
                          </div>
                        </div>
                        <span style={{ fontSize: 11, color: "#606878", textAlign: "center", maxWidth: 70, lineHeight: 1.3 }}>{char.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Collections section */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ fontSize: 17, fontWeight: 600, color: "#e0e0e8" }}>Collections</div>
                    <div style={{ fontSize: 12, color: "#606878" }}>See more</div>
                  </div>
                  <div style={{ display: "flex", gap: 16, marginBottom: 38 }}>
                    {[
                      { label: "Junior Explorer",      count: "6 items",  img: tile_grid_junior  },
                      { label: "Pigslow Explorations", count: "10 items", img: tile_grid_pigslow },
                      { label: "Cyber Heroine",         count: "4 items",  img: tile_grid_cyber   },
                      { label: "Neon Agent",            count: "5 items",  img: tile_grid_neon    },
                    ].map((col, colIdx) => (
                      <div
                        key={col.label}
                        ref={(el) => { tileRefs.current[6 + colIdx] = el; }}
                        style={{
                          width: 232,
                          height: 172,
                          borderRadius: 12,
                          background: "#1a1a22",
                          flexShrink: 0,
                          position: "relative",
                          overflow: "hidden",
                          border: "1px solid #252530",
                          willChange: "opacity, transform",
                        }}
                      >
                        <img src={col.img} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} draggable={false} />
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)", padding: "8px 8px 6px" }}>
                          <div style={{ fontSize: 10, fontWeight: 600, color: "#ffffff" }}>{col.label}</div>
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.55)", marginTop: 1 }}>{col.count}</div>
                        </div>
                        <div style={{ position: "absolute", top: 5, right: 5, width: 14, height: 14, background: "#252530", borderRadius: 3, border: "1px solid #353545" }} />
                      </div>
                    ))}
                  </div>

                  {/* Recently added */}
                  <div style={{ fontSize: 17, fontWeight: 600, color: "#e0e0e8", marginBottom: 16 }}>Recently added</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 38 }}>
                    {[
                      { img: tile_grid_portrait, label: "Realistic male character portrait, serious expression, studio lighting", model: "Nano Banana Pro · 5h ago" },
                      { img: tile_grid_boy,      label: "Cute 3D animated boy character, playful pose, grey hoodie",               model: "GPT Image · 2h ago"       },
                      { img: tile_grid_cyber2,   label: "High-quality 3D animated character render of a confident young woman",    model: "seedance · 36m ago"        },
                      { img: tile_grid_creature, label: "High-quality 3D creature render, small plush-like animal with glowing",  model: "fal-pro · 1h ago"         },
                    ].map((item, i) => (
                      <div
                        key={i}
                        ref={(el) => { tileRefs.current[i] = el; }}
                        style={{
                          borderRadius: 10,
                          overflow: "hidden",
                          border: "1px solid #252530",
                          position: "relative",
                          willChange: "opacity, transform",
                        }}
                      >
                        <div style={{ height: 172, background: "#1a1a22", position: "relative", overflow: "hidden" }}>
                          <img src={item.img} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} draggable={false} />
                          <div style={{ position: "absolute", top: 7, right: 7, width: 16, height: 16, borderRadius: 3, background: "#3b82f6", border: "1px solid #2563eb" }} />
                        </div>
                        <div style={{ background: "#111118", padding: "9px 11px" }}>
                          <div style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                            {item.label}
                          </div>
                          <div style={{ fontSize: 10, color: "#404858", marginTop: 4 }}>{item.model}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Videos section */}
                  <div style={{ fontSize: 17, fontWeight: 600, color: "#e0e0e8", marginBottom: 16 }}>Videos</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
                    {[
                      { img: tile_video_1,     label: "Walk cycle animation",  model: "Kling · 2h ago"     },
                      { img: tile_video_3,     label: "Character turnaround",  model: "seedance · 4h ago"  },
                      { img: tile_grid_boy,    label: "Idle loop animation",   model: "Kling · 5h ago"     },
                      { img: tile_grid_creature, label: "Creature run cycle",  model: "Veo · 6h ago"       },
                    ].map((item, i) => (
                      <div
                        key={i}
                        ref={(el) => { tileRefs.current[10 + i] = el; }}
                        style={{
                          borderRadius: 12,
                          overflow: "hidden",
                          border: "1px solid #252530",
                          position: "relative",
                          willChange: "opacity, transform",
                        }}
                      >
                        <div style={{ height: 150, background: "#1a1a22", position: "relative", overflow: "hidden" }}>
                          <img src={item.img} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} draggable={false} />
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <div style={{ width: 0, height: 0, borderTop: "7px solid transparent", borderBottom: "7px solid transparent", borderLeft: "12px solid rgba(255,255,255,0.9)", marginLeft: 2 }} />
                            </div>
                          </div>
                          <div style={{ position: "absolute", top: 6, right: 6, width: 14, height: 14, borderRadius: 3, background: "#10b981", border: "1px solid #059669" }} />
                        </div>
                        <div style={{ background: "#111118", padding: "9px 11px" }}>
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>{item.label}</div>
                          <div style={{ fontSize: 10, color: "#404858", marginTop: 4 }}>{item.model}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cursor — positioned in native 1920×1080 space, moves with camera */}
          <div
            ref={cursorRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              opacity: 0,
              pointerEvents: "none",
              zIndex: 10,
              transform: `translate(${TAB_CENTER_X_NATIVE[0]}px, ${NAV_Y_NATIVE}px)`,
            }}
          >
            <PurpleCursor />
          </div>
        </div>
      </div>

      {/* onFrame driver */}
      <Timegroup
        mode="fixed"
        duration={`${SCENE_DURATION}ms`}
        onFrame={onFrame as any}
        style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none" }}
      />
    </Timegroup>
  );
}

// SCENE_DURATION = 8000ms
Scene1.duration = SCENE_DURATION;
