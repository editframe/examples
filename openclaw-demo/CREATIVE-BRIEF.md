# OpenClaw Demo Creative Brief

Status: high-level review checkpoint. No production code has been started in this folder yet.

## Working Title

From Message to Done

## Objective

Create a 30-second Editframe product demo for OpenClaw that shows one chat message turning into completed real-world work across the tools and channels a user already has.

The video should feel like a product proof, not a launch trailer. It should make the viewer understand the core OpenClaw promise in one pass: this is not another chat UI; this is a personal assistant with local reach, persistent context, and real execution paths.

## Source Truths

Sources checked:

- OpenClaw homepage: https://openclaw.ai/
- OpenClaw README: https://github.com/openclaw/openclaw
- OpenClaw live CSS: https://openclaw.ai/assets/Layout.wUUzETCH.css and https://openclaw.ai/assets/index@_@astro.CywQ81R8.css
- OpenClaw brand mark: https://openclaw.ai/favicon.svg
- Editframe getting started: https://editframe.com/getting-started
- Editframe examples repo structure: https://github.com/FreakPirate/examples

Verifiable claims we can safely use:

- Homepage promise: "The AI that actually does things."
- Homepage examples: clears inbox, sends emails, manages calendar, checks in for flights, from WhatsApp, Telegram, or other chat apps.
- README positioning: OpenClaw is a personal AI assistant run on the user's own devices, answering on existing channels.
- README positioning: the Gateway is the control plane; the product is the assistant.
- README supported channel examples include WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, Microsoft Teams, Matrix, LINE, WeChat, and others.

Claims to avoid in the video:

- Star counts, growth rankings, install counts, press claims, or "fastest growing" language.
- Security claims that require deeper validation.
- Any comparison against named competitors.

## Brand Assets Noted

- Logo SVG: https://openclaw.ai/favicon.svg
- OG image: https://openclaw.ai/og-image.png
- Apple touch icon: https://openclaw.ai/apple-touch-icon.png
- 32px favicon: https://openclaw.ai/favicon-32.png
- Sponsor logos are present on the site but are not needed for this concept.

Logo geometry notes:

- Use the actual favicon SVG path geometry for the mark.
- Do not redraw the logo from scratch.
- Keep the mark small and product-native until the final card.

## Brand System

Use the dark OpenClaw theme as the default video environment.

Color tokens from live CSS:

| Token | Value | Usage |
| --- | --- | --- |
| `bg-deep` | `#050810` | Primary background |
| `bg-surface` | `#0a0f1a` | App and desktop surfaces |
| `bg-elevated` | `#111827` | Terminal and cards |
| `coral-bright` | `#ff4d4d` | OpenClaw mark, prompts, decisive action |
| `coral-mid` | `#e63946` | Motion accents |
| `coral-dark` | `#991b1b` | Logo gradient end |
| `cyan-bright` | `#00e5cc` | Completed status, active route, assistant signal |
| `cyan-mid` | `#14b8a6` | Secondary status |
| `text-primary` | `#f0f4ff` | Primary text |
| `text-secondary` | `#8892b0` | Supporting text |
| `text-muted` | `#5a6480` | Metadata |
| `border-subtle` | `rgba(136, 146, 176, .15)` | Panels and UI boundaries |
| `surface-card` | `rgba(10, 15, 26, .65)` | Glass-like product panels |
| `surface-card-strong` | `rgba(10, 15, 26, .8)` | Foreground panels |

Typography from live CSS:

- Display: `Clash Display`, fallback `system-ui, sans-serif`
- Body: `Satoshi`, fallback `system-ui, sans-serif`
- Mono: `SF Mono`, `Fira Code`, `JetBrains Mono`, `monospace`

Motion language:

- Precise, fast, tool-like.
- No mascot-first treatment.
- No generic AI glow tunnel.
- The visual proof comes from UI state changes: inbox count drops, calendar conflict resolves, GitHub issue opens, reminder lands, summary returns.

## Strategic Brief

Structural truth:

OpenClaw is positioned as a personal assistant that runs on the user's own devices and answers through channels the user already uses, with the Gateway explicitly framed as control plane rather than product.

Substitute test:

- A hosted chatbot cannot use "runs on your own devices" as the execution surface.
- A single-channel bot cannot make "channels you already use" the core product form.
- A generic automation dashboard cannot claim the assistant, not the dashboard, is the product.

Formal constraint:

