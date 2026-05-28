# `audio/`

All music and SFX used by this template live here. Every file is cleared for **commercial use** — see [`../CREDITS.md`](../CREDITS.md) for sources and license terms.

## Contents

| File | Type | Used in |
|---|---|---|
| `music-bed.mp3` | Music bed | Underscored throughout the video (Pixabay CC0) |
| `keyboard.wav` | SFX | Hero-prompt typewriter (Scene 1) + Second prompt (Scene 4) |
| `punch-whoosh.wav` | SFX | Four arm-pull impacts (Scene 3, master 13.1–16.1s) |
| `click-hd-loud.mp3` | SFX | Reserved (not used in this video; bundled for fork consistency) |

## Replacing audio

The mux script `../add-sfx-v11.sh` expects the filenames above. Either:

1. **Match the filenames** — drop your replacement file with the same name and re-run the script. No code changes needed.
2. **Update the script** — edit the `MUSIC=` / `KBD=` / `PUNCH=` variables at the top of `add-sfx-v11.sh` to point to your new filenames.

If you swap a file, **update [`../CREDITS.md`](../CREDITS.md)** with the new source and license so downstream forkers can verify provenance.
