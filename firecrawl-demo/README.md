# Firecrawl

A 20-second product demo of Firecrawl: vector/type animation, chat card, deck carousel, burst/chips grid trace, and fold/walls cube.

**Built with the [Editframe](https://editframe.com) React SDK** · 1920×1080 · 24fps

---

## Quick start

From the examples repo root:

```bash
npm install
npm start                           # workbench picker
npm run render:firecrawl-demo       # -> firecrawl-demo/output/demo.mp4
```

The music bed plays as a native `<Audio>` element on the composition timeline — no post-render mux step. Audio lives in `src/assets/` — see [CREDITS.md](CREDITS.md) for license details.

---

## Scene timeline

| Time | Scene | What happens |
|---|---|---|
| `0 – 2.875s` | **VectorType** | Vector/type animation, orange square, cascading squares |
| `2.875 – 6.625s` | **ChatCard** | Chat card, blurred panels, response streaming |
| `6.625 – 10.833s` | **Deck** | Deck carousel, glyph textures, card cycling model |
| `10.833 – 16.083s` | **BurstChips** | Burst, chips, grid/trace path, product card, annotations |
| `16.083 – 20s` | **FoldWalls** | Spark, halftone, fold, cube, walls |

---

## License

[MIT](LICENSE) — free for commercial use, no attribution required. Bundled audio and brand imagery retain their own licenses (documented in [`CREDITS.md`](CREDITS.md)).
