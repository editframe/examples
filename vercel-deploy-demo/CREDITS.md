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
| **Title** | Big Beginning |
| **Artist** | Jonas Blakewood |
| **Source** | [Pixabay — track 310824](https://pixabay.com/music/electronic-big-beginning-310824/) |
| **License** | [Pixabay Content License](https://pixabay.com/service/license-summary/) |
| **Commercial use** | ✅ Allowed |
| **Attribution required** | ❌ No (credit appreciated) |
| **Redistribution** | ✅ Permitted as part of derivative work |

Driving electronic bed that fits the Vercel deploy-payoff curve. Replace freely with anything from Pixabay, [Free Music Archive](https://freemusicarchive.org/), or [Incompetech](https://incompetech.com/music/royalty-free/) — keep the filename `music-bed.mp3` or update `add-sfx-v13.sh` accordingly.

The mux applies a 1.5s fade-in, a 2.0s fade-out starting at 20.5s, and master volume 0.16.

---

## SFX

### `audio/click-hd-loud.mp3`

| | |
|---|---|
| **Type** | UI click (HD, high-headroom) |
| **Source** | "Click Sound Effect (HD)" — separately sourced free SFX |
| **License** | Royalty-free, commercial use cleared |
| **Used for** | Not used in this video's mux; included for fork consistency with sibling templates |

---

## Want to swap audio?

1. Drop your replacement file in `audio/` (match filename or update `add-sfx-v13.sh`).
2. Update the corresponding row above with source + license info.
3. Re-run `bash add-sfx-v13.sh`.

For 100% safe royalty-free sources:

- 🎵 **Music** — [Pixabay Music](https://pixabay.com/music/) · [Free Music Archive](https://freemusicarchive.org/) (filter CC0/CC-BY) · [Incompetech](https://incompetech.com/music/royalty-free/) (CC-BY, just credit Kevin MacLeod)
- 🔊 **SFX** — [Pixabay SFX](https://pixabay.com/sound-effects/) · [Freesound.org](https://freesound.org/) (filter CC0) · [Zapsplat](https://www.zapsplat.com/)

When in doubt about a track's license, don't ship it. Pixabay's blanket Content License is the simplest path.
