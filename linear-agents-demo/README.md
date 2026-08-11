<div align="center">

# Linear — Linear for Agents

**A 32-second product demo, built with the [Editframe](https://editframe.com) React SDK.**

A near-pixel reproduction of Linear's "Linear for Agents" launch film — backlog triage and an Assign-to-Codegen flow, a Codegen issue thread shipping a PR, an Integrations page enabling Devin, a Devin @-mention writing a fix, and the slot-machine outro resolving to the Linear logo. Pure coded motion, no screen recording.

[![License: MIT](https://img.shields.io/badge/license-MIT-5E6AD2.svg?style=for-the-badge)](LICENSE)
[![Built with Editframe](https://img.shields.io/badge/built_with-Editframe-0066CC?style=for-the-badge)](https://editframe.com)
[![Brand: Linear](https://img.shields.io/badge/brand-Linear-111115?style=for-the-badge)](#brand)
[![Format](https://img.shields.io/badge/1920×1080-30fps-111115?style=for-the-badge)](#)
[![Audio: royalty-free](https://img.shields.io/badge/audio-royalty--free-8A8F98?style=for-the-badge)](CREDITS.md)

</div>

---

## Watch

> Drag-drop [`output/demo.mp4`](output/demo.mp4) into a GitHub issue/PR comment box to mint a `https://github.com/user-attachments/assets/<uuid>` URL, then paste that URL on its own line here to embed the native inline player.

The final shipped render (with audio) lives at [`output/demo.mp4`](output/demo.mp4) — grab it directly.

---

## Quick start

```bash
npm install
NO_COLOR=1 FORCE_COLOR=0 npm run render    # → output/demo.mp4 (native, single pass)
```

> **Windows quirk:** the Editframe CLI's Vite spawn parses ANSI-colored stdout. The `NO_COLOR=1 FORCE_COLOR=0` prefix is required or render init times out. The committed `output/demo.mp4` already has audio baked in — the render above just reproduces it.

The music bed plays as a single `<Audio>` element spanning the whole composition (`src/Video.tsx`). Audio sits on the composition timeline alongside everything else — no post-render mux step.

---

## Scene timeline

| # | Time | Scene | What happens |
|---|---|---|---|
| 0 | `0.0 – 1.8s` | **Title intro** | "Linear for Agents" fades in and out, white on near-black |
| 1 | `1.8 – 7.4s` | **Engineering backlog** | Fast motion-blur scroll settles into six issue rows; checkboxes select, an "Assign to…" modal lists seven agents, the cursor clicks **Codegen**, and Codegen icons settle on every row |
| 2 | `7.4 – 8.0s` | **Transition** | Zoom + motion-blur push into the issue detail |
| 3 | `8.0 – 15.0s` | **ENG-1293 · Codegen** | Activity feed staggers in, Codegen comments "Hey! I'm on it." + posts a fix with inline code, a PR card appears and the issue moves to **In Review** |
| 4 | `15.2 – 17.4s` | **Integrations** | Settings page auto-scrolls through agent cards; cursor clicks **Enable** on Devin |
| 5 | `17.4 – 23.5s` | **ENG-237 · Devin** | Andreas types an `@devin` mention via the dropdown; Devin's response reveals top-to-bottom with a proposed solution and a syntax-highlighted code block |
| 6 | `24.0 – 27.2s` | **Outro ticker** | Slot-machine swap: "Agents for **Coding → Triage → Planning**", then "Linear for Agents" |
| 7 | `27.2 – 32.0s` | **Linear logo** | The Linear mark + wordmark fade in, hold, and fade to black |

---

## Audio

A single **music bed** runs under the full 32s as a native `<Audio>` element on the
composition timeline (`src/Video.tsx`) — loudnorm-normalized (−16 LUFS) with a 0.6s
fade-in and a 1.5s fade-out under the logo hold, pre-baked directly into the committed
asset. This cut is **music only**; there are no sound effects. See
[`CREDITS.md`](CREDITS.md) for provenance.

| Cue | Time (ms) | File | Volume |
|---|---|---|---|
| Music bed | 0 – 32000 | `src/assets/linear-agents-demo-music-bed.mp3` (loudnorm −16, fade-in 0.6s, fade-out 30.5–32.0s) | 1.0 |

---

## Brand

Linear runs a dark, flat UI — a warm near-black ground, two greys of type, and functional accent colors for brand and status. `src/constants.ts` (the palette block) is the source of truth; text never uses pure `#000` and carries no drop shadows.

| Token | Hex | Use |
|---|---|---|
| `BG` | `#111115` | App canvas (near-black ground) |
| `CODE_BG` | `#1A1A1E` | Code blocks, modals, inline-code surfaces |
| `TEXT_PRIMARY` | `#E4E4E6` | Primary text, headlines |
| `TEXT_SECONDARY` | `#8A8F98` | Muted IDs, timestamps, labels |
| `LINEAR_PURPLE` | `#5E6AD2` | Linear brand purple — logo, accents |
| `CODEGEN_PURPLE` | `#8A5CF5` | Codegen agent accent |
| `DEVIN_BLUE` | `#3886E1` | Devin agent accent |
| `CHECKBOX_BLUE` | `#4A82F6` | Selected issue checkboxes |
| `STATUS_YELLOW` | `#D9A40E` | Urgent priority / In Progress |
| `STATUS_GREEN` | `#3D9962` | In Review / done |
| Headline + body font | Inter (system-ui fallback) | UI, headlines, body |
| Code font | SF Mono / Roboto Mono | Code blocks, inline code |

---

## Repo layout

```
.
├── README.md                  ← you are here
├── LICENSE                    ← MIT
├── CREDITS.md                 ← audio provenance
├── .env.example               ← env vars (none required to render)
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── output/
│   └── demo.mp4               ← final shipped render (with audio)
└── src/
    ├── Video.tsx              ← composition root: contain -> sequence of 8 scenes + Audio
    ├── main.tsx               ← TimelineRoot mount
    ├── constants.ts           ← scene durations (SCENES) + palette tokens
    ├── styles.css             ← document reset + every scene's `@keyframes`
    ├── assets/                ← linear-agents-demo-music-bed.mp3 (fade/loudnorm pre-baked)
    ├── scenes/                ← one file per scene, each its own `<Timegroup mode="fixed">`
    │   ├── TitleIntro.tsx
    │   ├── Backlog.tsx
    │   ├── CodegenIssue.tsx
    │   ├── Integrations.tsx
    │   ├── DevinIssue.tsx
    │   ├── OutroTicker.tsx
    │   ├── OutroTitle.tsx
    │   └── LinearLogo.tsx
    └── components/
        ├── Reveal.tsx         ← declarative fade/slide reveal (CSS keyframes, not per-frame JS)
        ├── icons.tsx          ← shared SVG icons + Cursor, used across scenes
        └── helpers.ts         ← track, lerp, clamp, easings — used only by Backlog.tsx's
                                   small scoped `addFrameTask` (see that file for why)
```

---

## Fork & adapt

```bash
git clone https://github.com/editframe/linear-agents-demo.git
cd linear-agents-demo
npm install
NO_COLOR=1 FORCE_COLOR=0 npm run render
```

1. **Swap the story** — each beat is its own file under `src/scenes/`, sequenced by the inner `<Timegroup mode="sequence">` in `src/Video.tsx`. Edit a scene's own local timing constants directly in that file; scene durations live in `src/constants.ts` (`SCENES`).
2. **Rebrand** — replace the palette tokens at the top of `src/constants.ts` (and `FONT` / `MONO`, also in `src/constants.ts`). Never use pure `#000` or drop shadows on text.
3. **Swap the music** — replace `src/assets/linear-agents-demo-music-bed.mp3` (bake any new fade/loudnorm treatment into the file itself with a local ffmpeg pass — no runtime fade logic) and adjust the `<Audio>` `volume` in `src/Video.tsx`; log it in [`CREDITS.md`](CREDITS.md).
4. **Render** — `NO_COLOR=1 FORCE_COLOR=0 npm run render`.

---

## License

[MIT](LICENSE) — free for commercial use, no attribution required.

---

<div align="center">

Built with [Editframe](https://editframe.com) · Brand: Linear

</div>
