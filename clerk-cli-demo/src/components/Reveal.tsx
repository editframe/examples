import React from "react";

export type RevealProps = {
  /** [delay, end] scene-local ms window for the fade + float-up entrance. */
  enter: readonly [number, number];
  /** px to float up from on enter (default 12). Pass 0 for a plain fade with no movement. */
  y?: number;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Declarative one-shot fade + translateY entrance, driven by the `reveal-in`
 * CSS `@keyframes` in styles.css instead of a per-frame imperative style
 * mutation (REFACTOR-PATTERNS.md Part 2b, priority 1).
 *
 * `enter` is local to the scene's own `<Timegroup mode="fixed">` clock — a
 * small human-scale [delay, end] window, not a master-ms range. Every scene
 * in this project is a hard cut (no crossfade), so unlike the reference
 * `Reveal` in allbirds-tree-runner-demo, this one only handles the entrance —
 * there's no `--ef-transition-out-start` exit to wire up here.
 */
export function Reveal({ enter, y = 12, style, className, children }: RevealProps) {
  const [inAt, inEnd] = enter;
  return (
    <div
      className={className}
      style={
        {
          ...style,
          "--reveal-y": `${y}px`,
          animation: `reveal-in ${inEnd - inAt}ms ${inAt}ms cubic-bezier(0.33,1,0.68,1) backwards`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
