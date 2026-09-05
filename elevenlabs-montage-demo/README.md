# ElevenLabs — Agents Montage

A 22-second product demo of the ElevenLabs agents montage: opening titles, metrics, charts, a watercolor globe, and closing cards.

**Built with the [Editframe](https://editframe.com) React SDK** · 1920×1080 · 30fps

---

## Quick start

From the examples repo root:

```bash
npm install
npm start                               # workbench picker
npm run render:elevenlabs-montage-demo  # -> elevenlabs-montage-demo/output/demo.mp4
```

The music bed plays as a native `<Audio>` element on the composition timeline — no post-render mux step. Audio lives in `src/assets/` — see [CREDITS.md](CREDITS.md) for license details.

---

## Scene timeline

| Time | Scene | What happens |
|---|---|---|
| `0 – 7.15s` | **Opening** | II bars, wordmark, Spotlight, metrics table |
| `7.15 – 12.9s` | **Charts** | Usage chart, CSAT card, language grid |
| `12.9 – 22s` | **Finale** | Channel icons, watercolor globe, topic bubbles, pricing |

---

## License

[MIT](LICENSE) — free for commercial use, no attribution required. Bundled audio and brand imagery retain their own licenses (documented in [`CREDITS.md`](CREDITS.md)).
