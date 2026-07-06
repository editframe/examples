/**
 * Scene5_ResponseAndScroll — 4500ms
 * Master timeline: 17000ms → 21500ms
 *
 * FIX 8: Initial zoom 2.2× (was 2.05), shows user message + "Responding..." indicator + Claude header.
 * FIX 9: At 2000ms (≈19s master), additional zoom to 2.6×. Highlighter in #EBBCAB line-by-line.
 * FIX 10: End scroll position shows "Start here: Acme_brief.docx" clearly above Reply input.
 *          Highlighter color: rgba(235,188,171,0.40) per #EBBCAB at 40% opacity.
 */
import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { CreamBackdrop } from "../components/CreamBackdrop";
import { track, lerp, clamp } from "../components/helpers";
import { eases } from "animejs";

// FIX 7: Extended duration to accommodate slow pan + hold final frame
// Timeline: ~2250ms slow scroll + 1000ms hold = need extra ~2450ms beyond old end
// Scene1(5000) + Scene2(3000) + Scene3(6500) + Scene4(3000) = 17500 start
const DURATION_MS = 8500;

// Layout mirrors Scene3
const OUTLOOK_CONTENT_W = 1200;
// #9/#11: Claude panel THINNER (matches Scene3 = 440). Narrower panel also wraps
// the response into MORE lines → taller content → reads as the long response it is.
const CLAUDE_PANEL_W = 440;
const WIN_LEFT = 60;
const WIN_TOP  = 70;
const WIN_W    = OUTLOOK_CONTENT_W + CLAUDE_PANEL_W; // 1700
const WIN_H    = 940;
const HEADER_H = 84;

const CLAUDE_ABS_LEFT = WIN_LEFT + OUTLOOK_CONTENT_W; // 1260

// Camera: zoom in on the Claude panel reading area; the RESPONSE scrolls within
// the panel via translateY. The camera focal sits on the reading line during
// generation + the highlight HOLD, then pans DOWN at the very end to frame the
// last lines ("Start here: Acme_brief.docx") + the Reply box.
const FOCAL_LX       = CLAUDE_ABS_LEFT + CLAUDE_PANEL_W * 0.50; // 1480
const FOCAL_LY_READ  = WIN_TOP + 470;  // reading line — highlight hold framing
const FOCAL_LY_END   = WIN_TOP + 700;  // lower panel — end framing (Start here + Reply)

// #13: "needs to be MORE zoomed in on a text". 2.5 → 2.95.
const ZOOM_SCALE_START = 2.5;
const ZOOM_SCALE_END   = 2.95;

// Timeline (DURATION 8500ms). Generation → scroll-to-highlight → HOLD+highlight
// → slow full pan-down → hold final frame.
// FIX 7: Slow bottom pan ~2250ms + 1000ms hold on final frame.
const FADE_IN_START = 0;
const FADE_IN_END   = 500;
const RESPOND_START = 300;
const RESPOND_DUR   = 1400;   // fast generation (like code) — done ~1700ms
const ZOOM_IN_START = 250;    // zoom 2.5→2.95
const ZOOM_IN_END   = 1700;
// ROUND-7 FIX (comment #4): faster pre-highlight scroll — shorter window + fast
// front-loaded ease so a lot of output races by ("so much text"), settling on target.
const SCROLL_TO_HL_START = 1750;
const SCROLL_TO_HL_END   = 2550;
const HL_START      = 2820;   // highlighter begins after scroll settles on target
const HL_LINE_DUR   = 150;    // fast marker swipe per line, L→R, top→bottom
// FIX 7: Slow pan — 2250ms gentle scroll + 1000ms hold = ends at 7500ms of 8500ms
const SCROLL_BOTTOM_START = 4450;  // HOLD on highlighted paragraph until here
const SCROLL_BOTTOM_END   = 6700;  // FIX 7: was 5250 → 6700 (2250ms slow pan)
// HOLD_END = SCROLL_BOTTOM_END + 1000ms hold = 7700ms (within 8500ms duration)
const ASTERISK_IN   = 1500;

