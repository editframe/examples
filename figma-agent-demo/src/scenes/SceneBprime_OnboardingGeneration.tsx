import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { Reveal } from "../components/Reveal";
import { Sfx } from "../components/Sfx";

/**
 * SceneBprime — Figma generating the onboarding flow (5.5s).
 *
 * USE-CASE PAYOFF for SceneB's prompt: "Hey Figma, can you create different
 * layouts for this onboarding flow?" — this scene shows the result.
 *
 * Pegs that anchor this scene:
 *   PEG-091322: green-tinted Bookworm phone mockups — "Reading streak",
 *               "Book details", "For you", "Current reads" headers, lime/
 *               green palette, rounded screen mockups on lavender canvas.
 *   PEG-091330: a wide canvas with MULTIPLE phone mockups arranged in a
 *               grid — alternate-color cursors with name pills (Julia/Jack)
 *               browsing the variations.
 *
 * Composition:
 *   - Lavender canvas #B7C3CC (matches SceneA + SceneB).
 *   - 4 phone mockups arranged horizontally, each ~280×580px, gaps 50px.
 *     Total row width ≈ 4*280 + 3*50 = 1270px, centered horizontally.
 *   - Each mockup represents one step of an onboarding flow:
 *       1. "Welcome"          — hero illustration + Get started CTA
 *       2. "Choose topics"    — chip grid (3 selected)
 *       3. "Set preferences"  — toggle list
 *       4. "You're in"        — confetti + Open app CTA
 *   - Floating pill in upper-left: "Figma is creating onboarding flow…"
 *     with sparkle icon + animated dots.
 *   - Thin connecting arrow lines BETWEEN mockups appear after each pair lands.
 *   - Subtle camera pan left → right showing each mockup as it generates.
 *
 * Motion timeline:
 *   0.0–0.6s   lavender canvas + status pill fade in
 *   0.6–1.2s   mockup 1 generates  (skeleton → fill, scale 0.92 → 1)
 *   1.4–2.0s   mockup 2 generates
 *   2.2–2.8s   mockup 3 generates
 *   3.0–3.6s   mockup 4 generates
 *   3.8–4.4s   connecting arrows fade in between all mockups
 *   4.4–5.2s   gentle exhale; camera holds
 *   5.2–5.5s   white wash to SceneC
 *
 * Camera magnitudes:
 *   0.0–0.8s   scale 1.08, tx=+360  (framed on mockup 1)
 *   0.8–1.6s   pan to mockup 2      (tx=+120)
 *   1.6–2.4s   pan to mockup 3      (tx=-120)
 *   2.4–3.2s   pan to mockup 4      (tx=-360)
 *   3.2–4.4s   pull back wide       (scale 1.0, tx=0)
 *   4.4–5.5s   hold wide
 *
 * Fully declarative — the only text-content mutation left (the animated
 * "…" status dots) is a small scene-scoped `addFrameTask`, since CSS cannot
 * change an element's text over time. Everything else (camera, mockup +
 * arrow stagger, status pill reveal, transition wash) is CSS.
 */

const INTER: React.CSSProperties = {
  fontFamily:
    "'Inter', 'Plus Jakarta Sans', -apple-system, system-ui, sans-serif",
  fontFeatureSettings: "'cv11', 'ss01', 'ss03'",
};

// Mockup config — each step gets its own visual + its own stagger delay.
const STEPS = [
  { title: "Welcome", accent: "#0ACF83", appearAt: 600 },
  { title: "Choose topics", accent: "#A259FF", appearAt: 1400 },
  { title: "Set preferences", accent: "#1ABCFE", appearAt: 2200 },
  { title: "You're in", accent: "#FF7262", appearAt: 3000 },
];

// Connecting arrows between consecutive mockups — index-based stagger.
const ARROW_STAGGER = 120;
const ARROW_START = 3800;
const ARROW_DUR = 300;

