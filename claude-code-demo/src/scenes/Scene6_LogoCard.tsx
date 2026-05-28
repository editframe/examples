import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import AnthropicBurst from "../components/AnthropicBurst";
import { clamp, lerp, track } from "../components/helpers";

/**
 * Scene 6 — Final logo card (3.5s)
 *
 *   0–600     Anthropic burst + "Claude Code" wordmark fade in centered
 *   600–1400  Hold
 *   1400–3000 Continued hold (EDITFRAME credit intentionally removed)
 *   3000–3500 Gentle fade out
 */

export const Scene6_LogoCard: React.FC = () => {
  const burstRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;

      const inP = track(ms, 0, 600, eases.outCubic);
      const outP = track(ms, 3000, 3500, eases.outCubic);
      const overall = inP * (1 - outP);

      if (burstRef.current) {
        const sc = lerp(0.7, 1, inP);
        burstRef.current.style.opacity = String(overall);
        burstRef.current.style.transform = `scale(${sc})`;
      }
      if (wordmarkRef.current) {
        wordmarkRef.current.style.opacity = String(overall);
        wordmarkRef.current.style.transform = `translateY(${lerp(12, 0, inP)}px)`;
      }
    },
    []
  );

  return (
    <Timegroup
      mode="fixed"
      duration="3.5s"
      onFrame={handleFrame as any}
      className="absolute inset-0"
    >
      {/* Warm-dark Claude ink background (#141413 per brand canon, not pure black) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#141413",
        }}
      />

      {/* Centered: Anthropic burst + Claude Code wordmark side by side */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          gap: 32,
        }}
      >
        <div ref={burstRef} style={{ opacity: 0, willChange: "transform, opacity" }}>
          <AnthropicBurst size={140} color="var(--claude)" />
        </div>
        <div
          ref={wordmarkRef}
          style={{
            opacity: 0,
            color: "#FAF9F5",
            fontFamily: "'Source Serif 4 Display', 'Tiempos Headline', Newsreader, 'EB Garamond', Georgia, serif",
            fontSize: 140,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            willChange: "transform, opacity",
          }}
        >
          Claude Code
        </div>
      </div>

    </Timegroup>
  );
};

export default Scene6_LogoCard;
