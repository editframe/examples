import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import { Sfx } from "../components/Sfx";
import { clamp, lerp, track, typewriter } from "../components/helpers";

/**
 * SceneC — "Then go deep" hero (4.5s).
 *
 * Direct peg replica:
 *   PEG-091344: white background, large headline "Then go deep" upper-left,
 *               a blue Bookworm pill chat message right-center, a gray
 *               speech bubble below ("I'm trying to retain new users.
 *               How should I"), avatar circle bottom-right.
 *
 * Motion plan:
 *   0–0.6s   headline word-by-word reveal (translateY 20 → 0, opacity 0→1)
 *   0.8–1.2s Bookworm pill flies in from right (translateX 60 → 0)
 *   1.4–3.4s gray chat bubble fades in then types
 *   3.4–3.8s avatar pops in (scale 0.6 → 1, opacity 0→1)
 *   3.8–4.3s gentle camera push (1.0 → 1.06)
 *   4.2–4.5s fade to dark (#1E1E1E) for SceneD
 *
 * Camera magnitudes:
 *   1.0 baseline → 1.06 push, no translate
 */

const INTER: React.CSSProperties = {
  fontFamily:
    "'Inter', 'Plus Jakarta Sans', -apple-system, system-ui, sans-serif",
  fontFeatureSettings: "'cv11', 'ss01', 'ss03'",
};

const CHAT_TEXT = "I'm trying to retain new users. How should I structure the activation flow?";

export const SceneC_ThenGoDeep: React.FC = () => {
  const cameraRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const chatTextRef = useRef<HTMLSpanElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;

      // Camera push
      let s = 1.0;
      if (ms > 5100) s = lerp(1.0, 1.06, eases.outCubic(clamp((ms - 5100) / 700)));
      if (cameraRef.current)
        cameraRef.current.style.transform = `scale(${s})`;

      const hP = track(ms, 0, 700, eases.outCubic);
      if (headlineRef.current) {
        headlineRef.current.style.opacity = String(hP);
        headlineRef.current.style.transform = `translateY(${lerp(20, 0, hP)}px)`;
      }

      const pP = track(ms, 800, 1300, eases.outCubic);
      if (pillRef.current) {
        pillRef.current.style.opacity = String(pP);
        pillRef.current.style.transform = `translateX(${lerp(60, 0, pP)}px)`;
      }

      const bP = track(ms, 1400, 1800, eases.outCubic);
      if (bubbleRef.current) {
        bubbleRef.current.style.opacity = String(bP);
        bubbleRef.current.style.transform = `translateY(${lerp(12, 0, bP)}px)`;
      }
      if (chatTextRef.current) {
        // typewriter(ms, start, DURATION, text) — dur was wrongly set to the
        // END time (4400) which meant typing took 4400ms from 1800ms start
        // and never finished before the scene cut. Correct: dur=2900ms so
        // typing completes at ms=4700, well before fade at 5500.
        const t = typewriter(ms, 1800, 2900, CHAT_TEXT);
        if (chatTextRef.current.textContent !== t)
          chatTextRef.current.textContent = t;
      }

      // Fade to dark for SceneD
      if (fadeRef.current) {
        const f = track(ms, 5500, 5800, eases.outCubic);
        fadeRef.current.style.opacity = String(f);
      }
    },
    []
  );

  return (
    <Timegroup
      mode="fixed"
      duration="5.8s"
      onFrame={handleFrame as any}
      className="absolute inset-0"
    >
      <div style={{ position: "absolute", inset: 0, background: "#FFFFFF" }} />

      <Sfx cue="reveal" at={0.0} dur={0.7} volume={0.32} />
      <Sfx cue="pop" at={0.95} dur={0.4} volume={0.26} />
      <Sfx cue="plop" at={1.5} dur={0.4} volume={0.22} />

      <div
        ref={fadeRef}
        style={{
          position: "absolute",
          inset: 0,
          background: "#1E1E1E",
          opacity: 0,
          zIndex: 40,
        }}
      />

      <div
        ref={cameraRef}
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "50% 50%",
          willChange: "transform",
        }}
      >
        {/* Headline — moved down for better vertical balance, less top-heavy */}
        <div
          ref={headlineRef}
          style={{
            position: "absolute",
            left: 120,
            top: 420,
            color: "#1E1E1E",
            ...INTER,
            fontSize: 150,
            fontWeight: 600,
            letterSpacing: "-0.035em",
            lineHeight: 1.0,
            opacity: 0,
            willChange: "transform, opacity",
          }}
        >
          Then go deep
        </div>

        {/* Bookworm pill (right side, mid-upper) */}
        <div
          ref={pillRef}
          style={{
            position: "absolute",
            right: 220,
            top: 540,
            background: "#D9EBFB",
            color: "#0D99FF",
            padding: "20px 32px",
            borderRadius: 18,
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: 0,
            ...INTER,
            fontSize: 44,
            fontWeight: 600,
            letterSpacing: "-0.015em",
            willChange: "transform, opacity",
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 8 H21 M3 16 H21 M8 3 V21 M16 3 V21"
              stroke="#0D99FF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Bookworm
        </div>

        {/* Chat INPUT box — clearly a text-input field so the viewer reads it
            as "user is typing" not "AI replied". Full-width across bottom,
            white pill with subtle border + paper-plane send button. */}
        <div
          ref={bubbleRef}
          style={{
            position: "absolute",
            left: 220,
            right: 220,
            bottom: 240,
            background: "#FFFFFF",
            color: "#1E1E1E",
            padding: "26px 32px",
            borderRadius: 20,
            border: "2px solid #E5E5E5",
            boxShadow: "0 6px 24px rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 18,
            opacity: 0,
            ...INTER,
            fontSize: 36,
            fontWeight: 400,
            letterSpacing: "-0.012em",
            lineHeight: 1.3,
            willChange: "transform, opacity",
          }}
        >
          <span style={{ flex: 1 }}>
            <span ref={chatTextRef}></span>
            <span
              style={{
                display: "inline-block",
                width: 3,
                height: "1.05em",
                background: "#0D99FF",
                verticalAlign: "text-bottom",
                marginLeft: 3,
              }}
            />
          </span>
          {/* Send button — paper plane in Figma blue */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#0D99FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 11.5 L21 3 L13 21 L11 13 Z"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>
    </Timegroup>
  );
};

export default SceneC_ThenGoDeep;
