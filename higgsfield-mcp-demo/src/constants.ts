/**
 * Higgsfield MCP demo — 1280×720 · 38.06s
 *
 * Hard-cut sequence (overlap=0). Overlapping beats stay inside one scene
 * so nothing is clipped: S1∩S2 in Opening, S5∩S6∩S7 in Flow.
 * S3→S3b is a hard cut but both live in Prompt.
 *
 *   Opening  0–3.45      3450ms   S1 + S2
 *   Prompt   3.45–8.93   5480ms   S3 + S3b
 *   Flow     8.93–38.06 29130ms   S4–S8 (S7∩S8 stays in one Timegroup)
 *   sum                               38060ms
 *
 * Absolute starts (seconds) reconstruct the original master clock inside
 * each scene's addFrameTask: t = ABS_S + ownCurrentTimeMs/1000.
 */
export const OPENING_MS = 3450;
export const PROMPT_MS = 5480;
export const FLOW_MS = 29130;
export const TOTAL_MS = OPENING_MS + PROMPT_MS + FLOW_MS;

export const OPENING_ABS_S = 0;
export const PROMPT_ABS_S = OPENING_MS / 1000;
export const FLOW_ABS_S = (OPENING_MS + PROMPT_MS) / 1000;

export const PORTRAIT_SRC = "/higgsfield-mcp-demo/src/assets/portrait.jpg";
export const PRODUCT_SRC = "/higgsfield-mcp-demo/src/assets/product.jpg";
export const BAG_SRC = "/higgsfield-mcp-demo/src/assets/chipsfield-bag.png";
export const THUMB_SEQ = "/higgsfield-mcp-demo/src/assets/thumb_seq.mp4";
export const CARD_SEQ = "/higgsfield-mcp-demo/src/assets/card_seq.mp4";
export const VERT_SEQ = "/higgsfield-mcp-demo/src/assets/vert_seq.mp4";
export const MUSIC_SRC = "/higgsfield-mcp-demo/src/assets/higgsfield-mcp-demo-music-bed.mp3";
