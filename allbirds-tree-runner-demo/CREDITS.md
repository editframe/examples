# Credits & provenance

This is an unofficial brand-campaign **demo** built to showcase the Editframe React SDK. Allbirds, the
Allbirds wordmark, the Tree Runner NZ, and all product/lifestyle imagery are trademarks and property of
**Allbirds, Inc.** They are used here for demonstration only, are not an endorsement, and carry no
commercial license. Swap them before any real-world use.

## Music
| Track | Used as | Treatment |
|---|---|---|
| **"The Sharp Pivot"** (`audio/the-sharp-pivot.mp3`) | Full-length music bed, 0–25s | Started 8s into the track; fade-in 1.2s, fade-out 1.8s before the close, soft limiter (0.95). Muxed by `add-audio.sh`. |

There are **no sound effects** in this video — it is music only.

## Footage (composited into the video wells)
| File | Well | Role |
|---|---|---|
| `audio/well-a-people-walk.mp4` | WELL_A (portrait, 6.0–11.0s) | Real Allbirds lifestyle footage |
| `audio/well-b-material-macro.mp4` | WELL_B (landscape, 14.5–19.0s) | Real Allbirds material macro footage |

## Fonts
- **Geograph** and **Akkurat Mono** — Allbirds' brand typefaces, base64-embedded in `src/styles.css`
  (and as source `.woff2` in `src/assets/fonts/`). Property of their respective foundries; included for
  this demo only. Replace with licensed fonts for production use.

## Imagery
- Product, colorway, and material stills in `src/assets/` (and downscaled base64 in `src/assets_opt.ts`
  / `src/assets.ts`) are real Allbirds product/lifestyle imagery, used for demonstration only.

## SDK
- Built with the [Editframe](https://editframe.com) React SDK (`@editframe/*` 0.54.0).
