/**
 * Vercel concrete-gray system + brand accents.
 * Canonical reference: see `brand-rules-vercel.md`.
 *
 * Hard rules:
 *   - NEVER use #000000 — use vc.bg ( #0A0A0A ) instead.
 *   - NEVER use the cyan→magenta brand gradient — banned.
 *   - At most ONE accent per scene. Color is information, not decoration.
 */

export const vc = {
  // Concrete-gray ramp (memorized — pick from here, never invent grays)
  gray100: "#F7F7F7",
  gray200: "#E5E5E5",
  gray300: "#D4D4D4",
  gray400: "#A3A3A3", // secondary text on dark
  gray500: "#737373", // tertiary, dividers, prompt chars
  gray600: "#525252",
  gray700: "#404040",
  gray800: "#262626", // subtle borders on dark
  gray900: "#171717", // "Cod Gray" — most-shipped UI surface
  gray950: "#0A0A0A", // off-black — canonical default bg

  // Aliases
  bg: "#0A0A0A",       // default page bg
  surface: "#171717",  // UI surface (terminal, card)
  border: "#262626",   // subtle borders
  divider: "#737373",  // dividers + prompt chars
  textMuted: "#A3A3A3",
  fg: "#FFFFFF",

  // The brand accents — use ONE per scene, at moment of meaning only
  blue: "#0070F3",     // links, primary, "dynamic" in Vercel concept diagrams
  success: "#3FB950",  // "Ready" / deploy success — pure GitHub-style green (NOT mint-cyan; Vercel CLI uses true green)
  error: "#EE0000",
  warning: "#F5A623",

  // Concept-diagram accents (Delba canon — PPR / rendering model explainers)
  // These are the EXACT colors used in Vercel's PPR explainer diagrams:
  // static = purple, dynamic = blue. Used as a paired vocabulary.
  // Canonical brand purple per brand-rules-vercel.md is #7928CA. We use a
  // slightly elevated version of it for dark-bg legibility while keeping it
  // unmistakably in the brand purple family (not Tailwind violet).
  purple: "#9E4FFF",       // "static" in concept diagrams — brand purple lifted for #0A0A0A
  purpleSoft: "#C7A4FF",   // hover/secondary static
  purpleDeep: "#7928CA",   // canonical Vercel brand purple — solid fills
  blueSoft: "#60A5FA",     // streamed dynamic content highlight
} as const;

export const fonts = {
  sans: '"Geist", system-ui, -apple-system, sans-serif',
  mono: '"Geist Mono", ui-monospace, "JetBrains Mono", monospace',
} as const;
