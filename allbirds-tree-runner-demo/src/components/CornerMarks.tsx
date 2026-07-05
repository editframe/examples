import React from "react";
import { W, H, INK } from "../constants";

type Rect = { x: number; y: number; w: number; h: number; r: number };
const CORNERS = ["tl", "tr", "bl", "br"] as const;

/**
 * Four L-shaped corner marks just outside a well frame, staggered in via CSS
 * (`animation-delay: startDelay + index * stagger`) instead of a per-frame `.forEach`.
 */
export function CornerMarks({
  rect,
  startDelay,
  stagger = 80,
  duration = 400,
}: {
  rect: Rect;
  startDelay: number;
  stagger?: number;
  duration?: number;
}) {
  const border = `2px solid ${INK}`;
  return (
    <>
      {CORNERS.map((corner, i) => {
        const style: React.CSSProperties = {
          position: "absolute",
          width: 26,
          height: 26,
          animation: `well-corner-in ${duration}ms ${startDelay + i * stagger}ms cubic-bezier(0.33,1,0.68,1) backwards`,
        };
        if (corner[0] === "t") {
          style.top = rect.y - 13;
          style.borderTop = border;
        } else {
          style.bottom = H - (rect.y + rect.h) - 13;
          style.borderBottom = border;
        }
        if (corner[1] === "l") {
          style.left = rect.x - 13;
          style.borderLeft = border;
        } else {
          style.right = W - (rect.x + rect.w) - 13;
          style.borderRight = border;
        }
        style.transformOrigin =
          corner === "tl" ? "top left" : corner === "tr" ? "top right" : corner === "bl" ? "bottom left" : "bottom right";
        return <div key={corner} style={style} />;
      })}
    </>
  );
}
