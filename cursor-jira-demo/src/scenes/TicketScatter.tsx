import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import { Sfx } from "../components/Sfx";

const clamp = (n: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const track = (
  ms: number,
  startMs: number,
  endMs: number,
  easeFn: (t: number) => number = eases.outCubic
) => easeFn(clamp((ms - startMs) / (endMs - startMs)));

/**
 * Opening 3D scatter — a galaxy of Jira tickets floating in 3D space.
 * Camera SMASH-ZOOMS into one focal ticket (MSD-24, our hero).
 * Duration: 3.5s
 *
 *   0–700      Tickets fade in scattered in 3D, ambient drift
 *   700–1800   Camera slow push toward focal ticket
 *   1800–2700  SMASH-ZOOM — focal ticket grows to fill frame
 *   2700–3500  Hand-off: morph into the Jira chrome appearing
 */

interface TicketDef {
  id: string;
  title: string;
  status: "BACKLOG" | "IN PROGRESS" | "DONE" | "REVIEW";
  // 3D position
  x: number; // -1..1
  y: number; // -1..1
  z: number; // -1..1, larger = farther
  rotZ: number; // tilt
  focal?: boolean;
}

const STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  BACKLOG: { bg: "#DFE1E6", fg: "#42526E" },
  "IN PROGRESS": { bg: "#0052CC", fg: "#FFFFFF" },
  DONE: { bg: "#00875A", fg: "#FFFFFF" },
  REVIEW: { bg: "#FFAB00", fg: "#172B4D" },
};

// Scatter of tickets — focal is dead-center, others orbit
const TICKETS: TicketDef[] = [
  { id: "MSD-24", title: "Update Jira docs with a note that the feature has been released", status: "BACKLOG", x: 0, y: 0, z: 0, rotZ: 0, focal: true },
  { id: "MSD-18", title: "Refactor auth middleware for SSO", status: "IN PROGRESS", x: -0.75, y: -0.45, z: 0.4, rotZ: -8 },
  { id: "MSD-31", title: "Migrate billing API to v2 schema", status: "REVIEW", x: 0.78, y: -0.5, z: 0.5, rotZ: 7 },
  { id: "MSD-09", title: "Investigate dashboard p95 latency", status: "DONE", x: -0.8, y: 0.5, z: 0.55, rotZ: 6 },
  { id: "MSD-27", title: "Add audit log export for SOC2", status: "BACKLOG", x: 0.82, y: 0.5, z: 0.45, rotZ: -5 },
  { id: "MSD-12", title: "Fix flaky e2e tests in CI", status: "IN PROGRESS", x: -0.45, y: 0.75, z: 0.7, rotZ: 10 },
  { id: "MSD-33", title: "Implement webhook retry logic", status: "BACKLOG", x: 0.45, y: 0.78, z: 0.7, rotZ: -10 },
  { id: "MSD-15", title: "Update onboarding tooltip copy", status: "DONE", x: -0.4, y: -0.78, z: 0.65, rotZ: -12 },
  { id: "MSD-21", title: "Sentry alert routing rules", status: "REVIEW", x: 0.42, y: -0.8, z: 0.62, rotZ: 9 },
];

