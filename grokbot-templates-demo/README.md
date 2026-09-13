# Grok Bot — Templates

A 16.6-second product demo for Grok Bot shareable templates — app windows, camera pans, a card close-up, and the Grok Bot wordmark lockup.

**Built with the [Editframe](https://editframe.com) React SDK** · 1920×1080 · 30fps

---

## Quick start

From the examples repo root:

```bash
npm install
npm start
npm run render:grokbot-templates-demo  # -> grokbot-templates-demo/output/demo.mp4
```

This demo is silent by design — there is no `<Audio>` on the timeline. Bundled fonts are documented in [CREDITS.md](CREDITS.md).

---

## Scene timeline

| Time | Scene | What happens |
|---|---|---|
| `0 – 3.83s` | **Intro** | Chat pane slides left to reveal Settings; vertical pan; cursor hovers + presses "Share as template" |
| `3.83 – 6.13s` | **WordCard** | White typographic card: "Share your Bots as a template" |
| `6.13 – 10.07s` | **Publish** | Second window with draft card; Publish is clicked; card morphs alone on grey |
| `10.07 – 11.70s` | **CloseUp** | Card close-up: hover, press, whip out |
| `11.70 – 13.87s` | **ChatWindow** | macOS chat window slides in over blue wallpaper |
| `13.87 – 16.57s` | **Lockup** | Black mark pops → "Grok Bot" wordmark lockup |

---

## License

[MIT](LICENSE) — free for commercial use, no attribution required. Bundled fonts retain their own licenses (documented in [`CREDITS.md`](CREDITS.md)).
