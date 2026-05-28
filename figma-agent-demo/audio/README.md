# `audio/`

All music and SFX used by this template live here. Every file is cleared for **commercial use** — see [`../CREDITS.md`](../CREDITS.md) for sources and license terms.

## Contents

| File | Type | Used in |
|---|---|---|
| `music-bed.mp3` | Music bed | Underscored throughout the video — "Feeling Playful" by Jonas Blakewood (Pixabay) |
| `keyboard.wav` | SFX | Agent-prompt typing (SceneB, 10.6–13.7s) + chat-input typing (SceneC, 23.3–25.9s) |
| `click-hd-loud.mp3` | SFX | Three cursor clicks in SceneA: Progress Card row (4.6s), Fill swatch (7.0s), hue drag start (14.3s) |

## Replacing audio

The mux script `../add-sfx-v12.sh` expects the filenames above. Either:

1. **Match the filenames** — drop your replacement file with the same name and re-run the script. No code changes needed.
2. **Update the script** — edit the `MUSIC=` / `KBD=` / `CLICK=` variables at the top of `add-sfx-v12.sh` to point to your new filenames.

If you swap a file, **update [`../CREDITS.md`](../CREDITS.md)** with the new source and license so downstream forkers can verify provenance.
