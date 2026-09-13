import React from "react";
import { Timegroup } from "@editframe/react";
import { AVAILABLE_MS } from "../constants";

export const Available = () => (
  <Timegroup mode="fixed" duration={`${AVAILABLE_MS}ms`} className="absolute w-full h-full bg-white">
    <div className="s6-line">
      <span className="s6-w1">Now</span>
      <span className="s6-w2"> available</span>
      <span className="s6-w3"> for</span>
      <span className="s6-w4"> Teams</span>
      <span className="s6-w5"> and</span>
      <span className="s6-w6"> Enterprises</span>
    </div>
  </Timegroup>
);
