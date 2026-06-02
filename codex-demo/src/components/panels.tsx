/**
 * Shared pixel-accurate panel components for Scenes 4-8.
 * Built from careful study of reference frames (ref-frames/frame_0009.jpg through frame_0020.jpg).
 */

import React from "react";

// ─────────────────────────────────────────────────────────────────
// Swift syntax colors (light mode Xcode)
// ─────────────────────────────────────────────────────────────────
export const SK = "#AA0D91"; // keywords: purple
export const ST = "#1C00CF"; // types: blue
export const SS = "#C41A16"; // strings: dark red
export const SW = "#1A1A1A"; // plain text: near-black

// ─────────────────────────────────────────────────────────────────
// Reusable Swift code lines (shared across all scenes)
// ─────────────────────────────────────────────────────────────────
export const SWIFT_LINES: Array<{ n: number; code: React.ReactNode; hl?: boolean }> = [
  { n: 1, code: <><span style={{ color: SK }}>import</span> <span style={{ color: ST }}>SwiftUI</span></> },
  { n: 2, code: <></> },
  { n: 3, code: <><span style={{ color: SK }}>enum</span> <span style={{ color: ST }}>Player</span>: <span style={{ color: ST }}>String</span> {" {"}</> },
  { n: 4, code: <>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: SK }}>case</span> <span style={{ color: SW }}>human</span> = <span style={{ color: SS }}>"X"</span></> },
  { n: 5, code: <>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: SK }}>case</span> <span style={{ color: SW }}>computer</span> = <span style={{ color: SS }}>"O"</span></>, hl: true },
  { n: 6, code: <>{" }"}</> },
  { n: 7, code: <></> },
  { n: 8, code: <><span style={{ color: SK }}>enum</span> <span style={{ color: ST }}>GameResult</span>: <span style={{ color: ST }}>Equatable</span> {" {"}</> },
  { n: 9, code: <>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: SK }}>case</span> <span style={{ color: SW }}>playing</span></> },
  { n: 10, code: <>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: SK }}>case</span> <span style={{ color: SW }}>draw</span></> },
  { n: 11, code: <>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: SK }}>case</span> <span style={{ color: SW }}>winner</span>(<span style={{ color: ST }}>Player</span>)</> },
  { n: 12, code: <>{" }"}</> },
  { n: 13, code: <></> },
  { n: 14, code: <><span style={{ color: SK }}>struct</span> <span style={{ color: ST }}>CloudTicTacToeGame</span> {" {"}</> },
  { n: 15, code: <>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: SK }}>private</span>(<span style={{ color: SK }}>set</span>) <span style={{ color: SK }}>var</span> <span style={{ color: SW }}>board</span> = <span style={{ color: ST }}>Array</span>&lt;<span style={{ color: ST }}>Player</span>?&gt;(<span style={{ color: SW }}>repeating: nil, count: 9</span>)</> },
  { n: 16, code: <>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: SK }}>private</span>(<span style={{ color: SK }}>set</span>) <span style={{ color: SK }}>var</span> <span style={{ color: SW }}>result</span>: <span style={{ color: ST }}>GameResult</span> = .<span style={{ color: SW }}>playing</span></> },
  { n: 17, code: <></> },
  { n: 18, code: <>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: SK }}>mutating func</span> <span style={{ color: SW }}>reset</span>() {" {"}</> },
  { n: 19, code: <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: SW }}>board</span> = <span style={{ color: ST }}>Array</span>&lt;<span style={{ color: ST }}>Player</span>?&gt;(<span style={{ color: SW }}>repeating: nil, count: 9</span>)</> },
  { n: 20, code: <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: SW }}>result</span> = .<span style={{ color: SW }}>playing</span></> },
  { n: 21, code: <>&nbsp;&nbsp;&nbsp;&nbsp;{" }"}</> },
  { n: 22, code: <></> },
  { n: 23, code: <>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: SK }}>mutating func</span> <span style={{ color: SW }}>humanMove</span>(<span style={{ color: SW }}>at index</span>: <span style={{ color: ST }}>Int</span>) {" {"}</> },
];

