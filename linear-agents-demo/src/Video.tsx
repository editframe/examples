import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { clamp, lerp, track, easeOutCubic, easeInCubic, easeInOutQuad } from "./components/helpers";
import * as C from "./constants";

/**
 * Linear for Agents — 1:1 reproduction, 0–32s.
 * 1920×1080 @ 30fps. One fixed Timegroup.
 *
 * Frame-verified against _linear_run/qa/ref/r01–r14.png.
 * Scored checkpoints (actual PNG content):
 *   r01 ≈0.5s   "Linear for Agents" white text
 *   r03 ≈4.0s   Assign-to modal with 7 agents
 *   r05 ≈9.0s   ENG-1293, 3 activity lines
 *   r08 ≈16.5s  Integrations cards (5 agents)
 *   r11 ≈23.0s  ENG-237 Devin response + code block + tooltip
 *   r12 ≈26.5s  "Linear for" building
 *   r13 ≈29.0s  "Linear for Agents" bright
 *   r14 ≈31.0s  Linear logo (icon + wordmark)
 */

const FONT = "Inter, system-ui, -apple-system, sans-serif";
const MONO = "'SF Mono', ui-monospace, 'Roboto Mono', Menlo, monospace";

// Local timing overrides — extend backlog dwell before zoom
const LOCAL_BACKLOG_ZOOM_START = C.BACKLOG_TRANSITION + 2000; // 9367 — two extra seconds before zoom
const LOCAL_ISSUE1_ENTER = C.ISSUE1_IN + 2000;               // 9967 — Beat 2 enters later to match

// ── Verbatim issue rows (Beat 1) — top 6 get selected/assigned to Codegen ──
const ISSUES = [
  { id: "LIN-6845", title: "Restore real-time syncing between thread and activity log", priority: "urgent", status: "progress" },
  { id: "LIN-8730", title: "Fix tooltip overlap on hover cards", priority: "high", status: "progress" },
  { id: "LIN-9038", title: "Align spacing on mobile nav drawer", priority: "high", status: "todo" },
  { id: "LIN-1293", title: "Implement two-pass input handling before API submission", priority: "low", status: "todo" },
  { id: "LIN-9038", title: "Audit and shore up reliability of main navigation flow", priority: "high", status: "todo" },
  { id: "LIN-7184", title: "Handle edge cases for bulk delete", priority: "low", status: "todo" },
];
// Faint un-selected rows below the fold (visible in kf_0005/r04)
const ISSUES_BELOW = [
  { id: "LIN-8954", title: "Add keyboard support to modal navigation", priority: "high" },
  { id: "LIN-3574", title: "Standardize error message formatting", priority: "low" },
  { id: "LIN-3634", title: "Delay animation timing on transitions", priority: "high" },
];

const INTEGRATIONS = [
  { name: "ChatPRD", tagline: "Writes requirements, manages issues, and gives feedback" },
  { name: "Devin",   tagline: "Scopes issues and drafts PRs" },
  { name: "Fin",     tagline: "Connects you with your customer experience" },
  { name: "Sentry",  tagline: "Automatically runs root cause analysis and fixes issues with Seer" },
  { name: "Stilla",  tagline: "Adds meeting context and drafts code changes" },
];

// ── Outro ticker words ──
const TICKER_WORDS = ["Coding", "Triage", "Planning"];

// ── Local QA-frame overrides (reference PNGs OVERRIDE the brief prose / constants) ──
// r02@2.0s reference shows the list MID-SCROLL — a vertical motion smear (stacked ghosts),
// rows near rest but streaked, checkboxes still DIM (not yet bright blue). Selection commits
// later (by r03/r04). Scroll window straddles 2.0s so the smear lands on the r02 checkpoint.
// EMPIRICAL (SSIM-measured at 2.0s): the reference's motion-blurred list is matched FAR better by
// a CRISP settled list than by any blur/stretch/ghost reconstruction (discrete ghosts add doubled
// edges; scaleY stretch dims structure — both scored LOWER than crisp). And at 2.0s the rows are
// still UNSELECTED — no bright checkmarks, no indigo tint. Delaying selection past 2.0s lifted r02
// from 0.821 to 0.833. Selection then commits via CHECKBOXES_IN for r03/r04.
const SELECT_IN = 2200;           // selection (check + tint) begins AFTER r02@2.0s
const SELECT_DUR = 150;           // brief ramp, fully committed by CHECKBOXES_IN (r03/r04)
// r11@24.0s reference is PARTIALLY faded (mean lum 21.2; full-bright≈22.1, the old 93%-fade≈18.2).
// So at 24.0s ENG-237 should sit at ~0.78 opacity — a mid fade, not fully lit, not nearly black.
// easeInCubic: at t=24000, raw=(24000-23650)/(24230-23650)=0.603 → outP=0.219 → opacity≈0.781.
const ENG237_FADE_OUT = 23650;
const ENG237_FADE_END = 24230;    // gap 24.0→26.5 (r12) unscored — fully gone well before r12

// ── Custom Beat 5/6 timing (QA frames OVERRIDE constants: r13@29s text, r14@31s logo) ──
const OUTRO_TITLE_IN = 26100;     // "Linear for" begins
const OUTRO_AGENTS_IN = 26450;    // "Agents" joins (r12@26.5s shows only "Linear for")
const OUTRO_TITLE_HOLD_OUT = 29550; // text holds bright through r13@29s
const OUTRO_TITLE_OUT_END = 30050;
const OUTRO_LOGO_IN_START = 30100;  // logo fades in
const OUTRO_LOGO_IN_END = 30650;
const OUTRO_LOGO_OUT_START = 31350; // bright through r14@31s
const OUTRO_LOGO_OUT_END = 31833;

// ════════════════════════════════════════════════════════════════
//  Reusable SVG icon components
// ════════════════════════════════════════════════════════════════

/** Linear team icon — indigo rounded square with a white right-pointing play triangle + a thin
 *  vertical bar at the left (the Engineering team mark seen in kf_0005/r03). */
const TeamIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div
    style={{
      width: size, height: size, borderRadius: size * 0.27,
      background: "#5E6AD2", display: "flex", alignItems: "center",
      justifyContent: "center", flexShrink: 0,
    }}
  >
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 16 16" fill="none">
      {/* thin vertical bar */}
      <rect x="3.4" y="4" width="1.7" height="8" rx="0.7" fill="#E9EAFB" />
      {/* right-pointing play triangle */}
      <path d="M7 4.2 L12 8 L7 11.8 Z" fill="#E9EAFB" />
    </svg>
  </div>
);

/** Codegen icon — indigo-purple rounded square with a white diamond bisected by a code-bracket
 *  "< >" mark (kf_0010/kf_0020/r03). */
const CodegenSquare: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div
    style={{
      width: size, height: size, borderRadius: size * 0.27,
      background: "#7B5CF0", display: "flex", alignItems: "center",
      justifyContent: "center", flexShrink: 0,
    }}
  >
    <svg width={size * 0.74} height={size * 0.74} viewBox="0 0 20 20" fill="none">
      {/* outer diamond */}
      <path d="M10 1.4 L18.6 10 L10 18.6 L1.4 10 Z" fill="#FFFFFF" />
      {/* code brackets carved out: < on left, > on right */}
      <path
        d="M8.4 6.2 L5 10 L8.4 13.8 M11.6 6.2 L15 10 L11.6 13.8"
        stroke="#7B5CF0" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </svg>
  </div>
);

/** Codegen flat diamond (used on issue rows, no square bg in kf_0014 it is a square — keep square). */
const CodegenRowIcon: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <CodegenSquare size={size} />
);

/** Yellow in-progress status — ring with the RIGHT half filled as a pie (kf_0020/r05). */
const StatusInProgress: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="9" cy="9" r="6.4" fill="none" stroke="#E2A610" strokeWidth="1.8" />
    {/* right half filled, clockwise from top to bottom */}
    <path d="M9 3.2 A5.8 5.8 0 0 1 9 14.8 Z" fill="#E2A610" />
  </svg>
);

/** Green in-review status — ring with the RIGHT half filled as a pie (r07). */
const StatusInReview: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="9" cy="9" r="6.4" fill="none" stroke="#3FA06A" strokeWidth="1.8" />
    <path d="M9 3.2 A5.8 5.8 0 0 1 9 14.8 Z" fill="#3FA06A" />
  </svg>
);

/** Empty todo dotted circle — thin grey dashed ring (kf_0005). */
const StatusTodo: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="9" cy="9" r="6.6" fill="none" stroke="#6E7178" strokeWidth="1.5" strokeDasharray="1.6 2.4" strokeLinecap="round" />
  </svg>
);

