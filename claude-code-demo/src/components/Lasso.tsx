import React from "react";

/**
 * Yellow lasso loop — a separate SVG so the parent can spin it
 * imperatively via transform rotate(). Position your wrapper at the
 * mascot's hand-up point and this oval will spin around its anchor.
 */

interface Props {
  size?: number;
  style?: React.CSSProperties;
}

const Lasso = React.forwardRef<SVGSVGElement, Props>(({ size = 48, style }, ref) => {
  // Oval rendered with chunky stroke; viewBox is square so rotation works around center
  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={{
        willChange: "transform",
        transformOrigin: "center center",
        ...style,
      }}
    >
      <ellipse
        cx={24}
        cy={24}
        rx={20}
        ry={9}
        stroke="var(--lasso)"
        strokeWidth={3.2}
        fill="none"
      />
      {/* short rope tail dangling down from one edge of the oval */}
      <line
        x1={4}
        y1={24}
        x2={2}
        y2={36}
        stroke="var(--lasso)"
        strokeWidth={3}
      />
    </svg>
  );
});
Lasso.displayName = "Lasso";
export default Lasso;
