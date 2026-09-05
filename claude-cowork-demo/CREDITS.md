<div align="center">

# Audio Credits

**Bundled campaign audio is for demo reproduction only.** Licensing is retained
by the rights holder — swap with a cleared track before commercial redistribution.

</div>

---

## Music

### `src/assets/claude-cowork-demo-music-bed.mp3`

| | |
|---|---|
| **Title / artist** | Claude Cowork campaign music bed |
| **Source** | Anthropic promo audio |
| **License** | Anthropic copyright — demo use only; not cleared for redistribution |
| **Treatment** | Plays across the full 20s (1s fade-in, 1.5s fade-out baked into the committed file) — see `<Audio>` in `src/Video.tsx` |

## Fonts

- [Hanken Grotesk](https://fonts.google.com/specimen/Hanken+Grotesk) — Google Fonts, OFL license (`src/assets/fonts/HankenGrotesk-Variable.woff2`)

All other visuals are drawn natively in the composition (inline SVG / CSS).

---

## Want to swap audio?

1. Drop your replacement file in `src/assets/` and update the `<Audio src="...">` reference in `src/Video.tsx`.
2. Update the corresponding row above with source + license info.
3. Re-render with `npm run render`.
