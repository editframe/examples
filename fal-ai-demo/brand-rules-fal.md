# Brand Rules — Fal.ai

## Identity

Fal.ai is a creative AI media infrastructure company. Their visual identity is bold, playful, and retro-futuristic. It feels like a creative studio that also happens to have state-of-the-art model infrastructure — not a cold enterprise SaaS.

Voice: playful, creator-first, slightly irreverent. "We make fast AI for real creators."

---

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| `bg-vivid-purple` | `#7C3AED` | Scene 1 background — vivid medium purple |
| `bg-deep-purple` | `#4B0FE0` | Scene 2 background — dramatic deep indigo-purple |
| `bg-white` | `#FFFFFF` | Scene 3 background — white logo card |
| `pixel-dark-bg` | `#8B5CF6` | Pixel-art squares on dark purple backgrounds |
| `pixel-dark-bg-light` | `#A78BFA` | Lighter pixel-art squares on dark purple |
| `pixel-white-bg` | `#7C3AED` | Pixel-art squares on white background (more saturated) |
| `pill-bg` | `#F97171` | "Introducing" pill background — warm salmon-pink |
| `pill-text` | `#4B0FE0` | Text inside pink pill — deep purple |
| `headline` | `#C4B5FD` | Large hero text on dark purple bg — light lavender |
| `subtitle-mono` | `#C4B5FD` | Monospace subtitle text on dark bg |
| `dashboard-dark` | `#111114` | Dashboard UI panel background |
| `dashboard-nav-text` | `#9CA3AF` | Inactive nav tab text |
| `dashboard-nav-active` | `#FFFFFF` | Active nav tab text |
| `dashboard-underline` | `#7C3AED` | Active tab underline color |
| `avatar-bg` | `#60A5FA` | Alex Scott avatar — sky-blue gradient |
| `beta-badge` | `#6B21A8` | "Beta" pill on Assets tab |

### Do not use
- Pure black `#000000` for any background
- Pure white `#FFFFFF` for body text (reserved for active nav states only)
- Gray text on dark backgrounds (always use a tinted lavender or white)

---

## Typography

**Primary font stack:** `'Inter', 'Plus Jakarta Sans', -apple-system, system-ui, sans-serif`

**Headline (Hero text):**
- Size: 160–180px at 1920×1080
- Weight: 700 (Bold)
- Letter-spacing: -0.03em
- Color: `#C4B5FD` (light lavender)
- Example: "fal Assets"

**"Introducing" Pill:**
- Font-size: 32px
- Weight: 700
- Text: deep purple on hot pink bg
- Padding: 10px 24px
- Border-radius: 12px (chunky, not fully round)

**Subtitle (monospace style):**
- Font: `'Courier New', 'Monaco', monospace` OR use `letter-spacing: 0.02em` with Inter
- Size: 32px
- Weight: 400
- Color: `#C4B5FD`
- Example: "Beta now available"

**Dashboard nav tabs:**
- Size: 28–32px at 1920×1080
- Weight: 400 (inactive) / 600 (active)
- Color: `#9CA3AF` (inactive) / `#FFFFFF` (active)

**Dashboard logo "fal" wordmark:**
- Size: 40px, Weight: 700, Color: `#FFFFFF`

---

## Pixel-Art Decoration System

### What it is
Chunky pixel squares scattered in the corners and edges of the frame. They form loose cluster patterns — some resemble arrows pointing inward, some are just scattered pairs. They ARE the brand decoration — not a background texture, but a signature visual element.

### Rules
1. **Axis-aligned only.** No rotation, no diagonal placement.
2. **Chunky sizing:** 12–28px squares at 1920×1080. Never smaller than 10px, never larger than 32px.
3. **No anti-aliasing on edges.** Render as hard rectangles (`border-radius: 0`, `image-rendering: pixelated`).
4. **Grouped in clusters:** 3–7 squares per cluster. Clusters appear near corners and edges.
5. **Not evenly distributed:** they cluster asymmetrically — top-left has the most squares (6–8), top-right has a few (3–4), bottom-right has a small pair (2–3).
6. **On dark bg:** use `#8B5CF6` and `#A78BFA` (two-tone).
7. **On white bg:** use `#7C3AED` only (single saturated color).
8. **They animate:** in Scene 2 entry they pop in with a small scale boop (0.5s stagger). In scenes 2–3 they drift very subtly (±2px, 3–4s period). This gives them life without distracting.
9. **They persist across scene cuts** (same positions, color changes with bg).

### Reference cluster positions (at 1920×1080)
Top-left cluster (largest): occupies roughly 30–160px from left, 100–240px from top
Top-right cluster: occupies roughly 1760–1920px from left, 30–220px from top  
Bottom-right pair: occupies roughly 1680–1760px from left, 680–760px from top
Top-center sparse: 1–2 isolated squares at ≈960px from left, 40–80px from top

---

## Motion Language

**Easing:** `outBack` with 1.3–1.7 overshoot for ALL entrances. Quick (200–350ms). Slightly past target then settle.

**Pill entrance:** slides in from left (translateX: -200px → 0) with outBack easing, 300ms.

**Headline entrance:** slides up (translateY: +40px → 0) + fade (opacity 0 → 1), outBack, 400ms. Stagger 700ms after pill.

**Logo entrance (Scene 3):** scale 0.7 → 1.05 → 1.0, outBack, 500ms. Center of screen.

**Pixel deco entrance:** each square pops from scale 0 → 1 with outBack, staggered 50–100ms apart.

**Camera (Scene 1):** slow zoom in over 7.59s from `scale(1.0)` to `scale(1.4)`. Camera LAGS action by 200ms.

**Cursor (Scene 1):** follows cubic-bezier arcs between nav tab positions.

**No duration longer than 4s without a new beat change.**

---

## Logo Construction (SVG-based, no image asset needed)

The fal.ai logo is:
1. An octagonal gear/sprocket shape — outer octagon with 8 teeth, circular hole in center
2. The wordmark "fal" — bold, lowercase, same color as gear

Gear can be approximated with a CSS/SVG polygon. Exact path not required — use an octagonal shape with rectangular teeth at each edge.

---

## What this brand is NOT

- NOT minimal white-on-black SaaS
- NOT "enterprise cloud platform" blue/gray
- NOT subtle or muted
- NOT gradient-heavy (keep colors flat, solid)
- NOT micro-font (text is BIG)
- NOT Figma / Vercel / Linear aesthetic

## What this brand IS

- Vivid purple everywhere — it IS the brand color
- Big chunky text that fills space
- Playful pixel-art decoration as a signature
- Warm pink as the ONE hot accent (pill/badge)
- Creator-first energy — you're making things, not managing infrastructure
