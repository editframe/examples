import React from "react";
import { Timegroup } from "@editframe/react";
import { Android } from "../components/Android";
import { ANNOUNCEMENT_DURATION } from "../constants";

const WORDS = ["Grok", "Bot", "is", "now", "available", "on", "Android"] as const;
const DELAYS = [0, 0.2, 0.333, 0.5, 0.667, 0.833, 0.967] as const;

/** Word-by-word announcement + Android mark (5.3–7.733s). */
export const Announcement: React.FC = () => (
  <Timegroup mode="fixed" duration={ANNOUNCEMENT_DURATION} className="scene announcement">
    <div className="sentence">
      {WORDS.map((word, i) => (
        <span key={word} style={{ animationDelay: `${DELAYS[i]}s` }}>
          {word}
          {i < 6 ? " " : ""}
          {i === 6 ? <Android /> : null}
        </span>
      ))}
    </div>
  </Timegroup>
);
