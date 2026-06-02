import React from "react";
import { TRACE_MODE } from "../constants";

/**
 * CreamBackdrop — solid cream background fill.
 *
 * TRACE_MODE awareness: when TRACE_MODE is true, this renders as fully transparent
 * so the TraceLayer ghost beneath remains visible. When TRACE_MODE is false, fills
 * with the cream brand color. This prevents the backdrop from occluding the
 * tracing-paper reference during build/verification.
 *
 * Variants:
 *   "dark"   → #EFECE3 (Scenes 1, 2, 6, 7 — opener cream)
 *   "light"  → #FAF7F1 (Scenes 3, 4, 5 — brighter cream for chrome view)
 */
interface CreamBackdropProps {
  variant?: "dark" | "light";
  style?: React.CSSProperties;
}

export function CreamBackdrop({ variant = "dark", style }: CreamBackdropProps) {
  // During trace mode, render fully transparent so the blueprint shows through.
  if (TRACE_MODE) {
    return null;
  }

  const bg = variant === "light" ? "#FAF7F1" : "#EFECE3";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        background: bg,
        zIndex: 1,
        ...style,
      }}
    />
  );
}
