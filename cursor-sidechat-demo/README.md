# Cursor — Side Chats

A 17.2-second product demo of Cursor Side Chats: an agent transcript, a selection sweep into a side chat, typed follow-up, and an end card.

**Built with the [Editframe](https://editframe.com) React SDK** · 1920×1080 · 30fps

---

## Quick start

From the examples repo root:

```bash
npm install
npm start                            # workbench picker
npm run render:cursor-sidechat-demo  # -> cursor-sidechat-demo/output/demo.mp4
```

The music bed plays as a native `<Audio>` element on the composition timeline — no post-render mux step. Audio lives in `src/assets/` — see [CREDITS.md](CREDITS.md) for license details.

---

## Scene timeline

| Time | Scene | What happens |
|---|---|---|
| `0 – 10.55s` | **Windows** | Wallpaper, Window A → B, selection sweep, typed follow-up |
| `10.55 – 17.2s` | **Endcard** | “Side Chats” wordmark + cube (fades over Window B) |

---

## License

[MIT](LICENSE) — free for commercial use, no attribution required. Bundled audio and brand imagery retain their own licenses (documented in [`CREDITS.md`](CREDITS.md)).
