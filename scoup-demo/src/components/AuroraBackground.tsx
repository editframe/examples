import React from "react";

/**
 * Slow-drifting aurora gradient background.
 * Two large blurred blobs (navy + warm scoup) move in CSS-driven loops
 * to give the impression of a living dark backdrop.
 * Sits behind every scene at z=0.
 */
export const AuroraBackground: React.FC = () => {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at top, #131932 0%, #0B0E1A 45%, #050709 100%)",
      }}
    >
      {/* Warm Scoup-yellow aurora blob — drifts top-left */}
      <div
        className="aurora-blob"
        style={{
          width: 900,
          height: 900,
          top: -200,
          left: -200,
          background:
            "radial-gradient(circle, rgba(255, 186, 73, 0.18) 0%, transparent 70%)",
          animation: "auroraDrift1 18s ease-in-out infinite alternate",
        }}
      />
      {/* Cool navy aurora blob — drifts bottom-right */}
      <div
        className="aurora-blob"
        style={{
          width: 1100,
          height: 1100,
          bottom: -300,
          right: -300,
          background:
            "radial-gradient(circle, rgba(83, 122, 234, 0.22) 0%, transparent 70%)",
          animation: "auroraDrift2 22s ease-in-out infinite alternate",
        }}
      />
      {/* Subtle deep purple wash */}
      <div
        className="aurora-blob"
        style={{
          width: 700,
          height: 700,
          top: "30%",
          left: "40%",
          background:
            "radial-gradient(circle, rgba(112, 71, 196, 0.14) 0%, transparent 70%)",
          animation: "auroraDrift3 26s ease-in-out infinite alternate",
        }}
      />

      {/* Noise overlay */}
      <div className="noise" />

      <style>{`
        @keyframes auroraDrift1 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(120px, 80px) scale(1.15); }
        }
        @keyframes auroraDrift2 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-100px, -60px) scale(1.1); }
        }
        @keyframes auroraDrift3 {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(80px, -120px) scale(1.2); }
        }
      `}</style>
    </div>
  );
};
