/**
 * Scene 6 — Two-panel Environment Setup + Paper-stack choreography
 * Duration: 5000ms
 *
 * ROUND-7 FIXES:
 *   FIX 3 — Two-panel beat: ONE unified window, NO gap, BIGGER (fills frame)
 *   FIX 4 — Folded beat: BIGGER UI, correct terminal positions, green-gradient panel
 *            has UI inside + slides LEFT to middle-left position
 *
 * BACKGROUND: FLAT WHITE (#F7F6F4)
 *
 * CHOREOGRAPHY:
 *   0–600ms:   Unified window fades in — TWO PANELS joined as ONE (no gap)
 *   1000–2800ms: PAPER-STACK: LEFT panel slides RIGHT, RIGHT panel slides LEFT and overlaps
 *   2800–3200ms: TWO floating cards pop up (tests upper-right + aws bottom-right)
 *                + green-gradient thumbnail pops in (center-left)
 *   3200–4200ms: Hold on full composition
 *                green-gradient panel slides LEFT to middle-left position
 *   4200–5000ms: Everything slides RIGHT off frame (exit to Scene7)
 */
import React from "react";
import { Timegroup } from "@editframe/react";
import { TraceLayer } from "../components/TraceLayer";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";

const DURATION = 5000;
// Scene5 is now 2500ms (was 7000ms), so Scene5 ends at 9000+2500=11500ms
const START_MASTER = 11500;

// UNIFIED WINDOW — both panels joined as ONE continuous window
// Reference shows window spanning ~1250px wide, FULL height with shared tab bar
const WIN_W = 1280;
const WIN_H = 800;
// WIN_LEFT = (1920-WIN_W)/2 = 320, WIN_TOP = (1080-WIN_H)/2 = 140 — baked directly
// into the `scene6-unified-window` / `scene6-left-card` / `scene6-right-card`
// @keyframes (styles.css).

// Left panel width within the unified window
const LEFT_PANEL_W = 520;
// Right panel fills the rest
const RIGHT_PANEL_W = WIN_W - LEFT_PANEL_W; // 760

// Light code block — pnpm commands with syntax colors
function CodeBlock() {
  return (
    <div
      style={{
        background: "#F4F4F5",
        borderRadius: 8,
        padding: "12px 16px",
        marginBottom: 16,
        fontFamily: "'Courier New', 'Consolas', monospace",
        fontSize: 12,
        lineHeight: 1.8,
        border: "1px solid #E4E4E7",
      }}
    >
      <div>
        <span style={{ color: "#7C3AED" }}>pnpm</span>{" "}
        <span style={{ color: "#0F766E" }}>install</span>
      </div>
      <div>
        <span style={{ color: "#7C3AED" }}>pnpm</span>{" "}
        <span style={{ color: "#2563EB" }}>--filter</span>{" "}
        <span style={{ color: "#374151" }}>web</span>{" "}
        <span style={{ color: "#0F766E" }}>build</span>
      </div>
      <div>
        <span style={{ color: "#7C3AED" }}>pnpm</span>{" "}
        <span style={{ color: "#2563EB" }}>--filter</span>{" "}
        <span style={{ color: "#374151" }}>api</span>{" "}
        <span style={{ color: "#0F766E" }}>prisma generate</span>
      </div>
      <div>
        <span style={{ color: "#7C3AED" }}>pnpm</span>{" "}
        <span style={{ color: "#2563EB" }}>--filter</span>{" "}
        <span style={{ color: "#374151" }}>api</span>{" "}
        <span style={{ color: "#0F766E" }}>db:seed:test</span>
      </div>
    </div>
  );
}

