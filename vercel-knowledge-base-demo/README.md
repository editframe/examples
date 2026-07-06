# Vercel — Knowledge Base

A 28.1-second product demo of the Vercel Knowledge Base.

**Built with the [Editframe](https://editframe.com) React SDK** · 1920×1080 · 30fps

---

## Quick start

```bash
npm install
npm run render
```

The rendered video is saved to `output/demo.mp4`.

Audio (keyboard SFX on the typed Ask-AI prompt + click SFX on the 3 real clicks — no music, per spec) is baked directly into the composition via native `<Audio>` elements in `src/scenes/`, no post-render mux step. Every audio file bundled in this template is cleared for commercial use — see [CREDITS.md](CREDITS.md) for license details.