// ─────────────────────────────────────────────────────────────────
// XcodeFileNav — left pane of Xcode panel
// ─────────────────────────────────────────────────────────────────
export const XcodeFileNav: React.FC<{ width: number }> = ({ width }) => (
  <div style={{
    width,
    background: "#F2F2F2",
    borderRight: "1px solid #D8D8D8",
    padding: "0",
    fontSize: 12,
    fontFamily: "'SF Mono', 'Courier New', monospace",
    color: "#1A1A1A",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  }}>
    {/* Secondary toolbar — nav icons */}
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 10px 7px 10px",
      borderBottom: "1px solid #D8D8D8",
    }}>
      {/* folder icon */}
      <span style={{ fontSize: 13, color: "#555", fontWeight: 500 }}>📁</span>
      {/* X/close source */}
      <span style={{ fontSize: 12, color: "#555" }}>✕</span>
      {/* bookmark */}
      <span style={{ fontSize: 12, color: "#555" }}>🔖</span>
      {/* search */}
      <span style={{ fontSize: 12, color: "#555" }}>🔍</span>
      {/* warning triangle */}
      <span style={{ fontSize: 12, color: "#555" }}>⚠</span>
      {/* diamond */}
      <span style={{ fontSize: 12, color: "#555" }}>◇</span>
      {/* edit */}
      <span style={{ fontSize: 12, color: "#555" }}>✎</span>
      {/* square */}
      <span style={{ fontSize: 12, color: "#555" }}>□</span>
    </div>

    {/* File tree */}
    <div style={{ padding: "4px 0" }}>
      {/* Project root */}
      <div style={{ padding: "3px 8px", display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 9, color: "#7B9ED9", marginRight: 2 }}>▶</span>
        <span style={{ fontSize: 11, color: "#7B9ED9" }}>📦</span>
        <span style={{ fontSize: 12, color: "#1A1A1A", fontWeight: 500 }}>CloudTicTacToe</span>
        <span style={{ marginLeft: "auto", color: "#D4841A", fontSize: 10, fontWeight: 600 }}>A</span>
      </div>
      {/* Folder */}
      <div style={{ padding: "3px 8px 3px 22px", display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 9, color: "#7B9ED9", marginRight: 2 }}>▶</span>
        <span style={{ fontSize: 11, color: "#8B6BB5" }}>📁</span>
        <span style={{ fontSize: 12, color: "#1A1A1A" }}>CloudTicTacToe</span>
      </div>
      {/* Active file — highlighted */}
      <div style={{
        padding: "3px 8px 3px 34px",
        display: "flex",
        alignItems: "center",
        gap: 4,
        background: "rgba(60,100,200,0.12)",
        borderRadius: 3,
        margin: "1px 4px",
      }}>
        <span style={{ fontSize: 11, color: "#E06C75" }}>🔴</span>
        <span style={{ fontSize: 11, color: "#1A1A1A" }}>CloudTicTacToeApp.swift</span>
        <span style={{ marginLeft: "auto", color: "#E06C75", fontSize: 10, fontWeight: 600 }}>M</span>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────
