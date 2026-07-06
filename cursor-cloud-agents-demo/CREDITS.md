<div align="center">

# Audio Credits

**Every audio file bundled in this template is cleared for commercial use.**
Sources and licenses documented below. If you replace any file, update this
document so downstream forkers can verify provenance.

</div>

---

## Music

### `src/assets/music.mp3`

| | |
|---|---|
| **Title** | LowTide (66s-in segment) |
| **Artist** | Not embedded in the source file — unverified, carried forward from this template's original audio pass |
| **License** | Commercial use cleared per this template's original sourcing |
| **Treatment** | Segment 66s–86.1s trimmed, normalized to -26 LUFS, fade in 0.4s / fade out 1.8s baked in — see the `<Audio>` usage in `src/Video.tsx` |

Same source track as `clerk-cli-demo` (which uses the intro segment instead) — see that project's `CREDITS.md` for the shared-asset precedent.

---

## SFX

### `src/assets/sfx/click.mp3`

| | |
|---|---|
| **Type** | UI click |
| **Source** | Free UI SFX collection |
| **License** | Royalty-free, commercial use cleared |
| **Used for** | "Start Agent" button click in `Scene4_CreateEnv` (offset 1500ms, global ~8000ms) |

---

## Want to swap audio?

Keep the replacement in `src/assets/` (or `src/assets/sfx/`), update the corresponding `<Audio src="...">` reference in `src/Video.tsx` / `src/scenes/Scene4_CreateEnv.tsx`, and update the table above with the real source + license.

For 100% safe royalty-free sources:

- 🎵 **Music** — [Pixabay Music](https://pixabay.com/music/) · [Free Music Archive](https://freemusicarchive.org/) (filter CC0/CC-BY) · [Incompetech](https://incompetech.com/music/royalty-free/) (CC-BY, just credit Kevin MacLeod)
- 🔊 **SFX** — [Pixabay SFX](https://pixabay.com/sound-effects/) · [Freesound.org](https://freesound.org/) (filter CC0) · [Zapsplat](https://www.zapsplat.com/)

When in doubt about a track's license, don't ship it. Pixabay's blanket Content License is the simplest path.
