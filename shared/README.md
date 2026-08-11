# `shared/` — cross-example component library

Generic, non-brand-specific building blocks used by more than one example composition,
imported via the `@shared/*` path alias (wired into `tsconfig.json` and `vite.config.ts`).

```
shared/
├── components/   # Reveal, Sfx, TraceLayer, Camera, WindowChrome, ...
├── camera/       # the virtual-camera concept: types, resolveFrame, shot vocabulary, hook
├── styles/       # shared CSS keyframes/theme blocks, imported via @import from a project's styles.css
└── utils/        # small animation/math primitives (clamp, lerp, track, easings, ...)
```

## What belongs here

Only patterns duplicated (or near-duplicated) across **multiple** example folders. See
`REFACTOR-PATTERNS.md` and `BEST-PRACTICES.md` at the repo root for the composition
conventions these components assume (scene-local `Timegroup` clocks, `--ef-transition-*`
CSS vars, `<Reveal>`-style declarative CSS-first animation).

Bespoke, brand-specific components (logos, mascots, product cards, editorial chrome) stay
local to their example — this folder is for concepts, not one-off assets.

## Importing

```tsx
import { Reveal } from "@shared/components/Reveal";
import { clamp, lerp, track } from "@shared/utils/animation";
import { Camera } from "@shared/components/Camera";
import { dollyIn, tilt, holdAt } from "@shared/camera/shots";
```

Each example's own `styles.css` still owns any bespoke, scene-specific `@keyframes` — only
the generic, widely-duplicated keyframe blocks (e.g. `reveal-in`/`reveal-out`) move here.
