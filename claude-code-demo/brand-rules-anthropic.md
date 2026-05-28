<div align="center">

# Brand Rules — Anthropic / Claude

Visual identity guide for templates that ship Anthropic's Claude brand.
Follow these rules so forks stay on-brand without guessing.

</div>

---

## Colors

| Token | Hex | Use |
|---|---|---|
| Sage paper | `#C5DABF` | Primary canvas. Calm, organic, distinctly Claude. |
| Subtle paper | `#DEDCD2` | Alt canvas variant (used in `claude-security-demo`). |
| Warm black ink | `#141413` | Foreground, body text, terminal text. **Never** use pure `#000` — Anthropic's warm-black is intentionally off-black. |
| Coral accent | `#D97757` | The Anthropic "burst" color. Sparingly: highlights, callouts, the final logo flourish. Overusing it cheapens the brand. |
| Card surface | `#FBF9F5` | Elevated surfaces — terminals, cards, panels. Cooler than canvas, warmer than white. |
| Muted line | `#A8B89F` | Hairlines on sage canvas. Subtle separator. |

> **Color rule of thumb**: 70% sage canvas, 20% warm-black ink, 8% card surface, 2% coral accent. If coral is showing up everywhere, you've broken the hierarchy.

---

## Typography

| Element | Font | Weight | Tracking |
|---|---|---|---|
| Hero wordmark / outro | Anthropic display (serif) | 600 | Tight (-0.01em) |
| Headlines | System sans / Inter / Geist | 600 | Default |
| Body / labels | System sans / Inter / Geist | 400–500 | Default |
| Terminal / code | IBM Plex Mono / SF Mono | 400 | Default |
| Pixel mascot speech | Inter / system | 500 | Default |

`textRendering: 'geometricPrecision'` on the logo lockup. Always.

---

## Motion language

- **Camera lags the action by 100–300ms.** Never lead. A camera arriving before its subject feels wrong.
- **Stagger reveals 700–1200ms** between sibling elements. Simultaneous reveals = chaos.
- **Use `outBack` easing** for elements that "settle into place." Slight overshoot, then rest.
- **Density beats minimalism.** Empty white sage is a defect. Foreground particles, micro-animations, ambient grain, layered camera drift.
- **No 3D rotation on terminals.** They stay FLAT. Depth comes from `translateZ` on parent (with perspective), not card tilt.
- **Coral burst on outro.** Particles emanate from center, scale + fade. ~1.2s duration.

---

## Logo lockup

The Anthropic burst + "Claude" wordmark should be **flex-centered**. Never `absolute + translate(-50%, -50%)` — the Editframe headless renderer offsets that by ~120px. Verified bug, do not reinvestigate.

```tsx
<div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  gap: 24
}}>
  <AnthropicBurst />
  <ClaudeWordmark />
</div>
```

---

## Voice & tone

- **Calm, considered, never breathless.** No "BLAZING FAST" or "MIND-BLOWING."
- **Trust the visual to do the talking.** Headlines are short — "Plan, then act." not "Claude Code's Revolutionary New Planning Mode!"
- **No jargon stacks.** "Agents" not "Autonomous Agentic Workflows."

---

## What to avoid

| Don't | Why |
|---|---|
| Pure `#000` background | Cheapens the brand. Use `#141413`. |
| Drop shadows under everything | Reads "PowerPoint." Use translateZ + parallax instead. |
| Coral on more than 2 elements per frame | Coral is the singular accent. Repetition dilutes. |
| 3D terminal rotation | Anthropic's brand is FLAT, paper-like. |
| Comic Sans or Arial | If in doubt, use Inter or system sans. |
| Loud SFX / arcade beeps | Use subtle clicks, soft impacts. The brand whispers. |

---

## Quick reference

```css
:root {
  --paper-sage: #C5DABF;
  --paper-subtle: #DEDCD2;
  --ink: #141413;
  --coral: #D97757;
  --card: #FBF9F5;
  --line-muted: #A8B89F;
}
```
