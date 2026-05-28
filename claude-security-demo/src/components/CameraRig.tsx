import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";

/**
 * CameraRig — wraps children in a constantly drifting "camera" container.
 * Continuous translate ±20px, scale ±0.04, slight rotateZ ±0.4deg.
 * Plus a film-grain noise overlay that animates.
 *
 * Children must be a `mode="sequence"` Timegroup or scenes — anything that
 * renders into the rig will inherit the drift.
 *
 * `duration` should match the total piece length.
 */

export const CameraRig: React.FC<{
  duration: string;
  children: React.ReactNode;
}> = ({ duration, children }) => {
  const camRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const vignRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const t = ownCurrentTimeMs / 1000;

      if (camRef.current) {
        // Lissajous-style drift — never repeats exactly, never static
        const tx = Math.sin(t * 0.42) * 16 + Math.sin(t * 0.93) * 6;
        const ty = Math.cos(t * 0.31) * 14 + Math.sin(t * 1.27) * 4;
        const sc = 1.01 + Math.sin(t * 0.27) * 0.025 + Math.sin(t * 0.7) * 0.012;
        const rz = Math.sin(t * 0.23) * 0.35;
        camRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${sc}) rotate(${rz}deg)`;
      }

      if (grainRef.current) {
        // Shift grain texture each frame
        const gx = Math.floor((t * 47) % 220);
        const gy = Math.floor((t * 31) % 220);
        grainRef.current.style.backgroundPosition = `${gx}px ${gy}px`;
      }

      if (vignRef.current) {
        const pulse = 0.18 + Math.sin(t * 0.6) * 0.04;
        vignRef.current.style.opacity = String(pulse);
      }
    },
    []
  );

  return (
    <Timegroup
      mode="fixed"
      duration={duration}
      onFrame={handleFrame as any}
      className="absolute inset-0"
      style={{ overflow: "hidden" }}
    >
      <div
        ref={camRef}
        style={{
          position: "absolute",
          inset: 0,
          willChange: "transform",
          transformOrigin: "50% 50%",
        }}
      >
        {children}
      </div>

      {/* Grain overlay — sits above everything */}
      <div
        ref={grainRef}
        style={{
          position: "absolute",
          inset: -40,
          pointerEvents: "none",
          opacity: 0.12,
          mixBlendMode: "multiply",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='2.4' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          backgroundSize: "220px 220px",
          zIndex: 9000,
        }}
      />

      {/* Vignette */}
      <div
        ref={vignRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(31,26,18,0.42) 100%)",
          mixBlendMode: "multiply",
          opacity: 0.2,
          zIndex: 9001,
        }}
      />
    </Timegroup>
  );
};
