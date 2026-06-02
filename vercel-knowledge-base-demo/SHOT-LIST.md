# SHOT LIST — Vercel Knowledge Base Demo (28.1s)

Reference: `EDITFRAME PEGS/reference-videos/Vercel Knowledge Base.mp4`
Output: 1920×1080 @ 30fps, #0A0A0A background, Geist Sans/Mono

---

## Act 1 — Hero Splash (0.0–2.0s) · Scene1_KBHero

**Visual:** Full-screen dark canvas. "Knowledge Base" headline fades/scales in bold white Geist Sans 700. Subtitle "In-depth guides, tutorials, and explainers for best practices with Vercel." in muted gray fades in below. Bottom half shows a grid of category cards with framework icons (Next.js ⓝ, Express, Remix, etc.) scrolling upward. Thin horizontal divider between header and grid.

**Motion:** Title scale 0.94→1.0 + fade, 400ms outCubic. Subtitle fade 200ms stagger. Category grid cards rise from below with stagger.

**Beat count:** 3 (title in, subtitle in, cards rise)

---

## Act 2 — KB Browser View: Scroll through page (2.0–9.5s) · Scene2_KBBrowse

**Visual:** Full browser chrome renders. Top nav: Vercel triangle logo, Products/Resources/Solutions/Enterprise/Docs/Pricing. "Resources" tab highlighted with dropdown indicator. Top-right: "Ask AI" button + user avatar. Below nav: the Knowledge Base page scrolls.

**Scroll sequence:**
- 2.0–3.5s: Three category cards visible (AI, Backend, Security) with framework icon grids. Titles + descriptions below each.
- 3.5–5.0s: Page scrolls down. Search bar "Search Knowledge Base ⌘K" appears. "Featured Guides" section with 6 article cards in 2-row × 3-col grid:
  - Row 1: "How to safely run AI generated code..." (AI tag), "Using Vercel Sandbox to run Claude's Agent SDK" (Backend tag), "Efficiently manage database connection pools..." (Backend tag)
  - Row 2: "How to gradually roll out new versions of your backend" (Backend), "Streaming responses from LLMs" (AI), "How to conduct PCI scans on Vercel..." (Security)
- 5.0–7.0s: Scrolls further → "All Guides" section header + "Filter Guides by Product" dropdown + list of guide rows with tag pills on right (Rolling Releases/CLI, Domains, Fluid Compute, Sandbox, AI SDK, AI Gateway/Sandbox/AI SDK, BotID, Vercel MCP Server, Domains)
- 7.0–8.0s: Filter dropdown opens — reveals filter options: Domains, Sandbox, AI SDK, Rolling Releases, CLI, Fluid Compute. "Sandbox" is highlighted/hovered.
- 8.0–9.5s: Filter applied "Sandbox" — list collapses to 3 results: "Using Vercel Sandbox to run Claude's Agent SDK", "Building AI apps on Vercel: an overview", "How to safely run AI generated code in your application→". CTA section below: "Ready to deploy?" / "Explore Vercel Enterprise"

**Motion:** Smooth translateY scroll animation. Dropdown fade-in + items stagger. Filter state swap (list shrinks to 3 rows).

**Beat count:** 8 distinct scroll/interaction beats

---

## Act 3 — Article Page Opens (9.5–16.0s) · Scene3_ArticlePage

**Visual:** Page transitions to the full article view. Breadcrumb "← Knowledge Base / AI" at top center. Large white bold title: "How to safely run AI generated code in your application". Gray subtitle: "Execute untrusted, AI-generated code inside an isolated, ephemeral environment and return real results." Author row: circular avatar + "Delba de Oliveira". Meta strip: "⏱ 5 min read | ⎘ Copy page | ⌂ Ask AI about this page ... Last updated November 26, 2025". Divider line. Body paragraphs start scrolling:
- Paragraph 1 about AI models generating code.
- Paragraph 2 about risk.
- Paragraph 3 "Vercel Sandbox addresses this..."
- H2 "TL;DR" + bullet list
- H2 "How does Vercel Sandbox work?" + bulleted feature list (Isolated, Ephemeral, Configurable, Observable, Cost model, Extensively tested)

**Motion:** Article fade-in from slightly-zoomed-out state. Breadcrumb → title → author → meta → body reveal with stagger. Page scrolls upward slowly to reveal more content (~9.5s–16s).

**Beat count:** 6 (breadcrumb, title, author, meta, divider, body scroll)

---

## Act 4 — Ask AI Panel Opens + Typing (16.0–20.0s) · Scene4_AskAI

**Visual:** Left side: article page at same scroll position (slightly zoomed/offset). Right side: "Ask AI" panel slides in from right edge. Panel header "Ask AI" with copy/delete/expand icons. Inside panel: document chip "How to safely run AI generated code in yo... | https://vercel.com/kb/guide/running-ai-generate..." + text input "Ask a question..." with cursor. User types "walk me through setting up sandbox" (typewriter animation). Send button (arrow up icon) becomes active (white bg).

**Motion:** Panel slides in from right (translateX 400→0, 350ms outCubic). Input text types character-by-character. Send button pulse on completion.

**Beat count:** 3 (panel in, typing, send pulse)

---

## Act 5 — AI Response Streams In (20.0–28.1s) · Scene5_AIResponse

**Visual:** Both panels visible. Left: article page still visible behind. Right "Ask AI" panel: the user's message "walk me through setting up sandbox" appears as a chat bubble near top. AI response streams in below:
- Greeting + intro text
- "Prerequisites" heading
- "First, you'll need to install the Vercel CLI if you haven't already."
- "Step 1: Create your project directory and install packages"
- Code block: `mkdir sandbox-test / cd sandbox-test / pnpm i @vercel/sandbox ms / pnpm add -D @types/ms @types/node`
- "If you prefer, you can use npm or yarn instead of pnpm."
- "Step 2: Link your project to Vercel" + code block `vercel link`
- "Step 3: Set up authentication" + code block `vercel env pull`
- Explanation about `.env.local` + VERCEL_OIDC_TOKEN
- "Step 4: You're ready to go!" → full explanation
- Feedback row (thumbs up/down/copy) + "Ask a question..." input at bottom

**Motion:** Text streams in top-to-bottom with smooth reveal. Code blocks appear with slight fade. Panel scrolls as content grows. Thumbs up icon pulses slightly on final hold.

**Beat count:** 8 (intro, prerequisites, step 1, code block 1, step 2, step 3, step 4, feedback row)

---

## Total scenes: 5
## Total duration: 28.1s
## Scene offsets:
| Scene | Start | End | Duration |
|---|---|---|---|
| Scene1_KBHero | 0.0s | 2.0s | 2.0s |
| Scene2_KBBrowse | 2.0s | 9.5s | 7.5s |
| Scene3_ArticlePage | 9.5s | 16.0s | 6.5s |
| Scene4_AskAI | 16.0s | 20.0s | 4.0s |
| Scene5_AIResponse | 20.0s | 28.1s | 8.1s |
