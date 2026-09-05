<div align="center">

# Extras — Drop-in Scene Components

Standalone, copy-paste-ready React components for common video patterns.
Each file is self-contained: no external imports beyond `react` and the
Editframe SDK, no shared helpers required.

</div>

---

## What's inside

| Component | What it does | Use it when |
|---|---|---|
| [`TransitionWipe.tsx`](TransitionWipe.tsx) | Animated diagonal wipe between two scenes | Cutting from one beat to the next without a hard cut |
| [`CaptionStrip.tsx`](CaptionStrip.tsx) | Lower-third typewriter caption with optional kicker | Narrating what's happening, broadcast-style |
| [`LowerThird.tsx`](LowerThird.tsx) | Speaker name + title bar that slides in from the left | Attributing a quote, intro'ing a person |
| [`ParticleField.tsx`](ParticleField.tsx) | Ambient drifting-particle background layer | Adding visual density to empty/flat scenes |
| [`BarChart.tsx`](BarChart.tsx) | Animated bars that grow from 0 → value | Showing metrics, before/after, comparisons |

---

## How to use one

Each component lives in its own file with full prop docs at the top. Workflow:

```bash
# 1. Copy the file into your scenes folder
cp extras/CaptionStrip.tsx src/components/

# 2. Import it in your scene
```

```tsx
import { CaptionStrip } from '../components/CaptionStrip';

export function MyScene() {
  return (
    <>
      {/* your scene content */}
      <CaptionStrip
        kicker="NOW IN BETA"
        text="Plan, then act."
        startFrame={30}
        endFrame={150}
      />
    </>
  );
}
```

Each component is brand-agnostic by default (accepts `color` / `accent` props). Plug in your `brand-rules-*.md` tokens to match your video's identity.

---

## Conventions used

- **Frame-driven, not time-driven.** Props accept `startFrame` / `endFrame` (30fps). Convert seconds to frames with `Math.round(seconds * 30)`.
- **No external helpers.** Each file inlines its own `clamp` / `lerp` / `easeOut` math so it's truly drop-in.
- **`pointerEvents: 'none'`** on absolutely-positioned overlays so they don't block interaction in the Editframe preview.
- **All animations clamp at boundaries.** Out-of-range frames return the static start/end state — no flickers on the edges.
