/**
 * Scene 5 — Article + AI Chat panel side-by-side
 * Master: 16500–30000ms  (13500ms local — see `DURATION` below)
 *
 * This scene keeps a scoped `onFrame` (per REFACTOR-PATTERNS.md Part 2b, bullet 5)
 * for two reasons that are each independently irreducible to CSS:
 *  (1) the typewriter effect and the AI response stream progressively rebuild
 *      `innerHTML` from a slice of a JS string — CSS keyframes cannot generate
 *      dynamic markup from text content, only animate existing DOM/CSS properties;
 *  (2) the camera dolly is a single multi-phase state machine (7 phases, each
 *      re-using the previous phase's end state as its own start state) shared
 *      with the panel slide-in and several discrete UI toggles keyed off the
 *      same `ms` clock. As in Scene1, splitting only part of this into CSS
 *      would mean keeping two timing systems in sync by hand for no benefit.
 *
 * FIX 8: Zoom-in at ~17s targets the AI chat BOX precisely (not black void).
 *   The chat panel is 340px wide, positioned at x=1520–1860 of the browser content.
 *   Canvas: browser left=60, top=50. Browser width=1800, height=980. Nav=46px.
 *   Content area y = 50 + 46 = 96.
 *   AI panel: x in canvas = 60 + (1800 - 340) = 1520 → center x = 60 + 1800 - 170 = 1690
 *   AI panel y = 96 to 1030 → center y = 563.
 *   Chat INPUT BOX is at the BOTTOM of the panel: y ≈ 1030 - 80 = 950, center y ≈ 990
 *
 *   FIX 8 STRATEGY: zoom in so the chat HEADER + INPUT BOX fill the screen.
 *   Chat header top y ≈ 96 (panel top = content top). Chat panel spans y=96 to 1030.
 *   Focus on chat panel top-half: center at (1690, 350). Scale 2.0.
 *   origin = canvas center (960, 540).
 *   Tx = sx - 960 - (1690 - 960) * S = 1100 - 960 - 730 * 2.0 = 140 - 1460 = -1320  ← too much
 *
 *   BETTER: use transform-origin AT the chat panel center, then no translate needed.
 *   origin = (1690, 400) = (87.9%, 37%)
 *   At scale 1.8: point (1690, 400) stays at screen (1690*1920/1920, 400*1080/1080) = same canvas position.
 *   To bring it toward frame center (960, 540): need translate.
 *   Tx = 960 - 1690 = -730 (unscaled, then CSS translate is applied before scale with transform-origin)
 *
 *   Actually with CSS `transform-origin: (ox, oy)` and `transform: translate(Tx, Ty) scale(S)`:
 *   Final screen position of canvas point (px, py):
 *     screen_x = ox + Tx + (px - ox) * S  ... wait, that's wrong.
 *
 *   Correct CSS transform-origin math:
 *   `transform: translate(Tx, Ty) scale(S)` with `transform-origin: ox oy`:
 *   The element transforms around (ox, oy). The net effect on a point (px, py):
 *     screen_x = ox + Tx*1 + (px - ox)*S  -- WRONG, translate is pre-scale
 *
 *   With `transform: translate(Tx, Ty) scale(S)` and `transform-origin: ox oy`:
 *   CSS applies: shift origin → scale → shift back → translate
 *   So: screen_x = (px - ox) * S + ox + Tx
 *       screen_y = (py - oy) * S + oy + Ty
 *   To get point (px, py) to screen (sx, sy):
 *     Tx = sx - (px - ox)*S - ox
 *     Ty = sy - (py - oy)*S - oy
 *
 *   FIX 8: Zoom into chat header at (1690, 200) to appear at screen (960, 300).
 *   Scale = 1.8. origin = (960, 540) [center].
 *   Tx = 960 - (1690 - 960)*1.8 - 960 = 960 - 1314 - 960 = -1314
 *   Ty = 300 - (200 - 540)*1.8 - 540 = 300 + 612 - 540 = 372
 *   That would put chat header at (960, 300). Chat panel extends ~1800px height * 1.8 = 1620px scaled.
 *   Chat panel top=200 at screen 300, bottom=200+(1030-96) * 1.8 = 300 + 1682 = out of frame.
 *   Good — we want to see top portion of chat panel filling the frame.
 *
 *   FIX 9 final framing: zoom to ~1.4×, show article (left 50%) and chat bottom (right 50%).
 *   Target: article column left edge at screen x=60, chat panel right edge at screen x=1860.
 *   At scale 1.4 with origin center (960, 540):
 *   Article left x = 60: screen_x = (60 - 960)*1.4 + 960 + Tx = -1260 + 960 + Tx = -300 + Tx = 60 → Tx = 360  (too right)
 *   Better to use origin at (960, 840) [lower center, near chat bottom]:
 *   ox=960, oy=840. Scale 1.4.
 *   To center the split layout: put the divider (article/chat border at x=1520) at screen x=960:
 *     Tx = 960 - (1520 - 960)*1.4 - 960 = 960 - 784 - 960 = -784
 *   To show bottom of chat (y=1000) near screen bottom (y=950):
 *     Ty = 950 - (1000 - 840)*1.4 - 840 = 950 - 224 - 840 = -114
 *
 * Camera phases (scene-local ms):
 *   0–1400ms:    Slide-in + scale 1.0 (no zoom)
 *   1400–2200ms: Zoom in on chat panel top (FIX 8): scale 1.0 → 1.8
 *   2200–3800ms: Hold zoomed in — user types message visible in input
 *   3800–4800ms: Zoom out to 1.0×
 *   4800–6300ms: Hold wide
 *   6300–7800ms: Zoom back in to medium (1.3×) — both columns visible
 *   7800–11000ms: Hold medium while response streams
 *   11000–12500ms: Drift to FIX 9 framing (1.4×, show chat bottom + article left)
 *   12500–13500ms: Hold FIX 9
 */
