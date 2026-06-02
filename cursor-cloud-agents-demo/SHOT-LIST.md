# SHOT LIST — Cursor Cloud Agents (20.4s)

Reference: `EDITFRAME PEGS/reference-videos/Cursor Cloud Agents.mp4`
Extracted frames: `cursor-cloud-agents-frames/` (23 frames)

---

## Scene 1: IntroPanel — 0.0–0.3s (0.3s)
**SceneIntroPanel** — Quick flash of the full environment panel UI (same as final panel scene). Rapid zoom-out/fade-in to establish context before cutting to agents home.

## Scene 2: AgentsHome — 0.3–2.0s (1.7s)
**SceneAgentsHome** — `cursor.com/agents` browser chrome, light bg. Left sidebar with toggle + search icon, "New Agent" row with ⌘N shortcut. Right: empty main area with repo/branch picker row ("anysphere/core-ui" dropdown + "main" + cloud icon), text input "Build, fix, explore...", "+ Composer 2" footer row with upload arrow. Bottom-left: user avatar + "Maya Gao / anysphere" + ... and gear icons.

## Scene 3: RepoDropdown — 2.0–4.0s (2.0s)
**SceneRepoDropdown** — Dropdown opens under repo picker. Search field "Search repository, environment...", "Recent" label, two folder rows (anysphere/frontend, anysphere/backend), divider, "Add Repository" + "Add Environment" options. Transitions with gentle scale-in from the repo pill. Background: plain light gray.

## Scene 4: TaglineOne — 4.0–6.17s (2.17s)
**SceneTaglineOne** — Pure white background. Large centered black text fades and builds in two lines:
Line 1 appears: "Agents are only as useful"
Line 2 appears ~1s later: "as their environment"
Font: Inter/system-serif, ~72px, weight 400-500, centered.

## Scene 5: CreateEnvironmentModal — 6.17–7.07s (0.9s)
**SceneCreateEnvironment** — Blurred gradient background (the green/teal/rose blob). White modal card: "Create a New Environment" title + X close. Repository section: two bordered rows — "anysphere/frontend" + folder icon + "Edit" button; "anysphere/backend" + folder icon + "Edit" button. Footer: "Set up manually" outline button + "Start Agent ↗" black pill button.

## Scene 6: StartAgentClick — 7.07–9.3s (2.23s)
**SceneStartAgentClick** — Same modal, camera zooms into "Start Agent" button, hand cursor icon hovers over it. The frame is tight — only lower portion of modal + background visible. The "Start Agent ↗" button fills the lower-center. Cursor hand (white outline, pointer style) centers on button.

## Scene 7: SpinnerBlack — 9.3–11.87s (2.57s)
**SceneSpinnerBlack** — Pure BLACK background. Small white spinner (radial dashes, 8-spoke) appears upper-left area (~85px from left, 170px from top). Spinner animates rotating. Then checklist fades in:
- Row 1: spinner icon + "Analyze & clone repos" (white text, ~56px)
- Row 2: dashed circle + "Configure secrets" (dim gray)
- Row 3: dashed circle + "Install dependencies" (dim gray)
- Row 4: dashed circle + "Environment ready" (dim gray)
Over ~1s, all rows animate to green check circles + white text (GREEN: #22C55E).

## Scene 8: EnvironmentPanel — 11.87–18.0s (6.13s)
**SceneEnvironmentPanel** — Full `cursor.com/agents` chrome light bg. Two-column layout:
LEFT PANEL (agent chat/task area, ~55% width):
  - Top bar: toggle icon + "Environment Set Up" title + "anysphere/frontend-backend" repo pill + cloud icon
  - Task description box: "Set up environment for anysphere/cloud-eng-setup-smoke-repo"
  - Status note: "Setting up repository" (small gray)
  - Agent message: "Build succeeds. Now let me run the dev server and TypeScript checks."
  - Sub-line: "Check Node.js and pnpm versions"
  - Desktop preview thumbnail (lower-left): shows a blurred browser with colored status pills (orange, green), cursor arrow
  - Footer: "Preview Desktop" + "Save Environment" buttons + "Add followups" text input + dark send button

RIGHT PANEL (environment config, ~45% width):
  - Nav bar: Environment (active), Git, Terminal, Desktop, Files + collapse icons
  - Config header: "davidw-personal-2" + "Ready to save" dot + "Save As..." black button + "..."
  - Team icon + "Team" label
  - "Update Script" section: code block with pnpm commands (colored keywords)
  - Secrets section: "Secrets | Manage in Settings" header + "This repo / All repos" toggle + "Add" button
    - Table: Value / Scope / Type columns
    - Rows: AWS_ACCESS_KEY_ID (Team, Environment Variable), DATABASE_URL (Personal, Build Secret), REDIS_URL (Personal, Build Secret), DATADOG_API_KEY (Personal, Build Secret)
  - Network Access Settings: "Use my Allowlist" dropdown + "Edit Allowlist" button

At ~13.5s: Terminal output panel appears TOP-RIGHT (overlapping): "Run backend tests | pnpm" header, terminal lines: `$ pnpm --filter backend-server db:seed:test`, PASS lines, "Tests: 42 passed, 42 total"

At ~14s: Desktop preview thumbnail EXPANDS/SLIDES in from bottom-left, showing browser with orange + green status bars, cursor arrow. A "tools used" popover appears bottom-right: globe icon "Opened | console.aws.amazon.com/eks/home" + checklist items: "Open the AWS Console and check the EKS dashboard", "Take a screenshot of the service health page", "Inspect CloudWatch graphs visually"

Camera: gentle zoom-out from 1.1x → 1.0x over 6s.

## Scene 9: TaglineTwo — 18.0–19.0s (1.0s)
**SceneTaglineTwo** — Pure white background. Centered black text: "Agents that work like developers do". Same Inter font, ~72px weight 400.

## Scene 10: LogoCube — 19.0–20.4s (1.4s)
**SceneLogoCube** — Pure white background. Cursor isometric cube logo in center (~120px). Cube starts as solid dark shape and rotates to reveal the Cursor logomark with white notch triangle. The cube gently rotates on its Y axis. No wordmark — just the mark alone, very minimal.

---

## Timing summary
| # | Scene | Start | End | Duration |
|---|-------|-------|-----|----------|
| 1 | IntroPanel | 0.0s | 0.3s | 0.3s |
| 2 | AgentsHome | 0.3s | 2.0s | 1.7s |
| 3 | RepoDropdown | 2.0s | 4.0s | 2.0s |
| 4 | TaglineOne | 4.0s | 6.17s | 2.17s |
| 5 | CreateEnvironmentModal | 6.17s | 7.07s | 0.9s |
| 6 | StartAgentClick | 7.07s | 9.3s | 2.23s |
| 7 | SpinnerBlack | 9.3s | 11.87s | 2.57s |
| 8 | EnvironmentPanel | 11.87s | 18.0s | 6.13s |
| 9 | TaglineTwo | 18.0s | 19.0s | 1.0s |
| 10 | LogoCube | 19.0s | 20.4s | 1.4s |
| | **TOTAL** | | | **20.4s** |

---

## Key visual notes
- Background: NOT black for most — light gray (#F5F5F5 / #F0F0F0) or near-white
- Scene 7 is the ONLY pure black scene (spinning loader state)
- Scene 4 and 9 are pure white with large black text
- Scene 10 is pure white with dark cube
- Modal scenes (5-6) have blurred gradient blob background
- The Cursor UI chrome is very minimal: light borders, subtle shadows, Inter font
- Code syntax: `pnpm` and `--filter` keywords in blue, rest dark
- All status pills on the environment panel are right-aligned labels
