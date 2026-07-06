import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import { PaperBackground } from "../components/PaperBackground";
import { Sfx } from "../components/Sfx";
import { Reveal } from "../components/Reveal";
import { claude } from "../brand";

/**
 * Scene 2 — Claude.ai Window with Security tab — v8 RETIMED
 *
 * v8 FIXES (Jeremy round):
 *   FIX 1 — Click at EXACTLY master 5.0s. Scene1 is 3800ms, so the click
 *           pulse fires at scene-local 1200ms (3800 + 1200 = 5000).
 *   FIX 2 — Scene held 3+ seconds dead after the click. Cut Scene2 from
 *           4.3s → 2.2s. Breakdown:
 *             0–400ms    window builds + sidebar cascade
 *             400–1200ms cursor enters + glides to Security row
 *             1200–1500ms click pulse (coral ring + row flash)
 *             1500–1800ms highlight settles + brief hold
 *             1800–2200ms cross-fade out
 *
 * Timing (v8, all scene-local — this scene's own `<Timegroup>` resets to 0):
 *   0.0–0.4s   Window fades up + 12px slide (compressed from 600ms)
 *   0.25–0.55s Sidebar items cascade (20ms stagger — see the per-item
 *              `enter` delay below, computed once from array index)
 *   0.55–0.95s "Security" row highlights (background fade + scaleX grow)
 *   0.40–1.20s Cursor drifts in to Security row tip-on-target
 *   1.20–1.50s Click pulse fires (coral ring + row brightness flash)
 *   1.50–1.80s Settle + hold
 *   1.80–2.20s Cross-fade out
 *
 * NOTE: the original per-frame version also added a ~2px idle sine wobble to
 * the cursor after it landed, plus a ~2px "press/release" bump exactly at
 * click time. Both are sub-pixel-scale details invisible at video playback
 * size; they're dropped here in favor of a single declarative slide-in
 * (`cursor-in` keyframe) rather than chaining several near-imperceptible
 * effects for a lot of extra keyframe complexity.
 */

type IconKind =
  | "plus"
  | "search"
  | "briefcase"
  | "chats"
  | "projects"
  | "artifacts"
  | "code"
  | "security"
  | "sidebar";

const Icon: React.FC<{ kind: IconKind; color: string; size?: number }> = ({
  kind,
  color,
  size = 22,
}) => {
  const sw = 1.7;
  if (kind === "plus")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14M5 12h14" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      </svg>
    );
  if (kind === "search")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="6.5" stroke={color} strokeWidth={sw} />
        <path d="m20 20-3.5-3.5" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      </svg>
    );
  if (kind === "briefcase")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="3.5" y="7.5" width="17" height="12" rx="1.6" stroke={color} strokeWidth={sw} />
        <path d="M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5" stroke={color} strokeWidth={sw} />
      </svg>
    );
  if (kind === "chats")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M5 6.5A2.5 2.5 0 0 1 7.5 4h6A2.5 2.5 0 0 1 16 6.5v4A2.5 2.5 0 0 1 13.5 13H10l-3 3v-3h-.5A1.5 1.5 0 0 1 5 11.5v-5Z"
          stroke={color}
          strokeWidth={sw}
        />
      </svg>
    );
  if (kind === "projects")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M3.5 7.5h6l2 2H20a1 1 0 0 1 1 1V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8.5a1 1 0 0 1 .5-1Z"
          stroke={color}
          strokeWidth={sw}
        />
      </svg>
    );
  if (kind === "artifacts")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="7" cy="12" r="4" stroke={color} strokeWidth={sw} />
        <circle cx="17" cy="12" r="4" stroke={color} strokeWidth={sw} />
        <path d="M11 12h2" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      </svg>
    );
  if (kind === "code")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="m8 8-4 4 4 4M16 8l4 4-4 4M14 6l-4 12"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  if (kind === "security")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3.5 5 6v6c0 4.2 2.9 7.7 7 8.5 4.1-.8 7-4.3 7-8.5V6l-7-2.5Z"
          stroke={color}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
        <circle cx="11.5" cy="11.5" r="2.4" stroke={color} strokeWidth={sw} />
        <path d="m13.3 13.3 1.7 1.7" stroke={color} strokeWidth={sw} strokeLinecap="round" />
      </svg>
    );
  if (kind === "sidebar")
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="3.5" y="4.5" width="17" height="15" rx="2" stroke={color} strokeWidth={sw} />
        <path d="M9.5 4.5v15" stroke={color} strokeWidth={sw} />
      </svg>
    );
  return null;
};

