<div align="center">

# Audio Credits

**Provenance for the bundled audio was not recorded by the original author.**
Files were carried over from a pre-existing local `ffmpeg` mix script with no
source/license notes attached. Verify clearance before any commercial use, or
swap in a freshly-sourced track per the guidance below.

</div>

---

## Music

### `src/assets/claude-code-financial-demo-music-bed.mp3`

| | |
|---|---|
| **Title / artist** | Unknown — not recorded |
| **Source** | Unknown — inherited from a local `audio/music.mp3` stem, no citation left behind |
| **License** | Unverified — confirm commercial-use clearance before shipping |
| **Treatment** | 23.1s excerpt, `loudnorm` (I=-26, TP=-4, LRA=7), fade in 0.4s, fade out from 21.2s (1.8s), baked into the committed file — see `src/Video.tsx` for the `<Audio>` usage |

## SFX

### `src/assets/sfx/tick.wav`

| | |
|---|---|
| **Type** | Single short UI "tick" |
| **Source** | Unknown — extracted (3.413s–3.463s) from a local `audio/menu-scroll.mp3` stem, no citation left behind |
| **License** | Unverified — confirm commercial-use clearance before shipping |
| **Used for** | 11 scroll-tick cues as the agent-template pill column crosses center (`TitleAndPillsScroll` scene) |

---

## Want to swap audio?

1. Drop your replacement file in `src/assets/` (or `src/assets/sfx/` for cues) and update the corresponding `<Audio src="...">` reference in `src/Video.tsx` / the relevant scene file.
2. Update the corresponding row above with source + license info.
3. Re-render with `npm run render`.

For 100% safe royalty-free sources:

- **Music** — [Pixabay Music](https://pixabay.com/music/) · [Free Music Archive](https://freemusicarchive.org/) (filter CC0/CC-BY) · [Incompetech](https://incompetech.com/music/royalty-free/)
- **SFX** — [Pixabay SFX](https://pixabay.com/sound-effects/) · [Freesound.org](https://freesound.org/) (filter CC0) · [Zapsplat](https://www.zapsplat.com/)

When in doubt about a track's license, don't ship it.
