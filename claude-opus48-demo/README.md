<div align="center">

# Claude — Opus 4.8 · 1:1 reproduction

**A 25-second, frame-accurate reproduction of Claude's Opus 4.8 launch film — rebuilt entirely in code with the [Editframe](https://editframe.com) React SDK.**

Terminal intro → status line populates → a coral pixel creature + two kites → serif headlines → the version bump 4.7 → 4.8 → camera push-in → character-by-character command type-on → pull-out to a three-card notification stack.

[![License: MIT](https://img.shields.io/badge/license-MIT-FFD23F.svg?style=for-the-badge)](LICENSE)
[![Built with Editframe](https://img.shields.io/badge/built_with-Editframe-0066CC?style=for-the-badge)](https://editframe.com)
[![Brand: Claude](https://img.shields.io/badge/brand-Claude-D97757?style=for-the-badge)](brand-rules-anthropic.md)
[![Format](https://img.shields.io/badge/1920×1080-30fps-141413?style=for-the-badge)](#)
[![Silent](https://img.shields.io/badge/audio-silent_·_score_it_yourself-6B6358?style=for-the-badge)](#)
[![Fidelity](https://img.shields.io/badge/1:1-SSIM_0.85-22C55E?style=for-the-badge)](SUMMARY.md)

</div>

---

## Watch

<!-- REPLACE: drag-drop output/demo.mp4 into a GitHub issue/PR editor, copy the
     https://github.com/user-attachments/assets/<uuid> URL it mints, and paste it bare on the line below. -->
_(inline player pending — see [`output/demo.mp4`](output/demo.mp4) for the render)_

> The render also sits at [`output/demo.mp4`](output/demo.mp4) (silent) if you want to grab it directly.

---

## What this is

A **coded reproduction** — a faithfulness benchmark for the Editframe pipeline. Every pixel here is built from
scratch in React/Editframe (JSX + SVG + CSS animated frame-by-frame); **none of the source video's footage is
used or included.** It reproduces the **first 25.0s** of Claude's Opus 4.8 launch film.

- **Silent** by design — add your own score (this build was made to drop a Lyria track over).
- Not affiliated with or endorsed by Anthropic; this is an independent homage/benchmark.

---

## Quick start

```bash
npm install
NO_COLOR=1 FORCE_COLOR=0 npm run render    # → output/demo.mp4 (silent, by design)
```

> **Windows quirk:** the Editframe CLI's Vite spawn parses ANSI-colored stdout — the `NO_COLOR=1 FORCE_COLOR=0`
> prefix is required or render init times out.

---

## How it was built

The same tournament pipeline used for the Paper / Mastra reproductions:

1. Reference → 25s window → dense 12fps frames + 2fps keyframes (ground truth).
2. Gemini 2.5 Pro time-map, then **frame-reconciled** (frames overrule the model on camera push, type-on window, creature persistence).
3. Authoritative per-beat `BRIEF.md` (ms timings, verbatim text, camera track) + `PALETTE.md`.
4. Shared base ("tracing paper") → **10 Opus-4.8 builders** forked in parallel (tournament), each self-verifying.
5. SSIM + visual QA on all 10 → leaderboard → top-5 → closest.
6. 5-agent back-third converge on the 21–25s zoom-out + card stack.

**Winner: build `b02`** — mean **SSIM 0.8495** across 12 checkpoints vs the reference (front third 0.80–0.94).
Full write-up + scores in [`SUMMARY.md`](SUMMARY.md); observations in [`OBSERVATIONS.md`](OBSERVATIONS.md).

---

## Scene timeline

| Time | Beat | What happens |
|---|---|---|
| 0–6s | Terminal intro | Dark terminal window, status line populates line-by-line |
| 6–13s | Creature + kites | Coral pixel creature appears, two kites drift in |
| 13–17s | Headlines | Two serif headlines; the **4.7 → 4.8** version bump |
| 17–21s | Command | Camera push-in; the command types on character-by-character |
| 21–25s | Card stack | Pull-out to a three-card notification stack (Issue 781 · Afternoon at the park · Kite crew), code on the left |

---

## Brand

Canonical tokens live in `src/brand.ts` (see [`brand-rules-anthropic.md`](brand-rules-anthropic.md) + [`PALETTE.md`](PALETTE.md)).
Coral `#D97757` accent on warm off-white; text never pure `#000`.

---

## Repo layout

```
.
├── README.md            ← you are here
├── LICENSE              ← MIT
├── BRIEF.md             ← per-beat build brief (ms timings + verbatim text)
├── OBSERVATIONS.md      ← frame-by-frame reference observations
├── PALETTE.md           ← color tokens
├── SUMMARY.md           ← pipeline + tournament scores (winner b02)
├── brand-rules-anthropic.md
├── index.html · package.json · vite.config.ts · tsconfig.json
├── poster.jpg
├── public/              ← coded assets
├── output/
│   └── demo.mp4         ← the render (silent, 25.0s)
└── src/
    ├── Video.tsx        ← composition root (3 scenes sequenced + 2 cross-scene motifs)
    ├── brand.ts · constants.ts · styles.css · main.tsx
    ├── scenes/          ← Hero, Headlines, Command — one `Timegroup` per scene
    ├── components/      ← Reveal (fade/float), CreatureAndKites + NotificationStack
    │                       (cross-scene motifs), TerminalWindow, Kite, PixelCreature,
    │                       CodeBlock, NotifCard, Background, MenuBar, TraceOverlay
    └── assets/trace/    ← extracted reference alignment frames (TRACE_MODE only)
```

---

## License

MIT — free for commercial use, no attribution required (the **code**; the *reproduced design* is Anthropic's).

<div align="center"><sub>Built with Editframe · A 1:1 reproduction benchmark · Brand: Claude</sub></div>
