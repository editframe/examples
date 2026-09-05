import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { INTRO_MS } from "../constants";
import { track, lerp, lerpHex, outCubic, inCubic, inOutCubic, outBack, PAL } from "../helpers";
import { useFrameTask } from "../useFrameTask";

/**
 * S01 — Organic intro (defocus)  ·  0.0–1.5s
 *
 * Sage bg shifts toward lime as a heavily-defocused dark-green "stem" grows up
 * from bottom-center and a soft white "bloom" ball opens at its top. By the end
 * of the scene the bloom balloons into a big oval and a dark-green→lime
 * gradient develops — the onset of the S02 liquid morph.
 */
export const Scene01_Intro: React.FC = () => {
  const bgRef = useRef<HTMLDivElement>(null);
  const gradRef = useRef<HTMLDivElement>(null);
  const stalkRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
    const ms = ownCurrentTimeMs;

    // BG: sage -> lime
    const bgp = track(ms, 250, 850, inOutCubic);
    if (bgRef.current) bgRef.current.style.background = lerpHex(PAL.sage, PAL.lime, bgp);

    // Stem grows up from bottom + BENDS to the right as it rises
    const sp = track(ms, 80, 680, outCubic);
    if (stalkRef.current) {
      stalkRef.current.style.height = `${lerp(0, 790, sp)}px`;
      stalkRef.current.style.transform = `translateX(-50%) rotate(${lerp(0, 9, track(ms, 500, 1500, outCubic))}deg)`;
    }

    // Bloom: opens (overshoot) then balloons BIG toward the morph (front-loaded so it's already massive by ~ms1330)
    const bp = track(ms, 460, 1080, outBack);
    const ep = track(ms, 850, 1450, outCubic);
    const d = lerp(0, 460, bp) + lerp(0, 650, ep); // balanced: large by ~ms1330 but not over-massive
    if (ballRef.current) {
      ballRef.current.style.width = `${d * lerp(1, 1.20, ep)}px`;
      ballRef.current.style.height = `${d * lerp(1, 0.90, ep)}px`;
      ballRef.current.style.left = `${lerp(960, 1130, ep)}px`; // balloons toward the RIGHT, not left
      ballRef.current.style.top = `${lerp(358, 640, ep)}px`;
      ballRef.current.style.filter = `blur(${lerp(24, 14, ep)}px)`;
    }

    // Green morph shadow eases in on the RIGHT edge late in the scene (subtle, not a full dark sweep)
    const gp = track(ms, 1120, 1520, inOutCubic);
    if (gradRef.current) gradRef.current.style.opacity = String(gp);
  }, []);

  const frameRef = useFrameTask(handleFrame);
  return (
    <Timegroup mode="fixed" duration={`${INTRO_MS}ms`} ref={frameRef} className="absolute inset-0">
      <div ref={bgRef} style={{ position: "absolute", inset: 0, background: PAL.sage }} />
      <div
        ref={gradRef}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          background: `radial-gradient(120% 130% at 92% 52%, ${PAL.dgreenDeep} 0%, #1d7a42 26%, ${PAL.lime} 58%)`,
        }}
      />
      {/* defocused stem */}
      <div
        ref={stalkRef}
        style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          transform: "translateX(-50%)",
          width: 165,
          height: 0,
          background: PAL.dgreen,
          borderRadius: "90px 90px 0 0",
          transformOrigin: "bottom center",
          filter: "blur(32px)",
        }}
      />
      {/* defocused bloom ball */}
      <div
        ref={ballRef}
        style={{
          position: "absolute",
          left: 960,
          top: 358,
          width: 0,
          height: 0,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle at 50% 36%, #ffffff 0%, #ffffff 62%, #e7efdf 100%)",
          borderRadius: "50%",
          filter: "blur(34px)",
        }}
      />
    </Timegroup>
  );
};

export default Scene01_Intro;
