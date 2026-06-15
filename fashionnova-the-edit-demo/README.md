<div align="center">

# Fashion Nova — The Edit

**A 25-second 9:16 social ad demo, built with the [Editframe](https://editframe.com) React SDK.**

Ink bleeds through see-through FASHION NOVA letters, swing-tickets swing in on a rack, a card-deck fans into THE EDIT, a full-frame dress-spec infographic builds, and the piece lands on an image-filled outro lockup — pure stills choreographed in-engine, no video-in-frame.

[![License: MIT](https://img.shields.io/badge/license-MIT-202020.svg?style=for-the-badge)](LICENSE)
[![Built with Editframe](https://img.shields.io/badge/built_with-Editframe-000000?style=for-the-badge)](https://editframe.com)
[![Brand: Fashion Nova](https://img.shields.io/badge/brand-Fashion_Nova-000000?style=for-the-badge)](#brand)
[![Format](https://img.shields.io/badge/1080×1920-30fps-202020?style=for-the-badge)](#)
[![Audio: music-only](https://img.shields.io/badge/audio-music--only-8A8A8A?style=for-the-badge)](CREDITS.md)

</div>

---

## Watch

<!-- Inline player: open an issue/PR editor on this repo, drag-drop output/demo.mp4 into the
     text box so GitHub mints a https://github.com/user-attachments/assets/<uuid> URL, then
     paste that bare URL on its own line right here and commit. -->

> The final shipped render sits at [`output/demo.mp4`](output/demo.mp4) (1080×1920 · 30fps · ~25s, music baked in). GitHub markdown can't embed a local MP4 directly — to get an inline player here, open an issue or PR editor on this repo, drag-drop `output/demo.mp4` into the text box to mint a `https://github.com/user-attachments/assets/<uuid>` URL, then paste that bare URL on its own line above this note and commit.

---

## Quick start

```bash
npm install
NO_COLOR=1 FORCE_COLOR=0 npm run render    # → output/demo-silent.mp4
bash add-music.sh                          # → output/demo.mp4  (music muxed, no SFX)
```

> **Windows quirk:** Editframe CLI's Vite spawn parses ANSI-colored stdout. The `NO_COLOR=1 FORCE_COLOR=0` prefix is required or render init times out.

The pipeline is a two-step composite: `npm run render` writes the silent video, then `add-music.sh` lays the music bed underneath to produce the committed `output/demo.mp4`. The committed cut already has the audio baked in — `add-music.sh` simply documents and reproduces it.

---

## Scene timeline

| # | Time | Scene | What happens |
|---|---|---|---|
| 1 | `0.0 – 4.0s` | **S1 · Cover** | See-through FASHION NOVA wordmark (type-as-window), vertically centered, with black ink (`TEX_INK`) bleeding through the letterforms; a silver "UP TO 80% OFF" swing tag flicks in |
| 2 | `4.0 – 9.0s` | **S2 · Swing-ticket rack** | Big hanging swing-tickets swing in on strings under a "SHOP THE LOOK / NEW ARRIVALS" header — numbered 01/02/03, on-model look photos cropped into the tag faces, silver `$39.99` price chips, mono chrome |
| 3 | `9.0 – 14.5s` | **S3 · The Edit (card-deck)** | A fanned card-deck of looks flies in, the "THE EDIT" title rises while fanned, then the deck deals out into a gridded THE EDIT layout with header / rule / footer chrome |
| 4 | `14.5 – 19.5s` | **S4 · Spec infographic** | A full-frame dress-spec INFOGRAPHIC builds — "THE EDIT" header, a silver "FINAL HOURS" chip, and four full-width spec bands staggering up over a mono ground |
| 5 | `19.5 – 25.0s` | **S5 · Outro** | Image-filled FASHION NOVA letters resolve with `FASHIONNOVA.COM` + `NEW ARRIVALS DAILY`, holding on the clean lockup (no redundant %OFF tag) |

---

## Audio

The soundtrack is a single **music-only** bed — the purpose-built track "Velvet Pavement" — laid under the full 25 seconds. There are **no sound effects** in this video. The mux is reproduced by [`add-music.sh`](add-music.sh), which trims the bed to length, fades it in, fades it out under the outro hold, and limits the peak.

| Cue | Master ms | Source |
|---|---|---|
| Music bed | 0 – 25000 | `audio/Fashionnova Velvet_Pavement.mp3` (start 0s, fade-in 0.3s, fade-out 1.5s, peak-limited 0.97) |

All audio is cleared for commercial use → see [`CREDITS.md`](CREDITS.md).

---

## Brand

Fashion Nova is a **black & white brand** (theme `#000000`, no fixed accent color). Every *built* graphic — type, swing-tags, %OFF chips, spec bands, marks — is rendered black / white / grey / **silver**; the real on-model look photos and the `TEX_INK` keep their natural color. Oversized UPPERCASE Montserrat carries the type. Source of truth: `src/constants.ts` (palette) + `src/Video.tsx` (the silver accent scale). Text never reads pure `#000` flat against pure black.

| Token | Hex | Use |
|---|---|---|
| BLACK | `#000000` | THE brand color — grounds, type |
| WHITE | `#FFFFFF` | Surfaces, card fills, primary type on dark |
| OFF_WHITE | `#F6F4F1` | Paper / magazine-page ground (`TEX_PAPER`) |
| INK | `#111111` | Near-black body text |
| GREY | `#8A8A8A` | Muted secondary text |
| LINE | `#E2DED7` | Subtle rules / borders |
| SILVER | `#C9CDD2` | Mono accent (replaces all yellow/magenta) |
| SILVER_GRAD | `#F2F4F6 → #C9CDD2 → #9AA0A6` | Premium tag / chip gradient (dark text on top) |
| SILVER_DIM | `#9AA0A6` | Low edge of the silver scale |
| Type | Montserrat (400–900) | Proxima Nova substitute, embedded in `src/styles.css` |

---

## Repo layout

```
.
├── README.md                          ← you are here
├── LICENSE                            ← MIT
├── BRIEF.md                           ← creative brief + scene plan (the STITCH)
├── CREDITS.md                         ← audio provenance
├── brand-rules-fashionnova.md         ← brand spec (canonical: src/constants.ts)
├── add-music.sh                       ← music mux → output/demo.mp4 (no SFX)
├── .env.example                       ← env vars (none required to render)
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── audio/
│   └── Fashionnova Velvet_Pavement.mp3 ← music bed (laid under the full 25s)
├── output/
│   └── demo.mp4                        ← final shipped render (music muxed)
└── src/
    ├── Video.tsx                       ← composition root (25s, 5 scenes, ONE Timegroup)
    ├── main.tsx                        ← TimelineRoot mount
    ├── constants.ts                    ← canonical palette / type / clock tokens
    ├── styles.css                      ← Montserrat @font-face + Tailwind
    ├── assets.ts                       ← base64 look photos + editorial textures
    ├── assets/                         ← source jpg looks, textures, Montserrat woff2
    └── components/
        └── helpers.ts                  ← track, lerp, clamp, easing helpers (outBack…)
```

---

## Fork & adapt

```bash
git clone https://github.com/editframe/fashionnova-the-edit-demo.git
cd fashionnova-the-edit-demo
npm install
NO_COLOR=1 FORCE_COLOR=0 npm run render
bash add-music.sh
```

1. **Swap the story** — all five scenes live in `src/Video.tsx` as one fixed 25000ms `<Timegroup>` driven by `onFrame`; retune a scene's `ms` window or its animation logic to re-cut a beat.
2. **Rebrand** — edit the palette/type tokens in `src/constants.ts` and the silver accent scale at the top of `src/Video.tsx`. Keep built graphics mono; let real photos keep their color.
3. **Swap the looks** — replace the base64 entries in `src/assets.ts` (source jpgs live in `src/assets/`).
4. **Re-time the audio** — drop a new track in `audio/` and update the filename + fades in `add-music.sh` (log it in [`CREDITS.md`](CREDITS.md)).
5. **Render** — `NO_COLOR=1 FORCE_COLOR=0 npm run render`, then `bash add-music.sh`.

---

## License

[MIT](LICENSE) — free for commercial use, no attribution required.

---

<div align="center">

Built with [Editframe](https://editframe.com) · Brand: Fashion Nova

</div>
