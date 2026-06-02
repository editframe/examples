/**
 * Scene 5 — Terminal Run (12500–18500ms)
 *
 * FIX 3 (round-5) — Viewport-aware camera scroll:
 *   Phase 1: Camera is STILL. Lines type out from the top of the visible area.
 *            Content fills the viewport but camera stays at scrollY=0.
 *   Phase 2: When the accumulated typed content HEIGHT exceeds the viewport height,
 *            camera starts scrolling down to follow new lines.
 *            targetScrollY = max(0, contentHeight - viewportHeight)
 *            Smooth lerp toward targetScrollY each frame.
 *
 * KEEP:
 *   - Dark bg #0A0A0A
 *   - No panel chrome — text directly on bg
 *   - JetBrains Mono, 28px
 *   - Color scheme preserved
 *   - MCP service box with border preserved
 *   - Scene 4→5 transition intact (this scene's start = immediately after Scene 4)
 */

import React, { useRef, useCallback } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { clamp, lerp } from "../components/helpers";

const SCENE_START = 17500; // updated: scene 4 is now 10000ms → 7500+10000=17500
const SCENE_DUR = 7500; // extended to hold on final frame (MCP box + full Wrote line + $)

const FONT_SIZE = 36;
const LINE_HEIGHT = Math.round(FONT_SIZE * 1.7); // ~61px — matches reference density
const FONT_FAMILY = '"JetBrains Mono", "SF Mono", "Menlo", "Consolas", monospace';

// Viewport dimensions
const VIEWPORT_H = 1080;
const VIEWPORT_TOP_PAD = 80; // wrapper starts 80px from top

// Colors
const C_CMD   = "#F0F0F0";
const C_DIM   = "#888888";
const C_THINK = "#C8C8C8";
const C_TOOL  = "#4CAF50";
const C_CORAL = "#E07B5A";
const C_TEAL  = "#5AC8C8";

// Typing speed
const MS_PER_CHAR = 5; // ~200 chars/sec
const TYPE_START_LOCAL = 150;

// Content line types
type LineType = "cmd" | "dim" | "think" | "tool" | "mcp" | "wrote" | "blank";

interface TermLine {
  type: LineType;
  text?: string;
}

const CONTENT_LINES: TermLine[] = [
  { type: "cmd",   text: "$ uv run synthetic_data_pipeline.py" },
  { type: "dim",   text: "Summarizing codebase..." },
  { type: "think", text: "Scanning the workspace and collecting context." },
  { type: "blank", text: "" },
  { type: "tool",  text: "list_dir {'relative_workspace_path': '.'}" },
  { type: "tool",  text: "read_file {'target_file': 'README.md'}" },
  { type: "tool",  text: "read_file {'target_file': 'pyproject.toml'}" },
  { type: "blank", text: "" },
  { type: "think", text: "Looking at the API routes and database models." },
  { type: "blank", text: "" },
  { type: "tool",  text: "list_dir {'relative_workspace_path': 'src/api'}" },
  { type: "tool",  text: "read_file {'target_file': 'src/api/routes.py'}" },
  { type: "tool",  text: "read_file {'target_file': 'src/api/handlers.py'}" },
  { type: "tool",  text: "list_dir {'relative_workspace_path': 'src/db'}" },
  { type: "tool",  text: "read_file {'target_file': 'src/db/models.py'}" },
  { type: "blank", text: "" },
  { type: "think", text: "Searching for auth and validation patterns." },
  { type: "blank", text: "" },
  { type: "tool",  text: "codebase_search {'query': 'authentication middleware'}" },
  { type: "tool",  text: "grep {'pattern': 'def authenticate', 'glob': '*.py'}" },
  { type: "tool",  text: "glob_file_search {'glob_pattern': '**/*.py'}" },
  { type: "blank", text: "" },
  { type: "think", text: "I have enough context. Writing the catalog entry now." },
  { type: "blank", text: "" },
  { type: "mcp" },
  { type: "blank", text: "" },
  { type: "wrote", text: "Wrote catalog_entry.md: 3 bullets covering purpose, components, and tooling." },
  { type: "blank", text: "" },
  { type: "dim",   text: "$" },
];

// MCP box height approximation for height tracking
const MCP_BOX_H = 80; // approximate height of the MCP box div

// Compute per-line heights for viewport tracking
function getLineHeight(line: TermLine): number {
  if (line.type === "blank") return LINE_HEIGHT / 2;
  if (line.type === "mcp") return MCP_BOX_H + 8; // padding + margin
  return LINE_HEIGHT;
}

// Pre-compute cumulative char timings
function buildLineTimings(): Array<{ startMs: number; endMs: number; chars: number }> {
  let cursor = TYPE_START_LOCAL;
  return CONTENT_LINES.map((line) => {
    const text = line.type === "mcp" ? "" : (line.text ?? "");
    const chars = text.length;
    const duration = chars * MS_PER_CHAR;
    const startMs = cursor;
    const endMs = cursor + Math.max(duration, chars > 0 ? 50 : 20);
    cursor = endMs + 20;
    return { startMs, endMs, chars };
  });
}

const LINE_TIMINGS = buildLineTimings();

// Pre-compute which lines have "appeared" at each timing, for height estimation
// A line "appears" (starts contributing to height) when it starts typing (or instantly for mcp/blank)
function getContentHeightAtMs(ms: number): number {
  let h = 0;
  for (let i = 0; i < CONTENT_LINES.length; i++) {
    const line = CONTENT_LINES[i];
    const timing = LINE_TIMINGS[i];
    if (ms < timing.startMs) break;
    h += getLineHeight(line);
  }
  return h;
}

