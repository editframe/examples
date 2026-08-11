import React from "react";
import { Timegroup } from "@editframe/react";
import AnthropicBurst from "../components/AnthropicBurst";

/**
 * Scene 6 — Final logo card (3.5s)
 *
 *   0–600     Anthropic burst + "Claude Code" wordmark fade in centered
 *   600–3000  Hold (EDITFRAME credit intentionally removed)
 *   3000–3500 Gentle fade out
 *
 * Both fade-in and fade-out are fixed functions of local time — plain CSS keyframes,
 * no `onFrame` needed at all for this scene.
 */

export const LogoCard: React.FC = () => {
  return (
    <Timegroup
      mode="fixed"
      duration="3.5s"
      className="absolute inset-0"
    >
      {/* Warm-dark Claude ink background (#141413 per brand canon, not pure black) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#141413",
        }}
      />

      {/* Centered: Anthropic burst + Claude Code wordmark side by side */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          gap: 32,
        }}
      >
        <div style={{ animation: "burst-in 600ms cubic-bezier(0.33,1,0.68,1) both, burst-out 500ms 3000ms cubic-bezier(0.33,1,0.68,1) forwards" }}>
          <AnthropicBurst size={140} color="var(--claude)" />
        </div>
        <div
          style={{
            color: "#FAF9F5",
            fontFamily: "'Source Serif 4 Display', 'Tiempos Headline', Newsreader, 'EB Garamond', Georgia, serif",
            fontSize: 140,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            animation: "wordmark-in 600ms cubic-bezier(0.33,1,0.68,1) both, wordmark-out 500ms 3000ms cubic-bezier(0.33,1,0.68,1) forwards",
          }}
        >
          Claude Code
        </div>
      </div>

    </Timegroup>
  );
};

export default LogoCard;
