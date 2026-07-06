import React from "react";
import { Timegroup } from "@editframe/react";
import { Reveal } from "../components/Reveal";
import { VercelLogo } from "../components/VercelLogo";
import { vc, fonts } from "../lib/colors";
import { SCENES } from "../constants";

/**
 * Scene 9 — LogoCard (2.5s local + 0.5s crossfade-in tail from Scene5)  ‖ Delba canon rebuild
 *
 * Vercel triangle (white, solid fill) + "Vercel" wordmark in Geist Sans 500.
 * Black-off `#0A0A0A` bg. NO halo, NO particles, NO rotating ring, NO
 * cyan/magenta. Just the mark, sitting still, breathing.
 *
 * Beats (local ms, this scene's own clock):
 *   0–350       Logo + wordmark fade in together (gentle, no overshoot)
 *   350–3000    Hold — exactly as a Vercel keynote logo lockup would sit.
 *
 * This is the final scene — no exit fade (the video just ends).
 *
 * Brand checks:
 *   - Bg #0A0A0A ✓   - Geist Sans wordmark ✓   - Solid white triangle ✓
 *   - ZERO accents ✓   - >80% negative space ✓   - quiet, confident ✓
 */

export const Scene9_LogoCard: React.FC = () => {
  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENES.logoCard.duration}ms`}
      className="absolute inset-0 overflow-hidden"
    >
      <div style={{ position: "absolute", inset: 0, background: vc.bg }} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Reveal enter={[0, 350]} y={6} style={{ display: "flex", alignItems: "center", gap: 48 }}>
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
        </Reveal>
      </div>
    </Timegroup>
  );
};

export default Scene9_LogoCard;
