import React from "react";
import { Timegroup, Image, Video as Clip } from "@editframe/react";
import { Reveal } from "@shared/components/Reveal";
import { CornerMarks } from "../components/CornerMarks";
import { SCENES, WELL_B, COOL_OAT, INK, LINE, GEOGRAPH, STONE } from "../constants";

const POSTER_LANDSCAPE = "/allbirds-tree-runner-demo/src/assets/poster-landscape.jpg";

const eyebrow: React.CSSProperties = {
  fontFamily: GEOGRAPH, fontWeight: 500, textTransform: "uppercase",
  color: STONE, letterSpacing: "3px",
};

/**
 * WELL_B — landscape material-macro footage, "Tread Lighter" + carbon proof.
 * 5100ms local: the frame parallax-drifts in with a rack-focus blur resolve, then
 * contracts slightly during its own transition-out as RANGE's colorway grid takes over.
 */
export const WellB: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.wellB.duration}ms`} className="absolute inset-0">
    <div className="absolute" style={{ left: WELL_B.x, top: WELL_B.y - 230, width: WELL_B.w }}>
      <Reveal enter={[1250, 1950]} exit="transition" easeOut="in-cubic" y={22} style={{ fontFamily: GEOGRAPH, fontWeight: 500, fontSize: 92, color: INK, lineHeight: 1 }}>
        Tread Lighter
      </Reveal>
      <Reveal enter={[1600, 2300]} exit="transition" easeOut="in-cubic" y={18} style={{ ...eyebrow, fontSize: 16, marginTop: 22 }}>
        Give light. Tread lighter. · Carbon-negative sole
      </Reveal>
    </div>

    <div
      className="absolute overflow-hidden"
      style={{
        left: WELL_B.x, top: WELL_B.y, width: WELL_B.w, height: WELL_B.h, borderRadius: WELL_B.r,
        background: COOL_OAT, boxShadow: "0 30px 80px rgba(33,33,33,0.10)", border: `1px solid ${LINE}`,
        animation: [
          "wellb-frame-in 700ms 150ms cubic-bezier(0.33,1,0.68,1) backwards",
          "wellb-frame-out var(--ef-transition-duration) var(--ef-transition-out-start) cubic-bezier(0.45,0,0.55,1) forwards",
        ].join(", "),
      }}
    >
      <div className="absolute inset-0" style={{ animation: "well-poster-in 700ms 450ms cubic-bezier(0.33,1,0.68,1) backwards" }}>
        <Image src={POSTER_LANDSCAPE} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <Clip
          src="/allbirds-tree-runner-demo/src/assets/well-b-material-macro.mp4"
          duration={`${SCENES.wellB.duration}ms`}
          sourcein="0.5s"
          mute
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div className="absolute pointer-events-none" style={{ inset: 10, border: "1px solid rgba(255,255,255,0.5)", borderRadius: WELL_B.r - 8 }} />
    </div>

    <CornerMarks rect={WELL_B} startDelay={850} stagger={80} />
  </Timegroup>
);
