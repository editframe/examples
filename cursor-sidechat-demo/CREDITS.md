<div align="center">

# Audio Credits

**Bundled campaign audio is for demo reproduction only.** Licensing is retained
by the rights holder — swap with a cleared track before commercial redistribution.

</div>

---

## Music

### `src/assets/cursor-sidechat-demo-music-bed.mp3`

| | |
|---|---|
| **Title / artist** | Cursor campaign soundtrack bed |
| **Source** | Cursor / Anysphere promo audio (the original soundtrack is intentionally quiet) |
| **License** | Cursor (Anysphere) copyright — demo use only; not cleared for redistribution |
| **Treatment** | Spans the full 17.2s — see `<Audio>` in `src/Video.tsx` |

## Imagery

### `src/assets/cursor-sidechat-demo-wallpaper.jpg`

Cursor brand imagery, used here only to demonstrate the Editframe React SDK. Not cleared for redistribution — replace before publishing a fork.

## Fonts

- [Inter](https://fonts.google.com/specimen/Inter) — Google Fonts, OFL license (`src/assets/fonts/Inter-*.woff2`)

The editor UI, cursors, and Cursor logo are inline SVG / CSS.

---

## Want to swap audio?

1. Drop your replacement file in `src/assets/` and update the `<Audio src="...">` reference in `src/Video.tsx`.
2. Update the corresponding row above with source + license info.
3. Re-render with `npm run render`.