// FIX 7: Full response paragraphs — more paragraphs for visible scroll depth
const RESPONSE_PARAGRAPHS = [
  "Here's what needs your attention today:",
  "",
  "Priority — Anita Acharya's itinerary update (CLE Thu 4/30). Confirm the 6:05a out of LGA so Dan has the prep block; if it slips, you lose the Whitman IC window. She's held two return flights for you — choose by Wednesday noon.",
  "",
  "Urgent — Stephanie K. asked for your read on the Q1 letter by tomorrow. Two unresolved redemptions are in the LP exchange thread; flag them with Marcus before EOD or the IC presentation goes forward with open items.",
  "",
  "Deadline risk — three taxi receipts still uncoded against the corporate card that closed Friday. Finance will bounce them if they roll into May, so flag them in ExpenseHub when you get a minute. Also queue them as cards in the tracker.",
  "",
  "Top — Acme value-creation brief, SteerCo Thursday — Dan forwarded Marcus's brief; client SteerCo Thursday 8:30am ET in Cleveland. Draft POV, model, and deck due EOD Tuesday so Dan can stress-test before it goes back. Materials to Acme by Wednesday 6pm. The ask is a one-page recommendation across the four options (Operational Reset / Water / Aftermarket / Transformational M&A), a value-creation model with conservative-base-stretch cases, and the SteerCo deck.",
  "",
  "Industrials Research Flow-control — Tom O. queued the benchmarking analysis for the Friday research drop. The peer set needs your sign-off before the team builds the comparable multiples table. Deadline is Thursday COB.",
  "",
  "Doug R. flagged a redemption question on the Whitman diligence track that needs a quick read. He's waiting on your note to unblock the LP exchange side of the IC pack.",
  "",
  "Austin F. (3 unread) — CRLN level-3 mark and Ashby side letters are circulating. No immediate action but worth a scan before Friday's research drop given the peer-set overlap.",
  "",
  "Archive — the CRLX/Hartwell newswire alert and the resolved tie-out chatter between other pairs. Both are informational; no action required.",
  "",
  "Acme has the most pressing deadline across all of these threads. Everything else cascades off whether the SteerCo deck lands on time.",
  "",
  "Start here: Acme_brief.docx",
];
const FULL_TEXT = RESPONSE_PARAGRAPHS.join("\n");

function CoralAsteriskIcon({ size }: { size: number }) {
  const SPOKES = 14;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.48;
  const innerR = size * 0.12;
  const strokeW = Math.max(1.2, size * 0.085);
  const lines: React.ReactNode[] = [];
  for (let i = 0; i < SPOKES; i++) {
    const angle = (i * Math.PI * 2) / SPOKES - Math.PI / 2;
    lines.push(
      <line
        key={i}
        x1={cx + Math.cos(angle) * innerR}
        y1={cy + Math.sin(angle) * innerR}
        x2={cx + Math.cos(angle) * outerR}
        y2={cy + Math.sin(angle) * outerR}
        stroke="#D97757"
        strokeWidth={strokeW}
        strokeLinecap="round"
      />
    );
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={size * 0.10} fill="#D97757" />
      {lines}
    </svg>
  );
}

