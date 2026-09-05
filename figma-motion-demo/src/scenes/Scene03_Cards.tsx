import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { CARDS_MS } from "../constants";
import { keys, track, outQuint, outCubic, flowerSpin, SPIN_OFF } from "../helpers";
import { useFrameTask } from "../useFrameTask";
import { ModernGarden } from "../components/ModernGarden";

/**
 * S03 — Cards form  ·  3.4–4.6s
 * Continues S02's zoom-out: from the Light Guide center card out to the full
 * "The Latest" 3-card site, then PAST full-frame so the light grey Figma editor
 * canvas (#D4D4D4) is revealed as margins and the site becomes a centered
 * floating artboard (~0.9 scale) — handing off to S04's editor reveal.
 */
export const Scene03_Cards: React.FC = () => {
  const wrap = useRef<HTMLDivElement>(null);
  const grunge = useRef<HTMLDivElement>(null);
  const leavesRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const foldLRef = useRef<HTMLDivElement>(null);
  const foldRRef = useRef<HTMLDivElement>(null);
  const topPairRef = useRef<HTMLDivElement>(null);
  const flowerRef = useRef<HTMLDivElement>(null);
  const handleFrame = useCallback(({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
    const ms = ownCurrentTimeMs;
    // LIGHT GUIDE windmill keeps spinning through the cards scene (continues the morph's rotation,
    // hands off seamlessly to S04) — head = spokes+petals rigid, so white petals rotate in sync.
    if (flowerRef.current) flowerRef.current.style.transform = `rotate(${flowerSpin(SPIN_OFF.s03 + ms)}deg)`;
    // Zoom-out: cards start LARGE and edge-cropped (1.5, continuing S02's handoff),
    // EXACTLY full-bleed at ms333 (1.0 — no grey margins until just after),
    // then to 0.92 by scene end, handing to S04's siteWrap start (0.92).
    const s = keys(ms, [[0, 1.5], [167, 1.18], [333, 1.0], [583, 0.92]], outCubic);
    if (wrap.current) wrap.current.style.transform = `translate(-50%,-50%) scale(${s})`;
    if (grunge.current) grunge.current.style.opacity = `${track(ms, 417, 583, outCubic)}`;
    // PLANT "growing up" entrance: the plant only TRANSLATES UP (no unfurl), ease-out with
    // no overshoot. S03 runs the first part of the one-time rise (+80% very low → +45%),
    // continuing seamlessly into S04 which finishes it (+45% → 0 settled). Both tiers of
    // paddles are always present/visible; dots appear once the rise settles.
    if (leavesRef.current) leavesRef.current.style.transform = `translateY(${keys(ms, [[0, 80], [583, 45]], outCubic)}%)`;
    if (topPairRef.current) topPairRef.current.style.opacity = "1";
    if (dotsRef.current) dotsRef.current.style.opacity = String(track(ms, 460, 540, outCubic)); // dots pop in as the rise settles
  }, []);
  const frameRef = useFrameTask(handleFrame);
  return (
    <Timegroup mode="fixed" duration={`${CARDS_MS}ms`} ref={frameRef} className="absolute inset-0" style={{ background: "#D4D4D4" }}>
      <div ref={wrap} style={{ position: "absolute", left: "50%", top: "50%", width: 1920, height: 1080, transformOrigin: "50% 46%", transform: "translate(-50%,-50%) scale(1.16)", willChange: "transform" }}>
        <ModernGarden cardRefs={{ plant: { leavesRef, dotsRef, foldLRef, foldRRef, topPairRef }, light: { flowerRef } }} />
      </div>
      {/* revealed grunge top strip (mirrors S04 editor opening) — outside the scaled site.
          SOLID muted grey-green bands (NOT a gradient — EF rasterizer mangles gradients into
          garbled purple/lavender+yellow-green streaks). Three close grey-green tones. */}
      <div ref={grunge} style={{ position: "absolute", top: 0, left: 0, right: 0, height: 14, opacity: 0 }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: "#48584A" }} />
        <div style={{ position: "absolute", top: 5, left: 0, right: 0, height: 5, background: "#404D42" }} />
        <div style={{ position: "absolute", top: 10, left: 0, right: 0, height: 4, background: "#384738" }} />
      </div>
    </Timegroup>
  );
};

export default Scene03_Cards;
