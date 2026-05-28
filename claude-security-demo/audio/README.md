# `audio/`

All music and SFX used by this template live here. Every file is cleared for **commercial use** — see [`../CREDITS.md`](../CREDITS.md) for sources and license terms.

## Contents

| File | Type | Used in |
|---|---|---|
| `music-bed.mp3` | Music bed | Underscored throughout the video — "Suspense" by leberch (Pixabay) |
| `click-hd-loud.mp3` | SFX | Cursor click on the Security row (Scene 2, master 5.0s) |

## Replacing audio

The mux script `../add-sfx-v11.sh` expects the filenames above. Either:

1. **Match the filenames** — drop your replacement file with the same name and re-run the script. No code changes needed.
2. **Update the script** — edit the `MUSIC=` / `CLICK=` variables at the top of `add-sfx-v11.sh` to point to your new filenames.

If you swap a file, **update [`../CREDITS.md`](../CREDITS.md)** with the new source and license so downstream forkers can verify provenance.
