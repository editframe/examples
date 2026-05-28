import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import { FigmaLogo } from "../components/FigmaLogo";
import { Sfx } from "../components/Sfx";
import { lerp, track } from "../components/helpers";

/**
 * SceneD — Figma logo card (3.5s).
 *
 * Off-black #1E1E1E canvas (Figma's actual canvas color), 5-color F mark
 * centered above the wordmark. The reference video closes on the same
 * card. No peg shows this exact frame, but the 5 brand colors + dark canvas
 * are an explicit project rule.
 *
 *   0–650     Logo scale 0.85 → 1, opacity 0 → 1
 *   400–950   Wordmark fades in below (translateY 12 → 0)
 *   650–2900  Hold
 *   2900–3500 Gentle fade out
 */
export const SceneD_LogoCard: React.FC = () => {
  const logoRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;
      const outP = track(ms, 2900, 3500, eases.outCubic);

      if (logoRef.current) {
        const inP = track(ms, 0, 650, (t) => 1 - Math.pow(1 - t, 4));
        const sc = lerp(0.85, 1, inP);
        logoRef.current.style.opacity = String(inP * (1 - outP));
        logoRef.current.style.transform = `scale(${sc})`;
      }
      if (wordmarkRef.current) {
        const wP = track(ms, 400, 950, eases.outCubic);
        wordmarkRef.current.style.opacity = String(wP * (1 - outP));
        wordmarkRef.current.style.transform = `translateY(${lerp(12, 0, wP)}px)`;
      }
      if (wrapRef.current) {
        const drift = Math.sin(ms / 1400) * 1.2;
        wrapRef.current.style.transform = `translate(-50%, calc(-50% + ${drift}px))`;
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
      <div style={{ position: "absolute", inset: 0, background: "#1E1E1E" }} />

      <Sfx cue="reveal" at={0.0} dur={1.2} volume={0.42} />
      <Sfx cue="confirm" at={0.55} dur={0.5} volume={0.32} />

      <div
        ref={wrapRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 56,
        }}
      >
        <div ref={logoRef} style={{ opacity: 0, willChange: "transform, opacity" }}>
          <FigmaLogo size={200} />
        </div>
        <div
          ref={wordmarkRef}
          style={{
            opacity: 0,
            color: "#FFFFFF",
            fontFamily:
              "'Inter', 'Plus Jakarta Sans', -apple-system, system-ui, sans-serif",
            fontFeatureSettings: "'cv11', 'ss01', 'ss03'",
            fontSize: 108,
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            willChange: "transform, opacity",
          }}
        >
          Figma
        </div>
      </div>
    </Timegroup>
  );
};

export default SceneD_LogoCard;
