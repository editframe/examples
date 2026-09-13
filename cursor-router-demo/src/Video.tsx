/**
 * Cursor Router — 21.95s · 1920×1080 · 30 fps.
 *
 * Hard-cut sequence (no overlap). All motion is CSS `@keyframes` in `styles.css`,
 * timed to each scene's local duration. Silent — no `<Audio>`.
 */
import React from "react";
import { Timegroup } from "@editframe/react";
import { Available } from "./scenes/Available";
import { Cost } from "./scenes/Cost";
import { Frontier } from "./scenes/Frontier";
import { Logo } from "./scenes/Logo";
import { Optimize } from "./scenes/Optimize";
import { Router } from "./scenes/Router";
import { Type } from "./scenes/Type";
import "./styles.css";

export const Video = () => (
  <Timegroup
    mode="contain"
    workbench
    className="comp-root w-[1920px] h-[1080px] bg-white relative overflow-hidden"
  >
    <Timegroup mode="sequence" className="absolute inset-0">
      <Frontier />
      <Optimize />
      <Router />
      <Cost />
      <Type />
      <Available />
      <Logo />
    </Timegroup>
  </Timegroup>
);

export default Video;
