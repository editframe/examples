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
 * Composition total runtime. The root `<Timegroup mode="sequence">` in Video.tsx has no
 * `overlap` (hard cuts between every scene — see that file's own comment), so this is the
 * plain sum of every scene's own duration:
 * 5500 + 2000 + 6500 + 7500 + 2000 + 2000 + 1263 = 26763ms.
 * Used to pin the root `<Audio>` music bed's `duration` to the resolved sequence length
 * (`<Audio>` has no `mode="fit"`).
 */
export const TOTAL_MS = 26763;
