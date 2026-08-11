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

**Counting-number smell:** a stat that animates `0 → finalValue` (`track(ms, start, end,
easeOutCubic) * finalValue`, formatted with commas) with no reserved width on its container.
`font-variant-numeric: tabular-nums` alone doesn't fix this — it only equalizes per-digit
width, the string still grows from `"0"` to `"54,800"` and reflows its own box (and anything
centered on it) as digits accumulate. Fix: compute the box's width **once from the final
value** — `width: ${finalFormatted.length}ch` (see `numCellWidth()` in
`recess-templates/*/src/components/helpers.ts` for a worked helper) — as a static inline
style, plus `tabular-nums` so the reserved width stays correct mid-count too. Don't confuse
this with a panel's own scale/translate entrance animation running at the same time (common,
since both usually start at scene-open) — that's a separate, intentional effect; isolate the
two by sampling `getBoundingClientRect()` only after the panel's entrance settles.

**Dead-centered `Reveal` smell:** a `position: absolute; top: 50%; left: 50%;
transform: translate(-50%,-50%)` panel that *also* carries its own enter/exit
`animation:`/`Reveal` on the same element. A CSS animation replaces the whole `transform`
property for its duration rather than composing with the static centering one — the panel
loses its centering offset while animating, then snaps to center the instant the animation
ends (immediately, if it lacks `forwards`). This reads as "the incoming card snaps to center
right as the transition finishes." Fix (applied across `nerds/{Mission,Testimonial,Packs,
Impact}.tsx` and `amazinggrass/{Hero,Testimonial}.tsx`): split into an unanimated centering
wrapper (`className="absolute inset-0 flex items-center justify-center"`) whose child is the
animated `Reveal` — the wrapper owns positioning, the child owns its own `transform` freely.

**Where else this applies:** all 19 other projects (every one is a single-`Timegroup` +
`onFrame` composition today). The two smells above apply specifically to any project with a
counting stat or a dead-centered animated panel — check `Video.tsx` and every `scenes/*.tsx`
for both patterns even in projects that already use `Timegroup`/`Reveal` correctly otherwise.

### 2c. Constants hygiene

While in `constants.ts`: look for (a) timing constants that are exported but never actually
read by the animation code (the real numbers are hardcoded inline instead — delete the
constants or wire them in for real, don't leave both), (b) near-duplicate constants under
two different names for the same value (`WELL_A_IN` vs `WELLA_IN`), (c) palette/color
constants that are imported but never used anywhere. A grep-based usage count per exported
name (`grep -c "\bNAME\b" src/**/*.tsx`) across the whole `src/` tree finds all three in a
couple of minutes.

---

## Part 3 — the audio pipeline (native `<Audio>`, no ffmpeg mux) + scaffold parity

Part 1 described this smell as something to look for when re-syncing from an upstream
author. It also exists **independently of any upstream sync** — most projects in this repo
have it natively, self-authored, no external repo involved. Don't gate this fix on "is there
evidence of an upstream author" (that was the wrong scoping the first time around); gate it
on "does `package.json`'s `render` script write to `demo-silent.mp4` and is there a shell
script that muxes audio afterward."

### 3a. The ffmpeg mux smell, precisely

**Smell markers** (any combination):
- `package.json` → `"render": "editframe render -o output/demo-silent.mp4"`.
- A root-level `add-audio.sh` / `add-sfx-vNN.sh` / `add-music.sh` / `composite-well.sh` —
  naming is inconsistent and not a reliable signal of what the script actually does (an
  `add-sfx-*.sh` file may only mux music, no SFX at all) — **read every script fully**
  before assuming its scope from its name.
- A root-level `audio/` folder (raw stems: `music-bed.mp3`, `click-hd-loud.mp3`, etc.),
  referenced only by the shell script, never imported into the composition.
- `public/sfx/*.{mp3,wav}` — served from Vite's static root, so `vite-plugin-singlefile`
  can't inline it into the portable single-HTML bundle. Same smell as base64-in-source (2a),
  different flavor: an asset that exists outside the composition's own dependency graph.
- Sometimes a half-finished native attempt already exists and is dead code — e.g. a
  `src/components/Sfx.tsx` wrapping `<Audio>` with a comment like *"draft cues only, final
  layer applied post-render via bash mix script"*, never actually imported into any scene.
  If you find one, it's your reference for the target shape — finish wiring it in, don't
  rebuild from scratch, and delete the caveat comment once it's the real source of truth.

### 3b. The fix

**Music bed** (spans the whole composition):
1. Read the mux script's ffmpeg filter chain in full — volume, `afade in/out` timings,
   `loudnorm`, `alimiter`. These exist because a flat, unfaded track sounds bad, not because
   ffmpeg is required at render time.
2. Run that *same* filter chain **once, locally, audio-only** (drop `-map 0:v`/any `-i` on
   the video) to bake the fades/normalization directly into the committed asset — e.g.:
   ```
   ffmpeg -i audio/music-bed.mp3 -af "afade=t=in:st=0:d=1.5,afade=t=out:st=18.5:d=1.5,alimiter=limit=0.97" \
     -b:a 192k src/assets/music-bed.mp3
   ```
   The output is a normal, final-sounding mp3 — no runtime fade logic needed, matching how
   base64 images became real files in 2a (asset is pre-finished, not computed at
   render/build time).
3. Move it to `src/assets/`, reference with one root-level
   `<Audio src="/assets/music-bed.mp3" volume={1} duration={`${TOTAL_MS}ms`} />` — exactly
   the allbirds pattern (`src/Video.tsx`). `<Audio>` has no `mode="fit"`; the explicit
   `duration` pins it to the composition's resolved length instead.

**SFX cues** (one-shot, tied to a specific moment):
1. The mux script's `-ss`/`adelay`/explicit timestamp arguments give you the absolute-ms
   cue points — same "absolute-ms → local" translation as 2b, just for audio instead of
   `onFrame` callbacks.
2. Move each raw file into `src/assets/` (or `src/assets/sfx/` if there are many).
3. Every temporal element — `<Audio>` included — supports an `offset` prop
   (`EFTemporal`, confirmed in `elements/packages/elements/src/elements/EFTemporal.ts`):
   the element's start time relative to its **parent `Timegroup`**. Place the cue as a plain
   `<Audio src="..." offset="Xs" duration="Ys" volume={v} />` sibling inside whichever scene
   `Timegroup` contains that moment — no extra nested `Timegroup` needed just for timing.
   `sourceIn`/`sourceOut`/`trimStart`/`trimEnd` trim the source file itself if needed.
4. Delete the mux script(s) and the top-level `audio/` folder once every file referenced
   from it has been moved into `src/` (or confirmed dead and dropped — see 3c).
5. `package.json` → `"render": "editframe render -o output/demo.mp4"` — one pass, no
   shell-script chaining, no `-silent` naming. Fix any broken chained scripts you find while
   here (e.g. `node scripts/inline-assets.mjs && editframe render ...` where the script
   doesn't exist — dead reference, drop it).
6. `.gitignore` — drop `demo-silent.mp4`/`demo-composite.mp4`/versioned-output
   special-casing; match allbirds' shape (`output/*` ignored, `!output/demo.mp4` tracked).

**No source audio content exists at all** (a project ships a fully silent
`output/demo.mp4`): reuse an already-licensed track from a tonally-similar sibling project
in this repo (there's already precedent for this — several projects share byte-identical
`music-bed.mp3`/`click-hd-loud.mp3` files) rather than inventing new sourcing infrastructure.
Copy the file, add a matching `CREDITS.md` entry mirroring the source project's real
attribution (same file → same Pixabay/license citation), wire it in per 3b.

### 3c. `public/` triage

Before moving or deleting anything in `public/`, check what's actually referenced:
```
find <project>/public -type f | while read f; do
  rel="${f#<project>/public/}"; grep -rq "$rel" <project>/src || echo "DEAD: $rel"
done
```
In practice almost everything under `public/extracted/`, `public/*reference*`,
`public/*_calibrate*`, versioned comparison frames (`ref_NNs.jpg`, `v2_NNs.jpg`,
`frame_NNNN.jpg`) is **authoring/QA debris from the original build process, never imported
by the composition** — delete it outright, don't migrate it. Anything that *is* referenced
(rare — check for real, e.g. a UI-mockup tile grid) moves into `src/assets/` like any other
image (2a) so it's covered by the singlefile bundle. Delete `public/` entirely once empty.

### 3d. Other scaffold drift to reconcile against `allbirds-tree-runner-demo` (the gold standard)

- `SHOT-LIST.md` (authoring planning doc) — delete, not part of the shipped template.
- `poster.jpg` (real README-referenced thumbnail) — keep.
- `extras/` (standalone bonus drop-in components, e.g. `LowerThird.tsx`, `BarChart.tsx`,
  documented in their own `extras/README.md`) — keep, it's legitimate showcase material for
  goal #2 (demonstrating more Editframe patterns to prospective customers). Do fix real bugs
  in them, but **don't** force the Part 2b CSS-cascade rewrite onto them — they're
  deliberately standalone/portable (may be dropped in without a `Timegroup` ancestor
  providing `--ef-progress`), so a `startFrame`/`endFrame`-prop-driven, JS-computed-style
  implementation is the *correct* shape for this specific component category, not a smell.
- Missing `CREDITS.md` — every project that ships any third-party asset (music, SFX, stock
  imagery) needs one, matching a sibling's format.

**Where else this applies:** every project except `allbirds-tree-runner-demo` had some
combination of these. As of this writing, one documented exception remains open:
`gymshark-geo-seamless-demo` bakes its audio mux into the same ffmpeg pass that composites
real brand footage into masked "well" placeholders (`_finalize_helper.py` + `wells.json` +
`add-audio.sh`) — the two are inseparable in the current script, and the well-compositing
half is a separate, larger native-CSS-masking task. Left untouched pending that task.

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
