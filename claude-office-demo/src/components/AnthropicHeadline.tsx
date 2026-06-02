import React from "react";
import { claude } from "../brand";

/**
 * AnthropicHeadline — serif headline + optional subline.
 * Used by Scenes 1, 2, 6, 7.
 *
 * Typography: Newsreader / Source Serif fallback, regular weight (400).
 * The reference frames show a clean editorial serif at ~72px for both lines,
 * near-black #1A1410, centered horizontally on the cream bg.
 */
interface AnthropicHeadlineProps {
  headline: string;
  subline?: string;
  headlineOpacity?: number;
  sublineOpacity?: number;
  /** Center X of both lines. Default: 960 (horizontal center). */
  cx?: number;
  /** Center Y of the headline line. Default: 698. */
  headlineCy?: number;
  /** Center Y of the subline. Default: 788 (90px below headline). */
  sublineCy?: number;
  fontSize?: number;
  color?: string;
}

export function AnthropicHeadline({
  headline,
  subline,
  headlineOpacity = 1,
  sublineOpacity = 1,
  cx = 960,
  headlineCy = 698,
  sublineCy = 788,
  fontSize = 72,
  color = "#1A1410",
}: AnthropicHeadlineProps) {
  const fontStyle: React.CSSProperties = {
    fontFamily: claude.fonts.display,
    fontWeight: claude.weight.displayHero,
    fontSize,
    letterSpacing: claude.letterSpacing.display,
    color,
    lineHeight: 1.1,
    textAlign: "center",
    whiteSpace: "nowrap",
    userSelect: "none",
  };

  return (
    <>
      {/* Headline line — absolutely positioned by headlineCy */}
      <div
        style={{
          position: "absolute",
          left: cx,
          top: headlineCy,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div style={{ ...fontStyle, opacity: headlineOpacity }}>
          {headline}
        </div>
      </div>

      {/* Subline — absolutely positioned by sublineCy */}
      {subline && (
        <div
          style={{
            position: "absolute",
            left: cx,
            top: sublineCy,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div style={{ ...fontStyle, opacity: sublineOpacity }}>
            {subline}
          </div>
        </div>
      )}
    </>
  );
}
