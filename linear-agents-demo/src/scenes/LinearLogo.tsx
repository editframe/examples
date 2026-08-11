import React from "react";
import { Timegroup } from "@editframe/react";
import { Reveal } from "@shared/components/Reveal";
import { SCENES, FONT } from "../constants";

/**
 * LINEAR LOGO — the Linear mark + wordmark, final beat, fades in/out on near-black.
 * 1900ms local: fades in over the first 550ms, holds, fades out over the last 483ms.
 */
export const LinearLogo: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.linearLogo.duration}ms`} className="absolute inset-0">
    <Reveal enter={[0, 550]} exit={[1250, 1733]} y={0} className="absolute inset-0 flex items-center justify-center">
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Linear icon: light disc with 3 short diagonal stripes carved into the lower-left
            (bottom-left → top-right). */}
        <svg width="76" height="76" viewBox="0 0 76 76" fill="none">
          <defs>
            <clipPath id="linear-disc"><circle cx="38" cy="38" r="30" /></clipPath>
          </defs>
          <circle cx="38" cy="38" r="30" fill="#E4E4E6" />
          {/* Rotate the cut group -45° about the disc centre so the bars run bottom-left→top-right.
              In rotated space the bars are horizontal; placing them BELOW centre (y>38) pushes the
              stripes into the lower-left of the disc. */}
          <g clipPath="url(#linear-disc)" transform="rotate(-45 38 38)">
            <rect x="8" y="46" width="60" height="5" fill="#111115" />
            <rect x="8" y="55" width="60" height="5" fill="#111115" />
            <rect x="8" y="64" width="60" height="5" fill="#111115" />
          </g>
        </svg>
        <span style={{ color: "#E4E4E6", fontSize: 64, fontWeight: 500, fontFamily: FONT, letterSpacing: "-1.5px" }}>Linear</span>
      </div>
    </Reveal>
  </Timegroup>
);
