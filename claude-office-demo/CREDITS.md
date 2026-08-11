<div align="center">

# Audio Credits

**Every audio file bundled in this template is cleared for commercial use.**
Sources and licenses documented below. If you replace any file, update this
document so downstream forkers can verify provenance.

</div>

---

## Music

### `src/assets/claude-office-demo-music-bed.mp3`

| | |
|---|---|
| **Title** | Optimal Flow |
| **Source** | [Pixabay Music](https://pixabay.com/music/) — royalty-free |
| **License** | [Pixabay Content License](https://pixabay.com/service/license-summary/) |
| **Commercial use** | ✅ Allowed |
| **Attribution required** | ❌ No (credit appreciated) |
| **Redistribution** | ✅ Permitted as part of derivative work |

A calm, modern tech-bed that matches the editorial Claude feel — clean, no vocal interference. Trimmed to 24.5s, loudnorm'd to −26 LUFS, faded in over 0.4s and out over the last 1.8s, baked in ahead of time (single local `ffmpeg` pass, not applied at render time) and played back as a native `<Audio>` element spanning the whole composition (`src/Video.tsx`). Replace freely with anything from [Pixabay](https://pixabay.com/music/), [Free Music Archive](https://freemusicarchive.org/), or [Incompetech](https://incompetech.com/music/royalty-free/).

---

## SFX

### `src/assets/sfx/claude-office-demo-keyboard.wav`

| | |
|---|---|
| **Type** | Keyboard typing (mechanical) |
| **Source** | [Pixabay SFX](https://pixabay.com/sound-effects/) — royalty-free |
| **License** | [Pixabay Content License](https://pixabay.com/service/license-summary/) — commercial use cleared |
| **Used for** | The typed prompt in Scene 3 (1.4s, master `9500ms`) |

### `src/assets/sfx/claude-office-demo-click.mp3`

| | |
|---|---|
| **Type** | UI click |
| **Source** | [Pixabay SFX](https://pixabay.com/sound-effects/) — royalty-free |
| **License** | [Pixabay Content License](https://pixabay.com/service/license-summary/) — commercial use cleared |
| **Used for** | Scene 2 logo press-pop (master `5800ms`) and the Scene 3 send button (master `12400ms`) |

---

## Want to swap audio?

1. Drop your replacement file in `src/assets/` (or `src/assets/sfx/` for cues) and update the matching `<Audio src="...">` in `src/Video.tsx` / the relevant scene under `src/scenes/`.
2. Update the corresponding row above with source + license info.

For 100% safe royalty-free sources:

- 🎵 **Music** — [Pixabay Music](https://pixabay.com/music/) · [Free Music Archive](https://freemusicarchive.org/) (filter CC0/CC-BY) · [Incompetech](https://incompetech.com/music/royalty-free/) (CC-BY, just credit Kevin MacLeod)
- 🔊 **SFX** — [Pixabay SFX](https://pixabay.com/sound-effects/) · [Freesound.org](https://freesound.org/) (filter CC0) · [Zapsplat](https://www.zapsplat.com/)

When in doubt about a track's license, don't ship it. Pixabay's blanket Content License is the simplest path.
