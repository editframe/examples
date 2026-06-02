<div align="center">

# Brand Rules — Clerk

Visual identity tokens, motion grammar, and voice guidelines for any
Editframe video carrying the **Clerk** brand. This file is the source of
truth — `src/lib/colors.ts` mirrors a subset of it for runtime use.

</div>

---

## The core idea

Clerk's visual language is **technical, modern, and purple-forward**. Pure near-black canvases with intense violet/purple radial gradient halos anchored to the bottom corners. The brand communicates *instant setup* — you go from nothing to authenticated in one CLI command. Motion is snappy, not floaty; confident, not playful.

If a Clerk asset looks retro, green-terminal, or minimal-sans-glow, it's wrong.

---

## Colors

| Token | Hex | Use |
|---|---|---|
| **Background (near-black)** | `#0D0D0D` | Primary canvas. **NEVER use pure `#000`** — Clerk uses near-black for a textured, alive feel. |
| **Terminal surface** | `#131313` | macOS terminal window background |
| **Elevated surface** | `#1A1A1A` | Slightly elevated panels if needed |
| **Border** | `#2A2A2A` | Hairline borders, window chrome dividers |
| **Foreground (primary)** | `#FFFFFF` | Commands, success lines, bright output |
| **Foreground (muted)** | `#888888` | Status lines, dim output, tree chars |
| **Foreground (dim)** | `#555555` | Tree structure chars (|, L, r, ◇) |
| **Brand purple** | `#7C3AED` | Clerk canonical purple — success checks (✓), gradient halo core |
| **Purple elevated** | `#9333EA` | CREATE/MODIFY action keywords, interactive elements |
| **Purple soft** | `#A78BFA` | Diamond progress indicators (◇), logo arc |
| **Cyan (install cmd only)** | `#67E8F9` | Reserved for `npm install -g clerk` in the outro card ONLY |

### Color usage rules

- **Purple is the only accent family.** No Vercel blue, no GitHub green, no red.
- **Cyan (`#67E8F9`) appears once** — the install command text in the logo outro. Nowhere else.
- **Gradient halos use purple** — radial gradient from `#7C3AED` core fading to transparent, placed bottom-left and bottom-right corners, ~800-900px radius, blurred 40-45px, `mix-blend-mode: screen`.
- **Never pure `#000000`** — use `#0D0D0D` for all backgrounds.

---

## Typography

| Family | Weights | Use |
|---|---|---|
| **JetBrains Mono** | 400, 600, 700 | All CLI output: commands, status lines, file paths, prefixes |
| **Inter** | 500, 600 | Tagline/headline cards ("Put your agent in control.") |

### Typography rules

- CLI text: `font-size: 15px`, `line-height: 24px` at base terminal zoom
- Tagline: `font-size: 80px`, `font-weight: 600` (line 1), `500` (line 2), `letter-spacing: -0.03em`
- Logo wordmark "clerk": Inter 600, `letter-spacing: -0.03em`
- **No translucency on text.** Use hex colors from the ramp, never `rgba()` for text.

---

## Logo

Clerk's logo has two parts:
1. **Icon** — A partial C-arc ring (opens right), lavender-to-purple gradient, with a person silhouette (head circle + shoulder arc) in the center. Colors: arc gradient `#A78BFA → #7C3AED`, person fill `#8B5CF6 → #6D28D9`.
2. **Wordmark** — "clerk" in Inter 600, white `#FFFFFF`, `letter-spacing: -0.03em`.

Icon and wordmark sit side-by-side, separated by ~0.3× icon-height gap.

---

## Terminal window chrome

Replicates macOS terminal exactly:
- Title bar: `#1C1C1C`, height 44px, bottom border `1px solid #2A2A2A`
- Traffic lights: red `#FF5F57`, yellow `#FEBC2E`, green `#28C840`, opacity 0.85, 12px circles with 8px gap
- Title text: `~/Dev/taskflow-web` or similar, 13px, `#888888`, centered
- Window border: `1px solid #2A2A2A`, `border-radius: 12px`
- Box shadow: `0 24px 80px rgba(0,0,0,0.65)`

---

## CLI output symbol vocabulary

| Symbol | Hex | Meaning |
|---|---|---|
| `r` | `#555555` | Sub-command prefix (Clerk's bracket-style indicator) |
| `◇` | `#A78BFA` | In-progress / pending (diamond outline) |
| `✓` | `#7C3AED` | Completed / confirmed (purple check) |
| `|` | `#555555` | Tree continuation line |
| `L` | `#555555` | Tree last-child connector |
| `CREATE` | `#9333EA` | File creation action (elevated purple, bold) |
| `MODIFY` | `#9333EA` | File modification action (elevated purple, bold) |

---

## Backdrop system

Clerk's signature visual: **two intense purple radial gradient halos** anchored at bottom corners.

```css
/* Bottom-left halo */
position: absolute;
left: -200px; bottom: -200px;
width: 900px; height: 900px;
border-radius: 50%;
background: radial-gradient(circle at center,
  rgba(124,58,237,0.72) 0%,
  rgba(124,58,237,0.35) 30%,
  rgba(88,28,235,0.12) 60%,
  transparent 80%);
filter: blur(40px);
mix-blend-mode: screen;

/* Bottom-right halo — slightly softer */
position: absolute;
right: -200px; bottom: -200px;
width: 850px; height: 850px;
/* same gradient, opacity 0.65 center */
filter: blur(45px);
mix-blend-mode: screen;
```

Film grain: SVG noise filter, opacity 0.04, repeat 256×256.

---

## Motion language

| Principle | Specification |
|---|---|
| **CLI line reveal** | Fade up: `translateY(6→0px)` + `opacity(0→1)` over 180ms, `eases.outCubic` |
| **Command typewriter** | Character-by-character, ~45ms/char average (total ~500ms for 11-char command) |
| **Camera zoom** | `scale(1.0→1.08→1.15)`, `eases.inOutCubic`, triggered after lines fill the frame |
| **Tagline reveal** | Line 1: `translateY(16→0)` + fade over 350ms. Line 2: stagger 200ms later. |
| **Logo fade** | `translateY(12→0)` + fade over 500ms, `eases.outCubic` |
| **Success line glow** | Purple text-shadow pulse: `0 0 8px rgba(124,58,237,0.6)` ramps in over 350ms on the "Clerk has been set up" line |
| **Scene transitions** | Sequence mode cross-dissolve — no hard cuts, no black seams |
| **Cursor blink** | 530ms interval, stops when command submits |

---

## Voice and tone

- **Technical, friendly** — not "AUTH SYSTEM DEPLOYED" but "Clerk has been set up in your project"
- **Lowercase for brand name** — "clerk" not "CLERK" in wordmark
- **Dev-realistic copy** — real file paths, real package names (`@clerk/nextjs`), real user accounts (`steve@clerk.dev`)
- **Understated success** — no exclamation marks, no emoji in CLI output

---

## What NOT to do

- No retro green-on-black terminal aesthetic
- No blue accent (that's Vercel's vocabulary)
- No spinning loading rings or gaudy progress bars
- No white background — ever
- No Comic Sans, no system serif
- No animations that overshoot (no `outBack` on text reveals — too bouncy for CLI)
- No more than 2 accent hues on screen simultaneously (purple family is ONE hue family)
