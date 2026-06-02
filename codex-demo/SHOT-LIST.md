# SHOT-LIST — OpenAI Codex Demo (First 30s)

Reference: `Codex.mp4` (57.7s) — replicating frames 0–30000ms only.

---

## Scene breakdown (derived from keyframes)

### Scene 1: Title Card — `CodexTitle` — 0–4s (4s)

**Ref frames**: 0ms, 2000ms
- macOS Sequoia blue gradient full-bleed background (same background persists entire video)
- White "Computer Use" large text appears upper-center (fade up)
- "in Codex on Mac" subtitle fades in below ~1.5s later
- Animated mouse cursor drifts across frame (visible bottom-right at 0ms, upper-right at 2s)
- NO windows — pure background with typography

Beats:
- 0–600ms: background fully visible
- 200–900ms: "Computer Use" fades up from translateY(30)
- 1500–2200ms: "in Codex on Mac" fades up
- 2200–4000ms: hold; subtle camera drift

---

### Scene 2: Codex Chat (fullscreen) — `CodexChatFull` — 4–7s (3s)

**Ref frames**: 5000ms
- Codex chat window fills most of viewport (no Xcode visible yet)
- White interior, macOS chrome, traffic lights top-left
- Big centered heading: "What will you build in CloudTicTacToe?"
- Input box below with prompt being typed: "Run this app in Xcode, test it by playing a game, an..."
- Bottom bar: `+ Default permissions` · `GPT-5.3-Codex-Spark` · `Medium` · mic icon · send button
- Sub-bar: `CloudTicTacToe` folder · `Work locally` · `main` branch
- Suggestion chips: "Make the build fix commit-ready" / "+ Connect your favorite apps to Codex"
- Prompt TEXT TYPES IN character by character across this scene

Beats:
- 0–400ms: window slides in from bottom (fade + translateY)
- 400–800ms: heading reveals
- 800–2800ms: prompt types in ("Run this app in Xcode, test it by playing a game, and fix any bugs you find")
- 2800–3000ms: send button glows/pulses (user submits)

---

### Scene 3: Dual Window — thinking — `CodexDualThink` — 7–13s (6s)

**Ref frames**: 8000ms, 10000ms, 12000ms
- TWO windows now visible on macOS desktop
- LEFT: Codex chat window (compact, ~55% width) — shows prompt + "Thinking..." spinner
- RIGHT: Xcode code editor (dark, ~45% width, cut off right edge)
  - Swift code visible: `enum GameResult`, `struct CloudTicTacToeGame`, `mutating func`
  - Line numbers on left
- Windows slide in from edges / scale in
- Chat accumulates agent response text in real-time:
  - "Working for 1s"
  - "Understood. I'll first use the Xcode workflow..."
  - "I have the Xcode control toolset available..."
  - "List Mac apps" tool call
  - "Thinking"

Beats:
- 0–600ms: Xcode window slides in from right
- 300–900ms: Codex chat window repositions/resizes to left side
- 900–2500ms: "Thinking..." → agent response text builds up
- 2500–6000ms: more text accumulates (tool calls appear)

---

### Scene 4: Dual Window — Xcode running — `CodexDualRun` — 13–21s (8s)

**Ref frames**: 14000ms, 16000ms, 18000ms, 20000ms
- macOS menu bar now visible at top (Codex app, File/Edit/View/Window/Help, right-side icons, clock)
- Windows repositioned: chat LEFT (smaller), Xcode RIGHT (larger, more prominent)
- Xcode window is now the Xcode IDE itself (not just editor) — has file tree sidebar:
  - CloudTicTacToe > CloudTicTacToe > CloudTicTacToeApp.swift
- In Xcode editor: Swift code being highlighted/scrolled
- A THIRD window appears: the running app "Cloud Tic Tac Toe" (white/glassmorphism game UI)
  - "You are X. The computer is O."
  - "Your turn"
  - 3x3 game grid visible

Beats:
- 0–400ms: macOS menu bar fades in
- 0–800ms: windows animate to final layout
- 800–3000ms: Xcode showing file tree + code (Codex is navigating)
- 3000–5000ms: running app window appears overlaid top-right
- 5000–8000ms: game board fills in (X and O marks appear)

---

### Scene 5: Game + Bug Found — `CodexGameBug` — 21–27s (6s)

**Ref frames**: 21000ms, 22000ms, 24000ms, 26000ms
- Chat window shows: "I reproduced a gameplay defect immediately..."
- Game board now showing X/O marks with "The computer wins this round." message
- Agent is clicking through the game
- More tool calls accumulate: "Clicked in App", "Clicking in App"
- Layout: chat still LEFT, game/Xcode RIGHT
- Board has moves: X top-left, O top-right, X middle-left, O middle-right, O bottom-right, O bottom-left

Beats:
- 0–1500ms: chat text keeps building
- 1500–4000ms: game board gets more X/O marks placed
- 2500–3500ms: "The computer wins this round." banner appears
- 4000–6000ms: hold on defect-found state, Codex thinking

---

### Scene 6: Logo Card — `CodexLogoCard` — 27–30s (3s)

**Ref frames**: 30000ms (reference shows still in dual-window state — we add logo card)
- Fade to black
- OpenAI Codex logo + wordmark centered
- Clean exit

---

## Summary

| Scene | Name | Duration | Key visual |
|-------|------|----------|------------|
| 1 | CodexTitle | 4s | Blue gradient + "Computer Use" typography |
| 2 | CodexChatFull | 3s | Codex chat window, prompt typing |
| 3 | CodexDualThink | 6s | Dual windows, agent thinking + tool calls |
| 4 | CodexDualRun | 8s | macOS desktop, Xcode running, game app appears |
| 5 | CodexGameBug | 6s | Game board with moves, bug found |
| 6 | CodexLogoCard | 3s | OpenAI mark + "Codex" wordmark |
| **Total** | | **30s** | |

## Persistent elements (run through Scenes 3–5)
- macOS blue gradient backdrop (always)
- macOS menu bar (appears at Scene 4, stays)
- LEFT: Codex chat window with growing agent log
- RIGHT: Xcode/game window