export function Scene5_ResponseAndScroll() {
  const rigRef            = useRef<HTMLDivElement>(null);
  const sceneWrapRef      = useRef<HTMLDivElement>(null);
  const msgAreaRef        = useRef<HTMLDivElement>(null);
  const msgContentRef     = useRef<HTMLDivElement>(null); // inner content div — scrolled via translateY
  const asteriskCanvasRef = useRef<HTMLCanvasElement>(null);
  const hlContainerRef    = useRef<HTMLDivElement>(null);
  const respondingRowRef  = useRef<HTMLDivElement>(null);
  // Track highlight line positions — FIX 6: now includes per-line real width + left offset
  const hlLinesRef        = useRef<{ top: number; height: number; left: number; width: number }[]>([]);
  const hlMeasuredRef     = useRef(false);
  // Track the max translateY we've measured (grows as content grows)
  const maxScrollRef      = useRef(0);
  // Scroll position that brings the highlight target paragraph into view (hold)
  const hlTargetScrollRef = useRef(0);
  const targetMeasuredRef = useRef(false);

  const drawAsterisk = useCallback((
    canvas: HTMLCanvasElement,
    rotDeg: number,
    bloomP: number,
    opacity: number
  ) => {
    const size = 32;
    const dpr = 2;
    const s = size * dpr;
    canvas.width = s;
    canvas.height = s;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, s, s);
    if (opacity < 0.01) return;

    const cx = s / 2;
    const cy = s / 2;
    const SPOKES = 8;
    const spokeLen = (s / 2) * bloomP * 0.80;
    const strokeW = Math.max(4, s * 0.095);
    const color = "#D97757";

    ctx.globalAlpha = opacity;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((rotDeg * Math.PI) / 180);
    ctx.translate(-cx, -cy);

    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.11, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.strokeStyle = color;
    ctx.lineWidth = strokeW;
    ctx.lineCap = "round";
    for (let i = 0; i < SPOKES; i++) {
      const angle = (i * Math.PI * 2) / SPOKES;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * spokeLen, cy + Math.sin(angle) * spokeLen);
      ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }, []);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    // Scene fade in
    const fadeInP = track(ms, FADE_IN_START, FADE_IN_END, eases.outQuart);
    if (sceneWrapRef.current) {
      sceneWrapRef.current.style.opacity = String(fadeInP);
    }

    // Camera: zoom 2.5→2.95 early, focal on the reading line; pan focal DOWN only
    // during the final bottom-scroll so we end framing "Start here" + Reply.
    if (rigRef.current) {
      const zoomP = track(ms, ZOOM_IN_START, ZOOM_IN_END, eases.inOutCubic);
      const scale = lerp(ZOOM_SCALE_START, ZOOM_SCALE_END, zoomP);
      const panP  = track(ms, SCROLL_BOTTOM_START, SCROLL_BOTTOM_END, eases.inOutCubic);
      const focalLY = lerp(FOCAL_LY_READ, FOCAL_LY_END, panP);
      const microTx = Math.sin(ms / 6000) * 3;
      const originX = (FOCAL_LX / 1920) * 100;
      const originY = (focalLY / 1080) * 100;
      const tx = 960 - FOCAL_LX;
      const ty = 540 - focalLY;
      rigRef.current.style.transformOrigin = `${originX}% ${originY}%`;
      rigRef.current.style.transform = `translate3d(${tx + microTx}px, ${ty}px, 0) scale(${scale})`;
    }

    // FIX 8: "Responding..." indicator fades in at start, hides when response streams
    if (respondingRowRef.current) {
      const respondP = track(ms, 0, 400, eases.outQuart);
      // Hide by 900ms — response well underway by then
      const hideP = track(ms, 700, 1000, eases.inCubic);
      respondingRowRef.current.style.opacity = String(clamp(respondP * (1 - hideP)));
    }

    // Initialize inner content structure on first frame (imperative inject)
    if (msgAreaRef.current && !msgContentRef.current) {
      const contentDiv = document.createElement("div");
      contentDiv.style.position = "absolute";
      contentDiv.style.top = "0";
      contentDiv.style.left = "0";
      contentDiv.style.right = "0";
      contentDiv.style.padding = "0 16px 12px 40px";
      contentDiv.style.willChange = "transform";
      contentDiv.style.zIndex = "2";

      const hlDiv = document.createElement("div");
      hlDiv.style.position = "absolute";
      hlDiv.style.top = "0";
      hlDiv.style.left = "40px";
      hlDiv.style.right = "16px";
      hlDiv.style.pointerEvents = "none";
      hlDiv.style.zIndex = "0";
      hlDiv.style.overflow = "visible";
      contentDiv.appendChild(hlDiv);

      msgAreaRef.current.appendChild(contentDiv);
      (msgContentRef as React.MutableRefObject<HTMLDivElement>).current = contentDiv;
      (hlContainerRef as React.MutableRefObject<HTMLDivElement>).current = hlDiv;
    }

    // Response text + scroll
    if (msgAreaRef.current) {
      const typeP = track(ms, RESPOND_START, RESPOND_START + RESPOND_DUR, eases.linear);
      const charCount = Math.floor(typeP * FULL_TEXT.length);
      const visibleText = FULL_TEXT.slice(0, charCount);

      // Only rebuild DOM if text has changed (charCount changed)
      // After full generation (charCount === FULL_TEXT.length), stop rebuilding
      const isFullyGenerated = charCount >= FULL_TEXT.length;
      const shouldRebuild = !isFullyGenerated ||
        (msgAreaRef.current.getAttribute("data-full") !== "true");

      if (shouldRebuild) {
        if (isFullyGenerated) {
          msgAreaRef.current.setAttribute("data-full", "true");
        }
        // DO NOT clear msgAreaRef.innerHTML — it contains the injected contentDiv.
        // Instead clear only the contentDiv's text children.
        hlMeasuredRef.current = false;
      }

      const paragraphs = visibleText.split("\n");

      if (shouldRebuild && msgContentRef.current) {
        // Clear ONLY the content div's text paragraph children.
        // Keep the hlDiv (first child) intact.
        const hlDivChild = hlContainerRef.current;
        msgContentRef.current.innerHTML = "";
        // Re-attach hlDiv after clear
        if (hlDivChild) {
          msgContentRef.current.appendChild(hlDivChild);
        }
        paragraphs.forEach((para) => {
          if (para === "") {
            const spacer = document.createElement("div");
            spacer.style.height = "10px";
            msgContentRef.current!.appendChild(spacer);
            return;
          }
          const div = document.createElement("div");
          div.style.marginBottom = "0";
          div.style.lineHeight = "1.55";
          div.style.fontSize = "14px";
          div.style.color = "#1A1A1A";
          div.style.fontFamily = "system-ui, -apple-system, sans-serif";
          div.style.position = "relative";

          if (para.startsWith("Start here: Acme_brief.docx")) {
            div.innerHTML = 'Start here: <span style="background:#F0EEEB;border:1px solid rgba(0,0,0,0.1);padding:1px 6px;border-radius:4px;font-family:\'Menlo\',\'Monaco\',monospace;font-size:13px;color:#1A1A1A;">Acme_brief.docx</span>';
          } else if (
            para.startsWith("Priority") ||
            para.startsWith("Urgent") ||
            para.startsWith("Deadline") ||
            para.startsWith("Top") ||
            para.startsWith("Industrials") ||
            para.startsWith("Archive")
          ) {
            const dashIdx = para.indexOf(" —");
            if (dashIdx > -1) {
              if (para.startsWith("Top —")) {
                // Split at the target sentence so we can tag it precisely for the highlighter.
                // Target sentence starts at "The ask is a one-page recommendation..."
                const TARGET_SENTENCE = "The ask is a one-page recommendation";
                const splitIdx = para.indexOf(TARGET_SENTENCE);
                if (splitIdx > -1) {
                  const before = para.slice(0, splitIdx);
                  const target = para.slice(splitIdx); // "The ask is... and the SteerCo deck."
                  // before = "Top — Acme value-creation brief...Dan has the prep..."
                  const beforeDash = para.slice(0, dashIdx);
                  const afterDash = para.slice(dashIdx, splitIdx);
                  div.innerHTML =
                    `<strong>${beforeDash}</strong>${afterDash}` +
                    `<span data-hl-span="true">${target}</span>`;
                } else {
                  div.innerHTML = `<strong>${para.slice(0, dashIdx)}</strong>${para.slice(dashIdx)}`;
                }
              } else {
                div.innerHTML = `<strong>${para.slice(0, dashIdx)}</strong>${para.slice(dashIdx)}`;
              }
            } else {
              div.textContent = para;
            }
          } else if (para.startsWith("Here's")) {
            div.style.fontWeight = "600";
            div.style.marginBottom = "4px";
            div.textContent = para;
          } else {
            div.textContent = para;
          }

          // Tag the "Top" paragraph div for scroll-to measurement only
          if (para.startsWith("Top —")) {
            div.setAttribute("data-hl-target", "true");
          }

          msgContentRef.current!.appendChild(div);
        });
      } // end if (shouldRebuild)

      // Staged scroll via translateY on inner content div:
      //   1) hold at top during generation
      //   2) scroll DOWN to the highlight-target paragraph and HOLD (highlighter draws)
      //   3) scroll the rest of the way to the BOTTOM (last line + Reply visible)
      if (msgContentRef.current && msgAreaRef.current) {
        const contentH = msgContentRef.current.scrollHeight || msgContentRef.current.offsetHeight;
        const containerH = msgAreaRef.current.clientHeight || 486;
        const rawMaxScroll = Math.max(0, contentH - containerH);
        if (rawMaxScroll > maxScrollRef.current) {
          maxScrollRef.current = rawMaxScroll;
        }
        const maxSc = maxScrollRef.current;

        // Once the full response is generated, measure the scroll target.
        // ROUND-7 FIX (comment #4): scroll to the target SENTENCE (deeper into the
        // response) rather than the paragraph top — this travels FURTHER through the
        // output (covers more area, reads as "so much text") and frames the sentence
        // ~15% from the panel top so its full multi-line highlight is visible.
        if (!targetMeasuredRef.current && charCount >= FULL_TEXT.length) {
          const measureTop = (node: HTMLElement | null): number | null => {
            if (!node) return null;
            let pt = 0;
            let el: HTMLElement | null = node;
            while (el && el !== msgContentRef.current) {
              pt += el.offsetTop;
              el = el.offsetParent as HTMLElement | null;
            }
            return pt;
          };
          const span = msgContentRef.current.querySelector('[data-hl-span="true"]') as HTMLElement | null;
          const para = msgContentRef.current.querySelector('[data-hl-target="true"]') as HTMLElement | null;
          const spanTop = measureTop(span);
          const paraTop = measureTop(para);
          if (spanTop !== null) {
            hlTargetScrollRef.current = clamp(spanTop - containerH * 0.15, 0, maxSc);
            targetMeasuredRef.current = true;
          } else if (paraTop !== null) {
            hlTargetScrollRef.current = clamp(paraTop - containerH * 0.12, 0, maxSc);
            targetMeasuredRef.current = true;
          }
        }
        const tgt = hlTargetScrollRef.current;

        let scrollY = 0;
        if (ms < SCROLL_TO_HL_START) {
          scrollY = 0;
        } else if (ms < SCROLL_TO_HL_END) {
          // outQuart = fast, decisive downward scroll (front-loaded) → covers area quickly
          scrollY = lerp(0, tgt, track(ms, SCROLL_TO_HL_START, SCROLL_TO_HL_END, eases.outQuart));
        } else if (ms < SCROLL_BOTTOM_START) {
          scrollY = tgt; // HOLD — highlighter draws over the target paragraph
        } else {
          scrollY = lerp(tgt, maxSc, track(ms, SCROLL_BOTTOM_START, SCROLL_BOTTOM_END, eases.inOutCubic));
        }
        msgContentRef.current.style.transform = `translateY(${-scrollY}px)`;
      }
    }

    // FIX 6: Highlighter animation — line-by-line, L→R, ends exactly at "deck."
    // Uses fixed LINE_H for reliable cross-env positioning. The LAST line's width is
    // capped at a measured fraction of the container width using Range.getClientRects()
    // when available; falls back to a pre-computed character-count estimate.
    // Highlight fades out before the bottom scroll begins.
    const HL_FADE_START = SCROLL_BOTTOM_START - 300;
    const HL_FADE_END   = SCROLL_BOTTOM_START + 200;
    const hlFadeOut = track(ms, HL_FADE_START, HL_FADE_END, eases.inCubic);
    const hlVisible = hlFadeOut < 1.0;

    if (ms >= HL_START && hlVisible && hlContainerRef.current && msgContentRef.current) {
      if (!hlMeasuredRef.current) {
        // ROUND-7 FIX (comment #4): the old manual estimate applied the span's
        // mid-line start X to EVERY wrapped line and guessed wrapping with a fixed
        // LINE_H — producing offset, partial, janky bars. Instead, read the REAL
        // rendered line boxes of the target sentence via Range.getClientRects().
        // This yields one rect per visual line, with line 1 correctly starting
        // mid-line (after "...Wednesday 6pm.") and the last line ending at "deck.".
        const hlSpan = msgContentRef.current.querySelector('[data-hl-span="true"]') as HTMLElement | null;
        const hostEl = hlContainerRef.current;
        if (hlSpan && hostEl) {
          // The camera rig scale is CONSTANT (= ZOOM_SCALE_END) throughout the
          // highlight beat, so getClientRects() (scaled viewport px) → rig-local px
          // by dividing by it. The host & range share all ancestor transforms
          // (rig scale + scroll translateY + micro-wobble), so (rect - host) cancels them.
          const HL_SCALE = ZOOM_SCALE_END;
          const hostRect = hostEl.getBoundingClientRect();
          const range = document.createRange();
          range.selectNodeContents(hlSpan);
          const rects = Array.from(range.getClientRects());
          const lines: { top: number; left: number; width: number; height: number }[] = [];
          for (const r of rects) {
            if (r.width < 2 || r.height < 2) continue;
            lines.push({
              left:   (r.left - hostRect.left) / HL_SCALE,
              top:    (r.top  - hostRect.top)  / HL_SCALE - 1,
              width:  r.width  / HL_SCALE,
              height: r.height / HL_SCALE,
            });
          }
          if (lines.length > 0) {
            hlLinesRef.current = lines;
            hlMeasuredRef.current = true;
          }
        }
      }

      // Animate highlight bars
      const hlElapsed = ms - HL_START;
      const lines = hlLinesRef.current;
      const hlContainer = hlContainerRef.current;
      hlContainer.innerHTML = "";

      if (lines.length > 0) {
        const hlGlobalAlpha = 1 - hlFadeOut;
        lines.forEach((line, i) => {
          const lineStart = i * HL_LINE_DUR;
          const lineEnd   = lineStart + HL_LINE_DUR;
          const lineP = clamp(track(hlElapsed, lineStart, lineEnd, eases.outCubic));
          if (lineP <= 0) return;

          const bar = document.createElement("div");
          bar.style.position = "absolute";
          bar.style.top = `${line.top}px`;
          bar.style.left = `${line.left}px`;
          bar.style.height = `${line.height + 2}px`;
          // width is now absolute pixels from Range.getClientRects() — L→R sweep to exact width.
          bar.style.width = `${lineP * line.width}px`;
          bar.style.background = `rgba(235,188,171,${0.78 * hlGlobalAlpha})`;
          bar.style.borderRadius = "2px";
          bar.style.pointerEvents = "none";
          bar.style.zIndex = "0";
          hlContainer.appendChild(bar);
        });
      }
    } else if (hlContainerRef.current && !hlVisible) {
      hlContainerRef.current.innerHTML = "";
    }

    // Coral asterisk loading dot
    if (asteriskCanvasRef.current) {
      const asteriskOp = track(ms, ASTERISK_IN, ASTERISK_IN + 400, eases.outQuart);
      const rotDeg = (ms * (360 / 1500)) % 360;
      const bloomP = 0.6 + 0.4 * ((Math.sin((ms / 800) * Math.PI * 2) + 1) / 2);
      drawAsterisk(asteriskCanvasRef.current, rotDeg, bloomP, asteriskOp);
    }
  }, [drawAsterisk]);

  return (
    <Timegroup
      mode="fixed"
      duration={`${DURATION_MS}ms`}
      onFrame={onFrame as any}
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0, width: 1920, height: 1080, overflow: "hidden" }}
    >
      <CreamBackdrop variant="light" />

      {/*
        ROUND-7 FIX (comments #3 & #5): The orange frame/border + glow are REMOVED.
        They lived in screen-space OUTSIDE the camera rig, so when the camera zooms
        deep into the Claude panel they floated as a disconnected orange rectangle
        framing the whole canvas — the "weird orange frame border" the user flagged
        in the response scene and the ending. No orange frame here anymore; the
        window keeps only its own neutral drop-shadow.
      */}

      {/* Scene opacity wrapper */}
      <div ref={sceneWrapRef} style={{ position: "absolute", inset: 0, opacity: 0, willChange: "opacity", zIndex: 2 }}>
        {/* Camera rig */}
        <div
          ref={rigRef}
          style={{
            position: "absolute",
            inset: 0,
            width: 1920,
            height: 1080,
            transformOrigin: `${(FOCAL_LX / 1920) * 100}% ${(FOCAL_LY_READ / 1080) * 100}%`,
            transform: `translate3d(${960 - FOCAL_LX}px, ${540 - FOCAL_LY_READ}px, 0) scale(${ZOOM_SCALE_START})`,
            willChange: "transform",
          }}
        >
          {/* Unified window */}
          <div style={{
            position: "absolute",
            left: WIN_LEFT,
            top: WIN_TOP,
            width: WIN_W,
            height: WIN_H,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 24px 80px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.10)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            background: "#F5F5F5",
            display: "flex",
            flexDirection: "column",
          }}>
            {/* macOS title bar */}
            <div style={{
              height: 40, background: "#2563EB",
              display: "flex", alignItems: "center", padding: "0 16px", gap: 8, flexShrink: 0,
            }}>
              <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#FF5F57" }} />
              <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#FEBC2E" }} />
              <div style={{ width: 13, height: 13, borderRadius: "50%", background: "#28C840" }} />
              <span style={{ color: "white", fontSize: 14, marginLeft: 16, fontWeight: 500 }}>Inbox — Outlook</span>
              <div style={{ marginLeft: "auto", marginRight: 16, background: "rgba(255,255,255,0.2)", borderRadius: 6, padding: "4px 12px", fontSize: 12, color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="5" cy="5" r="4" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
                  <path d="M8 8L11 11" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Search
              </div>
            </div>

            {/* Toolbar */}
            <div style={{
              height: 44, background: "#EBF2FF",
              display: "flex", alignItems: "center", padding: "0 16px", gap: 12,
              borderBottom: "1px solid #D0D9F0", flexShrink: 0,
            }}>
              {["New Email", "Reply", "Forward"].map(l => (
                <button key={l} style={{ padding: "4px 12px", background: "white", border: "1px solid #C8D3E8", borderRadius: 4, fontSize: 12, color: "#374151" }}>{l}</button>
              ))}
            </div>

            {/* Content */}
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
              {/* Outlook side */}
              <div style={{ width: OUTLOOK_CONTENT_W, display: "flex", borderRight: "1px solid rgba(0,0,0,0.08)", flexShrink: 0, overflow: "hidden" }}>
                <div style={{ width: 200, background: "#EBF2FF", padding: "12px 8px", borderRight: "1px solid #D0D9F0", flexShrink: 0 }}>
                  {[["Inbox", 8, true], ["Sent", 0, false], ["Drafts", 3, false], ["Archive", 0, false]].map(([label, count, active]) => (
                    <div key={String(label)} style={{ padding: "8px 12px", borderRadius: 6, marginBottom: 2, background: active ? "rgba(37,99,235,0.15)" : "transparent", color: active ? "#1D4ED8" : "#374151", fontSize: 13, fontWeight: active ? 600 : 400, display: "flex", justifyContent: "space-between" }}>
                      <span>{label}</span>
                      {Number(count) > 0 && <span style={{ background: active ? "#2563EB" : "#9CA3AF", color: "white", borderRadius: 10, padding: "1px 6px", fontSize: 11 }}>{count}</span>}
                    </div>
                  ))}
                </div>
                <div style={{ flex: 1, overflowY: "auto" }}>
                  {[
                    { from: "Sarah Chen", subject: "Q3 Review — action items", time: "9:41 AM", unread: true },
                    { from: "Marcus Webb", subject: "Re: Acme brief deadline", time: "9:18 AM", unread: true },
                    { from: "James Okafor", subject: "CRLX/Hartwell alert", time: "8:30 AM", unread: true },
                    { from: "Priya Sharma", subject: "Tie-out chatter resolved", time: "Yesterday", unread: false },
                  ].map((email, i) => (
                    <div key={i} style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", background: i === 1 ? "#EBF2FF" : "white" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                        <span style={{ fontWeight: email.unread ? 700 : 400, fontSize: 13 }}>{email.from}</span>
                        <span style={{ fontSize: 11, color: "#9CA3AF" }}>{email.time}</span>
                      </div>
                      <div style={{ fontWeight: email.unread ? 600 : 400, fontSize: 12, color: "#374151" }}>{email.subject}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Claude panel */}
              <div style={{
                width: CLAUDE_PANEL_W,
                height: "100%",
                background: "#FAFAF8",
                display: "flex",
                flexDirection: "column",
                borderLeft: "1px solid rgba(0,0,0,0.08)",
                flexShrink: 0,
                overflow: "hidden",
              }}>
                {/* Claude header */}
                <div style={{
                  height: 56, padding: "0 18px",
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                  display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
                  background: "#FAFAF8",
                }}>
                  <CoralAsteriskIcon size={26} />
                  <span style={{ fontWeight: 600, fontSize: 15, color: "#1A1A1A" }}>Claude</span>
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center", gap: 4 }}>
                    Opus 4.7
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 3.5L5 6.5L8 3.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>

                {/* FIX 8: User message bubble */}
                <div style={{ padding: "14px 16px", flexShrink: 0 }}>
                  <div style={{
                    background: "#F0EEEB", borderRadius: "14px 14px 4px 14px",
                    padding: "10px 14px", fontSize: 13, color: "#1A1A1A",
                    lineHeight: 1.5, maxWidth: "90%", marginLeft: "auto",
                  }}>
                    Way behind on my emails. What do I need to focus on today?
                  </div>
                </div>

                {/* Claude label row */}
                <div style={{ padding: "0 16px", flexShrink: 0, display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <CoralAsteriskIcon size={22} />
                  <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>Claude</span>
                </div>

                {/*
                  FIX 8: "Responding..." indicator row — visible at scene start,
                  fades out as response streams in.
                */}
                <div
                  ref={respondingRowRef}
                  style={{
                    padding: "0 16px 8px 16px",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    opacity: 0,
                    willChange: "opacity",
                  }}
                >
                  <CoralAsteriskIcon size={16} />
                  <span style={{ fontSize: 13, color: "#9CA3AF", fontStyle: "italic" }}>Responding...</span>
                </div>

                {/*
                  FIX 9: Scrollable response area with highlighter overlay.
                  FIX 10: Scroll settles at bottom so "Start here: Acme_brief.docx" is visible.
                */}
                {/*
                  FIX 10: Outer clip container — overflow:hidden.
                  Inner content injected imperatively (no React children here).
                  The inner div is translated via transform to simulate scrolling.
                  NOTE: No React children so React reconciliation won't disturb imperative DOM.
                */}
                <div
                  ref={msgAreaRef}
                  style={{
                    position: "relative",
                    flex: 1,
                    overflow: "hidden",
                  }}
                />

                {/* Coral asterisk loading indicator */}
                <div style={{
                  padding: "6px 16px 6px 40px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <canvas
                    ref={asteriskCanvasRef}
                    width={64} height={64}
                    style={{ width: 32, height: 32, display: "block" }}
                  />
                </div>

                {/*
                  FIX 10: Reply input — must NOT overlap "Start here: Acme_brief.docx".
                  Keep it compact so the last response line shows above it.
                */}
                <div style={{
                  padding: "8px 14px 12px",
                  borderTop: "1px solid rgba(0,0,0,0.08)",
                  background: "white", flexShrink: 0,
                }}>
                  <div style={{
                    border: "1.5px solid rgba(0,0,0,0.12)",
                    borderRadius: 12, padding: "10px 14px",
                    minHeight: 44,
                    display: "flex", alignItems: "center",
                    background: "white",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    marginBottom: 6,
                  }}>
                    <span style={{ fontSize: 14, color: "#9CA3AF", flex: 1 }}>Reply</span>
                  </div>
                  {/* Bottom toolbar */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 4px" }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="9" stroke="#9CA3AF" strokeWidth="1.5"/>
                      <path d="M10 6V14M6 10H14" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M3 6L9 10L3 14V6ZM10 6L16 10L10 14V6Z" fill="#9CA3AF"/>
                    </svg>
                    <div style={{ flex: 1 }} />
                    <span style={{ fontSize: 13, color: "#6B7280", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 3 }}>
                      Opus 4.7
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 3.5L5 6.5L8 3.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect x="7" y="2" width="6" height="9" rx="3" stroke="#9CA3AF" strokeWidth="1.5"/>
                      <path d="M4 10C4 13.3137 6.68629 16 10 16C13.3137 16 16 13.3137 16 10" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M10 16V18" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Timegroup>
  );
}
