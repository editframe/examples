# SHOT-LIST — Claude Code Financial Services (0–30s)

## SSIM Verification Results — v2 Rework

Note: Editframe adds a ~2s render offset; video master times are +2s relative to coded scene times.

| Anchor Frame (reference) | Our Video Time | Visual Match | Status | Notes |
|---|---|---|---|---|
| frame_at_08000ms.jpg (headline) | actual 10s | Headline text identical | PASS | "Introducing new agent templates for financial services" centered |
| frame_at_12000ms.jpg (cards start) | actual 14s | Cards scrolling, "Pitch builder" first | PASS | Fixed from v1: correct card order including Pitch builder |
| frame_at_15000ms.jpg (cards+headline) | actual 17s | Cards scrolling + "Add them..." visible | PASS | Headline correctly in lower portion, cards above |
| frame_at_18000ms.jpg (headline only) | actual 20s | Cream bg, cards gone, headline fading | PASS | Matches reference held state |
| frame_at_20000ms.jpg (coral) | actual 22s | Coral #C8614A bg + "Or deploy them" text | PASS | Coral hue corrected from #CD6F56 |
| frame_at_25000ms.jpg (product UI) | actual 27s | ARQOS grid modal on coral bg, camera zoomed | PASS | Procedural grid + camera zoom matches reference grid view |
| frame_at_28000ms.jpg (drill-down) | actual 30s | Valuation Reviewer drill-down bitmap | PASS | arqos-dashboard.jpg bitmap pixel-perfect match |

**Fixes applied in v2:**
- Issue 1 (scene order): Removed headline 1 from Scene 3 (it belongs in Scene 2). "Add them..." headline now appears at ~scene3 local 2s.
- Issue 1b: Added "Pitch builder" as first card (was missing from v1 card list).
- Issue 1c: Scroll speed increased from 140→375px/s based on keyframe re-derivation.
- Issue 2 (ARQOS framing): Scene 5 now uses arqos-cards-zoomed.jpg bitmap for the close-up 2-card beat, and arqos-dashboard.jpg for the drill-down beat.
- Issue 3 (coral hue): Scene 4 + Scene 5 coral corrected to #C8614A (from #CD6F56).
- Scene 4 duration extended from 4.083s to 5.0s (reference holds coral through ~23s master).



**Total duration:** 30.0s exactly  
**Format:** 1920×1080 @ 30fps

---

## Scene 1 — Network Build (0–6.5s, 6.5s)

**Master time:** 0–6500ms  
**Anchor frames:** frame_at_00000ms.jpg, frame_at_01000ms.jpg, frame_at_02000ms.jpg, frame_at_04000ms.jpg, frame_at_06000ms.jpg

