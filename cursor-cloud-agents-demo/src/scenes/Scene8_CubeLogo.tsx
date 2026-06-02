/**
 * Scene 8 — Cursor cube logo outro
 * Duration: 1500ms
 *
 * REFERENCE: solid black isometric cube, centered, ~200-240px
 * Top face: polygon points="50,8 88,30 50,50 12,30"
 * Left face: polygon points="12,30 50,50 50,92 12,70"
 * Right face: polygon points="88,30 88,70 50,92 50,50" (slightly darker)
 * White triangle on TOP face only: points="12,30 88,30 50,50" (apex at center of top face)
 * White background, smooth scale+fade entrance
 */
import React, { useRef, useCallback } from "react";
import { Timegroup } from "@editframe/react";
import { lerp, clamp } from "../components/helpers";
import { TraceLayer } from "../components/TraceLayer";
import { TRACE_MODE } from "../constants";
import { cursorLogoDataUri } from "../assets/cursor-logo";

const DURATION = 1500;
const START_MASTER = 23000; // Scene7 ends at 21000+2000=23000ms

export function Scene8_CubeLogo() {
  const cubeRef = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    const fadeT = clamp(ms / 600);
    const scaleT = clamp(ms / 700);
    const scaleE = 1 - Math.pow(1 - scaleT, 3);
    if (cubeRef.current) {
      cubeRef.current.style.opacity = String(lerp(0, 1, fadeT));
      cubeRef.current.style.transform = `scale(${lerp(0.8, 1, scaleE)})`;
    }
  }, []);

  // Cursor isometric cube — verified-correct geometry
  // viewBox is 100x100 for easy percentage points
  // Top face: 50,8 → 88,30 → 50,50 → 12,30 (diamond)
  // Left face: 12,30 → 50,50 → 50,92 → 12,70
  // Right face: 88,30 → 88,70 → 50,92 → 50,50
  // White triangle on top face: 12,30 → 88,30 → 50,50 (front edge of top face, apex down at center)

  const SIZE = 220; // rendered size in px

  return (
    <Timegroup
      mode="fixed"
      duration="1.5s"
      onFrame={onFrame as any}
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0, width: 1920, height: 1080 }}
    >
      {/* White background */}
      {!TRACE_MODE && (
        <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", zIndex: 1 }} />
      )}

      {/* Centered cube */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <div
          ref={cubeRef}
          style={{
            opacity: 0,
            transformOrigin: "center center",
          }}
        >
          {/* User-supplied Cursor logo PNG (CURSOR LOGO.png from Downloads) */}
          <img
            src={cursorLogoDataUri}
            alt="Cursor"
            width={SIZE}
            height={SIZE}
            style={{ display: "block", width: SIZE, height: SIZE, objectFit: "contain" }}
          />
        </div>
      </div>

      <TraceLayer sceneStartMs={START_MASTER} enabled={TRACE_MODE} opacity={0.4} />
    </Timegroup>
  );
}

Scene8_CubeLogo.duration = DURATION;
