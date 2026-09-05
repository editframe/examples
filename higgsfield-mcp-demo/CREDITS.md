<div align="center">

# Audio Credits

**Bundled campaign audio is for demo reproduction only.** Licensing is retained
by the rights holder — swap with a cleared track before commercial redistribution.

</div>

---

## Music

### `src/assets/higgsfield-mcp-demo-music-bed.mp3`

| | |
|---|---|
| **Title / artist** | Higgsfield MCP campaign music bed |
| **Source** | Higgsfield promo audio |
| **License** | Higgsfield copyright — demo use only; not cleared for redistribution |
| **Treatment** | Plays across the full 38.06s (1s fade-in, 1.5s fade-out baked into the committed file) — see `<Audio>` in `src/Video.tsx` |

## Imagery

| File | Used as | Source / license |
|---|---|---|
| `src/assets/thumb_seq.mp4`, `card_seq.mp4`, `vert_seq.mp4` | Timeline video clips | Original sequences generated for this demo |
| `src/assets/portrait.jpg` | Portrait still | Original image generated for this demo |
| `src/assets/product.jpg` | Product still | Original image generated for this demo |
| `src/assets/chipsfield-bag.png` | Dragged attachment tile | Brand imagery — demo use only; not cleared for redistribution |

## Fonts

- [Inter](https://fonts.google.com/specimen/Inter) — Google Fonts, OFL license

---

## Want to swap audio?

1. Drop your replacement file in `src/assets/` and update the `<Audio src="...">` reference in `src/Video.tsx`.
2. Update the corresponding row above with source + license info.
3. Re-render with `npm run render`.
