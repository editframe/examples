import React, { forwardRef } from "react";

/**
 * Faint serif headline on sage, centered. Low-contrast grey (#8EA49A).
 * Used for:
 *   "Long-running tasks" / "shouldn't run your life"  (two lines)
 *   "Introducing Opus 4.8"                            (one line)
 *
 * The ref-driven parent animates opacity + translateY. Lines are passed as an
 * array so the scene can stagger them.
 */

interface Props {
  lines: string[];
  fontSize?: number;
  lineRefs?: (React.Ref<HTMLDivElement> | undefined)[];
  style?: React.CSSProperties;
}

const Headline = forwardRef<HTMLDivElement, Props>(
  ({ lines, fontSize = 96, lineRefs, style }, ref) => (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        ...style,
      }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          ref={lineRefs?.[i]}
          className="headline"
          style={{ fontSize, lineHeight: 1.08, opacity: 0 }}
        >
          {line}
        </div>
      ))}
    </div>
  )
);
Headline.displayName = "Headline";
export default Headline;
