import React from "react";

/**
 * Static macOS-style menu bar at the very top of the canvas.
 * Matches the Opus 4.8 ad: translucent dark bar, app menus left,
 * status icons + date/time right.
 *
 * Text VERBATIM from k_002: "Terminal  File Edit View Window Help" /
 * right side "Sat, May 30  11:45 AM".
 */
const MenuBar: React.FC = () => {
  const menus = ["File", "Edit", "View", "Window", "Help"];
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 1920,
        height: 28,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        background: "rgba(30, 36, 32, 0.42)",
        color: "#F2F4F1",
        fontFamily: "-apple-system, 'SF Pro Text', system-ui, sans-serif",
        fontSize: 14,
        zIndex: 50,
        backdropFilter: "none", // Editframe won't render blur — flat tint only
      }}
    >
      {/* Apple glyph */}
      <span style={{ fontSize: 15, marginRight: 16, opacity: 0.92 }}></span>
      <span style={{ fontWeight: 700, marginRight: 20 }}>Terminal</span>
      <div style={{ display: "flex", gap: 18, opacity: 0.92 }}>
        {menus.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>

      {/* Right cluster */}
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 14,
          opacity: 0.92,
        }}
      >
        {/* wifi */}
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
          <path d="M9 11.5a1.3 1.3 0 100 .01M9 8.2c1.1 0 2.1.43 2.8 1.15M9 8.2c-1.1 0-2.1.43-2.8 1.15M9 5c2 0 3.9.8 5.3 2.1M9 5C7 5 5.1 5.8 3.7 7.1M9 2c2.9 0 5.6 1.15 7.5 3M9 2C6.1 2 3.4 3.15 1.5 5"
            stroke="#F2F4F1" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
        {/* battery */}
        <svg width="26" height="14" viewBox="0 0 26 14" fill="none">
          <rect x="0.6" y="2.4" width="21" height="9.2" rx="2.4" stroke="#F2F4F1" strokeWidth="1" />
          <rect x="2.2" y="4" width="15" height="6" rx="1" fill="#F2F4F1" />
          <rect x="22.6" y="5" width="2" height="4" rx="1" fill="#F2F4F1" />
        </svg>
        {/* control-center grid */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="1" width="5" height="5" rx="1.2" fill="#F2F4F1" />
          <rect x="8" y="1" width="5" height="5" rx="1.2" fill="#F2F4F1" />
          <rect x="1" y="8" width="5" height="5" rx="1.2" fill="#F2F4F1" />
          <rect x="8" y="8" width="5" height="5" rx="1.2" fill="#F2F4F1" />
        </svg>
        <span style={{ marginLeft: 4 }}>Sat, May 30&nbsp;&nbsp;11:45&nbsp;AM</span>
      </div>
    </div>
  );
};

export default MenuBar;
