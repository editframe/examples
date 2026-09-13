<div align="center">

# Audio Credits

**Bundled campaign audio is for demo reproduction only.** Licensing is retained
by the rights holder — swap with a cleared track before commercial redistribution.

</div>

---

## Music

### `src/assets/alchemy-demo-music-bed.wav`

| | |
|---|---|
| **Title / artist** | Alchemy campaign soundtrack |
| **Source** | Alchemy promo audio |
| **License** | Alchemy copyright — demo use only; not cleared for redistribution |
| **Treatment** | Plays across the full 20s — see `<Audio>` in `src/Video.tsx` |

## Imagery

No bitmaps are bundled — every element on screen is HTML / CSS / inline SVG drawn by the composition.

## Fonts

- [Nimbus Sans (URW Base 35)](https://github.com/ArtifexSoftware/urw-base35-fonts) — GNU AGPL v3 with font exception — see `src/assets/licenses/` (`src/assets/fonts/NimbusSans-Bold.otf`)
- `src/assets/licenses/Nimbus-COPYING, Nimbus-LICENSE` — License texts shipped with the Nimbus Sans font (URW Base 35 — bundled verbatim, see the Fonts table)

---

## Want to swap audio?

1. Drop your replacement file in `src/assets/` and update the `<Audio src="...">` reference in `src/Video.tsx`.
2. Update the corresponding row above with source + license info.
3. Re-render with `npm run render`.
