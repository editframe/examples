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
  // Concrete-gray ramp (memorized — pick from here, never invent grays).
  // Only the shades actually used across src/ are kept — see the aliases
  // below for gray900/gray950, which are referenced by hex directly.
  gray100: "#F7F7F7",
  gray400: "#A3A3A3", // secondary text on dark
  gray500: "#737373", // tertiary, dividers, prompt chars
  gray600: "#525252",
  gray700: "#404040",

  // Aliases
  bg: "#0A0A0A",       // default page bg ("Cod Gray" gray950)
  surface: "#171717",  // UI surface (terminal, card) (gray900)
  border: "#262626",   // subtle borders (gray800)
  textMuted: "#A3A3A3",
  fg: "#FFFFFF",

  // The brand accents — use ONE per scene, at moment of meaning only
  blue: "#0070F3", // links, primary, "dynamic" in Vercel concept diagrams

  // Concept-diagram accents (Delba canon — PPR / rendering model explainers)
  // These are the EXACT colors used in Vercel's PPR explainer diagrams:
  // static = purple, dynamic = blue. Used as a paired vocabulary.
  // Canonical brand purple per brand-rules-vercel.md is #7928CA. We use a
  // slightly elevated version of it for dark-bg legibility while keeping it
  // unmistakably in the brand purple family (not Tailwind violet).
  purple: "#9E4FFF", // "static" in concept diagrams — brand purple lifted for #0A0A0A
  purpleSoft: "#C7A4FF", // hover/secondary static
} as const;

export const fonts = {
  sans: '"Geist", system-ui, -apple-system, sans-serif',
  mono: '"Geist Mono", ui-monospace, "JetBrains Mono", monospace',
} as const;
