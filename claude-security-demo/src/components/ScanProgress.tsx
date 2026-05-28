import React from "react";

/**
 * Malwarebytes / SentinelOne-style scan overlay. Renders:
 *  - Horizontal scan beam (driven by `scanY` 0..1)
 *  - Progress bar with percent
 *  - Detected vulnerability flags at specific (x,y) positions
 *  - Status badges
 *
 * Designed to overlay on top of a dark terminal panel.
 */

interface Marker {
  x: number; // 0..1 within container
  y: number; // 0..1
  label: string;
  severity?: "CRITICAL" | "HIGH" | "MED";
  /** appearance threshold — only render once scanY passes this y */
  appearAt?: number;
}

interface Props {
  width: number;
  height: number;
  scanY: number; // 0..1 vertical sweep
  progress: number; // 0..1 progress bar fill
  active: boolean;
  markers?: Marker[];
  scanColor?: string;
  showProgressBar?: boolean;
  style?: React.CSSProperties;
}

const SEVERITY_COLOR: Record<string, string> = {
  CRITICAL: "#FF3030",
  HIGH: "#FF8E2E",
  MED: "#FFCC2E",
};

export const ScanProgress: React.FC<Props> = ({
  width,
  height,
  scanY,
  progress,
  active,
  markers = [],
  scanColor = "#FF3030",
  showProgressBar = true,
  style,
}) => {
  const beamY = scanY * height;
  const opacity = active ? 1 : 0;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity,
        transition: "opacity 200ms linear",
        ...style,
      }}
    >
      {/* Horizontal scan beam */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: beamY - 1,
          height: 2,
          background: scanColor,
          boxShadow: `0 0 14px 4px ${scanColor}, 0 0 36px 12px ${scanColor}88`,
        }}
      />
      {/* Scanned area fade */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: beamY,
          background: `linear-gradient(180deg, rgba(255,48,48,0.02) 0%, rgba(255,48,48,0.10) 100%)`,
          borderBottom: `1px solid ${scanColor}40`,
        }}
      />
      {/* Scanline pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 3px)",
          mixBlendMode: "overlay",
        }}
      />

      {/* Markers — flag pops once scan beam passes its y */}
      {markers.map((m, i) => {
        const passed = scanY >= (m.appearAt ?? m.y);
        if (!passed) return null;
        const sev = m.severity || "CRITICAL";
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: m.x * width,
              top: m.y * height,
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              animation: "scanflag-in 220ms cubic-bezier(0.18,0.89,0.32,1.28) both",
            }}
          >
            {/* Crosshair */}
            <svg width={32} height={32} viewBox="-16 -16 32 32" style={{ flexShrink: 0 }}>
              <circle cx={0} cy={0} r={11} fill="none" stroke={SEVERITY_COLOR[sev]} strokeWidth={2} />
              <circle cx={0} cy={0} r={3} fill={SEVERITY_COLOR[sev]} />
              <line x1={-14} y1={0} x2={-5} y2={0} stroke={SEVERITY_COLOR[sev]} strokeWidth={2} />
              <line x1={14} y1={0} x2={5} y2={0} stroke={SEVERITY_COLOR[sev]} strokeWidth={2} />
              <line x1={0} y1={-14} x2={0} y2={-5} stroke={SEVERITY_COLOR[sev]} strokeWidth={2} />
              <line x1={0} y1={14} x2={0} y2={5} stroke={SEVERITY_COLOR[sev]} strokeWidth={2} />
            </svg>
            <div
              style={{
                background: "rgba(15,16,18,0.95)",
                border: `1px solid ${SEVERITY_COLOR[sev]}`,
                color: SEVERITY_COLOR[sev],
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                padding: "4px 8px",
                whiteSpace: "nowrap",
                boxShadow: `0 0 12px ${SEVERITY_COLOR[sev]}50`,
              }}
            >
              {sev} · {m.label}
            </div>
          </div>
        );
      })}

      {/* Progress bar — bottom-left */}
      {showProgressBar && (
        <div
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          <span style={{ color: "#A8B0BC", fontSize: 12, letterSpacing: "0.12em" }}>SCANNING</span>
          <div
            style={{
              flex: 1,
              height: 6,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.min(100, progress * 100)}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${scanColor}, #FF8A3D)`,
                boxShadow: `0 0 8px ${scanColor}`,
              }}
            />
          </div>
          <span style={{ color: scanColor, fontSize: 13, fontWeight: 700, minWidth: 46, textAlign: "right" }}>
            {Math.round(progress * 100)}%
          </span>
        </div>
      )}

      {/* Inline keyframes */}
      <style>{`
        @keyframes scanflag-in {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>
  );
};
