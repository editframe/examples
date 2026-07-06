# Editframe composition best practices

Declarative rules for authoring a new Editframe React video composition. Distilled from
`REFACTOR-PATTERNS.md` (which documents the smells/fixes from bringing existing projects
into line with these rules) — read that doc if you need the reasoning or worked examples;
this doc is just the destination state.

---

## 1. Structure: a tree of `Timegroup`s, not a master clock

A multi-beat video is a `mode="sequence"` of `mode="fixed"` scene `Timegroup`s, each with
its own local clock (`ownCurrentTimeMs` resets to 0 at every scene's start). It is **not** one
`Timegroup` spanning the whole video driven by a single `onFrame`/`addFrameTask` callback
that reads a master-ms clock and writes to refs.

```
TimelineRoot -> Video
  -> Timegroup (mode="contain", workbench — the composition root)
       -> Timegroup (mode="sequence", overlap="<N>ms")
            -> SceneA -> SceneB -> SceneC -> ...
                (each its own component, its own file under src/scenes/,
                 its own Timegroup mode="fixed")
       -> AmbientField (anything spanning every scene: grain, particles, texture)
       -> Audio (sibling of the sequence, NOT a child of it — see §4)
```

- One file per scene under `src/scenes/`. Each scene only knows about itself.
- **Overlap is uniform, not per-transition.** `overlap` is a prop on the `sequence`, not on
  a pair of scenes — pick one value for the whole sequence. Every scene's *declared*
  duration = nominal screen time **+ overlap, once, only if it has a predecessor** (the
  first scene's duration is unchanged). This is the only distribution where
  `sum(durations) - overlap*(n-1) == total`. Verify that arithmetic before writing numbers.
- **Sequencing auto-hides inactive scenes** (`display:none` out of range) — never
  reimplement container-level visibility/opacity gating.
- **Scene-boundary exits** use the CSS vars Editframe already computes per-`Timegroup`:
  `var(--ef-transition-out-start)` (= `duration - overlap`) and
  `var(--ef-transition-duration)` (= `overlap`). These live on the scene's own `Timegroup`
  and cascade to every plain child element via normal CSS custom-property inheritance.
- **Timing is always local.** Every event time in a scene is relative to that scene's own
  start (0 at scene start), never an absolute video-wide millisecond. Do the arithmetic for
  the whole file before writing JSX, don't eyeball it per element.

## 2. Animation: CSS first, `addFrameTask` last resort

In priority order:

1. **One-shot fade/float enter-exit** (the overwhelming majority of elements): a reusable
   `<Reveal enter={[delay,end]} exit="transition" y={20}>`-style component backed by shared
   `@keyframes`, with `exit="transition"` wired to
   `var(--ef-transition-out-start)`/`var(--ef-transition-duration)`.
   Cubic-bezier equivalents for common power-curve easings:
   `easeOutCubic ≈ cubic-bezier(0.33,1,0.68,1)`,
   `easeInCubic ≈ cubic-bezier(0.32,0,0.67,0)`,
   `easeInOutQuad ≈ cubic-bezier(0.45,0,0.55,1)`.
2. **Staggered repeated elements** (chips, grid tiles, corner marks): compute
   `animation-delay: base + i * stagger` once from the array index — never a `.forEach`
   that recomputes style every frame.
3. **Continuous/infinite ambient motion** (drift, bob, pulse): an infinite CSS
   `@keyframes ... infinite` loop; per-item phase variance is a **negative
   `animation-delay`** computed once at module scope from the item's index (CSS starts an
   infinite loop partway through its cycle with a negative delay — the direct replacement
   for `(ms + seed) % period` phase math). If an element needs both a loop and a discrete
   enter/exit, split it into an outer wrapper (enter/exit) + inner element (the loop) —
   don't encode both in one `@keyframes`.
4. **Shape morphs / multi-property transitions**: a bespoke pair of `@keyframes` (grow,
   then morph-on-exit) using the same transition-duration/out-start timing vars.
   `clip-path: circle(N% at x% y%)` handles circular wipes directly.
5. **Genuinely irreducible per-frame procedural math** is the only valid remaining use of
   `addFrameTask` — never force something into CSS with no reasonable closed form, but keep
   the frame task scoped to the one scene that needs it, never a root-level switchboard.

**Fill-mode correctness — audit every `@keyframes` you write:**
- `0%`/`from` differs from the element's un-animated CSS + has a delay → needs `backwards`
  (or `both`), or the element flashes its default state for the whole delay window.
- End state differs from un-animated CSS (a real transform/opacity, not a no-op like
  `translateY(0)`) → needs `forwards` (or `both`), or the element snaps back the instant the
  animation completes, before anything later takes over.
- When in doubt, use `both` — holding an end that didn't need holding is harmless; not
  holding one that did is a visible bug. Check `from`-state and `to`-state independently,
  for every `animation:` declaration.

## 3. Assets: real files, not embedded base64

- Product/lifestyle imagery, video, audio are real files under `src/assets/`, referenced by
  path (`<Image src="/assets/foo.jpg">`, `<Video src="/assets/clip.mp4">`,
  `<Audio src="/assets/bed.mp3">`) — never `data:` URIs inlined in `.ts`/`.tsx` source.
  `@editframe/react` resolves local asset paths the same way for all three elements.
- `<Image>` wraps a custom element, not a native `<img>` — no `alt` prop, and a `ref` is
  typed `useRef<HTMLElement>`, not `useRef<HTMLImageElement>`.
- Any asset that needs pre-processing (trimmed, faded, normalized, gain-adjusted) gets that
  processing done **once, offline, into the committed file** — never at render/build time.
  The shipped asset is already final; the composition just points at it.
- Everything a composition depends on lives inside `src/` so `vite-plugin-singlefile` can
  inline it into the portable single-HTML bundle. Nothing load-bearing lives in `public/`
  (Vite serves `public/` as-is, uninlined) or outside `src/` entirely.
- Delete dead assets and dead exports as you go — an asset or constant that's imported but
  never referenced anywhere in the composition gets deleted, not left in place "for later."

## 4. Audio: native `<Audio>`, never an external mux step

No two-step pipeline (render a silent placeholder, then shell out to `ffmpeg` to mux music/
SFX into a final file). Audio is part of the composition, authored the same way video and
images are.

- **Music bed** (spans the whole composition): a single
  `<Audio src="/assets/bed.mp3" volume={1} duration={`${TOTAL_MS}ms`} />`. `<Audio>` has no
  `mode="fit"` — pass an explicit `duration` matching the composition's total so it's pinned
  regardless of the source file's own length. Any fade-in/out, loudness normalization, or
  limiting is baked into the committed file offline (see §3) — never computed at render time.
- **SFX cues** (one-shot, tied to a moment): every temporal element — `<Audio>` included —
  supports an `offset` prop, its start time relative to its **parent `Timegroup`**. Place the
  cue as a plain `<Audio src="..." offset="Xs" duration="Ys" volume={v} />` sibling inside
  whichever scene contains that moment — no extra nested `Timegroup` needed just for timing.
  `sourceIn`/`sourceOut`/`trimStart`/`trimEnd` trim the source file itself.
- **`volume` is a plain number in `[0, 1]`.** It is not decibels and it is not a multiplier —
  a value like `1.5` or `2.2` throws at render time (`IndexSizeError`, out of range). If a
  source clip is too quiet, bake extra gain into the file offline (with a limiter to avoid
  clipping) and reference it at `volume={1}`, don't push the prop above 1.
- **Critical: `<Audio>` must be a sibling of the sequence, never a child of it.** A
  whole-composition audio bed belongs under an outer `mode="contain"` wrapper, as a sibling
  to the inner `mode="sequence"` — *not* as an extra child inside the `sequence` itself:

  ```tsx
  <Timegroup mode="contain" workbench className="w-[1920px] h-[1080px]">
    <Timegroup mode="sequence" className="absolute w-full h-full">
      <SceneA /> <SceneB /> <SceneC />
    </Timegroup>
    <Audio src={MUSIC} volume={1} duration={`${TOTAL_MS}ms`} />
  </Timegroup>
  ```

  Placing `<Audio>` directly inside `mode="sequence"` makes the renderer treat it as one
  more sequential beat — with a `duration` equal to the whole composition, this **silently
  doubles the total render length**. This is easy to get wrong and easy to miss without an
  actual render (see §6).
- No raw audio stems living outside `src/` (a top-level `audio/`/`footage/` folder
  referenced only by a shell script). If it's not imported by the composition, it doesn't
  ship.

## 5. Constants and dead-code hygiene

- Every exported timing/color/layout constant is either read by the code or deleted — never
  both a constant *and* a hardcoded duplicate of its value inline.
- No near-duplicate constants for the same value under two names.
- A quick grep-based usage count per exported name across `src/` finds all of the above in
  a couple of minutes; run it as a final pass before calling a composition done.

## 6. Verification

There is no visual/screenshot preview tool for React/Editframe compositions. The only way
to confirm a composition is correct — timing sums right, audio in range, no syntax errors,
no double-length renders — is an actual render: `npm install && npm run render`, then
inspect the output (`ffprobe` for duration/stream sanity, `ffmpeg -af volumedetect` for
"is this actually audible or silent"). Code that has never been rendered is not done, no
matter how clean it reads.

## 7. Repo/project scaffold conventions

- No `AGENTS.md`, `ASSETS.md`, `.cursor/`, `.github/` in a shipped example — these are
  internal agent-routing/tooling files, not part of the template. Fold anything
  load-bearing (e.g. asset licensing) into `CREDITS.md`/`LICENSE` instead.
- Every third-party asset (music, SFX, stock imagery) gets a `CREDITS.md` entry: title,
  source, license, commercial-use/attribution terms. If provenance can't be verified, say so
  explicitly rather than fabricating a citation.
- `package.json`: pinned `@editframe/*` version matching the rest of the fleet; full shared
  dependency scaffold even if a given composition doesn't use all of it; `repository.url`
  pointing at the canonical repo, not a fork; a single-pass `render` script
  (`editframe render -o output/demo.mp4`) with no shell-script chaining and no
  `-silent`/intermediate naming.
- `vite.config.ts` keeps the house `viteSingleFile` + `cacheDir` + `optimizeDeps` block so
  the CLI's render pass doesn't trigger a mid-render Vite reload.
- `.gitignore`: `output/*` ignored except `!output/demo.mp4` (the one shipped, final
  render) — no versioned/intermediate output filenames tracked or special-cased.
- README `License` section: `[MIT](LICENSE) — free for commercial use, no attribution
  required.` (+ a sentence on bundled-asset licensing if relevant).
