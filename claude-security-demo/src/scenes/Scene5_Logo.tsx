import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import { PaperBackground } from "../components/PaperBackground";
import { Sfx } from "../components/Sfx";
import { lerp, track, easeOutBack } from "../components/helpers";
import { claude } from "../brand";

/**
 * Scene 5 — Logo Card (3s) — REBUILT v5
 *
 * Reference: jeremy-refs f-48.png — coral burst + "Claude" serif wordmark,
 * dead-center, generous negative space.
 *
 * Centered with flexbox (NOT absolute translate — see vercel-1 regression).
 *
 * Timing:
 *   0.0–0.6s   Burst scales 0 → 1 with subtle back-out
 *   0.4–1.0s   Wordmark fades + slides 8px left → 0
 *   1.0–2.4s   Hold
 *   2.4–3.0s   Cross-fade out
 */

/**
 * v6 FIX 6 — Anthropic burst with 14 asymmetric spokes.
 *
 * The real Anthropic mark uses 14 radiating spokes with subtly varied
 * lengths (NOT even, NOT a sun-star). Per the client: "The claude icon at
 * the end is also wrong." Pattern below alternates between three subtly
 * different lengths to break the perfect-circle feel while staying minimal.
 *
 * Coral #D97757 fill, no outline, rounded caps.
 */
const SPOKE_LENGTHS = [24, 22, 24, 21, 24, 23, 24, 22, 24, 21, 24, 23, 24, 22];
const Burst: React.FC<{ size?: number; color?: string }> = ({
  size = 84,
  color = claude.accent.coral,
}) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    {SPOKE_LENGTHS.map((len, i) => {
      const a = (i * 360) / SPOKE_LENGTHS.length;
      return (
        <rect
          key={i}
          x={29}
          y={30 - len}
          width={2}
          height={len}
          rx={1}
          fill={color}
          transform={`rotate(${a} 30 30)`}
        />
      );
    })}
  </svg>
);

export const Scene5_Logo: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;

      const bp = track(ms, 0, 600, easeOutBack);
      if (burstRef.current) {
        burstRef.current.style.opacity = String(Math.min(1, bp * 1.5));
        burstRef.current.style.transform = `scale(${lerp(0.4, 1, bp)})`;
      }

      const wp = track(ms, 400, 1000, eases.outCubic);
      if (wordRef.current) {
        wordRef.current.style.opacity = String(wp);
        wordRef.current.style.transform = `translateX(${lerp(-8, 0, wp)}px)`;
      }

      let outOp = 1;
      if (ms >= 2400) outOp = 1 - track(ms, 2400, 3000, eases.outCubic);
      if (wrapRef.current) wrapRef.current.style.opacity = String(outOp);
    },
    []
  );

  return (
    <Timegroup
      mode="fixed"
      duration="3s"
      onFrame={handleFrame as any}
      className="absolute inset-0"
    >
      <PaperBackground />
      <Sfx cue="twinkle" at={0.05} dur={0.8} volume={0.08} />

      {/* Flex center container — NOT absolute translate. */}
      <div
        ref={wrapRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          willChange: "opacity",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
          }}
        >
          <div
            ref={burstRef}
            style={{
              opacity: 0,
              transform: "scale(0.4)",
              willChange: "opacity, transform",
              display: "flex",
            }}
          >
            <Burst size={84} />
          </div>
          <div
            ref={wordRef}
            style={{
              fontFamily: claude.fonts.display,
              fontWeight: 500,
              fontSize: 96,
              color: claude.fg.primary,
              letterSpacing: "-0.015em",
              lineHeight: 1,
              opacity: 0,
              willChange: "opacity, transform",
            }}
          >
            Claude
          </div>
        </div>
      </div>
    </Timegroup>
  );
};

export default Scene5_Logo;
