import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import PaperBackground from "../components/PaperBackground";
import Terminal from "../components/Terminal";
import Mascot from "../components/Mascot";
import { clamp, lerp, track, typewriter } from "../components/helpers";

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
 */

const HEADLINE_LINE1 = "Agent view, now available";
const HEADLINE_LINE2 = "in research preview";

export const Scene5_Curtain: React.FC = () => {
  const paperRef = useRef<HTMLDivElement>(null);
  const heroTerminalRef = useRef<HTMLDivElement>(null);

  const mascotWrapRef = useRef<HTMLDivElement>(null);
  const hatRef = useRef<SVGGElement>(null);
  const leftEyeRef = useRef<SVGRectElement>(null);
  const rightEyeRef = useRef<SVGRectElement>(null);
  const leftArmRef = useRef<SVGGElement>(null);
  const rightArmRef = useRef<SVGGElement>(null);

  // Two arm extension paths reaching up
  const leftArmPathRef = useRef<SVGPathElement>(null);
  const rightArmPathRef = useRef<SVGPathElement>(null);
  const leftHandRef = useRef<SVGRectElement>(null);
  const rightHandRef = useRef<SVGRectElement>(null);

  const blackCurtainRef = useRef<HTMLDivElement>(null);

  const h1Ref = useRef<HTMLDivElement>(null);
  const h2Ref = useRef<HTMLDivElement>(null);

  const MASCOT_HOME_X = 960;
  const MASCOT_HOME_Y = 460; // sits on top of terminal (above center)

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;

      // Paper drift
      if (paperRef.current) {
        const p = clamp(ms / 7000);
        paperRef.current.style.transform = `translateX(${lerp(60, 75, p)}px)`;
      }

      // BLACK CURTAIN progress (computed early; used for body stretch + eye scan)
      const curtainP = track(ms, 1900, 3300, eases.inOutCubic);
      const curtainBottomY = 1080 * curtainP;

      // Body stretches taller during the pull (1200-3300), settles during retract (3300-4000)
      const bodyStretchIn = track(ms, 1200, 1900, eases.outCubic);
      const bodyStretchOut = track(ms, 3300, 4000, eases.outCubic);
      const stretchY = 1 + 0.22 * bodyStretchIn * (1 - bodyStretchOut);

      // Mascot jump out (0-700) + recenter (3000-4000) + body stretch
      if (mascotWrapRef.current) {
        const jumpP = clamp(ms / 700);
        const x = lerp(-510, 0, jumpP);
        const baseY = lerp(-270, 0, jumpP);
        const arcY = -120 * Math.sin(jumpP * Math.PI);
        const scaleP = lerp(0.36, 1.0, eases.outCubic(jumpP));

        if (ms < 3000) {
          mascotWrapRef.current.style.transform =
            `translate(${x}px, ${baseY + arcY}px) scale(${scaleP}, ${scaleP * stretchY})`;
        } else {
          const recenterP = track(ms, 3000, 4000, eases.inOutCubic);
          mascotWrapRef.current.style.transform =
            `translate(0, ${lerp(0, 60, recenterP)}px) scale(1, ${stretchY})`;
        }
      }

      // EYES scan from UP → DOWN as curtain descends
      //   Before pull (ms<1200): neutral (y=0)
      //   Arm reach 1200-1900: look UP (y=-2)
      //   Curtain descent 1900-3300: scan DOWN from -2 to +2
      //   After (3300+): neutral (y=0)
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
      if (leftEyeRef.current) {
        leftEyeRef.current.style.transform = `translate(0, ${eyeY}px)`;
        leftEyeRef.current.setAttribute("fill", "#000000");
        leftEyeRef.current.style.filter = "";
      }
      if (rightEyeRef.current) {
        rightEyeRef.current.style.transform = `translate(0, ${eyeY}px)`;
        rightEyeRef.current.setAttribute("fill", "#000000");
        rightEyeRef.current.style.filter = "";
      }

      // Hat: hidden until curtain comes down, then reappears on mascot
      if (hatRef.current) {
        const hatBackP = ms >= 3000 && ms < 3600 ? track(ms, 3000, 3600, eases.outCubic) : (ms >= 3600 ? 1 : 0);
        if (ms < 3000) {
          hatRef.current.style.opacity = "0";
        } else {
          hatRef.current.style.opacity = String(hatBackP);
          const sc = lerp(0.3, 1, hatBackP);
          const ty = lerp(-30, 0, hatBackP);
          hatRef.current.style.transform = `translate(0, ${ty}px) scale(${sc})`;
        }
      }

      // BLACK CURTAIN slides down
      if (blackCurtainRef.current) {
        blackCurtainRef.current.style.transform = `translateY(${-100 + 100 * curtainP}%)`;
      }

      // ARMS — L-shaped: from shoulder UP to curtain edge, then OUTWARD to hand.
      // Hands stay AT the curtain edge as it descends, then retract slinky-style.
      const armAppearP = track(ms, 1200, 1900, eases.outCubic);
      const armRetractP = track(ms, 3300, 4100, eases.outCubic);
      const armVis = armAppearP * (1 - armRetractP);

      // Mascot's current screen position (for shoulder anchors)
      let mascotTopLeftX = 960 - 105;
      let mascotTopLeftY = 460 - 112;
      if (ms < 3000) {
        const jumpP = clamp(ms / 700);
        const x = lerp(-510, 0, jumpP);
        const baseY = lerp(-270, 0, jumpP);
        const arcY = -120 * Math.sin(jumpP * Math.PI);
        mascotTopLeftX = 960 - 105 + x;
        mascotTopLeftY = 460 - 112 + baseY + arcY;
      } else {
        const recenterP = track(ms, 3000, 4000, eases.inOutCubic);
        mascotTopLeftY = 460 - 112 + lerp(0, 60, recenterP);
      }
      // Left shoulder = outer edge of left arm stub (col 0)
      const leftShoulderX = mascotTopLeftX + 0;
      const leftShoulderY = mascotTopLeftY + 10.5 * 14;
      // Right shoulder = outer edge of right arm stub (col 15)
      const rightShoulderX = mascotTopLeftX + 15 * 14;
      const rightShoulderY = mascotTopLeftY + 10.5 * 14;

      // Hand position over time. Hands ALWAYS track the curtain bottom edge,
      // even when it descends past the mascot — like pulling a garage door
      // all the way down without letting go.
      //  Phase 1 (1200-1900): hand rises from shoulder to top of frame
      //  Phase 2 (1900-3300): hand follows curtain bottom edge ALL the way down to 1080
      //  Phase 3 (3300-4100): SLINKY retract back to shoulder (damped spring)
      let handY: number;
      if (ms < 1200) {
        handY = leftShoulderY;
      } else if (ms < 1900) {
        const p = (ms - 1200) / 700;
        handY = lerp(leftShoulderY, -20, eases.outCubic(p));
      } else if (ms < 3300) {
        // Track curtain bottom edge ALL THE WAY DOWN (no clamp at shoulder)
        handY = curtainBottomY;
      } else {
        // SLINKY RETRACT — damped oscillating spring from 1080 back to shoulder
        const t = clamp((ms - 3300) / 800);
        const springT = 1 - Math.exp(-3 * t) * Math.cos(t * Math.PI * 3);
        handY = lerp(1080, leftShoulderY, clamp(springT));
      }

      // The vertical leg of each arm extends straight up from the OUTER END
      // of the body's existing arm nub. The body's 2-cell arm stub already
      // forms the horizontal part — so the long extension is a single
      // vertical line aligned with the nub's outer edge.
      const leftHandX = leftShoulderX;
      const rightHandX = rightShoulderX;

      if (leftArmPathRef.current) {
        const d = `M${leftShoulderX},${leftShoulderY} L${leftShoulderX},${handY}`;
        leftArmPathRef.current.setAttribute("d", d);
        leftArmPathRef.current.style.opacity = String(armVis);
      }
      if (rightArmPathRef.current) {
        const d = `M${rightShoulderX},${rightShoulderY} L${rightShoulderX},${handY}`;
        rightArmPathRef.current.setAttribute("d", d);
        rightArmPathRef.current.style.opacity = String(armVis);
      }
      // Hands no longer rendered separately — the path's square line-cap at
      // the end of the vertical leg IS the hand. This keeps them visually
      // connected to the arm with no seam or detached look.
      if (leftHandRef.current) leftHandRef.current.style.opacity = "0";
      if (rightHandRef.current) rightHandRef.current.style.opacity = "0";

      // Hero terminal slides off the bottom as curtain comes down (2000-3000)
      if (heroTerminalRef.current) {
        const slideP = track(ms, 2000, 3000, eases.inCubic);
        heroTerminalRef.current.style.transform = `translate(-50%, calc(-50% + ${lerp(0, 800, slideP)}px))`;
        heroTerminalRef.current.style.opacity = String(1 - track(ms, 2400, 3000, eases.outCubic));
      }

      // Headline (4200-5800)
      if (h1Ref.current) {
        h1Ref.current.textContent = typewriter(ms, 4200, 600, HEADLINE_LINE1);
        h1Ref.current.style.opacity = String(track(ms, 4200, 4500, eases.outCubic));
      }
      if (h2Ref.current) {
        h2Ref.current.textContent = typewriter(ms, 4900, 500, HEADLINE_LINE2);
        h2Ref.current.style.opacity = String(track(ms, 4900, 5200, eases.outCubic));
      }
    },
    []
  );

  return (
    <Timegroup
      mode="fixed"
      duration="7s"
      onFrame={handleFrame as any}
      className="absolute inset-0"
    >
      <PaperBackground ref={paperRef} />

      {/* Hero terminal continues from Scene 4 — slides off bottom */}
      <div
        ref={heroTerminalRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 1100,
          height: 680,
          zIndex: 2,
          willChange: "transform, opacity",
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
          willChange: "transform",
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
        <div ref={mascotWrapRef} style={{ willChange: "transform" }}>
          <Mascot
            variant="cowboy"
            pixel={14}
            hatRef={hatRef}
            leftEyeRef={leftEyeRef}
            rightEyeRef={rightEyeRef}
            leftArmRef={leftArmRef}
            rightArmRef={rightArmRef}
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
        <path
          ref={leftArmPathRef}
          d=""
          stroke="var(--claude)"
          strokeWidth={22}
          strokeLinecap="square"
          fill="none"
          opacity={0}
        />
        <path
          ref={rightArmPathRef}
          d=""
          stroke="var(--claude)"
          strokeWidth={22}
          strokeLinecap="square"
          fill="none"
          opacity={0}
        />
        <rect ref={leftHandRef} x={0} y={0} width={30} height={30} fill="var(--claude)" opacity={0} />
        <rect ref={rightHandRef} x={0} y={0} width={30} height={30} fill="var(--claude)" opacity={0} />
      </svg>

      {/* Serif headline — appears below mascot on the now-black background.
            Warm off-white on warm-dark (NOT pure white on pure black), canonical
            Tiempos-substitute stack, no shadow per brand rules. */}
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
        <div ref={h1Ref} style={{ opacity: 0, minHeight: 84 }}></div>
        <div ref={h2Ref} style={{ opacity: 0, minHeight: 84 }}></div>
      </div>
    </Timegroup>
  );
};

export default Scene5_Curtain;
