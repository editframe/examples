/**
 * Scene 2 — "Introducing fal Assets" Reveal (8200–11400ms master)
 * Scene-local duration: 3200ms
 *
 * REWORK v3 — reference-faithful:
 *  - Background: deep solid violet (#5B21B6 → #6D28D9) — NO drifting thumbnail tiles
 *  - Text is CRISP — NO transform/blur on text layers; all text rendered static in DOM
 *    with only opacity + translateY for reveal (NO filter:blur on text ever)
 *  - "fal Assets" builds in: "fal" visible first, then "Assets" slides in
 *  - Subline: TYPEWRITER reveal "Beta" → "Beta now" → "Beta now available"
 *  - Pixel squares: smaller, sparser, lighter opacity — matches reference's subtle corner squares
 *  - "Introducing" pill is smaller/tighter (reference: compact salmon pill)
 *  - No blurry font rasterization: using will-change: auto, no filter on text elements
 *
 * Beat breakdown (scene-local):
 *  0ms:    deep violet bg; corner pixel squares
 *  150ms:  "Introducing" pill fades in (no transform — crisp)
 *  500ms:  "fal" part of headline fades up — crisp
 *  900ms:  "Assets" part slides in from right
 *  1200ms: typewriter starts on "Beta now available"
 *  3200ms: end → Scene 3
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { track, lerp, clamp, outBack, typewriter } from "../components/helpers";
import { TraceLayer } from "../components/TraceLayer";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";

const SCENE_START_MS = 8000;
const SCENE_DURATION = 3200;

// ─── Pixel config — small, sparse, corner-hugging (matches reference) ────────
function lcg(s: number) {
  let state = s;
  return () => {
    state = (1664525 * state + 1013904223) & 0xffffffff;
    return (state >>> 0) / 0xffffffff;
  };
}

interface PixelCfg {
  x: number;
  y: number;
  w: number;
  h: number;
  cycleDuration: number;
  offset: number;
}

function buildPixels(count: number, seed: number): PixelCfg[] {
  const rand = lcg(seed * 31337 + 7919);
  const cfgs: PixelCfg[] = [];
  // Denser scatter across all quadrants — reference has pixel shards throughout
  const clusterCenters = [
    { cx: 60,   cy: 80  }, // top-left
    { cx: 1820, cy: 60  }, // top-right
    { cx: 1780, cy: 980 }, // bottom-right
    { cx: 40,   cy: 500 }, // left-middle
    { cx: 500,  cy: 30  }, // top-center-left
    { cx: 1400, cy: 50  }, // top-center-right
    { cx: 60,   cy: 880 }, // bottom-left
    { cx: 960,  cy: 80  }, // top-center
    { cx: 1820, cy: 500 }, // right-middle
    { cx: 300,  cy: 400 }, // left-upper-mid
    { cx: 1600, cy: 700 }, // right-lower-mid
    { cx: 700,  cy: 150 }, // upper spread
    { cx: 1200, cy: 200 }, // upper-right spread
  ];
  for (let i = 0; i < count; i++) {
    const cluster = clusterCenters[i % clusterCenters.length];
    const x = cluster.cx + (rand() - 0.5) * 160;
    const y = cluster.cy + (rand() - 0.5) * 120;
    // Small pixel squares (4–10px) — reference has tiny squares
    const baseSize = 4 + Math.floor(rand() * 7);
    const w = rand() > 0.65 ? baseSize * 2 : baseSize;
    const h = baseSize;
    cfgs.push({
      x: Math.round(x),
      y: Math.round(y),
      w,
      h,
      cycleDuration: 700 + Math.floor(rand() * 1000),
      offset: Math.floor(rand() * 2000),
    });
  }
  return cfgs;
}

const PIXEL_CFGS = buildPixels(32, 88); // denser — 32 pixels
// Reference pixel color: slightly lighter purple (lavender-ish, desaturated)
const PIXEL_COLOR = "#C8A0FF";

export function Scene2() {
  const pillRef        = useRef<HTMLDivElement>(null);
  const falWordRef     = useRef<HTMLSpanElement>(null);
  const assetsWordRef  = useRef<HTMLSpanElement>(null);
  const subtitleRef    = useRef<HTMLDivElement>(null);
  const pixelRefs      = useRef<Array<HTMLDivElement | null>>(Array(32).fill(null));

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    const pill       = pillRef.current;
    const falWord    = falWordRef.current;
    const assetsWord = assetsWordRef.current;
    const subtitle   = subtitleRef.current;

    // ── "Introducing" pill — simple fade-in, NO translate (crisp render) ──
    if (pill) {
      if (ms < 150) {
        pill.style.opacity = "0";
      } else {
        pill.style.opacity = String(Math.min(1, track(ms, 150, 450)));
      }
    }

    // ── "fal" word — fade + slight upward translate (kept minimal for crispness) ──
    if (falWord) {
      if (ms < 500) {
        falWord.style.opacity = "0";
        falWord.style.transform = "translateY(20px)";
      } else {
        const t = track(ms, 500, 850);
        falWord.style.opacity = String(t);
        falWord.style.transform = `translateY(${lerp(20, 0, t)}px)`;
      }
    }

    // ── "Assets" word — slides in from right after "fal" ──
    if (assetsWord) {
      if (ms < 900) {
        assetsWord.style.opacity = "0";
        assetsWord.style.transform = "translateX(40px)";
      } else {
        const t = track(ms, 900, 1150, outBack);
        assetsWord.style.opacity = String(Math.min(1, track(ms, 900, 1100)));
        assetsWord.style.transform = `translateX(${lerp(40, 0, t)}px)`;
      }
    }

    // ── Subtitle: TYPEWRITER reveal ──
    // "Beta now available" types in word-by-word: Beta → Beta now → Beta now available
    if (subtitle) {
      if (ms < 1200) {
        subtitle.style.opacity = "0";
        subtitle.textContent = "";
      } else {
        subtitle.style.opacity = "1";
        const tw = ms - 1200;
        // Each word appears every ~300ms
        if (tw < 300) {
          subtitle.textContent = "Beta";
        } else if (tw < 600) {
          subtitle.textContent = "Beta now";
        } else {
          subtitle.textContent = "Beta now available";
        }
      }
    }

    // ── Pixel animations — corner squares twinkling ──
    for (let i = 0; i < PIXEL_CFGS.length; i++) {
      const el = pixelRefs.current[i];
      if (!el) continue;
      const cfg = PIXEL_CFGS[i];
      const cycleMs = ((ms + cfg.offset) % cfg.cycleDuration + cfg.cycleDuration) % cfg.cycleDuration;
      const frac = cycleMs / cfg.cycleDuration;
      const fadeInEnd  = 0.15;
      const holdEnd    = 0.55;
      const fadeOutEnd = 0.70;
      let opacity = 0;
      if (frac < fadeInEnd)       opacity = frac / fadeInEnd;
      else if (frac < holdEnd)    opacity = 1;
      else if (frac < fadeOutEnd) opacity = 1 - (frac - holdEnd) / (fadeOutEnd - holdEnd);
      // Elevated opacity for visibility on violet bg
      el.style.opacity = String(Math.max(0, Math.min(1, opacity * 0.75)));
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration={`${SCENE_DURATION}ms`}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        // Reference: solid deep violet, no gradient tiles
        background: "#5B21B6",
      }}
    >
      <TraceLayer sceneStartMs={SCENE_START_MS} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* Scattered pixel squares — static positions, twinkle only */}
      {PIXEL_CFGS.map((cfg, i) => (
        <div
          key={i}
          ref={(el) => { pixelRefs.current[i] = el; }}
          style={{
            position: "absolute",
            left: cfg.x,
            top: cfg.y,
            width: cfg.w,
            height: cfg.h,
            background: PIXEL_COLOR,
            borderRadius: 1,
            opacity: 0,
            // NO willChange: transform — static position, only opacity animates
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      ))}

      {/* Text content — lower-left positioned, NO overflow/transform on container */}
      <div
        style={{
          position: "absolute",
          left: 100,
          bottom: 90,
          zIndex: 3,
          // CRITICAL: NO transform, NO filter, NO will-change on the text container
          // Text must render at pixel-perfect native resolution
        }}
      >
        {/* "Introducing" pill — compact, salmon, crisp */}
        <div
          ref={pillRef}
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "#FF7A8A",
            borderRadius: 6,
            padding: "5px 14px",
            marginBottom: 18,
            opacity: 0,
            // NO transform on this element — avoids sub-pixel blur
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "#ffffff",
              fontFamily: "'Inter', system-ui, sans-serif",
              letterSpacing: "0.2px",
              // Render hint: force sharp text
              WebkitFontSmoothing: "antialiased",
            } as React.CSSProperties}
          >
            Introducing
          </span>
        </div>

        {/* "fal Assets" headline — rendered as flex row for word-by-word reveal */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 0,
            marginBottom: 24,
            // CRITICAL: NO filter, NO blur, NO will-change on headline container
            // Large text at 1920×1080 must be razor-sharp
            lineHeight: 0.88,
          }}
        >
          <span
            ref={falWordRef}
            style={{
              fontSize: 260,
              fontWeight: 800,
              color: "#EEDDFF",
              fontFamily: "'Inter', system-ui, sans-serif",
              letterSpacing: "-8px",
              opacity: 0,
              // transformOrigin for translateY — minimal transform
              WebkitFontSmoothing: "antialiased",
            } as React.CSSProperties}
          >
            fal&nbsp;
          </span>
          <span
            ref={assetsWordRef}
            style={{
              fontSize: 260,
              fontWeight: 800,
              color: "#EEDDFF",
              fontFamily: "'Inter', system-ui, sans-serif",
              letterSpacing: "-8px",
              opacity: 0,
              WebkitFontSmoothing: "antialiased",
            } as React.CSSProperties}
          >
            Assets
          </span>
        </div>

        {/* Subtitle — typewriter, monospace, crisp — white for legibility on violet */}
        <div
          ref={subtitleRef}
          style={{
            fontSize: 26,
            fontWeight: 600,
            color: "rgba(255, 255, 255, 0.92)",
            fontFamily: "'Courier New', Courier, monospace",
            letterSpacing: "2px",
            opacity: 0,
            // NO transform — just opacity-on
            WebkitFontSmoothing: "antialiased",
            minHeight: 36, // prevent layout shift during typewriter
          } as React.CSSProperties}
        >
          Beta now available
        </div>
      </div>

      {/* onFrame driver */}
      <Timegroup
        mode="fixed"
        duration={`${SCENE_DURATION}ms`}
        onFrame={onFrame as any}
        style={{ position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none" }}
      />
    </Timegroup>
  );
}

Scene2.duration = SCENE_DURATION;
