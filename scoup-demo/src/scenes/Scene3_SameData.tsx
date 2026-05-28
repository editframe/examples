import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import gsap from "gsap";
import { eases } from "animejs";
import { PaperBackground } from "../components/PaperBackground";
import { Sfx } from "../components/Sfx";

// The actual Scoup dashboard from the deck (deck slide 12 — `what is scoup 2.png`)
import dashboardSrc from "../assets/scoup-dashboard.png?inline";

/**
 * Scene 3 — Same Story. Two Lenses. (5s)
 *
 * Uses the ACTUAL Scoup dashboard asset from the deck. Starts flat / 2D,
 * then tilts into a 3D wireframe perspective (like Jeremy's launch video).
 * As the tilt completes, a copy of the dashboard duplicates and splits in
 * 3D space — one tinted DEMOCRAT blue, one tinted PRO-TRUMP red — to
 * demonstrate "same story, different reads."
 *
 * Animation libs:
 *   GSAP — gsap.utils.interpolate for the wireframe-grid overlay opacity curve
 *   AnimeJS easings — outQuart shapes the 3D tilt and the split
 *   Advanced CSS — perspective + rotateX/rotateY for true 3D, blend modes
 *                  for the persona tint, layered dashboards in 3D space
 *
 * Beat (ms):
 *   0–700        Title fades in
 *   500–1700     Dashboard fades + scales in (flat, 2D)
 *   1700–2700    Wireframe grid lays over + 3D perspective tilt begins
 *   2700–4000    Dashboard splits — Dem copy slides left, Pro copy slides right
 *   3500–4900    Persona labels + tags fade in beside each copy
 */

