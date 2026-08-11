# Credits & provenance

This is an unofficial brand-campaign **demo** built to showcase the Editframe React SDK. Allbirds, the
Allbirds wordmark, the Tree Runner NZ, and all product/lifestyle imagery are trademarks and property of
**Allbirds, Inc.** They are used here for demonstration only, are not an endorsement, and carry no
commercial license. Swap them before any real-world use.

## Music
| Track | Used as | Treatment |
|---|---|---|
| **"The Sharp Pivot"** (`src/assets/allbirds-tree-runner-demo-music-bed.mp3`) | Music bed, 0–25s | 25s excerpt (from 1:40 of the track) as an `<Audio>` bed; fades in (1.2s) and out (from 0:19), volume 1.0. |

There are **no sound effects** in this video — it is music only.

## Footage (video wells)
| File | Well | Role |
|---|---|---|
| `src/assets/well-a-people-walk.mp4` (`<Video>`) | WELL_A (portrait, 6.0–11.0s) | Real Allbirds lifestyle footage |
| `src/assets/well-b-material-macro.mp4` (`<Video>`) | WELL_B (landscape, 14.5–19.0s) | Real Allbirds material macro footage |

## Fonts
- **Geograph** and **Akkurat Mono** — Allbirds' brand typefaces, base64-embedded in `src/styles.css`
  (and as source `.woff2` in `src/assets/fonts/`). Property of their respective foundries; included for
  this demo only. Replace with licensed fonts for production use.

## Imagery
- Product, colorway, material, and poster stills (`src/assets/*.png`, `src/assets/*.jpg`, served via
  `<Image>`) are real Allbirds product/lifestyle imagery, used for demonstration only.

## SDK
- Built with the [Editframe](https://editframe.com) React SDK (`@editframe/*` 0.54.0).
