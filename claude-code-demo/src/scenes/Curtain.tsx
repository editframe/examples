import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import PaperBackground from "../components/PaperBackground";
import Terminal from "../components/Terminal";
import Mascot from "../components/Mascot";
import { Reveal } from "@shared/components/Reveal";
import { clamp, lerp, track, typewriter } from "@shared/utils/animation";

/**
 * Scene 5 — Jump-out + Curtain Pull-down (7s)
 *
 *   0–700      Mascot JUMPS OUT of terminal corner — arcs upward to land
 *              ON TOP of the terminal at center (no hat yet)
 *   700–1200   Mascot's eyes look UP (pixel offset)
 *   1200–1900  Mascot's arms reach UP and EXTEND upward off-screen
 *   1900–3400  Mascot PULLS DOWN a black curtain — black overlay slides
 *              from top of frame to fully cover it; terminal slides off
 *              the bottom as the curtain comes down
 *   3000–3600  Hat reappears on mascot (from "pocket" — small scale up)
 *   3600–4200  Mascot recenters on the black background
 *   4200–5800  Serif headline types in below mascot:
 *              "Agent view, now available in research preview"
 *   5800–7000  Hold
 *
 * The mascot jump/stretch + curtain descent + reaching arms are kept as one scoped
 * `onFrame` — the arm's hand position tracks the curtain's own descending edge
 * (`handY = curtainBottomY` mid-pull, then a damped spring retract), and the arm's
 * shoulder anchor tracks the mascot's own in-flight jump/recenter position. This is a
 * single physically-coupled rig, not independent one-shot effects, so it stays JS by
 * design (see REFACTOR-PATTERNS.md 2b, priority 5). The hat reappearing and the hero
 * terminal sliding off are both independent of this rig (pure functions of local time)
 * and are plain CSS; the headline's fade is <Reveal>, its typed text is still JS.
 */

const HEADLINE_LINE1 = "Agent view, now available";
const HEADLINE_LINE2 = "in research preview";

const MASCOT_HOME_X = 960;
const MASCOT_HOME_Y = 460; // sits on top of terminal (above center)

