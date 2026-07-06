import React, { useCallback, useRef } from "react";
import { Timegroup, Audio } from "@editframe/react";
import { Reveal } from "../components/Reveal";
import { Sfx } from "../components/Sfx";
import { clamp, lerp, typewriter } from "../components/helpers";

/**
 * SceneB — Agent prompt close-up (6s).
 *
 * Direct peg replica:
 *   PEG-091314: hero close-up of agent prompt box. Sparkle icon (blue rounded
 *               square) to the left, prompt box white rounded-rect, text:
 *               "Hey Figma, can you create different layouts for |"
 *               Book icon + sliders + blue arrow-up button at bottom,
 *               black cursor lower-right outside the box.
 *
 * Reference video echo (f_55): the prompt box fills ~60% of the frame width
 * and is centered. The lavender canvas extends edge-to-edge.
 *
 * Motion plan:
 *   0–0.4s   prompt + sparkle scale-in (0.92 → 1, opacity 0 → 1)
 *   0.4–4.2s typewriter "Hey Figma, can you create different layouts for"
 *   3.6–4.0s cursor enters from lower-right, lands on submit button
 *   4.0–4.3s cursor click bump (submit button)
 *   4.3–4.8s prompt scale-out, sparkle exits, white wash to next scene
 *
 * Camera magnitudes:
 *   0–4.5s   scale 1.0, static
 *   4.5–6s   scale 1.08, slight drift to suggest "submission released" beat
 *
 * Camera, spark icon, prompt box, and the transition wash are all fully
 * declarative CSS. The cursor sweep + click bump + submit-button squish stay
 * as a small scene-scoped `addFrameTask`, kept together (rather than split
 * into independent CSS keyframes) because they're all keyed off the exact
 * same click timestamp (4300ms) and re-deriving that coupling as separately
 * timed keyframes risks the click/squish/pulse drifting out of sync without
 * a render pass to verify — see REFACTOR-PATTERNS.md Part 2b, priority 5.
 * The prompt-text typewriter is also kept here since CSS cannot mutate text
 * content over time.
 *
 * Cursor target math (cursor TIP):
 *   Submit button center = (1240, 612) in 1920×1080 rig.
 *   Cursor SVG anchor is at top-left, TIP offset is ~(4, 2) from anchor.
 *   So cursor wrapper translate must be (1240 - 4, 612 - 2) = (1236, 610).
 */

const INTER: React.CSSProperties = {
  fontFamily:
    "'Inter', 'Plus Jakarta Sans', -apple-system, system-ui, sans-serif",
  fontFeatureSettings: "'cv11', 'ss01', 'ss03'",
};

const PROMPT_TEXT = "Hey Figma, can you create different layouts for this onboarding flow?";

// Submit button rendered position (matches the JSX layout below).
// Submit center: (410 + 1100 - 70, 380 + 320 - 60) = (1440, 640).
// Cursor TIP offset (4, 2) from SVG top-left.
const SUBMIT_CX = 1440;
const SUBMIT_CY = 640;
const TIP_DX = 4;
const TIP_DY = 2;

// Cursor enters from bottom-right corner, sweeps to submit button.
const cursorAt = (ms: number): { x: number; y: number; vis: boolean; click: number } => {
  if (ms < 3600) return { x: 2000, y: 1100, vis: false, click: 0 };
  if (ms < 4200) {
    // ease-in-out cubic sweep
    const t = clamp((ms - 3600) / 600);
    const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const x = lerp(2000, SUBMIT_CX - TIP_DX, e);
    const y = lerp(1100, SUBMIT_CY - TIP_DY, e);
    return { x, y, vis: true, click: 0 };
  }
  // Click + hold
  let click = 0;
  const cd = ms - 4300;
  if (cd >= 0 && cd <= 300) click = cd / 300;
  return {
    x: SUBMIT_CX - TIP_DX,
    y: SUBMIT_CY - TIP_DY,
    vis: true,
    click,
  };
};

