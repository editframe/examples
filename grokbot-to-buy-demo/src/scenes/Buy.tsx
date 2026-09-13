import React from "react";
import { Timegroup } from "@editframe/react";
import { MiniMark } from "./components/MiniMark";
import { BUY_MS } from "../constants";

/**
 * Buy — ball / eyes / card + caption (0–7.966s).
 *
 * Motion stays in motion.css + card-perspective.css; local clock is 0 at
 * scene start, matching the original 7966ms CSS animation window.
 */
export const Buy: React.FC = () => (
  <Timegroup mode="fixed" duration={`${BUY_MS}ms`} className="scene main-scene">
    <div className="ball" />
    <div className="eye eye0" />
    <div className="eye eye1" />
    <div className="card">
      <div className="card-front">
        <div className="stripe" />
        <div className="field" />
        <div className="lines"><i /><i /><i /></div>
        <div className="brand"><MiniMark />Grok Bot</div>
      </div>
      <div className="card-back"><div className="swoop" /><i /><i /></div>
      <div className="card-shade" />
    </div>
    <div className="caption">Bot can now buy anything<br />on the internet.</div>
  </Timegroup>
);
