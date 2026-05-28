import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { eases } from "animejs";
import { JiraHeader, JiraSidebar } from "../components/JiraChrome";
import {
  IconBold,
  IconBullet,
  IconChevDown,
  IconClock,
  IconCode,
  IconColor,
  IconCursorRound,
  IconEmoji,
  IconEyeOff,
  IconImage,
  IconLink,
  IconMore,
  IconPlus,
  IconRedo,
  IconStop,
  IconTextSize,
  IconUnderline,
  IconUndo,
  IconWand,
  IconCursorCube,
} from "../components/JiraIcons";
import { Sfx } from "../components/Sfx";

const clamp = (n: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const track = (
  ms: number,
  startMs: number,
  endMs: number,
  easeFn: (t: number) => number = eases.outCubic
) => easeFn(clamp((ms - startMs) / (endMs - startMs)));

const outBack = (t: number, overshoot = 1.7) => {
  const c1 = overshoot;
  const c3 = c1 + 1;
  const x = clamp(t);
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

// Typed comment
const TYPED_BODY = " can you please take a look at this for me? repo=site model=claude";
// v6 (2026-05-23): client wants chrome to BUILD FASTER and a pre-typing zoom
// onto the composer (composer dominates frame ~1s before typing starts).
// Schedule:
//   0.0–3.0s  chrome builds (was 4–9s = 5s, now 0–3s)
//   3.0–6.5s  camera zooms IN to composer center stage, holds 1s
//   6.5–9.5s  user types — camera scans L→R matching word pace
const TYPE_START = 6500;   // was 7600
const TYPE_DUR = 3000;     // was 2800 — match L→R pan velocity to word pace

// Agent strip text rotates per reference (re-timed for tighter pace).
// 14.4–17.4 window is the "codebase scan" beat — text rotates through the
// EXACT phrases the reference video shows (frames f_010 → f_017):
//   f_010  "Cursor is getting started on \"update jira docs ...\""
//   f_011  "Cursor is searching codebase \"integrations\""
//   f_012  "Cursor is searching codebase \"note\".."
//   f_013  "Cursor is running cd /workspace && pnpm install --ignore-s..."
//   f_014  "Cursor is running cd /workspace && pnpm --filter docs type..."
//   f_015  "Cursor is running cd /workspace/apps/docs && ./node_module..."
//   f_016  "Cursor is running sub-agent."
//   f_017  "Cursor is searching codebase \".github/**\"..."
const AGENT_STATES = [
  { at: 11300, text: "Cursor is getting started." },
  { at: 12200, text: "Cursor is reading docs-sections.ts." },
  { at: 13500, text: "Cursor is searching codebase \"integrations\"" },
  { at: 14200, text: "Cursor is searching codebase \"note\"…" },
  { at: 15000, text: "Cursor is running sub-agent." },
  { at: 15700, text: "Cursor is searching codebase \".github/**\"…" },
  { at: 16900, text: "Cursor is running curl -s -o /tmp/jira_page.html …" },
  { at: 18500, text: "Cursor is writing PR description." },
];

const TOOLBAR = [
  { key: "cursor", kind: "cursor-logo" },
  { key: "improve", kind: "improve" },
  { key: "tt", kind: "icon", el: <IconTextSize /> },
  { key: "b", kind: "icon", el: <IconBold /> },
  { key: "b-chev", kind: "chev" },
  { key: "ul", kind: "icon", el: <IconBullet /> },
  { key: "ul-chev", kind: "chev" },
  { key: "color", kind: "icon-boxed", el: <IconColor /> },
  { key: "img", kind: "icon", el: <IconImage /> },
  { key: "code", kind: "icon", el: <IconCode /> },
  { key: "emoji", kind: "icon", el: <IconEmoji /> },
  { key: "plus", kind: "icon", el: <IconPlus /> },
  { key: "link", kind: "icon", el: <IconLink /> },
  { key: "undo", kind: "icon", el: <IconUndo /> },
  { key: "redo", kind: "icon", el: <IconRedo /> },
  { key: "clock", kind: "icon", el: <IconClock /> },
  { key: "more", kind: "icon", el: <IconMore /> },
];

const CHIPS = ["Suggest a reply...", "Can I get more info...?", "Status update..."];
const CHOSEN_REPLY = "Thanks — let me know if you need anything else before this ships.";

export const CursorJiraScene: React.FC = () => {
  // CAMERA RIG — entire page transformed for aggressive camera moves
  const cameraRigRef = useRef<HTMLDivElement>(null);
  const motionBlurRef = useRef<HTMLDivElement>(null);

  // Chrome
  const headerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const breadcrumbRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  // Sections
  const descRef = useRef<HTMLDivElement>(null);
  const subtasksRef = useRef<HTMLDivElement>(null);
  const linkedRef = useRef<HTMLDivElement>(null);
  const activityRef = useRef<HTMLDivElement>(null);
  const tabBarRef = useRef<HTMLDivElement>(null);

  // Editor
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const placeholderRef = useRef<HTMLSpanElement>(null);
  const cursorChipRef = useRef<HTMLSpanElement>(null);
  const typedTextRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const saveBtnRef = useRef<HTMLDivElement>(null);
  const improveRef = useRef<HTMLDivElement>(null);
  const improveHaloRef = useRef<HTMLDivElement>(null);
  const editorCollapsedRef = useRef<HTMLDivElement>(null);

  // Agent strip
  const agentsSectionRef = useRef<HTMLDivElement>(null);
  const agentBorderRef = useRef<HTMLDivElement>(null);
  const agentTextRef = useRef<HTMLSpanElement>(null);

  // Chips + final post
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chipCursorRef = useRef<HTMLDivElement>(null);
  const chipPulseRef = useRef<HTMLDivElement>(null);
  const collapsedInputRef = useRef<HTMLSpanElement>(null);
  const collapsedCaretRef = useRef<HTMLSpanElement>(null);
  const postedCommentRef = useRef<HTMLDivElement>(null);
  const userCommentRef = useRef<HTMLDivElement>(null);
  const cursorReplyRef = useRef<HTMLDivElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);

  // Light sweep on PR reply
  const replySweepRef = useRef<HTMLDivElement>(null);

  // Right details sidebar
  const detailsPanelRef = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(
    ({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
      const ms = ownCurrentTimeMs;

      // ----- 0–3.0s: Chrome fades in (v6: compressed from 5s → 3s per client) -----
      const headerP = track(ms, 0, 350, eases.outQuart);
      if (headerRef.current) {
        headerRef.current.style.opacity = String(headerP);
        headerRef.current.style.transform = `translateY(${lerp(-12, 0, headerP)}px)`;
      }
      const sideP = track(ms, 80, 480, eases.outQuart);
      if (sidebarRef.current) {
        sidebarRef.current.style.opacity = String(sideP);
        sidebarRef.current.style.transform = `translateX(${lerp(-12, 0, sideP)}px)`;
      }
      const bP = track(ms, 250, 700, eases.outQuart);
      if (breadcrumbRef.current) breadcrumbRef.current.style.opacity = String(bP);
      const tP = track(ms, 400, 900, eases.outQuart);
      if (titleRef.current) {
        titleRef.current.style.opacity = String(tP);
        titleRef.current.style.transform = `translateY(${lerp(8, 0, tP)}px)`;
      }

      // ----- 0.8–2.7s: Sections build downward (stagger cut in half) -----
      const dP = track(ms, 800, 1200, eases.outQuart);
      if (descRef.current) {
        descRef.current.style.opacity = String(dP);
        descRef.current.style.transform = `translateY(${lerp(10, 0, dP)}px)`;
      }
      const stP = track(ms, 1000, 1450, eases.outQuart);
      if (subtasksRef.current) {
        subtasksRef.current.style.opacity = String(stP);
        subtasksRef.current.style.transform = `translateY(${lerp(10, 0, stP)}px)`;
      }
      const lP = track(ms, 1250, 1700, eases.outQuart);
      if (linkedRef.current) {
        linkedRef.current.style.opacity = String(lP);
        linkedRef.current.style.transform = `translateY(${lerp(12, 0, lP)}px)`;
      }
      const aP = track(ms, 1500, 1950, eases.outQuart);
      if (activityRef.current) {
        activityRef.current.style.opacity = String(aP);
        activityRef.current.style.transform = `translateY(${lerp(12, 0, aP)}px)`;
      }
      const tbP = track(ms, 1750, 2200, eases.outQuart);
      if (tabBarRef.current) {
        tabBarRef.current.style.opacity = String(tbP);
        tabBarRef.current.style.transform = `translateY(${lerp(10, 0, tbP)}px)`;
      }

      // Right details sidebar — fades in alongside chrome so canvas is always full
      const dpP = track(ms, 450, 1000, eases.outQuart);
      if (detailsPanelRef.current) {
        detailsPanelRef.current.style.opacity = String(dpP);
        detailsPanelRef.current.style.transform = `translateX(${lerp(14, 0, dpP)}px)`;
      }

      // ----- 2.0–3.0s: Editor box + staggered toolbar (was 3.9–5.5s) -----
      const eP = track(ms, 2000, 2700, eases.outCubic);
      const collapsePMain = track(ms, 10300, 10900, eases.outCubic);
      if (editorRef.current) {
        const overall = eP * (1 - collapsePMain);
        editorRef.current.style.opacity = String(overall);
        editorRef.current.style.transform = `translateY(${lerp(
          18,
          0,
          eP
        )}px) translateY(${lerp(0, -6, collapsePMain)}px) scale(${lerp(
          0.985,
          1,
          eP
        )}) scale(${lerp(1, 0.99, collapsePMain)})`;
        if (collapsePMain > 0.98) editorRef.current.style.pointerEvents = "none";
      }
      TOOLBAR.forEach((_, i) => {
        const el = toolbarItemRefs.current[i];
        if (!el) return;
        const start = 2500 + i * 22; // v6: half stagger, earlier
        const p = track(ms, start, start + 220, eases.outCubic);
        el.style.opacity = String(p);
        el.style.transform = `translateY(${lerp(6, 0, p)}px)`;
      });
      const sbP = track(ms, 3000, 3400, eases.outQuart);
      if (saveBtnRef.current) {
        saveBtnRef.current.style.opacity = String(sbP);
        saveBtnRef.current.style.transform = `translateY(${lerp(6, 0, sbP)}px)`;
      }

      // ----- 3.2–9.5s: Placeholder fades, @Cursor chip, body types in -----
      const phHide = track(ms, TYPE_START - 200, TYPE_START + 100, eases.outQuad);
      if (placeholderRef.current) {
        const phShow = track(ms, 3200, 3700, eases.outCubic);
        placeholderRef.current.style.opacity = String(phShow * (1 - phHide));
      }
      const chipShow = track(ms, TYPE_START, TYPE_START + 260, outBack);
      if (cursorChipRef.current) {
        cursorChipRef.current.style.opacity = String(clamp(chipShow));
        cursorChipRef.current.style.transform = `scale(${lerp(0.55, 1, clamp(chipShow))})`;
      }
      const typeP = clamp((ms - (TYPE_START + 220)) / TYPE_DUR);
      const chars = Math.floor(typeP * TYPED_BODY.length);
      if (typedTextRef.current) {
        const text = TYPED_BODY.slice(0, chars);
        if (typedTextRef.current.textContent !== text) {
          typedTextRef.current.textContent = text;
        }
      }
      if (caretRef.current) {
        const blink = Math.floor(ms / 480) % 2 === 0 ? 1 : 0;
        const active = ms > 3700 && ms < 10300 ? 1 : 0;
        caretRef.current.style.opacity = String(active * blink * 0.85);
      }

      // ----- 9.5–11s: "Improve writing" glows -----
      const glowIn = track(ms, 9500, 10200, eases.outQuart);
      const glowOut = track(ms, 10700, 11300, eases.outCubic);
      const glowAlpha = glowIn * (1 - glowOut);
      if (improveHaloRef.current) {
        improveHaloRef.current.style.opacity = String(glowAlpha * 0.9);
        improveHaloRef.current.style.transform = `scale(${lerp(0.9, 1.15, glowIn)})`;
      }
      if (improveRef.current) {
        const pulse = 1 + Math.sin((ms - 9500) / 110) * 0.018 * glowAlpha;
        improveRef.current.style.transform = `scale(${pulse})`;
      }

      // ----- 10.8s+: Editor collapses into "Add a comment..." -----
      const collapsedIn = track(ms, 10800, 11300, eases.outCubic);
      if (editorCollapsedRef.current) {
        editorCollapsedRef.current.style.opacity = String(collapsedIn);
        editorCollapsedRef.current.style.transform = `translateY(${lerp(8, 0, collapsedIn)}px)`;
      }

      // ----- 10.8s+: Agents section + rainbow border + rotating text -----
      const agentIn = track(ms, 10800, 11400, eases.outCubic);
      const agentOut = track(ms, 20500, 21200, eases.outCubic);
      const agentVis = agentIn * (1 - agentOut);
      if (agentsSectionRef.current) {
        agentsSectionRef.current.style.opacity = String(agentVis);
        agentsSectionRef.current.style.transform = `translateY(${lerp(12, 0, agentIn)}px)`;
      }
      if (agentBorderRef.current) {
        const angle = ((ms / 1800) * 360) % 360;
        agentBorderRef.current.style.setProperty("--cursor-angle", `${angle}deg`);
      }
      if (agentTextRef.current) {
        let label = AGENT_STATES[0].text;
        for (const s of AGENT_STATES) if (ms >= s.at) label = s.text;
        if (agentTextRef.current.textContent !== label) {
          agentTextRef.current.textContent = label;
        }
      }

      // ----- 17.0–18.0s: Cursor flies in to "Suggest a reply..." chip -----
      // Chip i=0 has the press at 18000-18250ms, so cursor must LAND by 17950ms.
      // Cursor pos is relative to the chips-flex container; chip 0 sits at
      // roughly (0, 0) → (180, 36) within the container. Click pulse fires at 18000.
      if (chipCursorRef.current) {
        let cx = 220, cy = 120, op = 0;
        if (ms < 17000) {
          op = 0;
        } else if (ms < 17950) {
          const t = clamp((ms - 17000) / 950);
          const e = eases.outCubic(t);
          cx = lerp(220, 110, e);
          cy = lerp(120, 18, e);
          op = clamp((ms - 17000) / 200);
        } else if (ms < 18550) {
          cx = 110; cy = 18; op = 1;
        } else {
          const t = clamp((ms - 18550) / 350);
          cx = 110; cy = 18 + t * 8; op = 1 - t;
        }
        chipCursorRef.current.style.transform = `translate(${cx}px, ${cy}px)`;
        chipCursorRef.current.style.opacity = String(op);
      }
      // Click pulse on chip at 18000
      if (chipPulseRef.current) {
        const pm = ms - 18000;
        if (pm >= 0 && pm <= 380) {
          const t = pm / 380;
          const scale = 1 + t * 1.8;
          chipPulseRef.current.style.transform = `translate(${110 - 18}px, ${18 - 18}px) scale(${scale})`;
          chipPulseRef.current.style.opacity = String(1 - t);
        } else {
          chipPulseRef.current.style.opacity = "0";
        }
      }

      // ----- 16.5–18.7s: Suggested chips pop in, one is clicked -----
      CHIPS.forEach((_, i) => {
        const el = chipRefs.current[i];
        if (!el) return;
        const start = 16500 + i * 110;
        const p = track(ms, start, start + 360, eases.outCubic);
        const press = i === 0 ? track(ms, 18000, 18250, eases.inOutQuad) : 0;
        const release = i === 0 ? track(ms, 18250, 18550, eases.outQuad) : 0;
        const scale = 1 - press * 0.1 + release * 0.1;
        const flash = i === 0 ? press * (1 - release) : 0;
        const disappear = i === 0 ? track(ms, 18550, 18950, eases.outQuad) : 0;
        const otherFade = i !== 0 ? track(ms, 18550, 19050, eases.outQuad) : 0;
        el.style.opacity = String(p * (1 - (i === 0 ? disappear : otherFade)));
        el.style.transform = `translateY(${lerp(10, 0, p)}px) scale(${scale})`;
        el.style.background = flash > 0 ? "#DEEBFF" : "#F4F5F7";
        el.style.borderColor = flash > 0 ? "#B3D4FF" : "#DFE1E6";
      });

      // ----- 18.7–21s: Click expands → typing chosen reply -----
      const expP = track(ms, 18700, 19500, eases.outCubic);
      if (collapsedInputRef.current) {
        if (ms < 18650) {
          if (collapsedInputRef.current.textContent !== "Add a comment...") {
            collapsedInputRef.current.textContent = "Add a comment...";
          }
          collapsedInputRef.current.style.color = "#7A869A";
        } else if (ms < 20900) {
          const text = CHOSEN_REPLY.slice(0, Math.floor(expP * CHOSEN_REPLY.length));
          if (collapsedInputRef.current.textContent !== text) {
            collapsedInputRef.current.textContent = text;
          }
          collapsedInputRef.current.style.color = "#172B4D";
        }
      }
      if (collapsedCaretRef.current) {
        const blink = Math.floor(ms / 480) % 2 === 0 ? 1 : 0;
        const active = ms > 18700 && ms < 20900 ? 1 : 0;
        collapsedCaretRef.current.style.opacity = String(active * blink * 0.85);
      }

      // ----- 20.1–22s: Comment posts, Cursor reply, toast -----
      const postIn = track(ms, 20100, 20900, eases.outCubic);
      if (collapsedInputRef.current) {
        if (postIn > 0.9 && collapsedInputRef.current.textContent !== "Add a comment...") {
          collapsedInputRef.current.textContent = "Add a comment...";
          collapsedInputRef.current.style.color = "#7A869A";
        }
      }
      if (userCommentRef.current) {
        userCommentRef.current.style.opacity = String(postIn);
        userCommentRef.current.style.transform = `translateY(${lerp(18, 0, postIn)}px)`;
      }
      const replyIn = track(ms, 20600, 21400, eases.outCubic);
      if (cursorReplyRef.current) {
        cursorReplyRef.current.style.opacity = String(replyIn);
        cursorReplyRef.current.style.transform = `translateY(${lerp(20, 0, replyIn)}px)`;
      }
      if (postedCommentRef.current) {
        postedCommentRef.current.style.opacity = String(Math.max(postIn, replyIn));
      }

      // Toast — v7: scene now ends at 21500ms (= video 25s). Toast must
      // appear and remain visible until the logo card cut. No out-fade.
      const toastIn = track(ms, 20300, 21000, eases.outQuart);
      const toastVis = toastIn;
      if (toastRef.current) {
        toastRef.current.style.opacity = String(toastVis);
        toastRef.current.style.transform = `translateX(${lerp(40, 0, toastIn)}px) translateY(${lerp(
          12,
          0,
          toastIn
        )}px)`;
      }

      // ── GLOWING LIGHT SWEEP across the new Cursor PR reply ──
      // Sweeps when the PR write-up first appears (21.1–22.1s)
      if (replySweepRef.current) {
        const sweepP = track(ms, 21100, 22100, eases.inOutCubic);
        const sweepFade = track(ms, 21100, 21300, eases.outCubic) * (1 - track(ms, 21800, 22200, eases.outCubic));
        replySweepRef.current.style.setProperty("--sweep-x", `${lerp(-60, 100, sweepP)}%`);
        replySweepRef.current.style.setProperty("--sweep-opacity", String(sweepFade * 0.9));
      }

      // ════════════════════════════════════════════════════════════════
      // CAMERA RIG v6 — CLIENT-DIRECTED (2026-05-23, third pass)
      // ════════════════════════════════════════════════════════════════
      // Client feedback verbatim:
      //   "Zoom in is WAY too minimal. Camera literally needs to zoom in
      //    and pan down and have the chatbox in the middle. Have the
      //    chatbox be in the middle and take up the entire center stage
      //    of the screen, that's a second before the user starts to type."
      //   "When the user types it ZOOMS in and then scans from left to
      //    right. Do NOT hold back on this movement."
      //   "When cursor is getting started, camera messes up where it's
      //    zooming, needs to zoom in MORE to the LEFT, then zoom back out."
      //
      // Schedule (non-overlapping, inOutCubic so velocity=0 at boundaries):
      //
      //   t ∈ [0,     3000)  LOCKED 1.0x, origin 50/50      (chrome build)
      //   t ∈ [3000,  5500)  ZOOM IN to composer center stage (1.0→1.40x,
      //                      origin 50/50→50/70)            (pre-typing)
      //   t ∈ [5500,  6500)  HOLD on composer (1.40x, 50/70) (1s beat
      //                                                       before typing)
      //   t ∈ [6500,  9500)  TYPING SCAN — origin slides L→R 40→56% matching
      //                      caret position, scale 1.40→1.50x   (word-paced)
      //   t ∈ [9500,  10800) HOLD at typing end-pose (1.50x, 56/70)
      //                                                       (improve glow)
      //   t ∈ [10800, 11600) ZOOM-OUT-AND-RESET to agent-strip approach
      //                      (1.50→1.20x, origin 56/70→22/60)  (transition)
      //   t ∈ [11600, 12400) ZOOM IN to Agents strip (1.20→1.55x, origin
      //                      LEFT at 22/60)                  (cursor starts)
      //   t ∈ [12400, 19200) HOLD on Agents strip (1.55x, 22/60)
      //                                                  (codebase scan)
      //   t ∈ [19200, 20100) ZOOM OUT to 1.0x, origin 50/50  ("Thanks…")
      //   t ∈ [20100, 25000) LOCKED 1.0x                    (post/reply)
      //
      // Composer geometry: editor sits ~y=560–700 in 1080 canvas with the
      //   typing row centered around y=620 (≈57%). Composer left edge at
      //   x≈170, right edge at x≈1180 → center at x≈675/1920 ≈ 35%. But
      //   client wants composer DOMINATE center, so transformOrigin lands
      //   at (50%,70%) to push composer toward visual center at 1.4x scale.
      // Agents strip geometry: text starts at x≈140 (≈7% from left); pill
      //   center sits ~x=580 ≈ 30%. Zoom origin at 22/60 pushes the LEFT
      //   PORTION of the pill into the visual center as required.

      // Each window can specify (scale, originX%, originY%) AND an optional
      // (offsetX_pct, offsetY_pct) translate applied AFTER scale to recenter
      // the focal element into the visual middle of the frame. This is the
      // key fix for v6 — without a post-scale translate, zooming around the
      // composer's actual pixel coords (~y=78%) leaves the composer pinned
      // to 78% of the viewport (i.e. crammed at the bottom). Translating UP
      // by (50% − originY%) of the canvas height brings the focal element
      // to viewport center.
      //
      // Anchor coords (in unscaled canvas %):
      //   composer toolbar row:  (50, 78)
      //   typing caret start:    (15, 80)
      //   typing caret end:      (38, 80)
      //   agents pill center:    (30, 60)   ← strip text near left of pill
      //   agents pill LEFT half: (22, 60)   ← client wants origin further left

      let camScale = 1;
      let camOriginX = 50;
      let camOriginY = 50;

      // v7 (2026-05-23): client said framing at video 9s (scene 5.5s) was
      // "completely wrong" with a weird jump-cut into the typing pan at 10s.
      // Root cause: A3 held origin at (50, 78) scale 1.45 — exposing right
      // sidebar partials — then Window B SNAPPED origin to (35, 78). 15%
      // horizontal jump = the jump-cut. Fix: pull composer hold IN further
      // (scale 1.35, origin 40%) so partial right-sidebar labels don't
      // appear, AND make Window B start from origin 40 instead of 35 so
      // there is no boundary leap. Also tighten G to 1500ms hold so the
      // Jira surface arc lands at scene t=21500ms (= video 25s).
      if (ms < 3000) {
        // Window A: chrome build — locked wide
        camScale = 1.0;
        camOriginX = 50;
        camOriginY = 50;
      } else if (ms < 5500) {
        // Window A2: PRE-TYPING ZOOM IN — composer dominates center stage.
        // Land at scale 1.35 origin (40, 78) so the composer centers
        // WITHOUT exposing right-sidebar partial labels at video 9s.
        const zP = track(ms, 3000, 5500, eases.inOutCubic);
        camOriginX = lerp(50, 40, zP);
        camOriginY = lerp(50, 78, zP);
        camScale = lerp(1.0, 1.35, zP);
      } else if (ms < 6500) {
        // Window A3: HOLD on composer (~1s beat before typing starts).
        // Pulled in further (40, 78) at 1.35x — composer dominates frame
        // cleanly without right-sidebar bleed.
        camOriginX = 40;
        camOriginY = 78;
        camScale = 1.35;
      } else if (ms < 9500) {
        // Window B: TYPING SCAN — origin slides L→R matching caret pace.
        // Starts at A3's end-pose (40, 78) → eliminates the 9s→10s jump.
        const panP = track(ms, 6500, 9500, eases.inOutCubic);
        camOriginX = lerp(40, 52, panP);
        camOriginY = 78;
        camScale = lerp(1.35, 1.50, panP);
      } else if (ms < 10800) {
        // Window C: HOLD at typing end-pose so "Improve writing" glow plays.
        camOriginX = 52;
        camOriginY = 78;
        camScale = 1.50;
      } else if (ms < 11600) {
        // Window D1: TRANSITION — pull back + slide LEFT toward agent pose.
        const zP = track(ms, 10800, 11600, eases.inOutCubic);
        camOriginX = lerp(52, 22, zP);
        camOriginY = lerp(78, 60, zP);
        camScale = lerp(1.50, 1.20, zP);
      } else if (ms < 12400) {
        // Window D2: ZOOM IN to Agents strip (LEFT-shifted per client).
        const zP = track(ms, 11600, 12400, eases.inOutCubic);
        camOriginX = 22;
        camOriginY = 60;
        camScale = lerp(1.20, 1.55, zP);
      } else if (ms < 19200) {
        // Window E: HOLD on Agents strip while rotating text plays.
        camOriginX = 22;
        camOriginY = 60;
        camScale = 1.55;
      } else if (ms < 20100) {
        // Window F: ZOOM OUT to 1.0x center as user starts typing "Thanks…"
        const zP = track(ms, 19200, 20100, eases.inOutCubic);
        camOriginX = lerp(22, 50, zP);
        camOriginY = lerp(60, 50, zP);
        camScale = lerp(1.55, 1.0, zP);
      } else {
        // Window G: LOCKED 1.0x for posted comment + reply + toast.
        // (Scene ends at 21500ms = video 25s — compressed from 25000ms
        //  per client: cut Jira content at video 25s before logo card.)
        camOriginX = 50;
        camOriginY = 50;
        camScale = 1.0;
      }

      // POST-SCALE RECENTERING TRANSLATE
      // After scaling around (originX%, originY%), the focal element stays
      // pinned to that % position. To bring it to viewport center, we shift
      // the entire rig by the offset between origin and (50%, 50%).
      // viewport is 1920×1080. The translate amount must scale with the
      // current scale because translate happens AFTER scale in CSS pipeline
      // (right-to-left), so a unit pixel here = 1 device px.
      const W = 1920;
      const H = 1080;
      const recenterX = ((50 - camOriginX) / 100) * W * (camScale - 1);
      const recenterY = ((50 - camOriginY) / 100) * H * (camScale - 1);

      if (cameraRigRef.current) {
        cameraRigRef.current.style.transformOrigin = `${camOriginX}% ${camOriginY}%`;
        cameraRigRef.current.style.transform = `translate3d(${recenterX}px, ${recenterY}px, 0) scale(${camScale})`;
      }

      // Motion-blur overlay remains dormant — no whip-pan in v4 either.
      if (motionBlurRef.current) {
        motionBlurRef.current.style.opacity = "0";
      }

      // CODEBASE WIREFRAME INTERLUDE — REMOVED 2026-05-23 per Jeremy.
      // "Cursor analyzing and the ball bounces from the boxes" was the
      // bouncing-codebase scene. It is gone. The scan is now represented
      // ONLY by rotating text inside the Agents pill (AGENT_STATES above),
      // which is what the baseline already does.
    },
    []
  );

  return (
    <Timegroup
      mode="fixed"
      duration="21.5s"
      onFrame={handleFrame as any}
      className="absolute inset-0"
    >
      {/* SFX */}
      <Sfx cue="reveal" at={0.2} dur={1.0} volume={0.32} />
      <Sfx cue="pop" at={2.8} dur={0.6} volume={0.38} />
      <Sfx cue="twinkle" at={9.5} dur={1.4} volume={0.4} />
      <Sfx cue="ping" at={11.6} dur={1.4} volume={0.32} />
      {/* REMOVED 2026-05-23 (Jeremy correction): the triple "plop" cascade at
          17.4 / 17.53 / 17.66s landed inside / on the boundary of the
          codebase-scan window (14.4–17.4s) and sounded like a ball bouncing
          and hitting boxes. Cursor's actual videos use restrained ease-out
          motion with no bouncy micro-SFX (per brand-rules-cursor.md anti-
          patterns: "Bouncy spring animations" / "Aurora gradients ... ❌").
          The chip cascade is now silent. Do not re-add a bouncy droplet here. */}
      {/* <Sfx cue="plop" at={17.4} dur={0.3} volume={0.42} /> */}
      {/* <Sfx cue="plop" at={17.53} dur={0.3} volume={0.42} /> */}
      {/* <Sfx cue="plop" at={17.66} dur={0.3} volume={0.42} /> */}
      <Sfx cue="glass-pop" at={18.0} dur={0.5} volume={0.45} />
      <Sfx cue="confirm" at={20.3} dur={1.0} volume={0.5} />
      <Sfx cue="notify" at={20.7} dur={0.9} volume={0.32} />

      {/* White surface */}
      <div style={{ position: "absolute", inset: 0, background: "#FFFFFF" }} />

      {/* CAMERA RIG — transforms the entire Jira page */}
      <div
        ref={cameraRigRef}
        style={{
          position: "absolute",
          inset: 0,
          willChange: "transform",
          transformOrigin: "50% 50%",
        }}
      >

      <div ref={headerRef} style={{ opacity: 0, willChange: "transform, opacity" }}>
        <JiraHeader />
      </div>
      <div ref={sidebarRef} style={{ opacity: 0, willChange: "transform, opacity" }}>
        <JiraSidebar />
      </div>

      {/* Main content scroll area — two-column: ticket body + Jira details sidebar */}
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 56,
          right: 0,
          bottom: 0,
          padding: "36px 56px 40px 64px",
          fontFamily: "Inter, sans-serif",
          color: "#172B4D",
          overflow: "hidden",
          display: "flex",
          gap: 44,
          alignItems: "flex-start",
        }}
      >
      {/* LEFT: ticket body (primary content column) */}
      <div style={{ flex: 1, minWidth: 0, maxWidth: 1280 }}>
        {/* Breadcrumb */}
        <div
          ref={breadcrumbRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 17,
            color: "#6B778C",
            marginBottom: 18,
            opacity: 0,
          }}
        >
          <span>Projects</span>
          <span style={{ color: "#C1C7D0" }}>/</span>
          <span>Mycelium Site Docs</span>
          <span style={{ color: "#C1C7D0" }}>/</span>
          <span
            style={{
              padding: "2px 9px",
              border: "1px solid #DFE1E6",
              borderRadius: 3,
              color: "#42526E",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            MSD-24
          </span>
          <span style={{ flex: 1 }} />
        </div>

        {/* Title row + right meta cluster */}
        <div
          ref={titleRef}
          style={{
            opacity: 0,
            marginBottom: 20,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <div style={{ maxWidth: 1200 }}>
            <div
              style={{
                fontSize: 46,
                fontWeight: 700,
                color: "#172B4D",
                letterSpacing: "-0.015em",
                lineHeight: 1.18,
              }}
            >
              Update Jira docs with a note that the feature has been released
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 18, alignItems: "center" }}>
              <span
                style={{
                  padding: "5px 12px",
                  borderRadius: 3,
                  background: "#DFE1E6",
                  color: "#42526E",
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                }}
              >
                BACKLOG
              </span>
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  background: "linear-gradient(135deg, #2684FF, #0052CC)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                NT
              </span>
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  border: "1.5px solid #DFE1E6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6B778C",
                  fontSize: 17,
                }}
              >
                +
              </span>
            </div>
          </div>
        </div>

        {/* Description — v7: bottom margins tightened to lift comments UI higher */}
        <div ref={descRef} style={{ opacity: 0, marginBottom: 20 }}>
          <div style={{ fontSize: 20, color: "#7A869A" }}>Add a description...</div>
        </div>

        {/* Subtasks */}
        <div ref={subtasksRef} style={{ opacity: 0, marginBottom: 18 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#172B4D", marginBottom: 8 }}>
            Subtasks
          </div>
          <div style={{ fontSize: 17, color: "#6B778C" }}>Add subtask</div>
        </div>

        {/* Linked work items */}
        <div ref={linkedRef} style={{ opacity: 0, marginBottom: 18 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#172B4D", marginBottom: 8 }}>
            Linked work items
          </div>
          <div style={{ fontSize: 17, color: "#6B778C" }}>Add linked work item</div>
        </div>

        {/* Agents section — v7: bottom margin tightened (26→10) to lift Comments UI higher per client */}
        <div ref={agentsSectionRef} style={{ opacity: 0, marginBottom: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700, color: "#172B4D" }}>Agents</div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 15, color: "#6B778C" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#6B778C" strokeWidth="2" />
                <path d="M12 8v5 M12 16v.5" stroke="#6B778C" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>Uses AI. Verify results.</span>
            </div>
          </div>
          <div ref={agentBorderRef} className="cursor-border" style={{ width: "100%" }}>
            <div
              className="cursor-border-inner"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "16px 22px",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  background: "#0B0B0B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <IconCursorCube size={20} color="#FFFFFF" />
              </div>
              <span
                ref={agentTextRef}
                style={{ fontSize: 18, color: "#172B4D", fontWeight: 500 }}
              >
                Cursor is getting started.
              </span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  fontSize: 16,
                  color: "#6B778C",
                }}
              >
                <IconEyeOff size={16} /> Only visible to you
              </span>
              <div style={{ flex: 1 }} />
              <IconStop size={26} />
            </div>
          </div>
        </div>

        {/* Activity heading — v7: bottom margin tightened (14→8) */}
        <div ref={activityRef} style={{ opacity: 0, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="#42526E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#172B4D" }}>Activity</div>
        </div>

        {/* Tab bar */}
        <div
          ref={tabBarRef}
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 14,
            opacity: 0,
            borderBottom: "1px solid #DFE1E6",
          }}
        >
          {[
            { label: "All", active: false },
            { label: "Comments", active: true },
            { label: "History", active: false },
            { label: "Work log", active: false },
            { label: "Approvals", active: false },
          ].map((t) => (
            <div
              key={t.label}
              style={{
                padding: "10px 20px",
                fontSize: 17,
                fontWeight: t.active ? 600 : 500,
                color: t.active ? "#0052CC" : "#42526E",
                background: t.active ? "#DEEBFF" : "transparent",
                borderRadius: "4px 4px 0 0",
                borderBottom: t.active ? "2px solid #0052CC" : "2px solid transparent",
                marginBottom: -1,
              }}
            >
              {t.label}
            </div>
          ))}
        </div>

        {/* Editor area */}
        <div style={{ position: "relative", minHeight: 290 }}>
        {/* Expanded comment editor */}
        <div
          ref={editorRef}
          style={{
            display: "flex",
            gap: 18,
            alignItems: "flex-start",
            opacity: 0,
            position: "absolute",
            inset: 0,
          }}
        >
          <Avatar />

          <div style={{ flex: 1, minWidth: 0, maxWidth: 1300 }}>
            <div
              style={{
                border: "1px solid #4C9AFF",
                boxShadow: "0 0 0 1px #4C9AFF inset",
                borderRadius: 6,
                background: "#fff",
                overflow: "visible",
              }}
            >
              {/* Toolbar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  padding: "9px 12px",
                  borderBottom: "1px solid #DFE1E6",
                  background: "#FFFFFF",
                }}
              >
                {TOOLBAR.map((item, i) => (
                  <div
                    key={item.key}
                    ref={(el) => {
                      toolbarItemRefs.current[i] = el;
                    }}
                    style={{
                      opacity: 0,
                      display: "flex",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    {item.kind === "cursor-logo" ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "4px 7px 4px 5px",
                          borderRadius: 5,
                        }}
                      >
                        <IconCursorRound size={23} />
                        <IconChevDown size={13} />
                      </div>
                    ) : item.kind === "improve" ? (
                      <>
                        <div
                          ref={improveHaloRef}
                          className="improve-halo"
                          style={{ opacity: 0 }}
                        />
                        <div
                          ref={improveRef}
                          style={{
                            position: "relative",
                            zIndex: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "6px 11px",
                            borderRadius: 5,
                            fontSize: 17,
                            color: "#42526E",
                            fontWeight: 500,
                            background: "transparent",
                          }}
                        >
                          <IconWand size={18} color="#42526E" />
                          <span>Improve writing</span>
                        </div>
                        <div
                          style={{
                            width: 1,
                            height: 22,
                            background: "#DFE1E6",
                            margin: "0 8px",
                          }}
                        />
                      </>
                    ) : item.kind === "chev" ? (
                      <div style={{ padding: "0 3px 0 0" }}>
                        <IconChevDown size={13} />
                      </div>
                    ) : item.kind === "icon-boxed" ? (
                      <div
                        style={{
                          border: "1px solid #DFE1E6",
                          borderRadius: 4,
                          background: "#FAFBFC",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.el}
                      </div>
                    ) : (
                      <>{item.el}</>
                    )}
                  </div>
                ))}
              </div>

              {/* Text input area */}
              <div
                style={{
                  padding: "20px 22px",
                  minHeight: 88,
                  fontSize: 19,
                  lineHeight: 1.5,
                  color: "#172B4D",
                  position: "relative",
                }}
              >
                <span
                  ref={placeholderRef}
                  style={{
                    color: "#7A869A",
                    opacity: 0,
                    position: "absolute",
                    left: 22,
                    top: 20,
                    fontSize: 19,
                  }}
                >
                  Type /ai to Ask Rovo or @ to mention and notify someone.
                </span>

                <span style={{ display: "inline-flex", alignItems: "baseline" }}>
                  <span
                    ref={cursorChipRef}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      background: "#F4F5F7",
                      border: "1px solid #DFE1E6",
                      borderRadius: 14,
                      padding: "2px 14px",
                      color: "#172B4D",
                      fontSize: 18,
                      fontWeight: 500,
                      opacity: 0,
                      marginRight: 4,
                    }}
                  >
                    @Cursor
                  </span>
                  <span ref={typedTextRef} style={{ color: "#172B4D" }}></span>
                  <span
                    ref={caretRef}
                    style={{
                      display: "inline-block",
                      width: 2,
                      height: 22,
                      background: "#172B4D",
                      verticalAlign: "middle",
                      marginLeft: 2,
                      opacity: 0,
                    }}
                  />
                </span>
              </div>
            </div>

            <div ref={saveBtnRef} style={{ display: "flex", gap: 10, marginTop: 16, opacity: 0 }}>
              <div
                style={{
                  padding: "9px 20px",
                  background: "#0052CC",
                  color: "#fff",
                  borderRadius: 4,
                  fontSize: 17,
                  fontWeight: 600,
                }}
              >
                Save
              </div>
              <div
                style={{
                  padding: "9px 20px",
                  color: "#42526E",
                  borderRadius: 4,
                  fontSize: 17,
                  fontWeight: 500,
                }}
              >
                Cancel
              </div>
            </div>
          </div>
        </div>

        {/* Collapsed comment input + chips */}
        <div
          ref={editorCollapsedRef}
          style={{
            display: "flex",
            gap: 18,
            alignItems: "flex-start",
            opacity: 0,
            position: "absolute",
            inset: 0,
          }}
        >
          <Avatar />
          <div style={{ flex: 1, minWidth: 0, maxWidth: 1300 }}>
            <div
              style={{
                border: "1px solid #DFE1E6",
                borderRadius: 6,
                background: "#fff",
                padding: "16px 20px 18px",
              }}
            >
              <div style={{ fontSize: 18, color: "#7A869A", minHeight: 30 }}>
                <span ref={collapsedInputRef}>Add a comment...</span>
                <span
                  ref={collapsedCaretRef}
                  style={{
                    display: "inline-block",
                    width: 2,
                    height: 20,
                    background: "#172B4D",
                    verticalAlign: "middle",
                    marginLeft: 2,
                    opacity: 0,
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap", position: "relative" }}>
                {CHIPS.map((label, i) => (
                  <div
                    key={label}
                    ref={(el) => {
                      chipRefs.current[i] = el;
                    }}
                    style={{
                      opacity: 0,
                      padding: "8px 17px",
                      background: "#F4F5F7",
                      border: "1px solid #DFE1E6",
                      borderRadius: 4,
                      fontSize: 17,
                      color: "#42526E",
                      fontWeight: 500,
                      transition: "background 120ms ease, border-color 120ms ease",
                    }}
                  >
                    {label}
                  </div>
                ))}

                {/* v15: macOS pointer that flies in and lands on "Suggest a reply..."
                    (chip i=0) at master 18000ms — synced with the existing chip
                    press/flash animation. Click ripple fires at the same frame. */}
                <div
                  ref={chipCursorRef}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: 38,
                    height: 38,
                    pointerEvents: "none",
                    opacity: 0,
                    willChange: "transform, opacity",
                    zIndex: 5,
                  }}
                >
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 3 L5 19 L9.2 15 L11.6 21 L14 20 L11.6 14 L17 14 Z"
                      fill="#FFFFFF"
                      stroke="#000000"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div
                  ref={chipPulseRef}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: 56,
                    height: 56,
                    borderRadius: 999,
                    border: "2px solid #228DF2",
                    pointerEvents: "none",
                    opacity: 0,
                    willChange: "transform, opacity",
                    zIndex: 4,
                  }}
                />
              </div>
            </div>
            <div style={{ fontSize: 15, color: "#6B778C", marginTop: 14 }}>
              <strong style={{ color: "#42526E" }}>Pro tip:</strong> press{" "}
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 9px",
                  background: "#F4F5F7",
                  border: "1px solid #DFE1E6",
                  borderRadius: 3,
                  fontWeight: 600,
                  color: "#42526E",
                }}
              >
                M
              </span>{" "}
              to comment
            </div>

            {/* Posted comments thread */}
            <div ref={postedCommentRef} style={{ opacity: 0, marginTop: 30 }}>
              <div
                ref={userCommentRef}
                style={{
                  opacity: 0,
                  display: "flex",
                  gap: 18,
                  alignItems: "flex-start",
                }}
              >
                <Avatar />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                    <span style={{ fontSize: 18, fontWeight: 600, color: "#172B4D" }}>
                      Nathan Thomas
                    </span>
                    <span style={{ fontSize: 15, color: "#6B778C" }}>just now</span>
                  </div>
                  <div style={{ fontSize: 18, color: "#172B4D", lineHeight: 1.5 }}>
                    {CHOSEN_REPLY}
                  </div>
                </div>
              </div>

              {/* Cursor's reply (PR write-up) with light sweep */}
              <div
                ref={cursorReplyRef}
                style={{
                  opacity: 0,
                  display: "flex",
                  gap: 18,
                  alignItems: "flex-start",
                  marginTop: 24,
                  position: "relative",
                }}
              >
                {/* Glowing light sweep overlay */}
                <div
                  ref={replySweepRef}
                  className="glow-sweep"
                  style={{
                    position: "absolute",
                    inset: -10,
                    pointerEvents: "none",
                    borderRadius: 10,
                  }}
                />
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 6,
                    background: "#0B0B0B",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <IconCursorCube size={26} color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                    <span style={{ fontSize: 18, fontWeight: 600, color: "#172B4D" }}>Cursor</span>
                    <span style={{ fontSize: 15, color: "#6B778C" }}>just now</span>
                    <span
                      style={{
                        padding: "2px 9px",
                        borderRadius: 3,
                        background: "#EAE6FF",
                        color: "#5243AA",
                        fontSize: 14,
                        fontWeight: 700,
                        letterSpacing: "0.03em",
                      }}
                    >
                      AGENT
                    </span>
                  </div>
                  <div style={{ fontSize: 18, color: "#172B4D", lineHeight: 1.5, maxWidth: 1080 }}>
                    Created the PR — added a{" "}
                    <code
                      style={{
                        background: "#F4F5F7",
                        border: "1px solid #DFE1E6",
                        borderRadius: 3,
                        padding: "2px 7px",
                        fontSize: 16,
                        fontFamily: "ui-monospace, Menlo, monospace",
                        color: "#172B4D",
                      }}
                    >
                      &lt;Note&gt;
                    </code>{" "}
                    callout to the Jira integration docs announcing that the feature is generally
                    available.
                  </div>
                  <div style={{ display: "flex", gap: 18, marginTop: 12, fontSize: 16, fontWeight: 500 }}>
                    <span style={{ color: "#0052CC" }}>Open in Web</span>
                    <span style={{ color: "#0052CC" }}>Open PR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        {/* END LEFT column */}
        </div>

        {/* RIGHT: Jira Details sidebar — fills empty space authentically */}
        <div
          ref={detailsPanelRef}
          style={{
            width: 470,
            flexShrink: 0,
            opacity: 0,
            fontFamily: "Inter, sans-serif",
            paddingTop: 10,
          }}
        >
          <div
            style={{
              border: "1px solid #DFE1E6",
              borderRadius: 8,
              background: "#FFFFFF",
              padding: "20px 24px 22px",
              boxShadow: "0 1px 0 rgba(9,30,66,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, color: "#172B4D", letterSpacing: "0.01em" }}>
                Details
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="#42526E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <DetailRow label="Assignee">
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: "linear-gradient(135deg, #2684FF, #0052CC)",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  marginRight: 10,
                }}
              >
                NT
              </span>
              <span style={{ color: "#172B4D", fontSize: 17 }}>Nathan Thomas</span>
            </DetailRow>

            <DetailRow label="Reporter">
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: "linear-gradient(135deg, #FF7A45, #E64980)",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  marginRight: 10,
                }}
              >
                JC
              </span>
              <span style={{ color: "#172B4D", fontSize: 17 }}>Jeremy Caplan</span>
            </DetailRow>

            <DetailRow label="Sprint">
              <span style={{ color: "#0052CC", fontSize: 17, fontWeight: 500 }}>Docs sprint 14</span>
            </DetailRow>

            <DetailRow label="Story points">
              <span style={{ color: "#172B4D", fontSize: 17 }}>3</span>
            </DetailRow>

            <DetailRow label="Labels">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Pill bg="#DEEBFF" color="#0747A6">docs</Pill>
                <Pill bg="#E3FCEF" color="#006644">integration</Pill>
                <Pill bg="#FFF0B3" color="#974F0C">cursor</Pill>
              </div>
            </DetailRow>

            <DetailRow label="Due date" last>
              <span style={{ color: "#172B4D", fontSize: 17 }}>May 24, 2026</span>
            </DetailRow>
          </div>

          {/* Watchers card */}
          <div
            style={{
              border: "1px solid #DFE1E6",
              borderRadius: 8,
              background: "#FFFFFF",
              padding: "18px 24px 20px",
              marginTop: 18,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: "#172B4D", marginBottom: 14 }}>
              Watchers
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {[
                { c: "linear-gradient(135deg, #2684FF, #0052CC)", t: "NT" },
                { c: "linear-gradient(135deg, #FF7A45, #E64980)", t: "JC" },
                { c: "linear-gradient(135deg, #36B37E, #006644)", t: "PT" },
                { c: "linear-gradient(135deg, #6554C0, #5243AA)", t: "HM" },
              ].map((w, i) => (
                <span
                  key={i}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    background: w.c,
                    color: "#fff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    border: "2px solid #fff",
                    marginLeft: i === 0 ? 0 : -10,
                    boxShadow: "0 0 0 1px #DFE1E6",
                  }}
                >
                  {w.t}
                </span>
              ))}
              <span style={{ marginLeft: 14, fontSize: 16, color: "#6B778C" }}>
                +2 others
              </span>
            </div>
          </div>

          {/* Automation feed */}
          <div
            style={{
              border: "1px solid #DFE1E6",
              borderRadius: 8,
              background: "#FFFFFF",
              padding: "18px 24px 20px",
              marginTop: 18,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: "#172B4D", marginBottom: 12 }}>
              Automation
            </div>
            <div style={{ fontSize: 16, color: "#6B778C", lineHeight: 1.65 }}>
              <div>Created from MSD epic</div>
              <div>2 rules listening</div>
              <div style={{ color: "#42526E", marginTop: 8 }}>Last update <span style={{ color: "#172B4D", fontWeight: 500 }}>just now</span></div>
            </div>
          </div>

          <div style={{ fontSize: 14, color: "#6B778C", marginTop: 16, textAlign: "right" }}>
            Created May 18, 2026 · Updated just now
          </div>
        </div>
      </div>

      {/* Toast */}
      <div
        ref={toastRef}
        style={{
          position: "absolute",
          bottom: 44,
          right: 44,
          opacity: 0,
          background: "#172B4D",
          color: "#fff",
          padding: "16px 24px",
          borderRadius: 5,
          fontSize: 18,
          fontWeight: 500,
          fontFamily: "Inter, sans-serif",
          display: "flex",
          alignItems: "center",
          gap: 12,
          boxShadow: "0 12px 32px rgba(9, 30, 66, 0.32)",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#36B37E" />
          <path
            d="M8 12.5l2.5 2.5L16 9.5"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Comment added
      </div>

      {/* CLOSE CAMERA RIG */}
      </div>

      {/* MOTION BLUR overlay — for whip-pan */}
      <div
        ref={motionBlurRef}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 70%, rgba(255,255,255,0) 100%)",
          backdropFilter: "blur(6px)",
        }}
      />

      {/* CODEBASE WIREFRAME INTERLUDE — removed per Jeremy (2026-05-23) */}
    </Timegroup>
  );
};