// XcodeCodeArea — right pane with Swift syntax highlighting
// ─────────────────────────────────────────────────────────────────
export const XcodeCodeArea: React.FC<{
  fontSize?: number;
  lineHeight?: number;
  lineCount?: number;
}> = ({ fontSize = 13, lineHeight = 1.6, lineCount = 20 }) => {
  const lines = SWIFT_LINES.slice(0, lineCount);
  return (
    <div style={{
      flex: 1,
      background: "#FFFFFF",
      fontSize,
      fontFamily: "'SF Mono', 'Courier New', monospace",
      lineHeight,
      padding: "10px 0",
      overflow: "hidden",
    }}>
      {lines.map(({ n, code, hl }) => (
        <div
          key={n}
          style={{
            display: "flex",
            alignItems: "center",
            background: hl ? "rgba(180,200,240,0.4)" : "transparent",
            minHeight: `${fontSize * lineHeight}px`,
          }}
        >
          <span style={{
            width: 40,
            textAlign: "right",
            paddingRight: 14,
            color: hl ? "#3A5BA0" : "#8A8A8A",
            fontSize: fontSize - 1,
            flexShrink: 0,
            userSelect: "none",
          }}>
            {n}
          </span>
          <span style={{ color: SW }}>{code}</span>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// XcodeStatusBar — bottom status bar
// ─────────────────────────────────────────────────────────────────
export const XcodeStatusBar: React.FC = () => (
  <div style={{
    height: 24,
    background: "#F0F0F0",
    borderTop: "1px solid #D8D8D8",
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    gap: 8,
    fontSize: 11,
    color: "#666",
    fontFamily: "'SF Pro Text', sans-serif",
    flexShrink: 0,
  }}>
    <span>Line: 5  Col: 4</span>
    <div style={{ flex: 1 }} />
    <span style={{ fontSize: 10, background: "#D5CFC4", borderRadius: 3, padding: "1px 5px" }}>Auto</span>
    <span style={{ fontSize: 10, color: "#888" }}>◉ Filter</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────
// XcodeTitleBar — top title bar for Xcode window
// showRunButton: if true, show the teal play button prominently
// ─────────────────────────────────────────────────────────────────
export const XcodeTitleBar: React.FC<{
  runBtnRef?: React.RefObject<HTMLDivElement>;
}> = ({ runBtnRef }) => (
  <div style={{
    height: 44,
    background: "#F0F0F0",
    borderBottom: "1px solid #D8D8D8",
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    gap: 8,
    flexShrink: 0,
  }}>
    {/* Three traffic-light dots */}
    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F56" }} />
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E" }} />
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27C93F" }} />
    </div>

    {/* Toolbar icon group: hamburger, AI list */}
    <div style={{ display: "flex", gap: 6, marginLeft: 4, flexShrink: 0 }}>
      <span style={{ fontSize: 14, color: "#555", lineHeight: 1 }}>≡</span>
      <span style={{ fontSize: 12, color: "#555", lineHeight: 1 }}>≡<sup style={{ fontSize: 8 }}>+</sup></span>
    </div>

    {/* Stop button (square) */}
    <div style={{
      width: 26,
      height: 20,
      background: "#E0E0E0",
      borderRadius: 4,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}>
      <div style={{ width: 8, height: 8, background: "#666", borderRadius: 1 }} />
    </div>

    {/* RUN button — teal capsule */}
    <div
      ref={runBtnRef}
      style={{
        width: 32,
        height: 24,
        background: "linear-gradient(135deg, #5BA4E5 0%, #3A7BD5 100%)",
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
        flexShrink: 0,
      }}
    >
      <span style={{ color: "#FFF", fontSize: 12, lineHeight: 1 }}>▶</span>
    </div>

    {/* Project name + branch (center) */}
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
      <span style={{ fontSize: 12, color: "#444", fontFamily: "'SF Pro Text', sans-serif", fontWeight: 500 }}>CloudTicTacToe</span>
      <span style={{ fontSize: 10, color: "#666", background: "#E0E0E0", borderRadius: 4, padding: "1px 6px", display: "flex", alignItems: "center", gap: 3 }}>
        <span>⌥</span>
        <span>main</span>
      </span>
    </div>

    {/* Version diff +389 -19 */}
    <div style={{ display: "flex", gap: 4, fontSize: 11, flexShrink: 0, fontFamily: "'SF Mono', monospace" }}>
      <span style={{ color: "#2D8B2D", fontWeight: 600 }}>+389</span>
      <span style={{ color: "#C41A16", fontWeight: 600 }}>-19</span>
    </div>

    {/* New file square icon */}
    <div style={{ width: 16, height: 16, border: "1.5px solid #888", borderRadius: 3, flexShrink: 0 }} />
  </div>
);

// ─────────────────────────────────────────────────────────────────
// XcodeWindow — full Xcode window (title + nav + code + status)
// ─────────────────────────────────────────────────────────────────
export const XcodeWindow: React.FC<{
  style?: React.CSSProperties;
  runBtnRef?: React.RefObject<HTMLDivElement>;
  navWidth?: number;
  fontSize?: number;
  lineCount?: number;
  showStatusBar?: boolean;
}> = ({
  style = {},
  runBtnRef,
  navWidth = 200,
  fontSize = 13,
  lineCount = 20,
  showStatusBar = true,
}) => (
  <div style={{
    background: "#FFFFFF",
    borderRadius: 12,
    boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    ...style,
  }}>
    <XcodeTitleBar runBtnRef={runBtnRef} />

    {/* Breadcrumb / jump bar */}
    <div style={{
      height: 28,
      background: "#F8F8F8",
      borderBottom: "1px solid #E0E0E0",
      display: "flex",
      alignItems: "center",
      padding: "0 12px",
      gap: 6,
      fontSize: 11,
      color: "#555",
      fontFamily: "'SF Pro Text', sans-serif",
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 10, color: "#888" }}>⊞</span>
      <span style={{ color: "#888" }}>‹</span>
      <span style={{ color: "#888" }}>›</span>
      <span style={{ width: 1, height: 12, background: "#C0BAB0", margin: "0 2px" }} />
      <span style={{ fontSize: 11, color: "#3B7DD8" }}>🔵</span>
      <span style={{ color: "#3B7DD8" }}>CloudTicTacToe</span>
      <span style={{ color: "#888" }}>›</span>
      <span style={{ color: "#888" }}>📁</span>
      <span style={{ color: "#888" }}>CloudTicTacToe</span>
      <span style={{ color: "#888" }}>›</span>
      <span style={{ color: "#555" }}>CloudTicTacToeApp.swift</span>
    </div>

    {/* Content area */}
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      <XcodeFileNav width={navWidth} />
      <XcodeCodeArea fontSize={fontSize} lineCount={lineCount} />
    </div>

    {showStatusBar && <XcodeStatusBar />}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// CodexTitleBar — macOS window title bar for Codex
// ─────────────────────────────────────────────────────────────────
export const CodexTitleBar: React.FC<{ taskTitle?: string }> = ({
  taskTitle = "Run this app i...",
}) => (
  <div style={{
    height: 44,
    background: "#F2F2F2",
    borderBottom: "1px solid #E0E0E0",
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    gap: 7,
    flexShrink: 0,
    fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
  }}>
    {/* Traffic lights */}
    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F56" }} />
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E" }} />
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27C93F" }} />
    </div>

    {/* Sidebar toggle */}
    <span style={{ fontSize: 13, color: "#888", marginLeft: 4 }}>⊞</span>

    {/* Back / Forward */}
    <span style={{ fontSize: 13, color: "#AAA" }}>←</span>
    <span style={{ fontSize: 13, color: "#AAA" }}>→</span>

    {/* Edit/share icon */}
    <span style={{ fontSize: 12, color: "#888" }}>✎</span>

    {/* Title + project */}
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, overflow: "hidden" }}>
      <span style={{ fontSize: 12, color: "#333", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {taskTitle}
      </span>
      <span style={{ fontSize: 12, color: "#888", whiteSpace: "nowrap" }}>CloudTicTacToe</span>
      <span style={{ fontSize: 12, color: "#AAA" }}>•••</span>
      <span style={{ fontSize: 12, color: "#888" }}>▶</span>
    </div>

    {/* Xcode app icon (teal) + branch */}
    <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
      <div style={{ width: 16, height: 16, background: "linear-gradient(135deg, #5DB8E8, #3879C8)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#FFF", fontSize: 9, fontWeight: 700 }}>X</span>
      </div>
      <span style={{ fontSize: 10, color: "#888" }}>▾</span>
    </div>

    {/* Branch icon */}
    <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
      <span style={{ fontSize: 12, color: "#888" }}>⌥</span>
      <span style={{ fontSize: 10, color: "#888" }}>▾</span>
    </div>

    {/* Sidebar right toggle */}
    <span style={{ fontSize: 12, color: "#AAA", flexShrink: 0 }}>□</span>

    {/* Diff counts */}
    <div style={{ display: "flex", gap: 3, fontSize: 11, flexShrink: 0, fontFamily: "'SF Mono', monospace" }}>
      <span style={{ color: "#2D8B2D", fontWeight: 600 }}>+389</span>
      <span style={{ color: "#C41A16", fontWeight: 600 }}>-19</span>
    </div>

    {/* New file icon */}
    <div style={{ width: 14, height: 14, border: "1.5px solid #AAA", borderRadius: 2, flexShrink: 0 }} />
  </div>
);

// ─────────────────────────────────────────────────────────────────
// ToolCallRow — styled row for Codex tool calls
// ─────────────────────────────────────────────────────────────────
export const ToolCallRow: React.FC<{
  label: string;
  italic?: boolean;
  style?: React.CSSProperties;
}> = ({ label, italic = false, style = {} }) => (
  <div style={{
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "#999",
    marginBottom: 3,
    fontFamily: "'SF Pro Text', sans-serif",
    fontStyle: italic ? "italic" : "normal",
    ...style,
  }}>
    {/* 2x2 grid icon (Codex tool icon) */}
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, opacity: 0.7 }}>
      <rect x="0.5" y="0.5" width="4.5" height="4.5" rx="1" fill="#999" />
      <rect x="7" y="0.5" width="4.5" height="4.5" rx="1" fill="#999" />
      <rect x="0.5" y="7" width="4.5" height="4.5" rx="1" fill="#999" />
      <rect x="7" y="7" width="4.5" height="4.5" rx="1" fill="#999" />
    </svg>
    <span>{label}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────
// CodexBottomBar — input + controls + bottom chips
// ─────────────────────────────────────────────────────────────────
export const CodexBottomBar: React.FC<{ height?: number }> = ({ height = 110 }) => (
  <div style={{
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height,
    borderTop: "1px solid #E5E5E5",
    background: "#FAFAFA",
    display: "flex",
    flexDirection: "column",
    padding: "8px 12px 0 12px",
    gap: 5,
    flexShrink: 0,
    fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
  }}>
    {/* Input field */}
    <div style={{
      border: "1px solid #DEDEDE",
      borderRadius: 8,
      padding: "7px 10px",
      fontSize: 12,
      color: "#BBBBBB",
      background: "#FFF",
      lineHeight: 1.4,
    }}>
      Ask for follow-up changes
    </div>

    {/* Controls row */}
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
      <span style={{ color: "#888", fontSize: 14, lineHeight: 1 }}>+</span>

      {/* Default permissions chip */}
      <div style={{ display: "flex", alignItems: "center", gap: 3, background: "#EFEFEF", borderRadius: 5, padding: "2px 7px", color: "#555" }}>
        <span style={{ fontSize: 10 }}>↻</span>
        <span>Default permissions</span>
        <span style={{ fontSize: 9, color: "#888" }}>▾</span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Model picker */}
      <div style={{ display: "flex", alignItems: "center", gap: 3, background: "#EFEFEF", borderRadius: 5, padding: "2px 7px", color: "#555" }}>
        <span style={{ fontSize: 10, color: "#888" }}>↻</span>
        <span>GPT-5.3-Codex-Spark</span>
        <span style={{ fontSize: 9, color: "#888" }}>▾</span>
      </div>

      {/* Reasoning */}
      <div style={{ display: "flex", alignItems: "center", gap: 3, background: "#EFEFEF", borderRadius: 5, padding: "2px 7px", color: "#555" }}>
        <span>Medium</span>
        <span style={{ fontSize: 9, color: "#888" }}>▾</span>
      </div>

      {/* Mic */}
      <span style={{ fontSize: 13, color: "#888" }}>🎤</span>

      {/* Stop button */}
      <div style={{
        width: 26,
        height: 26,
        borderRadius: "50%",
        background: "#111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ width: 9, height: 9, background: "#FFF", borderRadius: 2 }} />
      </div>
    </div>

    {/* Bottom chips row */}
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#888", paddingBottom: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
        <span style={{ fontSize: 10 }}>□</span>
        <span>Work locally</span>
        <span style={{ fontSize: 9 }}>▾</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
        <span style={{ fontSize: 10 }}>⌥</span>
        <span>main</span>
        <span style={{ fontSize: 9 }}>▾</span>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────
// UserMessageBubble — centered pill at top of Codex chat
// ─────────────────────────────────────────────────────────────────
export const UserMessageBubble: React.FC = () => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    marginBottom: 16,
    marginTop: 4,
  }}>
    <div style={{
      background: "#F0F0F0",
      borderRadius: 14,
      padding: "10px 18px",
      fontSize: 13,
      color: "#1A1A1A",
      lineHeight: 1.5,
      width: "96%",
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 5,
      fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
    }}>
      <span>Run this app in</span>
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        background: "#E8EEFF",
        border: "1px solid #C0CCFF",
        borderRadius: 5,
        padding: "1px 7px",
        fontSize: 12,
        color: "#3B5FE0",
        fontWeight: 600,
      }}>
        <span style={{ fontSize: 10 }}>🔵</span>
        <span>Xcode</span>
      </span>
      <span>, test it by playing a game, and fix any bugs you find</span>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────
// TicTacToeGrid — 3x3 cloud grid
// ─────────────────────────────────────────────────────────────────
export const TicTacToeGrid: React.FC<{
  cellSize?: number;
  gap?: number;
}> = ({ cellSize = 90, gap = 8 }) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: `repeat(3, ${cellSize}px)`,
    gridTemplateRows: `repeat(3, ${cellSize}px)`,
    gap,
  }}>
    {Array.from({ length: 9 }).map((_, i) => (
      <div
        key={i}
        style={{
          width: cellSize,
          height: cellSize,
          background: "#EAF2FA",
          borderRadius: 12,
          border: "1px solid #D0E4F5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
        }}
      >
        {/* Cloud icon — SVG for proper rendering */}
        <svg width={cellSize * 0.48} height={cellSize * 0.32} viewBox="0 0 44 28" fill="none" style={{ opacity: 0.55 }}>
          <path d="M35 24H9a7 7 0 01-1-13.93A10 10 0 0127.09 8 7 7 0 0135 24z" fill="#8AB4D8" />
          <path d="M39 24h-4a5 5 0 000-10 6 6 0 00-5.76 4.35A5 5 0 0139 24z" fill="#8AB4D8" />
        </svg>
      </div>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// TicTacToeWindow — full Cloud Tic Tac Toe app window
// ─────────────────────────────────────────────────────────────────
export const TicTacToeWindow: React.FC<{
  style?: React.CSSProperties;
  cellSize?: number;
}> = ({ style = {}, cellSize = 90 }) => (
  <div style={{
    background: "#FFFFFF",
    borderRadius: 14,
    boxShadow: "0 24px 60px rgba(0,0,0,0.30)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    ...style,
  }}>
    {/* Title bar — lighter gray, matches reference */}
    <div style={{
      height: 40,
      background: "#F0F0F0",
      borderBottom: "1px solid #E0E0E0",
      display: "flex",
      alignItems: "center",
      padding: "0 12px",
      gap: 7,
      flexShrink: 0,
    }}>
      <div style={{ display: "flex", gap: 6 }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F56" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27C93F" }} />
      </div>
      <div style={{ flex: 1, textAlign: "center", fontSize: 12, color: "#888", fontFamily: "'SF Pro Text', sans-serif", fontWeight: 500 }}>
        Running CloudTicTacToe
      </div>
      {/* Build indicator */}
      <span style={{ color: "#F0A500", fontSize: 13 }}>⚡</span>
    </div>

    {/* App content — matches reference: white bg, large bold title, lighter cells */}
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "24px 16px 16px 16px",
      background: "#FFFFFF",
      fontFamily: "'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
    }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#0D0D0D", marginBottom: 6, letterSpacing: -0.5, textAlign: "center" }}>
        Cloud Tic Tac Toe
      </div>
      <div style={{ fontSize: 14, color: "#666", marginBottom: 16, textAlign: "center" }}>
        You are X. The computer is O.
      </div>
      {/* "Your turn" button — rounded pill, matches reference */}
      <div style={{
        background: "#F5F5F5",
        border: "1px solid #E0E0E0",
        borderRadius: 22,
        padding: "6px 22px",
        fontSize: 14,
        color: "#222",
        fontWeight: 500,
        marginBottom: 20,
      }}>
        Your turn
      </div>

      <TicTacToeGrid cellSize={cellSize} gap={8} />

      {/* New Game button at bottom */}
      <div style={{
        marginTop: 14,
        background: "#F0F0F0",
        borderRadius: 20,
        padding: "6px 20px",
        fontSize: 13,
        color: "#555",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        gap: 5,
      }}>
        <span style={{ fontSize: 11 }}>↺</span>
        <span>New Game</span>
      </div>
    </div>
  </div>
);
