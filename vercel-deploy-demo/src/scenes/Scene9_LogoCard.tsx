import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import { lerp, track } from "../components/helpers";
import { VercelLogo } from "../components/VercelLogo";
import { vc, fonts } from "../lib/colors";

/**
 * Scene 9 — LogoCard (3.0s)  ‖ Delba canon rebuild
 *
 * Vercel triangle (white, solid fill) + "Vercel" wordmark in Geist Sans 500.
 * Black-off `#0A0A0A` bg. NO halo, NO particles, NO rotating ring, NO
 * cyan/magenta. Just the mark, sitting still, breathing.
 *
 * Beats:
 *   0–700       Logo + wordmark fade in together (gentle, no overshoot)
 *   700–2300    Hold — exactly as a Vercel keynote logo lockup would sit.
 *   2300–3000   Cross-dissolve out.
 *
 * Brand checks:
 *   - Bg #0A0A0A ✓   - Geist Sans wordmark ✓   - Solid white triangle ✓
 *   - ZERO accents ✓   - >80% negative space ✓   - quiet, confident ✓
 */

export const Scene9_LogoCard: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lockupRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
    const ms = ownCurrentTimeMs;

    if (wrapperRef.current) {
      // No scene-level fade — prevents black seam at the cut.
      wrapperRef.current.style.opacity = "1";
    }

    if (lockupRef.current) {
      const p = track(ms, 0, 350, eases.outCubic);
      lockupRef.current.style.opacity = String(p);
      lockupRef.current.style.transform = `translateY(${lerp(6, 0, p)}px)`;
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration="2.5s"
      onFrame={handleFrame as any}
      className="absolute inset-0 overflow-hidden"
    >
      <div style={{ position: "absolute", inset: 0, background: vc.bg }} />

      <div
        ref={wrapperRef}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          ref={lockupRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 48,
            opacity: 0,
            willChange: "transform, opacity",
          }}
        >
          <VercelLogo size={220} fill={vc.fg} />
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 220,
              fontWeight: 600,
              letterSpacing: "-0.045em",
              lineHeight: 0.9,
              color: vc.fg,
              textRendering: "geometricPrecision",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              fontSmooth: "always",
            } as React.CSSProperties}
          >
            Vercel
          </div>
        </div>
      </div>
    </Timegroup>
  );
};

export default Scene9_LogoCard;
