import React from "react";
import { Timegroup } from "@editframe/react";
import { Reveal } from "../components/Reveal";
import { SCENES, FONT } from "../constants";

/**
 * OUTRO TITLE — "Linear for Agents" full title card, near-black background.
 * 3950ms local: "Linear for" is visible immediately, "Agents" joins ~300ms later,
 * then the whole card holds and fades out at the end of the scene.
 */
export const OutroTitle: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.outroTitle.duration}ms`} className="absolute inset-0">
    <Reveal enter={[0, 260]} exit={[3400, 3900]} y={0} className="absolute inset-0 flex items-center justify-center">
      <span style={{ color: "#FFFFFF", fontSize: 84, fontWeight: 500, fontFamily: FONT, letterSpacing: "-2px" }}>
        <span>Linear for&nbsp;</span>
        <span style={{ opacity: 0, animation: "title-agents-in 220ms 300ms cubic-bezier(0.33,1,0.68,1) both" }}>Agents</span>
      </span>
    </Reveal>
  </Timegroup>
);
