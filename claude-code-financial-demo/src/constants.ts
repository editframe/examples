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

/**
 * Shared crossfade window (ms) for the root `<Timegroup mode="sequence">` in Video.tsx.
 * Every scene's own declared duration = its original solo screen time + OVERLAP_MS,
 * once, except the first scene (see each scene file's own duration constant, and
 * REFACTOR-PATTERNS.md 2b for the derivation this keeps exact).
 */
export const OVERLAP_MS = 600;
