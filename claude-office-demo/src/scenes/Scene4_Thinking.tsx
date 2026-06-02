/**
 * Scene4_Thinking — 3000ms
 * Master timeline: 14000ms → 17000ms
 *
 * FIX 7:
 *   - Asterisk PULSES: scale 1.0 → 1.08 → 1.0 over ~1200ms, looping
 *   - "Thinking..." text has SHIMMER SHINE that glides L→R over ~1500ms, looping
 *   - Shine is a white-to-transparent gradient overlay that translateX -100% → 100%
 *   - Asterisk: 8 thick spokes (not sea-urchin), coral #D97757
 *
 * Scene timeline:
 *   0ms:      Slides in from RIGHT
 *   600ms:    Full opacity, hold
 *   2400ms:   Fade out
 *   3000ms:   End
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { CreamBackdrop } from "../components/CreamBackdrop";
import { TraceLayer } from "../components/TraceLayer";
import { track, lerp } from "../components/helpers";
import { eases } from "animejs";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";

const DURATION_MS = 3000;
const SCENE_START_MASTER = 14500; // Scene1(5000) + Scene2(3000) + Scene3(6500) = 14500

const ASTERISK_SPOKES = 8;
const ASTERISK_SIZE = 130;

const SLIDE_IN_START = 0;
const SLIDE_IN_END   = 600;
const FADE_OUT_START = 2400;
const FADE_OUT_END   = 3000;

// FIX 7: Pulse period 1200ms
const PULSE_PERIOD_MS = 1200;
// FIX 5: Shimmer sweeps faster — 1400ms period, brighter band
const SHIMMER_PERIOD_MS = 1400;

export function Scene4_Thinking() {
  const slideWrapRef = useRef<HTMLDivElement>(null);
  const asteriskRef  = useRef<HTMLCanvasElement>(null);
  const opacityRef   = useRef<HTMLDivElement>(null);
  const shimmerRef   = useRef<HTMLDivElement>(null);
  const asteriskWrapRef = useRef<HTMLDivElement>(null);

  const drawAsterisk = useCallback((canvas: HTMLCanvasElement, rotDeg: number, bloomP: number) => {
    const size = ASTERISK_SIZE;
    const dpr = 2;
    const s = size * dpr;
    canvas.width = s;
    canvas.height = s;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, s, s);

    const cx = s / 2;
    const cy = s / 2;
    const spokeLen = (s / 2) * bloomP * 0.80;
    const strokeW = Math.max(6, s * 0.095); // thick spokes
    const dotR = s * 0.11;
    const color = "#D97757";

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((rotDeg * Math.PI) / 180);
    ctx.translate(-cx, -cy);

    ctx.beginPath();
    ctx.arc(cx, cy, dotR, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.strokeStyle = color;
    ctx.lineWidth = strokeW;
    ctx.lineCap = "round";
    for (let i = 0; i < ASTERISK_SPOKES; i++) {
      const angle = (i * Math.PI * 2) / ASTERISK_SPOKES;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * spokeLen, cy + Math.sin(angle) * spokeLen);
      ctx.stroke();
    }
    ctx.restore();
  }, []);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // Slide in from right
    const slideP = track(ms, SLIDE_IN_START, SLIDE_IN_END, eases.outCubic);
    const slideTX = lerp(1920, 0, slideP);
    if (slideWrapRef.current) {
      slideWrapRef.current.style.transform = `translateX(${slideTX}px)`;
    }

    // Fade out at end
    const fadeOut = track(ms, FADE_OUT_START, FADE_OUT_END, eases.inCubic);
    if (opacityRef.current) {
      opacityRef.current.style.opacity = String(1 - fadeOut);
    }

    // Asterisk rotation
    const rotDeg = (ms * (360 / 1500)) % 360;
    const bloomP = 0.72 + 0.28 * ((Math.sin((ms / 900) * Math.PI * 2) + 1) / 2);

    if (asteriskRef.current) {
      drawAsterisk(asteriskRef.current, rotDeg, bloomP);
    }

    // FIX 7: ASTERISK PULSE — scale 1.0 → 1.08 → 1.0 over PULSE_PERIOD_MS
    if (asteriskWrapRef.current) {
      const pulseT = (ms % PULSE_PERIOD_MS) / PULSE_PERIOD_MS; // 0→1 cycle
      // sin wave: 0 at start/end, peak at 0.5
      const pulseScale = 1.0 + 0.08 * Math.sin(pulseT * Math.PI * 2);
      asteriskWrapRef.current.style.transform = `scale(${pulseScale})`;
    }

    // FIX 7: SHIMMER SHINE — horizontal white gradient sweeps L→R
    // translateX cycles from -120% to +120% over SHIMMER_PERIOD_MS
    if (shimmerRef.current) {
      const shimmerT = (ms % SHIMMER_PERIOD_MS) / SHIMMER_PERIOD_MS; // 0→1 cycle
      // Map 0→1 to -120% → +120% translateX
      const shimmerTX = lerp(-120, 120, shimmerT);
      shimmerRef.current.style.transform = `translateX(${shimmerTX}%)`;
    }
  }, [drawAsterisk]);

  return (
    <Timegroup
      mode="fixed"
      duration={`${DURATION_MS}ms`}
      onFrame={onFrame as any}
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0, width: 1920, height: 1080 }}
    >
      <TraceLayer sceneStartMs={SCENE_START_MASTER} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />
      <CreamBackdrop variant="light" />

      {/* Warm radial bg */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "radial-gradient(ellipse 800px 600px at 960px 500px, rgba(255,200,160,0.22) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* Opacity wrapper */}
      <div ref={opacityRef} style={{ position: "absolute", inset: 0, zIndex: 5, willChange: "opacity" }}>
        {/* Slide-in wrapper */}
        <div
          ref={slideWrapRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            willChange: "transform",
          }}
        >
          {/*
            FIX 5: Wrap the ENTIRE lockup (asterisk + text) in a position:relative
            overflow:hidden container so the shimmer sweeps BOTH elements.
          */}
          <div style={{
            position: "relative",
            overflow: "hidden",
            display: "inline-flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 44,
            padding: "0 20px", // extra padding so shimmer doesn't clip at edges
          }}>
            {/* Asterisk with PULSE wrapper */}
            <div
              ref={asteriskWrapRef}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                willChange: "transform",
                position: "relative",
                zIndex: 1,
              }}
            >
              <canvas
                ref={asteriskRef}
                width={ASTERISK_SIZE * 2}
                height={ASTERISK_SIZE * 2}
                style={{
                  width: ASTERISK_SIZE,
                  height: ASTERISK_SIZE,
                  display: "block",
                }}
              />
            </div>

            {/* "Thinking..." text */}
            <div style={{
              fontFamily: "'Inter', 'Helvetica Neue', system-ui, sans-serif",
              fontSize: 105,
              fontWeight: 400,
              color: "#3A3A3A",
              letterSpacing: "-1.5px",
              lineHeight: 1,
              whiteSpace: "nowrap",
              position: "relative",
              zIndex: 1,
            }}>
              Thinking...
            </div>

            {/*
              FIX 5: Shimmer now covers the WHOLE lockup (asterisk + text).
              Brighter band (0.70 peak), wider (50%), faster (1400ms period).
              Sweeps from left edge of asterisk to right edge of text.
            */}
            <div
              ref={shimmerRef}
              style={{
                position: "absolute",
                top: "-10%",
                left: 0,
                width: "50%",
                height: "120%",
                background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.70) 50%, transparent 80%)",
                pointerEvents: "none",
                zIndex: 2,
                willChange: "transform",
                transform: "translateX(-130%)",
              }}
            />
          </div>
        </div>
      </div>
    </Timegroup>
  );
}

Scene4_Thinking.duration = DURATION_MS;
