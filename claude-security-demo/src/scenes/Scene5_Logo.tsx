import React from "react";
import { Timegroup } from "@editframe/react";
import { PaperBackground } from "../components/PaperBackground";
import { Sfx } from "../components/Sfx";
import { Reveal } from "../components/Reveal";
import { claude } from "../brand";

/**
 * Scene 5 — Logo Card (3s) — REBUILT v5
 *
 * Reference: jeremy-refs f-48.png — coral burst + "Claude" serif wordmark,
 * dead-center, generous negative space.
 *
 * Centered with flexbox (NOT absolute translate — see vercel-1 regression).
 *
 * Timing (scene-local — this scene's own `<Timegroup>` resets to 0):
 *   0.0–0.6s   Burst scales 0 → 1 with a back-out overshoot (`burst-in`
 *              keyframe, cubic-bezier(0.34,1.56,0.64,1) — CSS equivalent of
 *              the original hand-rolled `outBack(1.7)`)
 *   0.4–1.0s   Wordmark fades + slides 8px left → 0
 *   1.0–2.4s   Hold
 *   2.4–3.0s   Cross-fade out
 *
 * NOTE: the original per-frame version ramped the burst's opacity to 1
 * 1.5x faster than its scale (so opacity settled at ~400ms while the scale
 * overshoot kept animating until 600ms). A single CSS keyframe animates
 * both properties on the same clock, so here they both resolve together at
 * 600ms — a barely-perceptible timing difference on an 84px icon during a
 * 600ms beat, traded for a much simpler declarative animation.
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

export const Scene5_Logo: React.FC = () => (
  <Timegroup mode="fixed" duration="3s" className="absolute inset-0">
    <PaperBackground />
    <Sfx cue="twinkle" at={0.05} dur={0.8} volume={0.08} />

    {/* Flex center container — NOT absolute translate. */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "wrap-fade-out 600ms 2400ms cubic-bezier(0.33,1,0.68,1) forwards",
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
          style={{
            display: "flex",
            animation: "burst-in 600ms 0ms cubic-bezier(0.34,1.56,0.64,1) backwards",
          }}
        >
          <Burst size={84} />
        </div>
        <Reveal
          enter={[400, 1000]}
          x={-8}
          y={0}
          style={{
            fontFamily: claude.fonts.display,
            fontWeight: 500,
            fontSize: 96,
            color: claude.fg.primary,
            letterSpacing: "-0.015em",
            lineHeight: 1,
          }}
        >
          Claude
        </Reveal>
      </div>
    </div>
  </Timegroup>
);

export default Scene5_Logo;
