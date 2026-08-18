# Editframe Examples

Ready-to-run video composition examples built with the [Editframe](https://editframe.com) React SDK.

This repo is a single Editframe workbench project. One `npm install` and `npm start` gives
you a picker UI to browse, preview, and scrub through every example below in one dev server —
each example still lives in its own folder with its own `src/`, `README.md`, `CREDITS.md`, and
`output/demo.mp4`.

## Examples

| Example | Description |
|---|---|
| [`figma-agent-demo`](figma-agent-demo/) | Figma workspace with AI agent generating an onboarding flow — 30.8s |
| [`vercel-deploy-demo`](vercel-deploy-demo/) | Vercel deploy flow from code push to live preview — 22.5s |
| [`vercel-knowledge-base-demo`](vercel-knowledge-base-demo/) | Vercel Knowledge Base — 28.1s |
| [`claude-security-demo`](claude-security-demo/) | Claude security public beta announcement — 19s |
| [`claude-code-demo`](claude-code-demo/) | Claude Code agent view with orchestrated parallel subagents — 36s |
| [`claude-office-demo`](claude-office-demo/) | Claude for Excel, PowerPoint, and Word — 30s |
| [`claude-code-financial-demo`](claude-code-financial-demo/) | Claude Code agent templates for financial services — 30s |
| [`claude-opus48-demo`](claude-opus48-demo/) | Claude Code agent view with orchestrated parallel subagents — 36s |
| [`cursor-jira-demo`](cursor-jira-demo/) | Cursor replying to a Jira comment inside the editor — 28.5s |
| [`cursor-sdk-demo`](cursor-sdk-demo/) | Cursor SDK product demo (light paper variant) — 25.3s |
| [`cursor-cloud-agents-demo`](cursor-cloud-agents-demo/) | Cursor Cloud Agents — 20.4s |
| [`fal-ai-demo`](fal-ai-demo/) | fal.ai Assets introduction — 15.1s |
| [`clerk-cli-demo`](clerk-cli-demo/) | Clerk CLI setup — 17.1s |
| [`codex-demo`](codex-demo/) | OpenAI Codex bug fix workflow — 22s |
| [`linear-agents-demo`](linear-agents-demo/) | Linear for Agents product demo — 32s |
| [`allbirds-tree-runner-demo`](allbirds-tree-runner-demo/) | Allbirds Tree Runner NZ — vertical social ad — 25s |
| [`fashionnova-the-edit-demo`](fashionnova-the-edit-demo/) | Fashion Nova — The Edit — vertical social ad — 25s |
| [`gymshark-geo-seamless-demo`](gymshark-geo-seamless-demo/) | Gymshark Geo Seamless — vertical social ad — 19s |
| [`olipop-demo`](olipop-demo/) | OLIPOP — vertical social ad — 20s |
| [`rhode-demo`](rhode-demo/) | rhode summer '26 — vertical social ad — 20s |

## Quick start

```bash
npm install
npm start
```

`npm start` opens the Editframe preview server with a project picker in the workbench's header
(the top-left dropdown) — search or arrow-key through every example and pick one to scrub its
timeline live. The picker is rendered into the workbench's `toolbar-start` extension slot
(see `src/ProjectPicker.tsx`) and syncs to the URL (`?project=<example>`) so you can share a
link straight to one example.

## Rendering

Every example has its own `render:<example>` script that renders straight to that example's
`output/demo.mp4`:

```bash
npm run render:figma-agent-demo
npm run render:vercel-deploy-demo
# ... one render:<example> script per folder above
```

A couple of examples finish with an extra local compositing pass (real footage/audio muxed in
after the Editframe render) — see [`olipop-demo/composite-well.sh`](olipop-demo/composite-well.sh)
and [`gymshark-geo-seamless-demo/add-audio.sh`](gymshark-geo-seamless-demo/add-audio.sh) for
details; those scripts are already wired into `render:olipop-demo` where applicable.

## Project structure

```
examples/
├── package.json          # single root project — shared deps, start/render scripts
├── vite.config.ts        # one shared dev server for every example
├── tsconfig.json
├── index.html            # single entry point, mounts the workbench shell
├── src/
│   ├── main.tsx           # React root
│   ├── App.tsx            # picker UI + render-data bypass for CLI renders
│   ├── ProjectPicker.tsx  # header project switcher (workbench toolbar-start slot)
│   ├── projects.ts        # registry of every example (title, poster, dynamic imports)
│   └── styles.css
└── <example>/
    ├── src/                # Video.tsx, scenes/, components/, assets/ — unchanged internals
    ├── README.md
    ├── CREDITS.md
    ├── poster.jpg          # picker thumbnail — ./generate-posters.sh <example> refreshes it
    └── output/demo.mp4
```

https://github.com/user-attachments/assets/18070c4e-ab5f-4b68-b80f-ac6e35cebbf3



https://github.com/user-attachments/assets/27519e91-9aac-47da-93e6-996e4f424b4c



https://github.com/user-attachments/assets/7b73b517-0a67-423a-a59d-f7036d31f710



https://github.com/user-attachments/assets/0b080baa-e7e2-4900-bd86-7cfa04e66689



https://github.com/user-attachments/assets/ea09ccee-a973-447c-8821-d97ef510594f



https://github.com/user-attachments/assets/079c0f04-e40a-4b7a-b4ad-a4ddc282bde7



https://github.com/user-attachments/assets/e42c4ef1-aae1-4992-8b24-1740f585f3d0



https://github.com/user-attachments/assets/6322af25-19e4-4bac-b155-46090f0bdce2



https://github.com/user-attachments/assets/88ab8452-8850-48f3-b829-89140dec10f6



https://github.com/user-attachments/assets/22e375eb-3dc2-4d19-af09-000e577f42c3



https://github.com/user-attachments/assets/f05ab8b4-00c5-4de2-9708-86e81a0fb536



https://github.com/user-attachments/assets/c8c74dcd-826e-4310-af73-b8f507e4b94c



https://github.com/user-attachments/assets/40e13133-7637-4c0e-aa0a-3989965a6620



https://github.com/user-attachments/assets/5a038981-e53c-4b12-bb35-c5109cfe0ad5



https://github.com/user-attachments/assets/62dc5b7a-c752-43f8-9978-f35de21a0d9b



https://github.com/user-attachments/assets/844e2aca-fe74-4d27-8669-320ce6f8ac6a



https://github.com/user-attachments/assets/2d0e9f78-62a9-4ae1-b816-2d5ea334a541



https://github.com/user-attachments/assets/6fe5a638-2cfd-4ab3-a2ea-4f0e213706e3



https://github.com/user-attachments/assets/af3b2b89-df7a-4350-97f0-041807e071e8



https://github.com/user-attachments/assets/d4d644ad-1dc0-4b8b-be6b-099cea99a4bd


