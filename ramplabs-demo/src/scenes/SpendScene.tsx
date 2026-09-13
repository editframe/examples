import React from "react";
import { Timegroup } from "@editframe/react";
import { Invoice } from "../Invoice";
import { Chart } from "../Chart";
import { Headline } from "../Headline";
import { duration, FRAMES } from "../timing";

export function SpendScene() {
  return <Timegroup mode="fixed" duration={duration(FRAMES.spend)} className="scene spend-scene">
    <Invoice tail />
    <Chart />
    <Headline className="headline-two" lines={["But your AI bill shows how much you spent", "not what you spent it on."]} />
  </Timegroup>;
}


