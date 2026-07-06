import React from "react";
import { DURATION_MS } from "../constants";

/**
 * Sage-green background with SPARSE, large, hand-drawn intersecting topographic
 * curves (matches the Opus 4.8 ad — NOT dense horizontal stripes).
 *
 * The curves are a fixed set of long, gently-bending strokes that cross each
 * other like park trails / contour lines. Very low contrast (#C7D8CF on
 * #BCD2C8). The container is oversized so a subtle parallax drift never shows
 * an edge.
 *
 * Rendered as a sibling of the scene sequence (whole-video ambient drift), so its
 * own local time equals the composition's absolute time — the `bg-drift` keyframe
 * below runs once, linearly, across the full `DURATION_MS`, replacing the old
 * per-frame `ms / 25000` ref mutation.
 */
const Background: React.FC = () => {
  // A hand-authored set of long, crossing organic strokes (in a 2400×1320 space).
  // Each path is a smooth cubic that spans most of the canvas at a shallow angle.
  const strokes: string[] = [
    "M -120,260 C 360,180 760,420 1180,300 S 1900,160 2520,360",
    "M -80,720 C 420,860 820,560 1240,760 S 1980,940 2540,700",
    "M 300,-80 C 460,360 380,760 620,1140 S 760,1420 700,1500",
    "M 1640,-100 C 1560,300 1760,640 1620,1020 S 1500,1300 1640,1480",
    "M -120,1060 C 520,980 980,1180 1500,1020 S 2080,860 2540,1040",
    "M 980,-60 C 1100,340 920,720 1180,1080 S 1340,1340 1240,1480",
    "M -100,460 C 300,520 540,300 920,460 S 1480,640 1880,440 S 2300,300 2540,460",
    "M 1980,180 C 1700,420 2080,760 1840,1080",
    "M 120,140 C 360,420 180,720 420,980",
    "M 1320,1480 C 1380,1120 1180,820 1360,460 S 1480,180 1420,-40",
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "var(--paper)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -120,
          left: -240,
          width: 2400,
          height: 1320,
          willChange: "transform",
          animation: `bg-drift ${DURATION_MS}ms linear both`,
        }}
      >
        <svg
          width="2400"
          height="1320"
          viewBox="0 0 2400 1320"
          style={{ display: "block" }}
        >
          {strokes.map((d, i) => (
            <path
              key={i}
              d={d}
              stroke="var(--topo)"
              strokeWidth={i % 3 === 0 ? 8 : 6}
              fill="none"
              strokeLinecap="round"
              opacity={0.9}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};
export default Background;
