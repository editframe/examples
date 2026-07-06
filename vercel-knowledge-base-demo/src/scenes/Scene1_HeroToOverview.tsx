/**
 * Scene1_HeroToOverview — Merged Scene 1 + 2 + 3
 * Master: 0–12000ms (12s local — see `DURATION` below)
 *
 * This scene keeps a scoped `onFrame` (per REFACTOR-PATTERNS.md Part 2b, bullet 5):
 * the camera dolly, the 6-flick scroll, the cursor pathing through the dropdown,
 * and the dropdown/list state swaps are all reads of the SAME `ms` clock and
 * branch on the SAME set of time windows (e.g. the cursor's path depends on
 * `CLICK_BTN_TIME`/`CURSOR_AT_SANDBOX`, which also drive the dropdown highlight
 * and the button/chip swap). Splitting only some of these into CSS while leaving
 * the rest in JS would require keeping both systems in sync by hand and offers
 * no reduction in complexity, so the whole scene stays one procedural unit —
 * still scoped to this one scene's own `Timegroup`, not a root-level switchboard.
 *
 * Timeline:
 *   0–1000ms:    Close-up on Knowledge Base hero (scale 1.4×)
 *   1000–3500ms: Camera ZOOMS OUT smoothly to scale 0.9×
 *   3500–5000ms: Page FAST-scrolls (accelerating inOutCubic) through lots of content,
 *                reaching All Guides header at ~5s
 *   5000ms:      All Guides section in view; camera zooms in on it
 *   5000–5600ms: Camera zooms in to 1.35× on All Guides / filter btn area
 *   5800ms:      Cursor orb appears near top of All Guides
 *   6500ms:      Cursor moves to filter button
 *   6700ms:      Click → dropdown opens
 *   6700–7200ms: Cursor moves DOWN through dropdown rows (hovering Domains briefly, then Sandbox)
 *   7000ms:      Cursor arrives at Sandbox row — row highlights
 *   7200ms:      Cursor clicks Sandbox — flash, dropdown closes
 *   7400ms:      Filter button now shows "Sandbox ×" chip, list filters to Sandbox results
 *   7400–10000ms: Filtered results visible; cursor stays on screen
 */
import React, { useCallback, useRef } from "react";
import { Timegroup, Audio } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { track, lerp } from "../components/helpers";
import { eases } from "animejs";

const DURATION = 12000;
const SCENE_START = 0;

// ── Camera timing ──
const ZOOM_OUT_START   = 800;
const ZOOM_OUT_END     = 2800;
const ZOOM_IN2_START   = 7600;
const ZOOM_IN2_END     = 8200;

const SCALE_CLOSE   = 1.4;
const SCALE_WIDE    = 0.9;
// Deeper zoom on the filter area so the interaction is clearly readable
const SCALE_FILTER  = 1.35;

// ── Scroll — 6 BIG discrete mouse-wheel flicks with pauses (like a real user) ──
// A real user flicks the wheel several times to traverse a long page. With 18
// featured rows the page is tall, so each of the 6 flicks covers a big chunk
// (~400px) and the whole traversal takes ~4.4s (3000–7400ms) before All Guides.
const SCROLL_START = 3000;
const SCROLL_END   = 7400;
// Landing contract: All Guides header lands at the SAME canvas-y the FILTER zoom
// is calibrated for. Verified 10-row layout used SCROLL_DIST=1350; adding 8 rows
// (~1050px) pushes the header down, so SCROLL_DIST = 1350 + ~1050 ≈ 2400.
const SCROLL_DIST  = 2400;

// ── Cursor + dropdown timeline (container-local coords) ──
// The filter container div is at the top-right of All Guides section.
// At SCALE_FILTER=1.35, the filter button occupies the right side.
// Container-local: button centre approx (110, 19).
// Dropdown items (in the dropdown div, which is positioned below the button):
//   Each item is 44px tall, starting at dropdown y=0.
//   Domains: centreY ≈ 22
//   Sandbox: centreY ≈ 22 + 44 = 66
//   In container-local coords (dropdown is positioned below button, top=42):
//   Domains row centre: (110, 42 + 22) = (110, 64)
//   Sandbox row centre: (110, 42 + 44 + 22) = (110, 108)

const CURSOR_APPEAR    = 8300;   // orb appears in All Guides area
const CURSOR_AT_BTN    = 9000;   // orb reaches filter button centre
const CLICK_BTN_TIME   = 9200;   // click → dropdown opens
const CURSOR_AT_SANDBOX = 9600;  // cursor arrives at Sandbox row (moves through Domains briefly)
const SANDBOX_CLICK    = 9900;   // click on Sandbox
const FILTER_APPLIED   = 10100;  // dropdown closes, list shows Sandbox results
// After the click, zoom back OUT to reveal the filtered Sandbox results full-page.
// This replaces the old static tight hold (which read as an abrupt pause/freeze).
const REVEAL_END       = 11500;

// Container-local coords for cursor waypoints:
const BTN_CX = 110;
const BTN_CY = 19;
// Dropdown list top = button height (42px) + small gap (4px) = 46
// Each row = 44px, item label centred vertically
const DROP_Y0 = 46;  // dropdown top (relative to filter container)
const ROW_H   = 44;
// Domains centre: (110, DROP_Y0 + ROW_H*0 + ROW_H/2) = (110, 46+22) = (110, 68)
const DOMAINS_CY = DROP_Y0 + ROW_H * 0 + ROW_H / 2;  // 68
// Sandbox centre: row index 1
const SANDBOX_CY = DROP_Y0 + ROW_H * 1 + ROW_H / 2;  // 112

// Pan translate for the filter zoom phase.
// Filter button is at the far RIGHT of a 1920px browser (x≈1786).
// At SCALE_FILTER=1.35, transform-origin=50%50%=(960,540):
//   screen_x of x=1786: 1.35*(1786-960)+960 = 2075 → off screen right!
// Must translate LEFT to bring filter button onto screen.
// Target filter center (x=1786) at screen x=1400:
//   Tx = 1400 - 1.35*(1786-960) - 960 = 1400 - 1115 - 960 = -675
// With 10 featured rows + SCROLL_DIST=1350, the All Guides section sits much
// lower in the page than the old 5-row layout. Render-measured: at the held
// filter-zoom state the dropdown landed ~700px too low (bottom-right corner,
// cut off). Pan the camera UP so the filter button + dropdown frame in the
// upper third (matching the reference where the dropdown is at top-right).
//   FILTER_TY shifts screen_y directly: old 106 placed the dropdown at ~screen 880;
//   we want it at ~180 → ΔTY ≈ -700 → FILTER_TY ≈ 106 - 700 = -595.
const FILTER_TX = -675;
const FILTER_TY = -595;