// GREEN-GRADIENT THUMBNAIL — has a small UI mockup inside (NOT empty gradient)
// Reference @15s: small window with orange/red pill + rows + cursor arrow, on green gradient
function GreenGradientPanel() {
  return (
    <div
      style={{
        width: 440,
        height: 250,
        background: "linear-gradient(145deg, #3A7D6E 0%, #5BAA7E 45%, #8ABF8A 100%)",
        borderRadius: 14,
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 12px 40px rgba(0,0,0,0.18), 0 3px 12px rgba(0,0,0,0.10)",
      }}
    >
      {/* Window chrome — macOS-style traffic lights */}
      <div style={{ height: 26, background: "rgba(255,255,255,0.20)", borderBottom: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", padding: "0 10px", gap: 5 }}>
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#FF5F57" }} />
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#FFBD2E" }} />
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#27C840" }} />
        <div style={{ marginLeft: 8, fontSize: 10, color: "rgba(255,255,255,0.7)", fontFamily: "system-ui, sans-serif" }}>console.aws.amazon.com</div>
      </div>

      {/* UI mockup inside — AWS-console-style card with pills and rows */}
      <div style={{ padding: "12px 14px" }}>
        {/* Status row with red/orange pill button */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: 6, padding: "3px 10px", fontSize: 10, color: "white", fontFamily: "system-ui, sans-serif", fontWeight: 600 }}>
            EKS Cluster
          </div>
          <div style={{ background: "#E8533A", borderRadius: 10, padding: "2px 9px", fontSize: 10, color: "white", fontFamily: "system-ui, sans-serif", fontWeight: 600 }}>
            Active
          </div>
          <div style={{ background: "#22C55E", borderRadius: 10, padding: "2px 9px", fontSize: 10, color: "white", fontFamily: "system-ui, sans-serif", fontWeight: 600 }}>
            Healthy
          </div>
        </div>
        {/* Content rows */}
        {[
          { w: "70%", bg: "rgba(255,255,255,0.35)" },
          { w: "55%", bg: "rgba(255,255,255,0.25)" },
          { w: "80%", bg: "rgba(255,255,255,0.30)" },
          { w: "45%", bg: "rgba(255,255,255,0.20)" },
          { w: "65%", bg: "rgba(255,255,255,0.25)" },
        ].map((row, i) => (
          <div key={i} style={{ height: 8, width: row.w, background: row.bg, borderRadius: 3, marginBottom: 9 }} />
        ))}
      </div>

      {/* Cursor arrow — positioned bottom-left area */}
      <div style={{ position: "absolute", left: 52, bottom: 24 }}>
        <svg width="18" height="22" viewBox="0 0 16 20" fill="none">
          <path d="M1 1l12 8-5.5 1-2.5 6L1 1z" fill="#222" stroke="white" strokeWidth="1.2"/>
        </svg>
      </div>
    </div>
  );
}

// Floating card — Run backend tests (upper-right)
function TestsCard() {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 14,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.07)",
        border: "1px solid #EBEBEB",
        padding: "16px 20px",
        width: 540,
        fontFamily: "system-ui, -apple-system, 'Inter', sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="14" height="14" rx="3" stroke="#999" strokeWidth="1.3"/>
          <path d="M4 8h8M4 5h5M4 11h7" stroke="#999" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#222" }}>Run backend tests</span>
        <span style={{ fontSize: 12, color: "#AAA", marginLeft: 2 }}>pnpm</span>
      </div>
      {/* Command */}
      <div
        style={{
          background: "#F4F4F5",
          borderRadius: 7,
          padding: "8px 12px",
          fontFamily: "'Courier New', monospace",
          fontSize: 11.5,
          color: "#374151",
          marginBottom: 10,
        }}
      >
        $ pnpm --filter backend-server db:seed:test
      </div>
      {/* Output lines */}
      <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11.5, lineHeight: 1.7, color: "#444" }}>
        <div><span style={{ color: "#16A34A" }}>PASS</span>  src/routes/billing.test.ts</div>
        <div><span style={{ color: "#16A34A" }}>PASS</span>  src/routes/usage.test.ts</div>
        <div style={{ color: "#555", marginTop: 4, fontWeight: 600 }}>Tests: 42 passed, 42 total</div>
      </div>
    </div>
  );
}

