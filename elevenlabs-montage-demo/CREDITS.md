<div align="center">

# Audio Credits

**Bundled campaign audio is for demo reproduction only.** Licensing is retained
by the rights holder — swap with a cleared track before commercial redistribution.

</div>

---

## Music

### `src/assets/elevenlabs-montage-demo-music-bed.mp3`

| | |
|---|---|
| **Title / artist** | ElevenLabs agents campaign music bed |
| **Source** | ElevenLabs promo audio |
| **License** | ElevenLabs copyright — demo use only; not cleared for redistribution |
| **Treatment** | Plays across the full 22s (1s fade-in, 1.5s fade-out baked into the committed file) — see `<Audio>` in `src/Video.tsx` |

## Imagery

| File | Used as | Source / license |
|---|---|---|
| `src/assets/crops/*.png` | Platform icons (Slack, WhatsApp, phone, chat, mail, line-globe) | Brand imagery — demo use only; not cleared for redistribution |
| `src/assets/earth-texture.png` | Globe texture | Generated for this demo (watercolor world map) |
| `src/assets/chartE.json`, `chartF.json`, `chartsG.json` | Chart data | Authored for this demo |

## Fonts

- [Inter](https://fonts.google.com/specimen/Inter) — Google Fonts, OFL license

---

## Want to swap audio?

1. Drop your replacement file in `src/assets/` and update the `<Audio src="...">` reference in `src/Video.tsx`.
2. Update the corresponding row above with source + license info.
3. Re-render with `npm run render`.
