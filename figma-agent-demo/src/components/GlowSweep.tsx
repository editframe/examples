import React from "react";

/**
 * GlowSweep — a horizontal light beam sweeping left-to-right across the frame.
 *
 * Pass `progress` in [0..1]. The beam is positioned by progress, with a soft
 * white-orange gradient, motion blur trail, and chromatic edges. Used for the
 * Scene 1→2 transition AND the Scene 3 doorway portal cue.
 *
 * Looks best with `mix-blend-mode: screen` over warm content; falls back to
 * normal-blend for dark backgrounds.
 */
export const GlowSweep: React.FC<{
  progress: number; // 0..1
  height?: string | number; // full-height ribbon by default
  beamWidth?: number; // px, the bright core
  intensity?: number; // 0..1 overall brightness
  tone?: "warm" | "cool" | "white";
  blend?: "screen" | "normal" | "plus-lighter";
  zIndex?: number;
}> = ({
  progress,
  height = "100%",
  beamWidth = 280,
  intensity = 1,
  tone = "warm",
  blend = "screen",
  zIndex = 30,
}) => {
  // Bell-curve intensity: bright in middle of sweep, dim at edges
  const bell = Math.sin(Math.max(0, Math.min(1, progress)) * Math.PI);
  const op = bell * intensity;

  // Travel: -beamWidth (offscreen left) -> 100% + beamWidth (offscreen right)
  const xPct = -10 + progress * 120;

  const core =
    tone === "cool"
      ? "rgba(180, 220, 255, 0.95)"
      : tone === "white"
      ? "rgba(255, 255, 255, 0.95)"
      : "rgba(255, 230, 180, 0.95)";
  const halo =
    tone === "cool"
      ? "rgba(80, 160, 255, 0.4)"
      : tone === "white"
      ? "rgba(255, 255, 255, 0.4)"
      : "rgba(255, 170, 90, 0.45)";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        height,
        pointerEvents: "none",
        overflow: "hidden",
        mixBlendMode: blend as any,
        zIndex,
        opacity: op,
      }}
    >
      {/* Wide halo */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${xPct}%`,
          width: beamWidth * 3,
          marginLeft: -beamWidth * 1.5,
          background: `radial-gradient(ellipse at center, ${halo} 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />
      {/* Bright core */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${xPct}%`,
          width: beamWidth,
          marginLeft: -beamWidth / 2,
          background: `linear-gradient(90deg,
            transparent 0%,
            ${halo} 30%,
            ${core} 50%,
            ${halo} 70%,
            transparent 100%)`,
          filter: "blur(2px)",
        }}
      />
      {/* Sharp center line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${xPct}%`,
          width: 3,
          marginLeft: -1.5,
          background: core,
          boxShadow: `0 0 30px ${core}, 0 0 60px ${halo}`,
        }}
      />
    </div>
  );
};

export default GlowSweep;
