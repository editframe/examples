import React from "react";
import { Timegroup } from "@editframe/react";
import { Reveal } from "@shared/components/Reveal";
import { TeamIcon, CodegenSquare, StatusInProgress, StatusInReview, Avatar, GitHubMark, BreadcrumbTail } from "../components/icons";
import { SCENES, FONT, MONO } from "../constants";

/**
 * ENG-1293 · Codegen — activity feed, Codegen ships a fix + PR, issue moves to In Review.
 * 5266ms local.
 *
 * The scroll-up (auto-scrolling the conversation as the PR content appears) and the
 * zoom-in settle (echoing the old motion-blur transition) are two DIFFERENT transforms
 * that overlap in time but don't overlap as CSS properties once split onto two nested
 * elements: the outer wrapper carries the vertical scroll + this scene's own fade
 * in/out (opacity + translateY), the inner wrapper carries the scale zoom + the
 * transform-origin switch that happens at the same moment the zoom begins.
 *
 * Note: the first three activity lines + Codegen's first message + its "View my work"
 * link were already fully faded in (per the original master-ms timing) by the time this
 * scene's own entry point was reached — so they render at rest (opacity 1, no
 * animation) here, matching the actual current behavior exactly rather than the
 * (unused) staggered-entrance the constants once implied.
 */
