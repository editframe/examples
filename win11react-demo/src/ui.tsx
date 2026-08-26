import React from "react";
import { taskbarApps, desktopIcons, pinnedApps, assets } from "./constants";

type Theme = "light" | "dark";

/** The four-pane Windows glyph, drawn in CSS so it stays crisp at any size. */
export function WinMark({ size = 30, className = "" }: { size?: number; className?: string }) {
  const gap = Math.round(size * 0.16);
  const cell = size;
  return (
    <span
      className={`win-mark ${className}`}
      style={{ gridTemplateColumns: `repeat(2, ${cell}px)`, gap }}
    >
      <i style={{ height: cell }} />
      <i style={{ height: cell }} />
      <i style={{ height: cell }} />
      <i style={{ height: cell }} />
    </span>
  );
}

/** Windows-style arrow pointer. `className` drives its per-scene motion keyframes. */
export function Cursor({ className = "", pressed = false }: { className?: string; pressed?: boolean }) {
  return (
    <span className={`cursor-ptr ${className} ${pressed ? "is-pressed" : ""}`}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 3l14 8.5-6.2 1.2 3.6 6.6-2.9 1.6-3.6-6.7L6 19V3z"
          fill="#fff"
          stroke="#1b1b1b"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function DesktopIcons({ className = "" }: { className?: string }) {
  return (
    <div className={`desktop-icons ${className}`}>
      {desktopIcons.map((item, i) => (
        <div className="desktop-icon" style={{ animationDelay: `${180 + i * 110}ms` }} key={item.name}>
          <img src={item.src} alt="" />
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
}

export function Taskbar({ theme = "light", time = "1:23 PM", date = "08/26/26", className = "" }: {
  theme?: Theme;
  time?: string;
  date?: string;
  className?: string;
}) {
  return (
    <div className={`taskbar taskbar-${theme} ${className}`}>
      <div className="taskbar-apps">
        <WinMark size={15} className="taskbar-start" />
        {taskbarApps.map((src, i) => (
          <img key={i} src={src} alt="" style={{ animationDelay: `${120 + i * 55}ms` }} />
        ))}
      </div>
      <div className="tray">
        <span className="tray-glyphs">^ ⌁ ◍</span>
        <span className="tray-clock">{time}<br />{date}</span>
      </div>
    </div>
  );
}

export function StartMenu({ theme = "light", className = "" }: { theme?: Theme; className?: string }) {
  return (
    <div className={`start-menu start-${theme} ${className}`}>
      <div className="start-search">
        <img src={assets.search} alt="" />
        <span>Type here to search</span>
      </div>
      <div className="start-row">Pinned <b>All apps ›</b></div>
      <div className="pinned-grid">
        {pinnedApps.map((a, i) => (
          <div key={a.name} style={{ animationDelay: `${140 + i * 45}ms` }}>
            <img src={a.src} alt="" />
            <small>{a.name}</small>
          </div>
        ))}
      </div>
      <div className="start-row">Recommended <b>More ›</b></div>
      <div className="reco">
        <div className="reco-item"><img src={assets.terminal} alt="" /><p><strong>Welcome to Win11React</strong><br />A web-based Windows experience</p></div>
        <div className="reco-item"><img src={assets.browser} alt="" /><p><strong>Getting started</strong><br />Recently added</p></div>
      </div>
      <div className="start-footer"><span className="start-user"><b>BE</b> Blue Edge</span><span className="start-power">⏻</span></div>
    </div>
  );
}

export function AppWindow({ icon, title, theme = "light", className = "", style, children }: {
  icon: string;
  title: string;
  theme?: Theme;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  return (
    <div className={`app-window win-${theme} ${className}`} style={style}>
      <div className="win-title">
        <img src={icon} alt="" />
        <span>{title}</span>
        <div className="win-actions"><b>—</b><b>▢</b><b className="win-close">×</b></div>
      </div>
      <div className="win-body">{children}</div>
    </div>
  );
}

export function Chip({ label, delay = 0, className = "" }: { label: string; delay?: number; className?: string }) {
  return (
    <span className={`spec-chip ${className}`} style={{ animationDelay: `${delay}ms` }}>{label}</span>
  );
}

/** Win11-style folder / file-type glyph for the Explorer grid. */
export function FileGlyph({ kind, ext = "", color = "#4a7fff" }: { kind: "folder" | "file"; ext?: string; color?: string }) {
  if (kind === "folder") {
    return (
      <svg className="file-svg" viewBox="0 0 48 40" fill="none">
        <path d="M3 9a3 3 0 0 1 3-3h11l4.2 4H42a3 3 0 0 1 3 3v3H3V9z" fill="#f2b13c" />
        <path d="M3 12.5h42V34a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V12.5z" fill="#ffd25e" />
        <path d="M3 12.5h42v3H3v-3z" fill="#ffdf8b" />
      </svg>
    );
  }
  return (
    <svg className="file-svg" viewBox="0 0 40 48" fill="none">
      <path d="M6 3a2 2 0 0 1 2-2h17l11 11v31a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V3z" fill="#f6f9fe" stroke="#c3d0e4" strokeWidth="1.2" />
      <path d="M25 1l11 11H27a2 2 0 0 1-2-2V1z" fill="#d6e1f1" />
      <rect x="4" y="28" width="30" height="13" rx="2.5" fill={color} />
      <text x="19" y="37.5" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#fff" fontFamily="Segoe UI, Arial, sans-serif">{ext}</text>
    </svg>
  );
}
