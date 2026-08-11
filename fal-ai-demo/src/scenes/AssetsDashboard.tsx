/**
 * Scene 1 — fal.ai Dashboard Nav Panel + Assets Dashboard Reveal (0–8000ms)
 *
 * Reference-faithful camera + cursor motion:
 *  - Camera: ONE continuous eased push-in (scale 1.0→1.5, panning right to frame the
 *    Assets tab), then a hold, then a calm zoom-out to frame the full dashboard panel.
 *  - Cursor: fast arced hops between nav tabs (~300–400ms each), each landing exactly
 *    when its tab activates (color/underline/Assets-insert all snap on the same frame).
 *  - Assets tab: hidden at start, inserts (maxWidth/opacity) as the cursor arcs toward it.
 *  - Dashboard reveal at ~4.5s: sidebar+content fade in, tiles cascade in staggered.
 *
 * Every timing window below (panel resize, camera push/zoom, tab-color snaps, underline
 * slide, Assets insert, beta badge pop, content fade, tile stagger, scene fade-out) is a
 * fixed constant relative to this scene's own 8000ms `Timegroup`, so all of it is now
 * declarative CSS `@keyframes` (see styles.css) driven by percentages of the scene's own
 * duration — there is no per-frame JS or refs for any of it.
 *
 * The ONE exception: the cursor's own on-screen position. Each hop isn't a straight line —
 * it's a quadratic-bezier ARC (`bez()` below) layered with a continuous small sine/cosine
 * "alive" jitter added every frame, independent of the hop phase. Reproducing that exact
 * curved path + independent continuous noise in CSS would mean building an `offset-path`
 * per hop and layering a second infinite wobble on top with no render available to verify
 * pixel-for-pixel fidelity against the reference — a real regression risk for a purely
 * cosmetic detail. So the cursor's `transform` (position only — NOT its opacity, which is
 * plain CSS) stays a small scene-scoped `addFrameTask`, per REFACTOR-PATTERNS.md 2b #5.
 */
import React, { useCallback, useRef } from "react";
import { Timegroup, Image } from "@editframe/react";
import { clamp, bez } from "@shared/utils/animation";
import { TraceLayer } from "../components/TraceLayer";
import { TRACE_MODE, TRACE_OPACITY, SCENES, SCENE1_START_MS } from "../constants";

const TILE_CHAR_MILO = "/fal-ai-demo/src/assets/tile-char-milo.jpg";
const TILE_CHAR_MATEO = "/fal-ai-demo/src/assets/tile-char-mateo.jpg";
const TILE_CHAR_NYLA = "/fal-ai-demo/src/assets/tile-char-nyla.jpg";
const TILE_VIDEO_1 = "/fal-ai-demo/src/assets/tile-video-1.jpg";
const TILE_VIDEO_3 = "/fal-ai-demo/src/assets/tile-video-3.jpg";
const TILE_GRID_PORTRAIT = "/fal-ai-demo/src/assets/tile-grid-portrait.jpg";
const TILE_GRID_BOY = "/fal-ai-demo/src/assets/tile-grid-boy.jpg";
const TILE_GRID_HEROINE = "/fal-ai-demo/src/assets/tile-grid-heroine.jpg";
const TILE_GRID_CREATURE = "/fal-ai-demo/src/assets/tile-grid-creature.jpg";
const TILE_GRID_CYBER2 = "/fal-ai-demo/src/assets/tile-grid-cyber2.jpg";
const TILE_GRID_JUNIOR = "/fal-ai-demo/src/assets/tile-grid-junior.jpg";
const TILE_GRID_PIGSLOW = "/fal-ai-demo/src/assets/tile-grid-pigslow.jpg";
const TILE_GRID_CYBER = "/fal-ai-demo/src/assets/tile-grid-cyber.jpg";
const TILE_GRID_NEON = "/fal-ai-demo/src/assets/tile-grid-neon.jpg";

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

const STRIP_HEIGHT = 175; // compact two-row bar
const STRIP_WIDTH = 1860;
const STRIP_LEFT = 30;
const STRIP_TOP = 220;

// Extended panel dimensions (after Assets click) — width/left stay constant, only
// height/top change (a tall window anchored near the top that bleeds off the bottom).
const PANEL_FULL_HEIGHT = 1308;
const PANEL_FULL_TOP = 14;

const SIDEBAR_WIDTH = 210;

