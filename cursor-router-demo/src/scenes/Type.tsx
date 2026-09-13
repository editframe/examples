import React from "react";
import { Timegroup } from "@editframe/react";
import { TYPE_MS } from "../constants";

const S5_STATES = ["Cursor", "Cursor R", "Cursor Ro", "Cursor Rou", "Cursor Rout", "Cursor Route", "Cursor Router"];

export const Type = () => (
  <Timegroup mode="fixed" duration={`${TYPE_MS}ms`} className="absolute w-full h-full bg-white">
    {S5_STATES.map((s, i) => (
      <div key={i} className={`s5-state s5-st${i}`}>{s}</div>
    ))}
  </Timegroup>
);
