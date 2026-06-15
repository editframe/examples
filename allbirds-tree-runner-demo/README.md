<div align="center">

# Allbirds — Tree Runner NZ

**A 25-second 9:16 social ad, built with the [Editframe](https://editframe.com) React SDK.**

The lowercase "allbirds" wordmark floats in on oat, the Tree Runner NZ rises weightless into a clean product hero, real material-macro footage fills two refined wells, the natural-materials story and carbon proof settle in, the muted colorway range drifts up, and it closes on "shop now" — calm, warm, premium-quiet throughout.

[![License: MIT](https://img.shields.io/badge/license-MIT-9AA48B.svg?style=for-the-badge)](LICENSE)
[![Built with Editframe](https://img.shields.io/badge/built_with-Editframe-212121?style=for-the-badge)](https://editframe.com)
[![Brand: Allbirds](https://img.shields.io/badge/brand-Allbirds-ECE9E2?style=for-the-badge&labelColor=8C857A)](#brand)
[![Format](https://img.shields.io/badge/1080×1920-30fps-212121?style=for-the-badge)](#)
[![Audio: music-only](https://img.shields.io/badge/audio-music--only-8C857A?style=for-the-badge)](CREDITS.md)

</div>

---

## Watch

> Drag-drop [`output/demo.mp4`](output/demo.mp4) into a GitHub issue/PR comment editor to mint a `https://github.com/user-attachments/assets/<uuid>` URL, then paste that bare URL on its own line here to render an inline player.

> The final shipped render sits at [`output/demo.mp4`](output/demo.mp4) (1080×1920, 30fps, ~25s, music muxed) if you want to grab it directly.

---

## Quick start

This is a **two-step composite pipeline**: the SDK renders the silent motion-graphics base, then `add-audio.sh` composites the real Allbirds material/lifestyle footage into the two video "wells" and muxes the music bed.

```bash
npm install
NO_COLOR=1 FORCE_COLOR=0 npm run render   # → output/demo-silent.mp4 (silent base)
bash add-audio.sh                         # → output/demo.mp4  (wells composited + music muxed)
```

> **Windows quirk:** Editframe CLI's Vite spawn parses ANSI-colored stdout. The `NO_COLOR=1 FORCE_COLOR=0` prefix is required or render init times out.

> `add-audio.sh` needs `ffmpeg` and `python3` (Pillow) on the PATH — Pillow draws the rounded-rect well masks. The committed `output/demo.mp4` already contains this result; the script documents and reproduces it.

---

## Scene timeline

| # | Time | Scene | What happens |
|---|---|---|---|
| 1 | `0.0 – 2.0s` | **Hook** | Lowercase "allbirds" wordmark + "EFFORTLESS BY NATURE" float in on oat; wool fibers settle. One soft, confident move |
| 2 | `2.0 – 6.0s` | **Product hero** | The Tree Runner NZ floats in weightless on a soft sand tile; "TREE RUNNER NZ" + `$100`. Clean, huge negative space |
| 3 | `6.0 – 11.0s` | **Lifestyle — Well A** | Real portrait lifestyle footage fills the framed Well A + "WEAR ALL DAY COMFORT" |
| 4 | `11.0 – 14.5s` | **Materials** | MERINO WOOL · TREE FIBER · SUGARCANE callouts over a knit macro + the carbon-footprint number in mono |
| 5 | `14.5 – 19.0s` | **Material macro — Well B** | Real landscape material footage fills the framed Well B + "TREAD LIGHTER" / carbon proof |
| 6 | `19.0 – 22.5s` | **The Range** | The Allbirds family drifts up across the muted palette; a main preview settles on one — "FIND YOUR PAIR" |
| 7 | `22.5 – 25.0s` | **CTA / Outro** | "allbirds" wordmark + "SHOP NOW" + B Corp / carbon-zero proof + "allbirds.com", clean on oat |

Each of the 6 cuts (2.0 / 6.0 / 11.0 / 14.5 / 19.0 / 22.5s) is its own distinct soft material-morph / drift-up transition — no reused wipe, no dead frame. Well footage starts *during* the incoming transition so each well reveals already filled.

---

## Audio

Music-only — no sound effects. The bed is **"The Sharp Pivot"**, started 8 seconds into the track and laid under the full 25 seconds with a gentle fade-in, a fade-out before the close, and a soft limiter. The mux (and the well compositing) is reproduced by [`add-audio.sh`](add-audio.sh). See [`CREDITS.md`](CREDITS.md) for provenance.

| Cue | Master ms | Source |
|---|---|---|
| Music bed | 0 – 25000 | `audio/the-sharp-pivot.mp3` (from 0:08, fade-in 1.2s, fade-out 1.8s before end, limiter 0.95) |
| Well A footage | 6000 – 11000 | `audio/well-a-people-walk.mp4` (portrait lifestyle → Well A) |
| Well B footage | 14500 – 19000 | `audio/well-b-material-macro.mp4` (landscape material macro → Well B) |

---

## Brand

Allbirds reads as lightness, calm, and nature made effortless: an oat canvas, soft natural light, weightless float motion, and Geograph type with tiny letter-spaced caps. One benefit line plus one material/proof line per beat, never loud, never hype. `src/constants.ts` is the source of truth. Text uses soft-black `#212121`, never pure `#000`, and never drops shadows on type.

| Token | Hex | Use |
|---|---|---|
| OAT | `#ECE9E2` | The brand canvas / off-white base |
| SAND | `#E0DACF` | Warm taupe surface / product tiles |
| COOL_OAT | `#E0E2DC` | Faint sage-grey tint |
| INK | `#212121` | Soft near-black text (never pure `#000`) |
| CHARCOAL | `#242729` | Cool charcoal product "void" backdrop |
| STONE | `#8C857A` | Muted warm grey secondary text |
| LINE | `#C9C3B8` | Hairlines on oat |
| SAGE | `#9AA48B` | Chalky nature accent |
| DUSTY_BLUE | `#8FA6AE` | Chalky nature accent |
| DUSTY_MAUVE | `#B49A98` | Chalky nature accent |
| TAUPE | `#B8A992` | Chalky nature accent |
| AUBURN | `#A6603F` | Chalky nature accent |
| Headline / body font | Geograph (embedded) | Headlines + body, light–medium weight |
| Spec / data font | Akkurat Mono (embedded) | Material specs + carbon-footprint number |

Full spec in [`brand-rules-allbirds.md`](brand-rules-allbirds.md).

---

## Repo layout

```
.
├── README.md                  ← you are here
├── LICENSE                    ← MIT
├── BRIEF.md                   ← creative brief + scene plan
├── CREDITS.md                 ← audio + footage provenance
├── brand-rules-allbirds.md    ← brand spec (canonical: src/constants.ts)
├── add-audio.sh               ← composite wells + mux music → output/demo.mp4
├── .env.example               ← env vars (none required to render)
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── audio/                     ← music bed + the two well clips
│   ├── the-sharp-pivot.mp3
│   ├── well-a-people-walk.mp4
│   └── well-b-material-macro.mp4
├── output/
│   └── demo.mp4               ← final shipped render (wells composited + music)
└── src/
    ├── Video.tsx              ← composition root (25s, 7 beats, one fixed Timegroup)
    ├── main.tsx
    ├── constants.ts           ← canonical tokens, beat timings, WELL_A / WELL_B rects
    ├── styles.css             ← Tailwind + base64-embedded Geograph / Akkurat Mono
    ├── assets.ts              ← base64 posters (POSTER_PORTRAIT / POSTER_LANDSCAPE)
    ├── assets_opt.ts          ← downscaled base64 product / colorway / material imagery
    ├── assets/                ← source PNG/JPG product, lifestyle + woff2 fonts
    └── components/
        └── helpers.ts         ← track, lerp, clamp, easings (outBack…)
```

---

## Fork & adapt

```bash
git clone https://github.com/editframe/allbirds-tree-runner-demo.git
cd allbirds-tree-runner-demo
npm install
NO_COLOR=1 FORCE_COLOR=0 npm run render
bash add-audio.sh
```

1. **Swap the story** — the 7 beats live as timing constants in `src/constants.ts` (`HOOK_IN/OUT`, `HERO_IN/OUT`, …) driving one fixed `Timegroup` in `src/Video.tsx`. Retune the windows to re-cut a beat.
2. **Rebrand** — replace the palette + fonts in `src/constants.ts` (and the embedded `@font-face` in `src/styles.css`). Never read pure `#000` or drop shadows on text.
3. **Re-skin the wells** — `WELL_A` / `WELL_B` rects in `src/constants.ts` define where real footage lands. Drop replacement clips in `audio/` and the well rects/offsets are read by `add-audio.sh`.
4. **Re-time the audio** — change `MUSIC_START`, `FADE_IN`, or the well windows in `add-audio.sh`; log replacements in [`CREDITS.md`](CREDITS.md).
5. **Render** — `NO_COLOR=1 FORCE_COLOR=0 npm run render`, then `bash add-audio.sh`.

---

## License

[MIT](LICENSE) — free for commercial use, no attribution required.

---

<div align="center">

Built with [Editframe](https://editframe.com) · Brand: Allbirds

</div>