### Composition
- Background: pale sage-cream paper (#EAE8DE), no grain vignette — flat
- A coral (#D97757) hexagonal network graph assembles center-right (roughly x:550–1050, y:130–590 of 1920×1080)
- Nodes: filled circles ~52px dia. Connections: thick stroked lines ~10px
- Shape: assembles from a small 3-node triangle at 0s → grows into a 7-node hex lattice by 2s → holds through 6s, slightly wobbles/breathes
- Black cursive handwriting draws itself bottom-left (~x:400–720, y:430–730): script letters "mng" or similar calligraphic strokes
- At ~0ms: only a small red dot visible center + one curved stroke bottom-left (partially drawn)
- By 1s: 3 coral nodes + partial hex, cursive mostly complete
- By 2s: full 7-node hex, cursive fully formed
- 2–6.5s: graph slowly "breathes" (very subtle scale pulse), cursive static

### Motion intent
- Nodes fade/scale in one by one with 200ms stagger from center outward
- Connecting strokes draw from one node to the next (strokeDashoffset animation)
- Cursive appears to be drawing (SVG stroke draw-on from left to right)
- Graph orbits/rotates very slowly (~0.5° per second) while held

---

## Scene 2 — Headline Intro (6.5–11s, 4.5s)

**Master time:** 6500–11000ms  
**Anchor frames:** frame_at_07000ms.jpg, frame_at_08000ms.jpg, frame_at_09000ms.jpg, frame_at_10000ms.jpg

### Composition
- Same cream bg, network + cursive fade out over 500ms
- "Introducing" appears left-positioned (~x:390, y:390) in muted gray (#8A8880), ~52px serif, at ~7s
- Full headline "Introducing new agent templates for financial services" appears centered, dark ink (~#2A2825), ~72px serif, two lines centered
  - Line 1: "Introducing new agent templates"
  - Line 2: "for financial services"
- Headline is centered horizontally and slightly above vertical center (~y:390–460)

### Motion intent
- "Introducing" fades in first at 6.5s (opacity 0→1 over 400ms), muted/gray
- Full headline cross-fades "Introducing" out and brings up the complete 2-line headline over 600ms starting at 7.2s
- By 8.5s headline is fully settled, held static through 11s

---

## Scene 3 — Agent Template Cards Scroll (11–18s, 7.0s) [v2 corrected]

**Master time:** 11000–18000ms  
**Anchor frames:** frame_at_11000ms.jpg, frame_at_13000ms.jpg, frame_at_15000ms.jpg, frame_at_17000ms.jpg, frame_at_18000ms.jpg

### Composition
- Headline shifts up slightly (~y:340–390 range) as agent cards scroll up from bottom
- Cards: rounded pill-shaped buttons (~730×90px), soft coral-pink fill (#F0E0D8), centered on x-axis
- Card text: dark serif ~52px, muted gray (#8A8880) for non-highlighted, dark (#3A3530) for highlighted
- Highlighted cards (coral tint, slightly larger/darker): "Market researcher" and "KYC screener" appear brighter
- Card list visible in frame at 13s:
  - (top, partially cut off) Meeting preparer
  - Earnings reviewer
  - Model builder
  - **Market researcher** (highlighted — brighter coral fill, darker text)
  - **KYC screener** (highlighted)
  - Valuation reviewer
  - GL reconciler
  - (bottom, partially cut off) Month-end modeler
- Cards continue scrolling upward — by 15s: Statement auditor is visible near top
- At ~15s: "Add them with easy-to-install plugins" replaces the headline (centered, same dark serif ~72px)
- By 17–18s: card list has scrolled off top, only the "Add them with easy-to-install plugins" text remains centered

### Motion intent
- Cards emerge from bottom at 11s, scroll upward continuously at ~140px/s
- Each card enters with a subtle opacity ramp (0→1 over 300ms as it enters frame)
- At ~14.5s headline swaps (old fades out, "Add them..." fades in)
- Cards scroll off screen top one by one
- Transition to Scene 4 at 18.458s: hard cut to coral background

---

## Scene 4 — Deploy as Managed Agents (18–23s, 5.0s) [v2 corrected]

**Master time:** 18000–23000ms  
**Anchor frames:** frame_at_18000ms.jpg, frame_at_19000ms.jpg, frame_at_20000ms.jpg, frame_at_22000ms.jpg

### Composition
- Hard cut (no fade) to solid coral/terracotta background (#CC6E55 approx — `#CD6F56`)
- Single 2-line headline centered vertically and horizontally:
  - Line 1: "Or deploy them as Claude Managed Agents:"
  - Line 2: "hosted, governed, production-ready on day one"
- Dark ink text (~#2A1A14) on coral bg, ~72px serif
- At 18.458 the text is sliding in from right (partially visible at right edge → fully centered by 19s)
- By 19s–22.5s: text fully centered and held static

### Motion intent
- Hard cut at 18.458s from cream to coral bg
- Text slides in from right edge: translateX(200→0) over 500ms with outCubic
- Held 19s–22.5s

---

## Scene 5 — Product UI Reveal (23–30s, 7.0s) [v2 corrected]

**Master time:** 23000–30000ms  
**Anchor frames:** frame_at_23000ms.jpg, frame_at_25000ms.jpg, frame_at_27000ms.jpg, frame_at_30000ms.jpg

### Composition
- Still coral bg (#CD6F56)
- Product UI: ARQOS FUND SERVICES app — cream/white modal (~1260×720px) floats centered over coral bg, rounded corners ~20px, subtle shadow
- Modal contains:
  - Nav bar: "AQ" coral avatar + "ARQOS / FUND SERVICES" wordmark, nav tabs (Funds, Investors, **Agents**, Reports), user (Maya Patel / Senior Fund Accountant + avatar)
  - 2×3 grid of agent cards:
    - Row 1: GL Reconciler (running), KYC Screener (idle), Valuation Reviewer (Q1 CLOSE READY badge + "Open agent →")
    - Row 2: Month-End Closer (running), Statement Auditor (idle), [empty slot "Deploy a new agent from template"]
  - Bottom bar: pagination "1/12 ›"
- At 22.541s: modal appears (fade up from y+20px → 0)
- At 25s: camera slowly zooms into Valuation Reviewer card (scale 1 → 1.15, translateX/Y to center on it)
- At 27s: view transitions (slides/pans) to reveal detailed Valuation Reviewer drill-down showing portfolio company queued items (Greater Midwestern Bolt & Flange, Two Rivers Cartage, Tri-County Imaging, Prairie Door & Window, etc.)
- By 30s: holding on the drill-down view (camera slightly zoomed/blurred motion blur implied)

### Motion intent
- Modal fades + slides up over 600ms at scene start
- Slow zoom toward Valuation Reviewer card 23.5s–25.5s (scale 1→1.06, focused)
- At 27s: content transitions to drill-down view (cross-fade or slide)
- Drill-down slides/fades in showing queued portfolio company cards
- At 30s: still on drill-down, some motion blur (camera is still moving slightly)