// ─── Camera: LEFT-anchored zoom + rightward pan (see styles.css `scene1-camera`) ───
// Nav bar Y center for origin anchor (strip top + half strip height)
const NAV_CENTER_Y_PCT = ((STRIP_TOP + STRIP_HEIGHT / 2) / 1080) * 100; // ~27.3%

// ─── Tab native X centers (in 1920px coordinate space) — used only by the cursor's
// own addFrameTask below; every other consumer of these positions (underline, tab
// color states) is now a fixed CSS keyframe in styles.css. ───
const TAB_CENTER_X_NATIVE = [
  66 + 74, // home:      140px
  66 + 148 + 107, // explore:   321px
  66 + 361 + 118, // generate:  545px
  66 + 596 + 96, // assets:    758px (used AFTER Assets inserts)
];

// Cursor Y in native space — just below the tab underline
const NAV_Y_NATIVE = STRIP_TOP + STRIP_HEIGHT - 20;

// ─── Nav cursor walk timing — also drives the CSS tab-color / underline / Assets-insert
// keyframes in styles.css (percentages there = these constants / SCENE_DURATION). ───
const HOP_HE_START = 500;
const HOP_HE_END = 850;
const HOP_EG_START = 1400;
const HOP_EG_END = 1750;
const HOP_GA_START = 2400;
const HOP_GA_END = 2850;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// ─── Tab definitions ─────────────────────────────────────────────────────────
const TAB_INFO = [
  { id: "home", label: "Home" },
  { id: "explore", label: "Explore" },
  { id: "generate", label: "Generate" },
  { id: "assets", label: "Assets" },
  { id: "serverless", label: "Serverless" },
  { id: "compute", label: "Compute" },
  { id: "workflows", label: "Workflows" },
  { id: "settings", label: "Settings" },
];

const TILE_STAGGER_MS = 70;
const TILE_REVEAL_DUR = 320;
const TILE_CASCADE_START = 4500; // fades in with the dashboard reveal

const PRIMARY_VIOLET = "#7C3AED";
// The "active" tab color (#ffffff) only ever appears inside the CSS keyframes in
// styles.css (scene1-tab-*-color) — there's no JS consumer for it, so it isn't
// duplicated here as a constant.
const INACTIVE_COLOR = "#5a6272";

// Scene total duration — 8000ms to allow ~3s of dashboard hold
const SCENE_DURATION = SCENES.scene1.duration;

