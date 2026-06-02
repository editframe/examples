/**
 * Scene 2 — Full browser window overview (zoomed-out view)
 * Master: 2500–5000ms
 *
 * Frame 2s: Full Vercel browser window visible with dark outer bg.
 *   Nav: Vercel logo + Products/Resources(active)/Solutions/Enterprise/Docs/Pricing + Ask AI + avatar
 *   Content scrolled to show: category card grid top (AI, Backend, Security cards),
 *   then "Search Knowledge Base" bar,
 *   then "Featured Guides" heading with 3 article cards below.
 *   Gray circle indicator visible at right edge ~y=340.
 * Frame 3s: Page has scrolled down to show Featured Guides more prominently,
 *   "All Guides" section starting at bottom.
 * Frame 5s: Scrolled to "All Guides" list view.
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { track, lerp } from "../components/helpers";

const DURATION = 2500;
const SCENE_START = 2500;

function NavBar() {
  return (
    <div style={{
      height: 56,
      background: '#0a0a0a',
      borderBottom: '1px solid #1e1e1e',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 32,
      flexShrink: 0,
    }}>
      {/* Vercel logo + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }} fill="white">
          <path d="M12 2L2 19.5H22L12 2Z"/>
        </svg>
        <span style={{ color: 'white', fontSize: 15, fontWeight: 600, fontFamily: 'system-ui' }}>Vercel</span>
      </div>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <span style={{ color: '#888', fontSize: 13, fontFamily: 'system-ui' }}>Products ▾</span>
        <span style={{
          color: 'white', fontSize: 13, fontFamily: 'system-ui',
          background: '#1e1e1e', padding: '4px 10px', borderRadius: 6,
          border: '1px solid #333',
        }}>Resources ▾</span>
        <span style={{ color: '#888', fontSize: 13, fontFamily: 'system-ui' }}>Solutions ▾</span>
        <span style={{ color: '#888', fontSize: 13, fontFamily: 'system-ui' }}>Enterprise</span>
        <span style={{ color: '#888', fontSize: 13, fontFamily: 'system-ui' }}>Docs</span>
        <span style={{ color: '#888', fontSize: 13, fontFamily: 'system-ui' }}>Pricing</span>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          padding: '6px 14px',
          background: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: 6,
          color: 'white',
          fontSize: 13,
          fontFamily: 'system-ui',
        }}>Ask AI</div>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: '#333',
          border: '1px solid #444',
        }} />
      </div>
    </div>
  );
}

function CategoryCard({ title, description, icon, iconBg }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg?: string;
}) {
  return (
    <div style={{
      flex: 1,
      border: '1px solid #222',
      borderRadius: 8,
      overflow: 'hidden',
      background: '#0d0d0d',
    }}>
      {/* Icon area */}
      <div style={{
        height: 100,
        background: '#111',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        borderBottom: '1px solid #222',
      }}>
        {icon}
      </div>
      {/* Text area */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ color: 'white', fontSize: 15, fontWeight: 600, fontFamily: 'system-ui', marginBottom: 6 }}>{title}</div>
        <div style={{ color: '#666', fontSize: 12, fontFamily: 'system-ui', lineHeight: 1.5 }}>{description}</div>
      </div>
    </div>
  );
}

