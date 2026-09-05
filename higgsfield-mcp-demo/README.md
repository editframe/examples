# Higgsfield MCP

A 38-second product demo of Higgsfield MCP: a prompt card, generated video tiles, a snack-bag attachment, and a closing line.

**Built with the [Editframe](https://editframe.com) React SDK** · 1280×720 · 30fps

---

## Quick start

From the examples repo root:

```bash
npm install
npm start                            # workbench picker
npm run render:higgsfield-mcp-demo   # -> higgsfield-mcp-demo/output/demo.mp4
```

The music bed plays as a native `<Audio>` element on the composition timeline — no post-render mux step. Audio lives in `src/assets/` — see [CREDITS.md](CREDITS.md) for license details.

---

## Scene timeline

| Time | Scene | What happens |
|---|---|---|
| `0 – 3.45s` | **Opening** | Headline type + MCP toggle |
| `3.45 – 8.93s` | **Prompt** | Chat upload, send, analyzing |
| `8.93 – 38.06s` | **Flow** | Generated cards, reply stream, snack-bag attach, player, end line |

---

## License

[MIT](LICENSE) — free for commercial use, no attribution required. Bundled audio and brand imagery retain their own licenses (documented in [`CREDITS.md`](CREDITS.md)).
