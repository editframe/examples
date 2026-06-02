<div align="center">

# Brand Rules — Vercel

Visual identity tokens, motion grammar, and voice guidelines for any
Editframe video carrying the **Vercel** brand. This file is the source of
truth — `src/lib/colors.ts` mirrors a subset of it for runtime use.

</div>

---

## The core idea

Vercel's visual language is **minimal, geometric, and dark**. Black-and-white with **a single blue accent**. The brand feels *instant*: sharp eases, tight stagger, no decoration. Decisions are made by removing things, not adding them.

If a Vercel asset looks busy, colorful, or rounded, it's wrong.

---

## Colors

| Token | Hex | Use |
|---|---|---|
| **Background (off-black)** | `#0A0A0A` | Primary canvas. **NEVER use pure `#000`** — Vercel intentionally uses near-black for screen comfort and to keep blacks "alive." This is a deliberate brand choice. |
| **Surface** | `#141414` | Cards, terminals, elevated panels (zinc-950-ish) |
| **Elevated** | `#262626` | Borders, dividers, second-level surfaces (zinc-800) |
| **Foreground (body)** | `#E5E5E5` | Default text on dark surfaces |
| **Foreground (headlines)** | `#FFFFFF` | Wordmark + headline weight only |
| **Muted** | `#A1A1AA` | Secondary text, captions, timestamps (zinc-400) |
| **Accent — Vercel Blue** | `#228DF2` | THE single accent. URLs, links, status pings, focused deploy markers. Use sparingly. |
| **Ready (green pill)** | `#10B981` | Deploy "Ready" success state only. Not a general-purpose green. |

### Color usage rules

- **One accent color per frame.** If you're tempted to use both blue *and* green in the same scene, you're decorating — stop.
- **Pure white is reserved for the wordmark.** Body text is `#E5E5E5` so the brand mark stays the brightest object on screen.
- **No gradients on backgrounds.** Flat `#0A0A0A`. Period. Vercel uses gradients only on hero illustrations, never as page chrome.
- **No translucency on text.** `rgba(255,255,255,0.8)` reads as "AI placeholder." Use `#A1A1AA` instead.

---

## Typography

| Family | Weights | Use |
|---|---|---|
| **Geist Sans** | 600 | Wordmark "Vercel" |
| **Geist Sans** | 500 | Headlines, scene titles |
| **Geist Sans** | 400 | Body, captions |
| **Geist Mono** | 400 | Code, terminal output, file paths, deploy URLs |

```css
font-family: 'Geist', 'Geist Sans', system-ui, -apple-system, sans-serif;
font-family: 'Geist Mono', 'JetBrains Mono', ui-monospace, monospace;
```

### Wordmark setting

```css
font-family: 'Geist', system-ui, sans-serif;
font-weight: 600;
letter-spacing: -0.02em;
text-rendering: geometricPrecision;   /* critical — Editframe headless render
                                         leaves the wordmark fuzzy without it */
```

### Type scale

- Hero wordmark: 96–120px
- Scene headline: 64–80px
- Body / log line: 24–28px
- Caption / timestamp: 16–18px
- Mono terminal: 22–26px

---

## Logo lockup

The Vercel mark is a **filled triangle** ▲ paired with the wordmark "Vercel". The two are inseparable in marketing motion contexts — the standalone triangle is reserved for product UI.

### 🚨 Critical: lockup positioning

**Flex-center the lockup. Do NOT use `absolute + translate(-50%, -50%)`.**

```tsx
// ✅ CORRECT — flex-centered, renders correctly headless
<div style={{
  position: 'absolute', inset: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
    <Triangle />
    <Wordmark />
  </div>
</div>

// ❌ WRONG — Editframe headless renderer offsets this by ~120px vertically
<div style={{
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
}}>
```

This is a verified Editframe rendering bug, not a CSS gotcha. The headless Chromium pipeline mismeasures the lockup's bounding box when the position is derived from `transform: translate`. Always use flex.

### Triangle proportions

The triangle is an equilateral, point-up, filled white on dark backgrounds (or filled black on light). Stroke version is incorrect — Vercel's mark is always solid.

```
height = 0.88 × wordmark-height
gap    = 0.25 × wordmark-height
```

---

## Motion language

Vercel's motion is **precise, geometric, fast**. Builds happen instantly; the UI confirms them with a tight bounce. Avoid bouncy springs and decorative overshoot.

| Token | Value | Use |
|---|---|---|
| Primary ease | `cubic-bezier(0.77, 0, 0.175, 1)` (`outQuart`) | Headlines, lockups, cards |
| Stagger | 80–150ms | List items, log lines, file-tree entries |
| Transition duration | 200–400ms | Most scene-internal transitions |
| Scene-to-scene | Hard cut or 12-frame fade | No long crossfades |

### Do

- Hold elements still after they arrive. Vercel doesn't drift or breathe.
- Cut, don't dissolve, between scenes.
- Use blue pings (~6–8 frames) to mark moments of success.

### Don't

- Spring overshoot greater than 5%.
- Letter-by-letter typewriter on headlines (terminal lines only — and even then, fast: 50+ chars/s).
- Floating particle backgrounds.

---

## Voice & tone

| Tone | Example | Anti-example |
|---|---|---|
| Confident, infrastructure-grade | "Ship in seconds." | "Lightning-Fast Cloud Platform of the Future!" |
| Plain, declarative | "Deploy on push." | "Effortless deployment magic." |
| Developer-first | "`vercel deploy`" | "Click here to deploy your application" |
| Quietly impressive | "Ready · 4.2s" | "🚀 SUPER FAST DEPLOY COMPLETED ✨" |

No exclamation marks in marketing copy. No emoji in product UI. Numbers do the bragging.

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use `#0A0A0A` for backgrounds | Use pure `#000` — kills the subtle warmth of the brand |
| Flex-center the logo lockup | `position: absolute + translate(-50%,-50%)` — broken under headless render |
| Use blue (`#228DF2`) as the SINGLE accent | Mix blue + green + purple in one frame |
| Use Geist Sans/Mono with `geometricPrecision` | Default browser anti-aliasing — wordmark goes fuzzy |
| Hard-cut between scenes | Long crossfades — Vercel motion is instant |
| Plain declarative copy ("Deploy on push.") | Marketing-speak with exclamation marks |
| Filled triangle mark | Stroke / outline triangle — never used |
| `#E5E5E5` for body text on dark | Translucent white (`rgba(255,255,255,0.8)`) — reads as placeholder |

---

## Quick CSS reference

```css
:root {
  --vercel-bg:         #0A0A0A;   /* NEVER #000 */
  --vercel-surface:    #141414;
  --vercel-elevated:   #262626;
  --vercel-fg:         #E5E5E5;
  --vercel-fg-strong:  #FFFFFF;
  --vercel-muted:      #A1A1AA;
  --vercel-blue:       #228DF2;
  --vercel-ready:      #10B981;
}

body { background: var(--vercel-bg); color: var(--vercel-fg); }

.wordmark {
  font-family: 'Geist', system-ui, sans-serif;
  font-weight: 600;
  letter-spacing: -0.02em;
  text-rendering: geometricPrecision;
  color: var(--vercel-fg-strong);
}

.mono {
  font-family: 'Geist Mono', ui-monospace, monospace;
}
```

---

<div align="center">

Reference: [vercel.com](https://vercel.com) · [vercel.com/design](https://vercel.com/design) · [Geist font](https://vercel.com/font)

</div>
