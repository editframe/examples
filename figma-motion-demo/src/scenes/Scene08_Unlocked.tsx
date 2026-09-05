import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { UNLOCKED_MS } from "../constants";
import { keys, PAL } from "../helpers";
import { useFrameTask } from "../useFrameTask";

/**
 * S08 — Purple "Unlocked"  ·  0.5s
 * The pill settles to a toggle: a dark coin at left reveals the Figma Motion
 * spark/eye mark; the word "Unlocked" reads across the pill.
 */
const COIN = "#2A0A6E";
const SPARK = "#8A5BFF";

export const Scene08_Unlocked: React.FC = () => {
  const coin = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);

  const reveal = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
    const ms = ownCurrentTimeMs;
    // knob slides left -> right, accelerating (left seat at 0, x759 at ms250, x1281 at ms417)
    const kx = keys(ms, [[0, 529], [250, 759], [417, 1281], [500, 1376]]);
    if (coin.current) coin.current.style.left = `${kx - 161}px`;
    // "Unlocked": faint ghost + solid reveal sweeping left->right BEHIND the knob — but only
    // once the knob is well right (ms250: still all-ghost; ms417: solid)
    if (word.current) word.current.style.opacity = String(0.28);
    if (reveal.current) reveal.current.style.width = `${Math.max(0, Math.min(1, (kx - 820) / 520)) * 585}px`;
  }, []);

  const frameRef = useFrameTask(handleFrame);
  return (
    <Timegroup mode="fixed" duration={`${UNLOCKED_MS}ms`} ref={frameRef} className="absolute inset-0" style={{ background: PAL.purple }}>
      {/* pill (x 325-1575, y 341-741) */}
      <div style={{ position: "absolute", left: 325, top: 341, width: 1250, height: 400, borderRadius: 200, background: PAL.lavender }} />
      {/* "Unlocked" — ghost layer + left->right solid reveal (EF ignores scaleX — plain sizing) */}
      <div ref={word} style={{ position: "absolute", left: 445, top: 462, width: 600, height: 160, overflow: "hidden", whiteSpace: "nowrap", opacity: 0.28 }}>
        <div style={{ fontFamily: 'Arial, Helvetica, "Segoe UI", sans-serif', fontWeight: 800, fontSize: 150, color: "#3D1D9E", lineHeight: 1, letterSpacing: -6 }}>Unlocked</div>
      </div>
      <div ref={reveal} style={{ position: "absolute", left: 445, top: 462, width: 0, height: 160, overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ fontFamily: 'Arial, Helvetica, "Segoe UI", sans-serif', fontWeight: 800, fontSize: 150, color: "#3D1D9E", lineHeight: 1, letterSpacing: -6 }}>Unlocked</div>
      </div>
      {/* knob: dark 322px circle + white almond eye + dark 4-point star */}
      <div ref={coin} style={{ position: "absolute", left: 368, top: 380, width: 322, height: 322 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: COIN }} />
        <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0 }} width="100%" height="100%">
          <ellipse cx="50" cy="51" rx="34" ry="20" fill="#fff" />
          <path d="M52 38 C53.5 47.5 56 49 83 51 C56 53 53.5 54.5 52 64 C50.5 54.5 48 53 37 51 C48 49 50.5 47.5 52 38 Z" fill="#2A0A6E" transform="rotate(16 55 51)" />
        </svg>
      </div>
    </Timegroup>
  );
};

export default Scene08_Unlocked;
