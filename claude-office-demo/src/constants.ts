/**
 * Project-wide constants.
 *
 * TRACE_MODE — when true, every scene renders a low-opacity reference frame
 * underneath the JSX (the "tracing paper" / blueprint). The build agent uses
 * this to visually verify JSX aligns 1:1 with the reference. For final ship,
 * flip to false and re-render.
 *
 * STRUCTURAL CONTRACT (do not break):
 *  - TraceLayer renders at z-index 0 (bottom) with opacity 0.5.
 *  - CreamBackdrop renders null when TRACE_MODE is true (avoids occluding trace).
 *  - JSX layers in scenes render at z-index 1+ ON TOP of the trace.
 *  - This is what makes "JSX vs ghost" alignment visually checkable.
 */
export const TRACE_MODE: boolean = false;
export const TRACE_OPACITY: number = 0.5;
