import React from "react";
import { Timegroup } from "@editframe/react";
import { Chart } from "../Chart";
import { Investigation } from "../Investigation";
import { Headline } from "../Headline";
import { duration, FRAMES } from "../timing";

export function SeparationScene() {
  return <Timegroup mode="fixed" duration={duration(FRAMES.separation)} className="scene separation-scene">
    <Chart separated />
    <Headline className="headline-three" lines={["We built a system that separates and labels", "the work inside each agent run."]} />
    <Timegroup mode="sequence" style={{ position: "absolute", inset: 0 }}>
      <Timegroup mode="fixed" duration="5.366666667s" />
      <Timegroup mode="fixed" duration="0.066666667s">
        <Investigation intro />
      </Timegroup>
    </Timegroup>
  </Timegroup>;
}




