<div align="center">

# Audio Credits

**Every audio file bundled in this template is intended for commercial use.**
Sources and licenses documented below. If you replace any file, update this
document so downstream forkers can verify provenance.

</div>

---

## Music

### `src/assets/music.mp3`

| | |
|---|---|
| **Title / artist** | "Old Books and Cold Tea" — unverified, no ID3 metadata embedded in the source file |
| **Source** | Not documented upstream of this template |
| **License** | Unverified — confirm commercial-use rights before external/paid distribution |
| **Treatment** | Baked one-time via local `ffmpeg`: trimmed to 14.5s, `loudnorm=I=-26:TP=-4:LRA=7`, fade in 0.4s, fade out 1.8s starting at 12.8s |

A gentle, understated bed under the full 14.4s runtime — cursor only hovers the nav
tabs/Assets tab in this cut, it never clicks, and no prompt is typed, so there are **no
sound effects**, music only. **Action item:** re-source from Pixabay,
[Free Music Archive](https://freemusicarchive.org/), or
[Incompetech](https://incompetech.com/music/royalty-free/) with verifiable licensing
before this template ships externally, or confirm/replace this entry with the original
track's real provenance.

---

## Want to swap audio?

1. Drop your replacement file in `src/assets/`, matching the filename referenced in
   `src/Video.tsx` (`MUSIC`), or update that reference to point at your new filename.
2. Update the row above with source + license info.
3. Re-run the fade/normalize `ffmpeg` pass described above before committing the file —
   the composition references the final, already-processed asset directly; there is no
   render-time mux step.

For 100% safe royalty-free sources:

- 🎵 **Music** — [Pixabay Music](https://pixabay.com/music/) · [Free Music Archive](https://freemusicarchive.org/) (filter CC0/CC-BY) · [Incompetech](https://incompetech.com/music/royalty-free/) (CC-BY, just credit Kevin MacLeod)

When in doubt about a track's license, don't ship it.