import React, { useCallback, useRef } from "react";
import { Timegroup, Audio } from "@editframe/react";
import { TRACE_MODE, TRACE_OPACITY } from "../constants";
import { TraceLayer } from "../components/TraceLayer";
import { track, lerp, typewriter } from "../components/helpers";
import { eases } from "animejs";

const DURATION = 13500;
const SCENE_START = 16500;

const TYPED_MESSAGE = "walk me through setting up sandbox";

// ── CAMERA PHASE TIMING (scene-local ms) ──
const ZOOM_IN_START       = 1400;
const ZOOM_IN_END         = 2200;
const ZOOM_IN_HOLD_END    = 3800;
const ZOOM_OUT_START      = 3800;
const ZOOM_OUT_END        = 4800;
// AI response finishes at RESPONSE_START + RESPONSE_DURATION = 3500 + 3800 = 7300ms.
// USER FIX: previously the medium zoom began at 6300 — a full second BEFORE the
// response finished — so the camera was already moving while the last lines landed.
// Now we HOLD the wide reading framing through the entire response + a clear ~600ms
// beat (until 7900ms), THEN zoom. Nothing moves until the AI is visibly done.
const HOLD_WIDE_END       = 7900;
const ZOOM_MED_END        = 8550;
const HOLD_MED_END        = 8550;   // no separate hold; final-zoom track begins here
const ZOOM_FINAL_END      = 9800;

// ── CAMERA SCALES ──
// FIX A: Browser fills full canvas (zero margins): 1920×1080. Nav=46px.
// FIX D: Zoom tight on chat INPUT area when typing (S=2.5).
// FIX E: Dramatic final zoom on chat RESPONSE BOTTOM (S=2.7) — THE BIG ONE.
//
// Chat panel: width=420px fixed. x=1500–1920, center x=1710.
// Nav y=46. Chat body y=82–1000. Context chip (above input) y≈910–1000. Input y=1000–1080.
//
// CSS transform-origin: 50% 50% = (960, 540).
// Formula: screen_x = S*(px-960)+960+Tx,  Tx = sx - S*(px-960) - 960
//          screen_y = S*(py-540)+540+Ty,   Ty = sy - S*(py-540) - 540
//
const S_NORMAL  = 1.0;

// FIX D: Zoom on chat panel bottom (context chip + input) when typing — S=2.0.
// Reference at ~16s: context chip ("How to safely run AI generated code in yo...")
// and "Ask a question..." input fill the bottom-right of the frame.
//
// Chat panel layout (canvas, with nav=46):
//   Panel header: y=46–83 (37px)
//   chatBodyRef: y=83–910 (height=827px, flex:1 after header+wouldYouLike+input)
//   wouldYouLike: y=910–976 (66px) — has opacity:0 during typing but occupies space
//   Input area: y=976–1080 (104px), input center y≈1028
//
// innerChatRef during typing phase: bottom=910, height≈72px → top≈838.
// Context chip center y ≈ 838+12+30 = 880.
// Input center y ≈ 1028.
//
// Target: context chip (y=880) at screen y=560, input (y=1028) at screen y=856.
// Focus canvas y=950 at screen y=700:
//   Ty = 700 - 2.0*(950-540) - 540 = 700-820-540 = -660
//
// Chat panel left (x=1500) at screen x=600 (right ~55% of frame):
//   Tx = 600 - 2.0*(1500-960) - 960 = 600-1080-960 = -1440
// Context chip center x=1710: screen = 2*(1710-960)+960-1440 = 1500+960-1440 = 1020 → visible ✓
// Input box right edge (x=1910): screen = 2*(1910-960)+960-1440 = 1900+960-1440 = 1420 → visible ✓
const S_ZOOM_IN = 2.0;
const TX_ZOOM_IN = -1440;
const TY_ZOOM_IN = -660;

// Wide: no translate
const S_WIDE    = 1.0;
const TX_WIDE = 0;
const TY_WIDE = 0;

// Medium (S=1.8) — both columns visible, chat response building up.
// Reference mid-phase: article on left, chat panel on right, response streaming.
// Want chat panel left edge (x=1500) at screen x=800:
// Tx = 800 - 1.8*(1500-960) - 960 = 800 - 972 - 960 = -1132
// The response streams and is pinned to bottom of chatBodyRef (y~900-930 canvas).
// Show canvas y≈400-900 range: want y=400 at screen y=0:
// Ty = 0 - 1.8*(400-540) - 540 = 0 + 252 - 540 = -288
// Canvas y=900: screen = 1.8*(900-540)+540+(-288) = 648+540-288 = 900 — at screen 900. Good.
const S_MED     = 1.8;
const TX_MED = -1132;
const TY_MED = -288;

