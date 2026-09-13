<div align="center">

# Credits

**Bundled brand media is for demo reproduction only.** Licensing is retained
by the rights holder — swap in cleared media before commercial redistribution.

</div>

---

## Music

### `src/assets/firecrawl-demo-music-bed.wav`

| | |
|---|---|
| **Title / artist** | Firecrawl campaign soundtrack |
| **Source** | Firecrawl promo audio |
| **License** | Firecrawl copyright — demo use only; not cleared for redistribution |
| **Treatment** | Spans the full 20s — see `<Audio>` in `src/Video.tsx` |

## Imagery

### `src/assets/firecrawl-demo-logo.png`

Firecrawl logo. Firecrawl brand imagery — Firecrawl copyright, demo use only. Used here only to demonstrate the Editframe React SDK — not cleared for redistribution; replace before publishing a fork.

### `src/assets/jacket.png`

Product photo on the product card. Firecrawl brand imagery — Firecrawl copyright, demo use only. Used here only to demonstrate the Editframe React SDK — not cleared for redistribution; replace before publishing a fork.

## Fonts

- [Inter](https://rsms.me/inter/) — [SIL Open Font License 1.1](https://openfontlicense.org/) (`src/assets/fonts/Inter-Regular.ttf, Inter-Medium.ttf, Inter-SemiBold.ttf, Inter-Bold.ttf`)

Everything else on screen is inline SVG / CSS.

---

## Want to swap audio?

1. Drop your replacement file in `src/assets/` and update the soundtrack import / `<Audio src>` in `src/Video.tsx`.
2. Update the corresponding row above with source + license info.
3. Re-render with `npm run render`.
