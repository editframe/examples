# SHOT-LIST — Cursor SDK Demo (25.3s)

## Scene Overview

| # | Name | Time Range | Duration | BG | Description |
|---|------|-----------|----------|----|-------------|
| 0 | TerminalInstall | 0–8.06s | 8.06s | #0E0E0E | Dark terminal, `uv add cursor-sdk` install sequence types out |
| 1 | TextReveal | 8.06–8.5s | 0.43s | flash | Snap-cut flash to light bg |
| 2 | PaperCodeBlock | 8.06–13.87s | 5.8s | #EDEAE2 | Paper bg, Python code typewriter reveal (Agent.create) |
| 3 | TerminalRun | 13.87–20.4s | 6.5s | #0E0E0E | Dark terminal, `uv run synthetic_data_pipeline.py`, agent output streams |
| 4 | TitleCard | 20.4–24.0s | 3.6s | #FFFFFF | Pure white, "Cursor SDK" text types in |
| 5 | LogoEnd | 24.0–25.3s | 1.3s | #FFFFFF | Cursor cube logo animates in (morphs from flat to 3D) |

## Scene 0 — TerminalInstall (0–8.06s)

Background: `#0E0E0E` (not pure black — very dark warm gray)

Terminal positioned center-left, monospaced font, cursor blinks.

### Beat breakdown:
| Local t | Master t | Beat |
|---------|----------|------|
| 0.0s | 0.0s | `$` prompt + blinking cursor appears |
| 0.5s | 0.5s | Cursor types `uv` |
| 1.0s | 1.0s | Cursor types `uv add cursor-sdk` (full command) |
| 1.5s | 1.5s | Return hit, new line appears |
| 2.5s | 2.5s | `Resolved 9 packages in 0.3s` fades in (muted gray) |
| 3.5s | 3.5s | `Prepared 7 packages in 1.8s` fades in |
| 4.5s | 4.5s | `Installed 8 packages in 0.1s` fades in (white) |
| 5.2s | 5.2s | `+ cursor-sdk==0.5.0` (orange `#E8673A`) appears |
| 6.0s | 6.0s | Build your own (white text fades in, bottom-left) |
| 7.0s | 7.0s | `Build your own agents with Composer` — second line reveals |

### Color palette (terminal):
- Background: `#0E0E0E`
- Prompt `$`: `#8A8A8A` (muted gray)
- Command text: `#EBEBEB` (near-white)
- Dimmed output: `#8A8A8A`
- Bright output: `#EBEBEB`
- Package success `+`: `#E8673A` (Cursor orange-red)
- "Build your own" title: `#F0EDE6` (warm off-white, large body font)

## Scene 2 — PaperCodeBlock (8.06–13.87s)

Background: `#EDEAE2` (warm cream/linen — sampled from frame_at_09000ms)

The exact paper color is a warm gray-green linen, NOT white and NOT yellow. Sampled: approximately `#EDEAE2`.

Typewriter Python code reveal. Code is displayed large (≥48px font) with line numbers.

### Syntax color palette (paper bg):
- Line numbers: `#B0AB9E` (muted warm gray)
- `from`, `with`, `as`, `if`, `for`, `in`: `#2B6CB0` (medium blue)
- `cursor_sdk`: `#1A1A1A` (near-black)
- `import`, `Agent`, `LocalAgentOptions`: `#276749` (forest green, teal)
- `Agent.create`, `local`, `model`, `cwd`: `#1A1A1A` (dark foreground)
- `"composer-2.5-fast"`, `"."`: `#9B2C8E` (purple/magenta)
- `LocalAgentOptions(...)`: `#2B6CB0` (blue)
- `run.messages()`, `.type`: `#C05621` (rust/brown-orange)
- `"tool_call"`: `#9B2C8E` (purple)
- Cursor block: `#1A1A1A` (black fill)

### Code content revealed (lines 1–21):
```python
from cursor_sdk import Agent, LocalAgentOptions

with Agent.create(
    model="composer-2.5-fast",
    local=LocalAgentOptions(cwd="."),
) as agent:
    ...
    # (scroll down)
    for message in run.messages():
        if message.type == "tool_call":
```

### Beat breakdown:
| Local t | Master t | Beat |
|---------|----------|------|
| 0.0s | 8.06s | Paper bg flashes in (white flash) |
| 0.2s | 8.26s | Line 1: `from cursor_sdk import...` appears |
| 0.8s | 8.86s | Line 3: `with Agent.create(` appears |
| 1.5s | 9.56s | Line 4: `model="composer-2.5-fast",` types |
| 2.5s | 10.56s | Line 5: `local=LocalAgentOptions(cwd=".")` appears |
| 3.0s | 11.06s | Line 6: `) as agent:` appears |
| 3.8s | 11.86s | Camera pans/scrolls to show lines 18-21 |
| 4.5s | 12.56s | Line 20: `for message in run.messages():` appears |
| 5.2s | 13.26s | Line 21: `if message.type == "tool_call":` appears |

