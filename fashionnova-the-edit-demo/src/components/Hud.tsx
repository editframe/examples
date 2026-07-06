import React, { useEffect, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { DURATION_MS, FPS, SILVER } from "../constants";
import { RegMark } from "./RegMark";

interface TimegroupElement extends HTMLElement {
  initializer?: (instance: TimegroupElement) => (() => void) | void;
  addFrameTask: (callback: (info: { ownCurrentTimeMs: number }) => void) => () => void;
}

const TOTAL_FRAMES = Math.round((DURATION_MS / 1000) * FPS);

/**
 * Persistent whole-video HUD chrome: 4 corner reg marks, a live "F 0000/0750" frame
 * counter, a static "FN · A/W 26" tag, and the master progress bar — a direct sibling of
 * the scene sequence (not nested in any one scene), so it never needs to know which beat
 * is currently playing.
 *
 * The progress bar is pure CSS (`width: calc(var(--ef-progress) * 100%)`) — no JS. The
 * frame counter is the ONE deliberate exception to "no addFrameTask" in this composition:
 * formatting a zero-padded live frame number as text has no closed-form CSS equivalent
 * (unlike a numeric position/opacity/width, text content can't be interpolated by
 * `--ef-progress`), so it keeps a single, narrowly-scoped frame task fed by this
 * component's own `<Timegroup>` — not a root-level switchboard driving unrelated scenes.
 */
export const Hud: React.FC = () => {
  const tgRef = useRef<TimegroupElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tg = tgRef.current;
    if (!tg) return;
    tg.initializer = (instance) =>
      instance.addFrameTask((info) => {
        const el = counterRef.current;
        if (!el) return;
        const frame = Math.floor((info.ownCurrentTimeMs / 1000) * FPS);
        el.textContent = `F ${String(frame).padStart(4, "0")} / ${TOTAL_FRAMES}`;
      });
    return () => {
      tg.initializer = undefined;
    };
  }, []);

  return (
    <Timegroup ref={tgRef} mode="fixed" duration={`${DURATION_MS}ms`} className="absolute inset-0 pointer-events-none">
      <RegMark style={{ left: 30, top: 30 }} />
      <RegMark style={{ right: 30, top: 30 }} />
      <RegMark style={{ left: 30, bottom: 30 }} />
      <RegMark style={{ right: 30, bottom: 30 }} />
      <div ref={counterRef} style={{ position: "absolute", left: 84, bottom: 38, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: "rgba(0,0,0,0.55)", mixBlendMode: "difference" }}>
        F 0000 / {TOTAL_FRAMES}
      </div>
      <div style={{ position: "absolute", right: 84, bottom: 38, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: "rgba(0,0,0,0.55)", mixBlendMode: "difference" }}>FN · A/W 26</div>
      {/* master progress bar — pure CSS, driven by this Timegroup's own --ef-progress */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 6, background: "rgba(0,0,0,0.12)" }}>
        <div style={{ height: "100%", width: "calc(var(--ef-progress) * 100%)", background: SILVER }} />
      </div>
    </Timegroup>
  );
};
