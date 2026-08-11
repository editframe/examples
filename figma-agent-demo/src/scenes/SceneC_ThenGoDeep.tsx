import React, { useCallback, useRef } from "react";
import { Timegroup, Audio } from "@editframe/react";
import { Reveal } from "@shared/components/Reveal";
import { Sfx } from "../components/Sfx";
import { typewriter } from "@shared/utils/animation";

/**
 * SceneC — "Then go deep" hero (5.8s).
 *
 * Direct peg replica:
 *   PEG-091344: white background, large headline "Then go deep" upper-left,
 *               a blue Bookworm pill chat message right-center, a gray
 *               speech bubble below ("I'm trying to retain new users.
 *               How should I"), avatar circle bottom-right.
 *
 * Motion plan:
 *   0–0.7s   headline reveal (translateY 20 → 0, opacity 0→1)
 *   0.8–1.3s Bookworm pill flies in from right (translateX 60 → 0)
 *   1.4–1.8s gray chat input box fades in, then types
 *   5.1–5.8s gentle camera push (1.0 → 1.06)
 *   5.5–5.8s fade to dark (#1E1E1E) for SceneD
 *
 * All of this is fully declarative CSS except the chat-input typewriter text,
 * which is kept as a small scene-scoped `addFrameTask` — CSS cannot mutate an
 * element's text content over time, so this one effect is genuinely
 * irreducible to CSS (see the `css-animations`/`composition` skills).
 */

const INTER: React.CSSProperties = {
  fontFamily:
    "'Inter', 'Plus Jakarta Sans', -apple-system, system-ui, sans-serif",
  fontFeatureSettings: "'cv11', 'ss01', 'ss03'",
};

const CHAT_TEXT = "I'm trying to retain new users. How should I structure the activation flow?";

export const SceneC_ThenGoDeep: React.FC = () => {
  const chatTextRef = useRef<HTMLSpanElement>(null);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;
      if (chatTextRef.current) {
        const t = typewriter(ms, 1800, 2900, CHAT_TEXT);
        if (chatTextRef.current.textContent !== t)
          chatTextRef.current.textContent = t;
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
      {/* Keyboard typing clatter under the chat-input typewriter (1.8–4.4s local). */}
      <Audio src="/figma-agent-demo/src/assets/sfx/keyboard-scenec.mp3" offset="1.8s" duration="2.6s" volume={0.28} />

      {/* Fade to dark for SceneD */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#1E1E1E",
          zIndex: 40,
          animation: "wash-in 300ms 5500ms cubic-bezier(0.33,1,0.68,1) both",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "50% 50%",
          animation: "scenec-camera 5800ms cubic-bezier(0.33,1,0.68,1) both",
        }}
      >
        {/* Headline */}
        <Reveal
          enter={[0, 700]}
          y={20}
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
          }}
        >
          Then go deep
        </Reveal>

        {/* Bookworm pill (right side, mid-upper) */}
        <Reveal
          enter={[800, 1300]}
          x={60}
          y={0}
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
            ...INTER,
            fontSize: 44,
            fontWeight: 600,
            letterSpacing: "-0.015em",
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
        </Reveal>

        {/* Chat INPUT box — clearly a text-input field so the viewer reads it
            as "user is typing" not "AI replied". Full-width across bottom,
            white pill with subtle border + paper-plane send button. */}
        <Reveal
          enter={[1400, 1800]}
          y={12}
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
            ...INTER,
            fontSize: 36,
            fontWeight: 400,
            letterSpacing: "-0.012em",
            lineHeight: 1.3,
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
        </Reveal>
      </div>
    </Timegroup>
  );
};

export default SceneC_ThenGoDeep;
