# Fal.ai — Introducing fal Assets — Shot List
Reference: FALAI.mp4 (15.1s, 1280×720). Output: 1920×1080 @ 30fps.

---

## Scene 1 — Dashboard Zoom-In (0 → 7.59s, 7590ms)

**Background:** vivid medium purple `#7C3AED` (sampled from reference frames 0–7s)
**Content:** Fal.ai dashboard UI (dark `#111114` panel, full-width top bar)
- Nav: fal logo + "Alex Scott / Personal" avatar pill + tabs: Home | Explore | Generate | Assets (Beta) | Serverless | Compute | Workflows | Settings
- Cursor starts far right, sweeps left across nav tabs highlighting each one (Home → Explore → Generate → Assets Beta)
- Camera starts zoomed out (full dashboard at ~60% viewport), zooms in to ~140% focused on navbar
- Dashboard bg panel slides up from below on entry (0→500ms)

**Beat breakdown:**
- 0ms: dashboard slides up from off-screen bottom, purple bg is present
- 500ms: dashboard settles, cursor appears at Home tab
- 1000ms: cursor sweeps to Explore (underline animates)
- 2000ms: cursor sweeps to Generate
- 3000ms: cursor sweeps to Assets (underline to "Assets", "Beta" badge pops in)
- 4000-5000ms: hold on Assets tab active
- 5500ms: Assets page content fades in (left sidebar + Characters + Collections grid)
- 6000ms: camera zooms in tighter on the content
- 7200ms: content starts to scale/fade out (transitioning to Scene 2)
- 7590ms: HARD CUT to Scene 2

---

## Scene 2 — "Introducing fal Assets" Reveal (7590ms → 11219ms, 3629ms)

**Background:** deep purple `#4B0FE0` (darker than scene 1, sampled from frame_at_07590ms)
**Pixel decorations:** lighter purple `#8B5CF6` / `#A78BFA` chunky pixel-art squares at screen corners (top-left arrow cluster, top-right cluster, bottom-right pair) — persistent throughout scenes 2 & 3
**Active elements enter staggered:**
- 0ms (scene-local): bg is deep purple, pixel deco present
- 300ms: "Introducing" hot-pink pill slides in from left (x: -200 → 145px, lower-left quadrant at y≈460px on 1080p)
- 700ms: "fal Assets" large white/light-purple text slides up from below (y: +40px → 0)
- 1200ms: "Beta now available" monospace subtitle fades in below headline

**Hold state:** all three elements visible until end of scene (≈11.2s master)

---

## Scene 3 — Logo Card (11219ms → 15100ms, 3881ms)

**Background:** white `#FFFFFF` (abrupt cut from deep purple)
**Pixel decorations:** same chunky purple `#7C3AED` squares, repositioned — top-left cluster, top-right cluster, bottom-right pair (brighter/more saturated on white bg)
**Active elements:**
- 0ms (scene-local): fal gear logo icon appears center-screen, scale 0 → 1 with outBack overshoot
- 200ms: "fal" wordmark fades in to the right of the gear
- 300ms-3881ms: hold, logo drifts gently ±1.5px vertically (breathing motion)

**Logo description:**
- Gear icon: octagonal gear shape (same as fal.ai brand mark) in `#7C3AED`
- "fal" text: bold, same purple, same height as gear (~72px at 1080p)

---

## Timing constants (at 30fps)
- TOTAL_MS = 15100
- SCENE1_END = 7590
- SCENE2_START = 7590, SCENE2_END = 11219
- SCENE3_START = 11219, SCENE3_END = 15100
- Scene 2 duration = 3629ms
- Scene 3 duration = 3881ms

## Color palette sampled from frames
- Vivid purple bg (Scene 1): `#7C3AED`
- Deep purple bg (Scene 2): `#4B0FE0`  
- Pixel decorations on dark bg: `#8B5CF6` / `#A78BFA`
- Pixel decorations on white bg: `#7C3AED`
- Hot pink pill: `#F97171` (salmon-pink, NOT pure magenta — reference shows warm pink)
- Pill text: deep purple `#4B0FE0`
- Headline text: light purple / near-white `#C4B5FD`
- Subtitle: light purple mono `#C4B5FD`
- Dashboard bg: `#111114`
- White bg (Scene 3): `#FFFFFF`
