import React, { forwardRef } from "react";

/**
 * macOS-style white notification card (right side, late beats).
 * Icon (colored rounded square / circle) + title + optional timestamp + body.
 *
 * Three instances in the ad:
 *   1) Issue 781 — green target/record icon
 *   2) Afternoon at the park — blue calendar "31" icon + "in 10 min"
 *   3) Kite crew — kite avatar + "now"
 *
 * Ref-driven parent animates slide-in (translateX) + stack shift (translateY).
 */

type IconKind = "issue" | "calendar" | "kite";

interface Props {
  icon: IconKind;
  title: string;
  timestamp?: string;
  body: React.ReactNode;
  width?: number;
  style?: React.CSSProperties;
}

const Icon: React.FC<{ kind: IconKind }> = ({ kind }) => {
  if (kind === "issue") {
    // green ring + filled center dot (target/record), transparent bg
    return (
      <div className="notif-icon" style={{ background: "transparent" }}>
        <svg width="50" height="50" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="19" fill="none" stroke="var(--icon-green)" strokeWidth="4" />
          <circle cx="25" cy="25" r="7" fill="var(--icon-green)" />
        </svg>
      </div>
    );
  }
  if (kind === "calendar") {
    // blue rounded square, white "31", thin top accent (Google-calendar style)
    return (
      <div
        className="notif-icon"
        style={{ background: "var(--icon-blue)", flexDirection: "column", position: "relative" }}
      >
        <span style={{ color: "#fff", fontSize: 27, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>31</span>
      </div>
    );
  }
  // kite avatar — circular sky with a tiny kite (matches k_050)
  return (
    <div
      className="notif-icon"
      style={{ borderRadius: "50%", background: "linear-gradient(160deg,#CFE6F2,#A9D2E8)", overflow: "hidden" }}
    >
      <svg width="40" height="40" viewBox="0 0 40 40">
        <polygon points="20,7 29,17 20,27 11,17" fill="var(--kite-orange)" stroke="var(--kite-spar)" strokeWidth="1.8" />
        <line x1="11" y1="17" x2="29" y2="17" stroke="var(--kite-spar)" strokeWidth="1.6" />
        <line x1="20" y1="27" x2="20" y2="35" stroke="var(--kite-purple)" strokeWidth="1.8" strokeDasharray="2 2.5" />
      </svg>
    </div>
  );
};

const NotifCard = forwardRef<HTMLDivElement, Props>(
  ({ icon, title, timestamp, body, width = 720, style }, ref) => (
    <div ref={ref} className="notif-card" style={{ width, ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <Icon kind={icon} />
        <div className="notif-title" style={{ flex: 1 }}>{title}</div>
        {timestamp && <div className="notif-ts">{timestamp}</div>}
      </div>
      <div className="notif-body">{body}</div>
    </div>
  )
);
NotifCard.displayName = "NotifCard";
export default NotifCard;
