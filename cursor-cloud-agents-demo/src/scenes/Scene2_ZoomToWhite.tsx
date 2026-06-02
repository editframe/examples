/**
 * Scene 2 — Camera zooms INTO chatbox → bg transitions to pure white
 * Duration: 2000ms
 * The chatbox panel scales up from 1 → ~4, centered on panel center.
 * Simultaneously a white overlay fades in, so by end the frame is white.
 */
import React, { useRef, useCallback } from "react";
import { Timegroup } from "@editframe/react";
import { track, lerp } from "../components/helpers";
import { TraceLayer } from "../components/TraceLayer";
import { TRACE_MODE } from "../constants";
import { tealAmberGradient } from "../assets/gradient-bg";
import { eases } from "animejs";

const DURATION = 2000;
const START_MASTER = 2500;

export function Scene2_ZoomToWhite() {
  const bgRef = useRef<HTMLImageElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const whiteOverlayRef = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // Zoom: scale 1 → 4.5, ease in (accelerating)
    const zoomT = eases.inCubic(Math.max(0, Math.min(1, ms / DURATION)));
    const scale = lerp(1, 4.5, zoomT);

    if (panelRef.current) {
      panelRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }

    // White overlay: starts fading at 600ms, fully opaque by 1800ms
    const whiteT = track(ms, 600, 1800);
    if (whiteOverlayRef.current) {
      whiteOverlayRef.current.style.opacity = String(lerp(0, 1, whiteT));
    }

    // BG fades out quickly
    const bgFade = track(ms, 0, 800);
    if (bgRef.current) {
      bgRef.current.style.opacity = String(lerp(1, 0, bgFade));
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration="2s"
      onFrame={onFrame as any}
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0, width: 1920, height: 1080 }}
    >
      {/* Teal-amber bg (fades out) */}
      {!TRACE_MODE && (
        <img
          ref={bgRef}
          src={tealAmberGradient}
          style={{
            position: "absolute",
            inset: 0,
            width: 1920,
            height: 1080,
            objectFit: "cover",
            zIndex: 1,
          }}
        />
      )}

      {/* Chatbox panel that zooms to fill frame */}
      <div
        ref={panelRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%) scale(1)",
          transformOrigin: "center center",
          width: 1100,
          height: 600,
          background: "#FFFFFF",
          borderRadius: 20,
          boxShadow: "0 32px 80px rgba(0,0,0,0.22)",
          zIndex: 10,
          overflow: "hidden",
        }}
      >
        {/* URL bar */}
        <div
          style={{
            height: 44,
            background: "#F7F7F7",
            borderBottom: "1px solid #E8E8E8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "absolute", left: 16, display: "flex", gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27C840" }} />
          </div>
          <div style={{ background: "#EEEEEE", borderRadius: 8, padding: "4px 20px", fontSize: 13, color: "#555", fontFamily: "system-ui, sans-serif" }}>
            cursor.com/agents
          </div>
        </div>
        {/* Panel interior — white fills as zoom progresses */}
        <div style={{ padding: "28px 40px", fontFamily: "system-ui, sans-serif" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
            <div style={{ background: "#F5F5F5", border: "1px solid #E0E0E0", borderRadius: 10, padding: "10px 18px", fontSize: 15, color: "#1A1A1A", fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2h6l2 2h4v10H2V2z" stroke="#555" strokeWidth="1.2" fill="none"/>
              </svg>
              anysphere/core-ui
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 5l4 4 4-4" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ background: "#F5F5F5", border: "1px solid #E0E0E0", borderRadius: 10, padding: "10px 16px", fontSize: 15, color: "#1A1A1A", display: "flex", alignItems: "center", gap: 6 }}>
              main
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 5l4 4 4-4" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <div style={{ background: "#FAFAFA", border: "1.5px solid #E4E4E4", borderRadius: 14, padding: "20px 24px" }}>
            <div style={{ fontSize: 17, color: "#AAAAAA", marginBottom: 60 }}>
              Build, fix, explore your codebase...
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{ background: "#FFFFFF", border: "1px solid #E0E0E0", borderRadius: 8, padding: "7px 14px", fontSize: 13, color: "#333", display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="12" height="12" rx="3" fill="#000"/>
                  <path d="M4 7h6M7 4v6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Composer 2
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* White overlay — grows from 0 → 1 opacity, covering the zooming panel */}
      <div
        ref={whiteOverlayRef}
        style={{
          position: "absolute",
          inset: 0,
          background: "#FFFFFF",
          zIndex: 50,
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      <TraceLayer sceneStartMs={START_MASTER} enabled={TRACE_MODE} opacity={0.4} />
    </Timegroup>
  );
}

Scene2_ZoomToWhite.duration = DURATION;
