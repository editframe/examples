# audio/

Assets consumed by [`../add-audio.sh`](../add-audio.sh) to turn the silent render into the final cut.

| File | Role |
|---|---|
| `the-sharp-pivot.mp3` | Music bed. Started 8s into the track (`MUSIC_START=8`), fade-in 1.2s, fade-out 1.8s before the close, soft limiter. |
| `well-a-people-walk.mp4` | Portrait lifestyle footage composited into **WELL_A** (`160,540 760×1000 r22`), active 6.0–11.0s. |
| `well-b-material-macro.mp4` | Landscape material macro composited into **WELL_B** (`120,760 840×560 r18`), active 14.5–19.0s. |

The video is **music only** — there are no sound effects. All provenance is in
[`../CREDITS.md`](../CREDITS.md). Replace any file here and re-run `add-audio.sh` to re-cut.
