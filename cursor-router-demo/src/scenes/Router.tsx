import React from "react";
import { Timegroup } from "@editframe/react";
import { ROUTER_MS } from "../constants";

export const Router = () => (
  <Timegroup mode="fixed" duration={`${ROUTER_MS}ms`} className="absolute w-full h-full" style={{ background: "#F4F4F4" }}>
    <div className="s3-wrap">
      <div className="s3-grpL">
        <div className="s3-lbox s3-el">
          <div className="s3-copy s3-orange" style={{ width: 312 }}>Build a new UI</div>
          <div className="s3-copy s3-blue" style={{ width: 268 }}>Hard debug</div>
          <div className="s3-copy s3-green" style={{ width: 220 }}>Run tests</div>
        </div>
        <div className="s3-arrow s3-a1">
          {[45, 87, 160, 204, 232, 251].map((w) => (
            <div key={w} className={`st s3-a1w${w}`} style={{ width: w }}>
              <div className="line" />
              <div className="hb hb1" />
              <div className="hb hb2" />
            </div>
          ))}
        </div>
        <div className="s3-router"><span className="s3-router-txt">Router</span></div>
        <div className="s3-arrow s3-a2">
          {[60, 120, 180, 230, 270].map((w) => (
            <div key={w} className={`st2 s3-a2w${w}`} style={{ width: w === 270 ? 250 : w === 230 ? 220 : w }}>
              <div className="line" />
              <div className="hb hb1" />
              <div className="hb hb2" />
            </div>
          ))}
        </div>
        <div className="s3-rbox s3-el">
          <div className="s3-copy s3-orange" style={{ width: 192 }}><span className="s3-rbox-txt">Grok 4.5</span></div>
          <div className="s3-copy s3-blue" style={{ width: 207 }}><span className="s3-rbox-txt">Opus 4.8</span></div>
          <div className="s3-copy s3-green" style={{ width: 239 }}><span className="s3-rbox-txt">Composer</span></div>
        </div>
      </div>
    </div>
  </Timegroup>
);
