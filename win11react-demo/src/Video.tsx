/**
 * Video.tsx — Win11React web-desktop intro (showreel)
 * 1920×1080 @ 30fps · 20000ms · eight snap-cut beats over one music bed.
 *
 * Each scene is its own `mode="fixed"` Timegroup, played by a root
 * `mode="sequence"` group (hard cuts). Every scene animates against its own
 * local clock via plain CSS `@keyframes` + `animation-delay` — no master ms
 * clock, no per-frame JS. Scenes 3–7 all share the same bloom desktop + taskbar
 * geometry, so the hard cuts read as one continuous desktop.
 *
 * Beat plan (cut → transition into next):
 *  Lock       0–2200    boot mark + clock            → swipe-up
 *  SignIn     2200–3300 avatar, click "Sign in"      → click-ripple / zoom
 *  Desktop    3300–5600 icons cascade, taskbar rise  → continuous
 *  Start      5600–8000 Start menu spring-open        → continuous
 *  Montage    8000–11400 Explorer/Edge/Terminal cuts → continuous
 *  DarkMode   11400–14600 personalization → circular light→dark reveal (hero)
 *  Spec       14600–17200 stack chips fly in          → dissolve
 *  Outro      17200–20000 logo + win11.blueedge.me
 */
import React from "react";
import { Timegroup, Audio } from "@editframe/react";
import { W, H, MUSIC, SCENES, TOTAL_MS, assets } from "./constants";
import { WinMark, Cursor, Taskbar, DesktopIcons, StartMenu, AppWindow, Chip, FileGlyph } from "./ui";

const explorerItems: { name: string; kind: "folder" | "file"; ext?: string; color?: string }[] = [
  { name: "src", kind: "folder" },
  { name: "public", kind: "folder" },
  { name: "components", kind: "folder" },
  { name: "assets", kind: "folder" },
  { name: "index.html", kind: "file", ext: "HTML", color: "#e44d26" },
  { name: "styles.scss", kind: "file", ext: "SCSS", color: "#cd6799" },
  { name: "App.jsx", kind: "file", ext: "JSX", color: "#3aa6c9" },
  { name: "README.md", kind: "file", ext: "MD", color: "#4a7fff" },
];

function LockScene() {
  return (
    <Timegroup mode="fixed" duration={`${SCENES.lock}ms` as any} className="scene lock-scene">
      <div className="desk-bg" style={{ backgroundImage: `url(${assets.lockWallpaper})` }} />
      <div className="lock-shade" />
      <div className="boot-wrap"><img src={assets.bootLogo} alt="" /><span>Win11React</span></div>
      <div className="lock-clock"><strong>1:23</strong><span>Wednesday, August 26</span></div>
      <div className="lock-hint">Press any key to unlock</div>
    </Timegroup>
  );
}

function SignInScene() {
  return (
    <Timegroup mode="fixed" duration={`${SCENES.signIn}ms` as any} className="scene signin-scene">
      <div className="desk-bg blurred" style={{ backgroundImage: `url(${assets.wallpaper})` }} />
      <div className="signin-card">
        <div className="avatar">BE<span className="avatar-ripple" /></div>
        <h2>Blue Edge</h2>
        <div className="signin-pill">Sign in<span className="pill-ripple" /></div>
        <div className="signin-dots"><i /><i /><i /></div>
      </div>
      <Cursor className="cursor-signin" />
    </Timegroup>
  );
}

function DesktopScene() {
  return (
    <Timegroup mode="fixed" duration={`${SCENES.desktop}ms` as any} className="scene desktop-scene">
      <div className="desk-bg pop-in" style={{ backgroundImage: `url(${assets.wallpaper})` }} />
      <DesktopIcons />
      <div className="toast"><WinMark size={16} /><div><strong>Welcome back, Blue Edge</strong><span>A desktop, rebuilt with React.</span></div></div>
      <Taskbar theme="light" className="rise" />
      <Cursor className="cursor-desktop" />
    </Timegroup>
  );
}

function StartScene() {
  return (
    <Timegroup mode="fixed" duration={`${SCENES.start}ms` as any} className="scene start-scene">
      <div className="desk-bg" style={{ backgroundImage: `url(${assets.wallpaper})` }} />
      <DesktopIcons className="settled" />
      <StartMenu theme="light" />
      <Taskbar theme="light" />
      <Cursor className="cursor-start" />
    </Timegroup>
  );
}