Because OpenClaw's product is the assistant, not the interface, the video must keep returning to a single chat thread while the work branches out into multiple real surfaces and then collapses back into one completed response.

Single argument:

This video argues that OpenClaw turns an ordinary message into completed work by showing one instruction become visible changes across mail, calendar, GitHub, reminders, and local device state.

Authorial angle:

OpenClaw makes AI feel less like software you visit and more like a personal runtime you can reach from wherever you already talk.

Why the brand would not say this directly:

It is more interpretive than the current homepage copy, which wisely stays concrete: inbox, email, calendar, flights, and chat apps.

Entry state:

Skeptical curiosity. The viewer has seen many AI chat demos and expects another answer box.

Exit state:

Operational trust. The viewer sees why the assistant matters only when it has routes into the user's actual working environment.

Arc:

Skeptical curiosity -> recognition -> operational trust

Scene budget:

3 scenes maximum for a 30-second video.

## Scene Plan

### Scene 1: One Message, Many Stakes - 0s to 8s

Viewer enters feeling skeptical and exits with a clear task setup.

Visual:

- Full-screen dark OpenClaw desktop environment.
- A single chat thread is centered, with the OpenClaw mark in the title bar.
- User types: "Can you clear my morning and prep the release follow-up?"
- Context chips appear beneath the message: Mail, Calendar, GitHub, Reminders, Local.
- The prompt is sent. The chat does not explode into hype; it becomes a routing map.

Purpose:

- Establish that OpenClaw starts where the user already communicates.
- Avoid feature-list copy. The task implies multiple capabilities.

### Scene 2: Work Leaves The Chat - 8s to 22s

Viewer enters expecting a text answer and exits seeing real execution.

Visual:

- The chat stays pinned left.
- Four surfaces assemble around it in a controlled layout:
  - Inbox: unread count decreases, two replies are drafted, one is sent.
  - Calendar: conflicting block moves, a prep block appears.
  - GitHub: release follow-up issue opens with checklist items.
  - Local device/status rail: assistant heartbeat, channel route, and memory/context indicators update.
- A cyan signal line connects the original chat message to each completed state.
- Each surface uses product-real labels and plausible UI, not stock app screenshots.

Purpose:

- Prove "does things" without saying it repeatedly.
- Show existing channels and local reach as the mechanism.

### Scene 3: Back To Done - 22s to 30s

Viewer enters with recognition and exits with trust.

Visual:

- The work surfaces compress back into the chat thread.
- OpenClaw replies:
  - "Done."
  - "Moved the 10:30, sent two replies, opened the release follow-up, and added a prep block."
- A compact receipt appears with four checked items.
- Final 2 seconds: OpenClaw mark and line: "The AI that actually does things."

Purpose:

- Resolve the work into a credible assistant response.
- Leave the viewer with the homepage promise, now visually earned.

Duration accounting:

- Scene 1: 8s
- Scene 2: 14s
- Scene 3: 8s
- Total: 30s

## Implementation Direction After Approval

Project folder:

- `openclaw-demo/`

Likely implementation files:

- `README.md`
- `SHOT-LIST.md`
- `brand-rules-openclaw.md`
- `package.json`
- `src/Video.tsx`
- `src/main.tsx`
- `src/styles.css`
- `src/components/*`
- `audio/README.md`
- `output/`

Build approach:

- Match the existing Editframe React examples.
- Use the actual OpenClaw favicon SVG path geometry.
- Recreate app surfaces in HTML/CSS rather than embedding screenshots.
- Keep animation deterministic and render-safe.
- Add music and SFX only if we can use cleared assets and document credits.

Key components:

- `OpenClawMark`
- `ChatThread`
- `RouteSignal`
- `MailSurface`
- `CalendarSurface`
- `GitHubSurface`
- `LocalStatusRail`
- `DoneReceipt`

QA bar:

- Local install succeeds from the new folder.
- Preview runs in browser.
- Render completes to MP4.
- Poster frame generated.
- No text clipping at 1920x1080.
- No layout shifts from dynamic text.
- Scene durations sum exactly to 30s.
- Final video has no broken assets, blank frames, missing fonts without fallback, or uncredited audio.

## Review Ask

Please review only the high-level direction:

- Is "From Message to Done" the right promise?
- Is the concrete workflow credible for OpenClaw?
- Is the tone appropriately product-proof rather than hype?

Once this direction is approved, implementation decisions and QA stay with me.
