# Refactor patterns for the examples repo

Working notes from an authorship-sync + code-smell pass on `allbirds-tree-runner-demo`.
The same smells fixed here exist in essentially every other project in this repo (see
"Where else this applies" under each pattern) — use this doc as a checklist when auditing
them. `allbirds-tree-runner-demo` is the reference implementation for every pattern below;
when in doubt, read its `src/` before guessing.

---

## Part 1 — the upstream author's changes (native `<Audio>`/`<Video>`, no post-mux)

When re-syncing a project from its original (public, non-Editframe-owned) author repo,
the thing to look for is whether they've moved off a **two-step ffmpeg post-mux pipeline**
onto **native timeline elements**. Concretely:

**Before (smell):**
- SDK renders a silent/placeholder composition (`editframe render -o output/demo-silent.mp4`).
- A separate `add-audio.sh` (or similar) shells out to `ffmpeg` afterward to composite real
  video clips into "well" placeholders and mux in a music track.
- Real footage lives in a top-level `audio/` (or `footage/`) folder, referenced only by the
  shell script, never imported into the composition itself.
- `package.json` has a `render` script pointing at `demo-silent.mp4`.

**After (fix):**
- Real clips move into `src/assets/` and are referenced directly with `<Video src="..." offset="..." duration="..." mute />` inside the composition, layered under a `<Image>` poster that fades out as the clip reveals.
- The music bed is a single `<Audio src="..." volume={1} />` on the composition timeline.
- `add-audio.sh` and the two-step pipeline are deleted entirely; `render` writes straight to
  `output/demo.mp4` in one pass.
- `package.json`/`.gitignore` no longer need `output/demo-silent.mp4` special-casing.

**Where else this applies:** any project whose `README.md`/`package.json` mentions a
post-render compositing script, `ffmpeg`, or an `audio/`/`footage/` folder sitting outside
`src/`. Check the upstream author's repo (if one exists) for a newer commit before assuming
this needs to be built from scratch — Noah's fix (b813da9 in the allbirds upstream) is the
worked example.

**Repo-wide conventions to preserve when re-syncing** (don't blindly take the upstream
diff — these are deliberately different from the public repo and must be re-applied):
- No `AGENTS.md`, `ASSETS.md`, `.cursor/`, `.github/` — these are agent-routing/internal-tooling
  files, stripped from every example in this repo. Fold anything load-bearing (e.g. an
  asset-licensing note) into `CREDITS.md`/`LICENSE` instead of restoring the file.
