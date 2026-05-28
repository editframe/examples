import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import { IconCursorCube } from "../components/JiraIcons";

const clamp = (n: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const track = (
  ms: number,
  startMs: number,
  endMs: number,
  easeFn: (t: number) => number = eases.outCubic
) => easeFn(clamp((ms - startMs) / (endMs - startMs)));

/**
 * Final logo card (3.5s) — Cursor mark + wordmark on black.
 * NO EDITFRAME watermark (per regression ledger universal rule #5).
 *   0–600     Cursor mark + "Cursor" wordmark fade up
 *   600–3000  Hold
 *   3000–3500 Gentle fade out
 */
export const LogoCard: React.FC = () => {
  const markRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;
      const inP = track(ms, 0, 600, eases.outCubic);
      const outP = track(ms, 3000, 3500, eases.outCubic);
      const overall = inP * (1 - outP);

      if (markRef.current) {
        const sc = lerp(0.72, 1, inP);
        markRef.current.style.opacity = String(overall);
        markRef.current.style.transform = `scale(${sc})`;
      }
      if (wordRef.current) {
        wordRef.current.style.opacity = String(overall);
        wordRef.current.style.transform = `translateY(${lerp(14, 0, inP)}px)`;
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
      {/* Solid black */}
      <div style={{ position: "absolute", inset: 0, background: "#000000" }} />

      {/* Center: Cursor cube + wordmark */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          gap: 38,
        }}
      >
        <div
          ref={markRef}
          style={{
            opacity: 0,
            willChange: "transform, opacity",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconCursorCube size={150} color="#FFFFFF" notch="#000000" />
        </div>
        <div
          ref={wordRef}
          style={{
            opacity: 0,
            color: "#FFFFFF",
            fontFamily: "Inter, sans-serif",
            fontSize: 132,
            fontWeight: 500,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            willChange: "transform, opacity",
          }}
        >
          Cursor
        </div>
      </div>

    </Timegroup>
  );
};

export default LogoCard;
