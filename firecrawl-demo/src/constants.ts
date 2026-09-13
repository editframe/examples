export const W = 1920, H = 1080, FPS = 24;
export const TOTAL_MS = 20000;
export const OR = "#EC5505";
export const OR1 = "#EE4104";
export const FONT = 'InterV, Inter, "Helvetica Neue", Arial, sans-serif';
export const MONO = '"JetBrains Mono", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';
export const CN = '"Courier New", Courier, monospace';
export const CM = '"Cascadia Mono Light", "Cascadia Mono", "Courier New", monospace';

/* scene durations (ms) and absolute start frames */
export const VECTOR_TYPE_MS = 2875;
export const CHAT_CARD_MS = 3750;
export const DECK_MS = 4208;
export const BURST_CHIPS_MS = 5250;
export const FOLD_WALLS_MS = 3917;

export const VECTOR_TYPE_START = 1;
export const CHAT_CARD_START = 70;
export const DECK_START = 160;
export const BURST_CHIPS_START = 261;
export const FOLD_WALLS_START = 387;

/* grid topology (shared by the Grid component and per-scene frame drivers) */
export const NV = 27, KMIN = -12, NH = 20, JMIN = -9;

/* sparkle / star constants */
export const S4 = { P: 1.262, B: 1.296 };
export const STAR_DS = 3.6;
export const STAR_BLUR = 0;
export const WPAD = 6;
export const SPAD = 30;

/* response lines (shared by ChatCard and Deck scenes) */
export const RESP_LINES = ["That's a known issue with firmware 4.2.1.", "", "It resets the HDMI-CEC handshake on certain LG and", "Samsung panels. On the back of the soundbar, hold the", "Bluetooth button and volume-down together for eight", "seconds until the LED ring flashes amber twice.", "That forces a CEC re-pair."];

export const TRI_BG = "linear-gradient(to bottom right, #FFFFFF 49.4%, rgba(255,255,255,0) 50.6%)";
