<div align="center">

# Rhode — Summer '26

**A 20-second social product ad, built with the [Editframe](https://editframe.com) React SDK.**

A kinetic-premium DTC beauty ad: the lowercase "rhode" wordmark draws on, Highlight Milk pushes in on a dusty-rose color block, a real application video plays inside a framed well, glossy lip swatches and a dewy macro sell the finish, the range and the $100 Summer Kit land, and a stylized site-scroll resolves to "shop rhode · rhodeskin.com".

[![License: MIT](https://img.shields.io/badge/license-MIT-EDE6DA.svg?style=for-the-badge)](LICENSE)
[![Built with Editframe](https://img.shields.io/badge/built_with-Editframe-0066CC?style=for-the-badge)](https://editframe.com)
[![Brand: Rhode](https://img.shields.io/badge/brand-Rhode-2A2320?style=for-the-badge)](#brand)
[![Format](https://img.shields.io/badge/1080×1920-30fps-2A2320?style=for-the-badge)](#)
[![Audio: cleared](https://img.shields.io/badge/audio-commercial--cleared-E8D4D0?style=for-the-badge)](CREDITS.md)

</div>

---

## Watch

<!-- Inline player: drag-drop output/demo.mp4 into a GitHub issue/PR editor (or a comment box)
     on this repo. GitHub uploads it and mints a https://github.com/user-attachments/assets/<uuid>
     URL — paste that bare URL on its own line right here and commit. It renders as a native
     inline <video> player. (GitHub markdown cannot embed a local MP4 path directly.) -->

> The final shipped render sits at [`output/demo.mp4`](output/demo.mp4) (1080×1920, ~20s, with audio). To get an inline player above, drag-drop that file into a GitHub issue editor to mint a `user-attachments` URL, then paste the URL here.

---

## Quick start

```bash
npm install
npm start             # Editframe workbench on localhost
npm run render        # -> output/demo.mp4 (native, single pass)
```

> **Windows:** prefix render with `NO_COLOR=1 FORCE_COLOR=0` to avoid an ANSI hang.

The music bed plays as a single `<Audio>` element spanning the whole composition
(`src/Video.tsx`) — audio sits on the composition timeline alongside everything else,
no post-render mux step.

---

## Scene timeline

| # | Time | Scene | What happens |
|---|---|---|---|
| 1 | `0.0 – 2.0s` | **Hook** | Oat-cream ground; lowercase "rhode" wordmark draws on with "limited edition" / "summer '26" |
| 2 | `2.0 – 4.5s` | **Hero 1** | Dusty-rose color-block wipe; Highlight Milk pushes in, "the dewy look", $28 |
| 3 | `4.5 – 9.0s` | **Application** | A real application video plays inside a premium framed well (stationary), editorial copy around it |
| 4 | `8.7 – 9.5s` | **Dewy texture** | Macro push-in + grain — "the dewy finish / skin-first glow" |
| 5 | `9.5 – 12.8s` | **Result** | Skin macro Ken-Burns + a second framed clip well + glossy lip-swatch grid, "glassy, lit-from-within" |
| 6 | `12.8 – 15.5s` | **Range** | Kinetic montage — sip, macadamia butter, the summer kit + prices |
| 7 | `15.5 – 17.5s` | **Offer** | The Summer Kit, $100, "limited edition" / "summer '26" in a warm oat lockup |
| 8 | `17.5 – 20.0s` | **CTA / scroll** | Stylized rhode site-scroll resolving to "shop rhode" + rhodeskin.com |

---

## Audio

A single music bed runs under the full 20s — loudnorm-normalized (−16 LUFS) with a 0.6s
fade-in and a 1.5s fade-out baked directly into the committed asset. This cut is
**music only**; there are no sound effects. See [`CREDITS.md`](CREDITS.md) for provenance.

| Cue | Master ms | Source file |
|---|---|---|
| Music bed | `0 – 20000` | `src/assets/music-bed.mp3` (loudnorm −16, fade-in 0.6s, fade-out 18.5–20.0s) |

---

## Brand

Rhode runs a warm-neutral, glossy, editorial world — oat-cream ground, espresso type,
dusty rose and cocoa accents, lowercase geometric wordmark with a fine serif italic for
display accents only. No pure white, no pure black, no cool grays. `src/Video.tsx` is
the source of truth for the tokens; full spec in [`brand-rules-rhode.md`](brand-rules-rhode.md).

| Token | Hex | Use |
|---|---|---|
| Oat cream | `#EDE6DA` | Primary canvas / ground |
| Warm white | `#F5F1EA` | Frames, elevated surfaces, warm speculars |
| Card cream | `#E9E1D3` | Product studio cards |
| Espresso | `#2A2320` | Body + headline text (never pure `#000`) |
| Warm brown | `#5C4434` | Secondary text, captions |
| Dusty rose | `#E8D4D0` | Color-block beds, accent |
| Cocoa | `#4A3528` | Deep accent, high-contrast labels |
| Headline / display | Source Serif 4 (italic) | Editorial accent lines only |
| Wordmark / body | Inter (lowercase) | Wordmark, caps, UI, body |

---

## Repo layout

```
.
├── README.md                  ← you are here
├── LICENSE                    ← MIT — free for commercial use
├── BRIEF.md                   ← creative brief + beat map + video-well spec
├── CREDITS.md                 ← audio provenance + licenses
├── brand-rules-rhode.md       ← Rhode brand spec (canonical: src/Video.tsx tokens)
├── .env.example               ← env vars (none required to render)
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── output/
│   └── demo.mp4               ← final shipped render (1080×1920, with audio)
└── src/
    ├── Video.tsx              ← composition root: one root Timegroup (mode="contain")
    │                             wrapping a sequenced Timegroup of scenes + DewyBridge + Audio
    ├── main.tsx               ← TimelineRoot mount
    ├── styles.css             ← all @keyframes (shared Reveal/wipe/bob + per-scene ones)
    ├── constants.ts           ← palette, well specs, SCENES (durations + overlap math)
    ├── assets/                ← product PNGs + campaign lifestyle/macro stills (real
    │                             files — no base64 in source) + music-bed.mp3
    ├── scenes/                ← one file per beat, each its own `<Timegroup mode="fixed">`
    │   ├── Hook.tsx
    │   ├── Hero.tsx
    │   ├── Application.tsx
    │   ├── Result.tsx
    │   ├── Range.tsx
    │   ├── Offer.tsx
    │   └── Cta.tsx
    └── components/
        ├── Reveal.tsx         ← shared fade + float-up/down reveal (CSS-driven)
        ├── ProductCard.tsx    ← shared studio-card shell (Hero, Offer)
        └── DewyBridge.tsx     ← cross-fade bridge sibling of the scene sequence
```

---

## Fork & adapt

```bash
git clone https://github.com/editframe/rhode-demo.git
cd rhode-demo
npm install
npm start
npm run render
```

1. **Swap the story** — each beat is its own `<Timegroup mode="fixed">` under
   [`src/scenes/`](src/scenes), sequenced by the root `<Timegroup mode="sequence">` in
   [`src/Video.tsx`](src/Video.tsx). Retune a scene's own CSS `animation` delays (all
   local to that scene's own clock — see `src/constants.ts`'s `SCENES` doc comment for
   the duration/overlap math) to re-cut a beat.
2. **Rebrand** — replace the palette tokens in `src/constants.ts` (and the spec
   in [`brand-rules-rhode.md`](brand-rules-rhode.md)). Never read pure `#000` or drop
   shadows on text.
3. **Re-skin assets** — drop new product/lifestyle imagery into `src/assets/` and point
   the relevant scene's `<Image src="/assets/...">` at the new file.
4. **Swap the music** — replace `src/assets/music-bed.mp3` and adjust the `<Audio>`
   `volume` in `src/Video.tsx`; log it in [`CREDITS.md`](CREDITS.md).
5. **Render** — `npm run render`.

---

## License

[MIT](LICENSE) — free for commercial use, no attribution required. Bundled audio assets
retain their own licenses (all commercial-cleared, documented in [`CREDITS.md`](CREDITS.md)).
Rhode product and campaign imagery are brand assets used for demonstration only — swap in
your own before shipping a real campaign.

---

<div align="center">

Built with [Editframe](https://editframe.com) · Brand: Rhode

</div>
