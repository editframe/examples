import React from "react";
import { Timegroup } from "@editframe/react";
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

const W = 1920;
const H = 1080;
const iconItems = [
  { name: "Recycle Bin", src: recycleBin },
  { name: "File Explorer", src: explorer },
  { name: "Store", src: store },
  { name: "Browser", src: browser },
  { name: "Spotify", src: spotify },
];

function WinMark({ small = false }: { small?: boolean }) {
  return <span className={`win-mark ${small ? "win-mark-small" : ""}`}><i /><i /><i /><i /></span>;
}

function LockScreen() {
  return <Timegroup mode="fixed" duration="3500ms" className="scene lock-scene" style={{ backgroundImage: `url(${lockWallpaper})` }}>
    <div className="lock-shade" />
    <div className="boot-wrap"><img src={bootLogo} /><span>Win11React</span></div>
    <div className="lock-copy"><strong>12:00 PM</strong><span>Wednesday, August 26</span></div>
    <div className="lock-bottom">⌁ &nbsp; ◫</div>
  </Timegroup>;
}

function Desktop() {
  return <Timegroup mode="fixed" duration="9000ms" className="scene desktop-scene" style={{ backgroundImage: `url(${wallpaper})` }}>
    <div className="desktop-icons">{iconItems.map((item, index) => <div className="desktop-icon" style={{ animationDelay: `${250 + index * 150}ms` }} key={item.name}><img src={item.src} /><span>{item.name}</span></div>)}</div>
    <div className="feature-window">
      <div className="window-title"><img src={terminal} /> Terminal <div className="window-actions"><b>—</b><b>□</b><b>×</b></div></div>
      <div className="terminal-content"><span>Microsoft Windows [Version 10.0.22000.51]</span><br /><br /><b>C:\Users\Blue&gt;</b> <em>explore --on-the-web</em><br /><br /><span className="term-result">A desktop, rebuilt with React.</span><br /><span className="term-result line-two">Every detail. Every interaction.</span><span className="cursor" /></div>
    </div>
    <div className="start-menu">
      <div className="start-search"><img src={search} />Type here to search</div>
      <div className="pinned-head">Pinned <span>All apps ›</span></div>
      <div className="pinned-grid">{[...iconItems.slice(1), { name: "Settings", src: settings }].map((item) => <div key={item.name}><img src={item.src} /><small>{item.name}</small></div>)}</div>
      <div className="recommended"><b>Recommended</b><span>More ›</span><p><strong>Welcome to Win11React</strong><br />A web-based Windows experience</p></div>
      <div className="start-footer"><span>Blue Edge</span><b>⏻</b></div>
    </div>
    <div className="taskbar"><WinMark small /><img src={search} /><img src={settings} /><img src={explorer} /><img src={browser} /><img src={store} /><img src={spotify} /><div className="tray">⌃　⌁　🔊　▣<span>12:01 PM<br />08/26/26</span></div></div>
  </Timegroup>;
}

function Outro() {
  return <Timegroup mode="fixed" duration="5500ms" className="scene outro-scene" style={{ backgroundImage: `url(${wallpaper})` }}>
    <div className="outro-glass" />
    <div className="outro-content"><WinMark /><h1>Windows, reimagined<br />for the web.</h1><p>React · CSS · JavaScript</p><div className="url-chip">win11.blueedge.me</div></div>
    <div className="outro-credit">A community-built UI experiment · Not affiliated with Microsoft</div>
  </Timegroup>;
}

/** 18-second intro: boot / desktop functionality / project card. */
export const Video: React.FC = () => <Timegroup mode="contain" workbench className="relative overflow-hidden win11-video" style={{ width: W, height: H }}><Timegroup mode="sequence" className="absolute inset-0"><LockScreen /><Desktop /><Outro /></Timegroup></Timegroup>;
export default Video;
