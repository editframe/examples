<div align="center">

# Gymshark — Geo Seamless

**A ~19-second 9:16 social ad demo, built with the [Editframe](https://editframe.com) React SDK.**

A geo-camo logo hook snaps into the Geo Seamless tee, real athlete-training and fabric-macro footage drops into engineered video wells, an 8-colorway selector cycles the range, and it closes on a SHOP NOW lockup — strict dark monochrome, bold uppercase, six distinct seamless transitions.

[![License: MIT](https://img.shields.io/badge/license-MIT-F4F4F4.svg?style=for-the-badge)](LICENSE)
[![Built with Editframe](https://img.shields.io/badge/built_with-Editframe-0A0A0A?style=for-the-badge)](https://editframe.com)
[![Brand: Gymshark](https://img.shields.io/badge/brand-Gymshark-000000?style=for-the-badge)](#brand)
[![Format](https://img.shields.io/badge/1080×1920-30fps-1A1A1A?style=for-the-badge)](#)
[![Audio: music bed](https://img.shields.io/badge/audio-music_bed-8A8A8A?style=for-the-badge)](CREDITS.md)

</div>

---

## Watch

<!-- To embed an inline player: open an issue/PR editor on this repo, drag-drop output/demo.mp4
     into the editor so GitHub mints a https://github.com/user-attachments/assets/<uuid> URL,
     then paste that bare URL on its own line right here and commit. -->

> The final shipped render sits at [`output/demo.mp4`](output/demo.mp4) — 1080×1920, 30fps, ~19s, with the music bed muxed in.

---

## Quick start

```bash
npm install

# 1) render the SILENT composition (Editframe → React)
NO_COLOR=1 FORCE_COLOR=0 npm run render      # → output/demo-silent.mp4

# 2) finalize: composite the real brand footage into the wells + mux the music
bash add-audio.sh                            # → output/demo.mp4
```

This is the **video-in-frame** pipeline. The Editframe render is silent and leaves two fixed
empty wells; `add-audio.sh` composites the real Gymshark athlete + fabric footage into those
wells (FFmpeg overlay with rounded-rect masks read from [`wells.json`](wells.json)) and muxes the
music bed. Requires `ffmpeg`, `ffprobe`, and `python3` + Pillow (for the well masks).

> **Windows quirk:** the Editframe CLI's Vite spawn parses ANSI-colored stdout. The
> `NO_COLOR=1 FORCE_COLOR=0` prefix is required or render init times out.

---

## Scene timeline

| # | Time | Scene | What happens |
|---|---|---|---|
| 1 | `0.00 – 1.25s` | **HOOK** | Calm geo-camo drift on near-black; the real GYMSHARK fin + wordmark lockup wipes in left→right and settles. One confident move, hard cut to the hero |
| 2 | `1.25 – 4.35s` | **PRODUCT HERO** | The on-model Geo Seamless tee, clean; "GEO SEAMLESS / T-SHIRT" + "$36" snap in tight succession, then the scene holds and breathes |
| 3 | `4.35 – 8.50s` | **ATHLETE · WELL_A** | Gritty gym-training footage fills the framed well (real video composited after render); "BUILT FOR THE GRIND" / "ENGINEERED TO MOVE" |
| 4 | `8.50 – 10.85s` | **SEAMLESS FEATURE** | Detail-crop push with staggered callouts: "SEAMLESS KNIT" · "4-WAY STRETCH" · "SWEAT-WICKING" |
| 5 | `10.85 – 14.00s` | **FABRIC · WELL_B** | Seamless geo-knit fabric macro fills the well; "ENGINEERED, NOT SEWN" headline + a spec panel (stretch recovery, breathability, SEAM COUNT 0) |
| 6 | `14.00 – 16.90s` | **COLORWAY SELECTOR** | A real selector — 8 product-shot swatches + a large main preview cycling all 8 colorways with their names; "8 COLORWAYS / FIND YOURS" |
| 7 | `16.90 – 19.00s` | **CTA / OUTRO** | Real logo lockup on dark fabric texture → "SHOP GEO SEAMLESS" → "SHOP NOW" pill → "FROM $36" → GYMSHARK.COM |

The six inter-scene cuts each get a **distinct, complex, seamless transition** — no reused wipe.
See [`BRIEF.md`](BRIEF.md) for the transition map (T1–T6).

---

## Audio

The soundtrack is a single **music bed** — "Gymshark Summit at Dawn" — laid under the full ~19s.
There are **no sound effects** in this video; it is music only. The mux is reproduced by
[`add-audio.sh`](add-audio.sh), which takes the track from `0:30` (a fuller later section), fades
it in, fades it out under the CTA hold, and brick-wall limits it.

| Cue | Master ms | Source |
|---|---|---|
| Music bed | `0 – 19000` | `audio/Gymshark Summit_at_Dawn.mp3` (from 0:30, fade-in 1.5s, fade-out −1.5s, `alimiter=0.97`) |

Brand footage composited into the wells is documented in [`CREDITS.md`](CREDITS.md).

---

## Brand

Gymshark runs a strict dark monochrome palette — near-black ground, charcoal panels, one mid-grey
— with heavy uppercase grotesque type (Archivo Black) and the geo-camo halftone motif. **Zero
color casts.** `src/constants.ts` is the source of truth; text never reads pure `#000` or carries
soft drop shadows. Full spec in [`brand-rules-gymshark.md`](brand-rules-gymshark.md).

| Token | Hex | Use |
|---|---|---|
| `NEAR_BLACK` | `#0A0A0A` | Primary canvas / ground |
| `BLACK` | `#000000` | Deepest fills, vignette |
| `CHARCOAL` | `#1A1A1A` | Panels, cards, frame fills |
| `CHARCOAL_2` | `#262626` | Secondary panels, raised surfaces |
| `GREY_MID` | `#8A8A8A` | Secondary / muted text |
| `GREY_LINE` | `#3A3A3A` | Hairlines, borders, dividers |
| `OFF_WHITE` | `#F4F4F4` | Primary text on dark |
| `WHITE` | `#FFFFFF` | Headlines, focal accent, logo |
| Display font | Archivo Black / Archivo | Heavy uppercase grotesque headlines + wordmark |
| Body font | Inter | UI labels, specs, captions |

---

## Repo layout

```
.
├── README.md                  ← you are here
├── LICENSE                    ← MIT
├── BRIEF.md                   ← creative brief + scene/transition plan
├── CREDITS.md                 ← audio + brand-footage provenance
├── brand-rules-gymshark.md    ← brand spec (canonical: src/constants.ts)
├── add-audio.sh               ← composite brand footage into wells + mux music → output/demo.mp4
├── _finalize_helper.py        ← builds rounded-rect well masks from wells.json
├── wells.json                 ← exact WELL_A / WELL_B composite rects
├── .env.example               ← env vars (none required to render)
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── audio/
│   ├── Gymshark Summit_at_Dawn.mp3  ← music bed
│   └── brand-video/                 ← real Gymshark footage for the two wells
│       ├── athlete-gslc-9x16.mp4    ← WELL_A
│       └── fabric-macro.mp4         ← WELL_B
├── output/
│   └── demo.mp4               ← final shipped render (footage composited + music muxed)
└── src/
    ├── Video.tsx              ← composition root (7 beats, 6 transitions, ~19s)
    ├── main.tsx
    ├── constants.ts          ← canonical brand tokens + master timing + well rects
    ├── styles.css
    ├── assets.ts             ← base64-inlined brand imagery (Editframe inlining)
    ├── assets/               ← source brand imagery (models, colorways, logo, posters)
    └── components/
        └── helpers.ts        ← track, lerp, clamp, easings (outBack, easeOutCubic…)
```

---

## Fork & adapt

```bash
git clone https://github.com/editframe/gymshark-geo-seamless-demo.git
cd gymshark-geo-seamless-demo
npm install
NO_COLOR=1 FORCE_COLOR=0 npm run render
bash add-audio.sh
```

1. **Swap the story** — each of the 7 beats has its timing in `src/constants.ts` (`*_IN` / `*_OUT`
   master-ms constants) and its render body in `src/Video.tsx`. Retime by editing the constants.
2. **Rebrand** — replace the tokens in `src/constants.ts` and the imagery in `src/assets/`
   (re-inline into `src/assets.ts`). Keep type off pure `#000`, no drop shadows.
3. **Re-place the wells** — edit the rects in `wells.json`; `add-audio.sh` reads them to build the
   masks and overlay positions. Drop replacement footage into `audio/brand-video/`.
4. **Re-time the audio** — adjust `MUSIC_START` / `FADE_IN` (and the fades/limiter) in
   `add-audio.sh`; log the new source in [`CREDITS.md`](CREDITS.md).
5. **Render** — `NO_COLOR=1 FORCE_COLOR=0 npm run render`, then `bash add-audio.sh`.

---

## License

[MIT](LICENSE) — free for commercial use, no attribution required. Bundled brand imagery, footage,
and music are governed by their own licensing; see [`CREDITS.md`](CREDITS.md) before redistributing.

---

<div align="center">

Built with [Editframe](https://editframe.com) · Brand: Gymshark

</div>
