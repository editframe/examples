/**
 * Scene 7 — Logo outro card
 * Local time: 0–3500ms (scene-local; was master 12000–15500ms)
 *
 * USER SAID:
 * - "Don't change the clerk logo or the clerk text on top; it's perfect."
 * - "The animation on ours just appears instantaneously. That line of the
 *   `npm install -g clerk` just appears instantaneously in the actual reference
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
 *
 * Converted from per-frame onFrame/useRef (opacity/textContent/cursor
 * mutation) to declarative CSS (REFACTOR-PATTERNS.md Part 2b): `Reveal` for
 * the two fades, `Typewriter` for the char-by-char reveal (CSS `steps()`
 * width clip), `Cursor` for the infinite blink. The inline Clerk symbol SVG
 * (previously a `data:` URI baked directly into this file) now lives at
 * `src/assets/clerk-symbol.svg`, loaded via `<Image>` (Part 2a).
 */
import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { fonts } from "../lib/colors";
import { Reveal } from "@shared/components/Reveal";
import { Typewriter } from "../components/Typewriter";
import { Cursor } from "../components/Cursor";

const SCENE_START = 12000;
const DURATION = 3500;

// Logo lockup fade-in
const LOGO_FADE_START = 300;
const LOGO_FADE_END = 800;

// npm command typewriter
const NPM_CMD = "npm install -g clerk";
const NPM_CYAN_CHARS = 3; // "npm"
const NPM_TYPE_START = 1000;
const MS_PER_CHAR = 80;
const NPM_TYPE_DURATION = NPM_CMD.length * MS_PER_CHAR; // 1600ms

export function LogoCard() {
  return (
    <Timegroup
      mode="fixed"
      duration={`${DURATION}ms`}
      style={{
        position: "relative",
        width: 1920,
        height: 1080,
        overflow: "hidden",
        background: "#000000",
      }}
    >
      <TraceLayer sceneStartMs={SCENE_START} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* Centered lockup — a flex-centered wrapper instead of the old
          left:50%/top:50%/translate(-50%,-50%) trick, since Reveal's own
          `translateY` entrance animation would otherwise fight a centering
          transform on the same element. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Reveal
          enter={[LOGO_FADE_START, LOGO_FADE_END]}
          y={12}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}
        >
          {/* Logo row: symbol + wordmark */}
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
            <Image src="/clerk-cli-demo/src/assets/clerk-symbol.svg" style={{ width: 120, height: 120, display: "block" }} />
            <span
              style={{
                fontFamily: fonts.sans,
                fontSize: 120,
                fontWeight: 600,
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              clerk
            </span>
          </div>

          {/* npm install line */}
          <Reveal
            enter={[NPM_TYPE_START - 100, NPM_TYPE_START]}
            y={0}
            style={{
              fontFamily: fonts.mono,
              fontSize: 36,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typewriter charCount={NPM_CMD.length} delay={NPM_TYPE_START} duration={NPM_TYPE_DURATION}>
              <span style={{ color: "#22D3EE", whiteSpace: "pre" }}>{NPM_CMD.slice(0, NPM_CYAN_CHARS)}</span>
              <span style={{ color: "#FFFFFF", whiteSpace: "pre" }}>{NPM_CMD.slice(NPM_CYAN_CHARS)}</span>
            </Typewriter>
            <Cursor showAt={NPM_TYPE_START} width={18} height={32} />
          </Reveal>
        </Reveal>
      </div>
    </Timegroup>
  );
}

LogoCard.duration = DURATION;
