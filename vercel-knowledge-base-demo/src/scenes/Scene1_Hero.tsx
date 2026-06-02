/**
 * Scene 1 — HUGE "Knowledge Base" hero + template category cards revealing below
 * Master: 0–2500ms
 *
 * Frame 0s: Dark bg, "Knowledge Base" in massive white bold font, close-up (scale ~1.4).
 *   Subtitle in gray below it. Bottom half shows 3 columns of cards with framework icons.
 * Frame 1s: Camera begins ZOOM-OUT — scale 1.4 → 0.72 over 1500ms (easeInOutCubic)
 *   Revealing the FULL VERCEL BROWSER PANEL framing:
 *   - Vercel nav bar at top
 *   - Large bordered card containing "Knowledge Base" + subtitle (hero, now smaller, inside card)
 *   - Below hero card: 3 category cards in a row (AI / Backend / Security)
 * Frame 2.5s: Scene ends, full browser panel visible at scale 0.72
 *
 * NOTE: User said Scene 1 was "captured perfectly" — keep the hero visual.
 * FIX 2: at t=1000ms, camera begins ZOOM-OUT from close-up hero to wider browser panel.
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { track, lerp } from "../components/helpers";
import { eases } from "animejs";

const DURATION = 2500;
const SCENE_START = 0;

// Zoom-out timing constants
const ZOOM_OUT_START = 1000;
const ZOOM_OUT_END = 2500;

export function Scene1_Hero() {
  const cameraRef = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // FIX 2: At t=1000ms, zoom-out begins. scale 1.4 → 0.72 (reveals full browser panel)
    // Before 1000ms: scale stays at 1.4 (close-up hero)
    const zoomT = track(ms, ZOOM_OUT_START, ZOOM_OUT_END, eases.inOutCubic);
    const scale = lerp(1.4, 0.72, zoomT);

    if (cameraRef.current) {
      cameraRef.current.style.transform = `scale(${scale})`;
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration="2.5s"
      onFrame={onFrame as any}
      style={{ position: 'absolute', inset: 0, background: '#141414' }}
    >
      {/* Trace layer */}
      <TraceLayer sceneStartMs={SCENE_START} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* Content — z-index 1+ above trace */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        {/* Camera zoom container — transform-origin center */}
        <div
          ref={cameraRef}
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: '50% 50%',
            willChange: 'transform',
          }}
        >
          {/* Full browser window panel — this is the "bigger panel" revealed by zoom-out */}
          <div style={{
            position: 'absolute',
            left: 60, top: 50, right: 60, bottom: 50,
            background: '#0a0a0a',
            borderRadius: 12,
            border: '1px solid #2a2a2a',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 32px 64px rgba(0,0,0,0.8)',
          }}>
            {/* Vercel Nav Bar */}
            <div style={{
              height: 52,
              background: '#0a0a0a',
              borderBottom: '1px solid #1e1e1e',
              display: 'flex',
              alignItems: 'center',
              padding: '0 28px',
              gap: 28,
              flexShrink: 0,
            }}>
              {/* Vercel logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18 }} fill="white">
                  <path d="M12 2L2 19.5H22L12 2Z"/>
                </svg>
                <span style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: "'Geist', system-ui" }}>Vercel</span>
              </div>
              {/* Nav links */}
              <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
                {['Products ▾', 'Resources ▾', 'Solutions ▾', 'Enterprise', 'Docs', 'Pricing'].map((item, i) => (
                  <span key={i} style={{
                    color: i === 1 ? 'white' : '#666',
                    fontSize: 12,
                    fontFamily: "'Geist', system-ui",
                    ...(i === 1 ? { background: '#1e1e1e', padding: '3px 9px', borderRadius: 5, border: '1px solid #333' } : {}),
                  }}>{item}</span>
                ))}
              </div>
              {/* Right side */}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ padding: '5px 12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 5, color: 'white', fontSize: 12, fontFamily: 'system-ui' }}>Ask AI</div>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#333', border: '1px solid #444' }} />
              </div>
            </div>

            {/* Page content */}
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>

              {/* Knowledge Base hero card — large bordered card containing the hero */}
              <div style={{
                margin: '0 0',
                padding: '48px 0 52px',
                borderBottom: '1px solid #1e1e1e',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#000',
              }}>
                <h1 style={{
                  margin: 0,
                  fontSize: 120,
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
                  margin: '18px 0 0',
                  fontSize: 20,
                  fontWeight: 400,
                  color: '#666',
                  fontFamily: "'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  textAlign: 'center',
                  letterSpacing: '-0.2px',
                  maxWidth: 680,
                }}>
                  In-depth guides, tutorials, and explainers for best practices with Vercel.
                </p>
              </div>

              {/* Category cards row — AI / Backend / Security */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                borderBottom: '1px solid #1e1e1e',
              }}>
                {/* AI card */}
                <div style={{ borderRight: '1px solid #1e1e1e', padding: 0, overflow: 'hidden' }}>
                  <div style={{ height: 120, background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #1e1e1e', gap: 10 }}>
                    {/* Bolt icon */}
                    <svg viewBox="0 0 24 24" style={{ width: 36, height: 36 }}>
                      <defs>
                        <linearGradient id="s1-bolt1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8b5cf6"/>
                          <stop offset="100%" stopColor="#06b6d4"/>
                        </linearGradient>
                      </defs>
                      <path d="M13 2L4 14H11L9 22L20 10H13L13 2Z" fill="url(#s1-bolt1)"/>
                    </svg>
                    {/* Next N */}
                    <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'white', fontSize: 16, fontWeight: 700, fontFamily: 'Arial' }}>N</span>
                    </div>
                    {/* Svelte */}
                    <svg viewBox="0 0 24 24" style={{ width: 32, height: 32 }} fill="#ff3e00">
                      <path d="M20.6 3.2C18.9 1.3 16 0.9 14 2.2L7 7C5.1 8.3 4.5 10.8 5.5 12.8C4.8 13.5 4.3 14.5 4.3 15.5C4.3 17.8 6.1 19.7 8.4 19.7C8.7 19.7 9 19.7 9.3 19.6L15 16C16.9 14.8 17.7 12.4 17 10.3C17.7 9.6 18.2 8.6 18.2 7.5C18.1 5.3 16.4 3.5 14.1 3.4"/>
                    </svg>
                  </div>
                  <div style={{ padding: '16px 20px' }}>
                    <div style={{ color: 'white', fontSize: 16, fontWeight: 600, fontFamily: 'system-ui', marginBottom: 6 }}>AI</div>
                    <div style={{ color: '#555', fontSize: 12, fontFamily: 'system-ui', lineHeight: 1.5 }}>Build AI-powered applications using Vercel's AI Cloud features and SDKs.</div>
                  </div>
                </div>

                {/* Backend card */}
                <div style={{ borderRight: '1px solid #1e1e1e', padding: 0, overflow: 'hidden' }}>
                  <div style={{ height: 120, background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #1e1e1e', gap: 10 }}>
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

                {/* Security card */}
                <div style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ height: 120, background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #1e1e1e' }}>
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

              {/* Search bar */}
              <div style={{ padding: '20px 28px', borderBottom: '1px solid #1e1e1e' }}>
                <div style={{
                  background: '#111',
                  border: '1px solid #2a2a2a',
                  borderRadius: 8,
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  maxWidth: 480,
                  margin: '0 auto',
                }}>
                  <span style={{ color: '#444', fontSize: 13, fontFamily: 'system-ui' }}>Search Knowledge Base</span>
                  <span style={{ color: '#333', fontSize: 11, fontFamily: 'system-ui', border: '1px solid #2a2a2a', padding: '2px 6px', borderRadius: 4 }}>⌘K</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Timegroup>
  );
};

Scene1_Hero.duration = DURATION;