// FINAL FRAMING — FIX E: Match reference ref_27s.jpg.
// Reference: article on LEFT (~50%), chat panel on RIGHT (~50%), zoom ~1.6-1.8x.
// Chat shows Step4 + "Would you like..." + feedback + input box, all readable.
// innerChatRef pinned to bottom: "Would you like..." y≈850-950 (approx, after full response).
// Chat panel: x=1500-1920. Article: x=0-1500.
// S=1.7, center at canvas (1200, 800) → want at screen (960, 650).
// Tx = 960 - 1.7*(1200-960) - 960 = 960 - 408 - 960 = -408
// Ty = 650 - 1.7*(800-540) - 540 = 650 - 442 - 540 = -332
// This places: article left edge at screen ~-510, article partially visible on left.
// Chat panel left (x=1500): screen = 1.7*(1500-960)+960+Tx = 918+960-408 = 1470 — too far right.
// Adjust: want chat left edge (x=1500) at screen x=700 (giving chat right 55% of frame):
// Tx = 700 - 1.7*(1500-960) - 960 = 700 - 918 - 960 = -1178
// For canvas y=850 (bottom of "Would you like..." + feedback) at screen y=700:
// Ty = 700 - 1.7*(850-540) - 540 = 700 - 527 - 540 = -367
// Article left edge: screen = 1.7*(0-960)+960+(-1178) = -1632+960-1178 = -1850 → article cropped left ✓
// Article text at x=100: screen = 1.7*(100-960)+960-1178 = -1462+960-1178 = -1680 → cropped left ✓
// Actually article BODY at x~150: still cropped. Article shows up IF article width is ~1500.
// At x=400 (article column content): screen=1.7*(400-960)+960-1178 = -952+960-1178=-1170 → cropped.
// Hmm, let me use a more balanced center. Canvas center of both columns = x=960.
// Want canvas x=1100 at screen x=700 (right-biased):
// Tx = 700 - 1.7*(1100-960) - 960 = 700 - 238 - 960 = -498
// Article text at x=400: screen = 1.7*(400-960)+960-498 = -952+960-498 = -490 → still cut.
// Article center is at x=750. Want x=750 at screen x=300 (left third):
// Tx = 300 - 1.7*(750-960) - 960 = 300 + 357 - 960 = -303
// Chat left (x=1500): screen = 1.7*(1500-960)+960-303 = 918+960-303 = 1575 → ok.
// Chat center (x=1710): screen = 1.7*(1710-960)+960-303 = 1275+960-303 = 1932 → barely visible.
// Chat content at x=1520: screen = 1.7*(1520-960)+960-303 = 952+960-303 = 1609 → partially off.
// Use a lower scale so more fits. S=1.55:
// Tx = 300 - 1.55*(750-960) - 960 = 300+325.5-960 = -334.5 ≈ -335
// Chat left (x=1500): screen = 1.55*(1500-960)+960-335 = 837+960-335 = 1462 → fits with padding.
// Chat content right edge (x=1920): screen = 1.55*(1920-960)+960-335 = 1488+960-335 = 2113 → cropped.
// Chat center (x=1710): screen = 1.55*(1710-960)+960-335 = 1162.5+960-335 = 1787.5 — partially off.
// This won't show full chat. Need to center camera more on chat panel center.
// CORRECT APPROACH: just center on x=1350 (midpoint between article center 750 and chat center 1710):
// Want x=1350 at screen x=960:
// Tx = 960 - 1.55*(1350-960) - 960 = 960-604.5-960 = -604.5 ≈ -605
// Article text at x=400: screen = 1.55*(400-960)+960-605 = -868+960-605=-513 → cropped (article invisible).
// NEED to keep article visible. Use wide enough scale. Let's just match reference exactly.
// Reference: chat panel is on the RIGHT ~35% of frame, article on left ~55%, moderate zoom.
// At S=1.5: canvas x=0 (article left) → screen=-480; x=1500(chat left)→1.5*(1500-960)+960+Tx=810+960+Tx
// To put chat left at screen x=900: Tx = 900-810-960 = -870
// Article left at screen: 1.5*(0-960)+960-870 = -1440+960-870=-1350 → article barely off-screen left.
// That's too aggressive. Use S=1.4:
// Chat left (x=1500) at screen x=850: Tx=850-1.4*(1500-960)-960=850-756-960=-866
// Article left at screen: 1.4*(0-960)+960-866 = -1344+960-866=-1250 → still off left.
// We cannot show both article fully and chat fully without going to S~1.0.
// Reference DOES show article partially — left ~30% is black/cut, article starts at ~x=300 screen.
// That matches S=1.4-1.5 with center shifted right.
// Use S=1.55, center: want chat content center (x=1710) at screen x=1300 (right-center):
// Tx = 1300 - 1.55*(1710-960) - 960 = 1300 - 1162 - 960 = -822
// Article at x=300 (article body): screen = 1.55*(300-960)+960-822 = -1023+960-822 = -885 → off
// Article at x=600: screen = 1.55*(600-960)+960-822 = -558+960-822=-420 → off
// Article at x=900 (right side of article): screen = 1.55*(900-960)+960-822 = -93+960-822=45 → just visible
// This is the reference look: left part of article barely visible, chat takes center+right.
// For vertical: want canvas y=820 ("Would you like...") near screen y=700:
// Ty = 700 - 1.55*(820-540) - 540 = 700-434-540=-274
// FIX 4: Slightly more zoom than before. S=2.3 (was 2.0).
// At S=2.3: chat-panel left (x=1500)→screen fills right ~55%, article peeks on left.
// chat content center (x=1710) at screen x=1300:
//   Tx = 1300 - 2.3*(1710-960) - 960 = 1300 - 1725 - 960 = -1385
// "Would you like…" (y≈820) at screen y=610:
//   Ty = 610 - 2.3*(820-540) - 540 = 610 - 644 - 540 = -574
const S_FINAL   = 2.3;
const TX_FINAL = -1385;
const TY_FINAL = -574;

