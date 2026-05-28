import React, { forwardRef } from "react";

/**
 * Stretchy mascot arm — drawn as a chunky claude-orange rounded rectangle
 * extending from a fixed shoulder position to a moving "hand" position.
 *
 * The parent updates the path's d attribute each frame to grow/shrink the arm.
 * A "hand" circle is drawn at the tip.
 */

interface Props {
  shoulderX: number;   // body anchor in screen px
  shoulderY: number;
  pathRef?: React.Ref<SVGPathElement>;
  handRef?: React.Ref<SVGCircleElement>;
  thickness?: number;
  zIndex?: number;
}

const ArmExtension = forwardRef<SVGSVGElement, Props>(
  ({ shoulderX, shoulderY, pathRef, handRef, thickness = 22, zIndex = 8 }, ref) => {
    return (
      <svg
        ref={ref}
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex,
        }}
      >
        {/* Arm body — a path that starts at shoulder, ends at hand.
            Initially zero-length (collapsed at shoulder). */}
        <path
          ref={pathRef}
          d={`M${shoulderX},${shoulderY} L${shoulderX},${shoulderY}`}
          stroke="var(--claude)"
          strokeWidth={thickness}
          strokeLinecap="square"
          fill="none"
          opacity={0}
        />
        {/* Hand — a small square at the tip */}
        <rect
          ref={handRef as any}
          x={shoulderX - thickness * 0.7}
          y={shoulderY - thickness * 0.7}
          width={thickness * 1.4}
          height={thickness * 1.4}
          fill="var(--claude)"
          opacity={0}
        />
      </svg>
    );
  }
);
ArmExtension.displayName = "ArmExtension";
export default ArmExtension;
