<div align="center">

# Audio & asset credits

**Provenance for the music bed and the brand footage composited into this demo.**
If you replace any file, update this document so downstream forkers can verify sources.

</div>

---

## Music

### `audio/Gymshark Summit_at_Dawn.mp3`

| | |
|---|---|
| **Title** | Gymshark — Summit at Dawn |
| **Use in this demo** | Single music bed under the full ~19s. Muxed from `0:30` of the track (a fuller later section), faded in over 1.5s, faded out over the last 1.5s under the CTA hold, then brick-wall limited at `0.97`. |
| **Mux recipe** | [`add-audio.sh`](add-audio.sh) (`MUSIC_START=30`, `FADE_IN=1.5`, `alimiter=limit=0.97`) |
| **Licensing** | Brand / campaign music — licensing retained by the rights holder. Bundled here for demo reproduction only. Swap with any cleared track before redistributing commercially. |

There are **no sound effects** in this video — it is music only.

---

## Brand footage (video-in-frame wells)

The two on-screen video wells are filled with **real Gymshark footage** composited after the
silent Editframe render (see [`add-audio.sh`](add-audio.sh)).

| File | Well | Use |
|---|---|---|
| `audio/brand-video/athlete-gslc-9x16.mp4` | WELL_A (4.5–8.5s) | Athlete training footage — "BUILT FOR THE GRIND" |
| `audio/brand-video/fabric-macro.mp4` | WELL_B (11.0–14.0s) | Seamless geo-knit fabric macro — "ENGINEERED, NOT SEWN" |

These are Gymshark brand assets included for demo reproduction. Replace with your own cleared
footage (match the filenames or update `add-audio.sh`) before any commercial redistribution.

---

## Still imagery (`src/assets/`, inlined as base64 in `src/assets.ts`)

Real Gymshark product / on-model photography and logo art (`model-*.jpg`, `cw-*.jpg`,
`gymshark-logo*.png`, `gymshark-fin.png`, `poster-*.jpg`). Brand assets, bundled for demo
reproduction. Replace with your own imagery before redistributing.

---

## Want to swap audio or footage?

1. Drop your replacement in `audio/` (music) or `audio/brand-video/` (well footage) — match the
   filename or update the `MUSIC` / `ATH` / `FAB` variables at the top of `add-audio.sh`.
2. Update the corresponding row above with the new source + license.
3. Re-run `bash add-audio.sh` to regenerate `output/demo.mp4`.

For 100% safe royalty-free music: [Pixabay Music](https://pixabay.com/music/) ·
[Free Music Archive](https://freemusicarchive.org/) · [Incompetech](https://incompetech.com/music/royalty-free/).
When in doubt about a track's license, don't ship it.
