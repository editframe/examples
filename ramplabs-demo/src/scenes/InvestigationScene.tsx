import React from "react";
import { Timegroup } from "@editframe/react";
import { Investigation } from "../Investigation";
import { Headline } from "../Headline";
import { duration, FRAMES } from "../timing";

export function InvestigationScene() {
  return <Timegroup mode="fixed" duration={duration(FRAMES.investigation)} className="scene investigation-scene">
    <div className="investigation-art"><Investigation /></div>
    <div className="investigation-copy">
    <Headline className="body-copy" lines={["In one example, an engineer", "asked our internal coding agent", "why an onboarding system was", "creating the same job twice."]} />
    <Headline className="sub-copy" lines={["The investigation involved eight linked sessions", "across three repositories."]} />
    </div>
  </Timegroup>;
}


