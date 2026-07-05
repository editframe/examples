import React from "react";
import { Timegroup, Image, Video as Clip } from "@editframe/react";
import { Reveal } from "../components/Reveal";
import { SCENES, WELL_A, COOL_OAT, INK, LINE, GEOGRAPH, STONE } from "../constants";
import { CornerMarks } from "../components/CornerMarks";

const POSTER_PORTRAIT = "/assets/poster-portrait.jpg";

const eyebrow: React.CSSProperties = {
  fontFamily: GEOGRAPH, fontWeight: 500, textTransform: "uppercase",
  color: STONE, letterSpacing: "3px",
};

/**
 * WELL_A — portrait lifestyle footage fills the framed well.
 * 5600ms local: first 600ms is the tail of Hero's tile-morph; the well frame itself
 * assembles right after. Feat's own incoming knit-wipe (see scenes/Feat.tsx) is what
 * visually erases this scene, so nothing here needs its own exit animation.
 */
export const WellA: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.wellA.duration}ms`} className="absolute inset-0">
    <div
      className="absolute overflow-hidden"
      style={{
        left: WELL_A.x, top: WELL_A.y, width: WELL_A.w, height: WELL_A.h, borderRadius: WELL_A.r,
        background: COOL_OAT, boxShadow: "0 30px 80px rgba(33,33,33,0.10)", border: `1px solid ${LINE}`,
        animation: "well-frame-in 550ms 550ms cubic-bezier(0.33,1,0.68,1) backwards",
      }}
    >
      <div className="absolute inset-0" style={{ animation: "well-poster-in 600ms 650ms cubic-bezier(0.33,1,0.68,1) backwards" }}>
        <Image src={POSTER_PORTRAIT} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <Clip
          src="/assets/well-a-people-walk.mp4"
          duration={`${SCENES.wellA.duration}ms`}
          sourcein="0.5s"
          mute
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      {/* thin inner mat line */}
      <div className="absolute pointer-events-none" style={{ inset: 10, border: "1px solid rgba(255,255,255,0.5)", borderRadius: WELL_A.r - 8 }} />
    </div>

    <CornerMarks rect={WELL_A} startDelay={850} stagger={80} />

    {/* copy block above the well */}
    <div className="absolute" style={{ left: WELL_A.x, top: WELL_A.y - 170, width: WELL_A.w }}>
      <Reveal enter={[1150, 1700]} exit="transition" easeOut="in-cubic" y={18} style={{ ...eyebrow, fontSize: 15 }}>
        Comfort, naturally
      </Reveal>
      <Reveal
        enter={[1400, 2100]}
        exit="transition"
        easeOut="in-cubic"
        y={22}
        style={{ fontFamily: GEOGRAPH, fontWeight: 500, fontSize: 54, color: INK, marginTop: 14, lineHeight: 1.05 }}
      >
        Wear-all-day<br />comfort
      </Reveal>
    </div>
  </Timegroup>
);
