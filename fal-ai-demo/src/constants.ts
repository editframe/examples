/**
 * Project-wide constants.
 *
 * TRACE_MODE — when true, every scene renders the reference video frame
 * underneath the JSX as a low-opacity blueprint. Agent uses this to visually
 * verify JSX aligns with the reference. For ship, flip to false.
 *
 * STRUCTURAL CONTRACT:
 *  - TraceLayer renders at z-index 0 (bottom) with opacity 0.5.
 *  - CreamBackdrop (and any other full-frame backdrop) returns null in
 *    TRACE_MODE so it doesn't occlude the ghost.
 *  - JSX layers render at z-index 1+ ON TOP of the trace.
 *  - This is what makes JSX-vs-ghost alignment visually checkable.
 */
export const TRACE_MODE: boolean = false;
export const TRACE_OPACITY: number = 0.5;

export const W = 1920;
export const H = 1080;
export const FPS = 30;

/**
 * ── SCENES ──
 * Each beat is its own `<Timegroup mode="fixed">` (see src/scenes/), sequenced by the
 * root `<Timegroup mode="sequence">` in Video.tsx with NO overlap — the reference edit
 * (FALAI.mp4) hard-cuts between beats (dashboard slams to violet, violet slams to white
 * logo card), so a crossfade `overlap` would change the intended look. Every scene
 * animates against its own local clock (`ownCurrentTimeMs`, reset to 0 at that scene's
 * start) — there is no shared master-ms clock read across scene boundaries.
 */
export const SCENES = {
  scene1: { duration: 8000, label: "nav walkthrough + Assets dashboard reveal" },
  scene2: { duration: 3200, label: '"Introducing fal Assets" reveal + typewriter' },
  scene3: { duration: 3200, label: "fal logo outro" },
} as const;

// Total composition length — sum of all scene durations (no overlap in this sequence).
export const TOTAL_MS =
  SCENES.scene1.duration + SCENES.scene2.duration + SCENES.scene3.duration; // 14400

// Absolute master-ms scene starts — derived once, so they can never drift out of sync
// with SCENES above. Nothing in the shipped animation reads these; they exist only for
// the (TRACE_MODE-only) TraceLayer debug overlay, which needs to know each scene's
// absolute offset into the reference video to look up the matching trace frame.
export const SCENE1_START_MS = 0;
export const SCENE2_START_MS = SCENE1_START_MS + SCENES.scene1.duration; // 8000
export const SCENE3_START_MS = SCENE2_START_MS + SCENES.scene2.duration; // 11200
