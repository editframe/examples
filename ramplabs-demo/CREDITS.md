<div align="center">

# Credits

**Bundled brand media is for demo reproduction only.** Licensing is retained
by the rights holder — swap in cleared media before commercial redistribution.

</div>

---

## Music

### `src/assets/ramplabs-demo-music-bed.wav`

| | |
|---|---|
| **Title / artist** | Ramp campaign soundtrack |
| **Source** | Ramp promo audio |
| **License** | Ramp copyright — demo use only; not cleared for redistribution |
| **Treatment** | Spans the full 25s — see `<Audio>` in `src/Video.tsx` |

## Imagery

No bitmaps are bundled — every element on screen is HTML / CSS / inline SVG drawn by the composition.

## Fonts

- [DejaVu Sans Mono](https://dejavu-fonts.github.io/) — [DejaVu Fonts License](https://dejavu-fonts.github.io/License.html) (Bitstream Vera derived) (`src/assets/fonts/DejaVuSansMono.ttf, DejaVuSansMono-Bold.ttf`)

---

## Want to swap audio?

1. Drop your replacement file in `src/assets/` and update the `<Audio src="...">` reference in `src/Video.tsx`.
2. Update the corresponding row above with source + license info.
3. Re-render with `npm run render`.
