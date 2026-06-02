# `audio/`

All music and SFX used by this template live here. Every file is cleared for **commercial use** — see [`../CREDITS.md`](../CREDITS.md) for sources and license terms.

## Contents

| File | Type | Used in |
|---|---|---|
| `music-bed.mp3` | Music bed | Underscored throughout the 22.5s video (Pixabay — "Big Beginning" by Jonas Blakewood) |
| `click-hd-loud.mp3` | SFX | Reserved (not used in this video; bundled for fork consistency with sibling templates) |

## Replacing audio

The mux script `../add-sfx-v13.sh` expects the filenames above. Either:

1. **Match the filenames** — drop your replacement file with the same name and re-run the script. No code changes needed.
2. **Update the script** — edit the `SONG=` variable at the top of `add-sfx-v13.sh` to point to your new filename.

If you swap a file, **update [`../CREDITS.md`](../CREDITS.md)** with the new source and license so downstream forkers can verify provenance.
