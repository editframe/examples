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
| **Title** | Dark Suspense Thriller |
| **Artist** | Alex Morgan |
| **Source** | [Pixabay — track 528314](https://pixabay.com/music/ambient-dark-suspense-thriller-528314/) |
| **License** | [Pixabay Content License](https://pixabay.com/service/license-summary/) |
| **Commercial use** | ✅ Allowed |
| **Attribution required** | ❌ No (credit appreciated) |
| **Redistribution** | ✅ Permitted as part of derivative work |

The track is a slow-burn cinematic bed that pairs well with the orchestrated-agents narrative. Replace freely with anything from Pixabay, [Free Music Archive](https://freemusicarchive.org/), or [Incompetech](https://incompetech.com/music/royalty-free/) — keep the filename `music-bed.mp3` or update `add-sfx-v11.sh` accordingly.

---

## SFX

### `audio/keyboard.wav`

| | |
|---|---|
| **Type** | Mechanical keyboard typing |
| **Source** | Free UI SFX collection |
| **License** | Royalty-free, commercial use cleared |
| **Used for** | Hero-prompt typewriter (Scene 1) and second-prompt typewriter (Scene 4) |

### `audio/punch-whoosh.wav`

| | |
|---|---|
| **Type** | Punch + air whoosh impact |
| **Source** | Free SFX collection |
| **License** | Royalty-free, commercial use cleared |
| **Used for** | Four arm-pull impact cues at master 13.1s / 14.1s / 15.1s / 16.1s |

### `audio/click-hd-loud.mp3`

| | |
|---|---|
| **Type** | UI click (HD, high-headroom) |
| **Source** | "Click Sound Effect (HD)" — separately sourced free SFX |
| **License** | Royalty-free, commercial use cleared |
| **Used for** | Not used in this video's mux; included for fork consistency with sibling templates |

---

## Want to swap audio?

1. Drop your replacement file in `audio/` (match filename or update `add-sfx-v11.sh`).
2. Update the corresponding row above with source + license info.
3. Re-run `bash add-sfx-v11.sh`.

For 100% safe royalty-free sources:

- 🎵 **Music** — [Pixabay Music](https://pixabay.com/music/) · [Free Music Archive](https://freemusicarchive.org/) (filter CC0/CC-BY) · [Incompetech](https://incompetech.com/music/royalty-free/) (CC-BY, just credit Kevin MacLeod)
- 🔊 **SFX** — [Pixabay SFX](https://pixabay.com/sound-effects/) · [Freesound.org](https://freesound.org/) (filter CC0) · [Zapsplat](https://www.zapsplat.com/)

When in doubt about a track's license, don't ship it. Pixabay's blanket Content License is the simplest path.
