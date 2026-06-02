/**
 * Scene 3 — All Guides zoom-in + orb cursor opens filter dropdown + clicks Sandbox
 * Master: 5000–10000ms
 *
 * FIX 3 sequence:
 * 0-800ms:   Camera ZOOMS IN on the All Guides section filter button area (scale 1.0 → 2.0×)
 * 800-1600ms: Orb cursor moves toward filter button
 * 1600-2200ms: Dropdown opens
 * 2200-3400ms: Orb cursor moves down to hover Sandbox item
 * 3400-4000ms: Orb clicks Sandbox — click pulse, dropdown closes, filter shows "Sandbox×"
 * 4000-5000ms: Filtered results visible (sandbox articles)
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { track, lerp, clamp } from "../components/helpers";
import { eases } from "animejs";

const DURATION = 5000;
const SCENE_START = 5000;

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
        <span style={{ color: 'white', fontSize: 15, fontWeight: 600, fontFamily: 'system-ui' }}>Vercel</span>
      </div>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <span style={{ color: '#888', fontSize: 13, fontFamily: 'system-ui' }}>Products ▾</span>
        <span style={{ color: 'white', fontSize: 13, fontFamily: 'system-ui', background: '#1e1e1e', padding: '4px 10px', borderRadius: 6, border: '1px solid #333' }}>Resources ▾</span>
        <span style={{ color: '#888', fontSize: 13, fontFamily: 'system-ui' }}>Solutions ▾</span>
        <span style={{ color: '#888', fontSize: 13, fontFamily: 'system-ui' }}>Enterprise</span>
        <span style={{ color: '#888', fontSize: 13, fontFamily: 'system-ui' }}>Docs</span>
        <span style={{ color: '#888', fontSize: 13, fontFamily: 'system-ui' }}>Pricing</span>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ padding: '6px 14px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, color: 'white', fontSize: 13, fontFamily: 'system-ui' }}>Ask AI</div>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#333', border: '1px solid #444' }} />
      </div>
    </div>
  );
}

export function Scene3_FilterDropdown() {
  const cameraRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorPulseRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterBtnRef = useRef<HTMLDivElement>(null);
  const filterInputRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const defaultListRef = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // ── Camera zoom-in ──
    // FIX 3: Zoom IN on the filter/All Guides area.
    // Browser: left=60, top=50, width=1800, height=980. NavBar=56px.
    // "All Guides" header with filter button is at:
    //   x ≈ 60 + 1800 - 24 - 220/2 = ~1726 (filter button right side, ~1630 center)
    //   y ≈ 50 + 56 + 24 + 14 = ~144 (top of content + padding + half header)
    // Use transform-origin AT the filter button area: 85% x, 15% y in canvas
    // Then translate to pull it toward center.
    // Origin anchor: (1632, 162) — at the filter button row
    // ox% = 1632/1920 = 85%, oy% = 162/1080 = 15%
    // At scale 2.0, origin (1632, 162) stays fixed. translate to move it toward (960, 360) for better composition:
    // camTx = 960 - 1632 = -672, camTy = 360 - 162 = 198
    const zoomT = track(ms, 0, 800, eases.inOutCubic);
    const camScale = lerp(1.0, 2.0, zoomT);
    const camTx = lerp(0, -672, zoomT);
    const camTy = lerp(0, 198, zoomT);

    if (cameraRef.current) {
      cameraRef.current.style.transformOrigin = '85% 15%';
      cameraRef.current.style.transform = `translate(${camTx}px, ${camTy}px) scale(${camScale})`;
    }

    // ── Orb cursor position ──
    // Cursor starts off-screen right, moves toward filter button
    // Filter button is at approx canvas x=1380, y=443 (within the absolute layout)
    // Orb cursor is positioned absolutely in the canvas
    // Phase: 0-800ms cursor is off (camera zooming), appears at 800ms
    // 800-1600ms: moves toward filter button
    // 1600-2200ms: at filter button (dropdown opens)
    // 2200-3400ms: moves down to Sandbox item
    // 3400-4000ms: click → moves away
    // 4000-5000ms: fades

    // Canvas-space coords (pre-transform — camera rig transforms around these)
    // Browser: left=60 top=50. NavBar=56. Content padding=24.
    // All Guides header row: y = 50+56+24+14 = 144
    // Filter button: right edge of content = 60+1800-24 = 1836, button width=220, center x = 1836-110 = 1726
    const FILTER_X = 1726; // filter button center X in canvas
    const FILTER_Y = 150;  // All Guides header row Y in canvas
    // Dropdown: appears just below filter button. Each item ~40px. Dropdown top y = 150+18+4 = 172
    // Sandbox is 2nd item: y = 172 + 40 + 20 = 232
    const SANDBOX_X = 1726;
    const SANDBOX_Y = 232; // Sandbox item Y in canvas

    let cx = FILTER_X + 200;
    let cy = FILTER_Y - 40;
    let cursorOpacity = 0;

    if (ms >= 800 && ms < 1600) {
      const t = track(ms, 800, 1550, eases.inOutCubic);
      cx = lerp(FILTER_X + 200, FILTER_X, t);
      cy = lerp(FILTER_Y - 40, FILTER_Y, t);
      cursorOpacity = track(ms, 800, 1100, eases.outCubic);
    } else if (ms >= 1600 && ms < 2200) {
      cx = FILTER_X;
      cy = FILTER_Y;
      cursorOpacity = 1;
    } else if (ms >= 2200 && ms < 3400) {
      const t = track(ms, 2200, 3350, eases.inOutCubic);
      cx = lerp(FILTER_X, SANDBOX_X - 20, t);
      cy = lerp(FILTER_Y + 22, SANDBOX_Y, t); // move down into dropdown
      cursorOpacity = 1;
    } else if (ms >= 3400 && ms < 4200) {
      cx = SANDBOX_X - 20;
      cy = SANDBOX_Y;
      cursorOpacity = 1;
    } else if (ms >= 4200) {
      const t = track(ms, 4200, 4800, eases.inCubic);
      cx = lerp(SANDBOX_X - 20, SANDBOX_X - 140, t);
      cy = lerp(SANDBOX_Y, SANDBOX_Y + 30, t);
      cursorOpacity = 1 - track(ms, 4400, 4900, eases.inCubic);
    }

    if (cursorRef.current) {
      cursorRef.current.style.left = `${cx - 16}px`;
      cursorRef.current.style.top = `${cy - 16}px`;
      cursorRef.current.style.opacity = String(cursorOpacity);
    }

    // Click pulse: at 3400ms
    if (cursorPulseRef.current) {
      const clickT = track(ms, 3400, 3700, eases.outCubic);
      const pulseScale = lerp(1, 2.8, clickT);
      const pulseOpacity = 1 - clickT;
      cursorPulseRef.current.style.transform = `translate(-50%, -50%) scale(${pulseScale})`;
      cursorPulseRef.current.style.opacity = ms >= 3400 && ms < 3700 ? String(pulseOpacity) : '0';
    }

    // ── Dropdown: open at 1600ms, close at 3400ms ──
    if (dropdownRef.current) {
      const shouldShow = ms >= 1600 && ms < 3400;
      dropdownRef.current.style.opacity = shouldShow ? '1' : '0';
      dropdownRef.current.style.pointerEvents = shouldShow ? 'auto' : 'none';
      // Scale open animation
      const openT = track(ms, 1600, 1900, eases.outCubic);
      const closeT = track(ms, 3300, 3500, eases.inCubic);
      const scaleY = shouldShow ? lerp(0.3, 1, openT) : lerp(1, 0, closeT);
      dropdownRef.current.style.transform = `scaleY(${scaleY})`;
      dropdownRef.current.style.transformOrigin = 'top right';

      // Highlight Domains when cursor is near top (1600-2200ms)
      const domainsItem = dropdownRef.current.querySelector('#dd-domains') as HTMLElement | null;
      if (domainsItem) {
        domainsItem.style.background = ms >= 1600 && ms < 2400 ? '#1e2e1e' : 'transparent';
        domainsItem.style.color = ms >= 1600 && ms < 2400 ? '#88cc88' : 'white';
      }
      // Highlight Sandbox when cursor is hovering it (2800ms+)
      const sandboxItem = dropdownRef.current.querySelector('#dd-sandbox') as HTMLElement | null;
      if (sandboxItem) {
        sandboxItem.style.background = ms >= 2800 && ms < 3400 ? '#1a2a1a' : 'transparent';
        sandboxItem.style.color = ms >= 2800 && ms < 3400 ? '#66cc66' : 'white';
      }
    }

    // ── Filter button vs input ──
    if (filterBtnRef.current && filterInputRef.current) {
      const activated = ms >= 3400;
      filterBtnRef.current.style.display = activated ? 'none' : 'flex';
      filterInputRef.current.style.display = activated ? 'flex' : 'none';
    }

    // ── Filtered results ──
    if (listContainerRef.current) {
      const showFiltered = ms >= 3500;
      listContainerRef.current.style.opacity = showFiltered ? '1' : '0';
    }
    if (defaultListRef.current) {
      const hideDefault = ms >= 3500;
      defaultListRef.current.style.opacity = hideDefault ? '0' : '1';
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
  ];

  return (
    <Timegroup
      mode="fixed"
      duration="5s"
      onFrame={onFrame as any}
      style={{ position: 'absolute', inset: 0, background: '#141414' }}
    >
      <TraceLayer sceneStartMs={SCENE_START} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* Camera rig — covers full canvas, transforms apply the zoom */}
      <div
        ref={cameraRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          willChange: 'transform',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Browser window */}
          <div style={{
            position: 'absolute',
            left: 60, top: 50, right: 60, bottom: 50,
            background: '#0a0a0a',
            borderRadius: 12,
            border: '1px solid #2a2a2a',
            overflow: 'visible',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 32px 64px rgba(0,0,0,0.8)',
          }}>
            <NavBar />

            <div style={{ flex: 1, overflow: 'hidden', position: 'relative', padding: '24px' }}>
              {/* All Guides header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20,
              }}>
                <h2 style={{ margin: 0, color: 'white', fontSize: 28, fontWeight: 700, fontFamily: 'system-ui' }}>
                  All Guides
                </h2>
                <div style={{ position: 'relative' }}>
                  {/* Filter button (default state) */}
                  <div
                    ref={filterBtnRef}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      border: '1px solid #333',
                      borderRadius: 6,
                      padding: '8px 14px',
                      background: '#111',
                      color: '#888',
                      fontSize: 13,
                      fontFamily: 'system-ui',
                      cursor: 'pointer',
                      width: 220,
                    }}
                  >
                    <svg viewBox="0 0 24 24" style={{ width: 14, height: 14 }} fill="none" stroke="#888" strokeWidth="2">
                      <path d="M4 6H20M7 12H17M10 18H14"/>
                    </svg>
                    <span>Filter Guides by Product</span>
                    <span style={{ marginLeft: 'auto' }}>▾</span>
                  </div>

                  {/* Filter input (after Sandbox selected) */}
                  <div
                    ref={filterInputRef}
                    style={{
                      display: 'none',
                      alignItems: 'center',
                      gap: 8,
                      border: '1px solid #555',
                      borderRadius: 6,
                      padding: '8px 14px',
                      background: '#111',
                      color: 'white',
                      fontSize: 13,
                      fontFamily: 'system-ui',
                      width: 220,
                    }}
                  >
                    <svg viewBox="0 0 24 24" style={{ width: 14, height: 14 }} fill="none" stroke="#888" strokeWidth="2">
                      <path d="M4 6H20M7 12H17M10 18H14"/>
                    </svg>
                    <span style={{ fontWeight: 500 }}>Sandbox</span>
                    <span style={{ marginLeft: 'auto', cursor: 'pointer', color: '#888', fontSize: 12 }}>✕</span>
                  </div>

                  {/* Dropdown */}
                  <div
                    ref={dropdownRef}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 4px)',
                      right: 0,
                      width: 240,
                      background: '#141414',
                      border: '1px solid #333',
                      borderRadius: 8,
                      overflow: 'hidden',
                      zIndex: 100,
                      opacity: 0,
                      boxShadow: '0 12px 32px rgba(0,0,0,0.8)',
                      transformOrigin: 'top right',
                    }}
                  >
                    {[
                      { id: 'dd-domains', label: 'Domains' },
                      { id: 'dd-sandbox', label: 'Sandbox' },
                      { id: 'dd-ai-sdk', label: 'AI SDK' },
                      { id: 'dd-rolling', label: 'Rolling Releases' },
                      { id: 'dd-cli', label: 'CLI' },
                      { id: 'dd-fluid', label: 'Fluid Compute' },
                    ].map((item) => (
                      <div
                        key={item.id}
                        id={item.id}
                        style={{
                          padding: '11px 16px',
                          color: 'white',
                          fontSize: 14,
                          fontFamily: 'system-ui',
                          borderBottom: '1px solid #222',
                          cursor: 'pointer',
                          transition: 'background 0.12s, color 0.12s',
                        }}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: '#1e1e1e', marginBottom: 0 }} />

              {/* Default list — hidden after filter applied */}
              <div ref={defaultListRef} style={{ transition: 'opacity 0.3s' }}>
                {allGuidesRows.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 0',
                    borderBottom: '1px solid #1e1e1e',
                  }}>
                    <span style={{ color: 'white', fontSize: 14, fontFamily: 'system-ui', fontWeight: 500 }}>{item.title}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {item.tags.map((tag, ti) => (
                        <span key={ti} style={{
                          color: '#888', fontSize: 12, fontFamily: 'system-ui',
                          border: '1px solid #333', padding: '3px 8px', borderRadius: 4,
                          background: '#111',
                        }}>{tag}</span>
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
                  top: 108,
                  left: 24,
                  right: 24,
                  opacity: 0,
                  transition: 'opacity 0.25s',
                }}
              >
                {sandboxResults.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 0',
                    borderBottom: '1px solid #1e1e1e',
                  }}>
                    <span style={{ color: 'white', fontSize: 16, fontFamily: 'system-ui', fontWeight: 500 }}>{item.title}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {item.tags.map((tag, ti) => (
                        <span key={ti} style={{
                          color: '#888', fontSize: 12, fontFamily: 'system-ui',
                          border: '1px solid #333', padding: '4px 10px', borderRadius: 4,
                          background: '#111',
                        }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Orb cursor — gray circle indicator floating on the canvas */}
        <div
          ref={cursorRef}
          style={{
            position: 'absolute',
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(200, 200, 200, 0.85)',
            border: '2px solid rgba(255,255,255,0.6)',
            boxShadow: '0 0 12px rgba(255,255,255,0.3)',
            opacity: 0,
            zIndex: 50,
            pointerEvents: 'none',
            left: 1910,
            top: 110,
            willChange: 'transform, opacity',
          }}
        />

        {/* Click pulse ring */}
        <div
          ref={cursorPulseRef}
          style={{
            position: 'absolute',
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '2px solid rgba(100, 220, 100, 0.8)',
            opacity: 0,
            zIndex: 49,
            pointerEvents: 'none',
            left: 1706,
            top: 216,
            transform: 'translate(-50%, -50%)',
            willChange: 'transform, opacity',
          }}
        />
      </div>
    </Timegroup>
  );
};

Scene3_FilterDropdown.duration = DURATION;
