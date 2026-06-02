/**
 * Scene 8 — Cursor clicks center cell, X spawns, O's appear, fade to black
 * Duration: 4500ms (t=17500–22000ms)
 *
 * FIX C (Round 6): Re-derived grid geometry from TicTacToeWindow component:
 *   TTT window: left=745, top=52, w=390, h=570
 *   Title bar: height=40px (exact, flexShrink:0)
 *   Content padding-top: 24px
 *   "Cloud Tic Tac Toe": fontSize=28, lineHeight≈1.2 → 34px + marginBottom=6 = 40px
 *   Subtitle "You are X...": fontSize=14, lineHeight≈1.2 → 17px + marginBottom=16 = 33px
 *   "Your turn" pill: padding 6px top+bottom + fontSize=14 (17px) + border 2px → 31px + marginBottom=20 = 51px
 *   Total above grid: 40 + 24 + 40 + 33 + 51 = 188px
 *   GRID_TOP on screen: 52 + 188 = 240
 *
 *   Grid width = 3*96 + 2*8 = 304px
 *   Window inner width = 390 - 32px (2×16px padding) = 358px
 *   Grid centered: (358 - 304) / 2 = 27px → grid_left = 745 + 16 + 27 = 788
 *   Cell step = 96 + 8 = 104px
 *
 *   Cell centers (cursor tip lands here = exact visual center of square):
 *     Center (1,1): x = 788 + 1*104 + 48 = 940, y = 240 + 1*104 + 48 = 392
 *     Top-left (0,0): x = 788 + 48 = 836, y = 240 + 48 = 288
 *     Bottom-right (2,2): x = 788 + 2*104 + 48 = 1044, y = 240 + 2*104 + 48 = 496
 */

import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
// Clean macOS desktop gradient (no circles/grid artifacts)
const DESKTOP_BG = "linear-gradient(135deg, #8B9EC8 0%, #6B7FA8 20%, #4A5F9E 40%, #2E4590 60%, #1A2E7A 80%, #0D1B5E 100%)";
import { cursorMacosDataUri } from "../scenes/scene-assets";
import { track, lerp } from "../components/helpers";
import {
  XcodeWindow,
  CodexTitleBar,
  UserMessageBubble,
  ToolCallRow,
  CodexBottomBar,
  TicTacToeWindow,
} from "../components/panels";
import { eases } from "animejs";

const SCENE_DURATION = 4500;
const SCENE_START_MS = 17500;

// Same layout as Scene7
const CODEX_LEFT = 68;
const CODEX_TOP = 195;
const CODEX_W = 590;
const CODEX_H = 660;
const XCODE_LEFT = 490;
const XCODE_TOP = 52;
const XCODE_W = 930;
const XCODE_H = 640;
const TTT_LEFT = 745;
const TTT_TOP = 52;
const TTT_W = 390;
const TTT_H = 570;

// Grid geometry (FIX C: re-derived from TicTacToeWindow component — see header comment)
const GRID_LEFT = 788;   // x of grid left edge on screen
const GRID_TOP = 240;    // y of grid top edge on screen (corrected from 227 → 240)
const CELL_SIZE = 96;
const CELL_GAP = 8;
const CELL_STEP = CELL_SIZE + CELL_GAP; // 104

const cellCenter = (row: number, col: number) => ({
  x: GRID_LEFT + col * CELL_STEP + CELL_SIZE / 2,
  y: GRID_TOP + row * CELL_STEP + CELL_SIZE / 2,
});

const CENTER_CELL = cellCenter(1, 1); // (940, 392) — exact visual center of center square
const O_CELL_1 = cellCenter(0, 0);   // (836, 288) — top-left
const O_CELL_2 = cellCenter(2, 2);   // (1044, 496) — bottom-right

const CURSOR_START = { x: 1080, y: 300 };

const CLICK_T = 1000;
const X_SPAWN_T = 1100;
const O1_SPAWN_T = 1400;
const O2_SPAWN_T = 1700;

const BOTTOM_H = 100;

