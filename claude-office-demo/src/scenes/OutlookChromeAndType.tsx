/**
 * OutlookChromeAndType — 6500ms
 * Master timeline: 6500ms → 13000ms
 *
 * Beat 1 (0–1300ms):    Unified Outlook+Claude window fades in.
 * Beat 2 (1300–3000ms): FIX 5: ORANGE GLOW — radial-gradient at 0.55 opacity center (OBVIOUS).
 *                        Camera zooms in on chat input.
 * Beat 3 (3000–4500ms): User types prompt.
 * Beat 4 (4500–6000ms): Cursor appears, moves to send button.
 * Beat 5 (6000–6300ms): Cursor clicks send.
 * Beat 6 (6300–7500ms): 1-second hold.
 *
 * FIX 5: Orange glow behind window — radial-gradient center opacity 0.55 (NOT 0.35 or 0.18).
 *        Must be OBVIOUSLY visible at 7s.
 * FIX 6: Claude panel default content — "How can I help with your email?" + 3 button pills.
 *        Default state until user types.
 */
import React, { useCallback, useRef } from "react";
import { Timegroup, Audio } from "@editframe/react";
import { CreamBackdrop } from "../components/CreamBackdrop";
import { track, lerp, clamp } from "@shared/utils/animation";
import { eases } from "animejs";

const DURATION_MS = 6500;

// ── Unified window layout ──
const WIN_LEFT = 60;
const WIN_TOP  = 70;
const WIN_H    = 940;
const OUTLOOK_CONTENT_W = 1200;
// #9/#11: Claude chat panel THINNER (was 500 — "thin it out", "half its size").
const CLAUDE_PANEL_W = 440;
const WIN_W = OUTLOOK_CONTENT_W + CLAUDE_PANEL_W; // 1700
const TITLE_BAR_H = 40;
const TOOLBAR_H   = 44;
const HEADER_H    = TITLE_BAR_H + TOOLBAR_H; // 84
const CLAUDE_HEADER_H = 56;

// Claude panel absolute position
const CLAUDE_ABS_LEFT = WIN_LEFT + OUTLOOK_CONTENT_W; // 1260

// Input box dimensions
const INPUT_CONTAINER_PAD_H = 24;
const INPUT_H = 72;
const INPUT_ABS_TOP  = WIN_TOP + WIN_H - INPUT_CONTAINER_PAD_H - INPUT_H;
const INPUT_ABS_LEFT = CLAUDE_ABS_LEFT + 14;
const INPUT_ABS_W    = CLAUDE_PANEL_W - 28;

// Send button
const SEND_BTN_SIZE = 38;
const SEND_BTN_CX = INPUT_ABS_LEFT + INPUT_ABS_W - 10 - SEND_BTN_SIZE / 2;
const SEND_BTN_CY = INPUT_ABS_TOP + INPUT_H - 10 - SEND_BTN_SIZE / 2;

// Camera focal point = center of input box
const FOCAL_LX = INPUT_ABS_LEFT + INPUT_ABS_W / 2;
const FOCAL_LY = INPUT_ABS_TOP + INPUT_H / 2;
const ZOOM_SCALE = 1.92;
const CAM_ORIGIN_X = (FOCAL_LX / 1920) * 100;
const CAM_ORIGIN_Y = (FOCAL_LY / 1080) * 100;
const CAM_TX = 960 - FOCAL_LX;
const CAM_TY = 540 - FOCAL_LY;

// Timing
const CHROME_IN_START   = 100;
const CHROME_IN_END     = 1100;
// Glow ramps in FAST so the warm halo is clearly visible during the wide
// establishing beat (before the camera zooms into the input box).
const ORANGE_IN_START   = 250;
const ORANGE_IN_END     = 1000;
const ZOOM_START        = 1900;
const ZOOM_END          = 3200;
const TYPE_START        = 3000;
const TYPE_DUR          = 1400;
const CURSOR_IN_START   = 4600;
const CURSOR_ARRIVE_END = 5600;
const CLICK_START       = 5900;
const CLICK_END         = 6100;

const PROMPT_TEXT = "Way behind on my emails. What do I need to focus on today?";

