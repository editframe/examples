/**
 * ArqosDashboard — ARQOS Dashboard → Valuation Reviewer zoom → Claude outro (cream bg)
 *
 * Beat breakdown (scene-local ms, already shifted +OVERLAP_MS from the original
 * absolute-master numbers — see REFACTOR-PATTERNS.md 2b):
 *   600–1200ms    — ARQOS dashboard card pops up (scale 0.72→1.0 + opacity 0→1)
 *   1200–2600ms   — hold dashboard on orange bg
 *   2600–4600ms   — zoom into VR card (scale 1→3.0), card fills frame
 *   4600–5800ms   — VR card contents crossfade → Claude lockup inside card
 *   5800–7000ms   — orange bg fades out → cream fills frame (card face expands)
 *   6600–7800ms   — zoomed Claude lockup fades to final
 *   7800–8100ms   — Hold: Claude lockup on cream bg
 *
 * The ORANGE background at scene-start matches ManagedAgents' background exactly, so
 * this scene's incoming boundary needs no crossfade treatment (see ManagedAgents.tsx) —
 * the orange simply persists uninterrupted across the cut.
 *
 * Every beat here is a one-shot fade/scale/crossfade — no continuous or per-frame
 * motion — so each is its own small `@keyframes` pair (see styles.css) instead of an
 * `onFrame` switchboard.
 *
 * Duration: 7500 + OVERLAP_MS = 8100ms
 */
import React from "react";
import { Timegroup } from "@editframe/react";
import { TraceLayer } from "../components/TraceLayer";
import { TRACE_MODE, TRACE_OPACITY, OVERLAP_MS } from "../constants";

export const ARQOS_START    = 15500;
export const ARQOS_DURATION = 7500 + OVERLAP_MS; // 8100

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

// VR card: row 0, col 2 (LOCAL coordinates within the panel)
const VR_COL  = 2;
const VR_ROW  = 0;

const VR_LOCAL_LEFT = GRID_PADDING + VR_COL * (COL_W + GRID_GAP);
const VR_LOCAL_TOP  = NAV_H + CONTENT_PADDING + SECTION_HEADER_H + VR_ROW * (CARD_H + GRID_GAP) + GRID_GAP;

const VR_LOCAL_CX = VR_LOCAL_LEFT + COL_W / 2;
const VR_LOCAL_CY = VR_LOCAL_TOP  + CARD_H / 2;

const ZOOM_TARGET = 3.0;
const ZOOM_TX = PANEL_W / 2 - VR_LOCAL_CX * ZOOM_TARGET;
const ZOOM_TY = PANEL_H / 2 - VR_LOCAL_CY * ZOOM_TARGET;

// Beat timings (scene-local ms, +OVERLAP_MS already applied)
const DASH_POP_START   = 0 + OVERLAP_MS,    DASH_POP_END   = 600 + OVERLAP_MS;
const ZOOM_START       = 2000 + OVERLAP_MS, ZOOM_END       = 4000 + OVERLAP_MS;
const MORPH_START      = 4000 + OVERLAP_MS, MORPH_END      = 5200 + OVERLAP_MS;
const BG_FADE_START    = 5200 + OVERLAP_MS, BG_FADE_END    = 6400 + OVERLAP_MS;
const DASH_OUT_START   = 5400 + OVERLAP_MS, DASH_OUT_END   = 6200 + OVERLAP_MS;
const LOCKUP_START     = 6000 + OVERLAP_MS, LOCKUP_END     = 7200 + OVERLAP_MS;

// Agent cards
const agentCards = [
  { icon: "≡",  name: "GL Reconciler",       desc: "Finds breaks, traces root cause, routes for sign-off.",                       runs: "147", status: "Running",      statusColor: "#2C8A4A", active: false, empty: false, badge: null },
  { icon: "◎",  name: "KYC Screener",         desc: "Parses onboarding docs, runs the rules engine, flags gaps.",                   runs: "23",  status: "Idle",         statusColor: "#9A9080", active: false, empty: false, badge: null },
  { icon: "Σ",  name: "Valuation Reviewer",   desc: "Ingests GP packages, runs the valuation template, stages LP reporting.",       runs: "8",   status: "Open agent →", statusColor: "#D87757", active: true,  empty: false, badge: "Q1 CLOSE READY" },
  { icon: "◷",  name: "Month-End Closer",     desc: "Accruals, roll-forwards, variance commentary.",                                runs: "12",  status: "Running",      statusColor: "#2C8A4A", active: false, empty: false, badge: null },
  { icon: "☐",  name: "Statement Auditor",    desc: "Audits pre-generated LP statements before distribution.",                     runs: "31",  status: "Idle",         statusColor: "#9A9080", active: false, empty: false, badge: null },
  { icon: null, name: null,                   desc: "Deploy a new agent\nfrom template",                                            runs: null,  status: null,           statusColor: null,      active: false, empty: true,  badge: null },
];

