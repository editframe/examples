/**
 * Scene 1 — Hand + Network (0–6500ms)
 * Uses hand.png as actual <img> — base64 inlined.
 * hand.png IS the complete visual: cursive hand + coral ball + coral wireframe network above.
 * No separate SVG network — the image contains the full design.
 * Animation: fade in + gentle scale pulse + subtle float.
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TraceLayer } from "../components/TraceLayer";
import { track, lerp } from "../components/helpers";
import { handB64 } from "../assets/images";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { eases } from "animejs";

export const SCENE1_DURATION = 6500;

export function Scene1_Hand(): React.ReactElement {
  const handRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // --- Fade in + scale up from 0.92 to 1.0 over first 1200ms ---
    const inT = track(ms, 0, 1200, eases.outCubic);
    if (handRef.current) {
      handRef.current.style.opacity = String(inT);
    }

    // --- Gentle float: image bobs slightly after fully in ---
    if (wrapperRef.current) {
      const breathPhase = Math.max(0, ms - 800);
      const floatY = Math.sin((breathPhase / 2200) * Math.PI * 2) * 8;
      const scale = lerp(0.92, 1.0, inT);
      wrapperRef.current.style.transform = `scale(${scale}) translateY(${floatY}px)`;
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE1_DURATION}ms`}
      onFrame={onFrame as any}
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0, width: 1920, height: 1080, overflow: "hidden" }}
    >
      <TraceLayer sceneStartMs={0} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* Background */}
      {!TRACE_MODE && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#EAE8DE",
            zIndex: 1,
          }}
        />
      )}

      {/* Hand image — centered in frame, large and prominent */}
      <div
        ref={wrapperRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transformOrigin: "center center",
        }}
      >
        <img
          ref={handRef}
          src={handB64}
          alt="hand with coral network"
          style={{
            width: 760,
            height: 760,
            objectFit: "contain",
            opacity: 0,
          }}
        />
      </div>
    </Timegroup>
  );
}

Scene1_Hand.duration = SCENE1_DURATION;
