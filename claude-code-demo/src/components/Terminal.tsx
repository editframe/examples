import React from "react";

/**
 * macOS-style terminal window with chrome (traffic lights + centered title)
 * and a body slot. Used both as the hero terminal and the scatter terminals.
 */

interface Props {
  title?: string;
  width: number;
  height: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  className?: string;
  dimChrome?: boolean;       // for background scatter terminals
}

const Terminal = React.forwardRef<HTMLDivElement, Props>(
  ({ title, width, height, children, style, bodyStyle, className, dimChrome }, ref) => {
    return (
      <div
        ref={ref}
        className={`terminal ${className ?? ""}`}
        style={{
          width,
          height,
          opacity: dimChrome ? 0.92 : 1,
          ...style,
        }}
      >
        <div className="terminal-chrome">
          <span className="tl-dot" style={{ background: "var(--light-red)" }} />
          <span className="tl-dot" style={{ background: "var(--light-yellow)" }} />
          <span className="tl-dot" style={{ background: "var(--light-green)" }} />
          <span className="terminal-title">{title ?? "acme — claude — 84×24"}</span>
          <span style={{ width: 36 }} />
        </div>
        <div className="terminal-body" style={bodyStyle}>
          {children}
        </div>
      </div>
    );
  }
);
Terminal.displayName = "Terminal";
export default Terminal;
