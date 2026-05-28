import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import { clamp, lerp, track } from "../components/helpers";
import { vc, fonts } from "../lib/colors";

/**
 * Scene 4 — BuildLog (6.0s)  ‖ Delba canon rebuild (v6 replacement)
 *
 * Replaces the v5 StaticDynamicWireframe per Jeremy: "Scrap that out entirely
 * and build another one. Something that screams vercel. Dont rehash and dont
 * just remake it lazily."
 *
 * Concept: A real `vercel deploy --prod` build log streams in line-by-line in
 * a centered terminal panel. Each line gets a green ✓ checkmark. Final line
 * "Ready · 4.2s" pulses green with a slight scale tick. This is THE canonical
 * Vercel deploy moment — what every Next.js dev sees in their terminal a
 * thousand times. It's the bridge between Scene3's PPR code annotation and
 * Scene5's "Static where it can. Dynamic where it must." thesis card.
 *
 * Beats:
 *   0–400       Terminal panel cross-fades in (no scene-level black seam).
 *   400         "$ vercel deploy --prod" types in (header line, white).
 *   700         "  Compiling client bundle..." in gray400 (subtle status).
 *   1100        ✓ Static: 14 pages prerendered
 *   1500        ✓ Dynamic: 6 routes served at edge
 *   1900        ✓ Cache: keyed by user.region
 *   2300        ✓ Optimized images (47 transforms)
 *   2700        ✓ Deployed to 12 edge regions
 *   3100        ✓ Ready · 4.2s   (green pulse + 1.04 scale at 3300–3500)
 *   3500–5500   Hold.
 *   5500–6000   Cross-fade out.
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
  // Only set for the final "Ready" line — triggers the green pulse.
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

export const Scene4_BuildLog: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Array<HTMLDivElement | null>>([]);
  const readyTextRef = useRef<HTMLSpanElement>(null);
  const readyCheckRef = useRef<HTMLSpanElement>(null);

  const handleFrame = useCallback(({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
    const ms = ownCurrentTimeMs;

    if (wrapperRef.current) {
      // No scene-level fade — prevents a black seam at the cut. Sequence mode
      // already cross-fades neighbors.
      wrapperRef.current.style.opacity = "1";
    }

    // Panel — fade in over the first 300ms, fade out over the last 400ms.
    if (panelRef.current) {
      const fadeIn = track(ms, 0, 300, eases.outCubic);
      const fadeOut = 1 - track(ms, 4100, 4500, eases.inCubic);
      panelRef.current.style.opacity = String(clamp(Math.min(fadeIn, fadeOut)));
    }

    // Lines — each fades up over 220ms from y+8 → 0.
    LINES.forEach((line, i) => {
      const el = lineRefs.current[i];
      if (!el) return;
      const p = track(ms, line.appearAt, line.appearAt + 220, eases.outCubic);
      el.style.opacity = String(p);
      el.style.transform = `translateY(${lerp(8, 0, p)}px)`;
    });

    // Ready pulse — final line gets a one-shot green pulse + 1.04 scale tick.
    // Color stays green (it's the success color); the pulse modulates
    // BRIGHTNESS via a text-shadow halo.
    if (readyTextRef.current && readyCheckRef.current) {
      const pulse = track(ms, 1950, 2300, eases.outCubic);
      // Triangle pulse: ramp up to 1 by midpoint, back to 0 by end.
      const tri = pulse < 0.5 ? pulse * 2 : (1 - pulse) * 2;
      const scale = lerp(1, 1.04, tri);
      const glow = lerp(0, 12, tri);
      readyTextRef.current.style.transform = `scale(${scale})`;
      readyTextRef.current.style.display = "inline-block";
      readyTextRef.current.style.transformOrigin = "left center";
      readyTextRef.current.style.textShadow = `0 0 ${glow}px rgba(255, 255, 255, 0.55)`;
      readyCheckRef.current.style.textShadow = `0 0 ${glow}px rgba(255, 255, 255, 0.7)`;
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration="4.5s"
      onFrame={handleFrame as any}
      className="absolute inset-0 overflow-hidden"
    >
      <div style={{ position: "absolute", inset: 0, background: vc.bg }} />

      <div ref={wrapperRef} style={{ position: "absolute", inset: 0, opacity: 0 }}>
        {/* Centered terminal panel */}
        <div
          ref={panelRef}
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
            opacity: 0,
            boxSizing: "border-box",
            fontFamily: fonts.mono,
            fontSize: 22,
            lineHeight: `${LINE_HEIGHT}px`,
            color: vc.fg,
            letterSpacing: "0.005em",
            willChange: "opacity",
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
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                style={{
                  opacity: 0,
                  marginBottom: 0,
                  height: LINE_HEIGHT,
                  display: "flex",
                  alignItems: "center",
                  willChange: "transform, opacity",
                  whiteSpace: "pre",
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
                      ref={isReady ? readyCheckRef : undefined}
                      style={{
                        color: vc.fg,
                        marginRight: 14,
                        fontWeight: 600,
                      }}
                    >
                      ✓
                    </span>
                    {isReady ? (
                      <span
                        ref={readyTextRef}
                        style={{ color: vc.fg, fontWeight: 500 }}
                      >
                        {line.text}
                      </span>
                    ) : (
                      <span style={{ color: vc.fg }}>{line.text}</span>
                    )}
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

export default Scene4_BuildLog;
