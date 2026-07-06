import React from "react";

/**
 * CreamBackdrop — solid cream background fill.
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