export function Scene5_TerminalRun() {
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const lineTextRefs = useRef<(HTMLSpanElement | null)[]>(
    new Array(CONTENT_LINES.length).fill(null) // auto-sized to CONTENT_LINES array length
  );
  const setLineTextRef = (i: number) => (el: HTMLSpanElement | null) => {
    lineTextRefs.current[i] = el;
  };
  const mcpBoxRef = useRef<HTMLDivElement>(null);

  // Smooth scroll state
  const smoothScrollRef = useRef<number>(0);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    if (!wrapperRef.current) return;

    // ── Viewport-aware scroll ──────────────────────────────────────────────────
    // Usable viewport: VIEWPORT_H - VIEWPORT_TOP_PAD (wrapper starts at top_pad px from top)
    const usableViewport = VIEWPORT_H - VIEWPORT_TOP_PAD;
    const contentHeight = getContentHeightAtMs(ms);

    // Camera stays still until content exceeds the usable viewport
    // Extra 150px over-scroll ensures the trailing "$" line is comfortably visible
    const extraScroll = 150;
    const targetScrollY = Math.max(0, contentHeight - usableViewport + extraScroll);

    // Lerp smoothly toward target (fast enough to track rapid typing)
    const lerpSpeed = 0.15;
    smoothScrollRef.current = smoothScrollRef.current + (targetScrollY - smoothScrollRef.current) * lerpSpeed;

    // Apply: move content UP by smoothScrollY so new lines remain visible
    wrapperRef.current.style.transform = `translateY(${-smoothScrollRef.current}px)`;

    // ── Fade out at very end (last 400ms) — holds fully visible until near-end ─
    if (containerRef.current) {
      if (ms > SCENE_DUR - 400) {
        const fadeP = clamp((ms - (SCENE_DUR - 400)) / 400);
        containerRef.current.style.opacity = String(1 - fadeP);
      } else {
        containerRef.current.style.opacity = "1";
      }
    }

    // ── Typewriter per line ───────────────────────────────────────────────────
    CONTENT_LINES.forEach((line, i) => {
      const timing = LINE_TIMINGS[i];

      if (line.type === "mcp") {
        if (mcpBoxRef.current) {
          mcpBoxRef.current.style.opacity = ms >= timing.startMs ? "1" : "0";
        }
        return;
      }

      if (line.type === "blank") return;

      const el = lineTextRefs.current[i];
      if (!el) return;

      if (ms < timing.startMs) {
        el.textContent = "";
        return;
      }

      const text = line.text ?? "";
      if (text.length === 0) return;

      const elapsed = ms - timing.startMs;
      const charCount = Math.min(text.length, Math.floor(elapsed / MS_PER_CHAR));
      el.textContent = text.slice(0, charCount);
    });
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE_DUR}ms`}
      onFrame={onFrame as any}
      style={{
        position: "absolute",
        inset: 0,
        width: 1920,
        height: 1080,
        background: TRACE_MODE ? "transparent" : "#0A0A0A",
        overflow: "hidden",
      }}
    >
      <TraceLayer sceneStartMs={SCENE_START} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      <div
        ref={containerRef}
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        <div
          ref={wrapperRef}
          style={{
            position: "absolute",
            left: 76,
            top: VIEWPORT_TOP_PAD,
            width: 1800,
            fontFamily: FONT_FAMILY,
            fontSize: FONT_SIZE,
            lineHeight: `${LINE_HEIGHT}px`,
            letterSpacing: 0,
            willChange: "transform",
          }}
        >
          {CONTENT_LINES.map((line, i) => {
            if (line.type === "mcp") {
              return (
                <div
                  key={i}
                  ref={mcpBoxRef}
                  style={{
                    display: "inline-flex",
                    flexDirection: "column",
                    border: "1px solid #444",
                    borderRadius: 4,
                    marginTop: 4,
                    marginBottom: 4,
                    padding: "12px 20px",
                    minWidth: 380,
                    opacity: 0,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ color: C_CORAL, fontWeight: 600 }}>catalog_service</span>
                    <span style={{ color: C_DIM }}> · </span>
                    <span style={{ color: C_TEAL, fontWeight: 600 }}>MCP</span>
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: "1px solid #444",
                        flex: 1,
                        height: 1,
                        marginLeft: 8,
                      }}
                    />
                  </div>
                  <div style={{ color: C_THINK }}>
                    <span style={{ color: "#4CAF50", marginRight: 8 }}>✓</span>
                    <span>Saved catalog_entry</span>
                  </div>
                </div>
              );
            }

            if (line.type === "blank") {
              return <div key={i} style={{ minHeight: LINE_HEIGHT / 2 }} />;
            }

            if (line.type === "tool") {
              return (
                <div key={i} style={{ minHeight: LINE_HEIGHT }}>
                  <span ref={setLineTextRef(i)} style={{ color: C_TOOL }} />
                </div>
              );
            }

            const color =
              line.type === "cmd"   ? C_CMD :
              line.type === "dim"   ? C_DIM :
              line.type === "wrote" ? C_THINK :
              C_THINK;

            return (
              <div
                key={i}
                style={{
                  color,
                  minHeight: LINE_HEIGHT,
                  fontStyle: line.type === "dim" ? "italic" : "normal",
                }}
              >
                <span ref={setLineTextRef(i)} style={{ color }} />
              </div>
            );
          })}
        </div>
      </div>
    </Timegroup>
  );
}

Scene5_TerminalRun.duration = SCENE_DUR;
