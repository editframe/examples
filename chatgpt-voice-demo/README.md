# ChatGPT Voice

A 26-second product demo of the ChatGPT voice experience: the OpenAI mark, title cards, the composer UI, voice-mode waveform, and a closing line.

**Built with the [Editframe](https://editframe.com) React SDK** · 1920×1080 · 30fps

---

## Quick start

From the examples repo root:

```bash
npm install
npm start                           # workbench picker
npm run render:chatgpt-voice-demo   # -> chatgpt-voice-demo/output/demo.mp4
```

The music bed plays as a native `<Audio>` element on the composition timeline — no post-render mux step. Audio lives in `src/assets/` — see [CREDITS.md](CREDITS.md) for license details.

---

## Scene timeline

| Time | Scene | What happens |
|---|---|---|
| `0 – 6.43s` | **Intro** | Logo bloom + “Introducing ChatGPT Work” |
| `6.43 – 8.85s` | **Headline2** | “Built to take on your most ambitious ideas” |
| `8.85 – 22.75s` | **AppUI** | Composer, model selector, mic, waveform |
| `22.75 – 26s` | **Close** | “Connect to the apps you already use” |

---

## License

[MIT](LICENSE) — free for commercial use, no attribution required. Bundled audio and brand imagery retain their own licenses (documented in [`CREDITS.md`](CREDITS.md)).