// AI response text — sized so Step 4 lands in the last 250-300px of the response.
// Total response target: ~650px rendered height in the 420px wide panel at 15px font.
const AI_RESPONSE_TEXT = `Sure! Here's a step-by-step guide to setting up Vercel Sandbox.

Step 1: Create a new project

Install the required packages:

  mkdir sandbox-test && cd sandbox-test
  pnpm i @vercel/sandbox ms

Step 2: Link your project to Vercel

From your sandbox-test directory:

  vercel link

This connects your local project to a new or existing Vercel project.

Step 3: Set up authentication

Pull your environment variables:

  vercel env pull

This creates a .env.local file with a VERCEL_OIDC_TOKEN for authentication.

Step 4: You're ready to go!

You can now start creating and running sandboxes. The SDK will automatically use the token from your .env.local file for authentication.`;

const RESPONSE_START    = 3500;
const RESPONSE_DURATION = 3800;  // matches trimmed response text (~560 chars)

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildResponseHtml(text: string): string {
  const lines = text.split('\n');
  let html = '';
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') {
      html += '<div style="height:8px"></div>';
    } else if (trimmed.startsWith('Step ') && trimmed.includes(':') && !line.startsWith('  ')) {
      // FIX E: bump step headers to 15px so they're readable at high zoom
      html += `<p style="margin:12px 0 5px;font-weight:700;color:white;font-size:15px;font-family:system-ui,sans-serif">${escapeHtml(trimmed)}</p>`;
    } else if (line.startsWith('  ')) {
      html += `<div style="font-family:'Courier New',monospace;font-size:12px;color:#e2e8f0;background:#0d0d0d;padding:4px 12px;border-left:2px solid #2a2a2a;margin:2px 0;white-space:nowrap">${escapeHtml(trimmed)}</div>`;
    } else if (trimmed.startsWith('Sure!')) {
      html += `<p style="margin:0 0 8px;font-size:15px;color:#cccccc;font-family:system-ui,sans-serif;line-height:1.6">${escapeHtml(trimmed)}</p>`;
    } else {
      // FIX E: bump body text to 15px — readable at 2.7× zoom
      html += `<p style="margin:0 0 5px;font-size:15px;color:#aaaaaa;font-family:system-ui,sans-serif;line-height:1.65">${escapeHtml(trimmed)}</p>`;
    }
  }
  return html;
}

