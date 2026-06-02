<div align="center">

# Brand Rules — Cursor

Visual identity guide for templates that ship the Cursor brand.
Cursor is a code editor — the brand language is precise, dark-mode-first,
and built around the same monospaced typography it ships in the IDE itself.
Follow these rules so forks stay on-brand without guessing.

</div>

---

## Colors

| Token | Hex | Use |
|---|---|---|
| Pure black | `#000000` | Outro lockup canvas, brand badges. Cursor uses true `#000` for the wordmark card — this is the one place pure black is correct. |
| Editor dark | `#1E1E1E` | The dominant editor canvas. Every code surface, every panel body. |
| Chrome | `#252526` | Tab strips, sidebars, status bars, the chrome layer just above the canvas. |
| Foreground | `#D4D4D4` | Primary editor text. Off-white, NOT pure white — matches VS Code Dark+. |
| Muted line | `#3C3C3C` | Hairline separators, panel borders. |
| Accent pink-purple | `#C084FC` → `#EC4899` | The Cursor "pulse" gradient. Reserved for: the cube notch on hover, the agent-active state, the brand pulse on outro. Never on body chrome. |

### Syntax token colors (when rendering code on screen)

| Token | Hex | Used for |
|---|---|---|
| Keyword | `#C586C0` | `import`, `export`, `function`, `const`, `if`, `return` |
| String | `#CE9178` | String literals, JSX text |
| Comment | `#6A9955` | `//` and `/* */` comments |
| Type | `#4EC9B0` | Class names, type annotations, JSX components |
| Variable | `#9CDCFE` | Identifiers, props, parameters |
| Number | `#B5CEA8` | Numeric literals |

> **Color rule of thumb**: 75% editor dark canvas, 15% chrome, 8% foreground text, 2% syntax accents. The pink-purple gradient is a singular brand moment — if it shows up more than once per scene, kill it.

---

## Typography

| Element | Font | Weight | Tracking |
|---|---|---|---|
| Cursor wordmark | Inter / Geist | 500–600 | Tight (-0.04em) |
| Headlines | Inter / Geist | 600 | -0.02em |
| Body / UI labels | Inter / Geist | 400–500 | Default |
| Editor / code | IBM Plex Mono / SF Mono / JetBrains Mono | 400 | Default |
| Inline keyboard hint | JetBrains Mono | 500 | Default |

Cursor's editor surface MUST use a real monospace — never a system fallback. Inter is the public-facing brand sans; pair them, don't blend them.

---

## Logo lockup

The Cursor mark is a 3D-ish cube with a single notched corner. The wordmark "Cursor" sits to its right with a tight gap (~38px at 1080p hero scale).

```tsx
<div style={{
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  alignItems: 'center',
  gap: 38,
}}>
  <IconCursorCube size={150} color="#FFFFFF" notch="#000000" />
  <div style={{
    color: '#FFFFFF',
    fontFamily: 'Inter, sans-serif',
    fontSize: 132,
    fontWeight: 500,
    letterSpacing: '-0.04em',
    lineHeight: 1,
  }}>Cursor</div>
</div>
```

Reference implementation: [`src/scenes/LogoCard.tsx`](src/scenes/LogoCard.tsx). The cube renders via [`src/components/JiraIcons.tsx`](src/components/JiraIcons.tsx) (`IconCursorCube`).

---

## Motion language

- **Snappy beats fast-easing.** Cursor's brand reads as *quick* — ~120ms is the typical micro-interaction window. Avoid 600–900ms cinematic eases (those belong to the Anthropic template).
- **Camera tracks the work.** Pan with what's being typed — never lead it, never lag more than 1 frame.
- **Hold on the agent state.** When the rotating "Cursor is …" status text plays, the camera HOLDS. Stillness sells the autonomy.
- **`outCubic` is the workhorse ease.** `outBack` only on the cube reveal. Linear is fine for camera zooms.
- **No paper grain, no ambient particles.** Cursor's surface is digital — clean panel edges, crisp 1px lines. Resist the urge to add atmospheric noise.
- **Single accent pulse on outro.** The pink-purple gradient flashes once on the cube during the LogoCard fade-in, then never again.

---

## Voice & tone

- **Technical, confident, no-nonsense.** "Edit code at the speed of thought." Not "Revolutionary AI-Powered IDE!"
- **Let the product speak.** Show real syntax, real Jira tickets, real agent output — not lorem ipsum.
- **No marketing exclamation marks.** "Cursor is reviewing the codebase" — period, not "Cursor is reviewing the codebase!"
- **Verbs in the imperative.** "Run the agent." "Open the file." Not "You can run the agent."

---

## What to avoid

| Don't | Why |
|---|---|
| Pure `#FFFFFF` body text | Use `#D4D4D4`. Pure white burns out against `#1E1E1E`. |
| Pink-purple gradient on UI chrome | The gradient is the brand pulse — singular moment, not a chrome accent. |
| System monospace (Courier, Consolas default) | Always specify Plex Mono / SF Mono / JetBrains Mono. The IDE feel is the whole point. |
| Slow cinematic eases | Cursor reads fast. ~120ms micro, ~400ms macro. Anything longer feels like the editor is lagging. |
| Drop shadows under panels | The brand is flat-dark, not layered-PowerPoint. Use 1px borders in `#3C3C3C`. |
| Bright background colors | The canvas is always dark. Light-mode Cursor is a deviation — don't ship templates in it. |
| Comic Sans / Arial / Times | Inter for sans, Plex/SF/JetBrains for mono. No exceptions. |

---

## Quick reference

```css
:root {
  --cursor-black:      #000000;
  --editor-dark:       #1E1E1E;
  --chrome:            #252526;
  --foreground:        #D4D4D4;
  --line-muted:        #3C3C3C;
  --accent-purple:     #C084FC;
  --accent-pink:       #EC4899;

  --syntax-keyword:    #C586C0;
  --syntax-string:     #CE9178;
  --syntax-comment:    #6A9955;
  --syntax-type:       #4EC9B0;
  --syntax-variable:   #9CDCFE;
  --syntax-number:     #B5CEA8;
}
```