export const TicketScatter: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const ticketRefs = useRef<(HTMLDivElement | null)[]>([]);
  const focalRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;

      // Fade in
      const fadeIn = track(ms, 0, 700, eases.outQuart);
      // Camera push (zoom progression)
      const push = track(ms, 700, 1800, eases.inOutCubic);
      // Smash zoom
      const smash = track(ms, 1800, 2700, eases.inCubic);
      // Final whiteout / handoff
      const handoff = track(ms, 2700, 3500, eases.outCubic);

      // Overall camera scale: starts at 1, slow push to ~1.4, then smash to ~6
      const camScale = lerp(1, 1.4, push) * lerp(1, 4.5, smash);
      // Slight perspective tilt on push to feel 3D
      const camTiltY = lerp(0, 6, push) - smash * 6;

      // Background drift parallax
      const drift = ms / 1000;

      TICKETS.forEach((t, i) => {
        const el = ticketRefs.current[i];
        if (!el) return;
        // Stagger fade in
        const tFade = clamp(fadeIn - i * 0.04);
        // Ambient idle motion — gentle bobbing
        const bobX = Math.sin(drift * 0.7 + i) * 6;
        const bobY = Math.cos(drift * 0.9 + i * 1.3) * 5;

        // 3D positions translated to screen
        const baseX = t.x * 850 + bobX;
        const baseY = t.y * 460 + bobY;
        // Z depth — smaller = closer
        const depthScale = lerp(0.55, 1.0, 1 - t.z);
        // During smash, non-focal tickets FLY OUT (motion blur trails)
        const flyOut = smash;
        const flyX = t.x * flyOut * 1800;
        const flyY = t.y * flyOut * 1200;
        const flyScale = 1 + flyOut * 1.5;

        const x = baseX + flyX;
        const y = baseY + flyY;
        const scale = depthScale * flyScale * (t.focal ? 1 : 1);
        const opacity = tFade * (t.focal ? 1 : 1 - smash * 0.9);
        const blur = flyOut > 0 ? flyOut * 12 : 0;

        el.style.opacity = String(opacity);
        el.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${t.rotZ - flyOut * 25}deg)`;
        el.style.filter = blur > 0 ? `blur(${blur}px)` : "none";
      });

      // Focal ticket — gets a glow as smash begins
      if (focalRef.current) {
        const glow = smash;
        focalRef.current.style.boxShadow = `0 0 ${20 + glow * 80}px ${glow * 8}px rgba(66, 99, 235, ${0.2 + glow * 0.5}), 0 ${12 + glow * 40}px ${30 + glow * 60}px rgba(9, 30, 66, ${0.15 + glow * 0.2})`;
        focalRef.current.style.borderColor = glow > 0.3 ? "#4263EB" : "#DFE1E6";
      }

      // Camera scale on the whole rig
      if (rootRef.current) {
        rootRef.current.style.transform = `scale(${camScale}) rotateY(${camTiltY}deg)`;
        rootRef.current.style.transformOrigin = "50% 50%";
        rootRef.current.style.opacity = String(1 - handoff);
      }

      // White flash at smash apex
      if (flashRef.current) {
        const flash = track(ms, 2400, 2700, eases.outCubic) * (1 - track(ms, 2700, 3200, eases.outQuad));
        flashRef.current.style.opacity = String(flash);
      }
    },
    []
  );

  return (
    <Timegroup
      mode="fixed"
      duration="3.5s"
      onFrame={handleFrame as any}
      className="absolute inset-0"
    >
      <Sfx cue="reveal" at={0.05} dur={1.4} volume={0.4} />
      <Sfx cue="ping" at={1.7} dur={1.2} volume={0.35} />
      <Sfx cue="glitch-short" at={2.4} dur={0.6} volume={0.5} />

      {/* Deep gradient background — outer space for tickets */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, #F4F7FB 0%, #E1E7F0 40%, #C5CFE0 90%)",
        }}
      />

      {/* Subtle grid lines for 3D depth */}
      <svg
        width="1920"
        height="1080"
        style={{ position: "absolute", inset: 0, opacity: 0.18 }}
      >
        <defs>
          <pattern id="grid3d" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#4263EB" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="1920" height="1080" fill="url(#grid3d)" />
      </svg>

      {/* Camera rig (gets scaled / rotated) */}
      <div
        ref={rootRef}
        style={{
          position: "absolute",
          inset: 0,
          perspective: "1400px",
          transformStyle: "preserve-3d",
          willChange: "transform, opacity",
        }}
      >
        {/* Center origin */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 0,
            height: 0,
          }}
        >
          {TICKETS.map((t, i) => {
            const colors = STATUS_COLORS[t.status];
            const isFocal = t.focal;
            return (
              <div
                key={t.id}
                ref={(el) => {
                  ticketRefs.current[i] = el;
                  if (isFocal) (focalRef as any).current = el;
                }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 360,
                  height: 110,
                  background: "#FFFFFF",
                  border: "1px solid #DFE1E6",
                  borderRadius: 6,
                  padding: "12px 14px",
                  boxShadow: "0 8px 20px rgba(9, 30, 66, 0.15)",
                  fontFamily: "Inter, sans-serif",
                  opacity: 0,
                  willChange: "transform, opacity, filter",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Header row */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 3,
                      background: "#2684FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: 9,
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#42526E",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {t.id}
                  </div>
                  <div style={{ flex: 1 }} />
                  <div
                    style={{
                      padding: "2px 7px",
                      background: colors.bg,
                      color: colors.fg,
                      borderRadius: 3,
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {t.status}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: isFocal ? 600 : 500,
                    color: "#172B4D",
                    lineHeight: 1.3,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {t.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smash-zoom flash */}
      <div
        ref={flashRef}
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 50%, #FFFFFF 0%, rgba(255,255,255,0.6) 60%, transparent 100%)",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
    </Timegroup>
  );
};

export default TicketScatter;