function ArticleCard({ title, description, tag, tagColor }: {
  title: string;
  description: string;
  tag: string;
  tagColor: string;
}) {
  return (
    <div style={{
      flex: 1,
      border: '1px solid #222',
      borderRadius: 8,
      padding: '20px 18px',
      background: '#0d0d0d',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      <div style={{
        color: 'white',
        fontSize: 14,
        fontWeight: 600,
        fontFamily: 'system-ui',
        lineHeight: 1.4,
      }}>{title}</div>
      <div style={{
        color: '#666',
        fontSize: 12,
        fontFamily: 'system-ui',
        lineHeight: 1.5,
        flex: 1,
      }}>{description}</div>
      <div style={{
        display: 'inline-block',
        padding: '3px 8px',
        borderRadius: 4,
        background: tagColor,
        color: 'white',
        fontSize: 11,
        fontWeight: 600,
        fontFamily: 'system-ui',
        alignSelf: 'flex-start',
      }}>{tag}</div>
    </div>
  );
}

export function Scene2_BrowserOverview() {
  const browserRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // Scroll down slightly to reveal more content
    const scrollT = track(ms, 0, 2500);
    const scrollY = lerp(0, 200, scrollT);
    if (scrollRef.current) {
      scrollRef.current.style.transform = `translateY(${-scrollY}px)`;
    }

    // Gray indicator moves from right edge downward
    if (cursorRef.current) {
      const cy = lerp(280, 380, track(ms, 0, 2500));
      cursorRef.current.style.top = `${cy}px`;
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration="2.5s"
      onFrame={onFrame as any}
      style={{ position: 'absolute', inset: 0, background: '#141414' }}
    >
      <TraceLayer sceneStartMs={SCENE_START} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      <div style={{ position: 'absolute', inset: 0, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Browser window */}
        <div
          ref={browserRef}
          style={{
            width: 1160,
            height: 880,
            background: '#0a0a0a',
            borderRadius: 12,
            border: '1px solid #2a2a2a',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 32px 64px rgba(0,0,0,0.8)',
          }}
        >
          <NavBar />

          {/* Scrollable page content */}
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            <div ref={scrollRef} style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>

              {/* Category cards section */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e1e1e' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <CategoryCard
                    title="AI"
                    description="Build AI-powered applications using Vercel's AI Cloud features and SDKs."
                    iconBg="#111"
                    icon={
                      <div style={{ display: 'flex', gap: 8 }}>
                        {/* Bolt icons */}
                        <svg viewBox="0 0 24 24" style={{ width: 32, height: 32 }}>
                          <defs>
                            <linearGradient id="bolt1" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#8b5cf6"/>
                              <stop offset="100%" stopColor="#06b6d4"/>
                            </linearGradient>
                          </defs>
                          <path d="M13 2L4 14H11L9 22L20 10H13L13 2Z" fill="url(#bolt1)"/>
                        </svg>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: 'white', fontSize: 14, fontWeight: 700, fontFamily: 'Arial' }}>N</span>
                        </div>
                        <svg viewBox="0 0 24 24" style={{ width: 32, height: 32 }} fill="#ff3e00">
                          <path d="M20.6 3.2C18.9 1.3 16 0.9 14 2.2L7 7C5.1 8.3 4.5 10.8 5.5 12.8C4.8 13.5 4.3 14.5 4.3 15.5C4.3 17.8 6.1 19.7 8.4 19.7C8.7 19.7 9 19.7 9.3 19.6L15 16C16.9 14.8 17.7 12.4 17 10.3C17.7 9.6 18.2 8.6 18.2 7.5C18.1 5.3 16.4 3.5 14.1 3.4"/>
                        </svg>
                      </div>
                    }
                  />
                  <CategoryCard
                    title="Backend"
                    description="Build and host APIs and other backend functionality on Vercel."
                    iconBg="#111"
                    icon={
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <svg viewBox="0 0 24 24" style={{ width: 28, height: 28 }} fill="none">
                          <circle cx="12" cy="12" r="10" stroke="#3b82f6" strokeWidth="1.5"/>
                          <path d="M12 2C12 2 7 8 7 14C7 18 9 21 12 22C15 21 17 18 17 14C17 8 12 2 12 2Z" fill="#3b82f6" opacity="0.3"/>
                        </svg>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: 'white', fontSize: 12, fontWeight: 700, fontFamily: 'Arial' }}>N</span>
                        </div>
                        <svg viewBox="0 0 24 24" style={{ width: 28, height: 28 }} fill="#ff3e00">
                          <path d="M20.6 3.2C18.9 1.3 16 0.9 14 2.2L7 7C5.1 8.3 4.5 10.8 5.5 12.8"/>
                        </svg>
                      </div>
                    }
                  />
                  <CategoryCard
                    title="Security"
                    description="Secure your applications with Vercel's Firewall, Bot Management, deployment protection, and more."
                    iconBg="#111"
                    icon={
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1a1a3e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg viewBox="0 0 24 24" style={{ width: 24, height: 24 }} fill="#4488ff">
                            <path d="M12 1L3 5V11C3 16.5 7 21.7 12 23C17 21.7 21 16.5 21 11V5L12 1Z"/>
                          </svg>
                        </div>
                        <div style={{
                          position: 'absolute', width: 28, height: 28, borderRadius: '50%',
                          background: '#cc2244', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          marginLeft: 32, marginTop: 24,
                        }}>
                          <svg viewBox="0 0 24 24" style={{ width: 16, height: 16 }} fill="white">
                            <path d="M12 1L3 5V11C3 16.5 7 21.7 12 23C17 21.7 21 16.5 21 11V5L12 1Z"/>
                          </svg>
                        </div>
                      </div>
                    }
                  />
                </div>
              </div>

              {/* Search bar */}
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e1e1e' }}>
                <div style={{
                  background: '#111',
                  border: '1px solid #2a2a2a',
                  borderRadius: 8,
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  maxWidth: 520,
                  margin: '0 auto',
                }}>
                  <span style={{ color: '#555', fontSize: 14, fontFamily: 'system-ui' }}>Search Knowledge Base</span>
                  <span style={{ color: '#444', fontSize: 12, fontFamily: 'system-ui', border: '1px solid #333', padding: '2px 6px', borderRadius: 4 }}>⌘K</span>
                </div>
              </div>

              {/* Featured Guides */}
              <div style={{ padding: '24px 24px 16px' }}>
                <h2 style={{ margin: '0 0 20px', color: 'white', fontSize: 22, fontWeight: 700, fontFamily: 'system-ui' }}>
                  Featured Guides
                </h2>
                <div style={{ display: 'flex', gap: 12 }}>
                  <ArticleCard
                    title="How to safely run AI generated code in your application"
                    description="Execute untrusted, AI-generated code inside an isolated, ephemeral environment and return real results."
                    tag="AI"
                    tagColor="#16803c"
                  />
                  <ArticleCard
                    title="Using Vercel Sandbox to run Claude's Agent SDK"
                    description="Learn how to deploy Claude's Agent SDK in Vercel Sandbox for secure and isolated execution of AI-powered code generation and autonomous agent tasks."
                    tag="Backend"
                    tagColor="#9a5c1a"
                  />
                  <ArticleCard
                    title="Efficiently manage database connection pools with Fluid compute"
                    description="How to create high-performance database connection pools without leaking connections"
                    tag="Backend"
                    tagColor="#9a5c1a"
                  />
                </div>
              </div>

              {/* Second row of featured */}
              <div style={{ padding: '4px 24px 20px' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <ArticleCard
                    title="How to gradually roll out new versions of your backend"
                    description="Incrementally release updates to your backend to minimize impact of mistakes."
                    tag="Backend"
                    tagColor="#9a5c1a"
                  />
                  <ArticleCard
                    title="Streaming responses from LLMs"
                    description="Learn how to use the AI SDK to stream LLM responses."
                    tag="AI"
                    tagColor="#16803c"
                  />
                  <ArticleCard
                    title="How to conduct PCI scans on Vercel: A complete guide to IP safelisting"
                    description="Scan and verify your Vercel deployments for secure, PCI-compliant payment processing."
                    tag="Security"
                    tagColor="#1a5c9a"
                  />
                </div>
              </div>

              {/* All Guides section */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #1e1e1e' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h2 style={{ margin: 0, color: 'white', fontSize: 22, fontWeight: 700, fontFamily: 'system-ui' }}>
                    All Guides
                  </h2>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    border: '1px solid #333', borderRadius: 6,
                    padding: '6px 12px', background: '#111',
                    color: '#888', fontSize: 13, fontFamily: 'system-ui',
                  }}>
                    <span>Filter Guides by Product</span>
                    <span>▾</span>
                  </div>
                </div>
                {[
                  { title: 'How to gradually roll out new versions of your backend', tags: ['Rolling Releases', 'CLI'] },
                  { title: "How do I view and update my domain's ICANN registrant information on Vercel?", tags: ['Domains'] },
                  { title: 'Efficiently manage database connection pools with Fluid compute', tags: ['Fluid Compute'] },
                  { title: "Using Vercel Sandbox to run Claude's Agent SDK", tags: ['Sandbox'] },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 0',
                    borderTop: i === 0 ? '1px solid #1e1e1e' : 'none',
                    borderBottom: '1px solid #1e1e1e',
                  }}>
                    <span style={{ color: 'white', fontSize: 14, fontFamily: 'system-ui', fontWeight: 500 }}>{item.title}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {item.tags.map((tag, ti) => (
                        <span key={ti} style={{
                          color: '#888', fontSize: 12, fontFamily: 'system-ui',
                          border: '1px solid #333', padding: '3px 8px', borderRadius: 4,
                          background: '#111',
                        }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gray circular indicator */}
        <div
          ref={cursorRef}
          style={{
            position: 'absolute',
            right: 320,
            top: 280,
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: '#888',
            opacity: 0.9,
            zIndex: 10,
          }}
        />
      </div>
    </Timegroup>
  );
};

Scene2_BrowserOverview.duration = DURATION;
