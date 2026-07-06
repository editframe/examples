/**
 * Clerk canonical color system + brand tokens.
 * Canonical reference: see `brand-rules-clerk.md`.
 *
 * Hard rules:
 *   - Purple is the ONLY accent. No blue, no green, no red.
 *   - At most ONE accent hue per scene.
 */

export const cc = {
  border:      "#2A2A2A", // hairline window borders, dividers

  // Text ramp
  fg:          "#FFFFFF", // primary text, commands, success lines
  fgMuted:     "#888888", // status lines, dim CLI output
  fgDim:       "#555555", // tree chars (|, L, corner), truly secondary

  // Brand purple family
  purpleHi:    "#9333EA", // elevated — CREATE/MODIFY action keywords
  purpleSoft:  "#A78BFA", // logo lavender arc, soft glow edges
} as const;

export const fonts = {
  mono: '"JetBrains Mono", ui-monospace, "SF Mono", monospace',
  sans: '"Inter", system-ui, -apple-system, sans-serif',
} as const;