/**
 * v6 FIX 3 — Claude reference cursor.
 *
 * The peg (CLAUDE/Screenshot 2026-05-23 085558.png) shows a flat outlined
 * pointing hand: white fill, dark #141413 stroke, no shadow, no gradient.
 * It's an index finger pointing UP, with the other 3 fingers tucked into a
 * fist below it, and a squared-off wrist/cuff base. ~32×40 px sized.
 *
 * Per REGRESSION-LEDGER rule #13: replicate the peg's cursor shape exactly.
 */
const HandCursor: React.FC = () => (
  <svg width={32} height={40} viewBox="0 0 32 40" fill="none">
    {/* Index finger + fist + cuff — single closed path */}
    <path
      d="M11.5 4
         C 11.5 2.6, 12.6 1.5, 14 1.5
         C 15.4 1.5, 16.5 2.6, 16.5 4
         L 16.5 17
         L 18.5 17
         C 19.6 17, 20.5 17.9, 20.5 19
         L 20.5 19.5
         L 22.5 19.5
         C 23.6 19.5, 24.5 20.4, 24.5 21.5
         L 24.5 22
         L 26 22
         C 27 22, 27.8 22.8, 27.8 23.8
         L 27.8 30
         C 27.8 33.6, 24.9 36.5, 21.3 36.5
         L 14 36.5
         C 10.4 36.5, 7.5 33.6, 7.5 30
         L 7.5 23
         C 7.5 21.6, 8.6 20.5, 10 20.5
         L 11.5 20.5
         Z"
      fill="#FAF9F5"
      stroke="#141413"
      strokeWidth={1.5}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);

const SIDEBAR_TOP: { label: string; icon: IconKind }[] = [
  { label: "New chat", icon: "plus" },
  { label: "Search", icon: "search" },
  { label: "Customize", icon: "briefcase" },
];
const SIDEBAR_NAV: { label: string; icon: IconKind }[] = [
  { label: "Chats", icon: "chats" },
  { label: "Projects", icon: "projects" },
  { label: "Artifacts", icon: "artifacts" },
  { label: "Code", icon: "code" },
  { label: "Security", icon: "security" },
];

// Sidebar cascade: 250ms start, 20ms stagger, 200ms ease — computed once per
// item index (priority-2 stagger), not recomputed every frame.
const SIDEBAR_STAGGER_START_MS = 250;
const SIDEBAR_STAGGER_MS = 20;
const SIDEBAR_ITEM_DURATION_MS = 200;

