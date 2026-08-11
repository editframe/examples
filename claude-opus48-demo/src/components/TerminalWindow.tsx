import React, { forwardRef } from "react";
import { WindowChrome } from "@shared/components/WindowChrome";

/**
 * The "Claude Code" terminal window from the Opus 4.8 ad.
 *
 * Chrome: 3 traffic-light dots (left), centered "acme — claude" title — from
 * `@shared/components/WindowChrome`.
 * Header: "Claude Code" (bold white) / "Opus 4.7 · ~/acme" (grey) / status line.
 * Body:   section labels ("Working" / "Needs input") + app rows. Each app row =
 *         a leading status glyph, the app name, a right-aligned message + count.
 *         One row may be highlighted (selectable-row band).
 *
 * This component renders STRUCTURE; the scene drives which rows/labels are
 * visible via refs (opacity). Pass children for fully-custom bodies (e.g. the
 * zoomed command + code beat).
 */

export interface AppRow {
  glyph: string;   // status glyph e.g. "*", "✱", "✦"
  name: string;    // "apps/web"
  msg: string;     // "Ready to implement this change?"
  count?: string;  // "1s"
  selected?: boolean;
}

interface Props {
  width: number;
  height: number;
  title?: string;
  headerTitle?: string;     // "Claude Code"
  subtitle?: string;        // "Opus 4.7 · ~/acme"
  status?: string;          // "2 awaiting input · 1 working · 0 completed"
  children?: React.ReactNode; // custom body (overrides sections)
  bodyStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  className?: string;
  hideChrome?: boolean;
}

const TerminalWindow = forwardRef<HTMLDivElement, Props>(
  ({ width, height, title = "acme — claude", headerTitle, subtitle, status, children, bodyStyle, style, className, hideChrome }, ref) => (
    <WindowChrome
      ref={ref}
      width={width}
      height={height}
      title={title}
      style={style}
      className={className}
      bodyStyle={bodyStyle}
      hideChrome={hideChrome}
      spacerWidth={39}
    >
      {(headerTitle || subtitle || status) && (
        <div style={{ marginBottom: 14 }}>
          {headerTitle && (
            <div style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: 30, lineHeight: 1.1 }}>
              {headerTitle}
            </div>
          )}
          {subtitle && (
            <div style={{ color: "var(--text-secondary)", fontSize: 27, marginTop: 2 }}>{subtitle}</div>
          )}
          {status && (
            <div style={{ color: "var(--text-secondary)", fontSize: 27, marginTop: 2 }}>{status}</div>
          )}
        </div>
      )}
      {children}
    </WindowChrome>
  )
);
TerminalWindow.displayName = "TerminalWindow";

/** A section label + its app rows. Used inside the terminal body. */
export const AppSection: React.FC<{ label: string; rows: AppRow[] }> = ({ label, rows }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: 27, marginBottom: 4 }}>{label}</div>
    {rows.map((r, i) => (
      <AppRowView key={i} row={r} />
    ))}
  </div>
);

export const AppRowView: React.FC<{ row: AppRow }> = ({ row }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      fontSize: 27,
      lineHeight: 1.32,
      padding: "1px 8px",
      margin: "0 -8px",
      borderRadius: 5,
      background: row.selected ? "var(--term-sel-row)" : "transparent",
    }}
  >
    <span style={{ color: "var(--text-secondary)", width: 22, flexShrink: 0 }}>{row.glyph}</span>
    <span style={{ color: "var(--text-primary)", width: 200, flexShrink: 0 }}>{row.name}</span>
    <span style={{ color: "var(--text-secondary)", flex: 1 }}>{row.msg}</span>
    {row.count && <span style={{ color: "var(--text-dim)", marginLeft: 12 }}>{row.count}</span>}
  </div>
);

export default TerminalWindow;
