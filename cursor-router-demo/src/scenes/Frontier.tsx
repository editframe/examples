import React from "react";
import { Timegroup } from "@editframe/react";
import { FRONTIER_MS } from "../constants";

export const Frontier = () => (
  <Timegroup mode="fixed" duration={`${FRONTIER_MS}ms`} className="absolute w-full h-full bg-white">
    <div className="s1-line1">Frontier intelligence</div>
    <div className="s1-line2">
      <span className="s1-at">at </span>
      <span className="s1-pct-slot">
        <span className="sizer">60%</span>
        <span className="ov s1-p55">55%</span>
        <span className="ov s1-p56">56%</span>
        <span className="ov s1-p57">57%</span>
        <span className="ov s1-p58">58%</span>
        <span className="ov s1-p59">59%</span>
        <span className="ov s1-p60">60%</span>
      </span>
      <span className="s1-lower"> lower</span>
      <span className="s1-cost"> cost</span>
    </div>
  </Timegroup>
);
