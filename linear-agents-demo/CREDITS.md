<div align="center">

# Audio Credits

**The music bundled in `src/assets/` is a production track for this demo; brand & media assets are demo-only.**
Sources documented below. If you replace any file, update this document so
downstream forkers can verify provenance.

The shipped [`output/demo.mp4`](output/demo.mp4) already has this music baked in — it plays as
a native `<Audio>` element on the composition timeline (`src/Video.tsx`), with the fade-in,
fade-out, and loudnorm normalization pre-baked directly into `src/assets/music-bed.mp3`.

</div>

---

## Music

### `src/assets/music-bed.mp3`

| | |
|---|---|
| **Title** | AM in Taguig |
| **Source** | Production music library (scored for this Linear for Agents demo) |
| **Used for** | Single music bed under the full 32s — loudnorm-normalized, 0.6s fade-in, 1.5s fade-out under the outro |
| **Licensing** | Cleared for this client demo. Confirm licensing before any commercial redistribution. |

This cut is **music only** — there are no sound effects in the 32s timeline.
Replace freely with any royalty-free track ([Pixabay Music](https://pixabay.com/music/),
[Free Music Archive](https://freemusicarchive.org/), [Incompetech](https://incompetech.com/music/royalty-free/)) —
keep the filename `music-bed.mp3` (already fade/loudnorm-baked) or re-run your own ffmpeg
pass and update `src/assets/music-bed.mp3` directly.

---

## Visual assets

The Linear for Agents UI, wordmark, and product surfaces are **Linear brand assets**
(linear.app), reproduced here only to demonstrate the Editframe React SDK. Not cleared
for redistribution. All coded motion graphics are original to this demo (MIT `LICENSE`).
