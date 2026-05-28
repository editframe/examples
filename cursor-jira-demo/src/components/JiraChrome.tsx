import React from "react";

const sidebarIconColor = "#42526E";

const SideIcon: React.FC<{ children: React.ReactNode; active?: boolean }> = ({ children, active }) => (
  <div
    style={{
      width: 32,
      height: 32,
      borderRadius: 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: active ? "#DEEBFF" : "transparent",
      color: active ? "#0052CC" : sidebarIconColor,
    }}
  >
    {children}
  </div>
);

export const JiraSidebar: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 56,
      bottom: 0,
      width: 64,
      background: "#FAFBFC",
      borderRight: "1px solid #DFE1E6",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 14,
      gap: 6,
      zIndex: 2,
    }}
  >
    <SideIcon active>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2v-9z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </SideIcon>
    <SideIcon>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </SideIcon>
    <SideIcon>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M3 9h18 M9 4v16" stroke="currentColor" strokeWidth="2" />
      </svg>
    </SideIcon>
    <SideIcon>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M4 5h16 M4 12h16 M4 19h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </SideIcon>
    <SideIcon>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M12 3v3 M12 18v3 M3 12h3 M18 12h3 M5.6 5.6l2.1 2.1 M16.3 16.3l2.1 2.1 M5.6 18.4l2.1-2.1 M16.3 7.7l2.1-2.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </SideIcon>
    <div style={{ flex: 1 }} />
    <SideIcon>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M14 4h6v6 M20 4l-8 8 M10 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </SideIcon>
    <SideIcon>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M14 4h6v6 M20 4l-8 8 M10 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </SideIcon>
    <SideIcon>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M14 4h6v6 M20 4l-8 8 M10 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </SideIcon>
    <div style={{ height: 14 }} />
  </div>
);

export const JiraHeader: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      right: 0,
      height: 56,
      background: "#FFFFFF",
      borderBottom: "1px solid #DFE1E6",
      display: "flex",
      alignItems: "center",
      padding: "0 24px",
      gap: 18,
      zIndex: 3,
    }}
  >
    {/* App switcher */}
    <div style={{ display: "flex", gap: 4 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ display: "flex", gap: 3, flexDirection: "column" }}>
          <span style={{ width: 4, height: 4, borderRadius: 1, background: "#42526E" }} />
          <span style={{ width: 4, height: 4, borderRadius: 1, background: "#42526E" }} />
          <span style={{ width: 4, height: 4, borderRadius: 1, background: "#42526E" }} />
        </div>
      ))}
    </div>

    {/* Jira logo */}
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="6" fill="#2684FF" />
        <path d="M22 10l-6 6-6-6 6-6 6 6z" fill="#fff" />
        <path d="M22 16l-6 6-6-6 6-6 6 6z" fill="#fff" opacity="0.7" />
        <path d="M22 22l-6 6-6-6 6-6 6 6z" fill="#fff" opacity="0.45" />
      </svg>
      <span style={{ fontWeight: 700, fontSize: 15, color: "#172B4D", letterSpacing: "-0.01em" }}>Jira</span>
    </div>

    {/* Nav items */}
    <div style={{ display: "flex", gap: 26, marginLeft: 22, fontSize: 16, color: "#42526E", fontWeight: 500 }}>
      <span>Your work</span>
      <span>Projects</span>
      <span>Filters</span>
      <span>Dashboards</span>
      <span>Teams</span>
    </div>

    <div style={{ marginLeft: 18, padding: "8px 18px", background: "#0052CC", color: "#fff", borderRadius: 4, fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Create
    </div>

    <div style={{ flex: 1 }} />

    {/* Search */}
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F4F5F7", border: "1px solid #DFE1E6", borderRadius: 4, padding: "7px 12px", width: 340, fontSize: 15, color: "#6B778C" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="#6B778C" strokeWidth="2" />
        <path d="M21 21l-4.3-4.3" stroke="#6B778C" strokeWidth="2" strokeLinecap="round" />
      </svg>
      Search
    </div>

    {/* Ask Rovo */}
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 16px", border: "1px solid #DFE1E6", borderRadius: 999, fontSize: 15, color: "#172B4D", fontWeight: 600 }}>
      <span style={{ width: 14, height: 14, borderRadius: 999, background: "linear-gradient(135deg, #FF7A45, #E64980, #4263EB)" }} />
      Ask Rovo
    </div>

    {/* Bell + avatar */}
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M18 16v-5a6 6 0 10-12 0v5l-2 2h16l-2-2z M10 21a2 2 0 004 0" stroke="#42526E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div style={{ width: 30, height: 30, borderRadius: 999, background: "linear-gradient(135deg, #2684FF, #0052CC)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12 }}>NT</div>
  </div>
);
