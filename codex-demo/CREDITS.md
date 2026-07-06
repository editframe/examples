<div align="center">

# Audio Credits

**Every audio file bundled in this template is intended for commercial use.**
Sources and licenses documented below. If you replace any file, update this
document so downstream forkers can verify provenance.

</div>

---

## Music

### `src/assets/music-bed.mp3`

| | |
|---|---|
| **Title / artist** | Unverified — no ID3 metadata embedded in the source file |
| **Source** | Not documented upstream of this template |
| **License** | Unverified — confirm commercial-use rights before external/paid distribution |
| **Treatment** | Baked one-time via local `ffmpeg`: trimmed to 22.1s, `loudnorm=I=-26:TP=-4:LRA=7`, fade in 0.4s, fade out 1.8s starting at 20.25s |

A driving, modern tech-bed. **Action item:** re-source from Pixabay, [Free Music Archive](https://freemusicarchive.org/), or [Incompetech](https://incompetech.com/music/royalty-free/) with verifiable licensing before this template ships externally, or confirm/replace this entry with the original track's real provenance.

---

## SFX

### `src/assets/sfx/keyboard.wav`

| | |
|---|---|
| **Type** | Mechanical keyboard typing |
| **Source** | Embedded file metadata credits **MographMotions** |
| **License** | Unverified — confirm commercial-use terms with the source pack before external distribution |
| **Used for** | Scene2 chat-input typewriter effect, at scene-local 0.8s (global 3.3s) |

### `src/assets/sfx/click.mp3`

| | |
|---|---|
| **Type** | UI click |
| **Source** | Not documented upstream of this template |
| **License** | Unverified — confirm commercial-use rights before external distribution |
| **Treatment** | Baked one-time via local `ffmpeg` (`volume=2.2`) to match in-mix loudness; 0.6s of leading silence in the source is trimmed live via each `<Sfx>`'s `sourceIn` prop, not baked into the file |
| **Used for** | Three cues — Scene3 Send-button click (scene-local 0.2s / global 4.7s), Scene6 Xcode RUN click (scene-local 0.76s / global 13.76s), Scene8 center-cell click (scene-local 1.0s / global 18.5s) |

---

## Want to swap audio?

1. Drop your replacement file in `src/assets/` (or `src/assets/sfx/` for SFX), matching the filename referenced in `src/Video.tsx` / `src/components/Sfx.tsx`, or update those references to point at your new filename.
2. Update the corresponding row above with source + license info.
3. If replacing the music bed, re-run the fade/normalize `ffmpeg` pass described above before committing the file — the composition references the final, already-processed asset directly; there is no render-time mux step.

For 100% safe royalty-free sources:

- 🎵 **Music** — [Pixabay Music](https://pixabay.com/music/) · [Free Music Archive](https://freemusicarchive.org/) (filter CC0/CC-BY) · [Incompetech](https://incompetech.com/music/royalty-free/) (CC-BY, just credit Kevin MacLeod)
- 🔊 **SFX** — [Pixabay SFX](https://pixabay.com/sound-effects/) · [Freesound.org](https://freesound.org/) (filter CC0) · [Zapsplat](https://www.zapsplat.com/)

When in doubt about a track's license, don't ship it.