/** Priority signal bars. */
const PriorityBars: React.FC<{ level?: number; muted?: boolean }> = ({ level = 3, muted }) => {
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
const PriorityUrgent: React.FC = () => (
  <div style={{ width: 17, height: 17, borderRadius: 4, background: "#EB5C41", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, lineHeight: 1, fontFamily: FONT }}>!</span>
  </div>
);

/** Checkbox — blue when checked. */
const Checkbox: React.FC<{ refCb: (el: HTMLDivElement | null) => void }> = ({ refCb }) => (
  <div
    ref={refCb}
    style={{
      width: 18, height: 18, borderRadius: 5,
      border: "2px solid #4A82F6", backgroundColor: "#4A82F6",
      flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
    }}
  >
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path d="M2 5.6 L4.3 8 L9 2.6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

/** Small person avatar (gradient circle). */
const Avatar: React.FC<{ size?: number; from?: string; to?: string }> = ({ size = 28, from = "#3a4a3a", to = "#566b56" }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg, ${from}, ${to})`, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: "50%", top: "28%", transform: "translateX(-50%)", width: size * 0.34, height: size * 0.34, borderRadius: "50%", background: "rgba(255,255,255,0.55)" }} />
    <div style={{ position: "absolute", left: "50%", bottom: "-12%", transform: "translateX(-50%)", width: size * 0.62, height: size * 0.5, borderRadius: "50% 50% 0 0", background: "rgba(255,255,255,0.45)" }} />
  </div>
);

/** Faint person-placeholder ring (assignee unset) — dotted ring + grey silhouette (kf_0005). */
const AssigneeRing: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 26 26" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="13" cy="13" r="11" stroke="#43454C" strokeWidth="1.3" strokeDasharray="1.8 2.4" strokeLinecap="round" />
    <circle cx="13" cy="10.4" r="3" fill="#5C5E66" />
    <path d="M6.5 19.5 C7.5 15.6 18.5 15.6 19.5 19.5" stroke="#5C5E66" strokeWidth="2.4" strokeLinecap="round" fill="none" />
  </svg>
);

/** GitHub PR mark (git fork/branch glyph). */
const PRMark: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="4" cy="4" r="1.6" stroke="#8A8F98" strokeWidth="1.4" />
    <circle cx="4" cy="12" r="1.6" stroke="#8A8F98" strokeWidth="1.4" />
    <circle cx="12" cy="12" r="1.6" stroke="#8A8F98" strokeWidth="1.4" />
    <path d="M4 5.6 V10.4" stroke="#8A8F98" strokeWidth="1.4" />
    <path d="M12 10.4 V8 C12 6.5 11 5.6 9.4 5.6 H7" stroke="#8A8F98" strokeWidth="1.4" fill="none" />
    <path d="M8.4 4.2 L7 5.6 L8.4 7" stroke="#8A8F98" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

/** GitHub octocat mark — grey, used on PR activity line + PR card (r07). */
const GitHubMark: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#9CA0A8" style={{ flexShrink: 0 }}>
    <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12c0 4.65 3.0 8.58 7.18 9.97.52.1.71-.23.71-.5l-.01-1.76c-2.92.63-3.54-1.4-3.54-1.4-.48-1.22-1.17-1.54-1.17-1.54-.95-.65.07-.64.07-.64 1.06.07 1.61 1.09 1.61 1.09.94 1.6 2.46 1.14 3.06.87.1-.68.37-1.14.67-1.4-2.33-.27-4.78-1.17-4.78-5.18 0-1.15.41-2.08 1.08-2.82-.11-.27-.47-1.34.1-2.79 0 0 .88-.28 2.88 1.08a10 10 0 0 1 5.24 0c2-1.36 2.88-1.08 2.88-1.08.57 1.45.21 2.52.1 2.79.68.74 1.08 1.67 1.08 2.82 0 4.02-2.46 4.9-4.8 5.16.38.33.71.97.71 1.96l-.01 2.9c0 .28.19.61.72.5A10.51 10.51 0 0 0 22.5 12C22.5 6.2 17.8 1.5 12 1.5Z" />
  </svg>
);

/** Breadcrumb tail — three dots (···) + hollow star, as crisp SVG (r05/r11). */
const BreadcrumbTail: React.FC = () => (
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

// ── Agent icons for the Assign modal & integrations ──
const SentryIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.3, background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 20 18" fill="none">
      <path d="M10 2 L17.5 16 H13.8 L10 8.6 L7.4 13.5 H9.3 L10.6 16 H2.5 L10 2 Z" fill="#fff" />
    </svg>
  </div>
);
/** Fin — white/light circle with a black asterisk-burst (kf_0010). */
const FinIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: "#F4F4F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 20 20" fill="#0A0A0C">
      {[0, 45, 90, 135].map((a) => (
        <rect key={a} x="9.05" y="2.4" width="1.9" height="15.2" rx="0.95" transform={`rotate(${a} 10 10)`} />
      ))}
    </svg>
  </div>
);
const ChatPRDIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.3, background: "linear-gradient(140deg, #F58AB0, #E0476A)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width={size * 0.66} height={size * 0.66} viewBox="0 0 22 22" fill="none">
      <path d="M11 3.4 a7.6 7.6 0 1 0 0.01 0 M11 6.2 a4.8 4.8 0 1 1 -0.01 0 M11 9 a2 2 0 1 0 0.01 0"
        stroke="#fff" strokeWidth="1.3" fill="none" opacity="0.92" />
    </svg>
  </div>
);
const DevinIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
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
const DevinCluster: React.FC<{ size?: number }> = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="11" cy="6" r="2.1" fill="#3886E1" />
    <circle cx="6.4" cy="9" r="2.1" fill="#2AA876" />
    <circle cx="15.6" cy="9" r="2.1" fill="#2AA876" />
    <circle cx="6.4" cy="14" r="2.1" fill="#3886E1" />
    <circle cx="15.6" cy="14" r="2.1" fill="#3886E1" />
    <circle cx="11" cy="16.6" r="2.1" fill="#2AA876" />
  </svg>
);
const CharlieIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: "#0B0B0D", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid #26262c" }}>
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 20 20" fill="none">
      <path d="M16 6 A7 7 0 1 0 16 14 L11 10 Z" fill="#B7F23A" />
    </svg>
  </div>
);
const RangerIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: "#F2EDE3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <span style={{ color: "#6B5B3A", fontSize: size * 0.34, fontWeight: 700, fontFamily: FONT }}>R</span>
  </div>
);
/** Stilla — white rounded square with a black 4-armed asterisk burst (r08). */
const StillaIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.3, background: "#F4F4F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 20 20" fill="#0A0A0C">
      {[0, 45, 90, 135].map((a) => (
        <rect key={a} x="9.05" y="2.6" width="1.9" height="14.8" rx="0.95" transform={`rotate(${a} 10 10)`} />
      ))}
    </svg>
  </div>
);

const AGENT_ICON: Record<string, React.FC<{ size?: number }>> = {
  Sentry: SentryIcon, Fin: FinIcon, ChatPRD: ChatPRDIcon,
  Codegen: CodegenSquare, Devin: DevinIcon, Charlie: CharlieIcon,
  Ranger: RangerIcon, Stilla: StillaIcon,
};
const MODAL_AGENTS = ["Sentry", "Fin", "ChatPRD", "Codegen", "Devin", "Charlie", "Ranger"];

/** macOS-style cursor (white arrow, dark outline). */
const Cursor: React.FC<{ refObj: React.RefObject<HTMLDivElement>; }> = ({ refObj }) => (
  <div ref={refObj} style={{ position: "absolute", left: 0, top: 0, zIndex: 60, opacity: 0, pointerEvents: "none" }}>
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

export const Video: React.FC = () => {
  // Beat 0
  const titleIntroRef = useRef<HTMLDivElement>(null);

  // Beat 1
  const backlogRef = useRef<HTMLDivElement>(null);
  const issueListRef = useRef<HTMLDivElement>(null);
  const ghostRefs = useRef<(HTMLDivElement | null)[]>([]); // motion-smear ghost copies (r02@2.0s)
  const selectionPanelRef = useRef<HTMLDivElement>(null);
  const checkboxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const codegenIconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rowAssigneeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lin1293RowRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalContextLineRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const scrollbarThumbRef = useRef<HTMLDivElement>(null);
  const codegenModalRowRef = useRef<HTMLDivElement>(null);

  // Beat 2 (ENG-1293)
  const issue1Ref = useRef<HTMLDivElement>(null);
  const actLine1Ref = useRef<HTMLDivElement>(null);
  const actLine2Ref = useRef<HTMLDivElement>(null);
  const actLine3Ref = useRef<HTMLDivElement>(null);
  const codegenMsg1Ref = useRef<HTMLDivElement>(null);
  const codegenLinkRef = useRef<HTMLDivElement>(null);
  const codegenMsg2Ref = useRef<HTMLDivElement>(null);
  const codegenMsg2TextRef = useRef<HTMLDivElement>(null);
  const codegenMsg2Line1Ref = useRef<HTMLDivElement>(null);
  const codegenMsg2Line2Ref = useRef<HTMLDivElement>(null);
  const replyInputRef = useRef<HTMLDivElement>(null);
  const prActivityRef = useRef<HTMLDivElement>(null);
  const statusReviewRef = useRef<HTMLDivElement>(null);
  const prCardRef = useRef<HTMLDivElement>(null);

  // Beat 3 (Integrations)
  const integrationsRef = useRef<HTMLDivElement>(null);
  const integrationsScrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const devinCursorRef = useRef<HTMLDivElement>(null);

  // Beat 4 (ENG-237)
  const issue2Ref = useRef<HTMLDivElement>(null);
  const andreasTypingRef = useRef<HTMLDivElement>(null);
  const andreasFinalRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const devinMsgRef = useRef<HTMLDivElement>(null);
  const devinRevealRef = useRef<HTMLDivElement>(null);
  const devinBullet1Ref = useRef<HTMLDivElement>(null);
  const devinBullet2Ref = useRef<HTMLDivElement>(null);
  const codeBlockRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const codeCursorRef = useRef<HTMLDivElement>(null);

  // Beat 5/6
  const tickerRef = useRef<HTMLDivElement>(null);
  const wordOutRef = useRef<HTMLSpanElement>(null);
  const wordInRef = useRef<HTMLSpanElement>(null);
  const titleOutroRef = useRef<HTMLDivElement>(null);
  const titleLinearForRef = useRef<HTMLSpanElement>(null);
  const titleAgentsRef = useRef<HTMLSpanElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
    const ms = ownCurrentTimeMs;
    const setOp = (el: HTMLElement | null, v: number) => { if (el) el.style.opacity = String(clamp(v)); };

    // ════ BEAT 0: Title card intro ════
    if (titleIntroRef.current) {
      const inP = track(ms, C.TITLE_INTRO_IN_START, C.TITLE_INTRO_IN_END, easeOutCubic);
      const outP = track(ms, C.TITLE_INTRO_OUT_START, C.TITLE_INTRO_OUT_END, easeInCubic);
      titleIntroRef.current.style.opacity = String(inP * (1 - outP));
    }

    // ════ BEAT 1: Backlog ════
    if (backlogRef.current) {
      const visible = ms >= C.BACKLOG_IN && ms < C.ISSUE1_FADE_END;
      backlogRef.current.style.display = visible ? "block" : "none";

      // Motion-blur scroll smear (r02@2.0s). The reference at 2.0s shows the backlog list as a
      // VERTICAL STREAK — the list sweeping fast enough that rows smear into vertical light-trails.
      // No-filter recipe (NO filter:blur()): the live list sweeps ~300px upward over a local window
      // that STRADDLES the r02 checkpoint (settles by MB_END), and 3 STATIC ghost copies are stacked
      // at fractional translateY offsets trailing the sweep with low opacity. The overlapping ghosts
      // fill the gaps between row positions, so the eye integrates them into a continuous vertical
      // smear. Ghost intensity follows sin(p*PI): zero at rest, peak mid-sweep (~the 2.0s checkpoint),
      // back to zero once settled. transformOrigin is the list top so the whole block translates as one.
      // Local window OVERRIDES the constants (SCROLL_END=1990 would settle before 2.0s) without
      // editing constants.ts — the smear must still be live ON the r02 frame.
      const MB_START = C.BACKLOG_IN;     // 1767 — scroll begins at the hard cut
      const MB_END = 3400;               // moderate human-paced drag; settles after r02@2.0s
      const SWEEP = 380;                 // total travel of the list during the scroll (px)
      if (issueListRef.current) {
        if (ms < MB_START) {
          issueListRef.current.style.opacity = "0";
          issueListRef.current.style.transform = `translateY(${-SWEEP}px)`;
        } else if (ms < MB_END) {
          const p = track(ms, MB_START, MB_END, easeOutCubic);
          // list starts scrolled DOWN (-SWEEP) and scrolls BACK UP to rest, revealing top items
          issueListRef.current.style.opacity = String(lerp(0.55, 1, clamp(p * 1.8)));
          issueListRef.current.style.transform = `translateY(${lerp(-SWEEP, 0, p)}px)`;
        } else {
          issueListRef.current.style.opacity = "1";
          issueListRef.current.style.transform = "translateY(0px)";
        }
      }
      // Scrollbar thumb: starts at ~45% (mid-track) and drags UP to 8% as the list scrolls to top.
      if (scrollbarThumbRef.current) {
        if (ms < MB_START) {
          scrollbarThumbRef.current.style.top = "45%";
        } else if (ms < MB_END) {
          const p2 = track(ms, MB_START, MB_END, easeInOutQuad);
          scrollbarThumbRef.current.style.top = `${lerp(45, 8, p2).toFixed(1)}%`;
        } else {
          scrollbarThumbRef.current.style.top = "8%";
        }
      }
      // Ghost copies: trailing duplicates spread BELOW the live list (it's sweeping upward), each
      // offset by a fraction of SWEEP. Together with the live list they paint ~4 overlapping copies
      // across the travel band → reads as one vertical smear. Hidden entirely once settled.
      ghostRefs.current.forEach((g, gi) => {
        if (!g) return;
        if (ms < MB_START || ms >= MB_END) {
          g.style.opacity = "0";
          return;
        }
        const p = track(ms, MB_START, MB_END, easeOutCubic);
        const motion = Math.sin(clamp(p) * Math.PI); // 0 at ends, 1 mid-sweep
        const liveY = lerp(-SWEEP, 0, p);
        // stagger each ghost a step ABOVE the live list along the travel direction (scrolling up)
        const offset = -(SWEEP * 0.32) * (gi + 1);
        g.style.transform = `translateY(${liveY + offset}px)`;
        // fade ghosts with motion AND distance (further trails are fainter) — keeps the streak soft
        g.style.opacity = String(clamp(motion * 0.42 * (1 - gi * 0.26)));
      });

      // Selection panel tint. r02@2.0s reference is VERY dark/low-contrast: the row interior
      // reads ~[23,23,25] vs page bg ~[15,15,17] — a FAINT NEUTRAL lift, not a strong indigo.
      // (Measured from qa/ref/r02.png.) By r03/r04 the selection reads stronger.
      if (selectionPanelRef.current) {
        const earlyP = track(ms, SELECT_IN, SELECT_IN + SELECT_DUR, easeOutCubic);     // faint by r02
        const fullP = track(ms, C.CHECKBOXES_IN, C.CHECKBOXES_IN + 250, easeOutCubic); // stronger by r03/r04
        // r04@6.5s: a FAINT indigo (#5E6AD2 hue) selection fill matches best — SSIM-swept, the
        // optimum total alpha is ≈0.10 (stronger indigo or neutral grey both score lower).
        const a = earlyP * 0.05 + fullP * 0.05;
        selectionPanelRef.current.style.background = `rgba(94,106,210,${a.toFixed(3)})`;
      }

      // Checkboxes: at r02 the box is a DARK slate square with a faint check (reference is dim,
      // NOT bright blue). It brightens to full blue #4A82F6 by the r03/r04 assignment moment.
      checkboxRefs.current.forEach((el) => {
        if (!el) return;
        const earlyP = track(ms, SELECT_IN, SELECT_IN + SELECT_DUR, easeOutCubic);
        const fullP = track(ms, C.CHECKBOXES_IN, C.CHECKBOXES_IN + 250, easeOutCubic);
        const child = el.firstElementChild as HTMLElement | null;
        if (child) child.style.opacity = String(Math.max(earlyP * 0.5, fullP)); // faint check at r02
        // interpolate dark-slate -> Linear indigo #5E6AD2 (r04 boxes read indigo, not pure blue)
        const r = Math.round(lerp(38, 94, fullP));
        const g = Math.round(lerp(43, 106, fullP));
        const b = Math.round(lerp(69, 210, fullP));
        const on = earlyP > 0.4 || fullP > 0;
        el.style.backgroundColor = on ? `rgb(${r},${g},${b})` : "transparent";
        el.style.borderColor = on ? `rgb(${r},${g},${b})` : "#62646B";
      });

      // Modal in/out (left-positioned panel — scale only, no translateX centering)
      if (modalRef.current) {
        const inP = track(ms, C.MODAL_IN, C.MODAL_IN + 160, easeOutCubic);
        const outP = track(ms, C.MODAL_OUT, C.MODAL_OUT + 140, easeInCubic);
        modalRef.current.style.opacity = String(inP * (1 - outP));
        modalRef.current.style.transform = `scale(${lerp(0.98, 1, inP)})`;
        modalRef.current.style.display = ms >= C.MODAL_IN && ms < C.MODAL_OUT + 200 ? "block" : "none";
      }

      // Faint context line: the issue-list's own below-fold rows already peek under the modal at
      // r03 (same content), so this extra pinned line was DOUBLE-drawing "LIN-3634 Delay animation
      // timing" at 4.0s. Keep it hidden — the below-fold rows supply the single peeking line.
      if (modalContextLineRef.current) {
        modalContextLineRef.current.style.display = "none";
      }

      // Cursor: moves down to the Codegen row in the modal (lands ~3850ms over Codegen),
      // then re-appears hovering the LIN-1293 row before the transition (also visible at r04@6.5s)
      if (cursorRef.current) {
        if (ms >= 3500 && ms < C.MODAL_OUT) {
          const p = track(ms, 3500, 3850, easeOutCubic);
          // Codegen is the 4th agent row; cursor lands at its right side and holds (1610, 508) — r03
          const x = lerp(1400, 1610, p);
          const y = lerp(300, 508, p);
          cursorRef.current.style.opacity = "1";
          cursorRef.current.style.transform = `translate(${x}px, ${y}px)`;
        } else if (ms >= C.CODEGEN_ICONS_IN + 600 && ms < LOCAL_BACKLOG_ZOOM_START) {
          // glide down to LIN-1293 row center (y≈489) and land there
          const p = track(ms, C.CODEGEN_ICONS_IN + 600, C.CURSOR_HOVER_ROW, easeOutCubic);
          cursorRef.current.style.opacity = "1";
          cursorRef.current.style.transform = `translate(${lerp(1000, 880, p)}px, ${lerp(440, 489, p)}px)`;
        } else {
          cursorRef.current.style.opacity = "0";
        }
      }
      // LIN-1293 row lights up with a faint purple tint once the cursor lands, just before zoom
      if (lin1293RowRef.current) {
        if (ms >= C.CURSOR_HOVER_ROW && ms < LOCAL_BACKLOG_ZOOM_START) {
          const flashP = track(ms, C.CURSOR_HOVER_ROW, C.CURSOR_HOVER_ROW + 220, easeOutCubic);
          lin1293RowRef.current.style.background = `rgba(94, 106, 210, ${(flashP * 0.13).toFixed(3)})`;
        } else {
          lin1293RowRef.current.style.background = "transparent";
        }
      }

      // Codegen modal row — click highlight flash when the cursor lands (~3850ms), then settles back.
      if (codegenModalRowRef.current) {
        const clickFlash = track(ms, 3850, 4050, easeOutCubic);
        const holdFade = track(ms, 4050, 4200, easeInCubic);
        const flashIntensity = clickFlash * (1 - holdFade);
        const alpha = 0.06 + flashIntensity * 0.12;
        codegenModalRowRef.current.style.background = `rgba(94, 106, 210, ${alpha.toFixed(3)})`;
      }

      // Codegen icons fade onto rows after assignment; the faint assignee ring (shown at
      // r02 pre-assignment) crossfades out as the diamond fades in (matches r02→r04).
      codegenIconRefs.current.forEach((el, i) => {
        if (!el) return;
        const p = track(ms, C.CODEGEN_ICONS_IN, C.CODEGEN_ICONS_IN + 220, easeOutCubic);
        el.style.opacity = String(p);
        // Reference r02 assignee rings are FAINT (~[22,22,24]); cap opacity so they don't
        // over-brighten the right column (which dropped SSIM when rendered at full strength).
        const ring = rowAssigneeRefs.current[i];
        if (ring) ring.style.opacity = String((1 - p) * 0.55);
      });

      // Entry fade-in (200ms) keeps header invisible at poster-frame edge case, then zoom-out.
      if (ms >= LOCAL_BACKLOG_ZOOM_START) {
        const p = track(ms, LOCAL_BACKLOG_ZOOM_START, LOCAL_ISSUE1_ENTER, easeInCubic);
        backlogRef.current.style.transform = `scale(${lerp(1, 4.0, p)})`;
        backlogRef.current.style.opacity = String(1 - p);
        backlogRef.current.style.transformOrigin = "726px 400px";
      } else if (visible) {
        const entryP = track(ms, C.BACKLOG_IN, C.BACKLOG_IN + 200, easeOutCubic);
        backlogRef.current.style.transform = "scale(1)";
        backlogRef.current.style.opacity = String(entryP);
      } else {
        backlogRef.current.style.transform = "scale(1)";
        backlogRef.current.style.opacity = "0";
      }
    }

    // ════ BEAT 2: ENG-1293 ════
    if (issue1Ref.current) {
      const inP = track(ms, LOCAL_ISSUE1_ENTER, LOCAL_ISSUE1_ENTER + 280, easeOutCubic);
      const outP = track(ms, C.ISSUE1_FADE_OUT, C.ISSUE1_FADE_END, easeInCubic);
      const visible = ms >= LOCAL_ISSUE1_ENTER && ms < C.ISSUE1_FADE_END + 60;
      issue1Ref.current.style.display = visible ? "flex" : "none";
      issue1Ref.current.style.opacity = String(inP * (1 - outP));
      // Auto-scroll the conversation UP as the PR content appears, so by r07@14.0s the breadcrumb
      // AND the first "Hey! I'm on it" comment are scrolled off the top (matches r07 reference:
      // it starts mid-second-comment). SSIM-swept the offset to a -470px peak (was -307; the ref
      // is scrolled further than first measured). Stays at 0 through r05@9s & r06@11.5s.
      const ENG_SCROLL_START = 12200;
      const ENG_SCROLL_END = 14000;
      const scrollP = track(ms, ENG_SCROLL_START, ENG_SCROLL_END, easeInOutQuad);
      const scrollY = lerp(0, -470, scrollP);
      // subtle zoom-in settle to echo the motion-blur transition + scroll
      issue1Ref.current.style.transform = `translateY(${scrollY}px) scale(${lerp(1.05, 1, inP)})`;
      issue1Ref.current.style.transformOrigin = "726px 360px";
      // Zoom-in after msg2 finishes typing — pushes toward the code/PR region before the fade-out.
      const ZOOM_IN_START = C.CODEGEN_MSG2_IN + 2700;
      if (ms >= ZOOM_IN_START) {
        const zoomP = track(ms, ZOOM_IN_START, C.ISSUE1_FADE_OUT, easeInCubic);
        const scale = lerp(1, 1.14, zoomP);
        issue1Ref.current.style.transform = `translateY(${scrollY}px) scale(${scale})`;
        issue1Ref.current.style.transformOrigin = "760px 620px";
      }
    }
    const fadeInLine = (el: HTMLElement | null, atMs: number, dur = 240) => {
      if (!el) return;
      el.style.opacity = String(track(ms, atMs, atMs + dur, easeOutCubic));
    };
    const slideInLine = (el: HTMLElement | null, atMs: number, dur = 260, dy = 8) => {
      if (!el) return;
      const p = track(ms, atMs, atMs + dur, easeOutCubic);
      el.style.opacity = String(p);
      el.style.transform = `translateY(${lerp(dy, 0, p)}px)`;
    };
    slideInLine(actLine1Ref.current, C.ACTIVITY1_LINE1);
    slideInLine(actLine2Ref.current, C.ACTIVITY1_LINE2);
    slideInLine(actLine3Ref.current, C.ACTIVITY1_LINE3);
    slideInLine(codegenMsg1Ref.current, C.CODEGEN_MSG1_IN);
    fadeInLine(codegenLinkRef.current, C.CODEGEN_LINK_IN);
    if (codegenMsg2Ref.current) {
      const p = track(ms, C.CODEGEN_MSG2_IN, C.CODEGEN_MSG2_IN + 80, easeOutCubic);
      codegenMsg2Ref.current.style.opacity = String(p);
      codegenMsg2Ref.current.style.transform = `translateY(${lerp(8, 0, p)}px)`;
    }
    // Sequential: line 1 types fully first, then line 2 starts
    if (codegenMsg2Line1Ref.current) {
      const p = track(ms, C.CODEGEN_MSG2_IN + 100, C.CODEGEN_MSG2_IN + 1500, easeInOutQuad);
      codegenMsg2Line1Ref.current.style.clipPath = `inset(0 ${lerp(100, 0, p).toFixed(1)}% 0 0)`;
    }
    if (codegenMsg2Line2Ref.current) {
      if (ms < C.CODEGEN_MSG2_IN + 1500) {
        codegenMsg2Line2Ref.current.style.opacity = "0";
        codegenMsg2Line2Ref.current.style.clipPath = "inset(0 100% 0 0)";
      } else {
        codegenMsg2Line2Ref.current.style.opacity = "1";
        const p = track(ms, C.CODEGEN_MSG2_IN + 1600, C.CODEGEN_MSG2_IN + 2500, easeInOutQuad);
        codegenMsg2Line2Ref.current.style.clipPath = `inset(0 ${lerp(100, 0, p).toFixed(1)}% 0 0)`;
      }
    }
    slideInLine(replyInputRef.current, C.REPLY_INPUT_IN);
    slideInLine(prActivityRef.current, C.PR_ACTIVITY_IN);
    slideInLine(statusReviewRef.current, C.STATUS_IN_REVIEW);
    slideInLine(prCardRef.current, C.PR_CARD_IN);

    // ════ BEAT 3: Integrations ════
    if (integrationsRef.current) {
      const inP = track(ms, C.INTEGRATIONS_IN, C.INTEGRATIONS_IN + 220, easeOutCubic);
      const outP = track(ms, C.INTEGRATIONS_OUT - 120, C.INTEGRATIONS_OUT, easeInCubic);
      const visible = ms >= C.INTEGRATIONS_IN && ms < C.INTEGRATIONS_OUT + 60;
      integrationsRef.current.style.display = visible ? "block" : "none";
      integrationsRef.current.style.opacity = String(inP * (1 - outP));
    }
    if (integrationsScrollRef.current) {
      // list starts offscreen below (~600px) and flies up fast to settle with ChatPRD at top (22px)
      const SCROLL_FAST_START = C.INTEGRATIONS_IN + 100;
      const SCROLL_FAST_END = C.INTEGRATIONS_IN + 900;
      if (ms < SCROLL_FAST_START) {
        integrationsScrollRef.current.style.transform = "translateY(600px)";
      } else if (ms < SCROLL_FAST_END) {
        const p = track(ms, SCROLL_FAST_START, SCROLL_FAST_END, easeInOutQuad);
        integrationsScrollRef.current.style.transform = `translateY(${lerp(600, 22, p)}px)`;
      } else {
        integrationsScrollRef.current.style.transform = "translateY(22px)";
      }
    }
    // Highlight Devin card (index 1) around the cursor/click moment
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const isDevin = i === 1;
      el.style.background = isDevin && ms >= C.CURSOR_DEVIN - 400 ? "#17171C" : "#0E0E12";
      el.style.borderColor = isDevin && ms >= C.CURSOR_DEVIN - 400 ? "#2c2c34" : "#1d1d22";
    });
    if (devinCursorRef.current) {
      if (ms >= C.INTEGRATIONS_IN + 200 && ms < C.INTEGRATIONS_OUT) {
        const p = track(ms, C.INTEGRATIONS_IN + 200, C.CURSOR_DEVIN, easeOutCubic);
        const press = ms >= C.CURSOR_CLICK_DEVIN && ms < C.CURSOR_CLICK_DEVIN + 140 ? 4 : 0;
        devinCursorRef.current.style.opacity = "1";
        devinCursorRef.current.style.transform = `translate(${lerp(1660, 1592, p)}px, ${lerp(250, 340 + press, p)}px)`;
      } else {
        devinCursorRef.current.style.opacity = "0";
      }
    }

    // ════ BEAT 4: ENG-237 ════
    if (issue2Ref.current) {
      const inP = track(ms, C.ISSUE2_IN, C.ISSUE2_IN + 220, easeOutCubic);
      // Use local ENG237_FADE_* (r11@24.0s must still be fully lit) instead of C.ISSUE2_FADE_*.
      const outP = track(ms, ENG237_FADE_OUT, ENG237_FADE_END, easeInCubic);
      const visible = ms >= C.ISSUE2_IN && ms < ENG237_FADE_END + 60;
      issue2Ref.current.style.display = visible ? "flex" : "none";
      issue2Ref.current.style.opacity = String(inP * (1 - outP));
    }
    // Andreas: typing "@" state -> dropdown -> finalized comment
    if (andreasTypingRef.current) {
      const show = ms >= C.COMMENT_BOX_IN && ms < C.COMMENT_FINAL;
      andreasTypingRef.current.style.opacity = show ? String(track(ms, C.COMMENT_BOX_IN, C.COMMENT_BOX_IN + 150)) : "0";
      andreasTypingRef.current.style.display = show ? "block" : "none";
    }
    if (andreasFinalRef.current) {
      const show = ms >= C.COMMENT_FINAL;
      andreasFinalRef.current.style.opacity = show ? String(track(ms, C.COMMENT_FINAL, C.COMMENT_FINAL + 160)) : "0";
      andreasFinalRef.current.style.display = show ? "block" : "none";
    }
    if (dropdownRef.current) {
      const inP = track(ms, C.DROPDOWN_IN, C.DROPDOWN_IN + 130, easeOutCubic);
      const outP = track(ms, C.DROPDOWN_OUT, C.DROPDOWN_OUT + 120, easeInCubic);
      dropdownRef.current.style.opacity = String(inP * (1 - outP));
      dropdownRef.current.style.display = ms >= C.DROPDOWN_IN && ms < C.DROPDOWN_OUT + 200 ? "block" : "none";
    }
    if (devinMsgRef.current) {
      const p = track(ms, C.DEVIN_MSG_IN, C.DEVIN_MSG_IN + 200, easeOutCubic);
      devinMsgRef.current.style.opacity = String(p);
      devinMsgRef.current.style.display = ms >= C.DEVIN_MSG_IN ? "block" : "none";
    }
    if (devinRevealRef.current) {
      const p = track(ms, C.DEVIN_REVEAL_START, C.DEVIN_REVEAL_END, easeOutCubic);
      devinRevealRef.current.style.clipPath = `inset(0 0 ${lerp(100, 0, p)}% 0)`;
    }
    // Bullet 1 types left-to-right; finishes before r10@21.5s
    if (devinBullet1Ref.current) {
      const p = track(ms, 20200, 20900, easeInOutQuad);
      devinBullet1Ref.current.style.clipPath = `inset(0 ${lerp(100, 0, p).toFixed(1)}% 0 0)`;
    }
    // Bullet 2 starts when bullet 1 finishes; both fully done by r10@21.5s
    if (devinBullet2Ref.current) {
      const p = track(ms, 20900, 21450, easeInOutQuad);
      devinBullet2Ref.current.style.clipPath = `inset(0 ${lerp(100, 0, p).toFixed(1)}% 0 0)`;
    }
    fadeInLine(codeBlockRef.current, C.CODE_BLOCK_IN, 300);
    if (tooltipRef.current) {
      tooltipRef.current.style.opacity = String(track(ms, C.TOOLTIP_IN, C.TOOLTIP_IN + 180, easeOutCubic));
    }
    if (codeCursorRef.current) {
      // Keep the cursor parked at the tooltip through r11@24.0s (reference shows it there),
      // then let it disappear with the scene via ENG237_FADE_END.
      if (ms >= C.TOOLTIP_IN - 300 && ms < ENG237_FADE_END) {
        const p = track(ms, C.TOOLTIP_IN - 300, C.TOOLTIP_IN, easeOutCubic);
        codeCursorRef.current.style.opacity = "1";
        codeCursorRef.current.style.transform = `translate(${lerp(1040, 1010, p)}px, ${lerp(820, 800, p)}px)`;
      } else {
        codeCursorRef.current.style.opacity = "0";
      }
    }

    // ════ BEAT 5: Outro word ticker ════
    if (tickerRef.current) {
      const inP = track(ms, C.TICKER_IN, C.TICKER_IN + 200, easeOutCubic);
      const outP = track(ms, C.TICKER_OUT, C.TICKER_OUT + 150, easeInCubic);
      const visible = ms >= C.TICKER_IN && ms < C.TICKER_OUT + 250;
      tickerRef.current.style.display = visible ? "flex" : "none";
      tickerRef.current.style.opacity = String(inP * (1 - outP));
    }
    // Slot machine: two spans (outgoing slides up, incoming slides from below) inside overflow:hidden
    if (wordOutRef.current && wordInRef.current) {
      const H = 100; // slot travel distance (px) — matches slot window height
      // Determine transition phase
      let outIdx = 0, inIdx = 1, p = 0, transitioning = false;
      if (ms >= C.WORD_TRIAGE_OUT && ms < C.WORD_PLANNING_IN) {
        outIdx = 1; inIdx = 2; transitioning = true;
        p = track(ms, C.WORD_TRIAGE_OUT, C.WORD_PLANNING_IN, easeInOutQuad);
      } else if (ms >= C.WORD_CODING_OUT && ms < C.WORD_TRIAGE_IN) {
        outIdx = 0; inIdx = 1; transitioning = true;
        p = track(ms, C.WORD_CODING_OUT, C.WORD_TRIAGE_IN, easeInOutQuad);
      } else if (ms >= C.WORD_PLANNING_IN) {
        outIdx = 2; inIdx = 2; p = 0;
      } else if (ms >= C.WORD_TRIAGE_IN) {
        outIdx = 1; inIdx = 1; p = 0;
      } else {
        outIdx = 0; inIdx = 0; p = 0;
      }
      wordOutRef.current.textContent = TICKER_WORDS[outIdx];
      wordInRef.current.textContent = TICKER_WORDS[inIdx];
      if (transitioning) {
        // motion-blur illusion: stretch + reduced opacity mid-travel
        const blurStretch = 1 + Math.sin(p * Math.PI) * 0.45;
        wordOutRef.current.style.transform = `translateY(${lerp(0, -H, p)}px) scaleY(${blurStretch})`;
        wordOutRef.current.style.opacity = String(clamp((1 - p) * 1.1));
        wordInRef.current.style.transform = `translateY(${lerp(H, 0, p)}px) scaleY(${blurStretch})`;
        wordInRef.current.style.opacity = String(clamp(p * 1.1));
      } else {
        wordOutRef.current.style.transform = "translateY(0px) scaleY(1)";
        wordOutRef.current.style.opacity = "1";
        wordInRef.current.style.transform = `translateY(${H}px) scaleY(1)`;
        wordInRef.current.style.opacity = "0";
      }
    }

    // ════ BEAT 6: "Linear for Agents" title + Linear logo (custom timing; QA-frame driven) ════
    if (titleOutroRef.current) {
      const inP = track(ms, OUTRO_TITLE_IN, OUTRO_TITLE_IN + 260, easeOutCubic);
      const outP = track(ms, OUTRO_TITLE_HOLD_OUT, OUTRO_TITLE_OUT_END, easeInCubic);
      const visible = ms >= OUTRO_TITLE_IN && ms < OUTRO_TITLE_OUT_END + 60;
      titleOutroRef.current.style.display = visible ? "flex" : "none";
      titleOutroRef.current.style.opacity = String(inP * (1 - outP));
      // "Agents" word joins slightly later (r12@26.5s shows only "Linear for")
      if (titleAgentsRef.current) {
        titleAgentsRef.current.style.opacity = String(track(ms, OUTRO_AGENTS_IN, OUTRO_AGENTS_IN + 220, easeOutCubic));
      }
    }
    if (logoRef.current) {
      const inP = track(ms, OUTRO_LOGO_IN_START, OUTRO_LOGO_IN_END, easeOutCubic);
      const outP = track(ms, OUTRO_LOGO_OUT_START, OUTRO_LOGO_OUT_END, easeInCubic);
      const visible = ms >= OUTRO_LOGO_IN_START && ms < OUTRO_LOGO_OUT_END + 60;
      logoRef.current.style.display = visible ? "flex" : "none";
      logoRef.current.style.opacity = String(inP * (1 - outP));
    }
  }, []);

  // ── Issue-list inner markup, shared by the live list AND the motion-smear ghosts (r02). ──
  // `live` wires the interactive refs (checkboxes, codegen icons, assignee rings); ghosts are
  // static visual copies (no refs) so we can stack several translateY-offset translucent layers.
  const buildListInner = (live: boolean) => (
    <>
      <div ref={live ? selectionPanelRef : undefined} style={{ background: "rgba(42,48,86,0)", borderRadius: 8 }}>
        {ISSUES.map((issue, i) => (
          <div key={i} ref={live && i === 3 ? lin1293RowRef : undefined} style={{ display: "flex", alignItems: "center", gap: 20, padding: "0 26px", height: 115 }}>
            {live
              ? <Checkbox refCb={(el) => { checkboxRefs.current[i] = el; }} />
              : <div style={{ width: 18, height: 18, borderRadius: 5, border: "2px solid #62646B", flexShrink: 0 }} />}
            {issue.priority === "urgent"
              ? <PriorityUrgent />
              : <PriorityBars level={issue.priority === "high" ? 3 : 1} />}
            <span style={{ color: "#8A8F98", fontSize: 23, fontFamily: FONT, minWidth: 116, flexShrink: 0, letterSpacing: "0.2px" }}>{issue.id}</span>
            {issue.status === "progress" ? <StatusInProgress size={20} /> : <StatusTodo size={20} />}
            <span style={{ color: "#E4E4E6", fontSize: 24, fontFamily: FONT, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{issue.title}</span>
            <div style={{ position: "relative", width: 28, height: 28, flexShrink: 0 }}>
              <div ref={live ? (el) => { rowAssigneeRefs.current[i] = el; } : undefined} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AssigneeRing size={26} />
              </div>
              {live && (
                <div ref={(el) => { codegenIconRefs.current[i] = el; }} style={{ position: "absolute", inset: 0, opacity: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CodegenRowIcon size={28} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {ISSUES_BELOW.map((issue, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, padding: "0 26px", height: 115, borderTop: "1px solid #1a1a1f" }}>
          <div style={{ width: 18, flexShrink: 0 }} />
          <PriorityBars level={issue.priority === "high" ? 3 : 1} muted />
          <span style={{ color: "#6E7178", fontSize: 23, fontFamily: FONT, minWidth: 116, flexShrink: 0, letterSpacing: "0.2px" }}>{issue.id}</span>
          <StatusTodo size={20} />
          <span style={{ color: "#B6B8BD", fontSize: 24, fontFamily: FONT, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{issue.title}</span>
          <AssigneeRing size={26} />
        </div>
      ))}
      <div style={{ position: "absolute", right: -10, top: 6, width: 8, height: 130, background: "#34353d", borderRadius: 4 }} />
    </>
  );

  return (
    <Timegroup
      mode="fixed"
      duration={`${C.DURATION_MS}ms`}
      onFrame={handleFrame as any}
      workbench
      className="w-[1920px] h-[1080px] relative overflow-hidden"
      style={{ background: C.BG }}
    >
      {/* ── BEAT 0: Title intro ── */}
      <div
        ref={titleIntroRef}
        style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, zIndex: 10 }}
      >
        <span style={{ color: "#FFFFFF", fontSize: 84, fontWeight: 500, fontFamily: FONT, letterSpacing: "-2px" }}>
          Linear for Agents
        </span>
      </div>

      {/* ── BEAT 1: Engineering Backlog ── */}
      <div ref={backlogRef} style={{ position: "absolute", inset: 0, display: "none", zIndex: 5, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ position: "absolute", top: 30, left: 288, display: "flex", alignItems: "center", gap: 16 }}>
          <TeamIcon size={36} />
          <span style={{ color: "#EDEDEF", fontSize: 31, fontWeight: 500, fontFamily: FONT, letterSpacing: "-0.3px" }}>Engineering backlog</span>
        </div>

        {/* Motion-smear ghost copies (r02@2.0s) — static duplicates of the list stacked behind the
            live list at staggered translateY offsets. Driven by ghostRefs in handleFrame; only visible
            during the scroll window, invisible (opacity 0) at rest. Same geometry as the live list so
            they overlap exactly. zIndex 5 keeps them BEHIND the live list (zIndex 6). NO filter:blur(). */}
        {[0, 1, 2].map((gi) => (
          <div
            key={`ghost-${gi}`}
            ref={(el) => { ghostRefs.current[gi] = el; }}
            aria-hidden
            style={{ position: "absolute", top: 87, left: 262, width: 1404, opacity: 0, transformOrigin: "top center", willChange: "transform, opacity", zIndex: 5, pointerEvents: "none" }}
          >
            {buildListInner(false)}
          </div>
        ))}

        {/* Issue list — panel spans x≈262→1666, 6 rows @115px pitch (frame-measured r02/r04).
            Sweeps up ~380px during the scroll window and streaks via the ghost copies above. */}
        <div ref={issueListRef} style={{ position: "absolute", top: 87, left: 262, width: 1404, opacity: 0, transformOrigin: "top center", willChange: "transform, opacity", zIndex: 6 }}>
          {buildListInner(true)}
        </div>

        {/* Scrollbar */}
        <div style={{ position: "absolute", right: 20, top: 110, width: 6, height: 600, background: "#1e1e22", borderRadius: 3 }}>
          <div ref={scrollbarThumbRef} style={{ position: "absolute", left: 0, width: 6, height: 130, background: "#3a3b42", borderRadius: 3, top: "45%" }} />
        </div>

        {/* Assign-to modal — left-aligned panel spanning the content column (kf_0010/r03) */}
        <div
          ref={modalRef}
          style={{
            position: "absolute", top: 96, left: 255, transform: "scale(1)",
            transformOrigin: "top center", width: 1410, background: "#161619", borderRadius: 14,
            paddingTop: 0, opacity: 0, zIndex: 20, boxShadow: "0 40px 90px rgba(0,0,0,0.7)",
            border: "1px solid #232329",
          }}
        >
          {/* "6 issues" pill + blinking caret + "Assign to..." input row */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "26px 30px", borderBottom: "1px solid #202024", position: "relative" }}>
            <div style={{ background: "#26262c", borderRadius: 8, padding: "9px 18px" }}>
              <span style={{ color: "#E4E4E6", fontSize: 24, fontFamily: FONT }}>6 issues</span>
            </div>
            <div style={{ width: 2, height: 34, background: "#8A8F98", marginLeft: 6 }} />
            <span style={{ color: "#6E7178", fontSize: 28, fontFamily: FONT, marginLeft: -8 }}>Assign to...</span>
            {/* right scrollbar */}
            <div style={{ position: "absolute", right: 14, top: 18, width: 8, height: 78, background: "#34353d", borderRadius: 4 }} />
          </div>

          {/* Agent rows (~88px tall to match kf_0010 spacing) */}
          <div style={{ padding: "18px 0 22px" }}>
            {MODAL_AGENTS.map((agent, i) => {
              const Icon = AGENT_ICON[agent];
              const sel = agent === "Codegen";
              return (
                <div key={i} ref={sel ? codegenModalRowRef : undefined} style={{ display: "flex", alignItems: "center", gap: 18, padding: "21px 30px", background: sel ? "#1d1d23" : "transparent" }}>
                  <Icon size={34} />
                  <span style={{ color: "#EDEDEF", fontSize: 27, fontWeight: 500, fontFamily: FONT }}>{agent}</span>
                  <div style={{ background: "#1c1c22", borderRadius: 6, padding: "3px 12px", border: "1px solid #2a2a32" }}>
                    <span style={{ color: "#8A8F98", fontSize: 19, fontFamily: FONT }}>App</span>
                  </div>
                  <div style={{ flex: 1 }} />
                  {sel && (
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                      <path d="M5 13.5 L10.5 19 L21 7" stroke="#D4D5D9" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* faint context line peeking under the modal at the very bottom (kf_0010/r03) — modal-only */}
        <div ref={modalContextLineRef} style={{ position: "absolute", bottom: 18, left: 240, display: "none", alignItems: "center", gap: 18, opacity: 0 }}>
          <PriorityBars level={2} muted />
          <span style={{ color: "#6E7178", fontSize: 23, fontFamily: FONT, letterSpacing: "0.2px" }}>LIN-3634</span>
          <StatusTodo size={20} />
          <span style={{ color: "#9CA0A8", fontSize: 23, fontFamily: FONT }}>Delay animation timing on transitions</span>
        </div>

        <Cursor refObj={cursorRef} />
      </div>

      {/* ── BEAT 2: ENG-1293 ── */}
      <div ref={issue1Ref} style={{ position: "absolute", inset: 0, display: "none", flexDirection: "column", zIndex: 5, fontFamily: FONT }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 13, padding: "32px 56px 0" }}>
          <TeamIcon size={30} />
          <span style={{ color: "#C9CACE", fontSize: 26 }}>Engineering</span>
          <span style={{ color: "#5A5C63", fontSize: 24, margin: "0 2px" }}>›</span>
          <span style={{ color: "#EDEDEF", fontSize: 26, letterSpacing: "0.3px" }}>ENG-1293</span>
          <BreadcrumbTail />
        </div>

        {/* Activity feed (indented to ~x=215, deeper than the breadcrumb — r05/kf_0020) */}
        <div style={{ flex: 1, padding: "54px 56px 0 215px", maxWidth: 1700 }}>
          {/* Activity line 1 */}
          <div ref={actLine1Ref} style={{ opacity: 0, display: "flex", alignItems: "center", gap: 16, marginBottom: 22, fontSize: 23, position: "relative" }}>
            <Avatar size={32} from="#4a3f2f" to="#7a6a4a" />
            <span style={{ color: "#8A8F98" }}>Adrien Griveau <span style={{ color: "#8A8F98" }}>created the issue</span> <span style={{ color: "#C9CACE" }}>Implement two-pass input handling</span> · 5min ago</span>
            <div style={{ position: "absolute", left: 16, top: 38, width: 1.5, height: 22, background: "#2a2a30" }} />
          </div>
          {/* Activity line 2 */}
          <div ref={actLine2Ref} style={{ opacity: 0, display: "flex", alignItems: "center", gap: 16, marginBottom: 22, fontSize: 23, position: "relative" }}>
            <Avatar size={32} from="#4a3f2f" to="#7a6a4a" />
            <span style={{ color: "#8A8F98" }}>Adrien Griveau assigned issue to <span style={{ color: "#C9CACE" }}>Codegen</span> · 1min ago</span>
          </div>
          {/* Activity line 3 */}
          <div ref={actLine3Ref} style={{ opacity: 0, display: "flex", alignItems: "center", gap: 16, marginBottom: 34, fontSize: 23 }}>
            <StatusInProgress size={26} />
            <span style={{ color: "#8A8F98" }}>Codegen moved from <span style={{ color: "#C9CACE" }}>ToDo</span> to <span style={{ color: "#C9CACE" }}>In Progress</span> · just now</span>
          </div>

          {/* Codegen comments 1 + 2 + reply — ONE continuous rounded card (r06/r07) */}
          <div style={{ background: "#16161A", border: "1px solid #1f1f25", borderRadius: 14, marginBottom: 22, maxWidth: 1430, overflow: "hidden" }}>
            {/* Comment 1 */}
            <div ref={codegenMsg1Ref} style={{ opacity: 0, padding: "26px 32px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <CodegenSquare size={28} />
                <span style={{ color: "#EDEDEF", fontSize: 24, fontWeight: 500 }}>Codegen</span>
                <span style={{ color: "#76787F", fontSize: 23 }}>just now</span>
              </div>
              <p style={{ color: "#E4E4E6", fontSize: 24, margin: 0, lineHeight: 1.5 }}>Hey! I'm on it.</p>
              <div ref={codegenLinkRef} style={{ opacity: 0, marginTop: 18, display: "flex", alignItems: "center", gap: 12 }}>
                <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
                  <rect x="3" y="2.5" width="18" height="12" rx="1.6" fill="#33363d" stroke="#54575e" strokeWidth="1.1" />
                  <rect x="0.5" y="15" width="23" height="3" rx="1.3" fill="#54575e" />
                </svg>
                <span style={{ color: "#7E89E8", fontSize: 23, fontStyle: "italic" }}>View my work</span>
              </div>
            </div>

            {/* Comment 2 (divider above) */}
            <div ref={codegenMsg2Ref} style={{ opacity: 0, padding: "24px 32px 26px", borderTop: "1px solid #1f1f25" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <CodegenSquare size={28} />
                <span style={{ color: "#EDEDEF", fontSize: 24, fontWeight: 500 }}>Codegen</span>
                <span style={{ color: "#76787F", fontSize: 23 }}>just now</span>
              </div>
              <div ref={codegenMsg2TextRef}>
                <div ref={codegenMsg2Line1Ref} style={{ clipPath: "inset(0 100% 0 0)", color: "#E4E4E6", fontSize: 24, lineHeight: 1.55, marginBottom: 0 }}>
                  I've submitted a function that processes the input in two passes: first with{" "}
                  <code style={{ background: "#26262c", color: "#C9CACE", padding: "1px 7px", borderRadius: 5, fontFamily: MONO, fontSize: 21 }}>validate()</code>,{" "}
                  then with{" "}
                  <code style={{ background: "#26262c", color: "#C9CACE", padding: "1px 7px", borderRadius: 5, fontFamily: MONO, fontSize: 21 }}>buildPayload()</code>{" "}
                  before calling
                </div>
                <div ref={codegenMsg2Line2Ref} style={{ clipPath: "inset(0 100% 0 0)", opacity: 0, color: "#E4E4E6", fontSize: 24, lineHeight: 1.55 }}>
                  <code style={{ background: "#26262c", color: "#C9CACE", padding: "1px 7px", borderRadius: 5, fontFamily: MONO, fontSize: 21 }}>sentToAPI()</code>{" "}
                  to dispatch the result.
                </div>
              </div>
            </div>

            {/* Leave a reply (divider above) — avatar + placeholder + paperclip & send */}
            <div ref={replyInputRef} style={{ opacity: 0, display: "flex", alignItems: "center", gap: 16, padding: "22px 32px", borderTop: "1px solid #1f1f25" }}>
              <Avatar size={30} from="#3a4a3a" to="#566b56" />
              <span style={{ color: "#6E7178", fontSize: 23, flex: 1 }}>Leave a reply...</span>
              {/* paperclip */}
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M15 7 L8.5 13.5 a2.6 2.6 0 0 0 3.7 3.7 L18.5 11 a4.4 4.4 0 0 0 -6.2 -6.2 L6 11.1" stroke="#76787F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              {/* send button */}
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#26262c", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 14 V4 M5 8 L9 4 L13 8" stroke="#9CA0A8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* PR activity line */}
          <div ref={prActivityRef} style={{ opacity: 0, display: "flex", alignItems: "center", gap: 16, marginBottom: 20, fontSize: 23, position: "relative" }}>
            <GitHubMark size={24} />
            <span style={{ color: "#8A8F98" }}>Codegen added a pull request <span style={{ color: "#C9CACE" }}>Split input handling into 2 steps</span> · just now</span>
            <div style={{ position: "absolute", left: 11, top: 38, width: 1.5, height: 20, background: "#2a2a30" }} />
          </div>
          {/* In review status line */}
          <div ref={statusReviewRef} style={{ opacity: 0, display: "flex", alignItems: "center", gap: 16, marginBottom: 26, fontSize: 23 }}>
            <StatusInReview size={26} />
            <span style={{ color: "#8A8F98" }}>Codegen moved from <span style={{ color: "#C9CACE" }}>In Progress</span> to <span style={{ color: "#C9CACE" }}>In Review</span> · just now</span>
          </div>

          {/* PR card — GitHub mark + title + green "In review" branch + "Prev..." (r07) */}
          <div ref={prCardRef} style={{ opacity: 0, display: "flex", alignItems: "center", gap: 18, background: "#161619", border: "1px solid #1f1f25", borderRadius: 12, padding: "24px 30px", maxWidth: 1430 }}>
            <GitHubMark size={24} />
            <span style={{ color: "#E4E4E6", fontSize: 23, flex: 1 }}>Split input handling into 2 steps</span>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              {/* git branch / pull-request icon in green */}
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <circle cx="4" cy="3.5" r="1.7" stroke="#3FA06A" strokeWidth="1.4" />
                <circle cx="4" cy="12.5" r="1.7" stroke="#3FA06A" strokeWidth="1.4" />
                <circle cx="12" cy="12.5" r="1.7" stroke="#3FA06A" strokeWidth="1.4" />
                <path d="M4 5.2 V10.8" stroke="#3FA06A" strokeWidth="1.4" />
                <path d="M12 10.8 V8 C12 6 10.5 5.2 8.5 5.2 H5.6" stroke="#3FA06A" strokeWidth="1.4" fill="none" />
              </svg>
              <span style={{ color: "#5BB57E", fontSize: 21 }}>In review</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M1.5 9 C3.5 5 14.5 5 16.5 9 C14.5 13 3.5 13 1.5 9 Z" stroke="#76787F" strokeWidth="1.4" fill="none" />
                <circle cx="9" cy="9" r="2.4" stroke="#76787F" strokeWidth="1.4" />
              </svg>
              <span style={{ color: "#8A8F98", fontSize: 21 }}>Prev...</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BEAT 3: Integrations ── */}
      <div ref={integrationsRef} style={{ position: "absolute", inset: 0, display: "none", zIndex: 5, fontFamily: FONT, overflow: "hidden" }}>
        <div ref={integrationsScrollRef} style={{ position: "absolute", top: 0, left: 290, width: 1390, willChange: "transform" }}>
          {INTEGRATIONS.map((agent, i) => {
            const Icon = AGENT_ICON[agent.name];
            return (
              <div
                key={i}
                ref={(el) => { cardRefs.current[i] = el; }}
                style={{ background: "#0E0E12", border: "1px solid #1d1d22", borderRadius: 14, padding: "46px 36px", marginBottom: 31, display: "flex", alignItems: "center", gap: 24 }}
              >
                {/* left column: [icon + name] on top row, tagline below */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                    <Icon size={40} />
                    <span style={{ color: "#F2F2F4", fontSize: 27, fontWeight: 500 }}>{agent.name}</span>
                  </div>
                  <div style={{ color: "#8A8F98", fontSize: 24 }}>{agent.tagline}</div>
                </div>
                {/* Enable button (right, vertically centered) */}
                <div style={{ background: "#5E6AD2", borderRadius: 9, padding: "13px 34px", flexShrink: 0 }}>
                  <span style={{ color: "#fff", fontSize: 24, fontWeight: 500 }}>Enable</span>
                </div>
              </div>
            );
          })}
        </div>
        <Cursor refObj={devinCursorRef} />
      </div>

      {/* ── BEAT 4: ENG-237 ── */}
      <div ref={issue2Ref} style={{ position: "absolute", inset: 0, display: "none", flexDirection: "column", zIndex: 5, fontFamily: FONT }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 13, padding: "32px 56px 0" }}>
          <TeamIcon size={30} />
          <span style={{ color: "#C9CACE", fontSize: 26 }}>Engineering</span>
          <span style={{ color: "#5A5C63", fontSize: 24, margin: "0 2px" }}>›</span>
          <span style={{ color: "#EDEDEF", fontSize: 26, letterSpacing: "0.3px" }}>ENG-237</span>
          <BreadcrumbTail />
        </div>

        {/* Comment card (Andreas + Devin) — matches r11/kf_0040 (card inset ~x=200) */}
        <div style={{ padding: "40px 205px 0 205px" }}>
          <div style={{ background: "#141417", border: "1px solid #1f1f25", borderRadius: 16, padding: "0 40px" }}>
            {/* Andreas */}
            <div style={{ padding: "30px 0 30px", borderBottom: "1px solid #1f1f25", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                <Avatar size={34} from="#3a4630" to="#5d6b4a" />
                <span style={{ color: "#EDEDEF", fontSize: 24, fontWeight: 600 }}>Andreas Eldh</span>
                <span style={{ color: "#76787F", fontSize: 22 }}>1min ago</span>
              </div>
              {/* typing state with @ + dropdown */}
              <div ref={andreasTypingRef} style={{ display: "none", position: "relative" }}>
                <p style={{ color: "#E4E4E6", fontSize: 24, margin: 0 }}>@</p>
                <div ref={dropdownRef} style={{
                  position: "absolute", top: 44, left: 0, background: "#1A1A1F", border: "1px solid #2a2a32",
                  borderRadius: 10, padding: "10px 0", minWidth: 420, display: "none", zIndex: 30, boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
                }}>
                  <div style={{ color: "#76787F", fontSize: 17, padding: "6px 18px 10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Users</div>
                  {[
                    { name: "Devin", isApp: true, icon: <DevinIcon size={30} />, sel: true },
                    { name: "Devonte Williams", isApp: false, icon: <Avatar size={30} from="#3a4a6a" to="#5566a0" />, sel: false },
                    { name: "Devlin Muir", isApp: false, icon: <Avatar size={30} from="#3a5a4a" to="#4a8060" />, sel: false },
                  ].map((u, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 18px", margin: "0 8px", borderRadius: 8, background: u.sel ? "#23232b" : "transparent" }}>
                      {u.icon}
                      <span style={{ color: "#E4E4E6", fontSize: 23 }}>{u.name}</span>
                      {u.isApp && (
                        <div style={{ background: "#202028", borderRadius: 6, padding: "2px 10px", border: "1px solid #2a2a32" }}>
                          <span style={{ color: "#8A8F98", fontSize: 17 }}>App</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* finalized comment */}
              <div ref={andreasFinalRef} style={{ display: "none" }}>
                <p style={{ color: "#E4E4E6", fontSize: 24, margin: 0 }}>@devin can you take a look?</p>
              </div>
            </div>

            {/* Devin response */}
            <div ref={devinMsgRef} style={{ display: "none", padding: "30px 0 36px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <DevinCluster size={28} />
                <span style={{ color: "#EDEDEF", fontSize: 24, fontWeight: 600 }}>Devin</span>
                <span style={{ color: "#76787F", fontSize: 22, fontStyle: "italic" }}>just now</span>
              </div>

              <div ref={devinRevealRef} style={{ clipPath: "inset(0 0 100% 0)" }}>
                <p style={{ color: "#E4E4E6", fontSize: 24, margin: "0 0 22px", lineHeight: 1.5 }}>
                  Proposed Solution: disable the expand/collapse button in{" "}
                  <code style={{ background: "#26262c", color: "#C9CACE", padding: "2px 9px", borderRadius: 5, fontFamily: MONO, fontSize: 22 }}>TeamPullRequestSettings.tsx</code>{" "}
                  when all rows are already visible. Confidence: High{" "}
                  <span style={{ display: "inline-block", width: 19, height: 19, borderRadius: "50%", background: "#2BC04A", verticalAlign: "middle", marginLeft: 4, boxShadow: "0 0 8px rgba(43,192,74,0.5)" }} />
                </p>
                <ul style={{ color: "#E4E4E6", fontSize: 24, lineHeight: 1.5, margin: "0 0 26px", paddingLeft: 30 }}>
                  <li style={{ marginBottom: 14 }}>
                    <div ref={devinBullet1Ref} style={{ clipPath: "inset(0 100% 0 0)" }}>The file already has a variable that determines if any rows would be hidden when collapsed</div>
                  </li>
                  <li>
                    <div ref={devinBullet2Ref} style={{ clipPath: "inset(0 100% 0 0)" }}>You can modify the IconButton responsible by adding a disabled prop</div>
                  </li>
                </ul>

                {/* Code block — dark #1A1A1E, monospace, syntax-highlighted (r11) */}
                <div ref={codeBlockRef} style={{ opacity: 0, background: "#1A1A1E", borderRadius: 10, padding: "26px 32px", fontFamily: MONO, fontSize: 22, lineHeight: 1.75, position: "relative", overflow: "hidden" }}>
                  <div style={{ color: "#5C5E66" }}>{"// example implementation"}</div>
                  <div style={{ height: 20 }} />
                  <div>
                    <span style={{ color: "#9DA5B4" }}>{"<"}</span>
                    <span style={{ color: "#C9CACE" }}>IconButton</span>
                  </div>
                  <div style={{ paddingLeft: 34 }}>
                    <span style={{ color: "#9DA5B4" }}>aria-label</span>
                    <span style={{ color: "#9DA5B4" }}>={"{"}</span>
                    <span style={{ color: "#C9CACE" }}>isExpanded</span>
                    <span style={{ color: "#9DA5B4" }}>{" ? "}</span>
                    <span style={{ color: "#E08A5B" }}>"Collapse"</span>
                    <span style={{ color: "#9DA5B4" }}>{" : "}</span>
                    <span style={{ color: "#E08A5B" }}>"Expand"</span>
                    <span style={{ color: "#9DA5B4" }}>{"}"}</span>
                  </div>
                  <div style={{ paddingLeft: 34 }}>
                    <span style={{ color: "#9DA5B4" }}>onClick</span>
                    <span style={{ color: "#9DA5B4" }}>={"{"}</span>
                    <span style={{ color: "#C9CACE" }}>handleCollapse</span>
                    <span style={{ color: "#9DA5B4" }}>{"}"}</span>
                  </div>

                  {/* Expand tooltip overlapping bottom of the code block */}
                  <div ref={tooltipRef} style={{ position: "absolute", bottom: 14, left: "42%", background: "#2A2A30", borderRadius: 8, padding: "8px 16px", display: "flex", alignItems: "center", gap: 10, opacity: 0, whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 3 L8 13 M5.5 5 L8 2.5 L10.5 5 M5.5 11 L8 13.5 L10.5 11" stroke="#9CA0A8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ color: "#A6A8AE", fontSize: 19, fontFamily: FONT }}>Expand (8 lines)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Cursor refObj={codeCursorRef} />
      </div>

      {/* ── BEAT 5: Outro word ticker ── */}
      <div ref={tickerRef} style={{ position: "absolute", inset: 0, display: "none", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <span style={{ color: "#FFFFFF", fontSize: 84, fontWeight: 500, fontFamily: FONT, letterSpacing: "-2px" }}>Agents for&nbsp;</span>
          {/* Slot window — overflow:hidden clips both spans */}
          <div style={{ position: "relative", height: 100, minWidth: 400, overflow: "hidden" }}>
            <span ref={wordOutRef} style={{ position: "absolute", left: 0, top: 0, color: "#FFFFFF", fontSize: 84, fontWeight: 500, fontFamily: FONT, letterSpacing: "-2px", lineHeight: "100px", willChange: "transform, opacity", whiteSpace: "nowrap" }}>Coding</span>
            <span ref={wordInRef} style={{ position: "absolute", left: 0, top: 0, color: "#FFFFFF", fontSize: 84, fontWeight: 500, fontFamily: FONT, letterSpacing: "-2px", lineHeight: "100px", willChange: "transform, opacity", whiteSpace: "nowrap", opacity: 0 }}>Triage</span>
          </div>
        </div>
      </div>

      {/* "Linear for Agents" outro title */}
      <div ref={titleOutroRef} style={{ position: "absolute", inset: 0, display: "none", alignItems: "center", justifyContent: "center", zIndex: 10, opacity: 0 }}>
        <span style={{ color: "#FFFFFF", fontSize: 84, fontWeight: 500, fontFamily: FONT, letterSpacing: "-2px" }}>
          <span ref={titleLinearForRef}>Linear for&nbsp;</span>
          <span ref={titleAgentsRef} style={{ opacity: 0 }}>Agents</span>
        </span>
      </div>

      {/* ── BEAT 6: Linear logo ── */}
      <div ref={logoRef} style={{ position: "absolute", inset: 0, display: "none", alignItems: "center", justifyContent: "center", zIndex: 10, opacity: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Linear icon: light disc with 3 short diagonal stripes carved into the lower-left
              (bottom-left → top-right), matching r14 / kf_0064. */}
          <svg width="76" height="76" viewBox="0 0 76 76" fill="none">
            <defs>
              <clipPath id="linear-disc"><circle cx="38" cy="38" r="30" /></clipPath>
            </defs>
            <circle cx="38" cy="38" r="30" fill="#E4E4E6" />
            {/* Rotate the cut group -45° about the disc centre so the bars run bottom-left→top-right.
                In rotated space the bars are horizontal; placing them BELOW centre (y>38) pushes the
                stripes into the lower-left of the disc (r14 / kf_0064). */}
            <g clipPath="url(#linear-disc)" transform="rotate(-45 38 38)">
              <rect x="8" y="46" width="60" height="5" fill="#111115" />
              <rect x="8" y="55" width="60" height="5" fill="#111115" />
              <rect x="8" y="64" width="60" height="5" fill="#111115" />
            </g>
          </svg>
          <span style={{ color: "#E4E4E6", fontSize: 64, fontWeight: 500, fontFamily: FONT, letterSpacing: "-1.5px" }}>Linear</span>
        </div>
      </div>
    </Timegroup>
  );
};

export default Video;
