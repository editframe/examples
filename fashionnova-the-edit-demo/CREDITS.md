<div align="center">

# Audio Credits

**The audio bundled in this repo is cleared for commercial use.**
Source and license documented below. If you replace the track, update this
document so downstream forkers can verify provenance.

</div>

---

## Music

### `audio/Fashionnova Velvet_Pavement.mp3`

| | |
|---|---|
| **Title** | Velvet Pavement |
| **Type** | Music bed (purpose-built, ~25s) |
| **Use** | Single bed laid under the full 25 seconds of the ad |
| **License** | Royalty-free, commercial use cleared |
| **Attribution required** | No |
| **Mux** | `add-music.sh` — start 0s, fade-in 0.3s, fade-out 1.5s under the outro hold, peak-limited 0.97 |

This is the **only** audio in the video — there are **no sound effects**. The track is a
fast, glam, black-and-white-energy bed that matches Fashion Nova's voice.

---

## Want to swap audio?

1. Drop your replacement file in `audio/` (match the filename or update the `MUSIC=` variable
   at the top of `add-music.sh`).
2. Update the row above with the new source + license info.
3. Re-run `bash add-music.sh`.

For 100% safe royalty-free sources:

- **Music** — [Pixabay Music](https://pixabay.com/music/) · [Free Music Archive](https://freemusicarchive.org/) (filter CC0/CC-BY) · [Incompetech](https://incompetech.com/music/royalty-free/) (CC-BY, credit Kevin MacLeod)

When in doubt about a track's license, don't ship it.
