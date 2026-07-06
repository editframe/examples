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
import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { TraceLayer } from "../components/TraceLayer";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";

const DURATION = 1500;
const START_MASTER = 23000; // Scene7 ends at 21000+2000=23000ms

export function Scene8_CubeLogo() {
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
          style={{
            transformOrigin: "center center",
            animation: [
              "fade-in 600ms linear both",
              "scene8-cube-scale-in 700ms cubic-bezier(0.33,1,0.68,1) both",
            ].join(", "),
          }}
        >
          {/* User-supplied Cursor logo PNG (CURSOR LOGO.png from Downloads) */}
          <Image
            src="/assets/cursor-logo.png"
            alt="Cursor"
            width={SIZE}
            height={SIZE}
            style={{ display: "block", width: SIZE, height: SIZE, objectFit: "contain" }}
          />
        </div>
      </div>

      <TraceLayer sceneStartMs={START_MASTER} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />
    </Timegroup>
  );
}

Scene8_CubeLogo.duration = DURATION;
