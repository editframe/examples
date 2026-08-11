/**
 * Scene 4 — Article page: "How to safely run AI generated code in your application"
 * Master: 12000–16500ms (4500ms local)
 *
 * FIX 3: Scroll DOWN fast (accelerating), show lots of content for ~2s,
 *   then scroll ALL THE WAY BACK UP fast to the title. Chat begins right after,
 *   so this scene ends back at the top for a clean cut into Scene5.
 *
 * Every element here is a deterministic function of the scene's own local time
 * with no cross-element interdependency, so — unlike Scene1/Scene5 — the whole
 * scene converts cleanly to plain CSS `@keyframes` (see `styles.css`): a single
 * scroll animation (down / hold / up / hold, `scene4-scroll`) and a single
 * cursor-drift animation (`scene4-cursor-drift`). The camera scale never
 * changes, so it's a static style rather than an animation.
 *
 * Timing (scene-local ms, mirrored as % keyframe stops of 4500ms total):
 *   0–600ms (0–13.3%):     Hold at top (article title visible)
 *   600–1800ms (13.3–40%): Fast scroll DOWN (inOutCubic) — shows article body
 *   1800–2600ms (40–57.8%): Hold at bottom
 *   2600–3600ms (57.8–80%): Fast scroll BACK UP (inOutCubic) — returns to title
 *   3600–4500ms (80–100%): Hold at top again
 */
import React from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";

const DURATION = 4500;
const SCENE_START = 12000;

