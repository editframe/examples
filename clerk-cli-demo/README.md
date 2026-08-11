# Clerk — CLI Setup

A 17.1-second product demo of Clerk CLI setup.

**Built with the [Editframe](https://editframe.com) React SDK** · 1920×1080 · 30fps

---

## Quick start

```bash
npm install
npm run render        # -> output/demo.mp4 (native, single pass)
```

The rendered video is saved to `output/`.

Music and SFX play as native `<Audio>` elements on the composition timeline (`src/Video.tsx`, `src/scenes/Terminal.tsx`) — no post-render mux step. Audio files live in `src/assets/` and are fully cleared for commercial use — see [CREDITS.md](CREDITS.md) for license details.
