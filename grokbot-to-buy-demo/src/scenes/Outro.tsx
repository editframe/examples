import React from "react";
import { Timegroup } from "@editframe/react";
import { OUTRO_MS } from "../constants";

/**
 * Outro — Grok Bot lockup (7.966–11.333s).
 *
 * Motion stays in outro.css (2.266s keyframe window + hold). Local clock
 * is 0 at scene start, matching the original 3367ms Timegroup.
 */
export const Outro: React.FC = () => (
  <Timegroup mode="fixed" duration={`${OUTRO_MS}ms`} className="scene outro">
    <div className="handoff-ball" />
    <div className="handoff-eye" />
    <div className="handoff-eye second" />
    <div className="handoff-word">Grok</div>
    <div className="handoff-word bot">Bot</div>
  </Timegroup>
);
