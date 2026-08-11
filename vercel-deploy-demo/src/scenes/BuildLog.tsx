import React from "react";
import { Timegroup } from "@editframe/react";
import { vc, fonts } from "../lib/colors";
import { SCENES } from "../constants";

/**
 * Scene 4 — BuildLog (4.5s local + 0.5s crossfade tail)  ‖ Delba canon rebuild (v6 replacement)
 *
 * Replaces the v5 StaticDynamicWireframe per Jeremy: "Scrap that out entirely
 * and build another one. Something that screams vercel. Dont rehash and dont
 * just remake it lazily."
 *
 * Concept: A real `vercel deploy --prod` build log streams in line-by-line in
 * a centered terminal panel. Each line gets a green ✓ checkmark. Final line
 * "Ready · 4.2s" pulses (brightness only — stays the same green, no hue
 * shift) with a slight scale tick. This is THE canonical Vercel deploy
 * moment — what every Next.js dev sees in their terminal a thousand times.
 * It's the bridge between Scene3's PPR code annotation and Scene5's "Static
 * where it can. Dynamic where it must." thesis card.
 *
 * Beats (local ms, this scene's own clock):
 *   0–300       Terminal panel fades in.
 *   250         "$ vercel deploy --prod" types in (header line, white).
 *   450         "  Compiling client bundle..." in gray400 (subtle status).
 *   700         ✓ Static: 14 pages prerendered
 *   900         ✓ Dynamic: 6 routes served at edge
 *   1100        ✓ Cache: keyed by user.region
 *   1300        ✓ Optimized images (47 transforms)
 *   1500        ✓ Deployed to 12 edge regions
 *   1750        ✓ Ready · 4.2s   (brightness pulse + 1.04 scale at 1950–2300)
 *   2300–4500   Hold.
 *   4500–5000   Crossfade out (--ef-transition-out-start) — replaces the old
 *               internal 4100–4500 panel fade-out; the whole scene now hands
 *               off via the shared sequence crossfade instead of a separately
 *               timed local fade.
 *
 * Brand checks:
 *   - Bg #0A0A0A ✓
 *   - Single accent #3FB950 (true green) — same vocabulary as Vercel CLI ✓
 *   - Geist Mono throughout — terminal-forward, code-forward ✓
 *   - Centered ~1100×520 surface panel (#171717 / 1px #262626 border) ✓
 *   - No purple/blue here — that vocabulary belongs to Scene3 + the thesis ✓
 */

type LogLine = {
  kind: "command" | "status" | "check";
  text: string;
  appearAt: number;
  // Only set for the final "Ready" line — triggers the pulse.
  pulse?: boolean;
};

const LINES: LogLine[] = [
  { kind: "command", text: "vercel deploy --prod", appearAt: 250 },
  { kind: "status", text: "Compiling client bundle...", appearAt: 450 },
  { kind: "check", text: "Static: 14 pages prerendered", appearAt: 700 },
  { kind: "check", text: "Dynamic: 6 routes served at edge", appearAt: 900 },
  { kind: "check", text: "Cache: keyed by user.region", appearAt: 1100 },
  { kind: "check", text: "Optimized images (47 transforms)", appearAt: 1300 },
  { kind: "check", text: "Deployed to 12 edge regions", appearAt: 1500 },
  { kind: "check", text: "Ready  ·  4.2s", appearAt: 1750, pulse: true },
];

// Panel geometry. Sized big per regression rule #1: "TERMINALS / UI BLOCKS ARE
// BIG." 1100×520 keeps generous breathing room around 8 mono lines at 22px.
const PANEL_W = 1100;
const PANEL_H = 520;
const PADDING_X = 56;
const PADDING_Y = 44;
const LINE_HEIGHT = 44;
const LINE_FADE_DUR = 220;
const READY_PULSE_START = 1950;
const READY_PULSE_END = 2300;

export const BuildLog: React.FC = () => {
  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENES.buildLog.duration}ms`}
      className="absolute inset-0 overflow-hidden"
    >
      <div style={{ position: "absolute", inset: 0, background: vc.bg }} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          animation: "scene-fade-out var(--ef-transition-duration) var(--ef-transition-out-start) cubic-bezier(0.32,0,0.67,0) forwards",
        }}
      >
        {/* Centered terminal panel */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: PANEL_W,
            height: PANEL_H,
            background: vc.surface,
            border: `1px solid ${vc.border}`,
            borderRadius: 12,
            padding: `${PADDING_Y}px ${PADDING_X}px`,
            boxSizing: "border-box",
            fontFamily: fonts.mono,
            fontSize: 22,
            lineHeight: `${LINE_HEIGHT}px`,
            color: vc.fg,
            letterSpacing: "0.005em",
            animation: "reveal-in 300ms 0ms cubic-bezier(0.33,1,0.68,1) backwards",
            ["--reveal-y" as any]: "0px",
          }}
        >
          {/* Tiny window-chrome row — three dots, locked-in Vercel CLI feel */}
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 20,
              display: "flex",
              gap: 8,
            }}
          >
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
              <div
                key={c}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  background: c,
                  opacity: 0.55,
                }}
              />
            ))}
          </div>

          {/* Lines */}
          {LINES.map((line, i) => {
            const isReady = !!line.pulse;
            return (
              <div
                key={i}
                style={{
                  height: LINE_HEIGHT,
                  display: "flex",
                  alignItems: "center",
                  whiteSpace: "pre",
                  animation: `reveal-in ${LINE_FADE_DUR}ms ${line.appearAt}ms cubic-bezier(0.33,1,0.68,1) backwards`,
                  ["--reveal-y" as any]: "8px",
                }}
              >
                {line.kind === "command" && (
                  <>
                    <span style={{ color: vc.gray500, marginRight: 14 }}>$</span>
                    <span style={{ color: vc.fg }}>{line.text}</span>
                  </>
                )}
                {line.kind === "status" && (
                  <span style={{ color: vc.gray400 }}>{"  " + line.text}</span>
                )}
                {line.kind === "check" && (
                  <>
                    <span
                      style={{
                        color: vc.fg,
                        marginRight: 14,
                        fontWeight: 600,
                        display: "inline-block",
                        animation: isReady
                          ? `ready-pulse-check ${READY_PULSE_END - READY_PULSE_START}ms ${READY_PULSE_START}ms cubic-bezier(0.45,0,0.55,1) both`
                          : undefined,
                      }}
                    >
                      ✓
                    </span>
                    <span
                      style={{
                        color: vc.fg,
                        fontWeight: isReady ? 500 : 400,
                        display: "inline-block",
                        transformOrigin: "left center",
                        animation: isReady
                          ? `ready-pulse-text ${READY_PULSE_END - READY_PULSE_START}ms ${READY_PULSE_START}ms cubic-bezier(0.45,0,0.55,1) both`
                          : undefined,
                      }}
                    >
                      {line.text}
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Timegroup>
  );
};

export default BuildLog;
