import React from "react";
import { BLACK } from "../constants";

const WIDTHS = [3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 5, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 1];

/** Static vertical-bar barcode (mono) — used in swing-ticket tags and the spec-stack footer. */
export const Barcode: React.FC<{ w: number; h: number; color?: string }> = ({ w, h, color = BLACK }) => (
  <div style={{ display: "flex", gap: 2, width: w, height: h, alignItems: "stretch" }}>
    {WIDTHS.map((bw, i) => (
      <div key={i} style={{ width: bw, background: color, flex: "0 0 auto" }} />
    ))}
  </div>
);
