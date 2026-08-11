import React from "react";
import { Timegroup } from "@editframe/react";
import { Reveal } from "@shared/components/Reveal";
import { SCENES } from "../constants";

/**
 * HEADLINES — 0 → 5600ms local (own abs start = 8000 - 700 = 7300; the first
 * 700ms cross-fades in from Hero, last ~700ms cross-fades into Command).
 *
 * "Long-running tasks / shouldn't run your life" floats in (two lines,
 * staggered), holds, fades; "Introducing Opus 4.8" floats in, holds, fades as
 * the terminal returns for the Command scene.
 *
 * Note: the original headline-2 exit (300ms, starting 5400ms local) would run
 * 100ms past this scene's own 5600ms duration — clipped here to a 200ms fade
 * finishing exactly at the scene boundary; a 100ms faster fade is not
 * perceptible at this scale.
 *
 * The creature + kites roaming behind these headlines are NOT rendered here —
 * see `CreatureAndKites` (a sibling of the whole scene sequence in Video.tsx).
 */
export const Headlines: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.headlines.duration}ms`} className="absolute inset-0">
    <div className="absolute left-1/2 top-1/2" style={{ transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <Reveal enter={[700, 1300]} exit={[3266, 3616]} easeOut="in-cubic" y={28} className="headline" style={{ fontSize: 96, lineHeight: 1.08 }}>
        Long-running tasks
      </Reveal>
      <Reveal enter={[1700, 2300]} exit={[3266, 3616]} easeOut="in-cubic" y={28} className="headline" style={{ fontSize: 96, lineHeight: 1.08 }}>
        shouldn't run your life
      </Reveal>
    </div>

    <div className="absolute left-1/2 top-1/2" style={{ transform: "translate(-50%, -50%)" }}>
      <Reveal enter={[3617, 4217]} exit={[5400, 5600]} easeOut="in-cubic" y={28} className="headline" style={{ fontSize: 104, lineHeight: 1.08 }}>
        Introducing Opus 4.8
      </Reveal>
    </div>
  </Timegroup>
);

export default Headlines;
