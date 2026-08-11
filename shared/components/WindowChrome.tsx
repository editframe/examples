import React from "react";

/**
 * macOS-style window chrome (traffic-light dots + centered title bar) wrapping a
 * scrollable body slot. Consolidated from 2 near-identical per-example components
 * (`Terminal.tsx` / `TerminalWindow.tsx`) — this covers the actual duplicated "chrome"
 * shell; bespoke body content (header blocks, app-row lists, etc.) stays local to
 * whichever example composes it via `children`.
 *
 * Backed by the `.terminal` / `.terminal-chrome` / `.tl-dot` / `.terminal-title` /
 * `.terminal-body` classes in `@shared/styles/window-chrome.css` — each project still
 * owns the CSS custom properties those classes read (`--terminal-bg`, `--terminal-chrome`,
 * `--terminal-border`, `--text-dim`, `--text-primary`, `--light-red/yellow/green`) via its
 * own `@theme`/`:root`, so window color/typography stays per-brand.
 */
export interface WindowChromeProps {
  width: number;
  height: number;
  title?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  className?: string;
  /** Slightly dim the whole window (chrome + body) — e.g. background/scatter instances. */
  dimmed?: boolean;
  /** Omit the chrome bar entirely (traffic lights + title). */
  hideChrome?: boolean;
  /** Width of the invisible spacer balancing the dots so the title stays centered (default 36). */
  spacerWidth?: number;
}

export const WindowChrome = React.forwardRef<HTMLDivElement, WindowChromeProps>(
  (
    {
      width,
      height,
      title = "acme — claude",
      children,
      style,
      bodyStyle,
      className,
      dimmed,
      hideChrome,
      spacerWidth = 36,
    },
    ref
  ) => (
    <div
      ref={ref}
      className={`terminal ${className ?? ""}`}
      style={{ width, height, opacity: dimmed ? 0.92 : 1, ...style }}
    >
      {!hideChrome && (
        <div className="terminal-chrome">
          <span className="tl-dot" style={{ background: "var(--light-red)" }} />
          <span className="tl-dot" style={{ background: "var(--light-yellow)" }} />
          <span className="tl-dot" style={{ background: "var(--light-green)" }} />
          <span className="terminal-title">{title}</span>
          <span style={{ width: spacerWidth }} />
        </div>
      )}
      <div className="terminal-body" style={bodyStyle}>
        {children}
      </div>
    </div>
  )
);
WindowChrome.displayName = "WindowChrome";