export function Scene5_AIChatPanel() {
  const cameraRef              = useRef<HTMLDivElement>(null);
  const articleRef             = useRef<HTMLDivElement>(null);
  const aiPanelRef             = useRef<HTMLDivElement>(null);
  const inputSpanRef           = useRef<HTMLSpanElement>(null);
  const inputPlaceholderRef    = useRef<HTMLSpanElement>(null);
  const userBubbleRef          = useRef<HTMLDivElement>(null);
  const aiResponseContainerRef = useRef<HTMLDivElement>(null);
  const stopBtnRef             = useRef<HTMLDivElement>(null);
  const sendBtnRef             = useRef<HTMLDivElement>(null);
  const feedbackBtnsRef        = useRef<HTMLDivElement>(null);
  const thumbsUpRef            = useRef<HTMLDivElement>(null);
  const tuCursorRef            = useRef<HTMLDivElement>(null);
  const tuPulseRef             = useRef<HTMLDivElement>(null);
  const contextChipRef         = useRef<HTMLDivElement>(null);
  const chatBodyRef            = useRef<HTMLDivElement>(null);
  const innerChatRef           = useRef<HTMLDivElement>(null);
  const wouldYouLikeRef        = useRef<HTMLDivElement>(null);
  const lastAiCharsRef         = useRef(0);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {

    // ── PHASE 1: AI Panel slides in from right (0–1400ms) ──
    // Article stays fixed — do NOT push it left (that causes black void during zoom-in).
    const slideT = track(ms, 0, 1400, eases.outCubic);
    if (aiPanelRef.current) {
      aiPanelRef.current.style.transform = `translateX(${lerp(340, 0, slideT)}px)`;
    }

    // Context chip — visible during typing phase, collapses (height+opacity) after message sent
    if (contextChipRef.current) {
      if (ms >= 3000) {
        // Collapse completely: zero height, no padding, invisible
        contextChipRef.current.style.opacity = '0';
        contextChipRef.current.style.maxHeight = '0';
        contextChipRef.current.style.padding = '0';
        contextChipRef.current.style.overflow = 'hidden';
      } else {
        contextChipRef.current.style.opacity = ms >= 800 ? '1' : '0';
        contextChipRef.current.style.maxHeight = '100px';
        contextChipRef.current.style.padding = '9px 10px';
        contextChipRef.current.style.overflow = 'visible';
      }
    }

    // ── PHASE 2: Typing (1500–3000ms) ──
    if (inputSpanRef.current && ms >= 1500 && ms < 3200) {
      const typed = typewriter(ms, 1500, 1500, TYPED_MESSAGE);
      inputSpanRef.current.textContent = typed + (ms < 3000 ? '|' : '');
    }

    if (inputPlaceholderRef.current) {
      inputPlaceholderRef.current.style.display = ms >= 1500 ? 'none' : 'block';
    }

    // ── PHASE 3: Message sent (3000ms+) ──
    const messageSent = ms >= 3000;
    if (userBubbleRef.current) {
      userBubbleRef.current.style.opacity = messageSent ? '1' : '0';
    }
    if (inputSpanRef.current && ms >= 3000) {
      inputSpanRef.current.textContent = '';
    }
    if (inputPlaceholderRef.current && ms >= 3000) {
      inputPlaceholderRef.current.style.display = 'block';
      inputPlaceholderRef.current.textContent = 'Ask a question...';
      inputPlaceholderRef.current.style.color = '#444';
    }

    if (stopBtnRef.current) {
      stopBtnRef.current.style.display = ms >= 3000 && ms < 10000 ? 'flex' : 'none';
    }
    if (sendBtnRef.current) {
      sendBtnRef.current.style.display = ms < 3000 ? 'flex' : 'none';
    }

    // ── PHASE 4: AI response streaming ──
    if (aiResponseContainerRef.current && ms >= RESPONSE_START) {
      const progress = Math.min((ms - RESPONSE_START) / RESPONSE_DURATION, 1);
      const charCount = Math.floor(progress * AI_RESPONSE_TEXT.length);
      if (charCount !== lastAiCharsRef.current) {
        lastAiCharsRef.current = charCount;
        const visibleText = AI_RESPONSE_TEXT.slice(0, charCount);
        aiResponseContainerRef.current.innerHTML = buildResponseHtml(visibleText);
      }
      // Inner content is absolutely pinned to bottom of chat body — always shows latest content.
    }

    if (feedbackBtnsRef.current) {
      feedbackBtnsRef.current.style.opacity = ms >= 11000 ? '1' : '0';
    }

    // ── THUMBS-UP CLICK at the very end (user: "cursor clicks the thumbs up
    // button just at the end"). The orb is a child of the feedback row, so it is
    // always pixel-aligned with the 👍 button (centre ≈ (15,15) container-local).
    const TU_APPEAR = 12450;
    const TU_AT     = 13000;   // orb reaches the thumbs-up
    const TU_CLICK  = 13060;   // click fires
    if (tuCursorRef.current) {
      const TX = 15, TY = 15;
      let ox = TX + 48, oy = TY + 42;   // start: down-and-right of 👍
      let op = 0;
      if (ms >= TU_APPEAR && ms < TU_AT) {
        const t = track(ms, TU_APPEAR, TU_AT, eases.inOutCubic);
        ox = lerp(TX + 48, TX, t);
        oy = lerp(TY + 42, TY, t);
        op = track(ms, TU_APPEAR, TU_APPEAR + 220, eases.outCubic);
      } else if (ms >= TU_AT) {
        ox = TX; oy = TY; op = 1;
      }
      let cs = 1;
      if (ms >= TU_CLICK && ms < TU_CLICK + 160) {
        cs = lerp(0.8, 1, track(ms, TU_CLICK, TU_CLICK + 160, eases.outCubic));
      }
      tuCursorRef.current.style.left = `${ox - 10}px`;
      tuCursorRef.current.style.top = `${oy - 10}px`;
      tuCursorRef.current.style.opacity = String(op);
      tuCursorRef.current.style.transform = `scale(${cs})`;
    }
    if (tuPulseRef.current) {
      const t = track(ms, TU_CLICK, TU_CLICK + 340, eases.outCubic);
      const sc = lerp(1, 2.6, t);
      const op = ms >= TU_CLICK && ms < TU_CLICK + 340 ? (1 - t) : 0;
      tuPulseRef.current.style.transform = `translate(-50%, -50%) scale(${sc})`;
      tuPulseRef.current.style.opacity = String(op);
    }
    if (thumbsUpRef.current) {
      const clicked = ms >= TU_CLICK;
      const pop = ms >= TU_CLICK && ms < TU_CLICK + 200
        ? lerp(1.25, 1, track(ms, TU_CLICK, TU_CLICK + 200, eases.outCubic)) : 1;
      thumbsUpRef.current.style.transform = `scale(${pop})`;
      thumbsUpRef.current.style.background = clicked ? 'rgba(96,165,250,0.25)' : '#1a1a1a';
      thumbsUpRef.current.style.borderColor = clicked ? '#3b82f6' : '#2a2a2a';
    }

    // "Would you like..." suggestion — fades in when response complete (ms >= 7500)
    if (wouldYouLikeRef.current) {
      wouldYouLikeRef.current.style.opacity = ms >= 7500 ? '1' : '0';
    }

    // ── CAMERA SYSTEM ──
    let camScale: number;
    let camTx: number;
    let camTy: number;

    if (ms < ZOOM_IN_START) {
      // During slide-in: no zoom
      camScale = S_NORMAL;
      camTx = 0;
      camTy = 0;
    } else if (ms <= ZOOM_IN_END) {
      // FIX 8: zoom into chat panel (heading + input box visible)
      const t = track(ms, ZOOM_IN_START, ZOOM_IN_END, eases.inOutCubic);
      camScale = lerp(S_NORMAL, S_ZOOM_IN, t);
      camTx    = lerp(0, TX_ZOOM_IN, t);
      camTy    = lerp(0, TY_ZOOM_IN, t);
    } else if (ms <= ZOOM_IN_HOLD_END) {
      camScale = S_ZOOM_IN;
      camTx    = TX_ZOOM_IN;
      camTy    = TY_ZOOM_IN;
    } else if (ms <= ZOOM_OUT_END) {
      const t = track(ms, ZOOM_OUT_START, ZOOM_OUT_END, eases.inOutCubic);
      camScale = lerp(S_ZOOM_IN, S_WIDE, t);
      camTx    = lerp(TX_ZOOM_IN, TX_WIDE, t);
      camTy    = lerp(TY_ZOOM_IN, TY_WIDE, t);
    } else if (ms <= HOLD_WIDE_END) {
      camScale = S_WIDE;
      camTx    = TX_WIDE;
      camTy    = TY_WIDE;
    } else if (ms <= ZOOM_MED_END) {
      const t = track(ms, HOLD_WIDE_END, ZOOM_MED_END, eases.inOutCubic);
      camScale = lerp(S_WIDE, S_MED, t);
      camTx    = lerp(TX_WIDE, TX_MED, t);
      camTy    = lerp(TY_WIDE, TY_MED, t);
    } else if (ms <= HOLD_MED_END) {
      camScale = S_MED;
      camTx    = TX_MED;
      camTy    = TY_MED;
    } else if (ms <= ZOOM_FINAL_END) {
      // FIX 9: drift to final framing (article left + chat bottom)
      const t = track(ms, HOLD_MED_END, ZOOM_FINAL_END, eases.inOutCubic);
      camScale = lerp(S_MED, S_FINAL, t);
      camTx    = lerp(TX_MED, TX_FINAL, t);
      camTy    = lerp(TY_MED, TY_FINAL, t);
    } else {
      // FIX 9: hold final
      camScale = S_FINAL;
      camTx    = TX_FINAL;
      camTy    = TY_FINAL;
    }

    if (cameraRef.current) {
      cameraRef.current.style.transformOrigin = '50% 50%';
      cameraRef.current.style.transform = `translate(${camTx}px, ${camTy}px) scale(${camScale})`;
    }
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration={`${DURATION}ms`}
      onFrame={onFrame as any}
      style={{ position: 'absolute', inset: 0, background: '#141414' }}
    >
      <TraceLayer sceneStartMs={SCENE_START} enabled={TRACE_MODE} opacity={TRACE_OPACITY} />

      {/* Camera rig */}
      <div
        ref={cameraRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          willChange: 'transform',
        }}
      >
        {/* Full browser window — FIX A: fills full canvas */}
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
          {/* Nav bar */}
          <div style={{
            height: 46,
            background: '#0a0a0a',
            borderBottom: '1px solid #1e1e1e',
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            gap: 22,
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <svg viewBox="0 0 24 24" style={{ width: 15, height: 15 }} fill="white">
                <path d="M12 2L2 19.5H22L12 2Z"/>
              </svg>
              <span style={{ color: 'white', fontSize: 12, fontWeight: 600, fontFamily: 'system-ui' }}>Vercel</span>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              {['Products ▾', 'Resources ▾', 'Solutions ▾', 'Enterprise', 'Docs', 'Pricing'].map((item, i) => (
                <span key={i} style={{
                  color: i === 1 ? 'white' : '#555',
                  fontSize: 11, fontFamily: 'system-ui',
                  ...(i === 1 ? { background: '#1a1a1a', padding: '2px 7px', borderRadius: 4, border: '1px solid #2a2a2a' } : {}),
                }}>{item}</span>
              ))}
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '3px 8px', background: '#0f0f0f', border: '1px solid #222', borderRadius: 4,
                color: '#444', fontSize: 10, fontFamily: 'system-ui',
              }}>
                <span>Search Knowledge Base</span>
                <span style={{ border: '1px solid #2a2a2a', padding: '0 3px', borderRadius: 2 }}>⌘K</span>
              </div>
              <div style={{ padding: '3px 9px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 4, color: 'white', fontSize: 11, fontFamily: 'system-ui' }}>Ask AI</div>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#2a2a2a' }} />
            </div>
          </div>

          {/* Content: article LEFT + AI panel RIGHT */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

            {/* Article column */}
            <div
              ref={articleRef}
              style={{ flex: 1, overflow: 'hidden', position: 'relative' }}
            >
              <div style={{ position: 'absolute', top: 0, left: '33%', width: 1, height: '100%', background: '#161616', zIndex: 0 }} />
              <div style={{ position: 'absolute', top: 0, left: '66%', width: 1, height: '100%', background: '#161616', zIndex: 0 }} />

              <div style={{ padding: '24px', position: 'relative', zIndex: 1 }}>
                <div style={{ color: '#444', fontSize: 11, fontFamily: 'system-ui', marginBottom: 16, display: 'flex', gap: 6 }}>
                  <span>←</span><span>Knowledge Base</span><span>/</span><span style={{ color: '#666' }}>AI</span>
                </div>
                <h1 style={{
                  fontSize: 34, fontWeight: 700, color: 'white', fontFamily: 'system-ui',
                  letterSpacing: '-0.8px', lineHeight: 1.2, textAlign: 'center',
                  margin: '0 0 14px', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto',
                }}>
                  How to safely run AI generated<br />code in your application
                </h1>
                <p style={{ fontSize: 12, color: '#777', fontFamily: 'system-ui', textAlign: 'center', margin: '0 0 14px', maxWidth: 460, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
                  Execute untrusted, AI-generated code inside an isolated, ephemeral environment and return real results.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'center', marginBottom: 14 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg,#667eea,#764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'white', fontWeight: 700 }}>D</div>
                  <span style={{ color: '#555', fontSize: 11, fontFamily: 'system-ui' }}>Delba de Oliveira</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1a1a1a', paddingBottom: 14, marginBottom: 20 }}>
                  <span style={{ color: '#444', fontSize: 10, fontFamily: 'system-ui' }}>⏱ 5 min read  |  ⎘ Copy page  |  💬 Ask AI about this page</span>
                  <span style={{ color: '#333', fontSize: 10, fontFamily: 'system-ui' }}>Last updated November 26, 2025</span>
                </div>
                {/* Article body — enough content to fill left column for FIX 9 */}
                <div style={{ color: '#888', fontSize: 12, fontFamily: 'system-ui', lineHeight: 1.7 }}>
                  <p style={{ margin: '0 0 12px' }}>AI models are increasingly used to generate code. Often, applications return this code to the user as plain text. But some apps could run the generated code to produce UI or other results.</p>
                  <p style={{ margin: '0 0 12px' }}>This creates powerful possibilities but introduces risk. Generated code is untrusted. It may delete files, leak sensitive data, or consume excessive resources.</p>
                  <p style={{ margin: '0 0 18px' }}>Vercel Sandbox addresses this by running untrusted code in a remote, isolated environment with strong safeguards and full control.</p>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: 'white', margin: '0 0 8px' }}>TL;DR</h2>
                  <p style={{ margin: '0 0 7px' }}>In this guide, you'll learn:</p>
                  <ul style={{ margin: '0 0 16px', paddingLeft: 16 }}>
                    <li style={{ marginBottom: 4 }}>What Vercel Sandbox is and how it works.</li>
                    <li style={{ marginBottom: 4 }}>How to create a sandbox, run commands, and capture results.</li>
                    <li>Example: Use an AI SDK Agent to generate and safely execute code inside a sandbox.</li>
                  </ul>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: 'white', margin: '0 0 8px' }}>How does Vercel Sandbox work?</h2>
                  <p style={{ margin: '0 0 12px' }}>Vercel Sandbox is an <strong style={{ color: 'white' }}>ephemeral compute primitive</strong> designed for untrusted workloads.</p>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: 'white', margin: '0 0 8px' }}>Getting started</h2>
                  <p style={{ margin: '0 0 12px' }}>Start by creating your project and installing the required packages. This creates a <code style={{ background: '#1a1a1a', padding: '1px 4px', borderRadius: 3, fontSize: 11, color: '#e2e8f0' }}>.env.local</code> file.</p>
                  <p style={{ margin: '0 0 12px' }}>This creates a <code style={{ background: '#1a1a1a', padding: '1px 4px', borderRadius: 3, fontSize: 11, color: '#e2e8f0' }}>.env.local</code> file with a <code style={{ background: '#1a1a1a', padding: '1px 4px', borderRadius: 3, fontSize: 11, color: '#e2e8f0' }}>VERCEL_OIDC_TOKEN</code> that the Sandbox SDK will use to authenticate. In development, this token expires after 12 hours, so you'll need to run <code style={{ background: '#1a1a1a', padding: '1px 4px', borderRadius: 3, fontSize: 11, color: '#e2e8f0' }}>vercel env pull</code> again if you're working over extended periods.</p>
                  <p style={{ margin: '0 0 12px', color: '#bbb' }}>Step 4: You're ready to go!</p>
                  <p style={{ margin: '0 0 12px' }}>You can now start creating and running sandboxes. The SDK will automatically use the token from your <code style={{ background: '#1a1a1a', padding: '1px 4px', borderRadius: 3, fontSize: 11, color: '#e2e8f0' }}>.env.local</code> file for authentication.</p>
                </div>
              </div>
            </div>

            {/* AI Chat Panel — FIX E: widened from 340→420 for readability at high zoom */}
            <div
              ref={aiPanelRef}
              style={{
                width: 420,
                flexShrink: 0,
                background: '#070707',
                borderLeft: '1px solid #1e1e1e',
                display: 'flex',
                flexDirection: 'column',
                transform: 'translateX(600px)',
                overflow: 'hidden',
              }}
            >
              {/* Panel header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px', borderBottom: '1px solid #1e1e1e', flexShrink: 0,
              }}>
                <span style={{ color: 'white', fontSize: 13, fontWeight: 600, fontFamily: 'system-ui' }}>Ask AI</span>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['⧉', '⊗', '≫'].map((icon, i) => (
                    <span key={i} style={{ color: '#444', fontSize: 13 }}>{icon}</span>
                  ))}
                </div>
              </div>

              {/* Chat body — clipped container, content translated UP via onFrame transform */}
              <div
                ref={chatBodyRef}
                style={{
                  flex: 1,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* Inner content wrapper — pinned to BOTTOM of chat body via absolute positioning.
                    Content grows upward so the latest message is always at the bottom. */}
                <div
                  ref={innerChatRef}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                {/* Context chip — stays at TOP of chat body so it's in canvas y≈82+12=94.
                    Hidden/collapsed after message sent (3000ms). */}
                <div
                  ref={contextChipRef}
                  style={{
                    background: '#111', border: '1px solid #222', borderRadius: 7,
                    padding: '9px 10px', display: 'flex', gap: 8, alignItems: 'flex-start',
                    opacity: 0, transition: 'opacity 0.3s', flexShrink: 0,
                  }}
                >
                  <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, flexShrink: 0, marginTop: 1 }} fill="none" stroke="#666" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <div>
                    <div style={{ color: 'white', fontSize: 13, fontFamily: 'system-ui', lineHeight: 1.3 }}>
                      How to safely run AI generated code in yo...
                    </div>
                    <div style={{ color: '#555', fontSize: 11, fontFamily: 'system-ui', marginTop: 2 }}>
                      https://vercel.com/kb/guide/running-ai-generate...
                    </div>
                  </div>
                </div>

                {/* User bubble */}
                <div
                  ref={userBubbleRef}
                  style={{
                    alignSelf: 'flex-end',
                    background: '#1a1a1a', border: '1px solid #2a2a2a',
                    borderRadius: '10px 10px 2px 10px',
                    padding: '9px 14px',
                    color: 'white', fontSize: 14, fontFamily: 'system-ui',
                    maxWidth: '90%', opacity: 0, transition: 'opacity 0.2s', flexShrink: 0,
                  }}
                >
                  walk me through setting up sandbox
                </div>

                {/* AI response */}
                <div
                  ref={aiResponseContainerRef}
                  style={{ fontSize: 15, fontFamily: 'system-ui', lineHeight: 1.65, flexShrink: 0 }}
                />

                {/* Feedback buttons */}
                <div
                  ref={feedbackBtnsRef}
                  style={{ display: 'flex', gap: 6, opacity: 0, transition: 'opacity 0.3s', flexShrink: 0, position: 'relative' }}
                >
                  {['👍', '👎', '⎘'].map((icon, i) => (
                    <div key={i}
                      ref={i === 0 ? thumbsUpRef : undefined}
                      style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: '#1a1a1a', border: '1px solid #2a2a2a',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
                        transition: 'background 0.15s, border-color 0.15s',
                      }}>{icon}</div>
                  ))}

                  {/* Thumbs-up click pulse ring */}
                  <div ref={tuPulseRef} style={{
                    position: 'absolute', left: 15, top: 15,
                    width: 26, height: 26, borderRadius: '50%',
                    border: '2px solid rgba(96,165,250,0.75)',
                    opacity: 0, pointerEvents: 'none',
                    transform: 'translate(-50%, -50%)', zIndex: 9,
                  }} />
                  {/* Orb cursor — clicks the 👍 at the very end */}
                  <div ref={tuCursorRef} style={{
                    position: 'absolute', left: 5, top: 5,
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'rgba(200,200,200,0.9)',
                    border: '2px solid rgba(255,255,255,0.6)',
                    boxShadow: '0 0 10px rgba(255,255,255,0.3)',
                    opacity: 0, pointerEvents: 'none', zIndex: 10,
                    willChange: 'transform, opacity',
                  }} />
                </div>
                </div> {/* close innerChatRef */}
              </div> {/* close chatBodyRef */}

              {/* "Would you like..." suggestion — always visible (outside scroll), fades in when response complete */}
              <div
                ref={wouldYouLikeRef}
                style={{
                  borderTop: '1px solid #1a1a1a',
                  padding: '10px 14px',
                  color: '#888888',
                  fontSize: 14,
                  fontFamily: 'system-ui',
                  lineHeight: 1.6,
                  flexShrink: 0,
                  opacity: 0,
                  transition: 'opacity 0.4s',
                }}
              >
                Would you like help with a specific use case, such as running an AI-generated code example or setting up a sandbox with a particular runtime?
              </div>

              {/* Input area */}
              <div style={{ borderTop: '1px solid #1e1e1e', padding: '10px', flexShrink: 0 }}>
                <div style={{
                  background: '#0f0f0f', border: '1px solid #222', borderRadius: 8,
                  padding: '12px 14px',
                  display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                  minHeight: 60, gap: 6, position: 'relative',
                }}>
                  <div style={{ flex: 1, position: 'relative', minHeight: 22 }}>
                    <span
                      ref={inputPlaceholderRef}
                      style={{
                        color: '#444', fontSize: 14, fontFamily: 'system-ui',
                        display: 'block', position: 'absolute', top: 0, left: 0, pointerEvents: 'none',
                      }}
                    >
                      Ask a question...
                    </span>
                    <span
                      ref={inputSpanRef}
                      style={{
                        color: 'white', fontSize: 14, fontFamily: 'system-ui',
                        lineHeight: 1.5, display: 'block', position: 'relative', zIndex: 1,
                      }}
                    />
                  </div>

                  {/* Send button */}
                  <div
                    ref={sendBtnRef}
                    style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: '#1a1a1a', border: '1px solid #2a2a2a',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >
                    <svg viewBox="0 0 24 24" style={{ width: 14, height: 14 }} fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M12 19V5M5 12L12 5L19 12"/>
                    </svg>
                  </div>

                  {/* Stop button */}
                  <div
                    ref={stopBtnRef}
                    style={{
                      display: 'none', alignItems: 'center', gap: 6,
                      padding: '7px 12px', borderRadius: 6,
                      background: '#1a1a1a', border: '1px solid #2a2a2a',
                      color: '#777', fontSize: 12, fontFamily: 'system-ui', flexShrink: 0,
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: 1, background: '#777' }} />
                    <span>Stop</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Ask-AI prompt typewriter keystrokes (PHASE 2 typing starts at 1500ms local) */}
      <Audio src="/assets/sfx/keyboard.wav" offset="1500ms" duration="1.5s" volume={0.7} />
      {/* Thumbs-up click (TU_CLICK = 13060ms local, see onFrame above) */}
      <Audio src="/assets/sfx/click.mp3" offset="13060ms" sourceIn="0.6s" duration="0.3s" volume={1} />
    </Timegroup>
  );
}
