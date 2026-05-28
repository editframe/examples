/**
 * Claude / Anthropic brand tokens — CANONICAL.
 * Forked from skills/editframe-product-demos/reference/brand-rules-claude.md
 *
 * RULES:
 *   - Background is ALWAYS `bg.primary` (#FAF9F5) or `bg.cream` (#E5DECC) for panels.
 *   - Black is `fg.primary` (#141413) — never #000.
 *   - No drop shadows on text — EVER (client mandate).
 *   - No 3D transforms, no perspective.
 *   - Coral `accent.coral` used ONCE or twice per scene max.
 */
export const claude = {
  bg: {
    primary: "#DEDCD2",    // Anthropic tan canvas (peg-verified, NOT pure white)
    card: "#FBF9F5",       // off-white card surface (peg-verified, NOT pure white)
    cream: "#E5DECC",      // warmer accent panel
    lightGray: "#E8E6DC",  // subtle alt panel
    paper: "#F4F1E8",      // slightly warmer white for cards
  },
  fg: {
    primary: "#141413",    // warm black ink — NEVER #000
    secondary: "#6F6D65",  // darker mid-gray for body text — readable on cream
    tertiary: "#B0AEA5",   // captions / dividers / muted labels
    rule: "#D6D2C4",       // hairline divider on cream
  },
  accent: {
    coral: "#D97757",      // THE Claude warmth — used sparingly
    blue: "#6A9BCC",       // secondary — muted slate
    green: "#788C5D",      // tertiary — sage, not bright
  },
  state: {
    alert: "#C84A3A",      // muted brick, not safety-orange
    success: "#788C5D",    // brand sage
    warn: "#D9A05B",       // amber, paired w/ coral family
  },
  fonts: {
    display: "'Newsreader', 'Source Serif 4 Display', 'EB Garamond', 'Tiempos Headline', Georgia, serif",
    body: "'Space Grotesk', 'Styrene B Web', Inter, system-ui, sans-serif",
    ui: "'Space Grotesk', 'Styrene A Web', Inter, system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
  },
  weight: {
    displayHero: 400,      // Regular for serif hero — NEVER bold
    displayMedium: 500,    // for slight emphasis only
    bodyRegular: 400,
    bodyMedium: 500,
    bodyBold: 600,
  },
  letterSpacing: {
    display: "-0.01em",
    body: "0",
    ui: "0.02em",
  },
} as const;
