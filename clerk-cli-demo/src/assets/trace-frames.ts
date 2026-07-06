// AUTO-GENERATED — reference trace frames at 5fps
// Source: Clerk CLI.mp4
// Frame index N -> ms = N * 200
//
// Frames live as real files under src/assets/trace-frames/ (extracted from what
// used to be inline base64 JPEG strings in this file — see REFACTOR-PATTERNS.md
// Part 2a). Referenced by path instead of embedded so this file stays small and
// diffable; TraceLayer swaps the `<img>`'s `src` at runtime based on the current
// scene-local ms, which is why this stays a plain path array rather than
// `<Image>` elements (see TraceLayer.tsx for why that swap can't be expressed
// declaratively).

export const TRACE_FPS = 5;
export const TRACE_FRAME_INTERVAL_MS = 200;

export const TRACE_FRAMES: string[] = Array.from(
  { length: 85 },
  (_, i) => `/assets/trace-frames/frame-${String(i).padStart(4, "0")}.jpg`
);

export function getTraceFrameForMs(ms: number): string {
  const idx = Math.min(Math.max(0, Math.floor(ms / TRACE_FRAME_INTERVAL_MS)), TRACE_FRAMES.length - 1);
  return TRACE_FRAMES[idx];
}
