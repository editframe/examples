import React from "react";
import { Timegroup } from "@editframe/react";
import { Check } from "../components/Check";
import { OPTIMIZE_MS } from "../constants";

export const Optimize = () => (
  <Timegroup mode="fixed" duration={`${OPTIMIZE_MS}ms`} className="absolute w-full h-full" style={{ background: "#E5E3DF" }}>
    <div className="s2-btn">
      <div className="s2-btn-inner">
        <span className="s2-btn-label">Auto</span>
        <span className="s2-btn-check"><Check color="#1A1A1A" w={36} h={26} /></span>
      </div>
    </div>
    <div className="s2-popup">
      <div className="s2-band s2-band-int s2-w1" />
      <div className="s2-band s2-band-bal s2-w2" />
      <div className="s2-band s2-band-cost s2-w3" />
      <div className="s2-title">Optimize For</div>
      <div className="s2-row s2-row-int">
        <span className="black s2-w1i">Intelligence</span>
        <span className="colored s2-c-orange s2-w1">Intelligence</span>
      </div>
      <div className="s2-row s2-row-bal">
        <span className="black s2-w2i">Balance</span>
        <span className="colored s2-c-green s2-w2">Balance</span>
      </div>
      <div className="s2-row s2-row-cost">
        <span className="black s2-w3i">Cost</span>
        <span className="colored s2-c-blue s2-w3">Cost</span>
      </div>
      <div className="s2-check s2-check-int s2-w1"><Check color="#E96E56" /></div>
      <div className="s2-check s2-check-bal s2-w2"><Check color="#10AE52" /></div>
      <div className="s2-check s2-check-cost s2-w3"><Check color="#3B74EA" /></div>
    </div>
  </Timegroup>
);