function NavBar() {
  return (
    <div style={{
      height: 56,
      background: '#0a0a0a',
      borderBottom: '1px solid #1e1e1e',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 32,
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }} fill="white">
          <path d="M12 2L2 19.5H22L12 2Z"/>
        </svg>
        <span style={{ color: 'white', fontSize: 15, fontWeight: 600, fontFamily: "'Geist', system-ui" }}>Vercel</span>
      </div>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <span style={{ color: '#888', fontSize: 13, fontFamily: "'Geist', system-ui" }}>Products ▾</span>
        <span style={{ color: 'white', fontSize: 13, fontFamily: "'Geist', system-ui", background: '#1e1e1e', padding: '4px 10px', borderRadius: 6, border: '1px solid #333' }}>Resources ▾</span>
        <span style={{ color: '#888', fontSize: 13, fontFamily: "'Geist', system-ui" }}>Solutions ▾</span>
        <span style={{ color: '#888', fontSize: 13, fontFamily: "'Geist', system-ui" }}>Enterprise</span>
        <span style={{ color: '#888', fontSize: 13, fontFamily: "'Geist', system-ui" }}>Docs</span>
        <span style={{ color: '#888', fontSize: 13, fontFamily: "'Geist', system-ui" }}>Pricing</span>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ padding: '6px 14px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, color: 'white', fontSize: 13, fontFamily: 'system-ui' }}>Ask AI</div>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#333', border: '1px solid #444' }} />
      </div>
    </div>
  );
}

const FILTER_PRODUCTS = ['Domains', 'Sandbox', 'AI SDK', 'Rolling Releases', 'CLI', 'Fluid Compute'];

