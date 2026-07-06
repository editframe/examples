import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import PaperBackground from "../components/PaperBackground";
import Terminal from "../components/Terminal";
import Mascot from "../components/Mascot";
import { clamp, lerp, track } from "../components/helpers";

/**
 * Scene 3 — Arm-Pull (6.5s)
 *
 * Mascot stands centered. One-by-one, he looks in a direction, extends
 * an arm OFF-SCREEN, and PULLS a terminal back into frame from that
 * direction. The arm visually connects from the mascot's body to a
 * "hand" that grabs the terminal corner.
 *
 * Sequence (target, source-direction, eye look direction):
 *   pull 1: top-right    (terminal slides in from upper-right off-screen, right arm)
 *   pull 2: top-left     (terminal from upper-left, left arm)
 *   pull 3: bottom-right (terminal from lower-right, right arm)
 *   pull 4: bottom-left  (terminal from lower-left, left arm)
 *
 * Beats (ms, each pull 1100ms):
 *   100–1200  Pull 1 (top-right)
 *   1100–2200 Pull 2 (top-left) — overlaps pull 1's retract
 *   2100–3200 Pull 3 (bottom-right) — overlaps pull 2's retract
 *   3100–4200 Pull 4 (bottom-left) — overlaps pull 3's retract
 *   4200–4900 All 4 terminals slide off-screen (left pair left, right pair right)
 *   4400–5100 Mascot takes off hat — hat lifts, shrinks, moves to "pocket" and disappears
 *   5500–6300 Mascot fades out as Scene 4 takes over
 *
 * The arm-pull rig (per-pull SVG arm path + hand + terminal position + eye gaze) is
 * kept as a single scoped `onFrame` — it is a genuinely irreducible piece of per-frame
 * procedural math: the arm's SVG `d` attribute has to connect a shoulder anchor to a
 * hand position that itself tracks the terminal's own in-flight position across three
 * overlapping phases, and the eye-gaze envelope mirrors whichever pull is currently
 * active. Splitting that across CSS + JS would risk the hand/terminal/gaze drifting out
 * of sync for no real benefit. Everything else in this scene (paper drift, hat removal,
 * the closing mascot fade) is independent of this rig and is plain CSS.
 */

const MASCOT_CX = 960;
const MASCOT_CY = 540;

// Shoulder anchor points = the OUTER edge of each arm stub (the "nub")
// Mascot at 960,540 with pixel=14, grid 15×16 → 210×224 px
// SVG top-left at screen (960-105, 540-112) = (855, 428)
// Left arm at cols 0-1, outer edge x = 855 + 0 = 855
// Right arm at cols 13-14, outer edge x = 855 + 15*14 = 1065
// Arm rows 10-11, center y = 428 + 10.5*14 = 575 → use 582 for visual centering
const LEFT_SHOULDER = { x: 855, y: 582 };
const RIGHT_SHOULDER = { x: 1065, y: 582 };

// Sub-terminal final positions (where they land after being pulled in).
// rot2D is a tiny 2D rotation for "tossed paper card" feel — NOT 3D.
// Per Claude brand flat-only mandate, rotateX/rotateY/perspective are forbidden.
const PULL_TARGETS = [
  { name: "tr", finalX: 1560, finalY: 240,  startX: 2400, startY: -200, rot2D:  3, arm: "right" as const, look: { dx: 1, dy: -1 } },
  { name: "tl", finalX: 360,  finalY: 240,  startX: -480, startY: -200, rot2D: -3, arm: "left"  as const, look: { dx: -1, dy: -1 } },
  { name: "br", finalX: 1560, finalY: 840,  startX: 2400, startY: 1280, rot2D: -3, arm: "right" as const, look: { dx: 1, dy: 1 } },
  { name: "bl", finalX: 360,  finalY: 840,  startX: -480, startY: 1280, rot2D:  3, arm: "left"  as const, look: { dx: -1, dy: 1 } },
];

