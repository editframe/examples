import React from "react";
import { Timegroup } from "@editframe/react";
import { IconCursorCube } from "../components/JiraIcons";
import { Reveal } from "@shared/components/Reveal";

/**
 * Final logo card (3.5s) — Cursor mark + wordmark on black.
 * NO EDITFRAME watermark (per regression ledger universal rule #5).
 *   0–600     Cursor mark + "Cursor" wordmark fade up
 *   600–3000  Hold
 *   3000–3500 Gentle fade out
 *
 * Fully CSS-driven via `Reveal` — no `onFrame`/refs (see REFACTOR-PATTERNS.md Part 2b).
 */
export const LogoCard: React.FC = () => {
  return (
    <Timegroup mode="fixed" duration="3.5s" className="absolute inset-0">
      {/* Solid black */}
      <div style={{ position: "absolute", inset: 0, background: "#000000" }} />

      {/* Center: Cursor cube + wordmark */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          gap: 38,
        }}
      >
        <Reveal
          enter={[0, 600]}
          exit={[3000, 3500]}
          easeOut="out-cubic"
          y={0}
          scaleFrom={0.72}
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <IconCursorCube size={150} color="#FFFFFF" notch="#000000" />
        </Reveal>
        <Reveal
          enter={[0, 600]}
          exit={[3000, 3500]}
          easeOut="out-cubic"
          y={14}
          style={{
            color: "#FFFFFF",
            fontFamily: "Inter, sans-serif",
            fontSize: 132,
            fontWeight: 500,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          Cursor
        </Reveal>
      </div>
    </Timegroup>
  );
};

export default LogoCard;
