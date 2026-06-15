# `audio/`

The music bed and the real brand footage composited into the two video wells. See
[`../CREDITS.md`](../CREDITS.md) for sources and licensing.

## Contents

| Path | Type | Used in |
|---|---|---|
| `Gymshark Summit_at_Dawn.mp3` | Music bed | Underscored across the full ~19s (muxed from 0:30, fade in/out + limiter) |
| `brand-video/athlete-gslc-9x16.mp4` | Brand footage | Composited into WELL_A (athlete training, 4.5–8.5s) |
| `brand-video/fabric-macro.mp4` | Brand footage | Composited into WELL_B (fabric macro, 11.0–14.0s) |

There are **no sound effects** in this video — it is music only.

## Replacing audio / footage

The finalize script [`../add-audio.sh`](../add-audio.sh) reads these paths via the `MUSIC`,
`ATH`, and `FAB` variables at the top. Either:

1. **Match the filenames** — drop your replacement with the same name and re-run the script.
2. **Update the script** — edit `MUSIC=` / `ATH=` / `FAB=` to point at your new files.

Footage is composited into the rects defined in [`../wells.json`](../wells.json). If you swap a
file, update [`../CREDITS.md`](../CREDITS.md) with the new source and license.