const DetailRow: React.FC<{ label: string; children: React.ReactNode; last?: boolean }> = ({ label, children, last }) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 16,
      padding: "12px 0",
      borderBottom: last ? "none" : "1px solid #F4F5F7",
    }}
  >
    <div
      style={{
        width: 140,
        fontSize: 14,
        fontWeight: 600,
        color: "#6B778C",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        flexShrink: 0,
        paddingTop: 4,
      }}
    >
      {label}
    </div>
    <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", flexWrap: "wrap" }}>
      {children}
    </div>
  </div>
);

const Pill: React.FC<{ bg: string; color: string; children: React.ReactNode }> = ({ bg, color, children }) => (
  <span
    style={{
      padding: "4px 12px",
      borderRadius: 3,
      background: bg,
      color,
      fontSize: 15,
      fontWeight: 600,
      letterSpacing: "0.02em",
    }}
  >
    {children}
  </span>
);

const Avatar: React.FC = () => (
  <div
    style={{
      width: 42,
      height: 42,
      borderRadius: 999,
      background:
        "radial-gradient(circle at 35% 30%, #C1C7D0 0%, #97A0B0 55%, #5E6C84 100%)",
      flexShrink: 0,
      position: "relative",
      overflow: "hidden",
      boxShadow: "inset 0 -3px 6px rgba(0,0,0,0.12)",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 8,
        transform: "translateX(-50%)",
        width: 17,
        height: 17,
        borderRadius: 999,
        background: "rgba(255,255,255,0.55)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: -10,
        transform: "translateX(-50%)",
        width: 36,
        height: 28,
        borderRadius: "18px 18px 0 0",
        background: "rgba(255,255,255,0.55)",
      }}
    />
  </div>
);