function MontageScene() {
  return (
    <Timegroup mode="fixed" duration={`${SCENES.montage}ms` as any} className="scene montage-scene">
      <div className="desk-bg push" style={{ backgroundImage: `url(${assets.wallpaper})` }} />
      <AppWindow icon={assets.explorer} title="File Explorer" theme="light" className="win-a">
        <div className="explorer-body">
          <div className="explorer-side"><span className="side-head">Quick access</span><span>⌂ Home</span><span>▤ Gallery</span><span>⬇ Downloads</span><span>▦ Documents</span><span>♪ Music</span></div>
          <div className="explorer-main">
            <div className="explorer-crumb">▤ &nbsp;win11React &nbsp;›&nbsp; <b>project</b></div>
            <div className="explorer-grid">{explorerItems.map((f, i) => (
              <div key={f.name} className="file-tile" style={{ animationDelay: `${240 + i * 40}ms` }}>
                <FileGlyph kind={f.kind} ext={f.ext} color={f.color} />
                <span>{f.name}</span>
              </div>
            ))}</div>
          </div>
        </div>
      </AppWindow>
      <AppWindow icon={assets.browser} title="Edge — win11.blueedge.me" theme="light" className="win-b">
        <div className="browser-body"><div className="browser-bar"><i /><i /><i /><span>win11.blueedge.me</span></div><div className="browser-hero"><WinMark size={26} /><b>Win11 in React</b></div></div>
      </AppWindow>
      <AppWindow icon={assets.terminal} title="Terminal" theme="dark" className="win-c">
        <div className="term-body"><span className="t-dim">PS C:\Users\Blue&gt;</span> <span className="t-cmd">win11react --serve</span><br /><span className="t-ok">✓ compiled with React + SCSS</span><br /><span className="t-ok t2">✓ desktop ready on :3000</span><span className="t-cursor" /></div>
      </AppWindow>
      <Taskbar theme="light" />
      <Cursor className="cursor-montage" />
    </Timegroup>
  );
}

function SettingsPanel({ theme }: { theme: "light" | "dark" }) {
  return (
    <div className={`settings-panel settings-${theme}`}>
      <div className="settings-head"><img src={assets.settings} alt="" /><span>Personalization</span></div>
      <p className="settings-sub">Colors</p>
      <div className="mode-title">Choose your mode</div>
      <div className="mode-toggle">
        <div className={`mode-opt ${theme === "light" ? "sel" : ""}`}><div className="mode-swatch light" /><span>Light</span></div>
        <div className={`mode-opt ${theme === "dark" ? "sel" : ""}`}><div className="mode-swatch dark" /><span>Dark</span></div>
      </div>
      <div className="accent-row"><span>Accent color</span><div className="accent-dots">{["#2f6bff", "#00b7c3", "#8661c5", "#e3008c", "#ff8c00"].map((c) => <i key={c} style={{ background: c }} />)}</div></div>
    </div>
  );
}

function DarkModeScene() {
  return (
    <Timegroup mode="fixed" duration={`${SCENES.darkMode}ms` as any} className="scene dark-scene">
      {/* LIGHT base desktop */}
      <div className="desk-bg" style={{ backgroundImage: `url(${assets.wallpaper})` }} />
      <Taskbar theme="light" />
      <SettingsPanel theme="light" />

      {/* DARK layer, revealed by an expanding circle from the toggle */}
      <div className="dark-reveal">
        <div className="desk-bg dark" style={{ backgroundImage: `url(${assets.wallpaper})` }} />
        <Taskbar theme="dark" />
        <SettingsPanel theme="dark" />
      </div>

      <div className="dark-caption">Dark mode</div>
      <Cursor className="cursor-dark" />
    </Timegroup>
  );
}

function SpecScene() {
  const chips = ["React", "SCSS", "JavaScript", "PWA", "Open Source", "Creative Commons"];
  return (
    <Timegroup mode="fixed" duration={`${SCENES.spec}ms` as any} className="scene spec-scene">
      <div className="desk-bg dark" style={{ backgroundImage: `url(${assets.wallpaper})` }} />
      <div className="spec-inner">
        <h2 className="spec-head">Built on the open web.</h2>
        <div className="spec-chips">{chips.map((c, i) => <Chip key={c} label={c} delay={200 + i * 130} />)}</div>
      </div>
      <Taskbar theme="dark" />
    </Timegroup>
  );
}

function OutroScene() {
  return (
    <Timegroup mode="fixed" duration={`${SCENES.outro}ms` as any} className="scene outro-scene">
      <div className="desk-bg dark" style={{ backgroundImage: `url(${assets.wallpaper})` }} />
      <div className="outro-glass" />
      <div className="outro-content">
        <WinMark size={34} />
        <h1>Windows, reimagined<br />for the web.</h1>
        <p>React · SCSS · JavaScript</p>
        <div className="url-chip">win11.blueedge.me</div>
      </div>
      <div className="outro-credit">A community-built UI experiment · Not affiliated with Microsoft</div>
    </Timegroup>
  );
}

export const Video: React.FC = () => (
  <Timegroup mode="contain" workbench className="relative overflow-hidden win11-video" style={{ width: W, height: H, background: "#05080f" }}>
    <Timegroup mode="sequence" className="absolute inset-0">
      <LockScene />
      <SignInScene />
      <DesktopScene />
      <StartScene />
      <MontageScene />
      <DarkModeScene />
      <SpecScene />
      <OutroScene />
    </Timegroup>
    {/* Explicit duration (rather than `mode="fit"`, unsupported on <Audio>) pins the
        music bed to the composition's total runtime. */}
    <Audio src={MUSIC} volume={1} duration={`${TOTAL_MS}ms`} />
  </Timegroup>
);

export default Video;
