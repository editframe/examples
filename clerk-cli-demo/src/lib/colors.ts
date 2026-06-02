/**
 * Clerk canonical color system + brand tokens.
 * Canonical reference: see `brand-rules-clerk.md`.
 *
 * Hard rules:
 *   - NEVER use #000000 — use cc.bg (#0D0D0D) instead.
 *   - Purple is the ONLY accent. No blue, no green, no red.
 *   - Cyan (#67E8F9) is reserved for the install command only.
 *   - At most ONE accent hue per scene (purple OR cyan, not both).
 */

export const cc = {
  // Canvas
  bg:          "#0D0D0D", // near-black — the stage everything sits on
  surface:     "#131313", // macOS terminal window bg
  surface2:    "#1A1A1A", // slightly elevated surface if needed
  border:      "#2A2A2A", // hairline window borders, dividers

  // Text ramp
  fg:          "#FFFFFF", // primary text, commands, success lines
  fgMuted:     "#888888", // status lines, dim CLI output
  fgDim:       "#555555", // tree chars (|, L, corner), truly secondary

  // Brand purple family
  purple:      "#7C3AED", // Clerk canonical purple — gradient halos, success checks
  purpleHi:    "#9333EA", // elevated — CREATE/MODIFY action keywords
  purpleSoft:  "#A78BFA", // logo lavender arc, soft glow edges

  // Special — install command only
  cyan:        "#67E8F9", // "npm install -g clerk" in the outro card

  // macOS window chrome dots (exact Apple values)
  dotRed:      "#FF5F57",
  dotYellow:   "#FEBC2E",
  dotGreen:    "#28C840",
} as const;

export const fonts = {
  mono: '"JetBrains Mono", ui-monospace, "SF Mono", monospace',
  sans: '"Inter", system-ui, -apple-system, sans-serif',
} as const;
