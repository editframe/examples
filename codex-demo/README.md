# Codex — Bug Fix Workflow

A product demo of the OpenAI Codex bug fix workflow.

**Built with the [Editframe](https://editframe.com) React SDK** · 1920×1080 · 30fps

---

## Quick start

```bash
npm install
npm start             # Editframe workbench on localhost
npm run render         # -> output/demo.mp4 (native, single pass)
```

The music bed plays as a single `<Audio>` element spanning the whole composition; SFX cues (typing, clicks) play as scene-local `<Audio>` elements via `src/components/Sfx.tsx`. Audio sits on the composition timeline alongside everything else — no post-render mux step.

Audio files live in `src/assets/` and are intended for commercial use — see [CREDITS.md](CREDITS.md) for source/license details.
