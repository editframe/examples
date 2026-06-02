# Brand Rules — OpenAI Codex

*Derived from reference video + OpenAI design system. Used for the 30s "Computer Use in Codex on Mac" demo.*

---

## Color palette

### macOS background
| Token | Value | Usage |
|-------|-------|-------|
| `bg-top` | `#6EA7F0` | Gradient top — Sequoia-ish blue |
| `bg-mid` | `#5B8DEE` | Gradient mid |
| `bg-bottom` | `#3B6FCE` | Gradient bottom — deeper blue |
| `bg-purple-accent` | `#8B7FD4` | Right-side accent glow |

Background: `linear-gradient(160deg, #6EA7F0 0%, #5B8DEE 45%, #3B6FCE 80%, #7B6FCC 100%)`

### Window chrome (macOS light)
| Token | Value | Usage |
|-------|-------|-------|
| `chrome-bg` | `rgba(255,255,255,0.92)` | Frosted title bar |
| `chrome-border` | `rgba(0,0,0,0.12)` | Title bar bottom border |
| `window-bg` | `#FFFFFF` | Window interior |
| `window-shadow` | `0 20px 60px rgba(0,0,0,0.25), 0 4px 20px rgba(0,0,0,0.15)` | Window elevation |

### Traffic-light buttons
| Token | Value |
|-------|-------|
| `red` | `#FF5F57` |
| `yellow` | `#FEBC2E` |
| `green` | `#28C840` |

### Codex chat UI
| Token | Value | Usage |
|-------|-------|-------|
| `chat-bg` | `#FFFFFF` | Chat interior |
| `chat-fg` | `#000000` | Primary text |
| `chat-secondary` | `#6C6C6C` | Metadata (timestamps, "Called N tools") |
| `chat-accent` | `#10A37F` | OpenAI green — links, Xcode badge, tool icons |
| `chat-input-bg` | `#F7F7F8` | Input area background |
| `chat-input-border` | `rgba(0,0,0,0.10)` | Input border |
| `send-button` | `#000000` | Send / stop button |
| `chip-bg` | `#F0F0F0` | Suggestion chip background |

### Xcode editor (dark theme)
| Token | Value | Usage |
|-------|-------|-------|
| `xcode-bg` | `#1F1F22` | Editor background |
| `xcode-gutter` | `#2C2C2E` | Line number gutter |
| `xcode-line-num` | `#5C5C5C` | Line number text |
| `xcode-fg` | `#FFFFFF` | Default identifier text |
| `xcode-keyword` | `#FC5FA3` | Keywords: `enum`, `func`, `struct`, `var`, `let`, `mutating`, `private`, `guard`, `return`, `if` |
| `xcode-type` | `#A167E6` | Types: `Equatable`, `Player`, `GameResult`, `Array`, `Int`, `String`, `Bool` |
| `xcode-string` | `#FC6A5D` | String literals |
| `xcode-number` | `#D0BF69` | Numeric literals |
| `xcode-comment` | `#6C7986` | Comments `//` |
| `xcode-method` | `#67B7A4` | Method calls |
| `xcode-selected` | `rgba(100,149,237,0.25)` | Selected line highlight |

---

## Typography

### System fonts
- **UI chrome**: `SF Pro Display, SF Pro, -apple-system, system-ui, sans-serif`
- **Code**: `SF Mono, Menlo, Monaco, "Courier New", monospace`

### Scale
| Context | Size | Weight |
|---------|------|--------|
| Title card large | 128px | 400 (regular) |
| Title card sub | 100px | 400 |
| Window title bar | 13px | 400 |
| Chat heading | 32px | 600 |
| Chat body | 15px | 400 |
| Chat metadata | 13px | 400 |
| Code editor | 13px | 400 |
| Button/chip | 13px | 400 |

---

## Motion language

- **Default entrance**: `outCubic` 200–350ms — macOS-native, not bouncy
- **Window appear**: slide up `translateY(24px → 0)` + fade 300ms `outQuart`
- **Text reveals**: stagger 80–150ms between lines, `outCubic`
- **Typing cursor**: 500ms blink cycle
- **Agent status**: fade cross-dissolve 200ms between states
- **Camera drift**: subtle, 0.3% per second — `inOutSine`
- **NO aggressive bounces** — macOS is precise, not playful

---

## Voice / tone

Developer-focused, conversational, confident.
- "Run this app in Xcode, test it by playing a game, and fix any bugs you find"
- Shows the agent's reasoning ("I'll first use the Xcode workflow directly as requested...")
- Bug-finding is matter-of-fact: "I reproduced a gameplay defect immediately"

---

## Logo card

- Background: `#000000` (pure black — the one exception to "not pure black" for logo cards)
- OpenAI wordmark style: white, sans-serif, light weight
- Codex badge: small teal `#10A37F` rounded pill
- Layout: centered, mark + "Codex" text side-by-side

---

## What this demo is NOT

- Not playful/bouncy (that's Figma)
- Not techy-cool blue-glow (that's Cursor)
- Not dramatic-cinematic (that's Claude)
- It IS: precise, macOS-native, developer-workflow authentic
