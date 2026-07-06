import React from "react";
import { Timegroup } from "@editframe/react";
import { Reveal } from "../components/Reveal";
import { Cursor, TeamIcon, Avatar, DevinIcon, DevinCluster, BreadcrumbTail } from "../components/icons";
import { SCENES, FONT, MONO } from "../constants";

/**
 * ENG-237 · Devin — Andreas types an `@devin` mention, Devin's response reveals
 * top-to-bottom with a code block. 6830ms local (this scene's own duration was extended
 * ~197ms past its original master-ms boundary so its own fade-out — which in the
 * original ran slightly past when the next scene, OutroTicker, started fading in during
 * a brief real crossfade — completes in full; see constants.ts's note on `overlap`).
 *
 * `andreasTyping`/`andreasFinal` are a genuine mutual-exclusion swap (typing state →
 * finalized comment) that the original did via `display:none`/`block`, which also
 * changes real layout height. To keep that layout behavior without animating `display`
 * (not reliably interpolable), both are absolutely stacked in a `position:relative`
 * wrapper with an explicit `minHeight` sized to one line of text. Likewise `devinMsg`
 * starts at `max-height:0` (clipped) and snaps open at its reveal moment instead of
 * using `display:none` — a `max-height` reveal is the standard, broadly-supported way to
 * animate a block from "not there" to "full height" without relying on animating
 * `display` itself.
 */
export const DevinIssue: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.devinIssue.duration}ms`} className="absolute inset-0">
    <Reveal enter={[0, 220]} exit={[6250, 6830]} y={0} className="absolute inset-0" style={{ display: "flex", flexDirection: "column", fontFamily: FONT }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 13, padding: "32px 56px 0" }}>
        <TeamIcon size={30} />
        <span style={{ color: "#C9CACE", fontSize: 26 }}>Engineering</span>
        <span style={{ color: "#5A5C63", fontSize: 24, margin: "0 2px" }}>›</span>
        <span style={{ color: "#EDEDEF", fontSize: 26, letterSpacing: "0.3px" }}>ENG-237</span>
        <BreadcrumbTail />
      </div>

      {/* Comment card (Andreas + Devin) */}
      <div style={{ padding: "40px 205px 0 205px" }}>
        <div style={{ background: "#141417", border: "1px solid #1f1f25", borderRadius: 16, padding: "0 40px" }}>
          {/* Andreas */}
          <div style={{ padding: "30px 0 30px", borderBottom: "1px solid #1f1f25", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
              <Avatar size={34} from="#3a4630" to="#5d6b4a" />
              <span style={{ color: "#EDEDEF", fontSize: 24, fontWeight: 600 }}>Andreas Eldh</span>
              <span style={{ color: "#76787F", fontSize: 22 }}>1min ago</span>
            </div>

            {/* typing state (with @-mention dropdown) → finalized comment: mutually exclusive,
                absolutely stacked so the swap doesn't rely on animating `display`. */}
            <div style={{ position: "relative", minHeight: 34 }}>
              <div
                style={{
                  position: "absolute", left: 0, right: 0, top: 0,
                  animation: ["andreas-typing-in 150ms 733ms cubic-bezier(0.33,1,0.68,1) both", "instant-hide 1ms 2067ms forwards"].join(", "),
                }}
              >
                <p style={{ color: "#E4E4E6", fontSize: 24, margin: 0 }}>@</p>
                <Reveal
                  enter={[1233, 1363]}
                  exit={[1833, 1953]}
                  y={0}
                  style={{
                    position: "absolute", top: 44, left: 0, background: "#1A1A1F", border: "1px solid #2a2a32",
                    borderRadius: 10, padding: "10px 0", minWidth: 420, zIndex: 30, boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
                  }}
                >
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
                </Reveal>
              </div>
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, opacity: 0, animation: "fade-in 160ms 2067ms cubic-bezier(0.33,1,0.68,1) both" }}>
                <p style={{ color: "#E4E4E6", fontSize: 24, margin: 0 }}>@devin can you take a look?</p>
              </div>
            </div>
          </div>

          {/* Devin response — clipped to max-height:0 until it reveals, then snaps open */}
          <div
            style={{
              overflow: "hidden", maxHeight: 0, opacity: 0, padding: "30px 0 36px",
              animation: ["devin-msg-open 1ms 2300ms forwards", "devin-msg-fade-in 200ms 2300ms cubic-bezier(0.33,1,0.68,1) both"].join(", "),
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <DevinCluster size={28} />
              <span style={{ color: "#EDEDEF", fontSize: 24, fontWeight: 600 }}>Devin</span>
              <span style={{ color: "#76787F", fontSize: 22, fontStyle: "italic" }}>just now</span>
            </div>

            <div style={{ clipPath: "inset(0 0 100% 0)", animation: "devin-reveal 2700ms 2467ms cubic-bezier(0.33,1,0.68,1) both" }}>
              <p style={{ color: "#E4E4E6", fontSize: 24, margin: "0 0 22px", lineHeight: 1.5 }}>
                Proposed Solution: disable the expand/collapse button in{" "}
                <code style={{ background: "#26262c", color: "#C9CACE", padding: "2px 9px", borderRadius: 5, fontFamily: MONO, fontSize: 22 }}>TeamPullRequestSettings.tsx</code>{" "}
                when all rows are already visible. Confidence: High{" "}
                <span style={{ display: "inline-block", width: 19, height: 19, borderRadius: "50%", background: "#2BC04A", verticalAlign: "middle", marginLeft: 4, boxShadow: "0 0 8px rgba(43,192,74,0.5)" }} />
              </p>
              <ul style={{ color: "#E4E4E6", fontSize: 24, lineHeight: 1.5, margin: "0 0 26px", paddingLeft: 30 }}>
                <li style={{ marginBottom: 14 }}>
                  <div style={{ clipPath: "inset(0 100% 0 0)", animation: "codegen-typing 700ms 2800ms cubic-bezier(0.45,0,0.55,1) both" }}>The file already has a variable that determines if any rows would be hidden when collapsed</div>
                </li>
                <li>
                  <div style={{ clipPath: "inset(0 100% 0 0)", animation: "codegen-typing 550ms 3500ms cubic-bezier(0.45,0,0.55,1) both" }}>You can modify the IconButton responsible by adding a disabled prop</div>
                </li>
              </ul>

              {/* Code block — dark, monospace, syntax-highlighted */}
              <div style={{ opacity: 0, background: "#1A1A1E", borderRadius: 10, padding: "26px 32px", fontFamily: MONO, fontSize: 22, lineHeight: 1.75, position: "relative", overflow: "hidden", animation: "fade-in 300ms 4400ms cubic-bezier(0.33,1,0.68,1) both" }}>
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
                <div style={{ position: "absolute", bottom: 14, left: "42%", background: "#2A2A30", borderRadius: 8, padding: "8px 16px", display: "flex", alignItems: "center", gap: 10, opacity: 0, whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(0,0,0,0.5)", animation: "fade-in 180ms 5667ms cubic-bezier(0.33,1,0.68,1) both" }}>
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

      <Cursor
        style={{
          animation: [
            "instant-show 1ms 5367ms forwards",
            "code-cursor-move 300ms 5367ms cubic-bezier(0.33,1,0.68,1) both",
          ].join(", "),
        }}
      />
    </Reveal>
  </Timegroup>
);
