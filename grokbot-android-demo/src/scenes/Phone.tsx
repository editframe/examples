import React from "react";
import { Timegroup } from "@editframe/react";
import { Card } from "../components/Card";
import { Wallpaper } from "../components/Wallpaper";
import { PHONE_DURATION } from "../constants";

/** Lock screen with two notification cards (0–5.3s). */
export const Phone: React.FC = () => (
  <Timegroup mode="fixed" duration={PHONE_DURATION} className="scene phone-scene">
    <div className="phone">
      <Wallpaper />
    </div>
    <div className="chrome">
      <span className="carrier">Starlink</span>
      <div className="camera" />
      <svg className="signals" viewBox="0 0 100 35">
        <path fill="white" d="M0 11Q15-1 30 11L15 28ZM37 28 62 3v25Z" />
        <rect x="72" y="6" width="15" height="24" rx="3" fill="white" />
        <rect x="77" y="2" width="5" height="5" fill="white" />
      </svg>
      <div className="clock">9:30</div>
      <div className="date">Tues Sep 1</div>
      <div className="greeting">Good morning, Luke</div>
    </div>
    <Card />
    <Card benji />
  </Timegroup>
);