export function Scene1_HeroToOverview() {
  const cameraRef      = useRef<HTMLDivElement>(null);
  const scrollRef      = useRef<HTMLDivElement>(null);
  const cursorRef      = useRef<HTMLDivElement>(null);
  const cursorPulseRef = useRef<HTMLDivElement>(null);
  const filterBtnRef   = useRef<HTMLDivElement>(null);
  const filterChipRef  = useRef<HTMLDivElement>(null);
  const dropdownRef    = useRef<HTMLDivElement>(null);
  const dropdownRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const defaultListRef   = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // ── CAMERA ──
    let camScale: number;
    let camTx = 0;
    let camTy = 0;

    if (ms <= ZOOM_OUT_START) {
      camScale = SCALE_CLOSE;
      camTx = 0;
      camTy = 286;
    } else if (ms <= ZOOM_OUT_END) {
      const t = track(ms, ZOOM_OUT_START, ZOOM_OUT_END, eases.inOutCubic);
      camScale = lerp(SCALE_CLOSE, SCALE_WIDE, t);
      camTx = 0;
      camTy = lerp(286, 0, t);
    } else if (ms < ZOOM_IN2_START) {
      camScale = SCALE_WIDE;
      camTx = 0;
      camTy = 0;
    } else if (ms <= ZOOM_IN2_END) {
      const t = track(ms, ZOOM_IN2_START, ZOOM_IN2_END, eases.inOutCubic);
      camScale = lerp(SCALE_WIDE, SCALE_FILTER, t);
      camTx = lerp(0, FILTER_TX, t);
      camTy = lerp(0, FILTER_TY, t);
    } else if (ms <= FILTER_APPLIED) {
      // Hold tight on the filter button + dropdown through the Sandbox click
      camScale = SCALE_FILTER;
      camTx = FILTER_TX;
      camTy = FILTER_TY;
    } else if (ms <= REVEAL_END) {
      // Post-click reveal: pull back to the full-page wide framing so the
      // filtered "Sandbox" results are shown in context (no static freeze).
      const t = track(ms, FILTER_APPLIED, REVEAL_END, eases.inOutCubic);
      camScale = lerp(SCALE_FILTER, SCALE_WIDE, t);
      camTx = lerp(FILTER_TX, 0, t);
      camTy = lerp(FILTER_TY, 0, t);
    } else {
      // Settle on the wide filtered view until the cut to the article scene
      camScale = SCALE_WIDE;
      camTx = 0;
      camTy = 0;
    }

    if (cameraRef.current) {
      cameraRef.current.style.transformOrigin = '50% 50%';
      cameraRef.current.style.transform = `translate(${camTx}px, ${camTy}px) scale(${camScale})`;
    }

    // ── SCROLL — 6 discrete mouse-wheel flicks with pauses (like a real user) ──
    // A user can't scroll a whole page in one smooth glide; they flick the wheel
    // ~6 times with brief pauses. Each flick = quick outCubic burst, then it holds.
    if (scrollRef.current) {
      const SCROLL_STEPS = 6;
      const stepDist = SCROLL_DIST / SCROLL_STEPS;
      const cycle = (SCROLL_END - SCROLL_START) / SCROLL_STEPS; // time per flick+pause
      const FLICK_FRAC = 0.58;                                  // 58% flick, 42% pause
      let scrollY: number;
      if (ms <= SCROLL_START) {
        scrollY = 0;
      } else if (ms >= SCROLL_END) {
        scrollY = SCROLL_DIST;
      } else {
        const elapsed = ms - SCROLL_START;
        const stepIdx = Math.min(Math.floor(elapsed / cycle), SCROLL_STEPS - 1);
        const local = (elapsed - stepIdx * cycle) / cycle;     // 0..1 within this cycle
        const flickT = Math.min(local / FLICK_FRAC, 1);        // 0..1 during flick, then holds at 1
        const eased = eases.outCubic(flickT);
        scrollY = stepDist * stepIdx + stepDist * eased;
      }
      scrollRef.current.style.transform = `translateY(${-scrollY}px)`;
    }

    // ── FILTER BUTTON ↔ CHIP swap ──
    // Before click: show filter button, hide chip and dropdown
    // After click: hide button, show dropdown (until Sandbox clicked)
    // After Sandbox click: hide dropdown, show "Sandbox ×" chip
    if (filterBtnRef.current) {
      filterBtnRef.current.style.opacity = ms < CLICK_BTN_TIME ? '1' : '0';
    }
    if (dropdownRef.current) {
      const showDropdown = ms >= CLICK_BTN_TIME && ms < FILTER_APPLIED;
      dropdownRef.current.style.opacity = showDropdown ? '1' : '0';
      dropdownRef.current.style.pointerEvents = 'none';
    }
    if (filterChipRef.current) {
      filterChipRef.current.style.opacity = ms >= FILTER_APPLIED ? '1' : '0';
    }

    // ── DROPDOWN ROW HIGHLIGHTS ──
    // When cursor is hovering Domains row: highlight it
    // When cursor moves to Sandbox: highlight Sandbox, un-highlight Domains
    dropdownRowRefs.current.forEach((row, i) => {
      if (!row) return;
      let highlighted = false;
      if (ms >= CLICK_BTN_TIME && ms < CURSOR_AT_SANDBOX) {
        // Hovering Domains (index 0)
        highlighted = (i === 0);
      } else if (ms >= CURSOR_AT_SANDBOX && ms < FILTER_APPLIED) {
        // Hovering Sandbox (index 1)
        highlighted = (i === 1);
      } else if (ms >= FILTER_APPLIED) {
        highlighted = false;
      }
      row.style.background = highlighted ? 'rgba(255,255,255,0.07)' : 'transparent';
      // Sandbox row text always white, others gray
      const label = row.querySelector('span') as HTMLSpanElement | null;
      if (label) {
        label.style.color = i === 1 ? 'white' : '#aaa';
      }
    });

    // ── FILTERED RESULTS swap ──
    if (listContainerRef.current) {
      listContainerRef.current.style.opacity = ms >= FILTER_APPLIED ? '1' : '0';
    }
    if (defaultListRef.current) {
      defaultListRef.current.style.opacity = ms >= FILTER_APPLIED ? '0' : '1';
    }

    // ── ORB CURSOR — child of filter container, always pixel-aligned ──
    if (cursorRef.current) {
      let ox: number, oy: number, op: number;

      if (ms < CURSOR_APPEAR) {
        // Hidden
        ox = BTN_CX + 80; oy = BTN_CY - 40; op = 0;
      } else if (ms < CURSOR_AT_BTN) {
        // Fade in and move toward filter button
        const t = track(ms, CURSOR_APPEAR, CURSOR_AT_BTN, eases.inOutCubic);
        ox = lerp(BTN_CX + 80, BTN_CX, t);
        oy = lerp(BTN_CY - 40, BTN_CY, t);
        op = track(ms, CURSOR_APPEAR, CURSOR_APPEAR + 300, eases.outCubic);
      } else if (ms < CLICK_BTN_TIME) {
        // Hovering the filter button
        ox = BTN_CX; oy = BTN_CY; op = 1;
      } else if (ms < CURSOR_AT_SANDBOX) {
        // Dropdown opened — cursor moves down through Domains toward Sandbox
        // First pause briefly on Domains, then continue to Sandbox
        // Split: CLICK_BTN_TIME→midpoint=hover Domains, midpoint→CURSOR_AT_SANDBOX=move to Sandbox
        const midpoint = CLICK_BTN_TIME + (CURSOR_AT_SANDBOX - CLICK_BTN_TIME) * 0.45;
        if (ms < midpoint) {
          // Moving from button to Domains row
          const t = track(ms, CLICK_BTN_TIME, midpoint, eases.outCubic);
          ox = lerp(BTN_CX, BTN_CX, t);
          oy = lerp(BTN_CY, DOMAINS_CY, t);
        } else {
          // Moving from Domains to Sandbox
          const t = track(ms, midpoint, CURSOR_AT_SANDBOX, eases.inOutCubic);
          ox = BTN_CX;
          oy = lerp(DOMAINS_CY, SANDBOX_CY, t);
        }
        op = 1;
      } else if (ms < SANDBOX_CLICK) {
        // Hovering Sandbox
        ox = BTN_CX; oy = SANDBOX_CY; op = 1;
      } else {
        // After click — cursor settles, then fades out before the reveal pull-back
        const t = track(ms, SANDBOX_CLICK, SANDBOX_CLICK + 400, eases.outCubic);
        ox = BTN_CX;
        oy = lerp(SANDBOX_CY, SANDBOX_CY + 10, t);
        op = ms < FILTER_APPLIED ? 1 : (1 - track(ms, FILTER_APPLIED, FILTER_APPLIED + 250, eases.outCubic));
      }

      // Click scale pulse at BTN click and at SANDBOX click
      let cs = 1;
      if ((ms >= CLICK_BTN_TIME && ms < CLICK_BTN_TIME + 160) ||
          (ms >= SANDBOX_CLICK && ms < SANDBOX_CLICK + 160)) {
        const clickMs = ms >= SANDBOX_CLICK ? SANDBOX_CLICK : CLICK_BTN_TIME;
        cs = lerp(0.75, 1, track(ms, clickMs, clickMs + 160, eases.outCubic));
      }

      cursorRef.current.style.left = `${ox - 16}px`;
      cursorRef.current.style.top  = `${oy - 16}px`;
      cursorRef.current.style.opacity = String(op);
      cursorRef.current.style.transform = `scale(${cs})`;
    }

    // ── CLICK PULSE RING — two pulses: one at filter btn click, one at Sandbox click ──
    if (cursorPulseRef.current) {
      // Sandbox click is the dramatic one; also fire at btn click
      let active = false;
      let pulseMs = 0;
      let px = BTN_CX, py = BTN_CY;
      if (ms >= CLICK_BTN_TIME && ms < CLICK_BTN_TIME + 320) {
        active = true; pulseMs = CLICK_BTN_TIME; px = BTN_CX; py = BTN_CY;
      } else if (ms >= SANDBOX_CLICK && ms < SANDBOX_CLICK + 360) {
        active = true; pulseMs = SANDBOX_CLICK; px = BTN_CX; py = SANDBOX_CY;
      }
      if (active) {
        const t = track(ms, pulseMs, pulseMs + 340, eases.outCubic);
        cursorPulseRef.current.style.left  = `${px}px`;
        cursorPulseRef.current.style.top   = `${py}px`;
        cursorPulseRef.current.style.transform = `translate(-50%, -50%) scale(${lerp(1, 3, t)})`;
        cursorPulseRef.current.style.opacity = String(1 - t);
      } else {
        cursorPulseRef.current.style.opacity = '0';
      }
    }
  }, []);

  const sandboxResults = [
    { title: "Using Vercel Sandbox to run Claude's Agent SDK", tags: ['Sandbox'] },
    { title: 'Building AI apps on Vercel: an overview', tags: ['Sandbox'] },
    { title: 'How to safely run AI generated code in your application →', tags: ['Sandbox'] },
  ];

  const allGuidesRows = [
    { title: 'How to gradually roll out new versions of your backend', tags: ['Rolling Releases', 'CLI'] },
    { title: "How do I view and update my domain's ICANN registrant information on Vercel?", tags: ['Domains'] },
    { title: 'Efficiently manage database connection pools with Fluid compute', tags: ['Fluid Compute'] },
    { title: "Using Vercel Sandbox to run Claude's Agent SDK", tags: ['Sandbox'] },
    { title: 'Streaming responses from LLMs', tags: ['AI SDK'] },
    { title: 'Building AI apps on Vercel: an overview', tags: ['AI SDK', 'Sandbox'] },
    { title: 'Deploying and testing BotID', tags: ['BotID'] },
    { title: 'Build an MCP Server with Weather tools using Express and Vercel', tags: ['Vercel MCP Server'] },
    { title: 'Accessing Vercel-hosted sites from mainland China', tags: ['Domains'] },
  ];

  return (
    <Timegroup
      mode="fixed"
      duration={`${DURATION}ms`}
      onFrame={onFrame as any}
      style={{ position: 'absolute', inset: 0, background: '#141414' }}
    >
      <TraceLayer sceneStartMs={SCENE_START} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* Camera rig */}
      <div
        ref={cameraRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          willChange: 'transform',
        }}
      >
        {/* Full browser window */}
        <div style={{
          position: 'absolute',
          left: 0, top: 0, right: 0, bottom: 0,
          background: '#0a0a0a',
          borderRadius: 0,
          border: 'none',
          overflow: 'visible',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'none',
        }}>
          <NavBar />

          {/* Scrollable content area */}
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            <div
              ref={scrollRef}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, willChange: 'transform' }}
            >
              {/* ── HERO SECTION ── */}
              <div style={{
                padding: '52px 0 56px',
                borderBottom: '1px solid #1e1e1e',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#000',
              }}>
                <h1 style={{
                  margin: 0,
                  fontSize: 124,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  fontFamily: "'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  letterSpacing: '-3px',
                  lineHeight: 1,
                  textAlign: 'center',
                }}>
                  Knowledge Base
                </h1>
                <p style={{
                  margin: '20px 0 0',
                  fontSize: 21,
                  fontWeight: 400,
                  color: '#666',
                  fontFamily: "'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  textAlign: 'center',
                  letterSpacing: '-0.2px',
                  maxWidth: 700,
                }}>
                  In-depth guides, tutorials, and explainers for best practices with Vercel.
                </p>
              </div>

              {/* ── CATEGORY CARDS ── */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                borderBottom: '1px solid #1e1e1e',
              }}>
                {/* AI */}
                <div style={{ borderRight: '1px solid #1e1e1e', overflow: 'hidden' }}>
                  <div style={{ height: 118, background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #1e1e1e', gap: 10 }}>
                    <svg viewBox="0 0 24 24" style={{ width: 36, height: 36 }}>
                      <defs><linearGradient id="s1-bolt1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8b5cf6"/><stop offset="100%" stopColor="#06b6d4"/></linearGradient></defs>
                      <path d="M13 2L4 14H11L9 22L20 10H13L13 2Z" fill="url(#s1-bolt1)"/>
                    </svg>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'white', fontSize: 16, fontWeight: 700, fontFamily: 'Arial' }}>N</span>
                    </div>
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    <div style={{ color: 'white', fontSize: 16, fontWeight: 600, fontFamily: 'system-ui', marginBottom: 6 }}>AI</div>
                    <div style={{ color: '#555', fontSize: 12, fontFamily: 'system-ui', lineHeight: 1.5 }}>Build AI-powered applications using Vercel's AI Cloud features and SDKs.</div>
                  </div>
                </div>

                {/* Backend */}
                <div style={{ borderRight: '1px solid #1e1e1e', overflow: 'hidden' }}>
                  <div style={{ height: 118, background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #1e1e1e', gap: 10 }}>
                    <svg viewBox="0 0 24 24" style={{ width: 32, height: 32 }} fill="none">
                      <circle cx="12" cy="12" r="10" stroke="#3b82f6" strokeWidth="1.5"/>
                      <path d="M12 2C12 2 7 8 7 14C7 18 9 21 12 22C15 21 17 18 17 14C17 8 12 2 12 2Z" fill="#3b82f6" opacity="0.3"/>
                    </svg>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'white', fontSize: 14, fontWeight: 700, fontFamily: 'Arial' }}>N</span>
                    </div>
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    <div style={{ color: 'white', fontSize: 16, fontWeight: 600, fontFamily: 'system-ui', marginBottom: 6 }}>Backend</div>
                    <div style={{ color: '#555', fontSize: 12, fontFamily: 'system-ui', lineHeight: 1.5 }}>Build and host APIs and other backend functionality on Vercel.</div>
                  </div>
                </div>

                {/* Security */}
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ height: 118, background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #1e1e1e' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#1a1a3e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg viewBox="0 0 24 24" style={{ width: 26, height: 26 }} fill="#4488ff">
                        <path d="M12 1L3 5V11C3 16.5 7 21.7 12 23C17 21.7 21 16.5 21 11V5L12 1Z"/>
                      </svg>
                    </div>
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    <div style={{ color: 'white', fontSize: 16, fontWeight: 600, fontFamily: 'system-ui', marginBottom: 6 }}>Security</div>
                    <div style={{ color: '#555', fontSize: 12, fontFamily: 'system-ui', lineHeight: 1.5 }}>Secure your applications with Vercel's Firewall, Bot Management, and more.</div>
                  </div>
                </div>
              </div>

              {/* ── SEARCH BAR ── */}
              <div style={{ padding: '20px 28px', borderBottom: '1px solid #1e1e1e' }}>
                <div style={{
                  background: '#111', border: '1px solid #2a2a2a', borderRadius: 8,
                  padding: '10px 16px', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', maxWidth: 520, margin: '0 auto',
                }}>
                  <span style={{ color: '#444', fontSize: 13, fontFamily: 'system-ui' }}>Search Knowledge Base</span>
                  <span style={{ color: '#333', fontSize: 11, fontFamily: 'system-ui', border: '1px solid #2a2a2a', padding: '2px 6px', borderRadius: 4 }}>⌘K</span>
                </div>
              </div>

              {/* ── FEATURED GUIDES — Row 1 ── */}
              <div style={{ padding: '24px 24px 8px' }}>
                <h2 style={{ margin: '0 0 18px', color: 'white', fontSize: 22, fontWeight: 700, fontFamily: 'system-ui' }}>Featured Guides</h2>
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  {[
                    { title: 'How to safely run AI generated code in your application', desc: 'Execute untrusted, AI-generated code inside an isolated, ephemeral environment.', tag: 'AI', tagColor: '#16803c' },
                    { title: "Using Vercel Sandbox to run Claude's Agent SDK", desc: "Learn how to deploy Claude's Agent SDK in Vercel Sandbox for secure and isolated execution.", tag: 'Backend', tagColor: '#9a5c1a' },
                    { title: 'Efficiently manage database connection pools with Fluid compute', desc: 'High-performance database connection pools without leaking connections', tag: 'Backend', tagColor: '#9a5c1a' },
                  ].map((c, i) => (
                    <div key={i} style={{ flex: 1, border: '1px solid #222', borderRadius: 8, padding: '18px 16px', background: '#0d0d0d', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui', lineHeight: 1.4 }}>{c.title}</div>
                      <div style={{ color: '#555', fontSize: 12, fontFamily: 'system-ui', lineHeight: 1.5, flex: 1 }}>{c.desc}</div>
                      <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 4, background: c.tagColor, color: 'white', fontSize: 11, fontWeight: 600, alignSelf: 'flex-start' }}>{c.tag}</div>
                    </div>
                  ))}
                </div>

                {/* Row 2 */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  {[
                    { title: 'How to gradually roll out new versions of your backend', desc: 'Incrementally release updates to your backend to minimize impact of mistakes.', tag: 'Backend', tagColor: '#9a5c1a' },
                    { title: 'Streaming responses from LLMs', desc: 'Learn how to use the AI SDK to stream LLM responses.', tag: 'AI', tagColor: '#16803c' },
                    { title: 'How to conduct PCI scans on Vercel: A complete guide to IP safelisting', desc: 'Scan and verify your Vercel deployments for secure, PCI-compliant payment processing.', tag: 'Security', tagColor: '#1a5c9a' },
                  ].map((c, i) => (
                    <div key={i} style={{ flex: 1, border: '1px solid #222', borderRadius: 8, padding: '18px 16px', background: '#0d0d0d', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui', lineHeight: 1.4 }}>{c.title}</div>
                      <div style={{ color: '#555', fontSize: 12, fontFamily: 'system-ui', lineHeight: 1.5, flex: 1 }}>{c.desc}</div>
                      <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 4, background: c.tagColor, color: 'white', fontSize: 11, fontWeight: 600, alignSelf: 'flex-start' }}>{c.tag}</div>
                    </div>
                  ))}
                </div>

                {/* Row 3 */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  {[
                    { title: 'Edge Middleware: Running code before every request', desc: 'Use Vercel Edge Middleware to transform responses, rewrite URLs, and enforce auth at the edge.', tag: 'Backend', tagColor: '#9a5c1a' },
                    { title: 'Optimistic UI with Vercel KV and React Server Components', desc: 'Build snappy user experiences by combining KV storage with React Server Actions.', tag: 'AI', tagColor: '#16803c' },
                    { title: 'Configuring custom domains with Vercel DNS', desc: 'Step-by-step guide to pointing your custom domain to a Vercel deployment.', tag: 'Security', tagColor: '#1a5c9a' },
                  ].map((c, i) => (
                    <div key={i} style={{ flex: 1, border: '1px solid #222', borderRadius: 8, padding: '18px 16px', background: '#0d0d0d', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui', lineHeight: 1.4 }}>{c.title}</div>
                      <div style={{ color: '#555', fontSize: 12, fontFamily: 'system-ui', lineHeight: 1.5, flex: 1 }}>{c.desc}</div>
                      <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 4, background: c.tagColor, color: 'white', fontSize: 11, fontWeight: 600, alignSelf: 'flex-start' }}>{c.tag}</div>
                    </div>
                  ))}
                </div>

                {/* Row 4 */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  {[
                    { title: 'Deploying a monorepo with Turborepo on Vercel', desc: 'Configure remote caching and parallel builds for large monorepo projects on Vercel.', tag: 'Backend', tagColor: '#9a5c1a' },
                    { title: 'Zero-downtime database migrations with Vercel Postgres', desc: 'Safely run schema migrations without dropping connections or causing deployment rollbacks.', tag: 'AI', tagColor: '#16803c' },
                    { title: 'A/B testing at the edge with Vercel and PostHog', desc: 'Run experiments without client-side flicker by evaluating feature flags in Middleware.', tag: 'Security', tagColor: '#1a5c9a' },
                  ].map((c, i) => (
                    <div key={i} style={{ flex: 1, border: '1px solid #222', borderRadius: 8, padding: '18px 16px', background: '#0d0d0d', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui', lineHeight: 1.4 }}>{c.title}</div>
                      <div style={{ color: '#555', fontSize: 12, fontFamily: 'system-ui', lineHeight: 1.5, flex: 1 }}>{c.desc}</div>
                      <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 4, background: c.tagColor, color: 'white', fontSize: 11, fontWeight: 600, alignSelf: 'flex-start' }}>{c.tag}</div>
                    </div>
                  ))}
                </div>

                {/* Row 5 — additional content for long scroll */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  {[
                    { title: 'Managing environment variables across preview, staging, and production', desc: "Organize your env vars with Vercel's environment scoping and secret management tools.", tag: 'Backend', tagColor: '#9a5c1a' },
                    { title: 'Deploying Python AI applications with serverless functions', desc: 'Run FastAPI, Flask, or custom Python AI inference endpoints on Vercel in minutes.', tag: 'AI', tagColor: '#16803c' },
                    { title: 'Rate-limiting API routes with Vercel Firewall rules', desc: "Protect your Next.js API routes from abuse using Vercel's built-in firewall rate limiting.", tag: 'Security', tagColor: '#1a5c9a' },
                  ].map((c, i) => (
                    <div key={i} style={{ flex: 1, border: '1px solid #222', borderRadius: 8, padding: '18px 16px', background: '#0d0d0d', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui', lineHeight: 1.4 }}>{c.title}</div>
                      <div style={{ color: '#555', fontSize: 12, fontFamily: 'system-ui', lineHeight: 1.5, flex: 1 }}>{c.desc}</div>
                      <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 4, background: c.tagColor, color: 'white', fontSize: 11, fontWeight: 600, alignSelf: 'flex-start' }}>{c.tag}</div>
                    </div>
                  ))}
                </div>

                {/* Row 6 */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  {[
                    { title: 'Implementing ISR with Next.js App Router on Vercel', desc: 'Combine static generation with on-demand revalidation for fast, always-fresh pages.', tag: 'Backend', tagColor: '#9a5c1a' },
                    { title: 'Build a real-time AI chat UI with streaming and React Server Components', desc: 'Stream LLM tokens directly into your UI using the AI SDK and server actions.', tag: 'AI', tagColor: '#16803c' },
                    { title: 'Geo-blocking and country redirects with Vercel Middleware', desc: 'Enforce regional access controls and redirect users based on their IP geolocation.', tag: 'Security', tagColor: '#1a5c9a' },
                  ].map((c, i) => (
                    <div key={i} style={{ flex: 1, border: '1px solid #222', borderRadius: 8, padding: '18px 16px', background: '#0d0d0d', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui', lineHeight: 1.4 }}>{c.title}</div>
                      <div style={{ color: '#555', fontSize: 12, fontFamily: 'system-ui', lineHeight: 1.5, flex: 1 }}>{c.desc}</div>
                      <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 4, background: c.tagColor, color: 'white', fontSize: 11, fontWeight: 600, alignSelf: 'flex-start' }}>{c.tag}</div>
                    </div>
                  ))}
                </div>

                {/* Row 7 */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  {[
                    { title: 'Using OpenTelemetry with Vercel Functions for distributed tracing', desc: 'Instrument your serverless functions and visualize trace waterfalls across your stack.', tag: 'Backend', tagColor: '#9a5c1a' },
                    { title: 'Fine-tuning model latency with AI SDK caching and prompt compression', desc: 'Reduce round-trip times and API costs by caching repeated prompts and compressing context.', tag: 'AI', tagColor: '#16803c' },
                    { title: 'Setting up DKIM and SPF records for transactional email on Vercel', desc: 'Configure your DNS and domain records to improve email deliverability for Vercel-hosted apps.', tag: 'Domains', tagColor: '#5c1a7a' },
                  ].map((c, i) => (
                    <div key={i} style={{ flex: 1, border: '1px solid #222', borderRadius: 8, padding: '18px 16px', background: '#0d0d0d', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui', lineHeight: 1.4 }}>{c.title}</div>
                      <div style={{ color: '#555', fontSize: 12, fontFamily: 'system-ui', lineHeight: 1.5, flex: 1 }}>{c.desc}</div>
                      <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 4, background: c.tagColor, color: 'white', fontSize: 11, fontWeight: 600, alignSelf: 'flex-start' }}>{c.tag}</div>
                    </div>
                  ))}
                </div>

                {/* Row 8 */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  {[
                    { title: 'Deploying and scaling WebSocket servers on Vercel with Ably', desc: 'Add real-time bidirectional messaging to your Vercel-hosted app using Ably channels.', tag: 'Backend', tagColor: '#9a5c1a' },
                    { title: 'Integrating vector databases with Vercel for semantic search', desc: 'Connect Pinecone or pgvector to your AI app on Vercel for RAG and similarity search.', tag: 'AI', tagColor: '#16803c' },
                    { title: 'Multi-tenant SaaS architecture with Vercel and Clerk', desc: 'Isolate tenant data and route custom domains using Middleware and per-org JWT claims.', tag: 'Security', tagColor: '#1a5c9a' },
                  ].map((c, i) => (
                    <div key={i} style={{ flex: 1, border: '1px solid #222', borderRadius: 8, padding: '18px 16px', background: '#0d0d0d', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui', lineHeight: 1.4 }}>{c.title}</div>
                      <div style={{ color: '#555', fontSize: 12, fontFamily: 'system-ui', lineHeight: 1.5, flex: 1 }}>{c.desc}</div>
                      <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 4, background: c.tagColor, color: 'white', fontSize: 11, fontWeight: 600, alignSelf: 'flex-start' }}>{c.tag}</div>
                    </div>
                  ))}
                </div>

                {/* Row 9 */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  {[
                    { title: 'Rolling back bad deployments instantly with Vercel Instant Rollback', desc: 'Revert production to a known-good build in seconds with zero downtime or DNS changes.', tag: 'Backend', tagColor: '#9a5c1a' },
                    { title: 'Generating structured JSON outputs from LLMs with the AI SDK', desc: 'Use Zod schemas with generateObject to get reliable, typed data from any frontier model.', tag: 'AI', tagColor: '#16803c' },
                    { title: 'DNSSEC configuration and domain security hardening on Vercel', desc: 'Enable DNSSEC signing for your Vercel-managed domains to prevent DNS spoofing attacks.', tag: 'Domains', tagColor: '#5c1a7a' },
                  ].map((c, i) => (
                    <div key={i} style={{ flex: 1, border: '1px solid #222', borderRadius: 8, padding: '18px 16px', background: '#0d0d0d', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui', lineHeight: 1.4 }}>{c.title}</div>
                      <div style={{ color: '#555', fontSize: 12, fontFamily: 'system-ui', lineHeight: 1.5, flex: 1 }}>{c.desc}</div>
                      <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 4, background: c.tagColor, color: 'white', fontSize: 11, fontWeight: 600, alignSelf: 'flex-start' }}>{c.tag}</div>
                    </div>
                  ))}
                </div>

                {/* Row 10 */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  {[
                    { title: 'Optimizing Cold Start Performance for Vercel Serverless Functions', desc: 'Reduce cold start latency by bundling efficiently, pruning dependencies, and using edge runtimes.', tag: 'Backend', tagColor: '#9a5c1a' },
                    { title: 'Building an AI document Q&A app with PDF parsing and the AI SDK', desc: 'Upload PDFs, chunk and embed them, then answer user questions with citations using RAG.', tag: 'AI', tagColor: '#16803c' },
                    { title: 'Configuring Content Security Policy headers on Vercel', desc: 'Add a strict CSP via Vercel headers config to mitigate XSS and injection vulnerabilities.', tag: 'Security', tagColor: '#1a5c9a' },
                  ].map((c, i) => (
                    <div key={i} style={{ flex: 1, border: '1px solid #222', borderRadius: 8, padding: '18px 16px', background: '#0d0d0d', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui', lineHeight: 1.4 }}>{c.title}</div>
                      <div style={{ color: '#555', fontSize: 12, fontFamily: 'system-ui', lineHeight: 1.5, flex: 1 }}>{c.desc}</div>
                      <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 4, background: c.tagColor, color: 'white', fontSize: 11, fontWeight: 600, alignSelf: 'flex-start' }}>{c.tag}</div>
                    </div>
                  ))}
                </div>

                {/* Row 11 */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  {[
                    { title: 'Caching strategies with the Vercel Edge Network and stale-while-revalidate', desc: 'Serve instant responses and revalidate in the background for fresh, fast pages.', tag: 'Backend', tagColor: '#9a5c1a' },
                    { title: 'Building a streaming chatbot UI with the AI SDK and React Server Components', desc: 'Stream tokens to the client as the model generates them for a responsive chat.', tag: 'AI', tagColor: '#16803c' },
                    { title: 'Protecting routes with Vercel Firewall custom rules', desc: 'Block malicious traffic and enforce per-path access policies at the edge.', tag: 'Security', tagColor: '#1a5c9a' },
                  ].map((c, i) => (
                    <div key={i} style={{ flex: 1, border: '1px solid #222', borderRadius: 8, padding: '18px 16px', background: '#0d0d0d', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui', lineHeight: 1.4 }}>{c.title}</div>
                      <div style={{ color: '#555', fontSize: 12, fontFamily: 'system-ui', lineHeight: 1.5, flex: 1 }}>{c.desc}</div>
                      <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 4, background: c.tagColor, color: 'white', fontSize: 11, fontWeight: 600, alignSelf: 'flex-start' }}>{c.tag}</div>
                    </div>
                  ))}
                </div>

                {/* Row 12 */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  {[
                    { title: 'Migrating a monolith to serverless functions on Vercel', desc: 'Incrementally move endpoints to Vercel Functions without a big-bang rewrite.', tag: 'Backend', tagColor: '#9a5c1a' },
                    { title: 'Image optimization at scale with the next/image component', desc: 'Automatic resizing, format negotiation, and CDN caching for media-heavy apps.', tag: 'Backend', tagColor: '#9a5c1a' },
                    { title: 'Setting up wildcard domains for multi-tenant applications', desc: 'Route *.yourapp.com to per-tenant deployments with a single configuration.', tag: 'Domains', tagColor: '#5c1a7a' },
                  ].map((c, i) => (
                    <div key={i} style={{ flex: 1, border: '1px solid #222', borderRadius: 8, padding: '18px 16px', background: '#0d0d0d', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui', lineHeight: 1.4 }}>{c.title}</div>
                      <div style={{ color: '#555', fontSize: 12, fontFamily: 'system-ui', lineHeight: 1.5, flex: 1 }}>{c.desc}</div>
                      <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 4, background: c.tagColor, color: 'white', fontSize: 11, fontWeight: 600, alignSelf: 'flex-start' }}>{c.tag}</div>
                    </div>
                  ))}
                </div>

                {/* Row 13 */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  {[
                    { title: 'Running cron jobs with Vercel Scheduled Functions', desc: 'Schedule recurring background work without managing your own infrastructure.', tag: 'Backend', tagColor: '#9a5c1a' },
                    { title: 'Semantic search over your docs with embeddings and pgvector', desc: 'Index content as vectors and retrieve the most relevant passages for RAG.', tag: 'AI', tagColor: '#16803c' },
                    { title: 'Hardening your app against bot traffic with BotID', desc: 'Detect and challenge automated abuse before it reaches your functions.', tag: 'Security', tagColor: '#1a5c9a' },
                  ].map((c, i) => (
                    <div key={i} style={{ flex: 1, border: '1px solid #222', borderRadius: 8, padding: '18px 16px', background: '#0d0d0d', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui', lineHeight: 1.4 }}>{c.title}</div>
                      <div style={{ color: '#555', fontSize: 12, fontFamily: 'system-ui', lineHeight: 1.5, flex: 1 }}>{c.desc}</div>
                      <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 4, background: c.tagColor, color: 'white', fontSize: 11, fontWeight: 600, alignSelf: 'flex-start' }}>{c.tag}</div>
                    </div>
                  ))}
                </div>

                {/* Row 14 */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  {[
                    { title: 'Incremental Static Regeneration patterns for large catalogs', desc: 'Keep thousands of pages fresh with on-demand and time-based revalidation.', tag: 'Backend', tagColor: '#9a5c1a' },
                    { title: 'Streaming structured data to the client with the AI SDK', desc: 'Progressively render typed objects as the model produces them.', tag: 'AI', tagColor: '#16803c' },
                    { title: 'Configuring SPF, DKIM, and DMARC for transactional email', desc: 'Improve deliverability and prevent spoofing of your sending domain.', tag: 'Domains', tagColor: '#5c1a7a' },
                  ].map((c, i) => (
                    <div key={i} style={{ flex: 1, border: '1px solid #222', borderRadius: 8, padding: '18px 16px', background: '#0d0d0d', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui', lineHeight: 1.4 }}>{c.title}</div>
                      <div style={{ color: '#555', fontSize: 12, fontFamily: 'system-ui', lineHeight: 1.5, flex: 1 }}>{c.desc}</div>
                      <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 4, background: c.tagColor, color: 'white', fontSize: 11, fontWeight: 600, alignSelf: 'flex-start' }}>{c.tag}</div>
                    </div>
                  ))}
                </div>

                {/* Row 15 */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  {[
                    { title: 'Connecting a Postgres database with Vercel and Drizzle ORM', desc: 'Type-safe queries and migrations against a serverless Postgres instance.', tag: 'Backend', tagColor: '#9a5c1a' },
                    { title: 'Cutting AI token costs with prompt caching and compression', desc: 'Reuse cached context and trim prompts to reduce per-request spend.', tag: 'AI', tagColor: '#16803c' },
                    { title: 'Enforcing least-privilege access with scoped API tokens', desc: 'Issue narrowly-scoped credentials and rotate them on a schedule.', tag: 'Security', tagColor: '#1a5c9a' },
                  ].map((c, i) => (
                    <div key={i} style={{ flex: 1, border: '1px solid #222', borderRadius: 8, padding: '18px 16px', background: '#0d0d0d', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui', lineHeight: 1.4 }}>{c.title}</div>
                      <div style={{ color: '#555', fontSize: 12, fontFamily: 'system-ui', lineHeight: 1.5, flex: 1 }}>{c.desc}</div>
                      <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 4, background: c.tagColor, color: 'white', fontSize: 11, fontWeight: 600, alignSelf: 'flex-start' }}>{c.tag}</div>
                    </div>
                  ))}
                </div>

                {/* Row 16 */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  {[
                    { title: 'Deploying Python FastAPI apps as serverless functions', desc: 'Ship Python inference and API endpoints alongside your frontend.', tag: 'Backend', tagColor: '#9a5c1a' },
                    { title: 'Building agentic workflows with the AI SDK and tool calling', desc: 'Let the model plan, call tools, and act over multiple reasoning steps.', tag: 'AI', tagColor: '#16803c' },
                    { title: 'Rotating secrets safely across preview and production', desc: 'Manage environment scoping so secrets never leak between deployments.', tag: 'Security', tagColor: '#1a5c9a' },
                  ].map((c, i) => (
                    <div key={i} style={{ flex: 1, border: '1px solid #222', borderRadius: 8, padding: '18px 16px', background: '#0d0d0d', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui', lineHeight: 1.4 }}>{c.title}</div>
                      <div style={{ color: '#555', fontSize: 12, fontFamily: 'system-ui', lineHeight: 1.5, flex: 1 }}>{c.desc}</div>
                      <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 4, background: c.tagColor, color: 'white', fontSize: 11, fontWeight: 600, alignSelf: 'flex-start' }}>{c.tag}</div>
                    </div>
                  ))}
                </div>

                {/* Row 17 */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  {[
                    { title: 'Zero-downtime database migrations with branch databases', desc: 'Test schema changes on an isolated branch before promoting to production.', tag: 'Backend', tagColor: '#9a5c1a' },
                    { title: 'Real-time collaboration with WebSockets on Vercel', desc: 'Add presence and live cursors using a managed realtime transport.', tag: 'Backend', tagColor: '#9a5c1a' },
                    { title: 'Pointing an apex domain to Vercel with ALIAS records', desc: 'Resolve yourapp.com at the root without breaking email or other records.', tag: 'Domains', tagColor: '#5c1a7a' },
                  ].map((c, i) => (
                    <div key={i} style={{ flex: 1, border: '1px solid #222', borderRadius: 8, padding: '18px 16px', background: '#0d0d0d', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui', lineHeight: 1.4 }}>{c.title}</div>
                      <div style={{ color: '#555', fontSize: 12, fontFamily: 'system-ui', lineHeight: 1.5, flex: 1 }}>{c.desc}</div>
                      <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 4, background: c.tagColor, color: 'white', fontSize: 11, fontWeight: 600, alignSelf: 'flex-start' }}>{c.tag}</div>
                    </div>
                  ))}
                </div>

                {/* Row 18 */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                  {[
                    { title: 'Observability and tracing for serverless with OpenTelemetry', desc: 'Visualize trace waterfalls and find slow spans across your functions.', tag: 'Backend', tagColor: '#9a5c1a' },
                    { title: 'Generating images on the edge with the AI SDK', desc: 'Produce and stream model-generated images close to your users.', tag: 'AI', tagColor: '#16803c' },
                    { title: 'Rate limiting APIs to prevent abuse and control cost', desc: 'Throttle requests per user or IP using Vercel KV and Middleware.', tag: 'Security', tagColor: '#1a5c9a' },
                  ].map((c, i) => (
                    <div key={i} style={{ flex: 1, border: '1px solid #222', borderRadius: 8, padding: '18px 16px', background: '#0d0d0d', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui', lineHeight: 1.4 }}>{c.title}</div>
                      <div style={{ color: '#555', fontSize: 12, fontFamily: 'system-ui', lineHeight: 1.5, flex: 1 }}>{c.desc}</div>
                      <div style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 4, background: c.tagColor, color: 'white', fontSize: 11, fontWeight: 600, alignSelf: 'flex-start' }}>{c.tag}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── ALL GUIDES ── */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #1e1e1e' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h2 style={{ margin: 0, color: 'white', fontSize: 22, fontWeight: 700, fontFamily: 'system-ui' }}>All Guides</h2>

                  {/* Filter area — relative container that holds button, dropdown, chip, and cursor */}
                  <div style={{ position: 'relative' }}>

                    {/* Default filter button (before click) */}
                    <div
                      ref={filterBtnRef}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        border: '1px solid #333', borderRadius: 6,
                        padding: '8px 14px', background: '#111',
                        color: '#888', fontSize: 13, fontFamily: 'system-ui',
                        width: 220,
                      }}
                    >
                      <svg viewBox="0 0 24 24" style={{ width: 14, height: 14 }} fill="none" stroke="#888" strokeWidth="2">
                        <path d="M4 6H20M7 12H17M10 18H14"/>
                      </svg>
                      <span>Filter Guides by Product</span>
                      <span style={{ marginLeft: 'auto' }}>▾</span>
                    </div>

                    {/* "Sandbox ×" chip — shown after Sandbox is clicked */}
                    <div
                      ref={filterChipRef}
                      style={{
                        position: 'absolute', top: 0, right: 0,
                        display: 'flex', alignItems: 'center', gap: 8,
                        border: '1px solid #555', borderRadius: 6,
                        padding: '8px 14px', background: '#0f0f0f',
                        color: 'white', fontSize: 13, fontFamily: 'system-ui',
                        width: 220, boxSizing: 'border-box',
                        boxShadow: '0 0 0 2px rgba(255,255,255,0.05)',
                        opacity: 0,
                      }}
                    >
                      <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, flexShrink: 0 }} fill="none" stroke="#aaa" strokeWidth="2">
                        <path d="M4 6H20M7 12H17M10 18H14"/>
                      </svg>
                      <span style={{ fontWeight: 500 }}>Sandbox</span>
                      <span style={{ marginLeft: 'auto', color: '#666', fontSize: 14 }}>×</span>
                    </div>

                    {/* Dropdown — opens after button click, closes after Sandbox click.
                        Positioned below button. Each row is 44px tall.
                        Total height: 6 items × 44px = 264px */}
                    <div
                      ref={dropdownRef}
                      style={{
                        position: 'absolute',
                        top: 42,   // just below the 38px button + 4px gap
                        right: 0,
                        width: 220,
                        background: '#111',
                        border: '1px solid #2a2a2a',
                        borderRadius: 8,
                        overflow: 'hidden',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                        opacity: 0,
                        zIndex: 100,
                      }}
                    >
                      {FILTER_PRODUCTS.map((product, i) => (
                        <div
                          key={i}
                          ref={el => { dropdownRowRefs.current[i] = el; }}
                          style={{
                            height: ROW_H,
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 14px',
                            borderBottom: i < FILTER_PRODUCTS.length - 1 ? '1px solid #1a1a1a' : 'none',
                            background: 'transparent',
                            transition: 'background 0.1s',
                          }}
                        >
                          <span style={{
                            fontSize: 13,
                            fontFamily: 'system-ui',
                            color: i === 1 ? 'white' : '#aaa',
                          }}>{product}</span>
                        </div>
                      ))}
                    </div>

                    {/* Orb cursor — child of filter container, pixel-aligned */}
                    <div
                      ref={cursorRef}
                      style={{
                        position: 'absolute',
                        left: BTN_CX - 16,
                        top: BTN_CY - 16,
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'rgba(200,200,200,0.88)',
                        border: '2px solid rgba(255,255,255,0.65)',
                        boxShadow: '0 0 12px rgba(255,255,255,0.3)',
                        opacity: 0, zIndex: 200, pointerEvents: 'none',
                        willChange: 'transform, opacity',
                      }}
                    />

                    {/* Click pulse ring */}
                    <div
                      ref={cursorPulseRef}
                      style={{
                        position: 'absolute',
                        left: BTN_CX, top: BTN_CY,
                        width: 28, height: 28, borderRadius: '50%',
                        border: '2px solid rgba(220,220,220,0.7)',
                        opacity: 0, zIndex: 199, pointerEvents: 'none',
                        transform: 'translate(-50%, -50%)',
                        willChange: 'transform, opacity',
                      }}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: '#1e1e1e', marginBottom: 0 }} />

                {/* List container */}
                <div style={{ position: 'relative' }}>
                  {/* Default list */}
                  <div ref={defaultListRef} style={{ transition: 'opacity 0.3s' }}>
                    {allGuidesRows.map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '15px 0', borderBottom: '1px solid #1e1e1e',
                      }}>
                        <span style={{ color: 'white', fontSize: 14, fontFamily: 'system-ui', fontWeight: 500 }}>{item.title}</span>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {item.tags.map((tag, ti) => (
                            <span key={ti} style={{ color: '#888', fontSize: 12, fontFamily: 'system-ui', border: '1px solid #333', padding: '3px 8px', borderRadius: 4, background: '#111' }}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Filtered results (Sandbox) */}
                  <div
                    ref={listContainerRef}
                    style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0,
                      opacity: 0,
                      transition: 'opacity 0.25s',
                    }}
                  >
                    {sandboxResults.map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '18px 0', borderBottom: '1px solid #1e1e1e',
                        background: '#0a0a0a',
                      }}>
                        <span style={{ color: 'white', fontSize: 15, fontFamily: 'system-ui', fontWeight: 500 }}>{item.title}</span>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {item.tags.map((tag, ti) => (
                            <span key={ti} style={{ color: '#888', fontSize: 12, fontFamily: 'system-ui', border: '1px solid #333', padding: '4px 10px', borderRadius: 4, background: '#111' }}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── CTA FOOTER ── */}
              <div style={{
                borderTop: '1px solid #1e1e1e',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
              }}>
                <div style={{ padding: '40px 32px', borderRight: '1px solid #1e1e1e' }}>
                  <h3 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 700, color: 'white', fontFamily: 'system-ui', lineHeight: 1.3 }}>
                    Ready to deploy? <span style={{ color: '#818cf8' }}>Start building with a free account.</span>{' '}
                    Speak to an expert for your <span style={{ color: '#818cf8' }}>Pro</span> or{' '}
                    <span style={{ color: '#818cf8' }}>Enterprise</span> needs.
                  </h3>
                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    <div style={{ padding: '10px 20px', background: 'white', borderRadius: 6, color: '#000', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui' }}>Start Deploying</div>
                    <div style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #444', borderRadius: 6, color: 'white', fontSize: 14, fontFamily: 'system-ui' }}>Talk to an Expert</div>
                  </div>
                </div>
                <div style={{ padding: '40px 32px', borderRight: '1px solid #1e1e1e' }} />
                <div style={{ padding: '40px 32px' }}>
                  <div style={{ color: 'white', fontSize: 16, fontFamily: 'system-ui', marginBottom: 10 }}>
                    <strong>Explore Vercel Enterprise</strong> with an interactive product tour, trial, or a personalized demo.
                  </div>
                  <div style={{ display: 'inline-block', padding: '9px 18px', border: '1px solid #555', borderRadius: 20, color: 'white', fontSize: 13, fontFamily: 'system-ui', marginTop: 12 }}>Explore Enterprise</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Filter button click — opens the dropdown */}
      <Audio src="/assets/sfx/click.mp3" offset={`${CLICK_BTN_TIME}ms`} sourceIn="0.6s" duration="0.3s" volume={2.2} />
      {/* Sandbox row click — closes the dropdown, applies the filter */}
      <Audio src="/assets/sfx/click.mp3" offset={`${SANDBOX_CLICK}ms`} sourceIn="0.6s" duration="0.3s" volume={2.2} />
    </Timegroup>
  );
}
