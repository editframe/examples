import React from "react";
import { WHITE } from "../constants";

/**
 * Quick white flash at the very start of an incoming scene's own local clock — the
 * punchy "scene cut" hit every beat but the first used to get from a shared master-ms
 * `flashRef`. Split per-scene it's just a one-shot opacity pulse at local t=0, no JS.
 */
export const CutFlash: React.FC = () => (
  <div className="absolute pointer-events-none" style={{ inset: -40, background: WHITE, opacity: 0, animation: "cut-flash 190ms 0ms ease-out both" }} />
);
