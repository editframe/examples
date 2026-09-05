/**
 * Figma Motion product-launch intro — 1920×1080 · 20s · 12fps stepped.
 *
 * Hard-cut sequence (overlap=0). Scene durations match the original Timegroups
 * and sum to the 20s master:
 *
 *   Intro     0–1.500      1500ms
 *   Morph     1.500–3.417  1917ms
 *   Cards     3.417–4.000   583ms
 *   Editor    4.000–6.833  2833ms
 *   Title     6.833–9.833  3000ms
 *   Purple    9.833–13.916 4083ms
 *   Connector 13.916–18.999 5083ms
 *   Unlocked  18.999–19.499  500ms
 *   Goal      19.499–20.000  501ms
 *   sum                    20000ms
 */
export const INTRO_MS = 1500;
export const MORPH_MS = 1917;
export const CARDS_MS = 583;
export const EDITOR_MS = 2833;
export const TITLE_MS = 3000;
export const PURPLE_MS = 4083;
export const CONNECTOR_MS = 5083;
export const UNLOCKED_MS = 500;
export const GOAL_MS = 501;
export const TOTAL_MS =
  INTRO_MS + MORPH_MS + CARDS_MS + EDITOR_MS + TITLE_MS +
  PURPLE_MS + CONNECTOR_MS + UNLOCKED_MS + GOAL_MS;

export const MUSIC_SRC = "/figma-motion-demo/src/assets/figma-motion-demo-music-bed.mp3";
