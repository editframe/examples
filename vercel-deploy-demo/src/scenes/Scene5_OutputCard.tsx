import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import { lerp, track } from "../components/helpers";
import { vc, fonts } from "../lib/colors";

/**
 * Scene 5 — OutputCard (3.5s)  ‖ Delba canon rebuild
 *
 * Reference: Delba's videos consistently land on a quiet outro card with
 * Geist Sans typography, generous whitespace, and a tiny mono caption. No
 * logo lockup here — that's reserved for the final scene. This is the
 * "thesis sentence" card.
 *
 * Beats:
 *   0–500       Cross-dissolve in.
 *   500–1500    Two-line headline fades up (line 1 first, then line 2,
 *               stagger 180ms).
 *   1500–2200   Caption fades in beneath in Geist Mono.
 *   2200–3000   Hold.
 *   3000–3500   Cross-dissolve out.
 *
 * Brand checks:
 *   - Bg #0A0A0A ✓
 *   - Geist Sans headline 500 weight ✓
 *   - Geist Mono caption ✓
 *   - ZERO accents — pure type ✓
 *   - >70% negative space ✓
 */

export const Scene5_OutputCard: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
    const ms = ownCurrentTimeMs;

    if (wrapperRef.current) {
      // No scene-level fade — prevents black seam at the cut.
      wrapperRef.current.style.opacity = "1";
    }

    if (line1Ref.current) {
      const p = track(ms, 0, 420, eases.outCubic);
      line1Ref.current.style.opacity = String(p);
      line1Ref.current.style.transform = `translateY(${lerp(10, 0, p)}px)`;
    }
    if (line2Ref.current) {
      const p = track(ms, 150, 620, eases.outCubic);
      line2Ref.current.style.opacity = String(p);
      line2Ref.current.style.transform = `translateY(${lerp(10, 0, p)}px)`;
    }
    if (captionRef.current) {
      const p = track(ms, 800, 1300, eases.outCubic);
      captionRef.current.style.opacity = String(p);
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration="3s"
      onFrame={handleFrame as any}
      className="absolute inset-0 overflow-hidden"
    >
      <div style={{ position: "absolute", inset: 0, background: vc.bg }} />

      <div ref={wrapperRef} style={{ position: "absolute", inset: 0, opacity: 0 }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            fontFamily: fonts.sans,
            fontWeight: 500,
            color: vc.fg,
            letterSpacing: "-0.035em",
            lineHeight: 1.08,
          }}
        >
          <div
            ref={line1Ref}
            style={{
              fontSize: 88,
              opacity: 0,
              willChange: "transform, opacity",
            }}
          >
            Static where it can.
          </div>
          <div
            ref={line2Ref}
            style={{
              fontSize: 88,
              marginTop: 14,
              color: vc.fg,
              opacity: 0,
              willChange: "transform, opacity",
            }}
          >
            Dynamic where it must.
          </div>

          <div
            ref={captionRef}
            style={{
              fontFamily: fonts.mono,
              fontSize: 18,
              color: vc.gray600,
              marginTop: 56,
              letterSpacing: "0.04em",
              opacity: 0,
            }}
          >
            Next.js · partial prerendering
          </div>
        </div>
      </div>
    </Timegroup>
  );
};

export default Scene5_OutputCard;
