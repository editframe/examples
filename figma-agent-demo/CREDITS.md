<div align="center">

# Audio Credits

**Every audio file bundled in this template is cleared for commercial use.**
Sources and licenses documented below. If you replace any file, update this
document so downstream forkers can verify provenance.

</div>

---

## Music

### `src/assets/music-bed.mp3`

| | |
|---|---|
| **Title** | Feeling Playful |
| **Artist** | Jonas Blakewood |
| **Source** | [Pixabay — track 310828](https://pixabay.com/music/beats-feeling-playful-310828/) |
| **License** | [Pixabay Content License](https://pixabay.com/service/license-summary/) |
| **Commercial use** | ✅ Allowed |
| **Attribution required** | ❌ No (credit appreciated) |
| **Redistribution** | ✅ Permitted as part of derivative work |

A bright, optimistic, lightly bouncy bed that matches Figma's collaborative, creative tone. Baked as a finished asset (trimmed to 30.8s, faded out from 28.8s, volume-scaled) and played as a single `<Audio>` on the composition root — see `src/Video.tsx`.

---

## SFX

### `src/assets/sfx/keyboard-sceneb.mp3`, `src/assets/sfx/keyboard-scenec.mp3`

| | |
|---|---|
| **Type** | Mechanical keyboard typing |
| **Source** | Free UI SFX collection |
| **License** | Royalty-free, commercial use cleared |
| **Used for** | SceneB agent prompt typing (10.6–13.7s) and SceneC chat input typing (23.3–25.9s) |

Both files are the same source clip (`keyboard.wav`), looped and trimmed once to the exact cue duration needed in each scene (`src/scenes/SceneB_AgentPrompt.tsx`, `src/scenes/SceneC_ThenGoDeep.tsx`).

### `src/assets/sfx/click-hd-loud.mp3`

| | |
|---|---|
| **Type** | UI click (HD, high-headroom) |
| **Source** | "Click Sound Effect (HD)" — separately sourced free SFX |
| **License** | Royalty-free, commercial use cleared |
| **Used for** | Two click cues in SceneA: Progress Card row select (4.6s), Fill swatch → color picker (7.0s) — see `src/scenes/SceneA_FigmaWindow.tsx` |

### `src/assets/sfx/{reveal,pop,ping,confirm,plop}.mp3`

| | |
|---|---|
| **Type** | UI reveal / pop / ping / confirm / plop cues |
| **Source** | Free UI SFX collection |
| **License** | Royalty-free, commercial use cleared |
| **Used for** | Per-scene beat accents, dispatched via `src/components/Sfx.tsx` |

---

## Want to swap audio?

1. Drop your replacement file in `src/assets/` (or `src/assets/sfx/`).
2. Update the corresponding `<Audio>`/`<Sfx>` reference in `src/Video.tsx` or the relevant scene.
3. Update the corresponding row above with source + license info.

For 100% safe royalty-free sources:

- 🎵 **Music** — [Pixabay Music](https://pixabay.com/music/) · [Free Music Archive](https://freemusicarchive.org/) (filter CC0/CC-BY) · [Incompetech](https://incompetech.com/music/royalty-free/) (CC-BY, just credit Kevin MacLeod)
- 🔊 **SFX** — [Pixabay SFX](https://pixabay.com/sound-effects/) · [Freesound.org](https://freesound.org/) (filter CC0) · [Zapsplat](https://www.zapsplat.com/)

When in doubt about a track's license, don't ship it. Pixabay's blanket Content License is the simplest path.
