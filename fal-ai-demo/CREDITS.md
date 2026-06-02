<div align="center">

# Audio Credits

**Every audio file bundled in this template is cleared for commercial use.**
Sources and licenses documented below. If you replace any file, update this
document so downstream forkers can verify provenance.

</div>

---

## Music

### `audio/music-bed.mp3`

| | |
|---|---|
| **Title** | Feeling Playful |
| **Artist** | Jonas Blakewood |
| **Source** | [Pixabay — track 310828](https://pixabay.com/music/beats-feeling-playful-310828/) |
| **License** | [Pixabay Content License](https://pixabay.com/service/license-summary/) |
| **Commercial use** | ✅ Allowed |
| **Attribution required** | ❌ No (credit appreciated) |
| **Redistribution** | ✅ Permitted as part of derivative work |

A bright, optimistic, lightly bouncy bed that matches Figma's collaborative, creative tone. Replace freely with anything from Pixabay, [Free Music Archive](https://freemusicarchive.org/), or [Incompetech](https://incompetech.com/music/royalty-free/) — keep the filename `music-bed.mp3` or update `add-sfx-v12.sh` accordingly.

---

## SFX

### `audio/keyboard.wav`

| | |
|---|---|
| **Type** | Mechanical keyboard typing |
| **Source** | Free UI SFX collection |
| **License** | Royalty-free, commercial use cleared |
| **Used for** | SceneB agent prompt typing (10.6–13.7s) and SceneC chat input typing (23.3–25.9s) |

### `audio/click-hd-loud.mp3`

| | |
|---|---|
| **Type** | UI click (HD, high-headroom) |
| **Source** | "Click Sound Effect (HD)" — separately sourced free SFX |
| **License** | Royalty-free, commercial use cleared |
| **Used for** | Three click cues in SceneA: Progress Card row select (4.6s), Fill swatch → picker (7.0s), color picker hue drag start (14.3s) |

---

## Want to swap audio?

1. Drop your replacement file in `audio/` (match filename or update `add-sfx-v12.sh`).
2. Update the corresponding row above with source + license info.
3. Re-run `bash add-sfx-v12.sh`.

For 100% safe royalty-free sources:

- 🎵 **Music** — [Pixabay Music](https://pixabay.com/music/) · [Free Music Archive](https://freemusicarchive.org/) (filter CC0/CC-BY) · [Incompetech](https://incompetech.com/music/royalty-free/) (CC-BY, just credit Kevin MacLeod)
- 🔊 **SFX** — [Pixabay SFX](https://pixabay.com/sound-effects/) · [Freesound.org](https://freesound.org/) (filter CC0) · [Zapsplat](https://www.zapsplat.com/)

When in doubt about a track's license, don't ship it. Pixabay's blanket Content License is the simplest path.
