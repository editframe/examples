import React from "react";

/**
 * Figma "Agent prompt" floating chat box, used in the Native Agent demo.
 * Shows a book icon, the prompt text (with optional blinking caret),
 * a tune-icon, and a round blue submit pill.
 */
export const PromptBox: React.FC<{
  text: string;
  width?: number;
  showCaret?: boolean;
  chip?: { label: string; color?: string };
}> = ({ text, width = 520, showCaret = true, chip }) => {
  return (
    <div
      style={{
        width,
        background: "#FFFFFF",
        borderRadius: 18,
        padding: "20px 22px 16px",
        boxShadow:
          "0 18px 40px rgba(0,0,0,0.18), 0 2px 0 rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.05)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {chip && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: chip.color || "#E7F1FE",
            color: "#0D7BFD",
            padding: "4px 10px 4px 8px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 10,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="#0D7BFD" strokeWidth="1.8" />
            <path d="M3 9 H21 M3 15 H21 M9 3 V21 M15 3 V21" stroke="#0D7BFD" strokeWidth="1.4" />
          </svg>
          {chip.label}
          <span style={{ opacity: 0.55, marginLeft: 2 }}>×</span>
        </div>
      )}
      <div
        style={{
          fontSize: 24,
          fontWeight: 400,
          color: "#1F1F1F",
          letterSpacing: "-0.01em",
          minHeight: 32,
          lineHeight: 1.3,
        }}
      >
        {text}
        {showCaret && (
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: "1.05em",
              background: "#1F1F1F",
              verticalAlign: "text-bottom",
              marginLeft: 2,
              animation: "blink 1s steps(1) infinite",
            }}
          />
        )}
      </div>
      <div
        style={{
          marginTop: 14,
          display: "flex",
          alignItems: "center",
          color: "#6B6B6B",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 4 H14 A4 4 0 0 1 18 8 V20 H8 A4 4 0 0 1 4 16 Z"
            stroke="#6B6B6B"
            strokeWidth="1.6"
          />
          <path d="M9 9 H14 M9 12 H13" stroke="#6B6B6B" strokeWidth="1.6" />
        </svg>
        <div style={{ marginLeft: "auto", display: "flex", gap: 14, alignItems: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 8 H20 M4 16 H20" stroke="#6B6B6B" strokeWidth="1.6" />
            <circle cx="9" cy="8" r="2.2" fill="#6B6B6B" />
            <circle cx="15" cy="16" r="2.2" fill="#6B6B6B" />
          </svg>
          <div
            style={{
              width: 32,
              height: 32,
              background: "#0D99FF",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              boxShadow: "0 2px 6px rgba(13,153,255,0.5)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 4 V20 M12 4 L6 10 M12 4 L18 10" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptBox;
