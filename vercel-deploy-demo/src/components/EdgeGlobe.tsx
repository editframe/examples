import React, { useRef, useImperativeHandle, forwardRef, useMemo } from "react";

/**
 * EdgeGlobe — 3D wireframe Earth with edge nodes.
 *
 * Imperative tick(ms, opts) drives:
 *   - axial rotation (continuous slow spin)
 *   - axial wobble
 *   - per-node "wave reached" lighting (waveT param 0..1)
 *   - origin pulse intensity (originPulse param 0..1)
 *
 * Renders ~30 edge nodes positioned at real-ish city lat/lon.
 * Uses CSS 3D transforms with perspective on parent.
 * Globe = wireframe SVG sphere (latitude + longitude rings + continent outlines).
 */

export type EdgeNode = {
  city: string;
  short: string;
  lat: number; // -90..90
  lon: number; // -180..180
  latencyMs: number;
};

// 32 real cities across continents
export const EDGE_NODES: EdgeNode[] = [
  { city: "San Francisco", short: "SFO", lat: 37.77, lon: -122.41, latencyMs: 12 },
  { city: "Los Angeles", short: "LAX", lat: 34.05, lon: -118.24, latencyMs: 18 },
  { city: "Seattle", short: "SEA", lat: 47.61, lon: -122.33, latencyMs: 22 },
  { city: "Denver", short: "DEN", lat: 39.74, lon: -104.99, latencyMs: 34 },
  { city: "Dallas", short: "DFW", lat: 32.78, lon: -96.8, latencyMs: 38 },
  { city: "Chicago", short: "ORD", lat: 41.88, lon: -87.63, latencyMs: 41 },
  { city: "Toronto", short: "YYZ", lat: 43.65, lon: -79.38, latencyMs: 44 },
  { city: "New York", short: "JFK", lat: 40.71, lon: -74.0, latencyMs: 47 },
  { city: "Miami", short: "MIA", lat: 25.76, lon: -80.19, latencyMs: 52 },
  { city: "Mexico City", short: "MEX", lat: 19.43, lon: -99.13, latencyMs: 55 },
  { city: "Bogotá", short: "BOG", lat: 4.71, lon: -74.07, latencyMs: 71 },
  { city: "São Paulo", short: "GRU", lat: -23.55, lon: -46.63, latencyMs: 89 },
  { city: "Santiago", short: "SCL", lat: -33.45, lon: -70.66, latencyMs: 94 },
  { city: "Buenos Aires", short: "EZE", lat: -34.6, lon: -58.38, latencyMs: 97 },
  { city: "London", short: "LHR", lat: 51.5, lon: -0.13, latencyMs: 76 },
  { city: "Dublin", short: "DUB", lat: 53.35, lon: -6.26, latencyMs: 79 },
  { city: "Paris", short: "CDG", lat: 48.86, lon: 2.35, latencyMs: 81 },
  { city: "Amsterdam", short: "AMS", lat: 52.37, lon: 4.9, latencyMs: 84 },
  { city: "Frankfurt", short: "FRA", lat: 50.11, lon: 8.68, latencyMs: 86 },
  { city: "Stockholm", short: "ARN", lat: 59.33, lon: 18.07, latencyMs: 92 },
  { city: "Madrid", short: "MAD", lat: 40.42, lon: -3.7, latencyMs: 87 },
  { city: "Lagos", short: "LOS", lat: 6.45, lon: 3.4, latencyMs: 134 },
  { city: "Cape Town", short: "CPT", lat: -33.92, lon: 18.42, latencyMs: 141 },
  { city: "Dubai", short: "DXB", lat: 25.27, lon: 55.3, latencyMs: 122 },
  { city: "Mumbai", short: "BOM", lat: 19.08, lon: 72.88, latencyMs: 138 },
  { city: "Singapore", short: "SIN", lat: 1.35, lon: 103.82, latencyMs: 156 },
  { city: "Hong Kong", short: "HKG", lat: 22.32, lon: 114.17, latencyMs: 164 },
  { city: "Tokyo", short: "NRT", lat: 35.68, lon: 139.69, latencyMs: 168 },
  { city: "Seoul", short: "ICN", lat: 37.55, lon: 126.99, latencyMs: 171 },
  { city: "Sydney", short: "SYD", lat: -33.87, lon: 151.21, latencyMs: 184 },
  { city: "Auckland", short: "AKL", lat: -36.85, lon: 174.76, latencyMs: 192 },
  { city: "Honolulu", short: "HNL", lat: 21.31, lon: -157.86, latencyMs: 108 },
];

