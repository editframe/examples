# Vercel — Deploy Flow

A 22.5-second product demo capturing the full Vercel deploy flow, from code push to live preview, set against a driving electronic music bed.

**Built with the [Editframe](https://editframe.com) React SDK** · 1920×1080 · 30fps

---

## Quick start

```bash
npm install
npm run render        # -> output/demo.mp4 (native, single pass)
```

The music bed plays as a single `<Audio>` element spanning the whole composition
(`src/Video.tsx`) — no post-render mux step. The audio file lives in `src/assets/` and is
fully cleared for commercial use — see [CREDITS.md](CREDITS.md) for license details.
