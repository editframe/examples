import React from "react";
import { Timegroup } from "@editframe/react";
import { OUTRO_DURATION } from "../constants";

/** Grok Bot lockup handoff (7.733–10s). */
export const Outro: React.FC = () => (
  <Timegroup mode="fixed" duration={OUTRO_DURATION} className="scene outro">
    <div className="handoff-ball" />
    <div className="handoff-eye" />
    <div className="handoff-eye second" />
    <div className="handoff-word">Grok</div>
    <div className="handoff-word bot">Bot</div>
  </Timegroup>
);