// Origin node = San Francisco
export const ORIGIN_INDEX = 0;

// Project lat/lon to 3D (x,y,z) on unit sphere.
const project3D = (lat: number, lon: number, rot: number): [number, number, number] => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + rot) * (Math.PI / 180);
  const x = Math.sin(phi) * Math.cos(theta);
  const y = Math.cos(phi);
  const z = Math.sin(phi) * Math.sin(theta);
  return [x, y, z];
};

// Great-circle distance from origin to each node (in radians)
const greatCircleDist = (a: EdgeNode, b: EdgeNode): number => {
  const phi1 = (a.lat * Math.PI) / 180;
  const phi2 = (b.lat * Math.PI) / 180;
  const dPhi = ((b.lat - a.lat) * Math.PI) / 180;
  const dLam = ((b.lon - a.lon) * Math.PI) / 180;
  const x =
    Math.sin(dPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLam / 2) ** 2;
  return 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

export type EdgeGlobeHandle = {
  tick: (
    ms: number,
    opts?: {
      visible?: number; // 0..1
      waveT?: number; // 0..1 wave radius
      originPulse?: number; // 0..1 origin glow
      trafficT?: number; // 0..1 — multiplier for traffic particle visibility
      rotOffset?: number; // additional degrees of rotation
    }
  ) => void;
};

type Props = {
  radius?: number; // px radius of globe
  centerX?: number; // px
  centerY?: number; // px
  showLabels?: boolean;
  trafficCount?: number; // number of traffic particles to render
};

export const EdgeGlobe = forwardRef<EdgeGlobeHandle, Props>(
  ({ radius = 380, centerX = 960, centerY = 540, showLabels = true, trafficCount = 0 }, ref) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
    const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
    const originPulseRef = useRef<HTMLDivElement>(null);
    const waveRingRef = useRef<HTMLDivElement>(null);
    const waveRing2Ref = useRef<HTMLDivElement>(null);
    const latRingsRef = useRef<HTMLDivElement>(null);
    const trafficRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Pre-compute great-circle distances (max ~π = 3.14159)
    const origin = EDGE_NODES[ORIGIN_INDEX];
    const distances = useMemo(
      () => EDGE_NODES.map((n) => greatCircleDist(origin, n)),
      []
    );
    const MAX_DIST = Math.PI; // half-circle
    // Normalized arrival time per node (0..1)
    const arrivalT = useMemo(() => distances.map((d) => d / MAX_DIST), [distances]);

    // Pre-compute traffic particle config (origin city + destination node + speed)
    const trafficCfg = useMemo(() => {
      return Array.from({ length: trafficCount }).map((_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const r = (n: number) => ((seed * (n + 7)) % 233280) / 233280;
        // Particles originate from random surface points (representing user requests from continents)
        // and ping a random edge node, then return.
        const userLat = -55 + r(1) * 110; // -55..55
        const userLon = -170 + r(2) * 340;
        const destIdx = Math.floor(r(3) * EDGE_NODES.length);
        const dur = 1600 + r(4) * 1400; // 1.6-3.0s round trip
        const phase = r(5) * dur;
        const color = ["#00DFD8", "#FF0080", "#F9CB28", "#0070F3", "#50E3C2"][
          Math.floor(r(6) * 5)
        ];
        return { userLat, userLon, destIdx, dur, phase, color };
      });
    }, [trafficCount]);

    useImperativeHandle(ref, () => ({
      tick: (ms, opts = {}) => {
        const { visible = 1, waveT = 0, originPulse = 0, trafficT = 0, rotOffset = 0 } = opts;
        const w = wrapperRef.current;
        if (w) {
          w.style.opacity = String(visible);
        }

        // Base rotation anchors San Francisco (lon -122) to face camera.
        // theta = lon + rot; for z=max we want theta=90 → rot_base = 90 - (-122) = 212.
        // Slow drift: ±18° around base over 24s for "wobble" feel without losing SFO.
        const ROT_BASE = 212;
        const driftDeg = Math.sin(ms / 12000) * 18;
        const rot = ROT_BASE + driftDeg + rotOffset;
        const wobble = Math.sin(ms / 2400) * 1.8;

        // Position each node based on 3D projection
        EDGE_NODES.forEach((n, i) => {
          const [x3, y3, z3] = project3D(n.lat, n.lon, rot);
          const x2 = centerX + x3 * radius;
          const y2 = centerY + y3 * radius * Math.cos((22 * Math.PI) / 180); // axial tilt
          // Z-depth determines node size (perspective)
          const depth = (z3 + 1) / 2; // 0 (back) to 1 (front)
          const onFront = z3 > -0.15; // visible nodes are on front-ish hemisphere
          const sz = 6 + depth * 8;
          const baseOpacity = onFront ? 0.55 + depth * 0.45 : 0.05;

          // Wave: light up when waveT >= arrivalT[i]
          const aT = arrivalT[i];
          const reached = Math.max(0, Math.min(1, (waveT - aT) * 4 + 0.001));
          // After reached, sustained glow with slight pulse
          const sustained = waveT > aT ? 1 : 0;
          const flashWindow = waveT - aT;
          const flashAmp = flashWindow > 0 && flashWindow < 0.15 ? 1 - flashWindow / 0.15 : 0;

          const el = nodeRefs.current[i];
          if (el) {
            el.style.left = `${x2}px`;
            el.style.top = `${y2}px`;
            el.style.width = `${sz + flashAmp * 14}px`;
            el.style.height = `${sz + flashAmp * 14}px`;
            const glowSize = sz * (1.5 + flashAmp * 4 + sustained * 0.6);
            const lit = sustained > 0 ? 1 : reached;
            const color = lit > 0.5 ? "#00DFD8" : "#FAFAFA";
            const glowColor = lit > 0.5 ? "#00DFD8" : "#FAFAFA";
            el.style.background = color;
            el.style.boxShadow = `0 0 ${glowSize}px ${glowColor}${lit > 0.5 ? "BB" : "44"}, 0 0 ${
              glowSize * 2
            }px ${glowColor}${lit > 0.5 ? "55" : "11"}`;
            el.style.opacity = String(baseOpacity * visible);
            el.style.zIndex = String(Math.floor(z3 * 100 + 200));
            el.style.transform = "translate(-50%, -50%)";
          }

          // Label visibility — only front, only ~major cities, only when globe scene visible
          const lbl = labelRefs.current[i];
          if (lbl) {
            // Show labels for selected major hubs (reduced set + lat-based offset to avoid collisions)
            const MAJORS = new Set([
              "SFO", "JFK", "LHR", "NRT", "SYD", "GRU", "BOM",
            ]);
            const major = MAJORS.has(n.short);
            // Strict front-only (z > 0.3) to avoid back-hemisphere labels bleeding through
            const showLabel = showLabels && major && z3 > 0.3;
            // Offset label up-right for northern hemisphere, down-right for southern
            const labelDx = 14;
            const labelDy = n.lat >= 0 ? -10 : 18;
            lbl.style.left = `${x2 + labelDx}px`;
            lbl.style.top = `${y2 + labelDy}px`;
            lbl.style.opacity = String(showLabel ? 0.9 * visible * depth : 0);
            lbl.style.zIndex = String(Math.floor(z3 * 100 + 220));
          }
        });

        // Origin pulse — circle that grows + fades, positioned at origin node
        const [ox3, oy3, oz3] = project3D(origin.lat, origin.lon, rot);
        const ox2 = centerX + ox3 * radius;
        const oy2 = centerY + oy3 * radius * Math.cos((22 * Math.PI) / 180);
        // Cull pulse when origin is on far hemisphere (z < 0.05)
        const originVisible = oz3 > 0.05 ? 1 : 0;
        if (originPulseRef.current) {
          const pulse = originPulse;
          // Smaller, tighter pulse so it reads as a node-anchored snap, not a giant blob
          const size = 20 + pulse * 60;
          originPulseRef.current.style.left = `${ox2}px`;
          originPulseRef.current.style.top = `${oy2}px`;
          originPulseRef.current.style.width = `${size}px`;
          originPulseRef.current.style.height = `${size}px`;
          originPulseRef.current.style.opacity = String(pulse * 0.9 * visible * originVisible);
          originPulseRef.current.style.transform = "translate(-50%, -50%)";
        }

        // Expanding wave ring — visible 2D-projected ring centered at origin
        if (waveRingRef.current) {
          const ringRadius = waveT * radius * 2.2;
          const ringOpacity =
            waveT > 0 && waveT < 1 ? Math.min(1, (1 - waveT) * 1.5) : 0;
          waveRingRef.current.style.left = `${ox2}px`;
          waveRingRef.current.style.top = `${oy2}px`;
          waveRingRef.current.style.width = `${ringRadius * 2}px`;
          waveRingRef.current.style.height = `${ringRadius * 2}px`;
          waveRingRef.current.style.opacity = String(ringOpacity * visible * originVisible);
          waveRingRef.current.style.transform = "translate(-50%, -50%)";
        }
        if (waveRing2Ref.current) {
          // Second ring offset by 0.18 wave units (trailing)
          const ringRadius = Math.max(0, (waveT - 0.18) * radius * 2.2);
          const ringOpacity =
            waveT > 0.18 && waveT < 1.05
              ? Math.min(0.6, (1.05 - waveT) * 1.0)
              : 0;
          waveRing2Ref.current.style.left = `${ox2}px`;
          waveRing2Ref.current.style.top = `${oy2}px`;
          waveRing2Ref.current.style.width = `${ringRadius * 2}px`;
          waveRing2Ref.current.style.height = `${ringRadius * 2}px`;
          waveRing2Ref.current.style.opacity = String(ringOpacity * visible * originVisible);
          waveRing2Ref.current.style.transform = "translate(-50%, -50%)";
        }

        // Lat/lon globe rotation
        if (latRingsRef.current) {
          latRingsRef.current.style.transform = `translate(-50%, -50%) rotateZ(${
            wobble
          }deg) rotateX(22deg) rotateY(${rot}deg)`;
          latRingsRef.current.style.opacity = String(visible);
        }

        // Traffic particles — flowing from user lat/lon to dest, returning
        trafficCfg.forEach((cfg, i) => {
          const el = trafficRefs.current[i];
          if (!el) return;
          const local = (ms + cfg.phase) % cfg.dur;
          const t = local / cfg.dur; // 0..1 (out-and-back: 0..0.5 = out, 0.5..1 = back)
          const dest = EDGE_NODES[cfg.destIdx];
          // 3D position of source & destination on current rotated globe
          const [sx3, sy3, sz3] = project3D(cfg.userLat, cfg.userLon, rot);
          const [dx3, dy3, dz3] = project3D(dest.lat, dest.lon, rot);
          // Interpolation (slightly arced via curved Y)
          const moveT = t < 0.5 ? t * 2 : (1 - t) * 2; // out-and-back
          const ix = sx3 + (dx3 - sx3) * moveT;
          const iy = sy3 + (dy3 - sy3) * moveT;
          const iz = sz3 + (dz3 - sz3) * moveT;
          // Arc by bulging Z toward camera at midpoint
          const arc = Math.sin(moveT * Math.PI) * 0.18;
          const ixf = ix;
          const iyf = iy - arc * 0.3;
          const izf = iz + arc;
          const x2 = centerX + ixf * radius;
          const y2 =
            centerY + iyf * radius * Math.cos((22 * Math.PI) / 180);
          const depthF = (izf + 1) / 2;
          const onFront = izf > -0.2;
          const opacity = onFront ? trafficT * 0.8 * (0.4 + depthF) : 0;
          el.style.left = `${x2}px`;
          el.style.top = `${y2}px`;
          el.style.opacity = String(opacity);
          el.style.background = cfg.color;
          el.style.boxShadow = `0 0 ${8 + depthF * 12}px ${cfg.color}`;
          el.style.transform = "translate(-50%, -50%)";
          el.style.zIndex = String(Math.floor(izf * 100 + 250));
        });
      },
    }));

    // Generate longitude lines (vertical great circles) and latitude lines (horizontal)
    const longLines = useMemo(() => {
      const lines: { rotY: number }[] = [];
      for (let i = 0; i < 12; i++) lines.push({ rotY: i * 15 });
      return lines;
    }, []);
    const latLines = useMemo(() => {
      const lines: { lat: number }[] = [];
      for (let lat = -75; lat <= 75; lat += 15) lines.push({ lat });
      return lines;
    }, []);

    return (
      <div
        ref={wrapperRef}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          pointerEvents: "none",
          willChange: "opacity",
        }}
      >
        {/* Wireframe lat/lon sphere using nested CSS 3D rotations */}
        <div
          style={{
            position: "absolute",
            left: centerX,
            top: centerY,
            width: radius * 2,
            height: radius * 2,
            transform: "translate(-50%, -50%)",
            perspective: 1800,
            transformStyle: "preserve-3d",
            pointerEvents: "none",
          }}
        >
          <div
            ref={latRingsRef}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: radius * 2,
              height: radius * 2,
              transformStyle: "preserve-3d",
              transformOrigin: "center center",
              willChange: "transform",
            }}
          >
            {/* Longitude lines: rotated rings around Y axis */}
            {longLines.map((l, i) => (
              <div
                key={`long-${i}`}
                style={{
                  position: "absolute",
                  inset: 0,
                  border: "1px solid rgba(0, 223, 216, 0.18)",
                  borderRadius: "50%",
                  transform: `rotateY(${l.rotY}deg)`,
                  transformStyle: "preserve-3d",
                  boxShadow: "inset 0 0 60px rgba(0, 124, 240, 0.08)",
                }}
              />
            ))}
            {/* Latitude lines: thin horizontal ellipses scaled in Y */}
            {latLines.map((l, i) => {
              const r = Math.cos((l.lat * Math.PI) / 180);
              const y = -Math.sin((l.lat * Math.PI) / 180) * radius;
              return (
                <div
                  key={`lat-${i}`}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: radius * 2 * r,
                    height: radius * 2 * r,
                    border: "1px solid rgba(0, 223, 216, 0.14)",
                    borderRadius: "50%",
                    transform: `translate(-50%, -50%) translateY(${y}px) rotateX(90deg)`,
                    transformStyle: "preserve-3d",
                  }}
                />
              );
            })}
            {/* Equator highlight */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: radius * 2,
                height: radius * 2,
                border: "1.5px solid rgba(0, 223, 216, 0.4)",
                borderRadius: "50%",
                transform: "translate(-50%, -50%) rotateX(90deg)",
                transformStyle: "preserve-3d",
                boxShadow: "0 0 28px rgba(0, 223, 216, 0.3)",
              }}
            />
            {/* Prime meridian highlight */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: radius * 2,
                height: radius * 2,
                border: "1.5px solid rgba(0, 223, 216, 0.32)",
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
                transformStyle: "preserve-3d",
              }}
            />
          </div>
        </div>

        {/* Atmosphere glow ring */}
        <div
          style={{
            position: "absolute",
            left: centerX,
            top: centerY,
            width: radius * 2.2,
            height: radius * 2.2,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at center, transparent 44%, rgba(0,124,240,0.18) 50%, rgba(0,223,216,0.06) 60%, transparent 70%)",
            filter: "blur(2px)",
            pointerEvents: "none",
          }}
        />
        {/* Inner sphere darkening (gives globe a 'solid' feel without hiding wireframe) */}
        <div
          style={{
            position: "absolute",
            left: centerX,
            top: centerY,
            width: radius * 2,
            height: radius * 2,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, rgba(0,40,80,0.45) 0%, rgba(0,8,20,0.75) 60%, rgba(0,0,0,0.92) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Wave ring(s) emanating from origin */}
        <div
          ref={waveRingRef}
          style={{
            position: "absolute",
            border: "2px solid #00DFD8",
            borderRadius: "50%",
            opacity: 0,
            boxShadow: "0 0 30px rgba(0,223,216,0.5), inset 0 0 30px rgba(0,223,216,0.3)",
            pointerEvents: "none",
            zIndex: 240,
          }}
        />
        <div
          ref={waveRing2Ref}
          style={{
            position: "absolute",
            border: "1.5px solid #FF0080",
            borderRadius: "50%",
            opacity: 0,
            boxShadow: "0 0 22px rgba(255,0,128,0.4)",
            pointerEvents: "none",
            zIndex: 239,
          }}
        />

        {/* Origin pulse — circle behind origin node */}
        <div
          ref={originPulseRef}
          style={{
            position: "absolute",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, #00DFD8 0%, rgba(0,223,216,0.5) 40%, transparent 70%)",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 230,
          }}
        />

        {/* Traffic particles */}
        {trafficCfg.map((c, i) => (
          <div
            key={`tr-${i}`}
            ref={(el) => {
              trafficRefs.current[i] = el;
            }}
            style={{
              position: "absolute",
              width: 7,
              height: 7,
              borderRadius: "50%",
              opacity: 0,
              willChange: "transform, opacity",
            }}
          />
        ))}

        {/* Edge node markers */}
        {EDGE_NODES.map((n, i) => (
          <div
            key={n.short}
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
            style={{
              position: "absolute",
              borderRadius: "50%",
              willChange: "transform, opacity, box-shadow, width, height",
            }}
          />
        ))}

        {/* Node labels (only majors render visible) */}
        {EDGE_NODES.map((n, i) => (
          <div
            key={`lbl-${n.short}`}
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            style={{
              position: "absolute",
              fontFamily: "Geist Mono, ui-monospace, monospace",
              fontSize: 13,
              fontWeight: 500,
              color: "#FAFAFA",
              letterSpacing: "0.04em",
              opacity: 0,
              textShadow: "0 0 8px rgba(0,0,0,0.9), 0 0 14px rgba(0,223,216,0.4)",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: "#00DFD8" }}>{n.short}</span>{" "}
            <span style={{ opacity: 0.7 }}>{n.city}</span>
          </div>
        ))}
      </div>
    );
  }
);

EdgeGlobe.displayName = "EdgeGlobe";