export function ArqosDashboard(): React.ReactElement {
  return (
    <Timegroup
      mode="fixed"
      duration={`${ARQOS_DURATION}ms`}
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0, width: 1920, height: 1080, overflow: "hidden" }}
    >
      <TraceLayer sceneStartMs={ARQOS_START - OVERLAP_MS} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* ORANGE BG — matches ManagedAgents exactly, persists uninterrupted across the cut,
          then fades out during the card-to-cream transition */}
      {!TRACE_MODE && (
        <div
          style={{
            position: "absolute", inset: 0,
            background: "#D87757",
            zIndex: 1,
            animation: `orange-bg-fade-out ${BG_FADE_END - BG_FADE_START}ms ${BG_FADE_START}ms cubic-bezier(0.45,0,0.55,1) forwards`,
          }}
        />
      )}

      {/* OUTRO BG — fades in as orange fades out → final lockup background. Pure WHITE
          (#FFFFFF), not beige — matches the near-white card face that expands into it. */}
      {!TRACE_MODE && (
        <div
          style={{
            position: "absolute", inset: 0,
            background: "#FFFFFF",
            zIndex: 2,
            animation: `cream-bg-fade-in ${BG_FADE_END - BG_FADE_START}ms ${BG_FADE_START}ms cubic-bezier(0.45,0,0.55,1) both`,
          }}
        />
      )}

      {/* DASHBOARD CARD — centered */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          zIndex: 3,
          width: PANEL_W,
          height: PANEL_H,
          overflow: "visible",
          animation: [
            `dash-pop-in ${DASH_POP_END - DASH_POP_START}ms ${DASH_POP_START}ms cubic-bezier(0.33,1,0.68,1) both`,
            `dash-fade-out ${DASH_OUT_END - DASH_OUT_START}ms ${DASH_OUT_START}ms cubic-bezier(0.32,0,0.67,0) forwards`,
          ].join(", "),
        }}
      >
        {/* Zoom container */}
        <div
          style={
            {
              position: "absolute",
              inset: 0,
              transformOrigin: "0 0",
              "--zoom-tx": `${ZOOM_TX}px`,
              "--zoom-ty": `${ZOOM_TY}px`,
              "--zoom-scale": ZOOM_TARGET,
              animation: `dash-zoom ${ZOOM_END - ZOOM_START}ms ${ZOOM_START}ms cubic-bezier(0.45,0,0.55,1) both`,
            } as React.CSSProperties
          }
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
                              <div
                                style={{
                                  position: "absolute", inset: 0,
                                  animation: `vr-orig-fade-out ${MORPH_END - MORPH_START}ms ${MORPH_START}ms cubic-bezier(0.45,0,0.55,1) forwards`,
                                }}
                              >
                                <div style={{ fontFamily: "'Newsreader', Georgia, serif", fontWeight: 500, fontSize: 18, color: "#1A1410", marginBottom: 6 }}>{card.name}</div>
                                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 12, color: "#6A6460", lineHeight: 1.4 }}>{card.desc}</div>
                              </div>
                              {/* Claude lockup INSIDE VR card — orange asterisk, dark Claude */}
                              <div
                                style={{
                                  position: "absolute", inset: 0,
                                  display: "flex", flexDirection: "row",
                                  alignItems: "center", justifyContent: "center",
                                  gap: 10,
                                  animation: `vr-claude-fade-in ${MORPH_END - MORPH_START}ms ${MORPH_START}ms cubic-bezier(0.45,0,0.55,1) both`,
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

      {/* Final Claude lockup — CREAM bg + ORANGE asterisk + BLACK "Claude", zIndex 20 above cream bg */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          zIndex: 20,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          animation: `claude-lockup-in ${LOCKUP_END - LOCKUP_START}ms ${LOCKUP_START}ms cubic-bezier(0.33,1,0.68,1) both`,
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

ArqosDashboard.duration = ARQOS_DURATION;
