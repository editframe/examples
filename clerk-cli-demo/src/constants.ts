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

// Total composition runtime — Terminal(11500) + Tagline(2000) + LogoCard(3500),
// hard-cut sequence (no overlap). Pins the root `<Audio>`'s duration so the music
// bed matches the sequence's resolved length (`<Audio>` has no `mode="fit"`).
export const DURATION_MS: number = 17000;
