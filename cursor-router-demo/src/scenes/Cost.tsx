import React from "react";
import { Timegroup } from "@editframe/react";
import { COST_MS } from "../constants";

const S4_ROWS = [
  { name: "Fable 5", price: "$12.69", green: false },
  { name: "GPT-5.6 Sol", price: "$6.77", green: false },
  { name: "Balance", price: "$4.63", green: false },
  { name: "Intelligence", price: "$6.76", green: false },
  { name: "Opus 4.8", price: "$7.34", green: false },
  { name: "Composer", price: "$1.49", green: false },
  { name: "Grok 4.5", price: "$2.91", green: false },
  { name: "Cursor Router", price: "$1.38", green: true },
];

export const Cost = () => (
  <Timegroup mode="fixed" duration={`${COST_MS}ms`} className="absolute w-full h-full bg-white">
    <div className="s4-wrap">
      <div className="s4-title">Cost per commit</div>
      <div className="s4-col">
        {S4_ROWS.map((r, i) => (
          <div
            key={r.name}
            className="s4-row s4-fade"
            style={{ top: i * 83.33, animationDelay: `${i * 30}ms`, animationDuration: i === 0 ? "60ms" : "130ms" }}
          >
            <div className={`s4-var s4-pale${r.green ? " green" : ""} s4-p${i + 1}`}>
              <span className="s4-name">{r.name}</span>
              <span className="s4-loz">{r.price}</span>
            </div>
            <div className={`s4-var s4-focus${r.green ? " green" : ""} s4-f${i + 1}`}>
              <span className="s4-name">{r.name}</span>
              <span className="s4-loz">{r.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Timegroup>
);
