/**
 * HexagonFormation — coral node-graph that forms flat (2D) then turns into a REAL 3D
 * wireframe hexagonal prism, then collapses to center and fades out.
 *
 *   • Form (0–800ms): the FRONT hexagon graph draws in, perfectly flat (2D).
 *   • Turn (820–1560ms): DEPTH grows from 0 and the prism ROTATES in 3D. Because
 *     depth starts at exactly 0, the first frame of the turn is identical to the
 *     flat graph — a smooth 2D→3D morph with NO hard cut. The front face keeps its
 *     exact dimensions; the back face + connector edges fade in as depth grows.
 *   • Collapse (1560–1900ms): the whole 3D form scales to the center and fades out.
 *
 * Real perspective (closer vertices larger) makes it read as a true 3D object.
 *
 * NOTE ON addFrameTask: every vertex is a software 3D→2D perspective projection
 * (rotation matrices around X/Y + a focal-length divide) recomputed per frame from a
 * single depth/rotation/collapse state. There is no CSS closed form for "N points on a
 * rotating extruded prism, individually perspective-projected onto 2D SVG coordinates
 * every frame" — CSS 3D transforms don't apply per-vertex to SVG `<circle>`/`<line>`
 * coordinates the way this projection does. Re-deriving this as real `transform-style:
 * preserve-3d` div geometry would be a from-scratch rebuild with real risk of visual
 * regression, so this is the one deliberately-kept, scene-scoped `addFrameTask` in this
 * composition (see REFACTOR-PATTERNS.md 2b, priority 5).
 *
 * 1920×1080 @ 30fps, bg #EAE8DE. First scene — its own local clock is the master clock.
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TraceLayer } from "../components/TraceLayer";
import { track, lerp, clamp, easeOutBack } from "@shared/utils/animation";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { eases } from "animejs";

export const HEXAGON_DURATION = 1900;
export const HEXAGON_START = 0;

const CORAL = "#D87757";

// ── Geometry (centered at origin for 3D math; screen offset added at projection) ──
const GCX = 960;
const GCY = 540;
const R   = 210;
const NODE_R = 32;

const OUTER_ANGLES_DEG = [90, 30, -30, -90, -150, 150];
// Base 2D positions: index 0 = center, 1..6 = outer (relative to origin)
const BASE2D: [number, number][] = [
  [0, 0],
  ...OUTER_ANGLES_DEG.map(deg => {
    const rad = (deg * Math.PI) / 180;
    return [R * Math.cos(rad), -R * Math.sin(rad)] as [number, number];
  }),
];

// 14 vertices: 0..6 = FRONT layer, 7..13 = BACK layer (extruded along +Z / -Z)
// Edges, grouped: front spokes+ring (12), back spokes+ring (12), connectors (7)
type EdgeKind = "front" | "back" | "conn";
interface Edge { a: number; b: number; kind: EdgeKind; }
const FRONT_PAIRS: [number, number][] = [
  [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],   // spokes
  [1,2],[2,3],[3,4],[4,5],[5,6],[6,1],   // ring
];
const EDGES: Edge[] = [
  ...FRONT_PAIRS.map(([a,b]) => ({ a, b, kind: "front" as EdgeKind })),
  ...FRONT_PAIRS.map(([a,b]) => ({ a: a+7, b: b+7, kind: "back" as EdgeKind })),
  ...[0,1,2,3,4,5,6].map(i => ({ a: i, b: i+7, kind: "conn" as EdgeKind })),
];

// ── Timeline ──
const NODE_CENTER_END   = 180;
const NODE_OUTER_BASE    = 80;
const NODE_OUTER_STAGGER = 60;
const NODE_OUTER_DUR     = 160;
const EDGE_BASE   = 350;
const EDGE_STAGGER = 22;
const EDGE_DUR    = 200;   // last front edge done ≈ 350 + 11*22 + 200 ≈ 792ms

const TURN_START   = 820;
const DEPTH_END    = 1460;
const COLLAPSE_START = 1560;
const COLLAPSE_END   = 1900;

// 3D params
const HALF_DEPTH_MAX = 112;   // extrusion (prism is 224 deep)
const ROT_Y_MAX_DEG  = 142;   // turn well past 90° so the 3D form clearly reads
const ROT_X_MAX_DEG  = 16;    // slight tilt for depth
const FOCAL          = 1500;  // perspective focal length (gentle)

const DEG = Math.PI / 180;

export function HexagonFormation(): React.ReactElement {
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([]);  // 14
  const edgeRefs = useRef<(SVGLineElement | null)[]>([]);    // 31
  const wrapRef  = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // ── 3D state ──
    const depthT = track(ms, TURN_START, DEPTH_END, eases.inOutCubic);
    const hz     = lerp(0, HALF_DEPTH_MAX, depthT);          // current half-depth
    const rotT   = track(ms, TURN_START, COLLAPSE_END, eases.outCubic);
    const aY     = rotT * ROT_Y_MAX_DEG * DEG;
    const aX     = track(ms, TURN_START, DEPTH_END, eases.outCubic) * ROT_X_MAX_DEG * DEG;

    const collapseT  = track(ms, COLLAPSE_START, COLLAPSE_END, eases.inCubic);
    const collapse   = lerp(1, 0, collapseT);               // scale 1→0
    if (wrapRef.current) wrapRef.current.style.opacity = String(lerp(1, 0, collapseT));

    const cY = Math.cos(aY), sY = Math.sin(aY);
    const cX = Math.cos(aX), sX = Math.sin(aX);

    // Project a centered 3D point → screen, returning {sx, sy, f}
    const project = (x: number, y: number, z: number) => {
      // rotate around Y
      const x1 = x * cY + z * sY;
      const z1 = -x * sY + z * cY;
      // rotate around X
      const y2 = y * cX - z1 * sX;
      const z2 = y * sX + z1 * cX;
      const fp = (FOCAL / (FOCAL + z2)) * collapse;
      return { sx: GCX + x1 * fp, sy: GCY + y2 * fp, f: fp };
    };

    // Vertex positions (0..6 front at +hz, 7..13 back at -hz)
    const proj: { sx: number; sy: number; f: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const [bx, by] = BASE2D[i];
      proj[i]     = project(bx, by, +hz);
      proj[i + 7] = project(bx, by, -hz);
    }

    // ── Nodes ──
    // Front center
    {
      const el = nodeRefs.current[0];
      if (el) {
        const t = track(ms, 0, NODE_CENTER_END, eases.outCubic);
        const p = proj[0];
        el.setAttribute("cx", String(p.sx));
        el.setAttribute("cy", String(p.sy));
        el.setAttribute("r", String(lerp(0, NODE_R, t) * p.f));
        el.setAttribute("opacity", String(clamp(t)));
      }
    }
    // Front outer (staggered pop-in)
    for (let i = 1; i <= 6; i++) {
      const el = nodeRefs.current[i];
      if (!el) continue;
      const start = NODE_OUTER_BASE + (i - 1) * NODE_OUTER_STAGGER;
      const t = track(ms, start, start + NODE_OUTER_DUR, easeOutBack);
      const p = proj[i];
      el.setAttribute("cx", String(p.sx));
      el.setAttribute("cy", String(p.sy));
      el.setAttribute("r", String(lerp(0, NODE_R, t) * p.f));
      el.setAttribute("opacity", String(clamp(t)));
    }
    // Back nodes (appear with depth)
    for (let i = 7; i <= 13; i++) {
      const el = nodeRefs.current[i];
      if (!el) continue;
      const p = proj[i];
      el.setAttribute("cx", String(p.sx));
      el.setAttribute("cy", String(p.sy));
      el.setAttribute("r", String(NODE_R * 0.82 * p.f));
      el.setAttribute("opacity", String(clamp(depthT)));
    }

    // ── Edges ──
    EDGES.forEach((edge, ei) => {
      const el = edgeRefs.current[ei];
      if (!el) return;
      const pa = proj[edge.a];
      const pb = proj[edge.b];
      el.setAttribute("x1", String(pa.sx));
      el.setAttribute("y1", String(pa.sy));
      el.setAttribute("x2", String(pb.sx));
      el.setAttribute("y2", String(pb.sy));

      if (edge.kind === "front") {
        // Draw-in during form via dash; full + projected afterward
        const start = EDGE_BASE + ei * EDGE_STAGGER;
        const dx = pb.sx - pa.sx, dy = pb.sy - pa.sy;
        const len = Math.sqrt(dx * dx + dy * dy) + 1;
        const t = track(ms, start, start + EDGE_DUR, eases.outCubic);
        el.setAttribute("stroke-dasharray", String(len));
        el.setAttribute("stroke-dashoffset", String(len * (1 - t)));
        el.setAttribute("opacity", ms >= start ? "1" : "0");
      } else {
        // Back face + connectors fade in with depth (invisible while flat)
        el.removeAttribute("stroke-dasharray");
        el.removeAttribute("stroke-dashoffset");
        el.setAttribute("opacity", String(clamp(depthT) * 0.92));
      }
    });
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration={`${HEXAGON_DURATION}ms`}
      onFrame={onFrame as any}
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0, width: 1920, height: 1080, overflow: "hidden" }}
    >
      <TraceLayer sceneStartMs={HEXAGON_START} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {!TRACE_MODE && (
        <div style={{ position: "absolute", inset: 0, background: "#EAE8DE", zIndex: 1 }} />
      )}

      <div
        ref={wrapRef}
        style={{ position: "absolute", inset: 0, zIndex: 2, willChange: "opacity" }}
      >
        <svg
          width={1920}
          height={1080}
          viewBox="0 0 1920 1080"
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
        >
          {/* EDGES (behind nodes). Back/connector edges thinner = depth cue. */}
          {EDGES.map((edge, ei) => (
            <line
              key={`edge-${ei}`}
              ref={el => { edgeRefs.current[ei] = el; }}
              stroke={CORAL}
              strokeWidth={edge.kind === "front" ? 18 : 13}
              strokeLinecap="round"
              opacity="0"
            />
          ))}
          {/* NODES — 14 (7 front, 7 back) */}
          {Array.from({ length: 14 }).map((_, i) => (
            <circle
              key={`node-${i}`}
              ref={el => { nodeRefs.current[i] = el; }}
              cx={GCX}
              cy={GCY}
              r={0}
              fill={CORAL}
              opacity="0"
            />
          ))}
        </svg>
      </div>
    </Timegroup>
  );
}

HexagonFormation.duration = HEXAGON_DURATION;
