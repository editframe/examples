<div align="center">

# Credits

**Bundled brand media is for demo reproduction only.** Licensing is retained
by the rights holder — swap in cleared media before commercial redistribution.

</div>

---

## Music

### `src/assets/grokbot-more-plans-demo-music-bed.wav`

| | |
|---|---|
| **Title / artist** | Grok Bot campaign soundtrack |
| **Source** | Grok Bot promo audio |
| **License** | xAI copyright — demo use only; not cleared for redistribution |
| **Treatment** | Spans the full 12.48s — see `<Audio>` in `src/Video.tsx` |

## Imagery

No bitmaps are bundled — every element on screen is HTML / CSS / inline SVG drawn by the composition.

## Fonts

- [Inter](https://rsms.me/inter/) — [SIL Open Font License 1.1](https://openfontlicense.org/) (`src/assets/fonts/Inter-Variable.ttf` + Regular, Medium, SemiBold, Bold)

---

## Want to swap audio?

1. Drop your replacement file in `src/assets/` and update the `MUSIC` constant in `src/Video.tsx`.
2. Update the corresponding row above with source + license info.
3. Re-render with `npm run render:grokbot-more-plans-demo`.