export const CodegenIssue: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.codegenIssue.duration}ms`} className="absolute inset-0">
    <div
      className="absolute inset-0"
      style={{
        display: "flex", flexDirection: "column", fontFamily: FONT,
        animation: [
          "issue1-fade-in 280ms 0ms cubic-bezier(0.33,1,0.68,1) both",
          "issue1-fade-out 233ms 5033ms cubic-bezier(0.32,0,0.67,0) both",
          "issue1-scroll 1800ms 2233ms cubic-bezier(0.45,0,0.55,1) both",
        ].join(", "),
      }}
    >
      {/* inner wrapper: zoom-in settle + the transform-origin switch that lands with it */}
      <div
        style={{
          display: "flex", flexDirection: "column", flex: 1,
          transformOrigin: "726px 360px",
          animation: [
            "issue1-entry-scale 280ms 0ms cubic-bezier(0.33,1,0.68,1) both",
            "issue1-zoom-scale 2267ms 2766ms cubic-bezier(0.32,0,0.67,0) both",
            "issue1-origin-switch 1ms 2766ms forwards",
          ].join(", "),
        }}
      >
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 13, padding: "32px 56px 0" }}>
          <TeamIcon size={30} />
          <span style={{ color: "#C9CACE", fontSize: 26 }}>Engineering</span>
          <span style={{ color: "#5A5C63", fontSize: 24, margin: "0 2px" }}>›</span>
          <span style={{ color: "#EDEDEF", fontSize: 26, letterSpacing: "0.3px" }}>ENG-1293</span>
          <BreadcrumbTail />
        </div>

        {/* Activity feed */}
        <div style={{ flex: 1, padding: "54px 56px 0 215px", maxWidth: 1700 }}>
          {/* Activity lines 1-3 — already settled by scene entry, render at rest */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22, fontSize: 23, position: "relative" }}>
            <Avatar size={32} from="#4a3f2f" to="#7a6a4a" />
            <span style={{ color: "#8A8F98" }}>Adrien Griveau <span style={{ color: "#8A8F98" }}>created the issue</span> <span style={{ color: "#C9CACE" }}>Implement two-pass input handling</span> · 5min ago</span>
            <div style={{ position: "absolute", left: 16, top: 38, width: 1.5, height: 22, background: "#2a2a30" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22, fontSize: 23, position: "relative" }}>
            <Avatar size={32} from="#4a3f2f" to="#7a6a4a" />
            <span style={{ color: "#8A8F98" }}>Adrien Griveau assigned issue to <span style={{ color: "#C9CACE" }}>Codegen</span> · 1min ago</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 34, fontSize: 23 }}>
            <StatusInProgress size={26} />
            <span style={{ color: "#8A8F98" }}>Codegen moved from <span style={{ color: "#C9CACE" }}>ToDo</span> to <span style={{ color: "#C9CACE" }}>In Progress</span> · just now</span>
          </div>

          {/* Codegen comments 1 + 2 + reply — ONE continuous rounded card */}
          <div style={{ background: "#16161A", border: "1px solid #1f1f25", borderRadius: 14, marginBottom: 22, maxWidth: 1430, overflow: "hidden" }}>
            {/* Comment 1 — already settled by scene entry, render at rest */}
            <div style={{ padding: "26px 32px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <CodegenSquare size={28} />
                <span style={{ color: "#EDEDEF", fontSize: 24, fontWeight: 500 }}>Codegen</span>
                <span style={{ color: "#76787F", fontSize: 23 }}>just now</span>
              </div>
              <p style={{ color: "#E4E4E6", fontSize: 24, margin: 0, lineHeight: 1.5 }}>Hey! I'm on it.</p>
              <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12 }}>
                <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
                  <rect x="3" y="2.5" width="18" height="12" rx="1.6" fill="#33363d" stroke="#54575e" strokeWidth="1.1" />
                  <rect x="0.5" y="15" width="23" height="3" rx="1.3" fill="#54575e" />
                </svg>
                <span style={{ color: "#7E89E8", fontSize: 23, fontStyle: "italic" }}>View my work</span>
              </div>
            </div>

            {/* Comment 2 (divider above) — fades in just after scene entry */}
            <Reveal enter={[66, 146]} y={8} style={{ padding: "24px 32px 26px", borderTop: "1px solid #1f1f25" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <CodegenSquare size={28} />
                <span style={{ color: "#EDEDEF", fontSize: 24, fontWeight: 500 }}>Codegen</span>
                <span style={{ color: "#76787F", fontSize: 23 }}>just now</span>
              </div>
              <div>
                <div
                  style={{
                    clipPath: "inset(0 100% 0 0)", color: "#E4E4E6", fontSize: 24, lineHeight: 1.55, marginBottom: 0,
                    animation: "codegen-typing 1400ms 166ms cubic-bezier(0.45,0,0.55,1) both",
                  }}
                >
                  I've submitted a function that processes the input in two passes: first with{" "}
                  <code style={{ background: "#26262c", color: "#C9CACE", padding: "1px 7px", borderRadius: 5, fontFamily: MONO, fontSize: 21 }}>validate()</code>,{" "}
                  then with{" "}
                  <code style={{ background: "#26262c", color: "#C9CACE", padding: "1px 7px", borderRadius: 5, fontFamily: MONO, fontSize: 21 }}>buildPayload()</code>{" "}
                  before calling
                </div>
                <div
                  style={{
                    clipPath: "inset(0 100% 0 0)", opacity: 0, color: "#E4E4E6", fontSize: 24, lineHeight: 1.55,
                    animation: [
                      "instant-show 1ms 1566ms forwards",
                      "codegen-typing 900ms 1666ms cubic-bezier(0.45,0,0.55,1) both",
                    ].join(", "),
                  }}
                >
                  <code style={{ background: "#26262c", color: "#C9CACE", padding: "1px 7px", borderRadius: 5, fontFamily: MONO, fontSize: 21 }}>sentToAPI()</code>{" "}
                  to dispatch the result.
                </div>
              </div>
            </Reveal>

            {/* Leave a reply (divider above) — avatar + placeholder + paperclip & send */}
            <Reveal enter={[1800, 2060]} y={8} style={{ display: "flex", alignItems: "center", gap: 16, padding: "22px 32px", borderTop: "1px solid #1f1f25" }}>
              <Avatar size={30} from="#3a4a3a" to="#566b56" />
              <span style={{ color: "#6E7178", fontSize: 23, flex: 1 }}>Leave a reply...</span>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M15 7 L8.5 13.5 a2.6 2.6 0 0 0 3.7 3.7 L18.5 11 a4.4 4.4 0 0 0 -6.2 -6.2 L6 11.1" stroke="#76787F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#26262c", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 14 V4 M5 8 L9 4 L13 8" stroke="#9CA0A8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Reveal>
          </div>

          {/* PR activity line */}
          <Reveal enter={[2166, 2426]} y={8} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, fontSize: 23, position: "relative" }}>
            <GitHubMark size={24} />
            <span style={{ color: "#8A8F98" }}>Codegen added a pull request <span style={{ color: "#C9CACE" }}>Split input handling into 2 steps</span> · just now</span>
            <div style={{ position: "absolute", left: 11, top: 38, width: 1.5, height: 20, background: "#2a2a30" }} />
          </Reveal>
          {/* In review status line */}
          <Reveal enter={[2600, 2860]} y={8} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 26, fontSize: 23 }}>
            <StatusInReview size={26} />
            <span style={{ color: "#8A8F98" }}>Codegen moved from <span style={{ color: "#C9CACE" }}>In Progress</span> to <span style={{ color: "#C9CACE" }}>In Review</span> · just now</span>
          </Reveal>

          {/* PR card */}
          <Reveal enter={[2833, 3093]} y={8} style={{ display: "flex", alignItems: "center", gap: 18, background: "#161619", border: "1px solid #1f1f25", borderRadius: 12, padding: "24px 30px", maxWidth: 1430 }}>
            <GitHubMark size={24} />
            <span style={{ color: "#E4E4E6", fontSize: 23, flex: 1 }}>Split input handling into 2 steps</span>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
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
          </Reveal>
        </div>
      </div>
    </div>
  </Timegroup>
);
