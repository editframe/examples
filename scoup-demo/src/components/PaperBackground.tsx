import React from "react";

/**
 * Editorial cream "paper" background — replaces the dark glass aurora.
 * Warm cream gradient + faint newsprint grain + a hairline column rule
 * for an old-money newsroom feel.
 */
type Props = { variant?: "paper" | "ink" };

export const PaperBackground: React.FC<Props> = ({ variant = "paper" }) => {
  if (variant === "ink") {
    // Dark slide variant — pure newspaper black with subtle gold vignette
    return (
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at center, #1A1A1A 0%, #0B0B0B 50%, #000000 100%)",
        }}
      >
        {/* faint gold vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, rgba(245,197,24,0.06) 0%, rgba(245,197,24,0) 60%)",
            pointerEvents: "none",
          }}
        />
        <div className="newsprint" style={{ opacity: 0.08, mixBlendMode: "screen" }} />
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #F5F2EA 0%, #E8E6DC 100%)",
      }}
    >
      {/* very soft warm vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at top, rgba(245,197,24,0.05) 0%, rgba(0,0,0,0) 50%), radial-gradient(ellipse at bottom, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0) 50%)",
          pointerEvents: "none",
        }}
      />
      <div className="newsprint" />
    </div>
  );
};