export const SceneBprime_OnboardingGeneration: React.FC = () => {
  const statusDotsRef = useRef<HTMLSpanElement>(null);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;
      // Animated dots in the status pill: "." "‥" "…" loop
      if (statusDotsRef.current) {
        const frame = Math.floor(ms / 320) % 4;
        const dots = ["", ".", "..", "..."][frame];
        if (statusDotsRef.current.textContent !== dots)
          statusDotsRef.current.textContent = dots;
      }
    },
    []
  );

  // Phone mockup layout numbers (CSS coords inside camera rig).
  // 4 mockups, each 280 wide, 580 tall. Gap 50.
  // Row total: 4*280 + 3*50 = 1270. Center horizontally: (1920-1270)/2 = 325.
  const MOCKUP_W = 280;
  const MOCKUP_H = 580;
  const GAP = 50;
  const ROW_LEFT = 325;
  const ROW_TOP = (1080 - MOCKUP_H) / 2 + 30; // slight lower bias

  return (
    <Timegroup
      mode="fixed"
      duration="5.5s"
      onFrame={handleFrame as any}
      className="absolute inset-0"
    >
      {/* Lavender canvas */}
      <div style={{ position: "absolute", inset: 0, background: "#B7C3CC" }} />

      <Sfx cue="reveal" at={0.0} dur={0.6} volume={0.32} />
      <Sfx cue="pop" at={0.65} dur={0.35} volume={0.26} />
      <Sfx cue="pop" at={1.45} dur={0.35} volume={0.26} />
      <Sfx cue="pop" at={2.25} dur={0.35} volume={0.26} />
      <Sfx cue="pop" at={3.05} dur={0.35} volume={0.26} />
      <Sfx cue="confirm" at={4.0} dur={0.5} volume={0.26} />

      {/* White wash out */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#FFFFFF",
          zIndex: 40,
          animation: "wash-in 300ms 5200ms cubic-bezier(0.33,1,0.68,1) both",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "50% 50%",
          animation: "sceneb-prime-camera 5500ms cubic-bezier(0.65,0,0.35,1) both",
        }}
      >
        {/* ===== STATUS PILL (upper-left) ===== */}
        <Reveal
          enter={[100, 600]}
          y={-8}
          style={{
            position: "absolute",
            left: 80,
            top: 80,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 22px",
            background: "rgba(255,255,255,0.92)",
            borderRadius: 999,
            boxShadow:
              "0 12px 28px rgba(20,24,36,0.14), 0 0 0 1px rgba(255,255,255,0.5)",
            ...INTER,
            zIndex: 5,
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Sparkle icon */}
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "#0D99FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3 L13.5 9.5 L20 11 L13.5 12.5 L12 19 L10.5 12.5 L4 11 L10.5 9.5 Z"
                fill="#FFFFFF"
              />
            </svg>
          </div>
          <span
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: "#1E1E1E",
              letterSpacing: "-0.005em",
            }}
          >
            Figma is creating onboarding flow
            <span
              ref={statusDotsRef}
              style={{ display: "inline-block", width: 24, textAlign: "left" }}
            ></span>
          </span>
        </Reveal>

        {/* ===== ARROWS connecting mockups ===== */}
        {[0, 1, 2].map((i) => {
          const x =
            ROW_LEFT + (i + 1) * MOCKUP_W + i * GAP + GAP / 2 - 18;
          const y = ROW_TOP + MOCKUP_H / 2;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y - 4,
                width: 36,
                height: 8,
                zIndex: 3,
                opacity: 0.8,
              }}
            >
              <Reveal
                enter={[ARROW_START + i * ARROW_STAGGER, ARROW_START + i * ARROW_STAGGER + ARROW_DUR]}
                y={0}
              >
                <svg width="36" height="8" viewBox="0 0 36 8" fill="none">
                  <path
                    d="M0 4 H30"
                    stroke="#1E1E1E"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M28 1 L32 4 L28 7"
                    stroke="#1E1E1E"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </Reveal>
            </div>
          );
        })}

        {/* ===== MOCKUPS ===== */}
        {STEPS.map((step, i) => {
          const left = ROW_LEFT + i * (MOCKUP_W + GAP);
          return (
            <Reveal
              key={step.title}
              enter={[step.appearAt, step.appearAt + 500]}
              y={20}
              scaleFrom={0.92}
              easeIn="out-back"
              style={{
                position: "absolute",
                left,
                top: ROW_TOP,
                width: MOCKUP_W,
                height: MOCKUP_H,
                background: "#FFFFFF",
                borderRadius: 32,
                boxShadow:
                  "0 0 0 1px #E5E5E5, 0 22px 50px rgba(0,0,0,0.10)",
                overflow: "hidden",
                ...INTER,
                zIndex: 4,
              }}
            >
              <OnboardingScreen step={step} index={i} />
            </Reveal>
          );
        })}
      </div>
    </Timegroup>
  );
};