export function ArticlePage() {
  return (
    <Timegroup
      mode="fixed"
      duration={`${DURATION}ms`}
      style={{ position: 'absolute', inset: 0, background: '#141414' }}
    >
      <TraceLayer sceneStartMs={SCENE_START} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* Camera rig — scale is constant (1.55×), so this is a static style, not an animation */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          transformOrigin: '50% 38%',
          transform: 'scale(1.55)',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Browser chrome */}
          <div style={{
            position: 'absolute',
            left: 0, top: 0, right: 0, bottom: 0,
            background: '#0a0a0a',
            borderRadius: 0,
            border: 'none',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'none',
          }}>
            {/* Nav */}
            <div style={{
              height: 48,
              background: '#0a0a0a',
              borderBottom: '1px solid #1e1e1e',
              display: 'flex',
              alignItems: 'center',
              padding: '0 24px',
              gap: 28,
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18 }} fill="white">
                  <path d="M12 2L2 19.5H22L12 2Z"/>
                </svg>
                <span style={{ color: 'white', fontSize: 14, fontWeight: 600, fontFamily: 'system-ui' }}>Vercel</span>
              </div>
              <div style={{ display: 'flex', gap: 20 }}>
                <span style={{ color: '#888', fontSize: 12, fontFamily: 'system-ui' }}>Products ▾</span>
                <span style={{ color: 'white', fontSize: 12, fontFamily: 'system-ui', background: '#1e1e1e', padding: '3px 8px', borderRadius: 5, border: '1px solid #333' }}>Resources ▾</span>
                <span style={{ color: '#888', fontSize: 12, fontFamily: 'system-ui' }}>Solutions ▾</span>
                <span style={{ color: '#888', fontSize: 12, fontFamily: 'system-ui' }}>Enterprise</span>
                <span style={{ color: '#888', fontSize: 12, fontFamily: 'system-ui' }}>Docs</span>
                <span style={{ color: '#888', fontSize: 12, fontFamily: 'system-ui' }}>Pricing</span>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 10px', background: '#111', border: '1px solid #2a2a2a', borderRadius: 5,
                  color: '#555', fontSize: 12, fontFamily: 'system-ui',
                }}>
                  <span>Search Knowledge Base</span>
                  <span style={{ border: '1px solid #333', padding: '1px 5px', borderRadius: 3, fontSize: 10 }}>⌘K</span>
                </div>
                <div style={{ padding: '5px 12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: 5, color: 'white', fontSize: 12, fontFamily: 'system-ui' }}>Ask AI</div>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#333', border: '1px solid #444' }} />
              </div>
            </div>

            {/* Article content */}
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  animation: 'scene4-scroll 4500ms both',
                }}
              >
                <div style={{
                  maxWidth: 860,
                  margin: '0 auto',
                  padding: '36px 24px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                  {/* Breadcrumb */}
                  <div style={{
                    position: 'relative', zIndex: 2,
                    display: 'flex', alignItems: 'center', gap: 8,
                    marginBottom: 22, color: '#555', fontSize: 13, fontFamily: 'system-ui',
                    alignSelf: 'flex-start',
                  }}>
                    <span>←</span>
                    <span>Knowledge Base</span>
                    <span>/</span>
                    <span style={{ color: '#777' }}>AI</span>
                  </div>

                  {/* Title */}
                  <h1 style={{
                    margin: '0 0 22px',
                    fontSize: 56,
                    fontWeight: 700,
                    color: '#FFFFFF',
                    fontFamily: "'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                    letterSpacing: '-1.5px',
                    lineHeight: 1.15,
                    textAlign: 'center',
                  }}>
                    How to safely run AI generated<br />code in your application
                  </h1>

                  {/* Subtitle */}
                  <p style={{
                    margin: '0 0 20px',
                    fontSize: 16,
                    color: '#777',
                    fontFamily: 'system-ui',
                    textAlign: 'center',
                    lineHeight: 1.55,
                  }}>
                    Execute untrusted, AI-generated code inside an isolated, ephemeral environment and return real results.
                  </p>

                  {/* Author */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18,
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, color: 'white', fontWeight: 700, fontFamily: 'system-ui',
                    }}>D</div>
                    <span style={{ color: '#777', fontSize: 14, fontFamily: 'system-ui' }}>Delba de Oliveira</span>
                  </div>

                  {/* Metadata row */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%',
                    paddingBottom: 20,
                    marginBottom: 24,
                    borderBottom: '1px solid #1e1e1e',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, color: '#555', fontSize: 13, fontFamily: 'system-ui' }}>
                      <span>⏱ 5 min read</span>
                      <span style={{ color: '#2a2a2a' }}>|</span>
                      <span>⎘ Copy page</span>
                      <span style={{ color: '#2a2a2a' }}>|</span>
                      <span>💬 Ask AI about this page</span>
                    </div>
                    <div style={{ color: '#444', fontSize: 13, fontFamily: 'system-ui' }}>
                      Last updated November 26, 2025
                    </div>
                  </div>

                  {/* Article body — extended with lots of content for the down-scroll */}
                  <div style={{
                    width: '100%',
                    fontSize: 15, color: '#bbb', fontFamily: 'system-ui', lineHeight: 1.72,
                  }}>
                    <p style={{ margin: '0 0 18px' }}>
                      AI models are increasingly used to generate code. Often, applications return this code to the user as plain text. But some apps could run the generated code to produce UI or other results.
                    </p>
                    <p style={{ margin: '0 0 18px' }}>
                      This creates powerful possibilities but introduces risk. Generated code is untrusted. It may delete files, leak sensitive data, or consume excessive resources. The danger increases when users can influence prompts and craft malicious input. Running such code on your machine or in your production application is unsafe.
                    </p>
                    <p style={{ margin: '0 0 24px' }}>
                      Vercel Sandbox addresses this by running untrusted code in a remote, isolated environment with strong safeguards and full control.
                    </p>

                    <h2 style={{ margin: '0 0 12px', fontSize: 30, fontWeight: 700, color: 'white', fontFamily: 'system-ui' }}>TL;DR</h2>
                    <p style={{ margin: '0 0 10px' }}>In this guide, you'll learn:</p>
                    <ul style={{ margin: '0 0 24px', paddingLeft: 22 }}>
                      <li style={{ marginBottom: 6 }}>What Vercel Sandbox is and how it works.</li>
                      <li style={{ marginBottom: 6 }}>How to create a sandbox, run commands, and capture results.</li>
                      <li style={{ marginBottom: 6 }}>Example: Use an AI SDK Agent to generate and safely execute code inside a sandbox.</li>
                    </ul>

                    <h2 style={{ margin: '0 0 12px', fontSize: 30, fontWeight: 700, color: 'white', fontFamily: 'system-ui' }}>How does Vercel Sandbox work?</h2>
                    <p style={{ margin: '0 0 10px' }}>
                      Vercel Sandbox is an <strong style={{ color: 'white' }}>ephemeral compute primitive</strong> designed for untrusted workloads. Each sandbox is:
                    </p>
                    <ul style={{ margin: '0 0 24px', paddingLeft: 22 }}>
                      <li style={{ marginBottom: 6 }}>Isolated: no access to your production environment or filesystem</li>
                      <li style={{ marginBottom: 6 }}>Ephemeral: automatically destroyed after execution completes</li>
                      <li style={{ marginBottom: 6 }}>Controlled: resource limits enforced by the platform</li>
                    </ul>

                    <h2 style={{ margin: '0 0 12px', fontSize: 28, fontWeight: 700, color: 'white', fontFamily: 'system-ui' }}>Getting started</h2>
                    <p style={{ margin: '0 0 18px' }}>
                      To use Vercel Sandbox in your application, you'll need to install the SDK and configure your environment. This creates a <code style={{ background: '#1a1a1a', padding: '2px 6px', borderRadius: 4, fontSize: 13, color: '#e2e8f0' }}>.env.local</code> file with a <code style={{ background: '#1a1a1a', padding: '2px 6px', borderRadius: 4, fontSize: 13, color: '#e2e8f0' }}>VERCEL_OIDC_TOKEN</code> that the Sandbox SDK will use to authenticate.
                    </p>
                    <p style={{ margin: '0 0 18px' }}>
                      In development, this token expires after 12 hours, so you'll need to run <code style={{ background: '#1a1a1a', padding: '2px 6px', borderRadius: 4, fontSize: 13, color: '#e2e8f0' }}>vercel env pull</code> again if you're working over extended periods.
                    </p>

                    <h2 style={{ margin: '0 0 12px', fontSize: 26, fontWeight: 700, color: 'white', fontFamily: 'system-ui' }}>Key properties</h2>
                    <ul style={{ margin: '0 0 24px', paddingLeft: 22 }}>
                      <li style={{ marginBottom: 6 }}>Cost model: You pay primarily for active CPU and provisioned memory. Idle waiting (e.g., API calls) does not count as active CPU.</li>
                      <li style={{ marginBottom: 6 }}>Extensively tested: Sandbox uses the same underlying technology that powers Vercel builds and v0.</li>
                      <li style={{ marginBottom: 6 }}>Observability: Sandboxes emit logs and metrics accessible from your Vercel dashboard.</li>
                    </ul>

                    <h2 style={{ margin: '0 0 12px', fontSize: 26, fontWeight: 700, color: 'white', fontFamily: 'system-ui' }}>Example</h2>
                    <p style={{ margin: '0 0 18px' }}>
                      To understand how Vercel Sandbox works, let's build a minimal AI app that responds to natural language queries that require computation or network access.
                    </p>
                    <p style={{ margin: '0 0 18px' }}>
                      To keep the example simple and avoid boilerplate code, we'll use the following tools: a Next.js route handler, the AI Gateway to query OpenAI, the AI SDK to create an agent, and Vercel Sandbox to run the generated code.
                    </p>

                    <h2 style={{ margin: '0 0 12px', fontSize: 26, fontWeight: 700, color: 'white', fontFamily: 'system-ui' }}>Creating a Sandbox</h2>
                    <p style={{ margin: '0 0 18px' }}>
                      Each Sandbox is created with a single API call. You specify the runtime (Node.js or Python), optional environment variables, and the maximum lifetime. Sandboxes are billed only for the duration they're active — idle time waiting for your LLM doesn't count.
                    </p>
                    <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 8, padding: '16px 20px', marginBottom: 20, fontFamily: 'monospace', fontSize: 13, color: '#a8d8a0', lineHeight: 1.7 }}>
                      <div style={{ color: '#666', marginBottom: 6 }}>// Create a sandbox and run generated code</div>
                      <div><span style={{ color: '#e2c08d' }}>const</span> sandbox = <span style={{ color: '#e2c08d' }}>await</span> Sandbox.create({'{'}</div>
                      <div style={{ paddingLeft: 20 }}>runtime: <span style={{ color: '#ce9178' }}>'node'</span>,</div>
                      <div style={{ paddingLeft: 20 }}>env: {'{'} API_KEY: process.env.API_KEY {'}'}</div>
                      <div>{'}'});</div>
                      <div style={{ marginTop: 8 }}><span style={{ color: '#e2c08d' }}>const</span> result = <span style={{ color: '#e2c08d' }}>await</span> sandbox.run(generatedCode);</div>
                      <div><span style={{ color: '#e2c08d' }}>await</span> sandbox.destroy();</div>
                    </div>

                    <h2 style={{ margin: '0 0 12px', fontSize: 26, fontWeight: 700, color: 'white', fontFamily: 'system-ui' }}>Security model</h2>
                    <p style={{ margin: '0 0 10px' }}>
                      Vercel Sandbox enforces strict security boundaries at the infrastructure level. You cannot rely on application-level sandboxing (e.g., <code style={{ background: '#1a1a1a', padding: '2px 6px', borderRadius: 4, fontSize: 13, color: '#e2e8f0' }}>vm.runInNewContext</code> in Node.js) to fully isolate untrusted code. The differences:
                    </p>
                    <ul style={{ margin: '0 0 24px', paddingLeft: 22 }}>
                      <li style={{ marginBottom: 8 }}><strong style={{ color: 'white' }}>Kernel-level isolation:</strong> Each sandbox runs in its own micro-VM with a dedicated kernel. No syscall sharing with the host or other sandboxes.</li>
                      <li style={{ marginBottom: 8 }}><strong style={{ color: 'white' }}>Network egress control:</strong> By default, sandboxes have no outbound network access. You can selectively enable specific allowlisted hosts.</li>
                      <li style={{ marginBottom: 8 }}><strong style={{ color: 'white' }}>Filesystem isolation:</strong> The sandbox has its own ephemeral filesystem. Nothing it writes persists after <code style={{ background: '#1a1a1a', padding: '2px 6px', borderRadius: 4, fontSize: 13, color: '#e2e8f0' }}>destroy()</code> is called.</li>
                      <li style={{ marginBottom: 8 }}><strong style={{ color: 'white' }}>Resource quotas:</strong> CPU and memory are capped. Runaway code cannot starve your production infrastructure.</li>
                    </ul>

                    <h2 style={{ margin: '0 0 12px', fontSize: 26, fontWeight: 700, color: 'white', fontFamily: 'system-ui' }}>Integrating with the AI SDK Agent</h2>
                    <p style={{ margin: '0 0 18px' }}>
                      The most powerful pattern is giving your AI agent a <code style={{ background: '#1a1a1a', padding: '2px 6px', borderRadius: 4, fontSize: 13, color: '#e2e8f0' }}>runCode</code> tool backed by Vercel Sandbox. The agent can write, execute, observe the output, and iterate — all within a single, isolated environment that is destroyed at the end of the turn.
                    </p>
                    <p style={{ margin: '0 0 18px' }}>
                      This unlocks agentic workflows that would otherwise require complex infrastructure: data analysis, unit test generation, script execution, and API exploration — all with production-safe guarantees.
                    </p>

                    <h2 style={{ margin: '0 0 12px', fontSize: 26, fontWeight: 700, color: 'white', fontFamily: 'system-ui' }}>Observability and debugging</h2>
                    <p style={{ margin: '0 0 18px' }}>
                      Sandbox execution logs are streamed directly to your Vercel dashboard under the Functions tab. You can filter by sandbox ID, view stdout/stderr, and inspect resource usage per execution. For production apps, you can forward these logs to your preferred observability provider using Vercel Log Drains.
                    </p>

                    <h2 style={{ margin: '0 0 12px', fontSize: 26, fontWeight: 700, color: 'white', fontFamily: 'system-ui' }}>Pricing and limits</h2>
                    <ul style={{ margin: '0 0 24px', paddingLeft: 22 }}>
                      <li style={{ marginBottom: 8 }}>Sandbox is available on Vercel Pro and Enterprise plans.</li>
                      <li style={{ marginBottom: 8 }}>Each sandbox supports up to 512MB RAM and 1 vCPU by default. Higher limits are configurable on Enterprise.</li>
                      <li style={{ marginBottom: 8 }}>Maximum execution time per sandbox run: 60 seconds (extendable via config).</li>
                      <li style={{ marginBottom: 8 }}>Concurrent sandboxes per team: 50 (soft limit, contact support to raise).</li>
                    </ul>

                    <h2 style={{ margin: '0 0 12px', fontSize: 26, fontWeight: 700, color: 'white', fontFamily: 'system-ui' }}>Next steps</h2>
                    <p style={{ margin: '0 0 18px' }}>
                      Now that you understand how Vercel Sandbox works, you're ready to integrate it into your own AI application. Start with the minimal example above, then explore the full SDK reference for advanced features like streaming stdout, custom runtimes, and multi-step execution within a single sandbox lifecycle.
                    </p>
                    <p style={{ margin: '0 0 18px' }}>
                      For questions or feedback, join the <span style={{ color: '#818cf8' }}>#sandbox</span> channel in the Vercel community Discord or open an issue on the SDK GitHub repository.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gray orb cursor — drifts gently from (960,300) to (940,380), then holds */}
        <div
          style={{
            position: 'absolute',
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'rgba(180, 180, 180, 0.85)',
            border: '2px solid rgba(255,255,255,0.4)',
            boxShadow: '0 0 8px rgba(255,255,255,0.2)',
            opacity: 0.9,
            zIndex: 20,
            pointerEvents: 'none',
            animation: 'scene4-cursor-drift 4500ms both',
          }}
        />
      </div>
    </Timegroup>
  );
}