export function OutlookChromeAndType() {
  const rigRef             = useRef<HTMLDivElement>(null);
  const windowRef          = useRef<HTMLDivElement>(null);
  const orangeBgRef        = useRef<HTMLDivElement>(null);
  const orangeOutlineRef   = useRef<HTMLDivElement>(null); // FIX 3: strong orange border overlay
  const promptTextRef      = useRef<HTMLSpanElement>(null);
  const cursorRef          = useRef<HTMLDivElement>(null);
  const sendBtnRef         = useRef<HTMLDivElement>(null);
  const sendBtnHighRef     = useRef<HTMLDivElement>(null);
  const defaultContentRef  = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // Window fade in
    const chromeP = track(ms, CHROME_IN_START, CHROME_IN_END, eases.outQuart);
    if (windowRef.current) {
      windowRef.current.style.opacity = String(chromeP);
    }

    // FIX 3: ORANGE OUTLINE — animate both the faint bg glow and the strong border outline
    if (orangeBgRef.current) {
      const orangeP = track(ms, ORANGE_IN_START, ORANGE_IN_END, eases.outCubic);
      orangeBgRef.current.style.opacity = String(orangeP);
    }
    // FIX 3: Strong orange border overlay — ramps to full
    if (orangeOutlineRef.current) {
      const orangeP = track(ms, ORANGE_IN_START, ORANGE_IN_END, eases.outCubic);
      orangeOutlineRef.current.style.opacity = String(orangeP);
    }

    // Camera zoom
    if (rigRef.current) {
      const zoomP = track(ms, ZOOM_START, ZOOM_END, eases.inOutCubic);
      const scale = lerp(1.0, ZOOM_SCALE, zoomP);
      const tx = lerp(0, CAM_TX, zoomP);
      const ty = lerp(0, CAM_TY, zoomP);
      rigRef.current.style.transformOrigin = `${CAM_ORIGIN_X}% ${CAM_ORIGIN_Y}%`;
      rigRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;
    }

    // FIX 6: Hide default content once typing starts
    if (defaultContentRef.current) {
      const hideDefault = ms >= TYPE_START ? 1 : 0;
      defaultContentRef.current.style.display = hideDefault ? "none" : "flex";
    }

    // Typing
    if (promptTextRef.current) {
      const typeP = track(ms, TYPE_START, TYPE_START + TYPE_DUR, eases.linear);
      const charCount = Math.floor(typeP * PROMPT_TEXT.length);
      promptTextRef.current.textContent = PROMPT_TEXT.slice(0, charCount);
      const showCaret = ms >= TYPE_START && ms < TYPE_START + TYPE_DUR + 200 && Math.floor(ms / 530) % 2 === 0;
      promptTextRef.current.style.borderRight = showCaret ? "2px solid #2A2A2A" : "none";
    }

    // Cursor
    if (cursorRef.current) {
      const cursorShowP = track(ms, CURSOR_IN_START, CURSOR_IN_START + 200, eases.outQuart);
      const startX = INPUT_ABS_LEFT + 100;
      const startY = INPUT_ABS_TOP + 20;
      const targetX = SEND_BTN_CX - 8;
      const targetY = SEND_BTN_CY - 12;
      const moveP = track(ms, CURSOR_IN_START + 200, CURSOR_ARRIVE_END, eases.outCubic);
      const cx = lerp(startX, targetX, moveP);
      const cy = lerp(startY, targetY, moveP);
      const clickP = track(ms, CLICK_START, CLICK_END, eases.outCubic);
      const clickScale = lerp(1, 0.92, Math.sin(clickP * Math.PI));
      cursorRef.current.style.opacity = String(cursorShowP);
      cursorRef.current.style.left = `${cx}px`;
      cursorRef.current.style.top = `${cy}px`;
      cursorRef.current.style.transform = `scale(${clickScale})`;
    }

    // Send button highlight
    if (sendBtnRef.current && sendBtnHighRef.current) {
      const clickHighP = track(ms, CLICK_START, CLICK_END, eases.outQuart);
      const highFade   = 1 - track(ms, CLICK_END, CLICK_END + 300, eases.outCubic);
      sendBtnHighRef.current.style.opacity = String(clickHighP * highFade * 0.6);
      const btnScale = lerp(1, 1.1, Math.sin(track(ms, CLICK_START, CLICK_END, eases.outCubic) * Math.PI));
      sendBtnRef.current.style.transform = `scale(${btnScale})`;
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration={`${DURATION_MS}ms`}
      onFrame={onFrame as any}
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0, width: 1920, height: 1080, overflow: "hidden" }}
    >
      <CreamBackdrop variant="light" />

      {/* Camera rig — orange glow is INSIDE the rig so it scales with the zoom */}
      <div ref={rigRef} style={{
        position: "absolute", inset: 0, width: 1920, height: 1080,
        transformOrigin: `${CAM_ORIGIN_X}% ${CAM_ORIGIN_Y}%`,
        willChange: "transform", zIndex: 2,
      }}>
        {/*
          ROUND-8 FIX: the glow is a soft orange HALO that HUGS the window's
          perimeter (reference scene-03: clearly apparent, strongest at the top,
          wrapping all edges, soft non-rigid edges). Implemented as a window-sized
          div BEHIND the window (zIndex 1) carrying a layered orange box-shadow,
          so the glow radiates OUTWARD from the edges into the margins. The opaque
          window (zIndex 2) covers the div, so the glow can only show around the
          window — it NEVER bleeds into the content. (The old radial-gradient hid
          its bright centre behind the window, so only a ~10% fringe showed = it
          "didn't even look like it was there".)
        */}
        <div ref={orangeOutlineRef} style={{
          position: "absolute",
          left: WIN_LEFT,
          top: WIN_TOP,
          width: WIN_W,
          height: WIN_H,
          zIndex: 1,
          opacity: 0,
          borderRadius: 14,
          background: "transparent",
          boxShadow:
            "0 0 64px 6px rgba(232,138,74,0.62), " +
            "0 0 150px 32px rgba(234,120,52,0.40), " +
            "0 0 280px 84px rgba(234,120,52,0.18)",
          pointerEvents: "none",
          willChange: "opacity",
        }} />

        {/* Unified macOS window — sits ABOVE the aura so the glow only shows around it */}
        <div ref={windowRef} style={{
          position: "absolute",
          left: WIN_LEFT,
          top: WIN_TOP,
          width: WIN_W,
          height: WIN_H,
          opacity: 0,
          zIndex: 2,
          willChange: "opacity",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.10)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#F5F5F5",
        }}>
          {/* macOS title bar */}
          <div style={{
            height: TITLE_BAR_H,
            background: "#2563EB",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 8,
            flexShrink: 0,
          }}>
            <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#FF5F57" }} />
            <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#FEBC2E" }} />
            <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#28C840" }} />
            <span style={{ color: "white", fontSize: 14, marginLeft: 16, fontWeight: 500 }}>Inbox — Outlook</span>
            <div style={{
              marginLeft: "auto", marginRight: 16,
              background: "rgba(255,255,255,0.2)", borderRadius: 6, padding: "4px 12px",
              fontSize: 12, color: "rgba(255,255,255,0.7)",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="5" cy="5" r="4" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
                <path d="M8 8L11 11" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Search
            </div>
          </div>

          {/* Toolbar */}
          <div style={{
            height: TOOLBAR_H,
            background: "#EBF2FF",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 12,
            borderBottom: "1px solid #D0D9F0",
            flexShrink: 0,
          }}>
            {["New Email", "Reply", "Forward", "Delete"].map(label => (
              <button key={label} style={{
                padding: "4px 12px", background: "white",
                border: "1px solid #C8D3E8", borderRadius: 4,
                fontSize: 12, color: "#374151", cursor: "pointer",
              }}>
                {label}
              </button>
            ))}
          </div>

          {/* Content area — FIX 4: 4-pane layout = icon-rail + message-list + reading-pane + Claude */}
          <div style={{ display: "flex", height: `calc(100% - ${HEADER_H}px)`, overflow: "hidden" }}>
            {/* Outlook side: icon-rail + message-list + reading-pane */}
            <div style={{
              width: OUTLOOK_CONTENT_W,
              display: "flex",
              borderRight: "1px solid rgba(0,0,0,0.08)",
              flexShrink: 0,
            }}>
              {/* FIX 4: Narrow icon rail (like ref_8s) */}
              <div style={{
                width: 48, background: "#1E3A8A",
                display: "flex", flexDirection: "column", alignItems: "center",
                paddingTop: 12, gap: 6, flexShrink: 0,
              }}>
                {/* Mail icon (active) */}
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="2" y="4" width="16" height="12" rx="2" stroke="white" strokeWidth="1.5"/>
                    <path d="M2 7L10 12L18 7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                {/* Calendar */}
                <div style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.6 }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="2" y="3" width="16" height="15" rx="2" stroke="white" strokeWidth="1.5"/>
                    <path d="M6 2V5M14 2V5M2 8H18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                {/* People */}
                <div style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.6 }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="7" r="3" stroke="white" strokeWidth="1.5"/>
                    <path d="M3 18C3 14.686 6.134 12 10 12C13.866 12 17 14.686 17 18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                {/* Tasks */}
                <div style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.6 }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 5H16M4 10H12M4 15H10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                {/* More */}
                <div style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.5, marginTop: "auto", marginBottom: 12 }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="5" r="1.5" fill="white"/>
                    <circle cx="10" cy="10" r="1.5" fill="white"/>
                    <circle cx="10" cy="15" r="1.5" fill="white"/>
                  </svg>
                </div>
              </div>

              {/* FIX 4: Message list with Focused/Other tabs */}
              <div style={{ width: 280, background: "#F8F9FF", borderRight: "1px solid #E2E8F0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
                {/* Focused / Other tabs */}
                <div style={{ display: "flex", padding: "10px 12px 0", gap: 0, borderBottom: "1px solid #E2E8F0", flexShrink: 0 }}>
                  <div style={{ padding: "6px 14px 8px", fontSize: 13, fontWeight: 600, color: "#2563EB", borderBottom: "2px solid #2563EB" }}>Focused</div>
                  <div style={{ padding: "6px 14px 8px", fontSize: 13, fontWeight: 400, color: "#6B7280" }}>Other</div>
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", paddingBottom: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4 8h8M6 12h4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </div>
                </div>
                {/* Today group */}
                <div style={{ padding: "6px 12px 2px", fontSize: 11, fontWeight: 600, color: "#6B7280", letterSpacing: "0.04em", textTransform: "uppercase" }}>Today</div>
                {/* Message rows */}
                {[
                  { initials: "DR", color: "#DC2626", from: "Doug R.", subject: "Whitman diligence — 4 follow-u…", preview: "Nick — need your read on the redemption…", time: "Mon", unread: true, badge: 0 },
                  { initials: "DH", color: "#7C3AED", from: "Dan H.", subject: "FW: Acme value-creation brief —…", preview: "Team, Forwarding the brief Marcus and…", time: "Mon", unread: true, badge: 0, hasAttach: true },
                  { initials: "AF", color: "#059669", from: "Austin F.", subject: "CRLN level-3 mark and Ashby s…", preview: "No worries on the Sunday turn. Austin's…", time: "Mon", unread: false, badge: 3 },
                ].map((msg, i) => (
                  <div key={i} style={{
                    padding: "9px 12px", borderBottom: "1px solid rgba(0,0,0,0.05)",
                    background: "white", cursor: "pointer", display: "flex", gap: 8, alignItems: "flex-start",
                  }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: msg.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <span style={{ color: "white", fontSize: 11, fontWeight: 700 }}>{msg.initials}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
                        <span style={{ fontWeight: msg.unread ? 700 : 500, fontSize: 12, color: "#111827" }}>{msg.from}</span>
                        <span style={{ fontSize: 10, color: "#9CA3AF", flexShrink: 0 }}>{msg.time}</span>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: msg.unread ? 600 : 400, color: "#1F2937", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginBottom: 2 }}>{msg.subject}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{msg.preview}</div>
                      {msg.hasAttach && <div style={{ marginTop: 3, display: "inline-flex", alignItems: "center", gap: 3, background: "#F3F4F6", borderRadius: 3, padding: "1px 6px" }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 8.5V2.5a2 2 0 014 0V9A3 3 0 012 9V2.5a4 4 0 018 0V8" stroke="#6B7280" strokeWidth="1" strokeLinecap="round"/></svg>
                        <span style={{ fontSize: 10, color: "#374151" }}>Acme_brief…</span>
                      </div>}
                      {msg.badge > 0 && <span style={{ background: "#2563EB", color: "white", borderRadius: 10, padding: "0 5px", fontSize: 10, fontWeight: 700, marginLeft: 4 }}>{msg.badge}</span>}
                    </div>
                    {msg.unread && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#2563EB", flexShrink: 0, marginTop: 6 }} />}
                  </div>
                ))}
                {/* This week group */}
                <div style={{ padding: "6px 12px 2px", fontSize: 11, fontWeight: 600, color: "#6B7280", letterSpacing: "0.04em", textTransform: "uppercase", marginTop: 4 }}>This week</div>
                {[
                  { initials: "SK", color: "#DB2777", from: "Stephanie K.", subject: "Q1 letter — can you + Judith own…", preview: "Nick, IC is Thursday and IR wants the L…", time: "Sun", unread: true, badge: 0, hasAttach: true },
                  { initials: "AA", color: "#D97706", from: "Anita A.", subject: "Itinerary confirmed: CLE Thu 4/30…", preview: "Hi Nick, You're confirmed on the 6:05a…", time: "Sun", unread: false, selected: true, badge: 0 },
                  { initials: "TO", color: "#0891B2", from: "Tom O.", subject: "Industrials Research Flow-control…", preview: "Quick one — are we benchmarking Acm…", time: "Sat", unread: false, badge: 2 },
                  { initials: "A", color: "#6B7280", from: "alerts@newswire-feed.insiders.com", subject: "ALERT: C. Partners discloses 5.8…", preview: "INDUSTRIES — C. Partners LP filed an…", time: "Sun", unread: true, badge: 0 },
                ].map((msg, i) => (
                  <div key={i} style={{
                    padding: "9px 12px", borderBottom: "1px solid rgba(0,0,0,0.05)",
                    background: (msg as any).selected ? "#DBEAFE" : "white",
                    cursor: "pointer", display: "flex", gap: 8, alignItems: "flex-start",
                  }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: msg.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <span style={{ color: "white", fontSize: 11, fontWeight: 700 }}>{msg.initials}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
                        <span style={{ fontWeight: msg.unread ? 700 : 500, fontSize: 12, color: "#111827" }}>{msg.from}</span>
                        <span style={{ fontSize: 10, color: "#9CA3AF", flexShrink: 0 }}>{msg.time}</span>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: msg.unread ? 600 : 400, color: "#1F2937", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginBottom: 2 }}>{msg.subject}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{msg.preview}</div>
                      {(msg as any).hasAttach && <div style={{ marginTop: 3, display: "inline-flex", alignItems: "center", gap: 3, background: "#F3F4F6", borderRadius: 3, padding: "1px 6px" }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 8.5V2.5a2 2 0 014 0V9A3 3 0 012 9V2.5a4 4 0 018 0V8" stroke="#6B7280" strokeWidth="1" strokeLinecap="round"/></svg>
                        <span style={{ fontSize: 10, color: "#374151" }}>Q1_Letter…</span>
                      </div>}
                      {msg.badge > 0 && <span style={{ background: "#2563EB", color: "white", borderRadius: 10, padding: "0 5px", fontSize: 10, fontWeight: 700, marginLeft: 4 }}>{msg.badge}</span>}
                    </div>
                    {msg.unread && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#2563EB", flexShrink: 0, marginTop: 6 }} />}
                  </div>
                ))}
              </div>

              {/* FIX 4: Reading pane — open Anita email */}
              <div style={{ flex: 1, background: "white", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {/* Email header */}
                <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #E5E7EB", flexShrink: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 8, lineHeight: 1.3 }}>
                    Itinerary confirmed: CLE Thu 4/30 — car + return options
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#D97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>AA</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Anita Acharya</div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>To: 3 others</div>
                    </div>
                    <div style={{ marginLeft: "auto", fontSize: 11, color: "#9CA3AF" }}>Sun 6:12 PM</div>
                  </div>
                </div>
                {/* Email body */}
                <div style={{ flex: 1, overflowY: "auto", padding: "14px 20px", fontSize: 13, lineHeight: 1.65, color: "#1F2937" }}>
                  <p style={{ marginBottom: 10 }}>Hi Nick,</p>
                  <p style={{ marginBottom: 10 }}>You're confirmed on the <strong>6:05a out of LGA Thursday</strong>, arriving <strong>CLE 7:58a</strong>. Ground car is booked under Hayes — he'll already be in it from the earlier connection, pickup at baggage Door 4. Acme is holding badges for both of you at the main lobby; ask for Denise Carr.</p>
                  <p style={{ marginBottom: 10 }}>I've held two return options since Dan wasn't sure how long the SteerCo would run:</p>
                  <ul style={{ marginBottom: 10, paddingLeft: 18 }}>
                    <li style={{ marginBottom: 4 }}>2:40p CLE→LGA (gets you back for the Whitman IC prep block)</li>
                    <li style={{ marginBottom: 4 }}>6:15p CLE→LGA (if the board keeps you)</li>
                  </ul>
                  <p style={{ marginBottom: 10 }}>Let me know by Wednesday noon which to release. Dan is staying over for the management dinner so the car back to the airport is yours alone either way.</p>
                  <p style={{ marginBottom: 10 }}>Also — your corporate card closed Friday and there are three taxi receipts still uncoded against the number. Finance will bounce them if they roll into May, so flag them in ExpenseHub when you get a minute.</p>
                  <p style={{ marginBottom: 10 }}>Safe travels,<br />Anita</p>
                  <p style={{ marginBottom: 0, color: "#6B7280" }}>Anita Acharya / Travel &amp; Expense · Silvern Partners</p>
                </div>
              </div>
            </div>

            {/*
              FIX 6: Claude panel — RIGHT COLUMN with default content (not blank slate).
              Default state: "How can I help with your email?" + 3 button pills.
              Default disappears when typing starts.
            */}
            <div style={{
              width: CLAUDE_PANEL_W,
              height: "100%",
              background: "#FAFAF8",
              display: "flex",
              flexDirection: "column",
              borderLeft: "1px solid rgba(0,0,0,0.08)",
              flexShrink: 0,
            }}>
              {/* Claude panel header */}
              <div style={{
                height: CLAUDE_HEADER_H,
                padding: "0 18px",
                borderBottom: "1px solid rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexShrink: 0,
                background: "#FAFAF8",
              }}>
                <CoralAsteriskIcon size={26} />
                <span style={{ fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>Claude</span>
                <span style={{ marginLeft: "auto", fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center", gap: 4 }}>
                  Opus 4.7
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>

              {/*
                FIX 6: Default content — vertically centered in the chat area.
                "How can I help with your email?" + 3 button pills.
                Disappears when typing starts (controlled via ref).
              */}
              <div
                ref={defaultContentRef}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "24px 20px",
                  gap: 20,
                }}
              >
                {/* Header question */}
                <div style={{
                  fontSize: 17,
                  fontWeight: 500,
                  color: "#4B5563",
                  textAlign: "center",
                  lineHeight: 1.4,
                }}>
                  How can I help with your email?
                </div>

                {/* 3 button pills */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  width: "100%",
                  alignItems: "stretch",
                }}>
                  {[
                    "Summarize this email",
                    "Draft a reply",
                    "Extract action items",
                  ].map((label) => (
                    <button key={label} style={{
                      padding: "12px 20px",
                      background: "white",
                      border: "1.5px solid #E5E7EB",
                      borderRadius: 24,
                      fontSize: 14,
                      color: "#1A1A1A",
                      cursor: "pointer",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                      textAlign: "center",
                      fontWeight: 400,
                    }}>
                      {label}
                    </button>
                  ))}
                </div>

                {/* Sub-footer */}
                <div style={{ textAlign: "center", marginTop: 4 }}>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>Create and manage skills</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>on your Claude account</div>
                </div>
              </div>

              {/* Chat input */}
              <div style={{
                padding: "10px 14px 14px",
                borderTop: "1px solid rgba(0,0,0,0.08)",
                background: "white",
                flexShrink: 0,
              }}>
                <div style={{
                  position: "relative",
                  border: "1.5px solid rgba(0,0,0,0.15)",
                  borderRadius: 12,
                  padding: "10px 14px",
                  minHeight: INPUT_H,
                  background: "white",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}>
                  <span ref={promptTextRef} style={{
                    fontSize: 14, color: "#1A1A1A", lineHeight: 1.5,
                    wordBreak: "break-word", minHeight: 22,
                    display: "block",
                    paddingRight: SEND_BTN_SIZE + 16,
                  }} />

                  {/* Send button — absolute bottom-right inside input */}
                  <div style={{ position: "absolute", bottom: 10, right: 10 }}>
                    <div
                      ref={sendBtnRef}
                      style={{
                        width: SEND_BTN_SIZE,
                        height: SEND_BTN_SIZE,
                        borderRadius: "50%",
                        background: "#0D0D0D",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        willChange: "transform",
                        position: "relative",
                      }}
                    >
                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                        <path d="M8.5 13V4M8.5 4L5 7.5M8.5 4L12 7.5"
                          stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div ref={sendBtnHighRef} style={{
                        position: "absolute",
                        inset: -6,
                        borderRadius: "50%",
                        background: "rgba(217,119,87,0.5)",
                        opacity: 0,
                        willChange: "opacity",
                        pointerEvents: "none",
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* macOS cursor */}
        <div ref={cursorRef} style={{
          position: "absolute",
          left: INPUT_ABS_LEFT + 100,
          top: INPUT_ABS_TOP + 20,
          opacity: 0,
          willChange: "opacity, left, top, transform",
          zIndex: 20,
          pointerEvents: "none",
        }}>
          <MacCursorSvg size={52} />
        </div>
      </div>

      {/* Prompt typewriter keystrokes (local 3000ms / master 9500ms) */}
      <Audio
        src="/claude-office-demo/src/assets/sfx/claude-office-demo-keyboard.wav"
        offset={`${TYPE_START}ms`}
        duration="1.4s"
        volume={0.7}
      />

      {/* Send-button click (local 5900ms / master 12400ms) */}
      <Audio
        src="/claude-office-demo/src/assets/sfx/claude-office-demo-click.mp3"
        offset={`${CLICK_START}ms`}
        sourceIn="0.6s"
        duration="0.3s"
        volume={1}
      />
    </Timegroup>
  );
}

function MacCursorSvg({ size }: { size: number }) {
  const w = size * 0.65;
  const h = size;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={w} height={h}
      viewBox="0 0 32 32"
      shapeRendering="geometricPrecision"
      style={{ display: "block", filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.4))" }}
    >
      <path
        d="M 6 4 L 6 26 L 11 21 L 14.5 28.5 L 17.5 27 L 14 19.5 L 21 19.5 Z"
        fill="white" stroke="white" strokeWidth={2.5} strokeLinejoin="round"
      />
      <path
        d="M 6 4 L 6 26 L 11 21 L 14.5 28.5 L 17.5 27 L 14 19.5 L 21 19.5 Z"
        fill="#1A1A1A" strokeLinejoin="round"
      />
    </svg>
  );
}

function CoralAsteriskIcon({ size }: { size: number }) {
  const SPOKES = 14;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.48;
  const innerR = size * 0.12;
  const strokeW = Math.max(1.5, size * 0.085);
  const lines: React.ReactNode[] = [];
  for (let i = 0; i < SPOKES; i++) {
    const angle = (i * Math.PI * 2) / SPOKES - Math.PI / 2;
    lines.push(
      <line
        key={i}
        x1={cx + Math.cos(angle) * innerR}
        y1={cy + Math.sin(angle) * innerR}
        x2={cx + Math.cos(angle) * outerR}
        y2={cy + Math.sin(angle) * outerR}
        stroke="#D97757"
        strokeWidth={strokeW}
        strokeLinecap="round"
      />
    );
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={size * 0.10} fill="#D97757" />
      {lines}
    </svg>
  );
}
