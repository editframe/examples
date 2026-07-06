import React from "react";
import { FONT } from "../constants";

/**
 * Reusable SVG/icon components shared across scenes (backlog rows + modal, integrations
 * cards, issue breadcrumbs, comment avatars). Extracted from the old monolithic Video.tsx
 * so every scene file can import just the icons it needs.
 */

/** Linear team icon — indigo rounded square with a white right-pointing play triangle + a thin
 *  vertical bar at the left (the Engineering team mark). */
export const TeamIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div
    style={{
      width: size, height: size, borderRadius: size * 0.27,
      background: "#5E6AD2", display: "flex", alignItems: "center",
      justifyContent: "center", flexShrink: 0,
    }}
  >
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 16 16" fill="none">
      <rect x="3.4" y="4" width="1.7" height="8" rx="0.7" fill="#E9EAFB" />
      <path d="M7 4.2 L12 8 L7 11.8 Z" fill="#E9EAFB" />
    </svg>
  </div>
);

/** Codegen icon — indigo-purple rounded square with a white diamond bisected by a code-bracket
 *  "< >" mark. */
export const CodegenSquare: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div
    style={{
      width: size, height: size, borderRadius: size * 0.27,
      background: "#7B5CF0", display: "flex", alignItems: "center",
      justifyContent: "center", flexShrink: 0,
    }}
  >
    <svg width={size * 0.74} height={size * 0.74} viewBox="0 0 20 20" fill="none">
      <path d="M10 1.4 L18.6 10 L10 18.6 L1.4 10 Z" fill="#FFFFFF" />
      <path
        d="M8.4 6.2 L5 10 L8.4 13.8 M11.6 6.2 L15 10 L11.6 13.8"
        stroke="#7B5CF0" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </svg>
  </div>
);

/** Codegen flat diamond (used on issue rows, no square bg — kept square to match the row look). */
export const CodegenRowIcon: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <CodegenSquare size={size} />
);

/** Yellow in-progress status — ring with the RIGHT half filled as a pie. */
export const StatusInProgress: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="9" cy="9" r="6.4" fill="none" stroke="#E2A610" strokeWidth="1.8" />
    <path d="M9 3.2 A5.8 5.8 0 0 1 9 14.8 Z" fill="#E2A610" />
  </svg>
);

/** Green in-review status — ring with the RIGHT half filled as a pie. */
export const StatusInReview: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="9" cy="9" r="6.4" fill="none" stroke="#3FA06A" strokeWidth="1.8" />
    <path d="M9 3.2 A5.8 5.8 0 0 1 9 14.8 Z" fill="#3FA06A" />
  </svg>
);

/** Empty todo dotted circle — thin grey dashed ring. */
export const StatusTodo: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="9" cy="9" r="6.6" fill="none" stroke="#6E7178" strokeWidth="1.5" strokeDasharray="1.6 2.4" strokeLinecap="round" />
  </svg>
);

/** Priority signal bars. */
export const PriorityBars: React.FC<{ level?: number; muted?: boolean }> = ({ level = 3, muted }) => {
  const on = muted ? "#62646B" : "#8A8F98";
  const off = "#3A3B42";
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <rect x="1" y="9" width="3" height="6" rx="1" fill={level >= 1 ? on : off} />
      <rect x="6" y="5" width="3" height="10" rx="1" fill={level >= 2 ? on : off} />
      <rect x="11" y="1" width="3" height="14" rx="1" fill={level >= 3 ? on : off} />
    </svg>
  );
};

/** Urgent priority — orange/red rounded square with "!". */
export const PriorityUrgent: React.FC = () => (
  <div style={{ width: 17, height: 17, borderRadius: 4, background: "#EB5C41", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, lineHeight: 1, fontFamily: FONT }}>!</span>
  </div>
);

/** Checkbox — starts dark/unchecked and animates to Linear-indigo/checked. `style` carries
 *  the background/border-color ramp, `iconStyle` the check-mark's own opacity ramp — both
 *  driven by the shared CSS animations in scenes/Backlog.tsx (all six rows animate
 *  identically, never staggered by row index). */