export function AssetsDashboard() {
  // The cursor's arced hop + continuous jitter is the one effect kept as a scene-scoped
  // addFrameTask — see the file header comment for why.
  const cursorRef = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const baseY = NAV_Y_NATIVE;
    let cx = TAB_CENTER_X_NATIVE[0] - 8;
    let cy = baseY;
    const ARC = 35; // arc height for bezier (upward arc — control point is ABOVE the straight line)

    if (ms >= HOP_HE_START && ms < HOP_HE_END) {
      const t = easeInOut(clamp((ms - HOP_HE_START) / (HOP_HE_END - HOP_HE_START)));
      const fromX = TAB_CENTER_X_NATIVE[0] - 8;
      const toX = TAB_CENTER_X_NATIVE[1] - 8;
      const [bx, by] = bez(t, [fromX, baseY], [(fromX + toX) / 2, baseY - ARC], [toX, baseY]);
      cx = bx; cy = by;
    } else if (ms < HOP_HE_START) {
      cx = TAB_CENTER_X_NATIVE[0] - 8; cy = baseY;
    } else if (ms >= HOP_EG_START && ms < HOP_EG_END) {
      const t = easeInOut(clamp((ms - HOP_EG_START) / (HOP_EG_END - HOP_EG_START)));
      const fromX = TAB_CENTER_X_NATIVE[1] - 8;
      const toX = TAB_CENTER_X_NATIVE[2] - 8;
      const [bx, by] = bez(t, [fromX, baseY], [(fromX + toX) / 2, baseY - ARC], [toX, baseY]);
      cx = bx; cy = by;
    } else if (ms >= HOP_HE_END && ms < HOP_EG_START) {
      cx = TAB_CENTER_X_NATIVE[1] - 8; cy = baseY;
    } else if (ms >= HOP_GA_START && ms < HOP_GA_END) {
      const t = easeInOut(clamp((ms - HOP_GA_START) / (HOP_GA_END - HOP_GA_START)));
      const fromX = TAB_CENTER_X_NATIVE[2] - 8;
      const toX = TAB_CENTER_X_NATIVE[3] - 8;
      const [bx, by] = bez(t, [fromX, baseY], [(fromX + toX) / 2, baseY - ARC], [toX, baseY]);
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
      <TraceLayer sceneStartMs={SCENE1_START_MS} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* Scene wrapper — fades out in the last 400ms via `scene1-fadeout` */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          animation: "scene1-fadeout 400ms 7600ms linear forwards",
        }}
      >
        {/* Camera layer — one continuous push-in + zoom-out, see `scene1-camera` */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: `0% ${NAV_CENTER_Y_PCT.toFixed(1)}%`,
            perspective: "none",
            animation: `scene1-camera ${SCENE_DURATION}ms linear both`,
          }}
        >
          {/* ===== UNIFIED PANEL (strip → full dashboard), see `scene1-panel` ===== */}
          <div
            style={{
              position: "absolute",
              left: STRIP_LEFT,
              width: STRIP_WIDTH,
              background: "#111114",
              borderRadius: 14,
              border: "1px solid #1e1e26",
              boxShadow: "0 24px 80px rgba(0,0,0,0.55), 0 6px 24px rgba(0,0,0,0.35)",
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              animation: `scene1-panel ${SCENE_DURATION}ms linear both`,
              ["--panel-strip-h" as string]: `${STRIP_HEIGHT}px`,
              ["--panel-strip-top" as string]: `${STRIP_TOP}px`,
              ["--panel-full-h" as string]: `${PANEL_FULL_HEIGHT}px`,
              ["--panel-full-top" as string]: `${PANEL_FULL_TOP}px`,
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
              <div style={{ display: "flex", alignItems: "center", padding: "0 36px", gap: 0 }}>
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
                    display: "flex", alignItems: "center", gap: 10, background: "#1a1a22",
                    borderRadius: 10, padding: "8px 18px 8px 10px", border: "1px solid #252530", flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 44, height: 44, borderRadius: 10,
                      background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16, fontWeight: 700, color: "#ffffff", flexShrink: 0,
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
              <div style={{ display: "flex", alignItems: "flex-end", position: "relative", height: 82, padding: "0 36px", overflow: "visible" }}>
                {TAB_INFO.map((tab) => {
                  const isAssets = tab.id === "assets";
                  const colorAnim =
                    tab.id === "home" ? "scene1-tab-home-color"
                    : tab.id === "explore" ? "scene1-tab-explore-color"
                    : tab.id === "generate" ? "scene1-tab-generate-color"
                    : tab.id === "assets" ? "scene1-tab-assets-color"
                    : null;
                  const animations = [
                    ...(isAssets ? [`scene1-assets-tab-insert ${SCENE_DURATION}ms linear both`] : []),
                    ...(colorAnim ? [`${colorAnim} ${SCENE_DURATION}ms linear both`] : []),
                  ];
                  return (
                    <div
                      key={tab.id}
                      style={{
                        display: "flex", alignItems: "center", gap: 8, height: "100%",
                        color: INACTIVE_COLOR, fontSize: 36, fontWeight: 500, whiteSpace: "nowrap",
                        position: "relative", flexShrink: 0, background: "transparent",
                        paddingTop: 0, paddingBottom: 20,
                        paddingLeft: isAssets ? undefined : 12,
                        paddingRight: isAssets ? undefined : 12,
                        overflow: isAssets ? "hidden" : "visible",
                        ...(animations.length ? { animation: animations.join(", ") } : {}),
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", opacity: 0.75 }}>
                        {tab.id === "home" && <IconHome />}
                        {tab.id === "explore" && <IconExplore />}
                        {tab.id === "generate" && <IconGenerate />}
                        {tab.id === "assets" && <IconAssetsTab />}
                        {tab.id === "serverless" && <IconRocket />}
                        {tab.id === "compute" && <IconChip />}
                        {tab.id === "workflows" && <IconNodes />}
                        {tab.id === "settings" && <IconSettings />}
                      </span>
                      <span>{tab.label}</span>
                      {isAssets && (
                        <span
                          style={{
                            fontSize: 14, fontWeight: 700, color: "#a78bfa",
                            background: "rgba(124, 58, 237, 0.22)", borderRadius: 5,
                            padding: "2px 7px", marginLeft: 3, transformOrigin: "center",
                            animation: `scene1-beta-badge-fade 350ms 2850ms linear both, scene1-beta-badge-scale 350ms 2850ms cubic-bezier(0.34,1.56,0.64,1) both`,
                          }}
                        >
                          Beta
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* Active underline — slides between tabs, see `scene1-underline` */}
                <div
                  style={{
                    position: "absolute", bottom: 0, left: 36, height: 3,
                    background: PRIMARY_VIOLET, borderRadius: 2,
                    animation: `scene1-underline ${SCENE_DURATION}ms linear both`,
                  }}
                />
              </div>
            </div>

            {/* ── EXPANDED BODY (sidebar + content) ── */}
            <div
              style={{
                flex: 1, display: "flex", overflow: "hidden", minHeight: 0,
                animation: "scene1-content-fade 400ms 4500ms linear both",
              }}
            >
              {/* ── LEFT SIDEBAR ── */}
              <div style={{ width: SIDEBAR_WIDTH, flexShrink: 0, borderRight: "1px solid #1d1d25", padding: "16px 10px", overflowY: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: "#e0e0e8", marginBottom: 10, padding: "4px 8px" }}>
                  <span>My Assets</span>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M2 4l4 4 4-4" />
                  </svg>
                </div>

                {[
                  { label: "Home", active: false },
                  { label: "All media", active: false },
                  { label: "Characters", active: true },
                  { label: "Styles", active: false },
                  { label: "Favorites", count: "19" },
                  { label: "Archive", count: "5,432" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "5px 8px", borderRadius: 5, fontSize: 12,
                      color: item.active ? "#ffffff" : "#606878",
                      background: item.active ? "rgba(124, 58, 237, 0.18)" : "transparent",
                      marginBottom: 2,
                    }}
                  >
                    <span>{item.label}</span>
                    {item.count && <span style={{ fontSize: 10, color: "#404858" }}>{item.count}</span>}
                  </div>
                ))}

                <div style={{ height: 1, background: "#1d1d25", margin: "10px 0 8px" }} />

                <div style={{ fontSize: 9, fontWeight: 600, color: "#404858", padding: "0 8px", marginBottom: 6, letterSpacing: "0.8px", textTransform: "uppercase" }}>
                  Media types
                </div>
                {[
                  { label: "Images", count: "6,432" },
                  { label: "Videos", count: "3,106" },
                  { label: "Audio", count: "947" },
                  { label: "3D", count: "462" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "3px 8px", fontSize: 11, color: "#606878", marginBottom: 2 }}>
                    <span>{item.label}</span>
                    <span style={{ fontSize: 10, color: "#404858" }}>{item.count}</span>
                  </div>
                ))}

                <div style={{ height: 1, background: "#1d1d25", margin: "10px 0 8px" }} />

                <div style={{ fontSize: 9, fontWeight: 600, color: "#404858", padding: "0 8px", marginBottom: 6, letterSpacing: "0.8px", textTransform: "uppercase" }}>
                  Collections
                </div>
                {[
                  { label: "Milo Starling" },
                  { label: "Mateo Rivas" },
                  { label: "Cpt. Nyla Ward" },
                  { label: "Pigslow" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", padding: "3px 8px", fontSize: 11, color: "#606878", marginBottom: 2 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#404858", marginRight: 6 }} />
                    <span>{item.label}</span>
                  </div>
                ))}

                <div style={{ fontSize: 9, fontWeight: 600, color: "#404858", padding: "8px 8px 6px", letterSpacing: "0.8px", textTransform: "uppercase" }}>
                  Brand Campaign Q1
                </div>
                {[
                  { label: "Product Shots - Grea...", count: "$48.01" },
                  { label: "Social Media Assets" },
                  { label: "Hero Images - Landing" },
                  { label: "Client Review - Batch...", count: "$3.4k" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "3px 8px", fontSize: 10, color: "#505868", marginBottom: 1 }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 120 }}>{item.label}</span>
                    {item.count && <span style={{ color: "#404858", flexShrink: 0 }}>{item.count}</span>}
                  </div>
                ))}
              </div>

              {/* ── MAIN CONTENT AREA ── */}
              <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {/* Search + toolbar row */}
                <div style={{ display: "flex", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid #1d1d25", gap: 10, flexShrink: 0 }}>
                  <div style={{ flex: 1, background: "#0e0e16", border: "1px solid #1d1d25", borderRadius: 7, padding: "7px 12px", display: "flex", alignItems: "center", gap: 7 }}>
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
                      { label: "Milo Starling", img: TILE_CHAR_MILO },
                      { label: "Mateo Rivas", img: TILE_CHAR_MATEO },
                      { label: "Cpt. Nyla Ward", img: TILE_CHAR_NYLA },
                      { label: "Dr. Amina", img: TILE_GRID_HEROINE },
                      { label: "Pigslow", img: TILE_GRID_PIGSLOW },
                    ].map((char) => (
                      <div key={char.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 66, height: 66, borderRadius: "50%", background: "#252530", border: "2px solid #353545", position: "relative", overflow: "hidden", flexShrink: 0 }}>
                          <Image src={char.img} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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
                      { label: "Junior Explorer", count: "6 items", img: TILE_GRID_JUNIOR },
                      { label: "Pigslow Explorations", count: "10 items", img: TILE_GRID_PIGSLOW },
                      { label: "Cyber Heroine", count: "4 items", img: TILE_GRID_CYBER },
                      { label: "Neon Agent", count: "5 items", img: TILE_GRID_NEON },
                    ].map((col, colIdx) => (
                      <div
                        key={col.label}
                        style={{
                          width: 232, height: 172, borderRadius: 12, background: "#1a1a22", flexShrink: 0,
                          position: "relative", overflow: "hidden", border: "1px solid #252530",
                          animation: `scene1-tile-reveal ${TILE_REVEAL_DUR}ms ${TILE_CASCADE_START + (6 + colIdx) * TILE_STAGGER_MS}ms cubic-bezier(0.65,0,0.35,1) both`,
                        }}
                      >
                        <Image src={col.img} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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
                      { img: TILE_GRID_PORTRAIT, label: "Realistic male character portrait, serious expression, studio lighting", model: "Nano Banana Pro · 5h ago" },
                      { img: TILE_GRID_BOY, label: "Cute 3D animated boy character, playful pose, grey hoodie", model: "GPT Image · 2h ago" },
                      { img: TILE_GRID_CYBER2, label: "High-quality 3D animated character render of a confident young woman", model: "seedance · 36m ago" },
                      { img: TILE_GRID_CREATURE, label: "High-quality 3D creature render, small plush-like animal with glowing", model: "fal-pro · 1h ago" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        style={{
                          borderRadius: 10, overflow: "hidden", border: "1px solid #252530", position: "relative",
                          animation: `scene1-tile-reveal ${TILE_REVEAL_DUR}ms ${TILE_CASCADE_START + i * TILE_STAGGER_MS}ms cubic-bezier(0.65,0,0.35,1) both`,
                        }}
                      >
                        <div style={{ height: 172, background: "#1a1a22", position: "relative", overflow: "hidden" }}>
                          <Image src={item.img} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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
                      { img: TILE_VIDEO_1, label: "Walk cycle animation", model: "Kling · 2h ago" },
                      { img: TILE_GRID_BOY, label: "Idle loop animation", model: "Kling · 5h ago" },
                      { img: TILE_VIDEO_3, label: "Character turnaround", model: "seedance · 4h ago" },
                      { img: TILE_GRID_CREATURE, label: "Creature run cycle", model: "Veo · 6h ago" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        style={{
                          borderRadius: 12, overflow: "hidden", border: "1px solid #252530", position: "relative",
                          animation: `scene1-tile-reveal ${TILE_REVEAL_DUR}ms ${TILE_CASCADE_START + (10 + i) * TILE_STAGGER_MS}ms cubic-bezier(0.65,0,0.35,1) both`,
                        }}
                      >
                        <div style={{ height: 150, background: "#1a1a22", position: "relative", overflow: "hidden" }}>
                          <Image src={item.img} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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

          {/* Cursor — positioned in native 1920×1080 space, moves with camera. Position
              (transform) is driven by the addFrameTask above; opacity is plain CSS. */}
          <div
            ref={cursorRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
              zIndex: 10,
              transform: `translate(${TAB_CENTER_X_NATIVE[0]}px, ${NAV_Y_NATIVE}px)`,
              animation: `scene1-cursor-opacity ${SCENE_DURATION}ms linear both`,
            }}
          >
            <PurpleCursor />
          </div>
        </div>
      </div>

      {/* Cursor position driver — the one deliberate scene-scoped addFrameTask (see
          file header comment). Everything else in this scene is CSS-driven. */}
      <Timegroup
        mode="fixed"
        duration={`${SCENE_DURATION}ms`}
        onFrame={onFrame as any}
        style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none" }}
      />
    </Timegroup>
  );
}

AssetsDashboard.duration = SCENE_DURATION;
