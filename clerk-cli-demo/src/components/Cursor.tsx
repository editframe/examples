import React from "react";
import { cc } from "../lib/colors";

export type CursorProps = {
  /** Scene-local ms when the cursor starts blinking. */
  showAt: number;
  /**
   * Scene-local ms when the cursor should stop blinking and disappear for
   * good. Omit to keep it blinking for the rest of the scene.
   */
  hideAt?: number;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
};

/**
 * Blinking terminal cursor (REFACTOR-PATTERNS.md Part 2b, priority 3 — a
 * continuous ambient loop): an infinite `cursor-blink` loop that starts at
 * `showAt`, plus an optional one-shot `cursor-hide` animation that
 * permanently overrides it from `hideAt` onward. When two animations target
 * the same property, the later one in the `animation` list wins during their
 * overlap, which is what lets `cursor-hide` cut the blink loop off for good.
 *
 * Simplification: the blink loop's own phase restarts fresh at `showAt`
 * rather than staying locked to the scene's absolute clock the way the old
 * `Math.floor(ms / 530) % 2` check did. Visually indistinguishable (there's
 * no second blinking element on screen to compare phase against) and far
 * simpler than reconstructing a global phase with a negative animation-delay.
 */
export function Cursor({ showAt, hideAt, width = 14, height = 30, style, className }: CursorProps) {
  const animations = [`cursor-blink 1060ms step-end ${showAt}ms infinite`];
  if (hideAt !== undefined) {
    animations.push(`cursor-hide 1ms step-end ${hideAt}ms forwards`);
  }
  return (
    <span
      className={className}
      style={{
        ...style,
        display: "inline-block",
        width,
        height,
        background: cc.fg,
        verticalAlign: "middle",
        marginLeft: 2,
        opacity: 0,
        animation: animations.join(", "),
      }}
    />
  );
}
