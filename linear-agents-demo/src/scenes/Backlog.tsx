import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { clamp, lerp, track, easeOutCubic, easeInOutQuad } from "@shared/utils/animation";
import { Checkbox, PriorityBars, PriorityUrgent, StatusInProgress, StatusTodo, AssigneeRing, CodegenRowIcon, TeamIcon, Cursor, AGENT_ICON, MODAL_AGENTS } from "../components/icons";
import { SCENES, FONT } from "../constants";

const ISSUES = [
  { id: "LIN-6845", title: "Restore real-time syncing between thread and activity log", priority: "urgent", status: "progress" },
  { id: "LIN-8730", title: "Fix tooltip overlap on hover cards", priority: "high", status: "progress" },
  { id: "LIN-9038", title: "Align spacing on mobile nav drawer", priority: "high", status: "todo" },
  { id: "LIN-1293", title: "Implement two-pass input handling before API submission", priority: "low", status: "todo" },
  { id: "LIN-9038", title: "Audit and shore up reliability of main navigation flow", priority: "high", status: "todo" },
  { id: "LIN-7184", title: "Handle edge cases for bulk delete", priority: "low", status: "todo" },
];
// Faint un-selected rows below the fold
const ISSUES_BELOW = [
  { id: "LIN-8954", title: "Add keyboard support to modal navigation", priority: "high" },
  { id: "LIN-3574", title: "Standardize error message formatting", priority: "low" },
  { id: "LIN-3634", title: "Delay animation timing on transitions", priority: "high" },
];

// Selection ramp shared by every checkbox / codegen icon / assignee ring / row tint below —
// all six rows animate identically (never staggered by row index), so one CSS animation
// string covers all of them.
const SELECTION_ANIM = "checkbox-instant-on 1ms 456ms forwards, checkbox-color-ramp 250ms 1066ms cubic-bezier(0.33,1,0.68,1) both";
const CHECK_ICON_ANIM = "checkbox-icon-ramp-1 150ms 433ms cubic-bezier(0.33,1,0.68,1) both, checkbox-icon-ramp-2 198ms 1118ms cubic-bezier(0.33,1,0.68,1) both";
const CODEGEN_ICON_ANIM = "codegen-icon-in 220ms 2900ms cubic-bezier(0.33,1,0.68,1) both";
const ASSIGNEE_RING_ANIM = "assignee-ring-out 220ms 2900ms cubic-bezier(0.33,1,0.68,1) both";

/**
 * BACKLOG — engineering backlog list settles from a fast scroll, rows get selected and
 * assigned to Codegen via the "Assign to..." modal, then the whole scene zooms into
 * LIN-1293. 8200ms local.
 *
 * This scene keeps a small scoped `addFrameTask` for the motion-blur scroll-settle
 * effect (the live list + 3 trailing "ghost" copies + the scrollbar thumb, all sharing
 * one `sin()`-modulated motion curve) and the cursor's two-segment path (glide to the
 * modal's Codegen row, disappear, reappear gliding down to the LIN-1293 row). Both are
 * genuinely continuous/multi-branch procedural motion rather than one-shot reveals —
 * converting them to CSS would mean numerically sampling a `sin()` curve and a
 * multi-segment cursor path into approximated keyframes with no way to visually verify
 * the result, which the project's own frame-by-frame SSIM-tuned commentary suggests is
 * exactly where this composition is most fragile. Everything else in this scene
 * (selection tint, checkbox/codegen-icon/assignee-ring crossfade, the row highlight, the
 * modal, and its Codegen row's click flash) is one-shot/synchronized-across-rows and
 * converts cleanly to plain CSS below.
 */