export const Scene8: React.FC = () => {
  const cursorRef = useRef<HTMLImageElement>(null);
  const clickRingRef = useRef<HTMLDivElement>(null);
  const xMarkRef = useRef<HTMLDivElement>(null);
  const o1MarkRef = useRef<HTMLDivElement>(null);
  const o2MarkRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // Cursor moves to center cell
    if (cursorRef.current) {
      const moveT = track(ms, 0, CLICK_T - 100, eases.outCubic);
      const cx = lerp(CURSOR_START.x, CENTER_CELL.x, moveT);
      const cy = lerp(CURSOR_START.y, CENTER_CELL.y, moveT);
      cursorRef.current.style.left = cx + "px";
      cursorRef.current.style.top = cy + "px";

      if (ms >= CLICK_T && ms <= CLICK_T + 200) {
        const progress = (ms - CLICK_T) / 200;
        const scaleV = progress < 0.5
          ? lerp(1.0, 0.75, progress * 2)
          : lerp(0.75, 1.0, (progress - 0.5) * 2);
        cursorRef.current.style.transform = `scale(${scaleV})`;
      } else {
        cursorRef.current.style.transform = "scale(1)";
      }
    }

    // Click ring
    if (clickRingRef.current) {
      if (ms >= CLICK_T && ms <= CLICK_T + 450) {
        const t = (ms - CLICK_T) / 450;
        clickRingRef.current.style.opacity = String(1 - t);
        clickRingRef.current.style.transform = `translate(-50%, -50%) scale(${lerp(0.5, 2.2, t)})`;
      } else {
        clickRingRef.current.style.opacity = "0";
      }
    }

    // X appears at X_SPAWN_T — centered via translate(-50%, -50%)
    if (xMarkRef.current) {
      if (ms >= X_SPAWN_T) {
        const spawnT = track(ms, X_SPAWN_T, X_SPAWN_T + 200, eases.outCubic);
        xMarkRef.current.style.opacity = String(Math.min(1, spawnT));
        xMarkRef.current.style.transform = `translate(-50%, -50%) scale(${lerp(0.3, 1.0, Math.min(1, spawnT))})`;
      } else {
        xMarkRef.current.style.opacity = "0";
        xMarkRef.current.style.transform = "translate(-50%, -50%) scale(0.3)";
      }
    }

    // O1
    if (o1MarkRef.current) {
      if (ms >= O1_SPAWN_T) {
        const spawnT = track(ms, O1_SPAWN_T, O1_SPAWN_T + 200, eases.outCubic);
        o1MarkRef.current.style.opacity = String(Math.min(1, spawnT));
        o1MarkRef.current.style.transform = `translate(-50%, -50%) scale(${lerp(0.3, 1.0, Math.min(1, spawnT))})`;
      } else {
        o1MarkRef.current.style.opacity = "0";
        o1MarkRef.current.style.transform = "translate(-50%, -50%) scale(0.3)";
      }
    }

    // O2
    if (o2MarkRef.current) {
      if (ms >= O2_SPAWN_T) {
        const spawnT = track(ms, O2_SPAWN_T, O2_SPAWN_T + 200, eases.outCubic);
        o2MarkRef.current.style.opacity = String(Math.min(1, spawnT));
        o2MarkRef.current.style.transform = `translate(-50%, -50%) scale(${lerp(0.3, 1.0, Math.min(1, spawnT))})`;
      } else {
        o2MarkRef.current.style.opacity = "0";
        o2MarkRef.current.style.transform = "translate(-50%, -50%) scale(0.3)";
      }
    }

    // Fade to black
    if (fadeRef.current) {
      const fadeT = track(ms, 4000, 4500, eases.outCubic);
      fadeRef.current.style.opacity = String(fadeT);
    }
  }, []);

  const CHAT_H = CODEX_H - 44 - BOTTOM_H;

  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE_DURATION}ms` as any}
      onFrame={onFrame as any}
      style={{ position: "relative", width: 1920, height: 1080, overflow: "hidden" }}
    >
      <TraceLayer sceneStartMs={SCENE_START_MS} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {!TRACE_MODE && (
        <div style={{
          position: "absolute",
          inset: 0,
          background: DESKTOP_BG,
          zIndex: 1,
        }} />
      )}

      {/* macOS menu bar */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 28,
        background: "rgba(18,18,24,0.92)",
        backdropFilter: "blur(10px)",
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        paddingLeft: 16, paddingRight: 16,
        gap: 20,
        fontSize: 13, fontWeight: 600, color: "#FFFFFF",
        fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
      }}>
        <span style={{ fontSize: 14 }}>🍎</span>
        <span>Codex</span>
        <span style={{ fontWeight: 400, opacity: 0.85 }}>File</span>
        <span style={{ fontWeight: 400, opacity: 0.85 }}>Edit</span>
        <span style={{ fontWeight: 400, opacity: 0.85 }}>View</span>
        <span style={{ fontWeight: 400, opacity: 0.85 }}>Window</span>
        <span style={{ fontWeight: 400, opacity: 0.85 }}>Help</span>
        <div style={{ flex: 1 }} />
        <span style={{ opacity: 0.7, fontSize: 12 }}>Wed Apr 16  8:16 PM</span>
      </div>

      {/* XCODE WINDOW (z=3) */}
      <div style={{ position: "absolute", left: XCODE_LEFT, top: XCODE_TOP, zIndex: 3 }}>
        <XcodeWindow
          style={{ width: XCODE_W, height: XCODE_H }}
          navWidth={220}
          fontSize={12}
          lineCount={18}
          showStatusBar={true}
        />
      </div>

      {/* CLOUD TIC TAC TOE WINDOW (z=5) — empty grid, X/O overlaid via absolute elements */}
      <div style={{ position: "absolute", left: TTT_LEFT, top: TTT_TOP, zIndex: 5 }}>
        <TicTacToeWindow style={{ width: TTT_W, height: TTT_H }} cellSize={96} />
      </div>

      {/* CODEX CHAT PANEL (z=4) */}
      <div style={{
        position: "absolute",
        left: CODEX_LEFT,
        top: CODEX_TOP,
        width: CODEX_W,
        height: CODEX_H,
        background: "#FFFFFF",
        borderRadius: 12,
        boxShadow: "0 12px 40px rgba(0,0,0,0.40)",
        overflow: "hidden",
        zIndex: 4,
        fontFamily: "'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
      }}>
        <CodexTitleBar taskTitle="Playtest app ..." />

        <div style={{ padding: "12px 16px", height: CHAT_H, overflowY: "hidden" }}>
          <UserMessageBubble />

          <div style={{ fontSize: 12, color: "#999", marginBottom: 6 }}>Working for 14s</div>
          <div style={{ height: 1, background: "#EBEBEB", marginBottom: 10 }} />

          <div style={{ fontSize: 12, color: "#1A1A1A", marginBottom: 8, lineHeight: 1.55 }}>
            Understood. I'll first use the Xcode workflow directly as requested: open the project, run it, and play through a game in the simulator/device to surface issues. After reproduction, I'll inspect and patch the relevant app code paths only where needed.
          </div>

          <div style={{ fontSize: 11, color: "#BBBBBB", marginBottom: 6 }}>Called 2 tools</div>

          <div style={{ fontSize: 12, color: "#1A1A1A", marginBottom: 8, lineHeight: 1.55 }}>
            I found Xcode already open on the project and located the Run control. I'm clicking Run now and will immediately drive the running app to play a full game and spot behavior regressions.
          </div>

          <div style={{ fontSize: 11, color: "#BBBBBB", marginBottom: 6 }}>Called 4 tools</div>

          <div style={{ fontSize: 12, color: "#1A1A1A", marginBottom: 8, lineHeight: 1.55 }}>
            Build is running and now reports "Running CloudTicTacToe." Next I'm locating the app window and driving a real game flow through the UI to validate gameplay and detect behavioral issues.
          </div>

          <div style={{ fontSize: 11, color: "#BBBBBB", marginBottom: 5 }}>Used Codex</div>
          <ToolCallRow label="List MCP resources" />
          <ToolCallRow label="List Mac apps" />
          <ToolCallRow label="Looked at App" />
          <ToolCallRow label="Clicking · App" italic />
        </div>

        <CodexBottomBar height={BOTTOM_H} />
      </div>

      {/* X MARK — centered on center cell (1,1) */}
      <div
        ref={xMarkRef}
        style={{
          position: "absolute",
          left: CENTER_CELL.x,
          top: CENTER_CELL.y,
          transform: "translate(-50%, -50%) scale(0.3)",
          zIndex: 7,
          opacity: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <span style={{
          fontSize: 54,
          fontWeight: 900,
          color: "#1A56DB",
          lineHeight: 1,
          fontFamily: "'SF Pro Display', sans-serif",
        }}>X</span>
      </div>

      {/* O MARK 1 — top-left cell (0,0) */}
      <div
        ref={o1MarkRef}
        style={{
          position: "absolute",
          left: O_CELL_1.x,
          top: O_CELL_1.y,
          transform: "translate(-50%, -50%) scale(0.3)",
          zIndex: 7,
          opacity: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <span style={{
          fontSize: 54,
          fontWeight: 900,
          color: "#D44000",
          lineHeight: 1,
          fontFamily: "'SF Pro Display', sans-serif",
        }}>O</span>
      </div>

      {/* O MARK 2 — bottom-right cell (2,2) */}
      <div
        ref={o2MarkRef}
        style={{
          position: "absolute",
          left: O_CELL_2.x,
          top: O_CELL_2.y,
          transform: "translate(-50%, -50%) scale(0.3)",
          zIndex: 7,
          opacity: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <span style={{
          fontSize: 54,
          fontWeight: 900,
          color: "#D44000",
          lineHeight: 1,
          fontFamily: "'SF Pro Display', sans-serif",
        }}>O</span>
      </div>

      {/* Click ring */}
      <div
        ref={clickRingRef}
        style={{
          position: "absolute",
          left: CENTER_CELL.x,
          top: CENTER_CELL.y,
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "2.5px solid rgba(26,86,219,0.7)",
          transform: "translate(-50%, -50%) scale(0.5)",
          opacity: 0,
          zIndex: 8,
          pointerEvents: "none",
        }}
      />

      {/* macOS cursor */}
      <img
        ref={cursorRef}
        src={cursorMacosDataUri}
        alt=""
        style={{
          position: "absolute",
          left: CURSOR_START.x,
          top: CURSOR_START.y,
          width: 32,
          height: 32,
          zIndex: 9,
          pointerEvents: "none",
          transformOrigin: "top left",
        }}
      />

      {/* Fade to black overlay */}
      <div
        ref={fadeRef}
        style={{
          position: "absolute",
          inset: 0,
          background: "#000000",
          opacity: 0,
          zIndex: 15,
          pointerEvents: "none",
        }}
      />
    </Timegroup>
  );
};

(Scene8 as any).duration = SCENE_DURATION;