// Floating card — Opened console.aws.amazon.com (bottom-right)
function AwsCard() {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 14,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.07)",
        border: "1px solid #EBEBEB",
        padding: "16px 20px",
        width: 560,
        fontFamily: "system-ui, -apple-system, 'Inter', sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6.5" stroke="#999" strokeWidth="1.3"/>
          <path d="M8 4v4l3 2" stroke="#999" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#222" }}>Opened</span>
        <span style={{ fontSize: 11.5, color: "#888" }}>console.aws.amazon.com/eks/home</span>
      </div>
      {/* Checklist items */}
      {[
        "Open the AWS Console and check the EKS dashboard",
        "Take a screenshot of the service health page",
        "Inspect CloudWatch graphs visually",
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: i < 2 ? 8 : 0 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <path d="M3 8l4 4 6-7" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize: 12.5, color: "#333", lineHeight: 1.4 }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

// CHOREOGRAPHY (all baked into `scene6-*` @keyframes, styles.css, as percentages
// of this scene's 5000ms duration — see each rule for the derivation):
//   Phase 1 (0-600ms):    unified window fades in (ease-out-cubic), holds to 1000ms
//   Phase 2 (1000ms):     unified window instantly hidden — paper-stack cards take over
//   Phase 2 (1000-2800ms): left/right cards slide from the unified position to the
//                          stacked position (ease-in-out-cubic, matches STACK_DUR=1800ms)
//   Green panel (900-1300ms): fades + scales in (0.9->1, ease-out-cubic) at its held position
//   Floating cards (2800-3150ms / 3000-3350ms): tests/aws cards fade + slide up
//   Exit (4200-5000ms):   everything (except the green panel) slides right off-frame,
//                          the green panel slides LEFT off-frame — both ease-in-cubic
// STACKED_CENTER_X = (1920-RIGHT_PANEL_W)/2 = 580, STACKED_LEFT_X = 580+60 = 640.
export function FoldedPanels() {

  // UNIFIED WINDOW — ONE continuous window for the initial two-panel beat (no gap)
  function UnifiedWindowInner() {
    return (
      <div
        style={{
          width: WIN_W,
          height: WIN_H,
          background: "#FFFFFF",
          borderRadius: 14,
          boxShadow: "0 12px 48px rgba(0,0,0,0.13), 0 3px 12px rgba(0,0,0,0.07)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, 'Inter', sans-serif",
        }}
      >
        {/* SHARED TOP BAR — spans full width, two sections joined, no divider needed */}
        <div style={{ height: 48, background: "#FAFAFA", borderBottom: "1px solid #EBEBEB", display: "flex", alignItems: "center", flexShrink: 0 }}>
          {/* Left section */}
          <div style={{ width: LEFT_PANEL_W, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", borderRight: "1px solid #EBEBEB", flexShrink: 0, height: "100%" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="0.5" y="0.5" width="13" height="13" rx="2.5" stroke="#BBBBBB" strokeWidth="1"/>
              <line x1="4" y1="0.5" x2="4" y2="13.5" stroke="#BBBBBB" strokeWidth="1"/>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#222" }}>Environment Set Up</span>
            <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#F0F0F0", border: "1px solid #E0E0E0", borderRadius: 6, padding: "3px 10px", fontSize: 11, color: "#555", marginLeft: 4 }}>
              <svg width="12" height="9" viewBox="0 0 18 14" fill="none">
                <path d="M4 12a3.5 3.5 0 010-7c.15 0 .3.01.45.03A5 5 0 0114.5 8H15a2.5 2.5 0 010 5H4z" stroke="#888" strokeWidth="1.2" fill="none"/>
              </svg>
              anysphere/frontend-backend
            </div>
          </div>
          {/* Right section — tab strip */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 14px", gap: 2, height: "100%" }}>
            {["Environment", "Git", "Terminal", "Desktop", "Files"].map((tab) => (
              <div key={tab} style={{ padding: "8px 12px", fontSize: 12, fontWeight: tab === "Environment" ? 600 : 400, color: tab === "Environment" ? "#0A0A0A" : "#999", borderBottom: tab === "Environment" ? "2px solid #0A0A0A" : "2px solid transparent", whiteSpace: "nowrap" }}>
                {tab}
              </div>
            ))}
            <div style={{ marginLeft: "auto" }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <rect x="0.5" y="0.5" width="13" height="13" rx="2.5" stroke="#BBBBBB" strokeWidth="1"/>
                <line x1="10" y1="0.5" x2="10" y2="13.5" stroke="#BBBBBB" strokeWidth="1"/>
              </svg>
            </div>
          </div>
        </div>
        {/* BODY — left + right panels side by side with NO GAP */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Left panel */}
          <div style={{ width: LEFT_PANEL_W, borderRight: "1px solid #EBEBEB", display: "flex", flexDirection: "column", overflow: "hidden", padding: "20px 22px", flexShrink: 0 }}>
            <div style={{ background: "#F7F7F7", border: "1px solid #EBEBEB", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#222", lineHeight: 1.5, marginBottom: 14 }}>
              Set up environment for anysphere/cloud-eng-setup-smoke-repo
            </div>
            <div style={{ color: "#AAA", fontSize: 11, marginBottom: 8 }}>Setting up repository</div>
            <div style={{ fontSize: 13, color: "#333", lineHeight: 1.55, marginBottom: 6 }}>Build succeeds. Now let me run the dev server and TypeScript checks.</div>
            <div style={{ color: "#AAA", fontSize: 11, marginBottom: 18 }}>Check Node.js and pnpm versions</div>
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <div style={{ border: "1px solid #D5D5D5", borderRadius: 8, padding: "8px 20px", fontSize: 12, color: "#444" }}>Preview Desktop</div>
              <div style={{ border: "1px solid #D5D5D5", borderRadius: 8, padding: "8px 20px", fontSize: 12, color: "#444" }}>Save Environment</div>
            </div>
            <div style={{ color: "#BDBDBD", fontSize: 11, marginTop: "auto", paddingTop: 8 }}>Add followups</div>
          </div>
          {/* Right panel */}
          <div style={{ flex: 1, overflow: "hidden", padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.01em" }}>davidw-personal-2</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#16A34A" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#16A34A" }} />
                  Ready to save
                </div>
                <div style={{ background: "#0A0A0A", color: "#fff", borderRadius: 7, padding: "5px 14px", fontSize: 12, fontWeight: 600 }}>Save As...</div>
                <div style={{ color: "#AAA", fontSize: 15 }}>···</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#888", fontSize: 12, marginBottom: 16 }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <rect x="0.5" y="2" width="11" height="8.5" rx="1.5" stroke="#AAA" strokeWidth="1"/>
                <path d="M2 2V1.5a1.5 1.5 0 013 0V2" stroke="#AAA" strokeWidth="1"/>
                <path d="M7 2V1.5a1.5 1.5 0 013 0V2" stroke="#AAA" strokeWidth="1"/>
              </svg>
              Team
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 8 }}>Update Script</div>
            <CodeBlock />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#444" }}>Secrets</span>
                <span style={{ fontSize: 11, color: "#AAA", textDecoration: "underline" }}>Manage in Settings</span>
              </div>
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                <div style={{ border: "1px solid #DEDEDE", borderRadius: 5, padding: "3px 9px", fontSize: 11, color: "#888" }}>This repo</div>
                <div style={{ background: "#F0F0F0", border: "1px solid #DEDEDE", borderRadius: 5, padding: "3px 9px", fontSize: 11, color: "#333", fontWeight: 600 }}>All repos</div>
                <div style={{ background: "#0A0A0A", color: "#fff", borderRadius: 5, padding: "3px 9px", fontSize: 11, fontWeight: 600 }}>Add</div>
              </div>
            </div>
            <div style={{ border: "1px solid #EFEFEF", borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
              <div style={{ display: "flex", background: "#F7F7F7", padding: "6px 12px", fontSize: 11, fontWeight: 600, color: "#888", borderBottom: "1px solid #EFEFEF" }}>
                <div style={{ flex: 2.5 }}>Value</div>
                <div style={{ flex: 1.5 }}>Scope</div>
                <div style={{ flex: 2.5 }}>Type</div>
              </div>
              {[
                { name: "AWS_ACCESS_KEY_ID", scope: "Team", type: "Environment Variable" },
                { name: "DATABASE_URL", scope: "Personal", type: "Build Secret" },
                { name: "REDIS_URL", scope: "Personal", type: "Build Secret" },
                { name: "DATADOG_API_KEY", scope: "Personal", type: "Build Secret" },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", padding: "7px 12px", fontSize: 11, background: i % 2 === 0 ? "#FFF" : "#FAFAFA", borderBottom: i < 3 ? "1px solid #F4F4F4" : "none" }}>
                  <div style={{ flex: 2.5, fontFamily: "'Courier New', monospace", color: "#222", fontSize: 10.5 }}>{row.name}</div>
                  <div style={{ flex: 1.5, color: "#666" }}>{row.scope}</div>
                  <div style={{ flex: 2.5, color: "#888" }}>{row.type}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 12, color: "#555" }}>Network Access Settings</div>
              <div style={{ display: "flex", gap: 7 }}>
                <div style={{ border: "1px solid #DEDEDE", borderRadius: 6, padding: "5px 12px", fontSize: 11, color: "#444", display: "flex", alignItems: "center", gap: 4 }}>
                  Use my Allowlist
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <path d="M2 3.5l3 3 3-3" stroke="#888" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{ border: "1px solid #DEDEDE", borderRadius: 6, padding: "5px 12px", fontSize: 11, color: "#444" }}>Edit Allowlist</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LEFT CARD extracted (left panel only, for paper-stack animation)
  function LeftCardExtract() {
    return (
      <div
        style={{
          width: LEFT_PANEL_W,
          height: WIN_H,
          background: "#FFFFFF",
          borderRadius: 14,
          boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, 'Inter', sans-serif",
        }}
      >
        {/* Top bar — left section */}
        <div style={{ height: 48, background: "#FAFAFA", borderBottom: "1px solid #EBEBEB", display: "flex", alignItems: "center", gap: 10, padding: "0 18px", flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="0.5" y="0.5" width="13" height="13" rx="2.5" stroke="#BBBBBB" strokeWidth="1"/>
            <line x1="4" y1="0.5" x2="4" y2="13.5" stroke="#BBBBBB" strokeWidth="1"/>
          </svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#222" }}>Environment Set Up</span>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#F0F0F0", border: "1px solid #E0E0E0", borderRadius: 6, padding: "3px 10px", fontSize: 11, color: "#555", marginLeft: 4 }}>
            <svg width="12" height="9" viewBox="0 0 18 14" fill="none">
              <path d="M4 12a3.5 3.5 0 010-7c.15 0 .3.01.45.03A5 5 0 0114.5 8H15a2.5 2.5 0 010 5H4z" stroke="#888" strokeWidth="1.2" fill="none"/>
            </svg>
            anysphere/frontend-backend
          </div>
        </div>
        {/* Content */}
        <div style={{ padding: "20px 22px", flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#F7F7F7", border: "1px solid #EBEBEB", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#222", lineHeight: 1.5, marginBottom: 14 }}>
            Set up environment for anysphere/cloud-eng-setup-smoke-repo
          </div>
          <div style={{ color: "#AAA", fontSize: 11, marginBottom: 8 }}>Setting up repository</div>
          <div style={{ fontSize: 13, color: "#333", lineHeight: 1.55, marginBottom: 6 }}>Build succeeds. Now let me run the dev server and TypeScript checks.</div>
          <div style={{ color: "#AAA", fontSize: 11, marginBottom: 18 }}>Check Node.js and pnpm versions</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <div style={{ border: "1px solid #D5D5D5", borderRadius: 8, padding: "8px 20px", fontSize: 12, color: "#444" }}>Preview Desktop</div>
            <div style={{ border: "1px solid #D5D5D5", borderRadius: 8, padding: "8px 20px", fontSize: 12, color: "#444" }}>Save Environment</div>
          </div>
          <div style={{ color: "#BDBDBD", fontSize: 11, marginTop: "auto", paddingTop: 8 }}>Add followups</div>
        </div>
      </div>
    );
  }

  // RIGHT CARD extracted (right panel only, for paper-stack animation)
  function RightCardExtract() {
    return (
      <div
        style={{
          width: RIGHT_PANEL_W,
          height: WIN_H,
          background: "#FFFFFF",
          borderRadius: 14,
          boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, 'Inter', sans-serif",
        }}
      >
        {/* Tab strip */}
        <div style={{ height: 48, background: "#FAFAFA", borderBottom: "1px solid #EBEBEB", display: "flex", alignItems: "center", padding: "0 14px", gap: 2, flexShrink: 0 }}>
          {["Environment", "Git", "Terminal", "Desktop", "Files"].map((tab) => (
            <div key={tab} style={{ padding: "8px 12px", fontSize: 12, fontWeight: tab === "Environment" ? 600 : 400, color: tab === "Environment" ? "#0A0A0A" : "#999", borderBottom: tab === "Environment" ? "2px solid #0A0A0A" : "2px solid transparent", whiteSpace: "nowrap" }}>
              {tab}
            </div>
          ))}
          <div style={{ marginLeft: "auto" }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <rect x="0.5" y="0.5" width="13" height="13" rx="2.5" stroke="#BBBBBB" strokeWidth="1"/>
              <line x1="10" y1="0.5" x2="10" y2="13.5" stroke="#BBBBBB" strokeWidth="1"/>
            </svg>
          </div>
        </div>
        {/* Content */}
        <div style={{ flex: 1, overflow: "hidden", padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.01em" }}>davidw-personal-2</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#16A34A" }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#16A34A" }} />
                Ready to save
              </div>
              <div style={{ background: "#0A0A0A", color: "#fff", borderRadius: 7, padding: "5px 14px", fontSize: 12, fontWeight: 600 }}>Save As...</div>
              <div style={{ color: "#AAA", fontSize: 15 }}>···</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#888", fontSize: 12, marginBottom: 16 }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <rect x="0.5" y="2" width="11" height="8.5" rx="1.5" stroke="#AAA" strokeWidth="1"/>
              <path d="M2 2V1.5a1.5 1.5 0 013 0V2" stroke="#AAA" strokeWidth="1"/>
              <path d="M7 2V1.5a1.5 1.5 0 013 0V2" stroke="#AAA" strokeWidth="1"/>
            </svg>
            Team
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 8 }}>Update Script</div>
          <CodeBlock />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#444" }}>Secrets</span>
              <span style={{ fontSize: 11, color: "#AAA", textDecoration: "underline" }}>Manage in Settings</span>
            </div>
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <div style={{ border: "1px solid #DEDEDE", borderRadius: 5, padding: "3px 9px", fontSize: 11, color: "#888" }}>This repo</div>
              <div style={{ background: "#F0F0F0", border: "1px solid #DEDEDE", borderRadius: 5, padding: "3px 9px", fontSize: 11, color: "#333", fontWeight: 600 }}>All repos</div>
              <div style={{ background: "#0A0A0A", color: "#fff", borderRadius: 5, padding: "3px 9px", fontSize: 11, fontWeight: 600 }}>Add</div>
            </div>
          </div>
          <div style={{ border: "1px solid #EFEFEF", borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
            <div style={{ display: "flex", background: "#F7F7F7", padding: "6px 12px", fontSize: 11, fontWeight: 600, color: "#888", borderBottom: "1px solid #EFEFEF" }}>
              <div style={{ flex: 2.5 }}>Value</div>
              <div style={{ flex: 1.5 }}>Scope</div>
              <div style={{ flex: 2.5 }}>Type</div>
            </div>
            {[
              { name: "AWS_ACCESS_KEY_ID", scope: "Team", type: "Environment Variable" },
              { name: "DATABASE_URL", scope: "Personal", type: "Build Secret" },
              { name: "REDIS_URL", scope: "Personal", type: "Build Secret" },
              { name: "DATADOG_API_KEY", scope: "Personal", type: "Build Secret" },
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", padding: "7px 12px", fontSize: 11, background: i % 2 === 0 ? "#FFF" : "#FAFAFA", borderBottom: i < 3 ? "1px solid #F4F4F4" : "none" }}>
                <div style={{ flex: 2.5, fontFamily: "'Courier New', monospace", color: "#222", fontSize: 10.5 }}>{row.name}</div>
                <div style={{ flex: 1.5, color: "#666" }}>{row.scope}</div>
                <div style={{ flex: 2.5, color: "#888" }}>{row.type}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 12, color: "#555" }}>Network Access Settings</div>
            <div style={{ display: "flex", gap: 7 }}>
              <div style={{ border: "1px solid #DEDEDE", borderRadius: 6, padding: "5px 12px", fontSize: 11, color: "#444", display: "flex", alignItems: "center", gap: 4 }}>
                Use my Allowlist
                <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                  <path d="M2 3.5l3 3 3-3" stroke="#888" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ border: "1px solid #DEDEDE", borderRadius: 6, padding: "5px 12px", fontSize: 11, color: "#444" }}>Edit Allowlist</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Timegroup
      mode="fixed"
      duration="5s"
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0, width: 1920, height: 1080 }}
    >
      {/* FLAT WHITE background */}
      {!TRACE_MODE && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#F7F6F4",
            zIndex: 1,
          }}
        />
      )}

      {/* "cursor.com/agents" URL bar at top center */}
      <div
        style={{
          position: "absolute",
          top: 32,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 12,
          color: "#AAA",
          fontFamily: "system-ui, sans-serif",
          letterSpacing: "0.01em",
          zIndex: 20,
        }}
      >
        cursor.com/agents
      </div>

      {/* UNIFIED WINDOW — ONE continuous window, shown 0–1000ms only. Position is
          static (320,140) — only opacity is animated (fade in, then instant hide). */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 7,
          transform: "translateX(320px) translateY(140px)",
          animation: "scene6-unified-window 5000ms linear both",
        }}
      >
        <UnifiedWindowInner />
      </div>

      {/* LEFT card — extracted left panel, animated independently during stack */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 5,
          transformOrigin: "top left",
          animation: "scene6-left-card 5000ms linear both",
        }}
      >
        <LeftCardExtract />
      </div>

      {/* RIGHT card — extracted right panel, animated independently during stack */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 10,
          transformOrigin: "top left",
          animation: "scene6-right-card 5000ms linear both",
        }}
      >
        <RightCardExtract />
      </div>

      {/* Green gradient panel with UI inside — center-left, slides left */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 15,
          transformOrigin: "top left",
          animation: "scene6-green-panel 5000ms linear both",
        }}
      >
        <GreenGradientPanel />
      </div>

      {/* Floating card — Run backend tests. Reference: upper-RIGHT, OVERLAPPING
          the main window's right edge (left edge ≈ 1180, at code-block height). */}
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 1180,
          zIndex: 20,
          animation: "scene6-tests-card 5000ms linear both",
        }}
      >
        <TestsCard />
      </div>

      {/* Floating card — AWS opened. Reference: lower-RIGHT, OVERLAPPING the
          main window's right edge (left edge ≈ 1095, below the tests card). */}
      <div
        style={{
          position: "absolute",
          top: 648,
          left: 1095,
          zIndex: 20,
          animation: "scene6-aws-card 5000ms linear both",
        }}
      >
        <AwsCard />
      </div>

      <TraceLayer sceneStartMs={START_MASTER} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />
    </Timegroup>
  );
}

FoldedPanels.duration = DURATION;
