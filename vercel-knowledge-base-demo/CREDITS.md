<div align="center">

# Audio Credits

**Every audio file bundled in this template is cleared for commercial use.**
Sources and licenses documented below. If you replace any file, update this
document so downstream forkers can verify provenance.

</div>

---

## Music

There is no music in this video — SFX only, per spec.

## SFX

### `src/assets/sfx/click.mp3`

| | |
|---|---|
| **Type** | UI click |
| **Source** | Free UI SFX collection |
| **License** | Royalty-free, commercial use cleared |
| **Used for** | Filter-button click (offset 9200ms) and Sandbox-row click (offset 9900ms) in `Scene1_HeroToOverview`; thumbs-up click (offset 13060ms) in `Scene5_AIChatPanel` |

### `src/assets/sfx/keyboard.wav`

| | |
|---|---|
| **Type** | Mechanical keyboard typing |
| **Source** | Free UI SFX collection |
| **License** | Royalty-free, commercial use cleared |
| **Used for** | Ask-AI prompt typewriter keystrokes (offset 1500ms) in `Scene5_AIChatPanel` |

---

## Want to swap audio?

Keep the replacement in `src/assets/sfx/`, update the corresponding `<Audio src="...">` reference in `src/scenes/Scene1_HeroToOverview.tsx` / `src/scenes/Scene5_AIChatPanel.tsx`, and update the table above with the real source + license.

For 100% safe royalty-free sources:

- 🔊 **SFX** — [Pixabay SFX](https://pixabay.com/sound-effects/) · [Freesound.org](https://freesound.org/) (filter CC0) · [Zapsplat](https://www.zapsplat.com/)

When in doubt about a track's license, don't ship it. Pixabay's blanket Content License is the simplest path.
