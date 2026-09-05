# Figma Motion

A 20-second product-launch intro for Figma Motion: an organic bloom morphs into garden cards, the Figma editor, a title collage, then a purple dial, easing panel, and Goal Reached card. Rendered at a stepped 12fps on purpose.

**Built with the [Editframe](https://editframe.com) React SDK** · 1920×1080 · 12fps

---

## Quick start

From the examples repo root:

```bash
npm install
npm start                          # workbench picker
npm run render:figma-motion-demo   # -> figma-motion-demo/output/demo.mp4
```

The music bed plays as a native `<Audio>` element on the composition timeline — no post-render mux step. Audio lives in `src/assets/` — see [CREDITS.md](CREDITS.md) for license details.

---

## Scene timeline

| Time | Scene | What happens |
|---|---|---|
| `0 – 1.50s` | **Intro** | Defocused sage bloom |
| `1.50 – 3.42s` | **Morph** | Flower zoom-out |
| `3.42 – 4.00s` | **Cards** | Garden cards form |
| `4.00 – 6.83s` | **Editor** | Figma editor chrome |
| `6.83 – 9.83s` | **Title** | “Figma Motion” collage |
| `9.83 – 13.92s` | **Purple** | Dial drag + gizmo |
| `13.92 – 19.00s` | **Connector** | Easing panel + bezier |
| `19.00 – 19.50s` | **Unlocked** | Unlocked pill |
| `19.50 – 20.00s` | **Goal** | Goal Reached card |

---

## License

[MIT](LICENSE) — free for commercial use, no attribution required. Bundled audio and brand imagery retain their own licenses (documented in [`CREDITS.md`](CREDITS.md)).