- `@editframe/*` pinned to whatever version every other example in this repo uses (check
  a sibling's `package.json` — don't take the upstream author's version bump).
- `vite.config.ts` keeps the house `viteSingleFile` + `cacheDir` + `optimizeDeps` block
  (needed so the CLI's render pass doesn't trigger a mid-render Vite reload) even if the
  upstream repo doesn't have it.
- `package.json` keeps the full house dependency set (`@fal-ai/client`, `animejs`, `gsap`,
  `three`, `vite-plugin-singlefile`, …) even if the specific composition doesn't use all of
  them — it's the shared scaffold template, not per-project cruft.
- `package.json` `repository.url` → `https://github.com/editframe/<dir-name>`, not the
  original author's fork.
- README `License` section wording: `[MIT](LICENSE) — free for commercial use, no
  attribution required.` (+ a sentence on bundled-asset licensing if relevant) — match a
  sibling's README, not the upstream author's phrasing.

---

## Part 2 — making a composition idiomatic and declarative

Two independent smells, usually found together, in nearly every project in this repo:

1. Product/lifestyle imagery embedded as base64 `data:` URIs directly in `.ts` source files.
2. One giant `<Timegroup mode="fixed" duration="25000ms">` for the whole video, driven by a
   single `onFrame`/`addFrameTask` callback that reads a master-ms clock and imperatively
   sets `ref.current.style.x = ...` for every element, every frame.

Both are fixable mechanically. Full worked example: `allbirds-tree-runner-demo/src/`.

### 2a. Base64-in-source → real files + `<Image>`

**Smell:** `src/assets.ts` / `src/assets_opt.ts` (or similar) exporting
`export const FOO = "data:image/png;base64,iVBORw0KG...”` — often thousands of characters
per line, sometimes the same imagery duplicated at two resolutions in two files.

**Fix:**
1. Write a small one-off Node script that regexes
   `export const (\w+) = "data:image\/(\w+);base64,([^"]+)";` out of the file(s),
   `Buffer.from(b64, "base64")`, and writes each to `src/assets/<kebab-name>.<ext>`
   (`jpeg`→`jpg`). Run it once, don't keep it in the repo.
2. Replace every `<img src={CONST}>` with `<Image src="/assets/<name>.<ext>">` from
   `@editframe/react` (it resolves local paths the same way `<Video>`/`<Audio>` do — see
   the `vite-plugin` skill's local-assets doc — and accepts a plain `data:` URI too, but
   there's no reason to keep one once you have a real file).
   `ref={x}` on an `<img>` typed `useRef<HTMLImageElement>` becomes `useRef<HTMLElement>`
   pointed at `<Image ref={x}>` (it wraps a custom element, not a native `<img>`).
3. Delete `assets.ts`/`assets_opt.ts` and their imports once nothing references them.
4. Audit for **unused** exports in the process — it's extremely common to find constants
   (colors, whole image exports) that are imported but never referenced anywhere in
   `Video.tsx`. Delete them; don't just move them.

**Where else this applies:** every project flagged with embedded base64 above (14 of 19).

### 2b. One `onFrame` switchboard → sequenced per-scene `Timegroup`s

This is the important one — a single fixed-duration `Timegroup` reading a master clock and
writing to refs isn't just verbose, it's the wrong Editframe mental model. Editframe's
composition model is a **tree of `Timegroup`s**; a multi-beat video is supposed to be a
`mode="sequence"` of `mode="fixed"` scene `Timegroup`s, each with its own local clock
(`ownCurrentTimeMs` resets to 0 at every scene's start — see `time-model.md` in the
`composition` skill). Read `composition` and `css-animations` skills in full before doing
this; the rest of this section assumes both.

**Smell markers:**
- `grep -c "<Timegroup" src/Video.tsx` → `1`.
- `onFrame={handleFrame}` / `tg.initializer(...).addFrameTask(...)`.
- Dozens of `const xRef = useRef<HTMLDivElement>(null)` + a giant callback full of
  `if (xRef.current) { xRef.current.style.opacity = ...; xRef.current.style.transform = ...; }`
  blocks, keyed off hand-picked **absolute master-ms** windows (`track(ms, 12650, 13350, ...)`).
- A `BEATS`/`SCENES` object of nominal in/out times that the imperative code doesn't
  actually read from (the real numbers are hardcoded inline — a second smell, see 2c).

**Fix — the architecture:**

```
TimelineRoot -> Video
  -> Timegroup (mode="contain", workbench, root — the actual composition root)
       -> Timegroup (mode="sequence", overlap="<N>ms")
            -> SceneA -> SceneB -> SceneC -> ...
                (each its own component, its own Timegroup mode="fixed")
       -> AmbientField (anything spanning every scene: grain, particles, persistent texture)
       -> Audio (mode="fit" not currently supported on <Audio> — pass an explicit
                 duration={`${TOTAL_MS}ms`} instead, so it matches the sequence's resolved length)
```

- One file per scene under `src/scenes/`. Each exports a component rendering its own
  `<Timegroup mode="fixed" duration="Xms">` — nothing else needs to know about any other
  scene.
- **Overlap math**: pick one uniform `overlap` (e.g. 600ms) for the whole sequence — Editframe's
  `overlap` prop is per-`sequence`, not per-pair, so don't try to hand-tune a different
  crossfade length per transition. Every scene's *declared* duration = its nominal/solo
  screen time **+ overlap, once, only if it has a scene before it** (the first scene keeps
  its nominal duration unchanged). This is the only distribution that makes
  `sum(durations) - overlap*(n-1) == original total` — verify it arithmetically before
  committing to numbers, it's easy to get backwards. See `constants.ts`'s `SCENES` doc
  comment in allbirds for the derivation and a working example.
- **Timegroup sequencing auto-hides inactive scenes** (`display:none` when out of range) —
  don't reimplement container-level `visibility`/opacity gating, it's dead weight.
- **Exits that align with the scene boundary** should use the CSS vars Editframe already
  computes per-`Timegroup` — `var(--ef-transition-out-start)` (= `duration - overlap`) and
  `var(--ef-transition-duration)` (= `overlap`) — instead of a hardcoded local-ms window.
  These live on the scene's own `Timegroup` host and cascade via normal CSS custom-property
  inheritance to every plain `<div>` inside it (confirmed against
  `elements/packages/elements/src/elements/updateAnimations.ts` — only `ef-timegroup`
  itself gets them written directly; everything else inherits).
- **Absolute-ms → local-ms**: every timing number in the old `onFrame` body is relative to
  the whole video. Once split into scenes, subtract that scene's own absolute start time
  (`nominal_start - overlap` if it's not the first scene) from every event time to get the
  new local delay. Do this arithmetically for the whole file before writing any JSX —
  don't eyeball it per-element.

**Fix — the animation itself, in priority order:**

1. **One-shot fade + float callouts** (the overwhelming majority of elements): a reusable
   `<Reveal enter={[delay, end]} exit="transition" y={20} exitY={0}>` component (see
   `components/Reveal.tsx`) backed by two shared `@keyframes` (`reveal-in`/`reveal-out`) in
   `styles.css`. `exit="transition"` wires straight to
   `var(--ef-transition-out-start)`/`var(--ef-transition-duration)`; pass an explicit
   `[start,end]` tuple only for exits that happen mid-scene, independent of the boundary.
   CSS `cubic-bezier()` equivalents of common power-curve easings (drop these into any
   project that still has a hand-rolled `easeOutCubic`/`easeInCubic`/`easeInOutQuad`):
   - `easeOutCubic` ≈ `cubic-bezier(0.33,1,0.68,1)`
   - `easeInCubic` ≈ `cubic-bezier(0.32,0,0.67,0)`
   - `easeInOutQuad` ≈ `cubic-bezier(0.45,0,0.55,1)`
2. **Staggered repeated elements** (corner marks, chip lists, grid tiles): a small reusable
   component (see `components/CornerMarks.tsx`) or inline `.map((item, i) => ...)` that
   computes `animation-delay: baseDelay + i * stagger` **once, from the array index** — not
   a `.forEach` re-computing style every frame.
3. **Continuous/infinite ambient motion** (particle drift, a weightless "bob", a button's
   breathing pulse): an infinite CSS `@keyframes ... infinite` loop. Per-item phase/seed
   variance (so N particles don't move in lockstep) is baked in as a **negative
   `animation-delay`**, computed once at module scope from the item's index — CSS starts an
   infinite loop partway through its cycle with a negative delay, which is the direct
   replacement for the old `(ms + seed) % period` phase math.
   - When an element needs both a continuous loop (e.g. bob) *and* a discrete enter/exit
     (position sweep + fade), split it into an outer wrapper (enter/exit keyframe) and an
     inner element (the infinite loop) — don't try to encode both in one `@keyframes`.
4. **Shape morphs / multi-property transitions** (a tile growing then reshaping into a
   frame, a circular wipe reveal, a parallax+blur+contract): a bespoke pair of small
   `@keyframes` (grow, then morph-on-exit) using the same
   `var(--ef-transition-duration)`/`var(--ef-transition-out-start)` timing for the "morph"
   half. `clip-path: circle(N% at x% y%)` handles circular wipes directly; a value like
   `circle(130% ...)` is close enough to "fully revealed" to skip worrying about the exact
   fill-mode edge case (see next bullet).
5. Genuinely irreducible per-frame procedural math (rare after the above) is the only
   remaining valid use of `addFrameTask` — don't force something into CSS that has no
   reasonable closed form. If you get here, keep the frame task scoped to the one scene
   that needs it, not a root-level switchboard.

**Fix-mode correctness (audit every custom `@keyframes` you add):**
- If a keyframe animation has a **delay** and its `0%`/`from` state differs from the
  element's un-animated CSS (which it almost always does — that's the point), it needs
  `backwards` (or `both`) or the element will flash in its default state for the whole
  delay window before the animation starts.
- If a keyframe's **end state** differs from the element's un-animated CSS (e.g. it ends on
  `translate(-50%,-50%)`, a real centering offset — not `translateY(0)`/`scale(1)`, which
  are no-ops indistinguishable from "no transform"), it needs `forwards` (or `both`) or the
  element will snap back to its default state the instant the animation completes, before
  any later animation takes over.
- When in doubt, use `both`. It's never wrong to hold both ends; it's only wrong to not
  hold the one that needs it. Go through every `animation:` declaration you write and ask
  "does the *from* state differ from default → needs backwards" and "does the *to* state
  differ from default → needs forwards", independently, for every single one.

**Where else this applies:** all 19 other projects (every one is a single-`Timegroup` +
`onFrame` composition today).

### 2c. Constants hygiene

While in `constants.ts`: look for (a) timing constants that are exported but never actually
read by the animation code (the real numbers are hardcoded inline instead — delete the
constants or wire them in for real, don't leave both), (b) near-duplicate constants under
two different names for the same value (`WELL_A_IN` vs `WELLA_IN`), (c) palette/color
constants that are imported but never used anywhere. A grep-based usage count per exported
name (`grep -c "\bNAME\b" src/**/*.tsx`) across the whole `src/` tree finds all three in a
couple of minutes.

---

## Suggested order of operations per project

1. Confirm scope with whoever's asking — full re-sync from an upstream author's repo is a
   different (and bigger) task than just fixing code smells; don't assume both are wanted.
2. If re-syncing: diff against upstream's latest commit, port only the substantive change,
   re-apply every "repo-wide convention" bullet from Part 1 — don't take the upstream diff
   wholesale.
3. Extract base64 assets to files (2a) — mechanical, low-risk, do it first.
4. Design the scene split on paper before touching code: list the beats, their nominal
   durations, pick one overlap value, and verify the arithmetic sums to the original total.
5. Build scene-by-scene, converting the imperative animation for that scene's elements as
   you go, referring to the priority list in 2b.
6. Audit fill-modes and dead constants (2c) as a final pass over the whole diff.
7. **This cannot be visually verified without an actual render** (no screenshot tool exists
   for React/Editframe compositions, unlike `.pen` files). Say so explicitly when handing
   off — a test render (`npm install && npm start && npm run render`) is not optional
   before treating any of this as shippable, and the previous `output/demo.mp4` should be
   treated as stale/removed once the code changes, not left in place implying it still
   matches.