export const Curtain: React.FC = () => {
  const mascotWrapRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<SVGRectElement>(null);
  const rightEyeRef = useRef<SVGRectElement>(null);

  const leftArmPathRef = useRef<SVGPathElement>(null);
  const rightArmPathRef = useRef<SVGPathElement>(null);

  const blackCurtainRef = useRef<HTMLDivElement>(null);

  const h1Ref = useRef<HTMLDivElement>(null);
  const h2Ref = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;

      // BLACK CURTAIN progress (computed early; used for body stretch + hand tracking)
      const curtainP = track(ms, 1900, 3300, eases.inOutCubic);
      const curtainBottomY = 1080 * curtainP;

      // Body stretches taller during the pull (1200-3300), settles during retract (3300-4000)
      const bodyStretchIn = track(ms, 1200, 1900, eases.outCubic);
      const bodyStretchOut = track(ms, 3300, 4000, eases.outCubic);
      const stretchY = 1 + 0.22 * bodyStretchIn * (1 - bodyStretchOut);

      // Mascot jump out (0-700) + recenter (3000-4000) + body stretch
      let mascotTopLeftX = MASCOT_HOME_X - 105;
      let mascotTopLeftY = MASCOT_HOME_Y - 112;
      if (ms < 3000) {
        const jumpP = clamp(ms / 700);
        const x = lerp(-510, 0, jumpP);
        const baseY = lerp(-270, 0, jumpP);
        const arcY = -120 * Math.sin(jumpP * Math.PI);
        const scaleP = lerp(0.36, 1.0, eases.outCubic(jumpP));
        mascotTopLeftX = MASCOT_HOME_X - 105 + x;
        mascotTopLeftY = MASCOT_HOME_Y - 112 + baseY + arcY;
        if (mascotWrapRef.current) {
          mascotWrapRef.current.style.transform = `translate(-50%, calc(-50% + ${baseY + arcY}px)) scale(${scaleP}, ${scaleP * stretchY})`;
        }
      } else {
        const recenterP = track(ms, 3000, 4000, eases.inOutCubic);
        mascotTopLeftY = MASCOT_HOME_Y - 112 + lerp(0, 60, recenterP);
        if (mascotWrapRef.current) {
          mascotWrapRef.current.style.transform = `translate(-50%, calc(-50% + ${lerp(0, 60, recenterP)}px)) scale(1, ${stretchY})`;
        }
      }

      // EYES scan from UP → DOWN as curtain descends
      let eyeY = 0;
      if (ms >= 1200 && ms < 1900) {
        eyeY = -2;
      } else if (ms >= 1900 && ms < 3300) {
        const sp = (ms - 1900) / 1400;
        eyeY = Math.round(lerp(-2, 2, sp));
      } else if (ms >= 3300) {
        const fadeP = track(ms, 3300, 3700, eases.outCubic);
        eyeY = Math.round(lerp(2, 0, fadeP));
      }
      if (leftEyeRef.current) leftEyeRef.current.style.transform = `translate(0, ${eyeY}px)`;
      if (rightEyeRef.current) rightEyeRef.current.style.transform = `translate(0, ${eyeY}px)`;

      // BLACK CURTAIN slides down
      if (blackCurtainRef.current) {
        blackCurtainRef.current.style.transform = `translateY(${-100 + 100 * curtainP}%)`;
      }

      // ARMS — L-shaped: from shoulder UP to curtain edge, then OUTWARD to hand.
      const armAppearP = track(ms, 1200, 1900, eases.outCubic);
      const armRetractP = track(ms, 3300, 4100, eases.outCubic);
      const armVis = armAppearP * (1 - armRetractP);

      const leftShoulderX = mascotTopLeftX + 0;
      const leftShoulderY = mascotTopLeftY + 10.5 * 14;
      const rightShoulderX = mascotTopLeftX + 15 * 14;
      const rightShoulderY = mascotTopLeftY + 10.5 * 14;

      // Hand position: rises to top of frame (1200-1900), tracks the curtain's own
      // descending bottom edge ALL the way down (1900-3300), then a damped-spring
      // "slinky" retract back to the shoulder (3300-4100).
      let handY: number;
      if (ms < 1200) {
        handY = leftShoulderY;
      } else if (ms < 1900) {
        const p = (ms - 1200) / 700;
        handY = lerp(leftShoulderY, -20, eases.outCubic(p));
      } else if (ms < 3300) {
        handY = curtainBottomY;
      } else {
        const t = clamp((ms - 3300) / 800);
        const springT = 1 - Math.exp(-3 * t) * Math.cos(t * Math.PI * 3);
        handY = lerp(1080, leftShoulderY, clamp(springT));
      }

      if (leftArmPathRef.current) {
        leftArmPathRef.current.setAttribute("d", `M${leftShoulderX},${leftShoulderY} L${leftShoulderX},${handY}`);
        leftArmPathRef.current.style.opacity = String(armVis);
      }
      if (rightArmPathRef.current) {
        rightArmPathRef.current.setAttribute("d", `M${rightShoulderX},${rightShoulderY} L${rightShoulderX},${handY}`);
        rightArmPathRef.current.style.opacity = String(armVis);
      }

      // Headline (typed text — the fade is <Reveal>).
      if (h1Ref.current) h1Ref.current.textContent = typewriter(ms, 4200, 600, HEADLINE_LINE1);
      if (h2Ref.current) h2Ref.current.textContent = typewriter(ms, 4900, 500, HEADLINE_LINE2);
    },
    []
  );

  return (
    <Timegroup mode="fixed" duration="7s" onFrame={handleFrame as any} className="absolute inset-0">
      <PaperBackground driftFrom={60} driftTo={75} durationMs={7000} />

      {/* Hero terminal continues from Scene 4 — slides off bottom (CSS, decoupled from the rig) */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 1100,
          height: 680,
          zIndex: 2,
          animation: "hero-slide-off 1000ms 2000ms linear both",
        }}
      >
        <Terminal width={1100} height={680} title="acme — claude — 92×28">
          <div style={{ color: "var(--text-dim)", fontSize: 24 }}>session ready.</div>
        </Terminal>
      </div>

      {/* CURTAIN — warm-dark Claude ink #141413 (NOT pure black), comes down from top */}
      <div
        ref={blackCurtainRef}
        style={{
          position: "absolute",
          inset: 0,
          background: "#141413",
          transform: "translateY(-100%)",
          zIndex: 5,
        }}
      />

      {/* Mascot — starts at terminal corner, jumps to top, then arms reach up */}
      <div
        style={{
          position: "absolute",
          left: MASCOT_HOME_X,
          top: MASCOT_HOME_Y,
          transform: "translate(-50%, -50%)",
          zIndex: 8,
        }}
      >
        <div ref={mascotWrapRef}>
          <Mascot
            variant="cowboy"
            pixel={14}
            leftEyeRef={leftEyeRef}
            rightEyeRef={rightEyeRef}
            hatRef={(el) => {
              if (el) el.style.animation = "hat-reappear 600ms 3000ms cubic-bezier(0.33,1,0.68,1) backwards";
            }}
          />
        </div>
      </div>

      {/* Arm extensions reaching UP */}
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 9 }}
      >
        <path ref={leftArmPathRef} d="" stroke="var(--claude)" strokeWidth={22} strokeLinecap="square" fill="none" opacity={0} />
        <path ref={rightArmPathRef} d="" stroke="var(--claude)" strokeWidth={22} strokeLinecap="square" fill="none" opacity={0} />
      </svg>

      {/* Serif headline — appears below mascot on the now-black background. */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "calc(50% + 160px)",
          transform: "translateX(-50%)",
          width: 1400,
          textAlign: "center",
          color: "#FAF9F5",
          fontFamily: "'Source Serif 4 Display', 'Tiempos Headline', Newsreader, 'EB Garamond', Georgia, serif",
          fontSize: 76,
          lineHeight: 1.06,
          fontWeight: 500,
          letterSpacing: "-0.01em",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <Reveal enter={[4200, 4500]} y={0} style={{ minHeight: 84 }}>
          <div ref={h1Ref} />
        </Reveal>
        <Reveal enter={[4900, 5200]} y={0} style={{ minHeight: 84 }}>
          <div ref={h2Ref} />
        </Reveal>
      </div>
    </Timegroup>
  );
};

export default Curtain;
