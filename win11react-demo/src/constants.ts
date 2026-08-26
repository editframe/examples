/**
 * Shared assets + timing for the Win11React intro film.
 * 1920×1080 @ 30fps · 20000ms total · snappy 8-beat showreel.
 */
import wallpaper from "./assets/reference/wallpaper.jpg";
import lockWallpaper from "./assets/reference/lock.jpg";
import bootLogo from "./assets/reference/boot-logo.png";
import recycleBin from "./assets/reference/recycle-bin.png";
import explorer from "./assets/reference/explorer.png";
import store from "./assets/reference/store.png";
import browser from "./assets/reference/browser.png";
import spotify from "./assets/reference/spotify.png";
import search from "./assets/reference/search.png";
import settings from "./assets/reference/settings.png";
import terminal from "./assets/reference/terminal.png";

export const W = 1920;
export const H = 1080;

export const MUSIC = "/win11react-demo/src/assets/win11react-demo-music-bed.mp3";

/** Scene durations (ms). Sum = 20000ms. */
export const SCENES = {
  lock: 2200,
  signIn: 1100,
  desktop: 2300,
  start: 2400,
  montage: 3400,
  darkMode: 3200,
  spec: 2600,
  outro: 2800,
} as const;

export const TOTAL_MS = Object.values(SCENES).reduce((a, b) => a + b, 0);

export const assets = {
  wallpaper,
  lockWallpaper,
  bootLogo,
  recycleBin,
  explorer,
  store,
  browser,
  spotify,
  search,
  settings,
  terminal,
};

/** Taskbar app icons (centered), left → right. */
export const taskbarApps = [search, settings, explorer, browser, store, spotify];

/** Left-rail desktop icons. */
export const desktopIcons = [
  { name: "Recycle Bin", src: recycleBin },
  { name: "File Explorer", src: explorer },
  { name: "Store", src: store },
  { name: "Browser", src: browser },
  { name: "Spotify", src: spotify },
];

/** Start-menu pinned grid (two rows of six, like the real Start). */
export const pinnedApps = [
  { name: "Explorer", src: explorer },
  { name: "Store", src: store },
  { name: "Edge", src: browser },
  { name: "Spotify", src: spotify },
  { name: "Search", src: search },
  { name: "Settings", src: settings },
  { name: "Terminal", src: terminal },
  { name: "Mail", src: browser },
  { name: "Calendar", src: settings },
  { name: "Photos", src: store },
  { name: "Files", src: explorer },
  { name: "Music", src: spotify },
];
