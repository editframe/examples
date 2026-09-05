import { useCallback, useRef } from "react";
import type { EFTimegroup } from "@editframe/elements";

export type FrameInfo = { ownCurrentTimeMs: number; durationMs: number };

/**
 * Registers a per-frame task on a Timegroup through its `initializer` — the
 * documented setup hook that also re-runs on render clones — using the
 * documented `addFrameTask` API. Pass the returned callback as the
 * Timegroup's `ref`:
 *
 *   const frameRef = useFrameTask(handleFrame);
 *   <Timegroup ref={frameRef} ...>
 *
 * The task must stay a pure function of `ownCurrentTimeMs` so renders are
 * deterministic. `taskRef` keeps the latest callback without re-binding.
 */
export function useFrameTask(task: (info: FrameInfo) => void) {
  const taskRef = useRef(task);
  taskRef.current = task;
  return useCallback((tg: EFTimegroup | null) => {
    if (!tg || (tg as any).__frameTaskBound) return;
    (tg as any).__frameTaskBound = true;
    tg.initializer = (instance) => {
      instance.addFrameTask((info) => taskRef.current(info as FrameInfo));
    };
  }, []);
}