export const SceneB_AgentPrompt: React.FC = () => {
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;

      // Typewriter (full text reveals around 3.4s, leaving time for cursor)
      if (textRef.current) {
        const t = typewriter(ms, 600, 2900, PROMPT_TEXT);
        if (textRef.current.textContent !== t) textRef.current.textContent = t;
      }

      // Cursor
      const c = cursorAt(ms);
      if (cursorRef.current) {
        cursorRef.current.style.opacity = c.vis ? "1" : "0";
        cursorRef.current.style.transform = `translate(${c.x}px, ${c.y}px)`;
      }
      if (submitRef.current) {
        const sb = clamp((ms - 4300) / 90) * clamp(1 - (ms - 4400) / 160);
        submitRef.current.style.transform = `scale(${1 - sb * 0.08})`;
      }
      if (pulseRef.current) {
        if (c.click > 0 && c.click < 1) {
          pulseRef.current.style.opacity = String(1 - c.click);
          const scale = 1 + c.click * 2.4;
          pulseRef.current.style.transform = `translate(${SUBMIT_CX - 18}px, ${SUBMIT_CY - 18}px) scale(${scale})`;
          pulseRef.current.style.transformOrigin = "18px 18px";
        } else {
          pulseRef.current.style.opacity = "0";
        }
      }
    },
    []
  );

  return (
    <Timegroup
      mode="fixed"
      duration="6s"
      onFrame={handleFrame as any}
      className="absolute inset-0"
    >
      {/* Lavender canvas — matches the prompt peg + reference video */}
      <div style={{ position: "absolute", inset: 0, background: "#B7C3CC" }} />

      <Sfx cue="plop" at={0.05} dur={0.4} volume={0.32} />
      <Sfx cue="ping" at={4.3} dur={0.5} volume={0.32} />
      <Sfx cue="reveal" at={5.7} dur={0.5} volume={0.32} />
      {/* Keyboard typing clatter under the prompt-text typewriter (0.6–3.7s local). */}
      <Audio src="/assets/sfx/keyboard-sceneb.mp3" offset="0.6s" duration="3.1s" volume={0.28} />

      {/* White wash out */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#FFFFFF",
          zIndex: 40,
          animation: "wash-in 300ms 5700ms cubic-bezier(0.33,1,0.68,1) both",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "50% 50%",
          animation: "sceneb-camera 6000ms cubic-bezier(0.33,1,0.68,1) both",
        }}
      >
        {/* Spark icon (peg-091314, blue rounded square with sparkle) */}
        <Reveal
          enter={[0, 500]}
          y={0}
          scaleFrom={0.85}
          easeIn="out-back"
          style={{
            position: "absolute",
            left: 250,
            top: 460,
            width: 96,
            height: 96,
            borderRadius: 22,
            background: "#0D99FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 14px 32px rgba(13,153,255,0.30)",
          }}
        >
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
            <path d="M12 3 L13.5 9.5 L20 11 L13.5 12.5 L12 19 L10.5 12.5 L4 11 L10.5 9.5 Z" fill="#FFFFFF" />
            <path d="M19 3 L19.7 5.3 L22 6 L19.7 6.7 L19 9 L18.3 6.7 L16 6 L18.3 5.3 Z" fill="#FFFFFF" />
          </svg>
        </Reveal>

        {/* Prompt box — centered via margin offsets (avoid calc() in transform).
            Shares the spark icon's outBack entrance easing/timing (both driven
            by the same `inP` ramp in the original per-frame version). */}
        <Reveal
          enter={[0, 500]}
          exit={[5400, 5800]}
          y={20}
          scaleFrom={0.96}
          easeIn="out-back"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            marginLeft: -550,
            marginTop: -160,
            width: 1100,
            background: "#FFFFFF",
            borderRadius: 28,
            padding: "44px 50px 32px",
            boxShadow:
              "0 30px 70px rgba(20, 24, 36, 0.18), 0 0 0 1px rgba(0,0,0,0.04)",
            ...INTER,
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontWeight: 400,
              color: "#1E1E1E",
              letterSpacing: "-0.015em",
              lineHeight: 1.25,
              minHeight: 150,
            }}
          >
            <span ref={textRef}></span>
            <span
              style={{
                display: "inline-block",
                width: 4,
                height: "1.0em",
                background: "#1E1E1E",
                verticalAlign: "text-bottom",
                marginLeft: 4,
              }}
            />
          </div>

          {/* Bottom row: book-check icon left, sliders + submit right */}
          <div
            style={{
              marginTop: 28,
              display: "flex",
              alignItems: "center",
              color: "#1E1E1E",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 4 H14 A4 4 0 0 1 18 8 V20 H8 A4 4 0 0 1 4 16 Z"
                stroke="#1E1E1E"
                strokeWidth="1.6"
                fill="none"
              />
              <path
                d="M14 14.5 L15.5 16 L18 13"
                stroke="#1E1E1E"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                gap: 24,
                alignItems: "center",
              }}
            >
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 8 H20 M4 16 H20"
                  stroke="#1E1E1E"
                  strokeWidth="1.6"
                />
                <circle cx="9" cy="8" r="2.4" fill="#1E1E1E" />
                <circle cx="15" cy="16" r="2.4" fill="#1E1E1E" />
              </svg>
              <div
                ref={submitRef}
                style={{
                  width: 56,
                  height: 56,
                  background: "#0D99FF",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  boxShadow: "0 6px 14px rgba(13,153,255,0.5)",
                  willChange: "transform",
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 4 V20 M12 4 L6 10 M12 4 L18 10"
                    stroke="#fff"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Cursor click pulse */}
        <div
          ref={pulseRef}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "3px solid #0D99FF",
            opacity: 0,
            zIndex: 9,
            pointerEvents: "none",
            boxShadow: "0 0 14px rgba(13,153,255,0.6)",
            willChange: "transform, opacity",
          }}
        />

        {/* Cursor — black with white outline, big */}
        <div
          ref={cursorRef}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 10,
            opacity: 0,
            willChange: "transform, opacity",
          }}
        >
          <svg
            width="44"
            height="50"
            viewBox="0 0 22 26"
            style={{
              display: "block",
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.30))",
            }}
          >
            <path
              d="M3 2 L3 20 L8 16 L11 22 L14 21 L11 15 L18 15 Z"
              fill="#1E1E1E"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </Timegroup>
  );
};

export default SceneB_AgentPrompt;
