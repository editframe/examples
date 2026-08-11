<div align="center">

# OLIPOP — A New Kind of Soda

**A 20-second retro-illustrated social ad, built with the [Editframe](https://editframe.com) React SDK.**

A rotating-sunburst hook lifts the OLIPOP wordmark, a Tropical Punch can pushes in over rising bubbles, a real retro-animation clip plays inside a stationary framed well, the sugar-swap health story slams in (39g → 4g · 9g fiber), the flavor rainbow montages into a grid, and it resolves on a "drink olipop" lockup.

[![License: MIT](https://img.shields.io/badge/license-MIT-E8503A.svg?style=for-the-badge)](LICENSE)
[![Built with Editframe](https://img.shields.io/badge/built_with-Editframe-0066CC?style=for-the-badge)](https://editframe.com)
[![Brand: OLIPOP](https://img.shields.io/badge/brand-OLIPOP-14433D?style=for-the-badge)](#brand)
[![Format](https://img.shields.io/badge/1080×1920-30fps-14433D?style=for-the-badge)](#)
[![Audio: music](https://img.shields.io/badge/audio-music-F2B705?style=for-the-badge)](CREDITS.md)

</div>

---

## Watch

<!--
  Inline player: open a new Issue (or PR/comment) in this repo, drag-drop
  output/demo.mp4 into the editor so GitHub mints a
  https://github.com/user-attachments/assets/<uuid> URL, then paste that bare
  URL on its own line right here and commit. It renders as a native <video>.
-->

> The final shipped render sits at [`output/demo.mp4`](output/demo.mp4) — 1080×1920 · 30fps · ~20s · with audio.

---

## Quick start

```bash
npm install
NO_COLOR=1 FORCE_COLOR=0 npm run render    # → output/demo.mp4  (music baked in natively, well footage composited, audio carried through)
```

The music bed is a native `<Audio>` element on the composition timeline (see
[`src/Video.tsx`](src/Video.tsx)) — no post-render audio mux script needed. The video
well is still composited in as a separate FFmpeg pass, chained into the `render` npm
script: the React render leaves the well **empty** with a poster placeholder
(`output/demo-silent.mp4`, audio already baked in), and `composite-well.sh` overlays the
real OLIPOP retro-animation clip into the exact well rect (`180,640,720,720`, r36) during
the stationary `5–9s` window, carrying the existing audio track straight through
(`-map 0:a? -c:a copy`) into the final `output/demo.mp4` — pending a native
CSS-masking replacement for the well-compositing step itself.

> **Windows quirk:** the Editframe CLI's Vite spawn parses ANSI-colored stdout. The
> `NO_COLOR=1 FORCE_COLOR=0` prefix is required or render init times out. Run the
> `.sh` steps in Git Bash / WSL.

---

## Scene timeline

| # | Time | Scene | What happens |
|---|---|---|---|
| 1 | `0.0 – 2.0s` | **Hook** | Rotating coral sunburst + twinkle stars; OLIPOP wordmark mask-wipes up on a cream sticker-badge, palm emblem, "a new kind of soda" bounce-settles; coral color-block wipes out |
| 2 | `2.0 – 5.0s` | **Can hero** | Tropical Punch can cinematic push-in on a coral sunburst + concentric rings — rising bubbles, condensation specular sweep, grounded shadow + bob, "tropical punch" + "prebiotics · botanicals · plant fiber" |
| 3 | `5.0 – 9.0s` | **Video well** | A chunky retro-TV badge (gold star, blinking "NOW PLAYING" pill) holds **perfectly stationary** around the fixed well `180,640,720,720`; the real OLIPOP retro-animation plays inside, editorial copy around it |
| 4 | `9.0 – 12.2s` | **The swap** | "regular soda 39g sugar" card slides in and gets struck through + grayed; a "vs" pops; the OLIPOP card slams in — "4g sugar", "9g fiber", "gut-healthy" chips stagger up |
| 5 | `12.2 – 16.2s` | **Flavor rainbow** | Six flavor cans montage with a color-block flip per flavor, then collapse into a 3×2 grid under "find your flavor" |
| 6 | `16.2 – 18.2s` | **Offer** | The 12-pack pushes in on a sunburst, "build your variety pack" drops, supporting line clip-wipes in |
| 7 | `18.2 – 20.0s` | **CTA** | Outro coral sunburst + concentric rings open, the "drink olipop" lockup pops + bobs, sparkle stars twinkle, drinkolipop.com rises in |

---

## Audio

A single music bed runs under the full 20s — loudnorm-normalized with a fade-in at the
top and a fade-out under the CTA hold. This cut is **music only**; there are no sound
effects. It's a native `<Audio>` element on the composition timeline (see
[`src/Video.tsx`](src/Video.tsx)); the fades/normalization are baked into the committed
asset itself, no runtime mux. See [`CREDITS.md`](CREDITS.md) for provenance.

| Cue | Master ms | Source file |
|---|---|---|
| Music bed | 0 – 20000 | `src/assets/olipop-demo-music-bed.mp3` (loudnorm −16, fade-in 0.6s, fade-out 18.5s baked in) |

---

## Brand

OLIPOP runs a retro-illustrated, nostalgic palette — seafoam/mint ground, deep teal/forest
ink, warm cream, with coral as the Tropical Punch hero accent and golden sunburst rays.
**Playfair Display** (warm Windsor-ish serif) carries the display voice; **Archivo** (clean
grotesque sans) handles tracked caps and body. Tokens are the source of truth in
[`src/constants.ts`](src/constants.ts); text never uses pure `#000`.

| Token | Hex | Use |
|---|---|---|
| `SEAFOAM` | `#BFE3E0` | Tropical can body / mint ground |
| `SEAFOAM_LT` | `#EAF5F6` | Pale seafoam wash |
| `TEAL_INK` | `#14433D` | Display ink, borders, body on light |
| `TEAL_DEEP` | `#0E332E` | Deep backing / well interior |
| `CREAM` | `#F3ECDD` | Warm cream surfaces |
| `CREAM_LT` | `#FAF4E8` | Badge / card fills |
| `CORAL` | `#E8503A` | Tropical Punch accent, wordmark, CTA |
| `SOFT_PINK` | `#F2B6AA` | Soft pink sunburst accent |
| `SUNSET_GOLD` | `#F2B705` | Golden sunburst rays, star flourish |
| Headline font | Playfair Display (serif) | Wordmark + display copy |
| Body font | Archivo (sans) | Tracked caps, labels, body |

---

## Repo layout

```
.
├── README.md                  ← you are here
├── LICENSE                    ← MIT (code) + brand/audio notes
├── BRIEF.md                   ← creative brief + scene plan
├── CREDITS.md                 ← audio provenance + brand notes
├── brand-rules-olipop.md      ← brand spec (canonical: src/constants.ts)
├── .env.example               ← env vars (none required to render)
├── composite-well.sh          ← FFmpeg: real clip → the fixed video well (video-only pass)
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── assets/
│   ├── well-video.mp4         ← OLIPOP retro-animation composited into the well (5–9s)
│   └── well-mask.png          ← 720×720 rounded-rect alpha mask for the well
├── output/
│   └── demo.mp4               ← final shipped render (well composited + audio)
└── src/
    ├── Video.tsx              ← composition root: outer Timegroup (contain) + the
    │                            sequence of the 7 scenes below + AmbientField
    ├── main.tsx
    ├── constants.ts           ← canonical brand tokens + SCENES (per-scene durations,
    │                            derived from the shared crossfade overlap)
    ├── styles.css             ← fonts, base reset, every scene's @keyframes
    ├── assets/                ← can/pack/poster art (raw PNG + optimized WebP, referenced
    │                            directly via <Image src="/assets/opt/...">) + olipop-demo-music-bed.mp3
    │                            (fades/normalization baked in, referenced via <Audio>)
    ├── scenes/                ← one file per beat, each its own <Timegroup mode="fixed">
    │   ├── Hook.tsx
    │   ├── Hero.tsx
    │   ├── Well.tsx
    │   ├── Swap.tsx
    │   ├── Rainbow.tsx
    │   ├── Offer.tsx
    │   └── Cta.tsx
    └── components/
        ├── retro.tsx          ← Sunburst, Rings, Star, PalmEmblem (static SVG art)
        ├── Reveal.tsx         ← reusable fade + float-in/out entrance, driven by CSS
        │                        @keyframes instead of a per-frame ref mutation
        └── AmbientField.tsx   ← whole-video print grain + vignette (outside the camera-drift wrapper)
```

---

## Fork & adapt

```bash
git clone https://github.com/editframe/olipop-demo.git
cd olipop-demo
npm install
NO_COLOR=1 FORCE_COLOR=0 npm run render
```

1. **Swap the story** — each beat is its own file under `src/scenes/`, with its own local
   clock (see `SCENES` in `src/constants.ts` for durations). Edit a scene's CSS
   `@keyframes` in `src/styles.css` or its `<Reveal>` timing to change what it does.
2. **Rebrand** — replace the tokens in `src/constants.ts` (seafoam, teal, coral, cream,
   fonts). Never read pure `#000` or drop shadows on text.
3. **Re-skin the well** — drop a new clip at `assets/well-video.mp4` and a matching
   720×720 alpha mask at `assets/well-mask.png`; the well rect stays `180,640,720,720`.
4. **Swap the music** — bake fades/normalization into a replacement track locally with
   FFmpeg (audio-only, no video) and drop it at `src/assets/olipop-demo-music-bed.mp3`, then update
   the `MUSIC` constant in `src/Video.tsx` if you rename it; log it in
   [`CREDITS.md`](CREDITS.md).
5. **Render** — `NO_COLOR=1 FORCE_COLOR=0 npm run render` (chains the Editframe render and the well-compositing pass into one command).

---

## License

[MIT](LICENSE) — the demo **code** is free for commercial use, no attribution required.
OLIPOP brand assets and bundled media are demo-only; see [`LICENSE`](LICENSE) and
[`CREDITS.md`](CREDITS.md).

---

<div align="center">

Built with [Editframe](https://editframe.com) · Brand: OLIPOP

</div>
