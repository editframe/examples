<div align="center">

# Audio Credits

**Bundled campaign audio is for demo reproduction only.** Licensing is retained
by the rights holder — swap with a cleared track before commercial redistribution.

</div>

---

## Music

### `src/assets/elevenlabs-vocals-demo-music-bed.wav`

| | |
|---|---|
| **Title / artist** | ElevenLabs campaign soundtrack |
| **Source** | ElevenLabs promo audio |
| **License** | ElevenLabs copyright — demo use only; not cleared for redistribution |
| **Treatment** | Spans the full 25s — see `<Audio>` in `src/Video.tsx` |

## Imagery

| File | Used as | Source / license |
|---|---|---|
| `src/assets/sprite-logo-b.png` | Logo sprite strip (46 frames) | ElevenLabs brand imagery — demo use only |
| `src/assets/wseq-*.png`, `bseq-*.png`, `mseq-*.png` | UI sequence frames | ElevenLabs brand imagery — demo use only |
| `src/assets/c2seq-*.jpg`, `t2seq-*.jpg`, `e2seq-*.jpg`, `i2seq-*.png` | Full-screen product-UI sequences | ElevenLabs brand imagery — demo use only |
| `src/assets/thumb-b1-*.png`, `cap-b1-*.png` | Artwork thumbnails + captions | ElevenLabs brand imagery — demo use only |
| `src/assets/artr-b1-*.png`, `rowt-b1-*.png`, `rowtm-b1-*.png` | Song row artwork + text | ElevenLabs brand imagery — demo use only |
| `src/assets/aurstill-*.png`, `orbcirc-b1.png`, `bigcirc-b3.png` | Aurora / orb effect layers | ElevenLabs brand imagery — demo use only |
| `src/assets/artp-b1.png`, `pilltxt-b2.png`, `pilltime-b2.png` | Player pill elements | ElevenLabs brand imagery — demo use only |
| `src/assets/icon-heart*.png`, `connector-b2.png` | UI icons + connector art | ElevenLabs brand imagery — demo use only |

## Fonts

- [Inter](https://rsms.me/inter/) — [SIL Open Font License 1.1](https://openfontlicense.org/) (`src/assets/fonts/inter-var.woff2`)

---

## Want to swap audio?

1. Drop your replacement file in `src/assets/` and update the `<Audio src="...">` reference in `src/Video.tsx`.
2. Update the corresponding row above with source + license info.
3. Re-render with `npm run render`.
