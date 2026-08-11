/**
 * ManagedAgents — "Or deploy them as Managed Agents" on a persistent coral background.
 *
 *   - Background: #D87757 coral — PERSISTS through entire scene, and into the next
 *     scene (ArqosDashboard also opens on coral), so there is no crossfade needed at
 *     that boundary — see ArqosDashboard.tsx.
 *   - This scene's own INCOMING boundary is the one place in the whole composition
 *     where the background color actually changes (cream → coral), so its bg gets an
 *     explicit `mg-bg-in` fade over the sequence's own overlap window instead of
 *     hard-cutting in a beat early.
 *   - Text fades + floats in, then fades out (`Reveal`).
 *
 * Local-ms constants are this scene's OWN clock (already shifted +OVERLAP_MS from the
 * original absolute-master numbers — see REFACTOR-PATTERNS.md 2b).
 */
import React from "react";
import { Timegroup } from "@editframe/react";
import { TraceLayer } from "../components/TraceLayer";
import { Reveal } from "@shared/components/Reveal";
import { TRACE_MODE, TRACE_OPACITY, OVERLAP_MS } from "../constants";

export const MANAGED_AGENTS_START    = 12000;
export const MANAGED_AGENTS_DURATION = 3500 + OVERLAP_MS; // 4100

export function ManagedAgents(): React.ReactElement {
  return (
    <Timegroup
      mode="fixed"
      duration={`${MANAGED_AGENTS_DURATION}ms`}
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0, width: 1920, height: 1080, overflow: "hidden" }}
    >
      <TraceLayer sceneStartMs={MANAGED_AGENTS_START - OVERLAP_MS} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* CORAL background — fades in over the crossfade window from cream, then persists */}
      {!TRACE_MODE && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#D87757",
            zIndex: 1,
            animation: `mg-bg-in ${OVERLAP_MS}ms 0ms cubic-bezier(0.45,0,0.55,1) both`,
          }}
        />
      )}

      <Reveal
        enter={[0 + OVERLAP_MS, 700 + OVERLAP_MS]}
        exit={[2800 + OVERLAP_MS, 3500 + OVERLAP_MS]}
        y={20}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", padding: "0 160px" }}>
          <div
            style={{
              fontFamily: "'Newsreader', 'EB Garamond', Georgia, serif",
              fontWeight: 400,
              fontSize: 64,
              lineHeight: 1.35,
              color: "#1A1A1A",
              letterSpacing: "-0.01em",
            }}
          >
            <div>Or deploy them as Managed Agents:</div>
            <div>hosted, governed, production-ready on day one</div>
          </div>
        </div>
      </Reveal>
    </Timegroup>
  );
}

ManagedAgents.duration = MANAGED_AGENTS_DURATION;
