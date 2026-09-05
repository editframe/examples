# Higgsfield for Figma

A 27-second concept demo of a multiplayer Figma canvas: a team briefs a watch campaign, generates product shots, removes a background, drops a logo, and sends a final 4-up grid.

**Built with the [Editframe](https://editframe.com) React SDK** · 1920×1080 · 30fps

---

## Quick start

From the examples repo root:

```bash
npm install
npm start                             # workbench picker
npm run render:higgsfield-figma-demo  # -> higgsfield-figma-demo/output/demo.mp4
```

The music/SFX bed plays as a native `<Audio>` element on the composition timeline — no post-render mux step. Audio lives in `src/assets/` — see [CREDITS.md](CREDITS.md) for license details.

---

## Scene timeline

Eight opacity-gated worlds share one 27s clock. The title→brief zoom-blast overlaps; later beats hard-cut.

| Time | World | What happens |
|---|---|---|
| `0 – 2.8s` | **Title** | Lockup assembles; zoom-blast |
| `2.5 – 7.4s` | **Brief** | Wrist card drag-in; brief typing |
| `7.4 – 11.8s` | **Generate** | Prompt panel; LED wipe; watch render |
| `11.8 – 15.1s` | **Layout** | Context menu; background removal |
| `15.1 – 17.5s` | **Hero** | Stretched title; ticker |
| `17.5 – 22.1s` | **Logo** | Vector logo drag onto the nav |
| `22.1 – 25.1s` | **Face** | Brand-face card; marquee select |
| `25.1 – 27.0s` | **Send** | Full-bleed input; whip to 4-up grid |

---

## License

[MIT](LICENSE) — free for commercial use, no attribution required. Bundled audio and brand imagery retain their own licenses (documented in [`CREDITS.md`](CREDITS.md)).