## Scene 3 — TerminalRun (13.87–20.4s)

Background: `#0E0E0E`  
Position: top-left corner (prompt at ~80px, 80px from top-left)

`$ uv run synthetic_data_pipeline.py` types out, then agent output streams in with color-coded tool calls.

### Color palette (agent output):
- Tool names (`list_dir`, `read_file`, `glob_file_search`, `codebase_search`, `grep`): `#7BC8A4` (teal-green)
- Arguments: `#EBEBEB` (off-white)
- Prose output lines: `#EBEBEB` (bold white)
- Dim prose: `#8A8A8A`
- MCP box border: `#EBEBEB`
- MCP service name `catalog_service`: `#E8673A` (orange)
- MCP label `MCP`: `#E8673A`
- Checkmark `✓`: `#EBEBEB`

### Beat breakdown:
| Local t | Master t | Beat |
|---------|----------|------|
| 0.0s | 13.87s | `$` prompt, cursor blinks (top-left) |
| 0.3s | 14.17s | `uv run synthetic_data_pipeline.py` types |
| 1.0s | 14.87s | `Summarizing codebase...` (dimmed) |
| 1.3s | 15.17s | `Scanning the workspace and config files.` (bright) |
| 1.8s | 15.67s | `list_dir {'relative_workspace_path': '.'}` |
| 2.1s | 15.97s | `read_file {'target_file': 'README.md'}` |
| 2.4s | 16.27s | `read_file {'target_file': 'pyproject.toml'}` |
| 2.8s | 16.67s | `Looking at the API routes and database models.` |
| 3.3s | 17.17s | `list_dir` + `read_file` API/DB lines cascade |
| 4.0s | 17.87s | `Searching for auth and validation patterns.` |
| 4.5s | 18.37s | `codebase_search`, `grep`, `glob_file_search` lines |
| 5.0s | 18.87s | `I have enough context. Writing the catalog entry now.` |
| 5.3s | 19.17s | MCP box appears: `catalog_service · MCP` header |
| 5.6s | 19.47s | Inside box: `Writing catalog_entry...` |
| 5.8s | 19.67s | Box changes: `✓ Saved catalog_entry` |
| 6.0s | 19.87s | Prose: `Wrote catalog_entry.md: 3 bullets...` |
| 6.2s | 20.07s | New `$` prompt appears |

## Scene 4 — TitleCard (20.4–24.0s)

Background: `#FFFFFF` (pure white — intentional brand contrast)

Text types in from left, plain black, large sans-serif (≈80px), left-aligned.

### Beat breakdown:
| Local t | Master t | Beat |
|---------|----------|------|
| 0.0s | 20.4s | White flash cut |
| 0.3s | 20.7s | `Cursor` appears |
| 0.8s | 21.2s | ` S` appears |
| 1.2s | 21.6s | `Cursor SDK` complete |
| 1.8s | 22.2s | `Now available in` fades in, left-aligned |
| 2.5s | 22.9s | `Python and TypeScript` continues typing |

## Scene 5 — LogoEnd (24.0–25.3s)

Background: `#FFFFFF`

Cursor cube logo morphs from flat angular shape to full 3D cube (isometric polygon SVG). Pure black logo centered.

### Beat breakdown:
| Local t | Master t | Beat |
|---------|----------|------|
| 0.0s | 24.0s | Flat angular shape (single face) scales in |
| 0.5s | 24.5s | Cube face rotates/expands to show second face |
| 1.0s | 25.0s | Full Cursor cube logo revealed |
| 1.3s | 25.3s | Hold — video ends |

---

## Background Color Notes

### Paper variant (light) — DOCUMENTED FOR brand-rules-cursor.md
The Cursor SDK video uses a **warm cream linen** background `#EDEAE2` (approx) for the Python code sections. This is NOT the standard dark IDE Cursor aesthetic. It reads as a "documentation-first" editorial style:
- Highly legible on screen
- Feels like a printed code tutorial
- Contrasts with the dark terminal scenes for visual rhythm

This light paper variant is intentional Cursor editorial styling and should be used for documentation-type product demos.

### Pure white (closing) — `#FFFFFF`
The final 4.9s use pure white, which contradicts the "no pure white" doctrine. In this case it IS the reference and it IS intentional — the stark white + black text + minimalist cube logo is a deliberate brand closer.

---

## SSIM Expectations

Target: ≥85 SSIM vs reference.

The main risk is the terminal text timing (Scene 0 and Scene 3 require very specific text positions per frame) — these are simulated with CSS animation, not actual terminal recording, so structural accuracy is more important than pixel-perfect text.
