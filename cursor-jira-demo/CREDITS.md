<div align="center">

# Audio Credits

**Every audio file bundled in this template is cleared for commercial use.**
Sources and licenses documented below. If you replace any file, update this
document so downstream forkers can verify provenance.

</div>

---

## Music

### `src/assets/audio-bed.mp3`

| | |
|---|---|
| **Title** | Tech Solution |
| **Artist** | joyinsound |
| **Source** | [Pixabay — track 403394](https://pixabay.com/music/beats-tech-solution-403394/) |
| **License** | [Pixabay Content License](https://pixabay.com/service/license-summary/) |
| **Commercial use** | ✅ Allowed |
| **Attribution required** | ❌ No (credit appreciated) |
| **Redistribution** | ✅ Permitted as part of derivative work |

A driving, modern tech-bed that mirrors the Cursor product feel — clean rhythm, no vocal interference. Replace freely with anything from Pixabay, [Free Music Archive](https://freemusicarchive.org/), or [Incompetech](https://incompetech.com/music/royalty-free/) — keep the filename `audio-bed.mp3`, or update the `<Audio src="...">` path in `src/Video.tsx` accordingly.

---

## SFX

### `src/assets/sfx/cursor-jira-demo-click-hd-loud.mp3`

| | |
|---|---|
| **Type** | UI click (HD, high-headroom) |
| **Source** | "Click Sound Effect (HD)" — separately sourced free SFX |
| **License** | Royalty-free, commercial use cleared |
| **Used for** | "Suggest a reply…" chip cursor-click at master 21.5s |

---

## Want to swap audio?

1. Drop your replacement file in `src/assets/` (or `src/assets/sfx/` for SFX), matching the existing filename, or update the corresponding `src="..."` path in `src/Video.tsx` / `src/components/Sfx.tsx`.
2. Update the corresponding row above with source + license info.
3. Re-render (`npm run render`).

For 100% safe royalty-free sources:

- 🎵 **Music** — [Pixabay Music](https://pixabay.com/music/) · [Free Music Archive](https://freemusicarchive.org/) (filter CC0/CC-BY) · [Incompetech](https://incompetech.com/music/royalty-free/) (CC-BY, just credit Kevin MacLeod)
- 🔊 **SFX** — [Pixabay SFX](https://pixabay.com/sound-effects/) · [Freesound.org](https://freesound.org/) (filter CC0) · [Zapsplat](https://www.zapsplat.com/)

When in doubt about a track's license, don't ship it. Pixabay's blanket Content License is the simplest path.