/* ===== Per-step screen content ===== */
const OnboardingScreen: React.FC<{
  step: typeof STEPS[number];
  index: number;
}> = ({ step, index }) => {
  // iOS status bar
  const StatusBar = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "14px 22px 4px",
        color: "#1E1E1E",
        fontWeight: 600,
        fontSize: 12,
      }}
    >
      <span>9:41</span>
      <span style={{ letterSpacing: 1 }}>●●●</span>
    </div>
  );

  const accent = step.accent;
  const tintBg = accent + "1A"; // ~10% alpha hex appended

  if (index === 0) {
    // WELCOME — hero panel + Get started
    return (
      <>
        <StatusBar />
        <div style={{ padding: "20px 22px 0" }}>
          <div
            style={{
              height: 220,
              borderRadius: 14,
              background: tintBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* book stack illustration */}
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <rect
                x="22"
                y="30"
                width="76"
                height="14"
                rx="3"
                fill={accent}
              />
              <rect
                x="30"
                y="48"
                width="60"
                height="14"
                rx="3"
                fill={accent}
                opacity="0.55"
              />
              <rect
                x="18"
                y="66"
                width="84"
                height="14"
                rx="3"
                fill={accent}
                opacity="0.35"
              />
              <rect
                x="34"
                y="84"
                width="52"
                height="14"
                rx="3"
                fill={accent}
                opacity="0.7"
              />
            </svg>
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#1E1E1E",
              marginTop: 22,
              letterSpacing: "-0.02em",
            }}
          >
            Welcome to Bookworm
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#5A5A5A",
              marginTop: 6,
              lineHeight: 1.4,
            }}
          >
            Track what you read, find your next book, and join book clubs near
            you.
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 22,
            right: 22,
            padding: "14px 0",
            background: accent,
            color: "#FFFFFF",
            borderRadius: 999,
            textAlign: "center",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Get started
        </div>
      </>
    );
  }

  if (index === 1) {
    // CHOOSE TOPICS — chip grid
    const topics = [
      ["Fiction", true],
      ["Non-fiction", false],
      ["Mystery", true],
      ["Sci-Fi", false],
      ["Biography", true],
      ["Poetry", false],
      ["History", false],
      ["Romance", false],
      ["Self-help", false],
    ] as const;
    return (
      <>
        <StatusBar />
        <div style={{ padding: "16px 22px 0" }}>
          <div
            style={{
              fontSize: 12,
              color: "#9A9A9A",
              fontWeight: 600,
              letterSpacing: 0.4,
              textTransform: "uppercase",
            }}
          >
            Step 2 of 4
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#1E1E1E",
              marginTop: 4,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            Choose your topics
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 22,
            }}
          >
            {topics.map(([t, sel]) => (
              <div
                key={t}
                style={{
                  padding: "8px 14px",
                  borderRadius: 999,
                  background: sel ? accent : "#F5F5F5",
                  color: sel ? "#FFFFFF" : "#1E1E1E",
                  fontWeight: 600,
                  fontSize: 12,
                  border: sel ? "none" : "1px solid #E5E5E5",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 22,
            right: 22,
            padding: "14px 0",
            background: accent,
            color: "#FFFFFF",
            borderRadius: 999,
            textAlign: "center",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Continue
        </div>
      </>
    );
  }

  if (index === 2) {
    // SET PREFERENCES — toggle list
    const prefs = [
      ["Daily reading reminders", true],
      ["Weekly recap email", true],
      ["Book club invites", false],
      ["New release alerts", true],
    ] as const;
    return (
      <>
        <StatusBar />
        <div style={{ padding: "16px 22px 0" }}>
          <div
            style={{
              fontSize: 12,
              color: "#9A9A9A",
              fontWeight: 600,
              letterSpacing: 0.4,
              textTransform: "uppercase",
            }}
          >
            Step 3 of 4
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#1E1E1E",
              marginTop: 4,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            Set your preferences
          </div>
          <div
            style={{
              marginTop: 22,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {prefs.map(([label, on]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: "1px solid #F0F0F0",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    color: "#1E1E1E",
                    fontWeight: 500,
                  }}
                >
                  {label}
                </span>
                <div
                  style={{
                    width: 36,
                    height: 22,
                    borderRadius: 999,
                    background: on ? accent : "#E5E5E5",
                    position: "relative",
                    transition: "background 200ms ease",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 2,
                      left: on ? 16 : 2,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#FFFFFF",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 22,
            right: 22,
            padding: "14px 0",
            background: accent,
            color: "#FFFFFF",
            borderRadius: 999,
            textAlign: "center",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Continue
        </div>
      </>
    );
  }

  // index === 3 — YOU'RE IN — confetti + Open app
  return (
    <>
      <StatusBar />
      <div
        style={{
          padding: "20px 22px 0",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            marginTop: 50,
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: tintBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* confetti */}
          {[
            [-46, -20, "#0ACF83"],
            [-30, -52, "#A259FF"],
            [20, -58, "#1ABCFE"],
            [52, -22, "#F24E1E"],
            [50, 22, "#0D99FF"],
            [-50, 18, "#FF7262"],
          ].map(([dx, dy, c], i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `calc(50% + ${dx}px)`,
                top: `calc(50% + ${dy}px)`,
                width: 8,
                height: 8,
                borderRadius: 2,
                background: c as string,
                transform: `rotate(${i * 35}deg)`,
              }}
            />
          ))}
          {/* checkmark */}
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12 L10 17 L19 7"
              stroke={accent}
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#1E1E1E",
            marginTop: 28,
            letterSpacing: "-0.02em",
          }}
        >
          You're all set
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#5A5A5A",
            marginTop: 8,
            lineHeight: 1.4,
            maxWidth: 220,
          }}
        >
          Your personalized library is ready. Let's find your next great read.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 22,
          right: 22,
          padding: "14px 0",
          background: accent,
          color: "#FFFFFF",
          borderRadius: 999,
          textAlign: "center",
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        Open Bookworm
      </div>
    </>
  );
};

export default SceneBprime_OnboardingGeneration;
