/**
 * Scene 6 — ARQOS Dashboard → Valuation Reviewer zoom → Claude outro (cream bg)
 *
 * Round 6 fixes:
 *   FIX D: REMOVED the 4 black border-edge divs (bTopRef/bBottomRef/bLeftRef/bRightRef).
 *           The orange outline on the VR card is the ONLY outline. No second black box.
 *   FIX E: Final lockup is on CREAM/WHITE background (#EAE8DE), NOT orange.
 *          - The VR card face (near-white #FFF9F7) EXPANDS to fill the frame
 *          - Orange bg fades out as card face expands
 *          - Final: cream bg + ORANGE asterisk (#D87757) + BLACK "Claude" (#1A1410)
 *
 * Beat breakdown (scene-local ms):
 *   0–600ms      — ARQOS dashboard card pops up (scale 0.7→1.0 + opacity 0→1)
 *   600–2000ms   — hold dashboard on orange bg
 *   2000–4000ms  — zoom into VR card (scale 1→3.0), card fills frame
 *   4000–5200ms  — VR card contents crossfade → Claude lockup inside card
 *   5200–6400ms  — orange bg fades out → cream fills frame (card face expands)
 *   6000–7200ms  — zoomed Claude lockup fades to final
 *   7200–7500ms  — Hold: Claude lockup on cream bg
 *
 * Duration: 7500ms
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TraceLayer } from "../components/TraceLayer";
import { track, lerp } from "../components/helpers";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { eases } from "animejs";

export const SCENE6_START    = 15500;
export const SCENE6_DURATION = 7500;

// ── Dashboard card dimensions ──
const PANEL_W    = 1620;
const PANEL_H    = 770;

const NAV_H           = 64;
const CONTENT_PADDING = 24;
const SECTION_HEADER_H = 50;
const GRID_GAP        = 16;
const GRID_PADDING    = 40;
const CARD_H          = 196;

const AVAILABLE_W = PANEL_W - GRID_PADDING * 2 - GRID_GAP * 2;
const COL_W       = AVAILABLE_W / 3;

// VR card: row 0, col 2  (LOCAL coordinates within the panel)
const VR_COL  = 2;
const VR_ROW  = 0;

const VR_LOCAL_LEFT = GRID_PADDING + VR_COL * (COL_W + GRID_GAP);
const VR_LOCAL_TOP  = NAV_H + CONTENT_PADDING + SECTION_HEADER_H + VR_ROW * (CARD_H + GRID_GAP) + GRID_GAP;

const VR_LOCAL_CX = VR_LOCAL_LEFT + COL_W / 2;
const VR_LOCAL_CY = VR_LOCAL_TOP  + CARD_H / 2;

const ZOOM_TARGET = 3.0;

// Agent cards
const agentCards = [
  { icon: "≡",  name: "GL Reconciler",       desc: "Finds breaks, traces root cause, routes for sign-off.",                       runs: "147", status: "Running",      statusColor: "#2C8A4A", active: false, empty: false, badge: null },
  { icon: "◎",  name: "KYC Screener",         desc: "Parses onboarding docs, runs the rules engine, flags gaps.",                   runs: "23",  status: "Idle",         statusColor: "#9A9080", active: false, empty: false, badge: null },
  { icon: "Σ",  name: "Valuation Reviewer",   desc: "Ingests GP packages, runs the valuation template, stages LP reporting.",       runs: "8",   status: "Open agent →", statusColor: "#D87757", active: true,  empty: false, badge: "Q1 CLOSE READY" },
  { icon: "◷",  name: "Month-End Closer",     desc: "Accruals, roll-forwards, variance commentary.",                                runs: "12",  status: "Running",      statusColor: "#2C8A4A", active: false, empty: false, badge: null },
  { icon: "☐",  name: "Statement Auditor",    desc: "Audits pre-generated LP statements before distribution.",                     runs: "31",  status: "Idle",         statusColor: "#9A9080", active: false, empty: false, badge: null },
  { icon: null, name: null,                   desc: "Deploy a new agent\nfrom template",                                            runs: null,  status: null,           statusColor: null,      active: false, empty: true,  badge: null },
];

export function Scene6_ArqosDashboard(): React.ReactElement {
  const dashboardRef   = useRef<HTMLDivElement>(null);
  const zoomRef        = useRef<HTMLDivElement>(null);
  const vrOrigRef      = useRef<HTMLDivElement>(null);
  const vrClaudeRef    = useRef<HTMLDivElement>(null);
  const claudeRef      = useRef<HTMLDivElement>(null);
  const orangeBgRef    = useRef<HTMLDivElement>(null);
  const creamBgRef     = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // ─── Dashboard POP UP (0–600ms) ───
    if (dashboardRef.current) {
      const popT  = track(ms, 0, 600, eases.outCubic);
      const scale = lerp(0.72, 1.0, popT);
      const opacity = lerp(0, 1, popT);
      dashboardRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
      dashboardRef.current.style.opacity   = String(opacity);
    }

    // ─── Zoom into VR card (2000–4000ms) ───
    if (zoomRef.current) {
      const zoomT = track(ms, 2000, 4000, eases.inOutCubic);
      const scale = lerp(1.0, ZOOM_TARGET, zoomT);
      const txFull = PANEL_W / 2 - VR_LOCAL_CX * ZOOM_TARGET;
      const tyFull = PANEL_H / 2 - VR_LOCAL_CY * ZOOM_TARGET;
      const tx = lerp(0, txFull, zoomT);
      const ty = lerp(0, tyFull, zoomT);
      zoomRef.current.style.transformOrigin = "0 0";
      zoomRef.current.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    }

    // ─── VR card crossfade: original content → Claude lockup inside card (4000–5200ms) ───
    const morphT = track(ms, 4000, 5200, eases.inOutCubic);
    if (vrOrigRef.current)    vrOrigRef.current.style.opacity    = String(1 - morphT);
    if (vrClaudeRef.current)  vrClaudeRef.current.style.opacity  = String(morphT);

    // ─── FIX E: Orange bg fades OUT, cream bg fades IN (5200–6400ms) ───
    // This replaces the old "4 black border edges slide off" mechanic.
    // Instead the orange BG simply dissolves to cream as the VR card face "is" the new bg.
    const bgFadeT = track(ms, 5200, 6400, eases.inOutCubic);
    if (orangeBgRef.current) {
      orangeBgRef.current.style.opacity = String(Math.max(0, 1 - bgFadeT));
    }
    if (creamBgRef.current) {
      creamBgRef.current.style.opacity = String(bgFadeT);
    }

    // ─── Dashboard fades OUT (5400–6200ms) ───
    if (dashboardRef.current && ms > 4000) {
      const dashOutT = track(ms, 5400, 6200, eases.inCubic);
      dashboardRef.current.style.opacity = String(Math.max(0, 1 - dashOutT));
    }

    // ─── FIX E: Final Claude lockup fades in on CREAM bg (6000–7200ms) ───
    if (claudeRef.current) {
      const lockT = track(ms, 6000, 7200, eases.outCubic);
      claudeRef.current.style.opacity   = String(lockT);
      claudeRef.current.style.transform = `translate(-50%, -50%) scale(${lerp(0.90, 1.0, lockT)})`;
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE6_DURATION}ms`}
      onFrame={onFrame as any}
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0, width: 1920, height: 1080, overflow: "hidden" }}
    >
      <TraceLayer sceneStartMs={SCENE6_START} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* ORANGE BG — fades out during the card-to-cream transition */}
      {!TRACE_MODE && (
        <div
          ref={orangeBgRef}
          style={{
            position: "absolute", inset: 0,
            background: "#D87757",
            zIndex: 1,
          }}
        />
      )}

      {/* OUTRO BG — fades in as orange fades out → final lockup background.
          ROUND-7 FIX (comment #4): pure WHITE (#FFFFFF), not beige — so the final
          Claude lockup background matches the near-white card face that expands
          ("the transition inside the box"). No beige outro. */}
      {!TRACE_MODE && (
        <div
          ref={creamBgRef}
          style={{
            position: "absolute", inset: 0,
            background: "#FFFFFF",
            zIndex: 2,
            opacity: 0,
          }}
        />
      )}

      {/* DASHBOARD CARD — centered */}
      <div
        ref={dashboardRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%) scale(0.72)",
          opacity: 0,
          zIndex: 3,
          width: PANEL_W,
          height: PANEL_H,
          overflow: "visible",
          willChange: "transform, opacity",
        }}
      >
        {/* Zoom container */}
        <div
          ref={zoomRef}
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "0 0",
            willChange: "transform",
          }}
        >
          {/* Dashboard panel card */}
          <div style={{
            position: "absolute",
            left: 0, top: 0,
            width: PANEL_W, height: PANEL_H,
            background: "#FAF8F4",
            borderRadius: 20,
            boxShadow: "0 12px 80px rgba(0,0,0,0.28)",
          }}>
            {/* Nav bar */}
            <div style={{
              display: "flex", alignItems: "center",
              padding: "0 32px", height: NAV_H,
              borderBottom: "1px solid #E8E4DC",
              background: "#FAF8F4",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 40 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, background: "#D87757",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 14,
                }}>AQ</div>
                <div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: "#1A1410" }}>ARQOS</div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 11, color: "#8A8480" }}>FUND SERVICES</div>
                </div>
              </div>
              {["Funds", "Investors", "Agents", "Reports"].map(tab => (
                <div key={tab} style={{
                  marginRight: 32,
                  fontFamily: "Inter, sans-serif",
                  fontWeight: tab === "Agents" ? 600 : 400,
                  fontSize: 14,
                  color: tab === "Agents" ? "#D87757" : "#5A5450",
                  borderBottom: tab === "Agents" ? "2px solid #D87757" : "none",
                  paddingBottom: 4,
                }}>{tab}</div>
              ))}
              <div style={{ flex: 1 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 13, color: "#1A1410" }}>Maya Patel</div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 11, color: "#8A8480" }}>Senior Fund Accountant</div>
                </div>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#D87757" }} />
              </div>
            </div>

            {/* Content area */}
            <div style={{ padding: `${CONTENT_PADDING}px ${GRID_PADDING}px` }}>
              <div style={{
                fontFamily: "Inter, sans-serif", fontWeight: 600,
                fontSize: 18, color: "#1A1410", marginBottom: 18,
                height: SECTION_HEADER_H - CONTENT_PADDING,
                display: "flex", alignItems: "flex-end",
              }}>Agents</div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: GRID_GAP,
              }}>
                {agentCards.map((card, i) => {
                  const isVR = card.name === "Valuation Reviewer";
                  return (
                    <div
                      key={i}
                      style={{
                        /* ROUND-7 FIX (comment #4): VR card face is pure white so when it
                           expands into the white outro bg the transition is seamless (no beige).
                           The orange border still distinguishes it in the dashboard. */
                        background: "#FFFFFF",
                        border: card.empty ? "2px dashed #D8D4CC" : isVR ? "1.5px solid #D87757" : "1px solid #E8E4DC",
                        borderRadius: 12,
                        padding: "20px 20px 16px",
                        height: CARD_H,
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                      }}
                    >
                      {card.badge && (
                        <div style={{
                          position: "absolute", top: 14, right: 14,
                          fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 10,
                          color: "#D87757", letterSpacing: "0.06em",
                        }}>{card.badge}</div>
                      )}

                      {card.empty ? (
                        <div style={{
                          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "Inter, sans-serif", fontSize: 14, color: "#9A9490",
                          textAlign: "center", whiteSpace: "pre",
                        }}>{card.desc}</div>
                      ) : (
                        <>
                          <div style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: isVR ? "#F5E8E0" : "#F0EDE8",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 16, color: isVR ? "#D87757" : "#5A5450",
                            marginBottom: 10,
                          }}>{card.icon}</div>

                          {isVR ? (
                            <div style={{ flex: 1, position: "relative" }}>
                              {/* VR original content */}
                              <div ref={vrOrigRef} style={{ position: "absolute", inset: 0 }}>
                                <div style={{ fontFamily: "'Newsreader', Georgia, serif", fontWeight: 500, fontSize: 18, color: "#1A1410", marginBottom: 6 }}>{card.name}</div>
                                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 12, color: "#6A6460", lineHeight: 1.4 }}>{card.desc}</div>
                              </div>
                              {/* Claude lockup INSIDE VR card — orange asterisk, dark Claude */}
                              <div
                                ref={vrClaudeRef}
                                style={{
                                  position: "absolute", inset: 0,
                                  display: "flex", flexDirection: "row",
                                  alignItems: "center", justifyContent: "center",
                                  gap: 10, opacity: 0,
                                }}
                              >
                                <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                                  {[0,30,60,90,120,150].map((deg, j) => {
                                    const rad = (deg * Math.PI) / 180;
                                    const cx = 19, cy = 19, radius = 15;
                                    return <line key={j}
                                      x1={cx - Math.cos(rad)*radius} y1={cy - Math.sin(rad)*radius}
                                      x2={cx + Math.cos(rad)*radius} y2={cy + Math.sin(rad)*radius}
                                      stroke="#D87757" strokeWidth="4" strokeLinecap="round"
                                    />;
                                  })}
                                  <circle cx="19" cy="19" r="4" fill="#D87757" />
                                </svg>
                                <div style={{
                                  fontFamily: "'Newsreader', Georgia, serif",
                                  fontWeight: 500, fontSize: 28,
                                  color: "#1A1410", letterSpacing: "0.01em",
                                }}>Claude</div>
                              </div>
                            </div>
                          ) : (
                            <div style={{ flex: 1 }}>
                              <div style={{ fontFamily: "'Newsreader', Georgia, serif", fontWeight: 500, fontSize: 18, color: "#1A1410", marginBottom: 6 }}>{card.name}</div>
                              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 12, color: "#6A6460", lineHeight: 1.4 }}>{card.desc}</div>
                            </div>
                          )}

                          <div style={{
                            borderTop: "1px solid #E8E4DC", paddingTop: 10,
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            marginTop: "auto",
                          }}>
                            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#8A8480" }}>
                              <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: card.statusColor ?? "#9A9080", marginRight: 5, verticalAlign: "middle" }} />
                              {card.runs} runs · 24h
                            </div>
                            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: card.statusColor ?? "#9A9080", fontWeight: card.active ? 600 : 400 }}>{card.status}</div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10, fontFamily: "Inter, sans-serif", fontSize: 12, color: "#8A8480" }}>1/12 ›</div>
            </div>
          </div>
        </div>
      </div>

      {/*
        FIX E: Final Claude lockup — CREAM bg + ORANGE asterisk + BLACK "Claude"
        Matches ref_60s.jpg exactly.
        Fades in over cream background (zIndex 20, above cream bg layer).
      */}
      <div
        ref={claudeRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%) scale(0.90)",
          zIndex: 20,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          opacity: 0,
          willChange: "opacity, transform",
        }}
      >
        {/* Claude asterisk — ORANGE on cream bg */}
        <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
          {[0,30,60,90,120,150].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const cx = 70, cy = 70, r = 56;
            return <line key={i}
              x1={cx - Math.cos(rad)*r} y1={cy - Math.sin(rad)*r}
              x2={cx + Math.cos(rad)*r} y2={cy + Math.sin(rad)*r}
              stroke="#D87757" strokeWidth="12" strokeLinecap="round"
            />;
          })}
          <circle cx="70" cy="70" r="13" fill="#D87757" />
        </svg>
        {/* "Claude" wordmark — BLACK on cream bg */}
        <div style={{
          fontFamily: "'Newsreader', 'EB Garamond', Georgia, serif",
          fontWeight: 500,
          fontSize: 112,
          color: "#1A1410",
          letterSpacing: "-0.01em",
          lineHeight: 1,
        }}>Claude</div>
      </div>
    </Timegroup>
  );
}

Scene6_ArqosDashboard.duration = SCENE6_DURATION;