export const Checkbox: React.FC<{ style?: React.CSSProperties; iconStyle?: React.CSSProperties }> = ({ style, iconStyle }) => (
  <div
    style={{
      width: 18, height: 18, borderRadius: 5,
      border: "2px solid #62646B", backgroundColor: "transparent",
      flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
      ...style,
    }}
  >
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ opacity: 0, ...iconStyle }}>
      <path d="M2 5.6 L4.3 8 L9 2.6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

/** Small person avatar (gradient circle). */
export const Avatar: React.FC<{ size?: number; from?: string; to?: string }> = ({ size = 28, from = "#3a4a3a", to = "#566b56" }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg, ${from}, ${to})`, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: "50%", top: "28%", transform: "translateX(-50%)", width: size * 0.34, height: size * 0.34, borderRadius: "50%", background: "rgba(255,255,255,0.55)" }} />
    <div style={{ position: "absolute", left: "50%", bottom: "-12%", transform: "translateX(-50%)", width: size * 0.62, height: size * 0.5, borderRadius: "50% 50% 0 0", background: "rgba(255,255,255,0.45)" }} />
  </div>
);

/** Faint person-placeholder ring (assignee unset) — dotted ring + grey silhouette. */
export const AssigneeRing: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 26 26" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="13" cy="13" r="11" stroke="#43454C" strokeWidth="1.3" strokeDasharray="1.8 2.4" strokeLinecap="round" />
    <circle cx="13" cy="10.4" r="3" fill="#5C5E66" />
    <path d="M6.5 19.5 C7.5 15.6 18.5 15.6 19.5 19.5" stroke="#5C5E66" strokeWidth="2.4" strokeLinecap="round" fill="none" />
  </svg>
);

/** GitHub octocat mark — grey, used on PR activity line + PR card. */
export const GitHubMark: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#9CA0A8" style={{ flexShrink: 0 }}>
    <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12c0 4.65 3.0 8.58 7.18 9.97.52.1.71-.23.71-.5l-.01-1.76c-2.92.63-3.54-1.4-3.54-1.4-.48-1.22-1.17-1.54-1.17-1.54-.95-.65.07-.64.07-.64 1.06.07 1.61 1.09 1.61 1.09.94 1.6 2.46 1.14 3.06.87.1-.68.37-1.14.67-1.4-2.33-.27-4.78-1.17-4.78-5.18 0-1.15.41-2.08 1.08-2.82-.11-.27-.47-1.34.1-2.79 0 0 .88-.28 2.88 1.08a10 10 0 0 1 5.24 0c2-1.36 2.88-1.08 2.88-1.08.57 1.45.21 2.52.1 2.79.68.74 1.08 1.67 1.08 2.82 0 4.02-2.46 4.9-4.8 5.16.38.33.71.97.71 1.96l-.01 2.9c0 .28.19.61.72.5A10.51 10.51 0 0 0 22.5 12C22.5 6.2 17.8 1.5 12 1.5Z" />
  </svg>
);

/** Breadcrumb tail — three dots (···) + hollow star, as crisp SVG. */
export const BreadcrumbTail: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, marginLeft: 14 }}>
    <svg width="30" height="8" viewBox="0 0 30 8" fill="#8A8F98">
      <circle cx="4" cy="4" r="2" />
      <circle cx="15" cy="4" r="2" />
      <circle cx="26" cy="4" r="2" />
    </svg>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 3 L14.6 8.7 L20.8 9.4 L16.2 13.6 L17.5 19.7 L12 16.5 L6.5 19.7 L7.8 13.6 L3.2 9.4 L9.4 8.7 Z"
        stroke="#76787F" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
    </svg>
  </div>
);

// ── Agent icons for the Assign modal (Backlog) & Integrations cards ──
export const SentryIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.3, background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 20 18" fill="none">
      <path d="M10 2 L17.5 16 H13.8 L10 8.6 L7.4 13.5 H9.3 L10.6 16 H2.5 L10 2 Z" fill="#fff" />
    </svg>
  </div>
);
/** Fin — white/light circle with a black asterisk-burst. */
export const FinIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: "#F4F4F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 20 20" fill="#0A0A0C">
      {[0, 45, 90, 135].map((a) => (
        <rect key={a} x="9.05" y="2.4" width="1.9" height="15.2" rx="0.95" transform={`rotate(${a} 10 10)`} />
      ))}
    </svg>
  </div>
);
export const ChatPRDIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.3, background: "linear-gradient(140deg, #F58AB0, #E0476A)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width={size * 0.66} height={size * 0.66} viewBox="0 0 22 22" fill="none">
      <path d="M11 3.4 a7.6 7.6 0 1 0 0.01 0 M11 6.2 a4.8 4.8 0 1 1 -0.01 0 M11 9 a2 2 0 1 0 0.01 0"
        stroke="#fff" strokeWidth="1.3" fill="none" opacity="0.92" />
    </svg>
  </div>
);
export const DevinIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.3, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width={size * 0.66} height={size * 0.66} viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="6" r="2.1" fill="#3886E1" />
      <circle cx="6.4" cy="9" r="2.1" fill="#2AA876" />
      <circle cx="15.6" cy="9" r="2.1" fill="#2AA876" />
      <circle cx="6.4" cy="14" r="2.1" fill="#3886E1" />
      <circle cx="15.6" cy="14" r="2.1" fill="#3886E1" />
      <circle cx="11" cy="16.6" r="2.1" fill="#2AA876" />
      <circle cx="11" cy="11" r="2.4" fill="#1E1E24" />
    </svg>
  </div>
);
/** Devin small cluster (no white bg) for comment headers. */
export const DevinCluster: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="11" cy="6" r="2.1" fill="#3886E1" />
    <circle cx="6.4" cy="9" r="2.1" fill="#2AA876" />
    <circle cx="15.6" cy="9" r="2.1" fill="#2AA876" />
    <circle cx="6.4" cy="14" r="2.1" fill="#3886E1" />
    <circle cx="15.6" cy="14" r="2.1" fill="#3886E1" />
    <circle cx="11" cy="16.6" r="2.1" fill="#2AA876" />
  </svg>
);
export const CharlieIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: "#0B0B0D", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid #26262c" }}>
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 20 20" fill="none">
      <path d="M16 6 A7 7 0 1 0 16 14 L11 10 Z" fill="#B7F23A" />
    </svg>
  </div>
);
export const RangerIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: "#F2EDE3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <span style={{ color: "#6B5B3A", fontSize: size * 0.34, fontWeight: 700, fontFamily: FONT }}>R</span>
  </div>
);
/** Stilla — white rounded square with a black 4-armed asterisk burst. */
export const StillaIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.3, background: "#F4F4F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 20 20" fill="#0A0A0C">
      {[0, 45, 90, 135].map((a) => (
        <rect key={a} x="9.05" y="2.6" width="1.9" height="14.8" rx="0.95" transform={`rotate(${a} 10 10)`} />
      ))}
    </svg>
  </div>
);

export const AGENT_ICON: Record<string, React.FC<{ size?: number }>> = {
  Sentry: SentryIcon, Fin: FinIcon, ChatPRD: ChatPRDIcon,
  Codegen: CodegenSquare, Devin: DevinIcon, Charlie: CharlieIcon,
  Ranger: RangerIcon, Stilla: StillaIcon,
};
export const MODAL_AGENTS = ["Sentry", "Fin", "ChatPRD", "Codegen", "Devin", "Charlie", "Ranger"];

/**
 * macOS-style cursor (white arrow, dark outline). Pass either:
 * - `refObj` — for a scene-scoped `addFrameTask` to drive position/opacity imperatively
 *   (only the Backlog scene needs this, for its two-segment cursor path — see
 *   scenes/Backlog.tsx), or
 * - `style` — for a plain CSS `animation` (used by Integrations + DevinIssue, whose
 *   cursor moves are simple single-segment tracks with no branching).
 */
export const Cursor: React.FC<{ refObj?: React.RefObject<HTMLDivElement>; style?: React.CSSProperties }> = ({ refObj, style }) => (
  <div ref={refObj} style={{ position: "absolute", left: 0, top: 0, zIndex: 60, opacity: 0, pointerEvents: "none", ...style }}>
    <svg width="40" height="48" viewBox="0 0 24 28" fill="none" style={{ position: "absolute", left: 0, top: 0 }}>
      <path d="M3 2 L3 23.5 L7.8 18.8 L11 26.5 L14 25 L10.8 17.2 L17.5 17.2 Z"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  </div>
);