// Each pull starts at staggered ms. Each pull is 1100ms.
// Arm extends 0-450, terminal slides 250-850, arm retracts 700-1100.
const PULL_START = [100, 1100, 2100, 3100];

export const Scene3_ArmPull: React.FC = () => {
  const leftEyeRef = useRef<SVGRectElement>(null);
  const rightEyeRef = useRef<SVGRectElement>(null);

  // Each pull has its own arm path + hand + terminal
  const armPathRefs = [
    useRef<SVGPathElement>(null), useRef<SVGPathElement>(null),
    useRef<SVGPathElement>(null), useRef<SVGPathElement>(null),
  ];
  const handRefs = [
    useRef<SVGRectElement>(null), useRef<SVGRectElement>(null),
    useRef<SVGRectElement>(null), useRef<SVGRectElement>(null),
  ];
  const termRefs = [
    useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null),
  ];

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;

      // Eye direction: subtle 2-pixel shift indicating the mascot's gaze, mirrors
      // whichever pull is currently active. Neutral (0,0) once all pulls are done.
      let lookDX = 0;
      let lookDY = 0;

      // ──────── Per-pull animation ────────
      for (let i = 0; i < 4; i++) {
        const target = PULL_TARGETS[i];
        const ts = PULL_START[i];
        const t = ms - ts;
        const armPath = armPathRefs[i].current;
        const hand = handRefs[i].current;
        const term = termRefs[i].current;
        if (!armPath || !hand || !term) continue;

        const shoulder = target.arm === "right" ? RIGHT_SHOULDER : LEFT_SHOULDER;

        let tipX = shoulder.x;
        let tipY = shoulder.y;
        let armOpacity = 0;
        let termX = target.startX;
        let termY = target.startY;
        let termOpacity = 0;
        const termScale = 1;

        if (t >= 0) {
          if (t < 450) {
            const reachP = eases.outCubic(t / 450);
            tipX = lerp(shoulder.x, target.startX, reachP);
            tipY = lerp(shoulder.y, target.startY, reachP);
            armOpacity = clamp(t / 80);
          } else if (t < 1000) {
            const pullP = eases.outCubic((t - 350) / 700);
            termX = lerp(target.startX, target.finalX, pullP);
            termY = lerp(target.startY, target.finalY, pullP);
            termOpacity = 1;

            const armSide = target.arm === "right" ? 1 : -1;
            const cornerXOff = 260;
            const cornerYOff = 170;
            tipX = termX + (armSide > 0 ? -cornerXOff : cornerXOff);
            tipY = termY + (target.startY < MASCOT_CY ? cornerYOff : -cornerYOff);
            armOpacity = 1;
          } else if (t < 1100) {
            const retractP = (t - 1000) / 100;
            const armSide = target.arm === "right" ? 1 : -1;
            const cornerXOff = 260;
            const cornerYOff = 170;
            const cornerTipX = target.finalX + (armSide > 0 ? -cornerXOff : cornerXOff);
            const cornerTipY = target.finalY + (target.startY < MASCOT_CY ? cornerYOff : -cornerYOff);
            tipX = lerp(cornerTipX, shoulder.x, retractP);
            tipY = lerp(cornerTipY, shoulder.y, retractP);
            armOpacity = 1 - retractP;
            termX = target.finalX;
            termY = target.finalY;
            termOpacity = 1;
          } else {
            tipX = shoulder.x;
            tipY = shoulder.y;
            armOpacity = 0;
            termX = target.finalX;
            termY = target.finalY;
            termOpacity = 1;
          }

          const lookProgress = t < 150 ? t / 150 : (t < 900 ? 1 : 1 - (t - 900) / 200);
          lookDX = target.look.dx * 2 * clamp(lookProgress);
          lookDY = target.look.dy * 2 * clamp(lookProgress);
        }

        // ── SLIDE-OUT (all 4 terminals, scene-local 4200-4900ms) ──
        const slideOutP = track(ms, 4200, 4900, eases.inOutCubic);
        if (slideOutP > 0 && t >= 0) {
          const slideDir = target.finalX > 960 ? 1 : -1;
          const slideOffset = slideDir * 1700 * slideOutP;
          termX = target.finalX + slideOffset;
          termY = target.finalY;
          termOpacity = 1;
          armOpacity = 0;
        }

        armPath.setAttribute("d", `M${shoulder.x},${shoulder.y} L${tipX},${tipY}`);
        armPath.style.opacity = String(armOpacity);
        hand.setAttribute("x", String(tipX - 15));
        hand.setAttribute("y", String(tipY - 15));
        hand.style.opacity = String(armOpacity);

        term.style.transform = `translate(${termX - 350}px, ${termY - 220}px) rotate(${target.rot2D}deg) scale(${termScale})`;
        term.style.opacity = String(termOpacity);
      }

      if (leftEyeRef.current) leftEyeRef.current.style.transform = `translate(${Math.round(lookDX)}px, ${Math.round(lookDY)}px)`;
      if (rightEyeRef.current) rightEyeRef.current.style.transform = `translate(${Math.round(lookDX)}px, ${Math.round(lookDY)}px)`;
    },
    []
  );

  return (
    <Timegroup mode="fixed" duration="6.5s" onFrame={handleFrame as any} className="absolute inset-0">
      <PaperBackground driftFrom={30} driftTo={45} durationMs={6500} />

      <div className="scene-3d" style={{ position: "absolute", inset: 0 }}>
        {/* Pulled-in terminals — each starts off-screen, animated in */}
        {PULL_TARGETS.map((target, i) => (
          <div
            key={i}
            ref={termRefs[i]}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 700,
              height: 440,
              opacity: 0,
              transformOrigin: "center center",
              zIndex: 4,
            }}
          >
            <Terminal width={700} height={440} title={`agent-${i + 1}`} bodyStyle={{ fontSize: 22, padding: "14px 20px" }}>
              <div style={{ color: "var(--claude-soft)" }}>⏺  ✓ findings ready</div>
              <div style={{ color: "var(--text-dim)", marginTop: 6 }}>⎿  reporting back to main session</div>
            </Terminal>
          </div>
        ))}

        {/* ARM EXTENSIONS — one per pull, drawn as SVG paths */}
        <svg
          width={1920}
          height={1080}
          viewBox="0 0 1920 1080"
          style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 7 }}
        >
          {armPathRefs.map((ref, i) => (
            <path
              key={`p${i}`}
              ref={ref}
              d=""
              stroke="var(--claude)"
              strokeWidth={22}
              strokeLinecap="square"
              fill="none"
              opacity={0}
              /* No drop-shadow — flat coral stroke per Claude brand rules. */
            />
          ))}
          {handRefs.map((ref, i) => (
            <rect key={`h${i}`} ref={ref} x={0} y={0} width={30} height={30} fill="var(--claude)" opacity={0} />
          ))}
        </svg>

        {/* Mascot wrapper — static position; fade-out on the way to Scene 4 is CSS. */}
        <div
          style={{
            position: "absolute",
            left: MASCOT_CX,
            top: MASCOT_CY,
            transform: "translate(-50%, -50%)",
            zIndex: 8,
          }}
        >
          <div style={{ animation: "mascot-fade-out 800ms 5500ms cubic-bezier(0.33,1,0.68,1) forwards" }}>
            <Mascot
              variant="cowboy"
              pixel={14}
              leftEyeRef={leftEyeRef}
              rightEyeRef={rightEyeRef}
              hatRef={(el) => {
                if (el) el.style.animation = "hat-remove 700ms 4400ms linear forwards";
              }}
            />
          </div>
        </div>
      </div>
    </Timegroup>
  );
};

export default Scene3_ArmPull;
