/**
 * Linear for Agents — master timing constants (0–32s).
 * Source: _linear_run/03-BUILD-BRIEF.md (frame-verified).
 * All times in MASTER milliseconds. Single 32000ms Timegroup clock.
 */

export const DURATION_MS = 32000;
export const FPS = 30;

/** Overlay reference frames for pixel-alignment debugging */
export const TRACE_MODE = false;
export const TRACE_OPACITY = 0.35;

// ── PALETTE ──
export const BG = "#111115";
export const TEXT_PRIMARY = "#E4E4E6";
export const TEXT_SECONDARY = "#8A8F98";
export const LINEAR_PURPLE = "#5E6AD2";
export const CODEGEN_PURPLE = "#8A5CF5";
export const STATUS_YELLOW = "#D9A40E";
export const STATUS_GREEN = "#3D9962";
export const CHECKBOX_BLUE = "#4A82F6";
export const DEVIN_BLUE = "#3886E1";
export const CODE_BG = "#1A1A1E";

// ── BEAT 0: Title card intro ──
export const TITLE_INTRO_IN_START = 0;
export const TITLE_INTRO_IN_END = 400;
export const TITLE_INTRO_OUT_START = 1433;
export const TITLE_INTRO_OUT_END = 1767;

// ── BEAT 1: Backlog scene ──
export const BACKLOG_IN = 1767;          // hard cut
export const SCROLL_START = 1933;        // motion blur scroll begins
export const SCROLL_END = 2500;          // scroll settles
export const CHECKBOXES_IN = 2833;       // issues get selected
export const MODAL_IN = 3000;            // "Assign to..." modal appears
export const MODAL_OUT = 4533;           // modal closes
export const CODEGEN_ICONS_IN = 4667;    // Codegen diamond icons appear on rows
export const CURSOR_HOVER_ROW = 7133;    // cursor hovers LIN-1293
export const BACKLOG_TRANSITION = 7367;  // zoom+blur transition starts

// ── BEAT 2: ENG-1293 Codegen Issue ──
export const ISSUE1_IN = 7967;           // zoom transition ends, scene in
export const ACTIVITY1_LINE1 = 8133;     // "Adrien Griveau created..."
export const ACTIVITY1_LINE2 = 8567;     // "Adrien Griveau assigned..."
export const ACTIVITY1_LINE3 = 8967;     // "Codegen moved to In Progress"
export const CODEGEN_MSG1_IN = 9167;     // "Hey! I'm on it."
export const CODEGEN_LINK_IN = 9533;     // "View my work" link
export const CODEGEN_MSG2_IN = 10033;    // second Codegen message
export const REPLY_INPUT_IN = 11767;     // "Leave a reply..."
export const PR_ACTIVITY_IN = 12133;     // PR added activity line
export const STATUS_IN_REVIEW = 12567;   // moved to In Review
export const PR_CARD_IN = 12800;         // PR card appears
export const ISSUE1_FADE_OUT = 15000;    // cross-fade to integrations
export const ISSUE1_FADE_END = 15233;

// ── BEAT 3: Integrations Settings ──
export const INTEGRATIONS_IN = 15233;
export const CURSOR_DEVIN = 16233;       // cursor over Devin Enable
export const CURSOR_CLICK_DEVIN = 16433; // click
export const INTEGRATIONS_OUT = 17400;   // hard cut

// ── BEAT 4: ENG-237 Devin @-mention ──
export const ISSUE2_IN = 17400;
export const ACTIVITY2_LINE1 = 17800;    // "Andreas Eldh created..."
export const COMMENT_BOX_IN = 18133;     // Andreas comment box
export const AT_TYPED = 18533;           // "@" typed
export const DROPDOWN_IN = 18633;        // @mention dropdown
export const DROPDOWN_OUT = 19233;       // dropdown closes
export const COMMENT_FINAL = 19467;      // "@devin can you take a look?" finalized
export const DEVIN_MSG_IN = 19700;       // Devin bubble appears
export const DEVIN_REVEAL_START = 19867; // content reveals top-to-bottom
export const DEVIN_REVEAL_END = 22567;   // full response visible
export const CODE_BLOCK_IN = 21800;      // code block appears
export const TOOLTIP_IN = 23067;         // "Expand (8 lines)" tooltip
export const ISSUE2_FADE_OUT = 23533;    // fade to black
export const ISSUE2_FADE_END = 24033;

// ── BEAT 5: Outro title ticker ──
export const TICKER_IN = 24033;
export const WORD_CODING_IN = 24033;
export const WORD_CODING_OUT = 24600;    // blur transition starts
export const WORD_TRIAGE_IN = 24767;     // "Triage" settles
export const WORD_TRIAGE_OUT = 25300;
export const WORD_PLANNING_IN = 25500;   // "Planning" settles
export const TICKER_OUT = 26000;         // fade out
export const TITLE_OUTRO_IN = 26200;     // "Linear for Agents" full card
export const TITLE_OUTRO_OUT = 27000;
export const TITLE_OUTRO_END = 27167;

// ── BEAT 6: Linear logo outro ──
export const LOGO_IN_START = 28267;
export const LOGO_IN_END = 28900;
export const LOGO_OUT_START = 30867;
export const LOGO_OUT_END = 31533;
