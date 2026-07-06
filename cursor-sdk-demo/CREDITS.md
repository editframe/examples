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
| **Title / artist** | "Glass and Timber" — unverified, no ID3 metadata embedded in the source file |
| **Source** | Not documented upstream of this template |
| **License** | Unverified — confirm commercial-use rights before external/paid distribution |
| **Treatment** | Baked one-time via local `ffmpeg`: trimmed to 26.9s, `loudnorm=I=-26:TP=-4:LRA=7`, fade in 0.4s, fade out 1.8s starting at 25.0s |

A driving, modern tech-bed that mirrors the Cursor product feel. **Action item:** re-source from Pixabay, [Free Music Archive](https://freemusicarchive.org/), or [Incompetech](https://incompetech.com/music/royalty-free/) with verifiable licensing before this template ships externally, or confirm/replace this entry with the original track's real provenance.

---

## SFX

### `src/assets/sfx/keyboard.wav`

| | |
|---|---|
| **Type** | Mechanical keyboard typing |
| **Source** | Embedded file metadata credits **MographMotions** |
| **License** | Unverified — confirm commercial-use terms with the source pack before external distribution |
| **Used for** | Two human-typed cues: `$ uv add cursor-sdk` (Scene1_2_Terminal, offset 200ms / global 200ms) and the `model="composer-2.5-fast"` prompt line (Scene4_CodeBlock, offset 200ms / global 7700ms). No cue on the fast AI-generated code or the terminal-run scene — those type too quickly to read as human typing. |

---

## Want to swap audio?

1. Drop your replacement file in `src/assets/` (or `src/assets/sfx/` for SFX), matching the filename referenced in `src/Video.tsx` / the relevant scene file, or update those references to point at your new filename.
2. Update the corresponding row above with source + license info.
3. If replacing the music bed, re-run the fade/normalize `ffmpeg` pass described above before committing the file — the composition references the final, already-processed asset directly; there is no render-time mux step.

For 100% safe royalty-free sources:

- 🎵 **Music** — [Pixabay Music](https://pixabay.com/music/) · [Free Music Archive](https://freemusicarchive.org/) (filter CC0/CC-BY) · [Incompetech](https://incompetech.com/music/royalty-free/) (CC-BY, just credit Kevin MacLeod)
- 🔊 **SFX** — [Pixabay SFX](https://pixabay.com/sound-effects/) · [Freesound.org](https://freesound.org/) (filter CC0) · [Zapsplat](https://www.zapsplat.com/)

When in doubt about a track's license, don't ship it.
