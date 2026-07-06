import React from "react";

export type TypewriterProps = {
  /** Total visible character count — drives both the CSS `steps()` count and the reveal width (in `ch` units). */
  charCount: number;
  /** Scene-local ms delay before the reveal starts. */
  delay: number;
  /** Total ms for the full reveal (characters are revealed at an even interval — `duration / charCount` ms each). */
  duration: number;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Character-by-character text reveal via a `width: 0 -> Nch` CSS animation
 * clipped by `overflow:hidden`, stepped with `steps(charCount, end)` so it
 * reveals exactly one monospace character at a time — the CSS replacement
 * for slicing `textContent` in a per-frame `onFrame` callback
 * (REFACTOR-PATTERNS.md Part 2b, priority 4). Only works for monospace text,
 * where `1ch` reliably matches every character's rendered width.
 */
export function Typewriter({ charCount, delay, duration, style, className, children }: TypewriterProps) {
  return (
    <span
      className={className}
      style={
        {
          ...style,
          display: "inline-block",
          overflow: "hidden",
          whiteSpace: "nowrap",
          verticalAlign: "bottom",
          width: 0,
          "--tw-chars": charCount,
          animation: `typewriter-reveal ${duration}ms ${delay}ms steps(${charCount}, end) both`,
        } as React.CSSProperties
      }
    >
      {children}
    </span>
  );
}