export const Scene2_ClaudeWindow: React.FC = () => {
  // Sidebar item index -> ref index mapping
  const SECURITY_INDEX = SIDEBAR_TOP.length + SIDEBAR_NAV.findIndex((x) => x.label === "Security");

  return (
    <Timegroup mode="fixed" duration="2.2s" className="absolute inset-0">
      <PaperBackground />
      <Sfx cue="reveal" at={0.1} dur={0.8} volume={0.06} />
      <Sfx cue="plop" at={1.2} dur={0.3} volume={0.05} />
      {/* Cursor click on the Security row — fires at EXACTLY master 5.0s.
          Scene1 is 3800ms, so scene-local offset is 1200ms (3800 + 1200 = 5000). */}
      <Audio
        src="/assets/click-hd-loud.mp3"
        offset="1.2s"
        duration="1.5s"
        volume={0.45}
      />

      {/* Center container — flex centers the window in the 1920×1080 viewport. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "wrap-fade-out 400ms 1800ms cubic-bezier(0.33,1,0.68,1) forwards",
        }}
      >
        <Reveal
          enter={[0, 400]}
          y={12}
          style={{
            width: 1520,
            height: 860,
            background: claude.bg.card,
            border: `1px solid ${claude.fg.rule}`,
            borderRadius: 18,
            overflow: "hidden",
            display: "flex",
          }}
        >
          {/* Sidebar */}
          <div
            style={{
              width: 340,
              height: "100%",
              background: claude.bg.paper,
              borderRight: `1px solid ${claude.fg.rule}`,
              padding: "30px 18px 24px 26px",
              position: "relative",
            }}
          >
            {/* Wordmark + sidebar toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 30,
              }}
            >
              <div
                style={{
                  fontFamily: claude.fonts.display,
                  fontWeight: 500,
                  fontSize: 26,
                  color: claude.fg.primary,
                  letterSpacing: "-0.01em",
                }}
              >
                Claude
              </div>
              <Icon kind="sidebar" color={claude.fg.secondary} size={20} />
            </div>

            {/* Top group */}
            {SIDEBAR_TOP.map((item, i) => (
              <Reveal
                key={`t-${i}`}
                enter={[
                  SIDEBAR_STAGGER_START_MS + i * SIDEBAR_STAGGER_MS,
                  SIDEBAR_STAGGER_START_MS + i * SIDEBAR_STAGGER_MS + SIDEBAR_ITEM_DURATION_MS,
                ]}
                x={-6}
                y={0}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  height: 40,
                  padding: "0 10px",
                  borderRadius: 8,
                  color: claude.fg.primary,
                  fontFamily: claude.fonts.body,
                  fontSize: 17,
                  fontWeight: 400,
                }}
              >
                <Icon kind={item.icon} color={claude.fg.primary} />
                <span>{item.label}</span>
              </Reveal>
            ))}

            <div style={{ height: 22 }} />

            {/* Nav group */}
            {SIDEBAR_NAV.map((item, i) => {
              const refIdx = SIDEBAR_TOP.length + i;
              const isHighlight = item.label === "Security";
              return (
                <Reveal
                  key={`n-${i}`}
                  enter={[
                    SIDEBAR_STAGGER_START_MS + refIdx * SIDEBAR_STAGGER_MS,
                    SIDEBAR_STAGGER_START_MS + refIdx * SIDEBAR_STAGGER_MS + SIDEBAR_ITEM_DURATION_MS,
                  ]}
                  x={-6}
                  y={0}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    height: 40,
                    padding: "0 10px",
                    borderRadius: 8,
                    color: claude.fg.primary,
                    fontFamily: claude.fonts.body,
                    fontSize: 17,
                    fontWeight: 400,
                  }}
                >
                  {isHighlight && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: claude.bg.lightGray,
                        borderRadius: 8,
                        transformOrigin: "left center",
                        zIndex: 0,
                        animation: "row-highlight-in 400ms 550ms cubic-bezier(0.33,1,0.68,1) backwards",
                      }}
                    >
                      {/* brightness flash overlay, timed to the click at scene-local 1200ms */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: 8,
                          background: "#FFFFFF",
                          animation: "row-highlight-flash 200ms 1200ms cubic-bezier(0.33,1,0.68,1) both",
                        }}
                      />
                    </div>
                  )}
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      zIndex: 1,
                    }}
                  >
                    <Icon kind={item.icon} color={claude.fg.primary} />
                    <span>{item.label}</span>
                  </div>
                </Reveal>
              );
            })}

            {/*
              v6 FIX 4: click pulse ring — coral, behind the cursor,
              centered on the Security row's vertical middle. The cursor's
              fingertip lands here at click time (scene-local 1200ms).
              Security row top: 30 + 60 + 30 + SECURITY_INDEX * 40 + 22
              Row middle: + 20
            */}
            <div
              style={{
                position: "absolute",
                left: 160 - 24,
                top: 30 + 60 + 30 + SECURITY_INDEX * 40 + 22 + 20 - 24,
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: `2px solid ${claude.accent.coral}`,
                zIndex: 4,
                pointerEvents: "none",
                animation: "click-pulse 300ms 1200ms cubic-bezier(0.33,1,0.68,1) both",
              }}
            />
            {/*
              v6 FIX 4: cursor — fingertip lands ON the Security row center.
              At resting position the SVG is offset so the tip (y=1.5 in the
              32×40 viewBox) sits at the row's vertical midpoint.
              Cursor visual offset: tip is 1.5px from top → top = rowMid - 1.5.
              Horizontal: tip is at x≈14, so left = pulseCenter - 14.
            */}
            <div
              style={{
                position: "absolute",
                left: 160 - 14,
                top: 30 + 60 + 30 + SECURITY_INDEX * 40 + 22 + 20 - 1.5,
                zIndex: 5,
                animation: "cursor-in 800ms 400ms cubic-bezier(0.33,1,0.68,1) backwards",
              }}
            >
              <HandCursor />
            </div>
          </div>

          {/* Main canvas — peg shows an "Evening, Sarah" greeting card.
              We'll show a quiet "Acme Co." pill + greeting + input field. */}
          <div
            style={{
              flex: 1,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px 80px",
            }}
          >
            {/* Acme Co. pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                background: claude.bg.lightGray,
                borderRadius: 999,
                fontFamily: claude.fonts.body,
                fontSize: 14,
                color: claude.fg.secondary,
                marginBottom: 22,
              }}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <path d="M4 20V8l8-4 8 4v12" stroke={claude.fg.secondary} strokeWidth={1.8} />
                <path d="M10 20v-6h4v6" stroke={claude.fg.secondary} strokeWidth={1.8} />
              </svg>
              Acme Co.
            </div>

            {/* Greeting */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                marginBottom: 30,
              }}
            >
              {/* v6 FIX 6: asymmetric 14-spoke Anthropic burst */}
              <svg width={42} height={42} viewBox="0 0 60 60">
                {[24, 22, 24, 21, 24, 23, 24, 22, 24, 21, 24, 23, 24, 22].map((len, i) => {
                  const a = (i * 360) / 14;
                  return (
                    <rect
                      key={i}
                      x={29.25}
                      y={30 - len}
                      width={1.5}
                      height={len}
                      rx={0.75}
                      fill={claude.accent.coral}
                      transform={`rotate(${a} 30 30)`}
                    />
                  );
                })}
              </svg>
              <div
                style={{
                  fontFamily: claude.fonts.display,
                  fontWeight: 400,
                  fontSize: 52,
                  color: claude.fg.primary,
                  letterSpacing: "-0.01em",
                }}
              >
                Evening, Sarah
              </div>
            </div>

            {/* Input */}
            <div
              style={{
                width: "100%",
                maxWidth: 760,
                height: 140,
                border: `1px solid ${claude.fg.rule}`,
                borderRadius: 16,
                padding: "18px 22px",
                background: claude.bg.card,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontFamily: claude.fonts.body,
                  fontSize: 18,
                  color: claude.fg.tertiary,
                }}
              >
                Ask anything or type / for commands
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Icon kind="plus" color={claude.fg.secondary} size={20} />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontFamily: claude.fonts.body,
                    fontSize: 14,
                    color: claude.fg.secondary,
                  }}
                >
                  <span>Opus 4.7</span>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      background: claude.accent.coral,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                      <path d="M12 19V5M5 12l7-7 7 7" stroke="#FAF9F5" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Timegroup>
  );
};

export default Scene2_ClaudeWindow;
