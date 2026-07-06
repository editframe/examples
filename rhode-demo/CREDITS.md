<div align="center">

# Audio Credits

**The music bundled in `src/assets/` is a production track for this demo; brand & media assets are demo-only.**
Sources documented below. If you replace any file, update this document so
downstream forkers can verify provenance.

The shipped [`output/demo.mp4`](output/demo.mp4) already has this music baked in — the
fades/normalization are pre-rendered directly into `src/assets/music-bed.mp3`, played as a
single `<Audio>` element on the composition timeline (`src/Video.tsx`).

</div>

---

## Music

### `src/assets/music-bed.mp3`

| | |
|---|---|
| **Title** | Glass and Gold |
| **Source** | Production music library (scored for this Rhode demo) |
| **Used for** | Single music bed under the full ~20s — loudnorm-normalized, 0.6s fade-in, 1.5s fade-out |
| **Licensing** | Cleared for this client demo. Confirm licensing before any commercial redistribution. |

This cut is **music only** — there are no sound effects in the 20s timeline.
Replace freely with any royalty-free track ([Pixabay Music](https://pixabay.com/music/),
[Free Music Archive](https://freemusicarchive.org/), [Incompetech](https://incompetech.com/music/royalty-free/)) —
keep the filename `music-bed.mp3` or update the `<Audio src="...">` in `src/Video.tsx`.

---

## Visual assets

Product photography, campaign lifestyle stills, and the application video are **Rhode
brand assets** (rhodeskin.com), used here only to demonstrate the Editframe React SDK.
They are not cleared for redistribution — swap in your own imagery before shipping a
real campaign. All coded motion graphics are original to this demo (MIT `LICENSE`).
