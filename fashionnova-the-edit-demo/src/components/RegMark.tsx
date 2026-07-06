import React from "react";

/** Static HUD reg/cross-hair mark (camera-registration look) — used at frame corners across scenes. */
export const RegMark: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div style={{ position: "absolute", width: 34, height: 34, ...style }}>
    <div style={{ position: "absolute", left: "50%", top: 0, width: 1.5, height: "100%", background: "rgba(0,0,0,0.55)", transform: "translateX(-50%)" }} />
    <div style={{ position: "absolute", top: "50%", left: 0, height: 1.5, width: "100%", background: "rgba(0,0,0,0.55)", transform: "translateY(-50%)" }} />
    <div style={{ position: "absolute", inset: 9, border: "1.5px solid rgba(0,0,0,0.55)", borderRadius: "50%" }} />
  </div>
);
