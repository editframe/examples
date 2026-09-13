<div align="center">

# Audio Credits

**Bundled campaign audio is for demo reproduction only.** Licensing is retained
by the rights holder — swap with a cleared track before commercial redistribution.

</div>

---

## Music

### `src/assets/grokbot-android-demo-music-bed.wav`

| | |
|---|---|
| **Title / artist** | Grok Bot campaign soundtrack |
| **Source** | Grok Bot promo audio |
| **License** | xAI copyright — demo use only; not cleared for redistribution |
| **Treatment** | Plays across the full 10s — see `<Audio>` in `src/Video.tsx` |

## Imagery

| File | Used as | Source / license |
|---|---|---|
| `src/assets/grok-icon.png` | Grok notification icon | Grok Bot brand imagery — xAI copyright, demo use only; not cleared for redistribution |
| `src/assets/benji-avatar.png` | Notification avatar with Slack badge | Grok Bot brand imagery — xAI copyright, demo use only; not cleared for redistribution |

## Fonts

- [Inter](https://rsms.me/inter/) — [SIL Open Font License 1.1](https://openfontlicense.org/) (`src/assets/fonts/Inter-SemiBold.ttf`)

Everything else on screen is inline SVG / CSS.

---

## Want to swap audio?

1. Drop your replacement file in `src/assets/` and update the `<Audio src="...">` reference in `src/Video.tsx`.
2. Update the corresponding row above with source + license info.
3. Re-render with `npm run render`.
