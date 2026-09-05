# Claude Cowork

A 20-second product demo of Claude Cowork's agent view: a headline card, a typed prep prompt, the response feed, and a scheduled Progress plan.

**Built with the [Editframe](https://editframe.com) React SDK** · 1920×1080 · 30fps

---

## Quick start

From the examples repo root:

```bash
npm install
npm start                          # workbench picker
npm run render:claude-cowork-demo  # -> claude-cowork-demo/output/demo.mp4
```

The music bed plays as a native `<Audio>` element on the composition timeline — no post-render mux step. Audio lives in `src/assets/` — see [CREDITS.md](CREDITS.md) for license details.

---

## Scene timeline

| Time | Scene | What happens |
|---|---|---|
| `0 – 12.67s` | **Composer** | Headline, typed QBR prompt, cursor |
| `12.67 – 20s` | **Response** | Reply feed, integrations, Progress card |

---

## License

[MIT](LICENSE) — free for commercial use, no attribution required. Bundled audio and brand imagery retain their own licenses (documented in [`CREDITS.md`](CREDITS.md)).