export const Backlog: React.FC = () => {
  const ghostRefs = useRef<(HTMLDivElement | null)[]>([]);
  const issueListRef = useRef<HTMLDivElement>(null);
  const scrollbarThumbRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
    const ms = ownCurrentTimeMs;
    const MB_END = 1633; // scroll settles well after this scene's own entry
    const SWEEP = 380;

    if (issueListRef.current) {
      if (ms < MB_END) {
        const p = track(ms, 0, MB_END, easeOutCubic);
        issueListRef.current.style.opacity = String(lerp(0.55, 1, clamp(p * 1.8)));
        issueListRef.current.style.transform = `translateY(${lerp(-SWEEP, 0, p)}px)`;
      } else {
        issueListRef.current.style.opacity = "1";
        issueListRef.current.style.transform = "translateY(0px)";
      }
    }
    if (scrollbarThumbRef.current) {
      if (ms < MB_END) {
        const p = track(ms, 0, MB_END, easeInOutQuad);
        scrollbarThumbRef.current.style.top = `${lerp(45, 8, p).toFixed(1)}%`;
      } else {
        scrollbarThumbRef.current.style.top = "8%";
      }
    }
    // Motion-smear ghost copies — trailing duplicates below the live list (it's sweeping
    // upward). Together with the live list they paint ~4 overlapping copies across the
    // travel band, reading as one vertical smear; hidden entirely once settled.
    ghostRefs.current.forEach((g, gi) => {
      if (!g) return;
      if (ms >= MB_END) {
        g.style.opacity = "0";
        return;
      }
      const p = track(ms, 0, MB_END, easeOutCubic);
      const motion = Math.sin(clamp(p) * Math.PI); // 0 at ends, 1 mid-sweep
      const liveY = lerp(-SWEEP, 0, p);
      const offset = -(SWEEP * 0.32) * (gi + 1);
      g.style.transform = `translateY(${liveY + offset}px)`;
      g.style.opacity = String(clamp(motion * 0.42 * (1 - gi * 0.26)));
    });
    // Cursor: glides to the Codegen row in the modal and lands, disappears while the
    // modal closes, then reappears gliding down to hover the LIN-1293 row before the
    // scene zooms into it.
    if (cursorRef.current) {
      if (ms >= 1733 && ms < 2766) {
        const p = track(ms, 1733, 2083, easeOutCubic);
        cursorRef.current.style.opacity = "1";
        cursorRef.current.style.transform = `translate(${lerp(1400, 1610, p)}px, ${lerp(300, 508, p)}px)`;
      } else if (ms >= 3500 && ms < 7600) {
        const p = track(ms, 3500, 5366, easeOutCubic);
        cursorRef.current.style.opacity = "1";
        cursorRef.current.style.transform = `translate(${lerp(1000, 880, p)}px, ${lerp(440, 489, p)}px)`;
      } else {
        cursorRef.current.style.opacity = "0";
      }
    }
  }, []);

  // Issue-list inner markup, shared by the live list AND the motion-smear ghosts.
  // `live` wires the selection/checkbox/codegen-icon CSS animations; ghosts are static
  // visual copies (no animation) so we can stack several translateY-offset translucent layers.
  const buildListInner = (live: boolean) => (
    <>
      <div
        style={{
          borderRadius: 8,
          background: live ? "rgba(94,106,210,0)" : "rgba(42,48,86,0)",
          animation: live ? "selection-tint-1 150ms 433ms cubic-bezier(0.33,1,0.68,1) both, selection-tint-2 250ms 1066ms cubic-bezier(0.33,1,0.68,1) both" : undefined,
        }}
      >
        {ISSUES.map((issue, i) => (
          <div
            key={i}
            style={{
              display: "flex", alignItems: "center", gap: 20, padding: "0 26px", height: 115,
              background: live && i === 3 ? "transparent" : undefined,
              animation: live && i === 3 ? "lin1293-highlight-in 220ms 5366ms cubic-bezier(0.33,1,0.68,1) both, lin1293-highlight-out 1ms 7600ms forwards" : undefined,
            }}
          >
            {live
              ? <Checkbox style={{ animation: SELECTION_ANIM }} iconStyle={{ animation: CHECK_ICON_ANIM }} />
              : <div style={{ width: 18, height: 18, borderRadius: 5, border: "2px solid #62646B", flexShrink: 0 }} />}
            {issue.priority === "urgent"
              ? <PriorityUrgent />
              : <PriorityBars level={issue.priority === "high" ? 3 : 1} />}
            <span style={{ color: "#8A8F98", fontSize: 23, fontFamily: FONT, minWidth: 116, flexShrink: 0, letterSpacing: "0.2px" }}>{issue.id}</span>
            {issue.status === "progress" ? <StatusInProgress size={20} /> : <StatusTodo size={20} />}
            <span style={{ color: "#E4E4E6", fontSize: 24, fontFamily: FONT, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{issue.title}</span>
            <div style={{ position: "relative", width: 28, height: 28, flexShrink: 0 }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: live ? 0.55 : 1, animation: live ? ASSIGNEE_RING_ANIM : undefined }}>
                <AssigneeRing size={26} />
              </div>
              {live && (
                <div style={{ position: "absolute", inset: 0, opacity: 0, display: "flex", alignItems: "center", justifyContent: "center", animation: CODEGEN_ICON_ANIM }}>
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
    <Timegroup mode="fixed" duration={`${SCENES.backlog.duration}ms`} onFrame={handleFrame as any} className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          overflow: "hidden",
          transformOrigin: "726px 400px",
          animation: [
            "backlog-fade-in 200ms 0ms cubic-bezier(0.33,1,0.68,1) both",
            "backlog-zoom-out 600ms 7600ms cubic-bezier(0.32,0,0.67,0) both",
          ].join(", "),
        }}
      >
        {/* Header */}
        <div style={{ position: "absolute", top: 30, left: 288, display: "flex", alignItems: "center", gap: 16 }}>
          <TeamIcon size={36} />
          <span style={{ color: "#EDEDEF", fontSize: 31, fontWeight: 500, fontFamily: FONT, letterSpacing: "-0.3px" }}>Engineering backlog</span>
        </div>

        {/* Motion-smear ghost copies (JS-driven, see handleFrame above) */}
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

        {/* Issue list — sweeps up during the scroll-settle window (JS-driven) */}
        <div ref={issueListRef} style={{ position: "absolute", top: 87, left: 262, width: 1404, opacity: 0, transformOrigin: "top center", willChange: "transform, opacity", zIndex: 6 }}>
          {buildListInner(true)}
        </div>

        {/* Scrollbar */}
        <div style={{ position: "absolute", right: 20, top: 110, width: 6, height: 600, background: "#1e1e22", borderRadius: 3 }}>
          <div ref={scrollbarThumbRef} style={{ position: "absolute", left: 0, width: 6, height: 130, background: "#3a3b42", borderRadius: 3, top: "45%" }} />
        </div>

        {/* Assign-to modal — left-aligned panel spanning the content column */}
        <div
          style={{
            position: "absolute", top: 96, left: 255, transformOrigin: "top center", width: 1410,
            background: "#161619", borderRadius: 14, opacity: 0, zIndex: 20,
            boxShadow: "0 40px 90px rgba(0,0,0,0.7)", border: "1px solid #232329",
            animation: [
              "modal-in 160ms 1233ms cubic-bezier(0.33,1,0.68,1) both",
              "modal-out 140ms 2766ms cubic-bezier(0.32,0,0.67,0) both",
            ].join(", "),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "26px 30px", borderBottom: "1px solid #202024", position: "relative" }}>
            <div style={{ background: "#26262c", borderRadius: 8, padding: "9px 18px" }}>
              <span style={{ color: "#E4E4E6", fontSize: 24, fontFamily: FONT }}>6 issues</span>
            </div>
            <div style={{ width: 2, height: 34, background: "#8A8F98", marginLeft: 6 }} />
            <span style={{ color: "#6E7178", fontSize: 28, fontFamily: FONT, marginLeft: -8 }}>Assign to...</span>
            <div style={{ position: "absolute", right: 14, top: 18, width: 8, height: 78, background: "#34353d", borderRadius: 4 }} />
          </div>

          <div style={{ padding: "18px 0 22px" }}>
            {MODAL_AGENTS.map((agent, i) => {
              const Icon = AGENT_ICON[agent];
              const sel = agent === "Codegen";
              return (
                <div
                  key={i}
                  style={{
                    display: "flex", alignItems: "center", gap: 18, padding: "21px 30px",
                    background: sel ? "rgba(94,106,210,0.06)" : "transparent",
                    animation: sel ? "codegen-row-flash 350ms 2083ms cubic-bezier(0.33,1,0.68,1) both" : undefined,
                  }}
                >
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

        <Cursor refObj={cursorRef} />
      </div>
    </Timegroup>
  );
};
