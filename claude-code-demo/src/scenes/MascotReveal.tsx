import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import PaperBackground from "../components/PaperBackground";
import Terminal from "../components/Terminal";
import Mascot from "../components/Mascot";
import { Reveal } from "@shared/components/Reveal";
import { typewriter } from "@shared/utils/animation";

/**
 * Scene 2 — Scatter + Mascot reveal (3.5s, faster than v2)
 *
 * Beats (ms):
 *  0–500     ALL 5 terminals scatter outward (hard, fast, with rotation+scale)
 *  500–800   Cleared center, paper-only hold (brief breathing room)
 *  800–1300  Cowboy mascot DROPS from above with squash + dust puff
 *  1300–1700 Hat TIPS (lift+tilt then return)
 *  1700–2700 Serif headline types in CENTERED on frame (above the mascot is below)
 *  2700–3500 Hold; mascot eyes glow to set up the tentacle scene
 *
 * Every beat here is a fixed function of this scene's own local clock — plain CSS
 * `@keyframes`, no `onFrame`. Only the headline typewriter needs JS (text-content
 * mutation has no CSS equivalent); its fade is still handled by <Reveal>.
 */

const HEADLINE_LINE1 = "Introducing agent view";
const HEADLINE_LINE2 = "in Claude Code";

export const MascotReveal: React.FC = () => {
  const h1Ref = useRef<HTMLDivElement>(null);
  const h2Ref = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;
      if (h1Ref.current) h1Ref.current.textContent = typewriter(ms, 1700, 420, HEADLINE_LINE1);
      if (h2Ref.current) h2Ref.current.textContent = typewriter(ms, 2150, 330, HEADLINE_LINE2);
    },
    []
  );

  return (
    <Timegroup mode="fixed" duration="3.5s" onFrame={handleFrame as any} className="absolute inset-0">
      <PaperBackground driftFrom={15} driftTo={30} durationMs={3500} />

      <div className="scene-3d" style={{ position: "absolute", inset: 0 }}>
        {/* Sub-terms re-instantiated to scatter (matching end of Scene 1) */}
        <SubTermShell style={{ top: 40, left: 40 }} title="agent-1" />
        <SubTermShell style={{ top: 40, right: 40 }} title="agent-2" />
        <SubTermShell style={{ bottom: 40, left: 40 }} title="agent-3" />
        <SubTermShell style={{ bottom: 40, right: 40 }} title="agent-4" />

        {/* Hero terminal — same size + position as Scene 1, animated away */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 1480,
            height: 860,
            transformOrigin: "center center",
            zIndex: 2,
            animation: "hero-scatter-out 500ms cubic-bezier(0.32,0,0.67,0) both",
          }}
        >
          <Terminal width={1480} height={860} title="acme — claude — 92×28">
            <div style={{ color: "var(--text-dim)", fontSize: 22 }}>Compiling…</div>
          </Terminal>
        </div>

        {/* Dust puff */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "calc(50% + 100px)",
            width: 260,
            height: 26,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(176,201,182,0.65) 0%, rgba(176,201,182,0) 70%)",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 3,
            animation: "dust-puff 500ms 1200ms cubic-bezier(0.33,1,0.68,1) forwards",
          }}
        />

        {/* MASCOT — positioned above center so headline sits at center */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "calc(50% - 260px)",
            transform: "translate(-50%, -50%)",
            zIndex: 5,
          }}
        >
          <div style={{ animation: "mascot-drop-in 600ms 800ms linear both" }}>
            <Mascot
              variant="cowboy"
              pixel={22}
              hatRef={(el) => {
                if (el) el.style.animation = "hat-tip 400ms 1300ms cubic-bezier(0.33,1,0.68,1) both";
              }}
            />
          </div>
        </div>

        {/* HEADLINE — at vertical center of frame
            Warm Claude ink #141413 (never pure black), Tiempos-substitute serif stack,
            no shadow per brand rules (client called out shadow-on-text specifically). */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, 160px)",
            width: 1200,
            textAlign: "center",
            color: "#141413",
            fontFamily: "'Source Serif 4 Display', 'Tiempos Headline', Newsreader, 'EB Garamond', Georgia, serif",
            fontSize: 84,
            lineHeight: 1.05,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            pointerEvents: "none",
            zIndex: 4,
          }}
        >
          <Reveal enter={[1700, 2000]} y={0} style={{ minHeight: 96 }}>
            <div ref={h1Ref} />
          </Reveal>
          <Reveal enter={[2150, 2450]} y={0} style={{ minHeight: 96 }}>
            <div ref={h2Ref} />
          </Reveal>
        </div>
      </div>
    </Timegroup>
  );
};

const SubTermShell: React.FC<{ style: React.CSSProperties; title: string }> = ({ style, title }) => (
  <div
    style={{
      position: "absolute",
      width: 700,
      height: 460,
      transformOrigin: "center center",
      animation: "sub-term-implode 500ms cubic-bezier(0.32,0,0.67,0) both",
      ...style,
    }}
  >
    <Terminal width={700} height={460} title={title} bodyStyle={{ fontSize: 22, padding: "14px 20px" }}>
      <div style={{ color: "var(--light-green)" }}>⏺  ✓ findings ready</div>
    </Terminal>
  </div>
);

export default MascotReveal;
