<div align="center">

# Audio Credits

**The audio bundled in this repo is cleared for commercial use.**
Source and license documented below. If you replace the track, update this
document so downstream forkers can verify provenance.

</div>

---

## Music

### `src/assets/music-bed.mp3`

| | |
|---|---|
| **Title** | Velvet Pavement |
| **Type** | Music bed (purpose-built, ~25s) |
| **Use** | Single bed (`<Audio>`) laid under the full 25 seconds of the ad, `src/Video.tsx` |
| **License** | Royalty-free, commercial use cleared |
| **Attribution required** | No |
| **Treatment** | Baked once locally via ffmpeg — fade-in 0.3s, fade-out 1.5s under the outro hold, peak-limited 0.97 — before committing the file |

This is the **only** audio in the video — there are **no sound effects**. The track is a
fast, glam, black-and-white-energy bed that matches Fashion Nova's voice.

---

## Want to swap audio?

1. Replace `src/assets/music-bed.mp3` with your new track, baking in any fades/normalization
   with a local ffmpeg pass first (the file is played back as-is, with no runtime processing).
2. Update the row above with the new source + license info.
3. Update the `<Audio src="...">` path in `src/Video.tsx` if you renamed the file.

For 100% safe royalty-free sources:

- **Music** — [Pixabay Music](https://pixabay.com/music/) · [Free Music Archive](https://freemusicarchive.org/) (filter CC0/CC-BY) · [Incompetech](https://incompetech.com/music/royalty-free/) (CC-BY, credit Kevin MacLeod)

When in doubt about a track's license, don't ship it.
