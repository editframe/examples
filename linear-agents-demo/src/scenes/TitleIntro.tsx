import React from "react";
import { Timegroup } from "@editframe/react";
import { SCENES, FONT } from "../constants";

/**
 * TITLE INTRO — "Linear for Agents" fades in, holds, fades out on near-black.
 * 1767ms local: fade in over the first 400ms, hold, fade out over the last 334ms
 * (ends exactly at this scene's own boundary — the next scene, Backlog, begins on a
 * hard cut once this one is fully invisible).
 */
export const TitleIntro: React.FC = () => (
  <Timegroup
    mode="fixed"
    duration={`${SCENES.titleIntro.duration}ms`}
    className="absolute inset-0 flex items-center justify-center"
  >
    <span
      style={{
        color: "#FFFFFF", fontSize: 84, fontWeight: 500, fontFamily: FONT, letterSpacing: "-2px",
        animation: [
          "title-in 400ms 0ms cubic-bezier(0.33,1,0.68,1) both",
          "title-out 334ms 1433ms cubic-bezier(0.32,0,0.67,0) both",
        ].join(", "),
      }}
    >
      Linear for Agents
    </span>
  </Timegroup>
);
