# Grok Bot — Android

A 10-second announcement spot for Grok Bot on Android — phone lock screen, a word-by-word line, the lockup.

**Built with the [Editframe](https://editframe.com) React SDK** · 1920×1080 · 30fps

---

## Quick start

From the examples repo root:

```bash
npm install
npm start
npm run render:grokbot-android-demo  # -> grokbot-android-demo/output/demo.mp4
```

The music bed plays as a native `<Audio>` element on the composition timeline — no post-render mux step. Audio lives in `src/assets/` — see [CREDITS.md](CREDITS.md) for license details.

---

## Scene timeline

| Time | Scene | What happens |
|---|---|---|
| `0 – 5.3s` | **Phone** | Lock screen with two notifications; the Benji card zooms up, the Grok card slides out from behind it, then the camera pulls back to the full phone |
| `5.3 – 7.733s` | **Announcement** | "Grok Bot is now available on Android" reveals word by word; the Android head pops in |
| `7.733 – 10s` | **Outro** | Black Grok face expands, contracts and slides left into the "Grok Bot" lockup |

---

## License

[MIT](LICENSE) — free for commercial use, no attribution required. Bundled audio and brand imagery retain their own licenses (documented in [`CREDITS.md`](CREDITS.md)).
