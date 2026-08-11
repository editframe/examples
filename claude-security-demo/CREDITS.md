<div align="center">

# Audio Credits

**Every audio file bundled in this template is cleared for commercial use.**
Sources and licenses documented below. If you replace any file, update this
document so downstream forkers can verify provenance.

</div>

---

## Music

### `src/assets/claude-security-demo-music-bed.mp3`

| | |
|---|---|
| **Title** | Suspense |
| **Artist** | leberch |
| **Source** | [Pixabay — track 516354](https://pixabay.com/music/build-up-scenes-suspense-516354/) |
| **License** | [Pixabay Content License](https://pixabay.com/service/license-summary/) |
| **Commercial use** | ✅ Allowed |
| **Attribution required** | ❌ No (credit appreciated) |
| **Redistribution** | ✅ Permitted as part of derivative work |

A slow-burn cinematic bed that underscores the editorial security-finding narrative without competing with the headline. Replace freely with anything from Pixabay, [Free Music Archive](https://freemusicarchive.org/), or [Incompetech](https://incompetech.com/music/royalty-free/) — keep the filename `claude-security-demo-music-bed.mp3` or update the `MUSIC` constant in `src/Video.tsx` accordingly.

---

## SFX

### `src/assets/claude-security-demo-click-hd-loud.mp3`

| | |
|---|---|
| **Type** | UI click (HD, high-headroom) |
| **Source** | "Click Sound Effect (HD)" — separately sourced free SFX |
| **License** | Royalty-free, commercial use cleared |
| **Used for** | Cursor click on the Security row in Scene 2 (master 5.0s) |

> If you plan to redistribute heavily, swap this for a Pixabay/Freesound CC0 click and update this row. Most "free SFX" packs are fine for embedded use but some restrict standalone redistribution.

---

## Want to swap audio?

1. Drop your replacement file in `src/assets/` (match filename or update the `MUSIC` constant in `src/Video.tsx` / the `src` on the relevant `<Audio>` element).
2. Update the corresponding row above with source + license info.

For 100% safe royalty-free sources:

- 🎵 **Music** — [Pixabay Music](https://pixabay.com/music/) · [Free Music Archive](https://freemusicarchive.org/) (filter CC0/CC-BY) · [Incompetech](https://incompetech.com/music/royalty-free/) (CC-BY, just credit Kevin MacLeod)
- 🔊 **SFX** — [Pixabay SFX](https://pixabay.com/sound-effects/) · [Freesound.org](https://freesound.org/) (filter CC0) · [Zapsplat](https://www.zapsplat.com/)

When in doubt about a track's license, don't ship it. Pixabay's blanket Content License is the simplest path.
