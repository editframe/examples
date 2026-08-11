import React from "react";
import { Timegroup } from "@editframe/react";
import { Reveal } from "@shared/components/Reveal";
import { vc, fonts } from "../lib/colors";
import { SCENES } from "../constants";

/**
 * Scene 5 — OutputCard (3.0s local + 0.5s crossfade tail)  ‖ Delba canon rebuild
 *
 * Reference: Delba's videos consistently land on a quiet outro card with
 * Geist Sans typography, generous whitespace, and a tiny mono caption. No
 * logo lockup here — that's reserved for the final scene. This is the
 * "thesis sentence" card.
 *
 * Beats (local ms, this scene's own clock):
 *   0–420       Line 1 fades up: "Static where it can."
 *   150–620     Line 2 fades up: "Dynamic where it must."
 *   800–1300    Caption fades in beneath in Geist Mono.
 *   1300–2500   Hold.
 *   2500–3000   Crossfade out (--ef-transition-out-start).
 *
 * Brand checks:
 *   - Bg #0A0A0A ✓
 *   - Geist Sans headline 500 weight ✓
 *   - Geist Mono caption ✓
 *   - ZERO accents — pure type ✓
 *   - >70% negative space ✓
 */

export const OutputCard: React.FC = () => {
  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENES.outputCard.duration}ms`}
      className="absolute inset-0 overflow-hidden"
    >
      <div style={{ position: "absolute", inset: 0, background: vc.bg }} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          animation: "scene-fade-out var(--ef-transition-duration) var(--ef-transition-out-start) cubic-bezier(0.32,0,0.67,0) forwards",
        }}
      >
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
          <Reveal enter={[0, 420]} y={10} style={{ fontSize: 88 }}>
            Static where it can.
          </Reveal>
          <Reveal enter={[150, 620]} y={10} style={{ fontSize: 88, marginTop: 14, color: vc.fg }}>
            Dynamic where it must.
          </Reveal>

          <Reveal
            enter={[800, 1300]}
            y={0}
            style={{
              fontFamily: fonts.mono,
              fontSize: 18,
              color: vc.gray600,
              marginTop: 56,
              letterSpacing: "0.04em",
            }}
          >
            Next.js · partial prerendering
          </Reveal>
        </div>
      </div>
    </Timegroup>
  );
};

export default OutputCard;
