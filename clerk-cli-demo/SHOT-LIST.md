# Shot List — Clerk CLI Demo (17.1s)

Reference: `Clerk CLI.mp4` (17.1s, 1920x1080 @ 30fps)

---

## Scene 1: Login Flow (0.0 – 4.5s | 4.5s)

**Reference frames:** 0ms, 1000ms

| Beat | Master Time | Description |
|---|---|---|
| Terminal window appears | 0.0 – 0.4s | Fade in on dark purple-halo canvas. macOS chrome visible. |
| `clerk login` types in | 0.4 – 0.9s | Monospace typewriter on prompt line, blinking cursor |
| `r  clerk auth login` appears | 0.9 – 1.1s | Dim step prefix, gray text |
| `◇  Checking session` | 1.2 – 1.4s | Diamond progress indicator, purple-soft |
| `|  Waiting for authentication...` | 1.4 – 1.7s | Gray status line |
| Camera zoom in begins | 1.7s | Scale 1.0→1.08, upward pan — viewport fills with text |
| `◇  Completing authentication` | 2.1 – 2.3s | Diamond, purple |
| `|  Logged in as steve@clerk.dev` | 2.7 – 2.9s | Bright white, weight 600 — identity confirmation |
| `L  Done` | 3.0 – 3.2s | Tree end-char, gray |
| Fade out | 4.0 – 4.5s | Cross-dissolve into Scene 2 |

---

## Scene 2: Init Flow (4.5 – 10.0s | 5.5s)

**Reference frames:** 3000ms, 4000ms, 5000ms, 6000ms, 7000ms

| Beat | Master Time | Description |
|---|---|---|
| Previous login output visible (dim) | 4.5s | Login Done + next prompt carry forward, opacity 0.5 |
| `clerk init` types in | 4.8 – 5.25s | New command appears on fresh prompt |
| `r  clerk init` | 5.25 – 5.45s | Sub-command prefix |
| `◇  Detecting framework` | 5.45 – 5.65s | Framework auto-detection |
| `|  Logged in as steve@clerk.dev` | 5.65 – 5.85s | Identity confirmation (carry-forward) |
| `r  clerk link` | 5.85 – 6.05s | App linking sub-command |
| `◇  Fetching applications` | 6.05 – 6.25s | API fetch in progress |
| `✓  Select a Clerk application...` | 6.25 – 6.5s | Purple check — app auto-selected |
| `|  Linked to TaskFlow` | 6.5 – 6.7s | Bright white — linked successfully |
| `|  Detected Next.js (app-router)` | 6.7 – 6.95s | Framework detected |
| `|  Installing @clerk/nextjs...` | 6.95 – 7.2s | Package install begins |
| `added 13 packages in 3s` | 7.2 – 7.4s | npm output, left-margin (no prefix) |
| `|  clerk init will make the following changes:` | 7.4 – 7.6s | File change summary header |
| Camera zoom + pan | 7.8s | Scale increases to 1.15, pans up to reveal file lines |
| `CREATE proxy.ts` | 8.1 – 8.25s | Purple CREATE, gray filename |
| `MODIFY app/layout.tsx` | 8.2 – 8.35s | Purple MODIFY |
| `CREATE app/sign-in/...` | 8.3 – 8.45s | Purple CREATE, full path |
| `CREATE app/sign-up/...` | 8.4 – 8.55s | Purple CREATE |
| `MODIFY .env.local` | 8.5 – 8.65s | Purple MODIFY |
| `✓  Proceed? Yes` | 9.1 – 9.3s | Purple check, white "Yes" |
| Fade out | 9.5 – 10.0s | Cross-dissolve into Scene 3 |

---

## Scene 3: Completion (10.0 – 12.0s | 2.0s)

**Reference frames:** 8000ms, 9000ms, 10000ms

| Beat | Master Time | Description |
|---|---|---|
| Zoom-in terminal (scale 1.2) | 10.0s | Continuation — camera stays zoomed |
| `◇  Writing files` | 10.25 – 10.43s | In-progress writing |
| `◇  Scanning for issues` | 10.5 – 10.68s | Scanning |
| `|  ✓ Clerk has been set up in your project` | 10.85 – 11.0s | BRIGHT WHITE bold — main success line, purple glow pulse |
| `◇  Pulling env vars...` | 11.15 – 11.33s | Pulling dev instance env vars |
| `|  Environment variables written to .env.local` | 11.4 – 11.58s | Written confirmation |
| `L  Done` | 11.65 – 11.8s | Final tree-end |
| Fade out | 11.5 – 12.0s | Cross-dissolve into Scene 4 |

---

## Scene 4: Tagline Card (12.0 – 14.0s | 2.0s)

**Reference frames:** 11000ms, 12000ms, 13000ms

| Beat | Master Time | Description |
|---|---|---|
| Pure dark background (#0D0D0D) | 12.0s | No glow, no backdrop — contrast from terminal scenes |
| "Put your agent" fades up | 12.05 – 12.4s | White, Inter 600, 80px, left-aligned at x=180 |
| "in control." fades up | 12.25 – 12.6s | Gray (#666666), Inter 500, same size, stagger +200ms |
| Hold | 12.6 – 13.6s | Both lines held, no motion |
| Fade out | 13.6 – 14.0s | Cross-dissolve into Scene 5 |

---

## Scene 5: Logo Card (14.0 – 17.1s | 3.1s)

**Reference frames:** 14000ms, 15000ms, 16000ms, 17000ms

| Beat | Master Time | Description |
|---|---|---|
| Pure dark background | 14.0s | Same near-black as Scene 4 — continuation feel |
| Clerk logo fades in | 14.0 – 14.5s | Icon + wordmark centered, translateY 12→0 + fade |
| Cursor blink under logo | 14.5s | White cursor appears below wordmark, blinking |
| `npm install -g clerk` types | 14.5 – 15.2s | Cyan (#67E8F9), monospace, centered, typewriter |
| Cursor stays blinking | 15.2 – 16.7s | After typewriter completes |
| Fade out | 16.7 – 17.1s | Final cross-fade to black |

---

## Visual constants (all scenes)

- **Canvas:** 1920x1080, `#0D0D0D`
- **Terminal width:** 840-920px centered
- **Font:** JetBrains Mono 15px / 24px line-height for CLI; Inter for tagline/logo
- **Purple halos:** Present in Scenes 1, 2, 3; absent in Scenes 4, 5
- **Camera metaphor:** The zoom-in from full window view → close-up text view mirrors the physical feeling of leaning in to read your terminal output. Auth setup is a focused, precise moment.
