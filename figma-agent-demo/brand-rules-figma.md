<div align="center">

# Brand Rules — Figma

Visual identity guide for templates that ship Figma's brand.
Follow these rules so forks stay on-brand without guessing.

</div>

---

## Colors

Figma's identity is built on a **five-circle composite mark**. Each circle is one of five vivid brand hues. The full palette below is what every Figma surface — from the editor to figma.com — actually uses.

| Token | Hex | Use |
|---|---|---|
| Figma red | `#F24E1E` | Top-left circle of the F mark. Hot accent — error states, urgent CTAs. |
| Figma orange | `#FF7262` | Middle-left circle (the "pink-orange"). Warm accent, hover states. |
| Figma purple | `#A259FF` | Top-right circle. **The iconic Figma purple** — primary brand accent. |
| Figma blue | `#1ABCFE` | Middle-right circle. Cool counterweight to the purple. |
| Figma green | `#0ACF83` | Bottom circle. Success states, "live" indicators. |
| Canvas dark | `#1E1E1E` | Dark-mode editor canvas. Foreground text → `#FFFFFF`. |
| Canvas light | `#F5F5F5` | Light-mode editor canvas. Foreground text → `#333333`. |
| UI purple | `#9747FF` | Selection / interaction purple inside the Figma editor (slightly deeper than brand purple). |
| UI blue | `#0D99FF` | The official "Figma blue" used for selection outlines and the multiplayer cursor accent. |
| Ink | `#333333` | Body text on light surfaces. Never use pure `#000` — Figma's foreground is intentionally a soft graphite. |

> **Color rule of thumb**: pick **one** of the five brand hues as the dominant accent per scene. Showing all five at once is reserved for the logo lockup. Sprinkling all five across UI chrome makes it look like a coloring book.

---

## Typography

Figma ships in **Inter** across every surface. Inter is Figma's house font; matching it is the single fastest way to make a screen "read as Figma."

| Element | Font | Weight | Tracking |
|---|---|---|---|
| Hero / wordmark | Inter | 600 | Tight (-0.01em) |
| Headlines | Inter | 600 | Default |
| Body / labels | Inter | 400–500 | Default |
| Property panel values | Inter | 400 | Default |
| Code / mono | JetBrains Mono / SF Mono | 400 | Default |

`textRendering: 'geometricPrecision'` on the logo lockup. Always.

---

## Logo lockup

The Figma mark is the iconic **5-circle composite F**:

- Top-left circle → **red** `#F24E1E`
- Middle-left circle → **orange** `#FF7262`
- Bottom-left circle → **purple** `#A259FF`
- Top-right circle → **green** `#0ACF83`
- Middle-right circle → **blue** `#1ABCFE`

Arranged as the letter F: 4 full circles plus 1 half-circle on the right edge. Canonical aspect ratio is **38×57** — never letterbox or stretch.

The lockup should be **flex-centered**. Never `absolute + translate(-50%, -50%)` — the Editframe headless renderer offsets that by ~120px. Verified bug, do not reinvestigate.

```tsx
<div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  gap: 24
}}>
  <FigmaLogo />
  <FigmaWordmark />
</div>
```

---

## Motion language

- **Playful, bouncy, slightly looser** than Cursor or Claude. Figma's tone is collaborative and creative, not surgical.
- **Use `outBack` easing** with a moderate-to-strong overshoot (1.4–1.7) for elements settling into place. Springy — but never goofy.
- **Stagger reveals 80–200ms** between sibling elements. Card grids that pop in *en masse* feel right; simultaneous reveals = chaos.
- **Camera lags the action by 100–300ms.** Never lead. A camera arriving before its subject feels wrong.
- **Cursors are first-class citizens.** Movement traces natural bezier arcs, click events trigger a tiny pulse. The cursor is the protagonist on the canvas.
- **Color picker swatches animate the hex.** When the user drags through hue, interpolate between actual RGB triples (`gsap.utils.interpolate`) — don't snap.
- **Density beats minimalism.** Empty canvas is a defect. Multiple panels, layer rows, property values ticking — Figma's screens are *busy* in a productive way.

---

## Voice & tone

- **Creative, collaborative, optimistic.** "Design together, ship faster." not "Disruptive AI-Powered Design Platform!"
- **Show the verb, not the adjective.** "Then go deep." beats "Powerful deep-design mode."
- **No jargon stacks.** "Agents" not "Autonomous Generative Design Workflows."
- **The product narrates itself.** A cursor clicking a Fill swatch and dragging through a hue bar tells the whole story — no caption needed.

---

## What to avoid

| Don't | Why |
|---|---|
| Pure `#000` background | Looks like a default. Use `#1E1E1E` for the editor's dark canvas. |
| All 5 brand colors on one element | Reserved for the logo. Anywhere else it reads as a rainbow gradient cliché. |
| Drop shadows under every panel | Reads "PowerPoint." Figma's chrome is mostly flat — depth comes from subtle 1px borders. |
| Brand purple as the entire canvas | Purple is an *accent*. A full-purple frame fights the mark. |
| Replacing Inter with a serif | Breaks the Figma read instantly. |
| Cursor without a name label | In a collaboration story, every cursor has a name. Anonymous cursors feel wrong. |
| Loud arcade SFX | Use soft clicks + key taps. The brand whispers. |

---

## Quick reference

```css
:root {
  /* Figma brand 5 */
  --figma-red:    #F24E1E;
  --figma-orange: #FF7262;
  --figma-purple: #A259FF;
  --figma-blue:   #1ABCFE;
  --figma-green:  #0ACF83;

  /* Editor surfaces */
  --canvas-dark:  #1E1E1E;
  --canvas-light: #F5F5F5;
  --ink:          #333333;
  --paper:        #FFFFFF;

  /* UI accents (in-editor) */
  --ui-purple:    #9747FF;
  --ui-blue:      #0D99FF;
}
```
