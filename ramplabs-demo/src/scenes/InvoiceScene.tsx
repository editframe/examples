import React from "react";
import { Timegroup } from "@editframe/react";
import { Invoice } from "../Invoice";
import { Headline } from "../Headline";
import { duration, FRAMES } from "../timing";

export function InvoiceScene() {
  return <Timegroup mode="fixed" duration={duration(FRAMES.invoice)} className="scene invoice-scene">
    <Invoice />
    <Headline className="headline-one" lines={["AI is the fastest-growing software line item."]} />
  </Timegroup>;
}


