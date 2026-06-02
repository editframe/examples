/**
 * Scene 7 — Logo outro card
 * Master time: 12000–15500ms (duration 3500ms) — shifted -1500ms per FIX 2
 *
 * USER SAID:
 * - "Don't change the clerk logo or the clerk text on top; it's perfect."
 * - "The animation on ours just appears instantaneously. That line of the
 *   `npm install g_clerk` just appears instantaneously in the actual reference
 *   video. It gets typed out as a line."
 *
 * SPEC:
 * - Dark bg (#1A1A1F)
 * - Clerk logo (symbol SVG ~120px) + "clerk" wordmark (~120px) — centered horizontal lockup
 * - Logo fades in: translateY(12→0) + opacity over 500ms at 300ms
 * - Below lockup: `npm install -g clerk` in monospace
 *   - npm = cyan #22D3EE
 *   - " install -g clerk" = white #FFFFFF
 *   - Types out char-by-char at ~80ms/char starting at 1000ms (after logo fully visible)
 *   - Blinking white block cursor during typing, stays at end after done
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { track, blinkCursor } from "../components/helpers";

const SCENE_START = 12000;
const DURATION = 3500;

// Logo lockup fade-in
const LOGO_FADE_START = 300;
const LOGO_FADE_END = 800;

// npm command typewriter
const NPM_CMD = "npm install -g clerk";
const NPM_TYPE_START = 1000;
const MS_PER_CHAR = 80;
const NPM_TYPE_END = NPM_TYPE_START + NPM_CMD.length * MS_PER_CHAR;

// Clerk SVG symbol (inline, white version for dark bg)
// Using the actual clerk-symbol.svg paths, colorized for dark bg
const CLERK_SYMBOL_SVG = `<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M99.5716 10.788C101.571 12.1272 101.742 14.9444 100.04 16.646L85.4244 31.2618C84.1035 32.5828 82.0542 32.7914 80.3915 31.9397C75.4752 29.421 69.9035 28 64 28C44.1177 28 28 44.1177 28 64C28 69.9035 29.421 75.4752 31.9397 80.3915C32.7914 82.0542 32.5828 84.1035 31.2618 85.4244L16.646 100.04C14.9444 101.742 12.1272 101.571 10.788 99.5716C3.97411 89.3989 0 77.1635 0 64C0 28.6538 28.6538 0 64 0C77.1635 0 89.3989 3.97411 99.5716 10.788Z" fill="#BAB1FF"/>
  <path d="M84 64C84 75.0457 75.0457 84 64 84C52.9543 84 44 75.0457 44 64C44 52.9543 52.9543 44 64 44C75.0457 44 84 52.9543 84 64Z" fill="#6C47FF"/>
  <path d="M100.04 111.354C101.742 113.056 101.571 115.873 99.5717 117.212C89.3989 124.026 77.1636 128 64 128C50.8364 128 38.6011 124.026 28.4283 117.212C26.4289 115.873 26.2581 113.056 27.9597 111.354L42.5755 96.7382C43.8965 95.4172 45.9457 95.2085 47.6084 96.0603C52.5248 98.579 58.0964 100 64 100C69.9036 100 75.4753 98.579 80.3916 96.0603C82.0543 95.2085 84.1036 95.4172 85.4245 96.7382L100.04 111.354Z" fill="#6C47FF"/>
</svg>`;

const CLERK_SYMBOL_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(CLERK_SYMBOL_SVG)}`;

export function Scene7() {
  const lockupRef = useRef<HTMLDivElement>(null);
  const npmRef = useRef<HTMLDivElement>(null);
  const npmSpan1Ref = useRef<HTMLSpanElement>(null); // "npm"
  const npmSpan2Ref = useRef<HTMLSpanElement>(null); // " install -g clerk"
  const cursorRef = useRef<HTMLSpanElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // Logo lockup fade-in
    if (lockupRef.current) {
      const t = track(ms, LOGO_FADE_START, LOGO_FADE_END);
      lockupRef.current.style.opacity = `${t}`;
      // Preserve centering translate(-50%,-50%) and add Y offset animation
      lockupRef.current.style.transform = `translate(-50%, -50%) translateY(${(1 - t) * 12}px)`;
    }

    // npm command reveal container
    if (npmRef.current) {
      const showAt = NPM_TYPE_START - 100;
      const t = track(ms, showAt, showAt + 100);
      npmRef.current.style.opacity = `${t}`;
    }

    // Typewriter for npm command
    // Full string: "npm install -g clerk"
    // Chars 0-2: "npm" = cyan
    // Chars 3+: " install -g clerk" = white
    const totalChars = NPM_CMD.length;
    const typed = ms >= NPM_TYPE_START
      ? Math.min(totalChars, Math.floor((ms - NPM_TYPE_START) / MS_PER_CHAR))
      : 0;

    if (npmSpan1Ref.current) {
      // "npm" = first 3 chars
      const cyanPart = NPM_CMD.slice(0, Math.min(3, typed));
      npmSpan1Ref.current.textContent = cyanPart;
    }
    if (npmSpan2Ref.current) {
      // " install -g clerk" = chars 3 onwards
      if (typed > 3) {
        npmSpan2Ref.current.textContent = NPM_CMD.slice(3, typed);
      } else {
        npmSpan2Ref.current.textContent = "";
      }
    }

    // Cursor blinks during typing, stays solid after
    if (cursorRef.current) {
      const doneTyping = typed >= totalChars;
      if (ms < NPM_TYPE_START) {
        cursorRef.current.style.opacity = "0";
      } else if (doneTyping) {
        cursorRef.current.style.opacity = blinkCursor(ms) ? "1" : "0";
      } else {
        cursorRef.current.style.opacity = blinkCursor(ms) ? "1" : "0";
      }
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration={`${DURATION}ms`}
      onFrame={onFrame as any}
      style={{
        position: "relative",
        width: 1920,
        height: 1080,
        overflow: "hidden",
        background: "#000000",
      }}
    >
      <TraceLayer sceneStartMs={SCENE_START} enabled={TRACE_MODE} opacity={0.5} />

      {/* Logo lockup — centered */}
      <div
        ref={lockupRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%) translateY(12px)",
          opacity: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
        }}
      >
        {/* Logo row: symbol + wordmark */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginBottom: 40,
        }}>
          {/* Clerk symbol */}
          <img
            src={CLERK_SYMBOL_URL}
            alt="Clerk"
            style={{
              width: 120,
              height: 120,
              display: "block",
            }}
          />
          {/* Wordmark */}
          <span style={{
            fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
            fontSize: 120,
            fontWeight: 600,
            color: "#FFFFFF",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}>
            clerk
          </span>
        </div>

        {/* npm install line */}
        <div
          ref={npmRef}
          style={{
            opacity: 0,
            fontFamily: '"JetBrains Mono", ui-monospace, "SF Mono", monospace',
            fontSize: 36,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <span ref={npmSpan1Ref} style={{ color: "#22D3EE", whiteSpace: "pre" }}></span>
          <span ref={npmSpan2Ref} style={{ color: "#FFFFFF", whiteSpace: "pre" }}></span>
          <span
            ref={cursorRef}
            style={{
              display: "inline-block",
              width: 18,
              height: 32,
              background: "#FFFFFF",
              verticalAlign: "middle",
              marginLeft: 2,
              opacity: 0,
            }}
          />
        </div>
      </div>
    </Timegroup>
  );
}

Scene7.duration = DURATION;