const clamp = (n: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const track = (
  ms: number,
  startMs: number,
  endMs: number,
  easeFn: (t: number) => number = eases.outCubic
) => easeFn(clamp((ms - startMs) / (endMs - startMs)));

export const Scene3_SameData: React.FC = () => {
  const labelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const demRef = useRef<HTMLDivElement>(null);
  const proRef = useRef<HTMLDivElement>(null);
  const demLabelRef = useRef<HTMLDivElement>(null);
  const proLabelRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;

      // Title
      const lP = track(ms, 0, 700, eases.outQuart);
      if (labelRef.current) {
        labelRef.current.style.opacity = String(lP);
        labelRef.current.style.transform = `translateY(${lerp(-12, 0, lP)}px)`;
      }
      const tP = track(ms, 200, 900, eases.outQuart);
      if (titleRef.current) {
        titleRef.current.style.opacity = String(tP);
        titleRef.current.style.transform = `translateY(${lerp(-18, 0, tP)}px)`;
      }

      // Base dashboard fade + scale in
      const dashIn = track(ms, 500, 1700, eases.outCubic);
      if (baseRef.current) {
        baseRef.current.style.opacity = String(dashIn);
      }

      // Wireframe grid overlay reveals 1700–2400
      const gridP = track(ms, 1700, 2500, eases.outQuart);
      // Use GSAP utility to drive the opacity smoothly
      const gridOpacity = gsap.utils.interpolate(0, 0.45, gridP);
      if (gridRef.current) {
        gridRef.current.style.opacity = String(gridOpacity);
      }

      // 3D tilt — perspective grows from 0 over time, base rotates -18° X / 22° Y
      const tiltP = track(ms, 1700, 2900, eases.outQuart);
      if (stageRef.current) {
        const rotX = lerp(0, -18, tiltP);
        const rotY = lerp(0, 22, tiltP);
        const scale = lerp(1, 0.85, tiltP);
        stageRef.current.style.transform = `perspective(1600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
      }

      // Split: Dem clone slides left (back), Pro clone slides right (forward)
      const splitP = track(ms, 2700, 4000, eases.outCubic);
      if (demRef.current) {
        demRef.current.style.opacity = String(splitP);
        const tx = lerp(0, -380, splitP);
        const tz = lerp(0, -120, splitP);
        demRef.current.style.transform = `translate(-50%, -50%) translate3d(${tx}px, 0, ${tz}px) rotateY(8deg)`;
      }
      if (proRef.current) {
        proRef.current.style.opacity = String(splitP);
        const tx = lerp(0, 380, splitP);
        const tz = lerp(0, 80, splitP);
        proRef.current.style.transform = `translate(-50%, -50%) translate3d(${tx}px, 0, ${tz}px) rotateY(-8deg)`;
      }
      // Original fades out as splits become primary
      if (baseRef.current) {
        baseRef.current.style.opacity = String(dashIn * (1 - splitP * 0.7));
      }

      // Persona labels
      const labP = track(ms, 3500, 4500, eases.outQuart);
      if (demLabelRef.current) {
        demLabelRef.current.style.opacity = String(labP);
        demLabelRef.current.style.transform = `translateY(${lerp(8, 0, labP)}px)`;
      }
      if (proLabelRef.current) {
        proLabelRef.current.style.opacity = String(labP);
        proLabelRef.current.style.transform = `translateY(${lerp(8, 0, labP)}px)`;
      }
    },
    []
  );

  return (
    <Timegroup
      mode="fixed"
      duration="5s"
      onFrame={handleFrame as any}
      className="absolute inset-0 flex items-center justify-center"
    >
      <PaperBackground />

      {/* SFX cues */}
      <Sfx cue="confirm" at={0.45} dur={0.9} volume={0.4} />
      <Sfx cue="glitch-short" at={1.70} dur={0.8} volume={0.55} />
      <Sfx cue="disappear" at={2.75} dur={0.8} volume={0.55} />
      <Sfx cue="ping" at={3.55} dur={0.9} volume={0.4} />

      {/* TITLE — top, editorial */}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 0,
          right: 0,
          textAlign: "center",
          padding: "0 80px",
          zIndex: 30,
        }}
      >
        <div
          className="scene-label"
          ref={labelRef}
          style={{
            color: "#191918",
            opacity: 0,
            marginBottom: 12,
          }}
        >
          Part 03 · The Read
        </div>
        <div
          ref={titleRef}
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 68,
            fontWeight: 900,
            letterSpacing: "-0.028em",
            color: "#191918",
            lineHeight: 1.05,
            opacity: 0,
          }}
        >
          Same story. <span className="yellow-underline">Two lenses.</span>
        </div>
      </div>

      {/* 3D STAGE */}
      <div
        ref={stageRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "60%",
          width: 1,
          height: 1,
          transformStyle: "preserve-3d" as any,
          transform: "perspective(1600px) rotateX(0deg) rotateY(0deg)",
        }}
      >
        {/* BASE dashboard (the actual deck asset) */}
        <div
          ref={baseRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 1000,
            height: 560,
            borderRadius: 12,
            overflow: "hidden",
            background: "#FFFFFF",
            boxShadow: "0 30px 80px -16px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.05)",
            opacity: 0,
          }}
        >
          <img
            src={dashboardSrc}
            alt="Scoup dashboard"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top left",
              display: "block",
            }}
          />

          {/* Wireframe grid overlay */}
          <div
            ref={gridRef}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              pointerEvents: "none",
              backgroundImage:
                "linear-gradient(rgba(245,197,24,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(245,197,24,0.55) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              mixBlendMode: "multiply" as any,
            }}
          />
        </div>

        {/* DEM CLONE — back-left, blue-tinted */}
        <div
          ref={demRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            height: 450,
            borderRadius: 12,
            overflow: "hidden",
            background: "#FFFFFF",
            boxShadow: "0 30px 70px -14px rgba(0,0,0,0.35), 0 0 0 1px rgba(79,195,247,0.4)",
            opacity: 0,
          }}
        >
          <img
            src={dashboardSrc}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top left",
              filter: "saturate(0.6) sepia(0.05)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(79,195,247,0.18)",
              mixBlendMode: "multiply" as any,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(79,195,247,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(79,195,247,0.35) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              mixBlendMode: "multiply" as any,
              pointerEvents: "none",
            }}
          />
        </div>

        {/* PRO CLONE — front-right, red-tinted */}
        <div
          ref={proRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            height: 450,
            borderRadius: 12,
            overflow: "hidden",
            background: "#FFFFFF",
            boxShadow: "0 30px 70px -14px rgba(0,0,0,0.35), 0 0 0 1px rgba(240,98,146,0.4)",
            opacity: 0,
          }}
        >
          <img
            src={dashboardSrc}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top left",
              filter: "saturate(0.6) sepia(0.05)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(240,98,146,0.18)",
              mixBlendMode: "multiply" as any,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(240,98,146,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(240,98,146,0.35) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              mixBlendMode: "multiply" as any,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* Persona labels — drawn on the non-3D paper layer for legibility */}
      <div
        ref={demLabelRef}
        style={{
          position: "absolute",
          left: 200,
          top: "82%",
          opacity: 0,
          zIndex: 40,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 999,
            background: "rgba(79,195,247,0.12)",
            border: "1.5px solid rgba(79,195,247,0.55)",
            color: "#1976B4",
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: 999,
              background: "#1976B4",
            }}
          />
          Persona · Democrat
        </div>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: "#191918",
            letterSpacing: "-0.005em",
            maxWidth: 360,
          }}
        >
          "Constitutional crisis. Coalition fracture."
        </div>
      </div>

      <div
        ref={proLabelRef}
        style={{
          position: "absolute",
          right: 200,
          top: "82%",
          opacity: 0,
          zIndex: 40,
          textAlign: "right",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 999,
            background: "rgba(240,98,146,0.12)",
            border: "1.5px solid rgba(240,98,146,0.55)",
            color: "#C13072",
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: 999,
              background: "#C13072",
            }}
          />
          Persona · Pro-Trump
        </div>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: "#191918",
            letterSpacing: "-0.005em",
            maxWidth: 360,
            marginLeft: "auto",
          }}
        >
          "Decisive action. Restored strength."
        </div>
      </div>
    </Timegroup>
  );
};
