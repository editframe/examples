<div align="center">

# Allbirds — Tree Runner NZ

**A 25-second 9:16 social ad, built with the [Editframe](https://editframe.com) React SDK.**

[![License: MIT](https://img.shields.io/badge/license-MIT-9AA48B.svg?style=for-the-badge)](LICENSE)
[![Built with Editframe](https://img.shields.io/badge/built_with-Editframe-212121?style=for-the-badge)](https://editframe.com)
[![Brand: Allbirds](https://img.shields.io/badge/brand-Allbirds-ECE9E2?style=for-the-badge&labelColor=8C857A)](#brand)
[![Format](https://img.shields.io/badge/1080×1920-30fps-212121?style=for-the-badge)](#)

</div>

---

## Quick start

```bash
npm install
npm start             # Editframe workbench on localhost
npm run render        # -> output/demo.mp4 (native, single pass)
```

> **Windows:** prefix render with `NO_COLOR=1 FORCE_COLOR=0` to avoid an ANSI hang.

The well footage plays as `<Video>` elements (`src/assets/well-a-people-walk.mp4`, `src/assets/well-b-material-macro.mp4`), each offset to its well's window, and the music bed plays as an `<Audio>` element. Audio and video sit on the composition timeline.

---

## Scene timeline

| # | Time | Scene | What happens |
|---|---|---|---|
| 1 | `0.0 – 2.0s` | **Hook** | Lowercase "allbirds" wordmark + "EFFORTLESS BY NATURE" float in on oat |
| 2 | `2.0 – 6.0s` | **Product hero** | Tree Runner NZ floats weightless on a soft sand tile; "Tread lightly" headline (Tree Runner NZ eyebrow) + $100 |
| 3 | `6.0 – 11.0s` | **Lifestyle — Well A** | Portrait lifestyle footage fills the framed Well A + "Comfort, naturally" / "Wear-all-day comfort" |
| 4 | `11.0 – 14.5s` | **Materials** | MERINO WOOL · TREE FIBER · SUGARCANE callouts + carbon-footprint number in mono |
| 5 | `14.5 – 19.0s` | **Material macro — Well B** | Landscape material footage fills the framed Well B + "TREAD LIGHTER" |
| 6 | `19.0 – 22.5s` | **The Range** | Colorway grid drifts up across the muted palette; "Find your pair · in nature's palette" |
| 7 | `22.5 – 25.0s` | **CTA / Outro** | "allbirds" wordmark + "SHOP NOW" + B Corp proof + "allbirds.com" on oat |

---

## Architecture

```
TimelineRoot -> Video -> one fixed 25s Timegroup (root, workbench, id="root")
```

All 7 beats run on a single fixed-mode Timegroup clock, driven by one `onFrame` callback. Scene timing is driven by master-ms constants in `src/constants.ts`.

---

## Repo layout

```
.
├── README.md
├── CREDITS.md                  <- audio and footage credits
├── LICENSE                     <- MIT (source code only)
├── .env.example
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── output/                     <- npm run render writes demo.mp4 here (not committed)
└── src/
    ├── Video.tsx               <- master timeline (25s, 7 beats)
    ├── main.tsx                <- TimelineRoot entry
    ├── constants.ts            <- palette, type, beat timings, well rects
    ├── styles.css              <- Tailwind + base64-embedded fonts
    ├── assets.ts               <- base64 poster stills
    ├── assets_opt.ts           <- downscaled base64 product / colorway imagery
    ├── assets/                 <- woff2 fonts, music-bed.mp3, well-a-people-walk.mp4, well-b-material-macro.mp4
    └── components/
        └── helpers.ts          <- track, lerp, clamp, easing helpers
```

---

## Audio

Music-only — no sound effects.

| Cue | Time (ms) | File | Volume |
|---|---|---|---|
| Music bed | 0 – 25000 | `src/assets/music-bed.mp3` | 1.0 |

Bed fades in (1.2s) and out (from 0:19).

---

## Brand

Allbirds reads as lightness, calm, and nature made effortless: oat canvas, soft natural light, weightless float motion, Geograph type with letter-spaced caps. `src/constants.ts` is the source of truth.

| Token | Hex | Use |
|---|---|---|
| OAT | `#ECE9E2` | Brand canvas |
| SAND | `#E0DACF` | Warm taupe surface |
| COOL_OAT | `#E0E2DC` | Faint sage-grey tint |
| INK | `#212121` | Soft near-black text |
| STONE | `#8C857A` | Secondary text |
| LINE | `#C9C3B8` | Hairlines |

---

## Fork & adapt

```bash
git clone https://github.com/editframe/allbirds-tree-runner-demo.git
cd allbirds-tree-runner-demo
npm install
npm start
npm run render
```

1. **Re-time beats** — adjust constants in `src/constants.ts` (`HOOK_IN/OUT`, `HERO_IN/OUT`, …).
2. **Rebrand** — replace palette and font `@font-face` declarations in `src/constants.ts` and `src/styles.css`.
3. **Re-skin wells** — replace `src/assets/well-a-people-walk.mp4` / `well-b-material-macro.mp4` and update `WELL_A` / `WELL_B` rects in `src/constants.ts`.
4. **Swap audio** — replace `src/assets/music-bed.mp3` and adjust the `<Audio>` `volume` in `src/Video.tsx`; log in [`CREDITS.md`](CREDITS.md).

---

## License

[MIT](LICENSE) — free for commercial use, no attribution required. Allbirds branding, product imagery, brand typefaces, and the music bed are property of their respective owners and are not licensed for reuse — see [`CREDITS.md`](CREDITS.md).

---

<div align="center">

Built with [Editframe](https://editframe.com) · Brand: Allbirds

</div>
