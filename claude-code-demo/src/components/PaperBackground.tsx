import React from "react";

/**
 * Sage-green wavy paper background.
 * Two layers of curved horizontal stripes at different frequencies + opacity
 * create the hand-drawn topographic feel from the Anthropic reference.
 * The container is 1.2× wider than the viewport so a subtle parallax drift
 * (-30px to +30px range) reveals new strokes without ever showing the edge.
 */

const PaperBackground = React.forwardRef<HTMLDivElement>((_, ref) => {
  // Pre-generate two sets of wave paths at different phase offsets
  const waves: { y: number; amp: number; freq: number; opacity: number; stroke: string }[] = [];
  for (let i = 0; i < 28; i++) {
    waves.push({
      y: 40 + i * 80 + (i % 3) * 8,
      amp: 12 + (i % 5) * 2,
      freq: 0.0042 + ((i % 4) * 0.0008),
      opacity: 0.10 + (i % 6) * 0.015,
      stroke: i % 5 === 0 ? "#7AA086" : "#8FAA94",
    });
  }

  const makePath = (y: number, amp: number, freq: number) => {
    const points: string[] = [];
    for (let x = 0; x <= 2400; x += 12) {
      const yy = y + Math.sin(x * freq) * amp + Math.sin(x * freq * 2.3) * amp * 0.3;
      points.push(`${x === 0 ? "M" : "L"}${x},${yy.toFixed(1)}`);
    }
    return points.join(" ");
  };

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
        ref={ref}
        style={{
          position: "absolute",
          top: 0,
          left: -180,
          width: 2280,
          height: 1080,
          willChange: "transform",
        }}
      >
        <svg
          width="2400"
          height="1080"
          viewBox="0 0 2400 1080"
          style={{ display: "block" }}
        >
          {waves.map((w, i) => (
            <path
              key={i}
              d={makePath(w.y, w.amp, w.freq)}
              stroke={w.stroke}
              strokeWidth={1.4}
              fill="none"
              opacity={w.opacity}
            />
          ))}
        </svg>
      </div>
      {/* Soft vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.06) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
});

PaperBackground.displayName = "PaperBackground";
export default PaperBackground;
